/**
 * TEXNOID — BESPOKE AGENCY INTERACTION ENGINE
 * Mobile Navigation Drawer, Enhanced 3D Tilt Physics, & Viewport Auto-Fit Engine
 */

// Global Mobile Navigation Functions (Accessible by inline HTML onclick handlers)
window.toggleMobileDrawer = function() {
  const drawer = document.getElementById('mobileDrawer');
  const btn = document.getElementById('mobileMenuBtn');
  if (!drawer) return;
  
  const isActive = drawer.classList.contains('active');
  if (isActive) {
    window.closeMobileDrawer();
  } else {
    window.openMobileDrawer();
  }
};

window.openMobileDrawer = function() {
  const drawer = document.getElementById('mobileDrawer');
  const btn = document.getElementById('mobileMenuBtn');
  if (!drawer) return;
  
  drawer.classList.add('active');
  drawer.setAttribute('aria-hidden', 'false');
  if (btn) btn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('drawer-open');
};

window.closeMobileDrawer = function() {
  const drawer = document.getElementById('mobileDrawer');
  const btn = document.getElementById('mobileMenuBtn');
  if (!drawer) return;

  drawer.classList.remove('active');
  drawer.setAttribute('aria-hidden', 'true');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('drawer-open');
};

document.addEventListener('DOMContentLoaded', () => {
  // Mark JS as loaded for reveal observers
  document.documentElement.classList.add('js-loaded');

  // 1. Safe Lucide Icons Initialization with Fallback
  try {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (err) {
    console.warn('Lucide icons fallback active:', err);
  }

  // 2. Header Scroll Elevation State
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

  // 3. Mobile Navigation Event Listeners
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-actions a');
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

  // 5. Enhanced 3D Tilt Hover Physics Engine
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach(card => {
    const maxTilt = 12; // Maximum tilt angle in degrees
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
});
