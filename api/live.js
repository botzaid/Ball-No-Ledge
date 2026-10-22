// Vercel serverless function: GET /api/live
// Real Madrid's live score, from whichever provider has a key set in the Vercel
// project's environment variables:
//   API_FOOTBALL_KEY     api-football.com (api-sports.io). Every competition, free plan 100 calls/day.
//   FOOTBALL_DATA_TOKEN  football-data.org. La Liga + Champions League; free plan scores are delayed.
// To stay inside free limits, the provider is only called during a match window
// (15 min before kick-off to 2.5 h after), worked out from the fixture list the
// site already generates. Responses are cached at Vercel's edge, so all visitors
// share one upstream call.

const { RM_FIXTURES = [], RM_SEASON_RESULTS = [] } = require('../js/history.js');

const WINDOW_BEFORE = 15 * 60 * 1000;
const WINDOW_AFTER = 150 * 60 * 1000;

function matchInWindow(now = Date.now()) {
  return [...RM_SEASON_RESULTS, ...RM_FIXTURES].find(m => {
    if (!m.kickoff) return false;
    const k = Date.parse(m.kickoff);
    return now >= k - WINDOW_BEFORE && now <= k + WINDOW_AFTER;
  }) || null;
}

// ---------- API-Football ----------

const AF_TEAM = 541; // Real Madrid
const AF_LIVE = new Set(['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE']);

async function apiFootball(key) {
  const today = new Date().toISOString().slice(0, 10);
  const r = await fetch(`https://v3.football.api-sports.io/fixtures?team=${AF_TEAM}&date=${today}`, {
    headers: { 'x-apisports-key': key }
  });
  if (!r.ok) throw new Error(`api-football ${r.status}`);
  const body = await r.json();
  if (body.errors && Object.keys(body.errors).length) throw new Error(`api-football ${JSON.stringify(body.errors)}`);
  const f = (body.response || [])[0];
  if (!f) return null;
  const madridHome = f.teams.home.id === AF_TEAM;
  const scorers = (f.events || [])
    .filter(e => e.type === 'Goal' && e.detail !== 'Missed Penalty')
    .map(e => ({ name: e.player?.name, minute: e.time?.elapsed + (e.time?.extra ? `+${e.time.extra}` : ''), madrid: e.team?.id === AF_TEAM, own: e.detail === 'Own Goal' }));
  return {
    status: AF_LIVE.has(f.fixture.status.short) ? 'LIVE' : f.fixture.status.short === 'FT' || f.fixture.status.short === 'AET' || f.fixture.status.short === 'PEN' ? 'FINISHED' : 'SCHEDULED',
    statusText: f.fixture.status.long,
    minute: f.fixture.status.elapsed,
    competition: f.league?.name,
    kickoff: f.fixture.date,
    home: f.teams.home.name,
    away: f.teams.away.name,
    homeIsMadrid: madridHome,
    score: { home: f.goals.home, away: f.goals.away },
    scorers
  };
}

// ---------- football-data.org ----------

const FD_TEAM = 86;
const FD_LIVE = new Set(['IN_PLAY', 'PAUSED', 'LIVE']);

async function footballData(token) {
  const day = 24 * 3600 * 1000;
  const from = new Date(Date.now() - day).toISOString().slice(0, 10);
  const to = new Date(Date.now() + day).toISOString().slice(0, 10);
  const r = await fetch(`https://api.football-data.org/v4/teams/${FD_TEAM}/matches?dateFrom=${from}&dateTo=${to}`, {
    headers: { 'X-Auth-Token': token }
  });
  if (!r.ok) throw new Error(`football-data ${r.status}`);
  const { matches = [] } = await r.json();
  const m = matches.find(x => FD_LIVE.has(x.status)) || matches.find(x => x.status === 'FINISHED') || matches[0];
  if (!m) return null;
  return {
    status: FD_LIVE.has(m.status) ? 'LIVE' : m.status === 'FINISHED' ? 'FINISHED' : 'SCHEDULED',
    statusText: m.status,
    minute: m.minute ?? null,
    competition: m.competition?.name,
    kickoff: m.utcDate,
    home: m.homeTeam?.shortName || m.homeTeam?.name,
    away: m.awayTeam?.shortName || m.awayTeam?.name,
    homeIsMadrid: m.homeTeam?.id === FD_TEAM,
    score: { home: m.score?.fullTime?.home ?? null, away: m.score?.fullTime?.away ?? null },
    scorers: []
  };
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const afKey = process.env.API_FOOTBALL_KEY;
  const fdToken = process.env.FOOTBALL_DATA_TOKEN;
  const provider = afKey ? 'api-football' : fdToken ? 'football-data' : null;
  const send = (cache, body) => { res.setHeader('Cache-Control', cache); res.status(200).end(JSON.stringify({ provider, ...body })); };

  if (!provider) return send('s-maxage=300', { state: 'unconfigured' });

  const fixture = matchInWindow();
  if (!fixture && req.query?.force !== '1') {
    // No Real Madrid game on right now: don't spend an API call
    return send('s-maxage=600, stale-while-revalidate=600', { state: 'idle' });
  }

  try {
    const match = afKey ? await apiFootball(afKey) : await footballData(fdToken);
    if (match && match.status === 'LIVE') {
      // API-Football's free plan allows 100 calls a day: refresh every 2 minutes (~80 a match).
      return send(afKey ? 's-maxage=120, stale-while-revalidate=60' : 's-maxage=30, stale-while-revalidate=30',
        { state: 'live', live: match, fetchedAt: new Date().toISOString() });
    }
    return send('s-maxage=300, stale-while-revalidate=300', {
      state: match?.status === 'FINISHED' ? 'finished' : 'idle', last: match, fetchedAt: new Date().toISOString()
    });
  } catch (e) {
    return send('s-maxage=120', { state: 'error', message: String(e.message || e) });
  }
};
