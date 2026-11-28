/* ---------- 4. Skincare routine ---------- */
// id, label, when, tip. Array order = application order.
const STEPS = [
 ['oil','Cleansing oil / balm','pm','First half of a double cleanse. Loosens makeup and sunscreen. Rinse well.'],
 ['cleanser','Water-based cleanser','both','Use lukewarm water and don\'t scrub hard.'],
 ['exfoliant','Exfoliant (AHA/BHA)','pm','Not every day at first. Start 1–2 times a week and follow the label.'],
 ['toner','Toner','both','Pat on gently.'],
 ['essence','Essence','both','A light, watery layer.'],
 ['serum','Serum / ampoule','both','Targets a specific concern.'],
 ['mask','Sheet mask','pm','Occasional extra. Follow the time on the package.'],
 ['retinoid','Retinoid / retinol','pm','Evening only. Introduce slowly. Avoid during pregnancy unless a doctor says otherwise.'],
 ['eye','Eye cream','both','Optional. Use a small amount.'],
 ['moisturizer','Moisturizer','both','Seals in the lighter layers.'],
 ['sleep','Sleeping mask','pm','Last evening step, a few nights a week. It can replace a heavy cream.'],
 ['sunscreen','Sunscreen (SPF 30+)','am','Last skincare step, before makeup. Use enough and reapply about every 2 hours outdoors.']
];
const BASIC = ['oil','cleanser','moisturizer','sunscreen'];
const TYPE_TIP = {normal:'Use lighter textures on oily areas and richer ones on dry areas.', dry:'Look for gentle cleansers and richer creams. In the morning, rinsing with water may be enough.', oily:'Lightweight gel textures often feel better. Don\'t skip moisturizer.', sensitive:'Keep it short, favor fragrance-free products, and be careful with exfoliants and retinoids.'};
$('sProducts').innerHTML = STEPS.map(([id, label]) => `<label><input type="checkbox" value="${id}" ${BASIC.includes(id) ? 'checked' : ''}>${label}</label>`).join('');
function routine(time, have){ return STEPS.filter(s => have.includes(s[0]) && (s[2] === 'both' || s[2] === time)); }
function renderSkin(){
  const time = $('sTime').value;
  const have = [...document.querySelectorAll('#sProducts input:checked')].map(i => i.value);
  const list = routine(time, have);
  const skipped = STEPS.filter(s => have.includes(s[0]) && !list.includes(s));
  const warn = [];
  if (time === 'pm' && have.includes('exfoliant') && have.includes('retinoid')) warn.push('Exfoliant and retinoid together can irritate. Use them on <b>different nights</b>.');
  if (time === 'am' && !have.includes('sunscreen')) warn.push('Add sunscreen to your morning routine.');
  $('skinOut').innerHTML = `<h3>${time === 'am' ? 'Morning' : 'Evening'} routine</h3>
    ${list.length ? `<ol class="steps">${list.map(([, label,, tip]) => `<li><b>${label}</b><br>${tip}</li>`).join('')}</ol>` : '<p class="sub">Select at least one product for this time of day.</p>'}
    ${skipped.length ? `<p class="sub">Left out at this time: ${skipped.map(s => s[1]).join(', ')}</p>` : ''}
    ${warn.map(w => `<div class="note">${w}</div>`).join('')}
    <p><b>Skin type tip:</b> ${TYPE_TIP[$('sType').value]}</p>`;
}
['sTime','sType','sProducts'].forEach(id => $(id).addEventListener('change', renderSkin));
$('sBasic').onclick = () => { document.querySelectorAll('#sProducts input').forEach(i => i.checked = BASIC.includes(i.value)); renderSkin(); };
renderSkin();

