/**
 * Theme Switcher
 * Handles theme selection, application, and persistence
 */

// Default theme identifier
const DEFAULT_THEME = 'dark';

// Apply theme to document
function applyTheme(themeId) {
  const theme = getThemeById(themeId);
  if (!theme) return;
  
  const root = document.documentElement;
  
  // Apply all color variables
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--primary-dark', theme.colors.primaryDark);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--success', theme.colors.success);
  
  // Background colors
  root.style.setProperty('--bg-dark', theme.colors.bgDark);
  root.style.setProperty('--bg-card', theme.colors.bgCard);
  root.style.setProperty('--bg-elevated', theme.colors.bgElevated);
  root.style.setProperty('--bg-topbar', theme.colors.bgTopbar);
  root.style.setProperty('--bg-modal', theme.colors.bgModal);
  root.style.setProperty('--bg-modal-header', theme.colors.bgModalHeader);
  
  // Text colors
  root.style.setProperty('--text-primary', theme.colors.textPrimary);
  root.style.setProperty('--text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--text-muted', theme.colors.textMuted);
  root.style.setProperty('--text-topbar', theme.colors.textTopbar);
  root.style.setProperty('--text-title', theme.colors.textTitle);
  root.style.setProperty('--text-game-card', theme.colors.textGameCard);
  root.style.setProperty('--text-modal', theme.colors.textModal);
  root.style.setProperty('--text-modal-header', theme.colors.textModalHeader);
  
  // Border colors
  root.style.setProperty('--border-modal', theme.colors.borderModal);
  root.style.setProperty('--border-topbar', theme.colors.borderTopbar);
  
  // Search bar colors
  root.style.setProperty('--bg-search-bar', theme.colors.bgSearchBar);
  root.style.setProperty('--bg-search-bar-focus', theme.colors.bgSearchBarFocus);
  root.style.setProperty('--border-search-bar', theme.colors.borderSearchBar);
  
  // Status colors
  root.style.setProperty('--color-in-game', theme.colors.colorInGame);
  root.style.setProperty('--color-online', theme.colors.colorOnline);
  
  // Update theme toggle icon
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = themeId === 'dark' ? '🌙' : '☀️';
  }
  
  // Save theme preference to localStorage
  localStorage.setItem('selectedTheme', themeId);
}

// Toggle between dark and light themes
function toggleTheme() {
  const currentTheme = localStorage.getItem('selectedTheme') || DEFAULT_THEME;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

// Initialize theme on page load
function initializeTheme() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('selectedTheme');
  // Default to dark if no saved theme or if it was 'pride'
  const themeToApply = (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : DEFAULT_THEME;
  
  applyTheme(themeToApply);
}

// Set up theme toggle button
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  // Add click event listener
  themeToggle.addEventListener('click', toggleTheme);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupThemeToggle();
  });
} else {
  initializeTheme();
  setupThemeToggle();
}
