// Simple Consent Mode v2 banner
(function(){
  try {
    // Ensure gtag exists
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} // eslint-disable-line

    // Default: deny until user chooses
    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

    const KEY = 'cmpConsent';
    const stored = localStorage.getItem(KEY);

    const applyConsent = (granted) => {
      const state = granted ? 'granted' : 'denied';
      gtag('consent', 'update', {
        ad_storage: state,
        analytics_storage: state,
        ad_user_data: state,
        ad_personalization: state
      });
    };

    if (stored === 'accepted' || stored === 'rejected') {
      applyConsent(stored === 'accepted');
      return; // no banner
    }

    // Create banner
    const banner = document.createElement('div');
    banner.className = 'cmp-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'cookie consent');
    banner.innerHTML = `
      <div class="cmp-inner">
        <div class="cmp-text">
          we use cookies for ads and analytics. choose whether to allow personalized ads and measurement.
          see our <a href="privacy-policy.html">privacy policy</a>.
        </div>
        <div class="cmp-actions">
          <button type="button" class="cmp-btn cmp-reject" aria-label="reject cookies">reject</button>
          <button type="button" class="cmp-btn cmp-accept" aria-label="accept cookies">accept</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    const accept = banner.querySelector('.cmp-accept');
    const reject = banner.querySelector('.cmp-reject');

    accept.addEventListener('click', () => {
      localStorage.setItem(KEY, 'accepted');
      applyConsent(true);
      banner.remove();
    });
    reject.addEventListener('click', () => {
      localStorage.setItem(KEY, 'rejected');
      applyConsent(false);
      banner.remove();
    });
  } catch(e) {
    console.warn('CMP init error:', e);
  }
})();
