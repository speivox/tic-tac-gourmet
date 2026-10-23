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
