class Template1 {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.isEnabled = options.isEnabled !== false;
        this.protectionPrice = options.protectionPrice || 0;
        this.onToggle = options.onToggle || (() => { });
        
        // Content settings
        this.title = options.title || "Shipping protection";
        this.description = options.description || "100% guarantee & protect your order from damage, loss, or theft";
        
        // Color settings
        this.colors = {
            backgroundColor: options.backgroundColor || "#DCFCE7",
            iconBackground: options.iconBackground || "#C1F4D9",
            textColor: options.textColor || "#065F46",
            toggleEnabled: options.toggleEnabled || "#49ae78",
            toggleDisabled: options.toggleDisabled || "#d1d5db"
        };

        // Add selection mode settings
this.selectionMode = options.selectionMode || "toggle"; // "toggle", "checkbox", "button"

// Add logo settings
this.logoSettings = {
    logoUrl: options.logoSettings?.logoUrl || "",
    alt: options.logoSettings?.alt || "Brand Logo",
    maxWidth: options.logoSettings?.maxWidth || 160,
    maxHeight: options.logoSettings?.maxHeight || 48
};

// Add icon asset settings
this.iconAsset = {
    type: options.iconAsset?.type || "builtin", // "builtin" or "custom"
    name: options.iconAsset?.name || "shield-check",
    url: options.iconAsset?.url || null
};

// Add icon style settings
this.iconStyle = {
    size: options.iconStyle?.size || 24,
    color: options.iconStyle?.color || "#111111",
    background: options.iconStyle?.background || "#F5F5F5",
    borderColor: options.iconStyle?.borderColor || "#E5E7EB",
    borderRadius: options.iconStyle?.borderRadius || 9999
};

// Add button block settings
this.buttonBlock = {
    buttonLabel: options.buttonBlock?.buttonLabel || "Enable Protection",
    buttonHref: options.buttonBlock?.buttonHref || "https://example.com/cta",
    paragraph: options.buttonBlock?.paragraph || "One-line supporting text below the button."
};

        this.init();
    }

    init() {
        if (!this.container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }

        this.injectStyles();
        this.render();
        this.bindEvents();
    }

    injectStyles() {
        // Remove existing styles first
        const existingStyle = document.getElementById('T1_template-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'T1_template-styles';
        style.textContent = `
      .T1_shipping-protection {
        background-color: ${this.colors.backgroundColor};
        border-radius: 4px;
        padding: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .T1_icon-container {
        width: 55px;
        height: 55px;
        background-color: ${this.colors.iconBackground};
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .T1_inner-icon {
        width: 24px;
        height: 24px;
        background-color: white;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .T1_content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      
      .T1_title {
        font-weight: 500;
        font-size: 14px;
        color: ${this.colors.textColor};
        margin: 0;
      }
      
      .T1_description {
        font-weight: 400;
        font-size: 12px;
        color: ${this.colors.textColor};
        margin: 0;
      }
      
      .T1_toggle {
        position: relative;
        display: inline-flex;
        height: 24px;
        width: 44px;
        align-items: center;
        border-radius: 9999px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      
      .T1_toggle.T1_enabled {
        background-color: ${this.colors.toggleEnabled};
      }
      
      .T1_toggle.T1_disabled {
        background-color: ${this.colors.toggleDisabled};
      }
      
      .T1_toggle-handle {
        display: inline-block;
        height: 16px;
        width: 16px;
        transform: translateX(4px);
        border-radius: 50%;
        background-color: white;
        transition: transform 0.3s;
      }
      
      .T1_toggle.T1_enabled .T1_toggle-handle {
        transform: translateX(24px);
      }
      
      .T1_toggle:focus {
        outline: 2px solid #4f46e5;
        outline-offset: 2px;
      }



      // Add to the existing CSS styles
.T1_button-mode {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    padding: 12px;
    border-radius: 4px;
    background-color: ${this.colors.backgroundColor};
}

.T1_protection-button {
    background-color: ${this.colors.buttonBg || '#065F46'};
    color: ${this.colors.buttonText || '#ffffff'};
    border: none;
    border-radius: 6px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
    display: inline-block;
}

.T1_protection-button:hover {
    opacity: 0.9;
}

.T1_button-description {
    font-size: 12px;
    color: ${this.colors.textColor};
    margin: 0;
    text-align: center;
    line-height: 1.4;
}

.T1_checkbox {
    width: 20px;
    height: 20px;
    accent-color: ${this.colors.toggleEnabled};
    cursor: pointer;
}

.T1_logo-container {
    max-width: ${this.logoSettings.maxWidth}px;
    max-height: ${this.logoSettings.maxHeight}px;
    overflow: hidden;
}

.T1_logo-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.T1_icon-custom {
    width: ${this.iconStyle.size}px;
    height: ${this.iconStyle.size}px;
    background-color: ${this.iconStyle.background};
    border: 1px solid ${this.iconStyle.borderColor};
    border-radius: ${this.iconStyle.borderRadius}px;
    color: ${this.iconStyle.color};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${this.iconStyle.size * 0.6}px;
}
    `;

        document.head.appendChild(style);
    }

render() {
    if (this.selectionMode === "button") {
        this.renderButtonMode();
    } else {
        this.renderFullTemplate();
    }
}

renderButtonMode() {
    this.container.innerHTML = `
        <div class="T1_button-mode">
            ${this.logoSettings.logoUrl ? `
                <div class="T1_logo-container">
                    <img src="${this.logoSettings.logoUrl}" alt="${this.logoSettings.alt}" />
                </div>
            ` : ''}
            <a href="${this.buttonBlock.buttonHref}" class="T1_protection-button">
                ${this.buttonBlock.buttonLabel}
            </a>
            <p class="T1_button-description">${this.buttonBlock.paragraph}</p>
        </div>
    `;
}

renderFullTemplate() {
    const logoHtml = this.logoSettings.logoUrl ? `
        <div class="T1_logo-container" style="margin-right: 8px;">
            <img src="${this.logoSettings.logoUrl}" alt="${this.logoSettings.alt}" />
        </div>
    ` : '';
    
    const iconHtml = this.getIconHtml();
    const controlHtml = this.selectionMode === "checkbox" ? this.getCheckboxHtml() : this.getToggleHtml();
    
    this.container.innerHTML = `
        <div class="T1_shipping-protection">
            ${logoHtml}
            <div class="T1_icon-container">
                ${iconHtml}
            </div>
            <div class="T1_content">
                <p class="T1_title">${this.title} ($${this.protectionPrice.toFixed(2)})</p>
                <p class="T1_description">${this.description}</p>
            </div>
            ${controlHtml}
        </div>
    `;
}

getIconHtml() {
    if (this.iconAsset.type === "custom" && this.iconAsset.url) {
        return `
            <div class="T1_icon-custom">
                <img src="${this.iconAsset.url}" style="width: 100%; height: 100%; object-fit: contain;" alt="Custom icon" />
            </div>
        `;
    }
    
    // Built-in icons mapping
    const iconMap = {
        'shield-check': '🛡️',
        'sparkles': '✨',
        'lock': '🔒',
        'lightning': '⚡',
        'target': '🎯',
        'diamond': '💎',
        'rocket': '🚀',
        'package': '📦'
    };
    
    const iconChar = iconMap[this.iconAsset.name] || '🛡️';
    
    return `
        <div class="T1_icon-custom">
            ${iconChar}
        </div>
    `;
}

getCheckboxHtml() {
    return `
        <input 
            type="checkbox" 
            class="T1_checkbox" 
            ${this.isEnabled ? 'checked' : ''}
            id="T1_protection_checkbox"
        />
        <label for="T1_protection_checkbox" style="cursor: pointer;"></label>
    `;
}

getToggleHtml() {
    return `
        <div 
            class="T1_toggle ${this.isEnabled ? 'T1_enabled' : 'T1_disabled'}" 
            role="switch" 
            aria-checked="${this.isEnabled}"
            tabindex="0"
        >
            <span class="T1_toggle-handle"></span>
        </div>
    `;
}

    bindEvents() {
    if (this.selectionMode === "button") {
        const button = this.container.querySelector('.T1_protection-button');
        if (button) {
            button.addEventListener('click', (e) => {
                if (this.buttonBlock.buttonHref === "#" || this.buttonBlock.buttonHref.includes('example.com')) {
                    e.preventDefault();
                    this.isEnabled = !this.isEnabled;
                    this.onToggle(this.isEnabled);
                }
            });
        }
    } else if (this.selectionMode === "checkbox") {
        const checkbox = this.container.querySelector('.T1_checkbox');
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                this.isEnabled = e.target.checked;
                this.onToggle(this.isEnabled);
            });
        }
    } else {
        // Original toggle logic
        const toggle = this.container.querySelector('.T1_toggle');
        if (!toggle) return;

        const handleToggle = () => {
            this.isEnabled = !this.isEnabled;
            this.updateToggle();
            this.onToggle(this.isEnabled);
        };

        toggle.addEventListener('click', handleToggle);
        toggle.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleToggle();
            }
        });
    }
}

    updateToggle() {
        const toggle = this.container.querySelector('.T1_toggle');
        if (!toggle) return;

        if (this.isEnabled) {
            toggle.classList.add('T1_enabled');
            toggle.classList.remove('T1_disabled');
        } else {
            toggle.classList.add('T1_disabled');
            toggle.classList.remove('T1_enabled');
        }

        toggle.setAttribute('aria-checked', this.isEnabled);
    }

    updatePrice(price) {
        this.protectionPrice = price;
        const titleElement = this.container.querySelector('.T1_title');
        if (titleElement) {
            titleElement.textContent = `${this.title} ($${price.toFixed(2)})`;
        }
    }

    updateEnabled(enabled) {
        this.isEnabled = enabled;
        this.updateToggle();
    }

    getEnabled() {
        return this.isEnabled;
    }

    updateContentSettings(settings) {
        if (settings.title !== undefined) {
            this.title = settings.title;
        }
        if (settings.description !== undefined) {
            this.description = settings.description;
        }
        if (settings.protectionPrice !== undefined) {
            this.protectionPrice = settings.protectionPrice;
        }
        if (settings.isEnabled !== undefined) {
            this.isEnabled = settings.isEnabled;
        }
        
        // Re-render the component with new content
        this.render();
        this.bindEvents();
    }

    updateColorSettings(colors) {
        // Update color properties
        Object.keys(colors).forEach(key => {
            if (this.colors.hasOwnProperty(key)) {
                this.colors[key] = colors[key];
            }
        });
        
        // Re-inject styles with new colors
        this.injectStyles();
    }

    updateSelectionMode(settings) {
    if (settings.mode !== undefined) {
        this.selectionMode = settings.mode;
    }
    this.render();
    this.bindEvents();
}

updateLogoSettings(logoSettings) {
    this.logoSettings = { ...this.logoSettings, ...logoSettings };
    this.render();
    this.bindEvents();
}

updateIconAsset(iconAsset) {
    this.iconAsset = { ...this.iconAsset, ...iconAsset };
    this.render();
    this.bindEvents();
}

updateIconStyle(iconStyle) {
    this.iconStyle = { ...this.iconStyle, ...iconStyle };
    this.injectStyles();
    this.render();
    this.bindEvents();
}

updateButtonBlock(buttonBlock) {
    this.buttonBlock = { ...this.buttonBlock, ...buttonBlock };
    this.render();
    this.bindEvents();
}

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        // Remove styles when destroying
        const style = document.getElementById('T1_template-styles');
        if (style) {
            style.remove();
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Template1;
} else {
    window.Template1 = Template1;
    
    // Create a global proxy for console access with a default instance
   window.Template1.proxy = {
    updateContentSettings: function(settings) {
        console.warn('No Template1 instance found. Please create an instance first or use an existing instance.');
        console.info('Example: const template = new Template1("your-container-id"); template.updateContentSettings(settings);');
    },
    updateColorSettings: function(colors) {
        console.warn('No Template1 instance found. Please create an instance first or use an existing instance.');
        console.info('Example: const template = new Template1("your-container-id"); template.updateColorSettings(colors);');
    },
    updateSelectionMode: function(settings) {
        console.warn('No Template1 instance found. Please create an instance first or use an existing instance.');
    },
    updateLogoSettings: function(logoSettings) {
        console.warn('No Template1 instance found. Please create an instance first or use an existing instance.');
    },
    updateIconAsset: function(iconAsset) {
        console.warn('No Template1 instance found. Please create an instance first or use an existing instance.');
    },
    updateIconStyle: function(iconStyle) {
        console.warn('No Template1 instance found. Please create an instance first or use an existing instance.');
    },
    updateButtonBlock: function(buttonBlock) {
        console.warn('No Template1 instance found. Please create an instance first or use an existing instance.');
    },
    getInstance: function(containerId) {
        const container = document.getElementById(containerId);
        if (container && container._template1Instance) {
            return container._template1Instance;
        }
        return null;
    },
    setActiveInstance: function(instance) {
        if (instance instanceof Template1) {
            this.updateContentSettings = instance.updateContentSettings.bind(instance);
            this.updateColorSettings = instance.updateColorSettings.bind(instance);
            this.updateSelectionMode = instance.updateSelectionMode.bind(instance);
            this.updateLogoSettings = instance.updateLogoSettings.bind(instance);
            this.updateIconAsset = instance.updateIconAsset.bind(instance);
            this.updateIconStyle = instance.updateIconStyle.bind(instance);
            this.updateButtonBlock = instance.updateButtonBlock.bind(instance);
            console.info('Active Template1 instance set for proxy access.');
        }
    }
};
}




// class Template1 {
//     constructor(containerId, options = {}) {
//         this.containerId = containerId;
//         this.container = document.getElementById(containerId);
//         this.isEnabled = options.isEnabled !== false;
//         this.protectionPrice = options.protectionPrice || 0;
//         this.onToggle = options.onToggle || (() => { });
        
//         // Content settings
//         this.title = options.title || "Shipping protection";
//         this.description = options.description || "100% guarantee & protect your order from damage, loss, or theft";
        
//         // Color settings
//         this.colors = {
//             backgroundColor: options.backgroundColor || "#DCFCE7",
//             iconBackground: options.iconBackground || "#C1F4D9",
//             textColor: options.textColor || "#065F46",
//             toggleEnabled: options.toggleEnabled || "#49ae78",
//             toggleDisabled: options.toggleDisabled || "#d1d5db"
//         };

//         this.init();
//     }

//     init() {
//         if (!this.container) {
//             console.error(`Container with ID ${this.containerId} not found`);
//             return;
//         }

//         this.injectStyles();
//         this.render();
//         this.bindEvents();
//     }

//     injectStyles() {
//         // Remove existing styles first
//         const existingStyle = document.getElementById('T1_template-styles');
//         if (existingStyle) {
//             existingStyle.remove();
//         }

//         const style = document.createElement('style');
//         style.id = 'T1_template-styles';
//         style.textContent = `
//       .T1_shipping-protection {
//         background-color: ${this.colors.backgroundColor};
//         border-radius: 4px;
//         padding: 8px;
//         display: flex;
//         align-items: center;
//         gap: 12px;
//       }
      
//       .T1_icon-container {
//         width: 55px;
//         height: 55px;
//         background-color: ${this.colors.iconBackground};
//         border-radius: 8px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         flex-shrink: 0;
//       }
      
//       .T1_inner-icon {
//         width: 24px;
//         height: 24px;
//         background-color: white;
//         border-radius: 4px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//       }
      
//       .T1_content {
//         flex: 1;
//         min-width: 0;
//         display: flex;
//         flex-direction: column;
//         gap: 2px;
//       }
      
//       .T1_title {
//         font-weight: 500;
//         font-size: 14px;
//         color: ${this.colors.textColor};
//         margin: 0;
//       }
      
//       .T1_description {
//         font-weight: 400;
//         font-size: 12px;
//         color: ${this.colors.textColor};
//         margin: 0;
//       }
      
//       .T1_toggle {
//         position: relative;
//         display: inline-flex;
//         height: 24px;
//         width: 44px;
//         align-items: center;
//         border-radius: 9999px;
//         cursor: pointer;
//         transition: background-color 0.3s;
//       }
      
//       .T1_toggle.T1_enabled {
//         background-color: ${this.colors.toggleEnabled};
//       }
      
//       .T1_toggle.T1_disabled {
//         background-color: ${this.colors.toggleDisabled};
//       }
      
//       .T1_toggle-handle {
//         display: inline-block;
//         height: 16px;
//         width: 16px;
//         transform: translateX(4px);
//         border-radius: 50%;
//         background-color: white;
//         transition: transform 0.3s;
//       }
      
//       .T1_toggle.T1_enabled .T1_toggle-handle {
//         transform: translateX(24px);
//       }
      
//       .T1_toggle:focus {
//         outline: 2px solid #4f46e5;
//         outline-offset: 2px;
//       }
//     `;

//         document.head.appendChild(style);
//     }

//     render() {
//         this.container.innerHTML = `
//       <div class="T1_shipping-protection">
//         <div class="T1_icon-container">
//           <div class="T1_inner-icon">
//             <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//               <path
//                 d="M6 1L10 3V7C10 9 8 11 6 11C4 11 2 9 2 7V3L6 1Z"
//                 fill="#22c55e"
//                 stroke="#22c55e"
//                 stroke-width="0.5"
//               />
//               <path
//                 d="M4.5 6L5.5 7L7.5 5"
//                 stroke="white"
//                 stroke-width="1.5"
//                 fill="none"
//                 stroke-linecap="round"
//               />
//             </svg>
//           </div>
//         </div>
        
//         <div class="T1_content">
//           <p class="T1_title">${this.title} ($${this.protectionPrice.toFixed(2)})</p>
//           <p class="T1_description">${this.description}</p>
//         </div>
        
//         <div 
//           class="T1_toggle ${this.isEnabled ? 'T1_enabled' : 'T1_disabled'}" 
//           role="switch" 
//           aria-checked="${this.isEnabled}"
//           tabindex="0"
//         >
//           <span class="T1_toggle-handle"></span>
//         </div>
//       </div>
//     `;
//     }

//     bindEvents() {
//         const toggle = this.container.querySelector('.T1_toggle');
//         if (!toggle) return;

//         const handleToggle = () => {
//             this.isEnabled = !this.isEnabled;
//             this.updateToggle();
//             this.onToggle(this.isEnabled);
//         };

//         toggle.addEventListener('click', handleToggle);
//         toggle.addEventListener('keydown', (e) => {
//             if (e.key === ' ' || e.key === 'Enter') {
//                 e.preventDefault();
//                 handleToggle();
//             }
//         });
//     }

//     updateToggle() {
//         const toggle = this.container.querySelector('.T1_toggle');
//         if (!toggle) return;

//         if (this.isEnabled) {
//             toggle.classList.add('T1_enabled');
//             toggle.classList.remove('T1_disabled');
//         } else {
//             toggle.classList.add('T1_disabled');
//             toggle.classList.remove('T1_enabled');
//         }

//         toggle.setAttribute('aria-checked', this.isEnabled);
//     }

//     updatePrice(price) {
//         this.protectionPrice = price;
//         const titleElement = this.container.querySelector('.T1_title');
//         if (titleElement) {
//             titleElement.textContent = `${this.title} ($${price.toFixed(2)})`;
//         }
//     }

//     updateEnabled(enabled) {
//         this.isEnabled = enabled;
//         this.updateToggle();
//     }

//     getEnabled() {
//         return this.isEnabled;
//     }

//     updateContentSettings(settings) {
//         if (settings.title !== undefined) {
//             this.title = settings.title;
//         }
//         if (settings.description !== undefined) {
//             this.description = settings.description;
//         }
//         if (settings.protectionPrice !== undefined) {
//             this.protectionPrice = settings.protectionPrice;
//         }
//         if (settings.isEnabled !== undefined) {
//             this.isEnabled = settings.isEnabled;
//         }
        
//         // Re-render the component with new content
//         this.render();
//         this.bindEvents();
//     }

//     updateColorSettings(colors) {
//         // Update color properties
//         Object.keys(colors).forEach(key => {
//             if (this.colors.hasOwnProperty(key)) {
//                 this.colors[key] = colors[key];
//             }
//         });
        
//         // Re-inject styles with new colors
//         this.injectStyles();
//     }

//     destroy() {
//         if (this.container) {
//             this.container.innerHTML = '';
//         }
//         // Remove styles when destroying
//         const style = document.getElementById('T1_template-styles');
//         if (style) {
//             style.remove();
//         }
//     }
// }

// // Export for use in other files
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = Template1;
// } else {
//     window.Template1 = Template1;
    
//     // Create a global proxy for console access with a default instance
//     window.Template1.proxy = {
//         updateContentSettings: function(settings) {
//             console.warn('No Template1 instance found. Please create an instance first or use an existing instance.');
//             console.info('Example: const template = new Template1("your-container-id"); template.updateContentSettings(settings);');
//         },
//         updateColorSettings: function(colors) {
//             console.warn('No Template1 instance found. Please create an instance first or use an existing instance.');
//             console.info('Example: const template = new Template1("your-container-id"); template.updateColorSettings(colors);');
//         },
//         getInstance: function(containerId) {
//             // Try to find existing instance by container ID
//             const container = document.getElementById(containerId);
//             if (container && container._template1Instance) {
//                 return container._template1Instance;
//             }
//             return null;
//         },
//         setActiveInstance: function(instance) {
//             if (instance instanceof Template1) {
//                 this.updateContentSettings = instance.updateContentSettings.bind(instance);
//                 this.updateColorSettings = instance.updateColorSettings.bind(instance);
//                 console.info('Active Template1 instance set for proxy access.');
//             }
//         }
//     };
// }
