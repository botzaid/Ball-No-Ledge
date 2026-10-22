// Ball No Ledge: main UI controller.

const VIEWS = ['home', 'squad', 'seasons', 'map', 'play', 'compare'];

const STATUS_TITLES = {
  active: `First team ${RM_SQUAD_SEASON}`,
  legend: 'Legends',
  departed: 'Former players'
};

const state = {
  view: null,
  layout: 'cards',
  filterPosition: 'all',
  filterStatus: 'all',
  filterNation: 'all',
  searchQuery: '',
  sortBy: 'number',
  tableSort: { key: 'apps', dir: -1 },
  activePlayer: null,
  activeTab: 'overview',
  lastFocus: null,
  routes: null,
  trainer: null
};

const $ = id => document.getElementById(id);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const byId = id => RM_PLAYERS.find(p => p.id === id);
const plain = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ---------- small data helpers ----------

function madridStint(player) {
  if (player.madridYears) return player.madridYears.replace(/–$/, '–now');
  const stage = player.lineage.find(l => l.club === 'Real Madrid');
  return stage ? stage.years.replace('Present', 'now') : player.joinedRealMadrid;
}

function trophyCount(player) {
  return player.trophyCount ?? player.stats?.trophiesMadrid?.length ?? null;
}

function statValue(v) {
  return v === undefined || v === null ? '—' : v;
}

// Players with no freely licensed photo get an illustrated home shirt with their
// number (current squad) or initials, instead of an empty box.
function kitSvg(mark) {
  const text = String(mark);
  const size = text.length > 2 ? 30 : 40;
  return `<svg class="kit" viewBox="0 0 120 120" aria-hidden="true">
    <path class="kit-shirt" d="M38 14 L22 20 L6 44 L22 54 L28 46 L28 108 L92 108 L92 46 L98 54 L114 44 L98 20 L82 14 C78 24 70 28 60 28 C50 28 42 24 38 14 Z"/>
    <path class="kit-trim" d="M38 14 C42 24 50 28 60 28 C70 28 78 24 82 14" fill="none"/>
    <path class="kit-trim" d="M6 44 L22 54 M114 44 L98 54" fill="none"/>
    <text x="60" y="${text.length > 2 ? 80 : 84}" text-anchor="middle" font-size="${size}">${esc(text)}</text>
  </svg>`;
}

function photoMarkup(player, { label = true } = {}) {
  if (player.headshot) {
    return `<img src="${esc(player.headshot)}" alt="" loading="lazy" decoding="async" onload="this.classList.add('is-loaded')">`;
  }
  const mark = player.status === 'active' ? player.number : player.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return `<span class="no-photo" aria-hidden="true">${kitSvg(mark)}${label ? '<small>No free photo yet</small>' : ''}</span>`;
}

function fmtDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ---------- motion helpers ----------

// Fade/slide elements in as they scroll into view.
const revealer = 'IntersectionObserver' in window && !reduceMotion
  ? new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      revealer.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -40px 0px' })
  : null;

function reveal(container) {
  const items = container.querySelectorAll('[data-reveal]');
  items.forEach((el, i) => {
    el.style.setProperty('--d', `${Math.min(i % 12, 11) * 35}ms`);
    if (revealer) revealer.observe(el); else el.classList.add('is-in');
  });
}

// Count numbers up from zero.
function countUp(container) {
  container.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target) || reduceMotion || target === 0) { el.textContent = el.dataset.count; return; }
    const start = performance.now();
    const dur = Math.min(900, 300 + target * 4);
    const step = now => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// ---------- boot ----------

document.addEventListener('DOMContentLoaded', () => {
  state.trainer = new RM_MemoryTrainer(RM_PLAYERS);
  Motion.init();
  Sound.init();
  initTheme();
  initHero();
  initSquadControls();
  initDrawer();
  initRoutes();
  initTrainer();
  initCompare();
  ThemedSelect.init();
  renderIntro();
  renderHome();
  renderSquad();
  renderSeasons();
  Game.init($('game'));
  Live.subscribe(renderLive);
  Live.start();

  window.addEventListener('hashchange', routeFromHash);
  routeFromHash();
});

function routeFromHash() {
  let view = location.hash.replace('#', '').split('/')[0];
  if (view === 'train') view = 'play'; // old links
  view = VIEWS.includes(view) ? view : 'home';
  if (view === state.view) { if (view === 'play') Game.show(); return; }
  Motion.curtain(() => showView(view));
}

function showView(view) {
  window.scrollTo(0, 0);
  state.view = view;
  document.body.dataset.view = view;
  state.syncMasthead?.();
  VIEWS.forEach(v => {
    const el = $(`view-${v}`);
    el.hidden = v !== view;
    if (v === view) {
      el.classList.remove('view-enter');
      void el.offsetWidth; // restart the entrance animation
      el.classList.add('view-enter');
      Motion.enter(el);
    }
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    const on = a.dataset.view === view;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  if (view !== 'map') state.routes.stop();
  if (view === 'home') countUp($('home-stats'));
  if (view === 'map') state.routes.render();
  if (view === 'play') { Game.show(); renderFlashcard(); }
  if (view === 'compare') renderCompare();
  if (view === 'seasons') countUp($('season-now'));
}

// ---------- theme ----------

function initTheme() {
  const btn = $('theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  const apply = theme => {
    document.documentElement.dataset.theme = theme;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (meta) meta.content = theme === 'dark' ? '#09090d' : '#f4f2ec';
  };
  apply(document.documentElement.dataset.theme || 'dark');
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.add('theme-swap');
    apply(next);
    try { localStorage.setItem('bnl_theme', next); } catch (e) { /* storage off */ }
    setTimeout(() => document.documentElement.classList.remove('theme-swap'), 400);
    if (state.view === 'map') state.routes.render();
  });
}

// ---------- hero photo + floating masthead ----------

function initHero() {
  const hero = document.querySelector('.view-home .hero');
  const img = $('hero-photo');
  const masthead = document.querySelector('.masthead');
  const ready = () => hero.classList.add('has-photo');
  if (img.complete && img.naturalWidth) ready();
  else { img.addEventListener('load', ready); img.addEventListener('error', () => img.remove()); }
  fetch('images/stadium/credit.json').then(r => (r.ok ? r.json() : null)).then(c => {
    if (!c) return;
    const credit = $('hero-credit');
    credit.href = c.page;
    credit.textContent = `Photo: ${c.artist}, ${c.license}, via Wikimedia Commons`;
    credit.hidden = false;
  }).catch(() => {});

  // Over the photo the masthead is transparent and uses the night palette in both themes
  const sync = () => {
    document.documentElement.style.setProperty('--mast-h', `${masthead.offsetHeight}px`);
    const over = state.view === 'home' && scrollY < hero.offsetHeight - masthead.offsetHeight - 20;
    masthead.classList.toggle('is-over', over);
    masthead.classList.toggle('theme-dark', over);
  };
  addEventListener('scroll', sync, { passive: true });
  addEventListener('resize', sync);
  state.syncMasthead = sync;
  sync();
}

// ---------- home ----------

function renderHome() {
  const results = RM_SEASON_MATCHES;
  const rec = matchRecord(results);
  const cleanSheets = results.filter(m => m.score[1] === 0).length;
  const goals = seasonGoals();
  const [topId, topGoals] = Object.entries(goals).sort((a, b) => b[1] - a[1])[0] || [];
  const top = byId(topId);

  $('hero-pill').textContent = `${RM_SQUAD_SEASON} · updated ${RM_SEASON_UPDATED}`;
  $('hero-sub').textContent = `${RM_ARCHIVE.length} players since 2000-01, ${RM_SEASONS.length} seasons, and this one counted match by match. ` +
    `Where every player came from, where they went, and a quiz to prove you were paying attention.`;

  // Results ticker (duplicated for a seamless loop)
  const items = [...results].reverse().map(m => {
    const res = m.score[0] > m.score[1] ? 'w' : m.score[0] < m.score[1] ? 'l' : 'd';
    const line = m.venue === 'H' ? `Real Madrid <b>${m.score[0]}–${m.score[1]}</b> ${esc(m.opponent)}` : `${esc(m.opponent)} <b>${m.score[1]}–${m.score[0]}</b> Real Madrid`;
    const scorers = [...new Set(m.scorers.map(([id]) => id === 'og' ? 'og' : byId(id)?.name.split(' ').pop()))].filter(Boolean).join(', ');
    return `<span class="tick res-${res}"><i>${fmtDate(m.date)}</i>${line}${scorers ? `<small>${esc(scorers)}</small>` : ''}</span>`;
  }).join('');
  $('ticker-track').innerHTML = items + items;

  $('home-stats').innerHTML = [
    [rec.p, 'games played'], [rec.w, 'wins'], [rec.gf, 'goals scored'], [cleanSheets, 'clean sheets'],
    [topGoals || 0, `goals for ${top ? top.name.split(' ').pop() : '—'}`]
  ].map(([n, label]) => `<div class="home-stat" data-reveal><b data-count="${n}">${n}</b><span>${esc(label)}</span></div>`).join('');

  const face = p => `<button type="button" class="face" data-player="${esc(p.id)}"><span class="face-img">${photoMarkup(p, { label: false })}</span><span class="face-name">${esc(p.name)}</span></button>`;
  const squad = RM_PLAYERS.filter(p => p.status === 'active' && p.headshot).sort((a, b) => a.number - b.number);
  const legends = RM_PLAYERS.filter(p => p.status === 'legend' && p.headshot);
  $('faces').innerHTML = `
    <div class="faces-row"><div class="faces-track">${squad.map(face).join('')}${squad.map(face).join('')}</div></div>
    <div class="faces-row faces-row-rev"><div class="faces-track">${legends.map(face).join('')}${legends.map(face).join('')}</div></div>`;
  $('faces').addEventListener('click', e => { const b = e.target.closest('[data-player]'); if (b) openPlayer(b.dataset.player); });
  reveal($('view-home'));
}

// Live bar in the masthead and the match card on the home hero
let countdownTimer = null;
function renderLive(st) {
  const bar = $('live-bar');
  const card = $('match-card');
  clearInterval(countdownTimer);
  if (st.mode === 'live' && st.live) {
    const m = st.live;
    bar.hidden = false;
    const madridGoals = (m.scorers || []).filter(g => g.madrid && !g.own).map(g => `${g.name} ${g.minute}'`).join(', ');
    bar.innerHTML = `<span class="live-dot"></span><b>Live${m.minute ? ` ${m.minute}'` : ''}</b> ${esc(m.home)} <b>${m.score.home ?? 0}–${m.score.away ?? 0}</b> ${esc(m.away)}` +
      ` <span class="muted">${esc(madridGoals || m.competition || '')}</span>`;
    card.innerHTML = `
      <span class="mc-tag"><span class="live-dot"></span>Live${m.minute ? ` · ${m.minute}'` : ''}</span>
      <div class="mc-teams"><span>${esc(m.home)}</span><b>${m.score.home ?? 0}–${m.score.away ?? 0}</b><span>${esc(m.away)}</span></div>
      <span class="mc-comp">${esc(m.competition || '')}</span>`;
    return;
  }
  bar.hidden = true;
  const n = st.next;
  if (!n) { card.innerHTML = ''; return; }
  const derby = Live.derby(n.opponent || '');
  const kick = new Date(n.kickoff);
  const paint = () => {
    const c = Live.countdown(n.kickoff);
    card.innerHTML = `
      <span class="mc-tag">Next${derby ? ` · ${derby}` : ''}</span>
      <div class="mc-teams"><span>${esc(n.home)}</span><b>v</b><span>${esc(n.away)}</span></div>
      <span class="mc-comp">${esc(n.competition)} · ${kick.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}, ${kick.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} your time</span>
      ${c ? `<div class="mc-count">${[['d', c.d], ['h', c.h], ['m', c.m], ['s', c.s]].map(([k, v]) => `<span><b>${String(v).padStart(2, '0')}</b><i>${k}</i></span>`).join('')}</div>` : '<div class="mc-count"><span><b>Kick-off</b></span></div>'}
      ${st.last && st.last.score?.home != null ? `<span class="mc-last">${st.last.status === 'FINISHED' ? 'Full time' : 'Last'}: ${esc(st.last.home)} ${st.last.score.home}–${st.last.score.away} ${esc(st.last.away)}</span>` : ''}`;
  };
  paint();
  countdownTimer = setInterval(paint, 1000);
}

function renderIntro() {
  const squad = RM_PLAYERS.filter(p => p.status === 'active');
  const newcomers = squad.filter(p => p.isNew);
  $('squad-season').textContent = `Season ${RM_SQUAD_SEASON} · Head coach ${RM_HEAD_COACH}`;
  $('squad-intro').innerHTML =
    `<span data-count="${squad.length}">${squad.length}</span> in the first team, ${newcomers.length} of them new since summer 2025, ` +
    `plus <span data-count="${RM_PLAYERS.length - squad.length}">${RM_PLAYERS.length - squad.length}</span> former players and legends from 2000 onwards. ` +
    `Switch to the table for all <span data-count="${RM_ARCHIVE.length}">${RM_ARCHIVE.length}</span> players who have played for Madrid since 2000.`;
  countUp($('squad-intro'));
  const last = RM_SEASON_MATCHES[RM_SEASON_MATCHES.length - 1];
  $('footer-note').innerHTML =
    `Appearances, goals and assists cover all official competitions and are up to date as of ${esc(RM_SEASON_UPDATED)}` +
    `${last ? ` (after ${last.venue === 'H' ? `Real Madrid ${last.score[0]}-${last.score[1]} ${esc(last.opponent)}` : `${esc(last.opponent)} ${last.score[1]}-${last.score[0]} Real Madrid`})` : ''}. ` +
    `Player and season records come from Wikipedia's Real Madrid pages (CC BY-SA 4.0) and refresh automatically every two hours. ` +
    `Photos are from Wikimedia Commons, credited on each profile. Not affiliated with Real Madrid C.F.`;
}

// ---------- squad ----------

function initSquadControls() {
  const nationSelect = $('nation-select');
  nationSelect.innerHTML = '<option value="all">All</option>' +
    RM_NATIONS.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');

  $('search-input').addEventListener('input', e => {
    state.searchQuery = e.target.value.trim();
    renderSquad();
  });
  nationSelect.addEventListener('change', e => { state.filterNation = e.target.value; renderSquad(); });
  $('sort-select').addEventListener('change', e => { state.sortBy = e.target.value; renderSquad(); });

  bindSegmented('[data-position]', btn => { state.filterPosition = btn.dataset.position; renderSquad(); });
  bindSegmented('[data-status]', btn => { state.filterStatus = btn.dataset.status; renderSquad(); });
  bindSegmented('[data-layout]', btn => { state.layout = btn.dataset.layout; renderSquad(); });

  $('squad-grid').addEventListener('click', e => {
    const card = e.target.closest('[data-player]');
    if (card) openPlayer(card.dataset.player);
    const th = e.target.closest('[data-sort]');
    if (th) {
      const key = th.dataset.sort;
      state.tableSort = { key, dir: state.tableSort.key === key ? -state.tableSort.dir : (key === 'name' || key === 'years' ? 1 : -1) };
      renderSquad();
    }
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
  const haystack = [p.name, p.fullName, p.nationality, p.position, p.currentClub, p.route?.from, p.route?.to,
    ...p.lineage.map(l => l.club)].join(' ');
  return plain(haystack).includes(plain(q));
}

function getFilteredPlayers() {
  return RM_PLAYERS.filter(p =>
    (state.filterPosition === 'all' || p.category === state.filterPosition) &&
    (state.filterStatus === 'all' || p.status === state.filterStatus) &&
    (state.filterNation === 'all' || p.nationality === state.filterNation) &&
    matchesSearch(p, state.searchQuery)
  ).sort((a, b) => {
    const s = state.sortBy;
    if (s === 'name') return a.name.localeCompare(b.name);
    if (s === 'debut') return (Number(a.joinedRealMadrid) || 0) - (Number(b.joinedRealMadrid) || 0) || a.name.localeCompare(b.name);
    if (s === 'trophies') return (trophyCount(b) ?? -1) - (trophyCount(a) ?? -1);
    if (s === 'apps') return (b.stats?.madridApps ?? -1) - (a.stats?.madridApps ?? -1);
    if (s === 'goals') return (b.stats?.madridGoals ?? -1) - (a.stats?.madridGoals ?? -1);
    // shirt number for the squad; most games first for everyone else
    return (a.number ?? 999) - (b.number ?? 999) || (b.stats?.madridApps ?? 0) - (a.stats?.madridApps ?? 0);
  });
}

function cardRoute(p) {
  const years = esc(madridStint(p));
  if (p.status === 'active') {
    return p.route?.from
      ? `Signed from <b>${esc(p.route.from)}</b>, ${esc(p.joinedRealMadrid)}`
      : `Academy graduate, first team ${esc(p.joinedRealMadrid)}`;
  }
  const next = p.status === 'departed' && p.currentClub && p.handWritten
    ? `Now <b class="away">${esc(p.currentClub)}</b>`
    : p.route?.to ? `then <b class="away">${esc(p.route.to)}</b>` : '';
  return `Madrid ${years}${next ? ` · ${next}` : ''}`;
}

function cardMarkup(p) {
  const apps = p.stats?.madridApps;
  return `
    <button type="button" class="card" data-player="${esc(p.id)}" data-reveal aria-label="${esc(p.name)}, open profile">
      <span class="card-photo">
        ${photoMarkup(p)}
        ${p.isNew ? '<span class="card-new">New</span>' : ''}
        ${apps != null ? `<span class="card-apps"><b>${apps}</b> games${p.category !== 'goalkeeper' && p.stats.madridGoals ? ` · <b>${p.stats.madridGoals}</b> goals` : ''}</span>` : ''}
      </span>
      <span class="card-body${p.status !== 'active' ? ' no-number' : ''}">
        ${p.status === 'active' ? `<span class="card-number">${esc(p.number)}</span>` : ''}
        <span class="card-name">${esc(p.name)}</span>
        <span class="card-meta">${esc(p.code)} · ${esc(p.position)}</span>
        <span class="card-route">${cardRoute(p)}</span>
      </span>
    </button>`;
}

function groupsFor(players) {
  if (state.filterStatus !== 'all' && state.filterStatus !== 'departed') {
    return [{ title: STATUS_TITLES[state.filterStatus], players }];
  }
  const groups = [];
  if (state.filterStatus === 'all') {
    groups.push({ title: STATUS_TITLES.active, players: players.filter(p => p.status === 'active') });
    groups.push({ title: STATUS_TITLES.legend, players: players.filter(p => p.status === 'legend') });
  }
  // Former players by the decade they left
  const former = players.filter(p => p.status === 'departed');
  for (const [from, to, label] of [[2020, 2029, 'Left 2020–26'], [2010, 2019, 'Left 2010–19'], [2000, 2009, 'Left 2000–09']]) {
    groups.push({ title: label, players: former.filter(p => p.leftYear >= from && p.leftYear <= to) });
  }
  return groups.filter(g => g.players.length);
}

function renderSquad() {
  const grid = $('squad-grid');
  if (state.layout === 'table') return renderTable();
  const players = getFilteredPlayers();
  $('result-count').textContent = `${players.length} ${players.length === 1 ? 'player' : 'players'}`;

  if (!players.length) {
    grid.innerHTML = `
      <div class="empty">
        <p>Nobody matches that. Try a different name, club or country, or switch to the table, which lists every player since 2000.</p>
        <button type="button" class="btn" data-reset>Clear filters</button>
      </div>`;
    return;
  }

  grid.innerHTML = groupsFor(players).map(g => `
    <section class="squad-group">
      <div class="squad-group-head" data-reveal><h2>${esc(g.title)}</h2><span>${g.players.length}</span></div>
      <div class="grid">${g.players.map(cardMarkup).join('')}</div>
    </section>`).join('');
  reveal(grid);
}

// All 260 players since 2000, as a sortable table.
function archiveRows() {
  const q = plain(state.searchQuery);
  return RM_ARCHIVE.map(a => {
    const p = byId(a.id);
    const status = a.current ? 'active' : RM_LEGENDS.has(a.id) ? 'legend' : 'departed';
    const category = { GK: 'goalkeeper', DF: 'defender', MF: 'midfielder', FW: 'forward' }[a.pos];
    const nation = RM_COUNTRY_NAMES[RM_NAME_TO_CODE[a.code] || a.code] || a.code;
    return { a, p, status, category, nation };
  }).filter(r =>
    // Youth players listed as current who aren't in the numbered first-team squad stay out of "First team"
    !(r.status === 'active' && !r.p) &&
    (state.filterPosition === 'all' || r.category === state.filterPosition) &&
    (state.filterStatus === 'all' || r.status === state.filterStatus) &&
    (state.filterNation === 'all' || r.nation === state.filterNation) &&
    (!q || plain(`${r.a.name} ${r.nation}`).includes(q) || (/^\d+$/.test(q) && String(r.p?.number) === q))
  );
}

function renderTable() {
  const grid = $('squad-grid');
  const rows = archiveRows();
  const { key, dir } = state.tableSort;
  const val = r => key === 'name' ? r.a.name : key === 'years' ? r.a.spans : (r.a[key] ?? -1);
  rows.sort((x, y) => {
    const a = val(x), b = val(y);
    return (typeof a === 'string' ? a.localeCompare(b) : a - b) * dir;
  });
  $('result-count').textContent = `${rows.length} of ${RM_ARCHIVE.length} players since 2000`;
  const th = (k, label, cls = '') => `<th scope="col" class="${cls}"><button type="button" data-sort="${k}" class="${key === k ? 'is-sorted' : ''}">${label}${key === k ? (dir > 0 ? ' ↑' : ' ↓') : ''}</button></th>`;
  grid.innerHTML = `
    <div class="table-wrap" data-reveal>
      <table class="archive-table">
        <thead><tr>
          ${th('name', 'Player')}<th scope="col" class="hide-sm">Pos</th>${th('years', 'At Madrid', 'hide-sm')}
          ${th('apps', 'Games', 'num')}${th('goals', 'Goals', 'num')}${th('assists', 'Assists', 'num hide-sm')}
        </tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr class="${r.p ? 'has-profile' : ''}" ${r.p ? `data-player="${esc(r.p.id)}" tabindex="0"` : ''}>
              <th scope="row">
                <span class="row-name">${esc(r.a.name)}</span>
                <span class="row-meta">${esc(r.nation)}<span class="show-sm"> · ${esc(r.a.pos || '')} · ${esc(r.a.spans)}</span>${r.status === 'active' ? ' · <em>first team</em>' : ''}</span>
              </th>
              <td class="hide-sm">${esc(r.a.pos || '')}</td>
              <td class="hide-sm">${esc(r.a.spans)}</td>
              <td class="num">${statValue(r.a.apps)}</td>
              <td class="num">${statValue(r.a.goals)}</td>
              <td class="num hide-sm">${statValue(r.a.assists)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="stats-note">All official competitions. Players with a profile are clickable. Source: Wikipedia, list revision ${esc(RM_ARCHIVE_UPDATED)}.</p>`;
  grid.querySelectorAll('tr[data-player]').forEach(tr => tr.addEventListener('keydown', e => {
    if (e.key === 'Enter') openPlayer(tr.dataset.player);
  }));
  reveal(grid);
}

function resetFilters() {
  Object.assign(state, { filterPosition: 'all', filterStatus: 'all', filterNation: 'all', searchQuery: '' });
  $('search-input').value = '';
  $('nation-select').value = 'all';
  setSegmented('[data-position]', 'all', 'position');
  setSegmented('[data-status]', 'all', 'status');
  renderSquad();
}

// ---------- seasons ----------

function matchRecord(matches) {
  const r = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 };
  for (const m of matches) {
    r.p++; r.gf += m.score[0]; r.ga += m.score[1];
    if (m.score[0] > m.score[1]) r.w++; else if (m.score[0] < m.score[1]) r.l++; else r.d++;
  }
  return r;
}

function playerLink(id, fallback) {
  const p = byId(id);
  return p ? `<button type="button" class="link-btn" data-player="${esc(id)}">${esc(p.name)}</button>` : esc(fallback || id);
}

function renderSeasons() {
  const now = RM_SEASONS.find(s => s.inProgress);
  const league = RM_SEASON_MATCHES.filter(m => m.comp === 'La Liga');
  const all = matchRecord(RM_SEASON_MATCHES);
  const lg = matchRecord(league);
  const ucl = matchRecord(RM_SEASON_MATCHES.filter(m => m.comp === 'Champions League'));
  const scorers = Object.entries(seasonGoals()).sort((a, b) => b[1] - a[1]);
  const maxGoals = scorers[0]?.[1] || 1;

  $('seasons-kicker').textContent = `${RM_SQUAD_SEASON} so far · updated ${RM_SEASON_UPDATED}`;
  $('seasons-intro').textContent = `This season match by match, then every season since 2000-01: who coached, where the team finished, what they won and who scored the goals.`;

  $('season-now').innerHTML = `
    <div class="now-grid">
      <div class="now-stat" data-reveal><b>${esc(now?.league || '—')}</b><span>in La Liga, ${lg.w * 3 + lg.d} points from ${lg.p} games</span></div>
      <div class="now-stat" data-reveal><b><span data-count="${all.w}">${all.w}</span>–<span data-count="${all.d}">${all.d}</span>–<span data-count="${all.l}">${all.l}</span></b><span>won, drawn, lost in all competitions</span></div>
      <div class="now-stat" data-reveal><b><span data-count="${all.gf}">${all.gf}</span>:<span data-count="${all.ga}">${all.ga}</span></b><span>goals for and against</span></div>
      <div class="now-stat" data-reveal><b>${ucl.w}/${ucl.p}</b><span>Champions League wins, league phase</span></div>
    </div>

    <div class="now-columns">
      <section class="results" aria-labelledby="results-title">
        <h2 class="section-head" id="results-title">Results</h2>
        ${RM_NEXT_MATCH ? `<p class="next-match" data-reveal>Next: <b>${esc(RM_NEXT_MATCH.opponent)}</b> (${RM_NEXT_MATCH.venue === 'H' ? 'home' : 'away'}), ${esc(RM_NEXT_MATCH.comp)}, ${fmtDate(RM_NEXT_MATCH.date)}</p>` : ''}
        <ol class="match-list">
          ${[...RM_SEASON_MATCHES].reverse().map(m => {
            const res = m.score[0] > m.score[1] ? 'w' : m.score[0] < m.score[1] ? 'l' : 'd';
            const goals = {};
            m.scorers.forEach(([id, min]) => { (goals[id] = goals[id] || []).push(min); });
            const scorerText = Object.entries(goals).map(([id, mins]) => id === 'og'
              ? `own goal${mins.length > 1 ? ` ×${mins.length}` : ''}`
              : `${playerLink(id)}${mins.some(Boolean) ? ` <span class="mins">${mins.filter(Boolean).map(x => x > 90 ? `90+${x - 90}'` : `${x}'`).join(', ')}</span>` : mins.length > 1 ? ` ×${mins.length}` : ''}`).join(', ');
            return `
              <li class="match-row res-${res}" data-reveal>
                <span class="match-date">${fmtDate(m.date)}<small>${{ 'La Liga': 'Liga', 'Champions League': 'UCL', 'Copa del Rey': 'Copa', 'Supercopa': 'Super' }[m.comp] || esc(m.comp)}</small></span>
                <span class="match-main">
                  <span class="match-teams">${m.venue === 'H' ? `Real Madrid <b>${m.score[0]}–${m.score[1]}</b> ${esc(m.opponent)}` : `${esc(m.opponent)} <b>${m.score[1]}–${m.score[0]}</b> Real Madrid`}</span>
                  ${scorerText ? `<span class="match-scorers">${scorerText}</span>` : ''}
                  <span class="match-note">${esc(m.note)}</span>
                </span>
                <span class="match-res" aria-label="${res === 'w' ? 'Win' : res === 'l' ? 'Defeat' : 'Draw'}">${res.toUpperCase()}</span>
              </li>`;
          }).join('')}
        </ol>
      </section>

      <section class="scorers" aria-labelledby="scorers-title">
        <h2 class="section-head" id="scorers-title">Goals this season</h2>
        <ol class="bar-list">
          ${scorers.map(([id, g]) => `
            <li data-reveal>
              <span class="bar-label">${playerLink(id)}</span>
              <span class="bar-track"><span class="bar-fill" style="--w:${(g / maxGoals) * 100}%"></span></span>
              <span class="bar-value">${g}</span>
            </li>`).join('')}
        </ol>
        <h2 class="section-head">Most used</h2>
        <ol class="bar-list">
          ${Object.entries(RM_CURRENT_STATS).sort((a, b) => b[1].apps - a[1].apps).slice(0, 10).map(([id, s]) => `
            <li data-reveal>
              <span class="bar-label">${playerLink(id)}</span>
              <span class="bar-track"><span class="bar-fill bar-fill-muted" style="--w:${(s.apps / RM_SEASON_MATCHES.length) * 100}%"></span></span>
              <span class="bar-value">${s.apps}</span>
            </li>`).join('')}
        </ol>
        <p class="stats-note">Appearances from the club's season stats table (FBref), updated ${esc(RM_CURRENT_STATS_UPDATED)}.</p>
      </section>
    </div>`;

  renderHistory();
  reveal($('view-seasons'));
}

function seasonTrophies(s) {
  const won = s.cups.filter(c => /^Winners/i.test(c.result)).map(c => c.name.replace('UEFA ', '').replace('FIFA ', ''));
  if (s.league === '1st' && !s.inProgress) won.unshift('La Liga');
  return won;
}

function renderHistory() {
  const past = RM_SEASONS.filter(s => !s.inProgress);
  const tally = {};
  past.forEach(s => seasonTrophies(s).forEach(t => { tally[t] = (tally[t] || 0) + 1; }));
  const order = ['La Liga', 'Champions League', 'Copa del Rey', 'Supercopa de España', 'Super Cup', 'Club World Cup', 'Intercontinental Cup'];
  const totals = Object.entries(tally).sort((a, b) => (order.indexOf(a[0]) + 1 || 99) - (order.indexOf(b[0]) + 1 || 99));
  const maxT = Math.max(...past.map(s => seasonTrophies(s).length), 1);
  const scorerLink = sc => {
    if (!sc) return '—';
    const names = sc.name.split(' & ').map(n => {
      const p = RM_PLAYERS.find(x => x.name === n || x.archive?.article === n || x.name.endsWith(n));
      return p ? playerLink(p.id) : esc(n);
    });
    return `${names.join(' & ')} <span class="muted">${sc.goals}</span>`;
  };
  const cup = (s, name) => {
    const c = s.cups.find(x => x.name.includes(name));
    if (!c) return '<span class="muted">—</span>';
    return /^Winners/i.test(c.result) ? `<span class="won">Won</span>` : esc(c.result.replace(' (disqualified)', ', disqualified'));
  };

  $('season-history').innerHTML = `
    <h2 class="section-head section-head-big" data-reveal>Since 2000-01</h2>
    <div class="trophy-totals">
      ${totals.map(([t, n]) => `<div class="trophy-total" data-reveal><b data-count="${n}">${n}</b><span>${esc(t)}</span></div>`).join('')}
    </div>

    <div class="trophy-chart" data-reveal aria-label="Trophies won per season">
      ${past.map(s => {
        const won = seasonTrophies(s);
        return `<div class="tc-col" title="${esc(s.season)}: ${won.length ? esc(won.join(', ')) : 'no trophies'}">
          <span class="tc-bar" style="--h:${(won.length / maxT) * 100}%">${won.length ? `<b>${won.length}</b>` : ''}</span>
          <span class="tc-label">${esc(s.season.slice(2, 4))}</span>
        </div>`;
      }).join('')}
    </div>

    <div class="table-wrap">
      <table class="season-table">
        <thead><tr>
          <th scope="col">Season</th><th scope="col">Coach</th><th scope="col">La Liga</th>
          <th scope="col">Champions League</th><th scope="col" class="hide-sm">Copa del Rey</th>
          <th scope="col" class="hide-sm">Other trophies</th><th scope="col">Top scorer</th>
        </tr></thead>
        <tbody>
          ${[...RM_SEASONS].reverse().map(s => {
            const other = seasonTrophies(s).filter(t => !['La Liga', 'Champions League', 'Copa del Rey'].includes(t));
            return `<tr class="${s.inProgress ? 'is-current' : ''}${seasonTrophies(s).length ? ' has-trophy' : ''}" data-reveal>
              <th scope="row">${esc(s.season)}${s.inProgress ? '<small>so far</small>' : ''}</th>
              <td>${s.managers.map(esc).join('<br>')}</td>
              <td>${s.league === '1st' && !s.inProgress ? '<span class="won">Champions</span>' : esc(s.league)}</td>
              <td>${cup(s, 'Champions League')}</td>
              <td class="hide-sm">${cup(s, 'Copa del Rey')}</td>
              <td class="hide-sm">${other.map(esc).join(', ') || '<span class="muted">—</span>'}</td>
              <td>${scorerLink(s.topScorer)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <p class="stats-note">Top scorer counts all competitions. Source: Wikipedia season pages.</p>`;

  $('view-seasons').addEventListener('click', e => {
    const b = e.target.closest('[data-player]');
    if (b) openPlayer(b.dataset.player);
  });
  countUp($('season-history'));
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

function hasTab(p, tab) {
  if (tab === 'matches') return Boolean(p.madridDebut || p.peakPerformances.length);
  if (tab === 'records') return Boolean(p.records.length || p.facts.length);
  return true;
}

function openPlayer(id) {
  const player = byId(id);
  if (!player) return;
  // Opening during a close animation: cancel the pending close
  clearTimeout(state.closeTimer);
  state.closeTimer = null;
  $('player-drawer').classList.remove('is-closing');
  $('drawer-backdrop').classList.remove('is-closing');
  const wasOpen = !$('player-drawer').hidden;
  state.activePlayer = player;
  state.activeTab = 'overview';
  if (!wasOpen) state.lastFocus = document.activeElement;

  $('drawer-photo').innerHTML = photoMarkup(player, { label: false });
  $('drawer-status').textContent = player.statusLabel;
  $('drawer-name').textContent = player.name;
  $('drawer-meta').textContent = [player.number != null && player.status === 'active' ? `No. ${player.number}` : null, player.position, player.nationality]
    .filter(Boolean).join(' · ');
  document.querySelectorAll('.drawer-tabs .tab').forEach(t => { t.hidden = !hasTab(player, t.dataset.tab); });
  const credit = player.photoCredit;
  $('drawer-credit').innerHTML = credit
    ? `Photo: <a href="${esc(credit.page)}" target="_blank" rel="noopener">${esc(credit.artist)}</a>, ${esc(credit.license)}, via Wikimedia Commons`
    : '';

  renderDrawerTab();
  $('drawer-backdrop').hidden = false;
  $('player-drawer').hidden = false;
  document.body.style.overflow = 'hidden';
  $('drawer-close').focus();
}

function closePlayer() {
  const drawer = $('player-drawer');
  if (drawer.hidden || state.closeTimer) return;
  const finish = () => {
    state.closeTimer = null;
    drawer.classList.remove('is-closing');
    $('drawer-backdrop').classList.remove('is-closing');
    $('drawer-backdrop').hidden = true;
    drawer.hidden = true;
    document.body.style.overflow = '';
    state.lastFocus?.focus?.();
  };
  if (reduceMotion) return finish();
  drawer.classList.add('is-closing');
  $('drawer-backdrop').classList.add('is-closing');
  state.closeTimer = setTimeout(finish, 180);
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
  body.innerHTML = `<div class="tab-pane">${{
    overview: overviewTab,
    career: careerTab,
    matches: matchesTab,
    records: recordsTab
  }[state.activeTab](p)}</div>`;
  countUp(body);
}

function seasonBlock(p) {
  const s = p.season;
  if (!s || p.status !== 'active') return '';
  return `
    <h3 class="section-title">${esc(RM_SQUAD_SEASON)} so far</h3>
    <div class="stat-row stat-row-small">
      <div class="stat"><b data-count="${s.apps}">${s.apps}</b><span>Games</span></div>
      <div class="stat"><b data-count="${s.goals}">${s.goals}</b><span>Goals</span></div>
      ${s.byComp.filter(c => c.apps).map(c => `<div class="stat"><b>${c.apps}<small>/${c.goals}</small></b><span>${esc(c.comp.replace('Champions League', 'UCL'))} games/goals</span></div>`).join('')}
    </div>`;
}

function overviewTab(p) {
  const departure = p.status !== 'active' && p.departureDetails ? `
    <div class="note">
      <strong>${p.status === 'departed' ? `Left in ${esc(p.departureYear)}` : 'After Madrid'}</strong>
      ${esc(p.departureDetails)}
    </div>` : '';

  const rows = [
    ['Full name', p.fullName !== p.name ? p.fullName : null],
    ['Born', [p.birthDate, p.birthPlace].filter(Boolean).join(', ')],
    ['Height, foot', [p.height, p.foot && `${p.foot} foot`].filter(Boolean).join(', ')],
    ['At Madrid', madridStint(p)],
    ['Joined', [p.joinedRealMadrid, p.handWritten ? p.transferFee : null].filter(Boolean).join(', ')],
    ['Signed from', p.route?.from || (p.route?.from === null ? 'Academy' : null)],
    [p.status === 'active' ? null : 'Next club', p.status === 'active' ? null : (p.route?.to || null)],
    ['Club now', p.handWritten && p.status !== 'active' ? p.currentClub : null]
  ].filter(([k, v]) => k && v);

  const s = p.stats;
  const isKeeper = p.category === 'goalkeeper';
  const stats = s ? `
    <h3 class="section-title">For Madrid, all competitions</h3>
    <div class="stat-row">
      <div class="stat"><b data-count="${s.madridApps ?? ''}">${statValue(s.madridApps)}</b><span>Games</span></div>
      <div class="stat"><b data-count="${isKeeper ? (s.madridCleanSheets ?? '') : (s.madridGoals ?? '')}">${statValue(isKeeper ? s.madridCleanSheets : s.madridGoals)}</b><span>${isKeeper ? 'Clean sheets' : 'Goals'}</span></div>
      <div class="stat"><b data-count="${s.madridAssists ?? ''}">${statValue(s.madridAssists)}</b><span>Assists</span></div>
      <div class="stat"><b data-count="${s.internationalCaps ?? ''}">${statValue(s.internationalCaps)}</b><span>Caps${s.internationalGoals ? `, ${s.internationalGoals} goals` : ''}</span></div>
    </div>
    ${isKeeper && p.statsCurrent && s.madridCleanSheets != null ? `<p class="stats-note">Clean sheets as of ${esc(RM_STATS_AS_OF)}; other figures up to date as of ${esc(RM_SEASON_UPDATED)}.</p>` : ''}
    ${seasonBlock(p)}
    <h3 class="section-title">Won with Madrid</h3>
    ${s.trophiesMadrid?.length
      ? `<ul class="trophy-list">${s.trophiesMadrid.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`
      : `<p class="muted">${p.status === 'active' ? 'Nothing yet.' : 'No major trophies with Madrid.'}</p>`}
  ` : '';

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
  const lastMadrid = p.lineage.map(l => l.club).lastIndexOf('Real Madrid');
  return `
    <h3 class="section-title">Club by club</h3>
    <ol class="timeline">
      ${p.lineage.map((stage, i) => {
        const cls = stage.club === 'Real Madrid' ? 'is-madrid' : (madridIdx !== -1 && i > lastMadrid ? 'is-after' : '');
        const meta = [stage.country, stage.fee && `Fee: ${stage.fee}`,
          stage.appearances !== undefined && `${stage.appearances} ${p.handWritten ? 'apps' : 'league games'}${stage.goals !== undefined ? `, ${stage.goals} goals` : ''}`]
          .filter(Boolean).join(' · ');
        return `
          <li class="${cls}" style="--i:${i}">
            <span class="tl-years">${esc(stage.years)} · ${esc(stage.stage)}</span>
            <h4 class="tl-club">${esc(stage.club)}</h4>
            ${meta ? `<p class="tl-meta">${esc(meta)}</p>` : ''}
            ${stage.details ? `<p class="tl-text">${esc(stage.details)}</p>` : ''}
          </li>`;
      }).join('')}
    </ol>
    ${p.handWritten ? '' : '<p class="stats-note">Club figures are league games only, from Wikipedia. Madrid totals on the Overview tab include every competition.</p>'}`;
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

// ---------- transfer map ----------

function initRoutes() {
  state.routes = new RM_TransferRoutes({
    frame: $('routes-frame'),
    summary: $('routes-summary'),
    panel: $('routes-panel'),
    timeline: $('routes-timeline'),
    players: RM_PLAYERS,
    onPlayer: openPlayer
  });
  bindSegmented('[data-era]', btn => { state.routes.stop(); state.routes.year = null; state.routes.setYear(null); state.routes.setFilter({ era: btn.dataset.era }); });
  state.routes.onYear = year => { if (year !== null) setSegmented('[data-era]', 'all', 'era'); };
  bindSegmented('[data-route-pos]', btn => state.routes.setFilter({ position: btn.dataset.routePos }));
  $('route-players').innerHTML = state.routes.allPlayers.map(p => `<option value="${esc(p.name)}"></option>`).join('');
  $('route-search').addEventListener('change', e => {
    const p = RM_PLAYERS.find(x => plain(x.name) === plain(e.target.value));
    if (p && state.routes.selectPlayer(p.id)) {
      setSegmented('[data-era]', 'all', 'era');
      setSegmented('[data-route-pos]', 'all', 'routePos');
    }
  });
}

// ---------- training ground: flashcards ----------

function initTrainer() {
  const t = state.trainer;
  $('deck-select').addEventListener('change', e => { t.setDeck(e.target.value); renderFlashcard(); });
  $('flashcard').addEventListener('click', () => { t.toggleFlip(); renderFlashcard(); });
  $('card-next').addEventListener('click', () => { t.nextCard(); renderFlashcard('next'); });
  $('card-prev').addEventListener('click', () => { t.prevCard(); renderFlashcard('prev'); });
  $('card-shuffle').addEventListener('click', () => { t.shuffleDeck(); renderFlashcard('next'); });
  $('card-learned').addEventListener('click', () => { t.toggleLearned(t.getCurrentPlayer().id); renderFlashcard(); });

  document.addEventListener('keydown', e => {
    if (state.view !== 'play' || !$('player-drawer').hidden) return;
    if (e.target.closest('input, select, textarea, .pitch-game')) return;
    if (e.key === 'ArrowRight') { t.nextCard(); renderFlashcard('next'); }
    if (e.key === 'ArrowLeft') { t.prevCard(); renderFlashcard('prev'); }
  });
}

function renderFlashcard(direction) {
  const t = state.trainer;
  const p = t.getCurrentPlayer();
  if (!p) return;

  $('fc-photo').innerHTML = photoMarkup(p);
  $('fc-name').textContent = p.name;
  $('fc-meta').textContent = [p.status === 'active' ? `No. ${p.number}` : madridStint(p), p.position].join(' · ');
  $('fc-back-name').textContent = p.name;
  $('fc-back-nation').textContent = p.nationality;
  $('fc-back-from').textContent = signedFrom(p)?.club || 'Real Madrid academy';
  const route = routeToMadrid(p).map(l => l.club);
  $('fc-back-path').textContent = [...route, 'Real Madrid'].join(' → ');
  $('fc-back-fact').textContent = p.facts[0] || p.bio;

  const card = $('flashcard');
  card.classList.toggle('is-flipped', t.isCardFlipped);
  card.setAttribute('aria-label', t.isCardFlipped ? `Back of card for ${p.name}. Flip back` : `${p.name}. Flip for details`);
  if (direction && !reduceMotion) {
    const scene = card.parentElement;
    scene.classList.remove('deal-next', 'deal-prev');
    void scene.offsetWidth;
    scene.classList.add(direction === 'prev' ? 'deal-prev' : 'deal-next');
  }

  const known = t.isLearned(p.id);
  $('card-learned').classList.toggle('is-on', known);
  $('card-learned').textContent = known ? 'Known ✓' : 'Mark as known';
  $('card-counter').textContent = `Card ${t.currentCardIndex + 1} of ${t.deck.length} · use ← → keys`;
  $('deck-progress').innerHTML = `You know <b>${t.learnedInDeck()}</b> of ${t.deck.length}
    <span class="progress"><span style="--w:${(t.learnedInDeck() / t.deck.length) * 100}%"></span></span>`;
}

// ---------- compare ----------

function initCompare() {
  const groups = [
    ['active', STATUS_TITLES.active, (a, b) => a.number - b.number],
    ['legend', 'Legends', (a, b) => a.name.localeCompare(b.name)],
    ['departed', 'Former players', (a, b) => a.name.localeCompare(b.name)]
  ];
  const options = groups.map(([status, title, sort]) => `
    <optgroup label="${esc(title)}">
      ${RM_PLAYERS.filter(p => p.status === status).sort(sort)
        .map(p => `<option value="${esc(p.id)}">${status === 'active' ? `${esc(p.number)}. ` : ''}${esc(p.name)}</option>`).join('')}
    </optgroup>`).join('');
  $('compare-a').innerHTML = options;
  $('compare-b').innerHTML = options;
  $('compare-a').value = 'mbappe';
  $('compare-b').value = 'cristiano';
  $('compare-a').addEventListener('change', renderCompare);
  $('compare-b').addEventListener('change', renderCompare);
}

function renderCompare() {
  const a = byId($('compare-a').value);
  const b = byId($('compare-b').value);
  if (!a || !b) return;

  const num = v => (typeof v === 'number' ? v : null);
  const perGame = (p, k) => p.stats?.madridApps ? Math.round((p.stats[k] / p.stats.madridApps) * 100) / 100 : null;
  const rows = [
    ['Country', p => p.nationality],
    ['Position', p => p.position],
    ['Born', p => p.birthDate || '—'],
    ['At Madrid', p => madridStint(p)],
    ['Signed from', p => p.route?.from || (p.route?.from === null ? 'Academy' : '—')],
    ['Madrid debut', p => p.madridDebut ? `${p.madridDebut.date} v ${p.madridDebut.opponent}` : '—'],
    ['Games', p => num(p.stats?.madridApps), true],
    ['Goals', p => num(p.stats?.madridGoals), true],
    ['Goals per game', p => perGame(p, 'madridGoals'), true],
    ['Assists', p => num(p.stats?.madridAssists), true],
    ['Trophies with Madrid', p => trophyCount(p), true],
    ['International caps', p => num(p.stats?.internationalCaps), true],
    ['Route to Madrid', p => [...routeToMadrid(p).map(l => l.club), 'Real Madrid'].join(' → ')]
  ];

  const head = p => `
    <div class="compare-head">
      <div class="quiz-photo">${photoMarkup(p, { label: false })}</div>
      <div><strong>${esc(p.name)}</strong><span>${esc(p.statusLabel)}</span></div>
    </div>`;

  $('compare-output').innerHTML = `
    <table class="compare-table">
      <thead><tr><th></th><th>${head(a)}</th><th>${head(b)}</th></tr></thead>
      <tbody>
        ${rows.map(([label, get, numeric]) => {
          const va = get(a), vb = get(b);
          const leadA = numeric && va !== null && vb !== null && va > vb;
          const leadB = numeric && va !== null && vb !== null && vb > va;
          const max = numeric && va !== null && vb !== null ? Math.max(va, vb) || 1 : null;
          const cell = (v, lead) => `<td class="${lead ? 'lead' : ''}">${esc(statValue(v))}${max !== null ? `<span class="cmp-bar"><span style="--w:${(v / max) * 100}%"></span></span>` : ''}</td>`;
          return `<tr><th scope="row">${label}</th>${cell(va, leadA)}${cell(vb, leadB)}</tr>`;
        }).join('')}
      </tbody>
    </table>
    <p class="stats-note">Madrid figures cover all official competitions, up to date as of ${esc(RM_SEASON_UPDATED)}.</p>`;
}

window.openPlayer = openPlayer;
