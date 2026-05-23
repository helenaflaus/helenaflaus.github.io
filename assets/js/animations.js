/* ============================================================
   animations.js — scroll reveals + hero bar pattern generator
   no external libraries — IntersectionObserver only
   ============================================================ */

/* ── scroll reveal ──────────────────────────────────────────
   adds .reveal class to elements, then .visible on intersection
   ─────────────────────────────────────────────────────────── */

function initReveal() {
  const elements = document.querySelectorAll(
    '.section__title, .expertise__card, .ia__card, .project__card, ' +
    '.cert__card, .stats__item, .about__text, .about__photo, .hero__content'
  );

  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // stagger siblings within the same parent grid
    const siblings = [...el.parentElement.children];
    const idx = siblings.indexOf(el);
    if (idx > 0 && idx < 5) {
      el.classList.add(`reveal-delay-${idx}`);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ── hero bar pattern generator ─────────────────────────────
   generates a field of horizontal blue bars that fills
   the entire hero section — inspired by data-art barcode
   aesthetics. seeded pseudo-random for consistency across
   page loads.
   ─────────────────────────────────────────────────────────── */

function generateHeroBars() {
  const svgEl = document.getElementById('hero-bars');
  if (!svgEl) return;

  const W = window.innerWidth || 1080;
  const H = svgEl.parentElement.offsetHeight || 420;

  svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svgEl.setAttribute('preserveAspectRatio', 'none');

  // seeded LCG for reproducible pattern
  let seed = 7391;
  function rnd() {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    return seed / 0x7fffffff;
  }

  const BAR_H = 5;
  const GAP   = 3;
  const COLOR  = '#2850E8';
  const rows   = Math.ceil(H / (BAR_H + GAP)) + 2;

  let rects = '';

  for (let r = 0; r < rows; r++) {
    const y = r * (BAR_H + GAP) - 2;

    // how many bar segments per row (1–3)
    const numBars = rnd() < 0.25 ? 1 : rnd() < 0.55 ? 2 : 3;

    if (numBars === 1) {
      const w   = 60 + rnd() * (W * 0.75);
      const x   = rnd() * (W * 0.15);
      const op  = (0.055 + rnd() * 0.07).toFixed(3);
      rects += rect(x, y, w, BAR_H, COLOR, op);

    } else if (numBars === 2) {
      const w1  = 50 + rnd() * (W * 0.45);
      const x1  = rnd() * 80;
      const gap = 8 + rnd() * 60;
      const w2  = 30 + rnd() * (W * 0.38);
      const x2  = x1 + w1 + gap;
      const op1 = (0.06 + rnd() * 0.08).toFixed(3);
      const op2 = (0.04 + rnd() * 0.07).toFixed(3);
      rects += rect(x1, y, w1, BAR_H, COLOR, op1);
      if (x2 + w2 < W + 60) rects += rect(x2, y, w2, BAR_H, COLOR, op2);

    } else {
      const w1  = 40 + rnd() * (W * 0.28);
      const x1  = rnd() * 60;
      const w2  = 40 + rnd() * (W * 0.32);
      const x2  = x1 + w1 + 8 + rnd() * 40;
      const w3  = 25 + rnd() * (W * 0.20);
      const x3  = x2 + w2 + 8 + rnd() * 30;
      const op  = (0.05 + rnd() * 0.065).toFixed(3);
      rects += rect(x1, y, w1, BAR_H, COLOR, op);
      if (x2 + w2 < W + 40) rects += rect(x2, y, w2, BAR_H, COLOR, (parseFloat(op) - .01).toFixed(3));
      if (x3 + w3 < W + 40) rects += rect(x3, y, w3, BAR_H, COLOR, (parseFloat(op) - .02).toFixed(3));
    }

    // dense left cluster — echoing reference image
    if (rnd() < 0.55) {
      const cw  = 15 + rnd() * 120;
      const cop = (0.07 + rnd() * 0.10).toFixed(3);
      rects += rect(0, y, cw, BAR_H, COLOR, cop);
    }
  }

  svgEl.innerHTML = rects;
}

function rect(x, y, w, h, fill, opacity) {
  return `<rect x="${+x.toFixed(1)}" y="${y}" width="${+w.toFixed(1)}" height="${h}" fill="${fill}" opacity="${opacity}"/>`;
}

/* ── nav active link on scroll ─────────────────────────────── */

function initNavHighlight() {
  const sections = document.querySelectorAll('[data-section]');
  const links    = document.querySelectorAll('.nav__link[data-nav]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('data-section');
        links.forEach(l => {
          l.style.color = l.getAttribute('data-nav') === id
            ? 'var(--c-text)'
            : 'var(--c-muted)';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ── mobile menu toggle ──────────────────────────────────── */

function initMobileMenu() {
  const btn    = document.querySelector('.nav__menu-btn');
  const navLinks = document.querySelector('.nav__links');
  if (!btn || !navLinks) return;

  btn.addEventListener('click', () => {
    navLinks.classList.toggle('nav__links--open');
  });
}

/* ── on resize: regenerate bars ──────────────────────────── */
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
