/* ---------- 4. Skincare routine ---------- */
// id, when. Array order = application order. Labels and tips are in the language files.
const STEPS = [
 ['oil','pm'],
 ['cleanser','both'],
 ['exfoliant','pm'],
 ['toner','both'],
 ['essence','both'],
 ['serum','both'],
 ['mask','pm'],
 ['retinoid','pm'],
 ['eye','both'],
 ['moisturizer','both'],
 ['sleep','pm'],
 ['sunscreen','am']
];
const BASIC = ['oil','cleanser','moisturizer','sunscreen'];
const stepName = id => t('skin.step.' + id);
const checkedSteps = () => [...document.querySelectorAll('#sProducts input:checked')].map(i => i.value);
function drawProducts(have){
  $('sProducts').innerHTML = STEPS.map(([id]) => `<label><input type="checkbox" value="${id}" ${have.includes(id) ? 'checked' : ''}>${stepName(id)}</label>`).join('');
}
function routine(time, have){ return STEPS.filter(([id, when]) => have.includes(id) && (when === 'both' || when === time)); }
function renderSkin(){
  const time = $('sTime').value;
  const have = checkedSteps();
  const list = routine(time, have);
  const skipped = STEPS.filter(s => have.includes(s[0]) && !list.includes(s));
  const warn = [];
  if (time === 'pm' && have.includes('exfoliant') && have.includes('retinoid')) warn.push(t('skin.warnMix'));
  if (time === 'am' && !have.includes('sunscreen')) warn.push(t('skin.warnSun'));
  $('skinOut').innerHTML = `<h3>${t(time === 'am' ? 'skin.morning' : 'skin.evening')}</h3>
    ${list.length ? `<ol class="steps">${list.map(([id]) => `<li><b>${stepName(id)}</b><br>${t('skin.tip.' + id)}</li>`).join('')}</ol>` : `<p class="sub">${t('skin.none')}</p>`}
    ${skipped.length ? `<p class="sub">${t('skin.left', {list: skipped.map(s => stepName(s[0])).join(', ')})}</p>` : ''}
    ${warn.map(w => `<div class="note">${w}</div>`).join('')}
    <p><b>${t('skin.typeTip')}</b> ${t('skin.type.' + $('sType').value)}</p>`;
}
drawProducts(BASIC);
['sTime','sType','sProducts'].forEach(id => $(id).addEventListener('change', renderSkin));
$('sBasic').onclick = () => { document.querySelectorAll('#sProducts input').forEach(i => i.checked = BASIC.includes(i.value)); renderSkin(); };
renderSkin();
onLang(() => { drawProducts(checkedSteps()); renderSkin(); });
