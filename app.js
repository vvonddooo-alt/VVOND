(() => {
  "use strict";

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

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const langs = window.WOND_LANGS || [];

  let lang = getLang();
  let session = null;
  let profile = null;

  let countries = window.WOND_COUNTRIES || [];
  let services = window.WOND_PRICE_ITEMS || [];
  let translations = window.WOND_PRICE_TRANSLATIONS || {};
  let localPrices = window.WOND_LOCAL_PRICES || {};

  const ui = {
    uk: {
      country: "Країна",
      price: "Ціна",
      service: "Робота",
      currency: "Валюта",
      without: "Без ПДВ",
      with: "З ПДВ",
      both: "Обидва",
      prices_admin: "Ціни по країнах",
      price_country: "Країна для цін",
      translations_admin: "Переклади робіт",
      translation_lang: "Мова перекладів",
      save_prices: "Зберегти ціни",
      save_translations: "Зберегти переклади",
      category: "Категорія",
      unit: "Одиниця"
    },

    cs: {
      country: "Země",
      price: "Cena",
      service: "Služba",
      currency: "Měna",
      without: "Bez DPH",
      with: "Včetně DPH",
      both: "Obojí",
      prices_admin: "Ceny podle zemí",
      price_country: "Země pro ceny",
      translations_admin: "Překlady služeb",
      translation_lang: "Jazyk překladů",
      save_prices: "Uložit ceny",
      save_translations: "Uložit překlady",
      category: "Kategorie",
      unit: "Jednotka"
    },

    sl: {
      country: "Država",
      price: "Cena",
      service: "Storitev",
      currency: "Valuta",
      without: "Brez DDV",
      with: "Z DDV",
      both: "Oboje",
      prices_admin: "Cene po državah",
      price_country: "Država za cene",
      translations_admin: "Prevodi storitev",
      translation_lang: "Jazyk prevodov",
      save_prices: "Shrani cene",
      save_translations: "Shrani prevode",
      category: "Kategorija",
      unit: "Enota"
    },

    sk: {
      country: "Krajina",
      price: "Cena",
      service: "Služba",
      currency: "Mena",
      without: "Bez DPH",
      with: "S DPH",
      both: "Oboje",
      prices_admin: "Ceny podľa krajín",
      price_country: "Krajina pre ceny",
      translations_admin: "Preklady služieb",
      translation_lang: "Jazyk prekladov",
      save_prices: "Uložiť ceny",
      save_translations: "Uložiť preklady",
      category: "Kategória",
      unit: "Jednotka"
    },

    de: {
      country: "Land",
      price: "Preis",
      service: "Leistung",
      currency: "Währung",
      without: "Ohne MwSt.",
      with: "Inkl. MwSt.",
      both: "Beides",
      prices_admin: "Preise nach Ländern",
      price_country: "Land für Preise",
      translations_admin: "Übersetzungen der Leistungen",
      translation_lang: "Sprache der Übersetzungen",
      save_prices: "Preise speichern",
      save_translations: "Übersetzungen speichern",
      category: "Kategorie",
      unit: "Einheit"
    },

    en: {
      country: "Country",
      price: "Price",
      service: "Service",
      currency: "Currency",
      without: "Without VAT",
      with: "With VAT",
      both: "Both",
      prices_admin: "Prices by country",
      price_country: "Country for prices",
      translations_admin: "Service translations",
      translation_lang: "Translation language",
      save_prices: "Save prices",
      save_translations: "Save translations",
      category: "Category",
      unit: "Unit"
    },

    hr: {
      country: "Država",
      price: "Cijena",
      service: "Usluga",
      currency: "Valuta",
      without: "Bez PDV-a",
      with: "S PDV-om",
      both: "Oboje",
      prices_admin: "Cijene po državama",
      price_country: "Država za cijene",
      translations_admin: "Prijevodi usluga",
      translation_lang: "Jezik prijevoda",
      save_prices: "Spremi cijene",
      save_translations: "Spremi prijevode",
      category: "Kategorija",
      unit: "Jedinica"
    },

    sr: {
      country: "Država",
      price: "Cena",
      service: "Usluga",
      currency: "Valuta",
      without: "Bez PDV-a",
      with: "Sa PDV-om",
      both: "Oboje",
      prices_admin: "Cene po državama",
      price_country: "Država za cene",
      translations_admin: "Prevodi usluga",
      translation_lang: "Jezik prevoda",
      save_prices: "Sačuvaj cene",
      save_translations: "Sačuvaj prevode",
      category: "Kategorija",
      unit: "Jedinica"
    },

    it: {
      country: "Paese",
      price: "Prezzo",
      service: "Servizio",
      currency: "Valuta",
      without: "Senza IVA",
      with: "Con IVA",
      both: "Entrambi",
      prices_admin: "Prezzi per paese",
      price_country: "Paese per i prezzi",
      translations_admin: "Traduzioni dei servizi",
      translation_lang: "Lingua delle traduzioni",
      save_prices: "Salva prezzi",
      save_translations: "Salva traduzioni",
      category: "Categoria",
      unit: "Unità"
    },

    hu: {
      country: "Ország",
      price: "Ár",
      service: "Szolgáltatás",
      currency: "Pénznem",
      without: "ÁFA nélkül",
      with: "ÁFÁ-val",
      both: "Mindkettő",
      prices_admin: "Országonkénti árak",
      price_country: "Árlista országa",
      translations_admin: "Szolgáltatásfordítások",
      translation_lang: "Fordítás nyelve",
      save_prices: "Árak mentése",
      save_translations: "Fordítások mentése",
      category: "Kategória",
      unit: "Egység"
    },

    pl: {
      country: "Kraj",
      price: "Cena",
      service: "Usługa",
      currency: "Waluta",
      without: "Bez VAT",
      with: "Z VAT",
      both: "Obie",
      prices_admin: "Ceny według krajów",
      price_country: "Kraj dla cen",
      translations_admin: "Tłumaczenia usług",
      translation_lang: "Język tłumaczeń",
      save_prices: "Zapisz ceny",
      save_translations: "Zapisz tłumaczenia",
      category: "Kategoria",
      unit: "Jednostka"
    },

    ro: {
      country: "Țară",
      price: "Preț",
      service: "Serviciu",
      currency: "Monedă",
      without: "Fără TVA",
      with: "Cu TVA",
      both: "Ambele",
      prices_admin: "Prețuri pe țări",
      price_country: "Țara pentru prețuri",
      translations_admin: "Traduceri servicii",
      translation_lang: "Limba traducerilor",
      save_prices: "Salvează prețurile",
      save_translations: "Salvează traducerile",
      category: "Categorie",
      unit: "Unitate"
    }
  };

  /* =========================================================
     TRANSLATIONS
  ========================================================= */

  const t = (key, fallback = "") => {
    const current = window.WOND_TRANSLATIONS?.[lang] || {};
    const cs = window.WOND_TRANSLATIONS?.cs || {};

    return current[key] || cs[key] || fallback || key;
  };

  const u = (key) => ui[lang]?.[key] || ui.en[key] || key;

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

    return langs.includes(browserLang) ? browserLang : "cs";
  }

  function setLang(newLang) {
    lang = langs.includes(newLang) ? newLang : "cs";

    localStorage.setItem("wond-lang", lang);

    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState({}, "", url);

    document.documentElement.lang = lang;

    document.title = `WOND — ${t("nav_services")}`;

    $$("[data-i18n]").forEach((el) => {
      const value = t(el.dataset.i18n);

      if (value !== undefined && value !== null) {
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

  const langSelect = $("#language");

  if (langSelect) {
    langs.forEach((l) => {
      const option = document.createElement("option");

      option.value = l;
      option.textContent =
        window.WOND_TRANSLATIONS?.[l]?.name || l.toUpperCase();

      langSelect.append(option);
    });

    langSelect.addEventListener("change", (event) => {
      setLang(event.target.value);
    });
  }

  /* =========================================================
     COUNTRIES
  ========================================================= */

  function normalizeCountry(country) {
    const staticCountry = (window.WOND_COUNTRIES || []).find(
      (item) => item.code === country.code
    );

    const dbVat = Number(
      country.vat_rate ?? country.vat
    );

    const staticVat = Number(
      staticCountry?.vat ?? staticCountry?.vat_rate ?? 0
    );

    /*
      If Supabase contains an old 0 VAT value,
      do not let it overwrite the correct static VAT.
    */
    const vat =
      Number.isFinite(dbVat) && dbVat > 0
        ? dbVat
        : staticVat;

    return {
      ...staticCountry,
      ...country,
      vat,
      vat_rate: vat
    };
  }

  function normalizeCountries(list) {
    return (list || []).map(normalizeCountry);
  }

  function countryName(code) {
    return (
      window.WOND_COUNTRY_NAMES?.[lang]?.[code] ||
      countries.find((country) => country.code === code)?.name ||
      code
    );
  }

  function renderCountrySelect() {
    const select = $("#price-country");

    if (!select) {
      return;
    }

    const savedCountry =
      localStorage.getItem("wond-country") || "CZ";

    const current =
      select.value ||
      savedCountry ||
      "CZ";

    select.innerHTML = "";

    countries
      .filter((country) => country.active !== false)
      .forEach((country) => {
        const option = document.createElement("option");

        option.value = country.code;

        option.textContent =
          `${countryName(country.code)} — ${country.currency}`;

        select.append(option);
      });

    const exists = countries.some(
      (country) => country.code === current
    );

    select.value = exists ? current : "CZ";

    localStorage.setItem(
      "wond-country",
      select.value
    );

    const vatSelect = $("#vat-mode");

    if (vatSelect) {
      if (vatSelect.options[0]) {
        vatSelect.options[0].textContent = u("without");
      }

      if (vatSelect.options[1]) {
        vatSelect.options[1].textContent = u("with");
      }

      if (vatSelect.options[2]) {
        vatSelect.options[2].textContent = u("both");
      }
    }
  }

  /* =========================================================
     SERVICES
  ========================================================= */

  function serviceName(key, rawName) {
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
     PRICE FORMAT
  ========================================================= */

  function fmt(number, currency) {
    const decimals =
      currency === "HUF" ? 0 : 2;

    return (
      new Intl.NumberFormat(lang, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(number) +
      " " +
      currency
    );
  }

  function getVatRate(country) {
    if (!country) {
      return 0;
    }

    const vatRate = Number(
      country.vat_rate ??
      country.vat ??
      0
    );

    return Number.isFinite(vatRate) && vatRate > 0
      ? vatRate
      : 0;
  }

  function calculateGross(net, vatRate) {
    return net * (1 + vatRate);
  }

  /* =========================================================
     PUBLIC PRICE RENDER
  ========================================================= */

  function renderPrices() {
    const grid = $("#price-grid");

    if (!grid) {
      return;
    }

    const mode =
      $("#vat-mode")?.value || "net";

    const countryCode =
      $("#price-country")?.value || "CZ";

    const country =
      countries.find(
        (item) => item.code === countryCode
      ) || countries[0];

    if (!country) {
      grid.innerHTML = "";
      return;
    }

    const vatRate = getVatRate(country);

    const groups = {};

    services
      .filter((service) => service.active !== false)
      .forEach((service) => {
        if (!groups[service.category]) {
          groups[service.category] = [];
        }

        groups[service.category].push(service);
      });

    grid.innerHTML = "";

    Object.entries(groups).forEach(
      ([category, rows]) => {
        const card =
          document.createElement("div");

        card.className = "price-card";

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

        thead.append(headerRow);

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

          const rawPrice = Number(
            localPrices?.[countryCode]?.[
              service.item_key
            ] ?? 0
          );

          /*
            Report price is intentionally zero
            because it is calculated according
            to scope.
          */
          if (
            service.item_key === "report" &&
            rawPrice === 0
          ) {
            priceCell.textContent =
              t("by_scope", "dle rozsahu");
          } else {
            const net = rawPrice;

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
            }

            else if (mode === "both") {
              priceCell.textContent =
                `${fmt(
                  net,
                  country.currency
                )}${unit} / ${fmt(
                  gross,
                  country.currency
                )}${unit}`;
            }

            else {
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

          tbody.append(tr);
        });

        table.append(
          thead,
          tbody
        );

        card.append(
          title,
          table
        );

        grid.append(card);
      }
    );
  }

  const publicCountrySelect =
    $("#price-country");

  if (publicCountrySelect) {
    publicCountrySelect.addEventListener(
      "change",
      (event) => {
        localStorage.setItem(
          "wond-country",
          event.target.value
        );

        renderPrices();
      }
    );
  }

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
        localStorage.setItem(
          "wond-vat-mode",
          event.target.value
        );

        renderPrices();
      }
    );
  }

  /* =========================================================
     CONTENT EDITOR
  ========================================================= */

  const contentKeys = [
    "hero_title",
    "hero_text",
    "services_title",
    "services_lead",
    "electro",
    "electro_text",
    "water",
    "water_text",
    "assembly",
    "assembly_text",
    "building",
    "building_text",
    "company_title",
    "company_lead",
    "management",
    "director_name",
    "director_role",
    "director_text",
    "why_title",
    "why_1",
    "why_2",
    "why_3",
    "why_4",
    "why_5",
    "process_title",
    "process_1",
    "process_2",
    "process_3",
    "process_4",
    "prices_title",
    "prices_lead",
    "notice",
    "area",
    "gallery_title",
    "gallery_lead",
    "contact_title"
  ];

  /* =========================================================
     INIT
  ========================================================= */

  async function init() {
    setLang(lang);

    if (!sb) {
      const warning =
        $("#admin-config-warning");

      if (warning) {
        warning.hidden = false;
        warning.textContent =
          t("not_configured");
      }

      return;
    }

    const {
      data: { session: currentSession }
    } = await sb.auth.getSession();

    session = currentSession;

    if (session) {
      await loadProfile();
    }

    sb.auth.onAuthStateChange(
      (_event, currentSession) => {
        session = currentSession;

        setTimeout(
          () => loadProfile(),
          0
        );
      }
    );

    await loadPublic();
  }

  /* =========================================================
     PUBLIC DATA
  ========================================================= */

  async function loadPublic() {
    /*
      SITE CONTENT
    */
    const { data: content } =
      await sb
        .from("site_content")
        .select(
          "lang,content_key,content_value"
        );

    (content || []).forEach((row) => {
      if (
        window.WOND_TRANSLATIONS?.[row.lang]
      ) {
        window.WOND_TRANSLATIONS[
          row.lang
        ][row.content_key] =
          row.content_value;
      }
    });

    /*
      COUNTRIES
    */
    const {
      data: countryRows
    } = await sb
      .from("countries")
      .select("*")
      .order("sort_order");

    if (countryRows?.length) {
      countries =
        normalizeCountries(
          countryRows
        );
    } else {
      countries =
        normalizeCountries(
          window.WOND_COUNTRIES || []
        );
    }

    /*
      COUNTRY TRANSLATIONS
    */
    const {
      data: countryTranslations
    } = await sb
      .from("country_translations")
      .select("*");

    (
      countryTranslations || []
    ).forEach((row) => {
      if (
        !window.WOND_COUNTRY_NAMES
      ) {
        window.WOND_COUNTRY_NAMES = {};
      }

      window.WOND_COUNTRY_NAMES[
        row.lang
      ] ??= {};

      window.WOND_COUNTRY_NAMES[
        row.lang
      ][row.country_code] =
        row.name;
    });

    /*
      SERVICE ITEMS
    */
    const {
      data: serviceRows
    } = await sb
      .from("service_items")
      .select("*")
      .order("sort_order");

    if (serviceRows?.length) {
      services = serviceRows;
    }

    /*
      SERVICE TRANSLATIONS
    */
    const {
      data: serviceTranslations
    } = await sb
      .from("service_translations")
      .select("*");

    if (serviceTranslations?.length) {
      translations = {};

      serviceTranslations.forEach(
        (row) => {
          translations[
            row.item_key
          ] ??= {};

          translations[
            row.item_key
          ][row.lang] =
            row.name;
        }
      );
    }

    /*
      COUNTRY PRICES
    */
    const {
      data: countryPrices
    } = await sb
      .from("country_prices")
      .select(
        "country_code,item_key,price,active"
      );

    if (countryPrices?.length) {
      localPrices = {};

      countryPrices.forEach((row) => {
        localPrices[
          row.country_code
        ] ??= {};

        localPrices[
          row.country_code
        ][row.item_key] =
          Number(row.price);
      });
    }

    /*
      Re-render after all public data
      has been loaded.
    */
    setLang(lang);

    /*
      GALLERY
    */
    const {
      data: gallery
    } = await sb
      .from("gallery_items")
      .select("*")
      .eq("active", true)
      .order("sort_order");

    if (gallery?.length) {
      renderGallery(gallery);
    }
  }

  /* =========================================================
     GALLERY
  ========================================================= */

  function renderGallery(items) {
    const box = $("#gallery-grid");

    if (!box) {
      return;
    }

    box.innerHTML = "";

    items.forEach((item) => {
      const figure =
        document.createElement("figure");

      const img =
        document.createElement("img");

      const caption =
        document.createElement(
          "figcaption"
        );

      img.loading = "lazy";

      img.src =
        sb.storage
          .from(cfg.bucket)
          .getPublicUrl(
            item.storage_path
          )
          .data.publicUrl;

      img.alt =
        item.alt_text ||
        item.title ||
        "WOND";

      caption.textContent =
        item.title || "WOND";

      figure.append(
        img,
        caption
      );

      box.append(figure);
    });
  }

  /* =========================================================
     AUTH / PROFILE
  ========================================================= */

  async function loadProfile() {
    if (!session) {
      profile = null;

      const authCard =
        $("#auth-card");

      const adminPanel =
        $("#admin-panel");

      if (authCard) {
        authCard.hidden = false;
      }

      if (adminPanel) {
        adminPanel.hidden = true;
      }

      return;
    }

    const {
      data
    } = await sb
      .from("profiles")
      .select("*")
      .eq(
        "id",
        session.user.id
      )
      .maybeSingle();

    profile = data;

    const authCard =
      $("#auth-card");

    const adminPanel =
      $("#admin-panel");

    if (authCard) {
      authCard.hidden = true;
    }

    if (adminPanel) {
      adminPanel.hidden = false;
    }

    const email =
      $("#admin-user-email");

    if (email) {
      email.textContent =
        session.user.email;
    }

    const role =
      $("#admin-role");

    if (role) {
      role.textContent =
        data?.role || "admin";
    }

    const usersTab =
      $("#users-tab");

    if (usersTab) {
      usersTab.hidden =
        data?.role !== "owner";
    }

    await loadAdmin();
  }

  /* =========================================================
     ADMIN
  ========================================================= */

  async function loadAdmin() {
    await renderAdminGallery();

    if (profile?.role === "owner") {
      await renderUsers();
    }

    buildContentEditor();
    await loadPriceEditor();
    await loadTranslationEditor();
  }

  function msg(text, error = false) {
    const element =
      $("#admin-message");

    if (!element) {
      return;
    }

    element.textContent = text;

    element.style.color =
      error ? "#b42318" : "";
  }

  /* =========================================================
     LOGIN / SIGNUP / LOGOUT
  ========================================================= */

  const loginBtn =
    $("#login-btn");

  if (loginBtn) {
    loginBtn.onclick =
      async () => {
        if (!sb) {
          msg(
            t("not_configured"),
            true
          );
          return;
        }

        const email =
          $("#auth-email")
            ?.value
            .trim();

        const password =
          $("#auth-password")
            ?.value || "";

        const {
          error
        } = await sb.auth.signInWithPassword(
          {
            email,
            password
          }
        );

        const authMessage =
          $("#auth-message");

        if (authMessage) {
          authMessage.textContent =
            error
              ? error.message
              : t("saved");
        }
      };
  }

  const signupBtn =
    $("#signup-btn");

  if (signupBtn) {
    signupBtn.onclick =
      async () => {
        if (!sb) {
          msg(
            t("not_configured"),
            true
          );
          return;
        }

        const email =
          $("#auth-email")
            ?.value
            .trim();

        const password =
          $("#auth-password")
            ?.value || "";

        const authMessage =
          $("#auth-message");

        if (
          !email ||
          password.length < 8
        ) {
          if (authMessage) {
            authMessage.textContent =
              "E-mail and password must be valid (minimum 8 characters).";
          }

          return;
        }

        const {
          data,
          error
        } = await sb.auth.signUp({
          email,
          password
        });

        if (error) {
          if (authMessage) {
            authMessage.textContent =
              error.message;
          }

          return;
        }

        const {
          data: claim
        } = await sb.rpc(
          "claim_owner"
        );

        if (authMessage) {
          authMessage.textContent =
            claim
              ? "Owner created."
              : "Account created. Confirm e-mail if required, then sign in.";
        }
      };
  }

  const logoutBtn =
    $("#logout-btn");

  if (logoutBtn) {
    logoutBtn.onclick =
      async () => {
        if (sb) {
          await sb.auth.signOut();
        }

        location.reload();
      };
  }

  /* =========================================================
     ADMIN TABS
  ========================================================= */

  $$(".admin-tabs button").forEach(
    (button) => {
      button.onclick = () => {
        $$(".admin-tabs button")
          .forEach((item) =>
            item.classList.remove(
              "active"
            )
          );

        $$(".admin-tab")
          .forEach(
            (item) =>
              (item.hidden = true)
          );

        button.classList.add(
          "active"
        );

        const tab =
          $("#" + button.dataset.tab);

        if (tab) {
          tab.hidden = false;
        }
      };
    }
  );

  /* =========================================================
     ADMIN GALLERY
  ========================================================= */

  async function renderAdminGallery() {
    const {
      data
    } = await sb
      .from("gallery_items")
      .select("*")
      .order("sort_order");

    const box =
      $("#admin-gallery-items");

    if (!box) {
      return;
    }

    box.innerHTML = "";

    (data || []).forEach((item) => {
      const row =
        document.createElement("div");

      row.className =
        "admin-item";

      row.innerHTML = `
        <img
          src="${esc(
            sb.storage
              .from(cfg.bucket)
              .getPublicUrl(
                item.storage_path
              )
              .data.publicUrl
          )}"
          alt=""
        >

        <div class="admin-item-body">
          <strong>
            ${esc(
              item.title || "WOND"
            )}
          </strong>

          <button
            class="btn ghost dark"
            data-id="${esc(item.id)}"
            type="button"
          >
            ${esc(t("delete"))}
          </button>
        </div>
      `;

      const button =
        row.querySelector(
          "button"
        );

      button.onclick =
        async () => {
          await sb.storage
            .from(cfg.bucket)
            .remove([
              item.storage_path
            ]);

          await sb
            .from("gallery_items")
            .delete()
            .eq(
              "id",
              item.id
            );

          await renderAdminGallery();
          await loadPublic();
        };

      box.append(row);
    });
  }

  const uploadBtn =
    $("#upload-btn");

  if (uploadBtn) {
    uploadBtn.onclick =
      async () => {
        const files = [
          ...($("#photo-files")
            ?.files || [])
        ];

        if (!files.length) {
          msg(
            t("select_files"),
            true
          );
          return;
        }

        for (const file of files) {
          const safeName =
            file.name
              .toLowerCase()
              .replace(
                /[^a-z0-9._-]+/gi,
                "-"
              );

          const path =
            `${crypto.randomUUID()}-${safeName}`;

          const upload =
            await sb.storage
              .from(cfg.bucket)
              .upload(
                path,
                file,
                {
                  upsert: false,
                  contentType:
                    file.type
                }
              );

          if (upload.error) {
            msg(
              upload.error.message,
              true
            );
            return;
          }

          const insert =
            await sb
              .from("gallery_items")
              .insert({
                storage_path:
                  path,
                title:
                  $("#photo-title")
                    ?.value
                    .trim() ||
                  file.name,
                alt_text:
                  $("#photo-alt")
                    ?.value
                    .trim() ||
                  file.name,
                sort_order:
                  Date.now()
              });

          if (insert.error) {
            msg(
              insert.error.message,
              true
            );
            return;
          }
        }

        const filesInput =
          $("#photo-files");

        if (filesInput) {
          filesInput.value = "";
        }

        msg(t("saved"));

        await renderAdminGallery();
        await loadPublic();
      };
  }

  /* =========================================================
     CONTENT EDITOR
  ========================================================= */

  function buildContentEditor() {
    const select =
      $("#content-lang");

    if (!select) {
      return;
    }

    if (!select.options.length) {
      langs.forEach((language) => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          language;

        option.textContent =
          window.WOND_TRANSLATIONS
            ?.[language]?.name ||
          language;

        select.append(option);
      });
    }

    select.value = lang;

    select.onchange = () =>
      fillContent(
        select.value
      );

    fillContent(
      select.value
    );
  }

  async function fillContent(language) {
    const {
      data
    } = await sb
      .from("site_content")
      .select(
        "content_key,content_value"
      )
      .eq(
        "lang",
        language
      );

    const map =
      Object.fromEntries(
        (data || []).map(
          (item) => [
            item.content_key,
            item.content_value
          ]
        )
      );

    const box =
      $("#content-editor");

    if (!box) {
      return;
    }

    box.innerHTML = "";

    contentKeys.forEach((key) => {
      const label =
        document.createElement(
          "label"
        );

      label.textContent = key;

      const textarea =
        document.createElement(
          "textarea"
        );

      textarea.dataset.key =
        key;

      textarea.value =
        map[key] ??
        window.WOND_TRANSLATIONS
          ?.[language]?.[key] ||
        "";

      label.append(textarea);
      box.append(label);
    });
  }

  const saveContentBtn =
    $("#save-content");

  if (saveContentBtn) {
    saveContentBtn.onclick =
      async () => {
        const language =
          $("#content-lang")
            ?.value;

        const rows =
          $$("#content-editor textarea")
            .map((textarea) => ({
              lang: language,
              content_key:
                textarea.dataset.key,
              content_value:
                textarea.value,
              updated_at:
                new Date().toISOString()
            }));

        const {
          error
        } = await sb
          .from("site_content")
          .upsert(
            rows,
            {
              onConflict:
                "lang,content_key"
            }
          );

        msg(
          error
            ? error.message
            : t("saved"),
          !!error
        );

        if (!error) {
          rows.forEach((row) => {
            if (
              window.WOND_TRANSLATIONS
                ?.[row.lang]
            ) {
              window.WOND_TRANSLATIONS[
                row.lang
              ][row.content_key] =
                row.content_value;
            }
          });

          if (language === lang) {
            setLang(lang);
          }
        }
      };
  }

  /* =========================================================
     ADMIN PRICE COUNTRY
  ========================================================= */

  function buildCountryAdminSelect() {
    const select =
      $("#admin-price-country");

    if (!select) {
      return;
    }

    const current =
      select.value || "CZ";

    select.innerHTML = "";

    countries.forEach((country) => {
      const option =
        document.createElement(
          "option"
        );

      option.value =
        country.code;

      option.textContent =
        `${countryName(
          country.code
        )} — ${country.currency}`;

      select.append(option);
    });

    select.value =
      countries.some(
        (country) =>
          country.code === current
      )
        ? current
        : "CZ";

    select.onchange = () =>
      fillPriceEditor(
        select.value
      );
  }

  async function loadPriceEditor() {
    buildCountryAdminSelect();

    const select =
      $("#admin-price-country");

    if (select) {
      await fillPriceEditor(
        select.value
      );
    }
  }

  async function fillPriceEditor(
    countryCode
  ) {
    const {
      data
    } = await sb
      .from("country_prices")
      .select(
        "country_code,item_key,price,active"
      )
      .eq(
        "country_code",
        countryCode
      );

    const map =
      Object.fromEntries(
        (data || []).map(
          (item) => [
            item.item_key,
            item
          ]
        )
      );

    const box =
      $("#price-editor");

    if (!box) {
      return;
    }

    box.innerHTML = "";

    const byCategory = {};

    services.forEach((service) => {
      byCategory[
        service.category
      ] ??= [];

      byCategory[
        service.category
      ].push(service);
    });

    Object.entries(
      byCategory
    ).forEach(
      ([category, rows]) => {
        const heading =
          document.createElement(
            "h3"
          );

        heading.textContent =
          categoryName(
            category
          );

        box.append(heading);

        rows.forEach(
          (service) => {
            const wrapper =
              document.createElement(
                "label"
              );

            wrapper.className =
              "price-edit-row";

            const title =
              serviceName(
                service.item_key,
                service.default_name
              );

            const existing =
              map[
                service.item_key
              ]?.price;

            const fallback =
              localPrices?.[
                countryCode
              ]?.[
                service.item_key
              ];

            const value =
              existing ??
              fallback ??
              0;

            wrapper.innerHTML = `
              <span>
                ${esc(title)}
                ${
                  service.unit
                    ? ` (${esc(
                        service.unit
                      )})`
                    : ""
                }
              </span>

              <input
                type="number"
                step="0.01"
                min="0"
                data-key="${esc(
                  service.item_key
                )}"
                value="${esc(value)}"
              >
            `;

            box.append(wrapper);
          }
        );
      }
    );
  }

  const savePricesBtn =
    $("#save-prices");

  if (savePricesBtn) {
    savePricesBtn.onclick =
      async () => {
        const countryCode =
          $("#admin-price-country")
            ?.value;

        if (!countryCode) {
          return;
        }

        const rows =
          $$("#price-editor input")
            .map((input) => ({
              country_code:
                countryCode,
              item_key:
                input.dataset.key,
              price:
                Number(input.value),
              active: true,
              updated_at:
                new Date().toISOString()
            }));

        const {
          error
        } = await sb
          .from("country_prices")
          .upsert(
            rows,
            {
              onConflict:
                "country_code,item_key"
            }
          );

        msg(
          error
            ? error.message
            : t("saved"),
          !!error
        );

        if (!error) {
          localPrices[
            countryCode
          ] ??= {};

          rows.forEach((row) => {
            localPrices[
              countryCode
            ][row.item_key] =
              row.price;
          });

          renderPrices();
        }
      };
  }

  /* =========================================================
     SERVICE TRANSLATIONS
  ========================================================= */

  async function loadTranslationEditor() {
    const select =
      $("#translation-lang");

    if (!select) {
      return;
    }

    if (!select.options.length) {
      langs.forEach((language) => {
        const option =
          document.createElement(
            "option"
          );

        option.value =
          language;

        option.textContent =
          window.WOND_TRANSLATIONS
            ?.[language]?.name ||
          language;

        select.append(option);
      });
    }

    select.value = lang;

    select.onchange = () =>
      fillTranslationEditor(
        select.value
      );

    await fillTranslationEditor(
      select.value
    );
  }

  async function fillTranslationEditor(
    language
  ) {
    const {
      data
    } = await sb
      .from("service_translations")
      .select(
        "item_key,name"
      )
      .eq(
        "lang",
        language
      );

    const map =
      Object.fromEntries(
        (data || []).map(
          (item) => [
            item.item_key,
            item.name
          ]
        )
      );

    const box =
      $("#translation-editor");

    if (!box) {
      return;
    }

    box.innerHTML = "";

    services.forEach((service) => {
      const label =
        document.createElement(
          "label"
        );

      label.className =
        "price-edit-row";

      const currentName =
        map[
          service.item_key
        ] ??
        translations?.[
          service.item_key
        ]?.[language] ??
        service.default_name ??
        "";

      label.innerHTML = `
        <span>
          ${esc(
            service.item_key
          )}
          —
          ${esc(
            categoryName(
              service.category
            )
          )}
        </span>

        <input
          type="text"
          data-key="${esc(
            service.item_key
          )}"
          value="${esc(
            currentName
          )}"
        >
      `;

      box.append(label);
    });
  }

  const saveTranslationsBtn =
    $("#save-translations");

  if (saveTranslationsBtn) {
    saveTranslationsBtn.onclick =
      async () => {
        const language =
          $("#translation-lang")
            ?.value;

        const rows =
          $$("#translation-editor input")
            .map((input) => ({
              item_key:
                input.dataset.key,
              lang: language,
              name:
                input.value.trim()
            }))
            .filter(
              (row) => row.name
            );

        const {
          error
        } = await sb
          .from("service_translations")
          .upsert(
            rows,
            {
              onConflict:
                "item_key,lang"
            }
          );

        msg(
          error
            ? error.message
            : t("saved"),
          !!error
        );

        if (!error) {
          translations = {
            ...translations
          };

          rows.forEach((row) => {
            translations[
              row.item_key
            ] ??= {};

            translations[
              row.item_key
            ][row.lang] =
              row.name;
          });

          renderPrices();
        }
      };
  }

  /* =========================================================
     USERS
  ========================================================= */

  async function renderUsers() {
    const {
      data
    } = await sb
      .from("profiles")
      .select(
        "id,email,role,created_at"
      )
      .order("created_at");

    const box =
      $("#users-list");

    if (!box) {
      return;
    }

    box.innerHTML = "";

    (data || []).forEach((user) => {
      const row =
        document.createElement(
          "div"
        );

      row.className =
        "admin-item";

      row.innerHTML = `
        <div class="admin-item-body">
          <strong>
            ${esc(user.email)}
          </strong>

          <span class="muted">
            ${esc(user.role)}
          </span>
        </div>
      `;

      if (
        user.role !== "owner"
      ) {
        const button =
          document.createElement(
            "button"
          );

        button.className =
          "btn ghost dark";

        button.type = "button";

        button.textContent =
          t("delete");

        button.onclick =
          async () => {
            const result =
              await sb.functions.invoke(
                "delete-admin",
                {
                  body: {
                    user_id:
                      user.id
                  }
                }
              );

            msg(
              result.error
                ? result.error.message
                : t("saved"),
              !!result.error
            );

            await renderUsers();
          };

        row
          .querySelector(
            ".admin-item-body"
          )
          ?.append(button);
      }

      box.append(row);
    });
  }

  const addAdminBtn =
    $("#add-admin");

  if (addAdminBtn) {
    addAdminBtn.onclick =
      async () => {
        const email =
          $("#new-admin-email")
            ?.value
            .trim();

        const password =
          $("#new-admin-password")
            ?.value || "";

        if (
          !email ||
          password.length < 8
        ) {
          msg(
            "Enter e-mail and a password of at least 8 characters.",
            true
          );

          return;
        }

        const result =
          await sb.functions.invoke(
            "create-admin",
            {
              body: {
                email,
                password
              }
            }
          );

        msg(
          result.error
            ? result.error.message
            : t("saved"),
          !!result.error
        );

        if (!result.error) {
          $("#new-admin-email").value =
            "";

          $("#new-admin-password").value =
            "";

          await renderUsers();
        }
      };
  }

  /* =========================================================
     HTML ESCAPE
  ========================================================= */

  function esc(value) {
    return String(
      value ?? ""
    ).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[char])
    );
  }

  /* =========================================================
     START
  ========================================================= */

  init();
})();
