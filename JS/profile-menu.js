// Profile Menu for logged-in users
let currentUserData = null;

function initProfileMenu() {
  if (typeof firebase === 'undefined' || !firebase.auth) return;
  
  firebase.auth().onAuthStateChanged(user => {
    const profileIcon = document.getElementById('profile-icon');
    
    if (user) {
      // User is logged in - show profile icon
      if (!profileIcon) {
        createProfileIcon();
      }
      
      // Load user data from leaderboard
      const db = firebase.database();
      db.ref(DB_PATHS.leaderboard(user.uid)).on('value', snap => {
        currentUserData = snap.val() || {};
        updateProfileMenu();
      });
    } else {
      // User is logged out - remove profile icon
      if (profileIcon) {
        profileIcon.remove();
      }
      
      const menu = document.getElementById('profile-menu');
      if (menu) {
        menu.remove();
      }
      
      currentUserData = null;
    }
  });
}

function createProfileIcon() {
  const topnavRight = document.querySelector('.topnav-right');
  if (!topnavRight) return;
  
  const profileContainer = document.createElement('div');
  profileContainer.id = 'profile-container';
  profileContainer.style.cssText = `
    display: flex;
    align-items: center;
  `;
  
  const icon = document.createElement('button');
  icon.id = 'profile-icon';
  icon.style.cssText = `
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 1px solid var(--bg-elevated);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-primary);
    font-size: 1.2rem;
    transition: all 0.2s ease;
    font-weight: 600;
    flex-shrink: 0;
    outline: none;
  `;
  icon.textContent = '👤';
  
  icon.addEventListener('click', toggleProfileMenu);
  icon.addEventListener('mouseover', () => {
    icon.style.background = 'var(--bg-elevated)';
    icon.style.borderColor = 'var(--primary)';
    icon.style.transform = 'scale(1.05)';
  });
  icon.addEventListener('mouseout', () => {
    icon.style.background = 'var(--bg-card)';
    icon.style.borderColor = 'var(--bg-elevated)';
    icon.style.transform = 'scale(1)';
  });
  
  profileContainer.appendChild(icon);
  topnavRight.appendChild(profileContainer);
}

function toggleProfileMenu() {
  let menu = document.getElementById('profile-menu');
  
  if (menu) {
    menu.remove();
  } else {
    createProfileMenu();
  }
}

function createProfileMenu() {
  if (!currentUserData) return;
  
  const menu = document.createElement('div');
  menu.id = 'profile-menu';
  menu.style.cssText = `
    position: fixed;
    top: 70px;
    right: 16px;
    background: var(--bg-card);
    border: 1px solid var(--bg-elevated);
    border-radius: 8px;
    padding: 16px;
    width: 280px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideDown 0.2s ease;
  `;
  
  const username = currentUserData.username || 'unknown';
  const email = currentUserData.email || '';
  
  menu.innerHTML = `
    <div style="padding-bottom: 12px; border-bottom: 1px solid var(--bg-elevated);">
      <p style="margin: 0 0 6px 0; color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; text-transform: uppercase;">profile</p>
      <p style="margin: 0 0 4px 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${username}</p>
      <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); word-break: break-all;">${email}</p>
    </div>
    <div style="margin-top: 12px;">
      <button id="edit-username-btn" class="profile-menu-btn" style="
        width: 100%;
        padding: 8px 12px;
        background: var(--bg-elevated);
        border: 1px solid var(--bg-elevated);
        border-radius: 6px;
        color: var(--text-primary);
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
        margin-bottom: 8px;
      ">edit username</button>
      <button id="logout-btn" class="profile-menu-btn" style="
        width: 100%;
        padding: 8px 12px;
        background: transparent;
        border: 1px solid #ff6b6b;
        border-radius: 6px;
        color: #ff6b6b;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
      ">log out</button>
    </div>
  `;
  
  document.body.appendChild(menu);
  
  // Button event listeners
  document.getElementById('edit-username-btn').addEventListener('click', openEditUsernameDialog);
  document.getElementById('logout-btn').addEventListener('click', logoutUser);
  
  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', closeMenuOnClickOutside);
  }, 100);
}

function closeMenuOnClickOutside(e) {
  const menu = document.getElementById('profile-menu');
  const icon = document.getElementById('profile-icon');
  
  if (menu && !menu.contains(e.target) && !icon.contains(e.target)) {
    menu.remove();
    document.removeEventListener('click', closeMenuOnClickOutside);
  }
}

function openEditUsernameDialog() {
  if (!currentUserData) return;
  
  // Check if already changed
  if (currentUserData.usernameChanged) {
    alert('you can only change your username once');
    return;
  }
  
  const newUsername = prompt(`enter your new username (${USERNAME_VALIDATION.MIN_LENGTH}-${USERNAME_VALIDATION.MAX_LENGTH} characters):`, currentUserData.username);
  
  if (!newUsername) return;
  
  const trimmed = newUsername.trim();
  
  // Validate using shared validation utility
  const validationError = USERNAME_VALIDATION.validate(trimmed);
  if (validationError) {
    alert(validationError);
    return;
  }
  
  updateUsername(trimmed);
}

function updateUsername(newUsername) {
  const user = firebase.auth().currentUser;
  if (!user) return;
  
  const db = firebase.database();
  db.ref(DB_PATHS.leaderboard(user.uid)).update({
    username: newUsername,
    usernameChanged: true,
    updatedAt: Date.now()
  }).then(() => {
    alert('username updated!');
    const menu = document.getElementById('profile-menu');
    if (menu) menu.remove();
  }).catch(err => {
    console.error('Failed to update username:', err);
    alert('failed to update username');
  });
}

function logoutUser() {
  if (confirm('are you sure you want to log out?')) {
    firebase.auth().signOut().then(() => {
      window.location.href = '/';
    }).catch(err => {
      console.error('Logout failed:', err);
    });
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfileMenu);
} else {
  initProfileMenu();
}
