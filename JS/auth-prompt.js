// Auth Prompt Popup for logged-out users
const AUTH_PROMPT_DURATION = 16000; // 16 seconds

function showAuthPrompt() {
  // Check if user is logged in
  if (typeof firebase !== 'undefined') {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        createAndShowAuthPrompt();
      }
    });
  }
}

function createAndShowAuthPrompt() {
  // Don't show if already exists
  if (document.getElementById('auth-prompt-popup')) return;
  
  const popup = document.createElement('div');
  popup.id = 'auth-prompt-popup';
  popup.className = 'auth-prompt-popup';
  popup.innerHTML = `
    <div class="auth-prompt-content">
      <div class="auth-prompt-text">
        <p style="margin: 0; font-weight: 600; color: var(--text-primary);">create an account for more features</p>
        <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">unlock leaderboards, favorites & more</p>
      </div>
      <button class="auth-prompt-button" onclick="window.location.href='/login.html'">log in or sign up</button>
    </div>
    <div class="auth-progress-bar"></div>
  `;
  
  document.body.appendChild(popup);
  
  // Trigger animation
  setTimeout(() => {
    popup.classList.add('show');
  }, 10);
  
  // Auto-remove after duration
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 300);
  }, AUTH_PROMPT_DURATION);
}

// Show on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showAuthPrompt);
} else {
  showAuthPrompt();
}
