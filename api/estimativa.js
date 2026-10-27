// Calcula a estimativa do formulário "Monte a sua festa".
//
// O cálculo roda aqui, e não no browser, para que a tabela de preços e consumo
// do cliente não fique publicamente acessível. A resposta carrega só o que o
// site precisa mostrar — nunca preços unitários nem consumo por convidado.

'use strict';

const { estimar } = require('./_motor.js');
const tabela = require('./_tabela.js');

const MAX_ITENS = 60;

function inteiro(valor, minimo, maximo) {
  const n = Math.floor(Number(valor));
  if (!Number.isFinite(n)) return minimo;
  return Math.min(maximo, Math.max(minimo, n));
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Use POST.' });
  }

  let corpo = req.body;
  if (typeof corpo === 'string') {
    try {
      corpo = JSON.parse(corpo);
    } catch {
      return res.status(400).json({ erro: 'Corpo inválido.' });
    }
  }
  if (!corpo || typeof corpo !== 'object') {
    return res.status(400).json({ erro: 'Corpo inválido.' });
  }

  const itens = Array.isArray(corpo.itens)
    ? corpo.itens.filter((c) => typeof c === 'string').slice(0, MAX_ITENS)
    : [];

  const adultos = inteiro(corpo.adultos, 0, 10000);
  const criancas = inteiro(corpo.criancas, 0, 10000);
  const r = estimar({
    adultos,
    criancas,
    horas: inteiro(corpo.horas, 0, 24),
    itens,
  }, tabela);

  // Sem convidados ou sem itens com preço não há estimativa a dar.
  const temEstimativa = adultos + criancas > 0 && r.linhas.length > 0;

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    piso: temEstimativa ? Math.round(r.piso) : 0,
    temEstimativa,
    carrinhos: Math.ceil(r.carrinhos),
    monitores: r.monitores,
    horasExtras: r.horasExtras,
    excedeMaximo: r.excedeMaximo,
    unidadesPorPessoa: Math.round(r.unidadesPorPessoa * 10) / 10,
    maxUnidadesPorPessoa: tabela.constantes.maxUnidadesPorPessoa,
    semPreco: r.semPreco,
  });
};
