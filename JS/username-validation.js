// Username Validation Utilities
// Shared validation logic used across username prompt and profile menu

const USERNAME_VALIDATION = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 20,
  PATTERN: /^[a-zA-Z0-9_-]+$/,
  
  // Validate a username and return error message if invalid, null if valid
  validate: function(username) {
    if (!username || username.trim() === '') {
      return 'please enter a username';
    }
    
    const trimmed = username.trim();
    
    if (trimmed.length < this.MIN_LENGTH) {
      return `username must be at least ${this.MIN_LENGTH} characters`;
    }
    
    if (trimmed.length > this.MAX_LENGTH) {
      return `username must be ${this.MAX_LENGTH} characters or less`;
    }
    
    if (!this.PATTERN.test(trimmed)) {
      return 'username can only contain letters, numbers, _ and -';
    }
    
    return null; // Valid
  },
  
  // Check if a username is valid (returns boolean)
  isValid: function(username) {
    return this.validate(username) === null;
  }
};

// Database path utilities
const DB_PATHS = {
  // Dynamic paths (functions that take parameters)
  leaderboard: function(uid) {
    return `leaderboards/${uid}`;
  },
  
  presence: function(uid) {
    return `presence/${uid}`;
  },
  
  // Static paths (strings for paths without parameters)
  games: 'games',
  trending: 'trending',
  announcement: 'announcement',
  settings: 'settings'
};
