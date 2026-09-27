"use strict";

  const DEFAULT_COUNTRY = "CZ";
  const DEFAULT_MODE = "net";

  /*
   * ПДВ у відсотках.
   * Код нижче сам перетворює 21 -> 0.21.
   */
  const VAT_RATES = {
    CZ: 21,
    UA: 20,
    SI: 22,
    SK: 23,
    DE: 19,
    PL: 23,
    RO: 21,
    HU: 27,
    HR: 25,
    GB: 20
  };

  const $ = selector => document.querySelector(selector);

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

  /* =========================
     LANGUAGE
  ========================= */

  function getLanguage() {
    const value =
      window.WOND_LANG ||
      window.WOND_LANGUAGE ||
      window.currentLang ||
      localStorage.getItem("wond-lang") ||
      new URLSearchParams(location.search).get("lang") ||
      navigator.language?.split("-")[0] ||
      "cs";

    const lang = String(value).toLowerCase();

    const aliases = {
      ua: "uk",
      uk: "uk",
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

    return aliases[lang] || "cs";
  }

  /* =========================
     UI TEXT
  ========================= */

  const UI = {
    uk: {
      country: "Країна",
      without: "Без ПДВ",
      with: "З ПДВ",
      both: "Без ПДВ / З ПДВ",
      vat: "ПДВ"
    },

    cs: {
      country: "Země",
      without: "Bez DPH",
      with: "S DPH",
      both: "Bez DPH / S DPH",
      vat: "DPH"
    },

    sl: {
      country: "Država",
      without: "Brez DDV",
      with: "Z DDV",
      both: "Brez DDV / Z DDV",
      vat: "DDV"
    },

    sk: {
      country: "Krajina",
      without: "Bez DPH",
      with: "S DPH",
      both: "Bez DPH / S DPH",
      vat: "DPH"
    },

    de: {
      country: "Land",
      without: "Ohne MwSt.",
      with: "Mit MwSt.",
      both: "Ohne MwSt. / Mit MwSt.",
      vat: "MwSt."
    },

    en: {
      country: "Country",
      without: "Without VAT",
      with: "With VAT",
      both: "Without VAT / With VAT",
      vat: "VAT"
    },

    hr: {
      country: "Država",
      without: "Bez PDV-a",
      with: "S PDV-om",
      both: "Bez PDV-a / S PDV-om",
      vat: "PDV"
    },

    sr: {
      country: "Država",
      without: "Bez PDV-a",
      with: "Sa PDV-om",
      both: "Bez PDV-a / Sa PDV-om",
      vat: "PDV"
    },

    it: {
      country: "Paese",
      without: "Senza IVA",
      with: "Con IVA",
      both: "Senza IVA / Con IVA",
      vat: "IVA"
    },

    hu: {
      country: "Ország",
      without: "ÁFA nélkül",
      with: "ÁFÁ-val",
      both: "ÁFA nélkül / ÁFÁ-val",
      vat: "ÁFA"
    },

    pl: {
      country: "Kraj",
      without: "Bez VAT",
      with: "Z VAT",
      both: "Bez VAT / Z VAT",
      vat: "VAT"
    },

    ro: {
      country: "Țara",
      without: "Fără TVA",
      with: "Cu TVA",
      both: "Fără TVA / Cu TVA",
      vat: "TVA"
    }
  };

  function ui(key) {
    const lang = getLanguage();

    return (
      UI[lang]?.[key] ||
      UI.cs[key] ||
      key
    );
  }

  /* =========================
     COUNTRY
  ========================= */

  function getCountry(code) {
    const countries = getCountries();

    const wanted = String(
      code || DEFAULT_COUNTRY
    ).toUpperCase();

    return (
      countries.find(
        country =>
          String(country.code || "").toUpperCase() === wanted
      ) ||
      countries.find(
        country =>
          String(country.code || "").toUpperCase() === DEFAULT_COUNTRY
      ) ||
      countries[0] ||
      null
    );
  }

  function getCountryName(country) {
    if (!country) return "";

    const code = String(
      country.code || ""
    ).toUpperCase();

    const lang = getLanguage();

    const names =
      window.WOND_COUNTRY_NAMES || {};

    /*
     * ТВОЯ структура:
     * WOND_COUNTRY_NAMES[lang][code]
     */
    if (
      names[lang] &&
      names[lang][code]
    ) {
      return names[lang][code];
    }

    return country.name || code;
  }

  function getCurrency(country) {
    return (
      country?.currency ||
      country?.currency_code ||
      "EUR"
    );
  }

  /* =========================
     SERVICE
  ========================= */

  function getItemKey(item) {
    /*
     * ТВОЯ структура:
     * item.item_key
     */

    return (
      item?.item_key ||
      item?.key ||
      item?.id ||
      item?.code ||
      ""
    );
  }

  function getServiceName(item) {
    const key = getItemKey(item);

    const translations =
      window.WOND_PRICE_TRANSLATIONS || {};

    const lang = getLanguage();

    /*
     * ТВОЯ структура:
     *
     * WOND_PRICE_TRANSLATIONS = {
     *   point: {
     *     uk: "...",
     *     cs: "..."
     *   }
     * }
     */

    if (
      translations[key] &&
      translations[key][lang]
    ) {
      return translations[key][lang];
    }

    /*
     * Запасний варіант.
     */
    return (
      item?.name ||
      key
    );
  }

  /* =========================
     VAT
  ========================= */

  function getVatPercent(code) {
    const country =
      getCountry(code);

    const countryCode =
      String(
        code ||
        country?.code ||
        ""
      ).toUpperCase();

    /*
     * Якщо є наша ставка:
     *
     * CZ: 21
     * DE: 19
     *
     * повертаємо 21, 19...
     */
    if (
      Object.prototype.hasOwnProperty.call(
        VAT_RATES,
        countryCode
      )
    ) {
      return Number(
        VAT_RATES[countryCode]
      );
    }

    /*
     * Запасний варіант із prices.js.
     *
     * Там vat = 0.2
     */
    const fallback =
      Number(country?.vat);

    if (
      Number.isFinite(fallback)
    ) {
      return fallback <= 1
        ? fallback * 100
        : fallback;
    }

    return 0;
  }

  function getVatRate(code) {
    return getVatPercent(code) / 100;
  }

  function calculateGross(
    net,
    code
  ) {
    const value = Number(net);

    if (!Number.isFinite(value)) {
      return 0;
    }

    return value * (
      1 + getVatRate(code)
    );
  }

  /* =========================
     PRICE
  ========================= */

  function getLocalPrice(
    countryCode,
    itemKey
  ) {
    const prices =
      getPrices();

    const country =
      String(countryCode || "")
        .toUpperCase();

    const key =
      String(itemKey || "");

    /*
     * ТВОЯ структура:
     *
     * WOND_LOCAL_PRICES.CZ.point
     * WOND_LOCAL_PRICES.CZ.socket
     * ...
     */

    if (
      prices[country] &&
      prices[country][key] !== undefined &&
      prices[country][key] !== null
    ) {
      return Number(
        prices[country][key]
      );
    }

    return null;
  }

  /* =========================
     FORMAT
  ========================= */

  function getLocale() {
    const lang =
      getLanguage();

    const locales = {
      uk: "uk-UA",
      cs: "cs-CZ",
      sl: "sl-SI",
      sk: "sk-SK",
      de: "de-DE",
      en: "en-GB",
      hr: "hr-HR",
      sr: "sr-RS",
      it: "it-IT",
      hu: "hu-HU",
      pl: "pl-PL",
      ro: "ro-RO"
    };

    return (
      locales[lang] ||
      "cs-CZ"
    );
  }

  function formatPrice(
    value,
    currency
  ) {
    const number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {
      return "—";
    }

    try {
      return (
        new Intl.NumberFormat(
          getLocale(),
          {
            minimumFractionDigits:
              Number.isInteger(number)
                ? 0
                : 2,

            maximumFractionDigits: 2
          }
        ).format(number) +
        " " +
        currency
      );
    } catch {
      return (
        number.toFixed(2) +
        " " +
        currency
      );
    }
  }

  /* =========================
     COUNTRY SELECT
  ========================= */

  function renderCountrySelect() {
    const select =
      $("#price-country");

    if (!select) {
      return;
    }

    const countries =
      getCountries();

    if (!countries.length) {
      select.innerHTML = "";
      return;
    }

    const saved =
      localStorage.getItem(
        "wond-price-country"
      );

    const current =
      select.value ||
      saved ||
      DEFAULT_COUNTRY;

    select.innerHTML =
      countries
        .map(country => {
          const code =
            String(
              country.code || ""
            ).toUpperCase();

          const currency =
            getCurrency(country);

          const selected =
            code ===
            String(current).toUpperCase()
              ? " selected"
              : "";

          return `
            <option
              value="${escapeHtml(code)}"
              ${selected}
            >
              ${escapeHtml(
                getCountryName(country)
              )}
              (${escapeHtml(currency)})
            </option>
          `;
        })
        .join("");

    const country =
      getCountry(current);

    if (country) {
      select.value =
        String(
          country.code
        ).toUpperCase();

      localStorage.setItem(
        "wond-price-country",
        select.value
      );
    }
  }

  /* =========================
     VAT MODE
  ========================= */

  function getVatMode() {
    const select =
      $("#vat-mode");

    if (
      select &&
      (
        select.value === "net" ||
        select.value === "gross" ||
        select.value === "both"
      )
    ) {
      return select.value;
    }

    return (
      localStorage.getItem(
        "wond-vat-mode"
      ) ||
      DEFAULT_MODE
    );
  }

  function renderVatMode() {
    const select =
      $("#vat-mode");

    if (!select) {
      return;
    }

    const current =
      getVatMode();

    select.innerHTML = `
      <option value="net">
        ${escapeHtml(
          ui("without")
        )}
      </option>

      <option value="gross">
        ${escapeHtml(
          ui("with")
        )}
      </option>

      <option value="both">
        ${escapeHtml(
          ui("both")
        )}
      </option>
    `;

    select.value = current;
  }

  /* =========================
     CATEGORY
  ========================= */

  function getCategoryName(
    category
  ) {
    const lang =
      getLanguage();

    const names =
      window.WOND_CATEGORY_NAMES || {};

    if (
      names[lang] &&
      names[lang][category]
    ) {
      return names[lang][category];
    }

    const fallback = {
      electro: {
        uk: "Електрика",
        cs: "Elektro",
        sl: "Elektrika",
        sk: "Elektro",
        de: "Elektro",
        en: "Electrical",
        hr: "Elektrika",
        sr: "Elektrika",
        it: "Elettrico",
        hu: "Elektromos",
        pl: "Elektryka",
        ro: "Electric"
      },

      plumbing: {
        uk: "Вода",
        cs: "Voda",
        sl: "Voda",
        sk: "Voda",
        de: "Wasser",
        en: "Plumbing",
        hr: "Voda",
        sr: "Voda",
        it: "Idraulica",
        hu: "Víz",
        pl: "Woda",
        ro: "Instalații sanitare"
      },

      panel: {
        uk: "Електричні щити",
        cs: "Rozvaděče",
        sl: "Razdelilne omarice",
        sk: "Rozvádzače",
        de: "Verteiler",
        en: "Switchboards",
        hr: "Razvodni ormari",
        sr: "Razvodne table",
        it: "Quadri elettrici",
        hu: "Elosztótáblák",
        pl: "Rozdzielnice",
        ro: "Tablouri electrice"
      },

      inspection: {
        uk: "Перевірка",
        cs: "Kontrola",
        sl: "Pregled",
        sk: "Kontrola",
        de: "Prüfung",
        en: "Inspection",
        hr: "Kontrola",
        sr: "Kontrola",
        it: "Ispezione",
        hu: "Ellenőrzés",
        pl: "Kontrola",
        ro: "Inspecție"
      },

      travel: {
        uk: "Виїзд",
        cs: "Výjezd",
        sl: "Izvoz",
        sk: "Výjazd",
        de: "Anfahrt",
        en: "Call-out",
        hr: "Izlazak",
        sr: "Izlazak",
        it: "Uscita",
        hu: "Kiszállás",
        pl: "Dojazd",
        ro: "Deplasare"
      }
    };

    return (
      fallback[category]?.[lang] ||
      category
    );
  }

  /* =========================
     RENDER PRICES
  ========================= */

  function renderPrices() {
    const grid =
      $("#price-grid");

    if (!grid) {
      return;
    }

    const country =
      getCountry(
        $("#price-country")?.value ||
        localStorage.getItem(
          "wond-price-country"
        ) ||
        DEFAULT_COUNTRY
      );

    if (!country) {
      grid.innerHTML = "";
      return;
    }

    const countryCode =
      String(
        country.code
      ).toUpperCase();

    const currency =
      getCurrency(country);

    const vatPercent =
      getVatPercent(
        countryCode
      );

    const vatRate =
      vatPercent / 100;

    const mode =
      getVatMode();

    const services =
      getServices();

    const groups = {};

    services.forEach(item => {
      const category =
        item.category ||
        "other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);
    });

    let html = "";

    Object.keys(groups)
      .forEach(category => {
        html += `
          <section
            class="price-category"
            data-category="${escapeHtml(
              category
            )}"
          >

            <div class="price-category-title">
              ${escapeHtml(
                getCategoryName(
                  category
                )
              )}
            </div>

            <div class="price-category-items">
        `;

        groups[category]
          .forEach(item => {
            const itemKey =
              getItemKey(item);

            if (!itemKey) {
              return;
            }

            const net =
              getLocalPrice(
                countryCode,
                itemKey
              );

            /*
             * Якщо ціни немає —
             * просто не показуємо помилковий рядок.
             */
            if (
              net === null ||
              !Number.isFinite(net)
            ) {
              return;
            }

            const gross =
              net * (
                1 + vatRate
              );

            const name =
              getServiceName(item);

            const unit =
              item.unit || "";

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
                  ${escapeHtml(unit)}
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
                  ${escapeHtml(unit)}
                </div>
              `;
            }

            if (mode === "both") {
              priceHtml = `
                <div class="price-value price-both">

                  <div>
                    <small>
                      ${escapeHtml(
                        ui("without")
                      )}
                    </small>

                    <strong>
                      ${escapeHtml(
                        formatPrice(
                          net,
                          currency
                        )
                      )}
                    </strong>
                  </div>

                  <div>
                    <small>
                      ${escapeHtml(
                        ui("with")
                      )}
                    </small>

                    <strong>
                      ${escapeHtml(
                        formatPrice(
                          gross,
                          currency
                        )
                      )}
                    >
                  </div>

                </div>
              `;
            }

            html += `
              <article
                class="price-item"
                data-service="${escapeHtml(
                  itemKey
                )}"
              >

                <div class="price-name">
                  ${escapeHtml(name)}
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

    if (!html) {
      html = `
        <div class="price-empty">
          —
        </div>
      `;
    }

    grid.innerHTML = html;

    /*
     * Дані доступні також для CSS / інших скриптів.
     */
    grid.dataset.country =
      countryCode;

    grid.dataset.currency =
      currency;

    grid.dataset.vat =
      String(vatPercent);

    grid.dataset.mode =
      mode;
  }

  /* =========================
     EVENTS
  ========================= */

  function bindEvents() {
    const country =
      $("#price-country");

    if (
      country &&
      !country.dataset.wondPriceBound
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

      country.dataset.wondPriceBound =
        "1";
    }

    const vat =
      $("#vat-mode");

    if (
      vat &&
      !vat.dataset.wondPriceBound
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

      vat.dataset.wondPriceBound =
        "1";
    }

    /*
     * Підключення до основної зміни мови.
     */
    if (
      !window.WOND_PRICE_LANGUAGE_BOUND
    ) {
      window.WOND_PRICE_LANGUAGE_BOUND =
        true;

      window.addEventListener(
        "wond:language-change",
        event => {
          if (
            event?.detail?.lang
          ) {
            window.WOND_LANG =
              event.detail.lang;

            localStorage.setItem(
              "wond-lang",
              event.detail.lang
            );
          }

          renderCountrySelect();
          renderVatMode();
          renderPrices();
        }
      );
    }
  }

  /* =========================
     ESCAPE
  ========================= */

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================
     PUBLIC API
  ========================= */

  window.WOND_PRICE_VAT = {
    render: () => {
      renderCountrySelect();
      renderVatMode();
      renderPrices();
    },

    renderPrices,

    renderCountrySelect,

    getCountry,

    getVatRate,

    getVatPercent,

    calculateGross,

    getLocalPrice,

    formatPrice
  };

  /* =========================
     INIT
  ========================= */

  function init() {
    renderCountrySelect();
    renderVatMode();
    renderPrices();
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

