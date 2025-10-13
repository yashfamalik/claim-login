const ClaimLoginForm = {
  config: {
    styleId: "claim-form-styles",
    containerId: "claim-login-container",
    previewId: "preview_login_form",
    defaults: {
      heading: "File Claim",
      description: "Sign in to File Claim",
      emailLabel: "Email",
      orderLabel: "Order number",
      emailPlaceholder: "your@email.com",
      orderPlaceholder: "e.g. #1234",
      buttonText: "Find Order",
      errorMessage: "Please enter both email and order number.",
    },
  },

  proxy: {
    contentSettings: null,
    colorSettings: null,
    subscribers: new Set(),

    subscribe(cb) {
      this.subscribers.add(cb);
      return () => this.subscribers.delete(cb);
    },

    notify() {
      for (const cb of this.subscribers)
        cb({
          contentSettings: this.contentSettings,
          colorSettings: this.colorSettings,
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

  async shouldUsePreview() {
    if (document.getElementById(this.config.previewId)) return true;
    return (await this.waitForShopifyApp()) === true;
  },

  waitForShopifyApp(timeout = 5000, interval = 100) {
    return new Promise((resolve) => {
      const start = Date.now();
      (function check() {
        if (typeof window.isShopifyApp !== "undefined")
          return resolve(window.isShopifyApp);
        if (Date.now() - start >= timeout) return resolve(false);
        setTimeout(check, interval);
      })();
    });
  },

  injectStyles() {
    if (document.getElementById(this.config.styleId)) return;
    const css = `
      :root {
        --clm-card-bg: #fff;
        --clm-gradient-start: #2196f3;
        --clm-gradient-end: #00bcd4;
        --clm-button-bg: #333;
        --clm-button-text: #fff;
        --clm-text-color: #333;
        --clm-label-text: #666;
      }
      .clm-wrapper {
        font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
        width: 100%; min-height: 80vh; background: #f8f9fa;
        display: flex; align-items: center; justify-content: center;
        margin: 0; box-sizing: border-box;
      }
      #preview_login_form .clm-wrapper {
        min-height: auto; background: transparent; padding: 1rem;
      }
      .clm-container {
        width: 100%; max-width: 370px; background: var(--clm-card-bg);
        padding: 1.3em; box-sizing: border-box; border-radius: 12px;
        border: 1px solid #ebebeb; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      }
      .clm-container.gradient {
        background: linear-gradient(90deg, var(--clm-gradient-start), var(--clm-gradient-end));
      }
      .clm-form { display: flex; flex-direction: column; gap: 0.5rem; }
      .clm-heading {
        font-size: 1.25rem; font-weight: 600; color: var(--clm-text-color);
        text-align: left; margin: 0; word-wrap: break-word; letter-spacing: -0.025em;
      }
      .clm-description {
        font-size: 1rem; color: var(--clm-text-color); margin: 0; padding: 0;
      }
      .clm-fields { display: flex; flex-direction: column; gap: 0.5rem; }
      .clm-label { display: block; color: var(--clm-text-color); font-weight: 500; font-size: 0.875rem; }
      .clm-input {
        width: 100%; padding: 0.4rem 0.65rem; border: 1px solid #e1e5e9;
        border-radius: 0.375rem; background: #fff; color: var(--clm-text-color); font-size: 1rem;
        box-sizing: border-box; transition: all 0.2s ease; font-family: inherit;
      }
      .clm-input::placeholder { color: #9ca3af; }
      .clm-input:focus {
        outline: none; border-color: #d1d5db; box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
      }
      .clm-error {
        display: none; border-radius: 8px; padding: 0.4rem 0.65rem; background: #fef2f2;
        color: #dc2626; border: 1px solid #fecaca; font-size: 0.875rem;
        align-items: center; gap: 0;
      }
      .clm-error.show { display: flex; }
      .clm-error .clm-error-icon { display: flex; align-items: center; margin-right: 0.5rem; }
      .clm-button {
        width: 100%; padding: 0.4rem 0.65rem; border: none; border-radius: 0.375rem;
        background: var(--clm-button-bg); color: var(--clm-button-text); cursor: pointer;
        font-weight: 500; font-size: 1rem; transition: all 0.2s ease; font-family: inherit;
      }
      .clm-button:active {
        transform: translateY(0);
        box-shadow: inset 0 2px 8px rgb(118 118 118);
      }
      .clm-button:hover {
        opacity: 0.9;
      }
    `;
    const style = document.createElement("style");
    style.id = this.config.styleId;
    style.textContent = css;
    document.head.appendChild(style);
  },

  applyColorSettings(settings) {
    if (!settings) return;
    const root = document.documentElement;
    const container = document.querySelector(".clm-container");
    const map = [
      ["cardBg", "--clm-card-bg"],
      ["gradientStart", "--clm-gradient-start"],
      ["gradientEnd", "--clm-gradient-end"],
      ["buttonBg", "--clm-button-bg"],
      ["buttonText", "--clm-button-text"],
      ["textColor", "--clm-text-color"],
    ];
    for (const [key, cssVar] of map)
      if (settings[key]) root.style.setProperty(cssVar, settings[key]);
    if (container) {
      container.classList.toggle("gradient", !!settings.useGradient);
    }
  },

  applyContentSettings(settings) {
    if (!settings) return;
    const q = (sel) => document.querySelector(sel);
    const el = {
      heading: q(".clm-heading"),
      description: q(".clm-description"),
      emailLabel: q('.clm-label[for="email"]'),
      orderLabel: q('.clm-label[for="order"]'),
      emailInput: q('.clm-input[name="email"]'),
      orderInput: q('.clm-input[name="order"]'),
      button: q(".clm-button"),
      errorText: q(".clm-error .clm-error-text"),
    };
    if (settings.heading && el.heading)
      el.heading.textContent = settings.heading;
    if (settings.description && el.description)
      el.description.textContent = settings.description;
    if (settings.emailLabel && el.emailLabel)
      el.emailLabel.textContent = settings.emailLabel;
    if (settings.orderNumberLabel && el.orderLabel)
      el.orderLabel.textContent = settings.orderNumberLabel;
    if (settings.emailPlaceholder && el.emailInput)
      el.emailInput.placeholder = settings.emailPlaceholder;
    if (settings.orderNumberPlaceholder && el.orderInput)
      el.orderInput.placeholder = settings.orderNumberPlaceholder;
    if (settings.buttonText && el.button)
      el.button.textContent = settings.buttonText;
    if (settings.errorMessage && el.errorText)
      el.errorText.textContent = settings.errorMessage;
  },

  createElement(tag, opts = {}) {
    const el = document.createElement(tag);
    if (opts.className) el.className = opts.className;
    if (opts.text) el.textContent = opts.text;
    if (opts.id) el.id = opts.id;
    if (opts.attrs)
      for (const [k, v] of Object.entries(opts.attrs))
        if (v != null) el.setAttribute(k, v);
    return el;
  },

  createErrorIcon() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.setAttribute("class", "Icon_Icon__uZZKy");
    svg.setAttribute(
      "style",
      "width: 20px; height: 20px; fill: #dc2626; color: #dc2626;"
    );
    [
      [
        "path",
        {
          d: "M10 6.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 1 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z",
        },
      ],
      ["path", { d: "M11 13.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" }],
      [
        "path",
        {
          "fill-rule": "evenodd",
          d: "M10 3.5c-1.045 0-1.784.702-2.152 1.447a449.26 449.26 0 0 1-2.005 3.847l-.028.052a403.426 403.426 0 0 0-2.008 3.856c-.372.752-.478 1.75.093 2.614.57.863 1.542 1.184 2.464 1.184h7.272c.922 0 1.895-.32 2.464-1.184.57-.864.465-1.862.093-2.614-.21-.424-1.113-2.147-2.004-3.847l-.032-.061a429.497 429.497 0 0 1-2.005-3.847c-.368-.745-1.107-1.447-2.152-1.447Zm-.808 2.112c.404-.816 1.212-.816 1.616 0 .202.409 1.112 2.145 2.022 3.88a418.904 418.904 0 0 1 2.018 3.875c.404.817 0 1.633-1.212 1.633h-7.272c-1.212 0-1.617-.816-1.212-1.633.202-.408 1.113-2.147 2.023-3.883a421.932 421.932 0 0 0 2.017-3.872Z",
        },
      ],
    ].forEach(([tag, attrs]) => {
      const p = document.createElementNS(ns, tag);
      for (const [k, v] of Object.entries(attrs)) p.setAttribute(k, v);
      svg.appendChild(p);
    });
    return svg;
  },

  buildForm(onSubmit) {
    const d = this.config.defaults;
    const wrapper = this.createElement("div", {
      className: "clm-wrapper",
      id: this.config.containerId,
    });
    const container = this.createElement("div", {
      className: "clm-container",
      attrs: { novalidate: true },
    });
    const form = this.createElement("form", {
      className: "clm-form",
      attrs: { novalidate: true },
    });
    const heading = this.createElement("h1", {
      className: "clm-heading",
      text: d.heading,
    });
    const description = this.createElement("div", {
      className: "clm-description",
      text: d.description,
    }); // Inserted description after heading
    const fields = this.createElement("div", { className: "clm-fields" });

    const emailLabel = this.createElement("label", {
      className: "clm-label",
      text: d.emailLabel,
      attrs: { for: "email" },
    });
    const emailInput = this.createElement("input", {
      className: "clm-input",
      attrs: {
        type: "email",
        name: "email",
        id: "email",
        placeholder: d.emailPlaceholder,
        autocomplete: "email",
        required: true,
      },
    });
    const orderLabel = this.createElement("label", {
      className: "clm-label",
      text: d.orderLabel,
      attrs: { for: "order" },
    });
    const orderInput = this.createElement("input", {
      className: "clm-input",
      attrs: {
        type: "text",
        name: "order",
        id: "order",
        placeholder: d.orderPlaceholder,
        autocomplete: "off",
        required: true,
      },
    });

    const errorDiv = this.createElement("div", { className: "clm-error" });
    const iconContainer = this.createElement("span", {
      className: "clm-error-icon",
    });
    iconContainer.appendChild(this.createErrorIcon());
    const errorText = this.createElement("span", {
      className: "clm-error-text",
      text: d.errorMessage,
    });
    errorDiv.append(iconContainer, errorText);

    const submitButton = this.createElement("button", {
      className: "clm-button",
      text: d.buttonText,
      attrs: { type: "submit" },
    });

    fields.append(emailLabel, emailInput, orderLabel, orderInput);
    // Insert description after heading
    form.append(heading, description, fields, errorDiv, submitButton);
    container.appendChild(form);
    wrapper.appendChild(container);

    this.addFormHandler(form, emailInput, orderInput, errorDiv, onSubmit);
    return wrapper;
  },

  addFormHandler(form, emailInput, orderInput, errorDiv, cb) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const orderNumber = orderInput.value.trim();
      if (!email || !orderNumber) return this.showError(errorDiv);
      this.hideError(errorDiv);
      if (typeof cb === "function") cb({ email, orderNumber });
      else console.log("Form Data:", { email, orderNumber });
    });
  },

  showError(errorDiv) {
    errorDiv.classList.add("show");
  },

  hideError(errorDiv) {
    errorDiv.classList.remove("show");
  },

  async getTargetContainer() {
    if (await this.shouldUsePreview()) {
      return document.getElementById(this.config.previewId) || document.body;
    }
    return document.body;
  },

  async init(cb) {
    this.injectStyles();
    const formEl = this.buildForm(cb);
    this.proxy.subscribe(({ contentSettings, colorSettings }) => {
      this.applyContentSettings(contentSettings);
      this.applyColorSettings(colorSettings);
    });
    const target = await this.getTargetContainer();
    const addToPage = () => {
      this.destroy();
      target.appendChild(formEl);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", addToPage);
    } else {
      addToPage();
    }
    return formEl;
  },

  destroy() {
    const c = document.getElementById(this.config.containerId);
    if (c) c.remove();
  },
};

if (typeof window !== "undefined") {
  const run = () => ClaimLoginForm.init();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = ClaimLoginForm;
} else if (typeof define === "function" && define.amd) {
  define(() => ClaimLoginForm);
} else {
  window.ClaimLogin = ClaimLoginForm;
}
