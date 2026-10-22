// Flashcards and quiz questions for learning the squad.

const LEARNED_KEY = 'rm_learned_players';

function shuffled(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Clubs a player went through before Real Madrid signed them (academy and
// reserve sides of Madrid itself are skipped).
function routeToMadrid(player) {
  const arrival = player.lineage.findIndex(l => l.club === 'Real Madrid');
  const before = arrival === -1 ? player.lineage : player.lineage.slice(0, arrival);
  const clubs = before.filter(l => !/Real Madrid|Castilla|La Fábrica/.test(l.club));
  // Generated careers list youth clubs separately; skip them when there's a senior career
  const senior = clubs.filter(l => l.stage !== 'Youth');
  return senior.length ? senior : clubs;
}

function signedFrom(player) {
  if (player.route && player.route.from !== undefined) return player.route.from ? { club: player.route.from } : null;
  const route = routeToMadrid(player);
  return route.length ? route[route.length - 1] : null;
}

function loadLearned() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LEARNED_KEY) || '[]'));
  } catch (e) {
    return new Set();
  }
}

function saveLearned(ids) {
  try {
    localStorage.setItem(LEARNED_KEY, JSON.stringify([...ids]));
  } catch (e) {
    // Private browsing or storage disabled: progress just won't persist.
  }
}

class RM_MemoryTrainer {
  constructor(players) {
    this.allPlayers = players;
    this.deckName = 'active';
    this.deck = [];
    this.currentCardIndex = 0;
    this.isCardFlipped = false;
    this.learnedIds = loadLearned();

    this.quizType = 'country';
    this.quizScore = 0;
    this.quizTotal = 0;
    this.quizStreak = 0;
    this.currentQuestion = null;

    this.setDeck('active');
  }

  setDeck(name) {
    this.deckName = name;
    const pool = name === 'active' ? this.allPlayers.filter(p => p.status === 'active') : this.allPlayers;
    this.deck = shuffled(pool);
    this.currentCardIndex = 0;
    this.isCardFlipped = false;
  }

  shuffleDeck() {
    this.deck = shuffled(this.deck);
    this.currentCardIndex = 0;
    this.isCardFlipped = false;
  }

  getCurrentPlayer() {
    return this.deck[this.currentCardIndex];
  }

  nextCard() {
    this.currentCardIndex = (this.currentCardIndex + 1) % this.deck.length;
    this.isCardFlipped = false;
  }

  prevCard() {
    this.currentCardIndex = (this.currentCardIndex - 1 + this.deck.length) % this.deck.length;
    this.isCardFlipped = false;
  }

  toggleFlip() {
    this.isCardFlipped = !this.isCardFlipped;
    return this.isCardFlipped;
  }

  toggleLearned(playerId) {
    if (this.learnedIds.has(playerId)) this.learnedIds.delete(playerId);
    else this.learnedIds.add(playerId);
    saveLearned(this.learnedIds);
    return this.learnedIds.has(playerId);
  }

  isLearned(playerId) {
    return this.learnedIds.has(playerId);
  }

  learnedInDeck() {
    return this.deck.filter(p => this.learnedIds.has(p.id)).length;
  }

  generateQuestion(type = this.quizType) {
    this.quizType = type;
    const players = this.allPlayers;

    if (type === 'country') {
      const target = pickRandom(players);
      const others = shuffled([...new Set(players.map(p => p.nationality))].filter(n => n !== target.nationality)).slice(0, 3);
      this.currentQuestion = {
        type,
        player: target,
        showPhoto: true,
        question: `Who does ${target.name} play for internationally?`,
        prompt: `${target.position}${target.status === 'active' ? `, No. ${target.number}` : `, at Madrid ${target.madridYears || ''}`}`,
        correctAnswer: target.nationality,
        options: shuffled([target.nationality, ...others]).map(n => ({ text: n, value: n })),
        explanation: `${target.name} plays for ${target.nationality}.${target.birthPlace ? ` Born in ${target.birthPlace}.` : ''}`
      };
    } else if (type === 'lineage') {
      // Only players with at least one club before Madrid make a fair question.
      const pool = players.filter(p => routeToMadrid(p).length > 0);
      const target = pickRandom(pool);
      const path = routeToMadrid(target).map(l => l.club).join(' → ');
      const others = shuffled(pool.filter(p => p.id !== target.id)).slice(0, 3);
      this.currentQuestion = {
        type,
        player: target,
        showPhoto: false, // the photo would give the answer away
        question: 'Whose route to Madrid is this?',
        prompt: `${path} → Real Madrid`,
        correctAnswer: target.id,
        options: shuffled([target, ...others]).map(p => ({ text: p.name, value: p.id })),
        explanation: `That's ${target.name}, who joined in ${target.joinedRealMadrid}${target.transferFee ? ` (${target.transferFee})` : ''}.`
      };
    } else if (type === 'number') {
      // Shirt numbers only mean something for the current squad, where they're unique.
      const squad = players.filter(p => p.status === 'active');
      const target = pickRandom(squad);
      const otherNumbers = shuffled([...new Set(squad.map(p => p.number))].filter(n => n !== target.number)).slice(0, 3);
      this.currentQuestion = {
        type,
        player: target,
        showPhoto: true,
        question: `What number does ${target.name} wear?`,
        prompt: `${target.position}, ${target.nationality}`,
        correctAnswer: target.number,
        options: [target.number, ...otherNumbers].sort((a, b) => a - b).map(n => ({ text: `No. ${n}`, value: n })),
        explanation: `${target.name} wears No. ${target.number} in ${RM_SQUAD_SEASON}.`
      };
    }

    return this.currentQuestion;
  }

  submitAnswer(selectedVal) {
    if (!this.currentQuestion || this.currentQuestion.answered) return null;
    this.currentQuestion.answered = true;
    const isCorrect = String(selectedVal) === String(this.currentQuestion.correctAnswer);

    this.quizTotal++;
    if (isCorrect) {
      this.quizScore++;
      this.quizStreak++;
    } else {
      this.quizStreak = 0;
    }

    return {
      isCorrect,
      correctAnswer: this.currentQuestion.correctAnswer,
      explanation: this.currentQuestion.explanation,
      score: this.quizScore,
      total: this.quizTotal,
      streak: this.quizStreak
    };
  }
}

window.RM_MemoryTrainer = RM_MemoryTrainer;
window.routeToMadrid = routeToMadrid;
window.signedFrom = signedFrom;
