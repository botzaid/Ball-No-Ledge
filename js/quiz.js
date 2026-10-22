// Flashcard deck for the Training ground, plus career-route helpers shared with the game.

const LEARNED_KEY = 'rm_learned_players';

function shuffled(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
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
}

window.RM_MemoryTrainer = RM_MemoryTrainer;
window.routeToMadrid = routeToMadrid;
window.signedFrom = signedFrom;
