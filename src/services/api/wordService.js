import wordData from '../mockData/words.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WordService {
  constructor() {
    this.words = [...wordData];
  }

  async getRandomWord(category = 'all', difficulty = 'medium') {
    await delay(200);
    
    let filteredWords = this.words;
    
    if (category !== 'all') {
      filteredWords = filteredWords.filter(w => w.category === category);
    }
    
    if (difficulty !== 'all') {
      filteredWords = filteredWords.filter(w => w.difficulty === difficulty);
    }
    
    if (filteredWords.length === 0) {
      filteredWords = this.words.filter(w => w.difficulty === 'easy');
    }
    
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return { ...filteredWords[randomIndex] };
  }

  async getCategories() {
    await delay(100);
    const categories = [...new Set(this.words.map(w => w.category))];
    return categories;
  }

  async getByDifficulty(difficulty) {
    await delay(150);
    return this.words
      .filter(w => w.difficulty === difficulty)
      .map(w => ({ ...w }));
  }
}

export default new WordService();