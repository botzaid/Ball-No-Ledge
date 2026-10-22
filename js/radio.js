// Stadium radio: real football songs and famous Madrid moments, played through
// YouTube's official embedded player (the only legal way to play these tracks on
// a website: the rights holders allow embedding, we never host the audio).
// The player stays visible while it plays, as YouTube's terms require.
// Tapping Cristiano Ronaldo anywhere cues his "How many people can do it like me?" clip.

const Radio = (() => {
  // Checked with YouTube's oEmbed endpoint (exists, public, embeddable) by the
  // "YouTube lookup" workflow; see research/youtube.jsonl.
  const TRACKS = [
    { id: 'pRpeEdMmmQ0', title: 'Waka Waka (This Time for Africa)', by: 'Shakira', group: 'Songs' },
    { id: 'WTJSt4wP2ME', title: "Wavin' Flag (Celebration Mix)", by: "K'naan", group: 'Songs' },
    { id: 'tF_ggG5dY5U', title: 'La Copa de la Vida', by: 'Ricky Martin', group: 'Songs' },
    { id: 'ctvyvmpEDB4', title: 'Hala Madrid y nada más', by: 'Real Madrid anthem', group: 'Songs' },
    { id: 'zwV3h1vqU0A', title: 'Champions League anthem', by: 'UEFA · Tony Britten', group: 'Songs' },
    { id: 'D74ahf_1vzU', title: '80,000 sing Hala Madrid', by: 'Bernabéu crowd', group: 'Moments' },
    { id: 'J98IGp8POH8', title: 'How many people can do it like me?', by: 'Cristiano Ronaldo', group: 'Moments', ronaldo: true },
    { id: 'cRu1PT8pCNE', title: 'The 92:48 header, explained', by: 'Ramos & Modrić · Real Madrid', group: 'Moments' },
    { id: '_zwPfLPtjAM', title: '"La pelota sale muy alta… pero le va a Zidane"', by: 'Radio call of the Glasgow volley · MARCA', group: 'Moments' },
    { id: 'PwFWUzTqZyA', title: "Zidane's volley, Glasgow 2002", by: 'CBS Sports Golazo', group: 'Moments' },
    { id: '5T5XKkzj8G0', title: "Bale's bicycle kick, Kyiv 2018", by: 'Champions League final', group: 'Moments' }
  ];

  let dock, player = null, apiReady = null, current = -1, open = false;

  function loadApi() {
    if (apiReady) return apiReady;
    apiReady = new Promise(resolve => {
      if (window.YT && YT.Player) { resolve(); return; }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
    return apiReady;
  }

  function build() {
    dock = document.createElement('aside');
    dock.className = 'radio';
    dock.hidden = true;
    dock.setAttribute('aria-label', 'Stadium radio');
    const groups = [...new Set(TRACKS.map(t => t.group))];
    dock.innerHTML = `
      <div class="radio-head">
        <span class="radio-eq" aria-hidden="true"><i></i><i></i><i></i></span>
        <div class="radio-now"><b id="radio-title">Stadium radio</b><span id="radio-by">Pick a track</span></div>
        <button type="button" class="radio-icon" data-radio="prev" aria-label="Previous track"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg></button>
        <button type="button" class="radio-icon" data-radio="next" aria-label="Next track"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5l11 7-11 7z"/></svg></button>
        <button type="button" class="radio-icon" data-radio="close" aria-label="Close radio"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </div>
      <div class="radio-screen"><div id="radio-player"></div></div>
      <div class="radio-list">
        ${groups.map(g => `
          <p class="radio-group">${g}</p>
          ${TRACKS.map((t, i) => t.group === g ? `<button type="button" class="radio-track" data-track="${i}"><b>${t.title}</b><span>${t.by}</span></button>` : '').join('')}`).join('')}
      </div>`;
    document.body.appendChild(dock);
    dock.addEventListener('click', e => {
      const t = e.target.closest('[data-track]');
      if (t) play(Number(t.dataset.track));
      const a = e.target.closest('[data-radio]')?.dataset.radio;
      if (a === 'prev') play((current - 1 + TRACKS.length) % TRACKS.length);
      if (a === 'next') play((current + 1) % TRACKS.length);
      if (a === 'close') hide();
    });
  }

  function paint() {
    const t = TRACKS[current];
    dock.querySelector('#radio-title').textContent = t ? t.title : 'Stadium radio';
    dock.querySelector('#radio-by').textContent = t ? t.by : 'Pick a track';
    dock.querySelectorAll('[data-track]').forEach(b => b.classList.toggle('is-on', Number(b.dataset.track) === current));
    document.querySelectorAll('[data-radio-toggle]').forEach(b => { b.classList.toggle('is-on', open); b.setAttribute('aria-pressed', String(open)); });
  }

  function show() {
    open = true;
    dock.hidden = false;
    requestAnimationFrame(() => dock.classList.add('is-open'));
    paint();
  }

  function hide() {
    open = false;
    player?.stopVideo?.();
    dock.classList.remove('is-open', 'is-playing');
    setTimeout(() => { if (!open) dock.hidden = true; }, 300);
    paint();
  }

  async function play(i) {
    current = i;
    show();
    paint();
    await loadApi();
    const id = TRACKS[i].id;
    if (player && player.loadVideoById) { player.loadVideoById(id); return; }
    player = new YT.Player('radio-player', {
      videoId: id, width: '100%', height: '100%',
      playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
      events: {
        onReady: e => e.target.playVideo(),
        onStateChange: e => {
          dock.classList.toggle('is-playing', e.data === YT.PlayerState.PLAYING);
          // Songs roll on to the next song
          if (e.data === YT.PlayerState.ENDED && TRACKS[current].group === 'Songs') {
            const next = TRACKS.findIndex((t, k) => k > current && t.group === 'Songs');
            play(next >= 0 ? next : TRACKS.findIndex(t => t.group === 'Songs'));
          }
        }
      }
    });
  }

  function toggle() {
    if (open) hide();
    else if (current >= 0) show();
    else play(0);
  }

  // Called when someone taps Cristiano Ronaldo
  function ronaldo() {
    const i = TRACKS.findIndex(t => t.ronaldo);
    if (i >= 0 && current !== i) play(i);
  }

  function init() {
    build();
    document.querySelectorAll('[data-radio-toggle]').forEach(b => b.addEventListener('click', toggle));
    addEventListener('keydown', e => { if (e.key === 'Escape' && open && !document.querySelector('.player-drawer:not([hidden])')) hide(); });
  }

  return { init, play, ronaldo, toggle };
})();

window.Radio = Radio;
