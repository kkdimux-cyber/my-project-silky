/* ---------- 3. Age calculator ---------- */
function ages(birth, on){
  const [by, bm, bd] = birth.split('-').map(Number), [y, m, d] = on.split('-').map(Number);
  const year = y - by;
  const intl = year - (m < bm || (m === bm && d < bd) ? 1 : 0);
  return {intl, year, trad: year + 1, birthYear: by};
}
function renderAge(){
  const b = $('aBirth').value, on = $('aOn').value;
  if (!b || !on){ $('ageOut').innerHTML = `<p class="sub">${t('age.choose')}</p>`; return; }
  if (b > on){ $('ageOut').innerHTML = `<div class="note">${t('age.after')}</div>`; return; }
  const a = ages(b, on), y = Number(on.slice(0, 4));
  $('ageOut').innerHTML = `<div class="stats">
    <div class="box soft"><div class="big">${a.intl}</div>${t('age.intl')}<br><span class="sub">${t('age.intlSub')}</span></div>
    <div class="box"><div class="big">${a.year}</div>${t('age.year')}<br><span class="sub">${y} − ${a.birthYear}</span></div>
    <div class="box"><div class="big">${a.trad}</div>${t('age.trad')}<br><span class="sub">${t('age.tradSub')}</span></div></div>
    <p>${t(a.year >= 19 ? 'age.meets' : 'age.notMeets', {year: y})}</p>
    <p class="sub">${t('age.say', {yy: String(a.birthYear).slice(2)})}</p>`;
}
$('aOn').value = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
$('aBirth').addEventListener('input', renderAge);
$('aOn').addEventListener('input', renderAge);
renderAge();
onLang(renderAge);
