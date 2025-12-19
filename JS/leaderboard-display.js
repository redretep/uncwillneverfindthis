// Leaderboard Modal Handler
document.addEventListener('DOMContentLoaded', () => {
  const leaderboardBtn = document.getElementById('leaderboard-info-btn');
  const leaderboardModal = document.getElementById('leaderboard-modal');
  const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
  
  if (!leaderboardBtn || !leaderboardModal) return;
  
  // Open leaderboard modal
  leaderboardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    leaderboardModal.classList.add('show');
    loadLeaderboard();
  });
  
  // Close leaderboard modal
  if (closeLeaderboardBtn) {
    closeLeaderboardBtn.addEventListener('click', () => {
      leaderboardModal.classList.remove('show');
    });
  }
  
  // Close when clicking outside the modal-content
  leaderboardModal.addEventListener('click', (event) => {
    if (event.target === leaderboardModal) {
      leaderboardModal.classList.remove('show');
    }
  });
});

function loadLeaderboard() {
  const db = firebase.database();
  const leaderboardList = document.getElementById('leaderboard-list');
  
  db.ref('leaderboards').orderByChild('totalPlays').limitToLast(20).once('value', snap => {
    const entries = [];
    snap.forEach(childSnap => {
      entries.push({
        uid: childSnap.key,
        ...childSnap.val()
      });
    });
    
    // Sort by plays descending
    entries.sort((a, b) => (b.totalPlays || 0) - (a.totalPlays || 0));
    
    if (entries.length === 0) {
      leaderboardList.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">no leaderboard data yet</p>';
      return;
    }
    
    leaderboardList.innerHTML = entries.slice(0, 10).map((entry, idx) => `
      <div class="leaderboard-row" style="display: flex; align-items: center; padding: 12px; background: var(--bg-card); border-radius: 6px; margin-bottom: 8px; border: 1px solid var(--bg-elevated);">
        <div style="width: 30px; font-weight: 700; color: var(--primary); font-size: 1.1rem;">#${idx + 1}</div>
        <div style="flex: 1; margin-left: 12px;">
          <div style="font-weight: 600; color: var(--text-primary);">${entry.username || 'anonymous'}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${entry.email || ''}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 700; color: var(--primary);">${entry.totalPlays || 0}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">plays</div>
        </div>
      </div>
    `).join('');
  }).catch(err => {
    console.error('Error loading leaderboard:', err);
    leaderboardList.innerHTML = '<p style="color: #ff6b6b; padding: 20px;">failed to load leaderboard</p>';
  });
}
