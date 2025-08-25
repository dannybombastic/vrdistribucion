/**
 * VR Distribución - Gallery JavaScript
 * Handles lightbox functionality, tab navigation, and accessibility
 * for the three gallery styles: Masonry, Hexagon, and Polaroid
 */

class GalleryManager {
    constructor() {
        this.currentGallery = 'masonry';
        this.currentImageIndex = 0;
        this.images = [];
        this.isLightboxOpen = false;
        this.focusedElementBeforeLightbox = null;
        
        // DOM references
        this.lightboxOverlay = null;
        this.lightboxImage = null;
        this.lightboxTitle = null;
        this.lightboxDescription = null;
        this.lightboxCounter = null;
        this.galleryTabs = null;
        this.gallerySections = null;
        
        this.init();
    }

    /**
     * Initialize the gallery manager
     */
    init() {
        // console.log('Initializing Gallery Manager...');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup all gallery functionality
     */
    setup() {
        // console.log('Setting up Gallery Manager...');
        
        this.cacheDOMElements();
        this.createLightboxHTML();
        this.setupEventListeners();
        this.setupTabNavigation();
        this.collectImages();
        
        // console.log('Gallery Manager initialized successfully');
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheDOMElements() {
        this.galleryTabs = document.querySelectorAll('.gallery-tab');
        this.gallerySections = document.querySelectorAll('.gallery-section');
        
        // Lightbox elements will be created dynamically
        // console.log('DOM elements cached:', {
            tabs: this.galleryTabs.length,
            sections: this.gallerySections.length
        });
    }

    /**
     * Create lightbox HTML structure if it doesn't exist
     */
    createLightboxHTML() {
        this.lightboxOverlay = document.getElementById('lightbox-overlay');
        
        if (this.lightboxOverlay) {
            this.lightboxImage = document.getElementById('lightbox-image');
            this.lightboxTitle = document.getElementById('lightbox-title');
            this.lightboxDescription = document.getElementById('lightbox-description');
            this.lightboxCounter = document.getElementById('lightbox-counter');
            // console.log('Lightbox elements found in DOM');
        } else {
            console.warn('Lightbox overlay not found in DOM');
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Gallery image clicks
        this.setupImageClickListeners();
        
        // Lightbox controls
        this.setupLightboxControls();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // console.log('Event listeners setup complete');
    }

    /**
     * Setup image click listeners for lightbox
     */
    setupImageClickListeners() {
        const images = document.querySelectorAll('.gl-item');
        images.forEach((img, index) => {
            img.addEventListener('click', (e) => this.openLightbox(e, index));
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openLightbox(e, index);
                }
            });
            
            // Make images focusable
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.setAttribute('aria-label', `Ver imagen: ${img.dataset.title || 'Proyecto VR Distribución'}`);
            
            // Add loading state management
            if (!img.complete) {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    img.classList.add('error');
                    console.warn('Failed to load image:', img.src);
                });
            } else {
                img.classList.add('loaded');
            }
        });
        
        // console.log(`Setup click listeners for ${images.length} images`);
    }

    /**
     * Setup lightbox control event listeners
     */
    setupLightboxControls() {
        if (!this.lightboxOverlay) return;

        // Close button
        const closeBtn = this.lightboxOverlay.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        // Navigation buttons
        const prevBtn = this.lightboxOverlay.querySelector('.lightbox-prev');
        const nextBtn = this.lightboxOverlay.querySelector('.lightbox-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateImage(-1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateImage(1));
        }

        // Overlay background click to close
        this.lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === this.lightboxOverlay) {
                this.closeLightbox();
            }
        });

        // Touch/swipe gestures for mobile
        this.setupTouchGestures();

        // console.log('Lightbox controls setup complete');
    }

    /**
     * Setup touch gestures for mobile navigation
     */
    setupTouchGestures() {
        if (!this.lightboxOverlay) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        this.lightboxOverlay.addEventListener('touchstart', (e) => {
            if (!this.isLightboxOpen) return;
            
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: true });

        this.lightboxOverlay.addEventListener('touchend', (e) => {
            if (!this.isLightboxOpen) return;
            
            const touch = e.changedTouches[0];
            touchEndX = touch.clientX;
            touchEndY = touch.clientY;

            this.handleSwipeGesture(touchStartX, touchStartY, touchEndX, touchEndY);
        }, { passive: true });
    }

    /**
     * Handle swipe gestures
     */
    handleSwipeGesture(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        const maxVerticalMovement = 100;

        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < maxVerticalMovement) {
            if (deltaX > 0) {
                // Swipe right - previous image
                this.navigateImage(-1);
            } else {
                // Swipe left - next image
                this.navigateImage(1);
            }
        }
        
        // Check if it's a vertical swipe to close
        else if (Math.abs(deltaY) > minSwipeDistance && Math.abs(deltaX) < maxVerticalMovement) {
            if (deltaY > 0) {
                // Swipe down - close lightbox
                this.closeLightbox();
            }
        }
    }

    /**
     * Setup keyboard navigation
     */
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

        // console.log('Keyboard navigation setup complete');
    }

    /**
     * Setup tab navigation for gallery styles
     */
    setupTabNavigation() {
        this.galleryTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchGallery(tab.dataset.gallery));
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.switchGallery(tab.dataset.gallery);
                }
            });
        });

        // console.log('Tab navigation setup complete');
    }

    /**
     * Switch between gallery styles
     */
    switchGallery(galleryType) {
        // console.log(`Switching to gallery: ${galleryType}`);
        
        // Update tab states
        this.galleryTabs.forEach(tab => {
            const isActive = tab.dataset.gallery === galleryType;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });

        // Update section visibility
        this.gallerySections.forEach(section => {
            const isActive = section.id === `${galleryType}-gallery`;
            section.classList.toggle('active', isActive);
        });

        this.currentGallery = galleryType;
        this.collectImages(); // Recollect images for the new gallery
        
        // Announce change to screen readers
        this.announceGalleryChange(galleryType);
    }

    /**
     * Announce gallery change to screen readers
     */
    announceGalleryChange(galleryType) {
        const announcements = {
            masonry: 'Mostrando galería de proyectos destacados con diseño masonry',
            hexagon: 'Mostrando galería hexagonal de proyectos',
            polaroid: 'Mostrando galería estilo polaroid de proyectos'
        };

        const announcement = announcements[galleryType] || 'Galería cambiada';
        this.announceToScreenReader(announcement);
    }

    /**
     * Collect all images from the current active gallery
     */
    collectImages() {
        const activeSection = document.querySelector('.gallery-section.active');
        if (!activeSection) return;

        this.images = Array.from(activeSection.querySelectorAll('.gl-item')).map((img, index) => ({
            element: img,
            src: img.src,
            alt: img.alt,
            title: img.dataset.title || `Proyecto ${index + 1}`,
            category: img.dataset.category || 'VR Distribución',
            index: index
        }));

        // console.log(`Collected ${this.images.length} images from ${this.currentGallery} gallery`);
    }

    /**
     * Open lightbox with specified image
     */
    openLightbox(event, imageIndex) {
        // console.log(`Opening lightbox for image ${imageIndex}`);
        
        if (!this.lightboxOverlay || !this.images.length) {
            console.error('Lightbox not available or no images found');
            return;
        }

        // Store the focused element before opening lightbox
        this.focusedElementBeforeLightbox = document.activeElement;

        this.currentImageIndex = imageIndex;
        this.isLightboxOpen = true;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Show lightbox
        this.lightboxOverlay.classList.add('active');
        this.lightboxOverlay.setAttribute('aria-hidden', 'false');
        
        // Load image
        this.loadLightboxImage();
        
        // Focus management for accessibility
        setTimeout(() => {
            const closeBtn = this.lightboxOverlay.querySelector('.lightbox-close');
            if (closeBtn) closeBtn.focus();
        }, 100);

        // Announce to screen readers
        this.announceToScreenReader('Galería de imágenes abierta. Use las flechas para navegar, Escape para cerrar.');
    }

    /**
     * Close lightbox
     */
    closeLightbox() {
        // console.log('Closing lightbox');
        
        if (!this.isLightboxOpen) return;

        this.isLightboxOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Hide lightbox
        this.lightboxOverlay.classList.remove('active');
        this.lightboxOverlay.setAttribute('aria-hidden', 'true');
        
        // Restore focus
        if (this.focusedElementBeforeLightbox) {
            this.focusedElementBeforeLightbox.focus();
            this.focusedElementBeforeLightbox = null;
        }

        // Announce to screen readers
        this.announceToScreenReader('Galería de imágenes cerrada');
    }

    /**
     * Navigate to next/previous image
     */
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

    /**
     * Navigate to specific image index
     */
    navigateToImage(index) {
        if (index < 0 || index >= this.images.length) return;

        this.currentImageIndex = index;
        this.loadLightboxImage();
        
        // Announce to screen readers
        const imageInfo = this.images[index];
        this.announceToScreenReader(`Imagen ${index + 1} de ${this.images.length}: ${imageInfo.title}`);
    }

    /**
     * Load image in lightbox
     */
    loadLightboxImage() {
        if (!this.lightboxImage || !this.images.length) return;

        const imageData = this.images[this.currentImageIndex];
        
        // Create new image to handle loading
        const newImg = new Image();
        newImg.onload = () => {
            this.lightboxImage.src = newImg.src;
            this.lightboxImage.alt = imageData.alt;
            
            // Update info
            if (this.lightboxTitle) {
                this.lightboxTitle.textContent = imageData.title;
            }
            
            if (this.lightboxDescription) {
                this.lightboxDescription.textContent = imageData.category;
            }
            
            if (this.lightboxCounter) {
                this.lightboxCounter.textContent = `${this.currentImageIndex + 1} de ${this.images.length}`;
            }
        };
        
        newImg.onerror = () => {
            console.error('Error loading image:', imageData.src);
            this.announceToScreenReader('Error al cargar la imagen');
        };
        
        // Start loading
        newImg.src = imageData.src;
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (this.isLightboxOpen) {
                // Refresh lightbox layout if needed
                // console.log('Handling resize while lightbox is open');
            }
        }, 250);
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        // Create or update announcement element
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
        
        // Clear and set new message
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    /**
     * Get gallery statistics
     */
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
 * Gallery Animations Controller
 * Handles entrance animations and scroll-triggered effects
 */
class GalleryAnimations {
    constructor() {
        this.observers = [];
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
    }

    /**
     * Setup intersection observer for entrance animations
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // console.log('IntersectionObserver not supported');
            return;
        }

        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe gallery items
        const observeElements = () => {
            const items = document.querySelectorAll('.masonry-item, .hexagon-item, .polaroid-item');
            items.forEach(item => {
                if (!item.classList.contains('animate-in')) {
                    observer.observe(item);
                }
            });
        };

        // Initial observation
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', observeElements);
        } else {
            observeElements();
        }

        this.observers.push(observer);
    }

    /**
     * Setup scroll-triggered animations
     */
    setupScrollAnimations() {
        let ticking = false;

        const updateAnimations = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Parallax effect for hero section
            const hero = document.querySelector('.gallery-hero');
            if (hero) {
                const heroRect = hero.getBoundingClientRect();
                if (heroRect.bottom > 0 && heroRect.top < windowHeight) {
                    const parallaxSpeed = 0.5;
                    const yPos = scrollY * parallaxSpeed;
                    hero.style.transform = `translateY(${yPos}px)`;
                }
            }

            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Cleanup observers
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

/**
 * Gallery Performance Monitor
 * Monitors Core Web Vitals and performance metrics
 */
class GalleryPerformance {
    constructor() {
        this.metrics = {
            imagesLoaded: 0,
            totalImages: 0,
            loadStartTime: performance.now()
        };
        
        this.init();
    }

    init() {
        this.setupImageLoadTracking();
        this.setupPerformanceObserver();
    }

    /**
     * Track image loading performance
     */
    setupImageLoadTracking() {
        const images = document.querySelectorAll('.gl-item');
        this.metrics.totalImages = images.length;

        images.forEach(img => {
            if (img.complete) {
                this.metrics.imagesLoaded++;
            } else {
                img.addEventListener('load', () => {
                    this.metrics.imagesLoaded++;
                    this.checkLoadComplete();
                });
                img.addEventListener('error', () => {
                    console.warn('Failed to load image:', img.src);
                });
            }
        });

        this.checkLoadComplete();
    }

    /**
     * Setup performance observer for Web Vitals
     */
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (entry.entryType === 'largest-contentful-paint') {
                            // console.log('LCP:', entry.startTime);
                        }
                        if (entry.entryType === 'layout-shift') {
                            // console.log('CLS:', entry.value);
                        }
                    });
                });

                observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
            } catch (e) {
                // console.log('Performance observer not fully supported');
            }
        }
    }

    /**
     * Check if all images are loaded
     */
    checkLoadComplete() {
        if (this.metrics.imagesLoaded >= this.metrics.totalImages) {
            const loadTime = performance.now() - this.metrics.loadStartTime;
            // console.log(`Gallery loaded: ${this.metrics.totalImages} images in ${loadTime.toFixed(2)}ms`);
        }
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            loadTime: performance.now() - this.metrics.loadStartTime
        };
    }
}

/**
 * Initialize gallery when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // console.log('Initializing VR Distribución Gallery...');
    
    // Initialize main gallery manager
    window.galleryManager = new GalleryManager();
    
    // Initialize animations (if not reduced motion)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.galleryAnimations = new GalleryAnimations();
    }
    
    // Initialize performance monitoring
    window.galleryPerformance = new GalleryPerformance();
    
    // console.log('Gallery initialization complete');
});

// Export for debugging and external access
window.GalleryManager = GalleryManager;
window.GalleryAnimations = GalleryAnimations;
window.GalleryPerformance = GalleryPerformance;
