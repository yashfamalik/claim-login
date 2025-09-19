// // Claim Login Form - Auto Initialize with Proxy Support

// const ClaimLoginForm = {
//   // Configuration
//   config: {
//     styleId: "claim-form-styles",
//     containerId: "claim-login-container",
//     defaults: {
//       heading: "File Claim",
//       emailLabel: "Email",
//       orderLabel: "Order number",
//       emailPlaceholder: "your@email.com",
//       orderPlaceholder: "e.g. #1234",
//       buttonText: "Find Order",
//       errorMessage: "Please enter both email and order number.",
//     },
//   },

//   // Proxy system for settings management
//   proxy: {
//     contentSettings: null,
//     colorSettings: null,
//     subscribers: new Set(),

//     subscribe(callback) {
//       this.subscribers.add(callback);
//       return () => this.subscribers.delete(callback);
//     },

//     notify() {
//       this.subscribers.forEach((callback) => {
//         callback({
//           contentSettings: this.contentSettings,
//           colorSettings: this.colorSettings,
//         });
//       });
//     },

//     updateContentSettings(settings) {
//       this.contentSettings =
//         typeof settings === "function"
//           ? settings(this.contentSettings)
//           : { ...this.contentSettings, ...settings };
//       this.notify();
//     },

//     updateColorSettings(settings) {
//       this.colorSettings =
//         typeof settings === "function"
//           ? settings(this.colorSettings)
//           : { ...this.colorSettings, ...settings };
//       this.notify();
//     },

//     getContentSettings() {
//       return this.contentSettings;
//     },

//     getColorSettings() {
//       return this.colorSettings;
//     },
//   },

//   // Inject CSS styles once
//   injectStyles() {
//     if (document.getElementById(this.config.styleId)) return;

//     const CSS = `
//         :root {
//           --clm-card-bg: #ffffff;
//           --clm-gradient-start: #2196f3;
//           --clm-gradient-end: #00bcd4;
//           --clm-button-bg: #333333;
//           --clm-button-text: #ffffff;
//           --clm-heading-text: #333333;
//           --clm-label-text: #666666;
//         }

//         .clm-wrapper {
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//           width: 100%;
//           min-height: 80vh;
//           background: #f8f9fa;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0;
//           box-sizing: border-box;
//         }
        
//         .clm-container {
//           width: 100%;
//           max-width: 370px;
//           background: var(--clm-card-bg);
//           padding: 1em;
//           box-sizing: border-box;
//           border-radius: 12px;
//           border: 1px solid #ebebeb;
//           box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); 
//         }

//         .clm-container.gradient {
//           background: linear-gradient(90deg, var(--clm-gradient-start), var(--clm-gradient-end));
//         }
        
//         .clm-form {
//           display: flex;
//           flex-direction: column;
//           gap: 1rem;
//         }
        
//         .clm-heading {
//           font-size: 1.25rem;
//           font-weight: 600;
//           color: var(--clm-heading-text);
//           text-align: left;
//           margin: 0;
//           word-wrap: break-word;
//           letter-spacing: -0.025em;
//         }
        
//         .clm-fields {
//           display: flex;
//           flex-direction: column;
//           gap:  0.5rem;
//         }
        
//         .clm-label {
//           display: block;
//           color: var(--clm-label-text);
//           font-weight: 500;
//           font-size: 0.875rem;
//         }
        
//         .clm-input {
//           width: 100%;
//           padding:0.5rem 0.75rem;
//           border: 1px solid #e1e5e9;
//           border-radius: 0.375rem;
//           background: #ffffff;
//           color: #333333;
//           font-size: 1rem;
//           box-sizing: border-box;
//           transition: all 0.2s ease;
//           font-family: inherit;
//         }
        
//         .clm-input::placeholder {
//           color: #9ca3af;
//         }
        
//         .clm-input:focus {
//           outline: none;
//           border-color: #d1d5db;
//           box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
//         }
        
//         .clm-error {
//           display: none;
//           border-radius: 8px;
//           padding: 0.875rem;
//           background: #fef2f2;
//           color: #dc2626;
//           border: 1px solid #fecaca;
//           font-size: 0.875rem;
//           align-items: center;
//           gap: 0.5rem;
//         }
        
//         .clm-error.show {
//           display: flex;
//         }
        
//         .clm-button {
//           width: 100%;
//           padding:0.5rem 0.75rem;
//           border: none;
//           border-radius: 0.375rem;
//           background: var(--clm-button-bg);
//           color: var(--clm-button-text);
//           cursor: pointer;
//           font-weight: 500;
//           font-size: 1rem;
//           transition: all 0.2s ease;
//           font-family: inherit;
//         }
        
//         .clm-button:hover {
//           background: #222222;
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//         }
        
//         .clm-button:active {
//           transform: translateY(0);
//           box-shadow: 0 2px 8px rgba(0,0,0,0.15);
//         }
//       `;

//     const styleElement = document.createElement("style");
//     styleElement.id = this.config.styleId;
//     styleElement.textContent = CSS;
//     document.head.appendChild(styleElement);
//   },

//   // Apply color settings to CSS variables
//   applyColorSettings(colorSettings) {
//     if (!colorSettings) return;

//     const root = document.documentElement;
//     const container = document.querySelector(`.clm-container`);

//     if (colorSettings.cardBg) {
//       root.style.setProperty("--clm-card-bg", colorSettings.cardBg);
//     }
//     if (colorSettings.gradientStart) {
//       root.style.setProperty(
//         "--clm-gradient-start",
//         colorSettings.gradientStart
//       );
//     }
//     if (colorSettings.gradientEnd) {
//       root.style.setProperty("--clm-gradient-end", colorSettings.gradientEnd);
//     }
//     if (colorSettings.buttonBg) {
//       root.style.setProperty("--clm-button-bg", colorSettings.buttonBg);
//     }
//     if (colorSettings.buttonText) {
//       root.style.setProperty("--clm-button-text", colorSettings.buttonText);
//     }
//     if (colorSettings.headingText) {
//       root.style.setProperty("--clm-heading-text", colorSettings.headingText);
//     }

//     // Handle gradient toggle
//     if (container) {
//       if (colorSettings.useGradient) {
//         container.classList.add("gradient");
//       } else {
//         container.classList.remove("gradient");
//       }
//     }
//   },

//   // Apply content settings to form elements
//   applyContentSettings(contentSettings) {
//     if (!contentSettings) return;

//     const elements = {
//       heading: document.querySelector(`.clm-heading`),
//       emailLabel: document.querySelector(`.clm-label[for="email"]`),
//       orderLabel: document.querySelector(`.clm-label[for="order"]`),
//       emailInput: document.querySelector(`.clm-input[name="email"]`),
//       orderInput: document.querySelector(`.clm-input[name="order"]`),
//       button: document.querySelector(`.clm-button`),
//       error: document.querySelector(`.clm-error`),
//     };

//     if (contentSettings.heading && elements.heading) {
//       elements.heading.textContent = contentSettings.heading;
//     }
//     if (contentSettings.emailLabel && elements.emailLabel) {
//       elements.emailLabel.textContent = contentSettings.emailLabel;
//     }
//     if (contentSettings.orderNumberLabel && elements.orderLabel) {
//       elements.orderLabel.textContent = contentSettings.orderNumberLabel;
//     }
//     if (contentSettings.emailPlaceholder && elements.emailInput) {
//       elements.emailInput.placeholder = contentSettings.emailPlaceholder;
//     }
//     if (contentSettings.orderNumberPlaceholder && elements.orderInput) {
//       elements.orderInput.placeholder = contentSettings.orderNumberPlaceholder;
//     }
//     if (contentSettings.buttonText && elements.button) {
//       elements.button.textContent = contentSettings.buttonText;
//     }
//     if (contentSettings.errorMessage && elements.error) {
//       elements.error.textContent = contentSettings.errorMessage;
//     }
//   },

//   // Create DOM element with options
//   createElement(tag, options = {}) {
//     const element = document.createElement(tag);

//     if (options.className) element.className = options.className;
//     if (options.text) element.textContent = options.text;
//     if (options.id) element.id = options.id;

//     if (options.attrs) {
//       Object.entries(options.attrs).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//           element.setAttribute(key, value);
//         }
//       });
//     }

//     return element;
//   },

//   // Build the complete form
//   buildForm(onSubmitCallback) {
//     const defaults = this.config.defaults;

//     // Main wrapper
//     const wrapper = this.createElement("div", {
//       className: `clm-wrapper`,
//       id: this.config.containerId,
//     });

//     // Form container
//     const container = this.createElement("div", {
//       className: `clm-container`,
//     });

//     // Form element
//     const form = this.createElement("form", {
//       className: `clm-form`,
//     });

//     // Heading
//     const heading = this.createElement("h1", {
//       className: `clm-heading`,
//       text: defaults.heading,
//     });

//     // Fields container
//     const fields = this.createElement("div", {
//       className: `clm-fields`,
//     });

//     // Email field
//     const emailLabel = this.createElement("label", {
//       className: `clm-label`,
//       text: defaults.emailLabel,
//       attrs: { for: "email" },
//     });

//     const emailInput = this.createElement("input", {
//       className: `clm-input`,
//       attrs: {
//         type: "email",
//         name: "email",
//         id: "email",
//         placeholder: defaults.emailPlaceholder,
//         autocomplete: "email",
//         required: true,
//       },
//     });

//     // Order field
//     const orderLabel = this.createElement("label", {
//       className: `clm-label`,
//       text: defaults.orderLabel,
//       attrs: { for: "order" },
//     });

//     const orderInput = this.createElement("input", {
//       className: `clm-input`,
//       attrs: {
//         type: "text",
//         name: "order",
//         id: "order",
//         placeholder: defaults.orderPlaceholder,
//         autocomplete: "off",
//         required: true,
//       },
//     });

//     // Error message
//     const errorDiv = this.createElement("div", {
//       className: `clm-error`,
//       text: defaults.errorMessage,
//     });

//     // Submit button
//     const submitButton = this.createElement("button", {
//       className: `clm-button`,
//       text: defaults.buttonText,
//       attrs: { type: "submit" },
//     });

//     // Assemble form
//     fields.appendChild(emailLabel);
//     fields.appendChild(emailInput);
//     fields.appendChild(orderLabel);
//     fields.appendChild(orderInput);

//     form.appendChild(heading);
//     form.appendChild(fields);
//     form.appendChild(errorDiv);
//     form.appendChild(submitButton);

//     container.appendChild(form);
//     wrapper.appendChild(container);

//     // Add form submission handler
//     this.addFormHandler(
//       form,
//       emailInput,
//       orderInput,
//       errorDiv,
//       onSubmitCallback
//     );

//     return wrapper;
//   },

//   // Handle form submission and validation
//   addFormHandler(form, emailInput, orderInput, errorDiv, callback) {
//     const handleSubmit = (e) => {
//       e.preventDefault();

//       const email = emailInput.value.trim();
//       const orderNumber = orderInput.value.trim();

//       // Validation
//       if (!email || !orderNumber) {
//         this.showError(errorDiv);
//         return;
//       }

//       this.hideError(errorDiv);

//       // Execute callback with form data
//       if (typeof callback === "function") {
//         callback({ email, orderNumber });
//       } else {
//         // Default action
//         console.log("Form Data:", { email, orderNumber });
//         alert(`Form submitted!\nEmail: ${email}\nOrder: ${orderNumber}`);
//       }
//     };

//     form.addEventListener("submit", handleSubmit);
//   },

//   // Show error message
//   showError(errorDiv) {
//     errorDiv.classList.add("show");
//   },

//   // Hide error message
//   hideError(errorDiv) {
//     errorDiv.classList.remove("show");
//   },

//   // Main initialization function
//   init(callback) {
//     this.injectStyles();
//     const formElement = this.buildForm(callback);

//     // Set up proxy subscription
//     this.proxy.subscribe(({ contentSettings, colorSettings }) => {
//       this.applyContentSettings(contentSettings);
//       this.applyColorSettings(colorSettings);
//     });

//     // Add to page
//     if (document.body) {
//       document.body.appendChild(formElement);
//     } else {
//       document.addEventListener("DOMContentLoaded", () => {
//         document.body.appendChild(formElement);
//       });
//     }

//     return formElement;
//   },

//   // Remove form from page
//   destroy() {
//     const container = document.getElementById(this.config.containerId);
//     if (container) {
//       container.remove();
//     }
//   },
// };

// // Auto-initialize when script loads
// if (typeof window !== "undefined") {
//   if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", () => {
//       ClaimLoginForm.init();
//     });
//   } else {
//     ClaimLoginForm.init();
//   }
// }

// // Export for use in different environments
// if (typeof module !== "undefined" && module.exports) {
//   module.exports = ClaimLoginForm;
// } else if (typeof define === "function" && define.amd) {
//   define(() => ClaimLoginForm);
// } else {
//   window.ClaimLogin = ClaimLoginForm;
// }


// Claim Login Form - Auto Initialize with Proxy Support

// Claim Login Form - Auto Initialize with Proxy Support

const ClaimLoginForm = {
  // Configuration
  config: {
    styleId: "claim-form-styles",
    containerId: "claim-login-container",
    previewId: "preview_login_form",
    defaults: {
      heading: "File Claim",
      emailLabel: "Email",
      orderLabel: "Order number",
      emailPlaceholder: "your@email.com",
      orderPlaceholder: "e.g. #1234",
      buttonText: "Find Order",
      errorMessage: "Please enter both email and order number.",
    },
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
      this.subscribers.forEach((callback) => {
        callback({
          contentSettings: this.contentSettings,
          colorSettings: this.colorSettings,
        });
      });
    },

    updateContentSettings(settings) {
      this.contentSettings =
        typeof settings === "function"
          ? settings(this.contentSettings)
          : { ...this.contentSettings, ...settings };
      this.notify();
    },

    updateColorSettings(settings) {
      this.colorSettings =
        typeof settings === "function"
          ? settings(this.colorSettings)
          : { ...this.colorSettings, ...settings };
      this.notify();
    },

    getContentSettings() {
      return this.contentSettings;
    },

    getColorSettings() {
      return this.colorSettings;
    },
  },

  // Check if should use preview mode with timeout for Shopify variable
  async shouldUsePreview() {
    const previewDiv = document.getElementById(this.config.previewId);
    
    // If preview div exists, use preview mode immediately
    if (previewDiv) {
      return true;
    }
    
    // Wait for window.isShopifyApp to be defined
    const isShopifyApp = await this.waitForShopifyApp();
    return isShopifyApp === true;
  },

  // Wait for window.isShopifyApp variable with timeout
  waitForShopifyApp(timeout = 5000, interval = 100) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkVariable = () => {
        // Check if variable exists and is defined
        if (typeof window.isShopifyApp !== 'undefined') {
          resolve(window.isShopifyApp);
          return;
        }
        
        // Check if timeout exceeded
        if (Date.now() - startTime >= timeout) {
          resolve(false); // Default to false if not found
          return;
        }
        
        // Continue checking
        setTimeout(checkVariable, interval);
      };
      
      checkVariable();
    });
  },

  // Inject CSS styles once
  injectStyles() {
    if (document.getElementById(this.config.styleId)) return;

    const CSS = `
        :root {
          --clm-card-bg: #ffffff;
          --clm-gradient-start: #2196f3;
          --clm-gradient-end: #00bcd4;
          --clm-button-bg: #333333;
          --clm-button-text: #ffffff;
          --clm-heading-text: #333333;
          --clm-label-text: #666666;
        }

        .clm-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          width: 100%;
          min-height: 80vh;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          box-sizing: border-box;
        }

        /* Adjust wrapper styles for preview mode */
        #preview_login_form .clm-wrapper {
          min-height: auto;
          background: transparent;
          padding: 1rem;
        }
        
        .clm-container {
          width: 100%;
          max-width: 370px;
          background: var(--clm-card-bg);
          padding: 1em;
          box-sizing: border-box;
          border-radius: 12px;
          border: 1px solid #ebebeb;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); 
        }

        .clm-container.gradient {
          background: linear-gradient(90deg, var(--clm-gradient-start), var(--clm-gradient-end));
        }
        
        .clm-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .clm-heading {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--clm-heading-text);
          text-align: left;
          margin: 0;
          word-wrap: break-word;
          letter-spacing: -0.025em;
        }
        
        .clm-fields {
          display: flex;
          flex-direction: column;
          gap:  0.5rem;
        }
        
        .clm-label {
          display: block;
          color: var(--clm-label-text);
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .clm-input {
          width: 100%;
          padding:0.5rem 0.75rem;
          border: 1px solid #e1e5e9;
          border-radius: 0.375rem;
          background: #ffffff;
          color: #333333;
          font-size: 1rem;
          box-sizing: border-box;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        
        .clm-input::placeholder {
          color: #9ca3af;
        }
        
        .clm-input:focus {
          outline: none;
          border-color: #d1d5db;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
        }
        
        .clm-error {
          display: none;
          border-radius: 8px;
          padding: 0.875rem;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          font-size: 0.875rem;
          align-items: center;
          gap: 0.5rem;
        }
        
        .clm-error.show {
          display: flex;
        }
        
        .clm-button {
          width: 100%;
          padding:0.5rem 0.75rem;
          border: none;
          border-radius: 0.375rem;
          background: var(--clm-button-bg);
          color: var(--clm-button-text);
          cursor: pointer;
          font-weight: 500;
          font-size: 1rem;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        
        .clm-button:hover {
          background: #222222;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .clm-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
      `;

    const styleElement = document.createElement("style");
    styleElement.id = this.config.styleId;
    styleElement.textContent = CSS;
    document.head.appendChild(styleElement);
  },

  // Apply color settings to CSS variables
  applyColorSettings(colorSettings) {
    if (!colorSettings) return;

    const root = document.documentElement;
    const container = document.querySelector(`.clm-container`);

    if (colorSettings.cardBg) {
      root.style.setProperty("--clm-card-bg", colorSettings.cardBg);
    }
    if (colorSettings.gradientStart) {
      root.style.setProperty(
        "--clm-gradient-start",
        colorSettings.gradientStart
      );
    }
    if (colorSettings.gradientEnd) {
      root.style.setProperty("--clm-gradient-end", colorSettings.gradientEnd);
    }
    if (colorSettings.buttonBg) {
      root.style.setProperty("--clm-button-bg", colorSettings.buttonBg);
    }
    if (colorSettings.buttonText) {
      root.style.setProperty("--clm-button-text", colorSettings.buttonText);
    }
    if (colorSettings.headingText) {
      root.style.setProperty("--clm-heading-text", colorSettings.headingText);
    }

    // Handle gradient toggle
    if (container) {
      if (colorSettings.useGradient) {
        container.classList.add("gradient");
      } else {
        container.classList.remove("gradient");
      }
    }
  },

  // Apply content settings to form elements
  applyContentSettings(contentSettings) {
    if (!contentSettings) return;

    const elements = {
      heading: document.querySelector(`.clm-heading`),
      emailLabel: document.querySelector(`.clm-label[for="email"]`),
      orderLabel: document.querySelector(`.clm-label[for="order"]`),
      emailInput: document.querySelector(`.clm-input[name="email"]`),
      orderInput: document.querySelector(`.clm-input[name="order"]`),
      button: document.querySelector(`.clm-button`),
      error: document.querySelector(`.clm-error`),
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
    const defaults = this.config.defaults;

    // Main wrapper
    const wrapper = this.createElement("div", {
      className: `clm-wrapper`,
      id: this.config.containerId,
    });

    // Form container
    const container = this.createElement("div", {
      className: `clm-container`,
    });

    // Form element
    const form = this.createElement("form", {
      className: `clm-form`,
      attrs: { novalidate: true },
    });

    // Heading
    const heading = this.createElement("h1", {
      className: `clm-heading`,
      text: defaults.heading,
    });

    // Fields container
    const fields = this.createElement("div", {
      className: `clm-fields`,
    });

    // Email field
    const emailLabel = this.createElement("label", {
      className: `clm-label`,
      text: defaults.emailLabel,
      attrs: { for: "email" },
    });

    const emailInput = this.createElement("input", {
      className: `clm-input`,
      attrs: {
        type: "email",
        name: "email",
        id: "email",
        placeholder: defaults.emailPlaceholder,
        autocomplete: "email",
        required: true,
      },
    });

    // Order field
    const orderLabel = this.createElement("label", {
      className: `clm-label`,
      text: defaults.orderLabel,
      attrs: { for: "order" },
    });

    const orderInput = this.createElement("input", {
      className: `clm-input`,
      attrs: {
        type: "text",
        name: "order",
        id: "order",
        placeholder: defaults.orderPlaceholder,
        autocomplete: "off",
        required: true,
      },
    });

    // Error message
    const errorDiv = this.createElement("div", {
      className: `clm-error`,
      text: defaults.errorMessage,
    });

    // Submit button
    const submitButton = this.createElement("button", {
      className: `clm-button`,
      text: defaults.buttonText,
      attrs: { type: "submit" },
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
    this.addFormHandler(
      form,
      emailInput,
      orderInput,
      errorDiv,
      onSubmitCallback
    );

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
      if (typeof callback === "function") {
        callback({ email, orderNumber });
      } else {
        // Default action
        console.log("Form Data:", { email, orderNumber });
        alert(`Form submitted!\nEmail: ${email}\nOrder: ${orderNumber}`);
      }
    };

    form.addEventListener("submit", handleSubmit);
  },

  // Show error message
  showError(errorDiv) {
    errorDiv.classList.add("show");
  },

  // Hide error message
  hideError(errorDiv) {
    errorDiv.classList.remove("show");
  },

  // Get the target container for the form
  async getTargetContainer() {
    const usePreview = await this.shouldUsePreview();
    
    if (usePreview) {
      const previewDiv = document.getElementById(this.config.previewId);
      return previewDiv || document.body;
    }
    return document.body;
  },

  // Main initialization function
  async init(callback) {
    this.injectStyles();
    const formElement = this.buildForm(callback);

    // Set up proxy subscription
    this.proxy.subscribe(({ contentSettings, colorSettings }) => {
      this.applyContentSettings(contentSettings);
      this.applyColorSettings(colorSettings);
    });

    // Get target container (wait for Shopify variable if needed)
    const targetContainer = await this.getTargetContainer();

    // Add to page
    const addToPage = () => {
      // Clear existing form if it exists
      this.destroy();
      targetContainer.appendChild(formElement);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", addToPage);
    } else {
      addToPage();
    }

    return formElement;
  },

  // Remove form from page
  destroy() {
    const container = document.getElementById(this.config.containerId);
    if (container) {
      container.remove();
    }
  },
};

// Auto-initialize when script loads
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", async () => {
      await ClaimLoginForm.init();
    });
  } else {
    ClaimLoginForm.init();
  }
}

// Export for use in different environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = ClaimLoginForm;
} else if (typeof define === "function" && define.amd) {
  define(() => ClaimLoginForm);
} else {
  window.ClaimLogin = ClaimLoginForm;
}
