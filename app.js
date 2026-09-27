(() => {
  'use strict';

  /* =========================================================
     WOND — FULL APP
     ========================================================= */

  const cfg = window.WOND_SUPABASE || {};

  const configured =
    cfg.url &&
    cfg.anonKey &&
    !String(cfg.url).includes('PASTE_') &&
    !String(cfg.anonKey).includes('PASTE_');

  const sb =
    window.supabase && configured
      ? window.supabase.createClient(cfg.url, cfg.anonKey)
      : null;

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  const langs =
    window.WOND_LANGS ||
    ['uk', 'cs', 'sl', 'sk', 'de', 'en', 'hr', 'sr', 'it', 'hu', 'pl', 'ro'];

  const TR = window.WOND_TRANSLATIONS || {};
  const COUNTRY_NAMES = window.WOND_COUNTRY_NAMES || {};

  /* =========================================================
     КРАЇНИ + ФІКСОВАНИЙ VAT
     ========================================================= */

  const COUNTRIES = [
    { code: 'CZ', name: 'Česko', currency: 'CZK', vat: 0.21 },
    { code: 'UA', name: 'Україна', currency: 'UAH', vat: 0.20 },
    { code: 'SI', name: 'Slovenija', currency: 'EUR', vat: 0.22 },
    { code: 'SK', name: 'Slovensko', currency: 'EUR', vat: 0.23 },
    { code: 'DE', name: 'Deutschland', currency: 'EUR', vat: 0.19 },
    { code: 'PL', name: 'Polska', currency: 'PLN', vat: 0.23 },
    { code: 'RO', name: 'România', currency: 'RON', vat: 0.21 },
    { code: 'HU', name: 'Magyarország', currency: 'HUF', vat: 0.27 },
    { code: 'HR', name: 'Hrvatska', currency: 'EUR', vat: 0.25 },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP', vat: 0.20 }
  ];

  const VAT = {
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
     БЕРЕМО ВСІ ДАНІ З ТВОГО prices.js
     ========================================================= */

  let countries = mergeCountries(
    window.WOND_COUNTRIES
  );

  let services =
    Array.isArray(window.WOND_PRICE_ITEMS)
      ? window.WOND_PRICE_ITEMS
      : [];

  let localPrices =
    clonePrices(
      window.WOND_LOCAL_PRICES || {}
    );

  let translations =
    {
      ...(window.WOND_PRICE_TRANSLATIONS || {})
    };

  /* =========================================================
     UI
     ========================================================= */

  const ui = {
    uk: {
      country:'Країна',
      price:'Ціна',
      service:'Робота',
      currency:'Валюта',
      without:'Без ПДВ',
      with:'З ПДВ',
      both:'Обидва',
      prices_admin:'Ціни по країнах',
      price_country:'Країна для цін',
      translations_admin:'Переклади робіт',
      translation_lang:'Мова перекладів',
      save_prices:'Зберегти ціни',
      save_translations:'Зберегти переклади',
      category:'Категорія',
      unit:'Одиниця'
    },

    cs: {
      country:'Země',
      price:'Cena',
      service:'Služba',
      currency:'Měna',
      without:'Bez DPH',
      with:'Včetně DPH',
      both:'Obojí',
      prices_admin:'Ceny podle zemí',
      price_country:'Země pro ceny',
      translations_admin:'Překlady služeb',
      translation_lang:'Jazyk překladů',
      save_prices:'Uložit ceny',
      save_translations:'Uložit překlady',
      category:'Kategorie',
      unit:'Jednotka'
    },

    sl: {
      country:'Država',
      price:'Cena',
      service:'Storitev',
      currency:'Valuta',
      without:'Brez DDV',
      with:'Z DDV',
      both:'Oboje',
      prices_admin:'Cene po državah',
      price_country:'Država za cene',
      translations_admin:'Prevodi storitev',
      translation_lang:'Jezik prevodov',
      save_prices:'Shrani cene',
      save_translations:'Shrani prevode',
      category:'Kategorija',
      unit:'Enota'
    },

    sk: {
      country:'Krajina',
      price:'Cena',
      service:'Služba',
      currency:'Mena',
      without:'Bez DPH',
      with:'S DPH',
      both:'Oboje',
      prices_admin:'Ceny podľa krajín',
      price_country:'Krajina pre ceny',
      translations_admin:'Preklady služieb',
      translation_lang:'Jazyk prekladov',
      save_prices:'Uložiť ceny',
      save_translations:'Uložiť preklady',
      category:'Kategória',
      unit:'Jednotka'
    },

    de: {
      country:'Land',
      price:'Preis',
      service:'Leistung',
      currency:'Währung',
      without:'Ohne MwSt.',
      with:'Inkl. MwSt.',
      both:'Beides',
      prices_admin:'Preise nach Ländern',
      price_country:'Land für Preise',
      translations_admin:'Übersetzungen der Leistungen',
      translation_lang:'Sprache der Übersetzungen',
      save_prices:'Preise speichern',
      save_translations:'Übersetzungen speichern',
      category:'Kategorie',
      unit:'Einheit'
    },

    en: {
      country:'Country',
      price:'Price',
      service:'Service',
      currency:'Currency',
      without:'Without VAT',
      with:'With VAT',
      both:'Both',
      prices_admin:'Prices by country',
      price_country:'Country for prices',
      translations_admin:'Service translations',
      translation_lang:'Translation language',
      save_prices:'Save prices',
      save_translations:'Save translations',
      category:'Category',
      unit:'Unit'
    },

    hr: {
      country:'Država',
      price:'Cijena',
      service:'Usluga',
      currency:'Valuta',
      without:'Bez PDV-a',
      with:'S PDV-om',
      both:'Oboje',
      prices_admin:'Cijene po državama',
      price_country:'Država za cijene',
      translations_admin:'Prijevodi usluga',
      translation_lang:'Jezik prijevoda',
      save_prices:'Spremi cijene',
      save_translations:'Spremi prijevode',
      category:'Kategorija',
      unit:'Jedinica'
    },

    sr: {
      country:'Država',
      price:'Cena',
      service:'Usluga',
      currency:'Valuta',
      without:'Bez PDV-a',
      with:'Sa PDV-om',
      both:'Oboje',
      prices_admin:'Cene po državama',
      price_country:'Država za cene',
      translations_admin:'Prevodi usluga',
      translation_lang:'Jezik prevoda',
      save_prices:'Sačuvaj cene',
      save_translations:'Sačuvaj prevode',
      category:'Kategorija',
      unit:'Jedinica'
    },

    it: {
      country:'Paese',
      price:'Prezzo',
      service:'Servizio',
      currency:'Valuta',
      without:'Senza IVA',
      with:'Con IVA',
      both:'Entrambi',
      prices_admin:'Prezzi per paese',
      price_country:'Paese per i prezzi',
      translations_admin:'Traduzioni dei servizi',
      translation_lang:'Lingua delle traduzioni',
      save_prices:'Salva prezzi',
      save_translations:'Salva traduzioni',
      category:'Categoria',
      unit:'Unità'
    },

    hu: {
      country:'Ország',
      price:'Ár',
      service:'Szolgáltatás',
      currency:'Pénznem',
      without:'ÁFA nélkül',
      with:'ÁFÁ-val',
      both:'Mindkettő',
      prices_admin:'Országonkénti árak',
      price_country:'Árlista országa',
      translations_admin:'Szolgáltatásfordítások',
      translation_lang:'Fordítás nyelve',
      save_prices:'Árak mentése',
      save_translations:'Fordítások mentése',
      category:'Kategória',
      unit:'Egység'
    },

    pl: {
      country:'Kraj',
      price:'Cena',
      service:'Usługa',
      currency:'Waluta',
      without:'Bez VAT',
      with:'Z VAT',
      both:'Obie',
      prices_admin:'Ceny według krajów',
      price_country:'Kraj dla cen',
      translations_admin:'Tłumaczenia usług',
      translation_lang:'Język tłumaczeń',
      save_prices:'Zapisz ceny',
      save_translations:'Zapisz tłumaczenia',
      category:'Kategoria',
      unit:'Jednostka'
    },

    ro: {
      country:'Țară',
      price:'Preț',
      service:'Serviciu',
      currency:'Monedă',
      without:'Fără TVA',
      with:'Cu TVA',
      both:'Ambele',
      prices_admin:'Prețuri pe țări',
      price_country:'Țara pentru prețuri',
      translations_admin:'Traduceri servicii',
      translation_lang:'Limba traducerilor',
      save_prices:'Salvează prețurile',
      save_translations:'Salvează traducerile',
      category:'Categorie',
      unit:'Unitate'
    }
  };

  /* =========================================================
     МОВА
     ========================================================= */

  let lang = getLang();
  let session = null;
  let profile = null;

  function getLang() {
    const q =
      new URLSearchParams(
        location.search
      ).get('lang');

    if (q && langs.includes(q)) {
      return q;
    }

    const saved =
      localStorage.getItem(
        'wond-lang'
      );

    if (
      saved &&
      langs.includes(saved)
    ) {
      return saved;
    }

    const browser =
      (
        navigator.language ||
        'cs'
      ).slice(0,2);

    return langs.includes(browser)
      ? browser
      : 'cs';
  }

  function t(
    key,
    fallback = ''
  ) {
    return (
      TR?.[lang]?.[key] ??
      fallback
    );
  }

  function u(key) {
    return (
      ui?.[lang]?.[key] ??
      ui.en?.[key] ??
      key
    );
  }

  function countryName(code) {
    const c =
      String(
        code || ''
      ).toUpperCase();

    return (
      COUNTRY_NAMES?.[lang]?.[c] ||
      countries.find(
        x => x.code === c
      )?.name ||
      c
    );
  }

  function setLang(newLang) {
    lang =
      langs.includes(newLang)
        ? newLang
        : 'cs';

    localStorage.setItem(
      'wond-lang',
      lang
    );

    const url =
      new URL(location.href);

    url.searchParams.set(
      'lang',
      lang
    );

    history.replaceState(
      {},
      '',
      url
    );

    document.documentElement.lang =
      lang;

    $$('[data-i18n]').forEach(
      el => {
        const value =
          t(
            el.dataset.i18n
          );

        if (value !== '') {
          el.innerHTML = value;
        }
      }
    );

    const language =
      $('#language');

    if (language) {
      language.value =
        lang;
    }

    renderCountrySelect();
    renderPrices();
  }

  function initLanguage() {
    const select =
      $('#language');

    if (!select) return;

    select.innerHTML = '';

    langs.forEach(l => {
      const option =
        document.createElement(
          'option'
        );

      option.value = l;

      option.textContent =
        TR?.[l]?.name ||
        l.toUpperCase();

      select.appendChild(
        option
      );
    });

    select.value = lang;

    select.addEventListener(
      'change',
      e => setLang(
        e.target.value
      )
    );
  }

  /* =========================================================
     КРАЇНИ
     ========================================================= */

  function mergeCountries(db) {
    const staticCountries =
      COUNTRIES.map(c => ({
        ...c
      }));

    const list =
      Array.isArray(db)
        ? db
        : [];

    const dbMap =
      new Map();

    list.forEach(c => {
      const code =
        String(
          c?.code || ''
        ).toUpperCase();

      if (code) {
        dbMap.set(
          code,
          c
        );
      }
    });

    const result =
      staticCountries.map(
        staticCountry => {
          const code =
            staticCountry.code;

          const dbCountry =
            dbMap.get(code);

          return {
            ...staticCountry,
            ...(dbCountry || {}),
            code,
            currency:
              dbCountry?.currency ||
              staticCountry.currency,

            /* VAT завжди беремо з нашої таблиці */
            vat:
              VAT[code] ??
              staticCountry.vat,

            vat_rate:
              VAT[code] ??
              staticCountry.vat
          };
        }
      );

    list.forEach(c => {
      const code =
        String(
          c?.code || ''
        ).toUpperCase();

      if (
        code &&
        !result.some(
          x => x.code === code
        )
      ) {
        result.push({
          ...c,
          code,
          vat:
            VAT[code] ??
            Number(
              c.vat_rate ??
              c.vat ??
              0
            ),
          vat_rate:
            VAT[code] ??
            Number(
              c.vat_rate ??
              c.vat ??
              0
            )
        });
      }
    });

    return result;
  }

  function getVat(country) {
    const code =
      String(
        country?.code || ''
      ).toUpperCase();

    if (
      Object.prototype.hasOwnProperty.call(
        VAT,
        code
      )
    ) {
      return VAT[code];
    }

    const value =
      Number(
        country?.vat_rate ??
        country?.vat ??
        0
      );

    return Number.isFinite(value)
      ? value
      : 0;
  }

  function grossPrice(
    net,
    vat
  ) {
    return (
      Number(net || 0) *
      (
        1 +
        Number(vat || 0)
      )
    );
  }

  /* =========================================================
     COUNTRY SELECT
     ========================================================= */

  function renderCountrySelect() {
    const select =
      $('#price-country');

    if (!select) return;

    const old =
      select.value ||
      localStorage.getItem(
        'wond-country'
      ) ||
      'CZ';

    select.innerHTML = '';

    countries
      .filter(
        c =>
          c.active !== false
      )
      .forEach(c => {
        const option =
          document.createElement(
            'option'
          );

        option.value =
          c.code;

        option.textContent =
          `${countryName(
            c.code
          )} — ${c.currency}`;

        select.appendChild(
          option
        );
      });

    let selected = old;

    if (
      !countries.some(
        c =>
          c.code === selected
      )
    ) {
      selected =
        countries.some(
          c => c.code === 'CZ'
        )
          ? 'CZ'
          : countries[0]?.code ||
            '';
    }

    select.value =
      selected;

    localStorage.setItem(
      'wond-country',
      selected
    );

    const vatMode =
      $('#vat-mode');

    if (vatMode) {
      if (vatMode.options[0]) {
        vatMode.options[0]
          .textContent =
          u('without');
      }

      if (vatMode.options[1]) {
        vatMode.options[1]
          .textContent =
          u('with');
      }

      if (vatMode.options[2]) {
        vatMode.options[2]
          .textContent =
          u('both');
      }

      const savedMode =
        localStorage.getItem(
          'wond-vat-mode'
        );

      if (
        savedMode === 'net' ||
        savedMode === 'gross' ||
        savedMode === 'both'
      ) {
        vatMode.value =
          savedMode;
      }
    }
  }

  /* =========================================================
     FORMAT PRICE
     ========================================================= */

  function fmt(
    value,
    currency
  ) {
    const decimals =
      currency === 'HUF'
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
      ).format(
        Number(value || 0)
      ) +
      ' ' +
      currency
    );
  }

  function serviceName(
    key,
    raw
  ) {
    return (
      translations?.[key]?.[lang] ||
      translations?.[key]?.en ||
      raw ||
      key
    );
  }

  /* =========================================================
     ОСНОВНИЙ ЦІННИК
     ========================================================= */

  function renderPrices() {
    const grid =
      $('#price-grid');

    if (!grid) return;

    const mode =
      $('#vat-mode')?.value ||
      'net';

    const code =
      String(
        $('#price-country')
          ?.value ||
        localStorage.getItem(
          'wond-country'
        ) ||
        'CZ'
      ).toUpperCase();

    const country =
      countries.find(
        c =>
          String(c.code)
            .toUpperCase() ===
          code
      ) ||
      countries[0];

    if (!country) {
      grid.innerHTML = '';
      return;
    }

    const vat =
      getVat(country);

    const groups = {};

    services
      .filter(
        s =>
          s.active !== false
      )
      .forEach(s => {
        groups[
          s.category
        ] ??= [];

        groups[
          s.category
        ].push(s);
      });

    grid.innerHTML = '';

    Object.entries(
      groups
    ).forEach(
      ([category, rows]) => {
        const card =
          document.createElement(
            'div'
          );

        card.className =
          'price-card';

        const categoryTitle =
          category === 'electro'
            ? t(
                'electro',
                category
              )
            : t(
                category,
                category
              );

        card.innerHTML = `
          <h3>${esc(
            categoryTitle
          )}</h3>

          <table>
            <thead>
              <tr>
                <th>${esc(
                  u('service')
                )}</th>

                <th>${esc(
                  u('price')
                )}</th>
              </tr>
            </thead>

            <tbody></tbody>
          </table>
        `;

        const tbody =
          card.querySelector(
            'tbody'
          );

        rows.forEach(
          service => {
            const tr =
              document.createElement(
                'tr'
              );

            const tdService =
              document.createElement(
                'td'
              );

            const tdPrice =
              document.createElement(
                'td'
              );

            tdService.textContent =
              serviceName(
                service.item_key,
                service.default_name
              );

            const net =
              Number(
                localPrices?.[
                  code
                ]?.[
                  service.item_key
                ] ?? 0
              );

            /* report / робота за обсягом */
            if (
              service.item_key ===
                'report' &&
              net === 0
            ) {
              tdPrice.textContent =
                t(
                  'by_scope',
                  'dle rozsahu'
                );
            } else {
              const gross =
                grossPrice(
                  net,
                  vat
                );

              const unit =
                service.unit ||
                '';

              if (
                mode === 'gross'
              ) {
                tdPrice.textContent =
                  fmt(
                    gross,
                    country.currency
                  ) +
                  unit;
              } else if (
                mode === 'both'
              ) {
                tdPrice.textContent =
                  `${fmt(
                    net,
                    country.currency
                  )}${unit} / ${fmt(
                    gross,
                    country.currency
                  )}${unit}`;
              } else {
                tdPrice.textContent =
                  fmt(
                    net,
                    country.currency
                  ) +
                  unit;
              }
            }

            tr.append(
              tdService,
              tdPrice
            );

            tbody.appendChild(
              tr
            );
          }
        );

        grid.appendChild(
          card
        );
      }
    );
  }

  /* =========================================================
     PRICE CONTROLS
     ========================================================= */

  function initPriceControls() {
    const country =
      $('#price-country');

    const vat =
      $('#vat-mode');

    if (country) {
      country.addEventListener(
        'change',
        e => {
          localStorage.setItem(
            'wond-country',
            e.target.value
          );

          renderPrices();
        }
      );
    }

    if (vat) {
      vat.addEventListener(
        'change',
        e => {
          localStorage.setItem(
            'wond-vat-mode',
            e.target.value
          );

          renderPrices();
        }
      );
    }
  }

  /* =========================================================
     CONTENT
     ========================================================= */

  const contentKeys = [
    'hero_title',
    'hero_text',
    'services_title',
    'services_lead',
    'electro',
    'electro_text',
    'water',
    'water_text',
    'assembly',
    'assembly_text',
    'building',
    'building_text',
    'company_title',
    'company_lead',
    'management',
    'director_name',
    'director_role',
    'director_text',
    'why_title',
    'why_1',
    'why_2',
    'why_3',
    'why_4',
    'why_5',
    'process_title',
    'process_1',
    'process_2',
    'process_3',
    'process_4',
    'prices_title',
    'prices_lead',
    'notice',
    'area',
    'gallery_title',
    'gallery_lead',
    'contact_title'
  ];

  /* =========================================================
     INIT
     ========================================================= */

  async function init() {
    initLanguage();
    initPriceControls();

    setLang(lang);

    if (!sb) {
      const warning =
        $('#admin-config-warning');

      if (warning) {
        warning.hidden = false;
        warning.textContent =
          t(
            'not_configured',
            'Supabase is not configured.'
          );
      }

      return;
    }

    try {
      const result =
        await sb.auth.getSession();

      session =
        result?.data?.session ||
        null;

      if (session) {
        await loadProfile();
      }

      sb.auth.onAuthStateChange(
        (_event, newSession) => {
          session =
            newSession;

          setTimeout(
            () =>
              loadProfile(),
            0
          );
        }
      );

      await loadPublic();

    } catch (error) {
      console.error(
        'WOND:',
        error
      );
    }
  }

  /* =========================================================
     LOAD PUBLIC
     ========================================================= */

  async function loadPublic() {

    /* SITE CONTENT */

    try {
      const {
        data
      } = await sb
        .from('site_content')
        .select(
          'lang,content_key,content_value'
        );

      (data || []).forEach(
        row => {
          if (
            TR[row.lang]
          ) {
            TR[row.lang][
              row.content_key
            ] =
              row.content_value;
          }
        }
      );
    } catch (e) {
      console.warn(
        'site_content',
        e
      );
    }

    /* COUNTRIES */

    try {
      const {
        data
      } = await sb
        .from('countries')
        .select('*')
        .order(
          'sort_order'
        );

      countries =
        mergeCountries(
          data?.length
            ? data
            : COUNTRIES
        );

    } catch (e) {
      countries =
        mergeCountries(
          COUNTRIES
        );
    }

    /* COUNTRY TRANSLATIONS */

    try {
      const {
        data
      } = await sb
        .from('country_translations')
        .select('*');

      (data || []).forEach(
        row => {
          COUNTRY_NAMES[
            row.lang
          ] ??= {};

          COUNTRY_NAMES[
            row.lang
          ][
            row.country_code
          ] =
            row.name;
        }
      );
    } catch (e) {
      console.warn(
        'country translations',
        e
      );
    }

    /* SERVICES */

    try {
      const {
        data
      } = await sb
        .from('service_items')
        .select('*')
        .order(
          'sort_order'
        );

      if (
        data?.length
      ) {
        services =
          data;
      }
    } catch (e) {
      console.warn(
        'services',
        e
      );
    }

    /* SERVICE TRANSLATIONS */

    try {
      const {
        data
      } = await sb
        .from('service_translations')
        .select('*');

      const merged = {
        ...translations
      };

      (data || []).forEach(
        row => {
          merged[
            row.item_key
          ] ??= {};

          merged[
            row.item_key
          ][
            row.lang
          ] =
            row.name;
        }
      );

      translations =
        merged;

    } catch (e) {
      console.warn(
        'service translations',
        e
      );
    }

    /* PRICES */

    try {
      const {
        data
      } = await sb
        .from('country_prices')
        .select(
          'country_code,item_key,price,active'
        );

      const merged =
        clonePrices(
          window.WOND_LOCAL_PRICES ||
          {}
        );

      (data || []).forEach(
        row => {
          const code =
            String(
              row.country_code ||
              ''
            ).toUpperCase();

          if (!code) return;

          merged[code] ??= {};

          merged[code][
            row.item_key
          ] =
            Number(
              row.price
            );
        }
      );

      localPrices =
        merged;

    } catch (e) {
      console.warn(
        'country prices',
        e
      );
    }

    renderCountrySelect();
    renderPrices();

    /* GALLERY */

    try {
      const {
        data
      } = await sb
        .from('gallery_items')
        .select('*')
        .eq(
          'active',
          true
        )
        .order(
          'sort_order'
        );

      if (
        data?.length
      ) {
        renderGallery(
          data
        );
      }
    } catch (e) {
      console.warn(
        'gallery',
        e
      );
    }
  }

  /* =========================================================
     GALLERY
     ========================================================= */

  function renderGallery(
    items
  ) {
    const box =
      $('#gallery-grid');

    if (!box) return;

    box.innerHTML = '';

    items.forEach(
      item => {
        const figure =
          document.createElement(
            'figure'
          );

        const img =
          document.createElement(
            'img'
          );

        const caption =
          document.createElement(
            'figcaption'
          );

        img.loading =
          'lazy';

        img.src =
          sb.storage
            .from(
              cfg.bucket
            )
            .getPublicUrl(
              item.storage_path
            )
            .data
            .publicUrl;

        img.alt =
          item.alt_text ||
          item.title ||
          'WOND';

        caption.textContent =
          item.title ||
          'WOND';

        figure.append(
          img,
          caption
        );

        box.appendChild(
          figure
        );
      }
    );
  }

  /* =========================================================
     LOGIN / PROFILE
     ========================================================= */

  async function loadProfile() {
    if (!session) {
      profile = null;

      if ($('#auth-card')) {
        $('#auth-card').hidden =
          false;
      }

      if ($('#admin-panel')) {
        $('#admin-panel').hidden =
          true;
      }

      return;
    }

    try {
      const {
        data
      } = await sb
        .from('profiles')
        .select('*')
        .eq(
          'id',
          session.user.id
        )
        .maybeSingle();

      profile =
        data;

      if ($('#auth-card')) {
        $('#auth-card').hidden =
          true;
      }

      if ($('#admin-panel')) {
        $('#admin-panel').hidden =
          false;
      }

      if ($('#admin-user-email')) {
        $('#admin-user-email')
          .textContent =
          session.user.email;
      }

      if ($('#admin-role')) {
        $('#admin-role')
          .textContent =
          data?.role ||
          'admin';
      }

      if ($('#users-tab')) {
        $('#users-tab').hidden =
          data?.role !==
          'owner';
      }

      await loadAdmin();

    } catch (e) {
      console.error(
        'profile',
        e
      );
    }
  }

  async function loadAdmin() {
    await renderAdminGallery();

    if (
      profile?.role ===
      'owner'
    ) {
      await renderUsers();
    }

    buildContentEditor();

    await loadPriceEditor();

    await loadTranslationEditor();
  }

  function msg(
    text,
    error = false
  ) {
    const box =
      $('#admin-message');

    if (!box) return;

    box.textContent =
      text;

    box.style.color =
      error
        ? '#b42318'
        : '';
  }

  /* =========================================================
     LOGIN
     ========================================================= */

  if ($('#login-btn')) {
    $('#login-btn').onclick =
      async () => {
        if (!sb) return;

        const email =
          $('#auth-email')
            ?.value.trim();

        const password =
          $('#auth-password')
            ?.value || '';

        const {
          error
        } =
          await sb.auth
            .signInWithPassword({
              email,
              password
            });

        if (
          $('#auth-message')
        ) {
          $('#auth-message')
            .textContent =
            error
              ? error.message
              : t(
                  'saved',
                  'Saved'
                );
        }
      };
  }

  /* =========================================================
     OWNER SIGNUP
     ========================================================= */

  if ($('#signup-btn')) {
    $('#signup-btn').onclick =
      async () => {
        if (!sb) return;

        const email =
          $('#auth-email')
            ?.value.trim();

        const password =
          $('#auth-password')
            ?.value || '';

        if (
          !email ||
          password.length < 8
        ) {
          if (
            $('#auth-message')
          ) {
            $('#auth-message')
              .textContent =
              'E-mail and password must be valid (minimum 8 characters).';
          }

          return;
        }

        const {
          error
        } =
          await sb.auth.signUp({
            email,
            password
          });

        if (error) {
          if (
            $('#auth-message')
          ) {
            $('#auth-message')
              .textContent =
              error.message;
          }

          return;
        }

        const {
          data: claim
        } =
          await sb.rpc(
            'claim_owner'
          );

        if (
          $('#auth-message')
        ) {
          $('#auth-message')
            .textContent =
            claim
              ? 'Owner created.'
              : 'Account created. Confirm e-mail if required, then sign in.';
        }
      };
  }

  /* =========================================================
     LOGOUT
     ========================================================= */

  if ($('#logout-btn')) {
    $('#logout-btn').onclick =
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

  $$('.admin-tabs button')
    .forEach(
      button => {
        button.onclick =
          () => {
            $$('.admin-tabs button')
              .forEach(
                x =>
                  x.classList.remove(
                    'active'
                  )
              );

            $$('.admin-tab')
              .forEach(
                x =>
                  x.hidden =
                    true
              );

            button.classList.add(
              'active'
            );

            const tab =
              $('#' +
                button.dataset.tab);

            if (tab) {
              tab.hidden =
                false;
            }
          };
      }
    );

  /* =========================================================
     ADMIN GALLERY
     ========================================================= */

  async function renderAdminGallery() {
    if (!sb) return;

    const box =
      $('#admin-gallery-items');

    if (!box) return;

    const {
      data
    } =
      await sb
        .from('gallery_items')
        .select('*')
        .order(
          'sort_order'
        );

    box.innerHTML = '';

    (data || []).forEach(
      item => {
        const row =
          document.createElement(
            'div'
          );

        row.className =
          'admin-item';

        row.innerHTML = `
          <img
            src="${sb.storage
              .from(cfg.bucket)
              .getPublicUrl(
                item.storage_path
              )
              .data.publicUrl}"
            alt=""
          >

          <div class="admin-item-body">
            <strong>
              ${esc(
                item.title ||
                'WOND'
              )}
            </strong>

            <button
              class="btn ghost dark"
            >
              ${esc(
                t(
                  'delete',
                  'Delete'
                )
              )}
            </button>
          </div>
        `;

        row
          .querySelector(
            'button'
          )
          .onclick =
          async () => {
            await sb.storage
              .from(
                cfg.bucket
              )
              .remove([
                item.storage_path
              ]);

            await sb
              .from(
                'gallery_items'
              )
              .delete()
              .eq(
                'id',
                item.id
              );

            await renderAdminGallery();
            await loadPublic();
          };

        box.appendChild(
          row
        );
      }
    );
  }

  /* =========================================================
     UPLOAD
     ========================================================= */

  if ($('#upload-btn')) {
    $('#upload-btn').onclick =
      async () => {
        if (!sb) return;

        const files =
          [
            ...(
              $('#photo-files')
                ?.files || []
            )
          ];

        if (!files.length) {
          msg(
            t(
              'select_files',
              'Select files'
            ),
            true
          );

          return;
        }

        for (
          const file
          of files
        ) {
          const safe =
            file.name
              .toLowerCase()
              .replace(
                /[^a-z0-9._-]+/gi,
                '-'
              );

          const path =
            `${crypto.randomUUID()}-${safe}`;

          const upload =
            await sb.storage
              .from(
                cfg.bucket
              )
              .upload(
                path,
                file,
                {
                  upsert:false,
                  contentType:
                    file.type
                }
              );

          if (
            upload.error
          ) {
            msg
