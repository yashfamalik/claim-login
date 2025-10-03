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

  // Enhanced Custom Logo Collection - Support for 12 dynamic logos
  const CUSTOM_LOGO_MAP = {
    "logo1": "🛡️", // Protection Shield
    "logo2": "✨", // Sparkles
    "logo3": "🔒", // Security Lock
    "logo4": "⚡", // Lightning Fast
    "logo5": "🎯", // Target Precision
    "logo6": "💎", // Premium Diamond
    "logo7": "🚀", // Rocket Speed
    "logo8": "📦", // Package Protection
    "logo9": "🔐", // Secure Vault
    "logo10": "🌟", // Star Quality
    "logo11": "🛡️", // Shield Guard
    "logo12": "🔥"  // Fire Power
  };

  // Dynamic logo settings that can be updated via controller
  let customLogos = {
    logo1: { emoji: "🛡️", url: null, name: "Protection Shield", category: "security" },
    logo2: { emoji: "✨", url: null, name: "Sparkles", category: "premium" },
    logo3: { emoji: "🔒", url: null, name: "Security Lock", category: "security" },
    logo4: { emoji: "⚡", url: null, name: "Lightning Fast", category: "speed" },
    logo5: { emoji: "🎯", url: null, name: "Target Precision", category: "accuracy" },
    logo6: { emoji: "💎", url: null, name: "Premium Diamond", category: "premium" },
    logo7: { emoji: "🚀", url: null, name: "Rocket Speed", category: "speed" },
    logo8: { emoji: "📦", url: null, name: "Package Protection", category: "shipping" },
    logo9: { emoji: "🔐", url: null, name: "Secure Vault", category: "security" },
    logo10: { emoji: "🌟", url: null, name: "Star Quality", category: "premium" },
    logo11: { emoji: "🛡️", url: null, name: "Shield Guard", category: "security" },
    logo12: { emoji: "🔥", url: null, name: "Fire Power", category: "speed" }
  };

  function ensureInstance(o) {
    // Allows calling with or without `new`
    if (!(o instanceof Object)) return {};
    return o;
  }

  // Utility function for color manipulation
  function getLighterColor(color, amount = 0.2) {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
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
      // CTA Button removed per requirements

      // template 2/3 specific content
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
        useGradient: options.useGradient || false,
        gradientStart: options.gradientStart || "#DCFCE7",
        gradientEnd: options.gradientEnd || "#C1F4D9",
        iconBackground: options.iconBackground || "#C1F4D9",
        textColor: options.textColor || "#065F46",
        toggleEnabled: options.toggleEnabled || "#49ae78",
        toggleDisabled: options.toggleDisabled || "#d1d5db",
        buttonBg: options.buttonBg || "#065F46",
        buttonText: options.buttonText || "#ffffff",
        // CTA Button colors removed
        badgeBg: options.badgeBg || "#22c55e",
        badgeText: options.badgeText || "#ffffff"
      },

      // selection
      selectionMode: options.selectionMode || "toggle", // "toggle" | "checkbox" | "button"

      // Enable Protection toggle control settings - Enhanced
      enableProtectionControl: {
        enabled: options.enableProtectionControl?.enabled !== false,
        backgroundColor: options.enableProtectionControl?.backgroundColor || "#49ae78",
        textColor: options.enableProtectionControl?.textColor || "#ffffff",
        disabledBackgroundColor: options.enableProtectionControl?.disabledBackgroundColor || "#d1d5db",
        disabledTextColor: options.enableProtectionControl?.disabledTextColor || "#6b7280",
        enabledText: options.enableProtectionControl?.enabledText || "Protection Enabled",
        disabledText: options.enableProtectionControl?.disabledText || "Enable Protection",
        showText: options.enableProtectionControl?.showText !== false,
        borderRadius: options.enableProtectionControl?.borderRadius || 24,
        borderWidth: options.enableProtectionControl?.borderWidth || 0,
        borderColor: options.enableProtectionControl?.borderColor || "transparent",
        fontSize: options.enableProtectionControl?.fontSize || 12,
        padding: options.enableProtectionControl?.padding || "6px 12px",
        transition: options.enableProtectionControl?.transition || "all 0.3s ease",
        hoverEffect: options.enableProtectionControl?.hoverEffect !== false,
        activeEffect: options.enableProtectionControl?.activeEffect !== false
      },

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
        type: options.iconAsset?.type || "builtin", // "builtin" | "custom" | "logo"
        name: options.iconAsset?.name || "logo1", // Changed default to logo1
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
      
      // Use enhanced custom logo system
      const logoKey = state.iconAsset.name || "logo1";
      const logo = customLogos[logoKey];
      
      if (logo && logo.url) {
        // Use uploaded custom logo with enhanced styling
        return `
          <div class="T1_icon-custom T1_icon-uploaded" data-logo-category="${logo.category || 'default'}">
            <img src="${logo.url}" style="width:100%;height:100%;object-fit:contain" alt="${logo.name}"/>
            <div class="T1_icon-overlay" style="opacity:0"></div>
          </div>`;
      } else if (logo && logo.emoji) {
        // Use emoji with enhanced styling
        return `
          <div class="T1_icon-custom T1_icon-emoji" data-logo-category="${logo.category || 'default'}">
            <span class="T1_emoji-icon">${logo.emoji}</span>
          </div>`;
      } else {
        // Default fallback with enhanced styling
        const char = CUSTOM_LOGO_MAP[logoKey] || "🛡️";
        return `
          <div class="T1_icon-custom T1_icon-fallback">
            <span class="T1_emoji-icon">${char}</span>
          </div>`;
      }
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
        <label for="T1_protection_checkbox" style="cursor:pointer;margin-left:4px;font-size:12px;color:${state.colors.textColor};"></label>
      `;
    }

    function toggleHTML() {
      const controlSettings = state.enableProtectionControl;
      const bgColor = state.isEnabled ? controlSettings.backgroundColor : controlSettings.disabledBackgroundColor;
      const textColor = state.isEnabled ? controlSettings.textColor : controlSettings.disabledTextColor;
      const displayText = state.isEnabled ? controlSettings.enabledText : controlSettings.disabledText;
      
      const toggleStyle = `
        background-color: ${bgColor};
        color: ${textColor};
        border-radius: ${controlSettings.borderRadius}px;
        border: ${controlSettings.borderWidth}px solid ${controlSettings.borderColor};
        padding: ${controlSettings.padding};
        font-size: ${controlSettings.fontSize}px;
        transition: ${controlSettings.transition};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 44px;
        position: relative;
      `;
      
      return `
        <div class="T1_toggle ${state.isEnabled ? "T1_enabled" : "T1_disabled"}" 
             role="switch" aria-checked="${state.isEnabled}" tabindex="0"
             style="${toggleStyle}">
          ${controlSettings.showText ? `<span class="T1_toggle-text">${displayText}</span>` : ''}
          <span class="T1_toggle-handle" style="color: ${textColor}"></span>
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
      .T1_shipping-protection{background:${c.useGradient ? `linear-gradient(135deg, ${c.gradientStart}, ${c.gradientEnd})` : c.backgroundColor};border-radius:8px;padding:12px;display:flex;align-items:center;gap:12px;position:relative;transition:.3s}
      .T1_icon-container{width:55px;height:55px;background:${c.iconBackground};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .T1_inner-icon{width:24px;height:24px;background:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center}
      .T1_content{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
      .T1_title{font-weight:500;font-size:14px;color:${c.textColor};margin:0}
      .T1_description{font-weight:400;font-size:12px;color:${c.textColor};margin:0;line-height:1.4}
      .T1_toggle{position:relative;display:inline-flex;height:24px;min-width:44px;align-items:center;border-radius:9999px;cursor:pointer;transition:${state.enableProtectionControl.transition};font-size:${state.enableProtectionControl.fontSize}px}
      .T1_toggle.T1_enabled{background:${state.enableProtectionControl.backgroundColor};color:${state.enableProtectionControl.textColor}}
      .T1_toggle.T1_disabled{background:${state.enableProtectionControl.disabledBackgroundColor};color:${state.enableProtectionControl.disabledTextColor}}
      .T1_toggle-handle{display:inline-block;height:16px;width:16px;transform:translateX(4px);border-radius:50%;background:#fff;transition:transform .3s}
      .T1_toggle.T1_enabled .T1_toggle-handle{transform:translateX(24px)}
      .T1_toggle:focus{outline:2px solid #4f46e5;outline-offset:2px}
      .T1_toggle-text{margin-right:8px;font-weight:500;white-space:nowrap}
      ${state.enableProtectionControl.hoverEffect ? '.T1_toggle:hover{opacity:0.9;transform:scale(1.02)}' : ''}
      ${state.enableProtectionControl.activeEffect ? '.T1_toggle:active{transform:scale(0.98)}' : ''}

      .T1_template2-container,.T1_template3-container{background:${c.useGradient ? `linear-gradient(135deg, ${c.gradientStart}, ${c.gradientEnd})` : c.backgroundColor};border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px}
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
      /* CTA Button styles removed */
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
      .T1_icon-custom{width:${is.size}px;height:${is.size}px;background:${is.background};border:1px solid ${is.borderColor};border-radius:${is.borderRadius}px;color:${is.color};display:flex;align-items:center;justify-content:center;font-size:${is.size * 0.6}px;position:relative;overflow:hidden;transition:all 0.3s ease}
      .T1_icon-uploaded{background:linear-gradient(135deg, ${is.background}, ${getLighterColor(is.background)});box-shadow:0 2px 8px rgba(0,0,0,0.1)}
      .T1_icon-emoji{background:${is.background};transition:transform 0.2s ease}
      .T1_icon-emoji:hover{transform:scale(1.1)}
      .T1_emoji-icon{font-size:${is.size * 0.7}px;line-height:1;display:block}
      .T1_icon-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(45deg, transparent, rgba(255,255,255,0.2));transition:opacity 0.3s ease}
      .T1_icon-uploaded:hover .T1_icon-overlay{opacity:1}
      .T1_icon-fallback{opacity:0.8;border-style:dashed}
      .T1_icon-custom[data-logo-category="security"]{border-color:#10b981}
      .T1_icon-custom[data-logo-category="premium"]{border-color:#8b5cf6}
      .T1_icon-custom[data-logo-category="speed"]{border-color:#f59e0b}
      .T1_icon-custom[data-logo-category="accuracy"]{border-color:#ef4444}
      .T1_icon-custom[data-logo-category="shipping"]{border-color:#3b82f6}
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
            <!-- Confirmation message removed from Template 1 -->
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

          <!-- CTA Button removed -->
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
        // CTA button fields removed
        "bulletPoints",
        "additionalParagraphs",
        "protectionAddedText",
        "protectionMessageTitle",
        "protectionMessageSubtext",
        "checkoutButtonMessage",
        "inlinePoints"
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

    function updateCustomLogos(logoUpdates = {}) {
      Object.keys(logoUpdates).forEach(logoKey => {
        if (customLogos[logoKey]) {
          customLogos[logoKey] = { ...customLogos[logoKey], ...logoUpdates[logoKey] };
        }
      });
      render();
      bindEvents();
    }

    function getCustomLogos() {
      return { ...customLogos };
    }

    function updateEnableProtectionControl(controlSettings = {}) {
      state.enableProtectionControl = { ...state.enableProtectionControl, ...controlSettings };
      render();
      bindEvents();
    }

    function getEnableProtectionControl() {
      return { ...state.enableProtectionControl };
    }

    function uploadCustomLogo(logoKey, file) {
      return new Promise((resolve, reject) => {
        if (!file || !customLogos[logoKey]) {
          reject(new Error('Invalid logo key or file'));
          return;
        }
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          reject(new Error('Invalid file type. Please upload a valid image file.'));
          return;
        }
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          reject(new Error('File size too large. Please upload an image smaller than 5MB.'));
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const originalLogo = { ...customLogos[logoKey] };
          customLogos[logoKey].url = e.target.result;
          customLogos[logoKey].name = file.name.split('.')[0] || customLogos[logoKey].name;
          customLogos[logoKey].uploadedAt = new Date().toISOString();
          customLogos[logoKey].fileSize = file.size;
          customLogos[logoKey].fileType = file.type;
          
          render();
          bindEvents();
          
          resolve({
            logoKey,
            logo: { ...customLogos[logoKey] },
            original: originalLogo,
            success: true
          });
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    }

    function resetCustomLogo(logoKey) {
      if (!customLogos[logoKey]) {
        return { success: false, error: 'Invalid logo key' };
      }
      
      const originalEmoji = CUSTOM_LOGO_MAP[logoKey];
      customLogos[logoKey] = {
        emoji: originalEmoji,
        url: null,
        name: customLogos[logoKey].name,
        category: customLogos[logoKey].category
      };
      
      render();
      bindEvents();
      
      return { success: true, logoKey, logo: { ...customLogos[logoKey] } };
    }

    function bulkUploadLogos(logoFiles) {
      return Promise.allSettled(
        Object.entries(logoFiles).map(([logoKey, file]) => 
          uploadCustomLogo(logoKey, file)
        )
      );
    }

    function exportLogos() {
      const exportData = {
        timestamp: new Date().toISOString(),
        logos: { ...customLogos },
        version: '1.0'
      };
      
      return exportData;
    }

    function importLogos(importData) {
      try {
        if (!importData || !importData.logos) {
          throw new Error('Invalid import data');
        }
        
        Object.keys(importData.logos).forEach(logoKey => {
          if (customLogos[logoKey]) {
            customLogos[logoKey] = { ...customLogos[logoKey], ...importData.logos[logoKey] };
          }
        });
        
        render();
        bindEvents();
        
        return { success: true, imported: Object.keys(importData.logos).length };
      } catch (error) {
        return { success: false, error: error.message };
      }
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
      updateButtonBlock,
      updateCustomLogos,
      getCustomLogos,
      updateEnableProtectionControl,
      getEnableProtectionControl,
      
      // Enhanced logo management
      uploadCustomLogo,
      resetCustomLogo,
      bulkUploadLogos,
      exportLogos,
      importLogos,
      
      // Utility methods
      getAllAvailableLogos: () => Object.keys(customLogos),
      getLogoByKey: (key) => customLogos[key] ? { ...customLogos[key] } : null,
      validateLogoKey: (key) => !!customLogos[key],
      getLogoCategories: () => [...new Set(Object.values(customLogos).map(logo => logo.category))],
      getLogosByCategory: (category) => 
        Object.entries(customLogos)
          .filter(([, logo]) => logo.category === category)
          .reduce((acc, [key, logo]) => ({ ...acc, [key]: logo }), {})
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
      updateCustomLogos(logoUpdates) {
        warnNoInstance("updateCustomLogos", "logoUpdates");
      },
      getCustomLogos() {
        warnNoInstance("getCustomLogos", "");
        return {};
      },
      updateEnableProtectionControl(controlSettings) {
        warnNoInstance("updateEnableProtectionControl", "controlSettings");
      },
      getEnableProtectionControl() {
        warnNoInstance("getEnableProtectionControl", "");
        return {};
      },
      uploadCustomLogo(logoKey, file) {
        warnNoInstance("uploadCustomLogo", "logoKey, file");
        return Promise.reject(new Error('No instance available'));
      },
      resetCustomLogo(logoKey) {
        warnNoInstance("resetCustomLogo", "logoKey");
        return { success: false, error: 'No instance available' };
      },
      bulkUploadLogos(logoFiles) {
        warnNoInstance("bulkUploadLogos", "logoFiles");
        return Promise.reject(new Error('No instance available'));
      },
      exportLogos() {
        warnNoInstance("exportLogos", "");
        return null;
      },
      importLogos(importData) {
        warnNoInstance("importLogos", "importData");
        return { success: false, error: 'No instance available' };
      },
      getAllAvailableLogos() {
        warnNoInstance("getAllAvailableLogos", "");
        return [];
      },
      getLogoByKey(key) {
        warnNoInstance("getLogoByKey", "key");
        return null;
      },
      validateLogoKey(key) {
        warnNoInstance("validateLogoKey", "key");
        return false;
      },
      getLogoCategories() {
        warnNoInstance("getLogoCategories", "");
        return [];
      },
      getLogosByCategory(category) {
        warnNoInstance("getLogosByCategory", "category");
        return {};
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
          "updateButtonBlock",
          "updateCustomLogos",
          "getCustomLogos",
          "updateEnableProtectionControl",
          "getEnableProtectionControl",
          "uploadCustomLogo",
          "resetCustomLogo",
          "bulkUploadLogos",
          "exportLogos",
          "importLogos",
          "getAllAvailableLogos",
          "getLogoByKey",
          "validateLogoKey",
          "getLogoCategories",
          "getLogosByCategory"
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
//     shield: `<svg width="20" height="20" class="T1_icon-shield" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/><path d="M9 12l2 2 4-4"/></svg>`,
//     users: `<svg class="T1_icon-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
//     lightning: `<svg width="20" height="20" class="T1_icon-lightning" viewBox="0 0 24 24"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>`,
//     star: `<svg width="20" height="20" class="T1_icon-star" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>`,
//     check: `<svg width="20" height="20" class="T1_icon-check" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>`
//   };

//   // Custom Logo Collection - 6 dynamic logos that can be controlled
//   const CUSTOM_LOGO_MAP = {
//     "logo1": "🛡️", // Protection Shield
//     "logo2": "✨", // Sparkles
//     "logo3": "🔒", // Security Lock
//     "logo4": "⚡", // Lightning Fast
//     "logo5": "🎯", // Target Precision
//     "logo6": "💎"  // Premium Diamond
//   };

//   // Dynamic logo settings that can be updated via controller
//   let customLogos = {
//     logo1: { emoji: "🛡️", url: null, name: "Protection Shield" },
//     logo2: { emoji: "✨", url: null, name: "Sparkles" },
//     logo3: { emoji: "🔒", url: null, name: "Security Lock" },
//     logo4: { emoji: "⚡", url: null, name: "Lightning Fast" },
//     logo5: { emoji: "🎯", url: null, name: "Target Precision" },
//     logo6: { emoji: "💎", url: null, name: "Premium Diamond" }
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
//       // CTA Button removed per requirements

//       // template 2/3 specific content
//       inlinePoints:
//         options.inlinePoints ||
//         [
//           { text: "Secure Coverage Customers", icon: "shield" },
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
//         useGradient: options.useGradient || false,
//         gradientStart: options.gradientStart || "#DCFCE7",
//         gradientEnd: options.gradientEnd || "#C1F4D9",
//         iconBackground: options.iconBackground || "#C1F4D9",
//         textColor: options.textColor || "#065F46",
//         toggleEnabled: options.toggleEnabled || "#49ae78",
//         toggleDisabled: options.toggleDisabled || "#d1d5db",
//         buttonBg: options.buttonBg || "#065F46",
//         buttonText: options.buttonText || "#ffffff",
//         // CTA Button colors removed
//         badgeBg: options.badgeBg || "#22c55e",
//         badgeText: options.badgeText || "#ffffff"
//       },

//       // selection
//       selectionMode: options.selectionMode || "toggle", // "toggle" | "checkbox" | "button"

//       // Enable Protection toggle control settings
//       enableProtectionControl: {
//         enabled: options.enableProtectionControl?.enabled !== false,
//         backgroundColor: options.enableProtectionControl?.backgroundColor || "#49ae78",
//         textColor: options.enableProtectionControl?.textColor || "#ffffff",
//         disabledBackgroundColor: options.enableProtectionControl?.disabledBackgroundColor || "#d1d5db",
//         disabledTextColor: options.enableProtectionControl?.disabledTextColor || "#6b7280"
//       },

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
//         type: options.iconAsset?.type || "builtin", // "builtin" | "custom" | "logo"
//         name: options.iconAsset?.name || "logo1", // Changed default to logo1
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
      
//       // Use custom logo system
//       const logoKey = state.iconAsset.name || "logo1";
//       const logo = customLogos[logoKey];
      
//       if (logo && logo.url) {
//         // Use uploaded custom logo
//         return `
//           <div class="T1_icon-custom">
//             <img src="${logo.url}" style="width:100%;height:100%;object-fit:contain" alt="${logo.name}"/>
//           </div>`;
//       } else if (logo && logo.emoji) {
//         // Use emoji fallback
//         return `
//           <div class="T1_icon-custom">
//             ${logo.emoji}
//           </div>`;
//       } else {
//         // Default fallback
//         const char = CUSTOM_LOGO_MAP[logoKey] || "🛡️";
//         return `
//           <div class="T1_icon-custom">
//             ${char}
//           </div>`;
//       }
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
//         <label for="T1_protection_checkbox" style="cursor:pointer;margin-left:4px;font-size:12px;color:${state.colors.textColor};"></label>
//       `;
//     }

//     function toggleHTML() {
//       const controlSettings = state.enableProtectionControl;
//       const bgColor = state.isEnabled ? controlSettings.backgroundColor : controlSettings.disabledBackgroundColor;
//       const textColor = state.isEnabled ? controlSettings.textColor : controlSettings.disabledTextColor;
      
//       return `
//         <div class="T1_toggle ${state.isEnabled ? "T1_enabled" : "T1_disabled"}" 
//              role="switch" aria-checked="${state.isEnabled}" tabindex="0"
//              style="background-color: ${bgColor}">
//           <span class="T1_toggle-handle" style="color: ${textColor}"></span>
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
//       .T1_shipping-protection{background:${c.useGradient ? `linear-gradient(135deg, ${c.gradientStart}, ${c.gradientEnd})` : c.backgroundColor};border-radius:8px;padding:12px;display:flex;align-items:center;gap:12px;position:relative;transition:.3s}
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

//       .T1_template2-container,.T1_template3-container{background:${c.useGradient ? `linear-gradient(135deg, ${c.gradientStart}, ${c.gradientEnd})` : c.backgroundColor};border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px}
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
//       /* CTA Button styles removed */
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
//             <!-- Confirmation message removed from Template 1 -->
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
//               <div class="T1_controls-section">
//             ${state.selectionMode === "toggle" ? toggleHTML() : ""}
//             ${state.selectionMode === "checkbox" ? checkboxHTML() : ""}
//             ${state.selectionMode === "button" ? `<a href="${state.ctaButtonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>` : ""}
//           </div>
//           </div>

//           ${inlinePointsHTML()}

        

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

//           <!-- CTA Button removed -->
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
           
//             </div>
            
//             <div class="T1_badge ${showBadge ? "T1_visible" : ""}">${state.badgeText}</div>
            
//                       <div class="T1_controls-section">
//             ${state.selectionMode === "toggle" ? toggleHTML() : ""}
//             ${state.selectionMode === "checkbox" ? checkboxHTML() : ""}
//             ${state.selectionMode === "button" ? `<a href="${state.ctaButtonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>` : ""}
//           </div>
//           </div>
//    <div class="T1_confirmation-message ${state.isEnabled ? "T1_visible" : ""}">${state.confirmationMessage}</div>
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
//         // CTA button fields removed
//         "bulletPoints",
//         "additionalParagraphs",
//         "protectionAddedText",
//         "protectionMessageTitle",
//         "protectionMessageSubtext",
//         "checkoutButtonMessage",
//         "inlinePoints"
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

//     function updateCustomLogos(logoUpdates = {}) {
//       Object.keys(logoUpdates).forEach(logoKey => {
//         if (customLogos[logoKey]) {
//           customLogos[logoKey] = { ...customLogos[logoKey], ...logoUpdates[logoKey] };
//         }
//       });
//       render();
//       bindEvents();
//     }

//     function getCustomLogos() {
//       return { ...customLogos };
//     }

//     function updateEnableProtectionControl(controlSettings = {}) {
//       state.enableProtectionControl = { ...state.enableProtectionControl, ...controlSettings };
//       render();
//       bindEvents();
//     }

//     function getEnableProtectionControl() {
//       return { ...state.enableProtectionControl };
//     }

//     function uploadCustomLogo(logoKey, file) {
//       return new Promise((resolve, reject) => {
//         if (!file || !customLogos[logoKey]) {
//           reject(new Error('Invalid logo key or file'));
//           return;
//         }
        
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           customLogos[logoKey].url = e.target.result;
//           customLogos[logoKey].name = file.name.split('.')[0] || customLogos[logoKey].name;
//           render();
//           bindEvents();
//           resolve(customLogos[logoKey]);
//         };
//         reader.onerror = () => reject(new Error('Failed to read file'));
//         reader.readAsDataURL(file);
//       });
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
//       updateButtonBlock,
//       updateCustomLogos,
//       getCustomLogos,
//       updateEnableProtectionControl,
//       getEnableProtectionControl,
//       uploadCustomLogo
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
//       updateCustomLogos(logoUpdates) {
//         warnNoInstance("updateCustomLogos", "logoUpdates");
//       },
//       getCustomLogos() {
//         warnNoInstance("getCustomLogos", "");
//         return {};
//       },
//       updateEnableProtectionControl(controlSettings) {
//         warnNoInstance("updateEnableProtectionControl", "controlSettings");
//       },
//       getEnableProtectionControl() {
//         warnNoInstance("getEnableProtectionControl", "");
//         return {};
//       },
//       uploadCustomLogo(logoKey, file) {
//         warnNoInstance("uploadCustomLogo", "logoKey, file");
//         return Promise.reject(new Error('No instance available'));
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
//           "updateButtonBlock",
//           "updateCustomLogos",
//           "getCustomLogos",
//           "updateEnableProtectionControl",
//           "getEnableProtectionControl",
//           "uploadCustomLogo"
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
