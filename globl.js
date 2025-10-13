(function (global) {
  "use strict";
  
  // Auto-initialization function
  function autoInitializeTemplates() {
    // Look for containers with specific class or data attribute
    const containers = document.querySelectorAll('.template-widget, [data-template-widget]');
    
    containers.forEach(container => {
      if (container._templateInitialized) return;
      
      const containerId = container.id || `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      if (!container.id) container.id = containerId;

      // Get configuration from data attributes
      const config = {
        activeTemplate: container.dataset.template || "Template1",
        isEnabled: container.dataset.enabled !== "false",
        protectionPrice: parseFloat(container.dataset.price) || 12.11,
        title: container.dataset.title || "Shipping Protection",
        description: container.dataset.description || "100% guarantee & protect your order from damage, loss, or theft",
        selectionMode: container.dataset.mode || "toggle"
      };

      // Parse colors from data attributes
      if (container.dataset.colors) {
        try {
          config.colors = JSON.parse(container.dataset.colors);
        } catch (e) {
          console.warn('Invalid colors JSON in data-colors attribute');
        }
      }

      // Initialize template
      try {
        const instance = new Template(containerId, config);
        container._templateInitialized = true;
        container._templateInstance = instance;
      } catch (error) {
        console.error('Failed to initialize template:', error);
      }
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitializeTemplates);
  } else {
    autoInitializeTemplates();
  }

  // Watch for dynamically added containers
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      let shouldInit = false;
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.classList.contains('template-widget') || 
                node.hasAttribute('data-template-widget') ||
                node.querySelector('.template-widget, [data-template-widget]')) {
              shouldInit = true;
            }
          }
        });
      });
      if (shouldInit) {
        setTimeout(autoInitializeTemplates, 100);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Self-contained color utility functions
  const colorUtils = {
    adjustColor: function (hex, amount = 0.2) {
      if (!hex || typeof hex !== "string") return "#333333";
      try {
        let color = hex.replace("#", "");
        if (color.length === 3) {
          color = color.split("").map(char => char + char).join("");
        }
        if (color.length !== 6) return "#333333";
        const num = parseInt(color, 16);
        const amt = Math.round(255 * amount);
        const R = Math.max(0, Math.min(255, (num >> 16) + amt));
        const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
        const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
        return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
      } catch (e) {
        return "#333333";
      }
    },
    getDarkerColor: function (hex, amount = 0.2) {
      if (!hex || typeof hex !== "string") return "#333333";
      try {
        let color = hex.replace("#", "");
        if (color.length === 3) {
          color = color.split("").map(char => char + char).join("");
        }
        if (color.length !== 6) return "#333333";
        const num = parseInt(color, 16);
        const amt = Math.round(255 * amount);
        const R = Math.max(0, Math.min(255, (num >> 16) - amt));
        const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) - amt));
        const B = Math.max(0, Math.min(255, (num & 0x0000FF) - amt));
        return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
      } catch (e) {
        return "#333333";
      }
    },
    getLighterColor: function (hex, amount = 0.2) {
      if (!hex || typeof hex !== "string") return "#cccccc";
      try {
        let color = hex.replace("#", "");
        if (color.length === 3) {
          color = color.split("").map(char => char + char).join("");
        }
        if (color.length !== 6) return "#cccccc";
        const num = parseInt(color, 16);
        const amt = Math.round(255 * amount);
        const R = Math.max(0, Math.min(255, (num >> 16) + amt));
        const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
        const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
        return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
      } catch (e) {
        return "#cccccc";
      }
    },
    hexToRgbaString: function (hex, alpha = 1) {
      if (!hex || typeof hex !== "string") return "rgba(0,0,0,1)";
      try {
        let color = hex.replace("#", "");
        if (color.length === 3) {
          color = color.split("").map(char => char + char).join("");
        }
        if (color.length !== 6) return "rgba(0,0,0,1)";
        const r = parseInt(color.slice(0, 2), 16);
        const g = parseInt(color.slice(2, 4), 16);
        const b = parseInt(color.slice(4, 6), 16);
        return `rgba(${r},${g},${b},${alpha})`;
      } catch (e) {
        return "rgba(0,0,0,1)";
      }
    }
  };

  const { adjustColor, getDarkerColor, getLighterColor, hexToRgbaString } = colorUtils;
  
  const d = (sel, root = document) => root.querySelector(sel);
  const da = (sel, root = document) => root.querySelectorAll(sel);

  // ... (rest of your existing code remains exactly the same)
  // SVG definitions, CUSTOM_LOGO_MAP, customLogos, Template function, etc.
  // ALL YOUR ORIGINAL CODE GOES HERE WITHOUT ANY CHANGES

  // Export to global scope
  global.Template = Template;

})(window);
