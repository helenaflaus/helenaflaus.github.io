/* ============================================================
   main.js — entry point for helenaflaus.github.io
   ============================================================ */

import I18N from './i18n.js';
import { init as initAnimations } from './animations.js';

/* ── boot ─────────────────────────────────────────────────── */
async function boot() {
  // 1. language — load translations first so content appears correct
  await I18N.init();

  // 2. animations — after DOM is populated with correct language
  initAnimations();

  // 3. smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', boot)
  : boot();
