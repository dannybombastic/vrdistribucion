class CookieConsent {
    constructor() {
        this.cookieConsent = null;
        this.acceptButton = null;
        this.privacyButton = null;
        this.init();
    }

    init() {
        // Create cookie consent element
        this.createCookieConsentElement();

        // Initialize buttons
        this.initializeButtons();

        // Check if user has already accepted cookies
        if (!this.hasAcceptedCookies()) {
            this.show();
        }
    }

    createCookieConsentElement() {
        this.cookieConsent = document.createElement('div');
        this.cookieConsent.className = 'cookie-consent';
        this.cookieConsent.innerHTML = `
            <div class="cookie-consent-content">
                <p class="cookie-consent-text">
                    Utilizamos cookies para mejorar tu experiencia en nuestro sitio web.
                    Al continuar navegando, aceptas nuestra
                    <a href="/cookie-consent/Politica_de_Privacidad_VR_Distribucion.html" class="cookie-consent-button privacy">Política de Privacidad</a>.
                </p>
                <div class="cookie-consent-buttons">
                    <button class="cookie-consent-button privacy">Política de Privacidad</button>
                    <button class="cookie-consent-button accept">Aceptar</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.cookieConsent);
    }

    initializeButtons() {
        this.acceptButton = this.cookieConsent.querySelector('.cookie-consent-button.accept');
        this.privacyButton = this.cookieConsent.querySelector('.cookie-consent-button.privacy');

        this.acceptButton.addEventListener('click', () => this.accept());
        this.privacyButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/cookie-consent/Politica_de_Privacidad_VR_Distribucion.html';
        });
    }

    show() {
        // Add a small delay before showing the consent banner
        setTimeout(() => {
            this.cookieConsent.classList.add('show');
        }, 1000);
    }

    hide() {
        this.cookieConsent.classList.remove('show');
    }

    accept() {
        this.hide();
        localStorage.setItem('cookiesAccepted', 'true');
        // Trigger any necessary cookie-related functionality
        this.initializeCookies();
    }

    hasAcceptedCookies() {
        return localStorage.getItem('cookiesAccepted') === 'true';
    }

    initializeCookies() {
        // Initialize any necessary cookies or tracking here
        // For example, Google Analytics initialization
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }
}

// Initialize cookie consent when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
});