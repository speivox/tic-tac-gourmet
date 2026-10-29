'use strict';

const https = require('https');

// Apps Script retorna 302 → script.googleusercontent.com antes de executar.
// fetch() com redirect:'manual' retorna status 0 (opaque) no Node.js undici,
// então usamos https.request que expõe o statusCode e o header location reais.
function postarAppsScript(urlStr, dados) {
  const corpo = JSON.stringify(dados);
  const postar = (destino) => new Promise((resolve, reject) => {
    const u = new URL(destino);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(corpo),
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          postar(res.headers.location).then(resolve).catch(reject);
        } else {
          res.resume();
          resolve(res.statusCode);
        }
      }
    );
    req.on('error', reject);
    req.write(corpo);
    req.end();
  });
  return postar(urlStr);
}

// Rate limiting em memória — redefine a cada cold start, mas como o URL do
// Apps Script nunca vai para o browser, a superfície de ataque já é mínima.
// Para hardening maior, substituir pelo Vercel KV.
const _ipMap = new Map();
const JANELA_MS = 5 * 60 * 1000;
const LIMITE_POR_JANELA = 3;

function bloqueado(ip) {
  const agora = Date.now();
  const reg = _ipMap.get(ip) || { n: 0, desde: agora };
  if (agora - reg.desde > JANELA_MS) {
    _ipMap.set(ip, { n: 1, desde: agora });
    return false;
  }
  if (reg.n >= LIMITE_POR_JANELA) return true;
  reg.n++;
  _ipMap.set(ip, reg);
  return false;
}

function str(v, max) { return String(v || '').slice(0, max); }
function nat(v)       { const n = parseInt(v); return Number.isFinite(n) ? Math.max(0, n) : 0; }

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Use POST.' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';

  if (bloqueado(ip)) {
    return res.status(429).json({ erro: 'Muitas requisições. Tente em alguns minutos.' });
  }

  let corpo = req.body;
  if (typeof corpo === 'string') {
    try { corpo = JSON.parse(corpo); } catch { return res.status(400).json({ erro: 'Corpo inválido.' }); }
  }
  if (!corpo || typeof corpo !== 'object') {
    return res.status(400).json({ erro: 'Corpo inválido.' });
  }

  const payload = {
    origem:   ['estimativa', 'whatsapp'].includes(corpo.origem) ? corpo.origem : 'desconhecido',
    nome:     str(corpo.nome,   200),
    tel:      str(corpo.tel,     50),
    email:    str(corpo.email,  200),
    tipo:     str(corpo.tipo,   100),
    data:     str(corpo.data,    20),
    bairro:   str(corpo.bairro, 100),
    cidade:   str(corpo.cidade, 100),
    adultos:  nat(corpo.adultos),
    criancas: nat(corpo.criancas),
    horas:    nat(corpo.horas),
    itens:    Array.isArray(corpo.itens)
      ? corpo.itens.filter((s) => typeof s === 'string').slice(0, 60)
      : [],
    piso:     Math.max(0, Number(corpo.piso) || 0),
    obs:      str(corpo.obs, 1000),
  };

  const url = process.env.APPS_SCRIPT_LEAD_URL;
  if (url) {
    try {
      await postarAppsScript(url, payload);
    } catch {
      // Falha silenciosa — lead capture não deve quebrar o fluxo do usuário.
    }
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true });
};
