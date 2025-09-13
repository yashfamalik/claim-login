
// Claim Login Form - Auto Initialize
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

  // Inject CSS styles once
  injectStyles() {
    if (document.getElementById(this.config.styleId)) return;
    
    const styles = `
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
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid rgba(0,0,0,0.08);
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
        padding: 2rem;
        box-sizing: border-box;
      }
      
      .${this.config.cssPrefix}form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .${this.config.cssPrefix}heading {
        font-size: 1.5rem;
        font-weight: 600;
        color: #202223;
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
        color: #202223;
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
        background: #2196f3;
        color: #ffffff;
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
      text: defaults.emailLabel
    });
    
    const emailInput = this.createElement('input', {
      className: `${prefix}input`,
      attrs: {
        type: 'email',
        name: 'email',
        placeholder: defaults.emailPlaceholder,
        autocomplete: 'email',
        required: true
      }
    });
    
    // Order field
    const orderLabel = this.createElement('label', {
      className: `${prefix}label`,
      text: defaults.orderLabel
    });
    
    const orderInput = this.createElement('input', {
      className: `${prefix}input`,
      attrs: {
        type: 'text',
        name: 'order',
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
  },

  // Update form content dynamically
  updateContent(newContent) {
    const updatedDefaults = { ...this.config.defaults, ...newContent };
    this.config.defaults = updatedDefaults;
    
    // Re-render if already initialized
    const existingContainer = document.getElementById(this.config.containerId);
    if (existingContainer) {
      this.destroy();
      this.init();
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








// (function (global) {
//   function injectStyleOnce() {
//     if (document.getElementById("cf-login-style")) return;
//     const css = `
//     :root{
//     --claim-card-bg:#ffffff;
//     --claim-card-gradient-start:#2196f3;
//     --claim-card-gradient-end:#00bcd4;
//     --claim-use-gradient:false;
//     --claim-button-bg:#2196f3;
//     --claim-button-text:#ffffff;
//     --claim-heading-text:#202223;
//     }
//     .cf-outer{display:flex;align-items:center;justify-content:center;min-height:80vh;width:100%;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
//     .cf-inner{flex:1 1 auto;max-width:420px;margin:0 auto;padding:24px}
//     .cf-container{background-color:var(--claim-card-bg);border-radius:12px;border:1px solid rgba(0,0,0,.08);margin-block-start:1rem;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06);padding:2rem}
//     .cf-container.cf-gradient{background:linear-gradient(90deg,var(--claim-card-gradient-start),var(--claim-card-gradient-end))}
//     .cf-stack{display:flex;flex-direction:column;gap:1.5rem}
//     .cf-heading{font-size:1.5rem;font-weight:600;color:var(--claim-heading-text);text-align:center;margin:0}
//     .cf-fields{display:flex;flex-direction:column;gap:1rem}
//     .cf-fields label{display:block;margin-bottom:.5rem;color:var(--claim-heading-text);font-weight:500;font-size:0.875rem}
//     .cf-input{width:100%;padding:.75rem 1rem;border:1px solid #d1d5db;border-radius:.5rem;background:#fff;color:#111827;font-size:1rem;box-sizing:border-box}
//     .cf-input:focus{outline:none;border-color:#2196f3;box-shadow:0 0 0 3px rgba(33,150,243,.1)}
//     .cf-error{display:none;border-radius:.5rem;padding:1rem;background:#fef2f2;color:#dc2626;border:1px solid #fecaca;font-size:0.875rem}
//     .cf-error.is-visible{display:flex;align-items:center;gap:.5rem}
//     .cf-button{width:100%;padding:.75rem 1rem;border:none;border-radius:.5rem;background:var(--claim-button-bg);color:var(--claim-button-text);cursor:pointer;font-weight:500;font-size:1rem;transition:all .15s ease;box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)}
//     .cf-button:hover{background:var(--claim-button-bg);opacity:.9;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)}
//     .cf-button:active{opacity:.85;transform:translateY(1px)}
//     `;
//     const style = document.createElement("style");
//     style.id = "cf-login-style";
//     style.appendChild(document.createTextNode(css));
//     document.head.appendChild(style);
//   }

//   function getProxy() {
//     if (typeof window !== "undefined" && window.ClaimFormProxy) {
//       return window.ClaimFormProxy;
//     }

//     const subs = new Set();
//     const store = {
//       contentSettings: null,
//       colorSettings: null,
//       subscribe(cb) {
//         subs.add(cb);
//         return () => subs.delete(cb);
//       },
//       getContentSettings() {
//         return this.contentSettings;
//       },
//       getColorSettings() {
//         return this.colorSettings;
//       },
//       updateContentSettings(next) {
//         this.contentSettings = typeof next === "function" ? next(this.contentSettings) : next;
//         subs.forEach((cb) =>
//           cb({
//             contentSettings: this.contentSettings,
//             colorSettings: this.colorSettings,
//           })
//         );
//       },
//       updateColorSettings(next) {
//         this.colorSettings = typeof next === "function" ? next(this.colorSettings) : next;
//         subs.forEach((cb) =>
//           cb({
//             contentSettings: this.contentSettings,
//             colorSettings: this.colorSettings,
//           })
//         );
//       },
//     };

//     if (typeof window !== "undefined") {
//       window.ClaimFormProxy = store;
//     }

//     return store;
//   }

//   function createElement(tag, options = {}) {
//     const element = document.createElement(tag);
//     if (options.className) element.className = options.className;
//     if (options.text) element.textContent = options.text;
//     if (options.html) element.innerHTML = options.html;
//     if (options.attrs) {
//       Object.entries(options.attrs).forEach(([k, v]) => {
//         if (v != null) element.setAttribute(k, v);
//       });
//     }
//     if (options.styles) {
//       Object.entries(options.styles).forEach(([k, v]) => {
//         element.style[k] = v;
//       });
//     }
//     return element;
//   }

//   function buildLoginForm(options = {}) {
//     const { onSuccess, contentSettings, colorSettings } = options;
//     const proxy = getProxy();
//     const initialContent =
//       contentSettings ??
//       (proxy.getContentSettings ? proxy.getContentSettings() : null);
//     const initialColors =
//       colorSettings ??
//       (proxy.getColorSettings ? proxy.getColorSettings() : null);
//     const defaults = {
//       heading: "File Claim",
//       emailLabel: "Email",
//       orderNumberLabel: "Order number",
//       emailPlaceholder: "your@email.com",
//       orderNumberPlaceholder: "e.g. #1234",
//       buttonText: "Find Order",
//       errorMessage: "Please enter both email and order number.",
//     };
//     let content = { ...defaults, ...(initialContent || {}) };
//     const outer = createElement("div", { className: "cf-outer" });
//     const inner = createElement("div", { className: "cf-inner" });
//     const container = createElement("div", {
//       className: `cf-container ${
//         initialColors?.useGradient ? "cf-gradient" : ""
//       }`,
//     });
//     const heading = createElement("h1", {
//       className: "cf-heading",
//       text: content.heading,
//     });
//     const emailLabel = createElement("label", { text: content.emailLabel });
//     const emailInput = createElement("input", {
//       attrs: {
//         type: "email",
//         autocomplete: "email",
//         placeholder: content.emailPlaceholder,
//       },
//       className: "cf-input",
//     });
//     const orderLabel = createElement("label", {
//       text: content.orderNumberLabel,
//     });
//     const orderInput = createElement("input", {
//       attrs: {
//         type: "text",
//         autocomplete: "off",
//         placeholder: content.orderNumberPlaceholder,
//       },
//       className: "cf-input",
//     });
//     const errorBanner = createElement("div", { className: "cf-error" });
//     const errorText = createElement("span", { text: content.errorMessage });
//     errorBanner.appendChild(errorText);
//     const button = createElement("button", { className: "cf-button" });
//     const buttonText = createElement("span", { text: content.buttonText });
//     button.appendChild(buttonText);

//     function handleSubmit(e) {
//       e.preventDefault();
//       const email = emailInput.value.trim();
//       const orderNumber = orderInput.value.trim();
//       if (!email || !orderNumber) {
//         errorBanner.classList.add("is-visible");
//         return;
//       }
//       errorBanner.classList.remove("is-visible");
//       onSuccess?.({ email, orderNumber });
//     }

//     button.addEventListener("click", handleSubmit);
//     emailInput.addEventListener("keypress", function(e) {
//       if (e.key === "Enter") handleSubmit(e);
//     });
//     orderInput.addEventListener("keypress", function(e) {
//       if (e.key === "Enter") handleSubmit(e);
//     });

//     const fields = createElement("div", { className: "cf-fields" });
//     fields.appendChild(emailLabel);
//     fields.appendChild(emailInput);
//     fields.appendChild(orderLabel);
//     fields.appendChild(orderInput);
//     const stack = createElement("div", { className: "cf-stack" });
//     stack.appendChild(heading);
//     stack.appendChild(fields);
//     stack.appendChild(errorBanner);
//     stack.appendChild(button);
//     container.appendChild(stack);
//     inner.appendChild(container);
//     outer.appendChild(inner);

//     let unsubscribe = null;
//     if (proxy?.subscribe) {
//       unsubscribe = proxy.subscribe(({ contentSettings, colorSettings }) => {
//         if (contentSettings) {
//           content = { ...defaults, ...contentSettings };
//           heading.textContent = content.heading;
//           emailLabel.textContent = content.emailLabel;
//           orderLabel.textContent = content.orderNumberLabel;
//           emailInput.placeholder = content.emailPlaceholder;
//           orderInput.placeholder = content.orderNumberPlaceholder;
//           errorText.textContent = content.errorMessage;
//           buttonText.textContent = content.buttonText;
//         }
//         if (colorSettings) {
//           if (colorSettings.useGradient) container.classList.add("cf-gradient");
//           else container.classList.remove("cf-gradient");
//           const root = document.documentElement;
//           if (colorSettings.cardBg)
//             root.style.setProperty("--claim-card-bg", colorSettings.cardBg);
//           if (colorSettings.gradientStart)
//             root.style.setProperty(
//               "--claim-card-gradient-start",
//               colorSettings.gradientStart
//             );
//           if (colorSettings.gradientEnd)
//             root.style.setProperty(
//               "--claim-card-gradient-end",
//               colorSettings.gradientEnd
//             );
//           if (colorSettings.buttonBg)
//             root.style.setProperty("--claim-button-bg", colorSettings.buttonBg);
//           if (colorSettings.buttonText)
//             root.style.setProperty(
//               "--claim-button-text",
//               colorSettings.buttonText
//             );
//           if (colorSettings.headingText)
//             root.style.setProperty(
//               "--claim-heading-text",
//               colorSettings.headingText
//             );
//         }
//       });
//     }

//     function destroy() {
//       button.removeEventListener("click", handleSubmit);
//       unsubscribe?.();
//       outer.remove();
//     }

//     return { root: outer, destroy };
//   }

//   function mount(container, options = {}) {
//     if (!container) throw new Error("Container element is required");
//     injectStyleOnce();
//     while (container.firstChild) container.removeChild(container.firstChild);
//     const instance = buildLoginForm(options);
//     container.appendChild(instance.root);
//     return instance;
//   }

//   // Auto-initialize function
//   function autoInit() {
//     injectStyleOnce();
    
//     // Create container div
//     const container = createElement("div", { 
//       attrs: { id: "claim-login-auto" },
//       styles: { 
//         width: "100%",
//         minHeight: "100vh",
//         background: "#f5f7fb",
//         margin: "0",
//         padding: "0"
//       }
//     });
    
//     // Mount the form
//     const instance = buildLoginForm({
//       onSuccess: function(data) {
//         console.log("Form submitted with:", data);
//         alert("Form submitted! Email: " + data.email + ", Order: " + data.orderNumber);
//       }
//     });
    
//     container.appendChild(instance.root);
    
//     // Add to body
//     if (document.body) {
//       document.body.appendChild(container);
//     } else {
//       document.addEventListener("DOMContentLoaded", function() {
//         document.body.appendChild(container);
//       });
//     }
    
//     return instance;
//   }

//   const api = { mount, autoInit };

//   // Expose proxy-compatible API
//   Object.defineProperty(api, "proxy", { get: () => getProxy() });
//   api.updateContentSettings = function (updater) {
//     return getProxy().updateContentSettings?.(updater);
//   };
//   api.updateColorSettings = function (updater) {
//     return getProxy().updateColorSettings?.(updater);
//   };

//   if (typeof module !== "undefined" && module.exports) {
//     module.exports = api;
//   } else if (typeof define === "function" && define.amd) {
//     define(() => api);
//   } else {
//     global.ClaimLogin = api;
//   }

//   // Auto-initialize when script loads
//   if (typeof window !== "undefined") {
//     // Wait for DOM to be ready
//     if (document.readyState === "loading") {
//       document.addEventListener("DOMContentLoaded", autoInit);
//     } else {
//       autoInit();
//     }
//   }

// })(typeof window !== "undefined" ? window : globalThis);









// // (function (global) {
// //   function injectStyleOnce() {
// //     if (document.getElementById("cf-login-style")) return;
// //     const css = `
// //     :root{
// //     --claim-card-bg:#000000;
// //     --claim-card-gradient-start:#2196f3;
// //     --claim-card-gradient-end:#00bcd4;
// //     --claim-use-gradient:false;
// //     --claim-button-bg:#303030;
// //     --claim-button-text:#ffffff;
// //     --claim-heading-text:#202223;
// //     }
// //     .cf-outer{display:flex;align-items:center;justify-content:center;min-height:80vh;width:100%}
// //     .cf-inner{flex:1 1 auto}
// //     .cf-container{background-color:var(--claim-card-bg);border-radius:12px;border:1px solid rgba(0,0,0,.08);margin-block-start:1rem;box-shadow:0 1px 2px rgba(0,0,0,.05);padding:1rem}
// //     .cf-container.cf-gradient{background:linear-gradient(90deg,var(--claim-card-gradient-start),var(--claim-card-gradient-end))}
// //     .cf-stack{display:flex;flex-direction:column;row-gap:.75rem}
// //     .cf-heading{font-size:1.25rem;font-weight:600;color:var(--claim-heading-text)}
// //     .cf-fields label{display:block;margin-bottom:.25rem;color:var(--claim-heading-text)}
// //     .cf-input{width:100%;padding:.5rem .75rem;border:1px solid #d1d5db;border-radius:.375rem;background:#fff;color:#111827}
// //     .cf-input:focus{outline:none;border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.35)}
// //     .cf-error{display:none;border-radius:.375rem;padding:.75rem;background:#fdecea;color:#5f2120;border:1px solid #f5c2c0}
// //     .cf-error.is-visible{display:flex;align-items:center;column-gap:.5rem}
// //     .cf-button{width:100%;padding:.5rem 1rem;border:none;border-radius:.5rem;background:var(--claim-button-bg)!important;color:var(--claim-button-text)!important;cursor:pointer;transition:background-color .15s ease,opacity .15s ease;box-shadow:inset 0 -4px 8px rgba(0,0,0,.25)}
// //     .cf-button:hover{background:var(--claim-button-bg)!important;opacity:.9}
// //     .cf-button:active{opacity:.85}
// //     `;
// //     const style = document.createElement("style");
// //     style.id = "cf-login-style";
// //     style.appendChild(document.createTextNode(css));
// //     document.head.appendChild(style);
// //   }

// //   function getProxy() {
// //     if (typeof window !== "undefined" && window.ClaimFormProxy) {
// //       return window.ClaimFormProxy;
// //     }

// //     const subs = new Set();
// //     const store = {
// //       contentSettings: null,
// //       colorSettings: null,
// //       subscribe(cb) {
// //         subs.add(cb);
// //         return () => subs.delete(cb);
// //       },
// //       getContentSettings() {
// //         return this.contentSettings;
// //       },
// //       getColorSettings() {
// //         return this.colorSettings;
// //       },
// //       updateContentSettings(next) {
// //         this.contentSettings = typeof next === "function" ? next(this.contentSettings) : next;
// //         subs.forEach((cb) =>
// //           cb({
// //             contentSettings: this.contentSettings,
// //             colorSettings: this.colorSettings,
// //           })
// //         );
// //       },
// //       updateColorSettings(next) {
// //         this.colorSettings = typeof next === "function" ? next(this.colorSettings) : next;
// //         subs.forEach((cb) =>
// //           cb({
// //             contentSettings: this.contentSettings,
// //             colorSettings: this.colorSettings,
// //           })
// //         );
// //       },
// //     };

// //     // Assign the proxy to the global window object
// //     if (typeof window !== "undefined") {
// //       window.ClaimFormProxy = store;
// //     }

// //     return store;
// //   }

// //   function createElement(tag, options = {}) {
// //     const element = document.createElement(tag);
// //     if (options.className) element.className = options.className;
// //     if (options.text) element.textContent = options.text;
// //     if (options.html) element.innerHTML = options.html;
// //     if (options.attrs) {
// //       Object.entries(options.attrs).forEach(([k, v]) => {
// //         if (v != null) element.setAttribute(k, v);
// //       });
// //     }
// //     if (options.styles) {
// //       Object.entries(options.styles).forEach(([k, v]) => {
// //         element.style[k] = v;
// //       });
// //     }
// //     return element;
// //   }

// //   function buildLoginForm(options = {}) {
// //     const { onSuccess, contentSettings, colorSettings } = options;
// //     const proxy = getProxy();
// //     const initialContent =
// //       contentSettings ??
// //       (proxy.getContentSettings ? proxy.getContentSettings() : null);
// //     const initialColors =
// //       colorSettings ??
// //       (proxy.getColorSettings ? proxy.getColorSettings() : null);
// //     const defaults = {
// //       heading: "File Claim",
// //       emailLabel: "Email",
// //       orderNumberLabel: "Order number",
// //       emailPlaceholder: "your@email.com",
// //       orderNumberPlaceholder: "e.g. #1234",
// //       buttonText: "Find Order",
// //       errorMessage: "Please enter both email and order number.",
// //     };
// //     let content = { ...defaults, ...(initialContent || {}) };
// //     const outer = createElement("div", { className: "cf-outer" });
// //     const inner = createElement("div", { className: "cf-inner" });
// //     const card = createElement("div", { className: "cf-card" });
// //     const container = createElement("div", {
// //       className: `cf-container ${
// //         initialColors?.useGradient ? "cf-gradient" : ""
// //       }`,
// //     });
// //     const heading = createElement("p", {
// //       className: "cf-heading",
// //       text: content.heading,
// //     });
// //     const emailLabel = createElement("label", { text: content.emailLabel });
// //     const emailInput = createElement("input", {
// //       attrs: {
// //         type: "email",
// //         autocomplete: "email",
// //         placeholder: content.emailPlaceholder,
// //       },
// //       className: "cf-input",
// //     });
// //     const orderLabel = createElement("label", {
// //       text: content.orderNumberLabel,
// //     });
// //     const orderInput = createElement("input", {
// //       attrs: {
// //         type: "text",
// //         autocomplete: "off",
// //         placeholder: content.orderNumberPlaceholder,
// //       },
// //       className: "cf-input",
// //     });
// //     const errorBanner = createElement("div", { className: "cf-error" });
// //     const errorText = createElement("span", { text: content.errorMessage });
// //     errorBanner.appendChild(errorText);
// //     const button = createElement("button", { className: "cf-button" });
// //     const buttonText = createElement("span", { text: content.buttonText });
// //     button.appendChild(buttonText);

// //     function handleSubmit() {
// //       const email = emailInput.value.trim();
// //       const orderNumber = orderInput.value.trim();
// //       if (!email || !orderNumber) {
// //         errorBanner.classList.add("is-visible");
// //         return;
// //       }
// //       errorBanner.classList.remove("is-visible");
// //       onSuccess?.({ email, orderNumber });
// //     }

// //     button.addEventListener("click", handleSubmit);
// //     const fields = createElement("div", { className: "cf-fields" });
// //     fields.appendChild(emailLabel);
// //     fields.appendChild(emailInput);
// //     fields.appendChild(orderLabel);
// //     fields.appendChild(orderInput);
// //     const stack = createElement("div", { className: "cf-stack" });
// //     stack.appendChild(heading);
// //     stack.appendChild(fields);
// //     stack.appendChild(errorBanner);
// //     stack.appendChild(button);
// //     container.appendChild(stack);
// //     card.appendChild(container);
// //     inner.appendChild(card);
// //     outer.appendChild(inner);

// //     let unsubscribe = null;
// //     if (proxy?.subscribe) {
// //       unsubscribe = proxy.subscribe(({ contentSettings, colorSettings }) => {
// //         if (contentSettings) {
// //           content = { ...defaults, ...contentSettings };
// //           heading.textContent = content.heading;
// //           emailLabel.textContent = content.emailLabel;
// //           orderLabel.textContent = content.orderNumberLabel;
// //           emailInput.placeholder = content.emailPlaceholder;
// //           orderInput.placeholder = content.orderNumberPlaceholder;
// //           errorText.textContent = content.errorMessage;
// //           buttonText.textContent = content.buttonText;
// //         }
// //         if (colorSettings) {
// //           if (colorSettings.useGradient) container.classList.add("cf-gradient");
// //           else container.classList.remove("cf-gradient");
// //           const root = document.documentElement;
// //           if (colorSettings.cardBg)
// //             root.style.setProperty("--claim-card-bg", colorSettings.cardBg);
// //           if (colorSettings.gradientStart)
// //             root.style.setProperty(
// //               "--claim-card-gradient-start",
// //               colorSettings.gradientStart
// //             );
// //           if (colorSettings.gradientEnd)
// //             root.style.setProperty(
// //               "--claim-card-gradient-end",
// //               colorSettings.gradientEnd
// //             );
// //           if (colorSettings.buttonBg)
// //             root.style.setProperty("--claim-button-bg", colorSettings.buttonBg);
// //           if (colorSettings.buttonText)
// //             root.style.setProperty(
// //               "--claim-button-text",
// //               colorSettings.buttonText
// //             );
// //           if (colorSettings.headingText)
// //             root.style.setProperty(
// //               "--claim-heading-text",
// //               colorSettings.headingText
// //             );
// //         }
// //       });
// //     }

// //     function destroy() {
// //       button.removeEventListener("click", handleSubmit);
// //       unsubscribe?.();
// //       outer.remove();
// //     }

// //     return { root: outer, destroy };
// //   }

// //   function mount(container, options = {}) {
// //     if (!container) throw new Error("Container element is required");
// //     injectStyleOnce();
// //     while (container.firstChild) container.removeChild(container.firstChild);
// //     const instance = buildLoginForm(options);
// //     container.appendChild(instance.root);
// //     return instance;
// //   }

// //   const api = { mount };

// //   // Expose proxy-compatible API so callers can drive changes via the same pattern as Helpers
// //   Object.defineProperty(api, "proxy", { get: () => getProxy() });
// //   api.updateContentSettings = function (updater) {
// //     return getProxy().updateContentSettings?.(updater);
// //   };
// //   api.updateColorSettings = function (updater) {
// //     return getProxy().updateColorSettings?.(updater);
// //   };

// //   if (typeof module !== "undefined" && module.exports) {
// //     module.exports = api;
// //   } else if (typeof define === "function" && define.amd) {
// //     define(() => api);
// //   } else {
// //     global.ClaimLogin = api;
// //   }
// // })(typeof window !== "undefined" ? window : globalThis);










// // // (function (global) {
// // //   function injectStyleOnce() {
// // //     if (document.getElementById("cf-login-style")) return;
// // //     const css = `
// // //     :root{
// // //     --claim-card-bg:#000000;
// // //     --claim-card-gradient-start:#2196f3;
// // //     --claim-card-gradient-end:#00bcd4;
// // //     --claim-use-gradient:false;
// // //     --claim-button-bg:#303030;
// // //     --claim-button-text:#ffffff;
// // //     --claim-heading-text:#202223;
// // //     }
// // //     .cf-outer{display:flex;align-items:center;justify-content:center;min-height:80vh;width:100%}
// // //     .cf-inner{flex:1 1 auto}
// // //     .cf-container{background-color:var(--claim-card-bg);border-radius:12px;border:1px solid rgba(0,0,0,.08);margin-block-start:1rem;box-shadow:0 1px 2px rgba(0,0,0,.05);padding:1rem}
// // //     .cf-container.cf-gradient{background:linear-gradient(90deg,var(--claim-card-gradient-start),var(--claim-card-gradient-end))}
// // //     .cf-stack{display:flex;flex-direction:column;row-gap:.75rem}
// // //     .cf-heading{font-size:1.25rem;font-weight:600;color:var(--claim-heading-text)}
// // //     .cf-fields label{display:block;margin-bottom:.25rem;color:var(--claim-heading-text)}
// // //     .cf-input{width:100%;padding:.5rem .75rem;border:1px solid #d1d5db;border-radius:.375rem;background:#fff;color:#111827}
// // //     .cf-input:focus{outline:none;border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.35)}
// // //     .cf-error{display:none;border-radius:.375rem;padding:.75rem;background:#fdecea;color:#5f2120;border:1px solid #f5c2c0}
// // //     .cf-error.is-visible{display:flex;align-items:center;column-gap:.5rem}
// // //     .cf-button{width:100%;padding:.5rem 1rem;border:none;border-radius:.5rem;background:var(--claim-button-bg)!important;color:var(--claim-button-text)!important;cursor:pointer;transition:background-color .15s ease,opacity .15s ease;box-shadow:inset 0 -4px 8px rgba(0,0,0,.25)}
// // //     .cf-button:hover{background:var(--claim-button-bg)!important;opacity:.9}
// // //     .cf-button:active{opacity:.85}
// // //     `;
// // //     const style = document.createElement("style");
// // //     style.id = "cf-login-style";
// // //     style.appendChild(document.createTextNode(css));
// // //     document.head.appendChild(style);
// // //   }

// // //   function getProxy() {
// // //     if (typeof window !== "undefined" && window.ClaimFormProxy)
// // //       return window.ClaimFormProxy;
// // //     const subs = new Set();
// // //     const store = {
// // //       contentSettings: null,
// // //       colorSettings: null,
// // //       subscribe(cb) {
// // //         subs.add(cb);
// // //         return () => subs.delete(cb);
// // //       },
// // //       getContentSettings() {
// // //         return this.contentSettings;
// // //       },
// // //       getColorSettings() {
// // //         return this.colorSettings;
// // //       },
// // //       updateContentSettings(next) {
// // //         this.contentSettings =
// // //           typeof next === "function" ? next(this.contentSettings) : next;
// // //         subs.forEach((cb) =>
// // //           cb({
// // //             contentSettings: this.contentSettings,
// // //             colorSettings: this.colorSettings,
// // //           })
// // //         );
// // //       },
// // //       updateColorSettings(next) {
// // //         this.colorSettings =
// // //           typeof next === "function" ? next(this.colorSettings) : next;
// // //         subs.forEach((cb) =>
// // //           cb({
// // //             contentSettings: this.contentSettings,
// // //             colorSettings: this.colorSettings,
// // //           })
// // //         );
// // //       },
// // //     };
// // //     return store;
// // //   }

// // //   function createElement(tag, options = {}) {
// // //     const element = document.createElement(tag);
// // //     if (options.className) element.className = options.className;
// // //     if (options.text) element.textContent = options.text;
// // //     if (options.html) element.innerHTML = options.html;
// // //     if (options.attrs) {
// // //       Object.entries(options.attrs).forEach(([k, v]) => {
// // //         if (v != null) element.setAttribute(k, v);
// // //       });
// // //     }
// // //     if (options.styles) {
// // //       Object.entries(options.styles).forEach(([k, v]) => {
// // //         element.style[k] = v;
// // //       });
// // //     }
// // //     return element;
// // //   }

// // //   function buildLoginForm(options = {}) {
// // //     const { onSuccess, contentSettings, colorSettings } = options;
// // //     const proxy = getProxy();

// // //     const initialContent =
// // //       contentSettings ??
// // //       (proxy.getContentSettings ? proxy.getContentSettings() : null);
// // //     const initialColors =
// // //       colorSettings ??
// // //       (proxy.getColorSettings ? proxy.getColorSettings() : null);

// // //     const defaults = {
// // //       heading: "File Claim",
// // //       emailLabel: "Email",
// // //       orderNumberLabel: "Order number",
// // //       emailPlaceholder: "your@email.com",
// // //       orderNumberPlaceholder: "e.g. #1234",
// // //       buttonText: "Find Order",
// // //       errorMessage: "Please enter both email and order number.",
// // //     };
// // //     let content = { ...defaults, ...(initialContent || {}) };

// // //     const outer = createElement("div", { className: "cf-outer" });
// // //     const inner = createElement("div", { className: "cf-inner" });
// // //     const card = createElement("div", { className: "cf-card" });
// // //     const container = createElement("div", {
// // //       className: `cf-container ${
// // //         initialColors?.useGradient ? "cf-gradient" : ""
// // //       }`,
// // //     });

// // //     const heading = createElement("p", {
// // //       className: "cf-heading",
// // //       text: content.heading,
// // //     });

// // //     const emailLabel = createElement("label", { text: content.emailLabel });
// // //     const emailInput = createElement("input", {
// // //       attrs: {
// // //         type: "email",
// // //         autocomplete: "email",
// // //         placeholder: content.emailPlaceholder,
// // //       },
// // //       className: "cf-input",
// // //     });

// // //     const orderLabel = createElement("label", {
// // //       text: content.orderNumberLabel,
// // //     });
// // //     const orderInput = createElement("input", {
// // //       attrs: {
// // //         type: "text",
// // //         autocomplete: "off",
// // //         placeholder: content.orderNumberPlaceholder,
// // //       },
// // //       className: "cf-input",
// // //     });

// // //     const errorBanner = createElement("div", { className: "cf-error" });
// // //     const errorText = createElement("span", { text: content.errorMessage });
// // //     errorBanner.appendChild(errorText);

// // //     const button = createElement("button", { className: "cf-button" });
// // //     const buttonText = createElement("span", { text: content.buttonText });
// // //     button.appendChild(buttonText);

// // //     function handleSubmit() {
// // //       const email = emailInput.value.trim();
// // //       const orderNumber = orderInput.value.trim();
// // //       if (!email || !orderNumber) {
// // //         errorBanner.classList.add("is-visible");
// // //         return;
// // //       }
// // //       errorBanner.classList.remove("is-visible");
// // //       onSuccess?.({ email, orderNumber });
// // //     }
// // //     button.addEventListener("click", handleSubmit);

// // //     const fields = createElement("div", { className: "cf-fields" });
// // //     fields.appendChild(emailLabel);
// // //     fields.appendChild(emailInput);
// // //     fields.appendChild(orderLabel);
// // //     fields.appendChild(orderInput);

// // //     const stack = createElement("div", { className: "cf-stack" });
// // //     stack.appendChild(heading);
// // //     stack.appendChild(fields);
// // //     stack.appendChild(errorBanner);
// // //     stack.appendChild(button);

// // //     container.appendChild(stack);
// // //     card.appendChild(container);
// // //     inner.appendChild(card);
// // //     outer.appendChild(inner);

// // //     let unsubscribe = null;
// // //     if (proxy?.subscribe) {
// // //       unsubscribe = proxy.subscribe(({ contentSettings, colorSettings }) => {
// // //         if (contentSettings) {
// // //           content = { ...defaults, ...contentSettings };
// // //           heading.textContent = content.heading;
// // //           emailLabel.textContent = content.emailLabel;
// // //           orderLabel.textContent = content.orderNumberLabel;
// // //           emailInput.placeholder = content.emailPlaceholder;
// // //           orderInput.placeholder = content.orderNumberPlaceholder;
// // //           errorText.textContent = content.errorMessage;
// // //           buttonText.textContent = content.buttonText;
// // //         }
// // //         if (colorSettings) {
// // //           if (colorSettings.useGradient) container.classList.add("cf-gradient");
// // //           else container.classList.remove("cf-gradient");
// // //           const root = document.documentElement;
// // //           if (colorSettings.cardBg)
// // //             root.style.setProperty("--claim-card-bg", colorSettings.cardBg);
// // //           if (colorSettings.gradientStart)
// // //             root.style.setProperty(
// // //               "--claim-card-gradient-start",
// // //               colorSettings.gradientStart
// // //             );
// // //           if (colorSettings.gradientEnd)
// // //             root.style.setProperty(
// // //               "--claim-card-gradient-end",
// // //               colorSettings.gradientEnd
// // //             );
// // //           if (colorSettings.buttonBg)
// // //             root.style.setProperty("--claim-button-bg", colorSettings.buttonBg);
// // //           if (colorSettings.buttonText)
// // //             root.style.setProperty(
// // //               "--claim-button-text",
// // //               colorSettings.buttonText
// // //             );
// // //           if (colorSettings.headingText)
// // //             root.style.setProperty(
// // //               "--claim-heading-text",
// // //               colorSettings.headingText
// // //             );
// // //         }
// // //       });
// // //     }

// // //     function destroy() {
// // //       button.removeEventListener("click", handleSubmit);
// // //       unsubscribe?.();
// // //       outer.remove();
// // //     }

// // //     return { root: outer, destroy };
// // //   }

// // //   function mount(container, options = {}) {
// // //     if (!container) throw new Error("Container element is required");
// // //     injectStyleOnce();
// // //     while (container.firstChild) container.removeChild(container.firstChild);
// // //     const instance = buildLoginForm(options);
// // //     container.appendChild(instance.root);
// // //     return instance;
// // //   }

// // //   const api = { mount };
// // //   // Expose proxy-compatible API so callers can drive changes via the same pattern as Helpers
// // //   Object.defineProperty(api, "proxy", { get: () => getProxy() });
// // //   api.updateContentSettings = function (updater) { return getProxy().updateContentSettings?.(updater); };
// // //   api.updateColorSettings = function (updater) { return getProxy().updateColorSettings?.(updater); };
// // //   if (typeof module !== "undefined" && module.exports) {
// // //     module.exports = api;
// // //   } else if (typeof define === "function" && define.amd) {
// // //     define(() => api);
// // //   } else {
// // //     global.ClaimLogin = api;
// // //   }
// // // })(typeof window !== "undefined" ? window : globalThis);





// // // function getProxy() {
// // //   if (typeof window !== "undefined" && window.ClaimFormProxy) {
// // //     return window.ClaimFormProxy;
// // //   }

// // //   const subs = new Set();
// // //   const store = {
// // //     contentSettings: null,
// // //     colorSettings: null,
// // //     subscribe(cb) {
// // //       subs.add(cb);
// // //       return () => subs.delete(cb);
// // //     },
// // //     getContentSettings() {
// // //       return this.contentSettings;
// // //     },
// // //     getColorSettings() {
// // //       return this.colorSettings;
// // //     },
// // //     updateContentSettings(next) {
// // //       this.contentSettings = typeof next === "function" ? next(this.contentSettings) : next;
// // //       subs.forEach((cb) => cb({ contentSettings: this.contentSettings, colorSettings: this.colorSettings }));
// // //     },
// // //     updateColorSettings(next) {
// // //       this.colorSettings = typeof next === "function" ? next(this.colorSettings) : next;
// // //       subs.forEach((cb) => cb({ contentSettings: this.contentSettings, colorSettings: this.colorSettings }));
// // //     },
// // //   };

// // //   // Assign the proxy to the global window object
// // //   if (typeof window !== "undefined") {
// // //     window.ClaimFormProxy = store;
// // //   }

// // //   return store;
// // // }

