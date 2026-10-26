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

// ── simulador de orçamento (valores ilustrativos) ──────
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

  // chips de cardápio — multi-select
  chipsEl.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li || !li.hasAttribute('data-item')) return;
    li.classList.toggle('is-on');
    update();
  });

  // chips de tipo de evento — single-select
  const tipoEl = document.getElementById('b-tipo');
  tipoEl.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li || !li.hasAttribute('data-tipo')) return;
    tipoEl.querySelectorAll('li[data-tipo]').forEach(l => l.classList.remove('is-on'));
    li.classList.add('is-on');
  });

  // contador de caracteres da textarea
  const obsEl    = document.getElementById('b-obs');
  const obsCount = document.getElementById('b-obs-count');
  obsEl.addEventListener('input', () => {
    obsCount.textContent = `${obsEl.value.length} / ${obsEl.maxLength}`;
  });

  // botão de envio — monta mensagem de WhatsApp com os dados
  const submitBtn = document.getElementById('b-submit');
  submitBtn.addEventListener('click', e => {
    e.preventDefault();
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
    const price   = document.getElementById('b-price').textContent;
    const itens   = [...chipsEl.querySelectorAll('li[data-item].is-on')].map(l => l.textContent).join(', ');

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
      `*Estimativa no site:* ${price}`,
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
      update();
    });
  });

  [convInput, criancasInput, duracaoSel].forEach(el =>
    el.addEventListener('input', update)
  );

  function update() {
    const adults  = Math.max(0, parseInt(convInput.value)     || 0);
    const kids    = Math.max(0, parseInt(criancasInput.value) || 0);
    const hours   = Math.max(2, parseInt(duracaoSel.value)    || 4);
    const items   = chipsEl.querySelectorAll('li[data-item].is-on').length;
    const total   = adults + kids;

    // fórmula fictícia — apenas ilustrativa
    const rateAdult = 89;
    const rateKid   = 55;
    const durMult   = 1.0 + (hours - 4) * 0.18; // +18% por hora além de 4h, -18% abaixo
    const discount  = items <= 2 ? 0 : items <= 4 ? 0.05 : items <= 6 ? 0.08 : 0.12;
    const raw       = (adults * rateAdult + kids * rateKid) * durMult * (1 - discount);
    const price     = Math.max(3800, Math.round(raw / 100) * 100);

    const carts    = Math.max(1, Math.ceil(adults / 60));
    const monitors = carts + (total >= 50 ? 1 : 0);

    priceEl.textContent   = 'R$ ' + price.toLocaleString('pt-BR');
    summaryEl.textContent = `para ${total} convidado${total !== 1 ? 's' : ''}, ${hours} hora${hours !== 1 ? 's' : ''}`;
    cartsEl.textContent   = `${carts} carrinho${carts !== 1 ? 's' : ''}`;
    monitorsEl.textContent= `${monitors} monitor${monitors !== 1 ? 'es' : ''}`;
  }

  update();
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
