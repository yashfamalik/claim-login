// Claim Login Form - Auto Initialize with Proxy Support
const ClaimLoginForm = {
  // Configuration
  config: {
    styleId: 'claim-form-styles',
    containerId: 'claim-login-container',
    cssPrefix: 'clm-',
    defaults: {
      heading: 'File Claim',
      emailLabel: 'Email',
      orderLabel: 'Order number',
      emailPlaceholder: 'your@email.com',
      orderPlaceholder: 'e.g. #1234',
      buttonText: 'Find Order',
      errorMessage: 'Please enter both email and order number.'
    }
  },

  // Proxy system for settings management
  proxy: {
    contentSettings: null,
    colorSettings: null,
    subscribers: new Set(),

    subscribe(callback) {
      this.subscribers.add(callback);
      return () => this.subscribers.delete(callback);
    },

    notify() {
      this.subscribers.forEach(callback => {
        callback({
          contentSettings: this.contentSettings,
          colorSettings: this.colorSettings
        });
      });
    },

    updateContentSettings(settings) {
      this.contentSettings = typeof settings === 'function' 
        ? settings(this.contentSettings) 
        : { ...this.contentSettings, ...settings };
      this.notify();
    },

    updateColorSettings(settings) {
      this.colorSettings = typeof settings === 'function' 
        ? settings(this.colorSettings) 
        : { ...this.colorSettings, ...settings };
      this.notify();
    },

    getContentSettings() {
      return this.contentSettings;
    },

    getColorSettings() {
      return this.colorSettings;
    }
  },

  // Inject CSS styles once
  injectStyles() {
    if (document.getElementById(this.config.styleId)) return;
    
    const styles = `
      :root {
        --clm-card-bg: #ffffff;
        --clm-gradient-start: #2196f3;
        --clm-gradient-end: #00bcd4;
        --clm-button-bg: #2196f3;
        --clm-button-text: #ffffff;
        --clm-heading-text: #202223;
        --clm-label-text: #202223;
      }

      .${this.config.cssPrefix}wrapper {
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
        width: 100%;
        min-height: 100vh;
        background: #f5f7fb;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 24px;
        box-sizing: border-box;
      }
      
      .${this.config.cssPrefix}container {
        width: 100%;
        max-width: 420px;
        background: var(--clm-card-bg);
        border-radius: 12px;
        border: 1px solid rgba(0,0,0,0.08);
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
        padding: 2rem;
        box-sizing: border-box;
      }

      .${this.config.cssPrefix}container.gradient {
        background: linear-gradient(90deg, var(--clm-gradient-start), var(--clm-gradient-end));
      }
      
      .${this.config.cssPrefix}form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .${this.config.cssPrefix}heading {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--clm-heading-text);
        text-align: center;
        margin: 0;
      }
      
      .${this.config.cssPrefix}fields {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .${this.config.cssPrefix}label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--clm-label-text);
        font-weight: 500;
        font-size: 0.875rem;
      }
      
      .${this.config.cssPrefix}input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        background: #ffffff;
        color: #111827;
        font-size: 1rem;
        box-sizing: border-box;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      
      .${this.config.cssPrefix}input:focus {
        outline: none;
        border-color: #2196f3;
        box-shadow: 0 0 0 3px rgba(33,150,243,0.1);
      }
      
      .${this.config.cssPrefix}error {
        display: none;
        border-radius: 0.5rem;
        padding: 1rem;
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
        font-size: 0.875rem;
        align-items: center;
        gap: 0.5rem;
      }
      
      .${this.config.cssPrefix}error.show {
        display: flex;
      }
      
      .${this.config.cssPrefix}button {
        width: 100%;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 0.5rem;
        background: var(--clm-button-bg);
        color: var(--clm-button-text);
        cursor: pointer;
        font-weight: 500;
        font-size: 1rem;
        transition: all 0.15s ease;
        box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06);
      }
      
      .${this.config.cssPrefix}button:hover {
        opacity: 0.9;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
      }
      
      .${this.config.cssPrefix}button:active {
        opacity: 0.85;
        transform: translateY(1px);
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.id = this.config.styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  },

  // Apply color settings to CSS variables
  applyColorSettings(colorSettings) {
    if (!colorSettings) return;
    
    const root = document.documentElement;
    const container = document.querySelector(`.${this.config.cssPrefix}container`);
    
    if (colorSettings.cardBg) {
      root.style.setProperty('--clm-card-bg', colorSettings.cardBg);
    }
    if (colorSettings.gradientStart) {
      root.style.setProperty('--clm-gradient-start', colorSettings.gradientStart);
    }
    if (colorSettings.gradientEnd) {
      root.style.setProperty('--clm-gradient-end', colorSettings.gradientEnd);
    }
    if (colorSettings.buttonBg) {
      root.style.setProperty('--clm-button-bg', colorSettings.buttonBg);
    }
    if (colorSettings.buttonText) {
      root.style.setProperty('--clm-button-text', colorSettings.buttonText);
    }
    if (colorSettings.headingText) {
      root.style.setProperty('--clm-heading-text', colorSettings.headingText);
    }

    // Handle gradient toggle
    if (container) {
      if (colorSettings.useGradient) {
        container.classList.add('gradient');
      } else {
        container.classList.remove('gradient');
      }
    }
  },

  // Apply content settings to form elements
  applyContentSettings(contentSettings) {
    if (!contentSettings) return;
    
    const elements = {
      heading: document.querySelector(`.${this.config.cssPrefix}heading`),
      emailLabel: document.querySelector(`.${this.config.cssPrefix}label[for="email"]`),
      orderLabel: document.querySelector(`.${this.config.cssPrefix}label[for="order"]`),
      emailInput: document.querySelector(`.${this.config.cssPrefix}input[name="email"]`),
      orderInput: document.querySelector(`.${this.config.cssPrefix}input[name="order"]`),
      button: document.querySelector(`.${this.config.cssPrefix}button`),
      error: document.querySelector(`.${this.config.cssPrefix}error`)
    };

    if (contentSettings.heading && elements.heading) {
      elements.heading.textContent = contentSettings.heading;
    }
    if (contentSettings.emailLabel && elements.emailLabel) {
      elements.emailLabel.textContent = contentSettings.emailLabel;
    }
    if (contentSettings.orderNumberLabel && elements.orderLabel) {
      elements.orderLabel.textContent = contentSettings.orderNumberLabel;
    }
    if (contentSettings.emailPlaceholder && elements.emailInput) {
      elements.emailInput.placeholder = contentSettings.emailPlaceholder;
    }
    if (contentSettings.orderNumberPlaceholder && elements.orderInput) {
      elements.orderInput.placeholder = contentSettings.orderNumberPlaceholder;
    }
    if (contentSettings.buttonText && elements.button) {
      elements.button.textContent = contentSettings.buttonText;
    }
    if (contentSettings.errorMessage && elements.error) {
      elements.error.textContent = contentSettings.errorMessage;
    }
  },

  // Create DOM element with options
  createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.className) element.className = options.className;
    if (options.text) element.textContent = options.text;
    if (options.id) element.id = options.id;
    
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          element.setAttribute(key, value);
        }
      });
    }
    
    return element;
  },

  // Build the complete form
  buildForm(onSubmitCallback) {
    const prefix = this.config.cssPrefix;
    const defaults = this.config.defaults;
    
    // Main wrapper
    const wrapper = this.createElement('div', {
      className: `${prefix}wrapper`,
      id: this.config.containerId
    });
    
    // Form container
    const container = this.createElement('div', {
      className: `${prefix}container`
    });
    
    // Form element
    const form = this.createElement('form', {
      className: `${prefix}form`
    });
    
    // Heading
    const heading = this.createElement('h1', {
      className: `${prefix}heading`,
      text: defaults.heading
    });
    
    // Fields container
    const fields = this.createElement('div', {
      className: `${prefix}fields`
    });
    
    // Email field
    const emailLabel = this.createElement('label', {
      className: `${prefix}label`,
      text: defaults.emailLabel,
      attrs: { for: 'email' }
    });
    
    const emailInput = this.createElement('input', {
      className: `${prefix}input`,
      attrs: {
        type: 'email',
        name: 'email',
        id: 'email',
        placeholder: defaults.emailPlaceholder,
        autocomplete: 'email',
        required: true
      }
    });
    
    // Order field
    const orderLabel = this.createElement('label', {
      className: `${prefix}label`,
      text: defaults.orderLabel,
      attrs: { for: 'order' }
    });
    
    const orderInput = this.createElement('input', {
      className: `${prefix}input`,
      attrs: {
        type: 'text',
        name: 'order',
        id: 'order',
        placeholder: defaults.orderPlaceholder,
        autocomplete: 'off',
        required: true
      }
    });
    
    // Error message
    const errorDiv = this.createElement('div', {
      className: `${prefix}error`,
      text: defaults.errorMessage
    });
    
    // Submit button
    const submitButton = this.createElement('button', {
      className: `${prefix}button`,
      text: defaults.buttonText,
      attrs: { type: 'submit' }
    });
    
    // Assemble form
    fields.appendChild(emailLabel);
    fields.appendChild(emailInput);
    fields.appendChild(orderLabel);
    fields.appendChild(orderInput);
    
    form.appendChild(heading);
    form.appendChild(fields);
    form.appendChild(errorDiv);
    form.appendChild(submitButton);
    
    container.appendChild(form);
    wrapper.appendChild(container);
    
    // Add form submission handler
    this.addFormHandler(form, emailInput, orderInput, errorDiv, onSubmitCallback);
    
    return wrapper;
  },

  // Handle form submission and validation
  addFormHandler(form, emailInput, orderInput, errorDiv, callback) {
    const handleSubmit = (e) => {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      const orderNumber = orderInput.value.trim();
      
      // Validation
      if (!email || !orderNumber) {
        this.showError(errorDiv);
        return;
      }
      
      this.hideError(errorDiv);
      
      // Execute callback with form data
      if (typeof callback === 'function') {
        callback({ email, orderNumber });
      } else {
        // Default action
        console.log('Form Data:', { email, orderNumber });
        alert(`Form submitted!\nEmail: ${email}\nOrder: ${orderNumber}`);
      }
    };
    
    form.addEventListener('submit', handleSubmit);
  },

  // Show error message
  showError(errorDiv) {
    errorDiv.classList.add('show');
  },

  // Hide error message
  hideError(errorDiv) {
    errorDiv.classList.remove('show');
  },

  // Main initialization function
  init(callback) {
    this.injectStyles();
    const formElement = this.buildForm(callback);
    
    // Set up proxy subscription
    this.proxy.subscribe(({ contentSettings, colorSettings }) => {
      this.applyContentSettings(contentSettings);
      this.applyColorSettings(colorSettings);
    });
    
    // Add to page
    if (document.body) {
      document.body.appendChild(formElement);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(formElement);
      });
    }
    
    return formElement;
  },

  // Remove form from page
  destroy() {
    const container = document.getElementById(this.config.containerId);
    if (container) {
      container.remove();
    }
  }
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ClaimLoginForm.init();
    });
  } else {
    ClaimLoginForm.init();
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClaimLoginForm;
} else if (typeof define === 'function' && define.amd) {
  define(() => ClaimLoginForm);
} else {
  window.ClaimLogin = ClaimLoginForm;
}

