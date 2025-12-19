// Games Manager - Handles real-time sync with Firebase

class GamesManager {
  constructor() {
    this.games = [];
    this.trending = [];
    this.listeners = [];
  }

  // Initialize and start listening to Firebase
  init() {
    // Listen for all games changes
    gamesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      this.games = data ? Object.values(data) : [];
      // Compute trending dynamically from all games
      this.trending = this.games
        .filter(game => game.trending)
        .sort((a, b) => (b.plays || 0) - (a.plays || 0));
      this.notifyListeners();
    });
  }

  // Add listener for when data changes
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.games, this.trending));
  }

  // Get all games
  getAllGames() {
    return this.games;
  }

  // Get trending games
  getTrendingGames() {
    return this.trending;
  }

  // Add a new game
  async addGame(game) {
    const newGameRef = gamesRef.push();
    const gameData = {
      id: newGameRef.key,
      name: game.name,
      path: game.path,
      thumb: game.thumb,
      section: game.section || 'all',
      trending: game.trending || false,
      plays: Number(game.plays) || 0,
      createdAt: Date.now()
    };
    await newGameRef.set(gameData);
  }

  // Update game
  async updateGame(gameId, updates) {
    await gamesRef.child(gameId).update(updates);
  }

  // Delete game
  async deleteGame(gameId) {
    await gamesRef.child(gameId).remove();
  }

  // Toggle trending status
  async toggleTrending(gameId) {
    const gameSnapshot = await gamesRef.child(gameId).once('value');
    const game = gameSnapshot.val();
    
    if (game) {
      const newTrendingStatus = !game.trending;
      await gamesRef.child(gameId).update({ trending: newTrendingStatus });
      return newTrendingStatus;
    }
  }

  // Update trending games list (for sorting)
  async updateTrendingGames() {
    // Trending games are computed dynamically in init()
    // This method is here for API compatibility
  }

  // Increment play count
  async incrementPlays(gameId) {
    console.log('incrementPlays called with gameId:', gameId);
    const gameRef = gamesRef.child(gameId);
    const snapshot = await gameRef.once('value');
    const game = snapshot.val();
    
    console.log('Game found:', game?.name);
    
    if (game) {
      const currentPlays = Number(game.plays) || 0;
      const newPlays = currentPlays + 1;
      await gameRef.update({ plays: newPlays });
      console.log(`Updated ${game.name} plays: ${currentPlays} -> ${newPlays}`);
      
      // Track in user leaderboard if user is logged in
      console.log('recordGamePlay function exists?', typeof recordGamePlay === 'function');
      if (typeof recordGamePlay === 'function') {
        console.log('Calling recordGamePlay with:', game.name);
        recordGamePlay(game.name);
      }
    }
  }

  // Initialize database with existing games (one-time migration)
  async initializeDatabase(gamesData) {
    const snapshot = await gamesRef.once('value');
    
    // Only initialize if database is empty
    if (!snapshot.exists()) {
      const promises = gamesData.map(game => {
        const newGameRef = gamesRef.push();
        return newGameRef.set({
          id: newGameRef.key,
          name: game.name,
          path: game.path,
          thumb: game.thumb,
          section: game.section || 'all',
          trending: game.trending || false,
          plays: game.plays || 0,
          createdAt: Date.now()
        });
      });
      
      await Promise.all(promises);
      return true;
    }
    return false;
  }
}
// Create global instance
const gamesManager = new GamesManager();
