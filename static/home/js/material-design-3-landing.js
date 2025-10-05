/*
 * VR Distribución - Material Design 3 Landing Page JavaScript
 * Etapa 1: Funcionalidades básicas de navegación e interacciones
 */

class VRLandingMD3 {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupAnimations();
    this.setupThemeDetection();
    this.setupRippleEffects();
    this.setupPerformanceOptimizations();
    console.log('🎨 VR Distribución Material Design 3 - Inicializado');
  }

  // Navegación móvil
  setupNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navDrawer = document.getElementById('navDrawer');
    const body = document.body;

    if (menuToggle && navDrawer) {
      menuToggle.addEventListener('click', () => {
        const isActive = navDrawer.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        
        // Cambiar ícono
        const icon = menuToggle.querySelector('.material-icons');
        if (icon) {
          icon.textContent = isActive ? 'close' : 'menu';
        }

        // Prevenir scroll del body cuando el drawer está abierto
        if (isActive) {
          body.style.overflow = 'hidden';
        } else {
          body.style.overflow = '';
        }
      });

      // Cerrar drawer al hacer clic en enlaces
      navDrawer.addEventListener('click', (e) => {
        if (e.target.classList.contains('md-nav-drawer__item')) {
          navDrawer.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          const icon = menuToggle.querySelector('.material-icons');
          if (icon) icon.textContent = 'menu';
          body.style.overflow = '';
        }
      });

      // Cerrar drawer con tecla Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
          navDrawer.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          const icon = menuToggle.querySelector('.material-icons');
          if (icon) icon.textContent = 'menu';
          body.style.overflow = '';
          menuToggle.focus();
        }
      });

      // Cerrar drawer al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (navDrawer.classList.contains('active') && 
            !navDrawer.contains(e.target) && 
            !menuToggle.contains(e.target)) {
          navDrawer.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          const icon = menuToggle.querySelector('.material-icons');
          if (icon) icon.textContent = 'menu';
          body.style.overflow = '';
        }
      });
    }
  }

  // Efectos de scroll para el header
  setupScrollEffects() {
    const header = document.querySelector('.md-header');
    const backToTopBtn = document.getElementById('backToTop');
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (header) {
        if (currentScrollY > 100) {
          header.style.background = 'rgba(var(--md-sys-color-surface-rgb, 252, 252, 255), 0.95)';
          header.style.boxShadow = 'var(--md-elevation-2)';
        } else {
          header.style.background = 'rgba(var(--md-sys-color-surface-rgb, 252, 252, 255), 0.95)';
          header.style.boxShadow = 'none';
        }
      }

      // Back to top button
      if (backToTopBtn) {
        if (currentScrollY > 500) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });

    // Back to top functionality
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // Animaciones de entrada
  setupAnimations() {
    // Intersection Observer para animaciones
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observar elementos que necesitan animación
    const animatedElements = document.querySelectorAll(
      '.md-hero__features, .md-hero__actions, .md-hero__proof, ' +
      '.md-feature-card, .md-service-card, .md-testimonial-card, ' +
      '.md-trust-indicator, .md-cta-card'
    );
    
    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(el);
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Performance optimizations
  setupPerformanceOptimizations() {
    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    preloadLink.as = 'style';
    document.head.appendChild(preloadLink);

    // Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    }, { passive: true });

    // Optimize scroll performance
    this.setupScrollOptimizations();
  }

  setupScrollOptimizations() {
    // Throttle scroll events for better performance
    let scrollTimer = null;
    const scrollHandler = () => {
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(() => {
        this.updateScrollPosition();
      }, 10);
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  updateScrollPosition() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.md-hero');
    
    parallaxElements.forEach(el => {
      const speed = 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }

  handleResize() {
    // Handle responsive adjustments
    const isMobile = window.innerWidth < 768;
    const chatContainer = document.querySelector('.chat-container');
    
    if (chatContainer && isMobile) {
      chatContainer.style.width = 'calc(100vw - 40px)';
      chatContainer.style.left = '20px';
    }
  }

  // Detección automática de tema
  setupThemeDetection() {
    const applyTheme = (isDark) => {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    // Detectar preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(mediaQuery.matches);

    // Escuchar cambios en la preferencia
    mediaQuery.addEventListener('change', (e) => {
      applyTheme(e.matches);
    });
  }

  // Efectos ripple para botones
  setupRippleEffects() {
    const buttons = document.querySelectorAll('.md-button, .md-icon-button, .md-chip');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
          z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Añadir CSS para la animación ripple
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Método para smooth scroll
  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      const headerHeight = document.querySelector('.md-header')?.offsetHeight || 64;
      const targetPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Método para mostrar notificaciones toast
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `md-toast md-toast--${type}`;
    toast.innerHTML = `
      <div class="md-toast__content">
        <span class="material-icons">${this.getToastIcon(type)}</span>
        <span class="md-toast__message">${message}</span>
      </div>
    `;
    
    // Estilos inline para el toast
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: var(--md-elevation-3);
      z-index: 2000;
      transition: transform 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 400px;
      border-left: 4px solid var(--md-sys-color-${type === 'error' ? 'error' : 'primary'});
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Ocultar toast después de 4 segundos
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 4000);
  }

  getToastIcon(type) {
    const icons = {
      info: 'info',
      success: 'check_circle',
      warning: 'warning',
      error: 'error'
    };
    return icons[type] || 'info';
  }
}

// Contact Form Handler
class ContactFormHandler {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    if (this.form) {
      this.setupValidation();
      this.setupFormSubmission();
      this.setupTextFieldEffects();
    }
  }

  setupTextFieldEffects() {
    // Mejorar los efectos de los text fields
    const textFields = document.querySelectorAll('.md-textfield__input, .md-select__input');
    
    textFields.forEach(input => {
      // Manejar el placeholder para labels flotantes
      input.setAttribute('placeholder', ' ');
      
      // Eventos para animaciones de label
      input.addEventListener('focus', () => {
        input.parentNode.classList.add('md-textfield--focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentNode.classList.remove('md-textfield--focused');
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  setupValidation() {
    const validationRules = {
      nombre: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        message: 'El nombre debe tener al menos 2 caracteres y solo contener letras'
      },
      apellido: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        message: 'El apellido debe tener al menos 2 caracteres y solo contener letras'
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Por favor ingresa un email válido'
      },
      telefono: {
        pattern: /^[\+]?[0-9\s\-\(\)]+$/,
        message: 'Por favor ingresa un teléfono válido'
      },
      tipoServicio: {
        required: true,
        message: 'Por favor selecciona un tipo de servicio'
      },
      mensaje: {
        required: true,
        minLength: 10,
        message: 'El mensaje debe tener al menos 10 caracteres'
      }
    };

    Object.keys(validationRules).forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (field) {
        field.addEventListener('blur', () => this.validateField(field, validationRules[fieldName]));
        field.addEventListener('input', () => this.clearFieldError(field));
      }
    });

    this.validationRules = validationRules;
  }

  validateField(field, rules = null) {
    if (!rules) {
      rules = this.validationRules[field.name] || this.validationRules[field.id];
    }
    if (!rules) return true;

    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);
    
    // Required validation
    if (rules.required && !value) {
      this.showFieldError(field, errorElement, 'Este campo es obligatorio');
      return false;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
      this.clearFieldError(field);
      return true;
    }

    // MinLength validation
    if (rules.minLength && value.length < rules.minLength) {
      this.showFieldError(field, errorElement, `Debe tener al menos ${rules.minLength} caracteres`);
      return false;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      this.showFieldError(field, errorElement, rules.message);
      return false;
    }

    // Clear any existing errors
    this.clearFieldError(field);
    return true;
  }

  showFieldError(field, errorElement, message) {
    field.classList.add('md-textfield__input--error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  clearFieldError(field) {
    field.classList.remove('md-textfield__input--error');
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  validateForm() {
    let isValid = true;
    const requiredFields = ['nombre', 'apellido', 'email', 'tipoServicio', 'mensaje'];
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && !this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  setupFormSubmission() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!this.validateForm()) {
        window.vrLanding.showToast('Por favor corrige los errores en el formulario', 'error');
        return;
      }

      await this.submitForm();
    });
  }

  async submitForm() {
    const formData = new FormData(this.form);
    const loadingElement = document.getElementById('formLoading');
    const successElement = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show loading state
    this.form.style.display = 'none';
    loadingElement.style.display = 'block';
    
    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/php/contact.php', {
        method: 'POST',
        body: formData
      });

      // Simulate delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (response.ok) {
        // Show success state
        loadingElement.style.display = 'none';
        successElement.style.display = 'block';
        window.vrLanding.showToast('¡Mensaje enviado exitosamente!', 'success');
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Hide loading and show form again
      loadingElement.style.display = 'none';
      this.form.style.display = 'block';
      
      window.vrLanding.showToast('Error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
    }
  }

  resetForm() {
    this.form.reset();
    
    // Clear all errors
    const errorElements = this.form.querySelectorAll('.md-textfield__error');
    errorElements.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
    
    // Remove error classes
    const fields = this.form.querySelectorAll('.md-textfield__input--error');
    fields.forEach(field => field.classList.remove('md-textfield__input--error'));
    
    window.vrLanding.showToast('Formulario limpiado', 'info');
  }

  resetComplete() {
    const successElement = document.getElementById('formSuccess');
    successElement.style.display = 'none';
    this.form.style.display = 'block';
    this.resetForm();
  }
}

// Chat Widget Integration (mantener funcionalidad existente)
class ChatWidget {
  constructor() {
    this.isCollapsed = true;
    this.init();
  }

  init() {
    this.createChatUI();
    this.setupEventListeners();
  }

  createChatUI() {
    // Verificar si ya existe
    if (document.querySelector('.chat-container')) return;

    const chatHTML = `
      <div class="chat-container collapsed" id="chatContainer">
        <div class="chat-header">
          <span>💬 Chat con VR Distribución</span>
          <button class="control-btn" id="chatClose" aria-label="Cerrar chat">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="chat-content" style="padding: 16px; height: calc(100% - 60px); overflow-y: auto;">
          <div style="text-align: center; color: var(--md-sys-color-on-surface-variant);">
            <p>¡Hola! 👋</p>
            <p>¿En qué podemos ayudarte hoy?</p>
            <div style="margin-top: 16px;">
              <button class="md-button md-button--filled" onclick="vrLanding.showToast('Función de chat en desarrollo', 'info')">
                Iniciar conversación
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <button class="chat-toggle" id="chatToggle" aria-label="Abrir chat">
        <span class="material-icons">chat</span>
      </button>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
  }

  setupEventListeners() {
    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.getElementById('chatContainer');
    const chatClose = document.getElementById('chatClose');

    if (chatToggle) {
      chatToggle.addEventListener('click', () => this.toggleChat());
    }

    if (chatClose) {
      chatClose.addEventListener('click', () => this.closeChat());
    }

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.isCollapsed) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    const container = document.getElementById('chatContainer');
    const toggle = document.getElementById('chatToggle');
    
    if (container && toggle) {
      this.isCollapsed = !this.isCollapsed;
      container.classList.toggle('collapsed', this.isCollapsed);
      toggle.style.transform = this.isCollapsed ? 'scale(1)' : 'scale(0.8)';
    }
  }

  closeChat() {
    const container = document.getElementById('chatContainer');
    const toggle = document.getElementById('chatToggle');
    
    if (container && toggle) {
      this.isCollapsed = true;
      container.classList.add('collapsed');
      toggle.style.transform = 'scale(1)';
    }
  }
}

// Funciones globales para los enlaces de navegación
function scrollToSection(sectionId) {
  if (window.vrLanding) {
    window.vrLanding.smoothScrollTo(sectionId);
  }
}

// Funciones globales para el formulario
function openWhatsApp() {
  const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus servicios de VR Distribución.');
  window.open(`https://wa.me/529981234567?text=${message}`, '_blank');
}

function scrollToForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Focus en el primer campo del formulario
    setTimeout(() => {
      const firstField = form.querySelector('input, select, textarea');
      if (firstField) firstField.focus();
    }, 500);
  }
}

function resetForm() {
  if (window.contactForm) {
    window.contactForm.resetForm();
  }
}

function resetFormComplete() {
  if (window.contactForm) {
    window.contactForm.resetComplete();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.vrLanding = new VRLandingMD3();
  window.chatWidget = new ChatWidget();
  window.contactForm = new ContactFormHandler();
  
  console.log('✅ Material Design 3 Landing Page - Cargado completamente');
});

// Exportar para uso global
window.VRLandingMD3 = VRLandingMD3;
window.ChatWidget = ChatWidget;
window.ContactFormHandler = ContactFormHandler;
