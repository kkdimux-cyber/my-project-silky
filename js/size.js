/* ---------- 5. Size converter ---------- */
const shoe = rows => rows.split(' ').map(r => r.split('/'));
const SIZES = {
  wshoe: {cols:['krmm','uswomen','eu'],
    rows: shoe('220/5/35 225/5.5/35.5 230/6/36 235/6.5/37 240/7/38 245/7.5/38.5 250/8/39 255/8.5/40 260/9/40.5 265/9.5/41 270/10/42')},
  mshoe: {cols:['krmm','usmen','eu'],
    rows: shoe('240/6/38 245/6.5/39 250/7/40 255/7.5/40.5 260/8/41 265/8.5/42 270/9/42.5 275/9.5/43 280/10/44 285/10.5/44.5 290/11/45 295/11.5/45.5 300/12/46')},
  wtop: {cols:['kr','us','eu'],
    rows: shoe('44/0–2/32–34 55/2–4/34–36 66/6–8/36–38 77/8–10/38–40 88/10–12/40–42')},
  mtop: {cols:['kr','uschest','eu'],
    rows: shoe('90/35–36/46 95/37–38/48 100/39–40/50 105/41–42/52 110/43–44/54')}
};
$('zCat').innerHTML = Object.entries(SIZES).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');
const colName = c => t('size.col.' + c);
function drawCategories(){
  const keep = $('zCat').value;
  $('zCat').innerHTML = Object.keys(SIZES).map(k => `<option value="${k}">${t('size.cat.' + k)}</option>`).join('');
  if (keep) $('zCat').value = keep;
}
drawCategories();
function renderSize(){
  const cat = $('zCat').value, set = SIZES[cat], sys = Number($('zSys').value), i = Number($('zVal').value), row = set.rows[i];
  $('sizeOut').innerHTML = `<div class="stats">${set.cols.map((c, n) => `<div class="box ${n === sys ? '' : 'soft'}"><div class="big">${row[n]}</div>${colName(c)}</div>`).join('')}</div>`;
  $('sizeTable').innerHTML = `<tr>${set.cols.map(c => `<th>${colName(c)}</th>`).join('')}</tr>` + set.rows.map((r, n) => `<tr class="${n === i ? 'hit' : ''}">${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('');
  $('sizeNote').textContent = t('size.note.' + cat);
}
function fillValues(keep){
  const set = SIZES[$('zCat').value], sys = Number($('zSys').value);
  $('zVal').innerHTML = set.rows.map((r, i) => `<option value="${i}">${r[sys]}</option>`).join('');
  $('zVal').value = keep ?? Math.floor(set.rows.length / 2);
  renderSize();
}
function fillSystems(){
  $('zSys').innerHTML = SIZES[$('zCat').value].cols.map((c, i) => `<option value="${i}">${colName(c)}</option>`).join('');
  fillValues();
}
$('zCat').addEventListener('change', fillSystems);
$('zSys').addEventListener('change', () => fillValues($('zVal').value));
$('zVal').addEventListener('change', renderSize);
fillSystems();
onLang(() => {
  const sys = $('zSys').value, val = $('zVal').value;
  drawCategories();
  fillSystems();
  $('zSys').value = sys;
  fillValues(val);
});
