/* ---------- 5. Size converter ---------- */
const shoe = rows => rows.split(' ').map(r => r.split('/'));
const SIZES = {
  wshoe: {label:'Women\'s shoes', cols:['KR (mm)','US Women','EU'],
    rows: shoe('220/5/35 225/5.5/35.5 230/6/36 235/6.5/37 240/7/38 245/7.5/38.5 250/8/39 255/8.5/40 260/9/40.5 265/9.5/41 270/10/42'),
    note:'Approximate. Brands differ, sometimes by a full size. Many Korean shoes come only in 5 mm or 10 mm steps. Measure your foot in mm and check the brand chart.'},
  mshoe: {label:'Men\'s shoes', cols:['KR (mm)','US Men','EU'],
    rows: shoe('240/6/38 245/6.5/39 250/7/40 255/7.5/40.5 260/8/41 265/8.5/42 270/9/42.5 275/9.5/43 280/10/44 285/10.5/44.5 290/11/45 295/11.5/45.5 300/12/46'),
    note:'Approximate. Brands differ, sometimes by a full size. Measure your foot in mm and check the brand chart.'},
  wtop: {label:'Women\'s clothing', cols:['KR','US','EU'],
    rows: shoe('44/0–2/32–34 55/2–4/34–36 66/6–8/36–38 77/8–10/38–40 88/10–12/40–42'),
    note:'Rough ranges only. Conversion charts disagree, and fit varies a lot between brands. Compare bust, waist and hip measurements. “Free size” means one size only, not “fits everyone”.'},
  mtop: {label:'Men\'s tops', cols:['KR','US (chest, in)','EU'],
    rows: shoe('90/35–36/46 95/37–38/48 100/39–40/50 105/41–42/52 110/43–44/54'),
    note:'Rough estimate. The Korean number relates to chest size in cm. US here is chest in inches (cm ÷ 2.54) and EU is about half the chest in cm. Charts and brands disagree, and S/M/L letters don\'t match reliably across countries. Check garment measurements.'}
};
$('zCat').innerHTML = Object.entries(SIZES).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');
function renderSize(){
  const set = SIZES[$('zCat').value], sys = Number($('zSys').value), i = Number($('zVal').value), row = set.rows[i];
  $('sizeOut').innerHTML = `<div class="stats">${set.cols.map((c, n) => `<div class="box ${n === sys ? '' : 'soft'}"><div class="big">${row[n]}</div>${c}</div>`).join('')}</div>`;
  $('sizeTable').innerHTML = `<tr>${set.cols.map(c => `<th>${c}</th>`).join('')}</tr>` + set.rows.map((r, n) => `<tr class="${n === i ? 'hit' : ''}">${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('');
  $('sizeNote').textContent = set.note;
}
function fillValues(keep){
  const set = SIZES[$('zCat').value], sys = Number($('zSys').value);
  $('zVal').innerHTML = set.rows.map((r, i) => `<option value="${i}">${r[sys]}</option>`).join('');
  $('zVal').value = keep ?? Math.floor(set.rows.length / 2);
  renderSize();
}
function fillSystems(){
  $('zSys').innerHTML = SIZES[$('zCat').value].cols.map((c, i) => `<option value="${i}">${c}</option>`).join('');
  fillValues();
}
$('zCat').addEventListener('change', fillSystems);
$('zSys').addEventListener('change', () => fillValues($('zVal').value));
$('zVal').addEventListener('change', renderSize);
fillSystems();

