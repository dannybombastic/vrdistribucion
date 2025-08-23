 // FLOATING PARTICLES
    function createParticles() {
      const particles = document.getElementById('particles');
      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particles.appendChild(particle);
      }
    }

    // UTILIDADES DE VALIDACIÓN Y NORMALIZACIÓN
    const ValidationUtils = {
      // Sanitizar texto general (nombres, mensajes)
      sanitizeText: (text) => {
        if (!text) return '';
        return text.trim()
          .replace(/[<>]/g, '') // Eliminar caracteres potencialmente peligrosos
          .replace(/\s+/g, ' ') // Normalizar espacios
          .substring(0, 500); // Limitar longitud
      },

      // Normalizar nombre completo
      normalizeName: (name) => {
        if (!name) return '';
        return name.trim()
          .replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '') // Solo letras y espacios
          .replace(/\s+/g, ' ') // Normalizar espacios
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .substring(0, 100);
      },

      // Validar y normalizar email
      validateEmail: (email) => {
        if (!email) return { valid: false, normalized: '' };
        const normalized = email.trim().toLowerCase();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return {
          valid: emailRegex.test(normalized) && normalized.length <= 254,
          normalized: normalized
        };
      },

      // Normalizar teléfono mexicano
      normalizePhone: (phone) => {
        if (!phone) return '';
        // Remover todo excepto números
        let normalized = phone.replace(/\D/g, '');
        
        // Validar longitud para México
        if (normalized.length === 10) {
          // 10 dígitos: agregar código de país
          normalized = '52' + normalized;
        } else if (normalized.length === 12 && normalized.startsWith('52')) {
          // Ya tiene código de país
          normalized = normalized;
        } else if (normalized.length === 13 && normalized.startsWith('521')) {
          // Formato con 521
          normalized = normalized;
        } else {
          // Formato inválido
          return '';
        }
        
        return normalized;
      },

      // Validar fecha del evento
      validateEventDate: (date) => {
        if (!date) return { valid: true, message: '' }; // Opcional
        
        const eventDate = new Date(date);
        const today = new Date();
        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() + 2); // Máximo 2 años adelante
        
        if (eventDate < today) {
          return { valid: false, message: 'La fecha del evento debe ser futura' };
        }
        
        if (eventDate > maxDate) {
          return { valid: false, message: 'La fecha del evento no puede ser más de 2 años adelante' };
        }
        
        return { valid: true, message: '' };
      },

      // Sanitizar mensaje largo
      sanitizeMessage: (message) => {
        if (!message) return '';
        return message.trim()
          .replace(/[<>]/g, '') // Eliminar caracteres HTML
          .replace(/\s+/g, ' ') // Normalizar espacios
          .substring(0, 2000); // Limitar a 2000 caracteres
      }
    };

    // VALIDACIÓN EN TIEMPO REAL
    function setupRealTimeValidation() {
      // Validación de nombre
      const nombreInput = document.getElementById('nombre');
      nombreInput.addEventListener('input', function() {
        this.value = ValidationUtils.normalizeName(this.value);
        validateField(this);
      });

      // Validación de email
      const emailInput = document.getElementById('email');
      emailInput.addEventListener('blur', function() {
        const result = ValidationUtils.validateEmail(this.value);
        this.value = result.normalized;
        if (!result.valid && this.value) {
          showFieldError(this, 'Por favor ingresa un email válido');
        } else {
          clearFieldError(this);
        }
      });

      // Validación de teléfono
      const telefonoInput = document.getElementById('telefono');
      telefonoInput.addEventListener('input', function() {
        // Permitir solo números, espacios, guiones y paréntesis durante la escritura
        this.value = this.value.replace(/[^\d\s()-]/g, '');
      });
      
      telefonoInput.addEventListener('blur', function() {
        const normalized = ValidationUtils.normalizePhone(this.value);
        if (this.value && !normalized) {
          showFieldError(this, 'Por favor ingresa un teléfono mexicano válido');
        } else {
          clearFieldError(this);
          // Formatear para mostrar
          if (normalized) {
            this.value = formatPhoneDisplay(normalized);
          }
        }
      });

      // Validación de fecha
      const fechaInput = document.getElementById('fechaEvento');
      fechaInput.addEventListener('change', function() {
        const result = ValidationUtils.validateEventDate(this.value);
        if (!result.valid) {
          showFieldError(this, result.message);
        } else {
          clearFieldError(this);
        }
      });

      // Sanitización de mensaje
      const mensajeInput = document.getElementById('mensaje');
      mensajeInput.addEventListener('input', function() {
        const maxLength = 2000;
        this.value = this.value.substring(0, maxLength);
        
        // Mostrar contador de caracteres
        const counter = this.parentNode.querySelector('.char-counter') || document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'font-size: 0.8rem; color: #6b7280; text-align: right; margin-top: 0.5rem;';
        counter.textContent = `${this.value.length}/${maxLength} caracteres`;
        
        if (!this.parentNode.querySelector('.char-counter')) {
          this.parentNode.appendChild(counter);
        }
      });
    }

    // UTILIDADES DE UI
    function validateField(field) {
      if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
      }
      clearFieldError(field);
      return true;
    }

    function showFieldError(field, message) {
      clearFieldError(field);
      field.style.borderColor = '#ef4444';
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.style.cssText = 'color: #ef4444; font-size: 0.8rem; margin-top: 0.25rem;';
      errorDiv.textContent = message;
      
      field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
      field.style.borderColor = '';
      const errorDiv = field.parentNode.querySelector('.field-error');
      if (errorDiv) {
        errorDiv.remove();
      }
    }

    function formatPhoneDisplay(normalizedPhone) {
      // Formatear para mostrar: +52 999 123 4567
      if (normalizedPhone.length === 12) {
        return `+${normalizedPhone.substring(0, 2)} ${normalizedPhone.substring(2, 5)} ${normalizedPhone.substring(5, 8)} ${normalizedPhone.substring(8)}`;
      }
      return normalizedPhone;
    }

    // VALIDACIÓN COMPLETA DEL FORMULARIO
    function validateForm(formData) {
      const errors = [];
      
      // Validar nombre
      if (!formData.get('nombre') || formData.get('nombre').trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
      }
      
      // Validar email
      const emailResult = ValidationUtils.validateEmail(formData.get('email'));
      if (!emailResult.valid) {
        errors.push('Por favor ingresa un email válido');
      }
      
      // Validar teléfono
      const normalizedPhone = ValidationUtils.normalizePhone(formData.get('telefono'));
      if (!normalizedPhone) {
        errors.push('Por favor ingresa un teléfono mexicano válido');
      }
      
      // Validar tipo de evento
      if (!formData.get('tipoEvento')) {
        errors.push('Por favor selecciona el tipo de evento');
      }
      
      // Validar servicios
      const servicios = document.querySelectorAll('input[name="servicios[]"]:checked');
      if (servicios.length === 0) {
        errors.push('Por favor selecciona al menos un servicio de interés');
      }
      
      // Validar privacidad
      if (!formData.get('privacidad')) {
        errors.push('Debes aceptar el tratamiento de datos personales');
      }
      
      // Validar fecha si se proporciona
      if (formData.get('fechaEvento')) {
        const dateResult = ValidationUtils.validateEventDate(formData.get('fechaEvento'));
        if (!dateResult.valid) {
          errors.push(dateResult.message);
        }
      }
      
      return errors;
    }

    // PREPARAR DATOS PARA ENVÍO
    function prepareDataForSubmission(formData) {
      const data = {};
      
      // Normalizar y sanitizar cada campo
      data.nombre = ValidationUtils.normalizeName(formData.get('nombre'));
      data.email = ValidationUtils.validateEmail(formData.get('email')).normalized;
      data.telefono = ValidationUtils.normalizePhone(formData.get('telefono'));
      data.ciudad = ValidationUtils.sanitizeText(formData.get('ciudad'));
      data.tipoEvento = formData.get('tipoEvento');
      data.fechaEvento = formData.get('fechaEvento') || null;
      data.invitados = formData.get('invitados') || null;
      data.presupuesto = formData.get('presupuesto') || null;
      data.mensaje = ValidationUtils.sanitizeMessage(formData.get('mensaje'));
      
      // Servicios seleccionados
      const servicios = Array.from(document.querySelectorAll('input[name="servicios[]"]:checked'))
        .map(s => s.value);
      data.servicios = servicios;
      
      // Metadatos de seguridad
      data.timestamp = new Date().toISOString();
      data.userAgent = navigator.userAgent.substring(0, 200); // Limitado para seguridad
      data.referrer = document.referrer.substring(0, 200);
      
      return data;
    }


    // MOSTRAR PANTALLA DE ÉXITO
    function showSuccessScreen(formData, responseData) {
      const formContainer = document.querySelector('.form-container');
      const successScreen = document.getElementById('successScreen');
      
      // Ocultar formulario con animación
      formContainer.style.transition = 'all 0.5s ease';
      formContainer.style.transform = 'translateY(-50px)';
      formContainer.style.opacity = '0';
      
      setTimeout(() => {
        formContainer.style.display = 'none';
        successScreen.style.display = 'block';
        successScreen.style.opacity = '0';
        
        // Mostrar pantalla de éxito con animación
        setTimeout(() => {
          successScreen.style.transition = 'opacity 0.5s ease';
          successScreen.style.opacity = '1';
          displayAIMessage(formData, responseData);
        }, 100);
      }, 500);
    }

    // MOSTRAR MENSAJE DE IA
    function displayAIMessage(formData, responseData) {
      const aiMessageDiv = document.getElementById('aiMessage');
      const eventDetailsDiv = document.getElementById('eventDetails');
      
      // Simular loading por un momento para efecto visual
      setTimeout(() => {
        // Limpiar el contenido antes de pintar el mensaje personalizado
        aiMessageDiv.innerHTML = '';
        // Usar el mensaje del nuevo formato del backend (array o objeto)
        let aiMessage = `¡Gracias ${formData.nombre}! Hemos recibido tu solicitud para tu ${formData.tipoEvento}. Te contactaremos pronto para hacer realidad tu evento soñado.`;
        if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].output) {
          aiMessage = responseData[0].output;
        } else if (responseData && typeof responseData === 'object' && responseData.output) {
          aiMessage = responseData.output;
        }
        aiMessageDiv.innerHTML = `
          <h3>🤖 Gracias >${formData.nombre}</h3>
          <p>${aiMessage}</p>
        `;
        // Mostrar detalles del evento
        showEventDetails(formData, eventDetailsDiv);
      }, 2500); // 2.5 segundos de loading para efecto visual realista
    }

    // MOSTRAR DETALLES DEL EVENTO
    function showEventDetails(data, container) {
      const formatDate = (dateString) => {
        if (!dateString) return 'Por definir';
        return new Date(dateString).toLocaleDateString('es-MX', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      const formatGuests = (guests) => {
        if (!guests) return 'Por definir';
        return guests;
      };

      const formatBudget = (budget) => {
        if (!budget) return 'Por definir';
        return budget;
      };

      container.innerHTML = `
        <div class="event-detail">
          <div class="event-detail-label">Cliente</div>
          <div class="event-detail-value">${data.nombre}</div>
        </div>
        <div class="event-detail">
          <div class="event-detail-label">Tipo de Evento</div>
          <div class="event-detail-value">${data.tipoEvento.charAt(0).toUpperCase() + data.tipoEvento.slice(1)}</div>
        </div>
        <div class="event-detail">
          <div class="event-detail-label">Fecha</div>
          <div class="event-detail-value">${formatDate(data.fechaEvento)}</div>
        </div>
        <div class="event-detail">
          <div class="event-detail-label">Invitados</div>
          <div class="event-detail-value">${formatGuests(data.invitados)}</div>
        </div>
        <div class="event-detail">
          <div class="event-detail-label">Presupuesto</div>
          <div class="event-detail-value">${formatBudget(data.presupuesto)}</div>
        </div>
        <div class="event-detail email-detail">
          <div class="event-detail-label">Email</div>
          <div class="event-detail-value" style="word-break: break-all;">${data.email}</div>
        </div>
      `;

      container.style.display = 'grid';
      container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
      container.style.gap = '1rem';
      container.style.opacity = '0';
      container.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        container.style.transition = 'all 0.5s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      }, 500);
    // Ajuste visual para email largo
    const emailDetail = container.querySelector('.email-detail .event-detail-value');
    if (emailDetail) {
      emailDetail.style.whiteSpace = 'normal';
      emailDetail.style.overflowWrap = 'break-word';
      emailDetail.style.wordBreak = 'break-all';
    }
    }

    // FORMULARIO HANDLING MEJORADO
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Deshabilitar botón durante el envío
      const submitButton = this.querySelector('.submit-button');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
      
      try {
        // Recopilar datos del formulario
        const formData = new FormData(this);
        
        // Validar formulario
        const errors = validateForm(formData);
        if (errors.length > 0) {
          alert('Por favor corrige los siguientes errores:\n\n' + errors.join('\n'));
          
          // Rehabilitar botón en caso de errores de validación
          submitButton.disabled = false;
          submitButton.textContent = originalText;
          return;
        }
        
        // Preparar datos normalizados
        const normalizedData = prepareDataForSubmission(formData);
        
        console.log('Datos normalizados para envío:', normalizedData);
        
        // Determinar la URL del backend según el entorno
        let apiUrl;
        if (window.location.hostname === "vrdistribucion.com") {
          apiUrl = "https://vrdistribucion.com/api/cotizaciones";
        } else if (window.location.hostname === "www.vrdistribucion.com") {
          apiUrl = "https://www.vrdistribucion.com/api/cotizaciones";
        } else if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
          apiUrl = "http://localhost:8000/api/cotizaciones";
        }
        
        // LLAMADA AL BACKEND PROPIO (que luego llama a N8N)
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(normalizedData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(responseData => {
          // Mostrar pantalla de éxito con datos de la respuesta
          showSuccessScreen(normalizedData, responseData);
        })
        .catch(error => {
          console.error('Error en el envío:', error);
          alert('Hubo un problema al enviar tu solicitud. Por favor verifica tu conexión e intenta de nuevo, o contáctanos directamente por WhatsApp.');
        
          // Rehabilitar botón solo en caso de error
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        });
        
      } catch (error) {
        console.error('Error inesperado:', error);
        alert('Ocurrió un error inesperado. Por favor intenta nuevamente.');
        
        // Rehabilitar botón en caso de error
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });

    // INICIALIZACIÓN
    document.addEventListener('DOMContentLoaded', function() {
      createParticles();
      setupRealTimeValidation();
      
      // Navbar scroll effect
      window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
          header.style.height = '60px';
          header.style.background = 'rgba(255, 255, 255, 0.15)';
        } else {
          header.style.height = '70px';
          header.style.background = 'rgba(255, 255, 255, 0.1)';
        }
      });
    });