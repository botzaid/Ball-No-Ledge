// Career map: force-directed network of players, their countries, the club
// Madrid signed them from and (for players who left) where they went next.
// Plain canvas, no dependencies.

const MAP_COLORS = {
  ink: '#16150f',
  ink2: '#4a473f',
  muted: '#7b766b',
  rule: 'rgba(22, 21, 15, 0.14)',
  paper: '#fffdf8',
  paper2: '#ebe6da',
  accent: '#1b3a8c',
  away: '#9b4a24',
  legend: '#a87b1f'
};

const DRAG_THRESHOLD = 6; // px a pointer may move and still count as a tap

// Names football fans actually use, where "last word of the name" gets it wrong.
const MAP_SHORT_NAMES = { vinicius: 'Vinícius', rodrygo: 'Rodrygo', brahim: 'Brahim', bernardo: 'Bernardo', cristiano: 'Ronaldo', nacho: 'Nacho' };

function destinationLabel(player) {
  const club = (player.currentClub || '').replace(/\s*\(.*\)\s*$/, '');
  if (/^retired/i.test(club)) return 'Retired';
  if (/^(free agent|left )/i.test(club)) return 'Without a club';
  return club;
}

class RM_LineageMindmap {
  constructor(canvasId, containerId, players) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    this.ctx = this.canvas.getContext('2d');
    this.players = players;

    this.nodes = [];
    this.links = [];
    this.hoveredNode = null;
    this.filterMode = 'all';
    this.running = false;
    this.frame = null;

    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.pointers = new Map();
    this.gesture = null;

    this.crestImg = new Image();
    this.crestImg.src = 'images/real-madrid-crest.svg';
    this.photoCache = new Map();

    this.resize();
    this.buildGraph();
    this.warmUp(300);
    this.fitView();
    this.bindEvents();
  }

  // ---------- setup ----------

  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const prevW = this.width, prevH = this.height;
    this.width = Math.max(rect.width, 300);
    this.height = Math.max(rect.height, 300);
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (prevW) {
      // keep the same world point in the middle of the screen
      this.panX += (this.width - prevW) / 2;
      this.panY += (this.height - prevH) / 2;
    }
    this.draw();
  }

  photoFor(player) {
    if (!player.headshot) return null;
    let img = this.photoCache.get(player.id);
    if (!img) {
      img = new Image();
      img.src = player.headshot;
      img.onload = () => this.draw();
      this.photoCache.set(player.id, img);
    }
    return img.complete && img.naturalWidth ? img : null;
  }

  buildGraph() {
    const hub = { id: 'hub', type: 'hub', label: 'Real Madrid', radius: 34, x: 0, y: 0, vx: 0, vy: 0, fixed: true };
    this.nodes.push(hub);

    const nations = [...new Set(this.players.map(p => p.nationality))];
    const nationNodes = {};
    nations.forEach((nat, i) => {
      const a = (i / nations.length) * Math.PI * 2;
      const node = { id: `nat-${nat}`, type: 'nation', label: nat, short: (this.players.find(p => p.nationality === nat).code), radius: 17, x: Math.cos(a) * 480, y: Math.sin(a) * 480, vx: 0, vy: 0, fixed: true };
      nationNodes[nat] = node;
      this.nodes.push(node);
    });

    const clubNodes = new Map();
    const clubNode = (key, type, label, near) => {
      if (!clubNodes.has(key)) {
        const node = { id: key, type, label, radius: type === 'feeder' ? 9 : 11, x: near.x + (Math.random() - 0.5) * 120, y: near.y + (Math.random() - 0.5) * 120, vx: 0, vy: 0, players: [] };
        clubNodes.set(key, node);
        this.nodes.push(node);
      }
      return clubNodes.get(key);
    };

    this.players.forEach((player, i) => {
      const nat = nationNodes[player.nationality];
      const a = (i / this.players.length) * Math.PI * 2;
      const node = {
        id: `player-${player.id}`, type: 'player', player, label: player.name,
        radius: 15, x: nat.x * 0.8 + Math.cos(a * 7) * 60, y: nat.y * 0.8 + Math.sin(a * 7) * 60, vx: 0, vy: 0
      };
      this.nodes.push(node);
      this.links.push({ a: hub, b: node, kind: 'roster', length: 170 });
      this.links.push({ a: nat, b: node, kind: 'nation', length: 90 });

      const from = signedFrom(player);
      if (from) {
        const feeder = clubNode(`from-${from.club}`, 'feeder', from.club, node);
        feeder.players.push(player);
        this.links.push({ a: feeder, b: node, kind: 'from', length: 60, label: player.transferFee });
      }

      if (player.status === 'departed') {
        const dest = destinationLabel(player);
        const destNode = clubNode(`to-${dest}`, 'destination', dest, node);
        destNode.players.push(player);
        this.links.push({ a: node, b: destNode, kind: 'to', length: 80, label: `Left ${player.departureYear || ''}`.trim() });
      }
    });
  }

  // ---------- visibility ----------

  setFilter(mode) {
    this.filterMode = mode;
    this.warmUp(60);
    this.draw();
  }

  playerVisible(player) {
    return this.filterMode === 'all' || player.status === this.filterMode;
  }

  isHidden(node) {
    if (node.type === 'player') return !this.playerVisible(node.player);
    if (node.type === 'feeder' || node.type === 'destination') return !node.players.some(p => this.playerVisible(p));
    if (node.type === 'nation') return !this.players.some(p => p.nationality === node.label && this.playerVisible(p));
    return false;
  }

  // ---------- physics ----------

  step() {
    const visible = this.nodes.filter(n => !this.isHidden(n));

    for (const link of this.links) {
      // Hub spokes are only drawn on hover; as springs they crush everyone into the middle.
      if (link.kind === 'roster') continue;
      if (this.isHidden(link.a) || this.isHidden(link.b)) continue;
      const dx = link.b.x - link.a.x;
      const dy = link.b.y - link.a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - link.length) * 0.02;
      const fx = (dx / dist) * force, fy = (dy / dist) * force;
      if (!link.a.fixed) { link.a.vx += fx; link.a.vy += fy; }
      if (!link.b.fixed) { link.b.vx -= fx; link.b.vy -= fy; }
    }

    for (let i = 0; i < visible.length; i++) {
      const n1 = visible[i];
      for (let j = i + 1; j < visible.length; j++) {
        const n2 = visible[j];
        const dx = n2.x - n1.x, dy = n2.y - n1.y;
        const distSq = dx * dx + dy * dy || 0.01;
        if (distSq > 90000) continue;
        const dist = Math.sqrt(distSq);
        const minGap = n1.radius + n2.radius + 26;
        const push = (1400 / distSq) + (dist < minGap ? (minGap - dist) * 0.3 : 0);
        const rx = (dx / dist) * push, ry = (dy / dist) * push;
        if (!n1.fixed) { n1.vx -= rx; n1.vy -= ry; }
        if (!n2.fixed) { n2.vx += rx; n2.vy += ry; }
      }
    }

    let energy = 0;
    for (const n of visible) {
      if (n.fixed) continue;
      n.vx -= n.x * 0.0004;
      n.vy -= n.y * 0.0004;
      n.vx *= 0.82;
      n.vy *= 0.82;
      n.x += n.vx;
      n.y += n.vy;
      energy += n.vx * n.vx + n.vy * n.vy;
    }
    return energy;
  }

  warmUp(iterations) {
    for (let i = 0; i < iterations; i++) this.step();
  }

  // Animate only while the map is on screen and still moving.
  start() {
    this.running = true;
    this.resize();
    this.kick();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  kick() {
    if (!this.running || this.frame) return;
    let budget = 400; // frames; stops a layout that never fully settles from spinning forever
    const tick = () => {
      const energy = this.step();
      this.draw();
      budget--;
      this.frame = (this.gesture || (energy > 0.05 && budget > 0)) ? requestAnimationFrame(tick) : null;
    };
    this.frame = requestAnimationFrame(tick);
  }

  // ---------- view transform ----------

  fitView() {
    const visible = this.nodes.filter(n => !this.isHidden(n));
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of visible) {
      minX = Math.min(minX, n.x - 40); maxX = Math.max(maxX, n.x + 40);
      minY = Math.min(minY, n.y - 30); maxY = Math.max(maxY, n.y + 40);
    }
    const pad = 60;
    // Don't shrink below a size where faces are still tappable; on phones you pan instead.
    this.scale = Math.min(1.4, Math.max(0.5, Math.min((this.width - pad) / (maxX - minX), (this.height - pad * 2) / (maxY - minY))));
    this.panX = this.width / 2 - ((minX + maxX) / 2) * this.scale;
    this.panY = this.height / 2 - ((minY + maxY) / 2) * this.scale + 10;
    this.draw();
  }

  zoomAt(sx, sy, factor) {
    const next = Math.min(Math.max(this.scale * factor, 0.2), 3);
    this.panX = sx - (sx - this.panX) * (next / this.scale);
    this.panY = sy - (sy - this.panY) * (next / this.scale);
    this.scale = next;
    this.draw();
  }

  zoomIn() { this.zoomAt(this.width / 2, this.height / 2, 1.25); }
  zoomOut() { this.zoomAt(this.width / 2, this.height / 2, 0.8); }
  resetView() { this.fitView(); }

  toWorld(sx, sy) {
    return { x: (sx - this.panX) / this.scale, y: (sy - this.panY) / this.scale };
  }

  localPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  nodeAt(sx, sy) {
    const w = this.toWorld(sx, sy);
    const slop = 8 / this.scale;
    // Nearest node wins, so a tap between two close nodes picks the one aimed at.
    let best = null, bestDist = Infinity;
    for (const n of this.nodes) {
      if (this.isHidden(n)) continue;
      const d = Math.hypot(w.x - n.x, w.y - n.y);
      if (d <= n.radius + slop && d < bestDist) { best = n; bestDist = d; }
    }
    return best;
  }

  // ---------- input ----------

  bindEvents() {
    new ResizeObserver(() => { if (this.running) this.resize(); }).observe(this.container);

    const c = this.canvas;
    c.addEventListener('pointerdown', e => {
      c.setPointerCapture(e.pointerId);
      const p = this.localPoint(e);
      this.pointers.set(e.pointerId, p);
      if (this.pointers.size === 1) {
        const node = this.nodeAt(p.x, p.y);
        this.gesture = { kind: node ? 'node' : 'pan', node, start: p, startPan: { x: this.panX, y: this.panY }, moved: false };
        if (node) node.fixed = true;
      } else if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        if (this.gesture?.node && this.gesture.node.type !== 'hub') this.gesture.node.fixed = false;
        this.gesture = { kind: 'pinch', dist: Math.hypot(a.x - b.x, a.y - b.y), moved: true };
      }
      this.kick();
    });

    c.addEventListener('pointermove', e => {
      const p = this.localPoint(e);
      if (!this.pointers.has(e.pointerId)) {
        const hit = this.nodeAt(p.x, p.y);
        if (hit !== this.hoveredNode) {
          this.hoveredNode = hit;
          c.style.cursor = hit ? 'pointer' : 'grab';
          this.draw();
        }
        return;
      }
      this.pointers.set(e.pointerId, p);
      const g = this.gesture;
      if (!g) return;

      if (g.kind === 'pinch' && this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        this.zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, dist / g.dist);
        g.dist = dist;
        return;
      }

      if (!g.moved && Math.hypot(p.x - g.start.x, p.y - g.start.y) < DRAG_THRESHOLD) return;
      g.moved = true;
      if (g.kind === 'node') {
        const w = this.toWorld(p.x, p.y);
        g.node.x = w.x; g.node.y = w.y; g.node.vx = 0; g.node.vy = 0;
        this.kick();
      } else if (g.kind === 'pan') {
        this.panX = g.startPan.x + (p.x - g.start.x);
        this.panY = g.startPan.y + (p.y - g.start.y);
        this.draw();
      }
    });

    const end = e => {
      if (!this.pointers.has(e.pointerId)) return;
      this.pointers.delete(e.pointerId);
      const g = this.gesture;
      if (this.pointers.size > 0) return;
      this.gesture = null;
      if (!g) return;
      if (g.node && g.node.type !== 'hub') g.node.fixed = false;
      // A tap (not a drag) on a player opens their profile.
      if (e.type === 'pointerup' && !g.moved && g.node?.type === 'player' && typeof window.openPlayer === 'function') {
        window.openPlayer(g.node.player.id);
      }
      this.kick();
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener('pointerleave', () => {
      if (this.hoveredNode && !this.gesture) { this.hoveredNode = null; this.draw(); }
    });

    c.addEventListener('wheel', e => {
      e.preventDefault();
      const p = this.localPoint(e);
      this.zoomAt(p.x, p.y, Math.exp(-e.deltaY * 0.0015));
    }, { passive: false });
  }

  // ---------- drawing ----------

  isFocused(node) {
    const h = this.hoveredNode;
    if (!h) return true;
    if (node === h || node.type === 'hub') return true;
    return this.links.some(l => (l.a === h && l.b === node) || (l.b === h && l.a === node));
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();

    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.scale, this.scale);

    const h = this.hoveredNode;
    for (const link of this.links) {
      if (this.isHidden(link.a) || this.isHidden(link.b)) continue;
      const lit = h && (link.a === h || link.b === h);
      if (link.kind === 'roster' && !lit) continue; // spokes to the hub are noise unless highlighted
      ctx.beginPath();
      ctx.moveTo(link.a.x, link.a.y);
      ctx.lineTo(link.b.x, link.b.y);
      ctx.setLineDash(link.kind === 'to' ? [4, 4] : []);
      ctx.strokeStyle = lit ? (link.kind === 'to' ? MAP_COLORS.away : MAP_COLORS.accent) : (h ? 'rgba(22,21,15,0.06)' : MAP_COLORS.rule);
      ctx.lineWidth = (lit ? 2 : 1) / Math.sqrt(this.scale);
      ctx.stroke();
      if (lit && link.label && link.kind !== 'roster') {
        ctx.font = `500 ${11 / this.scale}px Barlow, sans-serif`;
        ctx.fillStyle = MAP_COLORS.ink2;
        ctx.textAlign = 'center';
        ctx.fillText(link.label, (link.a.x + link.b.x) / 2, (link.a.y + link.b.y) / 2 - 4 / this.scale);
      }
    }
    ctx.setLineDash([]);

    // players last so they sit on top
    const order = { feeder: 0, destination: 1, nation: 2, hub: 3, player: 4 };
    const visible = this.nodes.filter(n => !this.isHidden(n)).sort((a, b) => order[a.type] - order[b.type]);
    for (const node of visible) this.drawNode(ctx, node);

    ctx.restore();
  }

  drawNode(ctx, node) {
    const focused = this.isFocused(node);
    const hovered = node === this.hoveredNode;
    ctx.globalAlpha = focused ? 1 : 0.25;
    const r = node.radius;

    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2);

    if (node.type === 'hub') {
      ctx.fillStyle = MAP_COLORS.paper;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = MAP_COLORS.ink;
      ctx.stroke();
      if (this.crestImg.complete && this.crestImg.naturalWidth) {
        const s = r * 1.4;
        ctx.drawImage(this.crestImg, node.x - s / 2, node.y - s / 2, s, s);
      }
    } else if (node.type === 'player') {
      const color = node.player.status === 'active' ? MAP_COLORS.accent : node.player.status === 'departed' ? MAP_COLORS.away : MAP_COLORS.legend;
      ctx.fillStyle = MAP_COLORS.paper2;
      ctx.fill();
      const img = this.photoFor(node.player);
      if (img) {
        ctx.save();
        ctx.clip();
        // headshots are 4:5 with the face around 40% down
        const w = r * 2.6, hgt = w * 1.25;
        ctx.drawImage(img, node.x - w / 2, node.y - hgt * 0.4, w, hgt);
        ctx.restore();
      } else {
        ctx.fillStyle = MAP_COLORS.ink;
        ctx.font = '700 15px "Barlow Condensed", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(node.player.number), node.x, node.y + 1);
      }
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.lineWidth = hovered ? 3 : 2;
      ctx.strokeStyle = color;
      ctx.stroke();
    } else if (node.type === 'nation') {
      ctx.fillStyle = MAP_COLORS.ink;
      ctx.fill();
      ctx.fillStyle = MAP_COLORS.paper;
      ctx.font = '700 12px "Barlow Condensed", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.short, node.x, node.y + 1);
    } else {
      ctx.fillStyle = node.type === 'feeder' ? MAP_COLORS.paper2 : MAP_COLORS.paper;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = node.type === 'feeder' ? MAP_COLORS.muted : MAP_COLORS.away;
      ctx.stroke();
    }

    // Label: always for players and the hub; clubs and countries when zoomed in or highlighted.
    const showLabel = node.type === 'player' || node.type === 'hub' || hovered || this.scale > 0.9 || (this.hoveredNode && focused);
    if (showLabel) {
      const size = (node.type === 'player' ? 12 : 11) / Math.min(1, Math.max(this.scale, 0.6));
      ctx.font = `${hovered ? 600 : 500} ${size}px Barlow, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const text = node.type === 'player' ? (MAP_SHORT_NAMES[node.player.id] || node.player.name.split(' ').slice(-1)[0]) : node.label;
      ctx.lineWidth = 3;
      ctx.strokeStyle = MAP_COLORS.paper;
      ctx.strokeText(text, node.x, node.y + r + 3);
      ctx.fillStyle = node.type === 'destination' ? MAP_COLORS.away : node.type === 'feeder' ? MAP_COLORS.muted : MAP_COLORS.ink;
      ctx.fillText(text, node.x, node.y + r + 3);
    }
    ctx.globalAlpha = 1;
  }
}

window.RM_LineageMindmap = RM_LineageMindmap;
