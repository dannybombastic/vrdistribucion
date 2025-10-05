/**
 * Enhanced Hero MD3 JavaScript
 * Material Design 3 interactive enhancements for hero section
 */

(function() {
  'use strict';

  // MD3 Ripple Effect Implementation
  function createRipple(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Initialize ripple effects for interactive elements
  function initRippleEffects() {
    const interactiveElements = document.querySelectorAll('.md-interactive-button, .md-fab, .md-chip');
    
    interactiveElements.forEach(element => {
      element.addEventListener('click', function(e) {
        // Only create ripple if element doesn't already have one
        if (!this.querySelector('.ripple-effect')) {
          createRipple(this, e);
        }
      });
    });
  }

  // Enhanced scroll animations with Intersection Observer
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('md-animate-in');
          
          // Stagger animations for chips
          if (entry.target.classList.contains('md-chip')) {
            const index = parseInt(entry.target.style.getPropertyValue('--chip-index')) || 0;
            entry.target.style.animationDelay = `${index * 0.1}s`;
          }
        }
      });
    }, observerOptions);

    // Observe hero elements
    const heroElements = document.querySelectorAll('.md-hero__text h1, .md-hero__subtitle, .md-chip, .md-interactive-button, .md-hero__card');
    heroElements.forEach(el => observer.observe(el));
  }

  // Enhanced parallax effect for floating elements
  function initParallaxEffect() {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.pageYOffset;
      const heroSection = document.querySelector('.md-hero');
      
      if (!heroSection) return;

      const heroRect = heroSection.getBoundingClientRect();
      const heroHeight = heroSection.offsetHeight;
      const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / heroHeight));

      // Update floating elements with different speeds
      const floatingElements = document.querySelectorAll('.md-floating-element');
      floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = scrollProgress * 50 * speed;
        element.style.transform = `translateY(${yPos}px) scale(${1 - scrollProgress * 0.2})`;
      });

      // Update background pattern
      const hero = document.querySelector('.md-hero');
      if (hero) {
        hero.style.setProperty('--scroll-progress', scrollProgress);
      }

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Enhanced FAB interactions
  function initFABInteractions() {
    const fab = document.querySelector('.md-fab');
    if (!fab) return;

    // Add hover sound effect (optional)
    fab.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
    });

    fab.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });

    // Add click analytics (if needed)
    fab.addEventListener('click', function() {
      // Add analytics tracking here
      console.log('FAB clicked - WhatsApp contact');
    });
  }

  // Performance optimization: Use RAF for smooth animations
  function optimizeAnimations() {
    // Add will-change property to animated elements
    const animatedElements = document.querySelectorAll('.md-floating-element, .md-chip, .md-interactive-button');
    animatedElements.forEach(el => {
      el.style.willChange = 'transform, opacity';
    });

    // Remove will-change after animations complete
    setTimeout(() => {
      animatedElements.forEach(el => {
        el.style.willChange = 'auto';
      });
    }, 3000);
  }

  // Accessibility enhancements
  function initAccessibility() {
    // Add keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('.md-interactive-button, .md-fab, .md-chip');
    
    interactiveElements.forEach(element => {
      element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Add focus indicators
    interactiveElements.forEach(element => {
      element.addEventListener('focus', function() {
        this.classList.add('md-focused');
      });

      element.addEventListener('blur', function() {
        this.classList.remove('md-focused');
      });
    });
  }

  // Reduced motion support
  function respectReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Disable animations for users who prefer reduced motion
      const style = document.createElement('style');
      style.textContent = `
        .md-floating-element,
        .md-chip,
        .md-hero__card,
        .md-animate-background {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Initialize all enhancements
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all features
    initRippleEffects();
    initScrollAnimations();
    initParallaxEffect();
    initFABInteractions();
    optimizeAnimations();
    initAccessibility();
    respectReducedMotion();

    // Mark hero as loaded
    const heroContent = document.querySelector('.md-hero__content');
    if (heroContent) {
      setTimeout(() => {
        heroContent.classList.remove('md-loading');
        heroContent.classList.add('md-loaded');
      }, 100);
    }
  }

  // Auto-initialize
  init();

  // Expose public API if needed
  window.HeroMD3 = {
    createRipple,
    init
  };

})();

// Add necessary CSS for ripple effects
const rippleStyles = `
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .md-focused {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  .md-animate-in {
    animation: slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);
