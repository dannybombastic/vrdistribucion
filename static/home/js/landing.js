  // Utility functions for form validation
    const ValidationUtils = {
      emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      
      validateEmail: function(email) {
        return this.emailRegex.test(email.trim());
      },
      
      validateName: function(name) {
        return name.trim().length >= 2;
      },
      
      validateMessage: function(message) {
        return message.trim().length >= 10;
      }
    };

    // Error display functions
    function showError(fieldId, message) {
      const errorElement = document.getElementById(fieldId + '-error');
      const inputElement = document.getElementById(fieldId);
      
      if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.setAttribute('aria-invalid', 'true');
        inputElement.classList.add('error');
      }
    }

    function clearError(fieldId) {
      const errorElement = document.getElementById(fieldId + '-error');
      const inputElement = document.getElementById(fieldId);
      
      if (errorElement && inputElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputElement.setAttribute('aria-invalid', 'false');
        inputElement.classList.remove('error');
      }
    }

    function showGeneralError(message) {
      const errorElement = document.getElementById('form-general-error');
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
      }
    }

    function clearGeneralError() {
      const errorElement = document.getElementById('form-general-error');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    }

    function showSuccessMessage(message) {
      const successElement = document.getElementById('form-success-message');
      if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        setTimeout(() => {
          successElement.style.display = 'none';
        }, 5000);
      }
    }

    // Real-time validation
    document.addEventListener('DOMContentLoaded', function() {
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      // Name validation
      nameInput.addEventListener('blur', function() {
        const name = this.value.trim();
        if (name && !ValidationUtils.validateName(name)) {
          showError('contact-name', 'El nombre debe tener al menos 2 caracteres.');
        } else {
          clearError('contact-name');
        }
      });

      nameInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          const name = this.value.trim();
          if (ValidationUtils.validateName(name)) {
            clearError('contact-name');
          }
        }
      });

      // Email validation
      emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !ValidationUtils.validateEmail(email)) {
          showError('contact-email', 'Por favor, ingresa un correo electrónico válido.');
        } else {
          clearError('contact-email');
        }
      });

      emailInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          const email = this.value.trim();
          if (ValidationUtils.validateEmail(email)) {
            clearError('contact-email');
          }
        }
      });

      // Message validation
      messageInput.addEventListener('blur', function() {
        const message = this.value.trim();
        if (message && !ValidationUtils.validateMessage(message)) {
          showError('contact-message', 'El mensaje debe tener al menos 10 caracteres.');
        } else {
          clearError('contact-message');
        }
      });

      messageInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          const message = this.value.trim();
          if (ValidationUtils.validateMessage(message)) {
            clearError('contact-message');
          }
        }
      });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#" or empty
        if (!href || href === '#' || href.length <= 1) {
          return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Enhanced form handling with better validation and error display
    document.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Clear previous errors
      clearError('contact-name');
      clearError('contact-email');
      clearError('contact-message');
      clearGeneralError();
      
      const formData = new FormData(this);
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const message = formData.get('message').trim();
      
      let hasErrors = false;
      
      // Validate all fields
      if (!name) {
        showError('contact-name', 'El nombre es requerido.');
        hasErrors = true;
      } else if (!ValidationUtils.validateName(name)) {
        showError('contact-name', 'El nombre debe tener al menos 2 caracteres.');
        hasErrors = true;
      }
      
      if (!email) {
        showError('contact-email', 'El correo electrónico es requerido.');
        hasErrors = true;
      } else if (!ValidationUtils.validateEmail(email)) {
        showError('contact-email', 'Por favor, ingresa un correo electrónico válido.');
        hasErrors = true;
      }
      
      if (!message) {
        showError('contact-message', 'El mensaje es requerido.');
        hasErrors = true;
      } else if (!ValidationUtils.validateMessage(message)) {
        showError('contact-message', 'El mensaje debe tener al menos 10 caracteres.');
        hasErrors = true;
      }
      
      if (hasErrors) {
        showGeneralError('Por favor, corrige los errores indicados antes de enviar el formulario.');
        // Focus on first error field
        const firstError = this.querySelector('.error');
        if (firstError) {
          firstError.focus();
        }
        return;
      }
      
      // TODO: Implement secure backend submission
      // For production, replace this simulation with a secure backend call
      // Example:
      // fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-CSRF-Token': getCsrfToken() // Include CSRF protection
      //   },
      //   body: JSON.stringify({ name, email, message })
      // })
      // .then(response => response.json())
      // .then(data => {
      //   if (data.success) {
      //     showSuccessMessage('¡Gracias por tu mensaje! Te contactaremos pronto.');
      //     this.reset();
      //   } else {
      //     showGeneralError(data.message || 'Hubo un error al enviar el mensaje.');
      //   }
      // })
      // .catch(error => {
      //   showGeneralError('Error de conexión. Por favor, intenta de nuevo.');
      // });
      
      // Simulate successful submission for demo
      showSuccessMessage('¡Gracias por tu mensaje! Te contactaremos pronto.');
      this.reset();
    });

    // Add animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
      });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .pricing-card, .testimonial').forEach(el => {
      observer.observe(el);
    });