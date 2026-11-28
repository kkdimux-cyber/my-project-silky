/* ---------- Hangul helpers ---------- */
const CHO = [...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const JUNG = [...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'];
const JONG = ['', ...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];
const CHO_R = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG_R = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONG_R = {'':'','ㄱ':'k','ㄴ':'n','ㄷ':'t','ㄹ':'l','ㅁ':'m','ㅂ':'p','ㅅ':'t','ㅇ':'ng'};
const compose = (c, v, j = '') => String.fromCharCode(0xAC00 + (CHO.indexOf(c) * 21 + JUNG.indexOf(v)) * 28 + JONG.indexOf(j));
function decompose(ch){
  const n = ch.charCodeAt(0) - 0xAC00;
  if (n < 0 || n > 11171) return null;
  return [Math.floor(n / 588), Math.floor(n % 588 / 28), n % 28];
}

/* ---------- 2. English name → Hangul ---------- */
const KNOWN = Object.fromEntries(`aaron:에런 adam:애덤 alex:알렉스 alexander:알렉산더 alice:앨리스 amanda:어맨다 amber:앰버 amelia:어밀리아 amy:에이미 andrea:앤드리아 andrew:앤드루 angela:앤절라 anna:애나 anthony:앤서니 ashley:애슐리 ava:에이바 barbara:바버라 benjamin:벤저민 brian:브라이언 brandon:브랜던 carlos:카를로스 caroline:캐럴라인 catherine:캐서린 charles:찰스 charlotte:샬럿 chloe:클로이 chris:크리스 christina:크리스티나 christopher:크리스토퍼 claire:클레어 daniel:대니얼 david:데이비드 diana:다이애나 dylan:딜런 edward:에드워드 eleanor:엘리너 elizabeth:엘리자베스 ella:엘라 emily:에밀리 emma:에마 eric:에릭 ethan:이선 eva:에바 evelyn:에벌린 george:조지 grace:그레이스 hannah:해나 harry:해리 helen:헬렌 henry:헨리 isabella:이저벨라 jack:잭 jacob:제이컵 james:제임스 jane:제인 jason:제이슨 jennifer:제니퍼 jessica:제시카 john:존 jonathan:조너선 jordan:조던 jose:호세 joseph:조지프 joshua:조슈아 julia:줄리아 justin:저스틴 karen:캐런 kate:케이트 kevin:케빈 kim:킴 kyle:카일 laura:로라 lauren:로런 leo:리오 liam:리엄 lily:릴리 linda:린다 lisa:리사 lucas:루커스 lucy:루시 luke:루크 maria:마리아 mark:마크 mary:메리 mason:메이슨 matthew:매슈 megan:메건 mia:미아 michael:마이클 michelle:미셸 nathan:네이선 nicholas:니컬러스 nicole:니콜 noah:노아 oliver:올리버 olivia:올리비아 patricia:퍼트리샤 patrick:패트릭 paul:폴 peter:피터 rachel:레이철 rebecca:리베카 richard:리처드 robert:로버트 ryan:라이언 sam:샘 samantha:서맨사 samuel:새뮤얼 sarah:세라 sara:세라 scott:스콧 sean:숀 sofia:소피아 sophia:소피아 sophie:소피 stephanie:스테퍼니 stephen:스티븐 steven:스티븐 susan:수전 taylor:테일러 thomas:토머스 tiffany:티퍼니 timothy:티머시 tom:톰 tyler:타일러 victoria:빅토리아 william:윌리엄 zoe:조이 smith:스미스 johnson:존슨 williams:윌리엄스 brown:브라운 jones:존스 garcia:가르시아 miller:밀러 davis:데이비스 rodriguez:로드리게스 martinez:마르티네스 wilson:윌슨 anderson:앤더슨 lee:리 martin:마틴 white:화이트 thompson:톰프슨 clark:클라크 lewis:루이스 walker:워커 hall:홀 young:영 king:킹 wright:라이트 green:그린 baker:베이커`.split(' ').map(p => p.split(':')));

// Spelling-based approximation for names that are not in the list.
function approximate(word){
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return '';
  w = w.replace(/^kn/, 'n').replace(/^wr/, 'r').replace(/ck/g, 'k').replace(/ph/g, 'f')
       .replace(/qu/g, 'kw').replace(/x/g, 'ks').replace(/([aeiou])gh/g, '$1')
       .replace(/c(?=[eiy])/g, 's').replace(/ch/g, 'C').replace(/c/g, 'k')
       .replace(/sh/g, 'S').replace(/th/g, 's').replace(/q/g, 'k')
       .replace(/([bdfgjkmnprstvz])\1/g, '$1');
  // "magic e": kate, mike, rose
  w = w.replace(/a([bdfgklmnpstvz])e$/, 'A$1').replace(/i([bdfgklmnpstvz])e$/, 'I$1')
       .replace(/o([bdfgklmnpstvz])e$/, 'O$1').replace(/([^aeiouy])e$/, (m, c) => w.length > 3 ? c : m);

  const V = {A:['ㅔ','ㅣ'], I:['ㅏ','ㅣ'], O:['ㅗ'], ee:['ㅣ'], ea:['ㅣ'], oo:['ㅜ'], ai:['ㅔ','ㅣ'], ay:['ㅔ','ㅣ'], ey:['ㅣ'], ie:['ㅣ'], au:['ㅗ'], aw:['ㅗ'], ou:['ㅏ','ㅜ'], oa:['ㅗ'], oi:['ㅗ','ㅣ'], oy:['ㅗ','ㅣ'], a:['ㅏ'], e:['ㅔ'], i:['ㅣ'], o:['ㅗ'], u:['ㅜ'], y:['ㅣ']};
  const toks = [];
  for (let i = 0; i < w.length;){
    const two = w.slice(i, i + 2), c = w[i], next = w[i + 1] || '';
    const isV = x => /[aeiouyAIO]/.test(x);
    // r-coloured vowels when no vowel follows
    if (/^(ar|er|ir|or|ur)$/.test(two) && !/[aeiouyr]/.test(w[i + 2] || '')){
      toks.push({v: {ar:'ㅏ', er:'ㅓ', ir:'ㅓ', or:'ㅗ', ur:'ㅓ'}[two]}); i += 2; continue;
    }
    if ((c === 'y' || c === 'w') && isV(next) && !(c === 'y' && i > 0 && !isV(w[i - 1]) && !next)){ toks.push({g: c}); i++; continue; }
    if (V[two]){ V[two].forEach(v => toks.push({v})); i += 2; continue; }
    if (V[c]){ V[c].forEach(v => toks.push({v})); i++; continue; }
    if (two === 'ng' && !isV(w[i + 2] || '')){ toks.push({c: 'ng'}); i += 2; continue; }
    toks.push({c}); i++;
  }

  const ON = {b:'ㅂ', d:'ㄷ', f:'ㅍ', g:'ㄱ', h:'ㅎ', j:'ㅈ', k:'ㅋ', l:'ㄹ', m:'ㅁ', n:'ㄴ', p:'ㅍ', r:'ㄹ', s:'ㅅ', t:'ㅌ', v:'ㅂ', z:'ㅈ', C:'ㅊ', S:'ㅅ', ng:'ㅇ'};
  const Y = {'ㅏ':'ㅑ','ㅔ':'ㅖ','ㅣ':'ㅣ','ㅗ':'ㅛ','ㅜ':'ㅠ','ㅓ':'ㅕ'};
  const W = {'ㅏ':'ㅘ','ㅔ':'ㅞ','ㅣ':'ㅟ','ㅗ':'ㅝ','ㅜ':'ㅜ','ㅓ':'ㅝ'};
  const out = [];
  const addJong = j => {
    const last = out[out.length - 1];
    if (last && !last.j){ last.j = j; return true; }
    return false;
  };
  let onset = null, glide = null, prevVowel = false;
  for (let i = 0; i < toks.length; i++){
    const t = toks[i], nx = toks[i + 1];
    if (t.g){ glide = t.g; continue; }
    if (t.v){
      let v = t.v;
      if (glide === 'w') v = W[v] || v;
      else if (glide === 'y' || onset === 'S') v = Y[v] || v;
      out.push({c: onset ? ON[onset] || 'ㅇ' : 'ㅇ', v, j: ''});
      onset = glide = null; prevVowel = true; continue;
    }
    const c = t.c, beforeV = nx && (nx.v || nx.g);
    if (c === 'l'){
      if (nx && nx.c === 'l') continue;
      if (beforeV){ if (out.length) addJong('ㄹ'); onset = 'l'; }
      else if (!addJong('ㄹ')) out.push({c:'ㅇ', v:'ㅡ', j:'ㄹ'});
    } else if (beforeV) onset = c;
    else if (c === 'm' || c === 'n' || c === 'ng'){
      const j = {m:'ㅁ', n:'ㄴ', ng:'ㅇ'}[c];
      if (!(prevVowel && addJong(j))) out.push({c: ON[c], v:'ㅡ', j:''});
    }
    else if (c === 'r' || (c === 'h' && prevVowel)) { /* not pronounced here */ }
    else out.push({c: ON[c] || 'ㅇ', v: (c === 'j' || c === 'C' || c === 'S') ? 'ㅣ' : 'ㅡ', j: ''});
    prevVowel = false;
  }
  return out.map(s => compose(s.c, s.v, s.j)).join('');
}

function toHangul(word){
  const key = word.toLowerCase().replace(/[^a-z]/g, '');
  if (Object.hasOwn(KNOWN, key)) return {text: KNOWN[key], exact: true};
  return {text: approximate(key), exact: false};
}

function syllableRows(text){
  return [...text].map(ch => {
    const d = decompose(ch);
    if (!d) return '';
    const [c, v, j] = d, jc = JONG[j];
    const parts = [CHO[c], JUNG[v], jc].filter(Boolean).join(' + ');
    return `<tr><td><b>${ch}</b></td><td>${parts}</td><td>${CHO_R[c]}${JUNG_R[v]}${JONG_R[jc] ?? ''}</td></tr>`;
  }).join('');
}

$('hanForm').addEventListener('submit', e => {
  e.preventDefault();
  const words = $('hName').value.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().split(/[\s\-]+/).filter(w => /[a-z]/i.test(w));
  if (!words.length){ $('hanOut').innerHTML = '<div class="note">Please type your name using English letters.</div>'; return; }
  const res = words.map(toHangul);
  const full = res.map(r => r.text).join(' ');
  const guessed = words.filter((w, i) => !res[i].exact);
  $('hanOut').innerHTML = `
    <div class="box soft"><div class="big" lang="ko">${full}</div><button type="button" id="copyBtn">Copy</button></div>
    ${guessed.length ? `<div class="note"><b>Approximate:</b> “${esc(guessed.join(', '))}” is not in our name list, so we guessed from the spelling. It can be wrong. Try typing it the way it sounds (for example “Shawn” instead of an unusual spelling), and ask a Korean speaker to check before using it for anything important.</div>` : '<p class="sub">Matched a common transcription from our name list. Your own pronunciation may differ.</p>'}
    <h3>Syllable by syllable</h3>
    <div class="scroll"><table><tr><th>Block</th><th>Letters</th><th>Romanization</th></tr>${syllableRows(full)}</table></div>
    <p class="sub">For passports, visas and bank accounts, use the spelling on your official documents.</p>`;
  $('copyBtn').onclick = async ev => {
    const btn = ev.target;
    try { await navigator.clipboard.writeText(full); btn.textContent = 'Copied!'; }
    catch { btn.textContent = 'Select the text to copy'; }
  };
});

