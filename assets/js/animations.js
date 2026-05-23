/* ============================================================
   animations.js v3 — scroll reveals + hero bar pattern
   ref: mockup v7
   ============================================================ */

/* ── scroll reveal ────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll(
    '.section__title, .ia__card, .project__card, .cert__card, ' +
    '.stats__item, .about__text, .about__photo, ' +
    '.hero__content, .hero__expertise, .expertise-item'
  );
  els.forEach(el => {
    el.classList.add('reveal');
    const siblings = [...el.parentElement.children];
    const idx = siblings.indexOf(el);
    if (idx > 0 && idx < 5) el.classList.add(`reveal-delay-${idx}`);
  });
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => ro.observe(el));
}

/* ── hero bar generator ───────────────────────────────────── */
function generateHeroBars() {
  const svg = document.getElementById('hero-bars');
  if (!svg) return;
  const W = window.innerWidth || 1080;
  const H = svg.parentElement.offsetHeight || 420;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'none');

  let seed = 7391;
  function rnd() { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; }
  function r(x, y, w, h, f, o) {
    return `<rect x="${+x.toFixed(1)}" y="${y}" width="${+w.toFixed(1)}" height="${h}" fill="${f}" opacity="${o}"/>`;
  }

  const B = 5, G = 3, C = '#2850E8';
  const rows = Math.ceil(H / (B + G)) + 2;
  let out = '';

  for (let i = 0; i < rows; i++) {
    const y = i * (B + G) - 2;
    const n = rnd() < .25 ? 1 : rnd() < .55 ? 2 : 3;
    if (n === 1) {
      out += r(rnd() * (W * .15), y, 60 + rnd() * (W * .75), B, C, (0.055 + rnd() * .07).toFixed(3));
    } else if (n === 2) {
      const w1 = 50 + rnd() * (W * .45), x1 = rnd() * 80;
      const g  = 8  + rnd() * 60,        w2 = 30 + rnd() * (W * .38), x2 = x1 + w1 + g;
      out += r(x1, y, w1, B, C, (0.06 + rnd() * .08).toFixed(3));
      if (x2 + w2 < W + 60) out += r(x2, y, w2, B, C, (0.04 + rnd() * .07).toFixed(3));
    } else {
      const w1 = 40 + rnd() * (W * .28), x1 = rnd() * 60;
      const w2 = 40 + rnd() * (W * .32), x2 = x1 + w1 + 8 + rnd() * 40;
      const w3 = 25 + rnd() * (W * .20), x3 = x2 + w2 + 8 + rnd() * 30;
      const op = (0.05 + rnd() * .065).toFixed(3);
      out += r(x1, y, w1, B, C, op);
      if (x2 + w2 < W + 40) out += r(x2, y, w2, B, C, (parseFloat(op) - .01).toFixed(3));
      if (x3 + w3 < W + 40) out += r(x3, y, w3, B, C, (parseFloat(op) - .02).toFixed(3));
    }
    // cluster denso à esquerda
    if (rnd() < .55) out += r(0, y, 15 + rnd() * 120, B, C, (0.07 + rnd() * .10).toFixed(3));
  }
  svg.innerHTML = out;
}

/* ── nav highlight ────────────────────────────────────────── */
function initNavHighlight() {
  const sections = document.querySelectorAll('[data-section]');
  const links    = document.querySelectorAll('.nav__link[data-nav]');
  if (!sections.length || !links.length) return;
  sections.forEach(s => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('data-section');
          links.forEach(l => {
            l.style.color = l.getAttribute('data-nav') === id ? 'var(--c-text)' : 'var(--c-muted)';
          });
        }
      });
    }, { threshold: 0.4 }).observe(s);
  });
}

/* ── mobile menu ──────────────────────────────────────────── */
function initMobileMenu() {
  const btn   = document.querySelector('.nav__menu-btn');
  const links = document.querySelector('.nav__links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('nav__links--open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

/* ── resize: regenerate bars ──────────────────────────────── */
let resizeTimer;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(generateHeroBars, 200);
}

/* ── init ─────────────────────────────────────────────────── */
export function init() {
  generateHeroBars();
  initReveal();
  initNavHighlight();
  initMobileMenu();
  window.addEventListener('resize', onResize);
}
