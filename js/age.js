/* ---------- 3. Age calculator ---------- */
function ages(birth, on){
  const [by, bm, bd] = birth.split('-').map(Number), [y, m, d] = on.split('-').map(Number);
  const year = y - by;
  const intl = year - (m < bm || (m === bm && d < bd) ? 1 : 0);
  return {intl, year, trad: year + 1, birthYear: by};
}
function renderAge(){
  const b = $('aBirth').value, on = $('aOn').value;
  if (!b || !on){ $('ageOut').innerHTML = '<p class="sub">Choose your birthday to see the result.</p>'; return; }
  if (b > on){ $('ageOut').innerHTML = '<div class="note">The birthday is after the selected date. Please check the dates.</div>'; return; }
  const a = ages(b, on), y = Number(on.slice(0, 4));
  $('ageOut').innerHTML = `<div class="stats">
    <div class="box soft"><div class="big">${a.intl}</div>International age<br><span class="sub">The official standard</span></div>
    <div class="box"><div class="big">${a.year}</div>Year age<br><span class="sub">${y} − ${a.birthYear}</span></div>
    <div class="box"><div class="big">${a.trad}</div>Traditional age<br><span class="sub">The old “Korean age”</span></div></div>
    <p>In ${y}, your birth year ${a.year >= 19 ? '<b>meets</b>' : 'does <b>not</b> meet'} the Youth Protection Act age line for buying alcohol and tobacco.</p>
    <p class="sub">Say it in Korean: <i>“Jeoneun ${String(a.birthYear).slice(2)}-nyeonsaeng-ieyo.”</i> (I was born in ’${String(a.birthYear).slice(2)}.)</p>`;
}
$('aOn').value = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
$('aBirth').addEventListener('input', renderAge);
$('aOn').addEventListener('input', renderAge);
renderAge();

