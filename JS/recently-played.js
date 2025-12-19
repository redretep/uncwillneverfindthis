// Recently Played Games Tracker
const RECENTLY_PLAYED_KEY = 'recentlyPlayedGames';
const MAX_RECENT = 5;

function trackGamePlay(gameId, gameName, gamePath, gameThumb) {
  let recent = JSON.parse(localStorage.getItem(RECENTLY_PLAYED_KEY) || '[]');
  
  // Remove if already exists to move to top
  recent = recent.filter(g => g.gameId !== gameId);
  
  // Add to top
  recent.unshift({
    gameId,
    gameName,
    gamePath,
    gameThumb,
    playedAt: Date.now()
  });
  
  // Keep only max recent
  recent = recent.slice(0, MAX_RECENT);
  localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(recent));
}

function getRecentlyPlayed() {
  return JSON.parse(localStorage.getItem(RECENTLY_PLAYED_KEY) || '[]');
}

function displayRecentlyPlayed() {
  const container = document.getElementById('recently-played-container');
  if (!container) return;
  
  const recent = getRecentlyPlayed();
  container.innerHTML = '';
  
  if (recent.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px; grid-column: 1/-1;">no games played yet</p>';
    return;
  }
  
  recent.forEach(game => {
    const gameLink = document.createElement('a');
    gameLink.href = game.gamePath;
    gameLink.className = 'recently-played-tile';
    
    gameLink.innerHTML = `
      <div class="recently-played-card">
        <img class="recently-played-thumb" src="${game.gameThumb}" alt="${game.gameName}">
        <button class="play-button" onclick="event.preventDefault(); event.stopPropagation(); window.location.href='${game.gamePath}';">
          <span class="play-icon">▶</span>
        </button>
      </div>
    `;
    
    container.appendChild(gameLink);
  });
}

// Hook into game clicks from homepage
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', displayRecentlyPlayed);
} else {
  displayRecentlyPlayed();
}
