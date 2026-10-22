// Ball No Ledge: main UI controller.

const VIEWS = ['squad', 'map', 'train', 'compare'];

const STATUS_GROUPS = [
  { status: 'active', title: `First team ${RM_SQUAD_SEASON}` },
  { status: 'departed', title: 'Former players' },
  { status: 'legend', title: 'Legends' }
];

const state = {
  view: 'squad',
  filterPosition: 'all',
  filterStatus: 'all',
  filterNation: 'all',
  searchQuery: '',
  sortBy: 'number',
  activePlayer: null,
  activeTab: 'overview',
  lastFocus: null,
  map: null,
  trainer: null
};

const $ = id => document.getElementById(id);

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const byId = id => RM_PLAYERS.find(p => p.id === id);

// ---------- small data helpers ----------

function madridStint(player) {
  const stage = player.lineage.find(l => l.club === 'Real Madrid');
  return stage ? stage.years.replace('Present', 'now') : player.joinedRealMadrid;
}

function trophyCount(player) {
  return player.stats?.trophiesMadrid?.length ?? null;
}

// Stats were written in late 2024. For anyone who was still at the club
// after that, the Madrid numbers are behind.
function statsAreStale(player) {
  if (!player.stats) return false;
  return player.status === 'active' || Number(player.departureYear) >= 2025;
}

function statValue(v) {
  return v === undefined || v === null ? '—' : v;
}

function photoMarkup(player, { label = true } = {}) {
  if (player.headshot) {
    return `<img src="${esc(player.headshot)}" alt="" loading="lazy" decoding="async">`;
  }
  return `<span class="no-photo" aria-hidden="true"><b>${esc(player.number)}</b>${label ? '<small>Photo to come</small>' : ''}</span>`;
}

// ---------- boot ----------

document.addEventListener('DOMContentLoaded', () => {
  state.trainer = new RM_MemoryTrainer(RM_PLAYERS);
  initSquadControls();
  initDrawer();
  initMapControls();
  initTrainer();
  initCompare();
  renderIntro();
  renderSquad();

  window.addEventListener('hashchange', routeFromHash);
  routeFromHash();
});

function routeFromHash() {
  const view = location.hash.replace('#', '');
  showView(VIEWS.includes(view) ? view : 'squad');
}

function showView(view) {
  if (state.view !== view) window.scrollTo(0, 0);
  state.view = view;
  VIEWS.forEach(v => { $(`view-${v}`).hidden = v !== view; });
  document.querySelectorAll('.nav-link').forEach(a => {
    const on = a.dataset.view === view;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  if (view === 'map') {
    if (!state.map) state.map = new RM_LineageMindmap('lineage-canvas', 'map-container', RM_PLAYERS);
    state.map.start();
  } else if (state.map) {
    state.map.stop();
  }

  if (view === 'train') renderTrainer();
  if (view === 'compare') renderCompare();
}

function renderIntro() {
  const squad = RM_PLAYERS.filter(p => p.status === 'active');
  const newcomers = squad.filter(p => p.isNew);
  $('squad-season').textContent = `Season ${RM_SQUAD_SEASON} · Head coach ${RM_HEAD_COACH}`;
  $('squad-intro').textContent =
    `${squad.length} players in the first team, ${newcomers.length} of them signed or promoted since summer 2025. ` +
    `Tap anyone to see where they came from, how their first game went and the stories worth knowing. Former players and legends are further down.`;
  $('footer-note').textContent =
    `Squad numbers, signings and departures updated ${RM_DATA_UPDATED}. ` +
    `Madrid appearance, goal and trophy figures for players who were already here in 2024 date from ${RM_STATS_AS_OF} and are marked where they're out of date. ` +
    `Not affiliated with Real Madrid C.F.`;
}

// ---------- squad ----------

function initSquadControls() {
  const nationSelect = $('nation-select');
  nationSelect.innerHTML = '<option value="all">All</option>' +
    RM_NATIONS.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');

  $('search-input').addEventListener('input', e => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderSquad();
  });
  nationSelect.addEventListener('change', e => { state.filterNation = e.target.value; renderSquad(); });
  $('sort-select').addEventListener('change', e => { state.sortBy = e.target.value; renderSquad(); });

  bindSegmented('[data-position]', btn => { state.filterPosition = btn.dataset.position; renderSquad(); });
  bindSegmented('[data-status]', btn => { state.filterStatus = btn.dataset.status; renderSquad(); });

  $('squad-grid').addEventListener('click', e => {
    const card = e.target.closest('[data-player]');
    if (card) openPlayer(card.dataset.player);
    if (e.target.closest('[data-reset]')) resetFilters();
  });
}

function bindSegmented(selector, onPick) {
  const buttons = document.querySelectorAll(`.seg-btn${selector}`);
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.toggle('is-active', b === btn));
    onPick(btn);
  }));
}

function setSegmented(selector, value, attr) {
  document.querySelectorAll(`.seg-btn${selector}`).forEach(b => b.classList.toggle('is-active', b.dataset[attr] === value));
}

function matchesSearch(p, q) {
  if (!q) return true;
  if (/^\d+$/.test(q)) return String(p.number) === q;
  const haystack = [p.name, p.fullName, p.nationality, p.position, p.currentClub, ...p.lineage.map(l => l.club)]
    .join(' ').toLowerCase();
  // Let "mbappe" find "Mbappé"
  const plain = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return plain(haystack).includes(plain(q));
}

function getFilteredPlayers() {
  return RM_PLAYERS.filter(p =>
    (state.filterPosition === 'all' || p.category === state.filterPosition) &&
    (state.filterStatus === 'all' || p.status === state.filterStatus) &&
    (state.filterNation === 'all' || p.nationality === state.filterNation) &&
    matchesSearch(p, state.searchQuery)
  ).sort((a, b) => {
    if (state.sortBy === 'name') return a.name.localeCompare(b.name);
    if (state.sortBy === 'debut') return parseInt(a.joinedRealMadrid) - parseInt(b.joinedRealMadrid) || a.number - b.number;
    if (state.sortBy === 'trophies') return (trophyCount(b) ?? -1) - (trophyCount(a) ?? -1);
    return a.number - b.number;
  });
}

function cardRoute(player) {
  if (player.status === 'departed') {
    return `Madrid ${esc(madridStint(player))} · Now <b class="away">${esc(player.currentClub)}</b>`;
  }
  if (player.status === 'legend') {
    return `Madrid ${esc(madridStint(player))}`;
  }
  const from = signedFrom(player);
  return from
    ? `Signed from <b>${esc(from.club)}</b>, ${esc(player.joinedRealMadrid)}`
    : `Academy graduate, first team ${esc(player.joinedRealMadrid)}`;
}

function cardMarkup(player) {
  return `
    <button type="button" class="card" data-player="${esc(player.id)}" aria-label="${esc(player.name)}, open profile">
      <span class="card-photo">
        ${photoMarkup(player)}
        ${player.isNew ? '<span class="card-new">New</span>' : ''}
      </span>
      <span class="card-body">
        <span class="card-number">${esc(player.number)}</span>
        <span class="card-name">${esc(player.name)}</span>
        <span class="card-meta">${esc(player.code)} · ${esc(player.position)}</span>
        <span class="card-route">${cardRoute(player)}</span>
      </span>
    </button>`;
}

function renderSquad() {
  const players = getFilteredPlayers();
  const grid = $('squad-grid');
  $('result-count').textContent = `${players.length} ${players.length === 1 ? 'player' : 'players'}`;

  if (!players.length) {
    grid.innerHTML = `
      <div class="empty">
        <p>Nobody matches that. Try a different name, club or country.</p>
        <button type="button" class="btn" data-reset>Clear filters</button>
      </div>`;
    return;
  }

  const groups = state.filterStatus === 'all'
    ? STATUS_GROUPS.map(g => ({ ...g, players: players.filter(p => p.status === g.status) })).filter(g => g.players.length)
    : [{ title: STATUS_GROUPS.find(g => g.status === state.filterStatus).title, players }];

  grid.innerHTML = groups.map(g => `
    <section class="squad-group">
      <div class="squad-group-head"><h2>${esc(g.title)}</h2><span>${g.players.length}</span></div>
      <div class="grid">${g.players.map(cardMarkup).join('')}</div>
    </section>`).join('');
}

function resetFilters() {
  Object.assign(state, { filterPosition: 'all', filterStatus: 'all', filterNation: 'all', searchQuery: '' });
  $('search-input').value = '';
  $('nation-select').value = 'all';
  setSegmented('[data-position]', 'all', 'position');
  setSegmented('[data-status]', 'all', 'status');
  renderSquad();
}

// ---------- player drawer ----------

function initDrawer() {
  $('drawer-close').addEventListener('click', closePlayer);
  $('drawer-backdrop').addEventListener('click', closePlayer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('player-drawer').hidden) closePlayer();
  });
  document.querySelectorAll('.drawer-tabs .tab').forEach(tab => tab.addEventListener('click', () => {
    state.activeTab = tab.dataset.tab;
    renderDrawerTab();
  }));
}

function openPlayer(id) {
  const player = byId(id);
  if (!player) return;
  state.activePlayer = player;
  state.activeTab = 'overview';
  state.lastFocus = document.activeElement;

  $('drawer-photo').innerHTML = photoMarkup(player, { label: false });
  $('drawer-status').textContent = player.statusLabel;
  $('drawer-name').textContent = player.name;
  $('drawer-meta').textContent = `No. ${player.number} · ${player.position} · ${player.nationality}`;

  renderDrawerTab();
  $('drawer-backdrop').hidden = false;
  $('player-drawer').hidden = false;
  $('drawer-body').scrollTop = 0;
  document.body.style.overflow = 'hidden';
  $('drawer-close').focus();
}

function closePlayer() {
  $('drawer-backdrop').hidden = true;
  $('player-drawer').hidden = true;
  document.body.style.overflow = '';
  state.lastFocus?.focus?.();
}

function renderDrawerTab() {
  const p = state.activePlayer;
  document.querySelectorAll('.drawer-tabs .tab').forEach(t => {
    const on = t.dataset.tab === state.activeTab;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on);
  });
  const body = $('drawer-body');
  body.scrollTop = 0;
  body.innerHTML = {
    overview: overviewTab,
    career: careerTab,
    matches: matchesTab,
    records: recordsTab
  }[state.activeTab](p);
}

function overviewTab(p) {
  const departure = p.status !== 'active' && p.departureDetails ? `
    <div class="note">
      <strong>${p.status === 'departed' ? `Left in ${esc(p.departureYear)}` : 'After Madrid'}</strong>
      ${esc(p.departureDetails)}
    </div>` : '';

  const rows = [
    ['Full name', p.fullName],
    ['Born', [p.birthDate, p.birthPlace].filter(Boolean).join(', ')],
    ['Height, foot', [p.height, p.foot && `${p.foot} foot`].filter(Boolean).join(', ')],
    ['Joined Madrid', [p.joinedRealMadrid, p.transferFee].filter(Boolean).join(', ')],
    ['Signed from', signedFrom(p)?.club || (p.status === 'active' || p.lineage.length ? 'Academy' : '')],
    ['Club now', p.currentClub]
  ].filter(([, v]) => v);

  const s = p.stats;
  const isKeeper = p.category === 'goalkeeper';
  const stats = s ? `
    <h3 class="section-title">For Madrid</h3>
    <div class="stat-row">
      <div class="stat"><b>${statValue(s.madridApps)}</b><span>Appearances</span></div>
      <div class="stat"><b>${statValue(isKeeper ? s.madridCleanSheets : s.madridGoals)}</b><span>${isKeeper ? 'Clean sheets' : 'Goals'}</span></div>
      <div class="stat"><b>${statValue(s.madridAssists)}</b><span>Assists</span></div>
      <div class="stat"><b>${statValue(s.internationalCaps)}</b><span>Caps${s.internationalGoals ? `, ${s.internationalGoals} goals` : ''}</span></div>
    </div>
    ${statsAreStale(p) ? `<p class="stats-note">Figures as of ${esc(RM_STATS_AS_OF)}; they don't include games since.</p>` : ''}
    ${s.trophiesMadrid?.length ? `
      <h3 class="section-title">Won with Madrid</h3>
      <ul class="trophy-list">${s.trophiesMadrid.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      ${statsAreStale(p) ? `<p class="stats-note">List as of ${esc(RM_STATS_AS_OF)}.</p>` : ''}` : ''}
  ` : `<p class="stats-note">Madrid stats for ${esc(p.name.split(' ')[0])} haven't been added yet.</p>`;

  return `
    ${departure}
    <p class="lede">${esc(p.bio)}</p>
    ${p.quote ? `<blockquote class="pullquote">“${esc(p.quote)}”</blockquote>` : ''}
    <h3 class="section-title">Profile</h3>
    <table class="facts-table"><tbody>
      ${rows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
    </tbody></table>
    ${stats}`;
}

function careerTab(p) {
  const madridIdx = p.lineage.findIndex(l => l.club === 'Real Madrid');
  return `
    <h3 class="section-title">Club by club</h3>
    <ol class="timeline">
      ${p.lineage.map((stage, i) => {
        const cls = stage.club === 'Real Madrid' ? 'is-madrid' : (madridIdx !== -1 && i > madridIdx ? 'is-after' : '');
        const meta = [stage.country, stage.fee && `Fee: ${stage.fee}`,
          stage.appearances !== undefined && `${stage.appearances} apps${stage.goals !== undefined ? `, ${stage.goals} goals` : ''}`]
          .filter(Boolean).join(' · ');
        return `
          <li class="${cls}">
            <span class="tl-years">${esc(stage.years)} · ${esc(stage.stage)}</span>
            <h4 class="tl-club">${esc(stage.club)}</h4>
            <p class="tl-meta">${esc(meta)}</p>
            <p class="tl-text">${esc(stage.details)}</p>
          </li>`;
      }).join('')}
    </ol>`;
}

function matchesTab(p) {
  const d = p.madridDebut;
  const debut = d ? `
    <h3 class="section-title">First game for Madrid</h3>
    <article class="match">
      <div class="match-top"><span>${esc(d.date)}</span><span>${esc(d.competition)}</span></div>
      <div class="match-top" style="align-items:baseline">
        <h4 class="match-title">Real Madrid v ${esc(d.opponent)}</h4>
        <span class="match-score">${esc(d.result)}</span>
      </div>
      <p class="tl-meta">${esc([d.venue, d.minutesPlayed && `${d.minutesPlayed} minutes`, d.jerseyWorn && `wore ${d.jerseyWorn}`].filter(Boolean).join(' · '))}</p>
      <p>${esc(d.contribution)}</p>
    </article>` : '';

  const games = p.peakPerformances.length ? `
    <h3 class="section-title">Games to remember</h3>
    ${p.peakPerformances.map(g => `
      <article class="match">
        <div class="match-top"><span>${esc(g.date)}</span><span>${esc(g.competition)}</span></div>
        <div class="match-top" style="align-items:baseline">
          <h4 class="match-title">${esc(g.match)}</h4>
          <span class="match-score">${esc(g.score)}</span>
        </div>
        <p>${esc(g.highlight)}</p>
      </article>`).join('')}` : '';

  return debut + games || `<p class="muted">No match details for ${esc(p.name)} yet.</p>`;
}

function recordsTab(p) {
  const list = (title, items) => items.length ? `
    <h3 class="section-title">${title}</h3>
    <ol class="prose-list">${items.map(i => `<li><span>${esc(i)}</span></li>`).join('')}</ol>` : '';
  return list('Records', p.records) + list('Stories', p.facts) || `<p class="muted">Nothing here for ${esc(p.name)} yet.</p>`;
}

// ---------- career map ----------

function initMapControls() {
  bindSegmented('[data-map-filter]', btn => state.map?.setFilter(btn.dataset.mapFilter));
  $('map-zoom-in').addEventListener('click', () => state.map?.zoomIn());
  $('map-zoom-out').addEventListener('click', () => state.map?.zoomOut());
  $('map-reset').addEventListener('click', () => state.map?.resetView());
}

// ---------- learn: flashcards & quiz ----------

function initTrainer() {
  const t = state.trainer;
  bindSegmented('[data-mode]', btn => {
    const quiz = btn.dataset.mode === 'quiz';
    $('flashcards-panel').hidden = quiz;
    $('quiz-panel').hidden = !quiz;
    renderTrainer();
  });

  $('deck-select').addEventListener('change', e => { t.setDeck(e.target.value); renderFlashcard(); });
  $('flashcard').addEventListener('click', () => { t.toggleFlip(); renderFlashcard(); });
  $('card-next').addEventListener('click', () => { t.nextCard(); renderFlashcard(); });
  $('card-prev').addEventListener('click', () => { t.prevCard(); renderFlashcard(); });
  $('card-shuffle').addEventListener('click', () => { t.shuffleDeck(); renderFlashcard(); });
  $('card-learned').addEventListener('click', () => { t.toggleLearned(t.getCurrentPlayer().id); renderFlashcard(); });

  document.addEventListener('keydown', e => {
    if (state.view !== 'train' || $('flashcards-panel').hidden || !$('player-drawer').hidden) return;
    if (e.target.closest('input, select, textarea')) return;
    if (e.key === 'ArrowRight') { t.nextCard(); renderFlashcard(); }
    if (e.key === 'ArrowLeft') { t.prevCard(); renderFlashcard(); }
  });

  bindSegmented('[data-quiztype]', btn => renderQuestion(btn.dataset.quiztype));
  $('quiz-question').addEventListener('click', e => {
    const opt = e.target.closest('[data-answer]');
    if (opt) answerQuestion(opt.dataset.answer);
    if (e.target.closest('[data-next]')) renderQuestion(state.trainer.quizType);
  });
}

function renderTrainer() {
  if ($('quiz-panel').hidden) renderFlashcard();
  else if (!state.trainer.currentQuestion) renderQuestion(state.trainer.quizType);
}

function renderFlashcard() {
  const t = state.trainer;
  const p = t.getCurrentPlayer();
  if (!p) return;

  $('fc-photo').innerHTML = photoMarkup(p);
  $('fc-name').textContent = p.name;
  $('fc-meta').textContent = `No. ${p.number} · ${p.position}`;
  $('fc-back-name').textContent = p.name;
  $('fc-back-nation').textContent = p.nationality;
  $('fc-back-from').textContent = signedFrom(p)?.club || 'Real Madrid academy';
  const route = routeToMadrid(p).map(l => l.club);
  $('fc-back-path').textContent = [...route, 'Real Madrid'].join(' → ');
  $('fc-back-fact').textContent = p.facts[0] || p.bio;

  $('flashcard').classList.toggle('is-flipped', t.isCardFlipped);
  $('flashcard').setAttribute('aria-label', t.isCardFlipped ? `Back of card for ${p.name}. Flip back` : `${p.name}. Flip for details`);

  const known = t.isLearned(p.id);
  $('card-learned').classList.toggle('is-on', known);
  $('card-learned').textContent = known ? 'Known ✓' : 'Mark as known';
  $('card-counter').textContent = `Card ${t.currentCardIndex + 1} of ${t.deck.length} · use ← → keys`;
  $('deck-progress').textContent = `You know ${t.learnedInDeck()} of ${t.deck.length}`;
}

function renderQuestion(type) {
  const q = state.trainer.generateQuestion(type);
  updateScore();
  $('quiz-question').innerHTML = `
    <div class="quiz-card">
      <div class="quiz-head">
        <div>
          <h2 class="quiz-q">${esc(q.question)}</h2>
          <p class="quiz-prompt">${esc(q.prompt)}</p>
        </div>
        ${q.showPhoto ? `<div class="quiz-photo">${photoMarkup(q.player, { label: false })}</div>` : ''}
      </div>
      <div class="quiz-options">
        ${q.options.map(o => `<button type="button" class="quiz-option" data-answer="${esc(o.value)}">${esc(o.text)}</button>`).join('')}
      </div>
      <div id="quiz-feedback"></div>
    </div>`;
}

function answerQuestion(value) {
  const result = state.trainer.submitAnswer(value);
  if (!result) return;
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.answer === String(result.correctAnswer)) btn.classList.add('is-right');
    else if (btn.dataset.answer === String(value)) btn.classList.add('is-wrong');
  });
  const fb = $('quiz-feedback');
  fb.className = `quiz-feedback ${result.isCorrect ? 'right' : 'wrong'}`;
  fb.innerHTML = `
    <h3>${result.isCorrect ? 'Correct' : 'Not quite'}</h3>
    <p>${esc(result.explanation)}</p>
    <button type="button" class="btn btn-primary" data-next>Next question</button>`;
  fb.querySelector('[data-next]').focus();
  updateScore();
}

function updateScore() {
  const t = state.trainer;
  $('quiz-score').textContent = `${t.quizScore} / ${t.quizTotal}`;
  $('quiz-streak').textContent = t.quizStreak > 1 ? `${t.quizStreak} in a row` : '';
}

// ---------- compare ----------

function initCompare() {
  const options = STATUS_GROUPS.map(g => `
    <optgroup label="${esc(g.title)}">
      ${RM_PLAYERS.filter(p => p.status === g.status).sort((a, b) => a.number - b.number)
        .map(p => `<option value="${esc(p.id)}">${esc(p.number)}. ${esc(p.name)}</option>`).join('')}
    </optgroup>`).join('');
  $('compare-a').innerHTML = options;
  $('compare-b').innerHTML = options;
  $('compare-a').value = 'vinicius';
  $('compare-b').value = 'mbappe';
  $('compare-a').addEventListener('change', renderCompare);
  $('compare-b').addEventListener('change', renderCompare);
}

function renderCompare() {
  const a = byId($('compare-a').value);
  const b = byId($('compare-b').value);
  if (!a || !b) return;

  const num = v => (typeof v === 'number' ? v : null);
  const rows = [
    ['Country', p => p.nationality],
    ['Position', p => p.position],
    ['Born', p => p.birthDate || '—'],
    ['At Madrid', p => madridStint(p)],
    ['Signed from', p => signedFrom(p)?.club || 'Academy'],
    ['Fee', p => p.transferFee || '—'],
    ['Madrid debut', p => p.madridDebut ? `${p.madridDebut.date} v ${p.madridDebut.opponent}` : '—'],
    ['Appearances', p => num(p.stats?.madridApps), true],
    ['Goals', p => num(p.stats?.madridGoals), true],
    ['Assists', p => num(p.stats?.madridAssists), true],
    ['Trophies with Madrid', p => trophyCount(p), true],
    ['International caps', p => num(p.stats?.internationalCaps), true],
    ['Club now', p => p.currentClub],
    ['Route to Madrid', p => [...routeToMadrid(p).map(l => l.club), 'Real Madrid'].join(' → ')]
  ];

  const head = p => `
    <div class="compare-head">
      <div class="quiz-photo">${photoMarkup(p, { label: false })}</div>
      <div><strong>${esc(p.name)}</strong><span>No. ${esc(p.number)} · ${esc(p.statusLabel)}</span></div>
    </div>`;

  const staleNote = [a, b].some(statsAreStale)
    ? `<p class="stats-note">Madrid figures for players at the club after 2024 are as of ${esc(RM_STATS_AS_OF)}. A dash means we don't have the number yet.</p>`
    : '';

  $('compare-output').innerHTML = `
    <table class="compare-table">
      <thead><tr><th></th><th>${head(a)}</th><th>${head(b)}</th></tr></thead>
      <tbody>
        ${rows.map(([label, get, numeric]) => {
          const va = get(a), vb = get(b);
          const leadA = numeric && va !== null && vb !== null && va > vb;
          const leadB = numeric && va !== null && vb !== null && vb > va;
          return `<tr><th scope="row">${label}</th>
            <td class="${leadA ? 'lead' : ''}">${esc(statValue(va))}</td>
            <td class="${leadB ? 'lead' : ''}">${esc(statValue(vb))}</td></tr>`;
        }).join('')}
      </tbody>
    </table>
    ${staleNote}`;
}

window.openPlayer = openPlayer;
