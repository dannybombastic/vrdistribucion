/**
 * VR Distribución - Contact Form Handler
 * Maneja el envío seguro del formulario de contacto
 */


class ContactForm {
    constructor() {
        this.form = document.querySelector('#contact form');
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        this.isSubmitting = false;
        
        // URLs del API
        this.apiUrl = this.getApiUrl();
        
        this.init();
    }

    /**
     * Detecta si estamos en localhost o producción y retorna la URL correcta
     */
    getApiUrl() {
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
            return 'http://127.0.0.1:8000/api/contact';
        } else {
            return 'https://api.vrdistribucion.com/api/contact';
        }
    }

    /**
     * Inicializa el formulario
     */
    init() {
        if (!this.form) {
            console.error('Formulario de contacto no encontrado');
            return;
        }

        // Agregar event listener para el envío del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Agregar validación en tiempo real
        this.addRealTimeValidation();
        
        console.log('Contact form initialized');
    }

    /**
     * Maneja el envío del formulario
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) {
            return;
        }

        // Limpiar mensajes de error previos
        this.clearErrors();

        // Validar formulario
        if (!this.validateForm()) {
            return;
        }

        // Obtener datos del formulario
        const formData = this.getFormData();
        
        try {
            this.setSubmitting(true);
            
            // Enviar datos al backend
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showSuccess(result.message);
                this.resetForm();
            } else {
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
        return {
            name: this.form.querySelector('#contact-name')?.value.trim(),
            email: this.form.querySelector('#contact-email')?.value.trim(),
            phone: this.form.querySelector('#contact-phone')?.value.trim(),
            message: this.form.querySelector('#contact-message')?.value.trim(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Valida el formulario
     */
    validateForm() {
        let isValid = true;
        
        // Validar nombre
        const name = this.form.querySelector('#contact-name');
        if (!name?.value.trim()) {
            this.showFieldError('name-error', 'El nombre es obligatorio');
            isValid = false;
        } else if (name.value.trim().length < 2) {
            this.showFieldError('name-error', 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        }

        // Validar email
        const email = this.form.querySelector('#contact-email');
        if (!email?.value.trim()) {
            this.showFieldError('email-error', 'El email es obligatorio');
            isValid = false;
        } else if (!this.isValidEmail(email.value.trim())) {
            this.showFieldError('email-error', 'Por favor ingresa un email válido');
            isValid = false;
        }

        // Validar teléfono (opcional pero si se ingresa debe ser válido)
        const phone = this.form.querySelector('#contact-phone');
        if (phone?.value.trim() && !this.isValidPhone(phone.value.trim())) {
            this.showFieldError('phone-error', 'Por favor ingresa un teléfono válido');
            isValid = false;
        }

        // Validar mensaje
        const message = this.form.querySelector('#contact-message');
        if (!message?.value.trim()) {
            this.showFieldError('message-error', 'El mensaje es obligatorio');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            this.showFieldError('message-error', 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        }

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
     * Valida formato de teléfono mexicano
     */
    isValidPhone(phone) {
        // Remover espacios, guiones y paréntesis para validar
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        // Validar que sean solo números y tenga la longitud correcta
        const phoneRegex = /^\d{10,13}$/;
        return phoneRegex.test(cleanPhone);
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
                } else if (value.length < 10) {
                    this.showFieldError('message-error', 'El mensaje debe tener al menos 10 caracteres');
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
    new ContactForm();
});

// Exportar para uso en otros scripts si es necesario
window.ContactForm = ContactForm;