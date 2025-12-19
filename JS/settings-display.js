// Load and display site settings from Firebase

function loadHeroText() {
  const db = firebase.database();
  const heroTextEl = document.getElementById('hero-text');
  
  if (!heroTextEl) return;
  
  db.ref('settings/heroText').on('value', snap => {
    const text = snap.val();
    if (text) {
      heroTextEl.textContent = text;
    } else {
      heroTextEl.textContent = 'druskii is so gnarly -s';
    }
  });
}

function loadTopLeaderboardEntry() {
  const db = firebase.database();
  const leaderboardTopEl = document.getElementById('leaderboard-top');
  
  if (!leaderboardTopEl) return;
  
  db.ref('leaderboards').orderByChild('totalPlays').limitToLast(1).on('value', snap => {
    const entries = [];
    snap.forEach(childSnap => {
      entries.push({
        uid: childSnap.key,
        ...childSnap.val()
      });
    });
    
    if (entries.length === 0) {
      leaderboardTopEl.textContent = '#1: no entries yet';
      return;
    }
    
    const topEntry = entries[0];
    const displayText = `#1: ${topEntry.email || 'anonymous'}`;
    leaderboardTopEl.textContent = displayText;
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadHeroText();
  loadTopLeaderboardEntry();
});
