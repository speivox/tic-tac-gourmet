// Motor de cálculo do orçamento, fiel à planilha "ORÇAMENTO TIC TAC.xlsx".
//
// Roda apenas no servidor: a tabela de preços e consumo não vai para o browser,
// para não publicar o modelo de precificação do cliente. O endpoint que o site
// consome é api/estimativa.js.
//
// Verificado contra dois valores salvos na planilha:
//   Fast Food,     270 unidades, 2 monitores -> R$ 5.130  (ORÇ. BUFFET!H9)
//   Mini churros,  440 unidades, 1 monitor   -> R$ 2.054  (ORÇ. BUFFET!H38)

'use strict';

function tetoMultiplo(valor, passo) {
  return Math.ceil(valor / passo) * passo;
}

// As faixas são escolhidas pelo número de UNIDADES, não de convidados — é o que
// as fórmulas da planilha fazem, apesar dos cabeçalhos da tabela de preços
// falarem em faixas de convidados.
function precoDaFaixa(item, unidades) {
  for (const faixa of item.faixas) {
    if (faixa.ateUnidades === null || unidades <= faixa.ateUnidades) return faixa.preco;
  }
  return item.faixas[item.faixas.length - 1].preco;
}

// Mais carrinhos no evento significa menos consumo de cada opção.
function fatorAjuste(carrinhos, fatores) {
  if (carrinhos < 2) return 1;
  if (carrinhos <= 4) return fatores.ate4Carrinhos;
  return fatores.acima4Carrinhos;
}

function somar(lista) {
  return lista.reduce((s, v) => s + v, 0);
}

function estimar(entrada, tabela) {
  const adultos = Math.max(0, entrada.adultos || 0);
  const criancas = Math.max(0, entrada.criancas || 0);
  const horas = Math.max(0, entrada.horas || 0);
  const k = tabela.constantes;

  const selecionados = [];
  const semPreco = [];
  (entrada.itens || []).forEach((cod) => {
    const item = tabela.itens.find((i) => i.cod === cod);
    if (item) selecionados.push(item);
    else if (!semPreco.includes(cod)) semPreco.push(cod);
  });

  const carrinhos = somar(selecionados.map((i) => i.pesoCarrinho));
  const monitores = somar(selecionados.map((i) => i.monitores));
  const fator = fatorAjuste(carrinhos, k.fatorAjuste);

  const linhas = selecionados.map((item) => {
    const ideais = adultos * item.qtdAdulto + criancas * item.qtdCrianca;
    const unidades = tetoMultiplo(ideais * fator, 10);
    const precoUnit = precoDaFaixa(item, unidades);
    return {
      cod: item.cod,
      nome: item.nome,
      unidades,
      precoUnit,
      total: unidades * precoUnit
        + k.cacheMonitor * item.monitores
        + somar(item.fixos)
        + (item.extraFixo || 0),
    };
  });

  const subtotal = somar(linhas.map((l) => l.total));
  const horasExtras = Math.max(0, horas - k.horasBase);
  // Sem nada para servir não há evento, então a hora extra também não se cobra.
  const total = subtotal > 0 ? subtotal + k.horaExtra * horasExtras : 0;
  const unidades = somar(linhas.map((l) => l.unidades));
  const convidados = adultos + criancas;
  const porPessoa = convidados > 0 ? unidades / convidados : 0;

  return {
    // Piso da estimativa: preço sem nota com o desconto à vista aplicado.
    piso: total * (1 - k.descontoVista),
    total,
    subtotal,
    linhas,
    carrinhos,
    monitores,
    unidades,
    horasExtras,
    fator,
    unidadesPorPessoa: porPessoa,
    excedeMaximo: convidados > 0 && porPessoa > k.maxUnidadesPorPessoa,
    // Itens selecionados que não têm preço na tabela (bebidas, combos).
    semPreco,
  };
}

module.exports = { estimar, precoDaFaixa, fatorAjuste };
