/**
 * TEXNOID — BESPOKE AGENCY INTERACTION ENGINE
 * Robust, Production-Hardened Execution with Fail-Safe Visibility
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

  // 3. Mobile Navigation Drawer Toggle & Icon Swap
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-actions a');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;
      
      mobileMenuBtn.setAttribute('aria-expanded', String(nextState));
      mobileDrawer.classList.toggle('active', nextState);
      document.body.style.overflow = nextState ? 'hidden' : '';

      // Swap menu icon to X icon if lucide is available
      const menuIcon = mobileMenuBtn.querySelector('[data-lucide], i');
      if (menuIcon) {
        menuIcon.setAttribute('data-lucide', nextState ? 'x' : 'menu');
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
        }
      }
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        const menuIcon = mobileMenuBtn.querySelector('[data-lucide], i');
        if (menuIcon) {
          menuIcon.setAttribute('data-lucide', 'menu');
          if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
          }
        }
      });
    });
  }

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
    // Fallback for browsers without IntersectionObserver support
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Safety Fallback: Guarantee all elements become visible after 400ms regardless of scroll state
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }, 400);

  // 5. 3D Perspective Mouse-Tilt Effect (Desktop Only)
  if (window.innerWidth > 768) {
    const tiltElements = document.querySelectorAll('[data-tilt], .telemetry-card-wrapper');

    tiltElements.forEach(cardWrapper => {
      const card = cardWrapper.classList.contains('telemetry-card-wrapper') 
        ? cardWrapper.querySelector('.telemetry-card') 
        : cardWrapper;

      if (!card) return;

      const shine = card.querySelector('.card-shine, .card-glass-shine');
      const maxTilt = 8; // degrees

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
