/* ---------- Languages ---------- */
// Load after common.js and lang/en.js, before the tool scripts.
const LANGS = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'es', 'fr', 'de', 'pt', 'it', 'ru'];
let lang = 'en', wanted = 'en';
const hooks = [];

// Returns plain trusted text from the language files. Escape user input before passing it in.
function t(key, vars = {}){
  const text = I18N[lang]?.[key] ?? I18N.en[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (m, name) => vars[name] ?? m);
}
// Tools register here to redraw their results after a language change.
function onLang(fn){ hooks.push(fn); }

function matchLang(tag){
  const s = String(tag || '').toLowerCase();
  if (s.startsWith('zh')) return /hant|-tw|-hk|-mo/.test(s) ? 'zh-Hant' : 'zh-Hans';
  return LANGS.find(l => l.toLowerCase() === s.split('-')[0]) || null;
}

function firstLang(){
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch {}
  const asked = new URLSearchParams(location.search).get('lang');
  const browser = (navigator.languages || [navigator.language]).map(matchLang).find(Boolean);
  return matchLang(asked) || matchLang(saved) || browser || 'en';
}

// [data attribute, how to read the English original, how to write]
const TARGETS = [
  ['i18n', el => el.innerHTML, (el, v) => { el.innerHTML = v; }],
  ['i18nPh', el => el.placeholder, (el, v) => { el.placeholder = v; }],
  ['i18nAria', el => el.getAttribute('aria-label'), (el, v) => el.setAttribute('aria-label', v)],
  ['i18nContent', el => el.content, (el, v) => { el.content = v; }]
];
const originals = new WeakMap();

function applyPage(){
  document.documentElement.lang = lang;
  for (const [name, read, write] of TARGETS){
    const attr = 'data-' + name.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
    document.querySelectorAll(`[${attr}]`).forEach(el => {
      const saved = originals.get(el) || {};
      if (!(name in saved)) originals.set(el, Object.assign(saved, {[name]: read(el)}));
      write(el, I18N[lang]?.[el.dataset[name]] ?? saved[name]);
    });
  }
  document.title = t('meta.title');
  // Date fields follow the browser's language, so explain their order when it differs from the page.
  const differs = matchLang(navigator.language) !== lang;
  document.querySelectorAll('.datehint').forEach(el => el.hidden = !differs);
  hooks.forEach(fn => fn());
}

function loadLang(code){
  if (I18N[code]) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `js/lang/${code}.js`;
    s.onload = resolve;
    s.onerror = () => { s.remove(); reject(new Error('Could not load language ' + code)); };
    document.head.appendChild(s);
  });
}

async function setLang(code){
  wanted = code;
  try { await loadLang(code); }
  catch (err) { console.error(err); $('langSel').value = lang; return false; }
  if (wanted !== code) return false; // a newer choice won
  lang = code;
  $('langSel').value = code;
  applyPage();
  return true;
}

// Called by the last script, after every tool has registered its redraw.
function startLang(){
  $('langSel').addEventListener('change', async e => {
    if (!await setLang(e.target.value)) return;
    try { localStorage.setItem('lang', lang); } catch {}
    const url = new URL(location.href);
    if (url.searchParams.has('lang')){ url.searchParams.set('lang', lang); history.replaceState(null, '', url); }
  });
  setLang(firstLang());
}
