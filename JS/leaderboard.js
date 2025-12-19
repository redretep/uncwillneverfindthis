// Leaderboard System with Firebase
const LEADERBOARD_PATH = 'leaderboards';
let currentUser = null;
let userScores = {};

// Auth state listener - make sure this runs as soon as Firebase is available
function setupLeaderboardAuth() {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    console.warn('Firebase auth not available, retrying...');
    setTimeout(setupLeaderboardAuth, 500);
    return;
  }
  
  firebase.auth().onAuthStateChanged(user => {
    console.log('Leaderboard: Auth state changed:', user?.uid);
    currentUser = user;
    if (user) {
      initializeUserScore();
      displayLeaderboard();
    }
  });
}

// Start auth listener immediately
setupLeaderboardAuth();

function initializeUserScore() {
  if (!currentUser) return;
  const userId = currentUser.uid;
  const db = firebase.database();
  
  db.ref(`${LEADERBOARD_PATH}/${userId}`).once('value', snap => {
    if (snap.exists()) {
      userScores = snap.val();
    } else {
      userScores = {
        username: currentUser.email.split('@')[0],
        email: currentUser.email,
        totalPlays: 0,
        totalPlayTime: 0,
        updatedAt: Date.now()
      };
      db.ref(`${LEADERBOARD_PATH}/${userId}`).set(userScores);
    }
  });
}

function recordGamePlay(gameName, playTimeSeconds = 0) {
  console.log('recordGamePlay called:', { gameName, currentUser: currentUser?.uid, playTimeSeconds });
  
  if (!currentUser) {
    console.warn('recordGamePlay: No currentUser logged in');
    return;
  }
  
  const userId = currentUser.uid;
  const db = firebase.database();
  
  // Use a simple path that will work with the rules
  const userPath = `leaderboards/${userId}`;
  
  db.ref(userPath).transaction(current => {
    const data = current || {
      username: currentUser.email.split('@')[0],
      email: currentUser.email,
      totalPlays: 0,
      totalPlayTime: 0,
      updatedAt: Date.now()
    };
    
    data.totalPlays = (data.totalPlays || 0) + 1;
    data.totalPlayTime = (data.totalPlayTime || 0) + playTimeSeconds;
    data.lastPlayedGame = gameName;
    data.updatedAt = Date.now();
    
    return data;
  }).then(() => {
    console.log('Game play recorded successfully');
  }).catch(err => {
    console.error('Failed to record game play:', err);
  });
}

function displayLeaderboard() {
  const container = document.getElementById('leaderboard-container');
  if (!container) return;
  
  const db = firebase.database();
  db.ref(LEADERBOARD_PATH).orderByChild('totalPlays').limitToLast(10).once('value', snap => {
    const entries = [];
    snap.forEach(childSnap => {
      entries.push({
        uid: childSnap.key,
        ...childSnap.val()
      });
    });
    
    entries.reverse(); // Top first
    
    container.innerHTML = entries.map((entry, idx) => `
      <div class="leaderboard-row ${entry.uid === currentUser?.uid ? 'current-user' : ''}">
        <div class="rank">#${idx + 1}</div>
        <div class="username">${entry.username || 'Anonymous'}</div>
        <div class="plays">${entry.totalPlays || 0} plays</div>
        <div class="time">${Math.round((entry.totalPlayTime || 0) / 60)} min</div>
      </div>
    `).join('');
  });
}

function setUsername(newUsername) {
  if (!currentUser) return;
  const userId = currentUser.uid;
  const db = firebase.database();
  
  db.ref(`${LEADERBOARD_PATH}/${userId}/username`).set(newUsername).then(() => {
    displayLeaderboard();
  });
}
