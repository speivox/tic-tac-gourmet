#!/usr/bin/env python3
"""Extrai a tabela de preços e consumo da planilha de orçamento.

Lê 'outros/ORÇAMENTO TIC TAC.xlsx' e grava 'api/_tabela.js'.

A saída é um módulo CommonJS dentro de api/, e não um JSON em assets/, porque a
tabela não pode ser servida publicamente: ela permite reconstruir o modelo de
precificação do cliente. Só a serverless function api/estimativa.js a enxerga;
o browser recebe apenas o valor final.

A planilha é a fonte de verdade do motor de cálculo. Duas particularidades
guiam a extração:

1. As faixas de preço são escolhidas comparando UNIDADES (não convidados),
   contra limites que só existem dentro das fórmulas da coluna F da aba
   'ORÇ. BUFFET' — os cabeçalhos "0 a 50", "51 a 100" da aba de preços são
   rótulos que não correspondem ao que a fórmula faz.
2. As células de preço vêm como `=13` (valor final) ou `=20*P8` (custo bruto
   vezes o fator de ajuste da coluna P).

Qualquer fórmula fora dos formatos previstos aborta a execução, para que uma
mudança na planilha do cliente não gere silenciosamente um JSON errado.

Uso: python3 tools/extrair_precos.py
"""

import hashlib
import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

M = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
T = '{%s}' % M
NS = {'m': M}

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = os.path.join(BASE, 'outros', 'ORÇAMENTO TIC TAC.xlsx')
OUT = os.path.join(BASE, 'api', '_tabela.js')

SHEET_ORC = 'xl/worksheets/sheet7.xml'    # ORÇ. BUFFET
SHEET_PRECOS = 'xl/worksheets/sheet3.xml'  # PREÇOS E QUANTIDADES
LINHA_INI, LINHA_FIM = 8, 51

# =(IF(T8<=200,T8*Y8,IF(T8<=400,T8*AC8,T8*AG8))+(F4*K8)+100+80)/4
RE_LINHA = re.compile(
    r'^=\(IF\(T(?P<r1>\d+)<=(?P<lim1>\d+),T\d+\*(?P<col1>[A-Z]+)\d+,'
    r'IF\(T\d+<=(?P<lim2>\d+),T\d+\*(?P<col2>[A-Z]+)\d+,'
    r'T\d+\*(?P<col3>[A-Z]+)\d+\)\)\+\(\$?F\$?4\*K\d+(?P<extra>\+\d+)?\)'
    r'\+(?P<fixo1>\d+)\+(?P<fixo2>\d+)\)/4$'
)
RE_REF_PRECOS = re.compile(r"^='PREÇOS E QUANTIDADES'!(?P<ref>\$?[A-Z]+\$?\d+)$")

# Erros identificados na planilha do cliente, corrigidos aqui de forma explícita.
# A chave é a célula da ORÇ. BUFFET; o valor é a referência correta e a
# justificativa. Toda correção aplicada aparece em 'correcoes' no JSON, para que
# nada seja alterado em silêncio e a lista possa ser levada ao cliente.
CORRECOES = {
    ('Y', 14): ("PREÇOS E QUANTIDADES!C11",
                'Y14 continha o literal 6 em vez de apontar para a tabela. '
                'C11/G11/K11 valem todos 7×1,2 = 8,40, então o literal está defasado.'),
    ('AC', 14): ("PREÇOS E QUANTIDADES!G11",
                 'AC14 continha o literal 6, mesmo caso de Y14.'),
    ('AC', 22): ("PREÇOS E QUANTIDADES!G18",
                 'AC22 apontava para G35, que é o preço do RISOTO (R$40), e não para '
                 'G18, do MILHO NA ESPIGA (9×1,15 = 10,35). Erro de cópia.'),
}


class Erro(Exception):
    pass


def carregar(path):
    z = zipfile.ZipFile(path)
    shared = []
    if 'xl/sharedStrings.xml' in z.namelist():
        raiz = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in raiz.findall('m:si', NS):
            shared.append(''.join(t.text or '' for t in si.iter(T + 't')))
    return z, shared


def ler_aba(z, shared, nome_interno):
    """Devolve {(col, linha): texto} com fórmulas prefixadas por '='."""
    raiz = ET.fromstring(z.read(nome_interno))
    celulas = {}
    for c in raiz.iter(T + 'c'):
        ref = c.get('r') or ''
        m = re.match(r'([A-Z]+)(\d+)$', ref)
        if not m:
            continue
        col, linha = m.group(1), int(m.group(2))
        t = c.get('t')
        f = c.find('m:f', NS)
        v = c.find('m:v', NS)
        isx = c.find('m:is', NS)
        if f is not None and f.text:
            val = '=' + f.text
        elif t == 's' and v is not None and v.text is not None:
            try:
                val = shared[int(v.text)]
            except (ValueError, IndexError):
                val = v.text
        elif t == 'inlineStr' and isx is not None:
            val = ''.join(x.text or '' for x in isx.iter(T + 't'))
        else:
            val = v.text if v is not None and v.text is not None else ''
        val = (val or '').strip()
        if val:
            celulas[(col, linha)] = val
    return celulas


def numero(txt):
    """Converte texto de célula numérica, aceitando '=12' como 12."""
    s = txt.lstrip('=').strip()
    try:
        return float(s)
    except ValueError:
        return None


def resolver_preco(precos, ref):
    """Avalia uma célula de preço: 'N', '=N' ou '=N*P<linha>'."""
    ref = ref.replace('$', '')
    m = re.match(r'([A-Z]+)(\d+)$', ref)
    if not m:
        raise Erro(f'referência de preço ilegível: {ref!r}')
    col, linha = m.group(1), int(m.group(2))
    bruto = precos.get((col, linha))
    if bruto is None:
        raise Erro(f'célula de preço vazia: {ref}')
    if '#REF!' in bruto:
        raise Erro(f'célula de preço com #REF!: {ref}')

    direto = numero(bruto)
    if direto is not None:
        return round(direto, 4), linha

    m2 = re.match(r'^=(?P<base>[\d.]+)\*P(?P<lp>\d+)$', bruto)
    if not m2:
        raise Erro(f'fórmula de preço em formato não previsto em {ref}: {bruto!r}')
    if int(m2.group('lp')) != linha:
        raise Erro(f'ajuste de outra linha em {ref}: {bruto!r}')
    ajuste_txt = precos.get(('P', linha))
    if ajuste_txt is None:
        raise Erro(f'fator de ajuste ausente em P{linha}')
    ajuste = numero(ajuste_txt)
    if ajuste is None:
        raise Erro(f'fator de ajuste ilegível em P{linha}: {ajuste_txt!r}')
    return round(float(m2.group('base')) * ajuste, 4), linha


def nome_limpo(txt):
    primeira = (txt or '').split('\n')[0]
    return primeira.replace('◉', '').strip()


def main():
    if not os.path.exists(XLSX):
        sys.exit(f'Erro: não encontrei {XLSX}')

    z, shared = carregar(XLSX)
    orc = ler_aba(z, shared, SHEET_ORC)
    precos = ler_aba(z, shared, SHEET_PRECOS)

    itens, ignorados, correcoes = [], [], []

    for linha in range(LINHA_INI, LINHA_FIM + 1):
        cod = orc.get(('A', linha), '').strip()
        nome = nome_limpo(orc.get(('C', linha), ''))
        if not cod and not nome:
            continue

        formula = orc.get(('F', linha), '')
        if not formula:
            ignorados.append({'cod': cod, 'nome': nome, 'linha': linha,
                              'motivo': 'sem fórmula de preço na ORÇ. BUFFET '
                                        '(menu combo ou bebida com aba própria)'})
            continue

        m = RE_LINHA.match(formula)
        if not m:
            ignorados.append({'cod': cod, 'nome': nome, 'linha': linha,
                              'motivo': f'fórmula fora do padrão de buffet: {formula}'})
            continue

        if int(m.group('r1')) != linha:
            raise Erro(f'linha {linha}: fórmula referencia T{m.group("r1")}')

        fixos = [int(m.group('fixo1')), int(m.group('fixo2'))]
        extra = int(m.group('extra').lstrip('+')) if m.group('extra') else 0

        try:
            faixas = []
            linha_precos = None
            correcoes_item = []
            for col, limite in ((m.group('col1'), int(m.group('lim1'))),
                                (m.group('col2'), int(m.group('lim2'))),
                                (m.group('col3'), None)):
                correcao = CORRECOES.get((col, linha))
                if correcao:
                    ref_corrigida, motivo = correcao
                    ref = ref_corrigida.split('!', 1)[1]
                    correcoes_item.append({
                        'cod': cod, 'celula': f'{col}{linha}',
                        'original': orc.get((col, linha)),
                        'corrigidoPara': ref_corrigida, 'motivo': motivo,
                    })
                else:
                    ponteiro = orc.get((col, linha))
                    if ponteiro is None:
                        raise Erro(f'coluna de preço {col}{linha} vazia')
                    mr = RE_REF_PRECOS.match(ponteiro)
                    if not mr:
                        raise Erro(f'{col}{linha} não aponta para a aba de preços: '
                                   f'{ponteiro!r}')
                    ref = mr.group('ref')
                preco, lp = resolver_preco(precos, ref)
                if linha_precos is None:
                    linha_precos = lp
                elif lp != linha_precos:
                    raise Erro(f'linha {linha}: faixas apontam para linhas de preço '
                               f'diferentes ({linha_precos} e {lp})')
                faixas.append({'ateUnidades': limite, 'preco': preco})
        except Erro as e:
            ignorados.append({'cod': cod, 'nome': nome, 'linha': linha, 'motivo': str(e)})
            continue

        qtd_adulto = numero(precos.get(('R', linha_precos), '') or '')
        qtd_crianca = numero(precos.get(('S', linha_precos), '') or '')
        if qtd_adulto is None or qtd_crianca is None:
            ignorados.append({'cod': cod, 'nome': nome, 'linha': linha,
                              'motivo': f'consumo por convidado ausente em '
                                        f'R{linha_precos}/S{linha_precos}'})
            continue

        monitores = numero(orc.get(('K', linha), '') or '')
        peso = numero(orc.get(('AL', linha), '') or '')

        correcoes.extend(correcoes_item)
        itens.append({
            'cod': cod,
            'nome': nome,
            'linhaOrcamento': linha,
            'linhaPrecos': linha_precos,
            'qtdAdulto': qtd_adulto,
            'qtdCrianca': qtd_crianca,
            'monitores': int(monitores) if monitores is not None else 1,
            'pesoCarrinho': peso if peso is not None else 0.0,
            'fixos': fixos,
            'extraFixo': extra,
            'faixas': faixas,
        })

    # Constantes, lidas das mesmas células que a planilha usa.
    cache_monitor = numero(precos.get(('B', 3), '') or '')
    taxa_carrinho = numero(precos.get(('B', 4), '') or '')
    hora_extra = numero(orc.get(('G', 5), '') or '')
    desconto_vista = numero(orc.get(('V', 57), '') or '')
    fator_ate4 = numero(orc.get(('R', 4), '') or '')
    fator_acima4 = numero(orc.get(('R', 5), '') or '')

    faltando = [n for n, v in (('cachê monitor B3', cache_monitor),
                               ('hora extra G5', hora_extra),
                               ('desconto à vista V57', desconto_vista),
                               ('fator 2-4 carrinhos R4', fator_ate4),
                               ('fator >4 carrinhos R5', fator_acima4)) if v is None]
    if faltando:
        raise Erro('constantes não encontradas na planilha: ' + ', '.join(faltando))

    with open(XLSX, 'rb') as fh:
        digest = hashlib.sha256(fh.read()).hexdigest()

    saida = {
        'fonte': os.path.basename(XLSX),
        'fonteSha256': digest,
        'constantes': {
            'cacheMonitor': cache_monitor,
            'taxaCarrinho': taxa_carrinho,
            'horaExtra': hora_extra,
            'horasBase': 4,
            'descontoVista': desconto_vista,
            'fatorAjuste': {'ate4Carrinhos': fator_ate4, 'acima4Carrinhos': fator_acima4},
            'maxUnidadesPorPessoa': 14,
        },
        'itens': itens,
        'ignorados': ignorados,
        'correcoes': correcoes,
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write('// GERADO POR tools/extrair_precos.py — NÃO EDITE À MÃO.\n')
        fh.write('// Fonte: outros/ORÇAMENTO TIC TAC.xlsx\n')
        fh.write('//\n')
        fh.write('// Fica em api/ de propósito: esta tabela não pode ser servida\n')
        fh.write('// publicamente. Só a serverless function a lê.\n\n')
        fh.write("'use strict';\n\nmodule.exports = ")
        json.dump(saida, fh, ensure_ascii=False, indent=2)
        fh.write(';\n')

    print(f'{len(itens)} itens extraídos, {len(ignorados)} ignorados, '
          f'{len(correcoes)} correções -> {os.path.relpath(OUT, BASE)}')
    for ig in ignorados:
        print(f'  ignorado {ig["cod"] or "?"} (linha {ig["linha"]}): {ig["motivo"]}')
    for cr in correcoes:
        print(f'  corrigido {cr["cod"]} {cr["celula"]} ({cr["original"]!r} -> '
              f'{cr["corrigidoPara"]}): {cr["motivo"]}')


if __name__ == '__main__':
    try:
        main()
    except Erro as e:
        sys.exit(f'Erro: {e}')
