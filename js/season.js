// 2026-27 season helpers. Results, scorers and fixtures are generated into
// history.js (RM_SEASON_RESULTS, RM_FIXTURES) by research/build_history.py from
// the Wikipedia season page, which a scheduled GitHub Action refreshes.
// The short match notes below are written by hand; matches without a note just show the result.

const RM_MATCH_NOTES = {
  '2026-08-22': "José Mourinho's first game back. Espí, on as a substitute, scored the winner on his debut.",
  '2026-08-26': 'Mbappé hat-trick; result took Madrid top of the table.',
  '2026-08-30': 'Own goal by Málaga keeper Alfonso Herrero. Mbappé volleyed in an Alexander-Arnold cross.',
  '2026-09-04': 'First defeat. Troy Parrott scored in the 81st minute and Álvaro Valles saved a stoppage-time Mbappé penalty.',
  '2026-09-08': 'League phase, matchday 1.',
  '2026-09-12': "Mbappé's first was a penalty after Carreras was tripped.",
  '2026-09-15': 'Own goal by Elche keeper Matías Dituro. Espí won it in stoppage time from a Mbappé pass.',
  '2026-09-20': 'Huijsen sent off after conceding the penalty for the opener. Rüdiger headed in from a Bernardo Silva delivery.',
  '2026-10-10': "Diomande's first goal for the club, set up by Valverde. Vinícius was sent off.",
  '2026-10-14': 'Came back from 3-1 down with three goals from corners in the last seven minutes.',
  '2026-10-18': "Mbappé's second was a penalty. Vinícius suspended.",
  '2026-10-21': 'Diomande volleyed in late against the club he left in the summer.'
};

const RM_SEASON_MATCHES = (typeof RM_SEASON_RESULTS !== 'undefined' ? RM_SEASON_RESULTS : [])
  .map(m => ({ ...m, note: RM_MATCH_NOTES[m.date] || '' }));

const RM_SEASON_UPDATED = (() => {
  const last = RM_SEASON_MATCHES[RM_SEASON_MATCHES.length - 1];
  return last ? new Date(last.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
})();

// First fixture from today on, so the "next match" moves even between data refreshes.
const RM_NEXT_MATCH = (() => {
  const today = new Date().toISOString().slice(0, 10);
  const fixtures = typeof RM_FIXTURES !== 'undefined' ? RM_FIXTURES : [];
  return fixtures.find(f => f.date >= today) || null;
})();

function seasonGoals() {
  const goals = {};
  for (const m of RM_SEASON_MATCHES) {
    for (const [id] of m.scorers) {
      if (id !== 'og') goals[id] = (goals[id] || 0) + 1;
    }
  }
  return goals;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RM_MATCH_NOTES, RM_SEASON_MATCHES, RM_SEASON_UPDATED, RM_NEXT_MATCH, seasonGoals };
}
