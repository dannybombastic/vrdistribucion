/**
 * Enhanced Gallery Hero JavaScript
 * Material Design 3 interactions for gallery hero section
 */

(function() {
  'use strict';

  // Hero animation controller
  class GalleryHeroMD3 {
    constructor() {
      this.hero = document.querySelector('.md-gallery-header');
      this.heroContent = document.querySelector('.md-hero__content');
      this.fab = document.querySelector('.md-gallery-fab');
      this.stats = document.querySelectorAll('.md-gallery-stat');
      this.buttons = document.querySelectorAll('.md-gallery-btn');
      this.floatingIcons = document.querySelectorAll('.md-gallery-floating-icon');
      
      this.init();
    }

    init() {
      this.setupScrollAnimations();
      this.setupButtonInteractions();
      this.setupFABBehavior();
      this.setupParallax();
      this.initializeHero();
    }

    // Configurar animaciones de scroll
    setupScrollAnimations() {
      if (!('IntersectionObserver' in window)) return;

      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('md-animate-in');
            
            // Animar estadísticas en secuencia
            if (entry.target.classList.contains('md-gallery-stats')) {
              this.animateStats();
            }
          }
        });
      }, observerOptions);

      // Observar elementos del hero
      const elements = [
        this.hero,
        document.querySelector('.md-gallery-stats'),
        document.querySelector('.md-gallery-actions')
      ];

      elements.forEach(el => {
        if (el) observer.observe(el);
      });
    }

    // Animar estadísticas con contador
    animateStats() {
      this.stats.forEach((stat, index) => {
        const numberElement = stat.querySelector('.md-gallery-stat__number');
        const finalNumber = numberElement.textContent;
        const isPercentage = finalNumber.includes('%');
        const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
        
        // Animar con retraso escalonado
        setTimeout(() => {
          this.animateCounter(numberElement, numericValue, isPercentage);
          stat.classList.add('md-stat-animate');
        }, index * 200);
      });
    }

    // Contador animado para números
    animateCounter(element, finalValue, isPercentage) {
      let currentValue = 0;
      const increment = finalValue / 50; // 50 frames
      const duration = 1500; // 1.5 segundos
      const stepTime = duration / 50;

      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
          currentValue = finalValue;
          clearInterval(timer);
        }
        
        const displayValue = Math.floor(currentValue);
        element.textContent = isPercentage ? `${displayValue}%` : 
                             displayValue >= 100 ? `${displayValue}+` : 
                             displayValue.toString();
      }, stepTime);
    }

    // Configurar interacciones de botones
    setupButtonInteractions() {
      this.buttons.forEach(button => {
        // Efecto ripple
        button.addEventListener('click', (e) => {
          this.createRipple(button, e);
        });

        // Tracking de analytics (opcional)
        button.addEventListener('click', () => {
          const action = button.textContent.trim();
          console.log(`Gallery Hero Button clicked: ${action}`);
          
          // Aquí se puede añadir tracking de analytics
          // gtag('event', 'click', { 'event_category': 'Gallery Hero', 'event_label': action });
        });
      });
    }

    // Crear efecto ripple
    createRipple(element, event) {
      const ripple = document.createElement('div');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
        z-index: 10;
      `;

      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    // Comportamiento del FAB
    setupFABBehavior() {
      if (!this.fab) return;

      let isVisible = false;

      // Mostrar/ocultar FAB basado en scroll
      const toggleFAB = () => {
        const scrollY = window.pageYOffset;
        const shouldShow = scrollY > 300;

        if (shouldShow && !isVisible) {
          this.fab.style.transform = 'scale(1)';
          this.fab.style.opacity = '1';
          isVisible = true;
        } else if (!shouldShow && isVisible) {
          this.fab.style.transform = 'scale(0)';
          this.fab.style.opacity = '0';
          isVisible = false;
        }
      };

      // Configurar estado inicial
      this.fab.style.transform = 'scale(0)';
      this.fab.style.opacity = '0';
      this.fab.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

      // Listener de scroll throttled
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            toggleFAB();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Efecto hover mejorado
      this.fab.addEventListener('mouseenter', () => {
        this.fab.style.transform += ' scale(1.1)';
      });

      this.fab.addEventListener('mouseleave', () => {
        this.fab.style.transform = this.fab.style.transform.replace(' scale(1.1)', '');
      });
    }

    // Efecto parallax sutil
    setupParallax() {
      let ticking = false;

      const updateParallax = () => {
        const scrollY = window.pageYOffset;
        const heroHeight = this.hero.offsetHeight;
        const heroRect = this.hero.getBoundingClientRect();
        
        // Solo aplicar parallax cuando el hero está visible
        if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
          const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / heroHeight));
          
          // Mover iconos flotantes a diferentes velocidades
          this.floatingIcons.forEach((icon, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = scrollProgress * 30 * speed;
            icon.style.transform = `translateY(${yPos}px)`;
          });

          // Efecto en el fondo
          if (this.hero) {
            this.hero.style.setProperty('--scroll-progress', scrollProgress);
          }
        }

        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      };

      window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Inicializar hero
    initializeHero() {
      // Remover estado de carga y añadir loaded
      setTimeout(() => {
        if (this.heroContent) {
          this.heroContent.classList.remove('md-loading');
          this.heroContent.classList.add('md-loaded');
          this.hero.classList.add('md-loaded');
        }
      }, 200);

      // Precargar imágenes críticas si las hay
      this.preloadCriticalImages();
    }

    // Precargar imágenes críticas
    preloadCriticalImages() {
      // Si hay imágenes críticas en el hero, precargarlas aquí
      const criticalImages = [];
      
      criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }

    // Manejo de resize
    handleResize() {
      // Reajustar animaciones si es necesario en resize
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        // Recalcular elementos si es necesario
        console.log('Gallery hero resize handled');
      }, 250);
    }
  }

  // Auto-inicializar cuando el DOM esté listo
  function initGalleryHero() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        new GalleryHeroMD3();
      });
    } else {
      new GalleryHeroMD3();
    }
  }

  // Verificar si estamos en la página de galería
  if (document.querySelector('.md-gallery-header')) {
    initGalleryHero();
  }

  // Estilos CSS adicionales para animaciones
  const additionalStyles = `
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    .md-stat-animate {
      animation: stat-bounce 0.6s ease-out;
    }

    @keyframes stat-bounce {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .md-gallery-btn {
      position: relative;
      overflow: hidden;
    }

    /* Animación de entrada mejorada */
    .md-gallery-header.md-loaded .md-gallery-header__title {
      animation: title-entrance 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .md-gallery-header.md-loaded .md-gallery-header__subtitle {
      animation: subtitle-entrance 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
    }

    .md-gallery-header.md-loaded .md-gallery-stats {
      animation: stats-entrance 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
    }

    .md-gallery-header.md-loaded .md-gallery-actions {
      animation: actions-entrance 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
    }

    @keyframes title-entrance {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes subtitle-entrance {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes stats-entrance {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes actions-entrance {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Estados iniciales para animaciones */
    .md-gallery-header__title,
    .md-gallery-header__subtitle,
    .md-gallery-stats,
    .md-gallery-actions {
      opacity: 0;
    }
  `;

  // Inyectar estilos adicionales
  const styleSheet = document.createElement('style');
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);

})();
