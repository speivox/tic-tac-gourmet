// Verifica o motor de orçamento contra valores salvos na planilha do cliente.
// Uso: node tools/verificar_motor.js

const path = require('path');

const BASE = path.dirname(__dirname);
const { estimar } = require(path.join(BASE, 'api', '_motor.js'));
const tabela = require(path.join(BASE, 'api', '_tabela.js'));

let falhas = 0;

function checar(rotulo, obtido, esperado, tolerancia = 0.005) {
  const ok = Math.abs(obtido - esperado) <= tolerancia;
  if (!ok) falhas++;
  const num = (v) => (typeof v === 'number' ? v.toFixed(2) : String(v));
  console.log(`${ok ? 'ok  ' : 'FALHA'} ${rotulo}: ${num(obtido)}` +
              (ok ? '' : ` (esperado ${num(esperado)})`));
}

// A planilha foi salva com 70 adultos e 30 crianças, 4 horas.
const CENARIO = { adultos: 70, criancas: 30, horas: 4 };

console.log('# Paridade com a planilha (70 adultos, 30 crianças, 4h)\n');

// ORÇ. BUFFET linha 9: T9 = 270 unidades, H9 = 5130
const ff = estimar({ ...CENARIO, itens: ['FF'] }, tabela);
checar('FF unidades', ff.linhas[0].unidades, 270);
checar('FF total   ', ff.linhas[0].total, 5130);

// ORÇ. BUFFET linha 38: T38 = 440 unidades, H38 = 2054
const mc = estimar({ ...CENARIO, itens: ['MC'] }, tabela);
checar('MC unidades', mc.linhas[0].unidades, 440);
checar('MC total   ', mc.linhas[0].total, 2054);

console.log('\n# Fator de ajuste por número de carrinhos\n');

// Pesos de carrinho: MH 1.5, FF 1.5, HD 1.0, MC 1.0, CG 0.5, PC 0.0
const umCarrinho = estimar({ ...CENARIO, itens: ['HD'] }, tabela);        // 1.0
const doisCarrinhos = estimar({ ...CENARIO, itens: ['MH'] }, tabela);     // 1.5 -> ainda < 2
const tresCarrinhos = estimar({ ...CENARIO, itens: ['MH', 'HD'] }, tabela); // 2.5
const cincoCarrinhos = estimar(
  { ...CENARIO, itens: ['MH', 'FF', 'HD', 'MC', 'CG'] }, tabela);         // 5.5

checar('1.0 carrinho  -> fator', umCarrinho.fator, 1);
checar('1.5 carrinhos -> fator', doisCarrinhos.fator, 1);
checar('2.5 carrinhos -> fator', tresCarrinhos.fator, 0.73);
checar('5.5 carrinhos -> fator', cincoCarrinhos.fator, 0.53);

// Com fator 0.73, o hot dog (2/adulto, 1/criança) sai de 170 para 130 unidades:
// (70*2 + 30*1) * 0.73 = 124.1 -> teto 10 = 130
checar('HD com fator 0.73 -> unidades',
  tresCarrinhos.linhas.find((l) => l.cod === 'HD').unidades, 130);

console.log('\n# Hora extra\n');

const seisHoras = estimar({ ...CENARIO, horas: 6, itens: ['FF'] }, tabela);
checar('6h: horas extras', seisHoras.horasExtras, 2);
checar('6h: total        ', seisHoras.total, 5130 + 2 * 300);
checar('6h: unidades iguais a 4h', seisHoras.linhas[0].unidades, 270);

console.log('\n# Casos de borda\n');

const vazio = estimar({ ...CENARIO, itens: [] }, tabela);
checar('nenhum item -> total', vazio.total, 0);
checar('nenhum item -> piso ', vazio.piso, 0);

const semConvidados = estimar({ adultos: 0, criancas: 0, horas: 4, itens: ['FF'] }, tabela);
checar('0 convidados -> unidades', semConvidados.linhas[0].unidades, 0);
checar('0 convidados -> unidades/pessoa', semConvidados.unidadesPorPessoa, 0);

const soCriancas = estimar({ adultos: 0, criancas: 20, horas: 4, itens: ['FF'] }, tabela);
checar('só crianças -> unidades', soCriancas.linhas[0].unidades, 40); // 20*2 = 40

const bebida = estimar({ ...CENARIO, itens: ['FF', 'CV'] }, tabela);
checar('bebida sem preço não soma', bebida.total, 5130);
checar('bebida registrada em semPreco', bebida.semPreco.length, 1);

console.log('\n# Desconto à vista\n');
checar('piso = total x 0.95', ff.piso, 5130 * 0.95);

console.log('\n# Teto de 14 unidades por pessoa\n');

// Itens de consumo alto com peso de carrinho zero (picolé, sorvete, açaí,
// guloseimas) somam unidades sem empurrar o fator para 0.53.
const muitos = estimar(
  { ...CENARIO, itens: ['PA', 'MC', 'MP', 'PC', 'SV', 'AA', 'GS'] }, tabela);
checar('seleção pesada -> carrinhos', muitos.carrinhos, 3);
checar('seleção pesada -> fator    ', muitos.fator, 0.73);
console.log(`     unidades/pessoa = ${muitos.unidadesPorPessoa.toFixed(2)}`);
if (!muitos.excedeMaximo) {
  console.log('FALHA: esperava exceder o máximo de 14 unidades por pessoa');
  falhas++;
} else {
  console.log('ok   excedeMaximo acusado');
}

const moderado = estimar({ ...CENARIO, itens: ['FF'] }, tabela);
if (moderado.excedeMaximo) {
  console.log('FALHA: seleção de um item não deveria exceder o máximo');
  falhas++;
} else {
  console.log('ok   seleção de um item não acusa excesso');
}

console.log(`\n${falhas === 0 ? 'Todas as verificações passaram.' : falhas + ' falha(s).'}`);
process.exit(falhas === 0 ? 0 : 1);
