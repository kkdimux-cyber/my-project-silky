/* ---------- Light / dark mode ---------- */
// The button names the mode you will switch to. Until it is pressed, the page follows the device.
const root = document.documentElement;
const systemDark = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
const currentTheme = () => root.dataset.theme || (systemDark && systemDark.matches ? 'dark' : 'light');
function labelTheme(){
  const mode = currentTheme();
  $('themeBtn').dataset.mode = mode;
  $('themeLabel').textContent = mode === 'dark' ? 'Light mode' : 'Dark mode';
}
$('themeBtn').addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
  labelTheme();
});
if (systemDark) systemDark.addEventListener('change', labelTheme);
new MutationObserver(labelTheme).observe(root, {attributes: true, attributeFilter: ['data-theme']});
labelTheme();

