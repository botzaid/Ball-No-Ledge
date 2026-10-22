// Real Madrid Lineage & Football Explorer - Main App Controller

// Sound effects synthesizer using Web Audio API (no external sound files required)
class AudioFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playError() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.2);
    } catch (e) {}
  }
}

const sfx = new AudioFX();

// SVG Icons Pack
const ICONS = {
  trophy: `<svg class="inline-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
  departure: `<svg class="inline-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
  star: `<svg class="inline-svg text-gold" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  check: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  streak: `<svg class="inline-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`
};

// Main Application State
const state = {
  currentView: 'grid',
  filterPosition: 'all',
  filterStatus: 'all',
  filterNation: 'all',
  searchQuery: '',
  sortBy: 'number',
  activePlayer: null,
  activeModalTab: 'overview',
  comparePlayerA: null,
  comparePlayerB: null,
  mindmapInstance: null,
  trainerInstance: null
};

// DOM References
const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  initDOMElements();
  initFilters();
  initState();
  renderSquadGrid();
  initEventListeners();
});

function initDOMElements() {
  elements.squadGrid = document.getElementById('squad-grid');
  elements.searchInput = document.getElementById('search-input');
  elements.positionFilters = document.querySelectorAll('.filter-pos-btn');
  elements.statusFilters = document.querySelectorAll('.filter-status-btn');
  elements.nationSelect = document.getElementById('nation-select');
  elements.sortSelect = document.getElementById('sort-select');
  elements.viewNavBtns = document.querySelectorAll('.nav-tab-btn');
  elements.viewSections = {
    grid: document.getElementById('view-grid'),
    mindmap: document.getElementById('view-mindmap'),
    trainer: document.getElementById('view-trainer'),
    compare: document.getElementById('view-compare')
  };
  elements.playerModal = document.getElementById('player-modal');
  elements.modalBackdrop = document.getElementById('modal-backdrop');
  elements.modalCloseBtn = document.getElementById('modal-close-btn');
  elements.modalTabs = document.querySelectorAll('.modal-tab-btn');
  elements.soundToggleBtn = document.getElementById('sound-toggle-btn');
  elements.playerCountBadge = document.getElementById('player-count-badge');
}

function initFilters() {
  // Populate Nation Dropdown
  if (elements.nationSelect) {
    elements.nationSelect.innerHTML = '<option value="all">All Nationalities</option>';
    RM_NATIONS.forEach(nat => {
      const sample = RM_PLAYERS.find(p => p.nationality === nat);
      const opt = document.createElement('option');
      opt.value = nat;
      opt.textContent = `${nat}`;
      elements.nationSelect.appendChild(opt);
    });
  }

  // Populate Compare Selects
  const compA = document.getElementById('compare-select-a');
  const compB = document.getElementById('compare-select-b');
  if (compA && compB) {
    compA.innerHTML = '<option value="">Select First Player...</option>';
    compB.innerHTML = '<option value="">Select Second Player...</option>';
    RM_PLAYERS.forEach(p => {
      const optA = document.createElement('option');
      optA.value = p.id;
      optA.textContent = `#${p.number} ${p.name} (${p.position})`;
      compA.appendChild(optA);

      const optB = document.createElement('option');
      optB.value = p.id;
      optB.textContent = `#${p.number} ${p.name} (${p.position})`;
      compB.appendChild(optB);
    });

    compA.value = 'vinicius';
    compB.value = 'mbappe';
    state.comparePlayerA = RM_PLAYERS.find(p => p.id === 'vinicius');
    state.comparePlayerB = RM_PLAYERS.find(p => p.id === 'mbappe');
  }
}

function initState() {
  state.trainerInstance = new RM_MemoryTrainer();
}

function initEventListeners() {
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderSquadGrid();
      if (state.mindmapInstance) {
        state.mindmapInstance.setSearch(state.searchQuery);
      }
    });
  }

  elements.positionFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      elements.positionFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filterPosition = btn.dataset.position;
      renderSquadGrid();
    });
  });

  elements.statusFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      elements.statusFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filterStatus = btn.dataset.status;
      renderSquadGrid();
      if (state.mindmapInstance) {
        state.mindmapInstance.setFilter(state.filterStatus);
      }
    });
  });

  if (elements.nationSelect) {
    elements.nationSelect.addEventListener('change', (e) => {
      sfx.playClick();
      state.filterNation = e.target.value;
      renderSquadGrid();
    });
  }

  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', (e) => {
      sfx.playClick();
      state.sortBy = e.target.value;
      renderSquadGrid();
    });
  }

  elements.viewNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      switchView(btn.dataset.view);
    });
  });

  if (elements.modalCloseBtn) {
    elements.modalCloseBtn.addEventListener('click', closeModal);
  }
  if (elements.modalBackdrop) {
    elements.modalBackdrop.addEventListener('click', closeModal);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.playerModal?.classList.contains('active')) {
      closeModal();
    }
  });

  elements.modalTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      elements.modalTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeModalTab = btn.dataset.tab;
      renderModalTabContent();
    });
  });

  if (elements.soundToggleBtn) {
    elements.soundToggleBtn.addEventListener('click', () => {
      sfx.muted = !sfx.muted;
      elements.soundToggleBtn.querySelector('span').textContent = sfx.muted ? 'Sound Muted' : 'Sound On';
      elements.soundToggleBtn.classList.toggle('muted', sfx.muted);
    });
  }

  const zoomInBtn = document.getElementById('mindmap-zoom-in');
  const zoomOutBtn = document.getElementById('mindmap-zoom-out');
  const resetBtn = document.getElementById('mindmap-reset');
  if (zoomInBtn) zoomInBtn.addEventListener('click', () => state.mindmapInstance?.zoomIn());
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => state.mindmapInstance?.zoomOut());
  if (resetBtn) resetBtn.addEventListener('click', () => state.mindmapInstance?.resetView());

  const compA = document.getElementById('compare-select-a');
  const compB = document.getElementById('compare-select-b');
  if (compA && compB) {
    compA.addEventListener('change', (e) => {
      state.comparePlayerA = RM_PLAYERS.find(p => p.id === e.target.value);
      renderCompareView();
    });
    compB.addEventListener('change', (e) => {
      state.comparePlayerB = RM_PLAYERS.find(p => p.id === e.target.value);
      renderCompareView();
    });
  }

  setupTrainerListeners();
}

function switchView(viewName) {
  state.currentView = viewName;
  elements.viewNavBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  Object.keys(elements.viewSections).forEach(v => {
    elements.viewSections[v].classList.toggle('active', v === viewName);
  });

  if (viewName === 'mindmap') {
    if (!state.mindmapInstance) {
      setTimeout(() => {
        state.mindmapInstance = new RM_LineageMindmap('lineage-canvas', 'mindmap-container');
      }, 50);
    } else {
      state.mindmapInstance.initCanvasSize();
    }
  } else if (viewName === 'trainer') {
    renderTrainer();
  } else if (viewName === 'compare') {
    renderCompareView();
  }
}

function getFilteredPlayers() {
  return RM_PLAYERS.filter(p => {
    if (state.filterPosition !== 'all' && p.category !== state.filterPosition) return false;
    if (state.filterStatus === 'active' && p.status !== 'active') return false;
    if (state.filterStatus === 'departed' && p.status !== 'departed') return false;
    if (state.filterStatus === 'legends' && p.status !== 'legend') return false;
    if (state.filterNation !== 'all' && p.nationality !== state.filterNation) return false;

    if (state.searchQuery) {
      const q = state.searchQuery;
      const haystack = `${p.name} ${p.fullName} ${p.nationality} ${p.position} ${p.currentClub || ''} ${p.lineage.map(l => l.club).join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  }).sort((a, b) => {
    if (state.sortBy === 'number') return a.number - b.number;
    if (state.sortBy === 'name') return a.name.localeCompare(b.name);
    if (state.sortBy === 'debut') return parseInt(a.joinedRealMadrid) - parseInt(b.joinedRealMadrid);
    if (state.sortBy === 'trophies') return (b.stats.trophiesMadrid?.length || 0) - (a.stats.trophiesMadrid?.length || 0);
    return 0;
  });
}

function renderSquadGrid() {
  const filtered = getFilteredPlayers();
  if (elements.playerCountBadge) {
    elements.playerCountBadge.textContent = `${filtered.length} Madridistas`;
  }

  if (!elements.squadGrid) return;

  if (filtered.length === 0) {
    elements.squadGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <h3>No Players Found</h3>
        <p>Try adjusting your search terms or filters to explore Real Madrid's rich lineage.</p>
        <button class="btn btn-primary" onclick="resetAllFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  elements.squadGrid.innerHTML = filtered.map(player => {
    const prevClubs = player.lineage.filter(l => l.club !== 'Real Madrid' && !l.stage.includes('Departure'));
    const originClub = prevClubs.length > 0 ? prevClubs[prevClubs.length - 1] : { club: 'La Fábrica (Academy)', country: 'Spain' };

    let departureTag = '';
    if (player.status === 'departed') {
      departureTag = `<div class="card-departure-badge">${ICONS.departure} <span>Now: ${player.currentClub || player.departureDestination}</span></div>`;
    } else if (player.status === 'legend') {
      departureTag = `<div class="card-departure-badge legend-badge">${ICONS.star} <span>Club Legend</span></div>`;
    }

    let posBadgeClass = `badge-${player.category}`;

    return `
      <div class="player-card" onclick="openPlayerModal('${player.id}')">
        <div class="card-header">
          <div class="shirt-number">#${player.number}</div>
          <div class="nationality-badge" title="${player.nationality}">
            <span class="flag-icon">${player.flag}</span>
            <span class="nation-name">${player.nationality}</span>
          </div>
        </div>

        <div class="card-photo-wrapper">
          <img src="${player.photo}" alt="${player.name}" class="player-photo" loading="lazy">
          <div class="photo-overlay"></div>
          <span class="position-badge ${posBadgeClass}">${player.position}</span>
        </div>

        <div class="card-body">
          <h3 class="player-name">${player.name}</h3>
          <p class="player-status-subtitle">${player.statusLabel}</p>

          <div class="lineage-preview">
            <div class="lineage-step">
              <span class="step-label">Came From:</span>
              <span class="step-club">${originClub.club} (${originClub.country})</span>
            </div>
            <div class="lineage-step">
              <span class="step-label">Joined RM:</span>
              <span class="step-club">${player.joinedRealMadrid} • ${player.transferFee || 'Signed'}</span>
            </div>
          </div>

          ${departureTag}

          <div class="card-quick-stats">
            <div class="stat-pill">
              <span class="stat-val">${player.stats.madridApps || player.stats.appearances || 0}</span>
              <span class="stat-lbl">Apps</span>
            </div>
            <div class="stat-pill">
              <span class="stat-val">${player.category === 'goalkeeper' ? (player.stats.madridCleanSheets || 0) : (player.stats.madridGoals || player.stats.goals || 0)}</span>
              <span class="stat-lbl">${player.category === 'goalkeeper' ? 'CS' : 'Goals'}</span>
            </div>
            <div class="stat-pill">
              <span class="stat-val trophy-val">${ICONS.trophy} ${player.stats.trophiesMadrid?.length || 0}</span>
              <span class="stat-lbl">Titles</span>
            </div>
          </div>

          <div class="card-footer-cta">
            <span>Explore Lineage &amp; Matches</span>
            <span class="cta-arrow">${ICONS.arrowRight}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function resetAllFilters() {
  state.filterPosition = 'all';
  state.filterStatus = 'all';
  state.filterNation = 'all';
  state.searchQuery = '';
  if (elements.searchInput) elements.searchInput.value = '';
  if (elements.nationSelect) elements.nationSelect.value = 'all';
  elements.positionFilters.forEach(b => b.classList.toggle('active', b.dataset.position === 'all'));
  elements.statusFilters.forEach(b => b.classList.toggle('active', b.dataset.status === 'all'));
  renderSquadGrid();
}

// Player Deep Dive Modal
function openPlayerModal(playerId) {
  sfx.playClick();
  const player = RM_PLAYERS.find(p => p.id === playerId);
  if (!player) return;

  state.activePlayer = player;
  state.activeModalTab = 'overview';

  document.getElementById('modal-player-name').textContent = player.name;
  document.getElementById('modal-player-number').textContent = `#${player.number}`;
  document.getElementById('modal-player-position').textContent = player.position;
  document.getElementById('modal-player-flag').textContent = player.flag;
  document.getElementById('modal-player-nation').textContent = player.nationality;
  document.getElementById('modal-player-photo').src = player.photo;

  elements.modalTabs.forEach(b => b.classList.toggle('active', b.dataset.tab === 'overview'));

  renderModalTabContent();

  elements.playerModal.classList.add('active');
  elements.modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  sfx.playClick();
  elements.playerModal.classList.remove('active');
  elements.modalBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

function renderModalTabContent() {
  const player = state.activePlayer;
  const container = document.getElementById('modal-tab-content');
  if (!player || !container) return;

  if (state.activeModalTab === 'overview') {
    let departureNotice = '';
    if (player.status === 'departed') {
      departureNotice = `
        <div class="info-alert alert-departure">
          <div class="alert-icon">${ICONS.departure}</div>
          <div class="alert-content">
            <h4>Transfer Departure: ${player.currentClub} (${player.departureYear})</h4>
            <p>${player.departureDetails}</p>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="tab-pane-fade">
        ${departureNotice}

        <div class="player-bio-banner">
          <p class="player-quote">"${player.quote}"</p>
          <p class="player-bio-text">${player.bio}</p>
        </div>

        <div class="modal-section-title">Vital Football Profile</div>
        <div class="vitals-grid">
          <div class="vital-item">
            <span class="v-label">Full Name</span>
            <span class="v-val">${player.fullName}</span>
          </div>
          <div class="vital-item">
            <span class="v-label">Date of Birth</span>
            <span class="v-val">${player.birthDate}</span>
          </div>
          <div class="vital-item">
            <span class="v-label">Birthplace</span>
            <span class="v-val">${player.birthPlace}</span>
          </div>
          <div class="vital-item">
            <span class="v-label">Height &amp; Foot</span>
            <span class="v-val">${player.height} • ${player.foot}-Footed</span>
          </div>
          <div class="vital-item">
            <span class="v-label">Madrid Arrival</span>
            <span class="v-val">${player.joinedRealMadrid} (${player.transferFee})</span>
          </div>
          <div class="vital-item">
            <span class="v-label">Current Club</span>
            <span class="v-val ${player.status === 'departed' ? 'highlight-departed' : ''}">${player.currentClub}</span>
          </div>
        </div>

        <div class="modal-section-title">Real Madrid Trophy Cabinet</div>
        <div class="trophies-cloud">
          ${player.stats.trophiesMadrid.map(trophy => `
            <div class="trophy-badge">
              <span class="trophy-icon">${ICONS.trophy}</span>
              <span class="trophy-name">${trophy}</span>
            </div>
          `).join('')}
        </div>

        <div class="modal-section-title">Career Statistics Breakdown</div>
        <div class="stats-overview-grid">
          <div class="stat-card-large">
            <span class="sl-number">${player.stats.madridApps || player.stats.appearances}</span>
            <span class="sl-label">Real Madrid Appearances</span>
          </div>
          <div class="stat-card-large">
            <span class="sl-number">${player.category === 'goalkeeper' ? (player.stats.madridCleanSheets || 0) : (player.stats.madridGoals || player.stats.goals || 0)}</span>
            <span class="sl-label">${player.category === 'goalkeeper' ? 'Clean Sheets' : 'Goals Scored'}</span>
          </div>
          <div class="stat-card-large">
            <span class="sl-number">${player.stats.madridAssists || 0}</span>
            <span class="sl-label">Madrid Assists</span>
          </div>
          <div class="stat-card-large">
            <span class="sl-number">${player.stats.internationalCaps || 0} (${player.stats.internationalGoals || 0}G)</span>
            <span class="sl-label">National Team Caps</span>
          </div>
        </div>
      </div>
    `;
  } else if (state.activeModalTab === 'lineage') {
    container.innerHTML = `
      <div class="tab-pane-fade">
        <div class="lineage-roadmap-header">
          <h3>Career Pathway &amp; Transfer Lineage</h3>
          <p>From his football roots in ${player.nationality} through his clubs to Real Madrid and beyond.</p>
        </div>

        <div class="timeline-visual-flow">
          ${player.lineage.map((stage, idx) => {
            const isMadrid = stage.club === 'Real Madrid';
            const isDeparture = stage.stage.includes('Departure') || stage.club.includes('Al-') || stage.club === 'Manchester United' || stage.club === 'Fluminense' || stage.club.includes('Retired');
            let stageClass = isMadrid ? 'stage-madrid' : (isDeparture ? 'stage-departure' : 'stage-past');

            return `
              <div class="timeline-node ${stageClass}">
                <div class="timeline-marker">${idx + 1}</div>
                <div class="timeline-card">
                  <div class="t-stage-header">
                    <span class="t-stage-tag">${stage.stage}</span>
                    <span class="t-years">${stage.years}</span>
                  </div>
                  <h4 class="t-club-title">${stage.club}</h4>
                  <p class="t-club-country">📍 ${stage.country} ${stage.fee ? `• Transfer: <strong class="t-fee">${stage.fee}</strong>` : ''}</p>
                  ${stage.appearances !== undefined ? `
                    <div class="t-mini-stats">
                      <span><strong>${stage.appearances}</strong> Apps</span>
                      ${stage.goals !== undefined ? `<span><strong>${stage.goals}</strong> Goals</span>` : ''}
                    </div>
                  ` : ''}
                  <p class="t-desc">${stage.details}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (state.activeModalTab === 'matches') {
    const debut = player.madridDebut;
    container.innerHTML = `
      <div class="tab-pane-fade">
        <div class="modal-section-title">Official Real Madrid Debut</div>
        <div class="debut-card">
          <div class="debut-header">
            <div class="debut-badge">First Match in White</div>
            <div class="debut-date">${debut.date}</div>
          </div>
          <div class="debut-matchup">
            <span class="debut-team">Real Madrid</span>
            <span class="debut-score">${debut.result}</span>
            <span class="debut-team">${debut.opponent}</span>
          </div>
          <div class="debut-meta-tags">
            <span>${ICONS.trophy} ${debut.competition}</span>
            <span>🏟️ ${debut.venue}</span>
            <span>⏱️ ${debut.minutesPlayed} Mins</span>
            <span>👕 Shirt: ${debut.jerseyWorn}</span>
          </div>
          <div class="debut-story">
            <strong>Debut Impact:</strong> ${debut.contribution}
          </div>
        </div>

        <div class="modal-section-title">Iconic Matches &amp; Contributions for Madrid</div>
        <div class="performances-list">
          ${player.peakPerformances.map(perf => `
            <div class="perf-card">
              <div class="perf-header">
                <h4>${perf.title}</h4>
                <span class="perf-date">${perf.date}</span>
              </div>
              <div class="perf-match-banner">
                <span class="perf-comp">${perf.competition}</span>
                <span class="perf-match">${perf.match}</span>
                <span class="perf-score-badge">${perf.score}</span>
              </div>
              <p class="perf-highlight">${ICONS.star} ${perf.highlight}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (state.activeModalTab === 'records') {
    container.innerHTML = `
      <div class="tab-pane-fade">
        <div class="modal-section-title">Historical Records Held</div>
        <div class="records-list">
          ${player.records.map(rec => `
            <div class="record-item">
              <span class="rec-icon">${ICONS.star}</span>
              <p class="rec-text">${rec}</p>
            </div>
          `).join('')}
        </div>

        <div class="modal-section-title">Madridista Lore &amp; Fascinating Facts</div>
        <div class="facts-grid">
          ${player.facts.map((fact, idx) => `
            <div class="fact-card">
              <div class="fact-number">Fact #${idx + 1}</div>
              <p class="fact-text">${fact}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (state.activeModalTab === 'gallery') {
    container.innerHTML = `
      <div class="tab-pane-fade">
        <div class="modal-section-title">Photo Gallery &amp; Iconic Moments</div>
        <div class="gallery-grid">
          <div class="gallery-item main-portrait">
            <img src="${player.photo}" alt="${player.name}" class="gallery-img">
            <div class="gallery-caption">Official Portrait • ${player.name}</div>
          </div>
          ${player.gallery.map(img => `
            <div class="gallery-item">
              <img src="${img.url}" alt="${img.caption}" class="gallery-img">
              <div class="gallery-caption">${img.caption}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// Memory Trainer UI & Logic
function setupTrainerListeners() {
  const flipBtn = document.getElementById('card-flip-btn');
  const nextBtn = document.getElementById('card-next-btn');
  const prevBtn = document.getElementById('card-prev-btn');
  const shuffleBtn = document.getElementById('card-shuffle-btn');
  const learnedBtn = document.getElementById('card-learned-btn');
  const trainerModeBtns = document.querySelectorAll('.trainer-mode-btn');

  trainerModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      trainerModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.trainerInstance.currentMode = btn.dataset.mode;
      renderTrainer();
    });
  });

  if (flipBtn) {
    flipBtn.addEventListener('click', () => {
      sfx.playClick();
      state.trainerInstance.toggleFlip();
      updateFlashcardDisplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      sfx.playClick();
      state.trainerInstance.nextCard();
      updateFlashcardDisplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      sfx.playClick();
      state.trainerInstance.prevCard();
      updateFlashcardDisplay();
    });
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      sfx.playClick();
      state.trainerInstance.shuffleDeck();
      updateFlashcardDisplay();
    });
  }

  if (learnedBtn) {
    learnedBtn.addEventListener('click', () => {
      sfx.playClick();
      const p = state.trainerInstance.getCurrentPlayer();
      const isLearned = state.trainerInstance.toggleLearned(p.id);
      learnedBtn.classList.toggle('learned', isLearned);
      learnedBtn.textContent = isLearned ? '✓ Marked as Learned' : 'Mark as Learned';
    });
  }

  const quizTypeBtns = document.querySelectorAll('.quiz-type-btn');
  quizTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      quizTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderQuizQuestion(btn.dataset.quiztype);
    });
  });
}

function renderTrainer() {
  const flashcardSec = document.getElementById('trainer-flashcards-section');
  const quizSec = document.getElementById('trainer-quiz-section');

  if (state.trainerInstance.currentMode === 'flashcards') {
    flashcardSec.style.display = 'block';
    quizSec.style.display = 'none';
    updateFlashcardDisplay();
  } else {
    flashcardSec.style.display = 'none';
    quizSec.style.display = 'block';
    renderQuizQuestion(state.trainerInstance.quizType || 'country');
  }
}

function updateFlashcardDisplay() {
  const p = state.trainerInstance.getCurrentPlayer();
  const cardElement = document.getElementById('flashcard-element');
  const counterElement = document.getElementById('card-counter');
  const learnedBtn = document.getElementById('card-learned-btn');

  if (!p || !cardElement) return;

  if (counterElement) {
    counterElement.textContent = `Card ${state.trainerInstance.currentCardIndex + 1} of ${RM_PLAYERS.length}`;
  }

  const isLearned = state.trainerInstance.isLearned(p.id);
  if (learnedBtn) {
    learnedBtn.classList.toggle('learned', isLearned);
    learnedBtn.textContent = isLearned ? '✓ Marked as Learned' : 'Mark as Learned';
  }

  document.getElementById('fc-front-photo').src = p.photo;
  document.getElementById('fc-front-name').textContent = p.name;
  document.getElementById('fc-front-number').textContent = `#${p.number}`;
  document.getElementById('fc-front-pos').textContent = p.position;

  document.getElementById('fc-back-name').textContent = p.name;
  document.getElementById('fc-back-nation').textContent = `${p.flag} ${p.nationality}`;
  document.getElementById('fc-back-origin').textContent = p.lineage[0]?.club + ` (${p.lineage[0]?.country})`;
  document.getElementById('fc-back-prev').textContent = p.lineage.slice(0, -1).map(l => l.club).join(' ➔ ');
  document.getElementById('fc-back-fact').textContent = p.facts[0] || p.bio;

  cardElement.classList.toggle('is-flipped', state.trainerInstance.isCardFlipped);
}

function renderQuizQuestion(type) {
  const q = state.trainerInstance.generateQuestion(type);
  const container = document.getElementById('quiz-question-container');
  if (!container || !q) return;

  document.getElementById('quiz-score-display').textContent = `Score: ${state.trainerInstance.quizScore} / ${state.trainerInstance.quizTotal}`;
  document.getElementById('quiz-streak-display').innerHTML = `${ICONS.streak} Streak: ${state.trainerInstance.quizStreak}`;

  container.innerHTML = `
    <div class="quiz-card-wrapper">
      <div class="quiz-header">
        <span class="quiz-type-tag">${type.toUpperCase()} CHALLENGE</span>
        <h3>${q.question}</h3>
        <p class="quiz-prompt">${q.prompt}</p>
      </div>

      <div class="quiz-photo-wrapper">
        <img src="${q.player.photo}" alt="${q.player.name}" class="quiz-player-photo">
      </div>

      <div class="quiz-options-grid">
        ${q.options.map(opt => `
          <button class="quiz-option-btn" onclick="handleQuizAnswer('${opt.value}')">${opt.text}</button>
        `).join('')}
      </div>

      <div id="quiz-feedback-box" class="quiz-feedback-box" style="display: none;"></div>
    </div>
  `;
}

function handleQuizAnswer(selectedValue) {
  const result = state.trainerInstance.submitAnswer(selectedValue);
  if (!result) return;

  const feedbackBox = document.getElementById('quiz-feedback-box');
  const optionBtns = document.querySelectorAll('.quiz-option-btn');

  optionBtns.forEach(btn => {
    btn.disabled = true;
    if (btn.getAttribute('onclick').includes(`'${result.correctAnswer}'`)) {
      btn.classList.add('correct');
    } else if (btn.getAttribute('onclick').includes(`'${selectedValue}'`) && !result.isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  if (result.isCorrect) {
    sfx.playSuccess();
    feedbackBox.className = 'quiz-feedback-box correct';
    feedbackBox.innerHTML = `
      <div class="fb-icon">${ICONS.check}</div>
      <div class="fb-text">
        <h4>Spot on! That's correct!</h4>
        <p>${result.explanation}</p>
        <button class="btn btn-primary" onclick="renderQuizQuestion('${state.trainerInstance.quizType}')">Next Question ➔</button>
      </div>
    `;
  } else {
    sfx.playError();
    feedbackBox.className = 'quiz-feedback-box incorrect';
    feedbackBox.innerHTML = `
      <div class="fb-icon">${ICONS.x}</div>
      <div class="fb-text">
        <h4>Not quite!</h4>
        <p>${result.explanation}</p>
        <button class="btn btn-secondary" onclick="renderQuizQuestion('${state.trainerInstance.quizType}')">Try Next ➔</button>
      </div>
    `;
  }

  feedbackBox.style.display = 'flex';
  document.getElementById('quiz-score-display').textContent = `Score: ${result.score} / ${result.total}`;
  document.getElementById('quiz-streak-display').innerHTML = `${ICONS.streak} Streak: ${result.streak}`;
}

// Side-by-Side Player Comparison Tool
function renderCompareView() {
  const pA = state.comparePlayerA || RM_PLAYERS[0];
  const pB = state.comparePlayerB || RM_PLAYERS[1];
  const container = document.getElementById('compare-display-container');
  if (!container) return;

  container.innerHTML = `
    <div class="comparison-grid">
      <!-- Player A Card -->
      <div class="compare-player-column">
        <div class="compare-card-header">
          <img src="${pA.photo}" alt="${pA.name}" class="compare-photo">
          <h3>${pA.name}</h3>
          <span class="compare-sub">${pA.flag} ${pA.nationality} • #${pA.number} ${pA.position}</span>
          <span class="compare-status-badge">${pA.statusLabel}</span>
        </div>

        <div class="compare-stats-table">
          <div class="c-row"><span class="c-lbl">Debut</span><span class="c-val">${pA.madridDebut.date}</span></div>
          <div class="c-row"><span class="c-lbl">Fee</span><span class="c-val">${pA.transferFee}</span></div>
          <div class="c-row"><span class="c-lbl">Appearances</span><span class="c-val">${pA.stats.madridApps || pA.stats.appearances}</span></div>
          <div class="c-row"><span class="c-lbl">Goals</span><span class="c-val">${pA.stats.madridGoals || pA.stats.goals || 0}</span></div>
          <div class="c-row"><span class="c-lbl">Assists</span><span class="c-val">${pA.stats.madridAssists || 0}</span></div>
          <div class="c-row"><span class="c-lbl">Trophies</span><span class="c-val">${ICONS.trophy} ${pA.stats.trophiesMadrid?.length || 0}</span></div>
          <div class="c-row"><span class="c-lbl">Int. Caps</span><span class="c-val">${pA.stats.internationalCaps} (${pA.stats.internationalGoals}G)</span></div>
        </div>

        <div class="compare-lineage-block">
          <h4>Career Path</h4>
          <div class="c-path">${pA.lineage.map(l => l.club).join(' ➔ ')}</div>
        </div>
      </div>

      <!-- Player B Card -->
      <div class="compare-player-column">
        <div class="compare-card-header">
          <img src="${pB.photo}" alt="${pB.name}" class="compare-photo">
          <h3>${pB.name}</h3>
          <span class="compare-sub">${pB.flag} ${pB.nationality} • #${pB.number} ${pB.position}</span>
          <span class="compare-status-badge">${pB.statusLabel}</span>
        </div>

        <div class="compare-stats-table">
          <div class="c-row"><span class="c-lbl">Debut</span><span class="c-val">${pB.madridDebut.date}</span></div>
          <div class="c-row"><span class="c-lbl">Fee</span><span class="c-val">${pB.transferFee}</span></div>
          <div class="c-row"><span class="c-lbl">Appearances</span><span class="c-val">${pB.stats.madridApps || pB.stats.appearances}</span></div>
          <div class="c-row"><span class="c-lbl">Goals</span><span class="c-val">${pB.stats.madridGoals || pB.stats.goals || 0}</span></div>
          <div class="c-row"><span class="c-lbl">Assists</span><span class="c-val">${pB.stats.madridAssists || 0}</span></div>
          <div class="c-row"><span class="c-lbl">Trophies</span><span class="c-val">${ICONS.trophy} ${pB.stats.trophiesMadrid?.length || 0}</span></div>
          <div class="c-row"><span class="c-lbl">Int. Caps</span><span class="c-val">${pB.stats.internationalCaps} (${pB.stats.internationalGoals}G)</span></div>
        </div>

        <div class="compare-lineage-block">
          <h4>Career Path</h4>
          <div class="c-path">${pB.lineage.map(l => l.club).join(' ➔ ')}</div>
        </div>
      </div>
    </div>
  `;
}

// Global window helpers
window.openPlayerModal = openPlayerModal;
window.resetAllFilters = resetAllFilters;
window.renderQuizQuestion = renderQuizQuestion;
window.handleQuizAnswer = handleQuizAnswer;
window.switchView = switchView;
