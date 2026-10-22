// Transfer map: a flow diagram from the country each player was signed from,
// through Real Madrid, to where they went next. Built as SVG so it stays sharp
// and every band is a real, focusable element. On narrow screens it switches to
// two ranked lists, since a 3-column flow doesn't fit a phone.

const ROUTES_ACADEMY = 'Madrid academy';
const ROUTES_STILL_HERE = 'Still at Madrid';
const ROUTES_NO_CLUB = 'Retired / no club';
const SVG_NS = 'http://www.w3.org/2000/svg';
const ROUTES_FIRST_YEAR = 2000;
const ROUTES_LAST_YEAR = 2026;

const yearsOf = p => ((p.madridYears || p.joinedRealMadrid || '').match(/\d{4}/g) || []).map(Number);
const joinedYear = p => Math.min(...yearsOf(p));
// Season-based spans: "2009–2018" means the last season was 2017-18, so they left in 2018.
const leftYear = p => (p.status === 'active' || /–\s*$/.test(p.madridYears || '')) ? null : Math.max(...yearsOf(p));

class RM_TransferRoutes {
  constructor({ frame, summary, panel, timeline, players, onPlayer }) {
    this.frame = frame;
    this.timeline = timeline;
    this.year = null; // null = all years; a number = the club as it stood at the end of that year
    this.playing = null;
    this.summary = summary;
    this.panel = panel;
    this.allPlayers = players.filter(p => p.route && p.route.from !== undefined);
    this.onPlayer = onPlayer;
    this.era = 'all';
    this.position = 'all';
    this.selection = null; // { side: 'from'|'to', key } or { player }
    this.drawn = false;
    new ResizeObserver(() => this.render()).observe(frame);
    this.buildTimeline();
  }

  // ---------- timeline ----------

  buildTimeline() {
    if (!this.timeline) return;
    const years = [];
    for (let y = ROUTES_FIRST_YEAR; y <= ROUTES_LAST_YEAR; y++) years.push(y);
    const arrivals = y => this.allPlayers.filter(p => joinedYear(p) === y).length;
    const max = Math.max(...years.map(arrivals), 1);
    this.timeline.innerHTML = `
      <button type="button" class="tl-play magnetic" data-play aria-label="Play the years">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path class="i-play" d="M7 4v16l13-8z" fill="currentColor"/><path class="i-pause" d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor"/></svg>
      </button>
      <div class="tl-year"><b id="tl-year-num">2000–26</b><span id="tl-year-sub">all years</span></div>
      <div class="tl-track">
        <div class="tl-bars">${years.map(y => `<button type="button" class="tl-bar" data-year="${y}" style="--h:${(arrivals(y) / max) * 100}%" title="${y}: ${arrivals(y)} arrivals"><span></span></button>`).join('')}</div>
        <input type="range" class="tl-range" min="${ROUTES_FIRST_YEAR}" max="${ROUTES_LAST_YEAR}" value="${ROUTES_LAST_YEAR}" aria-label="Year">
        <div class="tl-ticks"><span>2000</span><span>2010</span><span>2020</span><span>2026</span></div>
      </div>
      <button type="button" class="text-btn" data-all-years>All years</button>`;
    this.timeline.querySelector('[data-play]').addEventListener('click', () => this.togglePlay());
    this.timeline.querySelector('.tl-range').addEventListener('input', e => { this.stop(); this.setYear(Number(e.target.value)); });
    this.timeline.querySelectorAll('.tl-bar').forEach(b => b.addEventListener('click', () => { this.stop(); this.setYear(Number(b.dataset.year)); }));
    this.timeline.querySelector('[data-all-years]').addEventListener('click', () => { this.stop(); this.setYear(null); });
  }

  setYear(year) {
    this.year = year;
    this.selection = null;
    if (year !== null) { this.era = 'all'; }
    const num = this.timeline?.querySelector('#tl-year-num');
    if (num) {
      num.textContent = year ?? '2000–26';
      this.timeline.querySelector('#tl-year-sub').textContent = year === null ? 'all years' : 'the club at the end of the year';
      this.timeline.querySelector('.tl-range').value = year ?? ROUTES_LAST_YEAR;
      this.timeline.querySelectorAll('.tl-bar').forEach(b => {
        b.classList.toggle('is-current', Number(b.dataset.year) === year);
        b.classList.toggle('is-past', year !== null && Number(b.dataset.year) < year);
      });
      num.classList.remove('tick-in'); void num.offsetWidth; num.classList.add('tick-in');
    }
    if (this.onYear) this.onYear(year);
    this.render();
  }

  togglePlay() {
    if (this.playing) { this.stop(); return; }
    this.timeline.classList.add('is-playing');
    let y = this.year === null || this.year >= ROUTES_LAST_YEAR ? ROUTES_FIRST_YEAR : this.year + 1;
    this.setYear(y);
    this.playing = setInterval(() => {
      y++;
      if (y > ROUTES_LAST_YEAR) { this.stop(); return; }
      this.setYear(y);
    }, 1700);
  }

  stop() {
    clearInterval(this.playing);
    this.playing = null;
    this.timeline?.classList.remove('is-playing');
  }

  // ---------- data ----------

  origin(p) {
    return p.route.from === null ? ROUTES_ACADEMY : clubCountry(p.route.from);
  }

  destination(p) {
    if (p.status === 'active') return ROUTES_STILL_HERE;
    if (this.year !== null && (leftYear(p) === null || leftYear(p) > this.year)) return ROUTES_STILL_HERE;
    return p.route.to ? clubCountry(p.route.to) : ROUTES_NO_CLUB;
  }

  players() {
    return this.allPlayers.filter(p => {
      const joined = joinedYear(p);
      if (this.year !== null && joined > this.year) return false;
      if (this.era !== 'all' && !(joined >= Number(this.era) && joined < Number(this.era) + 10)) return false;
      if (this.position !== 'all' && p.category !== this.position) return false;
      return true;
    });
  }

  groups(players, side) {
    const map = new Map();
    for (const p of players) {
      const key = side === 'from' ? this.origin(p) : this.destination(p);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    // Biggest first, but keep the "special" buckets at the end of their column
    const special = [ROUTES_ACADEMY, ROUTES_STILL_HERE, ROUTES_NO_CLUB];
    return [...map.entries()]
      .map(([key, list]) => ({ key, players: list }))
      .sort((a, b) => (special.includes(a.key) - special.includes(b.key)) || b.players.length - a.players.length || a.key.localeCompare(b.key));
  }

  setFilter({ era, position }) {
    if (era) this.era = era;
    if (position) this.position = position;
    this.selection = null;
    this.drawn = false;
    this.render();
  }

  selectPlayer(id) {
    const p = this.allPlayers.find(x => x.id === id);
    if (!p) return false;
    this.stop();
    if (this.year !== null) this.setYear(null);
    this.era = 'all';
    this.position = 'all';
    this.selection = { player: p };
    this.render();
    return true;
  }

  isLit(p) {
    const s = this.selection;
    if (!s) return true;
    if (s.player) return s.player === p;
    if (s.band) return this.origin(p) === s.band.from && this.destination(p) === s.band.to;
    return (s.side === 'from' ? this.origin(p) : this.destination(p)) === s.key;
  }

  // ---------- render ----------

  render() {
    const players = this.players();
    this.renderSummary(players);
    const wide = this.frame.clientWidth >= 720;
    this.frame.classList.toggle('is-list', !wide);
    if (wide) this.renderFlow(players);
    else this.renderLists(players);
    this.renderPanel(players);
  }

  renderSummary(players) {
    const from = this.groups(players, 'from');
    const to = this.groups(players, 'to').filter(g => g.key !== ROUTES_STILL_HERE && g.key !== ROUTES_NO_CLUB);
    const academy = players.filter(p => p.route.from === null).length;
    if (this.year !== null) {
      const atClub = players.filter(p => this.destination(p) === ROUTES_STILL_HERE).length;
      const ins = this.allPlayers.filter(p => joinedYear(p) === this.year).length;
      const outs = this.allPlayers.filter(p => leftYear(p) === this.year).length;
      const stat = (n, label) => `<div class="routes-stat"><b>${n}</b><span>${label}</span></div>`;
      this.summary.innerHTML = stat(ins, `arrived in ${this.year}`) + stat(outs, `left in ${this.year}`) +
        stat(atClub, 'regulars at the club') + stat(academy, 'academy graduates so far');
      return;
    }
    const topFrom = from.find(g => g.key !== ROUTES_ACADEMY);
    const stat = (n, label) => `<div class="routes-stat"><b data-count="${n}">${n}</b><span>${label}</span></div>`;
    this.summary.innerHTML = [
      stat(players.length, 'players on the map'),
      stat(academy, 'came through the academy'),
      topFrom ? stat(topFrom.players.length, `signed from ${topFrom.key}, the top source`) : '',
      to[0] ? stat(to[0].players.length, `left for ${to[0].key}, the top destination`) : ''
    ].join('');
  }

  renderFlow(players) {
    const W = this.frame.clientWidth;
    const left = this.groups(players, 'from');
    const right = this.groups(players, 'to');
    const n = players.length || 1;
    const rows = Math.max(left.length, right.length);
    const gap = 10;
    const H = Math.max(420, Math.min(900, n * 5.2 + rows * gap + 40));
    const pad = { top: 20, bottom: 20 };
    const nodeW = 12;
    const labelW = Math.min(190, W * 0.2);
    const x0 = labelW, x1 = W / 2 - 18, x2 = W / 2 + 18, x3 = W - labelW;
    const usable = H - pad.top - pad.bottom;
    const k = Math.min((usable - (rows - 1) * gap) / n, 9);

    const layout = (groups) => {
      const total = groups.reduce((s, g) => s + g.players.length * k, 0) + (groups.length - 1) * gap;
      let y = pad.top + (usable - total) / 2;
      return groups.map(g => { const h = g.players.length * k; const node = { ...g, y, h }; y += h + gap; return node; });
    };
    const L = layout(left), R = layout(right);
    const mh = n * k, my = pad.top + (usable - mh) / 2;

    // Order strands so none cross outside the Madrid bar: within an origin, players are
    // stacked by destination (and the same order is used on the bar's left edge);
    // within a destination, by origin (same order on the bar's right edge).
    const li = new Map(L.map((g, i) => [g.key, i]));
    const ri = new Map(R.map((g, i) => [g.key, i]));
    const order = new Map(players.map(p => [p, {}]));
    const byDest = (a, b) => ri.get(this.destination(a)) - ri.get(this.destination(b)) || a.name.localeCompare(b.name);
    const byOrigin = (a, b) => li.get(this.origin(a)) - li.get(this.origin(b)) || a.name.localeCompare(b.name);
    let cy = my;
    for (const g of L) {
      let y = g.y;
      for (const p of [...g.players].sort(byDest)) { order.get(p).fromY = y; order.get(p).inY = cy; y += k; cy += k; }
    }
    cy = my;
    for (const g of R) {
      let y = g.y;
      for (const p of [...g.players].sort(byOrigin)) { order.get(p).toY = y; order.get(p).outY = cy; y += k; cy += k; }
    }
    const curve = (xa, ya, xb, yb, h) => {
      const xm = (xa + xb) / 2;
      return `M${xa},${ya}C${xm},${ya} ${xm},${yb} ${xb},${yb}L${xb},${yb + h}C${xm},${yb + h} ${xm},${ya + h} ${xa},${ya + h}Z`;
    };

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Flow of players from the country they were signed from, through Real Madrid, to where they went');
    svg.classList.add('routes-svg');
    if (!this.drawn) svg.classList.add('is-entering');

    const gBands = document.createElementNS(SVG_NS, 'g');
    for (const p of players) {
      const o = order.get(p);
      const lit = this.isLit(p);
      for (const [side, d] of [['in', curve(x0 + nodeW, o.fromY, x1, o.inY, k)], ['out', curve(x2, o.outY, x3 - nodeW, o.toY, k)]]) {
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', d);
        const fresh = this.year !== null && ((side === 'in' && joinedYear(p) === this.year) || (side === 'out' && leftYear(p) === this.year));
        path.setAttribute('class', `band band-${side}${lit ? ' is-lit' : ''}${this.selection && lit ? ' is-selected' : ''}${fresh ? ' is-fresh' : ''}`);
        path.dataset.player = p.id;
        gBands.appendChild(path);
      }
    }
    svg.appendChild(gBands);

    // A ball travels along each band that changed this year
    if (this.year !== null && !Motion.reduced) {
      const mid = (xa, ya, xb, yb) => { const xm = (xa + xb) / 2; return `M${xa},${ya}C${xm},${ya} ${xm},${yb} ${xb},${yb}`; };
      const gBalls = document.createElementNS(SVG_NS, 'g');
      gBalls.setAttribute('class', 'balls');
      let n = 0;
      for (const p of players) {
        const o = order.get(p);
        const legs = [];
        if (joinedYear(p) === this.year) legs.push(['in', mid(x0 + nodeW, o.fromY + k / 2, x1, o.inY + k / 2)]);
        if (leftYear(p) === this.year) legs.push(['out', mid(x2, o.outY + k / 2, x3 - nodeW, o.toY + k / 2)]);
        for (const [side, d] of legs) {
          const ball = document.createElementNS(SVG_NS, 'circle');
          ball.setAttribute('r', Math.max(3.5, Math.min(6, k * 0.7)));
          ball.setAttribute('class', `ball ball-${side}`);
          ball.innerHTML = `<animateMotion dur="1.3s" begin="${(n++ % 8) * 0.08}s" fill="freeze" path="${d}" calcMode="spline" keySplines="0.3 0 0.2 1" keyTimes="0;1"/>`;
          gBalls.appendChild(ball);
        }
      }
      svg.appendChild(gBalls);
    }

    const node = (g, x, side) => {
      const grp = document.createElementNS(SVG_NS, 'g');
      grp.setAttribute('class', 'node' + (this.selection?.key === g.key && this.selection.side === side ? ' is-selected' : ''));
      grp.setAttribute('tabindex', '0');
      grp.setAttribute('role', 'button');
      grp.setAttribute('aria-label', `${g.key}: ${g.players.length} players`);
      grp.dataset.side = side;
      grp.dataset.key = g.key;
      // Invisible hit area covering the label and the bar, so small countries are easy to tap
      const hit = document.createElementNS(SVG_NS, 'rect');
      const hitH = Math.max(g.h, 22);
      hit.setAttribute('class', 'hit');
      hit.setAttribute('x', side === 'from' ? x - labelW + 4 : x - nodeW);
      hit.setAttribute('y', g.y + g.h / 2 - hitH / 2);
      hit.setAttribute('width', labelW - 4 + nodeW);
      hit.setAttribute('height', hitH);
      grp.appendChild(hit);
      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('class', 'bar');
      rect.setAttribute('x', side === 'from' ? x : x - nodeW);
      rect.setAttribute('y', g.y);
      rect.setAttribute('width', nodeW);
      rect.setAttribute('height', Math.max(g.h, 2));
      grp.appendChild(rect);
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', side === 'from' ? x - 8 : x + 8);
      text.setAttribute('y', g.y + g.h / 2);
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('text-anchor', side === 'from' ? 'end' : 'start');
      text.innerHTML = `<tspan class="node-name">${esc(g.key)}</tspan><tspan class="node-count" dx="6">${g.players.length}</tspan>`;
      grp.appendChild(text);
      return grp;
    };
    L.forEach(g => svg.appendChild(node(g, x0, 'from')));
    R.forEach(g => svg.appendChild(node(g, x3, 'to')));

    const centre = document.createElementNS(SVG_NS, 'g');
    centre.setAttribute('class', 'centre');
    centre.innerHTML = `<rect x="${x1}" y="${my}" width="${x2 - x1}" height="${mh}" rx="3"></rect>
      <text x="${W / 2}" y="${my - 8}" text-anchor="middle">Real Madrid</text>`;
    svg.appendChild(centre);

    const heads = document.createElementNS(SVG_NS, 'g');
    heads.setAttribute('class', 'col-heads');
    heads.innerHTML = `<text x="${x0}" y="12" text-anchor="end">Signed from</text><text x="${x3}" y="12">Went to</text>`;
    svg.appendChild(heads);

    this.frame.replaceChildren(svg);
    this.bindSvg(svg);
    this.drawn = true;
  }

  bindSvg(svg) {
    const pick = (el) => {
      const nodeEl = el.closest('.node');
      if (nodeEl) {
        const same = this.selection?.key === nodeEl.dataset.key && this.selection.side === nodeEl.dataset.side;
        this.selection = same ? null : { side: nodeEl.dataset.side, key: nodeEl.dataset.key };
        this.render();
        return;
      }
      const band = el.closest('.band');
      if (band) {
        const p = this.allPlayers.find(x => x.id === band.dataset.player);
        const key = { from: this.origin(p), to: this.destination(p) };
        const same = this.selection?.band && this.selection.band.from === key.from && this.selection.band.to === key.to;
        this.selection = same ? null : { band: key };
        this.render();
        return;
      }
      if (this.selection) { this.selection = null; this.render(); }
    };
    svg.addEventListener('click', e => pick(e.target));
    svg.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.node')) { e.preventDefault(); pick(e.target); }
    });
    // Hover preview of a node's flows (desktop)
    svg.addEventListener('pointerover', e => {
      const nodeEl = e.target.closest('.node');
      svg.querySelectorAll('.band.is-hover').forEach(b => b.classList.remove('is-hover'));
      if (!nodeEl) return;
      for (const p of this.players()) {
        const k = nodeEl.dataset.side === 'from' ? this.origin(p) : this.destination(p);
        if (k === nodeEl.dataset.key) svg.querySelectorAll(`.band[data-player="${p.id}"]`).forEach(b => b.classList.add('is-hover'));
      }
      svg.classList.add('has-hover');
    });
    svg.addEventListener('pointerleave', () => {
      svg.classList.remove('has-hover');
      svg.querySelectorAll('.band.is-hover').forEach(b => b.classList.remove('is-hover'));
    });
  }

  renderLists(players) {
    const max = Math.max(1, ...this.groups(players, 'from').map(g => g.players.length), ...this.groups(players, 'to').map(g => g.players.length));
    const list = (side, title) => `
      <div class="route-list">
        <h3>${title}</h3>
        <ol>
          ${this.groups(players, side).map(g => `
            <li>
              <button type="button" class="route-row${this.selection?.key === g.key && this.selection.side === side ? ' is-selected' : ''}" data-side="${side}" data-key="${esc(g.key)}">
                <span class="route-row-name">${esc(g.key)}</span>
                <span class="route-row-bar"><span style="--w:${(g.players.length / max) * 100}%"></span></span>
                <span class="route-row-count">${g.players.length}</span>
              </button>
            </li>`).join('')}
        </ol>
      </div>`;
    this.frame.innerHTML = list('from', 'Signed from') + list('to', 'Went to');
    this.frame.querySelectorAll('.route-row').forEach(btn => btn.addEventListener('click', () => {
      const same = this.selection?.key === btn.dataset.key && this.selection.side === btn.dataset.side;
      this.selection = same ? null : { side: btn.dataset.side, key: btn.dataset.key };
      this.render();
      if (!same) this.panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }));
  }

  renderPanel(players) {
    const s = this.selection;
    if (!s && this.year !== null) {
      const ins = this.allPlayers.filter(p => joinedYear(p) === this.year);
      const outs = this.allPlayers.filter(p => leftYear(p) === this.year);
      const chip = (p, dir) => `
        <li><button type="button" class="route-player" data-player="${esc(p.id)}">
          <span class="route-player-photo">${photoMarkup(p, { label: false })}</span>
          <span class="route-player-text"><b>${esc(p.name)}</b>
            <span>${dir === 'in' ? `from ${esc(p.route.from || 'the academy')}` : `to ${esc(p.route.to || 'retirement / no club')}`}</span></span>
        </button></li>`;
      this.panel.innerHTML = `
        <div class="year-panel">
          <div><h3 class="yp-title"><span class="yp-in">In</span> ${this.year}</h3><ul class="route-players">${ins.map(p => chip(p, 'in')).join('') || '<li class="muted">No new first-team regulars.</li>'}</ul></div>
          <div><h3 class="yp-title"><span class="yp-out">Out</span> ${this.year}</h3><ul class="route-players">${outs.map(p => chip(p, 'out')).join('') || '<li class="muted">Nobody left.</li>'}</ul></div>
        </div>`;
      this.panel.querySelectorAll('.route-player').forEach(b => b.addEventListener('click', () => this.onPlayer(b.dataset.player)));
      return;
    }
    if (!s) {
      this.panel.innerHTML = `<p class="routes-hint">Press play to watch the years go by, or tap a country${this.frame.classList.contains('is-list') ? '' : ' or a band'} to see the players behind it.</p>`;
      return;
    }
    let title, list;
    if (s.player) {
      list = [s.player];
      title = `${s.player.name}: ${this.origin(s.player)} → Real Madrid → ${this.destination(s.player)}`;
    } else if (s.band) {
      list = players.filter(p => this.isLit(p));
      title = `${s.band.from} → Real Madrid → ${s.band.to}`;
    } else {
      list = players.filter(p => this.isLit(p));
      title = s.side === 'from' ? `Signed from ${s.key}` : s.key === ROUTES_STILL_HERE ? 'Still at the club' : s.key === ROUTES_NO_CLUB ? 'Retired or without a club after Madrid' : `Went to ${s.key}`;
    }
    list = [...list].sort((a, b) => (Number(a.joinedRealMadrid) || 0) - (Number(b.joinedRealMadrid) || 0));
    this.panel.innerHTML = `
      <div class="routes-panel-head">
        <h3>${esc(title)}</h3>
        <button type="button" class="text-btn" data-clear>Clear</button>
      </div>
      <ul class="route-players">
        ${list.map((p, i) => `
          <li style="--i:${i}">
            <button type="button" class="route-player" data-player="${esc(p.id)}">
              <span class="route-player-photo">${photoMarkup(p, { label: false })}</span>
              <span class="route-player-text">
                <b>${esc(p.name)}</b>
                <span>${esc(madridStint(p))} · ${esc(p.route.from || 'Academy')} → ${esc(p.status === 'active' ? 'still here' : (p.route.to || 'retired / no club'))}</span>
              </span>
            </button>
          </li>`).join('')}
      </ul>`;
    this.panel.querySelector('[data-clear]').addEventListener('click', () => { this.selection = null; this.render(); });
    this.panel.querySelectorAll('.route-player').forEach(b => b.addEventListener('click', () => this.onPlayer(b.dataset.player)));
  }
}

window.RM_TransferRoutes = RM_TransferRoutes;
