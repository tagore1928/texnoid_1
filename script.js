/**
 * TEXNOID — BESPOKE AGENCY INTERACTION ENGINE
 * Mobile Navigation Drawer, Accessibility (Focus Management), 3D Tilt Physics, & Viewport Engine
 */

// Global Mobile Navigation Functions with Focus Management (Avoids aria-hidden console warnings)
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

  // Crucial Accessibility Fix: Blur focus from drawer elements BEFORE setting inert/hiding
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
  // Mark JS as loaded for animation observers
  document.documentElement.classList.add('js-loaded');

  // 1. Safe Lucide Icons Initialization with Fallback
  try {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (err) {
    console.warn('Lucide icons fallback active:', err);
  }

  // 2. Attach Mobile Drawer Event Listeners
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-actions a');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.toggleMobileDrawer();
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.closeMobileDrawer();
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      window.closeMobileDrawer();
    });
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

  // Guarantee all reveal elements become visible after 350ms
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }, 350);

  // 5. Enhanced 3D Tilt Physics Engine
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach(card => {
    const maxTilt = 12;
    const shine = card.querySelector('.card-shine, .card-glass-shine');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'none';

      if (shine) {
        const shineX = (x / rect.width) * 100;
        const shineY = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.22) 0%, transparent 65%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.4s ease-out';
      if (shine) {
        shine.style.background = '';
      }
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  // 6. Dynamic Copyright Year
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
