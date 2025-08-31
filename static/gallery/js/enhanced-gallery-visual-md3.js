/**
 * Enhanced Gallery Visual Effects - Material Design 3
 * Micro-interacciones y efectos visuales avanzados
 */

class VRGalleryVisualEnhancer {
  constructor() {
    this.isTouch = 'ontouchstart' in window;
    this.animations = new Map();
    this.observers = new Map();
    
    this.init();
  }

  /**
   * Helper para compatibilidad de selectores
   */
  elementMatches(element, selector) {
    if (!element || !element.nodeType || element.nodeType !== 1) return false;
    
    const matches = element.matches || 
                   element.matchesSelector || 
                   element.webkitMatchesSelector || 
                   element.mozMatchesSelector || 
                   element.msMatchesSelector;
    
    return matches ? matches.call(element, selector) : false;
  }

  /**
   * Helper para buscar elemento padre que coincida con selector
   */
  findParentMatch(element, selector) {
    let current = element;
    while (current && current.nodeType === 1) {
      if (this.elementMatches(current, selector)) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  init() {
    this.setupIntersectionObserver();
    this.setupMicroInteractions();
    this.setupParallaxEffects();
    this.setupRippleEffects();
    this.setupMagneticButtons();
    this.setupPageLoadAnimation();
    
    console.log('🎨 Enhanced Gallery Visual Effects activadas');
  }

  /**
   * Animación de carga de página
   */
  setupPageLoadAnimation() {
    // Animar elementos del hero
    const heroElements = document.querySelectorAll('.md-gallery-hero h1, .md-gallery-hero p, .md-gallery-stats, .md-gallery-actions');
    heroElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = `all ${this.getRandomDuration(500, 800)}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 150);
    });

    // Animar elementos flotantes
    const floatingIcons = document.querySelectorAll('.md-gallery-floating-icon');
    floatingIcons.forEach((icon, index) => {
      icon.style.opacity = '0';
      icon.style.transform = 'scale(0) rotate(180deg)';
      
      setTimeout(() => {
        icon.style.transition = 'all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        icon.style.opacity = '0.7';
        icon.style.transform = 'scale(1) rotate(0deg)';
      }, 1000 + index * 200);
    });

    // Efecto de escritura para el título
    this.setupTypewriterEffect();
  }

  /**
   * Efecto de escritura para el título
   */
  setupTypewriterEffect() {
    const title = document.querySelector('.md-gallery-hero h1');
    if (!title) return;

    const originalText = title.textContent;
    title.textContent = '';
    title.style.opacity = '1';

    let index = 0;
    const typeWriter = () => {
      if (index < originalText.length) {
        title.textContent += originalText.charAt(index);
        index++;
        setTimeout(typeWriter, this.getRandomDuration(50, 120));
      }
    };

    setTimeout(typeWriter, 800);
  }

  /**
   * Generar duración aleatoria
   */
  getRandomDuration(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Observer para animaciones de entrada
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCardEntry(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.observers.set('cardEntry', observer);
    this.observeNewCards();
  }

  /**
   * Observar nuevas cards cuando se agregan al DOM
   */
  observeNewCards() {
    const cards = document.querySelectorAll('.md-gallery-card:not(.observed)');
    const observer = this.observers.get('cardEntry');
    
    cards.forEach(card => {
      card.classList.add('observed');
      observer.observe(card);
    });
  }

  /**
   * Animación de entrada para cards
   */
  animateCardEntry(card) {
    if (!card) return;
    
    const delay = Math.random() * 200; // Delay aleatorio para efecto cascada
    
    card.style.setProperty('--entry-delay', `${delay}ms`);
    card.classList.add('md-animate-fade-in');
    
    // Efecto de "breathing" sutil
    setTimeout(() => {
      this.addBreathingEffect(card);
    }, delay + 300);
  }

  /**
   * Efecto de "breathing" muy sutil
   */
  addBreathingEffect(card) {
    if (this.isTouch || !card) return; // Evitar en dispositivos táctiles
    
    const breathingKeyframes = [
      { transform: 'scale(1)', filter: 'brightness(1)' },
      { transform: 'scale(1.001)', filter: 'brightness(1.02)' },
      { transform: 'scale(1)', filter: 'brightness(1)' }
    ];

    const breathingOptions = {
      duration: 4000,
      iterations: Infinity,
      easing: 'ease-in-out'
    };

    try {
      this.animations.set(card, card.animate(breathingKeyframes, breathingOptions));
    } catch (error) {
      console.warn('Animation not supported:', error);
    }
  }

  /**
   * Micro-interacciones para tabs y botones
   */
  setupMicroInteractions() {
    // Solo efectos visuales para clicks, NO interceptar la funcionalidad
    document.addEventListener('click', (e) => {
      const tabElement = this.elementMatches(e.target, '.md-tab') ? e.target : this.findParentMatch(e.target, '.md-tab');
      if (tabElement) {
        // Solo efectos visuales, no interferir con la funcionalidad
        this.animateTabSwitch(tabElement);
      }
      
      const cardElement = this.elementMatches(e.target, '.md-gallery-card') ? e.target : this.findParentMatch(e.target, '.md-gallery-card');
      if (cardElement) {
        // Solo efectos visuales, no interferir con la funcionalidad
        this.animateCardClick(cardElement);
      }
    }, { passive: true }); // Usar passive para no interferir

    // Efecto hover mejorado para tabs
    document.addEventListener('mouseenter', (e) => {
      if (this.elementMatches(e.target, '.md-tab') && !e.target.classList.contains('md-tab--active')) {
        this.animateTabHover(e.target, true);
      }
    }, { passive: true, capture: true });

    document.addEventListener('mouseleave', (e) => {
      if (this.elementMatches(e.target, '.md-tab') && !e.target.classList.contains('md-tab--active')) {
        this.animateTabHover(e.target, false);
      }
    }, { passive: true, capture: true });
  }

  /**
   * Animación para cambio de tab
   */
  animateTabSwitch(tab) {
    if (!tab) return;
    
    // Solo efecto de "pulse" en el tab activo, no tocar la galería
    const pulseKeyframes = [
      { transform: 'scale(1)', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)' },
      { transform: 'scale(1.05)', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.24)' },
      { transform: 'scale(1)', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)' }
    ];

    try {
      tab.animate(pulseKeyframes, {
        duration: 300,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      });
    } catch (error) {
      console.warn('Tab animation not supported:', error);
    }

    // No animar la galería aquí, dejar que la galería principal maneje eso
  }

  /**
   * Animación hover para tabs
   */
  animateTabHover(tab, isEntering) {
    if (!tab) return;
    
    const keyframes = isEntering ? [
      { transform: 'scale(1) translateY(0)', filter: 'brightness(1)' },
      { transform: 'scale(1.02) translateY(-1px)', filter: 'brightness(1.1)' }
    ] : [
      { transform: 'scale(1.02) translateY(-1px)', filter: 'brightness(1.1)' },
      { transform: 'scale(1) translateY(0)', filter: 'brightness(1)' }
    ];

    try {
      tab.animate(keyframes, {
        duration: 200,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        fill: 'forwards'
      });
    } catch (error) {
      console.warn('Tab hover animation not supported:', error);
    }
  }

  /**
   * Animación de click en card
   */
  animateCardClick(card) {
    if (!card) return;
    
    const clickKeyframes = [
      { transform: 'scale(1)', filter: 'brightness(1)' },
      { transform: 'scale(0.98)', filter: 'brightness(1.1)' },
      { transform: 'scale(1.02)', filter: 'brightness(1.05)' },
      { transform: 'scale(1)', filter: 'brightness(1)' }
    ];

    try {
      card.animate(clickKeyframes, {
        duration: 400,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      });
    } catch (error) {
      console.warn('Card click animation not supported:', error);
    }
  }

  /**
   * Transición de galería
   */
  animateGalleryTransition(gallery, direction) {
    if (!gallery) return;
    
    const isOut = direction === 'out';
    
    const keyframes = isOut ? [
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(-20px) scale(0.98)' }
    ] : [
      { opacity: 0, transform: 'translateY(20px) scale(0.98)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ];

    try {
      gallery.animate(keyframes, {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        fill: 'forwards'
      });
    } catch (error) {
      console.warn('Gallery transition animation not supported:', error);
    }
  }

  /**
   * Efectos de parallax sutiles
   */
  setupParallaxEffects() {
    if (this.isTouch) return; // Evitar parallax en móviles
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Actualizar efectos parallax
   */
  updateParallax() {
    const scrolled = window.pageYOffset;
    const cards = document.querySelectorAll('.md-gallery-card');
    
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const speed = 0.1 + (index % 3) * 0.05; // Velocidad variable
        const yPos = scrolled * speed;
        
        card.style.transform = `translateY(${yPos}px)`;
      }
    });
  }

  /**
   * Efectos de ondas (ripple) para interacciones
   */
  setupRippleEffects() {
    document.addEventListener('click', (e) => {
      const tabElement = this.elementMatches(e.target, '.md-tab') ? e.target : this.findParentMatch(e.target, '.md-tab');
      if (tabElement) {
        // Solo crear efecto ripple, no interferir con funcionalidad
        this.createRipple(e, tabElement);
      }
    }, { passive: true }); // Usar passive para no interferir
  }

  /**
   * Crear efecto ripple
   */
  createRipple(event, element) {
    if (!element || !event) return;
    
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: var(--md-sys-color-primary);
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.3;
      transform: scale(0);
      z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    const animation = ripple.animate([
      { transform: 'scale(0)', opacity: 0.3 },
      { transform: 'scale(1)', opacity: 0 }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
    });
    
    animation.onfinish = () => {
      if (ripple.parentElement) {
        ripple.remove();
      }
    };
  }

  /**
   * Botones magnéticos (efecto de atracción del cursor)
   */
  setupMagneticButtons() {
    if (this.isTouch) return;
    
    const magneticElements = document.querySelectorAll('.md-tab, .md-gallery-btn');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        this.handleMagneticMove(e, element);
      });
      
      element.addEventListener('mouseleave', () => {
        this.resetMagneticElement(element);
      });
    });
  }

  /**
   * Manejar movimiento magnético
   */
  handleMagneticMove(event, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (event.clientX - centerX) * 0.1;
    const deltaY = (event.clientY - centerY) * 0.1;
    
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }

  /**
   * Resetear elemento magnético
   */
  resetMagneticElement(element) {
    element.style.transform = 'translate(0, 0)';
  }

  /**
   * Actualizar observadores cuando se renderizan nuevas cards
   */
  updateObservers() {
    this.observeNewCards();
  }

  /**
   * Limpiar animaciones y observadores
   */
  cleanup() {
    this.animations.forEach(animation => animation.cancel());
    this.animations.clear();
    
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  /**
   * Métodos públicos para integración con galería principal
   */
  onGalleryUpdate() {
    setTimeout(() => {
      this.updateObservers();
    }, 100);
  }

  onCategoryChange() {
    // Animar transición de categoría
    const newGallery = document.querySelector('.md-gallery-section');
    if (newGallery) {
      this.animateGalleryTransition(newGallery, 'in');
    }
  }
}

// Inicializar cuando el DOM esté listo, DESPUÉS de la galería principal
document.addEventListener('DOMContentLoaded', () => {
  // Esperar un poco para asegurar que la galería principal se inicialice primero
  setTimeout(() => {
    try {
      window.vrGalleryVisualEnhancer = new VRGalleryVisualEnhancer();
    } catch (error) {
      console.warn('No se pudo inicializar VR Gallery Visual Enhancer:', error);
    }
  }, 500);
});

// Integración con la galería principal (si existe)
setTimeout(() => {
  if (window.vrGalleryMCP && window.vrGalleryVisualEnhancer) {
    try {
      const originalRenderGallery = window.vrGalleryMCP.renderGallery;
      if (originalRenderGallery) {
        window.vrGalleryMCP.renderGallery = function(...args) {
          const result = originalRenderGallery.apply(this, args);
          // Actualizar observadores después de renderizar
          setTimeout(() => {
            if (window.vrGalleryVisualEnhancer) {
              window.vrGalleryVisualEnhancer.onGalleryUpdate();
            }
          }, 100);
          return result;
        };
      }
      
      const originalSwitchCategory = window.vrGalleryMCP.switchCategory;
      if (originalSwitchCategory) {
        window.vrGalleryMCP.switchCategory = function(...args) {
          const result = originalSwitchCategory.apply(this, args);
          // Efectos después del cambio de categoría
          setTimeout(() => {
            if (window.vrGalleryVisualEnhancer) {
              window.vrGalleryVisualEnhancer.onCategoryChange();
            }
          }, 100);
          return result;
        };
      }
    } catch (error) {
      console.warn('No se pudo integrar con la galería principal:', error);
    }
  }
}, 2000);
