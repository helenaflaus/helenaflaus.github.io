/* ============================================================
   i18n.js — PT/EN toggle
   loads content from /data/{lang}.json and injects into DOM
   persists preference in localStorage
   ============================================================ */

const I18N = (() => {
  const STORAGE_KEY = 'hf-lang';
  const DEFAULT_LANG = 'pt';
  let currentLang = DEFAULT_LANG;
  let translations = {};

  /* ── load JSON for a given lang ── */
  async function load(lang) {
    try {
      const res = await fetch(`/data/${lang}.json?v=${Date.now()}`);
      if (!res.ok) throw new Error(`Failed to load ${lang}.json`);
      return await res.json();
    } catch (e) {
      console.warn('[i18n] Could not load language file:', e.message);
      return null;
    }
  }

  /* ── inject translations into DOM ── */
  function apply(data) {
    if (!data) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedKey(data, key);
      if (value !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = value;
        } else {
          el.innerHTML = value;
        }
      }
    });

    // update html lang attribute
    document.documentElement.lang = currentLang;

    // update toggle button text
    const btn = document.querySelector('.nav__lang');
    if (btn) btn.textContent = currentLang === 'pt' ? 'en' : 'pt';

    // update page title
    if (data.meta?.title) document.title = data.meta.title;
    if (data.meta?.description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = data.meta.description;
    }
  }

  /* ── resolve nested key like "hero.name" ── */
  function getNestedKey(obj, path) {
    return path.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
  }

  /* ── public: init ── */
  async function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    // detect browser language if no saved preference
    const browserLang = navigator.language?.startsWith('en') ? 'en' : 'pt';
    currentLang = saved || browserLang;

    const data = await load(currentLang);
    if (data) {
      translations = data;
      apply(data);
    }

    // wire up toggle button
    const btn = document.querySelector('.nav__lang');
    if (btn) {
      btn.addEventListener('click', toggle);
    }
  }

  /* ── public: toggle ── */
  async function toggle() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    localStorage.setItem(STORAGE_KEY, currentLang);

    const data = await load(currentLang);
    if (data) {
      translations = data;
      apply(data);
      // subtle transition on content swap
      document.body.style.opacity = '.85';
      setTimeout(() => { document.body.style.opacity = '1'; }, 150);
    }
  }

  /* ── public: get current lang ── */
  function getLang() { return currentLang; }

  return { init, toggle, getLang };
})();

export default I18N;
