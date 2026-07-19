/**
 * Jasmine Mohamed — Portfolio Website
 * Vanilla JavaScript — Interactions & Animations
 */

(function () {
  'use strict';

  /* ========================================
     DOM Elements
     ======================================== */

  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('theme-toggle');
  const scrollTopBtn = document.getElementById('scroll-top');
  const typewriterEl = document.getElementById('typewriter');
  const testimonialTrack = document.getElementById('testimonial-track');
  const testimonialPrev = document.getElementById('testimonial-prev');
  const testimonialNext = document.getElementById('testimonial-next');
  const testimonialDots = document.getElementById('testimonial-dots');
  const skillCards = document.querySelectorAll('.skill-card[data-progress]');
  const revealElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in');
  const rippleButtons = document.querySelectorAll('.ripple');
  const sections = document.querySelectorAll('section[id]');

  /* ========================================
     Theme Toggle (Dark / Light Mode)
     ======================================== */

  const THEME_KEY = 'portfolio-theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fas fa-moon';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      icon.className = 'fas fa-sun';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    applyTheme(getPreferredTheme());
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ========================================
     Sticky Navbar & Blur on Scroll
     ======================================== */

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    updateActiveNavLink();
  }

  /* ========================================
     Active Nav Link Highlighting
     ======================================== */

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + header.offsetHeight + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ========================================
     Mobile Navigation
     ======================================== */

  function initMobileNav() {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ========================================
     Smooth Scroll for Nav Links
     ======================================== */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========================================
     Typewriter Animation
     ======================================== */

  const typewriterPhrases = [
    'German Speaker',
    'Video Production',
    'AI Specialist'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeWriter() {
    const currentPhrase = typewriterPhrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
      typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
  }

  /* ========================================
     Scroll Reveal (Intersection Observer)
     ======================================== */

  function initScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ========================================
     Progress Bar Animation
     ======================================== */

  function initProgressBars() {
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const progress = card.getAttribute('data-progress');
            const fill = card.querySelector('.progress-fill');
            if (fill) {
              setTimeout(() => {
                fill.style.width = `${progress}%`;
              }, 200);
            }
            progressObserver.unobserve(card);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillCards.forEach((card) => progressObserver.observe(card));
  }

  /* ========================================
     Testimonial Carousel
     ======================================== */

  let currentSlide = 0;
  let autoplayInterval;
  const slides = document.querySelectorAll('.testimonial-slide');
  const totalSlides = slides.length;

  function createDots() {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      testimonialDots.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = testimonialDots.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (index + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    updateDots();
    resetAutoplay();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  function initTestimonialSlider() {
    if (totalSlides === 0) return;
    createDots();
    testimonialPrev.addEventListener('click', prevSlide);
    testimonialNext.addEventListener('click', nextSlide);
    startAutoplay();

    testimonialTrack.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    testimonialTrack.addEventListener('mouseleave', startAutoplay);
  }

  /* ========================================
     Button Ripple Effect
     ======================================== */

  function initRippleEffect() {
    rippleButtons.forEach((button) => {
      button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);

        ripple.classList.add('ripple-effect');
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        this.appendChild(ripple);

        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

  /* ========================================
     Mouse Hover Glow on Cards
     ======================================== */

  function initCardGlow() {
    const cards = document.querySelectorAll('.glass-card, .service-card, .project-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  /* ========================================
     Initialize Everything
     ======================================== */

  function init() {
    initTheme();
    initMobileNav();
    initSmoothScroll();
    initScrollReveal();
    initProgressBars();
    initTestimonialSlider();
    initRippleEffect();
    initCardGlow();

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (typewriterEl) {
      typeWriter();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
