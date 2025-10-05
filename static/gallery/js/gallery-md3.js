/**
 * Material Design 3 Gallery Manager
 * Adaptado del JavaScript original para mantener compatibilidad con clases existentes
 * Mantiene la misma funcionalidad pero con componentes MD3
 */

class GalleryManagerMD3 {
  constructor() {
    this.currentGallery = 'masonry';
    this.currentImageIndex = 0;
    this.images = [];
    this.isLightboxOpen = false;
    this.focusedElementBeforeLightbox = null;
    this.container = document.querySelector('main') || document.body;
    
    // DOM Elements
    this.lightboxOverlay = null;
    this.lightboxImage = null;
    this.lightboxTitle = null;
    this.lightboxDescription = null;
    this.lightboxCounter = null;
    this.galleryTabs = null;
    this.gallerySections = null;
    
    this.init();
  }

  init() {
    // Reset body scroll
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    if (!this.container) return;
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Reset body scroll
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    this.cacheDOMElements();
    this.createLightboxHTML();
    this.setupEventListeners();
    this.setupTabNavigation();
    this.setDefaultGalleryForDevice();
    this.collectImages();
    this.setupImageClickListeners();
    this.setupBackToTop();
    
    // Ensure body scroll is reset after setup
    setTimeout(() => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }, 100);
  }

  setDefaultGalleryForDevice() {
    // Always start with masonry gallery
    this.switchGallery('masonry');
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           'ontouchstart' in window ||
           navigator.maxTouchPoints > 0 ||
           navigator.msMaxTouchPoints > 0;
  }

  cacheDOMElements() {
    this.galleryTabs = document.querySelectorAll('.gallery-tab');
    this.gallerySections = document.querySelectorAll('.gallery-section');
  }

  createLightboxHTML() {
    this.lightboxOverlay = document.getElementById('lightbox-overlay');
    if (this.lightboxOverlay) {
      this.lightboxImage = document.getElementById('lightbox-image');
      this.lightboxTitle = document.getElementById('lightbox-title');
      this.lightboxDescription = document.getElementById('lightbox-description');
      this.lightboxCounter = document.getElementById('lightbox-counter');
    }
  }

  setupEventListeners() {
    this.setupLightboxControls();
    this.setupKeyboardNavigation();
    window.addEventListener('resize', () => this.handleResize());
  }

  setupImageClickListeners() {
    // Remove existing listeners
    this.removeImageClickListeners();
    
    const activeSection = document.querySelector('.gallery-section.active');
    if (!activeSection) return;

    const images = activeSection.querySelectorAll('.gl-item');
    images.forEach((img, index) => {
      const clickHandler = (e) => this.openLightbox(index);
      const keydownHandler = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openLightbox(index);
        }
      };

      // Store handlers for removal later
      img._clickHandler = clickHandler;
      img._keydownHandler = keydownHandler;

      img.addEventListener('click', clickHandler);
      img.addEventListener('keydown', keydownHandler);
      
      // Accessibility
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Ver imagen: ${img.dataset.title || 'Proyecto VR Distribución'}`);
      
      // Loading states
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
        img.addEventListener('error', () => {
          img.classList.add('error');
        });
      }
    });
  }

  removeImageClickListeners() {
    document.querySelectorAll('.gl-item').forEach(img => {
      if (img._clickHandler) {
        img.removeEventListener('click', img._clickHandler);
        delete img._clickHandler;
      }
      if (img._keydownHandler) {
        img.removeEventListener('keydown', img._keydownHandler);
        delete img._keydownHandler;
      }
    });
  }

  setupLightboxControls() {
    if (!this.lightboxOverlay) return;

    // Close button
    const closeBtn = this.lightboxOverlay.querySelector('.md-lightbox__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLightbox());
    }

    // Navigation buttons
    const prevBtn = this.lightboxOverlay.querySelector('.md-lightbox__prev');
    const nextBtn = this.lightboxOverlay.querySelector('.md-lightbox__next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateImage(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateImage(1));
    }

    // Click outside to close
    this.lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === this.lightboxOverlay) {
        this.closeLightbox();
      }
    });

    this.setupTouchGestures();
  }

  setupTouchGestures() {
    if (!this.lightboxOverlay) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    this.lightboxOverlay.addEventListener('touchstart', (e) => {
      if (!this.isLightboxOpen) return;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });

    this.lightboxOverlay.addEventListener('touchend', (e) => {
      if (!this.isLightboxOpen) return;
      const touch = e.changedTouches[0];
      endX = touch.clientX;
      endY = touch.clientY;
      this.handleSwipeGesture(startX, startY, endX, endY);
    }, { passive: true });
  }

  handleSwipeGesture(startX, startY, endX, endY) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // Horizontal swipe
    if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
      if (deltaX > 0) {
        this.navigateImage(-1); // Swipe right = previous
      } else {
        this.navigateImage(1); // Swipe left = next
      }
    }
    // Vertical swipe down to close
    else if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < 100 && deltaY > 0) {
      this.closeLightbox();
    }
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.isLightboxOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.navigateImage(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.navigateImage(1);
          break;
        case 'Home':
          e.preventDefault();
          this.navigateToImage(0);
          break;
        case 'End':
          e.preventDefault();
          this.navigateToImage(this.images.length - 1);
          break;
      }
    });
  }

  setupTabNavigation() {
    this.galleryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchGallery(tab.dataset.gallery);
      });

      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.switchGallery(tab.dataset.gallery);
        }
      });
    });
  }

  switchGallery(galleryType) {
    // Update tabs
    this.galleryTabs.forEach(tab => {
      const isActive = tab.dataset.gallery === galleryType;
      tab.classList.toggle('md-tab--active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });

    // Update sections
    this.gallerySections.forEach(section => {
      const isActive = section.id === `${galleryType}-gallery`;
      section.classList.toggle('active', isActive);
    });

    this.currentGallery = galleryType;
    this.collectImages();
    this.setupImageClickListeners();
    this.announceGalleryChange(galleryType);
  }

  announceGalleryChange(galleryType) {
    const messages = {
      'masonry': 'Mostrando galería de proyectos destacados con diseño masonry',
      'hexagon': 'Mostrando galería hexagonal de proyectos',
      'polaroid': 'Mostrando galería estilo polaroid de proyectos'
    };
    
    const message = messages[galleryType] || 'Galería cambiada';
    this.announceToScreenReader(message);
  }

  collectImages() {
    const activeSection = document.querySelector('.gallery-section.active');
    if (!activeSection) {
      this.images = [];
      return;
    }

    const imageElements = activeSection.querySelectorAll('.gl-item');
    this.images = Array.from(imageElements).map((img, index) => {
      return {
        element: img,
        src: img.src || '',
        alt: img.alt || 'Imagen de galería',
        title: img.dataset.title || `Proyecto ${index + 1}`,
        category: img.dataset.category || 'VR Distribución',
        index: index
      };
    }).filter(img => img.src);
  }

  setBodyScroll(enable = true) {
    if (enable) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    } else if (this.isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    }
  }

  openLightbox(index) {
    if (!this.images || this.images.length === 0) return;

    this.focusedElementBeforeLightbox = document.activeElement;
    this.currentImageIndex = index;
    this.isLightboxOpen = true;
    
    this.setBodyScroll(false);
    this.lightboxOverlay.classList.add('active');
    this.lightboxOverlay.setAttribute('aria-hidden', 'false');
    
    this.loadLightboxImage();
  }

  closeLightbox() {
    if (!this.isLightboxOpen) return;

    this.isLightboxOpen = false;
    this.setBodyScroll(true);
    this.lightboxOverlay.classList.remove('active');
    this.lightboxOverlay.setAttribute('aria-hidden', 'true');

    // Restore focus
    if (this.focusedElementBeforeLightbox) {
      this.focusedElementBeforeLightbox.focus();
      this.focusedElementBeforeLightbox = null;
    }

    this.announceToScreenReader('Galería de imágenes cerrada');
  }

  navigateImage(direction) {
    if (!this.isLightboxOpen || !this.images.length) return;

    const newIndex = this.currentImageIndex + direction;
    
    if (newIndex < 0) {
      this.navigateToImage(this.images.length - 1);
    } else if (newIndex >= this.images.length) {
      this.navigateToImage(0);
    } else {
      this.navigateToImage(newIndex);
    }
  }

  navigateToImage(index) {
    if (index < 0 || index >= this.images.length) return;

    this.currentImageIndex = index;
    this.loadLightboxImage();

    const image = this.images[index];
    this.announceToScreenReader(`Imagen ${index + 1} de ${this.images.length}: ${image.title}`);
  }

  loadLightboxImage() {
    if (!this.lightboxImage || !this.images.length) return;

    const imageData = this.images[this.currentImageIndex];
    if (!imageData || !imageData.src) {
      this.announceToScreenReader('Error: datos de imagen no válidos');
      return;
    }

    // Preload image
    const img = new Image();
    img.onload = () => {
      this.lightboxImage.src = img.src;
      this.lightboxImage.alt = imageData.alt || 'Imagen de galería';
      
      if (this.lightboxTitle) {
        this.lightboxTitle.textContent = imageData.title || 'Proyecto VR Distribución';
      }
      
      if (this.lightboxDescription) {
        this.lightboxDescription.textContent = imageData.category || 'VR Distribución';
      }
      
      if (this.lightboxCounter) {
        this.lightboxCounter.textContent = `${this.currentImageIndex + 1} de ${this.images.length}`;
      }
    };
    
    img.onerror = () => {
      this.announceToScreenReader('Error al cargar la imagen');
    };
    
    img.src = imageData.src;
  }

  setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    // Show/hide based on scroll position
    const toggleBackToTop = () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    // Smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      if (this.isLightboxOpen) {
        // Handle lightbox resize if needed
      }
      this.checkGalleryForScreenSize();
    }, 250);
  }

  checkGalleryForScreenSize() {
    const isMobile = this.isMobileDevice();
    const screenWidth = window.innerWidth;
    
    // Additional responsive logic can be added here
  }

  announceToScreenReader(message) {
    let announcer = document.getElementById('gallery-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'gallery-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
    }

    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }

  getStats() {
    return {
      currentGallery: this.currentGallery,
      totalImages: this.images.length,
      currentImageIndex: this.currentImageIndex,
      isLightboxOpen: this.isLightboxOpen
    };
  }
}

/**
 * Gallery Animations for Material Design 3
 */
class GalleryAnimationsMD3 {
  constructor() {
    this.observers = [];
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    });

    const observeElements = () => {
      const elements = document.querySelectorAll('.md-masonry-item, .md-hexagon-item, .md-polaroid-item');
      elements.forEach(element => {
        if (!element.classList.contains('animate-in')) {
          observer.observe(element);
        }
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeElements);
    } else {
      observeElements();
    }

    this.observers.push(observer);
  }

  setupScrollAnimations() {
    let ticking = false;

    const updateAnimations = () => {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Parallax effect for hero
      const hero = document.querySelector('.md-gallery-hero');
      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom > 0 && heroRect.top < windowHeight) {
          const parallaxSpeed = scrollY * 0.5;
          hero.style.transform = `translateY(${parallaxSpeed}px)`;
        }
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateAnimations);
        ticking = true;
      }
    }, { passive: true });
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Mobile Menu Manager for MD3 Gallery
 * Reutiliza la lógica del mobile menu pero con clases MD3
 */
class MobileMenuManagerMD3 {
  constructor() {
    this.mobileToggle = null;
    this.hamburgerDropdown = null;
    this.nav = null;
    this.icon = null;
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.hamburgerDropdown = document.querySelector('.hamburger-dropdown');
    this.nav = document.querySelector('header nav');
    this.icon = this.mobileToggle?.querySelector('.material-icons');

    if (this.mobileToggle && this.hamburgerDropdown && this.icon) {
      this.setupEventListeners();
      this.isInitialized = true;
    }
  }

  setupEventListeners() {
    this.mobileToggle.addEventListener('click', (e) => this.handleToggleClick(e));
    this.setupNavLinkListeners();
    this.setupOutsideClickListener();
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen()) {
        this.closeMenu();
      }
    });
  }

  handleToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.hamburgerDropdown.classList.add('active');
    this.icon.textContent = 'close';
    this.mobileToggle.setAttribute('aria-expanded', 'true');
    this.mobileToggle.setAttribute('aria-label', 'Cerrar menú');
    
    // Prevent scrolling on mobile
    if (window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeMenu() {
    this.hamburgerDropdown.classList.remove('active');
    this.icon.textContent = 'menu';
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    this.mobileToggle.setAttribute('aria-label', 'Abrir menú');
    
    // Restore scrolling
    document.body.style.overflow = '';
  }

  setupNavLinkListeners() {
    this.hamburgerDropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
  }

  setupOutsideClickListener() {
    document.addEventListener('click', (e) => {
      if (!this.isMenuOpen()) return;
      
      if (!this.mobileToggle.contains(e.target) && 
          !this.hamburgerDropdown.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  isMenuOpen() {
    return this.hamburgerDropdown?.classList.contains('active') || false;
  }

  getState() {
    return {
      isInitialized: this.isInitialized,
      isMenuOpen: this.isMenuOpen(),
      hasElements: !!(this.mobileToggle && this.hamburgerDropdown && this.icon)
    };
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Inicializando VR Distribución Galería MD3');
  
  // Initialize main gallery manager
  window.galleryManagerMD3 = new GalleryManagerMD3();
  
  // Initialize mobile menu
  window.mobileMenuManagerMD3 = new MobileMenuManagerMD3();
  
  // Initialize animations if motion is not reduced
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.galleryAnimationsMD3 = new GalleryAnimationsMD3();
  }
  
  console.log('✅ VR Distribución Galería MD3 inicializada correctamente');
});

// Export classes for potential external use
window.GalleryManagerMD3 = GalleryManagerMD3;
window.GalleryAnimationsMD3 = GalleryAnimationsMD3;
window.MobileMenuManagerMD3 = MobileMenuManagerMD3;
