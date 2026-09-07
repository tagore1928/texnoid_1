/**
 * TEXNOID — BESPOKE AGENCY INTERACTION ENGINE
 * Mobile Navigation & High-Performance Viewport Engine
 */

document.addEventListener('DOMContentLoaded', () => {
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

  // 2. Header Scroll Elevation State
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 3. Mobile Navigation Drawer Controls
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-actions a');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer if user presses Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // 4. Fail-Safe Scroll-Triggered Reveal Observer
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
      rootMargin: '50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Safety Fallback: Guarantee all elements become visible after 350ms
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }, 350);

  // 5. 3D Perspective Mouse-Tilt Effect (Desktop Only)
  if (window.innerWidth > 768) {
    const tiltElements = document.querySelectorAll('[data-tilt], .telemetry-card-wrapper');

    tiltElements.forEach(cardWrapper => {
      const card = cardWrapper.classList.contains('telemetry-card-wrapper') 
        ? cardWrapper.querySelector('.telemetry-card') 
        : cardWrapper;

      if (!card) return;

      const shine = card.querySelector('.card-shine, .card-glass-shine');
      const maxTilt = 8;

      cardWrapper.addEventListener('mousemove', (e) => {
        const rect = cardWrapper.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
        const mouseY = (e.clientY - rect.top - height / 2) / (height / 2);

        const rotateX = -mouseY * maxTilt;
        const rotateY = mouseX * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;

        if (shine) {
          const shineX = ((e.clientX - rect.left) / width) * 100;
          const shineY = ((e.clientY - rect.top) / height) * 100;
          shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)`;
        }
      });

      cardWrapper.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.4s ease-out';
        if (shine) {
          shine.style.background = '';
        }
      });

      cardWrapper.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.08s ease-out';
      });
    });
  }

  // 6. Hero Telemetry Metric Counters Animation
  const counters = document.querySelectorAll('[data-counter]');
  let hasAnimatedCounters = false;

  function animateCounters() {
    if (hasAnimatedCounters) return;
    hasAnimatedCounters = true;

    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-counter'));
      if (isNaN(target)) return;
      
      const duration = 1600;
      const isDecimal = target % 1 !== 0;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = easedProgress * target;

        counter.innerText = isDecimal ? currentValue.toFixed(2) : Math.floor(currentValue);

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counter.innerText = isDecimal ? target.toFixed(2) : target;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  // Trigger counters
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
      }
    }, { threshold: 0.1 });

    heroObserver.observe(heroSection);
  } else {
    animateCounters();
  }

  // 7. Dynamic Copyright Year
  const yearElement = document.getElementById('copyrightYear');
  if (yearElement) {
    yearElement.innerText = new Date().getFullYear();
  }
});
