import playerData from '../mockData/players.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PlayerService {
  constructor() {
    this.players = [...playerData];
    this.currentPlayer = null;
  }

  async createPlayer(name) {
    await delay(200);
    const avatars = [
      '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎹', '🎤', '🎧',
      '🏆', '🏅', '🎖️', '🏵️', '🌟', '⭐', '✨', '💫', '🔥', '💎'
    ];
    
    const player = {
      Id: this.players.length > 0 ? Math.max(...this.players.map(p => p.Id)) + 1 : 1,
      name: name || `Player ${this.players.length + 1}`,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      score: 0,
      isDrawing: false,
      hasGuessed: false
    };
    
    this.players.push(player);
    this.currentPlayer = player;
    return { ...player };
  }

  async getCurrentPlayer() {
    await delay(50);
    return this.currentPlayer ? { ...this.currentPlayer } : null;
  }

  async getById(id) {
    await delay(100);
    const player = this.players.find(p => p.Id === parseInt(id, 10));
    return player ? { ...player } : null;
  }

  async getByIds(ids) {
    await delay(150);
    return this.players
      .filter(p => ids.includes(p.Id))
      .map(p => ({ ...p }));
  }

  async updatePlayer(id, updates) {
    await delay(100);
    const player = this.players.find(p => p.Id === parseInt(id, 10));
    if (!player) throw new Error('Player not found');
    
    Object.assign(player, updates);
    if (this.currentPlayer && this.currentPlayer.Id === player.Id) {
      this.currentPlayer = { ...player };
    }
    
    return { ...player };
  }
}

export default new PlayerService();