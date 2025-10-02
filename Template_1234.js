(function (global) {
  "use strict";

  const d = (sel, root = document) => root.querySelector(sel);
  const da = (sel, root = document) => root.querySelectorAll(sel);

  // Built-in small SVG set for template bullets
  const SVG = {
    shield: `<svg width="20" height="20" class="T1_icon-shield" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/><path d="M9 12l2 2 4-4"/></svg>`,
    users: `<svg class="T1_icon-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    lightning: `<svg width="20" height="20" class="T1_icon-lightning" viewBox="0 0 24 24"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>`,
    star: `<svg width="20" height="20" class="T1_icon-star" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>`,
    check: `<svg width="20" height="20" class="T1_icon-check" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>`
  };

  const ICON_MAP = {
    "shield-check": "🛡️",
    sparkles: "✨",
    lock: "🔒",
    lightning: "⚡",
    target: "🎯",
    diamond: "💎",
    rocket: "🚀",
    package: "📦"
  };

  function ensureInstance(o) {
    // Allows calling with or without `new`
    if (!(o instanceof Object)) return {};
    return o;
  }

  function Template1(containerId, options = {}) {
    // Allow use with `new` or plain function call:
    const self = ensureInstance(this);

    // ---------- State ----------
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return self || {};
    }

    // defaults
    let state = {
      containerId,
      container,
      activeTemplate: options.activeTemplate || "template1",
      isEnabled: options.isEnabled !== false,
      protectionPrice: +options.protectionPrice || 0,
      onToggle: options.onToggle || (() => {}),

      // content
      title: options.title || "Shipping protection",
      description:
        options.description ||
        "100% guarantee & protect your order from damage, loss, or theft",
      confirmationMessage:
        options.confirmationMessage || "Your order is now protected!",
      badgeText: options.badgeText || "Protected",
      ctaButtonText: options.ctaButtonText || "Shop Now",
      ctaButtonHref: options.ctaButtonHref || "#",

      // template 2 content
      inlinePoints:
        options.inlinePoints ||
        [
          { text: "Secure Coverage Customers", icon: "shield" },
          { text: "Instant Claims", icon: "lightning" },
          { text: "Trusted by 50k+", icon: "star" }
        ],
      protectionAddedText: options.protectionAddedText || "Protection Added",
      protectionMessage: {
        title:
          options.protectionMessageTitle || "Your order is now protected",
        subtext:
          options.protectionMessageSubtext ||
          "If your package is lost, stolen, or damaged, we'll replace it or provide a full refund — no questions asked."
      },
      checkoutButtonMessage:
        options.checkoutButtonMessage ||
        "Complete your purchase with protection",

      // legacy content
      bulletPoints:
        options.bulletPoints ||
        [
          "🛡️ Protection against damage during shipping",
          "📦 Coverage for lost or stolen packages",
          "💰 Fast reimbursement process"
        ],
      additionalParagraphs:
        options.additionalParagraphs ||
        [
          "Our shipping protection ensures your order arrives safely. If anything goes wrong, we'll make it right.",
          "Join thousands of satisfied customers who shop with confidence knowing their orders are protected."
        ],

      // colors
      colors: {
        backgroundColor: options.backgroundColor || "#DCFCE7",
        iconBackground: options.iconBackground || "#C1F4D9",
        textColor: options.textColor || "#065F46",
        toggleEnabled: options.toggleEnabled || "#49ae78",
        toggleDisabled: options.toggleDisabled || "#d1d5db",
        buttonBg: options.buttonBg || "#065F46",
        buttonText: options.buttonText || "#ffffff",
        ctaButtonBg: options.ctaButtonBg || "#22c55e",
        ctaButtonText: options.ctaButtonText || "#ffffff",
        badgeBg: options.badgeBg || "#22c55e",
        badgeText: options.badgeText || "#ffffff"
      },

      // selection
      selectionMode: options.selectionMode || "toggle", // "toggle" | "checkbox" | "button"

      // logo
      logoSettings: {
        showLogo: options.logoSettings?.showLogo !== false,
        logoUrl: options.logoSettings?.logoUrl || "",
        alt: options.logoSettings?.alt || "Brand Logo",
        maxWidth: options.logoSettings?.maxWidth || 160,
        maxHeight: options.logoSettings?.maxHeight || 48
      },

      // icon
      iconAsset: {
        type: options.iconAsset?.type || "builtin", // "builtin" | "custom"
        name: options.iconAsset?.name || "shield-check",
        url: options.iconAsset?.url || null
      },
      iconStyle: {
        size: options.iconStyle?.size || 24,
        color: options.iconStyle?.color || "#111111",
        background: options.iconStyle?.background || "#F5F5F5",
        borderColor: options.iconStyle?.borderColor || "#E5E7EB",
        borderRadius: options.iconStyle?.borderRadius || 9999
      },

      // button block (button selection mode)
      buttonBlock: {
        buttonLabel: options.buttonBlock?.buttonLabel || "Enable Protection",
        buttonHref:
          options.buttonBlock?.buttonHref || "https://example.com/cta",
        paragraph:
          options.buttonBlock?.paragraph ||
          "One-line supporting text below the button."
      }
    };

    // Attach instance to container for proxy getInstance support
    container._template1Instance = api;

    // ---------- Helpers ----------
    function iconHTML() {
      if (state.iconAsset.type === "custom" && state.iconAsset.url) {
        return `
          <div class="T1_icon-custom">
            <img src="${state.iconAsset.url}" style="width:100%;height:100%;object-fit:contain" alt="Custom icon"/>
          </div>`;
      }
      const char = ICON_MAP[state.iconAsset.name] || "🛡️";
      return `
        <div class="T1_icon-custom">
          ${char}
        </div>`;
    }

    function svg(name) {
      return SVG[name] || SVG.shield;
    }

    function logoHTML() {
      const { showLogo, logoUrl, alt, maxWidth, maxHeight } = state.logoSettings;
      if (!showLogo || !logoUrl) return "";
      return `
        <div class="T1_logo-container" style="max-width:${maxWidth}px;max-height:${maxHeight}px;overflow:hidden;margin-right:8px">
          <img src="${logoUrl}" alt="${alt}" style="max-width:100%;max-height:100%;object-fit:contain"/>
        </div>`;
    }

    function checkboxHTML() {
      return `
        <input type="checkbox" class="T1_checkbox" id="T1_protection_checkbox" ${state.isEnabled ? "checked" : ""}/>
        <label for="T1_protection_checkbox" style="cursor:pointer;margin-left:4px;font-size:12px;color:${state.colors.textColor};">Checkbox</label>
      `;
    }

    function toggleHTML() {
      return `
        <div class="T1_toggle ${state.isEnabled ? "T1_enabled" : "T1_disabled"}" role="switch" aria-checked="${state.isEnabled}" tabindex="0">
          <span class="T1_toggle-handle"></span>
        </div>
      `;
    }

    function inlinePointsHTML() {
      return `
        <div class="T1_inline-points">
          ${state.inlinePoints
            .map(
              (p) => `
            <div class="T1_inline-point">
              ${svg(p.icon)}
              <span>${p.text}</span>
            </div>`
            )
            .join("")}
        </div>`;
    }

    function injectStyles() {
      const id = "T1_template-styles";
      d(`#${id}`)?.remove();

      const s = document.createElement("style");
      s.id = id;
      const c = state.colors;
      const is = state.iconStyle;
      const ls = state.logoSettings;

      s.textContent = `
      .T1_shipping-protection{background:${c.backgroundColor};border-radius:8px;padding:12px;display:flex;align-items:center;gap:12px;position:relative;transition:.3s}
      .T1_icon-container{width:55px;height:55px;background:${c.iconBackground};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .T1_inner-icon{width:24px;height:24px;background:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center}
      .T1_content{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
      .T1_title{font-weight:500;font-size:14px;color:${c.textColor};margin:0}
      .T1_description{font-weight:400;font-size:12px;color:${c.textColor};margin:0;line-height:1.4}
      .T1_toggle{position:relative;display:inline-flex;height:24px;width:44px;align-items:center;border-radius:9999px;cursor:pointer;transition:background-color .3s}
      .T1_toggle.T1_enabled{background:${c.toggleEnabled}}
      .T1_toggle.T1_disabled{background:${c.toggleDisabled}}
      .T1_toggle-handle{display:inline-block;height:16px;width:16px;transform:translateX(4px);border-radius:50%;background:#fff;transition:transform .3s}
      .T1_toggle.T1_enabled .T1_toggle-handle{transform:translateX(24px)}
      .T1_toggle:focus{outline:2px solid #4f46e5;outline-offset:2px}

      .T1_template2-container,.T1_template3-container{background:${c.backgroundColor};border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px}
      .T1_main-widget{display:flex;align-items:center;gap:12px}
      .T1_controls-section{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
      .T1_inline-points{display:flex;justify-content:space-between;gap:16px;margin:12px 0;flex-wrap:wrap}
      .T1_inline-point{display:flex;align-items:center;gap:6px;font-size:12px;color:${c.textColor};font-weight:500}
      .T1_inline-point-icon{width:16px;height:16px;fill:${c.textColor}}
      .T1_protection-added{background:${c.iconBackground};border-radius:6px;padding:10px 12px;display:flex;align-items:center;gap:8px;margin:12px 0;font-size:13px;font-weight:500;color:${c.textColor}}
      .T1_protection-message{background:${c.iconBackground};border-radius:6px;padding:12px;margin:12px 0;display:flex;align-items:flex-start;gap:10px}
      .T1_protection-message-title{font-size:14px;font-weight:600;color:${c.textColor};margin:0 0 4px}
      .T1_protection-message-subtext{font-size:12px;color:${c.textColor};line-height:1.4;margin:0;opacity:.8}
      .T1_checkout-button-message{background:${c.ctaButtonBg};color:${c.ctaButtonText};border-radius:6px;padding:12px 16px;margin:12px 0;text-align:center;font-size:13px;font-weight:500}
      .T1_bullet-points{list-style:none;padding:0;margin:8px 0;display:flex;flex-direction:column;gap:6px}
      .T1_bullet-points li{font-size:12px;color:${c.textColor};line-height:1.4}
      .T1_additional-paragraphs{margin:8px 0;display:flex;flex-direction:column;gap:8px}
      .T1_additional-paragraphs p{font-size:12px;color:${c.textColor};line-height:1.4;margin:0}
      .T1_cta-button{background:${c.ctaButtonBg};color:${c.ctaButtonText};border:0;border-radius:6px;padding:10px 20px;font-size:13px;font-weight:500;cursor:pointer;transition:.3s;text-decoration:none;display:inline-block;text-align:center;margin-top:8px;align-self:flex-start}
      .T1_cta-button:hover{opacity:.9}
      .T1_confirmation-message{font-size:12px;color:${c.toggleEnabled};font-weight:500;margin-top:4px;opacity:0;transition:opacity .3s}
      .T1_confirmation-message.T1_visible{opacity:1}
      .T1_badge{position:absolute;top:-8px;right:-8px;background:${c.badgeBg};color:${c.badgeText};font-size:10px;font-weight:600;padding:4px 8px;border-radius:12px;text-transform:uppercase;letter-spacing:.5px;opacity:0;transform:scale(.8);transition:.3s;z-index:10}
      .T1_badge.T1_visible{opacity:1;transform:scale(1)}
      .T1_checkbox{width:18px;height:18px;accent-color:${c.toggleEnabled};cursor:pointer}
      .T1_button-mode{display:flex;flex-direction:column;gap:8px;align-items:center;padding:12px;border-radius:8px;background:${c.backgroundColor}}
      .T1_protection-button{background:${c.buttonBg};color:${c.buttonText};border:0;border-radius:6px;padding:12px 24px;font-size:14px;font-weight:500;cursor:pointer;transition:.3s;text-decoration:none;display:inline-block}
      .T1_protection-button:hover{opacity:.9}
      .T1_button-description{font-size:12px;color:${c.textColor};margin:0;text-align:center;line-height:1.4}
      .T1_logo-container{max-width:${ls.maxWidth}px;max-height:${ls.maxHeight}px;overflow:hidden;margin-right:8px}
      .T1_logo-container img{max-width:100%;max-height:100%;object-fit:contain}
      .T1_icon-custom{width:${is.size}px;height:${is.size}px;background:${is.background};border:1px solid ${is.borderColor};border-radius:${is.borderRadius}px;color:${is.color};display:flex;align-items:center;justify-content:center;font-size:${is.size * 0.6}px}
      `;
      document.head.appendChild(s);
    }

    function render() {
      if (state.selectionMode === "button") return renderButtonMode();
      return renderTemplate();
    }

    function renderButtonMode() {
      state.container.innerHTML = `
        <div class="T1_button-mode">
          ${logoHTML()}
          <a href="${state.buttonBlock.buttonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>
          <p class="T1_button-description">${state.buttonBlock.paragraph}</p>
        </div>`;
    }

    function renderTemplate() {
      const t = state.activeTemplate;
      if (t === "template1") return renderT1();
      if (t === "template2") return renderT2();
      return renderT3();
    }

    function renderT1() {
      state.container.innerHTML = `
        <div class="T1_shipping-protection">
          ${logoHTML()}
          <div class="T1_icon-container">${iconHTML()}</div>
          <div class="T1_content">
            <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
            <p class="T1_description">${state.description}</p>
            <div class="T1_confirmation-message ${state.isEnabled ? "T1_visible" : ""}">${state.confirmationMessage}</div>
          </div>
          ${state.selectionMode === "checkbox" ? checkboxHTML() : toggleHTML()}
        </div>`;
    }

    function renderT2() {
      const isSwitch = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
      const showDetail = isSwitch && state.isEnabled;
      const showCheckoutMsg = state.selectionMode === "button" || !state.isEnabled;

      state.container.innerHTML = `
        <div class="T1_template2-container">
          <div class="T1_main-widget">
            ${logoHTML()}
            <div class="T1_icon-container">${iconHTML()}</div>
            <div class="T1_content">
              <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
              <p class="T1_description">${state.description}</p>
              
            </div>
              <div class="T1_controls-section">
            ${state.selectionMode === "toggle" ? toggleHTML() : ""}
            ${state.selectionMode === "checkbox" ? checkboxHTML() : ""}
            ${state.selectionMode === "button" ? `<a href="${state.ctaButtonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>` : ""}
          </div>
          </div>

          ${inlinePointsHTML()}

        

          ${showDetail ? `
            <div class="T1_protection-added">
              ${svg("check")}
              <span>${state.protectionAddedText} (+$${state.protectionPrice.toFixed(2)})</span>
            </div>

            <div class="T1_protection-message">
              ${svg("shield")}
              <div class="T1_protection-message-content">
                <p class="T1_protection-message-title">${state.protectionMessage.title}</p>
                <p class="T1_protection-message-subtext">${state.protectionMessage.subtext}</p>
              </div>
            </div>
          ` : ""}

          ${showCheckoutMsg ? `<div class="T1_checkout-button-message">${state.checkoutButtonMessage}</div>` : ""}

          ${state.selectionMode !== "button" ? `<a href="${state.ctaButtonHref}" class="T1_cta-button">${state.ctaButtonText}</a>` : ""}
        </div>`;
    }

    function renderT3() {
      const isSwitch = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
      const showBadge = isSwitch && state.isEnabled;

      state.container.innerHTML = `
        <div class="T1_template3-container">
          <div class="T1_main-widget" style="position:relative;">
            ${logoHTML()}
            <div class="T1_icon-container">${iconHTML()}</div>
            <div class="T1_content">
              <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
              <p class="T1_description">${state.description}</p>
           
            </div>
            
            <div class="T1_badge ${showBadge ? "T1_visible" : ""}">${state.badgeText}</div>
            
                      <div class="T1_controls-section">
            ${state.selectionMode === "toggle" ? toggleHTML() : ""}
            ${state.selectionMode === "checkbox" ? checkboxHTML() : ""}
            ${state.selectionMode === "button" ? `<a href="${state.ctaButtonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>` : ""}
          </div>
          </div>
   <div class="T1_confirmation-message ${state.isEnabled ? "T1_visible" : ""}">${state.confirmationMessage}</div>
        </div>`;
    }

    function bindEvents() {
      if (state.selectionMode === "button") {
        const btn = d(".T1_protection-button", state.container);
        if (btn) {
          btn.addEventListener("click", (e) => {
            const href = btn.getAttribute("href") || "";
            if (href === "#" || href.includes("example.com")) {
              e.preventDefault();
              toggleEnabled();
            }
          });
        }
        return;
      }

      // Templates 2/3 bind only active control
      if (state.activeTemplate === "template2" || state.activeTemplate === "template3") {
        if (state.selectionMode === "toggle") bindToggle();
        else if (state.selectionMode === "checkbox") bindCheckbox();
        bindButtons(); // template 2 may render button as well
      } else {
        bindToggle();
        bindCheckbox();
        bindButtons();
      }
    }

    function bindToggle() {
      const t = d(".T1_toggle", state.container);
      if (!t) return;
      const handle = () => toggleEnabled();
      t.addEventListener("click", handle);
      t.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handle();
        }
      });
    }

    function bindCheckbox() {
      const cb = d(".T1_checkbox", state.container);
      if (!cb) return;
      cb.addEventListener("change", (e) => {
        state.isEnabled = !!e.target.checked;
        updateUI();
        state.onToggle(state.isEnabled);
      });
    }

    function bindButtons() {
      da(".T1_protection-button", state.container).forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const href = btn.getAttribute("href") || "";
          if (href === "#" || href.includes("example.com")) {
            e.preventDefault();
            toggleEnabled();
          }
        });
      });
    }

    function toggleEnabled() {
      state.isEnabled = !state.isEnabled;
      updateUI();
      state.onToggle(state.isEnabled);
    }

    function updateUI() {
      const t = d(".T1_toggle", state.container);
      if (t) {
        t.classList.toggle("T1_enabled", state.isEnabled);
        t.classList.toggle("T1_disabled", !state.isEnabled);
        t.setAttribute("aria-checked", state.isEnabled);
      }

      const cb = d(".T1_checkbox", state.container);
      if (cb) cb.checked = state.isEnabled;

      const msg = d(".T1_confirmation-message", state.container);
      if (msg) msg.classList.toggle("T1_visible", state.isEnabled);

      const badge = d(".T1_badge", state.container);
      if (badge) {
        const isSwitch = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
        badge.classList.toggle("T1_visible", isSwitch && state.isEnabled);
      }

      // Template 2 relies on conditional sections -> re-render & re-bind
      if (state.activeTemplate === "template2") {
        render();
        bindEvents();
      }
    }

    // ---------- Public API ----------
    function updatePrice(price) {
      state.protectionPrice = +price || 0;
      const title = d(".T1_title", state.container);
      if (title) title.textContent = `${state.title} ($${state.protectionPrice.toFixed(2)})`;
    }

    function updateEnabled(enabled) {
      state.isEnabled = !!enabled;
      updateUI();
    }

    function getEnabled() {
      return !!state.isEnabled;
    }

    function updateActiveTemplate(template) {
      state.activeTemplate = template;
      render();
      bindEvents();
    }

    function updateContentSettings(settings = {}) {
      const keys = [
        "title",
        "description",
        "protectionPrice",
        "isEnabled",
        "confirmationMessage",
        "badgeText",
        "ctaButtonText",
        "ctaButtonHref",
        "bulletPoints",
        "additionalParagraphs"
      ];
      keys.forEach((k) => {
        if (settings[k] !== undefined) state[k] = settings[k];
      });
      // template 2 message structure
      if (settings.protectionMessageTitle !== undefined)
        state.protectionMessage.title = settings.protectionMessageTitle;
      if (settings.protectionMessageSubtext !== undefined)
        state.protectionMessage.subtext = settings.protectionMessageSubtext;

      render();
      bindEvents();
    }

    function updateColorSettings(colors = {}) {
      Object.keys(colors).forEach((k) => {
        if (k in state.colors) state.colors[k] = colors[k];
      });
      injectStyles();
    }

    function updateSelectionMode({ mode } = {}) {
      if (mode) state.selectionMode = mode;
      render();
      bindEvents();
    }

    function updateLogoSettings(logoSettings = {}) {
      state.logoSettings = { ...state.logoSettings, ...logoSettings };
      render();
      bindEvents();
    }

    function updateIconAsset(iconAsset = {}) {
      state.iconAsset = { ...state.iconAsset, ...iconAsset };
      render();
      bindEvents();
    }

    function updateIconStyle(iconStyle = {}) {
      state.iconStyle = { ...state.iconStyle, ...iconStyle };
      injectStyles();
      render();
      bindEvents();
    }

    function updateButtonBlock(buttonBlock = {}) {
      state.buttonBlock = { ...state.buttonBlock, ...buttonBlock };
      render();
      bindEvents();
    }

    function destroy() {
      if (state.container) state.container.innerHTML = "";
      d("#T1_template-styles")?.remove();
    }

    // build API object
    function api() {}
    const apiObj = {
      // rendering lifecycle
      render,
      destroy,

      // getters/setters
      updatePrice,
      updateEnabled,
      getEnabled,
      updateActiveTemplate,
      updateContentSettings,
      updateColorSettings,
      updateSelectionMode,
      updateLogoSettings,
      updateIconAsset,
      updateIconStyle,
      updateButtonBlock
    };

    // ---------- Init ----------
    injectStyles();
    render();
    bindEvents();

    // expose on container for proxy getInstance
    container._template1Instance = apiObj;

    // return instance (works with or without `new`)
    return apiObj;
  }

  // CommonJS / UMD-ish export
  if (typeof module !== "undefined" && module.exports) {
    module.exports = Template1;
  } else {
    global.Template1 = Template1;

    // Global proxy (drop-in replacement, same API)
    global.Template1.proxy = {
      updateContentSettings(settings) {
        warnNoInstance("updateContentSettings", "settings");
      },
      updateColorSettings(colors) {
        warnNoInstance("updateColorSettings", "colors");
      },
      updateActiveTemplate(template) {
        warnNoInstance("updateActiveTemplate", "template");
      },
      updateSelectionMode(settings) {
        warnNoInstance("updateSelectionMode", "settings");
      },
      updateLogoSettings(logoSettings) {
        warnNoInstance("updateLogoSettings", "logoSettings");
      },
      updateIconAsset(iconAsset) {
        warnNoInstance("updateIconAsset", "iconAsset");
      },
      updateIconStyle(iconStyle) {
        warnNoInstance("updateIconStyle", "iconStyle");
      },
      updateButtonBlock(buttonBlock) {
        warnNoInstance("updateButtonBlock", "buttonBlock");
      },
      getInstance(containerId) {
        const el = document.getElementById(containerId);
        return el?._template1Instance || null;
      },
      setActiveInstance(instance) {
        if (!instance) return;
        const methods = [
          "updateContentSettings",
          "updateColorSettings",
          "updateActiveTemplate",
          "updateSelectionMode",
          "updateLogoSettings",
          "updateIconAsset",
          "updateIconStyle",
          "updateButtonBlock"
        ];
        methods.forEach((m) => {
          if (typeof instance[m] === "function") {
            this[m] = instance[m].bind(instance);
          }
        });
        console.info("Active Template1 instance set for proxy access.");
      }
    };

    function warnNoInstance(fn, argName) {
      console.warn("No Template1 instance found. Please create an instance first or use an existing instance.");
      console.info(`Example:
const template = Template1("your-container-id"); // or: new Template1("your-container-id")
template.${fn}(${argName});`);
    }
  }
})(typeof window !== "undefined" ? window : globalThis);










// (function (global) {
//   "use strict";

//   const d = (sel, root = document) => root.querySelector(sel);
//   const da = (sel, root = document) => root.querySelectorAll(sel);

//   // Built-in small SVG set for template bullets
//   const SVG = {
//     shield: `<svg class="T1_icon-shield" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/><path d="M9 12l2 2 4-4"/></svg>`,
//     users: `<svg class="T1_icon-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
//     lightning: `<svg class="T1_icon-lightning" viewBox="0 0 24 24"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>`,
//     star: `<svg class="T1_icon-star" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>`,
//     check: `<svg class="T1_icon-check" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>`
//   };

//   const ICON_MAP = {
//     "shield-check": "🛡️",
//     sparkles: "✨",
//     lock: "🔒",
//     lightning: "⚡",
//     target: "🎯",
//     diamond: "💎",
//     rocket: "🚀",
//     package: "📦"
//   };

//   function ensureInstance(o) {
//     // Allows calling with or without `new`
//     if (!(o instanceof Object)) return {};
//     return o;
//   }

//   function Template1(containerId, options = {}) {
//     // Allow use with `new` or plain function call:
//     const self = ensureInstance(this);

//     // ---------- State ----------
//     const container = document.getElementById(containerId);
//     if (!container) {
//       console.error(`Container with ID ${containerId} not found`);
//       return self || {};
//     }

//     // defaults
//     let state = {
//       containerId,
//       container,
//       activeTemplate: options.activeTemplate || "template1",
//       isEnabled: options.isEnabled !== false,
//       protectionPrice: +options.protectionPrice || 0,
//       onToggle: options.onToggle || (() => {}),

//       // content
//       title: options.title || "Shipping protection",
//       description:
//         options.description ||
//         "100% guarantee & protect your order from damage, loss, or theft",
//       confirmationMessage:
//         options.confirmationMessage || "Your order is now protected!",
//       badgeText: options.badgeText || "Protected",
//       ctaButtonText: options.ctaButtonText || "Shop Now",
//       ctaButtonHref: options.ctaButtonHref || "#",

//       // template 2 content
//       inlinePoints:
//         options.inlinePoints ||
//         [
//           { text: "Secure Coverage", icon: "shield" },
//           { text: "Customers", icon: "users" },
//           { text: "Instant Claims", icon: "lightning" },
//           { text: "Trusted by 50k+", icon: "star" }
//         ],
//       protectionAddedText: options.protectionAddedText || "Protection Added",
//       protectionMessage: {
//         title:
//           options.protectionMessageTitle || "Your order is now protected",
//         subtext:
//           options.protectionMessageSubtext ||
//           "If your package is lost, stolen, or damaged, we'll replace it or provide a full refund — no questions asked."
//       },
//       checkoutButtonMessage:
//         options.checkoutButtonMessage ||
//         "Complete your purchase with protection",

//       // legacy content
//       bulletPoints:
//         options.bulletPoints ||
//         [
//           "🛡️ Protection against damage during shipping",
//           "📦 Coverage for lost or stolen packages",
//           "💰 Fast reimbursement process"
//         ],
//       additionalParagraphs:
//         options.additionalParagraphs ||
//         [
//           "Our shipping protection ensures your order arrives safely. If anything goes wrong, we'll make it right.",
//           "Join thousands of satisfied customers who shop with confidence knowing their orders are protected."
//         ],

//       // colors
//       colors: {
//         backgroundColor: options.backgroundColor || "#DCFCE7",
//         iconBackground: options.iconBackground || "#C1F4D9",
//         textColor: options.textColor || "#065F46",
//         toggleEnabled: options.toggleEnabled || "#49ae78",
//         toggleDisabled: options.toggleDisabled || "#d1d5db",
//         buttonBg: options.buttonBg || "#065F46",
//         buttonText: options.buttonText || "#ffffff",
//         ctaButtonBg: options.ctaButtonBg || "#22c55e",
//         ctaButtonText: options.ctaButtonText || "#ffffff",
//         badgeBg: options.badgeBg || "#22c55e",
//         badgeText: options.badgeText || "#ffffff"
//       },

//       // selection
//       selectionMode: options.selectionMode || "toggle", // "toggle" | "checkbox" | "button"

//       // logo
//       logoSettings: {
//         showLogo: options.logoSettings?.showLogo !== false,
//         logoUrl: options.logoSettings?.logoUrl || "",
//         alt: options.logoSettings?.alt || "Brand Logo",
//         maxWidth: options.logoSettings?.maxWidth || 160,
//         maxHeight: options.logoSettings?.maxHeight || 48
//       },

//       // icon
//       iconAsset: {
//         type: options.iconAsset?.type || "builtin", // "builtin" | "custom"
//         name: options.iconAsset?.name || "shield-check",
//         url: options.iconAsset?.url || null
//       },
//       iconStyle: {
//         size: options.iconStyle?.size || 24,
//         color: options.iconStyle?.color || "#111111",
//         background: options.iconStyle?.background || "#F5F5F5",
//         borderColor: options.iconStyle?.borderColor || "#E5E7EB",
//         borderRadius: options.iconStyle?.borderRadius || 9999
//       },

//       // button block (button selection mode)
//       buttonBlock: {
//         buttonLabel: options.buttonBlock?.buttonLabel || "Enable Protection",
//         buttonHref:
//           options.buttonBlock?.buttonHref || "https://example.com/cta",
//         paragraph:
//           options.buttonBlock?.paragraph ||
//           "One-line supporting text below the button."
//       }
//     };

//     // Attach instance to container for proxy getInstance support
//     container._template1Instance = api;

//     // ---------- Helpers ----------
//     function iconHTML() {
//       if (state.iconAsset.type === "custom" && state.iconAsset.url) {
//         return `
//           <div class="T1_icon-custom">
//             <img src="${state.iconAsset.url}" style="width:100%;height:100%;object-fit:contain" alt="Custom icon"/>
//           </div>`;
//       }
//       const char = ICON_MAP[state.iconAsset.name] || "🛡️";
//       return `
//         <div class="T1_icon-custom">
//           ${char}
//         </div>`;
//     }

//     function svg(name) {
//       return SVG[name] || SVG.shield;
//     }

//     function logoHTML() {
//       const { showLogo, logoUrl, alt, maxWidth, maxHeight } = state.logoSettings;
//       if (!showLogo || !logoUrl) return "";
//       return `
//         <div class="T1_logo-container" style="max-width:${maxWidth}px;max-height:${maxHeight}px;overflow:hidden;margin-right:8px">
//           <img src="${logoUrl}" alt="${alt}" style="max-width:100%;max-height:100%;object-fit:contain"/>
//         </div>`;
//     }

//     function checkboxHTML() {
//       return `
//         <input type="checkbox" class="T1_checkbox" id="T1_protection_checkbox" ${state.isEnabled ? "checked" : ""}/>
//         <label for="T1_protection_checkbox" style="cursor:pointer;margin-left:4px;font-size:12px;color:${state.colors.textColor};">Checkbox</label>
//       `;
//     }

//     function toggleHTML() {
//       return `
//         <div class="T1_toggle ${state.isEnabled ? "T1_enabled" : "T1_disabled"}" role="switch" aria-checked="${state.isEnabled}" tabindex="0">
//           <span class="T1_toggle-handle"></span>
//         </div>
//       `;
//     }

//     function inlinePointsHTML() {
//       return `
//         <div class="T1_inline-points">
//           ${state.inlinePoints
//             .map(
//               (p) => `
//             <div class="T1_inline-point">
//               ${svg(p.icon)}
//               <span>${p.text}</span>
//             </div>`
//             )
//             .join("")}
//         </div>`;
//     }

//     function injectStyles() {
//       const id = "T1_template-styles";
//       d(`#${id}`)?.remove();

//       const s = document.createElement("style");
//       s.id = id;
//       const c = state.colors;
//       const is = state.iconStyle;
//       const ls = state.logoSettings;

//       s.textContent = `
//       .T1_shipping-protection{background:${c.backgroundColor};border-radius:8px;padding:12px;display:flex;align-items:center;gap:12px;position:relative;transition:.3s}
//       .T1_icon-container{width:55px;height:55px;background:${c.iconBackground};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
//       .T1_inner-icon{width:24px;height:24px;background:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center}
//       .T1_content{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
//       .T1_title{font-weight:500;font-size:14px;color:${c.textColor};margin:0}
//       .T1_description{font-weight:400;font-size:12px;color:${c.textColor};margin:0;line-height:1.4}
//       .T1_toggle{position:relative;display:inline-flex;height:24px;width:44px;align-items:center;border-radius:9999px;cursor:pointer;transition:background-color .3s}
//       .T1_toggle.T1_enabled{background:${c.toggleEnabled}}
//       .T1_toggle.T1_disabled{background:${c.toggleDisabled}}
//       .T1_toggle-handle{display:inline-block;height:16px;width:16px;transform:translateX(4px);border-radius:50%;background:#fff;transition:transform .3s}
//       .T1_toggle.T1_enabled .T1_toggle-handle{transform:translateX(24px)}
//       .T1_toggle:focus{outline:2px solid #4f46e5;outline-offset:2px}

//       .T1_template2-container,.T1_template3-container{background:${c.backgroundColor};border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px}
//       .T1_main-widget{display:flex;align-items:center;gap:12px}
//       .T1_controls-section{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
//       .T1_inline-points{display:flex;justify-content:space-between;gap:16px;margin:12px 0;flex-wrap:wrap}
//       .T1_inline-point{display:flex;align-items:center;gap:6px;font-size:12px;color:${c.textColor};font-weight:500}
//       .T1_inline-point-icon{width:16px;height:16px;fill:${c.textColor}}
//       .T1_protection-added{background:${c.iconBackground};border-radius:6px;padding:10px 12px;display:flex;align-items:center;gap:8px;margin:12px 0;font-size:13px;font-weight:500;color:${c.textColor}}
//       .T1_protection-message{background:${c.iconBackground};border-radius:6px;padding:12px;margin:12px 0;display:flex;align-items:flex-start;gap:10px}
//       .T1_protection-message-title{font-size:14px;font-weight:600;color:${c.textColor};margin:0 0 4px}
//       .T1_protection-message-subtext{font-size:12px;color:${c.textColor};line-height:1.4;margin:0;opacity:.8}
//       .T1_checkout-button-message{background:${c.ctaButtonBg};color:${c.ctaButtonText};border-radius:6px;padding:12px 16px;margin:12px 0;text-align:center;font-size:13px;font-weight:500}
//       .T1_bullet-points{list-style:none;padding:0;margin:8px 0;display:flex;flex-direction:column;gap:6px}
//       .T1_bullet-points li{font-size:12px;color:${c.textColor};line-height:1.4}
//       .T1_additional-paragraphs{margin:8px 0;display:flex;flex-direction:column;gap:8px}
//       .T1_additional-paragraphs p{font-size:12px;color:${c.textColor};line-height:1.4;margin:0}
//       .T1_cta-button{background:${c.ctaButtonBg};color:${c.ctaButtonText};border:0;border-radius:6px;padding:10px 20px;font-size:13px;font-weight:500;cursor:pointer;transition:.3s;text-decoration:none;display:inline-block;text-align:center;margin-top:8px;align-self:flex-start}
//       .T1_cta-button:hover{opacity:.9}
//       .T1_confirmation-message{font-size:12px;color:${c.toggleEnabled};font-weight:500;margin-top:4px;opacity:0;transition:opacity .3s}
//       .T1_confirmation-message.T1_visible{opacity:1}
//       .T1_badge{position:absolute;top:-8px;right:-8px;background:${c.badgeBg};color:${c.badgeText};font-size:10px;font-weight:600;padding:4px 8px;border-radius:12px;text-transform:uppercase;letter-spacing:.5px;opacity:0;transform:scale(.8);transition:.3s;z-index:10}
//       .T1_badge.T1_visible{opacity:1;transform:scale(1)}
//       .T1_checkbox{width:18px;height:18px;accent-color:${c.toggleEnabled};cursor:pointer}
//       .T1_button-mode{display:flex;flex-direction:column;gap:8px;align-items:center;padding:12px;border-radius:8px;background:${c.backgroundColor}}
//       .T1_protection-button{background:${c.buttonBg};color:${c.buttonText};border:0;border-radius:6px;padding:12px 24px;font-size:14px;font-weight:500;cursor:pointer;transition:.3s;text-decoration:none;display:inline-block}
//       .T1_protection-button:hover{opacity:.9}
//       .T1_button-description{font-size:12px;color:${c.textColor};margin:0;text-align:center;line-height:1.4}
//       .T1_logo-container{max-width:${ls.maxWidth}px;max-height:${ls.maxHeight}px;overflow:hidden;margin-right:8px}
//       .T1_logo-container img{max-width:100%;max-height:100%;object-fit:contain}
//       .T1_icon-custom{width:${is.size}px;height:${is.size}px;background:${is.background};border:1px solid ${is.borderColor};border-radius:${is.borderRadius}px;color:${is.color};display:flex;align-items:center;justify-content:center;font-size:${is.size * 0.6}px}
//       `;
//       document.head.appendChild(s);
//     }

//     function render() {
//       if (state.selectionMode === "button") return renderButtonMode();
//       return renderTemplate();
//     }

//     function renderButtonMode() {
//       state.container.innerHTML = `
//         <div class="T1_button-mode">
//           ${logoHTML()}
//           <a href="${state.buttonBlock.buttonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>
//           <p class="T1_button-description">${state.buttonBlock.paragraph}</p>
//         </div>`;
//     }

//     function renderTemplate() {
//       const t = state.activeTemplate;
//       if (t === "template1") return renderT1();
//       if (t === "template2") return renderT2();
//       return renderT3();
//     }

//     function renderT1() {
//       state.container.innerHTML = `
//         <div class="T1_shipping-protection">
//           ${logoHTML()}
//           <div class="T1_icon-container">${iconHTML()}</div>
//           <div class="T1_content">
//             <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
//             <p class="T1_description">${state.description}</p>
//             <div class="T1_confirmation-message ${state.isEnabled ? "T1_visible" : ""}">${state.confirmationMessage}</div>
//           </div>
//           ${state.selectionMode === "checkbox" ? checkboxHTML() : toggleHTML()}
//         </div>`;
//     }

//     function renderT2() {
//       const isSwitch = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
//       const showDetail = isSwitch && state.isEnabled;
//       const showCheckoutMsg = state.selectionMode === "button" || !state.isEnabled;

//       state.container.innerHTML = `
//         <div class="T1_template2-container">
//           <div class="T1_main-widget">
//             ${logoHTML()}
//             <div class="T1_icon-container">${iconHTML()}</div>
//             <div class="T1_content">
//               <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
//               <p class="T1_description">${state.description}</p>
//             </div>
//           </div>

//           ${inlinePointsHTML()}

//           <div class="T1_controls-section">
//             ${state.selectionMode === "toggle" ? toggleHTML() : ""}
//             ${state.selectionMode === "checkbox" ? checkboxHTML() : ""}
//             ${state.selectionMode === "button" ? `<a href="${state.ctaButtonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>` : ""}
//           </div>

//           ${showDetail ? `
//             <div class="T1_protection-added">
//               ${svg("check")}
//               <span>${state.protectionAddedText} (+$${state.protectionPrice.toFixed(2)})</span>
//             </div>

//             <div class="T1_protection-message">
//               ${svg("shield")}
//               <div class="T1_protection-message-content">
//                 <p class="T1_protection-message-title">${state.protectionMessage.title}</p>
//                 <p class="T1_protection-message-subtext">${state.protectionMessage.subtext}</p>
//               </div>
//             </div>
//           ` : ""}

//           ${showCheckoutMsg ? `<div class="T1_checkout-button-message">${state.checkoutButtonMessage}</div>` : ""}

//           ${state.selectionMode !== "button" ? `<a href="${state.ctaButtonHref}" class="T1_cta-button">${state.ctaButtonText}</a>` : ""}
//         </div>`;
//     }

//     function renderT3() {
//       const isSwitch = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
//       const showBadge = isSwitch && state.isEnabled;

//       state.container.innerHTML = `
//         <div class="T1_template3-container">
//           <div class="T1_main-widget" style="position:relative;">
//             ${logoHTML()}
//             <div class="T1_icon-container">${iconHTML()}</div>
//             <div class="T1_content">
//               <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
//               <p class="T1_description">${state.description}</p>
//               <div class="T1_confirmation-message ${state.isEnabled ? "T1_visible" : ""}">${state.confirmationMessage}</div>
//             </div>
//             <div class="T1_badge ${showBadge ? "T1_visible" : ""}">${state.badgeText}</div>
//           </div>
//           <div class="T1_controls-section">
//             ${state.selectionMode === "toggle" ? toggleHTML() : ""}
//             ${state.selectionMode === "checkbox" ? checkboxHTML() : ""}
//             ${state.selectionMode === "button" ? `<a href="${state.ctaButtonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>` : ""}
//           </div>
//         </div>`;
//     }

//     function bindEvents() {
//       if (state.selectionMode === "button") {
//         const btn = d(".T1_protection-button", state.container);
//         if (btn) {
//           btn.addEventListener("click", (e) => {
//             const href = btn.getAttribute("href") || "";
//             if (href === "#" || href.includes("example.com")) {
//               e.preventDefault();
//               toggleEnabled();
//             }
//           });
//         }
//         return;
//       }

//       // Templates 2/3 bind only active control
//       if (state.activeTemplate === "template2" || state.activeTemplate === "template3") {
//         if (state.selectionMode === "toggle") bindToggle();
//         else if (state.selectionMode === "checkbox") bindCheckbox();
//         bindButtons(); // template 2 may render button as well
//       } else {
//         bindToggle();
//         bindCheckbox();
//         bindButtons();
//       }
//     }

//     function bindToggle() {
//       const t = d(".T1_toggle", state.container);
//       if (!t) return;
//       const handle = () => toggleEnabled();
//       t.addEventListener("click", handle);
//       t.addEventListener("keydown", (e) => {
//         if (e.key === " " || e.key === "Enter") {
//           e.preventDefault();
//           handle();
//         }
//       });
//     }

//     function bindCheckbox() {
//       const cb = d(".T1_checkbox", state.container);
//       if (!cb) return;
//       cb.addEventListener("change", (e) => {
//         state.isEnabled = !!e.target.checked;
//         updateUI();
//         state.onToggle(state.isEnabled);
//       });
//     }

//     function bindButtons() {
//       da(".T1_protection-button", state.container).forEach((btn) => {
//         btn.addEventListener("click", (e) => {
//           const href = btn.getAttribute("href") || "";
//           if (href === "#" || href.includes("example.com")) {
//             e.preventDefault();
//             toggleEnabled();
//           }
//         });
//       });
//     }

//     function toggleEnabled() {
//       state.isEnabled = !state.isEnabled;
//       updateUI();
//       state.onToggle(state.isEnabled);
//     }

//     function updateUI() {
//       const t = d(".T1_toggle", state.container);
//       if (t) {
//         t.classList.toggle("T1_enabled", state.isEnabled);
//         t.classList.toggle("T1_disabled", !state.isEnabled);
//         t.setAttribute("aria-checked", state.isEnabled);
//       }

//       const cb = d(".T1_checkbox", state.container);
//       if (cb) cb.checked = state.isEnabled;

//       const msg = d(".T1_confirmation-message", state.container);
//       if (msg) msg.classList.toggle("T1_visible", state.isEnabled);

//       const badge = d(".T1_badge", state.container);
//       if (badge) {
//         const isSwitch = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
//         badge.classList.toggle("T1_visible", isSwitch && state.isEnabled);
//       }

//       // Template 2 relies on conditional sections -> re-render & re-bind
//       if (state.activeTemplate === "template2") {
//         render();
//         bindEvents();
//       }
//     }

//     // ---------- Public API ----------
//     function updatePrice(price) {
//       state.protectionPrice = +price || 0;
//       const title = d(".T1_title", state.container);
//       if (title) title.textContent = `${state.title} ($${state.protectionPrice.toFixed(2)})`;
//     }

//     function updateEnabled(enabled) {
//       state.isEnabled = !!enabled;
//       updateUI();
//     }

//     function getEnabled() {
//       return !!state.isEnabled;
//     }

//     function updateActiveTemplate(template) {
//       state.activeTemplate = template;
//       render();
//       bindEvents();
//     }

//     function updateContentSettings(settings = {}) {
//       const keys = [
//         "title",
//         "description",
//         "protectionPrice",
//         "isEnabled",
//         "confirmationMessage",
//         "badgeText",
//         "ctaButtonText",
//         "ctaButtonHref",
//         "bulletPoints",
//         "additionalParagraphs"
//       ];
//       keys.forEach((k) => {
//         if (settings[k] !== undefined) state[k] = settings[k];
//       });
//       // template 2 message structure
//       if (settings.protectionMessageTitle !== undefined)
//         state.protectionMessage.title = settings.protectionMessageTitle;
//       if (settings.protectionMessageSubtext !== undefined)
//         state.protectionMessage.subtext = settings.protectionMessageSubtext;

//       render();
//       bindEvents();
//     }

//     function updateColorSettings(colors = {}) {
//       Object.keys(colors).forEach((k) => {
//         if (k in state.colors) state.colors[k] = colors[k];
//       });
//       injectStyles();
//     }

//     function updateSelectionMode({ mode } = {}) {
//       if (mode) state.selectionMode = mode;
//       render();
//       bindEvents();
//     }

//     function updateLogoSettings(logoSettings = {}) {
//       state.logoSettings = { ...state.logoSettings, ...logoSettings };
//       render();
//       bindEvents();
//     }

//     function updateIconAsset(iconAsset = {}) {
//       state.iconAsset = { ...state.iconAsset, ...iconAsset };
//       render();
//       bindEvents();
//     }

//     function updateIconStyle(iconStyle = {}) {
//       state.iconStyle = { ...state.iconStyle, ...iconStyle };
//       injectStyles();
//       render();
//       bindEvents();
//     }

//     function updateButtonBlock(buttonBlock = {}) {
//       state.buttonBlock = { ...state.buttonBlock, ...buttonBlock };
//       render();
//       bindEvents();
//     }

//     function destroy() {
//       if (state.container) state.container.innerHTML = "";
//       d("#T1_template-styles")?.remove();
//     }

//     // build API object
//     function api() {}
//     const apiObj = {
//       // rendering lifecycle
//       render,
//       destroy,

//       // getters/setters
//       updatePrice,
//       updateEnabled,
//       getEnabled,
//       updateActiveTemplate,
//       updateContentSettings,
//       updateColorSettings,
//       updateSelectionMode,
//       updateLogoSettings,
//       updateIconAsset,
//       updateIconStyle,
//       updateButtonBlock
//     };

//     // ---------- Init ----------
//     injectStyles();
//     render();
//     bindEvents();

//     // expose on container for proxy getInstance
//     container._template1Instance = apiObj;

//     // return instance (works with or without `new`)
//     return apiObj;
//   }

//   // CommonJS / UMD-ish export
//   if (typeof module !== "undefined" && module.exports) {
//     module.exports = Template1;
//   } else {
//     global.Template1 = Template1;

//     // Global proxy (drop-in replacement, same API)
//     global.Template1.proxy = {
//       updateContentSettings(settings) {
//         warnNoInstance("updateContentSettings", "settings");
//       },
//       updateColorSettings(colors) {
//         warnNoInstance("updateColorSettings", "colors");
//       },
//       updateActiveTemplate(template) {
//         warnNoInstance("updateActiveTemplate", "template");
//       },
//       updateSelectionMode(settings) {
//         warnNoInstance("updateSelectionMode", "settings");
//       },
//       updateLogoSettings(logoSettings) {
//         warnNoInstance("updateLogoSettings", "logoSettings");
//       },
//       updateIconAsset(iconAsset) {
//         warnNoInstance("updateIconAsset", "iconAsset");
//       },
//       updateIconStyle(iconStyle) {
//         warnNoInstance("updateIconStyle", "iconStyle");
//       },
//       updateButtonBlock(buttonBlock) {
//         warnNoInstance("updateButtonBlock", "buttonBlock");
//       },
//       getInstance(containerId) {
//         const el = document.getElementById(containerId);
//         return el?._template1Instance || null;
//       },
//       setActiveInstance(instance) {
//         if (!instance) return;
//         const methods = [
//           "updateContentSettings",
//           "updateColorSettings",
//           "updateActiveTemplate",
//           "updateSelectionMode",
//           "updateLogoSettings",
//           "updateIconAsset",
//           "updateIconStyle",
//           "updateButtonBlock"
//         ];
//         methods.forEach((m) => {
//           if (typeof instance[m] === "function") {
//             this[m] = instance[m].bind(instance);
//           }
//         });
//         console.info("Active Template1 instance set for proxy access.");
//       }
//     };

//     function warnNoInstance(fn, argName) {
//       console.warn("No Template1 instance found. Please create an instance first or use an existing instance.");
//       console.info(`Example:
// const template = Template1("your-container-id"); // or: new Template1("your-container-id")
// template.${fn}(${argName});`);
//     }
//   }
// })(typeof window !== "undefined" ? window : globalThis);







//    const Template1 = (containerId, options = {}) => {
//     // --- State Management ---
//     const state = {
//         containerId,
//         container: document.getElementById(containerId),
//         activeTemplate: options.activeTemplate || "template1",
//         isEnabled: options.isEnabled !== false,
//         protectionPrice: options.protectionPrice || 0,
//         onToggle: options.onToggle || (() => {}),
//         title: options.title || "Shipping protection",
//         description: options.description || "100% guarantee & protect your order from damage, loss, or theft",
//         confirmationMessage: options.confirmationMessage || "Your order is now protected!",
//         badgeText: options.badgeText || "Protected",
//         ctaButtonText: options.ctaButtonText || "Shop Now",
//         ctaButtonHref: options.ctaButtonHref || "#",
//         inlinePoints: options.inlinePoints || [
//             { text: "Secure Coverage", icon: "shield" },
//             { text: "Customers", icon: "users" },
//             { text: "Instant Claims", icon: "lightning" },
//             { text: "Trusted by 50k+", icon: "star" }
//         ],
//         protectionAddedText: options.protectionAddedText || "Protection Added",
//         protectionMessage: {
//             title: options.protectionMessageTitle || "Your order is now protected",
//             subtext: options.protectionMessageSubtext || "If your package is lost, stolen, or damaged, we'll replace it or provide a full refund — no questions asked."
//         },
//         checkoutButtonMessage: options.checkoutButtonMessage || "Complete your purchase with protection",
//         bulletPoints: options.bulletPoints || [
//             "🛡️ Protection against damage during shipping",
//             "📦 Coverage for lost or stolen packages",
//             "💰 Fast reimbursement process"
//         ],
//         additionalParagraphs: options.additionalParagraphs || [
//             "Our shipping protection ensures your order arrives safely. If anything goes wrong, we'll make it right.",
//             "Join thousands of satisfied customers who shop with confidence knowing their orders are protected."
//         ],
//         colors: {
//             backgroundColor: options.backgroundColor || "#DCFCE7",
//             iconBackground: options.iconBackground || "#C1F4D9",
//             textColor: options.textColor || "#065F46",
//             toggleEnabled: options.toggleEnabled || "#49ae78",
//             toggleDisabled: options.toggleDisabled || "#d1d5db",
//             buttonBg: options.buttonBg || "#065F46",
//             buttonText: options.buttonText || "#ffffff",
//             ctaButtonBg: options.ctaButtonBg || "#22c55e",
//             ctaButtonText: options.ctaButtonText || "#ffffff",
//             badgeBg: options.badgeBg || "#22c55e",
//             badgeText: options.badgeText || "#ffffff"
//         ],
//         selectionMode: options.selectionMode || "toggle",
//         logoSettings: {
//             showLogo: options.logoSettings?.showLogo !== false,
//             logoUrl: options.logoSettings?.logoUrl || "",
//             alt: options.logoSettings?.alt || "Brand Logo",
//             maxWidth: options.logoSettings?.maxWidth || 160,
//             maxHeight: options.logoSettings?.maxHeight || 48
//         },
//         iconAsset: {
//             type: options.iconAsset?.type || "builtin",
//             name: options.iconAsset?.name || "shield-check",
//             url: options.iconAsset?.url || null
//         },
//         iconStyle: {
//             size: options.iconStyle?.size || 24,
//             color: options.iconStyle?.color || "#111111",
//             background: options.iconStyle?.background || "#F5F5F5",
//             borderColor: options.iconStyle?.borderColor || "#E5E7EB",
//             borderRadius: options.iconStyle?.borderRadius || 9999
//         },
//         buttonBlock: {
//             buttonLabel: options.buttonBlock?.buttonLabel || "Enable Protection",
//             buttonHref: options.buttonBlock?.buttonHref || "https://example.com/cta",
//             paragraph: options.buttonBlock?.paragraph || "One-line supporting text below the button."
//         }
//     };

//     // --- Helper Functions ---
//     const getSVGIcon = (iconType) => {
//         const iconMap = {
//             shield: `<svg class="T1_icon-shield" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/><path d="M9 12l2 2 4-4"/></svg>`,
//             users: `<svg class="T1_icon-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
//             lightning: `<svg class="T1_icon-lightning" viewBox="0 0 24 24"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>`,
//             star: `<svg class="T1_icon-star" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>`,
//             check: `<svg class="T1_icon-check" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>`
//         };
//         return iconMap[iconType] || iconMap.shield;
//     };

//     const getIconHtml = () => {
//         if (state.iconAsset.type === "custom" && state.iconAsset.url) {
//             return `<div class="T1_icon-custom"><img src="${state.iconAsset.url}" style="width: 100%; height: 100%; object-fit: contain;" alt="Custom icon" /></div>`;
//         }
//         const iconMap = {
//             "shield-check": "🛡️",
//             sparkles: "✨",
//             lock: "🔒",
//             lightning: "⚡",
//             target: "🎯",
//             diamond: "💎",
//             rocket: "🚀",
//             package: "📦"
//         };
//         return `<div class="T1_icon-custom">${iconMap[state.iconAsset.name] || "🛡️"}</div>`;
//     };

//     const getLogoHtml = () =>
//         state.logoSettings.showLogo && state.logoSettings.logoUrl
//             ? `<div class="T1_logo-container"><img src="${state.logoSettings.logoUrl}" alt="${state.logoSettings.alt}" /></div>`
//             : "";

//     const getToggleHtml = () =>
//         `<div class="T1_toggle ${state.isEnabled ? "T1_enabled" : "T1_disabled"}" role="switch" aria-checked="${state.isEnabled}" tabindex="0">
//             <span class="T1_toggle-handle"></span>
//         </div>`;

//     const getCheckboxHtml = () =>
//         `<input type="checkbox" class="T1_checkbox" ${state.isEnabled ? "checked" : ""} id="T1_protection_checkbox" />
//          <label for="T1_protection_checkbox" style="cursor: pointer; margin-left: 4px; font-size: 12px; color: ${state.colors.textColor};">Checkbox</label>`;

//     // --- Rendering Logic ---
//     const renderButtonMode = () => {
//         state.container.innerHTML = `
//             <div class="T1_button-mode">
//                 ${getLogoHtml()}
//                 <a href="${state.buttonBlock.buttonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>
//                 <p class="T1_button-description">${state.buttonBlock.paragraph}</p>
//             </div>
//         `;
//     };

//     const renderTemplate1 = () => {
//         state.container.innerHTML = `
//             <div class="T1_shipping-protection">
//                 ${getLogoHtml()}
//                 <div class="T1_icon-container">${getIconHtml()}</div>
//                 <div class="T1_content">
//                     <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
//                     <p class="T1_description">${state.description}</p>
//                     <div class="T1_confirmation-message ${state.isEnabled ? "T1_visible" : ""}">${state.confirmationMessage}</div>
//                 </div>
//                 ${state.selectionMode === "checkbox" ? getCheckboxHtml() : getToggleHtml()}
//             </div>
//         `;
//     };

//     const renderTemplate2 = () => {
//         const inlinePointsHtml = state.inlinePoints
//             .map(point => `<div class="T1_inline-point">${getSVGIcon(point.icon)}<span>${point.text}</span></div>`)
//             .join("");

//         const isToggleOrCheckboxMode = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
//         const showDetailedContent = isToggleOrCheckboxMode && state.isEnabled;
//         const showCheckoutMessage = state.selectionMode === "button" || !state.isEnabled;

//         state.container.innerHTML = `
//             <div class="T1_template2-container">
//                 <div class="T1_main-widget">
//                     ${getLogoHtml()}
//                     <div class="T1_icon-container">${getIconHtml()}</div>
//                     <div class="T1_content">
//                         <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
//                         <p class="T1_description">${state.description}</p>
//                     </div>
//                 </div>
//                 <div class="T1_inline-points">${inlinePointsHtml}</div>
//                 <div class="T1_controls-section">
//                     ${state.selectionMode === "toggle" ? getToggleHtml() : ""}
//                     ${state.selectionMode === "checkbox" ? getCheckboxHtml() : ""}
//                     ${state.selectionMode === "button" ? `<a href="${state.ctaButtonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>` : ""}
//                 </div>
//                 ${showDetailedContent ? `
//                     <div class="T1_protection-added">${getSVGIcon("check")}<span>${state.protectionAddedText} (+$${state.protectionPrice.toFixed(2)})</span></div>
//                     <div class="T1_protection-message">
//                         ${getSVGIcon("shield")}
//                         <div class="T1_protection-message-content">
//                             <p class="T1_protection-message-title">${state.protectionMessage.title}</p>
//                             <p class="T1_protection-message-subtext">${state.protectionMessage.subtext}</p>
//                         </div>
//                     </div>
//                 ` : ""}
//                 ${showCheckoutMessage ? `<div class="T1_checkout-button-message">${state.checkoutButtonMessage}</div>` : ""}
//                 ${state.selectionMode !== "button" ? `<a href="${state.ctaButtonHref}" class="T1_cta-button">${state.ctaButtonText}</a>` : ""}
//             </div>
//         `;
//     };

//     const renderTemplate3 = () => {
//         const isToggleOrCheckboxMode = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
//         const showBadge = isToggleOrCheckboxMode && state.isEnabled;

//         state.container.innerHTML = `
//             <div class="T1_template3-container">
//                 <div class="T1_main-widget" style="position: relative;">
//                     ${getLogoHtml()}
//                     <div class="T1_icon-container">${getIconHtml()}</div>
//                     <div class="T1_content">
//                         <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
//                         <p class="T1_description">${state.description}</p>
//                         <div class="T1_confirmation-message ${state.isEnabled ? "T1_visible" : ""}">${state.confirmationMessage}</div>
//                     </div>
//                     <div class="T1_badge ${showBadge ? "T1_visible" : ""}">${state.badgeText}</div>
//                 </div>
//                 <div class="T1_controls-section">
//                     ${state.selectionMode === "toggle" ? getToggleHtml() : ""}
//                     ${state.selectionMode === "checkbox" ? getCheckboxHtml() : ""}
//                     ${state.selectionMode === "button" ? `<a href="${state.ctaButtonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>` : ""}
//                 </div>
//             </div>
//         `;
//     };

//     const render = () => {
//         if (!state.container) {
//             console.error(`Container with ID ${state.containerId} not found`);
//             return;
//         }
//         injectStyles();
//         state.selectionMode === "button" ? renderButtonMode() : (() => {
//             switch (state.activeTemplate) {
//                 case "template1": renderTemplate1(); break;
//                 case "template2": renderTemplate2(); break;
//                 case "template3": renderTemplate3(); break;
//             }
//         })();
//         bindEvents();
//     };

//     // --- Event Binding ---
//     const bindToggleEvents = () => {
//         const toggle = state.container.querySelector(".T1_toggle");
//         if (!toggle) return;
//         const handleToggle = () => {
//             state.isEnabled = !state.isEnabled;
//             state.onToggle(state.isEnabled);
//             updateUI();
//         };
//         toggle.addEventListener("click", handleToggle);
//         toggle.addEventListener("keydown", (e) => {
//             if (e.key === " " || e.key === "Enter") {
//                 e.preventDefault();
//                 handleToggle();
//             }
//         });
//     };

//     const bindCheckboxEvents = () => {
//         const checkbox = state.container.querySelector(".T1_checkbox");
//         if (checkbox) {
//             checkbox.addEventListener("change", (e) => {
//                 state.isEnabled = e.target.checked;
//                 state.onToggle(state.isEnabled);
//                 updateUI();
//             });
//         }
//     };

//     const bindButtonEvents = () => {
//         const buttons = state.container.querySelectorAll(".T1_protection-button");
//         buttons.forEach(button => {
//             button.addEventListener("click", (e) => {
//                 const href = button.getAttribute("href");
//                 if (href === "#" || href.includes("example.com")) {
//                     e.preventDefault();
//                     state.isEnabled = !state.isEnabled;
//                     state.onToggle(state.isEnabled);
//                     updateUI();
//                 }
//             });
//         });
//     };

//     const bindEvents = () => {
//         if (state.selectionMode === "button") {
//             const button = state.container.querySelector(".T1_protection-button");
//             if (button) {
//                 button.addEventListener("click", (e) => {
//                     if (state.buttonBlock.buttonHref === "#" || state.buttonBlock.buttonHref.includes("example.com")) {
//                         e.preventDefault();
//                         state.isEnabled = !state.isEnabled;
//                         state.onToggle(state.isEnabled);
//                         updateUI();
//                     }
//                 });
//             }
//         } else {
//             if (state.activeTemplate === "template2" || state.activeTemplate === "template3") {
//                 state.selectionMode === "toggle" ? bindToggleEvents() : bindCheckboxEvents();
//             } else {
//                 bindToggleEvents();
//                 bindCheckboxEvents();
//             }
//             bindButtonEvents();
//         }
//     };

//     // --- UI Updates ---
//     const updateUI = () => {
//         const toggle = state.container.querySelector(".T1_toggle");
//         if (toggle) {
//             toggle.classList.toggle("T1_enabled", state.isEnabled);
//             toggle.classList.toggle("T1_disabled", !state.isEnabled);
//             toggle.setAttribute("aria-checked", state.isEnabled);
//         }

//         const checkbox = state.container.querySelector(".T1_checkbox");
//         if (checkbox) checkbox.checked = state.isEnabled;

//         const confirmationMsg = state.container.querySelector(".T1_confirmation-message");
//         if (confirmationMsg) {
//             confirmationMsg.classList.toggle("T1_visible", state.isEnabled);
//         }

//         const badge = state.container.querySelector(".T1_badge");
//         if (badge) {
//             const isToggleOrCheckboxMode = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
//             badge.classList.toggle("T1_visible", isToggleOrCheckboxMode && state.isEnabled);
//         }

//         if (state.activeTemplate === "template2") {
//             renderTemplate2();
//             bindEvents();
//         }
//     };

//     // --- Style Injection ---
//     const injectStyles = () => {
//         const existingStyle = document.getElementById("T1_template-styles");
//         if (existingStyle) existingStyle.remove();

//         const style = document.createElement("style");
//         style.id = "T1_template-styles";
//         style.textContent = `
//             .T1_shipping-protection { background-color: ${state.colors.backgroundColor}; border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; position: relative; transition: all 0.3s ease; }
//             .T1_icon-container { width: 55px; height: 55px; background-color: ${state.colors.iconBackground}; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
//             .T1_inner-icon { width: 24px; height: 24px; background-color: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
//             .T1_content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
//             .T1_title { font-weight: 500; font-size: 14px; color: ${state.colors.textColor}; margin: 0; }
//             .T1_description { font-weight: 400; font-size: 12px; color: ${state.colors.textColor}; margin: 0; line-height: 1.4; }
//             .T1_toggle { position: relative; display: inline-flex; height: 24px; width: 44px; align-items: center; border-radius: 9999px; cursor: pointer; transition: background-color 0.3s; }
//             .T1_toggle.T1_enabled { background-color: ${state.colors.toggleEnabled}; }
//             .T1_toggle.T1_disabled { background-color: ${state.colors.toggleDisabled}; }
//             .T1_toggle-handle { display: inline-block; height: 16px; width: 16px; transform: translateX(4px); border-radius: 50%; background-color: white; transition: transform 0.3s; }
//             .T1_toggle.T1_enabled .T1_toggle-handle { transform: translateX(24px); }
//             .T1_toggle:focus { outline: 2px solid #4f46e5; outline-offset: 2px; }
//             .T1_template2-container, .T1_template3-container { background-color: ${state.colors.backgroundColor}; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 16px; }
//             .T1_main-widget { display: flex; align-items: center; gap: 12px; }
//             .T1_controls-section { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
//             .T1_inline-points { display: flex; justify-content: space-between; gap: 16px; margin: 12px 0; flex-wrap: wrap; }
//             .T1_inline-point { display: flex; align-items: center; gap: 6px; font-size: 12px; color: ${state.colors.textColor}; font-weight: 500; }
//             .T1_inline-point-icon { width: 16px; height: 16px; fill: ${state.colors.textColor}; }
//             .T1_protection-added { background-color: ${state.colors.iconBackground}; border-radius: 6px; padding: 10px 12px; display: flex; align-items: center; gap: 8px; margin: 12px 0; font-size: 13px; font-weight: 500; color: ${state.colors.textColor}; }
//             .T1_protection-message { background-color: ${state.colors.iconBackground}; border-radius: 6px; padding: 12px; margin: 12px 0; display: flex; align-items: flex-start; gap: 10px; }
//             .T1_protection-message-content { flex: 1; }
//             .T1_protection-message-title { font-size: 14px; font-weight: 600; color: ${state.colors.textColor}; margin: 0 0 4px 0; }
//             .T1_protection-message-subtext { font-size: 12px; color: ${state.colors.textColor}; line-height: 1.4; margin: 0; opacity: 0.8; }
//             .T1_checkout-button-message { background-color: ${state.colors.ctaButtonBg}; color: ${state.colors.ctaButtonText}; border-radius: 6px; padding: 12px 16px; margin: 12px 0; text-align: center; font-size: 13px; font-weight: 500; }
//             .T1_icon-shield, .T1_icon-users, .T1_icon-lightning, .T1_icon-star, .T1_icon-check { width: 16px; height: 16px; fill: currentColor; }
//             .T1_bullet-points { list-style: none; padding: 0; margin: 8px 0; display: flex; flex-direction: column; gap: 6px; }
//             .T1_bullet-points li { font-size: 12px; color: ${state.colors.textColor}; line-height: 1.4; }
//             .T1_additional-paragraphs { margin: 8px 0; display: flex; flex-direction: column; gap: 8px; }
//             .T1_additional-paragraphs p { font-size: 12px; color: ${state.colors.textColor}; line-height: 1.4; margin: 0; }
//             .T1_cta-button { background-color: ${state.colors.ctaButtonBg}; color: ${state.colors.ctaButtonText}; border: none; border-radius: 6px; padding: 10px 20px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.3s; text-decoration: none; display: inline-block; text-align: center; margin-top: 8px; align-self: flex-start; }
//             .T1_cta-button:hover { opacity: 0.9; }
//             .T1_confirmation-message { font-size: 12px; color: ${state.colors.toggleEnabled}; font-weight: 500; margin-top: 4px; opacity: 0; transition: opacity 0.3s ease; }
//             .T1_confirmation-message.T1_visible { opacity: 1; }
//             .T1_badge { position: absolute; top: -8px; right: -8px; background-color: ${state.colors.badgeBg}; color: ${state.colors.badgeText}; font-size: 10px; font-weight: 600; padding: 4px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0; transform: scale(0.8); transition: all 0.3s ease; z-index: 10; }
//             .T1_badge.T1_visible { opacity: 1; transform: scale(1); }
//             .T1_checkbox { width: 18px; height: 18px; accent-color: ${state.colors.toggleEnabled}; cursor: pointer; }
//             .T1_button-mode { display: flex; flex-direction: column; gap: 8px; align-items: center; padding: 12px; border-radius: 8px; background-color: ${state.colors.backgroundColor}; }
//             .T1_protection-button { background-color: ${state.colors.buttonBg}; color: ${state.colors.buttonText}; border: none; border-radius: 6px; padding: 12px 24px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s; text-decoration: none; display: inline-block; }
//             .T1_protection-button:hover { opacity: 0.9; }
//             .T1_button-description { font-size: 12px; color: ${state.colors.textColor}; margin: 0; text-align: center; line-height: 1.4; }
//             .T1_logo-container { max-width: ${state.logoSettings.maxWidth}px; max-height: ${state.logoSettings.maxHeight}px; overflow: hidden; margin-right: 8px; }
//             .T1_logo-container img { max-width: 100%; max-height: 100%; object-fit: contain; }
//             .T1_icon-custom { width: ${state.iconStyle.size}px; height: ${state.iconStyle.size}px; background-color: ${state.iconStyle.background}; border: 1px solid ${state.iconStyle.borderColor}; border-radius: ${state.iconStyle.borderRadius}px; color: ${state.iconStyle.color}; display: flex; align-items: center; justify-content: center; font-size: ${state.iconStyle.size * 0.6}px; }
//         `;
//         document.head.appendChild(style);
//     };

//     // --- Public API ---
//     const updatePrice = (price) => {
//         state.protectionPrice = price;
//         const titleElement = state.container.querySelector(".T1_title");
//         if (titleElement) titleElement.textContent = `${state.title} ($${price.toFixed(2)})`;
//     };

//     const updateEnabled = (enabled) => {
//         state.isEnabled = enabled;
//         updateUI();
//     };

//     const getEnabled = () => state.isEnabled;

//     const updateActiveTemplate = (template) => {
//         state.activeTemplate = template;
//         render();
//     };

//     const updateContentSettings = (settings) => {
//         Object.assign(state, settings);
//         render();
//     };

//     const updateColorSettings = (colors) => {
//         Object.assign(state.colors, colors);
//         injectStyles();
//     };

//     const updateSelectionMode = (settings) => {
//         if (settings.mode !== undefined) state.selectionMode = settings.mode;
//         render();
//     };

//     const updateLogoSettings = (logoSettings) => {
//         Object.assign(state.logoSettings, logoSettings);
//         render();
//     };

//     const updateIconAsset = (iconAsset) => {
//         Object.assign(state.iconAsset, iconAsset);
//         render();
//     };

//     const updateIconStyle = (iconStyle) => {
//         Object.assign(state.iconStyle, iconStyle);
//         injectStyles();
//         render();
//     };

//     const updateButtonBlock = (buttonBlock) => {
//         Object.assign(state.buttonBlock, buttonBlock);
//         render();
//     };

//     const destroy = () => {
//         if (state.container) state.container.innerHTML = "";
//         const style = document.getElementById("T1_template-styles");
//         if (style) style.remove();
//     };

//     // Initialize
//     render();

//     // Return public methods
//     return {
//         updatePrice,
//         updateEnabled,
//         getEnabled,
//         updateActiveTemplate,
//         updateContentSettings,
//         updateColorSettings,
//         updateSelectionMode,
//         updateLogoSettings,
//         updateIconAsset,
//         updateIconStyle,
//         updateButtonBlock,
//         destroy
//     };
// };

// // --- Global Proxy for Console Access ---
// window.Template1 = Template1;
// window.Template1.proxy = {
//     updateContentSettings: () => console.warn("No Template1 instance found. Create an instance first."),
//     updateColorSettings: () => console.warn("No Template1 instance found. Create an instance first."),
//     updateActiveTemplate: () => console.warn("No Template1 instance found. Create an instance first."),
//     updateSelectionMode: () => console.warn("No Template1 instance found. Create an instance first."),
//     updateLogoSettings: () => console.warn("No Template1 instance found. Create an instance first."),
//     updateIconAsset: () => console.warn("No Template1 instance found. Create an instance first."),
//     updateIconStyle: () => console.warn("No Template1 instance found. Create an instance first."),
//     updateButtonBlock: () => console.warn("No Template1 instance found. Create an instance first."),
//     getInstance: (containerId) => {
//         const container = document.getElementById(containerId);
//         return container?._template1Instance || null;
//     },
//     setActiveInstance: (instance) => {
//         if (instance) {
//             Object.assign(window.Template1.proxy, {
//                 updateContentSettings: instance.updateContentSettings,
//                 updateColorSettings: instance.updateColorSettings,
//                 updateActiveTemplate: instance.updateActiveTemplate,
//                 updateSelectionMode: instance.updateSelectionMode,
//                 updateLogoSettings: instance.updateLogoSettings,
//                 updateIconAsset: instance.updateIconAsset,
//                 updateIconStyle: instance.updateIconStyle,
//                 updateButtonBlock: instance.updateButtonBlock
//             });
//         }
//     }
// };
