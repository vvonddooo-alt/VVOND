(() => {
  "use strict";

  /*
   * WOND PRICE + VAT
   *
   * Бере дані з:
   *   window.WOND_COUNTRIES
   *   window.WOND_PRICE_ITEMS
   *   window.WOND_PRICE_TRANSLATIONS
   *   window.WOND_COUNTRY_NAMES
   *   window.WOND_LOCAL_PRICES
   *
   * HTML:
   *   #price-country
   *   #vat-mode
   *   #price-grid
   */

  const DEFAULT_COUNTRY = "CZ";
  const DEFAULT_MODE = "net";

  /*
   * Реальні ставки використовуються тут.
   * Якщо для країни ставка є в цьому списку —
   * вона має пріоритет над vat із prices.js.
   */
  const VAT_RATES = {
    CZ: 0.21,
    UA: 0.20,
    SI: 0.22,
    SK: 0.23,
    DE: 0.19,
    PL: 0.23,
    RO: 0.21,
    HU: 0.27,
    HR: 0.25,
    GB: 0.20
  };

  const $ = (selector) => document.querySelector(selector);

  function getCountries() {
    return Array.isArray(window.WOND_COUNTRIES)
      ? window.WOND_COUNTRIES
      : [];
  }

  function getServices() {
    return Array.isArray(window.WOND_PRICE_ITEMS)
      ? window.WOND_PRICE_ITEMS
      : [];
  }

  function getPrices() {
    return window.WOND_LOCAL_PRICES || {};
  }

  function getLang() {
    const fromWindow =
      window.WOND_LANG ||
      window.WOND_LANGUAGE ||
      window.currentLang;

    if (fromWindow) {
      return String(fromWindow).toLowerCase();
    }

    const saved = localStorage.getItem("wond-lang");

    if (saved) {
      return String(saved).toLowerCase();
    }

    const query = new URLSearchParams(location.search).get("lang");

    if (query) {
      return String(query).toLowerCase();
    }

    const browser = navigator.language || "";

    if (browser) {
      return browser.split("-")[0].toLowerCase();
    }

    return "cs";
  }

  function normalizeLang(lang) {
    const aliases = {
      uk: "uk",
      ua: "uk",
      cs: "cs",
      sk: "sk",
      sl: "sl",
      de: "de",
      en: "en",
      hr: "hr",
      sr: "sr",
      it: "it",
      hu: "hu",
      pl: "pl",
      ro: "ro"
    };

    return aliases[String(lang || "").toLowerCase()] || "cs";
  }

  function getLanguage() {
    return normalizeLang(getLang());
  }

  const UI = {
    uk: {
      country: "Країна",
      price: "Ціна",
      without: "Без ПДВ",
      with: "З ПДВ",
      both: "Без ПДВ / З ПДВ",
      vat: "ПДВ",
      service: "Послуга"
    },

    cs: {
      country: "Země",
      price: "Cena",
      without: "Bez DPH",
      with: "S DPH",
      both: "Bez DPH / S DPH",
      vat: "DPH",
      service: "Služba"
    },

    sl: {
      country: "Država",
      price: "Cena",
      without: "Brez DDV",
      with: "Z DDV",
      both: "Brez DDV / Z DDV",
      vat: "DDV",
      service: "Storitev"
    },

    sk: {
      country: "Krajina",
      price: "Cena",
      without: "Bez DPH",
      with: "S DPH",
      both: "Bez DPH / S DPH",
      vat: "DPH",
      service: "Služba"
    },

    de: {
      country: "Land",
      price: "Preis",
      without: "Ohne MwSt.",
      with: "Mit MwSt.",
      both: "Ohne MwSt. / Mit MwSt.",
      vat: "MwSt.",
      service: "Leistung"
    },

    en: {
      country: "Country",
      price: "Price",
      without: "Without VAT",
      with: "With VAT",
      both: "Without VAT / With VAT",
      vat: "VAT",
      service: "Service"
    },

    hr: {
      country: "Država",
      price: "Cijena",
      without: "Bez PDV-a",
      with: "S PDV-om",
      both: "Bez PDV-a / S PDV-om",
      vat: "PDV",
      service: "Usluga"
    },

    sr: {
      country: "Država",
      price: "Cena",
      without: "Bez PDV-a",
      with: "Sa PDV-om",
      both: "Bez PDV-a / Sa PDV-om",
      vat: "PDV",
      service: "Usluga"
    },

    it: {
      country: "Paese",
      price: "Prezzo",
      without: "Senza IVA",
      with: "Con IVA",
      both: "Senza IVA / Con IVA",
      vat: "IVA",
      service: "Servizio"
    },

    hu: {
      country: "Ország",
      price: "Ár",
      without: "ÁFA nélkül",
      with: "ÁFÁ-val",
      both: "ÁFA nélkül / ÁFÁ-val",
      vat: "ÁFA",
      service: "Szolgáltatás"
    },

    pl: {
      country: "Kraj",
      price: "Cena",
      without: "Bez VAT",
      with: "Z VAT",
      both: "Bez VAT / Z VAT",
      vat: "VAT",
      service: "Usługa"
    },

    ro: {
      country: "Țara",
      price: "Preț",
      without: "Fără TVA",
      with: "Cu TVA",
      both: "Fără TVA / Cu TVA",
      vat: "TVA",
      service: "Serviciu"
    }
  };

  function text(key) {
    const lang = getLanguage();

    return (
      UI[lang]?.[key] ||
      UI.cs[key] ||
      key
    );
  }

  function countryName(country) {
    if (!country) return "";

    const code = String(
      country.code ||
      country.country_code ||
      ""
    ).toUpperCase();

    const names = window.WOND_COUNTRY_NAMES || {};

    const lang = getLanguage();

    if (names[lang]?.[code]) {
      return names[lang][code];
    }

    if (names[code]?.[lang]) {
      return names[code][lang];
    }

    if (country.name) {
      return country.name;
    }

    return code;
  }

  function serviceName(item) {
    if (!item) return "";

    const key =
      item.key ||
      item.id ||
      item.code ||
      "";

    const translations =
      window.WOND_PRICE_TRANSLATIONS || {};

    const lang = getLanguage();

    /*
     * Підтримка обох можливих структур:
     *
     * translations[lang][key]
     * translations[key][lang]
     */

    if (
      translations[lang] &&
      typeof translations[lang] === "object" &&
      translations[lang][key] != null
    ) {
      return translations[lang][key];
    }

    if (
      translations[key] &&
      typeof translations[key] === "object" &&
      translations[key][lang] != null
    ) {
      return translations[key][lang];
    }

    return (
      item.name ||
      item.title ||
      item.label ||
      key
    );
  }

  function getCountry(code) {
    const countries = getCountries();

    return (
      countries.find(
        c =>
          String(c.code || "").toUpperCase() ===
          String(code || "").toUpperCase()
      ) ||
      countries[0] ||
      null
    );
  }

  function getVatRate(code) {
    const country = getCountry(code);

    const countryCode = String(
      code ||
      country?.code ||
      ""
    ).toUpperCase();

    /*
     * Спочатку використовуємо ставку цього файлу.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        VAT_RATES,
        countryCode
      )
    ) {
      return VAT_RATES[countryCode];
    }

    /*
     * Якщо ставки немає — беремо vat з prices.js.
     */
    const dbVat =
      Number(country?.vat);

    if (
      Number.isFinite(dbVat) &&
      dbVat >= 0
    ) {
      return dbVat;
    }

    return 0;
  }

  function getVatPercent(code) {
    return getVatRate(code) * 100;
  }

  function grossFromNet(net, vatRate) {
    const value = Number(net);

    if (!Number.isFinite(value)) {
      return 0;
    }

    return value * (1 + vatRate);
  }

  function getCurrency(country) {
    return (
      country?.currency ||
      country?.currency_code ||
      "EUR"
    );
  }

  function formatPrice(value, currency) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "—";
    }

    try {
      return new Intl.NumberFormat(
        getLanguage() === "cs"
          ? "cs-CZ"
          : getLanguage() === "uk"
            ? "uk-UA"
            : getLanguage() === "de"
              ? "de-DE"
              : getLanguage() === "pl"
                ? "pl-PL"
                : getLanguage() === "ro"
                  ? "ro-RO"
                  : getLanguage() === "hu"
                    ? "hu-HU"
                    : "en-US",
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }
      ).format(number) + " " + currency;
    } catch {
      return number.toFixed(2) + " " + currency;
    }
  }

  function getSelectedCountry() {
    const select = $("#price-country");

    if (select?.value) {
      return getCountry(select.value);
    }

    return (
      getCountry(
        localStorage.getItem("wond-price-country")
      ) ||
      getCountry(DEFAULT_COUNTRY)
    );
  }

  function getMode() {
    const select = $("#vat-mode");

    if (
      select?.value === "net" ||
      select?.value === "gross" ||
      select?.value === "both"
    ) {
      return select.value;
    }

    return (
      localStorage.getItem("wond-vat-mode") ||
      DEFAULT_MODE
    );
  }

  function getLocalPrice(countryCode, itemKey) {
    const prices = getPrices();

    /*
     * Структура:
     * WOND_LOCAL_PRICES[COUNTRY][ITEM]
     */
    if (
      prices[countryCode] &&
      prices[countryCode][itemKey] != null
    ) {
      return Number(
        prices[countryCode][itemKey]
      );
    }

    /*
     * Якщо структура нижче:
     * WOND_LOCAL_PRICES[ITEM][COUNTRY]
     */
    if (
      prices[itemKey] &&
      typeof prices[itemKey] === "object" &&
      prices[itemKey][countryCode] != null
    ) {
      return Number(
        prices[itemKey][countryCode]
      );
    }

    return null;
  }

  function renderCountrySelect() {
    const select = $("#price-country");

    if (!select) return;

    const countries = getCountries();

    if (!countries.length) {
      select.innerHTML = "";
      return;
    }

    const oldValue =
      select.value ||
      localStorage.getItem("wond-price-country") ||
      DEFAULT_COUNTRY;

    select.innerHTML = countries
      .map(country => {
        const code = String(
          country.code || ""
        ).toUpperCase();

        const currency = getCurrency(country);

        const selected =
          code === String(oldValue).toUpperCase()
            ? " selected"
            : "";

        return `
          <option value="${escapeHtml(code)}"${selected}>
            ${escapeHtml(countryName(country))}
            (${escapeHtml(currency)})
          </option>
        `;
      })
      .join("");

    const selectedCountry =
      getCountry(oldValue) ||
      countries[0];

    if (selectedCountry) {
      select.value = String(
        selectedCountry.code
      ).toUpperCase();

      localStorage.setItem(
        "wond-price-country",
        select.value
      );
    }
  }

  function updateVatModeLabels() {
    const select = $("#vat-mode");

    if (!select) return;

    const current = select.value || DEFAULT_MODE;

    select.innerHTML = `
      <option value="net">
        ${escapeHtml(text("without"))}
      </option>

      <option value="gross">
        ${escapeHtml(text("with"))}
      </option>

      <option value="both">
        ${escapeHtml(text("both"))}
      </option>
    `;

    select.value = current;
  }

  function getCategory(item) {
    return (
      item?.category ||
      item?.group ||
      "other"
    );
  }

  function renderPrices() {
    const grid = $("#price-grid");

    if (!grid) return;

    const country = getSelectedCountry();

    if (!country) {
      grid.innerHTML = "";
      return;
    }

    const countryCode =
      String(country.code || "").toUpperCase();

    const currency = getCurrency(country);

    const vatRate =
      getVatRate(countryCode);

    const mode = getMode();

    const services = getServices();

    if (!services.length) {
      grid.innerHTML = `
        <div class="price-empty">
          Немає цін
        </div>
      `;
      return;
    }

    const groups = {};

    services.forEach(item => {
      const category = getCategory(item);

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);
    });

    let html = "";

    Object.keys(groups).forEach(category => {
      html += `
        <section class="price-category"
                 data-category="${escapeHtml(category)}">

          <div class="price-category-title">
            ${escapeHtml(
              categoryName(category)
            )}
          </div>

          <div class="price-category-items">
      `;

      groups[category].forEach(item => {
        const key =
          item.key ||
          item.id ||
          item.code;

        const net =
          getLocalPrice(
            countryCode,
            key
          );

        if (
          net === null ||
          !Number.isFinite(net)
        ) {
          return;
        }

        const gross =
          grossFromNet(
            net,
            vatRate
          );

        let priceHtml = "";

        if (mode === "net") {
          priceHtml = `
            <div class="price-value">
              ${escapeHtml(
                formatPrice(
                  net,
                  currency
                )
              )}
            </div>
          `;
        }

        if (mode === "gross") {
          priceHtml = `
            <div class="price-value">
              ${escapeHtml(
                formatPrice(
                  gross,
                  currency
                )
              )}
            </div>
          `;
        }

        if (mode === "both") {
          priceHtml = `
            <div class="price-value price-both">
              <span>
                ${escapeHtml(
                  formatPrice(
                    net,
                    currency
                  )
                )}
              </span>

              <span>
                ${escapeHtml(
                  formatPrice(
                    gross,
                    currency
                  )
                )}
              </span>
            </div>
          `;
        }

        html += `
          <article class="price-item"
                   data-service="${escapeHtml(key)}">

            <div class="price-name">
              ${escapeHtml(
                serviceName(item)
              )}
            </div>

            ${priceHtml}

          </article>
        `;
      });

      html += `
          </div>
        </section>
      `;
    });

    grid.innerHTML = html;

    grid.dataset.country = countryCode;
    grid.dataset.currency = currency;
    grid.dataset.vat = String(
      getVatPercent(countryCode)
    );
    grid.dataset.mode = mode;
  }

  function categoryName(category) {
    const names =
      window.WOND_CATEGORY_NAMES || {};

    const lang = getLanguage();

    if (
      names[lang] &&
      names[lang][category]
    ) {
      return names[lang][category];
    }

    if (
      names[category] &&
      typeof names[category] === "object" &&
      names[category][lang]
    ) {
      return names[category][lang];
    }

    const fallback = {
      electro: "Elektro",
      plumbing: "Voda",
      panel: "Rozvaděče",
      inspection: "Kontrola",
      travel: "Doprava",
      other: "Ostatní"
    };

    return fallback[category] || category;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function bindEvents() {
    const country = $("#price-country");

    if (
      country &&
      !country.dataset.wondBound
    ) {
      country.addEventListener(
        "change",
        () => {
          localStorage.setItem(
            "wond-price-country",
            country.value
          );

          renderPrices();
        }
      );

      country.dataset.wondBound = "1";
    }

    const vat = $("#vat-mode");

    if (
      vat &&
      !vat.dataset.wondBound
    ) {
      vat.addEventListener(
        "change",
        () => {
          localStorage.setItem(
            "wond-vat-mode",
            vat.value
          );

          renderPrices();
        }
      );

      vat.dataset.wondBound = "1";
    }

    /*
     * Підключення до головної системи мов.
     *
     * app.js може викликати:
     *
     * window.dispatchEvent(
     *   new CustomEvent("wond:language-change", {
     *     detail: { lang: "uk" }
     *   })
     * );
     */

    if (!window.WOND_PRICE_VAT_LANGUAGE_BOUND) {
      window.WOND_PRICE_VAT_LANGUAGE_BOUND = true;

      window.addEventListener(
        "wond:language-change",
        event => {
          if (
            event?.detail?.lang
          ) {
            window.WOND_LANG =
              event.detail.lang;
          }

          renderCountrySelect();
          updateVatModeLabels();
          renderPrices();
        }
      );
    }
  }

  function render() {
    renderCountrySelect();
    updateVatModeLabels();
    renderPrices();
  }

  window.WOND_PRICE_VAT = {
    render,
    renderPrices,
    renderCountrySelect,
    updateVatModeLabels,
    getCountry,
    getVatRate,
    getVatPercent,
    grossFromNet,
    getLocalPrice,
    formatPrice
  };

  function init() {
    render();
    bindEvents();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
