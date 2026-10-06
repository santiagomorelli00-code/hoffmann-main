/* ============================================================
   HOFFMANN & PARTNER — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Header: transparent → solid on scroll ──────────────── */
  const header = document.getElementById('site-header');

  if (header) {
    const heroEl = document.querySelector('.hero');
    const logoImg = header.querySelector('.header-logo img');
    const LOGO_LIGHT = 'assets/logo-light.svg';
    const LOGO_DARK  = 'assets/logo.svg';
    const keepOriginalLogo = header.classList.contains('site-header--home');

    function setLogo(solid) {
      if (logoImg) logoImg.setAttribute('src', keepOriginalLogo || solid ? LOGO_DARK : LOGO_LIGHT);
    }

    function updateHeader() {
      const scrollY = window.scrollY;
      const threshold = heroEl ? heroEl.offsetHeight * 0.15 : 80;

      if (scrollY > threshold) {
        header.classList.remove('is-transparent');
        header.classList.add('is-solid');
        setLogo(true);
      } else {
        header.classList.remove('is-solid');
        header.classList.add('is-transparent');
        setLogo(false);
      }
    }

    // Set initial state
    if (heroEl) {
      header.classList.add('is-transparent');
      setLogo(false);
    } else {
      header.classList.add('is-solid');
      setLogo(true);
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* ── Mobile Menu ─────────────────────────────────────────── */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    function openMenu() {
      mobileMenu.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Menü schließen');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Menü öffnen');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ── Scroll Reveal (Intersection Observer) ───────────────── */
  if (!prefersReducedMotion) {
    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length > 0) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -40px 0px',
        }
      );

      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    }
  } else {
    // Reduce motion: show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── Active nav link highlight ───────────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a, .mobile-nav-list a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href === './' + currentPath)) {
      const parentLi = link.closest('li');
      if (parentLi) { parentLi.classList.add('is-active'); }
    }
  });

  /* ── Smooth scroll for in-page anchors ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 24;
        window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

})();
