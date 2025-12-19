// Username Prompt for New Users
// Shows a one-time popup to new users after signup, prompting them to set a username

const USERNAME_PROMPT_SHOWN_KEY = 'username-prompt-shown';

function initUsernamePrompt() {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    console.warn('Firebase not available for username prompt');
    return;
  }

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // Check if this is a new signup
      const isNewSignup = sessionStorage.getItem('new-user-signup') === 'true';
      
      // Check if we've already shown the prompt
      const hasShownPrompt = localStorage.getItem(USERNAME_PROMPT_SHOWN_KEY + '-' + user.uid);
      
      if (isNewSignup && !hasShownPrompt) {
        // Clear the new signup flag
        sessionStorage.removeItem('new-user-signup');
        
        // Load user data to check if they already have a custom username
        const db = firebase.database();
        db.ref(DB_PATHS.leaderboard(user.uid)).once('value', snap => {
          const userData = snap.val();
          
          // Only show if they haven't changed their username yet
          if (userData && !userData.usernameChanged) {
            // Small delay to ensure the page is fully loaded
            setTimeout(() => {
              showUsernamePrompt(user, userData);
            }, 1000);
          }
          
          // Mark that we've shown the prompt (or would have shown it)
          localStorage.setItem(USERNAME_PROMPT_SHOWN_KEY + '-' + user.uid, 'true');
        });
      }
    }
  });
}

function showUsernamePrompt(user, userData) {
  // Don't show if already exists
  if (document.getElementById('username-prompt-popup')) return;

  const currentUsername = userData?.username || user.email.split('@')[0];

  const popup = document.createElement('div');
  popup.id = 'username-prompt-popup';
  popup.className = 'username-prompt-popup';
  popup.innerHTML = `
    <div class="username-prompt-content">
      <button class="username-prompt-close" title="close">✕</button>
      <div class="username-prompt-header">
        <span class="username-prompt-icon">👋</span>
        <h3 style="margin: 0; font-weight: 700; color: var(--text-primary);">welcome!</h3>
      </div>
      <div class="username-prompt-text">
        <p style="margin: 0 0 4px 0; color: var(--text-secondary); font-size: 0.9rem;">
          customize your profile by setting a username
        </p>
        <p style="margin: 0; color: var(--text-muted); font-size: 0.8rem;">
          your current username: <strong>${currentUsername}</strong>
        </p>
      </div>
      <div class="username-prompt-input-group">
        <input 
          type="text" 
          id="username-prompt-input" 
          class="username-prompt-input"
          placeholder="enter new username"
          maxlength="${USERNAME_VALIDATION.MAX_LENGTH}"
          value="${currentUsername}"
        />
        <small class="username-prompt-hint">${USERNAME_VALIDATION.MIN_LENGTH}-${USERNAME_VALIDATION.MAX_LENGTH} characters, letters, numbers, _ and - only</small>
      </div>
      <div class="username-prompt-actions">
        <button class="username-prompt-button secondary" data-action="skip">
          skip for now
        </button>
        <button class="username-prompt-button primary" data-action="save">
          save username
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
  
  // Attach event listeners
  const closeButton = popup.querySelector('.username-prompt-close');
  const skipButton = popup.querySelector('[data-action="skip"]');
  const saveButton = popup.querySelector('[data-action="save"]');
  
  if (closeButton) {
    closeButton.addEventListener('click', dismissUsernamePrompt);
  }
  
  if (skipButton) {
    skipButton.addEventListener('click', dismissUsernamePrompt);
  }
  
  if (saveButton) {
    saveButton.addEventListener('click', saveUsernameFromPrompt);
  }

  // Trigger animation
  setTimeout(() => {
    popup.classList.add('show');
  }, 10);

  // Focus input
  const input = document.getElementById('username-prompt-input');
  if (input) {
    input.focus();
    input.select();
    
    // Allow Enter key to save
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveUsernameFromPrompt();
      }
    });
  }
}

function dismissUsernamePrompt() {
  const popup = document.getElementById('username-prompt-popup');
  if (popup) {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 300);
  }
}

function saveUsernameFromPrompt() {
  const input = document.getElementById('username-prompt-input');
  if (!input) return;

  const username = input.value.trim();

  // Validate username using shared validation utility
  const validationError = USERNAME_VALIDATION.validate(username);
  if (validationError) {
    showUsernameError(validationError);
    return;
  }

  // Save to database
  const user = firebase.auth().currentUser;
  if (!user) {
    showUsernameError('you must be logged in');
    return;
  }

  const db = firebase.database();
  const saveButton = document.querySelector('.username-prompt-button.primary');
  
  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent = 'saving...';
  }

  db.ref(DB_PATHS.leaderboard(user.uid)).update({
    username: username,
    usernameChanged: true,
    updatedAt: Date.now()
  })
  .then(() => {
    // Show success and close
    if (saveButton) {
      saveButton.textContent = '✓ saved!';
      saveButton.style.background = '#4caf50';
    }
    setTimeout(() => {
      dismissUsernamePrompt();
    }, 800);
  })
  .catch(err => {
    console.error('Failed to save username:', err);
    showUsernameError('failed to save username. please try again.');
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = 'save username';
    }
  });
}

function showUsernameError(message) {
  // Remove existing error if any
  const existingError = document.querySelector('.username-prompt-error');
  if (existingError) existingError.remove();

  const error = document.createElement('div');
  error.className = 'username-prompt-error';
  error.style.cssText = `
    color: #ff6b6b;
    font-size: 0.8rem;
    margin-top: 4px;
    padding: 6px 8px;
    background: rgba(255, 107, 107, 0.1);
    border-radius: 4px;
  `;
  error.textContent = message;

  const inputGroup = document.querySelector('.username-prompt-input-group');
  if (inputGroup) {
    inputGroup.appendChild(error);
    
    // Remove error after 3 seconds
    setTimeout(() => {
      error.remove();
    }, 3000);
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUsernamePrompt);
} else {
  initUsernamePrompt();
}
