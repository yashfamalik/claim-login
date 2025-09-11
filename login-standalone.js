// (function (global) {
//   function injectStyleOnce() {
//     if (document.getElementById("cf-login-style")) return;
//     const css = `
//     :root{
//     --claim-card-bg:#ffffff;
//     --claim-card-gradient-start:#2196f3;
//     --claim-card-gradient-end:#00bcd4;
//     --claim-use-gradient:false;
//     --claim-button-bg:#303030;
//     --claim-button-text:#ffffff;
//     --claim-heading-text:#202223;
//     }
//     .cf-outer{display:flex;align-items:center;justify-content:center;min-height:80vh;width:100%}
//     .cf-inner{flex:1 1 auto}
//     .cf-container{background-color:var(--claim-card-bg);border-radius:12px;border:1px solid rgba(0,0,0,.08);margin-block-start:1rem;box-shadow:0 1px 2px rgba(0,0,0,.05);padding:1rem}
//     .cf-container.cf-gradient{background:linear-gradient(90deg,var(--claim-card-gradient-start),var(--claim-card-gradient-end))}
//     .cf-stack{display:flex;flex-direction:column;row-gap:.75rem}
//     .cf-heading{font-size:1.25rem;font-weight:600;color:var(--claim-heading-text)}
//     .cf-fields label{display:block;margin-bottom:.25rem;color:var(--claim-heading-text)}
//     .cf-input{width:100%;padding:.5rem .75rem;border:1px solid #d1d5db;border-radius:.375rem;background:#fff;color:#111827}
//     .cf-input:focus{outline:none;border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.35)}
//     .cf-error{display:none;border-radius:.375rem;padding:.75rem;background:#fdecea;color:#5f2120;border:1px solid #f5c2c0}
//     .cf-error.is-visible{display:flex;align-items:center;column-gap:.5rem}
//     .cf-button{width:100%;padding:.5rem 1rem;border:none;border-radius:.5rem;background:var(--claim-button-bg)!important;color:var(--claim-button-text)!important;cursor:pointer;transition:background-color .15s ease,opacity .15s ease;box-shadow:inset 0 -4px 8px rgba(0,0,0,.25)}
//     .cf-button:hover{background:var(--claim-button-bg)!important;opacity:.9}
//     .cf-button:active{opacity:.85}
//     `;
//     const style = document.createElement("style");
//     style.id = "cf-login-style";
//     style.appendChild(document.createTextNode(css));
//     document.head.appendChild(style);
//   }

//   function getProxy() {
//     if (typeof window !== "undefined" && window.ClaimFormProxy)
//       return window.ClaimFormProxy;
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
//         this.contentSettings =
//           typeof next === "function" ? next(this.contentSettings) : next;
//         subs.forEach((cb) =>
//           cb({
//             contentSettings: this.contentSettings,
//             colorSettings: this.colorSettings,
//           })
//         );
//       },
//       updateColorSettings(next) {
//         this.colorSettings =
//           typeof next === "function" ? next(this.colorSettings) : next;
//         subs.forEach((cb) =>
//           cb({
//             contentSettings: this.contentSettings,
//             colorSettings: this.colorSettings,
//           })
//         );
//       },
//     };
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
//     const card = createElement("div", { className: "cf-card" });
//     const container = createElement("div", {
//       className: `cf-container ${
//         initialColors?.useGradient ? "cf-gradient" : ""
//       }`,
//     });

//     // Apply initial color variables if provided
//     if (initialColors) {
//       const root = document.documentElement;
//       if (initialColors.cardBg)
//         root.style.setProperty("--claim-card-bg", initialColors.cardBg);
//       if (initialColors.gradientStart)
//         root.style.setProperty(
//           "--claim-card-gradient-start",
//           initialColors.gradientStart
//         );
//       if (initialColors.gradientEnd)
//         root.style.setProperty(
//           "--claim-card-gradient-end",
//           initialColors.gradientEnd
//         );
//       if (initialColors.buttonBg)
//         root.style.setProperty("--claim-button-bg", initialColors.buttonBg);
//       if (initialColors.buttonText)
//         root.style.setProperty(
//           "--claim-button-text",
//           initialColors.buttonText
//         );
//       if (initialColors.headingText)
//         root.style.setProperty(
//           "--claim-heading-text",
//           initialColors.headingText
//         );
//     }

//     const heading = createElement("p", {
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

//     function handleSubmit() {
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
//     card.appendChild(container);
//     inner.appendChild(card);
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

//   const api = { mount, getProxy };
//   if (typeof module !== "undefined" && module.exports) {
//     module.exports = api;
//   } else if (typeof define === "function" && define.amd) {
//     define(() => api);
//   } else {
//     global.ClaimLogin = api;
//   }
// })(typeof window !== "undefined" ? window : globalThis);




// (function (global) {
//   function injectStyleOnce() {
//     if (document.getElementById("cf-login-style")) return;
//     const css = `
// :root{
//   --claim-card-bg:#ffffff;
//   --claim-card-gradient-start:#2196f3;
//   --claim-card-gradient-end:#00bcd4;
//   --claim-use-gradient:false;
//   --claim-button-bg:#303030;
//   --claim-button-text:#ffffff;
//   --claim-heading-text:#202223;
// }
// .cf-outer{display:flex;align-items:center;justify-content:center;min-height:80vh;width:100%}
// .cf-inner{flex:1 1 auto}
// .cf-container{background-color:var(--claim-card-bg);border-radius:12px;border:1px solid rgba(0,0,0,.08);margin-block-start:1rem;box-shadow:0 1px 2px rgba(0,0,0,.05);padding:1rem}
// .cf-container.cf-gradient{background:linear-gradient(90deg,var(--claim-card-gradient-start),var(--claim-card-gradient-end))}
// .cf-stack{display:flex;flex-direction:column;row-gap:.75rem}
// .cf-heading{font-size:1.25rem;font-weight:600;color:var(--claim-heading-text)}
// .cf-fields label{display:block;margin-bottom:.25rem;color:var(--claim-heading-text)}
// .cf-input{width:100%;padding:.5rem .75rem;border:1px solid #d1d5db;border-radius:.375rem;background:#fff;color:#111827}
// .cf-input:focus{outline:none;border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.35)}
// .cf-error{display:none;border-radius:.375rem;padding:.75rem;background:#fdecea;color:#5f2120;border:1px solid #f5c2c0}
// .cf-error.is-visible{display:flex;align-items:center;column-gap:.5rem}
// .cf-button{width:100%;padding:.5rem 1rem;border:none;border-radius:.5rem;background:var(--claim-button-bg)!important;color:var(--claim-button-text)!important;cursor:pointer;transition:background-color .15s ease,opacity .15s ease;box-shadow:inset 0 -4px 8px rgba(0,0,0,.25)}
// .cf-button:hover{background:var(--claim-button-bg)!important;opacity:.9}
// .cf-button:active{opacity:.85}
// `;
//     const style = document.createElement("style");
//     style.id = "cf-login-style";
//     style.appendChild(document.createTextNode(css));
//     document.head.appendChild(style);
//   }

//   function getProxy() {
//     if (typeof window !== "undefined" && window.ClaimFormProxy) return window.ClaimFormProxy;
//     const subs = new Set();
//     const store = {
//       contentSettings: null,
//       colorSettings: null,
//       subscribe(cb) { subs.add(cb); return () => subs.delete(cb); },
//       getContentSettings() { return this.contentSettings; },
//       getColorSettings() { return this.colorSettings; },
//       updateContentSettings(next) {
//         this.contentSettings = typeof next === "function" ? next(this.contentSettings) : next;
//         subs.forEach(cb => cb({ contentSettings: this.contentSettings, colorSettings: this.colorSettings }));
//       },
//       updateColorSettings(next) {
//         this.colorSettings = typeof next === "function" ? next(this.colorSettings) : next;
//         subs.forEach(cb => cb({ contentSettings: this.contentSettings, colorSettings: this.colorSettings }));
//       }
//     };
//     return store;
//   }

//   function createElement(tag, options = {}) {
//     const element = document.createElement(tag);
//     if (options.className) element.className = options.className;
//     if (options.text) element.textContent = options.text;
//     if (options.html) element.innerHTML = options.html;
//     if (options.attrs) {
//       Object.entries(options.attrs).forEach(([k, v]) => { if (v != null) element.setAttribute(k, v); });
//     }
//     if (options.styles) {
//       Object.entries(options.styles).forEach(([k, v]) => { element.style[k] = v; });
//     }
//     return element;
//   }

//   function buildLoginForm(options = {}) {
//     const { onSuccess, contentSettings, colorSettings } = options;
//     const proxy = getProxy();

//     const initialContent = contentSettings ?? (proxy.getContentSettings ? proxy.getContentSettings() : null);
//     const initialColors = colorSettings ?? (proxy.getColorSettings ? proxy.getColorSettings() : null);

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
//     const card = createElement("div", { className: "cf-card" });
//     const container = createElement("div", {
//       className: `cf-container ${initialColors?.useGradient ? "cf-gradient" : ""}`,
//     });

//     const heading = createElement("p", { className: "cf-heading", text: content.heading });

//     const emailLabel = createElement("label", { text: content.emailLabel });
//     const emailInput = createElement("input", {
//       attrs: { type: "email", autocomplete: "email", placeholder: content.emailPlaceholder },
//       className: "cf-input",
//     });

//     const orderLabel = createElement("label", { text: content.orderNumberLabel });
//     const orderInput = createElement("input", {
//       attrs: { type: "text", autocomplete: "off", placeholder: content.orderNumberPlaceholder },
//       className: "cf-input",
//     });

//     const errorBanner = createElement("div", { className: "cf-error" });
//     const errorText = createElement("span", { text: content.errorMessage });
//     errorBanner.appendChild(errorText);

//     const button = createElement("button", { className: "cf-button" });
//     const buttonText = createElement("span", { text: content.buttonText });
//     button.appendChild(buttonText);

//     function handleSubmit() {
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
//     card.appendChild(container);
//     inner.appendChild(card);
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
//           if (colorSettings.cardBg) root.style.setProperty("--claim-card-bg", colorSettings.cardBg);
//           if (colorSettings.gradientStart) root.style.setProperty("--claim-card-gradient-start", colorSettings.gradientStart);
//           if (colorSettings.gradientEnd) root.style.setProperty("--claim-card-gradient-end", colorSettings.gradientEnd);
//           if (colorSettings.buttonBg) root.style.setProperty("--claim-button-bg", colorSettings.buttonBg);
//           if (colorSettings.buttonText) root.style.setProperty("--claim-button-text", colorSettings.buttonText);
//           if (colorSettings.headingText) root.style.setProperty("--claim-heading-text", colorSettings.headingText);
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

//   const api = { mount };
//   if (typeof module !== "undefined" && module.exports) {
//     module.exports = api;
//   } else if (typeof define === "function" && define.amd) {
//     define(() => api);
//   } else {
//     global.ClaimLogin = api;
//   }
// })(typeof window !== "undefined" ? window : globalThis);




