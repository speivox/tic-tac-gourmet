// WhatsApp com mensagem pronta por botão
const WA_NUMBER = '5531995936536';
const WA_MESSAGES = {
  orcamento: 'Olá! Vim pelo site e quero montar a minha festa. Pode me passar um orçamento?',
  cardapio: 'Olá! Vim pelo site e queria conversar sobre o cardápio dos carrinhos.',
  carrinhos: 'Olá! Vim pelo site e queria saber da disponibilidade dos carrinhos para a minha data.',
  contato: 'Olá! Vim pelo site da Tic Tac Gourmet.',
};

document.querySelectorAll('[data-wa]').forEach((el) => {
  const msg = WA_MESSAGES[el.dataset.wa] || WA_MESSAGES.contato;
  el.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  el.target = '_blank';
  el.rel = 'noopener';
});

const header = document.querySelector('.site-header');
const waFloat = document.querySelector('.wa-float');

// O cabeçalho começa transparente sobre o hero e gruda no topo depois de rolar
const updateVisibility = () => {
  const scrolled = window.scrollY > window.innerHeight * 0.6;
  header.classList.toggle('is-stuck', scrolled || header.classList.contains('menu-open'));
  waFloat.classList.toggle('is-visible', scrolled);
};
updateVisibility();
window.addEventListener('scroll', updateVisibility, { passive: true });

// Menu mobile
const toggle = document.querySelector('.nav-toggle');
toggle.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  updateVisibility();
});
const closeMenu = () => {
  if (!header.classList.contains('menu-open')) return;
  header.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
  updateVisibility();
};
document.querySelectorAll('.main-nav a').forEach((a) => a.addEventListener('click', closeMenu));

// clique fora do cabeçalho fecha o menu
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// "Ver todos os depoimentos"
document.querySelectorAll('[data-more]').forEach((btn) => {
  const target = document.getElementById(btn.dataset.more);
  if (!target) return;
  const visible = Number(btn.dataset.visible || 6);
  btn.addEventListener('click', () => {
    const opening = target.querySelector('.is-hidden') !== null;
    [...target.children].forEach((el, i) => {
      el.classList.toggle('is-hidden', !opening && i >= visible);
    });
    target.classList.toggle('is-expanded', opening);
    btn.textContent = opening ? btn.dataset.labelLess : btn.dataset.labelMore;
    if (!opening) target.scrollIntoView({ block: 'start' });
  });
});

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// FAQ animado
document.querySelectorAll('.faq details').forEach((det) => {
  const summary = det.querySelector('summary');
  const body = det.querySelector('.faq-body');
  summary.addEventListener('click', (e) => {
    e.preventDefault();
    if (det.open) {
      body.style.gridTemplateRows = '0fr';
      body.addEventListener('transitionend', () => { det.removeAttribute('open'); }, { once: true });
    } else {
      det.setAttribute('open', '');
      requestAnimationFrame(() => { body.style.gridTemplateRows = '1fr'; });
    }
  });
});

// ── simulador de orçamento ─────────────────────────────
// O cálculo acontece em /api/estimativa, e não aqui, para que a tabela de
// preços e consumo do cliente não fique publicamente acessível. O motor está em
// api/_motor.js e a tabela é gerada por tools/extrair_precos.py.
(() => {
  const builder = document.getElementById('builder');
  if (!builder) return;

  const convInput    = document.getElementById('b-conv');
  const criancasInput= document.getElementById('b-criancas');
  const duracaoSel   = document.getElementById('b-duracao'); // agora é input numérico
  const priceEl      = document.getElementById('b-price');
  const summaryEl    = document.getElementById('b-summary');
  const cartsEl      = document.getElementById('b-carts');
  const monitorsEl   = document.getElementById('b-monitors');
  const chipsEl      = document.getElementById('b-chips');
  const alertEl      = document.getElementById('b-alert');

  // chips de cardápio — multi-select
  chipsEl.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li || !li.hasAttribute('data-item')) return;
    li.classList.toggle('is-on');
    li.setAttribute('aria-pressed', li.classList.contains('is-on') ? 'true' : 'false');
    agendarCalculo();
  });

  // chips de tipo de evento — single-select
  const tipoEl = document.getElementById('b-tipo');
  tipoEl.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li || !li.hasAttribute('data-tipo')) return;
    tipoEl.querySelectorAll('li[data-tipo]').forEach(l => {
      l.classList.remove('is-on');
      l.setAttribute('aria-pressed', 'false');
    });
    li.classList.add('is-on');
    li.setAttribute('aria-pressed', 'true');
  });

  // inicializar role/tabindex/aria-pressed em todos os chips
  chipsEl.querySelectorAll('li[data-item]').forEach(li => {
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-pressed', li.classList.contains('is-on') ? 'true' : 'false');
  });
  tipoEl.querySelectorAll('li[data-tipo]').forEach(li => {
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-pressed', li.classList.contains('is-on') ? 'true' : 'false');
  });

  // ativar chips pelo teclado
  [chipsEl, tipoEl].forEach(ul => {
    ul.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const li = e.target.closest('li');
      if (!li) return;
      e.preventDefault();
      li.click();
    });
  });

  // contador de caracteres da textarea
  const obsEl    = document.getElementById('b-obs');
  const obsCount = document.getElementById('b-obs-count');
  obsEl.addEventListener('input', () => {
    obsCount.textContent = `${obsEl.value.length} / ${obsEl.maxLength}`;
  });

  // botão "Ver minha estimativa" — revela a barra de resultado
  const resultEl = document.getElementById('b-result');
  const submitBtn = document.getElementById('b-submit');
  submitBtn.addEventListener('click', e => {
    e.preventDefault();
    if (validar()) return;
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (!leadEnviado) { enviarLead('estimativa'); leadEnviado = true; }
    calcular();
  });

  // botão WhatsApp — monta mensagem com os dados do formulário
  const waBtn = document.getElementById('b-wa');
  waBtn.addEventListener('click', e => {
    e.preventDefault();
    const temDadosMinimos = nomeInput?.value.trim()
      && (telInput?.value || '').replace(/\D/g, '').length >= 10;
    if (!leadEnviado && temDadosMinimos) { enviarLead('whatsapp'); leadEnviado = true; }
    const nome    = document.getElementById('b-nome').value.trim();
    const tel     = document.getElementById('b-tel').value.trim();
    const email   = document.getElementById('b-email').value.trim();
    const bairro  = document.getElementById('b-bairro').value.trim();
    const cidade  = document.getElementById('b-cidade').value.trim();
    const data    = document.getElementById('b-data').value;
    const obs     = obsEl.value.trim();
    const tipo    = tipoEl.querySelector('li.is-on')?.textContent ?? '';
    const adults  = convInput.value;
    const kids    = criancasInput.value;
    const hours   = duracaoSel.value;
    const price   = priceEl.textContent;
    const itens   = chipsLigados().map(l => l.textContent.trim()).join(', ');

    const linhas = [
      `Olá! Vim pelo site e quero montar a minha festa. 🎉`,
      nome    ? `*Nome:* ${nome}`        : '',
      tel     ? `*WhatsApp:* ${tel}`     : '',
      email   ? `*E-mail:* ${email}`     : '',
      tipo    ? `*Tipo de evento:* ${tipo}` : '',
      data    ? `*Data prevista:* ${new Date(data + 'T12:00:00').toLocaleDateString('pt-BR')}` : '',
      (bairro || cidade) ? `*Local:* ${[bairro, cidade].filter(Boolean).join(', ')}` : '',
      `*Convidados:* ${adults} adultos, ${kids} crianças`,
      `*Duração:* ${hours} horas`,
      itens   ? `*Cardápio de interesse:* ${itens}` : '',
      price !== '—' ? `*Estimativa no site:* a partir de ${price}` : '',
      obs     ? `*Observações:* ${obs}`  : '',
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(linhas)}`, '_blank', 'noopener');
  });

  // steppers
  builder.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const step  = parseInt(btn.dataset.step);
      const min   = parseInt(input.dataset.min ?? 0);
      const max   = parseInt(input.dataset.max ?? 9999);
      const val   = Math.min(max, Math.max(min, (parseInt(input.value) || 0) + step));
      input.value = val;
      agendarCalculo();
    });
  });

  [convInput, criancasInput, duracaoSel].forEach(el =>
    el.addEventListener('input', agendarCalculo)
  );

  function chipsLigados() {
    return [...chipsEl.querySelectorAll('li[data-item].is-on')];
  }

  function coletar() {
    return {
      adultos:  Math.max(0, parseInt(convInput.value)     || 0),
      criancas: Math.max(0, parseInt(criancasInput.value) || 0),
      horas:    Math.max(2, parseInt(duracaoSel.value)    || 4),
      itens:    chipsLigados().map(li => li.dataset.item),
    };
  }

  // ── validação inline dos campos de contato ────────────────
  const nomeInput  = document.getElementById('b-nome');
  const dataInput  = document.getElementById('b-data');
  const emailInput = document.getElementById('b-email');
  const telInput   = document.getElementById('b-tel');

  if (dataInput) dataInput.min = new Date().toISOString().split('T')[0];

  // Formata o telefone enquanto o usuário digita: (31) 9999-9999 ou (31) 99999-9999
  function formatarTel(digits) {
    const d = digits.slice(0, 11);
    if (d.length <= 2)  return d;
    if (d.length <= 6)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  }
  if (telInput) {
    telInput.addEventListener('input', () => {
      const digits = telInput.value.replace(/\D/g, '');
      const pos    = telInput.selectionStart;
      const antes  = telInput.value.slice(0, pos).replace(/\D/g, '').length;
      telInput.value = formatarTel(digits);
      // Reposicionar cursor pelo número de dígitos antes do cursor
      let cont = 0, nova = telInput.value.length;
      for (let i = 0; i < telInput.value.length; i++) {
        if (/\d/.test(telInput.value[i])) cont++;
        if (cont === antes) { nova = i + 1; break; }
      }
      telInput.setSelectionRange(nova, nova);
    });
  }

  // Cria span de erro inline abaixo de um campo
  function criarErroInline(input, checar) {
    if (!input) return { mostrar: () => false };
    const field = input.closest('.field');
    if (!field) return { mostrar: () => false };
    field.style.position    = 'relative';
    field.style.paddingBottom = '20px';
    const span = document.createElement('span');
    const erroId = (input.id || 'field') + '-erro';
    span.id = erroId;
    span.className = 'field-error';
    span.setAttribute('aria-live', 'polite');
    field.append(span);
    input.setAttribute('aria-describedby', erroId);
    const mostrar = () => {
      const msg = checar();
      span.textContent = msg;
      span.classList.toggle('is-visible', !!msg);
      input.classList.toggle('is-invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !!msg;
    };
    input.addEventListener('blur',  mostrar);
    input.addEventListener('input', () => {
      span.classList.remove('is-visible');
      input.classList.remove('is-invalid');
      input.setAttribute('aria-invalid', 'false');
    });
    return { mostrar };
  }

  const campoNome = criarErroInline(nomeInput, () =>
    !nomeInput.value.trim() ? 'Nome é obrigatório.' : '');

  const campoEmail = criarErroInline(emailInput, () =>
    emailInput.value.trim() && !emailInput.checkValidity() ? 'E-mail inválido.' : '');

  const campoTel = criarErroInline(telInput, () => {
    const d = (telInput.value || '').replace(/\D/g, '');
    if (!d) return 'WhatsApp é obrigatório.';
    return !/^\d{10,11}$/.test(d) ? 'WhatsApp inválido — use (31) 99999-9999.' : '';
  });

  const campoData = criarErroInline(dataInput, () =>
    dataInput?.value && !dataInput.checkValidity() ? 'A data do evento não pode ser no passado.' : '');

  function validar() {
    const e0 = campoNome.mostrar();
    const e1 = campoEmail.mostrar();
    const e2 = campoTel.mostrar();
    const e3 = campoData.mostrar();
    if (e0) nomeInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else if (e1) emailInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else if (e2) telInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else if (e3) dataInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return e0 || e1 || e2 || e3;
  }

  // Último resultado bem-sucedido — usado por enviarLead('whatsapp') para incluir o piso.
  let ultimoResultado = null;
  let leadEnviado = false;

  function enviarLead(origem) {
    const entrada = coletar();
    const dados = {
      origem,
      nome:     document.getElementById('b-nome').value.trim(),
      tel:      document.getElementById('b-tel').value.trim(),
      email:    document.getElementById('b-email').value.trim(),
      tipo:     tipoEl.querySelector('li.is-on')?.textContent?.trim() ?? '',
      data:     document.getElementById('b-data').value,
      bairro:   document.getElementById('b-bairro').value.trim(),
      cidade:   document.getElementById('b-cidade').value.trim(),
      adultos:  entrada.adultos,
      criancas: entrada.criancas,
      horas:    entrada.horas,
      itens:    entrada.itens,
      piso:     ultimoResultado?.piso ?? 0,
      obs:      obsEl.value.trim(),
    };
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    }).catch(() => {});
  }

  // Enquanto o resultado está escondido não há o que recalcular: o preço só
  // aparece depois que a pessoa pede.
  let adiar = null;
  function agendarCalculo() {
    if (resultEl.hidden) return;
    clearTimeout(adiar);
    adiar = setTimeout(calcular, 300);
  }

  // Respostas fora de ordem são descartadas: só a do pedido mais recente vale.
  let pedido = 0;
  async function calcular() {
    const meu = ++pedido;
    const entrada = coletar();
    priceEl.classList.add('is-loading');
    try {
      const resp = await fetch('/api/estimativa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entrada),
      });
      if (!resp.ok) throw new Error(resp.status);
      const r = await resp.json();
      if (meu === pedido) mostrar(entrada, r);
    } catch {
      if (meu !== pedido) return;
      priceEl.textContent = '—';
      alertEl.textContent = 'Não conseguimos calcular a estimativa agora. '
        + 'Chame no WhatsApp que a gente monta o orçamento na hora.';
      alertEl.hidden = false;
    } finally {
      if (meu === pedido) priceEl.classList.remove('is-loading');
    }
  }

  function mostrar(entrada, r) {
    ultimoResultado = r;
    const convidados = entrada.adultos + entrada.criancas;

    priceEl.textContent = r.temEstimativa
      ? 'R$ ' + r.piso.toLocaleString('pt-BR')
      : '—';
    summaryEl.textContent =
      `para ${convidados} convidado${convidados !== 1 ? 's' : ''}, ` +
      `${entrada.horas} hora${entrada.horas !== 1 ? 's' : ''}`;
    cartsEl.textContent    = `${r.carrinhos} carrinho${r.carrinhos !== 1 ? 's' : ''}`;
    monitorsEl.textContent = `${r.monitores} monitor${r.monitores !== 1 ? 'es' : ''}`;

    const avisos = [];
    if (r.semPreco.length) {
      const nomes = chipsLigados()
        .filter(li => r.semPreco.includes(li.dataset.item))
        .map(li => li.textContent.trim());
      const plural = nomes.length > 1;
      avisos.push(`${nomes.join(', ')} ${plural ? 'são orçados' : 'é orçado'} à parte e `
        + `não ${plural ? 'entram' : 'entra'} neste valor.`);
    }
    if (r.horasExtras > 0) {
      avisos.push(`Inclui ${r.horasExtras} hora${r.horasExtras !== 1 ? 's' : ''} extra `
        + 'além das 4 horas padrão.');
    }
    if (r.excedeMaximo) {
      const porPessoa = r.unidadesPorPessoa.toLocaleString('pt-BR', {
        minimumFractionDigits: 1, maximumFractionDigits: 1,
      });
      avisos.push(`A seleção dá ${porPessoa} porções por pessoa, acima das `
        + `${r.maxUnidadesPorPessoa} que indicamos. Dá para enxugar sem faltar comida.`);
    }
    alertEl.textContent = avisos.join(' ');
    alertEl.hidden = avisos.length === 0;
  }
})();

// ── lightbox ───────────────────────────────────────────
(() => {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev  = document.getElementById('lightbox-prev');
  const lbNext  = document.getElementById('lightbox-next');
  if (!lb) return;

  const imgs = [...document.querySelectorAll('.sobre-mosaic .mosaic-item img')];
  let current = 0;
  let lastFocus = null;

  const show = (idx) => {
    current = (idx + imgs.length) % imgs.length;
    lbImg.src = imgs[current].src;
    lbImg.alt = imgs[current].alt;
    lbPrev.hidden = imgs.length <= 1;
    lbNext.hidden = imgs.length <= 1;
  };
  const open = (idx) => {
    lastFocus = document.activeElement;
    show(idx);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  };
  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = '';
    lbImg.src = '';
    lastFocus?.focus();
  };

  imgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => open(i));
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

// O botão do WhatsApp recua quando o rodapé entra na tela, para não cobri-lo.
(() => {
  const footer = document.querySelector('.site-footer');
  if (!footer || !waFloat || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    ([entry]) => waFloat.classList.toggle('is-parked', entry.isIntersecting),
    { rootMargin: '0px 0px -40px 0px' }
  );
  io.observe(footer);
})();
