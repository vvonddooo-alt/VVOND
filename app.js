(() => {
  "use strict";

  /* =========================================================
     SUPABASE
  ========================================================= */

  const cfg = window.WOND_SUPABASE || {};

  const configured =
    cfg.url &&
    cfg.anonKey &&
    !cfg.url.includes("PASTE_") &&
    !cfg.anonKey.includes("PASTE_");

  const sb =
    window.supabase && configured
      ? window.supabase.createClient(cfg.url, cfg.anonKey)
      : null;


  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const langs = window.WOND_LANGS || [
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

  let lang = getLang();

  let session = null;
  let profile = null;

  let countries = window.WOND_COUNTRIES || [];
  let services = window.WOND_PRICE_ITEMS || [];
  let translations = window.WOND_PRICE_TRANSLATIONS || {};
  let localPrices = window.WOND_LOCAL_PRICES || {};


  /* =========================================================
     FIXED VAT RATES
     These rates are used for price calculation.
  ========================================================= */

  const FIXED_VAT_RATES = {
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
     UI TRANSLATIONS
  ========================================================= */

  const ui = {
    uk: {
      country: "Країна",
      price: "Ціна",
      service: "Послуга",
      without: "Без ПДВ",
      with: "З ПДВ",
      both: "Обидва",
      prices_title: "Повний прайс-лист послуг",
      prices_lead: "Орієнтовні ціни. Кінцева ціна залежить від обсягу та складності роботи.",
      notice: "Виїзд на місце до 50 км: 500 Kč",
      area: "Зона роботи: Брно та околиці.",
      prices_countries: "Ціни за країнами",
      save_prices: "Зберегти ціни",
      not_configured: "Supabase ще не налаштовано."
    },

    cs: {
      country: "Země",
      price: "Cena",
      service: "Služba",
      without: "Bez DPH",
      with: "Včetně DPH",
      both: "Obojí",
      prices_title: "Kompletní ceník služeb",
      prices_lead: "Orientační ceny. Konečná cena závisí na rozsahu a náročnosti práce.",
      notice: "Výjezd na místo do 50 km: 500 Kč",
      area: "Oblast působení: Brno a okolí.",
      prices_countries: "Ceny podle zemí",
      save_prices: "Uložit ceny",
      not_configured: "Supabase není nakonfigurováno."
    },

    sl: {
      country: "Država",
      price: "Cena",
      service: "Storitev",
      without: "Brez DDV",
      with: "Z DDV",
      both: "Oboje",
      prices_title: "Celoten cenik storitev",
      prices_lead: "Okvirne cene. Končna cena je odvisna od obsega in zahtevnosti dela.",
      notice: "Izvoz na lokacijo do 50 km: 500 Kč",
      area: "Območje dela: Brno in okolica.",
      prices_countries: "Cene po državah",
      save_prices: "Shrani cene",
      not_configured: "Supabase ni konfiguriran."
    },

    sk: {
      country: "Krajina",
      price: "Cena",
      service: "Služba",
      without: "Bez DPH",
      with: "S DPH",
      both: "Oboje",
      prices_title: "Kompletný cenník služieb",
      prices_lead: "Orientačné ceny. Konečná cena závisí od rozsahu a náročnosti práce.",
      notice: "Výjazd na miesto do 50 km: 500 Kč",
      area: "Oblasť pôsobenia: Brno a okolie.",
      prices_countries: "Ceny podľa krajín",
      save_prices: "Uložiť ceny",
      not_configured: "Supabase nie je nakonfigurované."
    },

    de: {
      country: "Land",
      price: "Preis",
      service: "Leistung",
      without: "Ohne MwSt.",
      with: "Inkl. MwSt.",
      both: "Beide",
      prices_title: "Komplette Preisliste",
      prices_lead: "Richtpreise. Der Endpreis hängt vom Umfang und Schwierigkeitsgrad der Arbeit ab.",
      notice: "Anfahrt bis 50 km: 500 Kč",
      area: "Einsatzgebiet: Brünn und Umgebung.",
      prices_countries: "Preise nach Ländern",
      save_prices: "Preise speichern",
      not_configured: "Supabase ist nicht konfiguriert."
    },

    en: {
      country: "Country",
      price: "Price",
      service: "Service",
      without: "Without VAT",
      with: "With VAT",
      both: "Both",
      prices_title: "Complete service price list",
      prices_lead: "Indicative prices. The final price depends on the scope and complexity of the work.",
      notice: "Travel to site up to 50 km: 500 Kč",
      area: "Service area: Brno and surroundings.",
      prices_countries: "Prices by country",
      save_prices: "Save prices",
      not_configured: "Supabase is not configured."
    },

    hr: {
      country: "Država",
      price: "Cijena",
      service: "Usluga",
      without: "Bez PDV-a",
      with: "S PDV-om",
      both: "Oboje",
      prices_title: "Kompletan cjenik usluga",
      prices_lead: "Okvirne cijene. Konačna cijena ovisi o opsegu i složenosti rada.",
      notice: "Dolazak na lokaciju do 50 km: 500 Kč",
      area: "Područje rada: Brno i okolica.",
      prices_countries: "Cijene po državama",
      save_prices: "Spremi cijene",
      not_configured: "Supabase nije konfiguriran."
    },

    sr: {
      country: "Država",
      price: "Cena",
      service: "Usluga",
      without: "Bez PDV-a",
      with: "Sa PDV-om",
      both: "Oboje",
      prices_title: "Kompletan cenovnik usluga",
      prices_lead: "Okvirne cene. Konačna cena zavisi od obima i složenosti rada.",
      notice: "Dolazak na lokaciju do 50 km: 500 Kč",
      area: "Područje rada: Brno i okolina.",
      prices_countries: "Cene po državama",
      save_prices: "Sačuvaj cene",
      not_configured: "Supabase nije konfigurisan."
    },

    it: {
      country: "Paese",
      price: "Prezzo",
      service: "Servizio",
      without: "Senza IVA",
      with: "Con IVA",
      both: "Entrambi",
      prices_title: "Listino completo dei servizi",
      prices_lead: "Prezzi indicativi. Il prezzo finale dipende dall'entità e dalla complessità del lavoro.",
      notice: "Trasferta fino a 50 km: 500 Kč",
      area: "Area di lavoro: Brno e dintorni.",
      prices_countries: "Prezzi per paese",
      save_prices: "Salva prezzi",
      not_configured: "Supabase non è configurato."
    },

    hu: {
      country: "Ország",
      price: "Ár",
      service: "Szolgáltatás",
      without: "ÁFA nélkül",
      with: "ÁFÁ-val",
      both: "Mindkettő",
      prices_title: "Teljes szolgáltatási árlista",
      prices_lead: "Tájékoztató árak. A végső ár a munka mennyiségétől és összetettségétől függ.",
      notice: "Kiszállás 50 km-ig: 500 Kč",
      area: "Munkaterület: Brno és környéke.",
      prices_countries: "Árak országonként",
      save_prices: "Árak mentése",
      not_configured: "A Supabase nincs konfigurálva."
    },

    pl: {
      country: "Kraj",
      price: "Cena",
      service: "Usługa",
      without: "Bez VAT",
      with: "Z VAT",
      both: "Obie",
      prices_title: "Pełny cennik usług",
      prices_lead: "Ceny orientacyjne. Cena końcowa zależy od zakresu i trudności prac.",
      notice: "Dojazd do 50 km: 500 Kč",
      area: "Obszar działania: Brno i okolice.",
      prices_countries: "Ceny według krajów",
      save_prices: "Zapisz ceny",
      not_configured: "Supabase nie jest skonfigurowane."
    },

    ro: {
      country: "Țara",
      price: "Preț",
      service: "Serviciu",
      without: "Fără TVA",
      with: "Cu TVA",
      both: "Ambele",
      prices_title: "Lista completă de prețuri",
      prices_lead: "Prețuri orientative. Prețul final depinde de amploarea și complexitatea lucrării.",
      notice: "Deplasare până la 50 km: 500 Kč",
      area: "Zona de lucru: Brno și împrejurimi.",
      prices_countries: "Prețuri pe țări",
      save_prices: "Salvează prețurile",
      not_configured: "Supabase nu este configurat."
    }
  };


  /* =========================================================
     TRANSLATION HELPERS
  ========================================================= */

  const t = (key, fallback = "") => {
    const current = window.WOND_TRANSLATIONS?.[lang] || {};
    const cs = window.WOND_TRANSLATIONS?.cs || {};

    return (
      current[key] ||
      cs[key] ||
      fallback ||
      key
    );
  };

  const u = (key) => {
    return (
      ui[lang]?.[key] ||
      ui.en?.[key] ||
      key
    );
  };


  /* =========================================================
     LANGUAGE
  ========================================================= */

  function getLang() {
    const queryLang = new URLSearchParams(location.search).get("lang");

    if (queryLang && langs.includes(queryLang)) {
      return queryLang;
    }

    const saved = localStorage.getItem("wond-lang");

    if (saved && langs.includes(saved)) {
      return saved;
    }

    const browserLang = (navigator.language || "cs").slice(0, 2);

    return langs.includes(browserLang)
      ? browserLang
      : "cs";
  }


  function setLang(newLang) {
    lang = langs.includes(newLang)
      ? newLang
      : "cs";

    localStorage.setItem("wond-lang", lang);

    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState({}, "", url);

    document.documentElement.lang = lang;

    document.title = `WOND — ${t("nav_services")}`;

    $$("[data-i18n]").forEach((el) => {
      const value = t(el.dataset.i18n);

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        el.innerHTML = value;
      }
    });

    const languageSelect = $("#language");

    if (languageSelect) {
      languageSelect.value = lang;
    }

    renderCountrySelect();
    renderPrices();
  }


  /* =========================================================
     VAT / COUNTRY NORMALIZATION
  ========================================================= */

  function normalizeCountry(country) {
    const rawCode = String(
      country?.code || ""
    ).trim().toUpperCase();

    const staticCountry =
      (window.WOND_COUNTRIES || []).find(
        (item) => item.code === rawCode
      ) || {};

    const fixedVat =
      FIXED_VAT_RATES[rawCode];

    const dbVat = Number(
      country?.vat_rate ??
      country?.vat
    );

    const staticVat = Number(
      staticCountry?.vat ??
      staticCountry?.vat_rate ??
      0
    );

    let vat = 0;

    /*
      Priority:
      1. Fixed VAT table
      2. Supabase VAT
      3. Static VAT
    */

    if (
      Number.isFinite(fixedVat) &&
      fixedVat > 0
    ) {
      vat = fixedVat;
    } else if (
      Number.isFinite(dbVat) &&
      dbVat > 0
    ) {
      vat = dbVat;
    } else if (
      Number.isFinite(staticVat) &&
      staticVat > 0
    ) {
      vat = staticVat;
    }

    return {
      ...staticCountry,
      ...country,

      code: rawCode,

      vat: vat,
      vat_rate: vat
    };
  }


  function normalizeCountries(list) {
    const staticList =
      window.WOND_COUNTRIES || [];

    const dbList = Array.isArray(list)
      ? list
      : [];

    const dbByCode = new Map();

    dbList.forEach((country) => {
      const code = String(
        country?.code || ""
      ).trim().toUpperCase();

      if (code) {
        dbByCode.set(code, country);
      }
    });

    const result = [];

    /*
      First keep all static countries.
      If Supabase has matching country data,
      merge it with the static country.
    */

    staticList.forEach((staticCountry) => {
      const code = String(
        staticCountry.code || ""
      ).trim().toUpperCase();

      const dbCountry =
        dbByCode.get(code);

      result.push(
        normalizeCountry(
          dbCountry || staticCountry
        )
      );
    });

    /*
      Add any extra countries that exist
      only in Supabase.
    */

    dbList.forEach((country) => {
      const code = String(
        country?.code || ""
      ).trim().toUpperCase();

      if (
        code &&
        !result.some(
          (item) => item.code === code
        )
      ) {
        result.push(
          normalizeCountry(country)
        );
      }
    });

    return result;
  }


  function getVatRate(country) {
    if (!country) {
      return 0;
    }

    const code = String(
      country.code || ""
    ).trim().toUpperCase();

    /*
      Always prefer our fixed VAT table.
      This prevents a wrong 0 / NULL / outdated
      value in Supabase from breaking the calculation.
    */

    if (
      Number.isFinite(FIXED_VAT_RATES[code]) &&
      FIXED_VAT_RATES[code] > 0
    ) {
      return FIXED_VAT_RATES[code];
    }

    const vatRate = Number(
      country.vat_rate ??
      country.vat ??
      0
    );

    return Number.isFinite(vatRate) &&
      vatRate > 0
      ? vatRate
      : 0;
  }


  function calculateGross(net, vatRate) {
    const value = Number(net) || 0;
    const vat = Number(vatRate) || 0;

    return value * (1 + vat);
  }


  /* =========================================================
     COUNTRY NAME
  ========================================================= */

  function countryName(code, fallback = "") {
    return (
      window.WOND_COUNTRY_NAMES?.[lang]?.[code] ||
      window.WOND_COUNTRY_NAMES?.en?.[code] ||
      fallback ||
      code
    );
  }


  /* =========================================================
     COUNTRY SELECT
  ========================================================= */

  function renderCountrySelect() {
    const select = $("#price-country");

    if (!select) {
      return;
    }

    const savedCountry =
      localStorage.getItem("wond-country") ||
      "CZ";

    const currentValue =
      select.value || savedCountry;

    select.innerHTML = "";

    countries
      .filter((country) => {
        return country.active !== false;
      })
      .forEach((country) => {
        const option =
          document.createElement("option");

        option.value = country.code;

        option.textContent =
          countryName(
            country.code,
            country.name
          );

        select.appendChild(option);
      });

    const exists = countries.some(
      (country) =>
        country.code === currentValue &&
        country.active !== false
    );

    if (exists) {
      select.value = currentValue;
    } else if (select.options.length) {
      select.value = "CZ";

      if (
        ![...select.options].some(
          (option) => option.value === "CZ"
        )
      ) {
        select.selectedIndex = 0;
      }
    }

    localStorage.setItem(
      "wond-country",
      select.value
    );

    const vatMode = $("#vat-mode");

    if (vatMode) {
      const without =
        vatMode.querySelector(
          'option[value="net"]'
        );

      const withVat =
        vatMode.querySelector(
          'option[value="gross"]'
        );

      const both =
        vatMode.querySelector(
          'option[value="both"]'
        );

      if (without) {
        without.textContent =
          u("without");
      }

      if (withVat) {
        withVat.textContent =
          u("with");
      }

      if (both) {
        both.textContent =
          u("both");
      }
    }
  }


  /* =========================================================
     SERVICES
  ========================================================= */

  function serviceName(
    key,
    rawName
  ) {
    return (
      translations?.[key]?.[lang] ||
      translations?.[key]?.en ||
      rawName ||
      key
    );
  }


  function categoryName(category) {
    return (
      window.WOND_CATEGORY_NAMES?.[lang]?.[category] ||
      window.WOND_CATEGORY_NAMES?.en?.[category] ||
      t(category, category)
    );
  }


  /* =========================================================
     NUMBER FORMAT
  ========================================================= */

  function fmt(number, currency) {
    const value = Number(number) || 0;

    /*
      HUF usually doesn't use decimal display here.
      All other currencies use two decimals.
    */

    const decimals =
      currency === "HUF"
        ? 0
        : 2;

    return (
      new Intl.NumberFormat(lang, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value) +
      " " +
      currency
    );
  }


  /* =========================================================
     PRICE RENDER
  ========================================================= */

  function renderPrices() {
    const grid = $("#price-grid");

    if (!grid) {
      return;
    }

    const mode =
      $("#vat-mode")?.value ||
      "net";

    const countryCode =
      $("#price-country")?.value ||
      localStorage.getItem("wond-country") ||
      "CZ";

    const country =
      countries.find(
        (item) =>
          item.code === countryCode
      ) ||
      countries.find(
        (item) => item.code === "CZ"
      ) ||
      countries[0];

    if (!country) {
      grid.innerHTML = "";
      return;
    }

    const vatRate =
      getVatRate(country);

    const groups = {};

    services
      .filter(
        (service) =>
          service.active !== false
      )
      .forEach((service) => {
        if (
          !groups[service.category]
        ) {
          groups[service.category] = [];
        }

        groups[
          service.category
        ].push(service);
      });

    grid.innerHTML = "";

    Object.entries(groups)
      .forEach(
        ([category, rows]) => {

          const card =
            document.createElement("div");

          card.className =
            "price-card";


          const title =
            document.createElement("h3");

          title.textContent =
            categoryName(category);


          const table =
            document.createElement("table");


          const thead =
            document.createElement("thead");


          const headerRow =
            document.createElement("tr");


          const serviceHeader =
            document.createElement("th");

          serviceHeader.textContent =
            u("service");


          const priceHeader =
            document.createElement("th");

          priceHeader.textContent =
            u("price");


          headerRow.append(
            serviceHeader,
            priceHeader
          );

          thead.append(
            headerRow
          );


          const tbody =
            document.createElement("tbody");


          rows.forEach((service) => {

            const tr =
              document.createElement("tr");


            const nameCell =
              document.createElement("td");


            const priceCell =
              document.createElement("td");


            nameCell.textContent =
              serviceName(
                service.item_key,
                service.default_name
              );


            const rawPrice =
              Number(
                localPrices?.[
                  countryCode
                ]?.[
                  service.item_key
                ] ?? 0
              );


            /*
              Report is intentionally
              displayed as "by scope".
            */

            if (
              service.item_key === "report" &&
              rawPrice === 0
            ) {

              priceCell.textContent =
                t(
                  "by_scope",
                  "dle rozsahu"
                );

            } else {

              const net =
                rawPrice;

              const gross =
                calculateGross(
                  net,
                  vatRate
                );

              const unit =
                service.unit || "";


              if (mode === "gross") {

                priceCell.textContent =
                  fmt(
                    gross,
                    country.currency
                  ) + unit;

              } else if (
                mode === "both"
              ) {

                priceCell.textContent =
                  `${fmt(
                    net,
                    country.currency
                  )}${unit} / ${fmt(
                    gross,
                    country.currency
                  )}${unit}`;

              } else {

                priceCell.textContent =
                  fmt(
                    net,
                    country.currency
                  ) + unit;
              }
            }


            tr.append(
              nameCell,
              priceCell
            );

            tbody.appendChild(tr);
          });


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
  }


  /* =========================================================
     AUTH / PROFILE
  ========================================================= */

  async function loadProfile() {
    if (!sb || !session?.user) {
      profile = null;
      return;
    }

    try {
      const { data, error } =
        await sb
          .from("profiles")
          .select("*")
          .eq(
            "id",
            session.user.id
          )
          .maybeSingle();

      if (error) {
        console.error(
          "Profile load error:",
          error
        );

        profile = null;
        return;
      }

      profile = data || null;

      updateAdminUI();

    } catch (error) {
      console.error(
        "Profile error:",
        error
      );
    }
  }


  function updateAdminUI() {
    const admin =
      $("#admin");

    const login =
      $("#login");

    if (admin) {
      admin.hidden =
        !session;
    }

    if (login) {
      login.hidden =
        !!session;
    }
  }


  /* =========================================================
     PUBLIC DATA
  ========================================================= */

  async function loadPublic() {
    if (!sb) {
      return;
    }

    try {

      /* -----------------------------------------
         SITE CONTENT
      ----------------------------------------- */

      try {
        const { data, error } =
          await sb
            .from("site_content")
            .select("*");

        if (!error && data) {
          /*
            Keep existing application logic compatible
            with whatever structure is already used.
          */

          window.WOND_SITE_CONTENT =
            data;
        }

      } catch (error) {
        console.warn(
          "site_content:",
          error
        );
      }


      /* -----------------------------------------
         COUNTRIES
      ----------------------------------------- */

      const {
        data: countryRows,
        error: countryError
      } = await sb
        .from("countries")
        .select("*")
        .order("sort_order");

      if (countryError) {
        console.warn(
          "countries:",
          countryError
        );

        countries =
          normalizeCountries(
            window.WOND_COUNTRIES || []
          );

      } else {

        countries =
          normalizeCountries(
            countryRows?.length
              ? countryRows
              : window.WOND_COUNTRIES || []
          );
      }


      /* -----------------------------------------
         COUNTRY TRANSLATIONS
      ----------------------------------------- */

      try {

        const {
          data: countryTranslations,
          error
        } = await sb
          .from("country_translations")
          .select("*");

        if (
          !error &&
          countryTranslations
        ) {

          window.WOND_COUNTRY_DB_TRANSLATIONS =
            countryTranslations;
        }

      } catch (error) {

        console.warn(
          "country_translations:",
          error
        );
      }


      /* -----------------------------------------
         SERVICE ITEMS
      ----------------------------------------- */

      try {

        const {
          data: serviceRows,
          error
        } = await sb
          .from("service_items")
          .select("*")
          .order("sort_order");

        if (
          !error &&
          serviceRows?.length
        ) {

          services =
            serviceRows;
        }

      } catch (error) {

        console.warn(
          "service_items:",
          error
        );
      }


      /* -----------------------------------------
         SERVICE TRANSLATIONS
      ----------------------------------------- */

      try {

        const {
          data: serviceTranslationRows,
          error
        } = await sb
          .from("service_translations")
          .select("*");

        if (
          !error &&
          serviceTranslationRows
        ) {

          const mapped = {};

          serviceTranslationRows
            .forEach((row) => {

              const key =
                row.item_key ||
                row.service_key;

              if (!key) {
                return;
              }

              if (!mapped[key]) {
                mapped[key] = {};
              }

              const language =
                row.lang ||
                row.language;

              const value =
                row.name ||
                row.label ||
                row.translation;

              if (
                language &&
                value
              ) {
                mapped[key][language] =
                  value;
              }
            });

          translations = {
            ...translations,
            ...mapped
          };
        }

      } catch (error) {

        console.warn(
          "service_translations:",
          error
        );
      }


      /* -----------------------------------------
         COUNTRY PRICES
      ----------------------------------------- */

      try {

        const {
          data: priceRows,
          error
        } = await sb
          .from("country_prices")
          .select("*");

        if (
          !error &&
          priceRows
        ) {

          const mergedPrices = {
            ...(window.WOND_LOCAL_PRICES || {})
          };

          priceRows.forEach((row) => {

            const countryCode =
              String(
                row.country_code ||
                row.code ||
                ""
              )
                .trim()
                .toUpperCase();

            const itemKey =
              row.item_key ||
              row.service_key;

            if (
              !countryCode ||
              !itemKey
            ) {
              return;
            }

            if (
              !mergedPrices[countryCode]
            ) {
              mergedPrices[
                countryCode
              ] = {};
            }

            const value =
              Number(
                row.price ??
                row.amount ??
                0
              );

            if (
              Number.isFinite(value)
            ) {
              mergedPrices[
                countryCode
              ][itemKey] =
                value;
            }
          });

          localPrices =
            mergedPrices;
        }

      } catch (error) {

        console.warn(
          "country_prices:",
          error
        );
      }


      /*
        Re-render after all public data
        has been loaded.
      */

      setLang(lang);

      /*
        Optional gallery loading if the
        existing page has gallery logic.
      */

      if (
        typeof window.WOND_LOAD_GALLERY ===
        "function"
      ) {
        try {
          await window.WOND_LOAD_GALLERY();
        } catch (error) {
          console.warn(
            "Gallery:",
            error
          );
        }
      }

    } catch (error) {

      console.error(
        "loadPublic error:",
        error
      );

      countries =
        normalizeCountries(
          window.WOND_COUNTRIES || []
        );

      services =
        window.WOND_PRICE_ITEMS || [];

      translations =
        window.WOND_PRICE_TRANSLATIONS || {};

      localPrices =
        window.WOND_LOCAL_PRICES || {};

      setLang(lang);
    }
  }


  /* =========================================================
     EVENT LISTENERS
  ========================================================= */

  function bindEvents() {

    /* -----------------------------------------
       LANGUAGE
    ----------------------------------------- */

    const languageSelect =
      $("#language");

    if (languageSelect) {

      languageSelect.value =
        lang;

      languageSelect.addEventListener(
        "change",
        (event) => {

          setLang(
            event.target.value
          );
        }
      );
    }


    /* -----------------------------------------
       COUNTRY
    ----------------------------------------- */

    const publicCountrySelect =
      $("#price-country");

    if (publicCountrySelect) {

      publicCountrySelect.addEventListener(
        "change",
        (event) => {

          const countryCode =
            String(
              event.target.value || "CZ"
            )
              .trim()
              .toUpperCase();

          localStorage.setItem(
            "wond-country",
            countryCode
          );

          renderPrices();
        }
      );
    }


    /* -----------------------------------------
       VAT MODE
    ----------------------------------------- */

    const vatModeSelect =
      $("#vat-mode");

    if (vatModeSelect) {

      const savedMode =
        localStorage.getItem(
          "wond-vat-mode"
        );

      if (
        savedMode === "net" ||
        savedMode === "gross" ||
        savedMode === "both"
      ) {
        vatModeSelect.value =
          savedMode;
      }

      vatModeSelect.addEventListener(
        "change",
        (event) => {

          const mode =
            event.target.value;

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
     DEBUG HELPER
     You can run in browser console:
       WOND_DEBUG_VAT()
  ========================================================= */

  window.WOND_DEBUG_VAT = () => {

    const code =
      $("#price-country")?.value ||
      "CZ";

    const country =
      countries.find(
        (item) => item.code === code
      );

    const vat =
      getVatRate(country);

    console.table({
      country: code,
      currency: country?.currency,
      vatRate: vat,
      vatPercent:
        `${Math.round(vat * 100)}%`,
      exampleNet: 450,
      exampleGross:
        calculateGross(450, vat)
    });

    return {
      country,
      vatRate: vat,
      gross:
        calculateGross(
          450,
          vat
        )
    };
  };


  /* =========================================================
     INIT
  ========================================================= */

  async function init() {

    /*
      First render using static data.
      This means prices work even before
      Supabase finishes loading.
    */

    countries =
      normalizeCountries(
        window.WOND_COUNTRIES || []
      );

    services =
      window.WOND_PRICE_ITEMS || [];

    translations =
      window.WOND_PRICE_TRANSLATIONS || {};

    localPrices =
      window.WOND_LOCAL_PRICES || {};


    bindEvents();

    setLang(lang);


    /* -----------------------------------------
       SUPABASE NOT CONFIGURED
    ----------------------------------------- */

    if (!sb) {

      const warning =
        $("#admin-config-warning");

      if (warning) {

        warning.hidden = false;

        warning.textContent =
          t(
            "not_configured",
            "Supabase není nakonfigurováno."
          );
      }

      return;
    }


    /* -----------------------------------------
       SESSION
    ----------------------------------------- */

    try {

      const {
        data: {
          session: currentSession
        }
      } = await sb.auth.getSession();

      session =
        currentSession;

      if (session) {
        await loadProfile();
      }

      sb.auth.onAuthStateChange(
        (_event, currentSession) => {

          session =
            currentSession;

          setTimeout(
            () => {
              loadProfile();
            },
            0
          );
        }
      );

    } catch (error) {

      console.error(
        "Auth:",
        error
      );
    }


    /* -----------------------------------------
       LOAD PUBLIC DATA
    ----------------------------------------- */

    await loadPublic();
  }


  /* =========================================================
     START
  ========================================================= */

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

})();
