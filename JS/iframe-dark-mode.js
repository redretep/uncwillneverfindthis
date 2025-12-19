// Dark Mode for Game Iframes
function injectDarkModeIntoIframe(iframe) {
  if (!iframe || !iframe.contentDocument) return;
  
  const isDarkMode = (localStorage.getItem('selectedTheme') || 'dark') === 'dark';
  if (!isDarkMode) return; // Only inject dark mode if active
  
  try {
    const doc = iframe.contentDocument;
    const style = doc.createElement('style');
    style.textContent = `
      * { background-color: #000000 !important; color: #ffffff !important; }
      body { background-color: #000000 !important; color: #ffffff !important; }
      a { color: #8888ff !important; }
      button { background-color: #1a1a1a !important; color: #ffffff !important; border: 1px solid #333 !important; }
      input, textarea, select { background-color: #0a0a0a !important; color: #ffffff !important; border-color: #333 !important; }
      img { opacity: 0.9; }
    `;
    doc.head.appendChild(style);
  } catch (e) {
    console.warn('Could not inject dark mode into iframe (CORS or closed doc):', e);
  }
}

// Monitor for new iframes
function observeIframes() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'IFRAME') {
          setTimeout(() => injectDarkModeIntoIframe(node), 100);
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// Inject on load and when theme changes
function injectDarkModeOnAllIframes() {
  document.querySelectorAll('iframe').forEach(iframe => {
    setTimeout(() => injectDarkModeIntoIframe(iframe), 100);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectDarkModeOnAllIframes();
    observeIframes();
  });
} else {
  injectDarkModeOnAllIframes();
  observeIframes();
}

// Re-inject when theme toggles
const originalToggleTheme = window.toggleTheme;
window.toggleTheme = function() {
  originalToggleTheme.call(this);
  setTimeout(injectDarkModeOnAllIframes, 300); // After transition
};
