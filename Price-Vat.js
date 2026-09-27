(() => {
  "use strict";

  /*
   * =========================================================
   * WOND PRICE + VAT
   * =========================================================
   *
   * This file controls ONLY:
   * - country selector
   * - currency
   * - VAT mode
   * - price rendering
   *
   * Required data from prices.js:
   * - window.WOND_COUNTRIES
   * - window.WOND_PRICE_ITEMS
   * - window.WOND_LOCAL_PRICES
   * - window.WOND_COUNTRY_NAMES
   * - window.WOND_CATEGORY_NAMES
   * - window.WOND_PRICE_TRANSLATIONS
   *
   * HTML:
   *   #price-country
   *   #vat-mode
   *   #price-grid
   *
   * =========================================================
   */


  /* =========================================================
     VAT RATES
     ========================================================= */

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


  /* =========================================================
     DEFAULT COUNTRY
     ========================================================= */

  const DEFAULT_COUNTRY = "CZ";
  const DEFAULT_MODE = "net";


  /* =========================================================
     DOM HELPERS
     ========================================================= */

  const $ = (selector) => {
    return document.querySelector(selector);
  };


  /* =========================================================
     DATA
     ========================================================= */

  const getCountries = () => {
    return Array.isArray(window.WOND_COUNTRIES)
      ? window.WOND_COUNTRIES
      : [];
  };


  const getServices = () => {
    return Array.isArray(window.WOND_PRICE_ITEMS)
      ? window.WOND_PRICE_ITEMS
      : [];
  };


  const getPrices = () => {
    return window.WOND_LOCAL_PRICES || {};
  };


  /* =========================================================
     LANGUAGE
     ========================================================= */

  function getLanguage() {
    const supported =
      Array.isArray(window.WOND_LANGS) &&
      window.WOND_LANGS.length
        ? window.WOND_LANGS
        : [
            "uk",
            "cs",
            "sl",
            "sk",
            "de",
            "en",
            "hr",
            "sr",
            "it",
            "hu",
            "pl",
            "ro"
          ];

    const query =
      new URLSearchParams(location.search)
        .get("lang");

    if (query && supported.includes(query)) {
      return query;
    }

    const saved =
      localStorage.getItem("wond-lang");

    if (saved && supported.includes(saved)) {
      return saved;
    }

    const browser =
      (navigator.language || "cs")
        .slice(0, 2);

    if (supported.includes(browser)) {
      return browser;
    }

    return "cs";
  }


  function getUiText(key) {
    const lang = getLanguage();

    const ui = {
      uk: {
        country: "Країна",
        price: "Ціна",
        service: "Послуга",
        without: "Без ПДВ",
        with: "З ПДВ",
        both: "Обидва",
        by_scope: "за обсягом"
      },

      cs: {
        country: "Země",
        price: "Cena",
        service: "Služba",
        without: "Bez DPH",
        with: "Včetně DPH",
        both: "Obojí",
        by_scope: "dle rozsahu"
      },

      sl: {
        country: "Država",
        price: "Cena",
        service: "Storitev",
        without: "Brez DDV",
        with: "Z DDV",
        both: "Oboje",
        by_scope: "glede na obseg"
      },

      sk: {
        country: "Krajina",
        price: "Cena",
        service: "Služba",
        without: "Bez DPH",
        with: "S DPH",
        both: "Oboje",
        by_scope: "podľa rozsahu"
      },

      de: {
        country: "Land",
        price: "Preis",
        service: "Leistung",
        without: "Ohne MwSt.",
        with: "Inkl. MwSt.",
        both: "Beide",
        by_scope: "nach Umfang"
      },

      en: {
        country: "Country",
        price: "Price",
        service: "Service",
        without: "Without VAT",
        with: "With VAT",
        both: "Both",
        by_scope: "depending on scope"
      },

      hr: {
        country: "Država",
        price: "Cijena",
        service: "Usluga",
        without: "Bez PDV-a",
        with: "S PDV-om",
        both: "Oboje",
        by_scope: "prema opsegu"
      },

      sr: {
        country: "Država",
        price: "Cena",
        service: "Usluga",
        without: "Bez PDV-a",
        with: "Sa PDV-om",
        both: "Oboje",
        by_scope: "prema obimu"
      },

      it: {
        country: "Paese",
        price: "Prezzo",
        service: "Servizio",
        without: "Senza IVA",
        with: "Con IVA",
        both: "Entrambi",
        by_scope: "in base all'ambito"
      },

      hu: {
        country: "Ország",
        price: "Ár",
        service: "Szolgáltatás",
        without: "ÁFA nélkül",
        with: "ÁFÁ-val",
        both: "Mindkettő",
        by_scope: "munkaterülettől függően"
      },

      pl: {
        country: "Kraj",
        price: "Cena",
        service: "Usługa",
        without: "Bez VAT",
        with: "Z VAT",
        both: "Obie",
        by_scope: "według zakresu"
      },

      ro: {
        country: "Țara",
        price: "Preț",
        service: "Serviciu",
        without: "Fără TVA",
        with: "Cu TVA",
        both: "Ambele",
        by_scope: "în funcție de amploare"
      }
    };

    return (
      ui[lang]?.[key] ||
      ui.en[key] ||
      key
    );
  }


  /* =========================================================
     TRANSLATIONS FROM prices.js
     ========================================================= */

  function getServiceName(
    itemKey,
    defaultName
  ) {
    const lang = getLanguage();

    const translations =
      window.WOND_PRICE_TRANSLATIONS || {};

    return (
      translations?.[itemKey]?.[lang] ||
      translations?.[itemKey]?.en ||
      defaultName ||
      itemKey
    );
  }


  function getCategoryName(category) {
    const lang = getLanguage();

    const names =
      window.WOND_CATEGORY_NAMES || {};

    return (
      names?.[lang]?.[category] ||
      names?.en?.[category] ||
      category
    );
  }


  function getCountryName(country) {
    const lang = getLanguage();

    const names =
      window.WOND_COUNTRY_NAMES || {};

    return (
      names?.[lang]?.[country.code] ||
      names?.en?.[country.code] ||
      country.name ||
      country.code
    );
  }


  /* =========================================================
     COUNTRY
     ========================================================= */

  function normalizeCountryCode(code) {
    return String(
      code || ""
    )
      .trim()
      .toUpperCase();
  }


  function getCountry(code) {
    const normalized =
      normalizeCountryCode(code);

    const countries =
      getCountries();

    return (
      countries.find(
        country =>
          normalizeCountryCode(
            country.code
          ) === normalized
      ) ||
      countries.find(
        country =>
          normalizeCountryCode(
            country.code
          ) === DEFAULT_COUNTRY
      ) ||
      countries[0] ||
      null
    );
  }


  /* =========================================================
     VAT
     ========================================================= */

  function getVatRate(countryCode) {
    const code =
      normalizeCountryCode(
        countryCode
      );

    /*
     * VAT_RATES is intentionally
     * the primary source.
     *
     * This means an incorrect/null/zero
     * vat_rate in Supabase cannot break
     * the calculation.
     */

    if (
      Object.prototype.hasOwnProperty.call(
        VAT_RATES,
        code
      )
    ) {
      return VAT_RATES[code];
    }

    const country =
      getCountry(code);

    if (!country) {
      return 0;
    }

    const dbVat =
      Number(
        country.vat_rate ??
        country.vat ??
        0
      );

    if (
      Number.isFinite(dbVat) &&
      dbVat > 0
    ) {
      return dbVat;
    }

    return 0;
  }


  function getVatPercent(countryCode) {
    return Math.round(
      getVatRate(countryCode) * 100
    );
  }


  function calculateGross(
    net,
    countryCode
  ) {
    const value =
      Number(net) || 0;

    const vat =
      getVatRate(countryCode);

    return value * (1 + vat);
  }


  /* =========================================================
     NUMBER FORMAT
     ========================================================= */

  function formatPrice(
    value,
    currency
  ) {
    const lang =
      getLanguage();

    const number =
      Number(value) || 0;

    const decimals =
      currency === "HUF"
        ? 0
        : 2;

    return (
      new Intl.NumberFormat(
        lang,
        {
          minimumFractionDigits:
            decimals,

          maximumFractionDigits:
            decimals
        }
      ).format(number) +
      " " +
      currency
    );
  }


  /* =========================================================
     COUNTRY SELECT
     ========================================================= */

  function renderCountrySelect() {
    const select =
      $("#price-country");

    if (!select) {
      return;
    }

    const countries =
      getCountries();

    if (!countries.length) {
      return;
    }

    const saved =
      normalizeCountryCode(
        localStorage.getItem(
          "wond-country"
        ) || DEFAULT_COUNTRY
      );

    const oldValue =
      normalizeCountryCode(
        select.value
      );

    const selected =
      oldValue ||
      saved ||
      DEFAULT_COUNTRY;

    select.innerHTML = "";

    countries
      .filter(
        country =>
          country.active !== false
      )
      .forEach(country => {

        const code =
          normalizeCountryCode(
            country.code
          );

        if (!code) {
          return;
        }

        const option =
          document.createElement(
            "option"
          );

        option.value = code;

        option.textContent =
          getCountryName(country);

        select.appendChild(option);
      });


    const canSelect =
      [...select.options].some(
        option =>
          option.value === selected
      );


    if (canSelect) {
      select.value = selected;

    } else if (
      [...select.options].some(
        option =>
          option.value === DEFAULT_COUNTRY
      )
    ) {
      select.value =
        DEFAULT_COUNTRY;

    } else if (
      select.options.length
    ) {
      select.selectedIndex = 0;
    }


    localStorage.setItem(
      "wond-country",
      select.value
    );


    updateVatModeLabels();
  }


  /* =========================================================
     VAT MODE
     ========================================================= */

  function updateVatModeLabels() {
    const select =
      $("#vat-mode");

    if (!select) {
      return;
    }

    const net =
      select.querySelector(
        'option[value="net"]'
      );

    const gross =
      select.querySelector(
        'option[value="gross"]'
      );

    const both =
      select.querySelector(
        'option[value="both"]'
      );

    if (net) {
      net.textContent =
        getUiText("without");
    }

    if (gross) {
      gross.textContent =
        getUiText("with");
    }

    if (both) {
      both.textContent =
        getUiText("both");
    }
  }


  function restoreVatMode() {
    const select =
      $("#vat-mode");

    if (!select) {
      return;
    }

    const saved =
      localStorage.getItem(
        "wond-vat-mode"
      );

    if (
      saved === "net" ||
      saved === "gross" ||
      saved === "both"
    ) {
      select.value = saved;
    } else {
      select.value =
        DEFAULT_MODE;
    }

    updateVatModeLabels();
  }


  /* =========================================================
     PRICE
     ========================================================= */

  function getLocalPrice(
    countryCode,
    itemKey
  ) {
    const prices =
      getPrices();

    const code =
      normalizeCountryCode(
        countryCode
      );

    const value =
      prices?.[code]?.[itemKey];

    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  }


  /* =========================================================
     RENDER
     ========================================================= */

  function renderPrices() {
    const grid =
      $("#price-grid");

    if (!grid) {
      return;
    }

    const countries =
      getCountries();

    const services =
      getServices();

    if (
      !countries.length ||
      !services.length
    ) {
      grid.innerHTML = "";
      return;
    }


    let countryCode =
      normalizeCountryCode(
        $("#price-country")?.value ||
        localStorage.getItem(
          "wond-country"
        ) ||
        DEFAULT_COUNTRY
      );


    let country =
      getCountry(countryCode);


    if (!country) {
      grid.innerHTML = "";
      return;
    }


    countryCode =
      normalizeCountryCode(
        country.code
      );


    const mode =
      $("#vat-mode")?.value ||
      localStorage.getItem(
        "wond-vat-mode"
      ) ||
      DEFAULT_MODE;


    const vatRate =
      getVatRate(countryCode);


    /*
     * Group services by category.
     */

    const groups = {};

    services
      .filter(
        service =>
          service.active !== false
      )
      .forEach(service => {

        const category =
          service.category ||
          "other";

        if (!groups[category]) {
          groups[category] = [];
        }

        groups[category].push(
          service
        );
      });


    grid.innerHTML = "";


    /*
     * Optional information about
     * selected country / VAT.
     */

    grid.dataset.country =
      countryCode;

    grid.dataset.currency =
      country.currency || "";

    grid.dataset.vat =
      String(vatRate);


    Object.entries(groups)
      .forEach(
        ([category, rows]) => {

          const card =
            document.createElement(
              "div"
            );

          card.className =
            "price-card";


          const title =
            document.createElement(
              "h3"
            );

          title.textContent =
            getCategoryName(
              category
            );


          const table =
            document.createElement(
              "table"
            );


          const thead =
            document.createElement(
              "thead"
            );


          const header =
            document.createElement(
              "tr"
            );


          const serviceHeader =
            document.createElement(
              "th"
            );

          serviceHeader.textContent =
            getUiText("service");


          const priceHeader =
            document.createElement(
              "th"
            );

          priceHeader.textContent =
            getUiText("price");


          header.append(
            serviceHeader,
            priceHeader
          );


          thead.appendChild(header);


          const tbody =
            document.createElement(
              "tbody"
            );


          rows.forEach(
            service => {

              const tr =
                document.createElement(
                  "tr"
                );


              const nameCell =
                document.createElement(
                  "td"
                );


              const priceCell =
                document.createElement(
                  "td"
                );


              nameCell.textContent =
                getServiceName(
                  service.item_key,
                  service.default_name
                );


              const net =
                getLocalPrice(
                  countryCode,
                  service.item_key
                );


              const unit =
                service.unit || "";


              /*
               * Special "report" service.
               */

              if (
                service.item_key ===
                  "report" &&
                net === 0
              ) {

                priceCell.textContent =
                  getUiText(
                    "by_scope"
                  );

              } else {

                const gross =
                  calculateGross(
                    net,
                    countryCode
                  );


                if (
                  mode === "gross"
                ) {

                  priceCell.textContent =
                    formatPrice(
                      gross,
                      country.currency
                    ) +
                    unit;


                } else if (
                  mode === "both"
                ) {

                  priceCell.textContent =
                    formatPrice(
                      net,
                      country.currency
                    ) +
                    unit +
                    " / " +
                    formatPrice(
                      gross,
                      country.currency
                    ) +
                    unit;


                } else {

                  priceCell.textContent =
                    formatPrice(
                      net,
                      country.currency
                    ) +
                    unit;
                }
              }


              tr.append(
                nameCell,
                priceCell
              );


              tbody.appendChild(tr);
            }
          );


          table.append(
            thead,
            tbody
          );


          card.append(
            title,
            table
          );


          grid.appendChild(card);
        }
      );


    /*
     * Helpful debug information in DOM.
     */

    grid.setAttribute(
      "data-vat-percent",
      String(
        getVatPercent(
          countryCode
        )
      )
    );
  }


  /* =========================================================
     EVENTS
     ========================================================= */

  function bindEvents() {

    const countrySelect =
      $("#price-country");


    if (
      countrySelect &&
      !countrySelect.dataset.wondVatBound
    ) {

      countrySelect.dataset.wondVatBound =
        "true";


      countrySelect.addEventListener(
        "change",
        function () {

          const code =
            normalizeCountryCode(
              this.value
            );


          localStorage.setItem(
            "wond-country",
            code
          );


          /*
           * Re-render immediately.
           */

          renderPrices();
        }
      );
    }


    const vatMode =
      $("#vat-mode");


    if (
      vatMode &&
      !vatMode.dataset.wondVatBound
    ) {

      vatMode.dataset.wondVatBound =
        "true";


      vatMode.addEventListener(
        "change",
        function () {

          const mode =
            this.value;


          if (
            mode === "net" ||
            mode === "gross" ||
            mode === "both"
          ) {

            localStorage.setItem(
              "wond-vat-mode",
              mode
            );
          }


          renderPrices();
        }
      );
    }
  }


  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.WOND_PRICE_VAT = {

    render:
      renderPrices,

    renderCountrySelect:
      renderCountrySelect,

    getCountry:
      getCountry,

    getVatRate:
      getVatRate,

    getVatPercent:
      getVatPercent,

    calculateGross:
      calculateGross,

    getLocalPrice:
      getLocalPrice,

    formatPrice:
      formatPrice
  };


  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function init() {

    renderCountrySelect();

    restoreVatMode();

    bindEvents();

    renderPrices();
  }


  /*
   * prices.js must be loaded first.
   */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();
  }


  /*
   * Re-render when another part of the
   * application changes language.
   *
   * We intentionally use a MutationObserver
   * only for language changes, not for
   * price-grid changes.
   */

  let lastLanguage =
    getLanguage();


  setInterval(
    () => {

      const currentLanguage =
        getLanguage();

      if (
        currentLanguage !==
        lastLanguage
      ) {

        lastLanguage =
          currentLanguage;

        renderCountrySelect();
        updateVatModeLabels();
        renderPrices();
      }

    },
    500
  );


  /*
   * Console test:
   *
   * WOND_PRICE_VAT.getVatRate("CZ")
   * => 0.21
   *
   * WOND_PRICE_VAT.calculateGross(450, "CZ")
   * => 544.5
   *
   * WOND_PRICE_VAT.getVatPercent("DE")
   * => 19
   */

})();
