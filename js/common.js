const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Korean-language browsers label empty date fields in Korean, so add the English meaning underneath.
if ((navigator.language || '').startsWith('ko')) document.querySelectorAll('.datehint').forEach(el => el.hidden = false);

