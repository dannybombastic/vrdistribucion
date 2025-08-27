class CookieConsent {
    constructor() {
        console.log("CookieConsent initialized");
        this.cookieConsent = null;
        this.acceptButton = null;
        this.privacyButton = null;
        this.init();
    }

    init() {
        this.createCookieConsentElement();
        this.initializeButtons();
        if (!this.hasAcceptedCookies()) {
            this.show();
        }
    }

    createCookieConsentElement() {
        this.cookieConsent = document.createElement("div");
        this.cookieConsent.className = "cookie-consent";
        this.cookieConsent.innerHTML = `
            <div class="cookie-consent-content">
                <p class="cookie-consent-text">
                    Utilizamos cookies para mejorar tu experiencia en nuestro sitio web.
                    Al continuar navegando, aceptas nuestra
                    <a href="/cookie-consent/Politica_de_Privacidad_VR_Distribucion.html" target="_blank">Política de Privacidad</a>.
                </p>
                <div class="cookie-consent-buttons">
                    <button class="cookie-consent-button accept">Aceptar</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.cookieConsent);
    }

    initializeButtons() {
        this.acceptButton = this.cookieConsent.querySelector(".cookie-consent-button.accept");
        this.acceptButton.addEventListener("click", () => this.accept());
    }

    show() {
        console.log("Showing cookie consent popup");
        setTimeout(() => {
            this.cookieConsent.classList.add("show");
        }, 1000);
    }

    hide() {
        this.cookieConsent.classList.remove("show");
        setTimeout(() => {
            this.cookieConsent.style.display = "none";
        }, 500);
    }

    accept() {
        this.hide();
        localStorage.setItem("cookiesAccepted", "true");
        this.initializeCookies();
    }

    hasAcceptedCookies() {
        return localStorage.getItem("cookiesAccepted") === "true";
    }

    initializeCookies() {
        if (typeof gtag !== "undefined") {
            gtag("consent", "update", {
                analytics_storage: "granted"
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Cookie consent script loaded");
    new CookieConsent();
});
