// script.js - Modern Personal Sharing Hub Script

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    const yearSpan = document.getElementById("current-year");
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mainNavList = document.getElementById("main-navigation-list");
    const siteHeader = document.getElementById("site-header");
    const animatedElements = document.querySelectorAll(".animate-on-scroll");

    // --- State ---
    let isMenuOpen = false;

    // --- Utility Functions ---
    const debounce = (func, wait = 15) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // --- Initialization Functions ---

    /** Updates copyright year */
    const setupCopyrightYear = () => {
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        } else {
            console.warn("Copyright year span not found.");
        }
    };

    /** Sets up mobile menu toggle */
    const setupMobileMenu = () => {
        if (mobileMenuToggle && mainNavList) {
            mobileMenuToggle.addEventListener("click", () => {
                isMenuOpen = !isMenuOpen;
                mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
                mainNavList.classList.toggle("active", isMenuOpen); // Use second arg for explicit state
                // Optional: Prevent body scroll when menu is open
                // document.body.style.overflow = isMenuOpen ? 'hidden' : '';
            });

            // Close menu when a link is clicked
            mainNavList.addEventListener('click', (e) => {
                if (e.target.matches('.nav-link') && isMenuOpen) {
                    isMenuOpen = false;
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mainNavList.classList.remove('active');
                    // document.body.style.overflow = '';
                }
            });

            // Close menu if window is resized while open
            window.addEventListener('resize', debounce(() => {
                if (window.innerWidth > 768 && isMenuOpen) {
                     isMenuOpen = false;
                     mobileMenuToggle.setAttribute('aria-expanded', 'false');
                     mainNavList.classList.remove('active');
                     // document.body.style.overflow = '';
                }
            }, 100));

        } else {
            console.warn("Mobile menu elements (toggle or list) not found for setup.");
        }
    };

    /** Adds shadow to sticky header on scroll */
    const setupStickyHeader = () => {
        if (!siteHeader) {
            console.warn("Site header element not found for sticky behavior.");
            return;
        }

        const handleScroll = () => {
            if (window.scrollY > 50) { // Add class after scrolling 50px
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', debounce(handleScroll, 10)); // Debounce for performance
        handleScroll(); // Initial check in case page loads scrolled
    };

    /** Sets up Intersection Observer for scroll animations */
    const setupScrollAnimations = () => {
        if (!animatedElements || animatedElements.length === 0) {
            console.log("No elements found for scroll animation.");
            return;
        }

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) {
            animatedElements.forEach((el) => el.classList.add("is-visible"));
            console.log("Reduced motion enabled, skipping scroll animations.");
            return;
        }

        const revealElement = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delayClass = Array.from(entry.target.classList).find(cls => cls.startsWith('delay-'));
                    const delay = delayClass ? parseInt(delayClass.split('-')[1]) * 100 : 0;

                    setTimeout(() => {
                        entry.target.classList.add("is-visible");
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        };

        const scrollObserver = new IntersectionObserver(revealElement, {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        });

        animatedElements.forEach((el) => {
            // Ensure base class is present (it's defined in CSS)
             if (!el.classList.contains('animate-on-scroll')) {
                 el.classList.add('animate-on-scroll');
             }
            scrollObserver.observe(el);
        });
        console.log(`Observing ${animatedElements.length} elements for scroll animations.`);
    };


    // --- Run Initializations ---
    setupCopyrightYear();
    setupMobileMenu();
    setupStickyHeader();
    setupScrollAnimations();

    // --- Zoom out hero section on scroll ---
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
        if (!heroSection) return;
        if (window.scrollY > 10) {
            heroSection.classList.add('zoomed-out');
        } else {
            heroSection.classList.remove('zoomed-out');
        }
    });

}); // End DOMContentLoaded
