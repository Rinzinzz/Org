// script.js - Modern Personal Sharing Hub Script (Improved)
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References (graceful) ---
    const yearSpans = document.querySelectorAll('#current-year');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNavList = document.getElementById('main-navigation-list');
    const siteHeader = document.getElementById('site-header');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // --- State ---
    let isMenuOpen = false;

    // --- Utility: debounce with requestAnimationFrame friendly ---
    const debounce = (func, wait = 15) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    // Throttle using rAF for scroll
    const throttleRaf = (fn) => {
      let ticking = false;
      return function(...args) {
        if (!ticking) {
          requestAnimationFrame(() => {
            fn.apply(this, args);
            ticking = false;
          });
          ticking = true;
        }
      };
    };

    // --- 1. Copyright year (handles multiple spans, no error if missing) ---
    const setupCopyrightYear = () => {
      try {
        const y = String(new Date().getFullYear());
        if (yearSpans && yearSpans.length > 0) {
          yearSpans.forEach((el) => { if (el) el.textContent = y; });
        } else {
          const single = document.getElementById('current-year');
          if (single) single.textContent = y;
        }
      } catch (e) {
        console.warn('Copyright year setup failed:', e);
      }
    };

    // --- 2. Theme toggle with localStorage + prefers-color-scheme ---
    const setupTheme = () => {
      const STORAGE_KEY = 'org-theme';
      const applyTheme = (theme) => {
        if (theme === 'light' || theme === 'dark') {
          htmlEl.setAttribute('data-theme', theme);
          try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
        } else {
          htmlEl.removeAttribute('data-theme');
          try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
        }
        if (themeToggle) {
          const isLight = htmlEl.getAttribute('data-theme') === 'light' ||
            (!htmlEl.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: light)').matches);
          themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
          themeToggle.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
        }
      };

      // Init from storage or OS
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          applyTheme(saved);
        } else {
          // no saved: leave to CSS prefers-color-scheme; but set aria accordingly
          applyTheme(htmlEl.getAttribute('data-theme') || null);
          // ensure icon reflects OS
          if (!htmlEl.getAttribute('data-theme')) {
            // trigger aria update
            applyTheme(null);
            // remove again to keep auto
            htmlEl.removeAttribute('data-theme');
            // re-apply aria via second call
            const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            if (themeToggle) {
              themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
            }
          }
        }
      } catch (e) {
        console.warn('Theme init failed', e);
      }

      if (!themeToggle) {
        // not an error - some pages may not have toggle yet, fail gracefully
        return;
      }

      themeToggle.addEventListener('click', () => {
        try {
          const current = htmlEl.getAttribute('data-theme');
          // If no attribute, infer from computed OS
          let next;
          if (current === 'light') next = 'dark';
          else if (current === 'dark') next = 'light';
          else {
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            next = prefersLight ? 'dark' : 'light';
          }
          applyTheme(next);
        } catch (e) {
          console.warn('Theme toggle failed', e);
        }
      });

      // Listen to OS changes if user hasn't set manual preference
      try {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (!saved) {
            if (themeToggle) {
              themeToggle.setAttribute('aria-label', e.matches ? 'Switch to dark theme' : 'Switch to light theme');
            }
          }
        });
      } catch (_) {}
    };

    // --- 3. Mobile menu (graceful if elements missing) ---
    const setupMobileMenu = () => {
      if (!mobileMenuToggle || !mainNavList) {
        // Gracefully do nothing, but warn once for debugging
        if (!mobileMenuToggle) console.warn('Mobile menu toggle #mobile-menu-toggle not found - navigation will remain always visible.');
        if (!mainNavList) console.warn('Main nav list #main-navigation-list not found.');
        return;
      }
      try {
        mobileMenuToggle.addEventListener('click', () => {
          isMenuOpen = !isMenuOpen;
          mobileMenuToggle.setAttribute('aria-expanded', String(isMenuOpen));
          mainNavList.classList.toggle('active', isMenuOpen);
          document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        });

        mainNavList.addEventListener('click', (e) => {
          const target = e.target;
          if (target && target.matches && target.matches('.nav-link') && isMenuOpen) {
            isMenuOpen = false;
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mainNavList.classList.remove('active');
            document.body.style.overflow = '';
          }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && isMenuOpen) {
            isMenuOpen = false;
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mainNavList.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuToggle.focus();
          }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
          if (isMenuOpen && !mainNavList.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            isMenuOpen = false;
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mainNavList.classList.remove('active');
            document.body.style.overflow = '';
          }
        });

        window.addEventListener('resize', debounce(() => {
          if (window.innerWidth > 768 && isMenuOpen) {
            isMenuOpen = false;
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mainNavList.classList.remove('active');
            document.body.style.overflow = '';
          }
        }, 100));
      } catch (e) {
        console.warn('Mobile menu setup failed:', e);
      }
    };

    // --- 4. Sticky header with shadow (throttled via rAF + debounce fallback) ---
    const setupStickyHeader = () => {
      if (!siteHeader) {
        console.warn('Site header #site-header not found for sticky behavior.');
        return;
      }
      try {
        const handleScroll = () => {
          if (window.scrollY > 10) siteHeader.classList.add('scrolled');
          else siteHeader.classList.remove('scrolled');
        };
        const throttled = throttleRaf(handleScroll);
        window.addEventListener('scroll', throttled, { passive: true });
        handleScroll();
      } catch (e) {
        console.warn('Sticky header setup failed', e);
      }
    };

    // --- 5. Scroll animations (IntersectionObserver, perf improved) ---
    const setupScrollAnimations = () => {
      if (!animatedElements || animatedElements.length === 0) {
        return;
      }
      // Fallback for headless/file:// where IntersectionObserver may not fire: reveal all after 1s
      const fallbackTimer = setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll:not(.is-visible)').forEach((el) => el.classList.add('is-visible'));
      }, 1000);
      try {
        // If IntersectionObserver not supported, fallback will handle it
        if (typeof IntersectionObserver === 'undefined') {
          document.querySelectorAll('.animate-on-scroll').forEach((el) => el.classList.add('is-visible'));
          return;
        }
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) {
          animatedElements.forEach((el) => el.classList.add('is-visible'));
          clearTimeout(fallbackTimer);
          return;
        }
        const revealElement = (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delayClass = Array.from(entry.target.classList).find((cls) => cls.startsWith('delay-'));
              const delay = delayClass ? parseInt(delayClass.split('-')[1], 10) * 100 : 0;
              if (delay > 0) {
                setTimeout(() => entry.target.classList.add('is-visible'), delay);
              } else {
                entry.target.classList.add('is-visible');
              }
              observer.unobserve(entry.target);
            }
          });
        };
        const scrollObserver = new IntersectionObserver(revealElement, {
          root: null,
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        });
        animatedElements.forEach((el) => {
          if (!el.classList.contains('animate-on-scroll')) el.classList.add('animate-on-scroll');
          scrollObserver.observe(el);
        });
      } catch (e) {
        // Fallback: show all
        animatedElements.forEach((el) => el.classList.add('is-visible'));
        console.warn('Scroll animation setup failed, fallback to visible:', e);
      }
    };

    // --- 6. Hero zoom on scroll (rAF throttled, passive) ---
    const setupHeroZoom = () => {
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;
      try {
        const onScroll = () => {
          if (window.scrollY > 10) heroSection.classList.add('zoomed-out');
          else heroSection.classList.remove('zoomed-out');
        };
        window.addEventListener('scroll', throttleRaf(onScroll), { passive: true });
      } catch (e) {
        console.warn('Hero zoom setup failed', e);
      }
    };

    // --- Run all inits safely ---
    try { setupCopyrightYear(); } catch(e){ console.warn(e); }
    try { setupTheme(); } catch(e){ console.warn(e); }
    try { setupMobileMenu(); } catch(e){ console.warn(e); }
    try { setupStickyHeader(); } catch(e){ console.warn(e); }
    try { setupScrollAnimations(); } catch(e){ console.warn(e); }
    try { setupHeroZoom(); } catch(e){ console.warn(e); }
  });
})();
