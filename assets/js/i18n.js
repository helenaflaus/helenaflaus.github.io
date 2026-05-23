/* ============================================================
   i18n.js v3 — inglês como idioma padrão
   ============================================================ */

const I18N = (() => {
  const STORAGE_KEY  = 'hf-lang';
  const DEFAULT_LANG = 'en';        // padrão: inglês
  let currentLang  = DEFAULT_LANG;
  let translations = {};

  async function load(lang) {
    try {
      const res = await fetch(`./data/${lang}.json?v=${Date.now()}`);
      if (!res.ok) throw new Error(`${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('[i18n] erro ao carregar:', lang, e.message);
      return null;
    }
  }

  function getKey(obj, path) {
    return path.split('.').reduce((acc, k) => acc?.[k], obj);
  }

  function updateBtn() {
    const btn = document.querySelector('.nav__lang');
    if (btn) btn.textContent = currentLang === 'en' ? 'pt' : 'en';
  }

  function apply(data) {
    if (!data) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = getKey(data, el.getAttribute('data-i18n'));
      if (val !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.innerHTML = val;
        }
      }
    });
    document.documentElement.lang = currentLang;
    updateBtn();
    if (data.meta?.title)       document.title = data.meta.title;
    if (data.meta?.description) {
      const m = document.querySelector('meta[name="description"]');
      if (m) m.content = data.meta.description;
    }
  }

  async function toggle() {
    currentLang = currentLang === 'en' ? 'pt' : 'en';
    localStorage.setItem(STORAGE_KEY, currentLang);
    document.body.style.opacity = '.85';
    const data = await load(currentLang);
    if (data) { translations = data; apply(data); }
    updateBtn();
    setTimeout(() => { document.body.style.opacity = '1'; }, 160);
  }

  async function init() {
    // respeita preferência salva; sem preferência, usa inglês
    currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    const data  = await load(currentLang);
    if (data) { translations = data; apply(data); }
    updateBtn();
    const btn = document.querySelector('.nav__lang');
    if (btn) btn.addEventListener('click', toggle);
  }

  return { init, toggle, getLang: () => currentLang };
})();

export default I18N;
