// Country of every club that appears in a player's career history, used to
// group the transfer map. Reserve/II/B sides inherit their first team's country.

const RM_CLUB_COUNTRIES = (() => {
  const byCountry = {
    Spain: ['Alavés', 'Albacete', 'Alcorcón', 'Almería', 'Alzira B', 'Athletic Bilbao', 'Atlético Madrid', 'Badajoz', 'Badalona',
      'Barcelona', 'Beniopa', 'Betis', 'Bilbao Athletic', 'Cartagena', 'Castilla', 'Celta', 'Celta Vigo', 'Cádiz', 'Córdoba',
      'Deportivo La Coruña', 'Eibar', 'Elche', 'Espanyol', 'Gandía', 'Getafe', 'Gimnàstic', 'Granada', 'Hércules', 'Las Palmas',
      'Leganés', 'Levante', 'Lugo', 'Mallorca', 'Manchego', 'Marbella', 'Murcia', 'Málaga', 'Numancia', 'Osasuna', 'Oviedo',
      'Pego', 'Racing Murcia', 'Racing Mérida City', 'Racing Santander', 'Rayo Vallecano', 'Real Betis', 'Real Madrid',
      'Real Murcia', 'Real Sociedad', 'Revilla', 'Salamanca', 'Santa Ana', 'Santoña', 'Sevilla', 'Sevilla Atlético', 'Tenerife',
      'Valencia', 'Valladolid', 'Villarreal', 'Zaragoza', 'Racing'],
    England: ['Arsenal', 'Aston Villa', 'Birmingham City', 'Blackburn Rovers', 'Bolton Wanderers', 'Bournemouth',
      'Brighton & Hove Albion', 'Chelsea', 'Everton', 'Fulham', 'Ipswich Town', 'Leeds United', 'Leicester City', 'Liverpool',
      'Manchester City', 'Manchester United', 'Middlesbrough', 'Newcastle United', 'Nottingham Forest', 'Portsmouth',
      'Preston North End', 'Queens Park Rangers', 'Reading', 'Sheffield Wednesday', 'Southampton', 'Stoke City',
      'Tottenham Hotspur', 'West Ham United'],
    Italy: ['AC Milan', 'Como', 'Fiorentina', 'Inter Milan', 'Juventus', 'Napoli', 'Parma', 'Pisa', 'Roma', 'Sampdoria', 'Udinese'],
    Germany: ['1. FC Köln', 'Bayer Leverkusen', 'Bayern Munich', 'Borussia Dortmund', 'Eintracht Frankfurt', 'Hamburger SV',
      'Hannover 96', 'Hertha BSC', 'RB Leipzig', 'Schalke 04', 'TSG Hoffenheim', 'VfB Stuttgart', 'Werder Bremen'],
    France: ['Arles-Avignon', 'Bordeaux', 'Cannes', 'Le Havre', 'Lens', 'Lille', 'Lyon', 'Marseille', 'Monaco', 'Nantes', 'Nice',
      'Paris Saint-Germain', 'Rennes', 'Sochaux'],
    Portugal: ['Alverca', 'Benfica', 'Leça', 'Marítimo', 'Porto', 'Rio Ave', 'Sporting CP', 'Vitória Setúbal'],
    Netherlands: ['Ajax', 'Den Bosch', 'Feyenoord', 'Groningen', 'Heerenveen', 'Kozakken Boys', 'PSV', 'PSV Eindhoven',
      'Sparta Rotterdam', 'Vitesse'],
    Brazil: ['América Mineiro', 'Atlético Mineiro', 'Avaí', 'Botafogo', 'Corinthians', 'Coritiba', 'Cruzeiro', 'Desportiva Capixaba',
      'Flamengo', 'Fluminense', 'Palmeiras', 'Rio Branco-SP', 'Santos', 'São Paulo', 'União São João'],
    Argentina: ['Argentinos Juniors', 'Banfield', 'Boca Juniors', 'Independiente', "Newell's Old Boys", 'River Plate',
      'Rosario Central', 'San Lorenzo', 'Vélez Sarsfield', 'Vélez Sársfield'],
    Turkey: ['Ankaragücü', 'Beşiktaş', 'Fenerbahçe', 'Galatasaray', 'Gençlerbirliği', 'Kayseri Erciyesspor', 'Konyaspor',
      'Sivasspor', 'İstanbul Başakşehir'],
    'Middle East': ['Al Ahli Dubai', 'Al Hilal', 'Al Jazira', 'Al Sadd', 'Al Shahaniya', 'Al-Gharafa', 'Al-Hilal', 'Al-Ittihad',
      'Al-Nassr', 'Al-Qadsiah', 'Al-Rayyan', 'Al-Sailiya', 'Baniyas'],
    'USA & Mexico': ['Atlante', 'Colorado Rapids', 'FC Dallas', 'Inter Miami', 'LA Galaxy', 'León', 'Los Angeles FC',
      'Minnesota United', 'Monterrey', 'New York Cosmos', 'New York Red Bulls', 'Orlando City', 'Pumas UNAM'],
    'Rest of Europe': ['AEK Athens', 'AEK Larnaca', 'AEL', 'Anorthosis', 'Aris', 'Austria Wien', 'Basel', 'Beerschot', 'CFR Cluj',
      'Celtic', 'Club Brugge', 'Dinamo Zagreb', 'Dnipro', 'Ergotelis', 'Esbjerg', 'Genk', 'Inter Zaprešić', 'Lokomotiv Moscow',
      'Alania Vladikavkaz', 'Anzhi Makhachkala', 'Midtjylland', 'OFI', 'Olympiacos', 'Panathinaikos', 'Red Star Belgrade',
      'Vejle', 'Veria', 'Zorya Luhansk', 'Zrinjski Mostar'],
    'Rest of the world': ['AS Frenzi', 'Atlético Nacional', 'Cerro Porteño', 'Delhi Dynamos', 'Envigado', 'Guangzhou Evergrande',
      'Johor Darul Ta\'zim', 'Kitchee', 'Nacional', 'Peñarol', 'RSC Internacional', 'Racing Bafoussam', 'Saprissa', 'Shanghai SIPG']
  };
  const map = {};
  for (const [country, clubs] of Object.entries(byCountry)) for (const c of clubs) map[c] = country;
  return map;
})();

function clubCountry(club) {
  if (!club) return null;
  if (RM_CLUB_COUNTRIES[club]) return RM_CLUB_COUNTRIES[club];
  // "Barcelona B", "Lyon II", "Juventus Next Gen", "Sporting CP B" ...
  const base = club.replace(/\s+(B|C|II|Next Gen|Atlético)$/, '');
  return RM_CLUB_COUNTRIES[base] || 'Rest of the world';
}

if (typeof module !== 'undefined' && module.exports) module.exports = { RM_CLUB_COUNTRIES, clubCountry };
