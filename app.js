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
      ? window.supabase.createClient(
          cfg.url,
          cfg.anonKey
        )
      : null;


  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) =>
    [...document.querySelectorAll(selector)];

  const langs =
    window.WOND_LANGS || [
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

  let countries =
    window.WOND_COUNTRIES || [];

  let services =
    window.WOND_PRICE_ITEMS || [];

  let translations =
    window.WOND_PRICE_TRANSLATIONS || {};

  let localPrices =
    window.WOND_LOCAL_PRICES || {};


  /* =========================================================
     TRANSLATION HELPERS
  ========================================================= */

  const t = (
    key,
    fallback = ""
  ) => {
    const current =
      window.WOND_TRANSLATIONS?.[lang] || {};

    const cs =
      window.WOND_TRANSLATIONS?.cs || {};

    return (
      current[key] ||
      cs[key] ||
      fallback ||
      key
    );
  };


  /* =========================================================
     LANGUAGE
  ========================================================= */

  function getLang() {
    const queryLang =
      new URLSearchParams(
        location.search
      ).get("lang");

    if (
      queryLang &&
      langs.includes(queryLang)
    ) {
      return queryLang;
    }

    const saved =
      localStorage.getItem(
        "wond-lang"
      );

    if (
      saved &&
      langs.includes(saved)
    ) {
      return saved;
    }

    const browserLang =
      (
        navigator.language ||
        "cs"
      ).slice(0, 2);

    return langs.includes(browserLang)
      ? browserLang
      : "cs";
  }


  function setLang(newLang) {
    lang = langs.includes(newLang)
      ? newLang
      : "cs";

    localStorage.setItem(
      "wond-lang",
      lang
    );

    const url =
      new URL(location.href);

    url.searchParams.set(
      "lang",
      lang
    );

    history.replaceState(
      {},
      "",
      url
    );

    document.documentElement.lang =
      lang;

    document.title =
      `WOND — ${t("nav_services")}`;

    $$("[data-i18n]").forEach(
      (el) => {
        const value =
          t(el.dataset.i18n);

        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          el.innerHTML = value;
        }
      }
    );

    const languageSelect =
      $("#language");

    if (languageSelect) {
      languageSelect.value =
        lang;
    }

    /*
      IMPORTANT:
      Public prices are now controlled
      ONLY by price-vat.js.
    */

    if (
      window.WOND_PRICE_VAT
    ) {
      if (
        typeof window.WOND_PRICE_VAT
          .renderCountrySelect ===
        "function"
      ) {
        window.WOND_PRICE_VAT
          .renderCountrySelect();
      }

      if (
        typeof window.WOND_PRICE_VAT
          .render ===
        "function"
      ) {
        window.WOND_PRICE_VAT.render();
      }
    }
  }


  /* =========================================================
     COUNTRY NORMALIZATION
  ========================================================= */

  function normalizeCountry(
    country
  ) {
    const rawCode =
      String(
        country?.code || ""
      )
        .trim()
        .toUpperCase();

    const staticCountry =
      (
        window.WOND_COUNTRIES ||
        []
      ).find(
        (item) =>
          item.code === rawCode
      ) || {};

    const fixedVat =
      window.WOND_PRICE_HELPERS
        ?.getVat?.(
          rawCode
        );

    const dbVat =
      Number(
        country?.vat_rate ??
        country?.vat ??
        0
      );

    const staticVat =
      Number(
        staticCountry?.vat ??
        staticCountry?.vat_rate ??
        0
      );

    let vat = 0;

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

      vat,
      vat_rate: vat
    };
  }


  function normalizeCountries(
    list
  ) {
    const staticList =
      window.WOND_COUNTRIES ||
      [];

    const dbList =
      Array.isArray(list)
        ? list
        : [];

    const dbByCode =
      new Map();

    dbList.forEach(
      (country) => {
        const code =
          String(
            country?.code || ""
          )
            .trim()
            .toUpperCase();

        if (code) {
          dbByCode.set(
            code,
            country
          );
        }
      }
    );

    const result = [];

    staticList.forEach(
      (staticCountry) => {
        const code =
          String(
            staticCountry.code ||
            ""
          )
            .trim()
            .toUpperCase();

        const dbCountry =
          dbByCode.get(code);

        result.push(
          normalizeCountry(
            dbCountry ||
            staticCountry
          )
        );
      }
    );

    dbList.forEach(
      (country) => {
        const code =
          String(
            country?.code || ""
          )
            .trim()
            .toUpperCase();

        if (
          code &&
          !result.some(
            (item) =>
              item.code === code
          )
        ) {
          result.push(
            normalizeCountry(
              country
            )
          );
        }
      }
    );

    return result;
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
        const {
          data,
          error
        } = await sb
          .from("site_content")
          .select("*");

        if (
          !error &&
          data
        ) {
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

      try {
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
              window.WOND_COUNTRIES ||
              []
            );

        } else {

          countries =
            normalizeCountries(
              countryRows?.length
                ? countryRows
                : (
                    window.WOND_COUNTRIES ||
                    []
                  )
            );
        }

      } catch (error) {

        console.warn(
          "countries:",
          error
        );

        countries =
          normalizeCountries(
            window.WOND_COUNTRIES ||
            []
          );
      }


      /* -----------------------------------------
         COUNTRY TRANSLATIONS
      ----------------------------------------- */

      try {

        const {
          data:
            countryTranslations,
          error
        } = await sb
          .from(
            "country_translations"
          )
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
          .from(
            "service_items"
          )
          .select("*")
          .order(
            "sort_order"
          );

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
          data:
            serviceTranslationRows,
          error
        } = await sb
          .from(
            "service_translations"
          )
          .select("*");

        if (
          !error &&
          serviceTranslationRows
        ) {

          const mapped = {};

          serviceTranslationRows
            .forEach(
              (row) => {

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
              }
            );

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
          .from(
            "country_prices"
          )
          .select("*");

        if (
          !error &&
          priceRows
        ) {

          const mergedPrices = {
            ...(
              window.WOND_LOCAL_PRICES ||
              {}
            )
          };

          priceRows.forEach(
            (row) => {

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
                !mergedPrices[
                  countryCode
                ]
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
                Number.isFinite(
                  value
                )
              ) {
                mergedPrices[
                  countryCode
                ][itemKey] =
                  value;
              }
            }
          );

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
        Tell price-vat.js that new
        Supabase data is available.
      */

      if (
        window.WOND_PRICE_VAT
      ) {

        /*
          If price-vat.js exposes these
          functions, refresh everything.
        */

        if (
          typeof window.WOND_PRICE_VAT
            .setData ===
          "function"
        ) {

          window.WOND_PRICE_VAT
            .setData({
              countries,
              services,
              translations,
              localPrices
            });

        }

        if (
          typeof window.WOND_PRICE_VAT
            .renderCountrySelect ===
          "function"
        ) {

          window.WOND_PRICE_VAT
            .renderCountrySelect();
        }

        if (
          typeof window.WOND_PRICE_VAT
            .render ===
          "function"
        ) {

          window.WOND_PRICE_VAT
            .render();
        }
      }

      /*
        Apply current language after
        all data is loaded.
      */

      setLang(lang);


      /* -----------------------------------------
         GALLERY
      ----------------------------------------- */

      if (
        typeof window
          .WOND_LOAD_GALLERY ===
        "function"
      ) {

        try {

          await window
            .WOND_LOAD_GALLERY();

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
          window.WOND_COUNTRIES ||
          []
        );

      services =
        window.WOND_PRICE_ITEMS ||
        [];

      translations =
        window.WOND_PRICE_TRANSLATIONS ||
        {};

      localPrices =
        window.WOND_LOCAL_PRICES ||
        {};

      setLang(lang);
    }
  }


  /* =========================================================
     PROFILE
  ========================================================= */

  async function loadProfile() {

    if (
      !sb ||
      !session?.user
    ) {
      profile = null;
      return;
    }

    try {

      const {
        data,
        error
      } = await sb
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

      profile =
        data || null;

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

    const authCard =
      $("#auth-card");

    const adminPanel =
      $("#admin-panel");

    if (authCard) {
      authCard.hidden =
        !!session;
    }

    if (adminPanel) {
      adminPanel.hidden =
        !session;
    }

    const email =
      $("#admin-user-email");

    if (
      email &&
      session?.user
    ) {
      email.textContent =
        session.user.email || "";
    }

    const role =
      $("#admin-role");

    if (role) {
      role.textContent =
        profile?.role ||
        "";
    }
  }


  /* =========================================================
     EVENTS
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


    /*
      IMPORTANT:
      There are NO listeners here for:

      #price-country
      #vat-mode

      They are handled exclusively by
      price-vat.js.

      This prevents double rendering
      and conflicting VAT calculations.
    */
  }


  /* =========================================================
     DEBUG
  ========================================================= */

  window.WOND_DEBUG_VAT = () => {

    const code =
      $("#price-country")?.value ||
      localStorage.getItem(
        "wond-country"
      ) ||
      "CZ";

    const country =
      countries.find(
        (item) =>
          item.code === code
      );

    let vat = 0;

    if (
      window.WOND_PRICE_HELPERS
        ?.getVat
    ) {
      vat =
        window.WOND_PRICE_HELPERS
          .getVat(code);
    } else {
      vat =
        Number(
          country?.vat ||
          country?.vat_rate ||
          0
        );
    }

    const net = 450;

    const gross =
      net * (1 + vat);

    console.table({
      country: code,
      currency:
        country?.currency,
      vatRate: vat,
      vatPercent:
        `${Math.round(vat * 100)}%`,
      exampleNet: net,
      exampleGross: gross
    });

    return {
      country,
      vatRate: vat,
      gross
    };
  };


  /* =========================================================
     INIT
  ========================================================= */

  async function init() {

    /*
      Static data first.
    */

    countries =
      normalizeCountries(
        window.WOND_COUNTRIES ||
        []
      );

    services =
      window.WOND_PRICE_ITEMS ||
      [];

    translations =
      window.WOND_PRICE_TRANSLATIONS ||
      {};

    localPrices =
      window.WOND_LOCAL_PRICES ||
      {};


    /* -----------------------------------------
       EVENTS
    ----------------------------------------- */

    bindEvents();


    /* -----------------------------------------
       LANGUAGE
    ----------------------------------------- */

    setLang(lang);


    /* -----------------------------------------
       SUPABASE WARNING
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
          session:
            currentSession
        }
      } = await sb.auth.getSession();

      session =
        currentSession;

      updateAdminUI();

      if (session) {
        await loadProfile();
      }

      sb.auth.onAuthStateChange(
        (
          _event,
          currentSession
        ) => {

          session =
            currentSession;

          updateAdminUI();

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
       PUBLIC DATA
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
