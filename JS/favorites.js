// Favorites/Bookmarks Manager
const FAVORITES_KEY = 'favoriteGames';

function toggleFavorite(gameId) {
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  const index = favorites.indexOf(gameId);
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(gameId);
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  updateFavoriteButtons();
  return !favorites.includes(gameId);
}

function isFavorite(gameId) {
  const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  return favorites.includes(gameId);
}

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}

function updateFavoriteButtons() {
  const buttons = document.querySelectorAll('.favorite-btn');
  buttons.forEach(btn => {
    const gameId = btn.dataset.gameId;
    if (isFavorite(gameId)) {
      btn.classList.add('active');
      btn.textContent = '★';
    } else {
      btn.classList.remove('active');
      btn.textContent = '☆';
    }
  });
}

function addFavoriteButton(gameContainer, gameId) {
  const btn = document.createElement('button');
  btn.className = 'favorite-btn';
  btn.dataset.gameId = gameId;
  btn.textContent = isFavorite(gameId) ? '★' : '☆';
  if (isFavorite(gameId)) btn.classList.add('active');
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(gameId);
  });
  gameContainer.appendChild(btn);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateFavoriteButtons);
} else {
  updateFavoriteButtons();
}
