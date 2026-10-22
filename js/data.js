// Real Madrid Player Lineage & Lore Dataset
// Exhaustive information: Lineage, Debut, Matches, Peak Performances, Records, Facts, and Galleries.

const RM_PLAYERS = [
  {
    id: "mbappe",
    name: "Kylian Mbappé",
    fullName: "Kylian Mbappé Lottin",
    number: 9,
    position: "Forward",
    category: "forward",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    birthDate: "December 20, 1998",
    birthPlace: "Paris, France",
    height: "1.78 m",
    foot: "Right",
    joinedRealMadrid: "2024",
    transferFee: "Free Transfer (Signing Bonus)",
    photo: "images/players/mbappe.jpg",
    bio: "One of the most lethal and electrifying forwards in world football. After years of speculation, the French superstar fulfilled his childhood dream by joining Real Madrid in the summer of 2024.",
    quote: "A dream come true. Nobody can understand how excited I am right now. ¡Hala Madrid!",
    madridDebut: {
      date: "August 14, 2024",
      competition: "UEFA Super Cup",
      opponent: "Atalanta BC",
      venue: "National Stadium, Warsaw",
      result: "2 - 0 (Win)",
      minutesPlayed: 83,
      contribution: "Scored on his debut in the 68th minute with a clinical top-corner strike from a Jude Bellingham assist, lifting his very first European trophy in his first match.",
      jerseyWorn: "No. 9"
    },
    lineage: [
      {
        stage: "Youth Academy",
        club: "AS Bondy",
        country: "France",
        years: "2004–2011",
        badgeColor: "#1d4ed8",
        details: "Coached by his father Wilfried Mbappé; established his breathtaking pace and close ball control on suburban Parisian pitches."
      },
      {
        stage: "National Academy",
        club: "INF Clairefontaine",
        country: "France",
        years: "2011–2013",
        badgeColor: "#0284c7",
        details: "France's elite national football center. Scouted by Real Madrid at age 14 (even visited Madrid with Zinedine Zidane)."
      },
      {
        stage: "Senior Breakthrough",
        club: "AS Monaco",
        country: "France",
        years: "2015–2017",
        badgeColor: "#dc2626",
        fee: "Youth to Pro",
        appearances: 60,
        goals: 27,
        details: "Broke Thierry Henry's youngest player & scorer records; spearheaded Monaco's sensational 2016-17 Ligue 1 title and Champions League semi-final run."
      },
      {
        stage: "Superstardom",
        club: "Paris Saint-Germain",
        country: "France",
        years: "2017–2024",
        badgeColor: "#1e3a8a",
        fee: "€180 Million",
        appearances: 308,
        goals: 256,
        details: "Became PSG's all-time leading goalscorer, won 6 Ligue 1 titles, and reached the 2020 UCL Final."
      },
      {
        stage: "Galáctico Era",
        club: "Real Madrid",
        country: "Spain",
        years: "2024–Present",
        badgeColor: "#e5b324",
        fee: "Free Transfer",
        details: "Presented in front of 85,000 roaring fans at the Santiago Bernabéu alongside Florentino Pérez and Zinedine Zidane."
      }
    ],
    stats: {
      madridApps: 14,
      madridGoals: 8,
      madridAssists: 2,
      internationalCaps: 86,
      internationalGoals: 48,
      trophiesMadrid: ["UEFA Super Cup (2024)"],
      careerTrophiesCount: 18
    },
    peakPerformances: [
      {
        title: "Dream Debut Trophy & Goal",
        match: "Real Madrid vs. Atalanta",
        competition: "UEFA Super Cup 2024",
        date: "Aug 14, 2024",
        score: "2 - 0",
        highlight: "Drilled home Bellingham's cutback in the 68th minute to secure the UEFA Super Cup on his very first competitive appearance."
      },
      {
        title: "World Cup Final Hat-Trick",
        match: "France vs. Argentina",
        competition: "FIFA World Cup Final 2022",
        date: "Dec 18, 2022",
        score: "3 - 3 (Penalties)",
        highlight: "Scored the first men's World Cup final hat-trick since 1966, almost single-handedly turning the game around."
      },
      {
        title: "Bernabéu Solo Masterclass",
        match: "Paris Saint-Germain vs. Real Madrid",
        competition: "UEFA Champions League R16",
        date: "Feb 15, 2022",
        score: "1 - 0",
        highlight: "Slalomed past Carvajal and Militão in the 94th minute to score a sensational solo winner."
      }
    ],
    records: [
      "Youngest French goalscorer in World Cup history (19 years old in 2018)",
      "All-time record goalscorer for Paris Saint-Germain (256 goals in 308 matches)",
      "Only the second player in history to score a hat-trick in a men's FIFA World Cup Final (2022)",
      "Scored on his Real Madrid debut (UEFA Super Cup 2024)"
    ],
    facts: [
      "His bedroom as a child in Bondy was completely covered in posters of Cristiano Ronaldo wearing the Real Madrid jersey.",
      "At age 14, Zinedine Zidane personally drove Kylian around Madrid's training ground in a car to convince him to join.",
      "His mother Fayza Lamari was a professional handball player in the French first division.",
      "His trademark celebration (folding arms under armpits) was invented by his younger brother Ethan while playing FIFA on PlayStation."
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
        caption: "Santiago Bernabéu stadium under the lights, home of Real Madrid"
      },
      {
        url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80",
        caption: "UEFA Champions League nights in Madrid"
      }
    ]
  },
  {
    id: "vinicius",
    name: "Vinícius Júnior",
    fullName: "Vinícius José Paixão de Oliveira Júnior",
    number: 7,
    position: "Forward",
    category: "forward",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    birthDate: "July 12, 2000",
    birthPlace: "São Gonçalo, Rio de Janeiro, Brazil",
    height: "1.76 m",
    foot: "Right",
    joinedRealMadrid: "2018",
    transferFee: "€46 Million",
    photo: "images/players/vinicius.jpg",
    bio: "The talismanic winger and number 7 of Real Madrid. From facing heavy criticism as an 18-year-old raw talent to scoring the winning goal in two separate UEFA Champions League finals (2022 & 2024), Vini Jr has cemented himself as the premier match-winner in world football.",
    quote: "I play for the best club in the world. I want to win many more Champions Leagues and write my name alongside Madrid's biggest legends.",
    madridDebut: {
      date: "September 29, 2018",
      competition: "La Liga",
      opponent: "Atlético Madrid (Madrid Derby)",
      venue: "Santiago Bernabéu",
      result: "0 - 0 (Draw)",
      minutesPlayed: 3,
      contribution: "Came on in the 87th minute replacing Karim Benzema, becoming the first player born in 2000 or later to play an official match for Real Madrid.",
      jerseyWorn: "No. 28"
    },
    lineage: [
      {
        stage: "Youth & Roots",
        club: "Flamengo Academy (Ninho do Urubu)",
        country: "Brazil",
        years: "2006–2017",
        badgeColor: "#b91c1c",
        details: "Grew up in São Gonçalo, one of Rio's toughest favelas. Commuted two hours on buses to train with Flamengo."
      },
      {
        stage: "Senior Debut",
        club: "CR Flamengo",
        country: "Brazil",
        years: "2017–2018",
        badgeColor: "#991b1b",
        fee: "Youth to Pro",
        appearances: 69,
        goals: 14,
        details: "Debuted at age 16. Real Madrid agreed to sign him just two days after his professional debut for €46M, effective upon his 18th birthday."
      },
      {
        stage: "Development",
        club: "Real Madrid Castilla",
        country: "Spain",
        years: "2018",
        badgeColor: "#475569",
        appearances: 5,
        goals: 4,
        details: "Gained European adaptation under coach Santiago Solari before being promoted to the first team."
      },
      {
        stage: "Global Superstar & Hero",
        club: "Real Madrid",
        country: "Spain",
        years: "2018–Present",
        badgeColor: "#e5b324",
        fee: "€46 Million",
        details: "Inherited Cristiano Ronaldo's legendary No. 7 shirt. Scored the championship-clinching goals in two UCL Finals (2022 vs Liverpool, 2024 vs Dortmund)."
      }
    ],
    stats: {
      madridApps: 275,
      madridGoals: 87,
      madridAssists: 78,
      internationalCaps: 35,
      internationalGoals: 5,
      trophiesMadrid: [
        "2x UEFA Champions League (2022, 2024)",
        "3x La Liga (2020, 2022, 2024)",
        "1x Copa del Rey (2023)",
        "2x UEFA Super Cup (2022, 2024)",
        "2x FIFA Club World Cup (2018, 2022)",
        "3x Supercopa de España (2020, 2022, 2024)"
      ],
      careerTrophiesCount: 13
    },
    peakPerformances: [
      {
        title: "UCL Final 2022 Match Winner",
        match: "Real Madrid vs. Liverpool",
        competition: "UEFA Champions League Final",
        date: "May 28, 2022",
        score: "1 - 0",
        highlight: "Ghosted in behind Alexander-Arnold at the back post in the 59th minute to tap in Valverde's cross, clinching Madrid's 14th Champions League."
      },
      {
        title: "UCL Final 2024 Wembley Sealer",
        match: "Real Madrid vs. Borussia Dortmund",
        competition: "UEFA Champions League Final",
        date: "June 1, 2024",
        score: "2 - 0",
        highlight: "Chipped Kobel calmly in the 83rd minute after Bellingham pounced on a mistake, securing La Decimoquinta (15th UCL)."
      },
      {
        title: "Supercopa El Clásico Hat-Trick",
        match: "Real Madrid vs. Barcelona",
        competition: "Supercopa de España Final",
        date: "Jan 14, 2024",
        score: "4 - 1",
        highlight: "Scored a first-half hat-trick inside 39 minutes in Riyadh, celebrating with Cristiano Ronaldo's iconic 'Siu' in front of Saudi fans."
      }
    ],
    records: [
      "Youngest player to score in two different UEFA Champions League finals since Lionel Messi",
      "Only the 8th player in Real Madrid history to score in two European Cup/Champions League finals",
      "UEFA Champions League Player of the Season (2023–24)",
      "First player born in the 21st century to debut for Real Madrid's first team"
    ],
    facts: [
      "He set up the Instituto Vini Jr. in Brazil, investing millions of his own funds to fund educational tech apps for underprivileged public school children.",
      "His family was so poor when he was starting out in Rio that his uncle Ulisses drove him on a moped across the city because they couldn't afford bus fare.",
      "His relationship with Karim Benzema transformed from a difficult viral tunnel moment in 2020 into one of the deadliest striking duos in European history in 2021-22.",
      "He is a global ambassador for anti-racism in sports, leading UNESCO and FIFA campaigns."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Vinicius_Junior_2021.jpg/440px-Vinicius_Junior_2021.jpg",
        caption: "Vinícius Júnior wearing the iconic Real Madrid jersey"
      }
    ]
  },
  {
    id: "bellingham",
    name: "Jude Bellingham",
    fullName: "Jude Victor William Bellingham",
    number: 5,
    position: "Midfielder",
    category: "midfielder",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "England",
    countryCode: "GB",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    birthDate: "June 29, 2003",
    birthPlace: "Stourbridge, England",
    height: "1.86 m",
    foot: "Right",
    joinedRealMadrid: "2023",
    transferFee: "€103 Million",
    photo: "images/players/bellingham.jpg",
    bio: "England's generational midfield powerhouse. Taking Zinedine Zidane's sacred No. 5 jersey, Bellingham had one of the greatest debut seasons in Real Madrid history in 2023-24, winning La Liga, the Champions League, and becoming the Bernabéu's beloved hero with his open-arms celebration.",
    quote: "When you put on this shirt, you understand the responsibility. The fans sing 'Hey Jude' and the hairs on your arms stand up.",
    madridDebut: {
      date: "August 12, 2023",
      competition: "La Liga",
      opponent: "Athletic Club Bilbao",
      venue: "San Mamés, Bilbao",
      result: "2 - 0 (Win)",
      minutesPlayed: 90,
      contribution: "Started and scored a stunning bouncing volley off a corner in the 36th minute, breaking out his signature open-arms celebration for the very first time in Spain.",
      jerseyWorn: "No. 5"
    },
    lineage: [
      {
        stage: "Youth Roots",
        club: "Stourbridge FC",
        country: "England",
        years: "2009–2010",
        badgeColor: "#059669",
        details: "First kicked a ball on non-league grass pitches while watching his father Mark Bellingham score over 700 non-league goals."
      },
      {
        stage: "Academy & First Team",
        club: "Birmingham City",
        country: "England",
        years: "2010–2020",
        badgeColor: "#1d4ed8",
        fee: "Youth to Pro",
        appearances: 44,
        goals: 4,
        details: "Debuted at age 16 years and 38 days (club record). When he left for Dortmund, Birmingham retired his No. 22 shirt in honor of his inspiring legacy."
      },
      {
        stage: "European Proving Ground",
        club: "Borussia Dortmund",
        country: "Germany",
        years: "2020–2023",
        badgeColor: "#eab308",
        fee: "€25 Million",
        appearances: 132,
        goals: 24,
        details: "Won the DFB-Pokal in 2021 and was voted Bundesliga Player of the Season (2022-23), becoming Dortmund's youngest captain at age 19."
      },
      {
        stage: "Madrid Immortality",
        club: "Real Madrid",
        country: "Spain",
        years: "2023–Present",
        badgeColor: "#e5b324",
        fee: "€103 Million",
        details: "Signed a 6-year deal, chose No. 5 in tribute to Zinedine Zidane, and won the Champions League and La Liga double in year one."
      }
    ],
    stats: {
      madridApps: 54,
      madridGoals: 25,
      madridAssists: 15,
      internationalCaps: 38,
      internationalGoals: 5,
      trophiesMadrid: [
        "1x UEFA Champions League (2024)",
        "1x La Liga (2024)",
        "1x UEFA Super Cup (2024)",
        "1x Supercopa de España (2024)"
      ],
      careerTrophiesCount: 5
    },
    peakPerformances: [
      {
        title: "El Clásico Montjuïc Stunner",
        match: "Barcelona vs. Real Madrid",
        competition: "La Liga",
        date: "Oct 28, 2023",
        score: "1 - 2",
        highlight: "Hit a 30-yard thunderbolt rocket into Ter Stegen's top corner to equalize, then popped up in the 92nd minute to volley the dramatic winner."
      },
      {
        title: "Bernabéu Clásico Stoppage-Time Winner",
        match: "Real Madrid vs. Barcelona",
        competition: "La Liga",
        date: "Apr 21, 2024",
        score: "3 - 2",
        highlight: "Smashed an emphatic 91st-minute winner into the roof of the net at the back post to seal the La Liga title race for Madrid."
      },
      {
        title: "UCL Final Assist vs. Former Club",
        match: "Real Madrid vs. Borussia Dortmund",
        competition: "UEFA Champions League Final",
        date: "June 1, 2024",
        score: "2 - 0",
        highlight: "Assisted Vinícius Júnior for the decisive second goal in his native London at Wembley Stadium."
      }
    ],
    records: [
      "First player in Real Madrid history to score on his La Liga debut, Champions League debut, and El Clásico debut",
      "Scored 10 goals in his first 10 Real Madrid matches, matching Cristiano Ronaldo's club record",
      "La Liga Player of the Season (2023–24)",
      "Golden Boy & Kopa Trophy Winner (2023)"
    ],
    facts: [
      "His shirt number 22 at Birmingham City came because his coach told him he didn't have to be just a No. 4 (defensive mid), No. 8 (box-to-box), or No. 10 (playmaker) — he could do all three: 4 + 8 + 10 = 22.",
      "His father Mark was a police sergeant and legendary non-league striker who scored over 700 amateur goals.",
      "Whenever he scores, the Bernabéu loudspeakers blast the Beatles classic 'Hey Jude', with 80,000 Madridistas singing along.",
      "His younger brother Jobe Bellingham also plays professional football in England."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Jude_Bellingham_2024.jpg/440px-Jude_Bellingham_2024.jpg",
        caption: "Jude Bellingham celebrating with open arms"
      }
    ]
  },
  {
    id: "valverde",
    name: "Federico Valverde",
    fullName: "Federico Santiago Valverde Dipetta",
    number: 8,
    position: "Midfielder",
    category: "midfielder",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "Uruguay",
    countryCode: "UY",
    flag: "🇺🇾",
    birthDate: "July 22, 1998",
    birthPlace: "Montevideo, Uruguay",
    height: "1.82 m",
    foot: "Right",
    joinedRealMadrid: "2016",
    transferFee: "€5 Million",
    photo: "images/players/valverde.jpg",
    bio: "Nicknamed 'El Halcón' (The Falcon). Renowned for his endless stamina, blistering sprint speed, ferocious long-range cannon shots, and relentless tactical discipline. In 2024, Toni Kroos personally bequeathed his iconic No. 8 jersey to Valverde.",
    quote: "I would run until my legs broke for Real Madrid. This shirt means everything.",
    madridDebut: {
      date: "October 23, 2018",
      competition: "UEFA Champions League",
      opponent: "Viktoria Plzeň",
      venue: "Santiago Bernabéu",
      result: "2 - 1 (Win)",
      minutesPlayed: 36,
      contribution: "Came on in the 54th minute replacing Isco to make his official first-team debut under Julen Lopetegui.",
      jerseyWorn: "No. 15"
    },
    lineage: [
      {
        stage: "Youth Roots",
        club: "Estudiantes de la Unión",
        country: "Uruguay",
        years: "2001–2008",
        badgeColor: "#0284c7",
        details: "Nicknamed 'El Pajarito' (The Little Bird) as a frail, skinny boy sprinting across grassless Montevideo pitches."
      },
      {
        stage: "Academy & Primera",
        club: "Peñarol",
        country: "Uruguay",
        years: "2008–2016",
        badgeColor: "#ca8a04",
        fee: "Youth to Pro",
        appearances: 13,
        goals: 0,
        details: "Won the Uruguayan Primera División in 2015-16. Real Madrid scouts signed him at age 18 for €5M."
      },
      {
        stage: "Castilla & Loan",
        club: "RM Castilla & Deportivo La Coruña",
        country: "Spain",
        years: "2016–2018",
        badgeColor: "#2563eb",
        fee: "Loan",
        appearances: 54,
        goals: 3,
        details: "Developed in Spain's Segunda and gained top-flight experience on loan at Deportivo."
      },
      {
        stage: "Madrid Engine & No. 8 Heir",
        club: "Real Madrid",
        country: "Spain",
        years: "2018–Present",
        badgeColor: "#e5b324",
        fee: "€5 Million",
        details: "Won two Champions League titles, provided the winning assist in the 2022 UCL final, and took over Kroos's No. 8 in 2024."
      }
    ],
    stats: {
      madridApps: 270,
      madridGoals: 23,
      madridAssists: 26,
      internationalCaps: 62,
      internationalGoals: 7,
      trophiesMadrid: [
        "2x UEFA Champions League (2022, 2024)",
        "3x La Liga (2020, 2022, 2024)",
        "1x Copa del Rey (2023)",
        "2x UEFA Super Cup (2022, 2024)",
        "2x FIFA Club World Cup (2018, 2022)",
        "3x Supercopa de España (2020, 2022, 2024)"
      ],
      careerTrophiesCount: 14
    },
    peakPerformances: [
      {
        title: "The Ultimate Tactical Sacrifice",
        match: "Real Madrid vs. Atlético Madrid",
        competition: "Supercopa de España Final",
        date: "Jan 12, 2020",
        score: "0 - 0 (4-1 Pens)",
        highlight: "Committed a famous 115th-minute tactical foul on Álvaro Morata who was clean through on goal. Red carded, received a standing ovation, and won Man of the Match as Madrid lifted the trophy on penalties."
      },
      {
        title: "2022 UCL Final Championship Assist",
        match: "Real Madrid vs. Liverpool",
        competition: "UEFA Champions League Final",
        date: "May 28, 2022",
        score: "1 - 0",
        highlight: "Drove down the right wing and fired a pinpoint low cross across the face of goal for Vinícius Júnior to convert."
      },
      {
        title: "Bernabéu Thunder Volley vs. Man City",
        match: "Real Madrid vs. Manchester City",
        competition: "UEFA Champions League QF",
        date: "Apr 9, 2024",
        score: "3 - 3",
        highlight: "Connected with an unforgettable first-time diagonal volley into the bottom left corner to equalize 3-3 in a classic thriller."
      }
    ],
    records: [
      "Only Uruguayan to assist the winning goal in a UEFA Champions League final",
      "Voted Man of the Match in the 2020 Supercopa de España final despite being sent off",
      "Clocked top speeds over 36.3 km/h, among the fastest recorded midfielders in European football"
    ],
    facts: [
      "His mother used to buy his football boots on installment plans from a local market in Montevideo.",
      "His original nickname was 'El Pajarito' (Little Bird), but he asked fans to call him 'El Halcón' (The Falcon) because he felt he had grown stronger and fiercer.",
      "At the Cibeles celebrations in June 2024, Toni Kroos took the microphone and personally announced that Valverde would inherit his sacred shirt number 8.",
      "Diego Simeone famously praised Valverde after the 2020 Supercopa, saying: 'It was the most important play of the match. Anyone would have done the same in his position.'"
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Federico_Valverde_2021.jpg/440px-Federico_Valverde_2021.jpg",
        caption: "Federico Valverde in Madrid white"
      }
    ]
  },
  {
    id: "modric",
    name: "Luka Modrić",
    fullName: "Luka Modrić",
    number: 10,
    position: "Midfielder",
    category: "midfielder",
    status: "active",
    statusLabel: "Current Squad (Captain)",
    currentClub: "Real Madrid",
    nationality: "Croatia",
    countryCode: "HR",
    flag: "🇭🇷",
    birthDate: "September 9, 1985",
    birthPlace: "Zadar, SFR Yugoslavia (now Croatia)",
    height: "1.72 m",
    foot: "Both",
    joinedRealMadrid: "2012",
    transferFee: "€35 Million",
    photo: "images/players/modric.jpg",
    bio: "The Croatian Maestro and Real Madrid captain. Winner of the 2018 Ballon d'Or and the most decorated player in the history of Real Madrid. Master of the trivela (outside-of-the-boot pass) and a timeless midfield genius.",
    quote: "The hardest things in life are what make you who you are. Real Madrid never gives up, and neither do I.",
    madridDebut: {
      date: "August 29, 2012",
      competition: "Supercopa de España",
      opponent: "Barcelona (El Clásico)",
      venue: "Santiago Bernabéu",
      result: "2 - 1 (Win, Madrid won on away goals)",
      minutesPlayed: 12,
      contribution: "Signed his contract in the morning, came on in the 78th minute replacing Mesut Özil in the evening, and lifted a trophy just 36 hours after landing in Madrid.",
      jerseyWorn: "No. 19"
    },
    lineage: [
      {
        stage: "War Childhood & Roots",
        club: "NK Zadar",
        country: "Croatia",
        years: "1996–2001",
        badgeColor: "#0284c7",
        details: "Refugee child during the Croatian War of Independence; practiced kick-ups between hotel parking lots dodging air-raid sirens."
      },
      {
        stage: "Youth & Hardening Loans",
        club: "Dinamo Zagreb & Zrinjski Mostar",
        country: "Croatia & Bosnia",
        years: "2001–2008",
        badgeColor: "#1e40af",
        fee: "Youth to Pro",
        appearances: 130,
        goals: 33,
        details: "Voted Player of the Year in the notoriously brutal Bosnian league at age 18. Won 3 Croatian league titles with Dinamo."
      },
      {
        stage: "Premier League Playmaker",
        club: "Tottenham Hotspur",
        country: "England",
        years: "2008–2012",
        badgeColor: "#0f172a",
        fee: "€22.5 Million",
        appearances: 160,
        goals: 17,
        details: "Guided Spurs to their first Champions League quarter-final; earned acclaim from Sir Alex Ferguson as the league's top playmaker."
      },
      {
        stage: "Eternal Legend & 6x UCL Champion",
        club: "Real Madrid",
        country: "Spain",
        years: "2012–Present",
        badgeColor: "#e5b324",
        fee: "€35 Million",
        details: "Initially labeled 'Worst Signing of the Year' by Marca in Dec 2012; went on to win 6 Champions Leagues, the Ballon d'Or, and over 27 trophies."
      }
    ],
    stats: {
      madridApps: 545,
      madridGoals: 39,
      madridAssists: 88,
      internationalCaps: 180,
      internationalGoals: 27,
      trophiesMadrid: [
        "6x UEFA Champions League (2014, 2016, 2017, 2018, 2022, 2024)",
        "4x La Liga (2017, 2020, 2022, 2024)",
        "2x Copa del Rey (2014, 2023)",
        "5x UEFA Super Cup (2014, 2016, 2017, 2022, 2024)",
        "5x FIFA Club World Cup (2014, 2016, 2017, 2018, 2022)",
        "5x Supercopa de España (2012, 2017, 2020, 2022, 2024)"
      ],
      careerTrophiesCount: 33
    },
    peakPerformances: [
      {
        title: "The Trivela Assist of the Century",
        match: "Real Madrid vs. Chelsea",
        competition: "UEFA Champions League QF",
        date: "Apr 12, 2022",
        score: "2 - 3 (5-4 agg)",
        highlight: "Trailing 3-0 at the Bernabéu and facing elimination, Modrić produced a sublime 40-yard outside-of-the-boot trivela cross directly onto Rodrygo's foot to ignite the comeback."
      },
      {
        title: "La Décima Corner (92:48)",
        match: "Real Madrid vs. Atlético Madrid",
        competition: "UEFA Champions League Final",
        date: "May 24, 2014",
        score: "4 - 1",
        highlight: "Delivered the historic 93rd-minute corner kick that Sergio Ramos headed in to save Madrid and clinch La Décima."
      },
      {
        title: "Old Trafford Long-Range Turnaround",
        match: "Manchester United vs. Real Madrid",
        competition: "UEFA Champions League R16",
        date: "Mar 5, 2013",
        score: "1 - 2",
        highlight: "Came off the bench and blasted a 25-yard curling strike off the inside of the post past De Gea, the turning point of his Madrid career."
      }
    ],
    records: [
      "Most decorated player in Real Madrid history (27 titles)",
      "Co-record holder for the most UEFA Champions League titles in football history (6 titles, alongside Carvajal, Kroos, Nacho, Gento)",
      "Oldest player to ever play an official match for Real Madrid (surpassing Ferenc Puskás at age 39+ in 2024)",
      "Ballon d'Or Winner (2018), breaking the 10-year Messi-Ronaldo duopoly"
    ],
    facts: [
      "His grandfather Luka was killed during the war when Luka was just 6 years old; Modrić wears shinpads featuring a picture of his family and Jesus Christ.",
      "In December 2012, Marca readers infamously voted him the 'Worst Signing of the Season' in La Liga.",
      "His iconic trivela pass is so natural that he says he feels more comfortable striking the ball with the outside of his right foot than with his left.",
      "He captained Croatia to the 2018 World Cup Final and the 2022 World Cup third place."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Luka_Modric_2018.jpg/440px-Luka_Modric_2018.jpg",
        caption: "Luka Modrić with his Ballon d'Or year aura"
      }
    ]
  },
  {
    id: "rodrygo",
    name: "Rodrygo Goes",
    fullName: "Rodrygo Silva de Goes",
    number: 11,
    position: "Forward",
    category: "forward",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    birthDate: "January 9, 2001",
    birthPlace: "Osasco, São Paulo, Brazil",
    height: "1.74 m",
    foot: "Right",
    joinedRealMadrid: "2019",
    transferFee: "€45 Million",
    photo: "images/players/rodrygo.jpg",
    bio: "Real Madrid's clutch Brazilian forward, famous for his extraordinary ice-cold finishing in Champions League knockout ties. Author of the legendary 2-minute brace against Manchester City in 2022.",
    quote: "Champions League nights at the Bernabéu are magical. You can never count us out.",
    madridDebut: {
      date: "September 25, 2019",
      competition: "La Liga",
      opponent: "Osasuna",
      venue: "Santiago Bernabéu",
      result: "2 - 0 (Win)",
      minutesPlayed: 19,
      contribution: "Scored just 93 seconds after coming on as a substitute with a magnificent first touch, run, and curler — the fastest debut goal by a Madrid player since Brazilian Ronaldo in 2002.",
      jerseyWorn: "No. 27"
    },
    lineage: [
      {
        stage: "Futsal & Youth",
        club: "Santos FC Futsal & Academy",
        country: "Brazil",
        years: "2011–2017",
        badgeColor: "#0f172a",
        details: "Followed the footsteps of Pelé and Neymar at the legendary Santos academy."
      },
      {
        stage: "Série A Prodigy",
        club: "Santos FC",
        country: "Brazil",
        years: "2017–2019",
        badgeColor: "#1e293b",
        fee: "Youth to Pro",
        appearances: 80,
        goals: 17,
        details: "Debuted at age 16. Became the youngest Brazilian to ever score in the Copa Libertadores."
      },
      {
        stage: "Bernabéu Miracle Man",
        club: "Real Madrid",
        country: "Spain",
        years: "2019–Present",
        badgeColor: "#e5b324",
        fee: "€45 Million",
        details: "Won two Champions Leagues (2022, 2024) and 3 La Liga titles, cementing his place in club folklore with miraculous knockout goals."
      }
    ],
    stats: {
      madridApps: 228,
      madridGoals: 57,
      madridAssists: 43,
      internationalCaps: 29,
      internationalGoals: 7,
      trophiesMadrid: [
        "2x UEFA Champions League (2022, 2024)",
        "3x La Liga (2020, 2022, 2024)",
        "1x Copa del Rey (2023)",
        "2x UEFA Super Cup (2022, 2024)",
        "1x FIFA Club World Cup (2022)",
        "3x Supercopa de España (2020, 2022, 2024)"
      ],
      careerTrophiesCount: 12
    },
    peakPerformances: [
      {
        title: "The 2-Minute Miracle vs. Man City",
        match: "Real Madrid vs. Manchester City",
        competition: "UEFA Champions League SF",
        date: "May 4, 2022",
        score: "3 - 1 (6-5 agg)",
        highlight: "Trailing on aggregate in the 90th minute, Rodrygo scored in the 90th minute and again in the 91st minute with a glancing header to force extra time and launch Madrid to the final."
      },
      {
        title: "Perfect Hat-Trick Debut at 18",
        match: "Real Madrid vs. Galatasaray",
        competition: "UEFA Champions League",
        date: "Nov 6, 2019",
        score: "6 - 0",
        highlight: "Scored a perfect hat-trick (left foot, header, right foot) and assisted a goal in his first Bernabéu UCL start."
      },
      {
        title: "Copa del Rey Final Hero (Brace)",
        match: "Real Madrid vs. Osasuna",
        competition: "Copa del Rey Final",
        date: "May 6, 2023",
        score: "2 - 1",
        highlight: "Scored both goals in the final (2nd minute and 70th minute) to hand Real Madrid their first Copa del Rey in 9 years."
      }
    ],
    records: [
      "Second-youngest player to score a Champions League hat-trick (behind Raúl)",
      "Fastest brace in UEFA Champions League knockout history (scored 2 goals in 89 seconds vs Man City 2022)",
      "Fastest debut league goal for Real Madrid by a debutant since Ronaldo Nazário in 2002 (93 seconds)"
    ],
    facts: [
      "His father Eric Batista de Goes was a professional right-back in the Brazilian lower divisions; Rodrygo was born when his father was only 16 years old.",
      "Signed an endorsement contract with Nike at the age of 11, becoming the youngest athlete ever signed by Nike at the time (surpassing Neymar).",
      "He was originally nicknamed 'O Raio' (The Lightning Bolt) at Santos because of his rapid acceleration.",
      "Luka Modrić calls Rodrygo 'son' because Modrić is the same age as Rodrygo's father."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rodrygo_2021.jpg/440px-Rodrygo_2021.jpg",
        caption: "Rodrygo Goes celebrating for Real Madrid"
      }
    ]
  },
  {
    id: "camavinga",
    name: "Eduardo Camavinga",
    fullName: "Eduardo Celmi Camavinga",
    number: 6,
    position: "Midfielder",
    category: "midfielder",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    birthDate: "November 10, 2002",
    birthPlace: "Miconje, Cabinda, Angola",
    height: "1.82 m",
    foot: "Left",
    joinedRealMadrid: "2021",
    transferFee: "€31 Million",
    photo: "images/players/camavinga.jpg",
    bio: "Dynamic, versatile French midfield dynamo who can dominate in midfield or excel at left-back. Born in an Angolan refugee camp, Camavinga has already won every single major trophy available at club level with Real Madrid by age 21.",
    quote: "When your family has lost everything in a house fire, football pressure is nothing. We play with joy.",
    madridDebut: {
      date: "September 12, 2021",
      competition: "La Liga",
      opponent: "Celta Vigo",
      venue: "Santiago Bernabéu",
      result: "5 - 2 (Win)",
      minutesPlayed: 24,
      contribution: "Came on in the 66th minute and scored just 6 minutes into his debut, tapping in after Luka Modrić's run was saved.",
      jerseyWorn: "No. 25"
    },
    lineage: [
      {
        stage: "Refugee Camp to Brittany",
        club: "Drapeau-Fougères",
        country: "France",
        years: "2009–2013",
        badgeColor: "#0284c7",
        details: "Born in a refugee camp in Angola to Congolese parents; moved to Fougères, France at age two."
      },
      {
        stage: "Ligue 1 Sensation",
        club: "Stade Rennais",
        country: "France",
        years: "2013–2021",
        badgeColor: "#dc2626",
        fee: "Youth to Pro",
        appearances: 88,
        goals: 2,
        details: "Became Rennes' youngest-ever first-team player at 16. Outshone PSG's entire midfield in a 2-1 win at age 16."
      },
      {
        stage: "Trophy Collector",
        club: "Real Madrid",
        country: "Spain",
        years: "2021–Present",
        badgeColor: "#e5b324",
        fee: "€31 Million",
        details: "Won all 6 major club trophies with Real Madrid before turning 21 years old."
      }
    ],
    stats: {
      madridApps: 154,
      madridGoals: 2,
      madridAssists: 8,
      internationalCaps: 23,
      internationalGoals: 2,
      trophiesMadrid: [
        "2x UEFA Champions League (2022, 2024)",
        "2x La Liga (2022, 2024)",
        "1x Copa del Rey (2023)",
        "2x UEFA Super Cup (2022, 2024)",
        "1x FIFA Club World Cup (2022)",
        "2x Supercopa de España (2022, 2024)"
      ],
      careerTrophiesCount: 11
    },
    peakPerformances: [
      {
        title: "The UCL Comeback Super-Sub (2022)",
        match: "Real Madrid vs. PSG / Chelsea / Man City",
        competition: "UEFA Champions League Knockouts",
        date: "Spring 2022",
        score: "Multiple Comebacks",
        highlight: "Brought on in the second half of every single epic comeback in the 2022 run; his defensive tackles and forward drives turned every tie in Madrid's favor."
      },
      {
        title: "Starting Pivot in Wembley 2024 Final",
        match: "Real Madrid vs. Borussia Dortmund",
        competition: "UEFA Champions League Final",
        date: "June 1, 2024",
        score: "2 - 0",
        highlight: "Started in midfield and almost scored a spectacular curler tipped over by Kobel, controlling the tempo to win his 2nd Champions League."
      }
    ],
    records: [
      "Completed the 'Grand Slam' of club football (UCL, La Liga, Copa del Rey, Club World Cup, UEFA Super Cup, Supercopa) at just 20 years old",
      "Youngest senior debutant in Stade Rennais history (16 years, 4 months)",
      "Scored on his Real Madrid debut within 6 minutes of entering the pitch"
    ],
    facts: [
      "In 2013, his family home in Fougères burned to the ground, destroying all their possessions. His father told him: 'Eduardo, you are the hope of the family; you will lift us up.'",
      "He practiced judo for several years as a kid before focusing entirely on football, which he credits for his balance and flexibility in tackles.",
      "Known for his radiant smile, fashionable style, and infectious high energy in the Madrid locker room.",
      "Played left-back for several months in 2023 when Madrid suffered defensive injuries, excelling so much he started there in Champions League semi-finals."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Eduardo_Camavinga_2022.jpg/440px-Eduardo_Camavinga_2022.jpg",
        caption: "Eduardo Camavinga in action"
      }
    ]
  },
  {
    id: "tchouameni",
    name: "Aurélien Tchouaméni",
    fullName: "Aurélien Djani Tchouaméni",
    number: 14,
    position: "Midfielder",
    category: "midfielder",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    birthDate: "January 27, 2000",
    birthPlace: "Rouen, France",
    height: "1.88 m",
    foot: "Right",
    joinedRealMadrid: "2022",
    transferFee: "€80 Million",
    photo: "images/players/tchouameni.jpg",
    bio: "France and Real Madrid's defensive midfield anchor. An elite ball-winner, aerial giant, and intelligent distributor who stepped seamlessly into Casemiro's boots in 2022.",
    quote: "As soon as Real Madrid called, I didn't think twice. You don't choose Madrid; you answer Madrid's call.",
    madridDebut: {
      date: "August 10, 2022",
      competition: "UEFA Super Cup",
      opponent: "Eintracht Frankfurt",
      venue: "Helsinki Olympic Stadium",
      result: "2 - 0 (Win)",
      minutesPlayed: 5,
      contribution: "Replaced Toni Kroos in the 85th minute to win a European trophy on his club debut.",
      jerseyWorn: "No. 18"
    },
    lineage: [
      {
        stage: "Youth Roots",
        club: "SJ d'Artigues",
        country: "France",
        years: "2005–2011",
        badgeColor: "#0284c7",
        details: "Grew up near Bordeaux; joined Artigues before entering the Girondins academy."
      },
      {
        stage: "Development",
        club: "Girondins de Bordeaux",
        country: "France",
        years: "2011–2020",
        badgeColor: "#1e3a8a",
        fee: "Youth to Pro",
        appearances: 37,
        goals: 1,
        details: "Graduated through Bordeaux's academy and made his senior European debut in Europa League qualifying."
      },
      {
        stage: "Ligue 1 Midfield Kingpin",
        club: "AS Monaco",
        country: "France",
        years: "2020–2022",
        badgeColor: "#dc2626",
        fee: "€18 Million",
        appearances: 95,
        goals: 8,
        details: "Voted Ligue 1 Young Player of the Year (2020-21) and named in the Ligue 1 Team of the Year twice."
      },
      {
        stage: "Bernabéu Shield",
        club: "Real Madrid",
        country: "Spain",
        years: "2022–Present",
        badgeColor: "#e5b324",
        fee: "€80 Million",
        details: "Chose Madrid over Liverpool and PSG. Won the Champions League in 2024 and filled in as emergency center-back flawlessly."
      }
    ],
    stats: {
      madridApps: 98,
      madridGoals: 3,
      madridAssists: 5,
      internationalCaps: 36,
      internationalGoals: 3,
      trophiesMadrid: [
        "1x UEFA Champions League (2024)",
        "1x La Liga (2024)",
        "1x Copa del Rey (2023)",
        "2x UEFA Super Cup (2022, 2024)",
        "1x FIFA Club World Cup (2022)",
        "1x Supercopa de España (2024)"
      ],
      careerTrophiesCount: 8
    },
    peakPerformances: [
      {
        title: "Emergency Center-Back Masterclass vs. Man City",
        match: "Manchester City vs. Real Madrid",
        competition: "UEFA Champions League QF",
        date: "Apr 17, 2024",
        score: "1 - 1 (4-3 Pens)",
        highlight: "Played as an emergency central defender during Madrid's injury crisis, shutting down Erling Haaland with heroic blocks."
      },
      {
        title: "Long-Range Strike in World Cup QF",
        match: "France vs. England",
        competition: "FIFA World Cup QF",
        date: "Dec 10, 2022",
        score: "2 - 1",
        highlight: "Scored a blistering 25-yard drive past Jordan Pickford to send France into the semi-finals."
      }
    ],
    records: [
      "Led La Liga in interceptions per 90 minutes in his debut 2022-23 season",
      "Undefeated in every match he started at center-back for Real Madrid in the 2023-24 season"
    ],
    facts: [
      "He loves American sports culture, particularly NBA basketball, and models his leadership after Kobe Bryant's 'Mamba Mentality'.",
      "Takes notes in a personal journal after every match and training session to review his positioning and decision-making.",
      "His father is a pharmacist and director of a vaccine production site, and his mother is an educational advisor.",
      "Kylian Mbappé actively tried to recruit him to PSG in 2022, but Tchouaméni told him his mind was already set on Real Madrid."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Aurelien_Tchouameni_2022.jpg/440px-Aurelien_Tchouameni_2022.jpg",
        caption: "Aurélien Tchouaméni in midfield action"
      }
    ]
  },
  {
    id: "guler",
    name: "Arda Güler",
    fullName: "Arda Güler",
    number: 15,
    position: "Midfielder",
    category: "midfielder",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "Turkey",
    countryCode: "TR",
    flag: "🇹🇷",
    birthDate: "February 25, 2005",
    birthPlace: "Altındağ, Ankara, Turkey",
    height: "1.75 m",
    foot: "Left",
    joinedRealMadrid: "2023",
    transferFee: "€20 Million",
    photo: "images/players/guler.jpg",
    bio: "The 'Turkish Delight' and jewel of Turkish football. Blessed with a wand of a left foot, surreal vision, and precision finishing. Joined Real Madrid in 2023 and boasted the highest goals-per-minute ratio in La Liga during his debut season.",
    quote: "Real Madrid is the biggest club in the world. Mesut Özil called me and told me Madrid is the place to be.",
    madridDebut: {
      date: "January 6, 2024",
      competition: "Copa del Rey",
      opponent: "Arandina CF",
      venue: "El Montecillo, Aranda de Duero",
      result: "3 - 1 (Win)",
      minutesPlayed: 59,
      contribution: "After recovering from knee surgery, finally debuted as a starter, hit the woodwork with a brilliant free-kick, and created multiple chances.",
      jerseyWorn: "No. 24"
    },
    lineage: [
      {
        stage: "Youth Roots",
        club: "Gençlerbirliği",
        country: "Turkey",
        years: "2014–2019",
        badgeColor: "#dc2626",
        details: "Spotted in Ankara as a ball-boy; displayed jaw-dropping dribbling and passing technique."
      },
      {
        stage: "Turkish Breakthrough",
        club: "Fenerbahçe",
        country: "Turkey",
        years: "2019–2023",
        badgeColor: "#1d4ed8",
        fee: "Youth to Pro",
        appearances: 51,
        goals: 9,
        details: "Given Alex de Souza's legendary No. 10 shirt at age 17; won the 2023 Turkish Cup and was named Man of the Match in the final."
      },
      {
        stage: "The Bernabéu Artist",
        club: "Real Madrid",
        country: "Spain",
        years: "2023–Present",
        badgeColor: "#e5b324",
        fee: "€20 Million",
        details: "Both Barcelona and Real Madrid bid for him; he chose Madrid. Scored 6 La Liga goals in just 373 minutes in his debut season."
      }
    ],
    stats: {
      madridApps: 22,
      madridGoals: 6,
      madridAssists: 1,
      internationalCaps: 16,
      internationalGoals: 3,
      trophiesMadrid: [
        "1x UEFA Champions League (2024)",
        "1x La Liga (2024)",
        "1x UEFA Super Cup (2024)",
        "1x Supercopa de España (2024)"
      ],
      careerTrophiesCount: 5
    },
    peakPerformances: [
      {
        title: "Euro 2024 Screamer vs. Georgia",
        match: "Turkey vs. Georgia",
        competition: "UEFA Euro 2024",
        date: "June 18, 2024",
        score: "3 - 1",
        highlight: "Unleashed a 26-yard curling missile into the top corner at 118 km/h, breaking Cristiano Ronaldo's record as the youngest player to score on his European Championship debut."
      },
      {
        title: "La Liga Brace vs. Villarreal",
        match: "Villarreal vs. Real Madrid",
        competition: "La Liga",
        date: "May 19, 2024",
        score: "4 - 4",
        highlight: "Scored two clinical goals with two shots in the first half, demonstrating lethal efficiency."
      }
    ],
    records: [
      "Fastest player to reach 6 La Liga goals in Real Madrid history relative to minutes played (6 goals from 6 shots on target, 1 goal every 62 minutes)",
      "Youngest player to score on his UEFA European Championship debut (19 years, 114 days)"
    ],
    facts: [
      "Mesut Özil personally mentored Arda at Fenerbahçe and told Florentino Pérez: 'He is better than I was at that age.'",
      "His parents cried tears of joy at his Madrid unveiling presentation, and Arda gently wiped his mother's tears on stage.",
      "His favorite training routine is taking 50 free-kicks from outside the penalty box after regular sessions."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Arda_G%C3%BCler_2024.jpg/440px-Arda_G%C3%BCler_2024.jpg",
        caption: "Arda Güler showcasing his technical quality"
      }
    ]
  },
  {
    id: "endrick",
    name: "Endrick",
    fullName: "Endrick Felipe Moreira de Sousa",
    number: 16,
    position: "Forward",
    category: "forward",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    birthDate: "July 21, 2006",
    birthPlace: "Taguatinga, Federal District, Brazil",
    height: "1.73 m",
    foot: "Left",
    joinedRealMadrid: "2024",
    transferFee: "€35 Million + €25M Add-ons",
    photo: "images/players/endrick.jpg",
    bio: "Brazil's teenage phenomenon nicknamed 'Bobby' by Madrid teammates. An explosive, compact, powerhouse striker reminiscent of young Brazilian Ronaldo and Adriano. Debuted for Real Madrid in 2024 and scored on his La Liga and Champions League debuts.",
    quote: "I always wanted to play here. God gave me this opportunity and I will give everything for the white shirt.",
    madridDebut: {
      date: "August 25, 2024",
      competition: "La Liga",
      opponent: "Real Valladolid",
      venue: "Santiago Bernabéu",
      result: "3 - 0 (Win)",
      minutesPlayed: 10,
      contribution: "Came on in the 86th minute, received a ball at the edge of the box, beat his defender with a sharp cut, and hammered a right-footed shot inside the near post to score on his debut.",
      jerseyWorn: "No. 16"
    },
    lineage: [
      {
        stage: "Youth Roots",
        club: "Palmeiras Youth",
        country: "Brazil",
        years: "2016–2022",
        badgeColor: "#047857",
        details: "Scored a staggering 165 goals in 169 matches for Palmeiras youth teams. Videos of his bicycle kicks went viral worldwide at age 14."
      },
      {
        stage: "Série A Champion",
        club: "SE Palmeiras",
        country: "Brazil",
        years: "2022–2024",
        badgeColor: "#065f46",
        fee: "Youth to Pro",
        appearances: 82,
        goals: 21,
        details: "Led Palmeiras to back-to-back Brazilian league titles (2022, 2023). Real Madrid agreed to sign him at age 16 for up to €60M."
      },
      {
        stage: "Madrid Phenom",
        club: "Real Madrid",
        country: "Spain",
        years: "2024–Present",
        badgeColor: "#e5b324",
        fee: "€35M + €25M",
        details: "Arrived in Madrid upon turning 18 in July 2024. Scored on his La Liga debut and Champions League debut."
      }
    ],
    stats: {
      madridApps: 10,
      madridGoals: 2,
      madridAssists: 1,
      internationalCaps: 13,
      internationalGoals: 3,
      trophiesMadrid: [
        "1x UEFA Super Cup (2024)"
      ],
      careerTrophiesCount: 5
    },
    peakPerformances: [
      {
        title: "UCL Record Breaker vs. Stuttgart",
        match: "Real Madrid vs. VfB Stuttgart",
        competition: "UEFA Champions League",
        date: "Sept 17, 2024",
        score: "3 - 1",
        highlight: "Counter-attacked on a 3-on-1 with Mbappé and Vinicius on either side; ignored both and unleashed a 30-yard low bullet past Alexander Nübel, becoming Madrid's youngest UCL scorer."
      },
      {
        title: "Wembley Winner for Brazil vs. England",
        match: "England vs. Brazil",
        competition: "International Friendly",
        date: "March 23, 2024",
        score: "0 - 1",
        highlight: "Scored the winning goal at Wembley Stadium at age 17, becoming the youngest player to score an international goal at Wembley."
      }
    ],
    records: [
      "Youngest player to score a Champions League goal in Real Madrid history (18 years, 58 days, surpassing Raúl)",
      "Youngest foreign player to score a La Liga goal for Real Madrid (18 years, 35 days)",
      "Youngest player to score at Wembley Stadium in men's international history"
    ],
    facts: [
      "His father Douglas Sousa was unemployed when Endrick was young; Palmeiras offered his father a job as a stadium cleaner so the family could afford to stay in São Paulo.",
      "Teammates affectionately call him 'Bobby' because he named 1966 England World Cup hero Bobby Charlton as one of his football idols in an interview.",
      "His left quad circumference measures nearly 70 centimeters, giving him astonishing kicking power from standstill.",
      "He broke down in tears of gratitude during his official presentation at the Bernabéu next to Florentino Pérez."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Endrick_2023.jpg/440px-Endrick_2023.jpg",
        caption: "Endrick representing Brazil"
      }
    ]
  },
  {
    id: "carvajal",
    name: "Dani Carvajal",
    fullName: "Daniel Carvajal Ramos",
    number: 2,
    position: "Defender",
    category: "defender",
    status: "active",
    statusLabel: "Current Squad (Vice-Captain)",
    currentClub: "Real Madrid",
    nationality: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    birthDate: "January 11, 1992",
    birthPlace: "Leganés, Spain",
    height: "1.73 m",
    foot: "Right",
    joinedRealMadrid: "2002 (Academy) / 2013 (First Team)",
    transferFee: "€6.5 Million (Buy-back from Leverkusen)",
    photo: "images/players/carvajal.jpg",
    bio: "The embodiment of Real Madrid's heart, fight, and DNA. In 2004, as a 12-year-old academy boy, he laid the ceremonial first foundation stone of the Real Madrid City training complex alongside Alfredo Di Stéfano. In 2024, he scored the opening goal in the Champions League final to win his 6th European Cup.",
    quote: "I laid the first stone of Valdebebas with Di Stéfano. Real Madrid is my life, my home, and my blood.",
    madridDebut: {
      date: "August 18, 2013",
      competition: "La Liga",
      opponent: "Real Betis",
      venue: "Santiago Bernabéu",
      result: "2 - 1 (Win)",
      minutesPlayed: 90,
      contribution: "Started at right-back under Carlo Ancelotti and played the full 90 minutes in a 2-1 victory.",
      jerseyWorn: "No. 15"
    },
    lineage: [
      {
        stage: "Foundation Stone & Academy",
        club: "La Fábrica (Real Madrid Youth)",
        country: "Spain",
        years: "2002–2010",
        badgeColor: "#e5b324",
        details: "Selected in 2004 to lay the official foundation stone of the new Valdebebas training complex with legend Alfredo Di Stéfano."
      },
      {
        stage: "Castilla Promotion",
        club: "Real Madrid Castilla",
        country: "Spain",
        years: "2010–2012",
        badgeColor: "#475569",
        appearances: 68,
        goals: 3,
        details: "Captained Castilla to promotion back to Spain's Segunda División."
      },
      {
        stage: "German Apprenticeship",
        club: "Bayer Leverkusen",
        country: "Germany",
        years: "2012–2013",
        badgeColor: "#dc2626",
        fee: "€5 Million",
        appearances: 36,
        goals: 1,
        details: "Voted Bundesliga Best Right-Back of the Season by kicker magazine; Madrid promptly triggered their €6.5M buy-back clause."
      },
      {
        stage: "6x Champions League Kingpin",
        club: "Real Madrid",
        country: "Spain",
        years: "2013–Present",
        badgeColor: "#e5b324",
        fee: "€6.5 Million",
        details: "Started and won 6 Champions League finals, won 4 La Liga titles, and scored the breakthrough header in the 2024 Wembley Final."
      }
    ],
    stats: {
      madridApps: 427,
      madridGoals: 14,
      madridAssists: 64,
      internationalCaps: 51,
      internationalGoals: 1,
      trophiesMadrid: [
        "6x UEFA Champions League (2014, 2016, 2017, 2018, 2022, 2024)",
        "4x La Liga (2017, 2020, 2022, 2024)",
        "2x Copa del Rey (2014, 2023)",
        "5x UEFA Super Cup (2014, 2016, 2017, 2022, 2024)",
        "5x FIFA Club World Cup (2014, 2016, 2017, 2018, 2022)",
        "4x Supercopa de España (2017, 2020, 2022, 2024)"
      ],
      careerTrophiesCount: 27
    },
    peakPerformances: [
      {
        title: "UCL Final 2024 Man of the Match Header",
        match: "Real Madrid vs. Borussia Dortmund",
        competition: "UEFA Champions League Final",
        date: "June 1, 2024",
        score: "2 - 0",
        highlight: "Rose highest in the 74th minute at Wembley to direct Toni Kroos's corner into the net, breaking the deadlock and earning UEFA Man of the Match."
      },
      {
        title: "UEFA Super Cup Solo 119th-Minute Winner",
        match: "Real Madrid vs. Sevilla",
        competition: "UEFA Super Cup",
        date: "Aug 9, 2016",
        score: "3 - 2 (AET)",
        highlight: "Intercepted a pass in the 119th minute, dribbled past four Sevilla defenders, and chipped a stunning outside-of-the-boot winner."
      }
    ],
    records: [
      "Co-record holder for the most UEFA Champions League titles in football history (6 titles)",
      "Only defender in football history to win 6 European Cup/Champions League titles",
      "Player of the Match in the 2024 UEFA Champions League Final"
    ],
    facts: [
      "On May 12, 2004, as a 12-year-old in Madrid's Infantil B team wearing a white kit, he laid the cornerstone of Ciudad Real Madrid alongside honorary president Alfredo Di Stéfano.",
      "His father is a member of the Spanish National Police equestrian escort and escorted the Real Madrid team bus to the Bernabéu during celebrations.",
      "He is married to Daphne Cañizares; her twin sister Melanie is married to former Madrid teammate Joselu Mato, making Carvajal and Joselu brothers-in-law!"
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Daniel_Carvajal_2018.jpg/440px-Daniel_Carvajal_2018.jpg",
        caption: "Dani Carvajal in his Madrid gear"
      }
    ]
  },
  {
    id: "rudiger",
    name: "Antonio Rüdiger",
    fullName: "Antonio Rüdiger",
    number: 22,
    position: "Defender",
    category: "defender",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    birthDate: "March 3, 1993",
    birthPlace: "Berlin, Germany",
    height: "1.90 m",
    foot: "Right",
    joinedRealMadrid: "2022",
    transferFee: "Free Transfer",
    photo: "images/players/rudiger.jpg",
    bio: "The ferocious German defensive gladiator. Known for his intense warrior mentality, high-knee galloping sprints, and unmatched man-marking abilities that have neutralized the world's most feared strikers.",
    quote: "I am a soldier on the pitch. When I play for Real Madrid, I leave everything out there.",
    madridDebut: {
      date: "August 10, 2022",
      competition: "UEFA Super Cup",
      opponent: "Eintracht Frankfurt",
      venue: "Helsinki Olympic Stadium",
      result: "2 - 0 (Win)",
      minutesPlayed: 5,
      contribution: "Came on in the 85th minute replacing Dani Carvajal to secure the clean sheet and lift his first Madrid silverware.",
      jerseyWorn: "No. 22"
    },
    lineage: [
      {
        stage: "Berlin Street Football",
        club: "Hertha Zehlendorf & Dortmund Youth",
        country: "Germany",
        years: "2000–2011",
        badgeColor: "#0284c7",
        details: "Grew up in Berlin-Neukölln; developed his tough, fearless tackling on the concrete cages."
      },
      {
        stage: "Bundesliga Debut",
        club: "VfB Stuttgart",
        country: "Germany",
        years: "2011–2015",
        badgeColor: "#dc2626",
        fee: "Youth to Pro",
        appearances: 80,
        goals: 2,
        details: "Broke through in the Bundesliga and earned his first German national team call-up."
      },
      {
        stage: "Italian Defensive School",
        club: "AS Roma",
        country: "Italy",
        years: "2015–2017",
        badgeColor: "#991b1b",
        fee: "€9 Million",
        appearances: 72,
        goals: 2,
        details: "Honed his tactical awareness and backline communication in Serie A."
      },
      {
        stage: "European Champion",
        club: "Chelsea FC",
        country: "England",
        years: "2017–2022",
        badgeColor: "#1d4ed8",
        fee: "€35 Million",
        appearances: 203,
        goals: 12,
        details: "Won the 2021 Champions League with Chelsea under Thomas Tuchel, shutting down Man City in the final."
      },
      {
        stage: "Madrid's General",
        club: "Real Madrid",
        country: "Spain",
        years: "2022–Present",
        badgeColor: "#e5b324",
        fee: "Free Transfer",
        details: "Signed on a free transfer. Stepped up as Madrid's defensive leader during the 2023-24 double-winning season."
      }
    ],
    stats: {
      madridApps: 112,
      madridGoals: 5,
      madridAssists: 3,
      internationalCaps: 76,
      internationalGoals: 3,
      trophiesMadrid: [
        "1x UEFA Champions League (2024)",
        "1x La Liga (2024)",
        "1x Copa del Rey (2023)",
        "2x UEFA Super Cup (2022, 2024)",
        "1x FIFA Club World Cup (2022)",
        "1x Supercopa de España (2024)"
      ],
      careerTrophiesCount: 11
    },
    peakPerformances: [
      {
        title: "Haaland Pocketing Masterclass",
        match: "Real Madrid vs. Manchester City",
        competition: "UEFA Champions League SF",
        date: "May 9, 2023",
        score: "1 - 1",
        highlight: "Physically suffocated Erling Haaland over 90 minutes at the Bernabéu, limiting the Premier League top scorer to just 21 touches and zero shots on target."
      },
      {
        title: "Heroic Bloody Header vs. Shakhtar",
        match: "Shakhtar Donetsk vs. Real Madrid",
        competition: "UEFA Champions League",
        date: "Oct 11, 2022",
        score: "1 - 1",
        highlight: "Headed in a 95th-minute equalizer while colliding violently with the goalkeeper, requiring 20 facial stitches, but securing Madrid's knockout qualification."
      },
      {
        title: "Decisive Penalty in Etihad Shootout",
        match: "Manchester City vs. Real Madrid",
        competition: "UEFA Champions League QF",
        date: "Apr 17, 2024",
        score: "1 - 1 (4-3 Pens)",
        highlight: "Stepped up to take the 5th and decisive penalty at the Etihad Stadium, driving it off the post and in to eliminate the reigning European champions."
      }
    ],
    records: [
      "Only player to score the winning penalty in a UCL shootout at the Etihad Stadium against Pep Guardiola's Manchester City",
      "UEFA Champions League Team of the Season (2021, 2022, 2024)"
    ],
    facts: [
      "His parents fled the civil war in Sierra Leone and settled in Berlin, where Antonio grew up in the multicultural neighborhood of Neukölln.",
      "He funds surgeries for children with clubfoot in Sierra Leone through his charitable foundation and donated his entire 2022 World Cup earnings to the cause.",
      "Famous for his wild locker-room dancing, slap-celebrations with teammates, and eccentric mind-games on the pitch.",
      "His battle scars include 20 stitches across his forehead from the Shakhtar heroics in 2022."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Antonio_R%C3%BCdiger_2018.jpg/440px-Antonio_R%C3%BCdiger_2018.jpg",
        caption: "Antonio Rüdiger's commanding presence"
      }
    ]
  },
  {
    id: "courtois",
    name: "Thibaut Courtois",
    fullName: "Thibaut Nicolas Marc Courtois",
    number: 1,
    position: "Goalkeeper",
    category: "goalkeeper",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "Belgium",
    countryCode: "BE",
    flag: "🇧🇪",
    birthDate: "May 11, 1992",
    birthPlace: "Bree, Belgium",
    height: "2.00 m",
    foot: "Left",
    joinedRealMadrid: "2018",
    transferFee: "€35 Million",
    photo: "images/players/courtois.jpg",
    bio: "The 2-meter tall Belgian colossus in goal. widely regarded as the most dominant big-game goalkeeper of his generation. Produced the greatest goalkeeping display in UEFA Champions League final history in 2022 with 9 saves against Liverpool.",
    quote: "When Real Madrid plays in a final, Real Madrid wins. History is on our side.",
    madridDebut: {
      date: "September 1, 2018",
      competition: "La Liga",
      opponent: "CD Leganés",
      venue: "Santiago Bernabéu",
      result: "4 - 1 (Win)",
      minutesPlayed: 90,
      contribution: "Started under Julen Lopetegui and conceded only a penalty in a 4-1 victory.",
      jerseyWorn: "No. 25"
    },
    lineage: [
      {
        stage: "Youth Roots",
        club: "Bilzen V.V. & Genk",
        country: "Belgium",
        years: "1997–2009",
        badgeColor: "#0284c7",
        details: "Originally played as a left-back before his coach converted him to goalkeeper due to his rapid growth."
      },
      {
        stage: "Belgian Title Hero",
        club: "KRC Genk",
        country: "Belgium",
        years: "2009–2011",
        badgeColor: "#1d4ed8",
        fee: "Youth to Pro",
        appearances: 45,
        details: "Conceded just 32 goals in 40 games at age 18, making decisive saves to win the 2010-11 Belgian Pro League."
      },
      {
        stage: "Madrid Apprenticeship",
        club: "Atlético Madrid (Loan)",
        country: "Spain",
        years: "2011–2014",
        badgeColor: "#dc2626",
        fee: "Loan from Chelsea",
        appearances: 154,
        details: "Won La Liga (2014), the Europa League (2012), and Copa del Rey (2013) on loan in the Spanish capital."
      },
      {
        stage: "Premier League Champion",
        club: "Chelsea FC",
        country: "England",
        years: "2014–2018",
        badgeColor: "#1e3a8a",
        fee: "Return from Loan",
        appearances: 154,
        details: "Won two Premier League titles (2015, 2017) and the Golden Glove award."
      },
      {
        stage: "The Wall of Madrid",
        club: "Real Madrid",
        country: "Spain",
        years: "2018–Present",
        badgeColor: "#e5b324",
        fee: "€35 Million",
        details: "Won two Champions Leagues (2022, 2024), 3 La Liga titles, and earned the 2022 Yashin Trophy as world's best goalkeeper."
      }
    ],
    stats: {
      madridApps: 240,
      madridCleanSheets: 96,
      goalsConceded: 221,
      internationalCaps: 102,
      internationalCleanSheets: 51,
      trophiesMadrid: [
        "2x UEFA Champions League (2022, 2024)",
        "3x La Liga (2020, 2022, 2024)",
        "1x Copa del Rey (2023)",
        "2x UEFA Super Cup (2022, 2024)",
        "1x FIFA Club World Cup (2018)",
        "2x Supercopa de España (2020, 2022)"
      ],
      careerTrophiesCount: 20
    },
    peakPerformances: [
      {
        title: "The 9-Save Paris Masterclass (Final 2022)",
        match: "Real Madrid vs. Liverpool",
        competition: "UEFA Champions League Final",
        date: "May 28, 2022",
        score: "1 - 0",
        highlight: "Made 9 incredible saves against Mohamed Salah and Sadio Mané, including a fingertip push onto the post and a reflex block with his arm, winning Man of the Match."
      },
      {
        title: "Clean Sheet in Wembley Final After ACL Surgery",
        match: "Real Madrid vs. Borussia Dortmund",
        competition: "UEFA Champions League Final",
        date: "June 1, 2024",
        score: "2 - 0",
        highlight: "After missing 9 months of the season with an ACL tear, returned to start the final, kept a clean sheet with sharp first-half stops, and won his 2nd European Cup."
      }
    ],
    records: [
      "Most saves in a UEFA Champions League final since stats began (9 saves in 2022)",
      "Most saves across an entire UEFA Champions League campaign (59 saves in 2021–22)",
      "Yashin Trophy Winner (2022, Best Goalkeeper in the World)",
      "Only goalkeeper to win the Zamora Trophy with both Atlético Madrid and Real Madrid"
    ],
    facts: [
      "Both of his parents were professional volleyball players, and his sister Valérie Courtois is a professional volleyball libero for Belgium.",
      "His stunning header in the 95th minute against Valencia in Dec 2019 forced an assist for Karim Benzema to equalize 1-1.",
      "He speaks five languages fluently: Dutch, French, English, Spanish, and German.",
      "He is an avid sim racer and competed against Formula 1 drivers in virtual Grand Prix events during lockdowns."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Courtois_2018_%28cropped%29.jpg/440px-Courtois_2018_%28cropped%29.jpg",
        caption: "Thibaut Courtois guarding the net"
      }
    ]
  },
  {
    id: "lunin",
    name: "Andriy Lunin",
    fullName: "Andriy Oleksiyovych Lunin",
    number: 13,
    position: "Goalkeeper",
    category: "goalkeeper",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "Ukraine",
    countryCode: "UA",
    flag: "🇺🇦",
    birthDate: "February 11, 1999",
    birthPlace: "Krasnohrad, Ukraine",
    height: "1.91 m",
    foot: "Right",
    joinedRealMadrid: "2018",
    transferFee: "€8.5 Million",
    photo: "images/players/lunin.jpg",
    bio: "The Ukrainian shootout specialist and unsung hero of Real Madrid's 15th Champions League triumph. Stepped in during Courtois's injury and delivered heroic performances against Leipzig and Manchester City.",
    quote: "Working hard every single day in silence. When Madrid needs you, you must be ready.",
    madridDebut: {
      date: "January 20, 2021",
      competition: "Copa del Rey",
      opponent: "CD Alcoyano",
      venue: "El Collao, Alcoy",
      result: "1 - 2 (Defeat after extra time)",
      minutesPlayed: 120,
      contribution: "Finally made his official debut after multiple loan spells.",
      jerseyWorn: "No. 13"
    },
    lineage: [
      {
        stage: "Youth Roots",
        club: "Metalist Kharkiv & Dnipro",
        country: "Ukraine",
        years: "2010–2016",
        badgeColor: "#0284c7",
        details: "Graduated from Dnipro's academy and played in the Ukrainian Premier League as a teenager."
      },
      {
        stage: "Europa League Exposure",
        club: "Zorya Luhansk",
        country: "Ukraine",
        years: "2017–2018",
        badgeColor: "#0f172a",
        fee: "Free",
        appearances: 36,
        details: "Kept a memorable clean sheet against Athletic Bilbao in San Mamés in the Europa League."
      },
      {
        stage: "Loan Growth",
        club: "Leganés, Valladolid, Real Oviedo",
        country: "Spain",
        years: "2018–2020",
        badgeColor: "#2563eb",
        fee: "Loans",
        appearances: 31,
        details: "Gained Spanish experience, particularly standing out during a 20-game stretch at Oviedo."
      },
      {
        stage: "UCL Hero of 2024",
        club: "Real Madrid",
        country: "Spain",
        years: "2020–Present",
        badgeColor: "#e5b324",
        fee: "€8.5 Million",
        details: "Played 31 games in 2023-24, saving 2 penalties against Manchester City in the quarter-final shootout."
      }
    ],
    stats: {
      madridApps: 50,
      madridCleanSheets: 17,
      goalsConceded: 51,
      internationalCaps: 13,
      internationalCleanSheets: 6,
      trophiesMadrid: [
        "2x UEFA Champions League (2022, 2024)",
        "2x La Liga (2022, 2024)",
        "1x Copa del Rey (2023)",
        "1x UEFA Super Cup (2022)",
        "1x FIFA Club World Cup (2022)",
        "1x Supercopa de España (2024)"
      ],
      careerTrophiesCount: 9
    },
    peakPerformances: [
      {
        title: "Etihad Shootout Stunner vs. Bernardo & Kovacic",
        match: "Manchester City vs. Real Madrid",
        competition: "UEFA Champions League QF",
        date: "Apr 17, 2024",
        score: "1 - 1 (4-3 Pens)",
        highlight: "Stood motionless in the center of the goal to easily catch Bernardo Silva's chip, then dived full stretch to tip Mateo Kovačić's spot-kick wide."
      },
      {
        title: "9 Saves at Red Bull Arena",
        match: "RB Leipzig vs. Real Madrid",
        competition: "UEFA Champions League R16",
        date: "Feb 13, 2024",
        score: "0 - 1",
        highlight: "Made 9 reflex saves to deny Šeško and Olmo, equalizing Courtois's Madrid record for most saves in a single UCL away knockout match."
      }
    ],
    records: [
      "Joint record for most saves in a single Champions League away knockout match for Real Madrid (9 saves vs RB Leipzig)",
      "FIFA U-20 World Cup Golden Glove Winner (2019, when Ukraine won the World Cup)"
    ],
    facts: [
      "In the penalty shootout against Man City, he and goalkeeping coach Luis Llopis had studied that at least one City player would shoot down the middle; Lunin gambled on Bernardo Silva and stood rock-still.",
      "Got married in 2021 in a civil ceremony wearing a casual tracksuit because he had training that afternoon.",
      "Won the 2019 FIFA U-20 World Cup with Ukraine as starting goalkeeper."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Andriy_Lunin_2021.jpg/440px-Andriy_Lunin_2021.jpg",
        caption: "Andriy Lunin between the posts"
      }
    ]
  },
  {
    id: "kroos",
    name: "Toni Kroos",
    fullName: "Toni Kroos",
    number: 8,
    position: "Midfielder",
    category: "midfielder",
    status: "departed",
    statusLabel: "Retired Legend (2024)",
    currentClub: "Retired (June 2024)",
    departureYear: "2024",
    departureDestination: "Retired after winning 15th UCL",
    departureDetails: "Announced retirement at age 34 at the absolute peak of his game. His final club match was the 2024 Champions League final at Wembley, where he assisted Carvajal's winning goal and was substituted to a rapturous standing ovation.",
    nationality: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    birthDate: "January 4, 1990",
    birthPlace: "Greifswald, East Germany",
    height: "1.83 m",
    foot: "Both",
    joinedRealMadrid: "2014",
    transferFee: "€25 Million",
    photo: "images/players/kroos.jpg",
    bio: "The German Sniper. The greatest passing metronome of the modern era. Alongside Luka Modrić and Casemiro, Kroos commanded Madrid's midfield for a decade, winning 5 Champions Leagues with Real Madrid with a career pass accuracy consistently exceeding 94%.",
    quote: "I always wanted to retire at the top, when people still wonder why I am leaving rather than asking when I will leave.",
    madridDebut: {
      date: "August 12, 2014",
      competition: "UEFA Super Cup",
      opponent: "Sevilla FC",
      venue: "Cardiff City Stadium",
      result: "2 - 0 (Win)",
      minutesPlayed: 90,
      contribution: "Started immediately after winning the 2014 World Cup, misplaced only two passes the entire match (96% pass accuracy), and won his first Madrid trophy on his debut.",
      jerseyWorn: "No. 8"
    },
    lineage: [
      {
        stage: "Youth & Rostock",
        club: "Hansa Rostock",
        country: "Germany",
        years: "2002–2006",
        badgeColor: "#0284c7",
        details: "Coached by his father Roland Kroos; scouted by Bayern Munich at age 16."
      },
      {
        stage: "Bayern & Leverkusen Loan",
        club: "Bayern Munich & Bayer Leverkusen",
        country: "Germany",
        years: "2006–2014",
        badgeColor: "#dc2626",
        fee: "Youth / Loan",
        appearances: 205,
        goals: 24,
        details: "Won the 2013 Treble with Bayern and spent 18 decisive development months under Jupp Heynckes at Leverkusen."
      },
      {
        stage: "Madrid Decade of Dominance",
        club: "Real Madrid",
        country: "Spain",
        years: "2014–2024",
        badgeColor: "#e5b324",
        fee: "€25 Million (Called the 'Bargain of the Century')",
        appearances: 465,
        goals: 28,
        details: "Won 5 Champions Leagues, 4 La Liga titles, and completed 465 games with the highest passing accuracy in European football history."
      },
      {
        stage: "Departure / Status",
        club: "Retired as European Champion",
        country: "Legend",
        years: "2024",
        badgeColor: "#475569",
        details: "Hangs up his famous white adidas Adipure 11pro boots after winning Champions League #15 at Wembley."
      }
    ],
    stats: {
      madridApps: 465,
      madridGoals: 28,
      madridAssists: 98,
      internationalCaps: 114,
      internationalGoals: 17,
      trophiesMadrid: [
        "5x UEFA Champions League (2016, 2017, 2018, 2022, 2024)",
        "4x La Liga (2017, 2020, 2022, 2024)",
        "1x Copa del Rey (2023)",
        "4x UEFA Super Cup (2014, 2016, 2017, 2022)",
        "5x FIFA Club World Cup (2014, 2016, 2017, 2018, 2022)",
        "4x Supercopa de España (2017, 2020, 2022, 2024)"
      ],
      careerTrophiesCount: 34
    },
    peakPerformances: [
      {
        title: "The Wembley Farewell Assist (2024 UCL Final)",
        match: "Real Madrid vs. Borussia Dortmund",
        competition: "UEFA Champions League Final",
        date: "June 1, 2024",
        score: "2 - 0",
        highlight: "In the final club match of his career, delivered a laser-guided corner kick in the 74th minute onto Dani Carvajal's head to win the title."
      },
      {
        title: "Laser Assist to Vinícius in Munich (2024)",
        match: "Bayern Munich vs. Real Madrid",
        competition: "UEFA Champions League SF",
        date: "Apr 30, 2024",
        score: "2 - 2",
        highlight: "Cut open Bayern's entire defense with a single 40-yard ground pass of pure geometry right into Vinícius's stride."
      },
      {
        title: "Direct Corner Goal in Supercopa",
        match: "Real Madrid vs. Valencia",
        competition: "Supercopa de España",
        date: "Jan 8, 2020",
        score: "3 - 1",
        highlight: "Spotted Valencia goalkeeper Jaume Doménech organizing his defense, and curled the corner kick directly into the net from the flag."
      }
    ],
    records: [
      "Co-record holder for the most UEFA Champions League titles in football history (6 titles: 1 with Bayern, 5 with Real Madrid)",
      "Highest pass completion rate across a decade in Europe's top 5 leagues (94.6%)",
      "Most FIFA Club World Cup titles won by any individual player in football history (6 titles)"
    ],
    facts: [
      "Wore the exact same model of white adidas Adipure 11pro boots for over a decade (from 2013 to his retirement in 2024), personally cleaning them with a brush himself before matches.",
      "His transfer from Bayern Munich in 2014 for only €25 million is considered by Bayern legend Karl-Heinz Rummenigge to be one of Bayern's biggest regrets.",
      "In his tearful Bernabéu farewell match against Real Betis in May 2024, his children ran onto the pitch to hug him, causing the usually stoic German to break down in tears.",
      "Now runs the Toni Kroos Academy in Madrid to train young boys and girls."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Toni_Kroos_2018.jpg/440px-Toni_Kroos_2018.jpg",
        caption: "Toni Kroos, the German Maestro"
      }
    ]
  },
  {
    id: "nacho",
    name: "Nacho Fernández",
    fullName: "José Ignacio Fernández Iglesias",
    number: 6,
    position: "Defender",
    category: "defender",
    status: "departed",
    statusLabel: "Departed 2024 (To Saudi Arabia)",
    currentClub: "Al-Qadsiah (Saudi Arabia)",
    departureYear: "2024",
    departureDestination: "Al-Qadsiah FC (Saudi Pro League)",
    departureDetails: "Left in summer 2024 as the victorious captain lifting La Liga and the Champions League trophy at Wembley. Signed a two-year contract with Saudi club Al-Qadsiah after 23 years at Real Madrid.",
    nationality: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    birthDate: "January 18, 1990",
    birthPlace: "Madrid, Spain",
    height: "1.80 m",
    foot: "Right",
    joinedRealMadrid: "2001 (Academy) / 2011 (Senior)",
    transferFee: "Academy Graduate (Free)",
    photo: "images/players/nacho.jpg",
    bio: "The eternal One-Club Man at Real Madrid for 23 years before his 2024 departure. Diagnosed with Type 1 diabetes at age 12, Nacho defied medical odds to become club captain, win 6 Champions Leagues, and never wear another club's shirt during his European career.",
    quote: "I arrived as a boy of 10 and left as the captain lifting our 15th European Cup. I could not have dreamed of a better ending.",
    madridDebut: {
      date: "April 23, 2011",
      competition: "La Liga",
      opponent: "Valencia CF",
      venue: "Mestalla, Valencia",
      result: "6 - 3 (Win)",
      minutesPlayed: 90,
      contribution: "Started at left-back under José Mourinho and played the entire 90 minutes in an emphatic victory.",
      jerseyWorn: "No. 27"
    },
    lineage: [
      {
        stage: "Academy Boy to Castilla Captain",
        club: "La Fábrica (Real Madrid Youth & Castilla)",
        country: "Spain",
        years: "2001–2013",
        badgeColor: "#e5b324",
        details: "Joined Madrid at age 11. Played 111 matches for Castilla and captained them to Segunda promotion."
      },
      {
        stage: "Ultimate Madrid Defender & Captain",
        club: "Real Madrid First Team",
        country: "Spain",
        years: "2011–2024",
        badgeColor: "#e5b324",
        fee: "Academy",
        appearances: 364,
        goals: 16,
        details: "Captained Madrid to the 2024 La Liga and UCL double. Won 26 official trophies in white."
      },
      {
        stage: "Departure / Current Club",
        club: "Al-Qadsiah FC",
        country: "Saudi Arabia",
        years: "2024–Present",
        badgeColor: "#b91c1c",
        fee: "Free Transfer",
        details: "Signed a 2-year deal in Saudi Arabia after lifting the 2024 Euro title with Spain."
      }
    ],
    stats: {
      madridApps: 364,
      madridGoals: 16,
      madridAssists: 9,
      internationalCaps: 29,
      internationalGoals: 1,
      trophiesMadrid: [
        "6x UEFA Champions League (2014, 2016, 2017, 2018, 2022, 2024)",
        "4x La Liga (2017, 2020, 2022, 2024)",
        "2x Copa del Rey (2014, 2023)",
        "4x UEFA Super Cup (2014, 2016, 2017, 2022)",
        "5x FIFA Club World Cup (2014, 2016, 2017, 2018, 2022)",
        "5x Supercopa de España (2012, 2017, 2020, 2022, 2024)"
      ],
      careerTrophiesCount: 27
    },
    peakPerformances: [
      {
        title: "Lifting UCL #15 as Captain at Wembley",
        match: "Real Madrid vs. Borussia Dortmund",
        competition: "UEFA Champions League Final",
        date: "June 1, 2024",
        score: "2 - 0",
        highlight: "Started as captain and kept a clean sheet against Dortmund before lifting the trophy at Wembley in his final match for Real Madrid."
      },
      {
        title: "Etihad Defensive Heroics (2024 QF)",
        match: "Manchester City vs. Real Madrid",
        competition: "UEFA Champions League QF",
        date: "Apr 17, 2024",
        score: "1 - 1 (4-3 Pens)",
        highlight: "Captained the defense over 120 minutes with crucial goal-line clearances and scored his penalty in the shootout."
      }
    ],
    records: [
      "Co-record holder for the most UEFA Champions League titles in football history (6 titles)",
      "Joint-most decorated player in Real Madrid history at his departure with 26 trophies"
    ],
    facts: [
      "At age 12, a doctor told him his football career was over because he had Type 1 diabetes. Another endocrinologist told him exercise was actually vital, and Nacho manages his insulin daily.",
      "His younger brother Álex Fernández is also a professional footballer who plays for Cádiz CF.",
      "Spent 23 consecutive years with Real Madrid, never leaving on loan or playing for any other club until age 34.",
      "He won UEFA Euro 2024 with Spain just weeks after winning the 2024 Champions League with Madrid."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Nacho_Fernandez_2018.jpg/440px-Nacho_Fernandez_2018.jpg",
        caption: "Nacho Fernández wearing the captain's armband"
      }
    ]
  },
  {
    id: "joselu",
    name: "Joselu",
    fullName: "José Luis Mato Sanmartín",
    number: 14,
    position: "Forward",
    category: "forward",
    status: "departed",
    statusLabel: "Departed 2024 (To Qatar)",
    currentClub: "Al-Gharafa SC (Qatar)",
    departureYear: "2024",
    departureDestination: "Al-Gharafa SC (Qatar Stars League)",
    departureDetails: "After writing one of football's greatest fairy tales with his late 2-minute brace against Bayern Munich in the 2024 UCL semi-final, Real Madrid purchased him from Espanyol for €1.5M and facilitated his dream move to Qatar's Al-Gharafa.",
    nationality: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    birthDate: "March 27, 1990",
    birthPlace: "Stuttgart, Germany",
    height: "1.92 m",
    foot: "Right",
    joinedRealMadrid: "2009 (Castilla) / 2023 (First Team Loan)",
    transferFee: "€500k Loan / €1.5M Buyout",
    photo: "images/players/joselu.jpg",
    bio: "The fairy-tale hero of Madrid's 15th European Cup. A decade after leaving Castilla, Joselu attended the 2022 Champions League final in Paris as a fan in a Madrid jersey to support brother-in-law Dani Carvajal. Two years later, he scored two goals in two minutes in the semi-final to take Madrid to the final.",
    quote: "Two years ago I was in Paris as a fan supporting Madrid. Today I am on the pitch living a dream.",
    madridDebut: {
      date: "May 21, 2011",
      competition: "La Liga",
      opponent: "UD Almería",
      venue: "Santiago Bernabéu",
      result: "8 - 1 (Win)",
      minutesPlayed: 6,
      contribution: "Came on in the 84th minute replacing Karim Benzema and scored with his very first touch from a Cristiano Ronaldo cross.",
      jerseyWorn: "No. 39"
    },
    lineage: [
      {
        stage: "Youth Roots",
        club: "Celta Vigo",
        country: "Spain",
        years: "2002–2009",
        badgeColor: "#0284c7",
        details: "Born in Stuttgart to Spanish immigrant parents; moved to Galicia at age 4 and came through Celta's academy."
      },
      {
        stage: "Castilla Top Scorer",
        club: "Real Madrid Castilla",
        country: "Spain",
        years: "2009–2012",
        badgeColor: "#e5b324",
        fee: "€1.5 Million",
        appearances: 72,
        goals: 40,
        details: "Top scorer for Castilla alongside Álvaro Morata, firing them to Segunda promotion."
      },
      {
        stage: "European Journeyman",
        club: "Hoffenheim, Frankfurt, Hannover, Stoke, Newcastle, Alavés, Espanyol",
        country: "Germany / England / Spain",
        years: "2012–2023",
        badgeColor: "#475569",
        details: "Grinded for a decade across the Bundesliga, Premier League, and La Liga, scoring over 100 top-flight goals."
      },
      {
        stage: "The Miracle Return",
        club: "Real Madrid",
        country: "Spain",
        years: "2023–2024",
        badgeColor: "#e5b324",
        fee: "Loan",
        appearances: 49,
        goals: 17,
        details: "Scored 17 goals, won La Liga and the Champions League, including the historic 2-minute brace vs Bayern."
      },
      {
        stage: "Departure / Current Club",
        club: "Al-Gharafa SC",
        country: "Qatar",
        years: "2024–Present",
        badgeColor: "#ca8a04",
        fee: "€1.5 Million",
        details: "Signed a multi-year deal in Qatar after winning Euro 2024 with Spain."
      }
    ],
    stats: {
      madridApps: 51,
      madridGoals: 19,
      madridAssists: 3,
      internationalCaps: 14,
      internationalGoals: 5,
      trophiesMadrid: [
        "1x UEFA Champions League (2024)",
        "1x La Liga (2024)",
        "1x Supercopa de España (2024)"
      ],
      careerTrophiesCount: 4
    },
    peakPerformances: [
      {
        title: "The 2-Minute Miracle vs. Bayern Munich",
        match: "Real Madrid vs. Bayern Munich",
        competition: "UEFA Champions League SF",
        date: "May 8, 2024",
        score: "2 - 1 (4-3 agg)",
        highlight: "Came on in the 81st minute with Madrid trailing 1-0. Pounced on Neuer's spill in the 88th minute to equalize, then tapped in Rüdiger's cross in the 91st minute to send Madrid to Wembley."
      },
      {
        title: "Overhead Bicycle Kick vs. Man United",
        match: "Real Madrid vs. Manchester United",
        competition: "Pre-Season Friendly, Houston",
        date: "July 26, 2023",
        score: "2 - 0",
        highlight: "Scored an astonishing airborne bicycle kick in the 89th minute in front of 67,000 fans in Texas."
      }
    ],
    records: [
      "Fastest brace by a substitute in a UEFA Champions League semi-final (88' and 91')",
      "Scored on his Real Madrid debut in 2011 with his very first touch of the ball"
    ],
    facts: [
      "In 2022, he flew to Paris and stood in the fan zone wearing a Real Madrid shirt with 'Carvajal' on the back to cheer on his brother-in-law Dani Carvajal.",
      "His wife Melanie Cañizares and Dani Carvajal's wife Daphne Cañizares are twin sisters.",
      "He was born in Stuttgart, Germany, and lived there until age 4 before his family returned to Galicia, Spain.",
      "Florentino Pérez helped facilitate his transfer to Qatar as a gesture of deep appreciation for his unforgettable service."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Joselu_2023.jpg/440px-Joselu_2023.jpg",
        caption: "Joselu celebrating during the 2023-24 season"
      }
    ]
  },
  {
    id: "benzema",
    name: "Karim Benzema",
    fullName: "Karim Mostafa Benzema",
    number: 9,
    position: "Forward",
    category: "forward",
    status: "departed",
    statusLabel: "Departed 2023 (To Saudi Arabia)",
    currentClub: "Al-Ittihad (Saudi Arabia)",
    departureYear: "2023",
    departureDestination: "Al-Ittihad Club (Saudi Pro League)",
    departureDetails: "Departed after 14 legendary seasons in June 2023 as the reigning Ballon d'Or winner and the second all-time top scorer in Real Madrid history. Scored in his final match against Athletic Club.",
    nationality: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    birthDate: "December 19, 1987",
    birthPlace: "Lyon, France",
    height: "1.85 m",
    foot: "Right",
    joinedRealMadrid: "2009",
    transferFee: "€35 Million",
    photo: "images/players/benzema.jpg",
    bio: "The 2022 Ballon d'Or winner and Real Madrid's second all-time top scorer (354 goals). From sacrificing personal stats to complement Cristiano Ronaldo, to leading Madrid to the 2022 Champions League with back-to-back knockout hat-tricks, 'King Karim' is royalty in Madrid lore.",
    quote: "I didn't play football to be famous, I played football so that people could enjoy the game.",
    madridDebut: {
      date: "August 29, 2009",
      competition: "La Liga",
      opponent: "Deportivo La Coruña",
      venue: "Santiago Bernabéu",
      result: "3 - 2 (Win)",
      minutesPlayed: 73,
      contribution: "Started as the central striker alongside Raúl and Cristiano Ronaldo in Manuel Pellegrini's opening match of the Galácticos 2.0 era.",
      jerseyWorn: "No. 11"
    },
    lineage: [
      {
        stage: "Lyon Prodigy",
        club: "Olympique Lyonnais",
        country: "France",
        years: "1997–2009",
        badgeColor: "#1e3a8a",
        fee: "Youth to Pro",
        appearances: 148,
        goals: 66,
        details: "Won 4 consecutive Ligue 1 titles; voted Ligue 1 Player of the Year in 2008."
      },
      {
        stage: "Real Madrid Golden Era",
        club: "Real Madrid",
        country: "Spain",
        years: "2009–2023",
        badgeColor: "#e5b324",
        fee: "€35 Million",
        appearances: 648,
        goals: 354,
        details: "14 seasons, 25 trophies, 5 Champions Leagues, and the 2022 Ballon d'Or."
      },
      {
        stage: "Departure / Saudi League",
        club: "Al-Ittihad",
        country: "Saudi Arabia",
        years: "2023–Present",
        badgeColor: "#eab308",
        fee: "Free Transfer",
        details: "Signed a lucrative contract with Saudi champions Al-Ittihad in Jeddah."
      }
    ],
    stats: {
      madridApps: 648,
      madridGoals: 354,
      madridAssists: 165,
      internationalCaps: 97,
      internationalGoals: 37,
      trophiesMadrid: [
        "5x UEFA Champions League (2014, 2016, 2017, 2018, 2022)",
        "4x La Liga (2012, 2017, 2020, 2022)",
        "3x Copa del Rey (2011, 2014, 2023)",
        "4x UEFA Super Cup (2014, 2016, 2017, 2022)",
        "5x FIFA Club World Cup (2014, 2016, 2017, 2018, 2022)",
        "4x Supercopa de España (2012, 2017, 2020, 2022)"
      ],
      careerTrophiesCount: 33
    },
    peakPerformances: [
      {
        title: "17-Minute Bernabéu Hat-Trick vs. PSG",
        match: "Real Madrid vs. Paris Saint-Germain",
        competition: "UEFA Champions League R16",
        date: "Mar 9, 2022",
        score: "3 - 1 (3-2 agg)",
        highlight: "Trailing 2-0 on aggregate with 30 minutes left, pressured Donnarumma into an error and scored an unforgettable 17-minute hat-trick to eliminate Messi, Mbappé, and Neymar."
      },
      {
        title: "Stamford Bridge Masterclass Hat-Trick",
        match: "Chelsea vs. Real Madrid",
        competition: "UEFA Champions League QF",
        date: "Apr 6, 2022",
        score: "1 - 3",
        highlight: "Scored two breathtaking headers within three minutes in pouring London rain, followed by a third to register back-to-back Champions League knockout hat-tricks."
      },
      {
        title: "The Panenka at the Etihad",
        match: "Manchester City vs. Real Madrid",
        competition: "UEFA Champions League SF",
        date: "Apr 26, 2022",
        score: "4 - 3",
        highlight: "Having missed two penalties the previous week, stepped up in an electric 4-3 thriller and audaciously chipped Ederson with a Panenka."
      }
    ],
    records: [
      "Second all-time top goalscorer in Real Madrid history (354 goals, behind Cristiano Ronaldo)",
      "All-time top assist provider in Real Madrid history (165 assists)",
      "Ballon d'Or Winner (2022), winning with the highest percentage of votes in modern history",
      "Most goals in a single Champions League knockout phase (10 goals in 2021–22, tied with Cristiano Ronaldo)"
    ],
    facts: [
      "Florentino Pérez personally visited Karim's parents' modest house in Bron-Terraillon (Lyon) in 2009 to convince him to choose Madrid over Manchester United.",
      "He played with a wrapped right hand and wrist for over four years after breaking his little finger against Real Betis in 2019, delaying surgery because Madrid needed him on the pitch.",
      "Formed the legendary 'BBC' attacking trio alongside Gareth Bale and Cristiano Ronaldo, scoring hundreds of goals between 2013 and 2018.",
      "His 2021-22 campaign is widely regarded as one of the single greatest individual seasons in football history."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Karim_Benzema_wearing_Real_Madrid_home_kit_2021-2022.jpg/440px-Karim_Benzema_wearing_Real_Madrid_home_kit_2021-2022.jpg",
        caption: "Karim Benzema in the 2021-22 Ballon d'Or season"
      }
    ]
  },
  {
    id: "casemiro",
    name: "Casemiro",
    fullName: "Carlos Henrique Casimiro",
    number: 14,
    position: "Midfielder",
    category: "midfielder",
    status: "departed",
    statusLabel: "Departed 2022 (To Man United)",
    currentClub: "Manchester United (England)",
    departureYear: "2022",
    departureDestination: "Manchester United (Premier League)",
    departureDetails: "Departed in August 2022 for €70 million after winning his 5th Champions League in Paris. Bid an emotional, tear-filled farewell at the Santiago Bernabéu alongside Florentino Pérez.",
    nationality: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    birthDate: "February 23, 1992",
    birthPlace: "São José dos Campos, Brazil",
    height: "1.85 m",
    foot: "Right",
    joinedRealMadrid: "2013 (Castilla loan) / 2015 (Return)",
    transferFee: "€6 Million",
    photo: "images/players/casemiro.jpg",
    bio: "The 'Tank'. The defensive rock of Real Madrid's legendary 'Bermuda Triangle' midfield alongside Kroos and Modrić. Casemiro shielded the backline, destroyed opponent attacks, and scored thunderous long-range strikes in finals.",
    quote: "When I tackle, it's not just to take the ball; it's to feed my family.",
    madridDebut: {
      date: "April 20, 2013",
      competition: "La Liga",
      opponent: "Real Betis",
      venue: "Santiago Bernabéu",
      result: "3 - 1 (Win)",
      minutesPlayed: 90,
      contribution: "José Mourinho gave him his first-team debut while he was still registered with Castilla, and he played the full 90 minutes with authority.",
      jerseyWorn: "No. 38"
    },
    lineage: [
      {
        stage: "Favela to São Paulo",
        club: "São Paulo FC",
        country: "Brazil",
        years: "2002–2013",
        badgeColor: "#dc2626",
        fee: "Youth to Pro",
        appearances: 111,
        goals: 11,
        details: "Overcame childhood hepatitis and severe poverty in São José dos Campos."
      },
      {
        stage: "Castilla & Porto Loan",
        club: "RM Castilla & FC Porto",
        country: "Spain & Portugal",
        years: "2013–2015",
        badgeColor: "#1d4ed8",
        fee: "Loan",
        appearances: 56,
        goals: 5,
        details: "Honed his European tactical positioning under Julen Lopetegui at Porto, who triggered a buy-out before Madrid paid to buy him back."
      },
      {
        stage: "5x UCL Bermuda Triangle",
        club: "Real Madrid",
        country: "Spain",
        years: "2015–2022",
        badgeColor: "#e5b324",
        fee: "€7.5 Million",
        appearances: 336,
        goals: 31,
        details: "Formed football's most celebrated midfield trio with Kroos and Modrić, winning 5 Champions Leagues."
      },
      {
        stage: "Departure / Premier League",
        club: "Manchester United",
        country: "England",
        years: "2022–Present",
        badgeColor: "#b91c1c",
        fee: "€70 Million",
        details: "Transferred to Old Trafford in summer 2022, winning the Carabao Cup and FA Cup."
      }
    ],
    stats: {
      madridApps: 336,
      madridGoals: 31,
      madridAssists: 29,
      internationalCaps: 75,
      internationalGoals: 7,
      trophiesMadrid: [
        "5x UEFA Champions League (2014, 2016, 2017, 2018, 2022)",
        "3x La Liga (2017, 2020, 2022)",
        "1x Copa del Rey (2014)",
        "3x UEFA Super Cup (2016, 2017, 2022)",
        "3x FIFA Club World Cup (2016, 2017, 2018)",
        "3x Supercopa de España (2017, 2020, 2022)"
      ],
      careerTrophiesCount: 22
    },
    peakPerformances: [
      {
        title: "2017 UCL Final Long-Range Rocket vs. Buffon",
        match: "Real Madrid vs. Juventus",
        competition: "UEFA Champions League Final",
        date: "June 3, 2017",
        score: "4 - 1",
        highlight: "With the final tied 1-1 in Cardiff, blasted a 30-yard thunderous strike deflected into Gianluigi Buffon's bottom corner to give Madrid the decisive lead."
      },
      {
        title: "Dortmund Quarter-Final 2014 Rescue",
        match: "Borussia Dortmund vs. Real Madrid",
        competition: "UEFA Champions League QF",
        date: "Apr 8, 2014",
        score: "2 - 0 (3-2 agg)",
        highlight: "With Madrid on the brink of losing a 3-0 aggregate lead, Ancelotti subbed on Casemiro in the 73rd minute; his ferocious tackles stabilized the ship and preserved La Décima."
      }
    ],
    records: [
      "Won 5 UEFA Champions League titles in 8 seasons at Real Madrid",
      "Most tackles and interceptions combined in UEFA Champions League knockout stages between 2016 and 2022"
    ],
    facts: [
      "His birth surname was spelled 'Casimiro', but when São Paulo printed his jersey with 'Casemiro' by mistake, he played so well that he superstitiously kept the spelling forever.",
      "His family couldn't afford a bed for him as a kid; when he first joined São Paulo's academy dorms, he said having his own bed and three meals a day felt like living in a palace.",
      "Carlo Ancelotti famously dubbed Casemiro, Kroos, and Modrić 'The Bermuda Triangle' because the ball would disappear into their midfield and never come out.",
      "In 2024, he became a co-owner of Spanish football club Marbella FC."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Casemiro_2018.jpg/440px-Casemiro_2018.jpg",
        caption: "Casemiro fighting for the ball"
      }
    ]
  },
  {
    id: "cristiano",
    name: "Cristiano Ronaldo",
    fullName: "Cristiano Ronaldo dos Santos Aveiro",
    number: 7,
    position: "Forward",
    category: "legend",
    status: "legend",
    statusLabel: "Eternal Club Legend",
    currentClub: "Al Nassr (Saudi Arabia)",
    departureYear: "2018",
    departureDestination: "Juventus (€117M) -> Man United -> Al Nassr",
    departureDetails: "Left in summer 2018 after lifting his 4th Champions League with Madrid in Kyiv. Transferred to Juventus for €117M. Left as the greatest goalscorer in Real Madrid history.",
    nationality: "Portugal",
    countryCode: "PT",
    flag: "🇵🇹",
    birthDate: "February 5, 1985",
    birthPlace: "Funchal, Madeira, Portugal",
    height: "1.87 m",
    foot: "Both",
    joinedRealMadrid: "2009",
    transferFee: "€94 Million (World Record at the time)",
    photo: "images/players/cristiano.jpg",
    bio: "The greatest goalscorer in the history of Real Madrid. Scored an unbelievable 451 goals in 438 matches — more than one goal per game over 9 seasons. Led Real Madrid to 4 Champions League crowns, including the historic 3-peat.",
    quote: "Your love makes me strong, your hate makes me unstoppable. ¡Hala Madrid y nada más!",
    madridDebut: {
      date: "August 29, 2009",
      competition: "La Liga",
      opponent: "Deportivo La Coruña",
      venue: "Santiago Bernabéu",
      result: "3 - 2 (Win)",
      minutesPlayed: 90,
      contribution: "Started and scored Madrid's second goal from the penalty spot in the 35th minute.",
      jerseyWorn: "No. 9 (Raúl wore No. 7 at the time)"
    },
    lineage: [
      {
        stage: "Madeira Roots",
        club: "Andorinha & Nacional",
        country: "Portugal",
        years: "1992–1997",
        badgeColor: "#0284c7",
        details: "Grew up in Santo António, Madeira; father worked as a kit man at Andorinha."
      },
      {
        stage: "Sporting CP Academy",
        club: "Sporting CP",
        country: "Portugal",
        years: "1997–2003",
        badgeColor: "#059669",
        fee: "Youth to Pro",
        appearances: 31,
        goals: 5,
        details: "Dazzled Manchester United players in a pre-season friendly in Lisbon, prompting Sir Alex Ferguson to sign him immediately."
      },
      {
        stage: "Premier League & 1st Ballon d'Or",
        club: "Manchester United",
        country: "England",
        years: "2003–2009",
        badgeColor: "#dc2626",
        fee: "€19 Million",
        appearances: 292,
        goals: 118,
        details: "Won 3 Premier Leagues, the 2008 Champions League, and his first Ballon d'Or."
      },
      {
        stage: "The Madrid Empire (451 Goals)",
        club: "Real Madrid",
        country: "Spain",
        years: "2009–2018",
        badgeColor: "#e5b324",
        fee: "€94 Million (World Record)",
        appearances: 438,
        goals: 451,
        details: "4 Champions Leagues, 4 Ballon d'Ors at Madrid, 451 goals in 438 games. The ultimate Madridista benchmark."
      },
      {
        stage: "Post-Madrid Odyssey",
        club: "Juventus -> Man United -> Al Nassr",
        country: "Italy / England / Saudi Arabia",
        years: "2018–Present",
        badgeColor: "#ca8a04",
        details: "Won 2 Serie A titles with Juventus, returned to Man United, and moved to Al Nassr in Saudi Arabia."
      }
    ],
    stats: {
      madridApps: 438,
      madridGoals: 451,
      madridAssists: 131,
      internationalCaps: 215,
      internationalGoals: 133,
      trophiesMadrid: [
        "4x UEFA Champions League (2014, 2016, 2017, 2018)",
        "2x La Liga (2012, 2017)",
        "2x Copa del Rey (2011, 2014)",
        "3x UEFA Super Cup (2014, 2016, 2017)",
        "3x FIFA Club World Cup (2014, 2016, 2017)",
        "2x Supercopa de España (2012, 2017)"
      ],
      careerTrophiesCount: 35
    },
    peakPerformances: [
      {
        title: "The Bicycle Kick in Turin vs. Buffon",
        match: "Juventus vs. Real Madrid",
        competition: "UEFA Champions League QF",
        date: "Apr 3, 2018",
        score: "0 - 3",
        highlight: "Rose 2.38 meters into the air and unleashed a perfect bicycle kick past Buffon, earning an unprecedented standing ovation from the entire Juventus stadium."
      },
      {
        title: "The Wolfsburg Remontada Hat-Trick",
        match: "Real Madrid vs. VfL Wolfsburg",
        competition: "UEFA Champions League QF",
        date: "Apr 12, 2016",
        score: "3 - 0 (3-2 agg)",
        highlight: "Trailing 2-0 from the first leg, scored an iconic Bernabéu hat-trick, including a dramatic 77th-minute free-kick through the wall to send Madrid through."
      },
      {
        title: "Calma Calma at Camp Nou (2012)",
        match: "Barcelona vs. Real Madrid",
        competition: "La Liga",
        date: "Apr 21, 2012",
        score: "1 - 2",
        highlight: "Rounded Víctor Valdés to score the 73rd-minute winner and silenced 99,000 Barcelona fans with his legendary 'Calma, calma' gesture, clinching the 100-point La Liga title."
      }
    ],
    records: [
      "All-time record goalscorer in Real Madrid history (451 goals)",
      "Only player in Real Madrid history with an average of over 1.0 goal per game (451 goals in 438 appearances)",
      "All-time top scorer in UEFA Champions League history (140 goals)",
      "Most goals in a single UEFA Champions League season (17 goals in 2013–14)",
      "44 hat-tricks for Real Madrid (club record)"
    ],
    facts: [
      "Over 80,000 fans packed the Santiago Bernabéu just to see his presentation on July 6, 2009, breaking Diego Maradona's 25-year-old attendance record.",
      "He doesn't have any tattoos because he regularly donates blood and bone marrow.",
      "His vertical jump during headers was measured by sports scientists at 78 cm (higher than the average NBA basketball player).",
      "During his 9 years in Madrid, he scored against every single team he faced in La Liga."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/440px-Cristiano_Ronaldo_2018.jpg",
        caption: "Cristiano Ronaldo, Madrid's all-time record goalscorer"
      }
    ]
  },
  {
    id: "sergio-ramos",
    name: "Sergio Ramos",
    fullName: "Sergio Ramos García",
    number: 4,
    position: "Defender",
    category: "legend",
    status: "legend",
    statusLabel: "Eternal Captain",
    currentClub: "Free Agent (formerly Sevilla / PSG)",
    departureYear: "2021",
    departureDestination: "Paris Saint-Germain -> Sevilla",
    departureDetails: "Departed in 2021 after 16 heroic seasons and 22 trophies. Left Madrid as the supreme captain, defender, and clutch goalscorer.",
    nationality: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    birthDate: "March 30, 1986",
    birthPlace: "Camas, Seville, Spain",
    height: "1.84 m",
    foot: "Right",
    joinedRealMadrid: "2005",
    transferFee: "€27 Million",
    photo: "images/players/sergio-ramos.jpg",
    bio: "The greatest clutch defender in modern football history. Captain of Madrid's historic 3-peat. Author of the immortal 92:48 header in Lisbon that rescued La Décima.",
    quote: "The 93rd minute will always be part of my DNA.",
    madridDebut: {
      date: "September 10, 2005",
      competition: "La Liga",
      opponent: "Celta Vigo",
      venue: "Santiago Bernabéu",
      result: "2 - 3 (Defeat)",
      minutesPlayed: 45,
      contribution: "Came on at halftime replacing Francisco Pavón wearing Fernando Hierro's legendary No. 4 jersey.",
      jerseyWorn: "No. 4"
    },
    lineage: [
      {
        stage: "Andalusian Youth",
        club: "Sevilla FC",
        country: "Spain",
        years: "1996–2005",
        badgeColor: "#dc2626",
        fee: "Youth to Pro",
        appearances: 45,
        goals: 3,
        details: "Graduated from Sevilla's academy alongside Jesús Navas; signed by Florentino Pérez for €27M as a 19-year-old."
      },
      {
        stage: "Madrid Immortality",
        club: "Real Madrid",
        country: "Spain",
        years: "2005–2021",
        badgeColor: "#e5b324",
        fee: "€27 Million",
        appearances: 671,
        goals: 101,
        details: "16 seasons, 4 Champions Leagues, 5 La Liga titles, 101 goals (an astonishing tally for a defender)."
      },
      {
        stage: "Post-Madrid Career",
        club: "Paris Saint-Germain & Sevilla",
        country: "France & Spain",
        years: "2021–2024",
        badgeColor: "#1e3a8a",
        details: "Won two Ligue 1 titles at PSG before returning to Sevilla for an emotional homecoming season."
      }
    ],
    stats: {
      madridApps: 671,
      madridGoals: 101,
      madridAssists: 40,
      internationalCaps: 180,
      internationalGoals: 23,
      trophiesMadrid: [
        "4x UEFA Champions League (2014, 2016, 2017, 2018)",
        "5x La Liga (2007, 2008, 2012, 2017, 2020)",
        "2x Copa del Rey (2011, 2014)",
        "3x UEFA Super Cup (2014, 2016, 2017)",
        "4x FIFA Club World Cup (2014, 2016, 2017, 2018)",
        "4x Supercopa de España (2008, 2012, 2017, 2020)"
      ],
      careerTrophiesCount: 29
    },
    peakPerformances: [
      {
        title: "The 92:48 Miracle Header in Lisbon",
        match: "Real Madrid vs. Atlético Madrid",
        competition: "UEFA Champions League Final",
        date: "May 24, 2014",
        score: "4 - 1 (AET)",
        highlight: "With Madrid trailing 1-0 and Atlético seconds away from victory, Ramos met Modrić's corner in the 93rd minute with a thunderous header into the corner, delivering La Décima."
      },
      {
        title: "Two Headers in Munich (Allianz Arena)",
        match: "Bayern Munich vs. Real Madrid",
        competition: "UEFA Champions League SF",
        date: "Apr 29, 2014",
        score: "0 - 4",
        highlight: "Scored two bullet headers in the first 20 minutes against Pep Guardiola's Bayern Munich to stun Europe."
      }
    ],
    records: [
      "Only defender to score 100+ goals for Real Madrid in the modern era",
      "Most capped player in the history of the Spanish national team (180 caps)",
      "Only player to score in two UEFA Champions League finals as a defender (2014 & 2016)"
    ],
    facts: [
      "He has '93' tattooed on his skin in honor of the 92:48 header against Atlético Madrid in Lisbon.",
      "Florentino Pérez's first Spanish Galáctico signing in the summer of 2005.",
      "He owns an internationally recognized stud farm, Yeguada SR4, breeding championship Andalusian horses.",
      "He took and scored crucial Panenka penalties in high-pressure shootouts throughout his career."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Sergio_Ramos_2018.jpg/440px-Sergio_Ramos_2018.jpg",
        caption: "Sergio Ramos, the legendary Madrid captain"
      }
    ]
  },
  {
    id: "marcelo",
    name: "Marcelo",
    fullName: "Marcelo Vieira da Silva Júnior",
    number: 12,
    position: "Defender",
    category: "legend",
    status: "legend",
    statusLabel: "Eternal Captain & Legend",
    currentClub: "Fluminense (Brazil)",
    departureYear: "2022",
    departureDestination: "Olympiacos -> Fluminense",
    departureDetails: "Departed in 2022 after lifting the 14th Champions League as first club captain. He wept tears of joy at his farewell ceremony as Madrid's then-most decorated player.",
    nationality: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    birthDate: "May 12, 1988",
    birthPlace: "Rio de Janeiro, Brazil",
    height: "1.74 m",
    foot: "Left",
    joinedRealMadrid: "2007",
    transferFee: "€6.5 Million",
    photo: "images/players/marcelo.jpg",
    bio: "The heir to Roberto Carlos and the most skillful, joyful left-back in the history of the game. Marcelo's telepathic partnership with Cristiano Ronaldo on the left wing tormented European defenses for a decade.",
    quote: "I arrived with a suitcase of dreams and left with 25 titles. Real Madrid gave me everything.",
    madridDebut: {
      date: "January 7, 2007",
      competition: "La Liga",
      opponent: "Deportivo La Coruña",
      venue: "Riazor, A Coruña",
      result: "0 - 2 (Defeat)",
      minutesPlayed: 33,
      contribution: "Came on in the 57th minute replacing Míchel Salgado at age 18 under Fabio Capello.",
      jerseyWorn: "No. 12"
    },
    lineage: [
      {
        stage: "Futsal & Fluminense Youth",
        club: "Fluminense FC",
        country: "Brazil",
        years: "2002–2006",
        badgeColor: "#047857",
        fee: "Youth to Pro",
        appearances: 30,
        goals: 6,
        details: "Grandfather Pedro funded his bus tickets when the family considered pulling him out of football."
      },
      {
        stage: "16-Year Madrid Dynasty",
        club: "Real Madrid",
        country: "Spain",
        years: "2007–2022",
        badgeColor: "#e5b324",
        fee: "€6.5 Million",
        appearances: 546,
        goals: 38,
        details: "5 Champions Leagues, 6 La Liga titles, 25 total trophies. First foreign captain since 1904."
      },
      {
        stage: "Homecoming & Copa Libertadores",
        club: "Fluminense FC",
        country: "Brazil",
        years: "2023–Present",
        badgeColor: "#831843",
        details: "Returned to boyhood club Fluminense and won their first-ever Copa Libertadores in 2023."
      }
    ],
    stats: {
      madridApps: 546,
      madridGoals: 38,
      madridAssists: 103,
      internationalCaps: 58,
      internationalGoals: 6,
      trophiesMadrid: [
        "5x UEFA Champions League (2014, 2016, 2017, 2018, 2022)",
        "6x La Liga (2007, 2008, 2012, 2017, 2020, 2022)",
        "2x Copa del Rey (2011, 2014)",
        "3x UEFA Super Cup (2014, 2016, 2017)",
        "4x FIFA Club World Cup (2014, 2016, 2017, 2018)",
        "5x Supercopa de España (2008, 2012, 2017, 2020, 2022)"
      ],
      careerTrophiesCount: 28
    },
    peakPerformances: [
      {
        title: "2014 UCL Final Extra Time Solo Goal",
        match: "Real Madrid vs. Atlético Madrid",
        competition: "UEFA Champions League Final",
        date: "May 24, 2014",
        score: "4 - 1",
        highlight: "Came off the bench in Lisbon, and in extra time dribbled past Atlético's midfield to drill a low shot past Courtois to seal La Décima, bursting into tears of joy."
      },
      {
        title: "Bayern Munich 2017 Solo Run for Ronaldo",
        match: "Real Madrid vs. Bayern Munich",
        competition: "UEFA Champions League QF",
        date: "Apr 18, 2017",
        score: "4 - 2",
        highlight: "Slalomed through four Bayern Munich defenders in extra time, went 1-on-1 with Neuer, and unselfishly squared it for Cristiano to tap into an empty net."
      }
    ],
    records: [
      "Over 100 assists for Real Madrid from left-back (103 assists)",
      "First foreign captain to lift a major trophy for Real Madrid since 1904 (La Liga 2022)",
      "One of only a handful of players to win both the UEFA Champions League and Copa Libertadores"
    ],
    facts: [
      "His grandfather Pedro Sanches drove him everywhere in an old Volkswagen Beetle and paid for his food; Marcelo dedicated every trophy to his memory.",
      "His first touch was widely considered by teammates to be the best at the club, even rivaling Cristiano and Zidane.",
      "His son Enzo Alves plays as a striker in Real Madrid's academy and represents Spain's youth national teams.",
      "Never changed his shirt number 12 throughout his entire 16 years at Real Madrid."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Marcelo_2018.jpg/440px-Marcelo_2018.jpg",
        caption: "Marcelo with the ball at his feet"
      }
    ]
  },
  {
    id: "brahim",
    name: "Brahim Díaz",
    fullName: "Brahim Abdelkader Díaz",
    number: 21,
    position: "Forward",
    category: "forward",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "Morocco",
    countryCode: "MA",
    flag: "🇲🇦",
    birthDate: "August 3, 1999",
    birthPlace: "Málaga, Spain",
    height: "1.71 m",
    foot: "Both",
    joinedRealMadrid: "2019",
    transferFee: "€17 Million",
    photo: "images/players/brahim.jpg",
    bio: "The ambidextrous wizard. Equally adept with both left and right feet, Brahim is a tricky, agile dribbler who spent three seasons on loan honing his craft at AC Milan before returning to Madrid to win the 2024 Champions League.",
    quote: "Playing for Real Madrid was my dream since childhood. When I returned, I knew I was ready.",
    madridDebut: {
      date: "January 9, 2019",
      competition: "Copa del Rey",
      opponent: "CD Leganés",
      venue: "Santiago Bernabéu",
      result: "3 - 0 (Win)",
      minutesPlayed: 12,
      contribution: "Came on in the 78th minute replacing Vinícius Júnior just 3 days after signing from Manchester City.",
      jerseyWorn: "No. 21"
    },
    lineage: [
      {
        stage: "Youth Roots",
        club: "Málaga CF",
        country: "Spain",
        years: "2010–2013",
        badgeColor: "#0284c7",
        details: "Dazzled as a kid in Andalusia; coveted by top European scouts from age 12."
      },
      {
        stage: "Guardiola's City Academy",
        club: "Manchester City",
        country: "England",
        years: "2013–2019",
        badgeColor: "#0284c7",
        fee: "Youth to Pro",
        appearances: 15,
        goals: 2,
        details: "Made his senior debut under Pep Guardiola and won the 2017-18 Premier League medal."
      },
      {
        stage: "San Siro School",
        club: "AC Milan (Loan)",
        country: "Italy",
        years: "2020–2023",
        badgeColor: "#dc2626",
        fee: "3-Season Loan",
        appearances: 124,
        goals: 18,
        details: "Wore Milan's sacred No. 10 shirt, helped Milan win the 2021-22 Serie A Scudetto, and reached the UCL semi-finals."
      },
      {
        stage: "Triumphant Madrid Return",
        club: "Real Madrid",
        country: "Spain",
        years: "2023–Present",
        badgeColor: "#e5b324",
        fee: "Return from Loan",
        appearances: 60,
        goals: 14,
        details: "Scored 12 goals in 2023-24, winning La Liga and the Champions League, including a wonder solo goal in Leipzig."
      }
    ],
    stats: {
      madridApps: 66,
      madridGoals: 14,
      madridAssists: 12,
      internationalCaps: 8,
      internationalGoals: 4,
      trophiesMadrid: [
        "1x UEFA Champions League (2024)",
        "2x La Liga (2020, 2024)",
        "1x UEFA Super Cup (2024)",
        "2x Supercopa de España (2020, 2024)"
      ],
      careerTrophiesCount: 8
    },
    peakPerformances: [
      {
        title: "Solo Slalom vs. RB Leipzig",
        match: "RB Leipzig vs. Real Madrid",
        competition: "UEFA Champions League R16",
        date: "Feb 13, 2024",
        score: "0 - 1",
        highlight: "Holding off three defenders on the touchline, cut inside, shook off two challenges, and curled an unbelievable strike into the far corner with his left foot."
      },
      {
        title: "Supercopa Semi-Final Sprint Goal",
        match: "Real Madrid vs. Atlético Madrid",
        competition: "Supercopa de España SF",
        date: "Jan 10, 2024",
        score: "5 - 3 (AET)",
        highlight: "Outsprinted Jan Oblak on a footrace towards an empty net in the 122nd minute to seal a thrilling 5-3 derby victory in Riyadh."
      }
    ],
    records: [
      "One of the few players in history to win the Premier League (Man City), Serie A (AC Milan), and La Liga (Real Madrid)",
      "Perfect two-footedness: statistics show a 50/50 balance between left-foot and right-foot touches"
    ],
    facts: [
      "Even coaches and teammates cannot tell which is his natural stronger foot; when asked, Brahim says: 'I prefer shooting with my right and dribbling with my left!'",
      "Eligible for both Spain and Morocco through his grandmother, he committed to Morocco in 2024 to enormous celebration in Casablanca.",
      "His celebration of spreading his arms mirrors Jude Bellingham, and the two share a close brotherly bond."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Brahim_D%C3%ADaz_2024.jpg/440px-Brahim_D%C3%ADaz_2024.jpg",
        caption: "Brahim Díaz celebrating a goal"
      }
    ]
  },
  {
    id: "militao",
    name: "Éder Militão",
    fullName: "Éder Gabriel Militão",
    number: 3,
    position: "Defender",
    category: "defender",
    status: "active",
    statusLabel: "Current Squad",
    currentClub: "Real Madrid",
    nationality: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    birthDate: "January 18, 1998",
    birthPlace: "Sertãozinho, São Paulo, Brazil",
    height: "1.86 m",
    foot: "Right",
    joinedRealMadrid: "2019",
    transferFee: "€50 Million",
    photo: "images/players/militao.jpg",
    bio: "The Brazilian aerial master and defensive linchpin. Rapid in recovery sprints, physically dominant, and fearless in the air. Overcame an ACL tear in 2023 to return and lift his second Champions League trophy in 2024.",
    quote: "Defending this badge is an honor. We give our bodies for Real Madrid.",
    madridDebut: {
      date: "September 14, 2019",
      competition: "La Liga",
      opponent: "Levante UD",
      venue: "Santiago Bernabéu",
      result: "3 - 2 (Win)",
      minutesPlayed: 30,
      contribution: "Came on in the 60th minute replacing Sergio Ramos to make his official debut.",
      jerseyWorn: "No. 3"
    },
    lineage: [
      {
        stage: "São Paulo Youth",
        club: "São Paulo FC",
        country: "Brazil",
        years: "2010–2018",
        badgeColor: "#dc2626",
        fee: "Youth to Pro",
        appearances: 57,
        goals: 4,
        details: "Played as both a center-back and right-back; recognized as Brazil's top young defensive prospect."
      },
      {
        stage: "European Breakthrough",
        club: "FC Porto",
        country: "Portugal",
        years: "2018–2019",
        badgeColor: "#1d4ed8",
        fee: "€7 Million",
        appearances: 47,
        goals: 5,
        details: "Named Primeira Liga Defender of the Month five months in a row. Real Madrid signed him after just one season for €50M."
      },
      {
        stage: "Madrid Defensive Wall",
        club: "Real Madrid",
        country: "Spain",
        years: "2019–Present",
        badgeColor: "#e5b324",
        fee: "€50 Million",
        appearances: 160,
        goals: 11,
        details: "Stepped up to replace Ramos and Varane in 2021; anchored the backline to win 2 Champions Leagues."
      }
    ],
    stats: {
      madridApps: 160,
      madridGoals: 11,
      madridAssists: 5,
      internationalCaps: 35,
      internationalGoals: 2,
      trophiesMadrid: [
        "2x UEFA Champions League (2022, 2024)",
        "3x La Liga (2020, 2022, 2024)",
        "1x Copa del Rey (2023)",
        "2x UEFA Super Cup (2022, 2024)",
        "1x FIFA Club World Cup (2022)",
        "3x Supercopa de España (2020, 2022, 2024)"
      ],
      careerTrophiesCount: 13
    },
    peakPerformances: [
      {
        title: "Anfield 5-2 Comeback Header",
        match: "Liverpool vs. Real Madrid",
        competition: "UEFA Champions League R16",
        date: "Feb 21, 2023",
        score: "2 - 5",
        highlight: "Powered in Luka Modrić's free-kick with an emphatic diving header early in the second half to put Madrid 3-2 ahead at Anfield."
      },
      {
        title: "Shutout vs. Liverpool in Paris 2022 Final",
        match: "Real Madrid vs. Liverpool",
        competition: "UEFA Champions League Final",
        date: "May 28, 2022",
        score: "1 - 0",
        highlight: "Formed an impassable wall with David Alaba and Courtois, making 4 crucial clearances in the box to win his first UCL."
      }
    ],
    records: [
      "Named in La Liga Team of the Season (2021–22, 2022–23)",
      "Recorded 73% aerial duel win rate across his Champions League career"
    ],
    facts: [
      "During his official Madrid unveiling in 2019, he felt so dizzy and overwhelmed from dehydration and emotion that the press conference had to be paused.",
      "His father Valdo was a professional footballer in Brazil who taught Éder the fundamentals of defending.",
      "Suffered a torn ACL on the first matchday of the 2023-24 season, underwent rigorous rehab, and returned in time to play in the Champions League final celebration at Wembley."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Eder_Militao_2021.jpg/440px-Eder_Militao_2021.jpg",
        caption: "Éder Militão in action"
      }
    ]
  },
  {
    id: "bale",
    name: "Gareth Bale",
    fullName: "Gareth Frank Bale",
    number: 11,
    position: "Forward",
    category: "legend",
    status: "legend",
    statusLabel: "Eternal Legend (5x UCL Winner)",
    currentClub: "Retired (2023)",
    departureYear: "2022",
    departureDestination: "Los Angeles FC -> Retired",
    departureDetails: "Left Madrid in summer 2022 after 9 years and 5 Champions Leagues. Scored the greatest goal in Champions League final history (overhead kick vs Liverpool in Kyiv).",
    nationality: "Wales",
    countryCode: "GB",
    flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    birthDate: "July 16, 1989",
    birthPlace: "Cardiff, Wales",
    height: "1.85 m",
    foot: "Left",
    joinedRealMadrid: "2013",
    transferFee: "€101 Million (World Record at the time)",
    photo: "images/players/bale.jpg",
    bio: "The Welsh Dragon. Real Madrid's ultimate big-game final specialist. Author of the famous Copa del Rey sprint around Bartra in 2014, the header to put Madrid ahead in La Décima, and the mind-blowing overhead bicycle kick in the 2018 Kyiv final.",
    quote: "Wales. Golf. Madrid. In that order... but when finals came, nobody gave more for the white shirt.",
    madridDebut: {
      date: "September 14, 2013",
      competition: "La Liga",
      opponent: "Villarreal CF",
      venue: "El Madrigal, Villarreal",
      result: "2 - 2 (Draw)",
      minutesPlayed: 62,
      contribution: "Started and scored on his debut in the 38th minute, sliding in to turn Carvajal's cross into the net.",
      jerseyWorn: "No. 11"
    },
    lineage: [
      {
        stage: "Southampton Prodigy",
        club: "Southampton FC",
        country: "England",
        years: "1999–2007",
        badgeColor: "#dc2626",
        details: "Graduated as a prodigiously gifted left-back with a venomous free-kick."
      },
      {
        stage: "Spurs Sensation",
        club: "Tottenham Hotspur",
        country: "England",
        years: "2007–2013",
        badgeColor: "#0f172a",
        fee: "€14.7 Million",
        appearances: 203,
        goals: 55,
        details: "Voted PFA Player of the Year twice; destroyed Inter Milan at the San Siro in 2010."
      },
      {
        stage: "Madrid 5x UCL Dynasty (BBC Trio)",
        club: "Real Madrid",
        country: "Spain",
        years: "2013–2022",
        badgeColor: "#e5b324",
        fee: "€101 Million (World Record)",
        appearances: 258,
        goals: 106,
        details: "Formed the 'BBC' attacking trio with Benzema and Cristiano; scored in 3 different Champions League finals."
      },
      {
        stage: "Departure & Retirement",
        club: "Los Angeles FC",
        country: "USA",
        years: "2022–2023",
        badgeColor: "#ca8a04",
        fee: "Free Transfer",
        details: "Scored a 128th-minute header to win the 2022 MLS Cup before retiring."
      }
    ],
    stats: {
      madridApps: 258,
      madridGoals: 106,
      madridAssists: 67,
      internationalCaps: 111,
      internationalGoals: 41,
      trophiesMadrid: [
        "5x UEFA Champions League (2014, 2016, 2017, 2018, 2022)",
        "3x La Liga (2017, 2020, 2022)",
        "1x Copa del Rey (2014)",
        "3x UEFA Super Cup (2014, 2016, 2017)",
        "4x FIFA Club World Cup (2014, 2016, 2017, 2018)",
        "3x Supercopa de España (2017, 2020, 2022)"
      ],
      careerTrophiesCount: 22
    },
    peakPerformances: [
      {
        title: "The Overhead Kick in Kyiv (2018 Final)",
        match: "Real Madrid vs. Liverpool",
        competition: "UEFA Champions League Final",
        date: "May 26, 2018",
        score: "3 - 1",
        highlight: "Came off the bench in the 61st minute and, two minutes later, executed a jaw-dropping airborne bicycle kick into Karius's top corner, followed by a 35-yard screamer to win Man of the Match."
      },
      {
        title: "The Sprint Off the Pitch vs. Bartra (2014 Copa Final)",
        match: "Barcelona vs. Real Madrid",
        competition: "Copa del Rey Final",
        date: "Apr 16, 2014",
        score: "1 - 2",
        highlight: "In the 85th minute, knocked the ball past Marc Bartra, ran completely off the Mestalla touchline onto the coaching track, beat him with raw sprint speed (34.8 km/h), and slotted through Pinto's legs."
      },
      {
        title: "La Décima Extra Time Header in Lisbon",
        match: "Real Madrid vs. Atlético Madrid",
        competition: "UEFA Champions League Final",
        date: "May 24, 2014",
        score: "4 - 1",
        highlight: "Followed up Di María's saved shot to head the decisive 110th-minute go-ahead goal."
      }
    ],
    records: [
      "Only substitute to score two goals in a UEFA Champions League final (Kyiv 2018)",
      "First British player to win 5 UEFA Champions League titles",
      "All-time top goalscorer for Wales (41 goals)"
    ],
    facts: [
      "At school in Cardiff, his PE teacher Gwyn Morris made a special rule that Gareth could only touch the ball with his right foot and with one touch because he was too dominant.",
      "His sprint against Barcelona in the 2014 Copa final covered 59.1 meters in 7.04 seconds, reaching a peak speed of 34.8 km/h while dribbling.",
      "Scored more goals for Real Madrid (106) than Brazilian Ronaldo (104) and Zinedine Zidane (49)."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Gareth_Bale_2018.jpg/440px-Gareth_Bale_2018.jpg",
        caption: "Gareth Bale celebrating"
      }
    ]
  },
  {
    id: "zidane",
    name: "Zinedine Zidane",
    fullName: "Zinedine Yazid Zidane",
    number: 5,
    position: "Midfielder",
    category: "legend",
    status: "legend",
    statusLabel: "Eternal Club Icon & 3-Peat Coach",
    currentClub: "Madrid Legend & Free Agent Coach",
    departureYear: "2006 (Player) / 2021 (Coach)",
    departureDestination: "Retired at Real Madrid",
    departureDetails: "Retired as a player in 2006 wearing the Real Madrid jersey. Returned as manager to achieve the impossible: 3 consecutive UEFA Champions League titles (2016, 2017, 2018).",
    nationality: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    birthDate: "June 23, 1972",
    birthPlace: "Marseille, France",
    height: "1.85 m",
    foot: "Both",
    joinedRealMadrid: "2001",
    transferFee: "€77.5 Million (World Record at the time)",
    photo: "images/players/zidane.jpg",
    bio: "Zizou. The epitome of football artistry, elegance, and Madridista greatness. Winner of the 2002 Champions League with the greatest volley in European history in Glasgow. As manager, led Madrid to the historic Champions League three-peat.",
    quote: "Real Madrid is the pinnacle. Nothing is bigger than this club.",
    madridDebut: {
      date: "August 25, 2001",
      competition: "La Liga",
      opponent: "Valencia CF",
      venue: "Mestalla, Valencia",
      result: "0 - 1 (Defeat)",
      minutesPlayed: 90,
      contribution: "Started as the record €77.5M Galáctico signing wearing the famous No. 5 jersey.",
      jerseyWorn: "No. 5"
    },
    lineage: [
      {
        stage: "Marseille & Cannes",
        club: "AS Cannes",
        country: "France",
        years: "1989–1992",
        badgeColor: "#dc2626",
        details: "Discovered on the concrete plazas of La Castellane, Marseille."
      },
      {
        stage: "Bordeaux Sensation",
        club: "Girondins de Bordeaux",
        country: "France",
        years: "1992–1996",
        badgeColor: "#1e3a8a",
        fee: "€700k",
        appearances: 179,
        goals: 39,
        details: "Won the 1995 Intertoto Cup and reached the 1996 UEFA Cup final."
      },
      {
        stage: "Ballon d'Or & Serie A",
        club: "Juventus",
        country: "Italy",
        years: "1996–2001",
        badgeColor: "#0f172a",
        fee: "€3.5 Million",
        appearances: 212,
        goals: 31,
        details: "Won 2 Serie A titles and the 1998 Ballon d'Or after winning the 1998 World Cup for France."
      },
      {
        stage: "The Ninth (La Novena) & Legend",
        club: "Real Madrid",
        country: "Spain",
        years: "2001–2006",
        badgeColor: "#e5b324",
        fee: "€77.5 Million (World Record)",
        appearances: 227,
        goals: 49,
        details: "Volley in Glasgow won the 2002 Champions League. Retired in 2006 directly as a Real Madrid player."
      },
      {
        stage: "Management: The 3-Peat Dynasty",
        club: "Real Madrid (Manager)",
        country: "Spain",
        years: "2016–2018 & 2019–2021",
        badgeColor: "#e5b324",
        details: "Only manager in football history to win 3 consecutive UEFA Champions League titles (2016, 2017, 2018)."
      }
    ],
    stats: {
      madridApps: 227,
      madridGoals: 49,
      madridAssists: 68,
      internationalCaps: 108,
      internationalGoals: 31,
      trophiesMadrid: [
        "1x UEFA Champions League (2002 as player)",
        "3x UEFA Champions League (2016, 2017, 2018 as manager)",
        "3x La Liga (2003 as player, 2017, 2020 as manager)",
        "2x UEFA Super Cup (2002 as player, 2016, 2017 as manager)",
        "3x FIFA Club World Cup (2002 as player, 2016, 2017 as manager)"
      ],
      careerTrophiesCount: 26
    },
    peakPerformances: [
      {
        title: "The Hampden Park Volley in Glasgow (2002 Final)",
        match: "Real Madrid vs. Bayer Leverkusen",
        competition: "UEFA Champions League Final",
        date: "May 15, 2002",
        score: "2 - 1",
        highlight: "Roberto Carlos looped a high, swirling cross from the left wing; Zidane pirouetted and met the ball dropping from the sky with a left-footed volley into the top corner. Voted the greatest goal in Champions League history."
      },
      {
        title: "Bernabéu Farewell Tears (2006)",
        match: "Real Madrid vs. Villarreal",
        competition: "La Liga",
        date: "May 7, 2006",
        score: "3 - 3",
        highlight: "Scored a trademark header in his final club match as 80,000 fans held up cards reading 'Gracias Zidane'."
      }
    ],
    records: [
      "Only coach in UEFA Champions League history to win 3 consecutive titles (2016, 2017, 2018)",
      "Goal in 2002 voted UEFA's all-time greatest Champions League goal",
      "FIFA World Player of the Year three times (1998, 2000, 2003)"
    ],
    facts: [
      "Florentino Pérez famously initiated Zidane's transfer at a gala dinner in Monaco by writing on a napkin in French: 'Do you want to play for Real Madrid?' Zidane wrote back: 'Yes!'",
      "He chose the number 5 jersey because club legend Alfredo Di Stéfano wore No. 9 and Fernando Hierro had No. 4; Zidane made No. 5 iconic for midfielders, which Jude Bellingham now wears in his tribute.",
      "Grew up in La Castellane, a tough housing estate in Marseille, playing barefoot on concrete with Algerian immigrant friends.",
      "Coached both the Real Madrid Castilla reserve team and first team."
    ],
    gallery: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg/440px-Zinedine_Zidane_by_Tasnim_03.jpg",
        caption: "Zinedine Zidane, Madrid legend and 3-peat coach"
      }
    ]
  }
];

// Helper lookup methods
const RM_NATIONS = [...new Set(RM_PLAYERS.map(p => p.nationality))].sort();
const RM_POSITIONS = ["Forward", "Midfielder", "Defender", "Goalkeeper"];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RM_PLAYERS, RM_NATIONS, RM_POSITIONS };
}

