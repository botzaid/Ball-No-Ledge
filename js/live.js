// Live match state. Asks /api/live (a Vercel function, see api/live.js) for
// Real Madrid's live score; polls every minute during a game, every 5 min otherwise
// (the function itself only calls the score provider during a match window).
// Without the function (local preview) or without an API key, it falls back to
// the next fixture from the generated data, with a countdown to kick-off.

const Live = (() => {
  const listeners = new Set();
  let state = { mode: 'fixture', live: null, next: null, last: null };
  let timer = null;

  const derby = opp => /barcelona|barça/i.test(opp) ? 'El Clásico' : /atl[eé]tico/i.test(opp) ? 'El Derbi' : null;

  function staticNext() {
    if (!RM_NEXT_MATCH) return null;
    const f = RM_NEXT_MATCH;
    return {
      competition: f.comp,
      kickoff: f.kickoff || `${f.date}T19:00:00Z`,
      home: f.venue === 'H' ? 'Real Madrid' : f.opponent,
      away: f.venue === 'H' ? f.opponent : 'Real Madrid',
      opponent: f.opponent
    };
  }

  function emit() { listeners.forEach(fn => fn(state)); }

  async function poll() {
    clearTimeout(timer);
    let next = 300000;
    try {
      if (!/^https?:$/.test(location.protocol)) throw new Error('no api');
      const r = await fetch('/api/live', { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      const data = await r.json();
      if (data.state === 'live' && data.live) {
        state = { mode: 'live', live: data.live, next: null, last: null };
        next = 60000;
      } else {
        state = { mode: 'fixture', live: null, next: staticNext(), last: data.last || null, api: data.state };
      }
    } catch (e) {
      state = { mode: 'fixture', live: null, next: staticNext(), last: null, api: 'offline' };
    }
    emit();
    timer = setTimeout(poll, next);
  }

  function subscribe(fn) {
    listeners.add(fn);
    fn(state);
    return () => listeners.delete(fn);
  }

  function countdown(iso) {
    const ms = new Date(iso) - Date.now();
    if (ms <= 0) return null;
    const s = Math.floor(ms / 1000);
    return { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
  }

  function start() {
    state.next = staticNext();
    poll();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });
  }

  return { start, subscribe, countdown, derby };
})();

window.Live = Live;
