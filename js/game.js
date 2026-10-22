// Bernabéu Nights: the Real Madrid quiz.
// Ten questions = ten shots at goal across ninety minutes. Solo, you're chasing
// goals and points. Open a friend's challenge link and you get their exact ten
// questions, with their answers playing as the opposition: every question they
// got right is a goal for them. Seeded, so links replay the same questions.

const Game = (() => {
  const STORE = 'bnl_game_v1';
  const NAME_KEY = 'bnl_name';

  const TIERS = {
    cantera: { name: 'Academy', tag: 'Easy', time: 20, blurb: 'Faces, shirt numbers and countries of the current squad. Warm-up level.' },
    galactico: { name: 'Galáctico', tag: 'Medium', time: 18, blurb: 'Legends, big transfers, arrival years and scrambled names.' },
    lisbon: { name: '92:48', tag: 'Hard', time: 15, blurb: 'Named after the minute Ramos equalised in the 2014 final. Seasons, records, names from a few letters.' }
  };

  // Verdicts by goals out of 10
  const VERDICTS = [
    [0, 'Relegated', 'Even VAR could not find a goal in there.'],
    [2, 'Relegation scrap', "Survived on the last day. Nobody's printing the shirts."],
    [4, 'Mid-table', 'Solid. Forgettable. Europa League if results go your way.'],
    [6, 'Top four', 'Champions League football next season. The board is cautiously pleased.'],
    [8, 'Title race', 'Went down to the final day. Respectable, but this is Madrid.'],
    [9, 'League champions', 'Open-top bus. Bring a scarf.'],
    [10, 'Champions of Europe', "Ten from ten. That's the sixteenth. Frame it."]
  ];

  // Meme sticker + caption for the story image, by goals
  const MEMES = [
    [0, 'WE GO AGAIN', 'My quiz went like a 0-0 in February.'],
    [2, 'COOKED', 'Bro thinks Raúl played for Barça.'],
    [4, 'MID', 'Group chat said mid. Group chat was right.'],
    [6, 'CALMA', 'Calm down, calm down. Just a decent night at the Bernabéu.'],
    [8, 'COLD', "Ballon d'Or speech: drafted."],
    [10, 'GOATED', 'Somebody call the Champions League anthem guy.']
  ];

  // Our own lines, written in the spirit of the football internet.
  const REACT = {
    right: [
      'Siuuu.', 'Ancelotti raised one eyebrow. That is the highest honour available.', 'Hala Madrid.',
      'Trivela-level answer. Modrić approves.', 'Clinical. Benzema would have passed it, then scored the rebound.',
      'The whole stadium is on its feet.', 'That one went in off the crossbar and into the history books.',
      'Somewhere, a Barça fan just closed this tab.', 'Galáctico behaviour.', 'You knew that before the commentator did.',
      'That answer has Champions League DNA.', 'Cold. Mbappé-celebration cold.'
    ],
    wrong: [
      'VAR checked. Still wrong.', 'White hankies out. The crowd is not happy.', 'Florentino has called an emergency board meeting.',
      'That one is going in the blooper reel.', 'The ball is round, but that answer is not.', 'Even the B team bench knew that one.',
      'Straight into the top tier of the stand.', 'That is a lose-the-derby kind of answer.', 'The ultras have started a chant, and not a nice one.',
      'Back to the training ground with you.'
    ],
    slow: [
      'Too slow. Courtois already played it out from the back.', 'Final whistle on that one.', 'The fourth official held up the board and you were still thinking.'
    ],
    streak: [
      'Comeback mode: on.', 'They say ninety minutes at the Bernabéu are very long. You are proving it.', 'Hat-trick of right answers. Take the match ball home.',
      'This is getting Lisbon-2014 levels of dramatic.', 'Unstoppable. Like Ronaldo in April.'
    ]
  };

  // Famous arrivals get their own way of asking.
  const ARRIVAL_PROMPTS = {
    figo: 'Figo made the most scandalous move in Spanish football to join Madrid in 2000. Which club did he leave?',
    cristiano: 'In 2009 Madrid paid a world-record fee for Cristiano Ronaldo. Who sold him?',
    'ronaldo-nazario': 'Ronaldo arrived in 2002 fresh from winning the World Cup. Which club did he come from?',
    beckham: 'Beckham became the latest Galáctico in 2003. Who sold him?',
    kaka: "Kaká arrived the same summer as Cristiano. Where had he won the Ballon d'Or?",
    modric: 'A Spanish newspaper once called him the worst signing of the season. Where did Modrić come from?',
    bellingham: 'Bellingham scored on his Madrid debut and kept going. Which club sold him?',
    mbappe: 'After years of saga, Mbappé finally arrived on a free in 2024. From where?',
    zidane: 'Zidane signed after the Madrid president passed him a napkin asking if he wanted to join. Which club did he leave?',
    bale: 'Bale arrived in 2013 for a world-record fee. Which club sold him?'
  };

  // ---------- seeded randomness ----------

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const plainText = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
  const surname = p => {
    const parts = p.name.split(' ');
    return parts.length > 1 && !['Júnior', 'Junior'].includes(parts[parts.length - 1]) ? parts[parts.length - 1] : parts[0];
  };
  const letters = s => plainText(s).toUpperCase().replace(/[^A-Z]/g, '');
  // For comparing answers: keeps digits, so shirt numbers and years still compare correctly
  const norm = s => plainText(s).toUpperCase().replace(/[^A-Z0-9]/g, '');

  // ---------- question generators ----------

  function makeGenerators(R) {
    const pick = arr => arr[Math.floor(R() * arr.length)];
    const shuffle = arr => {
      const out = [...arr];
      for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
      return out;
    };
    const P = RM_PLAYERS;
    const squad = P.filter(p => p.status === 'active');
    const withPhoto = list => list.filter(p => p.headshot);
    const legends = P.filter(p => p.status === 'legend');
    const big = P.filter(p => (p.stats?.madridApps || 0) >= 100);
    const options = (right, wrongPool, n = 3) => shuffle([right, ...shuffle([...new Set(wrongPool.filter(x => x && x !== right))]).slice(0, n)]);

    return {
      number() {
        const p = pick(squad);
        return { kind: 'mcq', player: p, photo: p.headshot, prompt: `What number does ${p.name} wear?`, sub: `${p.position}, ${p.nationality}`,
          options: options(String(p.number), squad.map(x => String(x.number))).map(n => ({ label: `No. ${n}`, value: n })), answer: String(p.number),
          explain: `${p.name} wears No. ${p.number} this season.` };
      },
      face(blur) {
        const pool = withPhoto(blur ? [...squad, ...legends] : squad);
        const p = pick(pool);
        const same = pool.filter(x => x.category === p.category && x.id !== p.id);
        return { kind: 'mcq', player: p, photo: p.headshot, blur, prompt: blur ? 'Who is behind the blur?' : 'Who is this?', sub: `${p.position}${p.status === 'active' ? ', current squad' : ', club legend'}`,
          options: options(p.name, (same.length >= 3 ? same : pool).map(x => x.name)).map(n => ({ label: n, value: n })), answer: p.name,
          explain: `That's ${p.name}${p.status === 'active' ? `, No. ${p.number}` : `, at Madrid ${p.madridYears}`}.` };
      },
      country(pool) {
        const p = pick(pool);
        return { kind: 'mcq', player: p, photo: p.headshot, prompt: `Which country does ${p.name} play for?`, sub: p.status === 'active' ? `No. ${p.number}` : `At Madrid ${p.madridYears}`,
          options: options(p.nationality, P.map(x => x.nationality)).map(n => ({ label: n, value: n })), answer: p.nationality,
          explain: `${p.name}: ${p.nationality}${p.birthPlace ? `, born in ${p.birthPlace}` : ''}.` };
      },
      arrival(pool) {
        const p = pick(pool.filter(x => x.route?.from));
        const clubs = P.map(x => x.route?.from).filter(Boolean);
        return { kind: 'mcq', player: p, photo: p.headshot, prompt: ARRIVAL_PROMPTS[p.id] || `Which club did ${p.name} join Madrid from?`, sub: `Joined in ${p.joinedRealMadrid}`,
          options: options(p.route.from, clubs).map(n => ({ label: n, value: n })), answer: p.route.from,
          explain: `${p.name} came from ${p.route.from}${p.transferFee && p.handWritten ? ` (${p.transferFee})` : ''}.` };
      },
      departure() {
        const p = pick(P.filter(x => x.route?.to && x.status !== 'active'));
        return { kind: 'mcq', player: p, photo: p.headshot, prompt: `After ${p.madridYears} at Madrid, where did ${p.name} go next?`, sub: p.position,
          options: options(p.route.to, P.map(x => x.route?.to)).map(n => ({ label: n, value: n })), answer: p.route.to,
          explain: `${p.name} moved on to ${p.route.to}.` };
      },
      year(pool) {
        const p = pick(pool.filter(x => Number(x.joinedRealMadrid)));
        const y = Number(p.joinedRealMadrid);
        const near = shuffle([-3, -2, -1, 1, 2, 3, 4]).slice(0, 3).map(d => String(y + d)).filter(v => Number(v) <= 2026);
        return { kind: 'mcq', player: p, photo: p.headshot, prompt: `In which year did ${p.name} first join Madrid's first team?`, sub: p.position,
          options: shuffle([String(y), ...near]).slice(0, 4).sort().map(n => ({ label: n, value: n })), answer: String(y),
          explain: `${p.name}: Madrid ${p.madridYears}.` };
      },
      route(pool) {
        const candidates = pool.filter(x => routeToMadrid(x).length >= 2);
        const p = pick(candidates);
        const path = routeToMadrid(p).map(l => l.club).join(' → ');
        return { kind: 'mcq', player: p, prompt: 'Whose road to Madrid was this?', sub: `${path} → Real Madrid`,
          options: options(p.name, candidates.map(x => x.name)).map(n => ({ label: n, value: n })), answer: p.name,
          explain: `${p.name}, who arrived in ${p.joinedRealMadrid}.` };
      },
      anagram(pool) {
        const p = pick(pool.filter(x => { const l = letters(surname(x)).length; return l >= 4 && l <= 9; }));
        const word = letters(surname(p));
        let tiles = word.split('');
        for (let i = 0; i < 6 && tiles.join('') === word; i++) tiles = shuffle(tiles);
        return { kind: 'anagram', player: p, photo: p.headshot, blur: true, prompt: 'Unscramble the surname', sub: `${p.position}, ${p.nationality}, Madrid ${p.madridYears || p.joinedRealMadrid}`,
          tiles, answer: word, explain: `It was ${p.name}.` };
      },
      missing(pool) {
        const p = pick(pool.filter(x => { const l = letters(surname(x)).length; return l >= 5 && l <= 10; }));
        const word = letters(surname(p));
        const keep = new Set([0, ...shuffle([...Array(word.length).keys()].slice(1)).slice(0, Math.ceil(word.length * 0.35))]);
        const pattern = word.split('').map((c, i) => keep.has(i) ? c : '_').join(' ');
        return { kind: 'type', player: p, prompt: 'Fill in the surname', pattern, sub: `${p.position} from ${p.nationality}, Madrid ${p.madridYears}`,
          answer: word, explain: `${p.name}.` };
      },
      moreGames() {
        const [a, b] = shuffle(big).slice(0, 2);
        const right = (a.stats.madridApps >= b.stats.madridApps ? a : b);
        return { kind: 'mcq', player: right, prompt: 'Who played more games for Madrid?', sub: 'All competitions',
          options: shuffle([a, b]).map(p => ({ label: p.name, value: p.name })), answer: right.name,
          explain: `${a.name}: ${a.stats.madridApps} games. ${b.name}: ${b.stats.madridApps}.` };
      },
      topScorer() {
        const seasons = RM_SEASONS.filter(s => s.topScorer && !s.inProgress && !s.topScorer.name.includes('&'));
        const s = pick(seasons);
        return { kind: 'mcq', prompt: `Who was Madrid's top scorer in ${s.season}?`, sub: `${s.topScorer.goals} goals in all competitions`,
          options: options(s.topScorer.name, seasons.map(x => x.topScorer.name)).map(n => ({ label: n, value: n })), answer: s.topScorer.name,
          explain: `${s.topScorer.name}, ${s.topScorer.goals} goals.` };
      },
      coach() {
        const won = RM_SEASONS.filter(s => s.cups.some(c => c.name.includes('Champions League') && /^Winners/.test(c.result)) && s.managers.length === 1);
        const s = pick(won);
        const coaches = [...new Set(RM_SEASONS.flatMap(x => x.managers))];
        return { kind: 'mcq', prompt: `Who was the coach when Madrid won the Champions League in ${s.season}?`, sub: 'European Cup winners',
          options: options(s.managers[0], coaches).map(n => ({ label: n, value: n })), answer: s.managers[0],
          explain: `${s.managers[0]} was in charge in ${s.season}.` };
      },
      thisSeason() {
        const games = RM_SEASON_MATCHES.filter(m => m.scorers.some(([id]) => id !== 'og'));
        const m = pick(games);
        const scorerIds = [...new Set(m.scorers.map(([id]) => id).filter(id => id !== 'og'))];
        const rightId = pick(scorerIds);
        const right = RM_PLAYERS.find(p => p.id === rightId);
        const others = squad.filter(p => !scorerIds.includes(p.id) && p.category !== 'goalkeeper').map(p => p.name);
        const scoreline = m.venue === 'H' ? `Real Madrid ${m.score[0]}–${m.score[1]} ${m.opponent}` : `${m.opponent} ${m.score[1]}–${m.score[0]} Real Madrid`;
        return { kind: 'mcq', player: right, prompt: `Who scored for Madrid in ${scoreline}?`, sub: `${m.comp}, ${new Date(m.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`,
          options: options(right.name, others).map(n => ({ label: n, value: n })), answer: right.name,
          explain: `Madrid's scorers: ${scorerIds.map(id => RM_PLAYERS.find(p => p.id === id)?.name).filter(Boolean).join(', ')}.` };
      }
    };
  }

  function buildQuestions(seed, tier) {
    const R = rng(seed);
    const G = makeGenerators(R);
    const squad = RM_PLAYERS.filter(p => p.status === 'active');
    const famous = RM_PLAYERS.filter(p => p.status === 'legend' || (p.stats?.madridApps || 0) >= 150);
    const everyone = RM_PLAYERS;
    const plans = {
      cantera: [() => G.face(false), () => G.number(), () => G.country(squad), () => G.thisSeason(), () => G.face(false), () => G.number(),
        () => G.arrival(squad), () => G.country(squad), () => G.thisSeason(), () => G.anagram(squad)],
      galactico: [() => G.face(true), () => G.arrival(famous), () => G.year(famous), () => G.anagram(famous), () => G.country(famous),
        () => G.route(famous), () => G.departure(), () => G.moreGames(), () => G.coach(), () => G.thisSeason()],
      lisbon: [() => G.missing(everyone), () => G.topScorer(), () => G.route(everyone), () => G.departure(), () => G.moreGames(),
        () => G.anagram(everyone), () => G.year(everyone), () => G.coach(), () => G.missing(famous), () => G.arrival(everyone)]
    };
    const used = new Set();
    const out = [];
    for (const make of plans[tier]) {
      let q;
      for (let tries = 0; tries < 12; tries++) {
        q = make();
        const key = q.player?.id || q.prompt;
        if (!used.has(key)) { used.add(key); break; }
      }
      out.push(q);
    }
    // shuffle order but keep it seeded
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }

  // ---------- storage ----------

  const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } };
  const save = d => { try { localStorage.setItem(STORE, JSON.stringify(d)); } catch (e) { /* storage off */ } };
  const getName = () => { try { return localStorage.getItem(NAME_KEY) || ''; } catch (e) { return ''; } };
  const setName = n => { try { localStorage.setItem(NAME_KEY, n); } catch (e) { /* storage off */ } };

  // ---------- challenge links ----------

  const b64 = {
    enc: obj => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
    dec: str => JSON.parse(decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/')))))
  };

  function challengeUrl(match) {
    const data = { v: 1, s: match.seed, t: match.tier, n: match.name || 'A friend', r: match.results.map(r => r ? 1 : 0).join(''), p: match.points };
    return `${location.origin}${location.pathname}#play/c/${b64.enc(data)}`;
  }

  function readChallenge() {
    const m = location.hash.match(/^#play\/c\/([\w-]+)/);
    if (!m) return null;
    try {
      const d = b64.dec(m[1]);
      return TIERS[d.t] && Number.isFinite(d.s) ? d : null;
    } catch (e) { return null; }
  }

  // ---------- UI ----------

  let root, match = null, timerRaf = null;
  const $q = sel => root.querySelector(sel);
  const pickLine = list => list[Math.floor(Math.random() * list.length)];

  function lobby() {
    clearInterval(timerRaf);
    const stats = load();
    const challenge = readChallenge();
    const played = stats.played || 0;
    root.innerHTML = `
      <div class="lobby">
        ${challenge ? `
          <div class="challenge-banner" data-blur-in>
            <span class="pill"><span class="pill-dot pill-dot-live"></span>Challenge</span>
            <h2><b>${esc(challenge.n)}</b> scored ${challenge.r.split('').filter(x => x === '1').length} out of 10 on ${esc(TIERS[challenge.t].name)} (${challenge.p} points).</h2>
            <p>You get the same ten questions. Every one they got right is a goal for them; every one you get right is a goal for you. Beat their score.</p>
            <button type="button" class="btn btn-primary btn-big magnetic" data-start="${challenge.t}" data-challenge="1">Take on ${esc(challenge.n)}</button>
            <button type="button" class="text-btn" data-clear-challenge>Play your own game instead</button>
          </div>` : ''}
        <div class="lobby-tiers">
          ${Object.entries(TIERS).map(([key, t]) => `
            <button type="button" class="lobby-tier spotlight" data-start="${key}" data-reveal>
              <span class="tier-tag">${esc(t.tag)}</span>
              <b>${esc(t.name)}</b>
              <span>${esc(t.blurb)}</span>
              <span class="tier-meta">${t.time}s a question${stats.best?.[key] ? ` · your best ${stats.best[key]} pts` : ''}</span>
            </button>`).join('')}
        </div>
        ${played ? `
          <div class="record" data-reveal>
            <div><b>${played}</b><span>games played</span></div>
            <div><b>${stats.goalsFor || 0}</b><span>goals scored</span></div>
            <div><b>${stats.bestStreak || 0}</b><span>best streak</span></div>
            <div><b>${stats.won || 0}–${stats.lost || 0}</b><span>challenges won–lost</span></div>
          </div>` : ''}
      </div>`;
    Motion.enter(root);
    root.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
  }

  function start(tier, fromChallenge) {
    const challenge = fromChallenge ? readChallenge() : null;
    const seed = challenge ? challenge.s : Math.floor(Math.random() * 2 ** 31);
    match = {
      tier, seed, questions: buildQuestions(seed, tier), i: 0, results: [], points: 0, streak: 0, bestStreak: 0,
      us: 0, them: 0, rival: challenge ? challenge.n : null, ghost: challenge ? challenge.r.split('').map(x => x === '1') : null,
      name: getName()
    };
    root.innerHTML = `
      <div class="pitch-game">
        <div class="scoreboard">
          <div class="sb-team"><span class="sb-name">${match.rival ? esc(match.name || 'You') : 'Goals'}</span><b class="sb-score" id="sb-us">0</b></div>
          <div class="sb-clock"><span id="sb-min">0'</span><small>${esc(TIERS[tier].name)}</small></div>
          <div class="sb-team sb-away"><b class="sb-score" id="sb-them">0</b><span class="sb-name">${match.rival ? esc(match.rival) : 'Shots'}</span></div>
        </div>
        <div class="sb-dots" id="sb-dots">${match.questions.map(() => '<span></span>').join('')}</div>
        <div class="q-stage" id="q-stage"></div>
      </div>`;
    kickoffFlash();
    Sound.whistle([0.45]);
    scrollToGame();
    question();
  }

  function scrollToGame() {
    const top = root.getBoundingClientRect().top + scrollY - 90;
    if (Math.abs(scrollY - top) > 40) scrollTo({ top, behavior: Motion.reduced ? 'auto' : 'smooth' });
  }

  function kickoffFlash() {
    const el = document.createElement('div');
    el.className = 'flash-word';
    el.textContent = 'Kick-off';
    root.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }

  function question() {
    const q = match.questions[match.i];
    const minute = match.i === 9 ? "90+" : `${(match.i + 1) * 9}'`;
    $q('#sb-min').textContent = minute;
    const stage = $q('#q-stage');
    stage.innerHTML = `
      <div class="q-card" data-kind="${q.kind}">
        <div class="q-top">
          <div class="q-text">
            <span class="q-count">Question ${match.i + 1} of 10</span>
            <h2 class="q-prompt">${esc(q.prompt)}</h2>
            ${q.pattern ? `<p class="q-pattern">${esc(q.pattern)}</p>` : ''}
            <p class="q-sub">${esc(q.sub || '')}</p>
          </div>
          ${q.photo ? `<div class="q-photo${q.blur ? ' is-blurred' : ''}"><img src="${esc(q.photo)}" alt=""></div>` : ''}
        </div>
        <div class="shot-clock"><span id="shot-clock"></span></div>
        <div class="q-answer" id="q-answer"></div>
        <div class="q-feedback" id="q-feedback"></div>
      </div>`;
    const ans = $q('#q-answer');
    if (q.kind === 'mcq') {
      ans.innerHTML = `<div class="q-options">${q.options.map((o, i) => `<button type="button" class="q-option" style="--i:${i}" data-value="${esc(o.value)}">${esc(o.label)}</button>`).join('')}</div>`;
      ans.querySelectorAll('.q-option').forEach(b => b.addEventListener('click', () => answer(b.dataset.value, b)));
    } else if (q.kind === 'anagram') {
      ans.innerHTML = `
        <div class="tiles-target" id="tiles-target">${q.answer.split('').map(() => '<span></span>').join('')}</div>
        <div class="tiles">${q.tiles.map((c, i) => `<button type="button" class="tile" style="--i:${i}" data-i="${i}">${c}</button>`).join('')}</div>
        <div class="tile-actions"><button type="button" class="text-btn" data-undo>Undo</button><button type="button" class="text-btn" data-give-up>Pass</button></div>`;
      const typed = [];
      const slots = ans.querySelectorAll('#tiles-target span');
      const paint = () => slots.forEach((s, i) => { s.textContent = typed[i]?.c || ''; s.classList.toggle('is-filled', Boolean(typed[i])); });
      ans.querySelectorAll('.tile').forEach(t => t.addEventListener('click', () => {
        if (t.disabled) return;
        t.disabled = true;
        typed.push({ c: t.textContent, el: t });
        paint();
        if (typed.length === q.answer.length) answer(typed.map(x => x.c).join(''));
      }));
      ans.querySelector('[data-undo]').addEventListener('click', () => { const last = typed.pop(); if (last) { last.el.disabled = false; paint(); } });
      ans.querySelector('[data-give-up]').addEventListener('click', () => answer(''));
    } else {
      ans.innerHTML = `
        <form class="type-form" autocomplete="off">
          <input type="text" class="type-input" maxlength="16" placeholder="Type the surname" aria-label="Surname" autocapitalize="characters" spellcheck="false">
          <button type="submit" class="btn btn-primary">Shoot</button>
        </form>`;
      const form = ans.querySelector('form');
      form.addEventListener('submit', e => { e.preventDefault(); answer(letters(form.querySelector('input').value)); });
      setTimeout(() => form.querySelector('input').focus(), 50);
    }
    runClock(TIERS[match.tier].time);
  }

  function runClock(seconds) {
    clearInterval(timerRaf);
    const bar = $q('#shot-clock');
    const startT = performance.now();
    match.deadline = startT + seconds * 1000;
    timerRaf = setInterval(() => {
      const left = Math.max(0, match.deadline - performance.now());
      if (bar) {
        bar.style.transform = `scaleX(${left / (seconds * 1000)})`;
        bar.classList.toggle('is-low', left < 5000);
      }
      const secs = Math.ceil(left / 1000);
      if (secs <= 3 && secs > 0 && secs !== match.beeped) { match.beeped = secs; Sound.beep(); }
      if (left <= 0) { clearInterval(timerRaf); answer(null); }
    }, 100);
    match.clockStart = startT;
    match.clockLen = seconds * 1000;
  }

  function answer(value, btn) {
    if (match.answered === match.i) return;
    match.answered = match.i;
    clearInterval(timerRaf);
    const q = match.questions[match.i];
    const timedOut = value === null;
    const right = !timedOut && norm(value) === norm(q.answer);
    const left = Math.max(0, match.deadline - performance.now());
    match.results.push(right);

    let gained = 0;
    if (right) {
      match.streak++;
      match.bestStreak = Math.max(match.bestStreak, match.streak);
      gained = 100 + Math.round(50 * left / match.clockLen) + (match.streak >= 3 ? 20 * (match.streak - 2) : 0);
      match.points += gained;
      match.us++;
    } else {
      match.streak = 0;
    }
    // In a challenge the friend scores on the questions they got right; solo, the right-hand number counts shots taken.
    const ghostRight = match.ghost ? match.ghost[match.i] : null;
    if (match.ghost) { if (ghostRight) match.them++; } else match.them = match.i + 1;

    // Mark the options
    root.querySelectorAll('.q-option').forEach(b => {
      b.disabled = true;
      if (norm(b.dataset.value) === norm(q.answer)) b.classList.add('is-right');
      else if (b === btn) b.classList.add('is-wrong');
    });
    root.querySelectorAll('.tile').forEach(t => { t.disabled = true; });
    const input = root.querySelector('.type-input');
    if (input) { input.disabled = true; input.classList.add(right ? 'is-right' : 'is-wrong'); }
    root.querySelector('.q-photo')?.classList.remove('is-blurred');

    const dot = root.querySelectorAll('#sb-dots span')[match.i];
    dot.classList.add(right ? 'is-goal' : 'is-miss');
    bumpScore('#sb-us', match.us, right);
    bumpScore('#sb-them', match.them, Boolean(match.ghost && ghostRight));

    if (right) {
      const r = (btn || root.querySelector('.q-card')).getBoundingClientRect();
      Motion.confetti(r.left + r.width / 2, r.top + r.height / 2, match.streak >= 3 ? 180 : 110);
      goalFlash(match.streak >= 3 ? 'Worldie' : 'Goal');
      Sound.roar(match.streak >= 3);
    } else {
      Sound.groan();
    }

    const line = timedOut ? pickLine(REACT.slow) : right ? (match.streak >= 3 ? pickLine(REACT.streak) : pickLine(REACT.right)) : pickLine(REACT.wrong);
    const ghostLine = match.ghost ? `<p class="ghost-line">${esc(match.rival)} ${ghostRight ? 'got this one' : 'missed this one too'}.</p>` : '';
    $q('#q-feedback').innerHTML = `
      <div class="fb ${right ? 'fb-right' : 'fb-wrong'}">
        <p class="fb-react">${esc(line)}</p>
        <p class="fb-explain">${right ? `+${gained} points. ` : timedOut ? `Time's up. The answer was ${esc(q.answer)}. ` : ''}${esc(q.explain)}</p>
        ${ghostLine}
        <button type="button" class="btn btn-primary" data-next>${match.i === 9 ? 'Final whistle' : 'Next question'}</button>
      </div>`;
    const next = $q('[data-next]');
    next.addEventListener('click', () => { match.i++; if (match.i < 10) question(); else fullTime(); });
    next.focus({ preventScroll: true });
  }

  function bumpScore(sel, value, scored) {
    const el = $q(sel);
    el.textContent = value;
    if (scored && !Motion.reduced) { el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); }
  }

  function goalFlash(word) {
    if (Motion.reduced) return;
    const el = document.createElement('div');
    el.className = 'flash-word flash-goal';
    el.textContent = word;
    root.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  function verdict(goals) {
    let v = VERDICTS[0];
    for (const row of VERDICTS) if (goals >= row[0]) v = row;
    let m = MEMES[0];
    for (const row of MEMES) if (goals >= row[0]) m = row;
    return { title: v[1], line: v[2], sticker: m[1], meme: m[2] };
  }

  function fullTime() {
    const stats = load();
    stats.played = (stats.played || 0) + 1;
    stats.goalsFor = (stats.goalsFor || 0) + match.us;
    stats.bestStreak = Math.max(stats.bestStreak || 0, match.bestStreak);
    stats.best = stats.best || {};
    const newBest = match.points > (stats.best[match.tier] || 0);
    if (newBest) stats.best[match.tier] = match.points;
    const challenge = Boolean(match.ghost);
    if (challenge) {
      if (match.us > match.them) stats.won = (stats.won || 0) + 1;
      else if (match.us < match.them) stats.lost = (stats.lost || 0) + 1;
    }
    save(stats);

    const v = verdict(match.us);
    match.verdict = v;
    const result = !challenge ? null : match.us > match.them ? `You beat ${match.rival}` : match.us < match.them ? `${match.rival} wins this one` : 'Honours even';
    Sound.whistle([0.3, 0.3, 0.8]);
    if (match.us >= 6 && (!challenge || match.us > match.them)) Motion.confetti(innerWidth / 2, innerHeight / 3, 240);
    root.innerHTML = `
      <div class="full-time">
        <p class="pill" data-blur-in><span class="pill-dot"></span>Full time · ${esc(TIERS[match.tier].name)}</p>
        ${challenge ? `
          <div class="ft-score" data-blur-in>
            <span class="ft-team">${esc(match.name || 'You')}</span>
            <b>${match.us}<i>–</i>${match.them}</b>
            <span class="ft-team">${esc(match.rival)}</span>
          </div>
          <p class="ft-result" data-blur-in>${esc(result)}</p>` : `
          <div class="ft-score ft-solo" data-blur-in>
            <b>${match.us}<i>/</i>10</b>
            <span class="ft-team">goals from ten shots</span>
          </div>`}
        <h2 class="ft-verdict" data-split>${esc(v.title)}</h2>
        <p class="ft-line" data-blur-in>${esc(v.line)}</p>
        <div class="ft-stats" data-blur-in>
          <div><b>${match.points}</b><span>points${newBest ? ' · new best' : ''}</span></div>
          <div><b>${match.bestStreak}</b><span>best streak</span></div>
          <div><b>${Math.round((match.us / 10) * 100)}%</b><span>on target</span></div>
        </div>
        <form class="ft-name" data-blur-in>
          <label for="ft-name-input">Your name on the poster and challenge</label>
          <input id="ft-name-input" maxlength="18" value="${esc(match.name)}" placeholder="e.g. Zaid">
        </form>
        <div class="ft-actions" data-blur-in>
          <button type="button" class="btn btn-insta btn-big magnetic" data-share-story>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            Share to Instagram Story
          </button>
          <button type="button" class="btn btn-ghost btn-big magnetic" data-share-link>Challenge a friend</button>
          <button type="button" class="btn btn-ghost btn-big" data-again>Play again</button>
        </div>
        <p class="ft-note" id="ft-note"></p>
        <div class="story-preview" id="story-preview" hidden></div>
      </div>`;
    Motion.enter(root);
    scrollToGame();
    const nameInput = root.querySelector('#ft-name-input');
    let redraw = null;
    nameInput.addEventListener('input', () => {
      match.name = nameInput.value.trim();
      setName(match.name);
      match.storyFile = null;
      clearTimeout(redraw);
      redraw = setTimeout(prepareStory, 350);
    });
    root.querySelector('.ft-name').addEventListener('submit', e => { e.preventDefault(); prepareStory(); });
    root.querySelector('[data-again]').addEventListener('click', () => { history.replaceState(null, '', '#play'); lobby(); });
    root.querySelector('[data-share-link]').addEventListener('click', () => shareLink());
    root.querySelector('[data-share-story]').addEventListener('click', () => shareStory());
    // Draw the story now, so the tap on "Share" can open the share sheet immediately
    prepareStory();
  }

  async function shareLink() {
    const url = challengeUrl(match);
    const text = `I scored ${match.us}/10 (${match.points} pts) on the ${TIERS[match.tier].name} Real Madrid quiz. Same ten questions, think you can beat me?`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Bernabéu Nights · Ball No Ledge', text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      note('Challenge link copied. Paste it to a friend.');
    } catch (e) {
      if (e.name !== 'AbortError') note(`Copy this link: ${url}`);
    }
  }

  function note(text) { const n = root.querySelector('#ft-note'); if (n) n.textContent = text; }

  // ---------- Story poster (1080x1920) ----------

  const STICKER_COLORS = {
    'GOATED': ['#e6bd5f', '#14110a'], 'COLD': ['#bfe3ff', '#08131f'], 'CALMA': ['#ffffff', '#15141b'],
    'MID': ['#c9c5bb', '#15141b'], 'COOKED': ['#ff6b4a', '#1a0804'], 'WE GO AGAIN': ['#9db2ff', '#0a0f2a']
  };

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function loadImage(src) {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = src;
    });
  }

  async function storyImage(v) {
    try {
      await Promise.all([document.fonts.load('800 200px "Barlow Condensed"'), document.fonts.load('italic 80px "Instrument Serif"'), document.fonts.load('600 40px "Barlow"')]);
    } catch (e) { /* fall back to system fonts */ }
    const W = 1080, H = 1920;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const challenge = Boolean(match.ghost);

    // Night sky to pitch
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#07070c'); g.addColorStop(0.55, '#0f0e1c'); g.addColorStop(1, '#0b2a18');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // Diagonal kit stripes
    ctx.save();
    ctx.globalAlpha = 0.05; ctx.fillStyle = '#ffffff';
    ctx.translate(W / 2, H / 2); ctx.rotate(-0.42);
    for (let x = -1600; x < 1600; x += 180) ctx.fillRect(x, -1600, 70, 3200);
    ctx.restore();
    // Floodlights
    ctx.globalCompositeOperation = 'lighter';
    for (const [x, dir] of [[70, 1], [1010, -1]]) {
      const cone = ctx.createLinearGradient(x, 60, x + dir * 500, 1500);
      cone.addColorStop(0, 'rgba(225,232,255,0.22)'); cone.addColorStop(1, 'rgba(225,232,255,0)');
      ctx.fillStyle = cone;
      ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x + dir * 260, 1700); ctx.lineTo(x + dir * 820, 1700); ctx.closePath(); ctx.fill();
      const bulb = ctx.createRadialGradient(x, 60, 0, x, 60, 150);
      bulb.addColorStop(0, 'rgba(255,255,255,0.9)'); bulb.addColorStop(1, 'rgba(210,222,255,0)');
      ctx.fillStyle = bulb; ctx.fillRect(x - 150, -90, 300, 300);
    }
    ctx.globalCompositeOperation = 'source-over';
    // Centre circle
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 1640); ctx.lineTo(W, 1640); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(540, 1640, 280, 76, 0, 0, Math.PI * 2); ctx.stroke();

    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';

    // Branding
    ctx.fillStyle = '#f3f0e8';
    ctx.font = '800 68px "Barlow Condensed", sans-serif';
    ctx.fillText('BALL NO LEDGE', 540, 215);
    const chip = `BERNABÉU NIGHTS  ·  ${TIERS[match.tier].name.toUpperCase()} (${TIERS[match.tier].tag.toUpperCase()})`;
    ctx.font = '700 30px "Barlow Condensed", sans-serif';
    const cw = ctx.measureText(chip).width + 56;
    rr(ctx, 540 - cw / 2, 245, cw, 54, 27);
    ctx.fillStyle = 'rgba(157,178,255,0.16)'; ctx.fill();
    ctx.strokeStyle = 'rgba(157,178,255,0.5)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#c9d4ff';
    ctx.fillText(chip, 540, 283);

    // Meme sticker, slapped on at an angle with two bits of tape
    const [stickerBg, stickerFg] = STICKER_COLORS[v.sticker] || ['#ffffff', '#15141b'];
    ctx.save();
    ctx.translate(540, 470); ctx.rotate(-0.12);
    ctx.font = '800 150px "Barlow Condensed", sans-serif';
    const sw = Math.min(900, ctx.measureText(v.sticker).width + 110);
    ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    rr(ctx, -sw / 2, -100, sw, 200, 26);
    ctx.fillStyle = stickerBg; ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = stickerFg;
    ctx.fillText(v.sticker, 0, 55, sw - 60);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    for (const sx of [-sw / 2 + 20, sw / 2 - 20]) {
      ctx.save(); ctx.translate(sx, -96); ctx.rotate(sx < 0 ? -0.6 : 0.6); ctx.fillRect(-60, -18, 120, 36); ctx.restore();
    }
    ctx.restore();

    // The score
    ctx.fillStyle = '#f3f0e8';
    ctx.font = '800 330px "Barlow Condensed", sans-serif';
    ctx.fillText(challenge ? `${match.us}–${match.them}` : `${match.us}/10`, 540, 900);
    ctx.font = '700 46px "Barlow Condensed", sans-serif';
    ctx.fillStyle = '#c4c0b6';
    ctx.fillText(challenge ? `${(match.name || 'ME').toUpperCase()}  VS  ${match.rival.toUpperCase()}` : 'GOALS FROM TEN SHOTS', 540, 975);

    // Verdict
    ctx.fillStyle = '#e6bd5f';
    ctx.font = 'italic 104px "Instrument Serif", Georgia, serif';
    ctx.fillText(v.title, 540, 1110, 960);

    // Meme caption as a post card, sized to the caption
    const name = match.name || 'Madridista';
    ctx.font = '500 42px "Barlow", sans-serif';
    const lines = wrapLines(ctx, v.meme, 840);
    const cardH = 120 + lines.length * 54;
    rr(ctx, 90, 1160, 900, cardH, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(150, 1220, 32, 0, Math.PI * 2); ctx.fillStyle = '#2443c7'; ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = '800 34px "Barlow Condensed", sans-serif';
    ctx.fillText(name[0].toUpperCase(), 150, 1232);
    ctx.textAlign = 'left';
    ctx.font = '700 32px "Barlow", sans-serif'; ctx.fillStyle = '#f3f0e8';
    ctx.fillText(name, 200, 1213);
    const nw = ctx.measureText(name).width;
    ctx.font = '400 28px "Barlow", sans-serif'; ctx.fillStyle = '#8f8b84';
    ctx.fillText(`@ballnoledge · 90+'`, 214 + nw, 1213);
    ctx.font = '500 42px "Barlow", sans-serif'; ctx.fillStyle = '#e9e6de';
    lines.forEach((l, i) => ctx.fillText(l, 120, 1300 + i * 54));
    ctx.textAlign = 'center';

    // The players from the ten questions: scored on in colour, missed faded with a cross
    const seen = new Set();
    const faces = [];
    match.questions.forEach((q, i) => {
      if (!q.photo || !q.player || seen.has(q.player.id)) return;
      seen.add(q.player.id);
      faces.push({ src: q.photo, right: match.results[i] });
    });
    faces.sort((a, b) => b.right - a.right);
    const shown = faces.slice(0, 7);
    if (shown.length) {
      const imgs = await Promise.all(shown.map(f => loadImage(f.src)));
      const size = 104, gap = 18;
      const total = shown.length * size + (shown.length - 1) * gap;
      ctx.font = '700 26px "Barlow Condensed", sans-serif'; ctx.fillStyle = '#8f8b84';
      ctx.fillText('WHO I KNEW (AND WHO I DIDN’T)', 540, 1440);
      shown.forEach((f, i) => {
        const cx = 540 - total / 2 + size / 2 + i * (size + gap), cy = 1520;
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, size / 2, 0, Math.PI * 2); ctx.closePath();
        ctx.fillStyle = '#1b1a26'; ctx.fill();
        ctx.clip();
        ctx.globalAlpha = f.right ? 1 : 0.3;
        if (imgs[i]) ctx.drawImage(imgs[i], cx - size / 2, cy - size / 2 * 1.1, size, size * 1.25);
        ctx.restore();
        ctx.beginPath(); ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
        ctx.strokeStyle = f.right ? '#e6bd5f' : 'rgba(255,107,74,0.7)'; ctx.lineWidth = 5; ctx.stroke();
        if (!f.right) {
          ctx.strokeStyle = 'rgba(255,107,74,0.85)'; ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(cx - 22, cy - 22); ctx.lineTo(cx + 22, cy + 22); ctx.moveTo(cx + 22, cy - 22); ctx.lineTo(cx - 22, cy + 22); ctx.stroke();
        }
      });
    }

    // Stat chips
    const chips = [`${match.points} PTS`, `STREAK ${match.bestStreak}`, `${match.us * 10}% ON TARGET`];
    ctx.font = '700 34px "Barlow Condensed", sans-serif';
    const widths = chips.map(t => ctx.measureText(t).width + 48);
    let x = 540 - (widths.reduce((a, b) => a + b, 0) + 20 * (chips.length - 1)) / 2;
    chips.forEach((t, i) => {
      rr(ctx, x, 1610, widths[i], 60, 30);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#f3f0e8'; ctx.fillText(t, x + widths[i] / 2, 1652);
      x += widths[i] + 20;
    });

    // Call to action
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 66px "Barlow Condensed", sans-serif';
    ctx.fillText(challenge ? 'YOUR TURN. BEAT US BOTH.' : 'THINK YOU KNOW MADRID? BEAT ME.', 540, 1750, 960);
    ctx.font = '600 34px "Barlow", sans-serif';
    ctx.fillStyle = '#9db2ff';
    ctx.fillText(`${location.host || 'ball-no-ledge.vercel.app'}  ·  link in the sticker`, 540, 1800);
    return new Promise(res => c.toBlob(res, 'image/png'));
  }

  function wrapLines(ctx, text, max) {
    const out = [];
    let line = '';
    for (const w of text.split(' ')) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > max && line) { out.push(line); line = w; } else line = test;
    }
    out.push(line);
    return out;
  }

  // Draw the poster ahead of the tap: browsers only open the share sheet straight
  // from a tap, so the file has to be ready by then.
  function prepareStory() {
    const m = match;
    m.storyFile = null;
    m.story = storyImage(m.verdict).then(blob => {
      const file = new File([blob], 'ball-no-ledge-story.png', { type: 'image/png' });
      if (match === m) m.storyFile = file;
      return file;
    });
    return m.story;
  }

  // Websites can't open Instagram's story camera directly; the phone's share sheet
  // with just the image is the shortest route: Share → Instagram → Stories.
  function shareStory() {
    const url = challengeUrl(match);
    const file = match.storyFile;
    if (!file) {
      note('Drawing your poster…');
      (match.story || prepareStory()).then(() => note('Poster ready. Tap “Share to Instagram Story” again.'));
      return;
    }
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      // Copy the link for the story's link sticker. Not awaited, so the share sheet still counts as a tap.
      navigator.clipboard?.writeText(url).catch(() => {});
      navigator.share({ files: [file] })
        .then(() => note('Posted? Add a Link sticker and paste: your challenge link is copied.'))
        .catch(e => {
          if (e.name === 'AbortError') return;
          storyPreview(file, url);
        });
      note('Choose Instagram, then Stories. Your challenge link is copied for the link sticker.');
      return;
    }
    storyPreview(file, url);
  }

  // Desktop (or browsers without file sharing): show the poster with download and copy buttons
  function storyPreview(file, url) {
    const box = root.querySelector('#story-preview');
    if (!box) return;
    if (box.dataset.src) URL.revokeObjectURL(box.dataset.src);
    const src = URL.createObjectURL(file);
    box.dataset.src = src;
    box.hidden = false;
    box.innerHTML = `
      <img src="${src}" alt="Your Bernabéu Nights story poster">
      <div class="story-preview-side">
        <p><b>Instagram Stories can only be posted from the phone app.</b> Open this page on your phone and tap Share again, or save the poster and send it to yourself.</p>
        <a class="btn btn-primary" href="${src}" download="ball-no-ledge-story.png">Save poster</a>
        <button type="button" class="btn btn-ghost" data-copy-link>Copy challenge link</button>
      </div>`;
    box.querySelector('[data-copy-link]').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(url); note('Challenge link copied.'); } catch (e) { note(`Challenge link: ${url}`); }
    });
    box.scrollIntoView({ block: 'nearest', behavior: Motion.reduced ? 'auto' : 'smooth' });
  }

  function init(el) {
    root = el;
    root.addEventListener('click', e => {
      const s = e.target.closest('[data-start]');
      if (s) start(s.dataset.start, Boolean(s.dataset.challenge));
      if (e.target.closest('[data-clear-challenge]')) { history.replaceState(null, '', '#play'); lobby(); }
    });
    lobby();
  }

  // Called when the Play view opens. A match in progress or a full-time screen stays put;
  // opening a challenge link always shows its lobby.
  function show() {
    const playingChallenge = match && match.ghost && match.i < 10;
    if (readChallenge() && !playingChallenge) lobby();
  }

  return { init, show, buildQuestions, TIERS, readChallenge, challengeUrl };
})();

window.Game = Game;
