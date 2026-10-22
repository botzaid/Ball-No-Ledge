// Interactive Real Madrid Player Lineage Mindmap & Network Visualizer
// High performance HTML5 Canvas engine with force-directed physics, zoom, pan, and smooth node interactions.

class RM_LineageMindmap {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    if (!this.canvas || !this.container) return;
    this.ctx = this.canvas.getContext('2d');

    this.nodes = [];
    this.links = [];
    this.selectedNode = null;
    this.hoveredNode = null;
    this.filterMode = 'all'; // 'all', 'active', 'departed', 'legends'
    this.searchQuery = '';
    this.animationFrameId = null;

    // Viewport transform
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.lastPan = { x: 0, y: 0 };
    this.draggedNode = null;

    this.crestImg = new Image();
    this.crestImg.src = 'images/real-madrid-crest.svg';

    this.initCanvasSize();
    this.buildGraph();
    this.bindEvents();
    this.startSimulation();
  }

  initCanvasSize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || 1000;
    this.height = Math.max(rect.height, 650) || 650;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
    this.panX = this.width / 2;
    this.panY = this.height / 2;
  }

  buildGraph() {
    this.nodes = [];
    this.links = [];

    // 1. Center Hub: Real Madrid
    const centerNode = {
      id: "hub-rm",
      type: "hub",
      label: "Real Madrid C.F.",
      sublabel: "15x UCL Champions",
      color: "#e5b324",
      radius: 46,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      fixed: true
    };
    this.nodes.push(centerNode);

    // 2. Departure Destination Hub
    const departureHub = {
      id: "hub-departures",
      type: "departureHub",
      label: "Recent Departures & Exits",
      sublabel: "Where Legends Went",
      color: "#f97316",
      radius: 36,
      x: 320,
      y: -180,
      vx: 0,
      vy: 0,
      fixed: false
    };
    this.nodes.push(departureHub);
    this.links.push({ source: centerNode, target: departureHub, type: "exit-flow", label: "Departures" });

    // 3. Nationality / Pipeline Clusters
    const nationClusters = {};
    const nations = [...new Set(RM_PLAYERS.map(p => p.nationality))];
    const angleStep = (Math.PI * 2) / nations.length;

    nations.forEach((nat, idx) => {
      const angle = idx * angleStep;
      const dist = 280;
      const nNode = {
        id: `nat-${nat}`,
        type: "nation",
        label: nat,
        flag: RM_PLAYERS.find(p => p.nationality === nat)?.flag || "🌐",
        color: "#38bdf8",
        radius: 26,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        nationality: nat
      };
      this.nodes.push(nNode);
      nationClusters[nat] = nNode;
      this.links.push({ source: centerNode, target: nNode, type: "pipeline", stroke: "rgba(56, 189, 248, 0.25)" });
    });

    // 4. Player Nodes & Feeder Clubs / Destination Clubs
    const feederClubMap = new Map();
    const destinationMap = new Map();

    RM_PLAYERS.forEach((player, i) => {
      // Determine player node color & styling
      let playerColor = "#ffffff";
      if (player.category === "forward") playerColor = "#38bdf8";
      else if (player.category === "midfielder") playerColor = "#e5b324";
      else if (player.category === "defender") playerColor = "#34d399";
      else if (player.category === "goalkeeper") playerColor = "#a78bfa";

      const natNode = nationClusters[player.nationality];
      const offsetAngle = (i / RM_PLAYERS.length) * Math.PI * 2;
      const px = natNode ? natNode.x + Math.cos(offsetAngle) * 90 : Math.cos(offsetAngle) * 220;
      const py = natNode ? natNode.y + Math.sin(offsetAngle) * 90 : Math.sin(offsetAngle) * 220;

      const pNode = {
        id: `player-${player.id}`,
        type: "player",
        playerData: player,
        label: player.name,
        sublabel: `#${player.number} • ${player.position}`,
        color: playerColor,
        radius: 24,
        x: px + (Math.random() - 0.5) * 40,
        y: py + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        status: player.status,
        category: player.category
      };
      this.nodes.push(pNode);

      // Link Real Madrid to Player
      this.links.push({
        source: centerNode,
        target: pNode,
        type: "roster",
        stroke: player.status === "departed" ? "rgba(249, 115, 22, 0.35)" : "rgba(229, 179, 36, 0.45)"
      });

      // Link Nation to Player
      if (natNode) {
        this.links.push({
          source: natNode,
          target: pNode,
          type: "citizenship",
          stroke: "rgba(56, 189, 248, 0.3)"
        });
      }

      // Previous feeder club node (key previous club)
      const prevClubs = player.lineage.filter(l => l.club !== "Real Madrid" && !l.stage.includes("Departure"));
      if (prevClubs.length > 0) {
        const primaryPrev = prevClubs[prevClubs.length - 1]; // Club just prior to Real Madrid
        let feederNode = feederClubMap.get(primaryPrev.club);
        if (!feederNode) {
          feederNode = {
            id: `feeder-${primaryPrev.club.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            type: "feeder",
            label: primaryPrev.club,
            sublabel: `Feeder (${primaryPrev.country})`,
            color: "#94a3b8",
            radius: 18,
            x: pNode.x + (Math.random() - 0.5) * 120,
            y: pNode.y + (Math.random() - 0.5) * 120,
            vx: 0,
            vy: 0
          };
          feederClubMap.set(primaryPrev.club, feederNode);
          this.nodes.push(feederNode);
        }
        this.links.push({
          source: feederNode,
          target: pNode,
          type: "transfer-in",
          label: player.transferFee || "Transfer",
          stroke: "rgba(148, 163, 184, 0.35)"
        });
      }

      // If departed, link to destination club
      if (player.status === "departed" && player.departureDestination) {
        const destName = player.currentClub || player.departureDestination;
        let destNode = destinationMap.get(destName);
        if (!destNode) {
          destNode = {
            id: `dest-${destName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            type: "destination",
            label: destName,
            sublabel: `Departed ${player.departureYear || ''}`,
            color: "#fb923c",
            radius: 20,
            x: departureHub.x + (Math.random() - 0.5) * 180,
            y: departureHub.y + (Math.random() - 0.5) * 180,
            vx: 0,
            vy: 0
          };
          destinationMap.set(destName, destNode);
          this.nodes.push(destNode);
          this.links.push({
            source: departureHub,
            target: destNode,
            type: "exit-branch",
            stroke: "rgba(251, 146, 60, 0.4)"
          });
        }
        this.links.push({
          source: pNode,
          target: destNode,
          type: "departure",
          label: `Departed ${player.departureYear}`,
          stroke: "rgba(249, 115, 22, 0.6)"
        });
      }
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initCanvasSize());

    // Mouse / Touch handlers for dragging and zoom
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoomAt(e.clientX, e.clientY, zoomFactor);
    }, { passive: false });

    // Touch support for mobile / trackpads
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
      }
    });
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
      }
    });
    this.canvas.addEventListener('touchend', (e) => this.handleMouseUp(e));
  }

  screenToWorld(screenX, screenY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = screenX - rect.left;
    const y = screenY - rect.top;
    return {
      x: (x - this.panX) / this.scale,
      y: (y - this.panY) / this.scale
    };
  }

  getNodeAt(worldX, worldY) {
    // Check backwards so top-drawn nodes get hit first
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i];
      if (this.isNodeHidden(node)) continue;
      const dx = worldX - node.x;
      const dy = worldY - node.y;
      if (dx * dx + dy * dy <= (node.radius + 6) * (node.radius + 6)) {
        return node;
      }
    }
    return null;
  }

  handleMouseDown(e) {
    const world = this.screenToWorld(e.clientX, e.clientY);
    const hitNode = this.getNodeAt(world.x, world.y);

    if (hitNode) {
      this.draggedNode = hitNode;
      this.draggedNode.fixed = true;
    } else {
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.lastPan = { x: this.panX, y: this.panY };
    }
  }

  handleMouseMove(e) {
    const world = this.screenToWorld(e.clientX, e.clientY);

    if (this.draggedNode) {
      this.draggedNode.x = world.x;
      this.draggedNode.y = world.y;
      this.draggedNode.vx = 0;
      this.draggedNode.vy = 0;
    } else if (this.isDragging) {
      this.panX = this.lastPan.x + (e.clientX - this.dragStart.x);
      this.panY = this.lastPan.y + (e.clientY - this.dragStart.y);
    } else {
      const prevHover = this.hoveredNode;
      this.hoveredNode = this.getNodeAt(world.x, world.y);
      if (prevHover !== this.hoveredNode) {
        this.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'grab';
      }
    }
  }

  handleMouseUp(e) {
    if (this.draggedNode) {
      if (this.draggedNode.type !== 'hub') {
        this.draggedNode.fixed = false;
      }
      // If clicked without dragging far, trigger select
      if (this.draggedNode.type === 'player' && typeof window.openPlayerModal === 'function') {
        window.openPlayerModal(this.draggedNode.playerData.id);
      }
      this.draggedNode = null;
    }
    this.isDragging = false;
  }

  zoomAt(screenX, screenY, factor) {
    const newScale = Math.min(Math.max(this.scale * factor, 0.4), 2.8);
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = screenX - rect.left;
    const mouseY = screenY - rect.top;

    this.panX = mouseX - (mouseX - this.panX) * (newScale / this.scale);
    this.panY = mouseY - (mouseY - this.panY) * (newScale / this.scale);
    this.scale = newScale;
  }

  zoomIn() {
    this.scale = Math.min(this.scale * 1.25, 2.8);
  }

  zoomOut() {
    this.scale = Math.max(this.scale * 0.8, 0.4);
  }

  resetView() {
    this.scale = 1;
    this.panX = this.width / 2;
    this.panY = this.height / 2;
  }

  setFilter(filter) {
    this.filterMode = filter;
  }

  setSearch(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
  }

  isNodeHidden(node) {
    if (this.filterMode === 'active' && node.type === 'player' && node.status !== 'active') return true;
    if (this.filterMode === 'departed' && node.type === 'player' && node.status !== 'departed') return true;
    if (this.filterMode === 'legends' && node.type === 'player' && node.status !== 'legend') return true;
    return false;
  }

  isNodeMatchSearch(node) {
    if (!this.searchQuery) return false;
    const text = `${node.label} ${node.sublabel || ''} ${node.playerData?.nationality || ''}`.toLowerCase();
    return text.includes(this.searchQuery);
  }

  // Force-directed simulation loop
  startSimulation() {
    const simulate = () => {
      this.updatePhysics();
      this.render();
      this.animationFrameId = requestAnimationFrame(simulate);
    };
    this.animationFrameId = requestAnimationFrame(simulate);
  }

  updatePhysics() {
    // Spring forces on links
    for (let link of this.links) {
      if (this.isNodeHidden(link.source) || this.isNodeHidden(link.target)) continue;
      const dx = link.target.x - link.source.x;
      const dy = link.target.y - link.source.y;
      const dist = Math.sqrt(dx * dy + dy * dy) || 1;
      let targetDist = 140;

      if (link.type === 'pipeline') targetDist = 260;
      if (link.type === 'roster') targetDist = 180;
      if (link.type === 'exit-flow') targetDist = 280;

      const force = (dist - targetDist) * 0.003;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (!link.source.fixed) {
        link.source.vx += fx;
        link.source.vy += fy;
      }
      if (!link.target.fixed) {
        link.target.vx -= fx;
        link.target.vy -= fy;
      }
    }

    // Repulsion between nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];
      if (this.isNodeHidden(n1)) continue;

      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        if (this.isNodeHidden(n2)) continue;

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const distSq = dx * dx + dy * dy || 1;
        if (distSq < 30000) {
          const dist = Math.sqrt(distSq);
          const repulse = 380 / distSq;
          const rx = (dx / dist) * repulse;
          const ry = (dy / dist) * repulse;

          if (!n1.fixed) {
            n1.vx -= rx;
            n1.vy -= ry;
          }
          if (!n2.fixed) {
            n2.vx += rx;
            n2.vy += ry;
          }
        }
      }

      // Center gravity pull
      if (!n1.fixed) {
        n1.vx -= n1.x * 0.0006;
        n1.vy -= n1.y * 0.0006;

        // Damping / friction
        n1.vx *= 0.88;
        n1.vy *= 0.88;

        n1.x += n1.vx;
        n1.y += n1.vy;
      }
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.scale, this.scale);

    // 1. Draw subtle background coordinate grid
    this.renderGrid(ctx);

    // 2. Draw Links
    for (let link of this.links) {
      if (this.isNodeHidden(link.source) || this.isNodeHidden(link.target)) continue;

      const isHovered = (this.hoveredNode === link.source || this.hoveredNode === link.target);
      const isSearchMatch = this.searchQuery && (this.isNodeMatchSearch(link.source) || this.isNodeMatchSearch(link.target));

      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);

      // Curved line for aesthetic organic mindmap feel
      const midX = (link.source.x + link.target.x) / 2;
      const midY = (link.source.y + link.target.y) / 2;
      ctx.lineTo(link.target.x, link.target.y);

      ctx.strokeStyle = isHovered ? '#f59e0b' : (isSearchMatch ? '#fbbf24' : (link.stroke || 'rgba(255, 255, 255, 0.12)'));
      ctx.lineWidth = isHovered ? 2.5 : (isSearchMatch ? 2 : 1.2);
      ctx.stroke();

      // Draw subtle arrow / transfer label if hovered
      if (isHovered && link.label) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(link.label, midX, midY - 6);
      }
    }

    // 3. Draw Nodes
    for (let node of this.nodes) {
      if (this.isNodeHidden(node)) continue;
      this.renderNode(ctx, node);
    }

    ctx.restore();
  }

  renderGrid(ctx) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    const size = 80;
    const span = 1600;

    ctx.beginPath();
    for (let x = -span; x <= span; x += size) {
      ctx.moveTo(x, -span);
      ctx.lineTo(x, span);
    }
    for (let y = -span; y <= span; y += size) {
      ctx.moveTo(-span, y);
      ctx.lineTo(span, y);
    }
    ctx.stroke();
  }

  renderNode(ctx, node) {
    const isHover = (this.hoveredNode === node);
    const isSearchMatch = this.isNodeMatchSearch(node);
    const radius = node.radius + (isHover ? 4 : 0);

    // Node Glow / Shadow
    if (isHover || isSearchMatch || node.type === 'hub') {
      ctx.save();
      ctx.shadowColor = node.color || '#e5b324';
      ctx.shadowBlur = isHover ? 22 : 14;
    }

    // Node Circle Background
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

    if (node.type === 'hub') {
      const grad = ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, radius);
      grad.addColorStop(0, '#e5b324');
      grad.addColorStop(1, '#b45309');
      ctx.fillStyle = grad;
    } else if (node.type === 'departureHub') {
      ctx.fillStyle = '#c2410c';
    } else if (node.type === 'nation') {
      ctx.fillStyle = '#0f172a';
    } else if (node.type === 'destination') {
      ctx.fillStyle = '#431407';
    } else if (node.type === 'feeder') {
      ctx.fillStyle = '#1e293b';
    } else {
      // Player node
      ctx.fillStyle = '#0f172a';
    }
    ctx.fill();

    // Node border stroke
    ctx.strokeStyle = isHover ? '#ffffff' : (isSearchMatch ? '#fbbf24' : (node.color || '#e2e8f0'));
    ctx.lineWidth = isHover ? 3 : (node.type === 'hub' ? 3.5 : 2);
    ctx.stroke();

    if (isHover || isSearchMatch || node.type === 'hub') {
      ctx.restore();
    }

    // Node Interior Icon / Flag / Number
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (node.type === 'hub') {
      if (this.crestImg && this.crestImg.complete && this.crestImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius - 6, 0, Math.PI * 2);
        ctx.clip();
        const sz = (radius - 4) * 2;
        ctx.drawImage(this.crestImg, node.x - sz / 2, node.y - sz / 2, sz, sz);
        ctx.restore();
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText('RMCF', node.x, node.y);
      }
    } else if (node.type === 'departureHub') {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('EXITS', node.x, node.y);
    } else if (node.type === 'nation') {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(node.label.substring(0, 3).toUpperCase(), node.x, node.y);
    } else if (node.type === 'destination') {
      ctx.fillStyle = '#fdba74';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('CLUB', node.x, node.y);
    } else if (node.type === 'feeder') {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('ROOT', node.x, node.y);
    } else if (node.type === 'player') {
      ctx.fillStyle = node.color;
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`#${node.playerData.number}`, node.x, node.y);
    }

    // Node Text Label below
    ctx.font = isHover ? 'bold 12px Inter, sans-serif' : '11px Inter, sans-serif';
    ctx.fillStyle = isHover ? '#ffffff' : '#cbd5e1';
    ctx.fillText(node.label, node.x, node.y + radius + 12);

    // Sublabel
    if (node.sublabel && (isHover || node.type === 'hub' || node.type === 'departureHub')) {
      ctx.font = '9px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(node.sublabel, node.x, node.y + radius + 24);
    }
  }
}

// Attach to window
window.RM_LineageMindmap = RM_LineageMindmap;
