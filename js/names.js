/* ---------- 1. Korean name generator ---------- */
// [given name, style, romanization, hanja ('' = native Korean word), meaning]
const NAMES = [
 ['서연','f','Seo-yeon','瑞姸','瑞 auspicious + 姸 beautiful'],
 ['서윤','f','Seo-yun','瑞潤','瑞 auspicious + 潤 to enrich, to shine'],
 ['하윤','f','Ha-yun','夏潤','夏 summer + 潤 to enrich, to shine'],
 ['수아','f','Su-a','秀雅','秀 outstanding + 雅 elegant'],
 ['예은','f','Ye-eun','藝恩','藝 art, talent + 恩 grace'],
 ['채원','f','Chae-won','彩媛','彩 colorful + 媛 graceful woman'],
 ['다은','f','Da-eun','多恩','多 abundant + 恩 grace'],
 ['소희','f','So-hui','昭熙','昭 bright + 熙 radiant'],
 ['은지','f','Eun-ji','恩智','恩 grace + 智 wisdom'],
 ['민준','m','Min-jun','敏俊','敏 quick-witted + 俊 talented'],
 ['서준','m','Seo-jun','瑞俊','瑞 auspicious + 俊 talented'],
 ['도윤','m','Do-yun','道潤','道 the way + 潤 to enrich'],
 ['지호','m','Ji-ho','智浩','智 wisdom + 浩 vast'],
 ['준우','m','Jun-u','俊佑','俊 talented + 佑 to help'],
 ['현우','m','Hyeon-u','賢佑','賢 wise + 佑 to help'],
 ['건우','m','Geon-u','建宇','建 to build + 宇 universe'],
 ['우진','m','U-jin','宇眞','宇 universe + 眞 truth'],
 ['태민','m','Tae-min','泰敏','泰 great, peaceful + 敏 quick-witted'],
 ['승현','m','Seung-hyeon','勝賢','勝 victory + 賢 wise'],
 ['지우','u','Ji-u','智宇','智 wisdom + 宇 universe'],
 ['지민','u','Ji-min','智敏','智 wisdom + 敏 quick-witted'],
 ['유진','u','Yu-jin','裕眞','裕 abundance + 眞 truth'],
 ['현서','u','Hyeon-seo','賢瑞','賢 wise + 瑞 auspicious'],
 ['지원','u','Ji-won','志遠','志 aspiration + 遠 far-reaching'],
 ['하늘','u','Ha-neul','','“sky”'],
 ['슬기','u','Seul-gi','','“wisdom”'],
 ['보람','u','Bo-ram','','“a rewarding, worthwhile feeling”'],
 ['아름','f','A-reum','','from <i>areumdapda</i>, “beautiful”'],
 ['나래','f','Na-rae','','“wings”'],
 ['다솜','f','Da-som','','an old word for “love”'],
 ['가람','u','Ga-ram','','an old word for “river”'],
 ['한결','u','Han-gyeol','','“steadfast, always the same”'],
 ['이슬','f','I-seul','','“dew”'],
 ['누리','u','Nu-ri','','an old word for “world”'],
 ['마루','m','Ma-ru','','“ridge, peak”'],
 ['바다','u','Ba-da','','“sea”']
];
const SURNAMES = [['김','Kim','金'],['이','Lee','李'],['박','Park','朴'],['최','Choi','崔'],['정','Jeong','鄭'],['강','Kang','姜'],['조','Cho','趙'],['윤','Yoon','尹'],['장','Jang','張'],['한','Han','韓']];

function hash(s){ let h = 2166136261; for (const ch of s){ h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

function suggest(name, birth, style){
  const seed = name.trim().toLowerCase() + '|' + birth;
  const sound = name ? decompose(toHangul(name.trim().split(/\s+/)[0]).text[0] || ' ') : null;
  const pool = NAMES.filter(n => style === 'any' || n[1] === style)
    .map(n => ({n, same: !!sound && decompose(n[0][0])[0] === sound[0] && sound[0] !== 11, h: hash(seed + n[0])}))
    .sort((a, b) => a.h - b.h);
  // Put one name with the same first sound at the top, if there is one.
  const match = pool.find(p => p.same);
  const picks = (match ? [match, ...pool.filter(p => p !== match)] : pool).slice(0, 3);
  return picks.map((p, i) => ({name: p.n, same: p === match, surname: SURNAMES[(hash(seed) + i * 3) % SURNAMES.length]}));
}

$('nameForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('gName').value.trim(), birth = $('gBirth').value;
  if (!name && !birth){ $('nameOut').innerHTML = '<div class="note">Enter a name or a birthday first.</div>'; return; }
  $('nameOut').innerHTML = suggest(name, birth, $('gStyle').value).map(({name: [g,, rom, hanja, mean], surname: [s, sr, sh], same}) => `
    <article class="namecard">
      <div class="head big" lang="ko">${s}${g}</div>
      <span class="seal" lang="ko" aria-hidden="true">${[...g].join('<br>')}</span>
      <p class="roman">${sr} ${rom}${same ? '<span class="sub"> (starts with a similar sound to your name)</span>' : ''}</p>
      <p>${hanja ? `Hanja: <span lang="ko">${hanja}</span> — ${mean}` : `Native Korean name (no Hanja): ${mean}`}</p>
      <p class="sub">Family name ${sr} (<span lang="ko">${sh}</span>), one of Korea's common surnames. It comes first.</p>
    </article>`).join('');
});

