// Firebase Presence Tracking
(function(){
  if (typeof firebase === 'undefined') return;
  try {
    const db = firebase.database();
    const currentPage = window.location.pathname;
    const isGamePage = /projects\/.+\/(index\.html|.+\.html)$/.test(currentPage) || /subway-surfers\.html$/.test(currentPage);

    // Write session
    const sessionRef = db.ref('presence/sessions').push();
    const sessionData = {
      path: currentPage,
      isGame: !!isGamePage,
      ua: navigator.userAgent,
      ts: Date.now()
    };

    const connectedRef = db.ref('.info/connected');
    connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        sessionRef.onDisconnect().remove();
        sessionRef.set(sessionData);
      }
    });

    // Update counters if homepage elements exist
    const onlineCountEl = document.getElementById('online-count');
    const ingameCountEl = document.getElementById('ingame-count');
    if (onlineCountEl || ingameCountEl) {
      db.ref('presence/sessions').on('value', (snapshot) => {
        const sessions = snapshot.val() || {};
        const values = Object.values(sessions);
        const totalOnline = values.length;             // includes in-game users
        const ingame = values.filter(s => s && s.isGame).length;
        if (onlineCountEl) onlineCountEl.textContent = totalOnline + ' online';
        if (ingameCountEl) ingameCountEl.textContent = ingame + ' in game';
      });
    }
  } catch (e) {
    console.warn('Presence tracking error:', e);
  }
})();
