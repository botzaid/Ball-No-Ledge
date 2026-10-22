// Stadium radio. Songs play through Spotify's slim official player, an 80px bar
// pinned to the bottom of the screen that keeps playing while you browse.
// (Spotify plays whole songs to visitors logged in to Spotify in that browser,
// 30-second previews to everyone else.) Moments and commentary are videos, so
// they open in YouTube's player in a lightbox you close when you're done:
// YouTube doesn't allow its videos to play hidden. We never host the audio.
// Tapping Cristiano Ronaldo anywhere plays his "How many people can do it like me?" clip.

const Radio = (() => {
  // Checked by the "YouTube lookup" workflow (oEmbed): research/spotify.jsonl, research/youtube.jsonl
  const SONGS = [
    { id: '2Cd9iWfcOpGDHLz6tVA3G4', title: 'Waka Waka (This Time for Africa)', by: 'Shakira ft. Freshlyground' },
    { id: '4nOygULhEuDO5ZBRNPFaso', title: "Wavin' Flag (Celebration Mix)", by: "K'naan" },
    { id: '0KnZ3Fgnqjmz4Sl2OA5zwa', title: 'La Copa de la Vida', by: 'Ricky Martin' },
    { id: '5pIy4qzGJmEElPppFxSN8W', title: 'Hala Madrid… y nada más', by: 'Real Madrid · RedOne' },
    { id: '7HJidWHPoAXJhaKeAmqfF5', title: 'Champions League anthem', by: 'UEFA · Tony Britten' }
  ];
  const MOMENTS = [
    { id: 'J98IGp8POH8', title: 'How many people can do it like me?', by: 'Cristiano Ronaldo', ronaldo: true },
    { id: '_zwPfLPtjAM', title: '"La pelota sale muy alta… pero le va a Zidane"', by: 'Radio call of the Glasgow volley · MARCA' },
    { id: 'cRu1PT8pCNE', title: 'The 92:48 header, explained', by: 'Ramos & Modrić · Real Madrid' },
    { id: 'D74ahf_1vzU', title: '80,000 sing Hala Madrid', by: 'Bernabéu crowd' },
    { id: 'PwFWUzTqZyA', title: "Zidane's volley, Glasgow 2002", by: 'CBS Sports Golazo' },
    { id: '5T5XKkzj8G0', title: "Bale's bicycle kick, Kyiv 2018", by: 'Champions League final' }
  ];

  let bar, list, box, controller = null, apiReady = null, current = -1, open = false, listOpen = false;

  // ---------- Spotify ----------

  function spotifyApi() {
    if (apiReady) return apiReady;
    apiReady = new Promise(resolve => {
      window.onSpotifyIframeApiReady = api => resolve(api);
      const s = document.createElement('script');
      s.src = 'https://open.spotify.com/embed/iframe-api/v1';
      s.async = true;
      document.head.appendChild(s);
    });
    return apiReady;
  }

  async function playSong(i) {
    current = (i + SONGS.length) % SONGS.length;
    showBar();
    const uri = `spotify:track:${SONGS[current].id}`;
    if (controller) { controller.loadUri(uri); controller.play(); paint(); return; }
    const api = await spotifyApi();
    api.createController(bar.querySelector('#radio-embed'), { uri, width: '100%', height: 80 }, c => {
      controller = c;
      c.addListener('ready', () => c.play());
      // Roll on to the next song at the end of this one
      c.addListener('playback_update', e => {
        const { isPaused, position, duration } = e.data;
        bar.classList.toggle('is-playing', !isPaused);
        if (duration && position >= duration - 400 && !isPaused) playSong(current + 1);
      });
    });
    paint();
  }

  // ---------- UI ----------

  function build() {
    bar = document.createElement('div');
    bar.className = 'radio-bar';
    bar.hidden = true;
    bar.innerHTML = `
      <div class="radio-embed"><div id="radio-embed"></div></div>
      <div class="radio-controls">
        <button type="button" class="radio-icon" data-radio="prev" aria-label="Previous song"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg></button>
        <button type="button" class="radio-icon" data-radio="next" aria-label="Next song"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5l11 7-11 7z"/></svg></button>
        <button type="button" class="radio-icon" data-radio="list" aria-label="Songs and moments" aria-expanded="false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg></button>
        <button type="button" class="radio-icon" data-radio="close" aria-label="Stop and close"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </div>`;

    list = document.createElement('div');
    list.className = 'radio-list';
    list.hidden = true;
    list.innerHTML = `
      <p class="radio-group">Songs</p>
      ${SONGS.map((t, i) => `<button type="button" class="radio-track" data-song="${i}"><b>${t.title}</b><span>${t.by}</span></button>`).join('')}
      <p class="radio-group">Moments and commentary <small>open a video</small></p>
      ${MOMENTS.map((t, i) => `<button type="button" class="radio-track" data-moment="${i}"><b>${t.title}</b><span>${t.by}</span></button>`).join('')}
      <p class="radio-note">Songs play through Spotify: whole tracks if you're logged in to Spotify in this browser, 30-second previews otherwise.</p>`;

    box = document.createElement('div');
    box.className = 'moment';
    box.hidden = true;
    box.innerHTML = `
      <div class="moment-card" role="dialog" aria-modal="true" aria-label="Video">
        <div class="moment-head"><div><b id="moment-title"></b><span id="moment-by"></span></div>
          <button type="button" class="radio-icon" data-moment-close aria-label="Close video"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
        <div class="moment-screen"></div>
      </div>`;

    document.body.append(list, bar, box);

    bar.addEventListener('click', e => {
      const a = e.target.closest('[data-radio]')?.dataset.radio;
      if (a === 'prev') playSong(current - 1);
      if (a === 'next') playSong(current + 1);
      if (a === 'list') toggleList();
      if (a === 'close') hide();
    });
    list.addEventListener('click', e => {
      const s = e.target.closest('[data-song]');
      const m = e.target.closest('[data-moment]');
      if (s) { playSong(Number(s.dataset.song)); toggleList(false); }
      if (m) { moment(MOMENTS[Number(m.dataset.moment)]); toggleList(false); }
    });
    box.addEventListener('click', e => { if (e.target === box || e.target.closest('[data-moment-close]')) closeMoment(); });
    document.addEventListener('pointerdown', e => {
      if (listOpen && !list.contains(e.target) && !e.target.closest('[data-radio="list"], [data-radio-toggle]')) toggleList(false);
    });
  }

  function paint() {
    list.querySelectorAll('[data-song]').forEach(b => b.classList.toggle('is-on', Number(b.dataset.song) === current));
    document.querySelectorAll('[data-radio-toggle]').forEach(b => { b.classList.toggle('is-on', open); b.setAttribute('aria-pressed', String(open)); });
    bar.querySelector('[data-radio="list"]').setAttribute('aria-expanded', String(listOpen));
  }

  function showBar() {
    open = true;
    bar.hidden = false;
    document.body.classList.add('has-radio');
    requestAnimationFrame(() => bar.classList.add('is-open'));
    paint();
  }

  function hide() {
    open = false;
    controller?.pause();
    toggleList(false);
    bar.classList.remove('is-open', 'is-playing');
    document.body.classList.remove('has-radio');
    setTimeout(() => { if (!open) bar.hidden = true; }, 300);
    paint();
  }

  function toggleList(force) {
    listOpen = force ?? !listOpen;
    list.hidden = !listOpen;
    list.classList.toggle('is-up', open);
    paint();
  }

  // ---------- moments (YouTube, in a lightbox) ----------

  function moment(t) {
    controller?.pause();
    box.querySelector('#moment-title').textContent = t.title;
    box.querySelector('#moment-by').textContent = t.by;
    box.querySelector('.moment-screen').innerHTML =
      `<iframe src="https://www.youtube-nocookie.com/embed/${t.id}?autoplay=1&rel=0&playsinline=1" title="${t.title.replace(/"/g, '&quot;')}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('is-open'));
  }

  function closeMoment() {
    box.classList.remove('is-open');
    box.querySelector('.moment-screen').innerHTML = '';
    setTimeout(() => { box.hidden = true; }, 250);
  }

  // ---------- public ----------

  // The music button: first press starts the songs and shows the list; after that it opens/closes the list
  function toggle() {
    if (!open) { playSong(Math.max(current, 0)); toggleList(true); }
    else toggleList();
  }

  function ronaldo() {
    const t = MOMENTS.find(m => m.ronaldo);
    if (t) moment(t);
  }

  function init() {
    build();
    document.querySelectorAll('[data-radio-toggle]').forEach(b => b.addEventListener('click', toggle));
    addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (!box.hidden) closeMoment();
      else if (listOpen) toggleList(false);
    });
  }

  return { init, ronaldo, toggle };
})();

window.Radio = Radio;
