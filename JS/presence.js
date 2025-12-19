// Firebase Presence Tracking
(function(){
  if (typeof firebase === 'undefined') return;
  try {
    const db = firebase.database();
    const currentPage = window.location.pathname;
    const isGamePage = /projects\/.+\/(index\.html|.+\.html)$/.test(currentPage) || /subway-surfers\.html$/.test(currentPage);

    // Generate a unique session ID for this browser session
    let sessionId = sessionStorage.getItem('presence-session-id');
    if (!sessionId) {
      // Use crypto.randomUUID if available, otherwise fallback to timestamp + random
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        sessionId = 'session_' + crypto.randomUUID();
      } else {
        // Fallback: timestamp + 9 random alphanumeric characters
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
      }
      sessionStorage.setItem('presence-session-id', sessionId);
    }

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

    // Write session with session ID and game info
    const sessionRef = db.ref(`presence/sessions/${sessionId}`);
    const sessionData = {
      path: currentPage,
      isGame: isActuallyInGame,
      gameId: gameId,
      displayLocation: displayLocation,
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
        
        // Count all valid sessions (no deduplication)
        const totalOnline = validSessions.length;
        const ingame = validSessions.filter(s => s.isGame === true).length;
        
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
        Promise.all([
          db.ref('presence/sessions').once('value'),
          db.ref('games').once('value')
        ]).then(([sessionsSnapshot, gamesSnapshot]) => {
          const sessions = sessionsSnapshot.val() || {};
          const games = gamesSnapshot.val() || {};
          const now = Date.now();
          
          // Create a map of gameId to game data for quick lookup
          const gamesMap = {};
          Object.values(games).forEach(game => {
            if (game && game.id) {
              // Extract gameId from the game's path
              const pathMatch = game.path?.match(/\/projects\/([^\/]+)\//);
              if (pathMatch) {
                const extractedGameId = pathMatch[1];
                gamesMap[extractedGameId] = game;
                
                // Handle subway-surfers special case: both subway-surfers-san-francisco and
                // subway-surfers-unity should be accessible as 'subway-surfers' since that's
                // what the presence tracking uses
                if (extractedGameId.startsWith('subway-surfers')) {
                  gamesMap['subway-surfers'] = game;
                }
              }
            }
          });
          
          const otherSessions = Object.entries(sessions)
            .filter(([key, user]) => {
              // Exclude current session, stale sessions, and null entries
              return key !== sessionId 
                && user 
                && (now - (user.ts || 0)) < 30000;
            })
            .map(([key, user]) => user);
          
          usersList.innerHTML = '';

          if (otherSessions.length === 0) {
            usersList.innerHTML = '<div style="color: #999999; font-size: 0.875rem;">no other users online</div>';
            return;
          }

          // Helper: find the first existing image in the game folder
          const resolveThumb = (session) => new Promise((resolve) => {
            const game = session.gameId ? gamesMap[session.gameId] : null;
            // Prefer explicit thumb if provided
            if (game && game.thumb) {
              resolve(game.thumb);
              return;
            }
            // Derive base folder from path or fallback
            let folder = null;
            if (game && game.path) {
              const lastSlash = game.path.lastIndexOf('/');
              folder = lastSlash > -1 ? game.path.slice(0, lastSlash) : null;
            }
            if (!folder && session.gameId) {
              folder = `/projects/${session.gameId}`;
            }
            if (!folder) {
              resolve(null);
              return;
            }
            const bases = ['thumb','icon','splash','logo','logo-4','screen-shot','screenshot','cover'];
            const subdirBases = ['img/splash','img/thumb','img/icon','images/thumb','images/icon'];
            const exts = ['png','jpg','jpeg','webp','gif'];
            const candidates = [];
            bases.forEach(b => exts.forEach(e => candidates.push(`${folder}/${b}.${e}`)));
            subdirBases.forEach(b => exts.forEach(e => candidates.push(`${folder}/${b}.${e}`)));

            // Try candidates sequentially
            const tryNext = (i) => {
              if (i >= candidates.length) { resolve(null); return; }
              const url = candidates[i];
              const img = new Image();
              img.onload = () => resolve(url);
              img.onerror = () => tryNext(i + 1);
              img.src = url;
            };
            tryNext(0);

            // If none of the common names work, parse the game's index page for any image in the folder
            const tryParseIndexForImage = async () => {
              try {
                // Build index URL: use game.path or fallback to folder/index.html
                let indexUrl = game?.path || `${folder}/index.html`;
                // Ensure absolute URL for parsing base
                const absoluteIndex = new URL(indexUrl, window.location.origin).href;
                const res = await fetch(absoluteIndex, { cache: 'no-store' });
                if (!res.ok) return null;
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                // Collect possible image sources
                const imgEls = Array.from(doc.querySelectorAll('img'));
                const linkIcons = Array.from(doc.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'));
                const metaImgs = Array.from(doc.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]'));
                const urlSet = new Set();
                const pushIfValid = (src) => {
                  if (!src) return;
                  // Resolve relative to index page
                  let abs;
                  try {
                    abs = new URL(src, absoluteIndex).pathname; // same-origin path
                  } catch (e) {
                    return;
                  }
                  // Only consider files inside the game folder and with supported extensions
                  const lower = abs.toLowerCase();
                  const inFolder = lower.startsWith(folder.toLowerCase());
                  const hasExt = exts.some(ext => lower.endsWith(`.${ext}`));
                  if (inFolder && hasExt) urlSet.add(abs);
                };
                imgEls.forEach(el => pushIfValid(el.getAttribute('src')));
                linkIcons.forEach(el => pushIfValid(el.getAttribute('href')));
                metaImgs.forEach(el => pushIfValid(el.getAttribute('content')));
                const found = Array.from(urlSet);
                if (!found.length) return null;
                // Try loading the first available image
                for (let i = 0; i < found.length; i++) {
                  const candidate = found[i];
                  const img = new Image();
                  const promise = new Promise(r => {
                    img.onload = () => r(candidate);
                    img.onerror = () => r(null);
                  });
                  img.src = candidate;
                  const ok = await promise;
                  if (ok) return ok;
                }
                return null;
              } catch (e) {
                return null;
              }
            };

            // Kick off index parsing in parallel; if sequential check fails, use parsed result
            (async () => {
              const parsed = await tryParseIndexForImage();
              if (parsed) resolve(parsed);
            })();
          });

          console.log('Games map:', gamesMap);
          console.log('Other sessions:', otherSessions);

          // Build cards and resolve thumbnails asynchronously
          otherSessions.forEach((session, idx) => {
            const location = session.displayLocation || 'browsing';

            const card = document.createElement('div');
            card.className = 'user-card';

            const left = document.createElement('div');
            left.style.flex = '1';
            left.innerHTML = `
              <div><strong>user ${idx + 1}</strong></div>
              <div class="user-location">location: ${location}</div>
            `;

            card.appendChild(left);
            usersList.appendChild(card);

            if (session.gameId) {
              resolveThumb(session).then(url => {
                if (!url) return;
                const img = document.createElement('img');
                img.className = 'user-game-thumb';
                img.alt = location;
                img.src = url;
                card.appendChild(img);
              });
            }
          });
        }).catch(err => {
          console.error('Error loading users:', err);
          usersList.innerHTML = '<div style="color: #999999; font-size: 0.875rem;">unable to load online users. please try again later.</div>';
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
