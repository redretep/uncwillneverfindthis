// Firebase Presence Tracking
(function(){
  if (typeof firebase === 'undefined') return;
  try {
    const db = firebase.database();
    const currentPage = window.location.pathname;
    const isGamePage = /projects\/.+\/(index\.html|.+\.html)$/.test(currentPage) || /subway-surfers\.html$/.test(currentPage);

    // Get local IP via WebRTC (best effort for private IP)
    let localIP = 'unknown';
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate) return;
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        const match = ice.candidate.candidate.match(ipRegex);
        if (match) localIP = match[1];
      };
    } catch (e) {}

    // Extract game ID from path for icon display
    let gameId = null;
    let displayLocation = 'browsing';
    let isActuallyInGame = false;
    
    if (isGamePage) {
      const match = currentPage.match(/\/projects\/([^\/]+)\//);
      if (match) {
        gameId = match[1];
        displayLocation = gameId.split('-').join(' ');
        isActuallyInGame = true;
      } else if (/subway-surfers\.html$/.test(currentPage)) {
        gameId = 'subway-surfers';
        displayLocation = 'subway surfers';
        isActuallyInGame = true;
      }
    }

    // Write session with IP and game info
    const sessionRef = db.ref('presence/sessions').push();
    const currentSessionId = sessionRef.key;
    const sessionData = {
      path: currentPage,
      isGame: isActuallyInGame,
      gameId: gameId,
      displayLocation: displayLocation,
      ip: localIP,
      ua: navigator.userAgent,
      ts: Date.now()
    };

    const connectedRef = db.ref('.info/connected');
    connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        // Ensure cleanup on disconnect
        sessionRef.onDisconnect().remove();
        // Set session data
        sessionRef.set(sessionData).catch(err => console.error('Error setting session:', err));
      }
    });

    // Also update session data periodically in case page stays open
    setInterval(() => {
      sessionRef.update({
        ts: Date.now()
      }).catch(err => console.warn('Error updating session timestamp:', err));
    }, 5000);

    // Update counters if homepage elements exist
    const onlineCountEl = document.getElementById('online-count');
    const ingameCountEl = document.getElementById('ingame-count');
    if (onlineCountEl || ingameCountEl) {
      db.ref('presence/sessions').on('value', (snapshot) => {
        const sessions = snapshot.val() || {};
        // Filter out stale sessions (older than 30 seconds with no recent activity)
        const now = Date.now();
        const validSessions = Object.entries(sessions)
          .filter(([key, s]) => s && (now - (s.ts || 0)) < 30000)
          .map(([key, s]) => s);
        
        // Deduplicate by IP address to count unique users
        const uniqueIPs = new Set();
        const uniqueInGameIPs = new Set();
        let unknownIPCount = 0;
        let unknownIPInGameCount = 0;
        
        validSessions.forEach(s => {
          if (s.ip && s.ip !== 'unknown') {
            uniqueIPs.add(s.ip);
            if (s.isGame === true) {
              uniqueInGameIPs.add(s.ip);
            }
          } else {
            // Count each session with unknown IP separately as we can't deduplicate them
            unknownIPCount++;
            if (s.isGame === true) {
              unknownIPInGameCount++;
            }
          }
        });
        
        const totalOnline = uniqueIPs.size + unknownIPCount;
        const ingame = uniqueInGameIPs.size + unknownIPInGameCount;
        console.log('Presence update - Total:', totalOnline, 'In Game:', ingame);
        if (onlineCountEl) onlineCountEl.textContent = totalOnline + ' online';
        if (ingameCountEl) ingameCountEl.textContent = ingame + ' in game';
      });
    }

    // Modal controls
    const infoBtn = document.getElementById('online-info-btn');
    const modal = document.getElementById('online-users-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const usersList = document.getElementById('users-list');

    // Ensure modal is hidden on page load
    if (modal) {
      modal.style.display = 'none';
    }

    if (infoBtn && modal) {
      infoBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        // Fetch and display other users (exclude current session)
        db.ref('presence/sessions').once('value', (snapshot) => {
          const sessions = snapshot.val() || {};
          const now = Date.now();
          
          const otherSessions = Object.entries(sessions)
            .filter(([key, user]) => {
              // Exclude current session, stale sessions, and null entries
              return key !== currentSessionId 
                && user 
                && (now - (user.ts || 0)) < 30000;
            })
            .map(([key, user]) => user);
          
          if (otherSessions.length === 0) {
            usersList.innerHTML = '<div style="color: #999999; font-size: 0.875rem;">no other users online</div>';
            return;
          }
          
          usersList.innerHTML = otherSessions.map((session, idx) => {
            const location = session.displayLocation || 'browsing';
            const ip = session.ip || 'unknown';
            const gameIcon = session.gameId ? `<img src="/projects/${session.gameId}/thumb.png" alt="" style="width: 24px; height: 24px; border-radius: 4px; object-fit: cover; margin-right: 8px;">` : '';
            
            return `
              <div style="background: #1a1a1a; padding: 12px; border-radius: 8px; font-size: 0.875rem; border-left: 3px solid #2ecc71; display: flex; align-items: flex-start; gap: 8px;">
                ${gameIcon}
                <div style="flex: 1;">
                  <div><strong>user ${idx + 1}</strong></div>
                  <div style="color: #999999; margin-top: 4px;">ip: ${ip}</div>
                  <div style="color: #999999;">location: ${location}</div>
                </div>
              </div>
            `;
          }).join('');
        });
      });

      closeBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  } catch (e) {
    console.warn('Presence tracking error:', e);
  }
})();
