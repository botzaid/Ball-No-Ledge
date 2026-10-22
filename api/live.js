// Vercel serverless function: GET /api/live
// Returns Real Madrid's live (or next/most recent) match from football-data.org.
// Needs FOOTBALL_DATA_TOKEN set in the Vercel project's environment variables
// (free key from https://www.football-data.org/client/register).
// Responses are cached at Vercel's edge for 30 s, so every visitor shares one upstream call.

const TEAM_ID = 86; // Real Madrid on football-data.org
const LIVE = new Set(['IN_PLAY', 'PAUSED', 'LIVE']);

function shape(m) {
  if (!m) return null;
  return {
    id: m.id,
    competition: m.competition?.name,
    status: m.status,
    kickoff: m.utcDate,
    minute: m.minute ?? null,
    home: m.homeTeam?.shortName || m.homeTeam?.name,
    away: m.awayTeam?.shortName || m.awayTeam?.name,
    homeIsMadrid: m.homeTeam?.id === TEAM_ID,
    score: {
      home: m.score?.fullTime?.home ?? null,
      away: m.score?.fullTime?.away ?? null,
      halfTimeHome: m.score?.halfTime?.home ?? null,
      halfTimeAway: m.score?.halfTime?.away ?? null
    }
  };
}

module.exports = async (req, res) => {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (!token) {
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(200).end(JSON.stringify({ state: 'unconfigured' }));
    return;
  }

  const day = 24 * 3600 * 1000;
  const from = new Date(Date.now() - 2 * day).toISOString().slice(0, 10);
  const to = new Date(Date.now() + 10 * day).toISOString().slice(0, 10);
  try {
    const r = await fetch(`https://api.football-data.org/v4/teams/${TEAM_ID}/matches?dateFrom=${from}&dateTo=${to}`, {
      headers: { 'X-Auth-Token': token }
    });
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const { matches = [] } = await r.json();
    const live = matches.find(m => LIVE.has(m.status));
    const next = matches.find(m => ['SCHEDULED', 'TIMED'].includes(m.status));
    const last = [...matches].reverse().find(m => m.status === 'FINISHED');
    // Poll fast while a game is on, slowly otherwise
    res.setHeader('Cache-Control', live ? 's-maxage=30, stale-while-revalidate=30' : 's-maxage=300, stale-while-revalidate=600');
    res.status(200).end(JSON.stringify({
      state: live ? 'live' : 'idle',
      live: shape(live),
      next: shape(next),
      last: shape(last),
      fetchedAt: new Date().toISOString()
    }));
  } catch (e) {
    res.setHeader('Cache-Control', 's-maxage=60');
    res.status(200).end(JSON.stringify({ state: 'error', message: String(e.message || e) }));
  }
};
