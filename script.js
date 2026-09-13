/**
 * TEXNOID — BESPOKE AGENCY INTERACTION ENGINE
 * Theme Engine (Light Default / Dark Mode), Mobile Navigation Drawer, Viewport Scroll Reveal,
 * 4-Phase Interactive Timeline Progress Beam & Radial Mouse Spotlight Glow
 */

// Theme Engine Switcher
window.toggleTheme = function() {
  const isDark = document.documentElement.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.className = newTheme;
  localStorage.setItem('texnoid_theme', newTheme);
};

// Global Mobile Navigation Functions
window.openMobileDrawer = function() {
  const drawer = document.getElementById('mobileDrawer');
  const btn = document.getElementById('mobileMenuBtn');
  if (!drawer) return;

  drawer.removeAttribute('inert');
  drawer.classList.add('active');
  if (btn) btn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('drawer-open');

  const closeBtn = document.getElementById('drawerCloseBtn');
  if (closeBtn) closeBtn.focus();
};

window.closeMobileDrawer = function() {
  const drawer = document.getElementById('mobileDrawer');
  const btn = document.getElementById('mobileMenuBtn');
  if (!drawer) return;

  if (document.activeElement && drawer.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  drawer.classList.remove('active');
  drawer.setAttribute('inert', '');
  document.body.classList.remove('drawer-open');

  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }
};

window.toggleMobileDrawer = function() {
  const drawer = document.getElementById('mobileDrawer');
  if (!drawer) return;

  if (drawer.classList.contains('active')) {
    window.closeMobileDrawer();
  } else {
    window.openMobileDrawer();
  }
};

function initApp() {
  // Mark JS loaded
  document.documentElement.classList.add('js-loaded');

  // 1. Safe Lucide Icons Initialization
  try {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (err) {
    console.warn('Lucide icons fallback:', err);
  }

  // 2. Attach Mobile Drawer Event Listeners with Touch Support
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-actions a');

  function bindTouchAndClick(element, handler) {
    if (!element) return;
    let touchHandled = false;

    element.addEventListener('touchend', (e) => {
      touchHandled = true;
      e.preventDefault();
      handler(e);
      setTimeout(() => { touchHandled = false; }, 400);
    }, { passive: false });

    element.addEventListener('click', (e) => {
      if (!touchHandled) {
        e.preventDefault();
        handler(e);
      }
    });
  }

  bindTouchAndClick(mobileMenuBtn, () => window.toggleMobileDrawer());
  bindTouchAndClick(drawerCloseBtn, () => window.closeMobileDrawer());

  drawerLinks.forEach(link => {
    bindTouchAndClick(link, () => window.closeMobileDrawer());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeMobileDrawer();
    }
  });

  // 3. Header Scroll Elevation State
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 25) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 4. Fail-Safe Scroll Reveal Observer
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-reveal-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, parseInt(delay, 10));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }, 350);

  // 5. Interactive 4-Phase Vertical Timeline Beam
  const timelineTrack = document.querySelector('.timeline-track');
  const progressBeam = document.getElementById('timelineProgressBeam');

  if (timelineTrack && progressBeam) {
    const updateTimelineBeam = () => {
      const trackRect = timelineTrack.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startPoint = windowHeight * 0.45;
      const trackTop = trackRect.top;
      const trackHeight = trackRect.height;
      
      if (trackTop > startPoint) {
        progressBeam.style.height = '0%';
      } else {
        const scrolledDistance = startPoint - trackTop;
        const progressRatio = Math.min(1, Math.max(0, scrolledDistance / trackHeight));
        progressBeam.style.height = `${(progressRatio * 100).toFixed(1)}%`;
      }
    };

    window.addEventListener('scroll', updateTimelineBeam, { passive: true });
    window.addEventListener('resize', updateTimelineBeam, { passive: true });
    updateTimelineBeam();
  }

  // 6. Mouse Coordinate Radial Spotlight Glow on Phase Containers
  const phaseCards = document.querySelectorAll('.phase-card');

  phaseCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 7. Dynamic Copyright Year
  const yearElement = document.getElementById('copyrightYear');
  if (yearElement) {
    yearElement.innerText = new Date().getFullYear();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
