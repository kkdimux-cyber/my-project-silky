/* ---------- Tabs ---------- */
const tabs = [...document.querySelectorAll('[role="tablist"] button')];
function show(id){
  if (!tabs.some(t => t.dataset.tab === id)) id = 'name';
  tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.tab === id));
  document.querySelectorAll('main section').forEach(s => s.hidden = s.id !== id);
  tabs.forEach(t => t.tabIndex = t.dataset.tab === id ? 0 : -1);
  document.body.dataset.tool = id;
}
function pick(t){ history.replaceState(null, '', '#' + t.dataset.tab); show(t.dataset.tab); }
tabs.forEach((t, i) => {
  t.onclick = () => pick(t);
  t.onkeydown = e => {
    const to = {ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1}[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const next = tabs[(to + tabs.length) % tabs.length];
    next.focus(); pick(next);
  };
});
addEventListener('hashchange', () => show(location.hash.slice(1)));
show(location.hash.slice(1));
