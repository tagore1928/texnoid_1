/**
 * TEXNOID — BESPOKE AGENCY INTERACTION ENGINE
 * Handles Lucide icons, 3D tilt tracking physics, scroll reveal observers,
 * telemetry metric counters, and mobile drawer menu.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Header Scroll Elevation State
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-actions a');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileDrawer.classList.toggle('active');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. 3D Perspective Mouse-Tilt Effect for Portfolio Cards & Hero Visual
  const tiltElements = document.querySelectorAll('[data-tilt], .telemetry-card-wrapper');

  tiltElements.forEach(cardWrapper => {
    const card = cardWrapper.classList.contains('telemetry-card-wrapper') 
      ? cardWrapper.querySelector('.telemetry-card') 
      : cardWrapper;

    const shine = card.querySelector('.card-shine, .card-glass-shine');
    const maxTilt = 10; // degrees

    cardWrapper.addEventListener('mousemove', (e) => {
      const rect = cardWrapper.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Calculate mouse position relative to center of element (-1 to 1)
      const mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
      const mouseY = (e.clientY - rect.top - height / 2) / (height / 2);

      const rotateX = -mouseY * maxTilt;
      const rotateY = mouseX * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (shine) {
        // Calculate shine spotlight position in percentage
        const shineX = ((e.clientX - rect.left) / width) * 100;
        const shineY = ((e.clientY - rect.top) / height) * 100;
        shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.18) 0%, transparent 60%)`;
      }
    });

    cardWrapper.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      if (shine) {
        shine.style.background = '';
      }
    });

    cardWrapper.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });

  // 5. Scroll-Triggered Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('[data-reveal]');
  
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
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Hero Telemetry Metric Counters Animation
  const counters = document.querySelectorAll('[data-counter]');
  let hasAnimatedCounters = false;

  function animateCounters() {
    if (hasAnimatedCounters) return;
    hasAnimatedCounters = true;

    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-counter'));
      const duration = 1800; // ms
      const isDecimal = target % 1 !== 0;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        // Ease out cubic function
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

  // Trigger counters when hero section is visible
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
      }
    }, { threshold: 0.2 });

    heroObserver.observe(heroSection);
  }

  // 7. Dynamic Copyright Year
  const yearElement = document.getElementById('copyrightYear');
  if (yearElement) {
    yearElement.innerText = new Date().getFullYear();
  }
});
