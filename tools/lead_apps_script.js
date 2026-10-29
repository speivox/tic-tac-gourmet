// Cole este código no Google Apps Script (script.google.com) vinculado
// à planilha de leads. Publique como "Aplicativo da Web" com:
//   - Executar como: Eu (conta do Google)
//   - Quem tem acesso: Qualquer pessoa
// Copie o URL gerado e adicione como APPS_SCRIPT_LEAD_URL no Vercel.

var ABA_LEADS   = 'Leads';
var EMAIL_ALERTA = Session.getActiveUser().getEmail(); // conta dona do script

var CABECALHO = [
  'Timestamp', 'Origem', 'Nome', 'WhatsApp', 'E-mail',
  'Tipo de evento', 'Data prevista', 'Bairro', 'Cidade',
  'Adultos', 'Crianças', 'Horas', 'Itens', 'Estimativa (R$)', 'Observações',
];

// Para scripts standalone (criados no script.google.com sem planilha vinculada),
// cria a planilha na primeira execução e guarda o ID nas propriedades do script.
function getPlanilha() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('PLANILHA_ID');
  if (id) return SpreadsheetApp.openById(id);
  var ss = SpreadsheetApp.create('Leads — Tic Tac Gourmet');
  props.setProperty('PLANILHA_ID', ss.getId());
  return ss;
}

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);
    var ss  = getPlanilha();
    var aba = ss.getSheetByName(ABA_LEADS) || ss.insertSheet(ABA_LEADS);

    if (aba.getLastRow() === 0) {
      aba.appendRow(CABECALHO);
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
      aba.setFrozenRows(1);
    }

    var itens = Array.isArray(dados.itens) ? dados.itens.join(', ') : '';
    aba.appendRow([
      new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      dados.origem  || '',
      dados.nome    || '',
      dados.tel     || '',
      dados.email   || '',
      dados.tipo    || '',
      dados.data    || '',
      dados.bairro  || '',
      dados.cidade  || '',
      dados.adultos  || 0,
      dados.criancas || 0,
      dados.horas    || 0,
      itens,
      dados.piso     || 0,
      dados.obs      || '',
    ]);

    var assunto = '[Tic Tac Gourmet] Lead: '
      + (dados.nome || 'sem nome')
      + ' — ' + (dados.origem || '?');

    var corpo = [
      'Novo lead recebido pelo site.',
      '',
      'Nome: '      + (dados.nome    || '—'),
      'WhatsApp: '  + (dados.tel     || '—'),
      'E-mail: '    + (dados.email   || '—'),
      'Tipo: '      + (dados.tipo    || '—'),
      'Data: '      + (dados.data    || '—'),
      'Local: '     + [dados.bairro, dados.cidade].filter(Boolean).join(', '),
      'Convidados: '+ (dados.adultos || 0) + ' adultos, ' + (dados.criancas || 0) + ' crianças',
      'Horas: '     + (dados.horas   || 0),
      'Cardápio: '  + (itens || '—'),
      'Estimativa: R$ ' + (dados.piso || 0),
      'Obs: '       + (dados.obs     || '—'),
      '',
      'Origem: '    + (dados.origem  || '—'),
    ].join('\n');

    MailApp.sendEmail({ to: EMAIL_ALERTA, subject: assunto, body: corpo });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, erro: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
