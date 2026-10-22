// Madridista Memory Trainer & Lineage Quiz Engine
// Designed specifically to help new fans memorize player names, countries, shirt numbers, and career origins.

class RM_MemoryTrainer {
  constructor() {
    this.currentMode = 'flashcards'; // 'flashcards' | 'quiz'
    this.quizType = 'country'; // 'country' | 'lineage' | 'number'
    this.currentCardIndex = 0;
    this.shuffledPlayers = [...RM_PLAYERS];
    this.isCardFlipped = false;
    this.learnedIds = new Set(JSON.parse(localStorage.getItem('rm_learned_players') || '[]'));

    // Quiz state
    this.quizScore = 0;
    this.quizTotal = 0;
    this.quizStreak = 0;
    this.currentQuestion = null;

    this.init();
  }

  init() {
    this.shuffleDeck();
  }

  shuffleDeck() {
    for (let i = this.shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledPlayers[i], this.shuffledPlayers[j]] = [this.shuffledPlayers[j], this.shuffledPlayers[i]];
    }
    this.currentCardIndex = 0;
    this.isCardFlipped = false;
  }

  getCurrentPlayer() {
    return this.shuffledPlayers[this.currentCardIndex] || this.shuffledPlayers[0];
  }

  nextCard() {
    this.currentCardIndex = (this.currentCardIndex + 1) % this.shuffledPlayers.length;
    this.isCardFlipped = false;
    return this.getCurrentPlayer();
  }

  prevCard() {
    this.currentCardIndex = (this.currentCardIndex - 1 + this.shuffledPlayers.length) % this.shuffledPlayers.length;
    this.isCardFlipped = false;
    return this.getCurrentPlayer();
  }

  toggleFlip() {
    this.isCardFlipped = !this.isCardFlipped;
    return this.isCardFlipped;
  }

  toggleLearned(playerId) {
    if (this.learnedIds.has(playerId)) {
      this.learnedIds.delete(playerId);
    } else {
      this.learnedIds.add(playerId);
    }
    localStorage.setItem('rm_learned_players', JSON.stringify([...this.learnedIds]));
    return this.learnedIds.has(playerId);
  }

  isLearned(playerId) {
    return this.learnedIds.has(playerId);
  }

  // Quiz generation
  generateQuestion(type = this.quizType) {
    this.quizType = type;
    const targetPlayer = RM_PLAYERS[Math.floor(Math.random() * RM_PLAYERS.length)];
    const otherPlayers = RM_PLAYERS.filter(p => p.id !== targetPlayer.id);

    // Shuffle distractors
    const distractors = otherPlayers.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [targetPlayer, ...distractors].sort(() => 0.5 - Math.random());

    if (type === 'country') {
      const otherNations = [...new Set(RM_PLAYERS.map(p => p.nationality))]
        .filter(n => n !== targetPlayer.nationality)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const nationOptions = [targetPlayer.nationality, ...otherNations].sort(() => 0.5 - Math.random());

      this.currentQuestion = {
        type: 'country',
        player: targetPlayer,
        question: `Which country does ${targetPlayer.name} play for?`,
        prompt: `Player #${targetPlayer.number} • ${targetPlayer.position}`,
        correctAnswer: targetPlayer.nationality,
        options: nationOptions.map(nat => {
          const sample = RM_PLAYERS.find(p => p.nationality === nat);
          return {
            text: `${sample?.flag || '🌐'} ${nat}`,
            value: nat
          };
        }),
        explanation: `${targetPlayer.name} represents ${targetPlayer.flag} ${targetPlayer.nationality}. He was born in ${targetPlayer.birthPlace}.`
      };
    } else if (type === 'lineage') {
      const lineageClubs = targetPlayer.lineage
        .map(l => l.club)
        .join(' ➔ ');

      this.currentQuestion = {
        type: 'lineage',
        player: targetPlayer,
        question: `Which player has this career lineage?`,
        prompt: `Lineage Path: ${lineageClubs}`,
        correctAnswer: targetPlayer.id,
        options: options.map(p => ({
          text: `${p.flag} ${p.name} (#${p.number})`,
          value: p.id
        })),
        explanation: `${targetPlayer.name}'s journey: ${lineageClubs}. He joined Madrid in ${targetPlayer.joinedRealMadrid} for ${targetPlayer.transferFee}.`
      };
    } else if (type === 'number') {
      this.currentQuestion = {
        type: 'number',
        player: targetPlayer,
        question: `What shirt number does ${targetPlayer.name} wear?`,
        prompt: `Position: ${targetPlayer.position} • ${targetPlayer.flag} ${targetPlayer.nationality}`,
        correctAnswer: targetPlayer.number,
        options: [
          targetPlayer.number,
          ...RM_PLAYERS.filter(p => p.number !== targetPlayer.number).map(p => p.number)
            .sort(() => 0.5 - Math.random()).slice(0, 3)
        ].sort((a, b) => a - b).map(num => ({
          text: `No. ${num}`,
          value: num
        })),
        explanation: `${targetPlayer.name} wears the iconic No. ${targetPlayer.number} for Real Madrid.`
      };
    }

    return this.currentQuestion;
  }

  submitAnswer(selectedVal) {
    if (!this.currentQuestion) return null;
    const isCorrect = (String(selectedVal) === String(this.currentQuestion.correctAnswer));

    this.quizTotal++;
    if (isCorrect) {
      this.quizScore++;
      this.quizStreak++;
      this.learnedIds.add(this.currentQuestion.player.id);
      localStorage.setItem('rm_learned_players', JSON.stringify([...this.learnedIds]));
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

  resetStats() {
    this.quizScore = 0;
    this.quizTotal = 0;
    this.quizStreak = 0;
  }
}

window.RM_MemoryTrainer = RM_MemoryTrainer;
