// Merges the hand-written profiles (data.js) with the Wikipedia-derived history
// (history.js) into the single RM_PLAYERS list the app uses.
//  - Every hand-written profile gets Madrid apps/goals/assists, honours and caps
//    current to the date of the source list.
//  - Every other player who played 40+ official games from 2000-01 on gets a
//    generated profile.

const RM_LEGENDS = new Set(['raul', 'casillas', 'hierro', 'roberto-carlos', 'figo', 'zidane', 'ronaldo-nazario',
  'cristiano', 'sergio-ramos', 'marcelo', 'modric', 'kroos', 'benzema', 'bale']);

const RM_COUNTRY_NAMES = {
  ESP: 'Spain', FRA: 'France', CRO: 'Croatia', BRA: 'Brazil', GER: 'Germany', POR: 'Portugal', URU: 'Uruguay',
  BEL: 'Belgium', ARG: 'Argentina', WAL: 'Wales', MAR: 'Morocco', NED: 'Netherlands', ENG: 'England', AUT: 'Austria',
  COL: 'Colombia', TUR: 'Turkey', ITA: 'Italy', UKR: 'Ukraine', SER: 'Serbia', SRB: 'Serbia', DEN: 'Denmark', GHA: 'Ghana',
  MEX: 'Mexico', TOG: 'Togo', POL: 'Poland', CIV: 'Ivory Coast', NOR: 'Norway', CMR: 'Cameroon', RUS: 'Russia',
  ALG: 'Algeria', CRC: 'Costa Rica', MLI: 'Mali', DOM: 'Dominican Republic', BIH: 'Bosnia and Herzegovina',
  EQG: 'Equatorial Guinea', CPV: 'Cape Verde'
};
const RM_NAME_TO_CODE = Object.fromEntries(Object.entries(RM_COUNTRY_NAMES).map(([k, v]) => [v, k]));
Object.assign(RM_NAME_TO_CODE, { Austria: 'AUT', Mali: 'MLI', Cameroon: 'CMR', Morocco: 'MAR', 'Costa Rica': 'CRC',
  'Dominican Republic': 'DOM', 'Bosnia and Herzegovina': 'BIH', 'Equatorial Guinea': 'EQG', 'Cape Verde': 'CPV', Serbia: 'SRB' });

const POSITIONS = {
  GK: ['Goalkeeper', 'goalkeeper'], DF: ['Defender', 'defender'], MF: ['Midfielder', 'midfielder'], FW: ['Forward', 'forward']
};

// Short bios for well-known former players without a hand-written profile.
const RM_BIOS = {
  raul: "Madrid's record appearance maker and the face of the club for 16 seasons. An academy graduate, he won three European Cups and six league titles before leaving for Schalke in 2010.",
  casillas: 'Came through the academy and kept goal for 16 seasons, captaining the side to La Décima in 2014. Won three Champions Leagues before leaving for Porto in 2015.',
  'manolo-sanchis': 'One-club defender whose Madrid career ran from 1983 to 2001 and finished with two Champions League wins.',
  hierro: 'Commanding centre-back, long-time captain and penalty taker. Lifted three Champions Leagues before leaving for Al-Rayyan in 2003.',
  guti: 'Gifted academy midfielder known for his vision and his backheels. Spent his whole senior career at Madrid before joining Beşiktaş in 2010.',
  'roberto-carlos': 'Attacking left-back with a famously ferocious left foot. Eleven seasons, three Champions Leagues and four league titles before joining Fenerbahçe in 2007.',
  'lucas-vazquez': 'Academy winger turned right-back who won five Champions Leagues over ten seasons, then joined Bayer Leverkusen in 2025.',
  salgado: 'Right-back signed from Celta in 1999 who became a fixture of the early-2000s side and won two Champions Leagues.',
  isco: 'Playmaker signed from Málaga in 2013 and part of the side that won five Champions Leagues in nine years.',
  helguera: 'Versatile defender and midfielder who arrived from Espanyol in 1999 and won two Champions Leagues.',
  pepe: 'Uncompromising centre-back signed from Porto in 2007; won three Champions Leagues alongside Sergio Ramos.',
  asensio: 'Left-footed attacker signed from Mallorca, known for spectacular goals, including one in the 2017 Champions League final.',
  morientes: 'Striker who formed a famous partnership with Raúl and scored the opener in the 2000 Champions League final.',
  higuain: 'Prolific Argentine striker signed from River Plate as a teenager; won three league titles before moving to Napoli in 2013.',
  figo: "Signed from Barcelona in 2000 in one of football's most controversial transfers, and won the Ballon d'Or months later.",
  arbeloa: 'Academy full-back who returned from Liverpool in 2009 and won two Champions Leagues. Coached the first team for the second half of 2025-26.',
  'xabi-alonso': 'Deep-lying playmaker signed from Liverpool in 2009 and central to the run to La Décima. Came back as head coach in 2025.',
  redondo: 'Elegant Argentine holding midfielder, remembered for his backheel at Old Trafford in 2000. Won two Champions Leagues.',
  ceballos: 'Midfielder signed from Betis in 2017 after starring at the Under-21 Euros; went back to Betis in 2026.',
  solari: 'Left-sided Argentine midfielder who won the 2002 Champions League and later coached the first team.',
  'di-maria': 'Argentine winger signed from Benfica and man of the match in the 2014 Champions League final, weeks before leaving for Manchester United.',
  'ronaldo-nazario': "Brazil's World Cup-winning striker, signed from Inter after the 2002 tournament. Won La Liga in his first season and the Pichichi in 2004.",
  pavon: "Academy centre-back who became the symbol of the 'Zidanes y Pavones' policy of mixing superstars with youth products.",
  khedira: 'German midfielder signed from Stuttgart after the 2010 World Cup and part of the 2014 Champions League side.',
  savio: 'Brazilian winger who won three Champions Leagues with Madrid.',
  seedorf: 'Dutch midfielder who won the 1998 Champions League with Madrid, one of his four with three different clubs.',
  beckham: 'Joined from Manchester United in 2003 as the latest Galáctico; won La Liga in his final season before moving to LA Galaxy.',
  ozil: 'German playmaker signed after the 2010 World Cup who set up goal after goal for Cristiano Ronaldo before joining Arsenal in 2013.',
  mcmanaman: 'Joined on a free from Liverpool in 1999 and scored a volley in the 2000 Champions League final.',
  karanka: "Centre-back who won three Champions Leagues, later Mourinho's assistant during his first spell as coach.",
  robinho: 'Brazilian winger signed from Santos in 2005; won two league titles before joining Manchester City in 2008.',
  alaba: 'Versatile defender signed on a free from Bayern in 2021; won two Champions Leagues before joining Udinese in 2026.',
  'mahamadou-diarra': 'Malian holding midfielder signed from Lyon in 2006 and part of two league-winning sides.',
  james: 'Colombian playmaker signed from Monaco in 2014 after winning the World Cup Golden Boot.',
  gago: 'Argentine midfielder signed from Boca Juniors in 2007, part of two league-winning sides.',
  kaka: "Ballon d'Or winner signed from AC Milan in 2009 for a then-record fee; injuries kept him from his Milan form.",
  illgner: 'German World Cup winner in goal who won two Champions Leagues with Madrid.',
  cannavaro: "Signed from Juventus in 2006, weeks after captaining Italy to the World Cup and months before winning the Ballon d'Or.",
  albiol: 'Centre-back signed from Valencia in 2009; won the league and the Copa del Rey under Mourinho.',
  kovacic: 'Croatian midfielder signed from Inter in 2015; won three Champions Leagues before moving to Chelsea.',
  'fran-garcia': 'Academy left-back who came back from Rayo Vallecano in 2023 and joined Real Betis in 2026.',
  coentrao: 'Portuguese left-back signed from Benfica in 2011.',
  'van-nistelrooy': 'Dutch striker signed from Manchester United in 2006; top scorer in La Liga in his first season as Madrid won the title.',
  morata: 'Academy striker who left for Juventus in 2014, was bought back in 2016 and won the double in 2017.',
  hazard: 'Signed from Chelsea in 2019 for a fee reported at over €100m; injuries meant he never found his Chelsea form, and he retired in 2023.',
  'diego-lopez': 'Academy goalkeeper who returned from Sevilla in 2013 and took over in the league from Casillas.',
  cambiasso: 'Argentine midfielder who left for Inter in 2004 and later won the treble there in 2010.',
  sneijder: 'Dutch playmaker signed from Ajax in 2007; won La Liga in his first season before joining Inter.',
  robben: 'Signed from Chelsea in 2007; won La Liga in 2008 before moving to Bayern Munich.',
  'cesar-sanchez': 'First-choice goalkeeper for much of 2001-02 until an injury in the Champions League final let Iker Casillas in.',
  'gonzalo-garcia': 'Academy striker who broke through at the 2025 Club World Cup, finishing as its top scorer, and joined Fulham in 2026.',
  owen: 'England striker who spent one season, 2004-05, at Madrid, often off the bench, before joining Newcastle.',
  samuel: 'Argentine centre-back who spent one season, 2004-05, at Madrid before joining Inter.',
  'keylor-navas': 'Costa Rican goalkeeper signed after the 2014 World Cup who kept goal for three straight Champions League wins.',
  mariano: 'Academy striker who returned from Lyon in 2018 and was handed the No. 7 shirt.',
  varane: 'French centre-back signed from Lens as a teenager in 2011; four Champions Leagues and a World Cup before joining Manchester United.',
  makelele: "Defensive midfielder so influential that 'the Makélélé role' was named after him. Left for Chelsea in 2003.",
  lass: 'French midfielder signed from Portsmouth in 2009.',
  theo: 'Left-back signed from Atlético Madrid in 2017; part of the squad that won the 2018 Champions League.'
};

const isMadrid = c => /^Real Madrid( CF| C\.F\.)?$/.test(c.club);
const isMadridYouth = c => /^Real Madrid (Castilla|B|C|Juvenil)$|^Castilla$/.test(c.club);

function lastYear(spans) {
  if (/–\s*$/.test(spans)) return null;
  const ys = (spans.match(/\d{4}/g) || []).map(Number);
  return ys.length ? Math.max(...ys) : null;
}

function firstYear(spans) {
  const ys = (spans.match(/\d{4}/g) || []).map(Number);
  return ys.length ? Math.min(...ys) : null;
}

// Club Madrid signed the player from (null = academy) and the club they went to next.
function transferRoute(profile, current) {
  const clubs = profile?.clubs || [];
  const first = clubs.findIndex(isMadrid);
  if (first === -1) return { from: undefined, to: undefined };
  let from = null;
  for (let j = first - 1; j >= 0; j--) {
    if (!clubs[j].loan && !isMadridYouth(clubs[j]) && !isMadrid(clubs[j])) { from = clubs[j]; break; }
  }
  if (!from) {
    // Players developed elsewhere but only loaned out before joining: take the last non-academy club
    for (let j = first - 1; j >= 0; j--) if (!isMadridYouth(clubs[j])) { from = clubs[j]; break; }
  }
  let last = first;
  clubs.forEach((c, i) => { if (isMadrid(c)) last = i; });
  let to = null;
  if (!current) {
    for (let j = last + 1; j < clubs.length; j++) if (!clubs[j].loan) { to = clubs[j]; break; }
  }
  return { from: from?.club || null, to: to?.club || null };
}

function honoursList(profile) {
  return (profile?.honours || []).map(h => h.seasons.length > 1
    ? `${h.seasons.length}x ${h.competition} (${h.seasons.join(', ')})`
    : `${h.competition} (${h.seasons[0]})`);
}

function generatedLineage(profile) {
  const out = [];
  const clubs = profile?.clubs || [];
  const first = clubs.findIndex(isMadrid);
  let last = first;
  clubs.forEach((c, i) => { if (isMadrid(c)) last = i; });
  for (const y of profile?.youth || []) {
    out.push({ stage: 'Youth', club: y.club, country: clubCountry(y.club), years: y.years, details: '' });
  }
  clubs.forEach((c, i) => {
    const stage = isMadrid(c) ? 'Real Madrid' : c.loan ? 'Loan' : (first !== -1 && i > last) ? 'After Madrid' : 'Senior career';
    const entry = { stage, club: isMadrid(c) ? 'Real Madrid' : c.club, country: clubCountry(c.club), years: c.years, details: '' };
    if (c.apps !== undefined) { entry.appearances = c.apps; entry.goals = c.goals; }
    out.push(entry);
  });
  return out;
}

function generatedBio(p, a, route) {
  const parts = [`${p.position} from ${p.nationality}, at Madrid ${a.spans.replace('–', ' to ').replace(/ to $/, ' onwards')}.`];
  if (route.from) parts.push(`Signed from ${route.from}.`);
  else if (route.from === null) parts.push('Came through the club\'s academy.');
  if (route.to) parts.push(`Moved on to ${route.to}.`);
  return parts.join(' ');
}

(function mergePlayers() {
  const archiveById = Object.fromEntries(RM_ARCHIVE.map(a => [a.id, a]));
  const photos = new Set(RM_PHOTO_IDS);

  // 1. Bring the hand-written profiles up to date
  for (const p of RM_PLAYERS) {
    const a = archiveById[p.id];
    const prof = RM_PROFILES[p.id];
    p.archive = a || null;
    if (a) {
      p.stats = p.stats || {};
      p.stats.madridApps = a.apps;
      p.stats.madridGoals = a.goals;
      p.stats.madridAssists = a.assists;
      p.madridYears = a.spans;
      p.statsCurrent = true;
    }
    if (prof?.honours?.length) {
      p.stats = p.stats || {};
      p.stats.trophiesMadrid = honoursList(prof);
      p.trophyCount = prof.honours.reduce((n, h) => n + h.seasons.length, 0);
    } else if (p.stats && !p.stats.trophiesMadrid) {
      p.stats.trophiesMadrid = [];
    }
    if (prof?.national?.caps != null) {
      p.stats = p.stats || {};
      p.stats.internationalCaps = prof.national.caps;
      p.stats.internationalGoals = prof.national.goals;
    }
    if (prof?.height && !p.height) p.height = prof.height;
    if (prof?.birthDate && !p.birthDate) p.birthDate = prof.birthDate;
    if (prof?.birthPlace && !p.birthPlace) p.birthPlace = prof.birthPlace;
    if (RM_LEGENDS.has(p.id) && p.status !== 'active') {
      p.status = 'legend';
      p.statusLabel = 'Club legend';
    }
    p.route = transferRoute(prof, p.status === 'active');
    if (!p.photo && photos.has(p.id)) p.photo = `images/players/${p.id}.jpg`;
    p.handWritten = true;
  }

  // 2. Generated profiles for everyone else with 40+ games since 2000
  const known = new Set(RM_PLAYERS.map(p => p.id));
  for (const a of RM_ARCHIVE) {
    if (known.has(a.id) || (a.apps || 0) < 40 || a.current) continue;
    const prof = RM_PROFILES[a.id] || {};
    const [position, category] = POSITIONS[a.pos] || POSITIONS.MF;
    const code = RM_NAME_TO_CODE[a.code] || a.code;
    const route = transferRoute(prof, false);
    const p = {
      id: a.id,
      name: a.name,
      fullName: prof.fullName || a.name,
      number: null,
      position, category,
      status: RM_LEGENDS.has(a.id) ? 'legend' : 'departed',
      statusLabel: RM_LEGENDS.has(a.id) ? 'Club legend' : `Madrid ${a.spans}`,
      nationality: RM_COUNTRY_NAMES[code] || a.code,
      code,
      birthDate: prof.birthDate, birthPlace: prof.birthPlace, height: prof.height,
      joinedRealMadrid: String(firstYear(a.spans) || ''),
      departureYear: String(lastYear(a.spans) || ''),
      currentClub: null,
      madridYears: a.spans,
      photo: photos.has(a.id) ? `images/players/${a.id}.jpg` : null,
      bio: RM_BIOS[a.id] || null,
      lineage: generatedLineage(prof),
      stats: {
        madridApps: a.apps, madridGoals: a.goals, madridAssists: a.assists,
        internationalCaps: prof.national?.caps ?? null, internationalGoals: prof.national?.goals ?? null,
        trophiesMadrid: honoursList(prof)
      },
      trophyCount: (prof.honours || []).reduce((n, h) => n + h.seasons.length, 0),
      national: prof.national || null,
      route,
      archive: a,
      statsCurrent: true,
      peakPerformances: [], records: [], facts: []
    };
    p.bio = p.bio || generatedBio(p, a, route);
    RM_PLAYERS.push(p);
  }

  // 3. Derived fields used everywhere
  for (const p of RM_PLAYERS) {
    p.headshot = p.photo ? p.photo.replace('images/players/', 'images/players/headshots/') : null;
    p.code = p.code || RM_NAME_TO_CODE[p.nationality] || p.nationality.slice(0, 3).toUpperCase();
    p.photoCredit = RM_PHOTO_CREDITS[p.id] || null;
    p.season = RM_CURRENT_STATS[p.id] || null;
    p.leftYear = p.status === 'active' ? null : Number(p.departureYear) || lastYear(p.madridYears || '') || null;
  }

  RM_NATIONS.length = 0;
  RM_NATIONS.push(...[...new Set(RM_PLAYERS.map(p => p.nationality))].sort());
})();
