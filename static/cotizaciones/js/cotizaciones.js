function createParticles() {
    const container = document.getElementById("particles");
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 6 + "s";
        particle.style.animationDuration = Math.random() * 3 + 3 + "s";
        container.appendChild(particle);
    }
}

const ValidationUtils = {
    sanitizeText: (text) => text ? text.trim().replace(/[<>]/g, "").replace(/\s+/g, " ").substring(0, 500) : "",
    
    normalizeName: (name) => {
        if (!name) return "";
        return name.trim()
            .replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
            .substring(0, 100);
    },
    
    validateEmail: (email) => {
        if (!email) return { valid: false, normalized: "" };
        const normalized = email.trim().toLowerCase();
        return {
            valid: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(normalized) && normalized.length <= 254,
            normalized: normalized
        };
    },
    
    // Función modificada para números mexicanos sin prefijo +52
    normalizePhone: (phone) => {
        if (!phone) return "";
        
        // Remover todos los caracteres no numéricos
        let digits = phone.replace(/\D/g, "");
        
        // Para números mexicanos: deben tener exactamente 10 dígitos
        if (digits.length === 10) {
            return digits;
        }
        
        // Si tiene 12 dígitos y empieza con 52, remover el prefijo
        if (digits.length === 12 && digits.startsWith("52")) {
            return digits.substring(2);
        }
        
        // Si tiene 13 dígitos y empieza con 521, remover el prefijo
        if (digits.length === 13 && digits.startsWith("521")) {
            return digits.substring(3);
        }
        
        // Si no cumple ningún formato válido, retornar cadena vacía
        return "";
    },
    
    validateEventDate: (date) => {
        if (!date) return { valid: true, message: "" };
        
        const eventDate = new Date(date);
        const today = new Date();
        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() + 2);
        
        if (eventDate < today) {
            return { valid: false, message: "La fecha del evento debe ser futura" };
        }
        
        if (eventDate > maxDate) {
            return { valid: false, message: "La fecha del evento no puede ser más de 2 años adelante" };
        }
        
        return { valid: true, message: "" };
    },
    
    sanitizeMessage: (message) => message ? message.trim().replace(/[<>]/g, "").replace(/\s+/g, " ").substring(0, 2000) : ""
};

function setupRealTimeValidation() {
    // Nombre
    document.getElementById("nombre").addEventListener("input", function() {
        this.value = ValidationUtils.normalizeName(this.value);
        validateField(this);
    });

    // Email
    document.getElementById("email").addEventListener("blur", function() {
        const result = ValidationUtils.validateEmail(this.value);
        this.value = result.normalized;
        
        if (!result.valid && this.value) {
            showFieldError(this, "Por favor ingresa un email válido");
        } else {
            clearFieldError(this);
        }
    });

    // Teléfono - validación actualizada
    const phoneField = document.getElementById("telefono");
    phoneField.addEventListener("input", function() {
        // Permitir solo números, espacios, paréntesis y guiones mientras escribe
        this.value = this.value.replace(/[^\d\s()-]/g, "");
    });

    phoneField.addEventListener("blur", function() {
        const normalized = ValidationUtils.normalizePhone(this.value);
        
        if (this.value && !normalized) {
            showFieldError(this, "Por favor ingresa un teléfono mexicano válido de 10 dígitos");
        } else {
            clearFieldError(this);
            if (normalized) {
                // Formatear el teléfono para mostrar: 999 123 4567
                this.value = formatPhoneDisplay(normalized);
            }
        }
    });

    // Fecha del evento
    document.getElementById("fechaEvento").addEventListener("change", function() {
        const result = ValidationUtils.validateEventDate(this.value);
        if (result.valid) {
            clearFieldError(this);
        } else {
            showFieldError(this, result.message);
        }
    });

    // Mensaje con contador de caracteres
    document.getElementById("mensaje").addEventListener("input", function() {
        this.value = this.value.substring(0, 2000);
        
        let counter = this.parentNode.querySelector(".char-counter");
        if (!counter) {
            counter = document.createElement("div");
            counter.className = "char-counter";
            counter.style.cssText = "font-size: 0.8rem; color: #6b7280; text-align: right; margin-top: 0.5rem;";
            this.parentNode.appendChild(counter);
        }
        counter.textContent = `${this.value.length}/2000 caracteres`;
    });
}

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, "Este campo es obligatorio");
        return false;
    }
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = "#ef4444";
    
    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.style.cssText = "color: #ef4444; font-size: 0.8rem; margin-top: 0.25rem;";
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = "";
    const errorDiv = field.parentNode.querySelector(".field-error");
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Función actualizada para formatear teléfonos mexicanos de 10 dígitos
function formatPhoneDisplay(phone) {
    if (phone.length === 10) {
        return `${phone.substring(0, 3)} ${phone.substring(3, 6)} ${phone.substring(6)}`;
    }
    return phone;
}

function validateForm(formData) {
    const errors = [];
    
    // Validar nombre
    if (!formData.get("nombre") || formData.get("nombre").trim().length < 2) {
        errors.push("El nombre debe tener al menos 2 caracteres");
    }
    
    // Validar email
    if (!ValidationUtils.validateEmail(formData.get("email")).valid) {
        errors.push("Por favor ingresa un email válido");
    }
    
    // Validar teléfono - actualizado
    if (!ValidationUtils.normalizePhone(formData.get("telefono"))) {
        errors.push("Por favor ingresa un teléfono mexicano válido de 10 dígitos");
    }
    
    // Validar tipo de evento
    if (!formData.get("tipoEvento")) {
        errors.push("Por favor selecciona el tipo de evento");
    }
    
    // Validar servicios
    const selectedServices = document.querySelectorAll('input[name="servicios[]"]:checked');
    if (selectedServices.length === 0) {
        errors.push("Por favor selecciona al menos un servicio de interés");
    }
    
    // Validar privacidad
    if (!formData.get("privacidad")) {
        errors.push("Debes aceptar el tratamiento de datos personales");
    }
    
    // Validar fecha del evento (opcional)
    if (formData.get("fechaEvento")) {
        const dateResult = ValidationUtils.validateEventDate(formData.get("fechaEvento"));
        if (!dateResult.valid) {
            errors.push(dateResult.message);
        }
    }
    
    return errors;
}

function prepareDataForSubmission(formData) {
    const data = {};
    
    data.nombre = ValidationUtils.normalizeName(formData.get("nombre"));
    data.email = ValidationUtils.validateEmail(formData.get("email")).normalized;
    data.telefono = ValidationUtils.normalizePhone(formData.get("telefono")); // Solo 10 dígitos, sin prefijo
    data.ciudad = ValidationUtils.sanitizeText(formData.get("ciudad"));
    data.tipoEvento = formData.get("tipoEvento");
    data.fechaEvento = formData.get("fechaEvento") || null;
    data.invitados = formData.get("invitados") || null;
    data.presupuesto = formData.get("presupuesto") || null;
    data.mensaje = ValidationUtils.sanitizeMessage(formData.get("mensaje"));
    
    // Servicios seleccionados
    const selectedServices = Array.from(document.querySelectorAll('input[name="servicios[]"]:checked')).map(cb => cb.value);
    data.servicios = selectedServices;
    
    // Metadatos
    data.timestamp = new Date().toISOString();
    data.userAgent = navigator.userAgent.substring(0, 200);
    data.referrer = document.referrer.substring(0, 200);
    
    return data;
}

function showSuccessScreen(formData, apiResponse) {
    const formContainer = document.querySelector(".form-container");
    const successScreen = document.getElementById("successScreen");
    
    formContainer.style.transition = "all 0.5s ease";
    formContainer.style.transform = "translateY(-50px)";
    formContainer.style.opacity = "0";
    
    setTimeout(() => {
        formContainer.style.display = "none";
        successScreen.style.display = "block";
        successScreen.style.opacity = "0";
        
        setTimeout(() => {
            successScreen.style.transition = "opacity 0.5s ease";
            successScreen.style.opacity = "1";
            displayAIMessage(formData, apiResponse);
        }, 100);
    }, 500);
}

function displayAIMessage(formData, apiResponse) {
    const aiMessageDiv = document.getElementById("aiMessage");
    const eventDetailsDiv = document.getElementById("eventDetails");
    
    setTimeout(() => {
        aiMessageDiv.innerHTML = "";
        
        let message = `¡Gracias ${formData.nombre}! Hemos recibido tu solicitud para tu ${formData.tipoEvento}. Te contactaremos pronto para hacer realidad tu evento soñado.`;
        
        if (Array.isArray(apiResponse) && apiResponse.length > 0 && apiResponse[0].output) {
            message = apiResponse[0].output;
        } else if (apiResponse && typeof apiResponse === 'object' && apiResponse.output) {
            message = apiResponse.output;
        }
        
        aiMessageDiv.innerHTML = `
          <h3>🤖 Gracias ${formData.nombre}</h3>
          <p>${message}</p>
        `;
        
        showEventDetails(formData, eventDetailsDiv);
    }, 2500);
}

function showEventDetails(formData, container) {
    const formatDate = (dateStr) => {
        if (!dateStr) return "Por definir";
        return new Date(dateStr).toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    const formatGuests = (guests) => guests || "Por definir";
    const formatBudget = (budget) => budget || "Por definir";
    
    container.innerHTML = `
        <div class="event-detail">
          <div class="event-detail-label">Cliente</div>
          <div class="event-detail-value">${formData.nombre}</div>
        </div>
        <div class="event-detail">
          <div class="event-detail-label">Tipo de Evento</div>
          <div class="event-detail-value">${formData.tipoEvento.charAt(0).toUpperCase() + formData.tipoEvento.slice(1)}</div>
        </div>
        <div class="event-detail">
          <div class="event-detail-label">Fecha</div>
          <div class="event-detail-value">${formatDate(formData.fechaEvento)}</div>
        </div>
        <div class="event-detail">
          <div class="event-detail-label">Invitados</div>
          <div class="event-detail-value">${formatGuests(formData.invitados)}</div>
        </div>
        <div class="event-detail">
          <div class="event-detail-label">Presupuesto</div>
          <div class="event-detail-value">${formatBudget(formData.presupuesto)}</div>
        </div>
        <div class="event-detail email-detail">
          <div class="event-detail-label">Email</div>
          <div class="event-detail-value" style="word-break: break-all;">${formData.email}</div>
        </div>
      `;
    
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
    container.style.gap = "1rem";
    container.style.opacity = "0";
    container.style.transform = "translateY(20px)";
    
    setTimeout(() => {
        container.style.transition = "all 0.5s ease";
        container.style.opacity = "1";
        container.style.transform = "translateY(0)";
    }, 500);
    
    // Ajustar el email para que no se desborde
    const emailValue = container.querySelector(".email-detail .event-detail-value");
    if (emailValue) {
        emailValue.style.whiteSpace = "normal";
        emailValue.style.overflowWrap = "break-word";
        emailValue.style.wordBreak = "break-all";
    }
}

// Event listeners
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector(".submit-button");
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    
    try {
        const formData = new FormData(this);
        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            alert("Por favor corrige los siguientes errores:\n\n" + errors.join("\n"));
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            return;
        }
        
        const data = prepareDataForSubmission(formData);
        
        // Determinar la URL de la API
        let apiUrl;
        if (window.location.hostname === "vrdistribucion.com") {
            apiUrl = "https://vrdistribucion.com/api/cotizaciones";
        } else if (window.location.hostname === "www.vrdistribucion.com") {
            apiUrl = "https://www.vrdistribucion.com/api/cotizaciones";
        } else if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            apiUrl = "http://localhost:8000/api/cotizaciones";
        }
        
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            showSuccessScreen(data, result);
        })
        .catch(error => {
            alert("Hubo un problema al enviar tu solicitud. Por favor verifica tu conexión e intenta de nuevo, o contáctanos directamente por WhatsApp.");
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
        
    } catch (error) {
        alert("Ocurrió un error inesperado. Por favor intenta nuevamente.");
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});

document.addEventListener("DOMContentLoaded", function() {
    createParticles();
    setupRealTimeValidation();
    
    // Header scroll effect
    window.addEventListener("scroll", function() {
        const header = document.querySelector(".header");
        if (window.scrollY > 50) {
            header.style.height = "60px";
            header.style.background = "rgba(255, 255, 255, 0.15)";
        } else {
            header.style.height = "70px";
            header.style.background = "rgba(255, 255, 255, 0.1)";
        }
    });
});
