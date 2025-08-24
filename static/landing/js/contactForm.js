/**
 * VR Distribución - Conta    getApiUrl() {
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname === '0.0.0.0' ||
                           window.location.port === '3000' ||
                           window.location.port === '5500' ||
                           window.location.href.includes('127.0.0.1');
        
        console.log('API URL Detection:');
        console.log('hostname:', window.location.hostname);
        console.log('port:', window.location.port);
        console.log('href:', window.location.href);
        console.log('isLocalhost:', isLocalhost);
        
        if (isLocalhost) {
            console.log('Using localhost API URL');
            return 'http://127.0.0.1:8000/api/contact';
        } else if (window.location.hostname === 'vrdistribucion.com' || window.location.hostname === 'www.vrdistribucion.com') {
            console.log('Using production API URL');
            return 'https://vrdistribucion.com/api/contact';
        }
        
        // Fallback to localhost if unsure
        console.log('Fallback to localhost API URL');
        return 'http://127.0.0.1:8000/api/contact';
    }ler
 * Maneja el envío seguro del formulario de contacto
 */


class ContactForm {
    constructor() {
        // console.log('ContactForm constructor called');
        // console.log('Document ready state:', document.readyState);
        
        this.form = document.querySelector('#contact form');
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        this.isSubmitting = false;
        
        // Cache field references for better performance and consistency
        this.nameField = null;
        this.emailField = null;
        this.phoneField = null;
        this.messageField = null;
        
        // URLs del API
        this.apiUrl = this.getApiUrl();
        
        this.init();
    }

    /**
     * Detecta si estamos en localhost o producción y retorna la URL correcta
     */
    getApiUrl() {
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname === '0.0.0.0' ||
                           window.location.port === '5500';
        
        if (isLocalhost) {
            return 'http://127.0.0.1:8000/api/contact';
        } else if (window.location.hostname === 'vrdistribucion.com' || window.location.hostname === 'www.vrdistribucion.com') {
            return 'https://vrdistribucion.com/api/contact';
        }
    }

    /**
     * Inicializa el formulario
     */
    init() {
        console.log('Initializing ContactForm...');
        
        if (!this.form) {
            console.error('Contact form not found!');
            return;
        }
        
        console.log('Form found:', this.form);
        console.log('Form innerHTML:', this.form.innerHTML.substring(0, 200) + '...');
        
        // Cache field references con debugging detallado
        this.nameField = this.form.querySelector('#contact-name');
        this.emailField = this.form.querySelector('#contact-email');
        this.phoneField = this.form.querySelector('#contact-phone');
        this.messageField = this.form.querySelector('#contact-message');
        
        console.log('Cached field references:');
        console.log('Name field:', this.nameField);
        console.log('Name field value:', this.nameField?.value);
        console.log('Name field HTML:', this.nameField?.outerHTML);
        console.log('Email field:', this.emailField);
        console.log('Email field value:', this.emailField?.value);
        console.log('Phone field:', this.phoneField);
        console.log('Phone field value:', this.phoneField?.value);
        console.log('Message field:', this.messageField);
        console.log('Message field value:', this.messageField?.value);
        
        if (!this.nameField || !this.emailField || !this.phoneField || !this.messageField) {
            console.error('Some form fields are missing!');
            return;
        }
        
        this.attachEventListeners();
        // console.log('ContactForm initialized successfully');
    }

    /**
     * Configura los event listeners del formulario
     */
    attachEventListeners() {
        // console.log('Attaching event listeners...');
        
        // Event listener para el submit del formulario
        if (this.form) {
            this.form.addEventListener('submit', (event) => this.handleSubmit(event));
            console.log('Form submit listener attached');
        }
        
        // Event listener para el botón submit
        if (this.submitButton) {
            this.submitButton.addEventListener('click', (event) => {
                console.log('Submit button clicked!');
                console.log('Button type:', this.submitButton.type);
                
                // Debug: verificar valores actuales usando referencias cacheadas
                // console.log('Current field values at button click (cached references):');
                // console.log('Name:', this.nameField?.value || '[empty]');
                // console.log('Email:', this.emailField?.value || '[empty]');
                // console.log('Phone:', this.phoneField?.value || '[empty]');
                // console.log('Message:', this.messageField?.value || '[empty]');
                
                // Debug: verificar valores usando querySelector fresh
                console.log('Current field values at button click (fresh selectors):');
                const nameFieldFresh = this.form.querySelector('#contact-name');
                const emailFieldFresh = this.form.querySelector('#contact-email');
                const phoneFieldFresh = this.form.querySelector('#contact-phone');
                const messageFieldFresh = this.form.querySelector('#contact-message');
                
                // console.log('Name (fresh):', nameFieldFresh?.value || '[empty]');
                // console.log('Email (fresh):', emailFieldFresh?.value || '[empty]');
                // console.log('Phone (fresh):', phoneFieldFresh?.value || '[empty]');
                // console.log('Message (fresh):', messageFieldFresh?.value || '[empty]');
                
                // Debug: comparar referencias
                // console.log('Are cached references the same as fresh?');
                // console.log('Name same?', this.nameField === nameFieldFresh);
                // console.log('Email same?', this.emailField === emailFieldFresh);
                // console.log('Phone same?', this.phoneField === phoneFieldFresh);
                // console.log('Message same?', this.messageField === messageFieldFresh);
            });
            console.log('Submit button listener attached');
        }
        
        // Agregar validación en tiempo real
        this.addRealTimeValidation();
        console.log('Real-time validation added');
    }

    /**
     * Maneja el envío del formulario
     */
    async handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log('Form submit event triggered!');
        
        if (this.isSubmitting) {
            console.log('Form already submitting, ignoring...');
            return;
        }

        console.log('Starting form submission process...');

        // Limpiar mensajes de error previos
        // TEMPORARILY DISABLED: this.clearErrors();

        // Validar formulario
        if (!this.validateForm()) {
            console.log('Form validation failed');
            return;
        }

        // Obtener datos del formulario
        const formData = this.getFormData();
        console.log('Form data:', formData);
        console.log('API URL:', this.apiUrl);
        
        try {
            this.setSubmitting(true);
            console.log('Sending request to:', this.apiUrl);
            
            // Enviar datos al backend
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            const result = await response.json();
            console.log('Response data:', result);

            if (response.ok && result.success) {
                console.log('Success! Showing success message');
                this.showSuccess(result.message);
                this.resetForm();
            } else {
                console.log('Error in response:', result.error);
                this.showError(result.error || 'Error al enviar el mensaje');
            }

        } catch (error) {
            console.error('Error al enviar formulario:', error);
            this.showError('Error de conexión. Por favor intenta nuevamente.');
        } finally {
            this.setSubmitting(false);
        }
    }

    /**
     * Obtiene los datos del formulario
     */
    getFormData() {
        console.log('Getting form data using cached references...');
        console.log('Cached field elements:');
        console.log('Name field element:', this.nameField);
        console.log('Email field element:', this.emailField);
        console.log('Phone field element:', this.phoneField);
        console.log('Message field element:', this.messageField);
        
        const formData = {
            name: this.nameField?.value.trim() || '',
            email: this.emailField?.value.trim() || '',
            phone: this.phoneField?.value.trim() || '',
            message: this.messageField?.value.trim() || '',
            timestamp: new Date().toISOString()
        };
        
        console.log('Raw form data from cached references:', formData);
        return formData;
    }

    /**
     * Valida el formulario
     */
    validateForm() {
        let isValid = true;
        console.log('Starting form validation...');
        
        // Validar nombre usando referencia cacheada
        console.log('Name field:', this.nameField?.value);
        if (!this.nameField?.value.trim()) {
            console.log('Name validation failed: empty');
            this.showFieldError('name-error', 'El nombre es obligatorio');
            isValid = false;
        } else if (this.nameField.value.trim().length < 2) {
            console.log('Name validation failed: too short');
            this.showFieldError('name-error', 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        } else {
            console.log('Name validation passed');
        }

        // Validar email usando referencia cacheada
        console.log('Email field:', this.emailField?.value);
        if (!this.emailField?.value.trim()) {
            console.log('Email validation failed: empty');
            this.showFieldError('email-error', 'El email es obligatorio');
            isValid = false;
        } else if (!this.isValidEmail(this.emailField.value.trim())) {
            console.log('Email validation failed: invalid format');
            this.showFieldError('email-error', 'Por favor ingresa un email válido');
            isValid = false;
        } else {
            console.log('Email validation passed');
        }

        // Validar teléfono usando referencia cacheada (opcional pero si se ingresa debe ser válido)
        console.log('Phone field:', this.phoneField?.value);
        if (this.phoneField?.value.trim() && !this.isValidPhone(this.phoneField.value.trim())) {
            console.log('Phone validation failed: invalid format');
            this.showFieldError('phone-error', 'Por favor ingresa un teléfono válido');
            isValid = false;
        } else {
            console.log('Phone validation passed');
        }

        // Validar mensaje usando referencia cacheada
        console.log('Message field length:', this.messageField?.value.trim().length);
        if (!this.messageField?.value.trim()) {
            console.log('Message validation failed: empty');
            this.showFieldError('message-error', 'El mensaje es obligatorio');
            isValid = false;
        } else if (this.messageField.value.trim().length < 5) {
            console.log('Message validation failed: too short');
            this.showFieldError('message-error', 'El mensaje debe tener al menos 5 caracteres');
            isValid = false;
        } else {
            console.log('Message validation passed');
        }

        console.log('Form validation result:', isValid);
        return isValid;
    }

    /**
     * Valida formato de email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida formato de teléfono mexicano (más flexible)
     */
    isValidPhone(phone) {
        // Si está vacío, es válido (campo opcional)
        if (!phone || phone.trim() === '') {
            return true;
        }
        
        // Remover espacios, guiones, paréntesis, puntos y signos + para validar
        const cleanPhone = phone.replace(/[\s\-\(\)\.\+]/g, '');
        
        // Debe contener solo números después de limpiar
        if (!/^\d+$/.test(cleanPhone)) {
            return false;
        }
        
        // Aceptar longitudes comunes para teléfonos mexicanos e internacionales
        // 10 dígitos: teléfono local mexicano (998 123 4567)
        // 12 dígitos: con código de país mexicano (52 998 123 4567)
        // 13 dígitos: con código de país y lada completa (+52 1 998 123 4567)
        // También acepta otros rangos para números internacionales
        const phoneLength = cleanPhone.length;
        return phoneLength >= 7 && phoneLength <= 15;
    }

    /**
     * Agrega validación en tiempo real
     */
    addRealTimeValidation() {
        const fields = ['#contact-name', '#contact-email', '#contact-phone', '#contact-message'];
        
        fields.forEach(selector => {
            const field = this.form.querySelector(selector);
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            }
        });
    }

    /**
     * Valida un campo individual
     */
    validateField(field) {
        const fieldId = field.id;
        const value = field.value.trim();
        
        switch (fieldId) {
            case 'contact-name':
                if (!value) {
                    this.showFieldError('name-error', 'El nombre es obligatorio');
                } else if (value.length < 2) {
                    this.showFieldError('name-error', 'El nombre debe tener al menos 2 caracteres');
                }
                break;
                
            case 'contact-email':
                if (!value) {
                    this.showFieldError('email-error', 'El email es obligatorio');
                } else if (!this.isValidEmail(value)) {
                    this.showFieldError('email-error', 'Por favor ingresa un email válido');
                }
                break;
                
            case 'contact-phone':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError('phone-error', 'Por favor ingresa un teléfono válido');
                }
                break;
                
            case 'contact-message':
                if (!value) {
                    this.showFieldError('message-error', 'El mensaje es obligatorio');
                } else if (value.length < 5) {
                    this.showFieldError('message-error', 'El mensaje debe tener al menos 5 caracteres');
                }
                break;
        }
    }

    /**
     * Muestra error en un campo específico
     */
    showFieldError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    /**
     * Limpia error de un campo específico
     */
    clearFieldError(field) {
        const fieldId = field.id;
        let errorId = '';
        
        switch (fieldId) {
            case 'contact-name':
                errorId = 'name-error';
                break;
            case 'contact-email':
                errorId = 'email-error';
                break;
            case 'contact-phone':
                errorId = 'phone-error';
                break;
            case 'contact-message':
                errorId = 'message-error';
                break;
        }
        
        if (errorId) {
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.style.display = 'none';
                errorElement.textContent = '';
            }
        }
    }

    /**
     * Limpia todos los errores
     */
    clearErrors() {
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.style.display = 'none';
            element.textContent = '';
        });
    }

    /**
     * Muestra mensaje de éxito
     */
    showSuccess(message) {
        const successElement = document.getElementById('form-success-message');
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';
            
            // Ocultar después de 5 segundos
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Muestra mensaje de error general
     */
    showError(message) {
        const errorElement = document.getElementById('form-general-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    /**
     * Controla el estado de envío
     */
    setSubmitting(isSubmitting) {
        this.isSubmitting = isSubmitting;
        
        if (this.submitButton) {
            this.submitButton.disabled = isSubmitting;
            this.submitButton.textContent = isSubmitting ? 'Enviando...' : 'Enviar Mensaje';
        }
    }

    /**
     * Resetea el formulario después del envío exitoso
     */
    resetForm() {
        this.form.reset();
        this.clearErrors();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing ContactForm');
    console.log('Location:', window.location.href);
    new ContactForm();
});

// Exportar para uso en otros scripts si es necesario
window.ContactForm = ContactForm;