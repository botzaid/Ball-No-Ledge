// 2026-27 competitive results, last updated 22 October 2026 (after Real Madrid 4-1 RB Leipzig on 21 October).
// Goals per player in the app are counted from these scorer lists, so add new matches here.
// Scorers are player ids from RM_PLAYERS; "og" is an opponent own goal. Minutes where reports agree.

const RM_SEASON_MATCHES = [
  { date: '2026-08-22', comp: 'La Liga', opponent: 'Espanyol', venue: 'A', score: [2, 1],
    scorers: [['bellingham', 9], ['espi', 90]],
    note: "José Mourinho's first game back. Espí, on as a substitute, scored the winner on his debut." },
  { date: '2026-08-26', comp: 'La Liga', opponent: 'Real Sociedad', venue: 'H', score: [4, 1],
    scorers: [['mbappe', 40], ['mbappe', 60], ['vinicius', 68], ['mbappe', 80]],
    note: 'Mbappé hat-trick; result took Madrid top of the table.' },
  { date: '2026-08-30', comp: 'La Liga', opponent: 'Málaga', venue: 'H', score: [4, 0],
    scorers: [['bellingham', 19], ['og', 26], ['mbappe', 30], ['guler', 91]],
    note: 'Own goal by Málaga keeper Alfonso Herrero. Mbappé volleyed in an Alexander-Arnold cross.' },
  { date: '2026-09-04', comp: 'La Liga', opponent: 'Real Betis', venue: 'A', score: [0, 1],
    scorers: [],
    note: 'First defeat. Troy Parrott scored in the 81st minute and Álvaro Valles saved a stoppage-time Mbappé penalty.' },
  { date: '2026-09-08', comp: 'Champions League', opponent: 'Inter', venue: 'H', score: [2, 1],
    scorers: [['mbappe', 14], ['valverde', 23]],
    note: 'League phase, matchday 1.' },
  { date: '2026-09-12', comp: 'La Liga', opponent: 'Rayo Vallecano', venue: 'H', score: [4, 1],
    scorers: [['mbappe', 14], ['carreras', 17], ['bellingham', 35], ['mbappe', 91]],
    note: "Mbappé's first was a penalty after Carreras was tripped." },
  { date: '2026-09-15', comp: 'La Liga', opponent: 'Elche', venue: 'A', score: [3, 2],
    scorers: [['og', null], ['mbappe', null], ['espi', 91]],
    note: 'Own goal by Elche keeper Matías Dituro. Espí won it in stoppage time from a Mbappé pass.' },
  { date: '2026-09-20', comp: 'La Liga', opponent: 'Atlético Madrid', venue: 'A', score: [1, 2],
    scorers: [['rudiger', 89]],
    note: 'Huijsen sent off after conceding the penalty for the opener. Rüdiger headed in from a Bernardo Silva delivery.' },
  { date: '2026-10-10', comp: 'La Liga', opponent: 'Villarreal', venue: 'H', score: [1, 0],
    scorers: [['diomande', 62]],
    note: "Diomande's first goal for the club, set up by Valverde. Vinícius was sent off." },
  { date: '2026-10-14', comp: 'Champions League', opponent: 'Roma', venue: 'A', score: [4, 3],
    scorers: [['mbappe', 25], ['espi', 83], ['endrick', 85], ['rudiger', 90]],
    note: 'Came back from 3-1 down with three goals from corners in the last seven minutes.' },
  { date: '2026-10-18', comp: 'La Liga', opponent: 'Sevilla', venue: 'H', score: [4, 1],
    scorers: [['guler', 30], ['mbappe', 37], ['mbappe', 63], ['diomande', 82]],
    note: "Mbappé's second was a penalty. Vinícius suspended." },
  { date: '2026-10-21', comp: 'Champions League', opponent: 'RB Leipzig', venue: 'H', score: [4, 1],
    scorers: [['bernardo', 43], ['guler', 52], ['mbappe', 83], ['diomande', 87]],
    note: 'Diomande volleyed in late against the club he left in the summer.' }
];

const RM_SEASON_UPDATED = '22 October 2026';
const RM_NEXT_MATCH = { date: '2026-10-25', comp: 'La Liga', opponent: 'Barcelona', venue: 'A' };

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
  module.exports = { RM_SEASON_MATCHES, RM_SEASON_UPDATED, RM_NEXT_MATCH, seasonGoals };
}
