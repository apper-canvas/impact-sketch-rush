import gameData from '../mockData/games.json';
import { playerService } from '../index.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GameService {
  constructor() {
    this.games = [...gameData];
    this.currentGameId = null;
  }

  async createGame(hostPlayerId) {
    await delay(300);
    const newGame = {
      Id: this.games.length > 0 ? Math.max(...this.games.map(g => g.Id)) + 1 : 1,
      hostId: hostPlayerId,
      players: [hostPlayerId],
      currentRound: 1,
      currentDrawer: hostPlayerId,
      currentWord: null,
      timeRemaining: 60,
      gameState: 'lobby',
      maxPlayers: 10,
      guesses: [],
      scores: {}
    };
    
    this.games.push(newGame);
    this.currentGameId = newGame.Id;
    return { ...newGame };
  }

  async joinGame(gameId, playerId) {
    await delay(200);
    const game = this.games.find(g => g.Id === parseInt(gameId, 10));
    if (!game) throw new Error('Game not found');
    if (game.players.length >= game.maxPlayers) throw new Error('Game is full');
    if (game.gameState !== 'lobby') throw new Error('Game already started');
    
    if (!game.players.includes(playerId)) {
      game.players.push(playerId);
      game.scores[playerId] = 0;
    }
    
    return { ...game };
  }

  async startGame(gameId) {
    await delay(300);
    const game = this.games.find(g => g.Id === parseInt(gameId, 10));
    if (!game) throw new Error('Game not found');
    if (game.players.length < 2) throw new Error('Need at least 2 players');
    
    game.gameState = 'playing';
    game.currentRound = 1;
    game.currentDrawer = game.players[0];
    game.timeRemaining = 60;
    
    return { ...game };
  }

  async getCurrentGame() {
    await delay(100);
    if (!this.currentGameId) return null;
    const game = this.games.find(g => g.Id === this.currentGameId);
    return game ? { ...game } : null;
  }

  async updateGameState(gameId, updates) {
    await delay(100);
    const game = this.games.find(g => g.Id === parseInt(gameId, 10));
    if (!game) throw new Error('Game not found');
    
    Object.assign(game, updates);
    return { ...game };
  }

  async submitGuess(gameId, playerId, guess) {
    await delay(150);
    const game = this.games.find(g => g.Id === parseInt(gameId, 10));
    if (!game) throw new Error('Game not found');
    
    const isCorrect = game.currentWord && 
      guess.toLowerCase().trim() === game.currentWord.toLowerCase();
    
    const guessObj = {
      Id: game.guesses.length + 1,
      playerId,
      text: guess,
      timestamp: Date.now(),
      isCorrect
    };
    
    game.guesses.push(guessObj);
    
    if (isCorrect && game.gameState === 'playing') {
      // Calculate points based on time remaining (1-10 points)
      const points = Math.max(1, Math.ceil(game.timeRemaining / 6));
      game.scores[playerId] += points;
    }
    
    return { guess: guessObj, isCorrect, game: { ...game } };
  }

  async nextTurn(gameId) {
    await delay(200);
    const game = this.games.find(g => g.Id === parseInt(gameId, 10));
    if (!game) throw new Error('Game not found');
    
    const currentIndex = game.players.indexOf(game.currentDrawer);
    const nextIndex = (currentIndex + 1) % game.players.length;
    
    // If we've completed a full round
    if (nextIndex === 0) {
      game.currentRound += 1;
      if (game.currentRound > 3) {
        game.gameState = 'finished';
        return { ...game };
      }
    }
    
    game.currentDrawer = game.players[nextIndex];
    game.timeRemaining = 60;
    game.currentWord = null;
    game.guesses = [];
    
    return { ...game };
  }

  async getLeaderboard(gameId) {
    await delay(200);
    const game = this.games.find(g => g.Id === parseInt(gameId, 10));
    if (!game) throw new Error('Game not found');
    
    const leaderboard = game.players.map(playerId => ({
      playerId,
      score: game.scores[playerId] || 0
    })).sort((a, b) => b.score - a.score);
    
    return leaderboard;
  }
}

export default new GameService();