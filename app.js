(() => {
  'use strict';

  /* =========================================================
     WOND — MAIN APP
     Мови + Supabase + Галерея + Адмінка + Ціни + VAT
     ========================================================= */

  const cfg = window.WOND_SUPABASE || {};

  const configured =
    cfg.url &&
    cfg.anonKey &&
    !cfg.url.includes('PASTE_') &&
    !cfg.anonKey.includes('PASTE_');

  const sb =
    window.supabase && configured
      ? window.supabase.createClient(cfg.url, cfg.anonKey)
      : null;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const langs =
    window.WOND_LANGS ||
    ['uk', 'cs', 'sl', 'sk', 'de', 'en', 'hr', 'sr', 'it', 'hu', 'pl', 'ro'];

  const WOND_TRANSLATIONS = window.WOND_TRANSLATIONS || {};
  const WOND_COUNTRY_NAMES = window.WOND_COUNTRY_NAMES || {};

  /* =========================================================
     FIXED VAT RATES
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
      country: 'Країна',
      price: 'Ціна',
      service: 'Робота',
      currency: 'Валюта',
      without: 'Без ПДВ',
      with: 'З ПДВ',
      both: 'Обидва',
      prices_admin: 'Ціни по країнах',
      price_country: 'Країна для цін',
      translations_admin: 'Переклади робіт',
      translation_lang: 'Мова перекладів',
      save_prices: 'Зберегти ціни',
      save_translations: 'Зберегти переклади',
      category: 'Категорія',
      unit: 'Одиниця'
    },

    cs: {
      country: 'Země',
      price: 'Cena',
      service: 'Služba',
      currency: 'Měna',
      without: 'Bez DPH',
      with: 'Včetně DPH',
      both: 'Obojí',
      prices_admin: 'Ceny podle zemí',
      price_country: 'Země pro ceny',
      translations_admin: 'Překlady služeb',
      translation_lang: 'Jazyk překladů',
      save_prices: 'Uložit ceny',
      save_translations: 'Uložit překlady',
      category: 'Kategorie',
      unit: 'Jednotka'
    },

    sl: {
      country: 'Država',
      price: 'Cena',
      service: 'Storitev',
      currency: 'Valuta',
      without: 'Brez DDV',
      with: 'Z DDV',
      both: 'Oboje',
      prices_admin: 'Cene po državah',
      price_country: 'Država za cene',
      translations_admin: 'Prevodi storitev',
      translation_lang: 'Jezik prevodov',
      save_prices: 'Shrani cene',
      save_translations: 'Shrani prevode',
      category: 'Kategorija',
      unit: 'Enota'
    },

    sk: {
      country: 'Krajina',
      price: 'Cena',
      service: 'Služba',
      currency: 'Mena',
      without: 'Bez DPH',
      with: 'S DPH',
      both: 'Oboje',
      prices_admin: 'Ceny podľa krajín',
      price_country: 'Krajina pre ceny',
      translations_admin: 'Preklady služieb',
      translation_lang: 'Jazyk prekladov',
      save_prices: 'Uložiť ceny',
      save_translations: 'Uložiť preklady',
      category: 'Kategória',
      unit: 'Jednotka'
    },

    de: {
      country: 'Land',
      price: 'Preis',
      service: 'Leistung',
      currency: 'Währung',
      without: 'Ohne MwSt.',
      with: 'Inkl. MwSt.',
      both: 'Beides',
      prices_admin: 'Preise nach Ländern',
      price_country: 'Land für Preise',
      translations_admin: 'Übersetzungen der Leistungen',
      translation_lang: 'Sprache der Übersetzungen',
      save_prices: 'Preise speichern',
      save_translations: 'Übersetzungen speichern',
      category: 'Kategorie',
      unit: 'Einheit'
    },

    en: {
      country: 'Country',
      price: 'Price',
      service: 'Service',
      currency: 'Currency',
      without: 'Without VAT',
      with: 'With VAT',
      both: 'Both',
      prices_admin: 'Prices by country',
      price_country: 'Country for prices',
      translations_admin: 'Service translations',
      translation_lang: 'Translation language',
      save_prices: 'Save prices',
      save_translations: 'Save translations',
      category: 'Category',
      unit: 'Unit'
    },

    hr: {
      country: 'Država',
      price: 'Cijena',
      service: 'Usluga',
      currency: 'Valuta',
      without: 'Bez PDV-a',
      with: 'S PDV-om',
      both: 'Oboje',
      prices_admin: 'Cijene po državama',
      price_country: 'Država za cijene',
      translations_admin: 'Prijevodi usluga',
      translation_lang: 'Jezik prijevoda',
      save_prices: 'Spremi cijene',
      save_translations: 'Spremi prijevode',
      category: 'Kategorija',
      unit: 'Jedinica'
    },

    sr: {
      country: 'Država',
      price: 'Cena',
      service: 'Usluga',
      currency: 'Valuta',
      without: 'Bez PDV-a',
      with: 'Sa PDV-om',
      both: 'Oboje',
      prices_admin: 'Cene po državama',
      price_country: 'Država za cene',
      translations_admin: 'Prevodi usluga',
      translation_lang: 'Jezik prevoda',
      save_prices: 'Sačuvaj cene',
      save_translations: 'Sačuvaj prevode',
      category: 'Kategorija',
      unit: 'Jedinica'
    },

    it: {
      country: 'Paese',
      price: 'Prezzo',
      service: 'Servizio',
      currency: 'Valuta',
      without: 'Senza IVA',
      with: 'Con IVA',
      both: 'Entrambi',
      prices_admin: 'Prezzi per paese',
      price_country: 'Paese per i prezzi',
      translations_admin: 'Traduzioni dei servizi',
      translation_lang: 'Lingua delle traduzioni',
      save_prices: 'Salva prezzi',
      save_translations: 'Salva traduzioni',
      category: 'Categoria',
      unit: 'Unità'
    },

    hu: {
      country: 'Ország',
      price: 'Ár',
      service: 'Szolgáltatás',
      currency: 'Pénznem',
      without: 'ÁFA nélkül',
      with: 'ÁFÁ-val',
      both: 'Mindkettő',
      prices_admin: 'Országonkénti árak',
      price_country: 'Árlista országa',
      translations_admin: 'Szolgáltatásfordítások',
      translation_lang: 'Fordítás nyelve',
      save_prices: 'Árak mentése',
      save_translations: 'Fordítások mentése',
      category: 'Kategória',
      unit: 'Egység'
    },

    pl: {
      country: 'Kraj',
      price: 'Cena',
      service: 'Usługa',
      currency: 'Waluta',
      without: 'Bez VAT',
      with: 'Z VAT',
      both: 'Obie',
      prices_admin: 'Ceny według krajów',
      price_country: 'Kraj dla cen',
      translations_admin: 'Tłumaczenia usług',
      translation_lang: 'Język tłumaczeń',
      save_prices: 'Zapisz ceny',
      save_translations: 'Zapisz tłumaczenia',
      category: 'Kategoria',
      unit: 'Jednostka'
    },

    ro: {
      country: 'Țară',
      price: 'Preț',
      service: 'Serviciu',
      currency: 'Monedă',
      without: 'Fără TVA',
      with: 'Cu TVA',
      both: 'Ambele',
      prices_admin: 'Prețuri pe țări',
      price_country: 'Țara pentru prețuri',
      translations_admin: 'Traduceri servicii',
      translation_lang: 'Limba traducerilor',
      save_prices: 'Salvează prețurile',
      save_translations: 'Salvează traducerile',
      category: 'Categorie',
      unit: 'Unitate'
    }
  };

  /* =========================================================
     DATA
     ========================================================= */

  let lang = getLang();
  let session = null;
  let profile = null;

  let countries = normalizeCountries(window.WOND_COUNTRIES || []);
  let services = window.WOND_PRICE_ITEMS || [];
  let translations = { ...(window.WOND_PRICE_TRANSLATIONS || {}) };
  let localPrices = clonePrices(window.WOND_LOCAL_PRICES || {});

  /* =========================================================
     LANGUAGE
     ========================================================= */

  function getLang() {
    const q = new URLSearchParams(location.search).get('lang');

    if (q && langs.includes(q)) {
      return q;
    }

    const saved = localStorage.getItem('wond-lang');

    if (saved && langs.includes(saved)) {
      return saved;
    }

    const browser = (navigator.language || 'cs').slice(0, 2);

    return langs.includes(browser) ? browser : 'cs';
  }

  function t(key, fallback = '') {
    return WOND_TRANSLATIONS?.[lang]?.[key] ?? fallback;
  }

  function u(key) {
    return ui?.[lang]?.[key] ?? ui.en?.[key] ?? key;
  }

  function countryName(code) {
    const c = String(code || '').toUpperCase();

    return (
      WOND_COUNTRY_NAMES?.[lang]?.[c] ||
      countries.find(x => String(x.code).toUpperCase() === c)?.name ||
      c
    );
  }

  function setLang(newLang) {
    lang = langs.includes(newLang) ? newLang : 'cs';

    localStorage.setItem('wond-lang', lang);

    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState({}, '', url);

    document.documentElement.lang = lang;

    document.title = `WOND — ${t('nav_services', 'Services')}`;

    $$('[data-i18n]').forEach(el => {
      const value = t(el.dataset.i18n);

      if (value !== '') {
        el.innerHTML = value;
      }
    });

    const language = $('#language');

    if (language) {
      language.value = lang;
    }

    renderCountrySelect();
    renderPrices();
  }

  /* =========================================================
     LANGUAGE SELECT
     ========================================================= */

  function initLanguageSelect() {
    const select = $('#language');

    if (!select) return;

    select.innerHTML = '';

    langs.forEach(l => {
      const option = document.createElement('option');

      option.value = l;
      option.textContent =
        WOND_TRANSLATIONS?.[l]?.name ||
        l.toUpperCase();

      select.appendChild(option);
    });

    select.value = lang;

    select.addEventListener('change', e => {
      setLang(e.target.value);
    });
  }

  /* =========================================================
     VAT / COUNTRIES
     ========================================================= */

  function normalizeCountry(country) {
    const rawCode = String(country?.code || '')
      .trim()
      .toUpperCase();

    const staticCountry =
      (window.WOND_COUNTRIES || []).find(
        x => String(x.code || '').toUpperCase() === rawCode
      ) || {};

    const fixedVat = FIXED_VAT_RATES[rawCode];

    const dbVat = Number(
      country?.vat_rate ?? country?.vat
    );

    const staticVat = Number(
      staticCountry?.vat ??
      staticCountry?.vat_rate
    );

    let vat = 0;

    if (Number.isFinite(fixedVat)) {
      vat = fixedVat;
    } else if (Number.isFinite(dbVat)) {
      vat = dbVat;
    } else if (Number.isFinite(staticVat)) {
      vat = staticVat;
    }

    return {
      ...staticCountry,
      ...country,

      code: rawCode,

      vat: vat,
      vat_rate: vat,

      currency:
        country?.currency ||
        staticCountry?.currency ||
        ''
    };
  }

  function normalizeCountries(list) {
    const staticList = window.WOND_COUNTRIES || [];
    const dbList = Array.isArray(list) ? list : [];

    const dbByCode = new Map();

    dbList.forEach(c => {
      const code = String(c?.code || '')
        .trim()
        .toUpperCase();

      if (code) {
        dbByCode.set(code, c);
      }
    });

    const result = staticList.map(sc => {
      const code = String(sc.code || '')
        .trim()
        .toUpperCase();

      return normalizeCountry(
        dbByCode.get(code) || sc
      );
    });

    dbList.forEach(c => {
      const code = String(c?.code || '')
        .trim()
        .toUpperCase();

      if (
        code &&
        !result.some(x => x.code === code)
      ) {
        result.push(normalizeCountry(c));
      }
    });

    return result;
  }

  function getVatRate(country) {
    if (!country) return 0;

    const code = String(country.code || '')
      .trim()
      .toUpperCase();

    if (Object.prototype.hasOwnProperty.call(FIXED_VAT_RATES, code)) {
      return FIXED_VAT_RATES[code];
    }

    const vat = Number(
      country.vat_rate ?? country.vat
    );

    return Number.isFinite(vat) ? vat : 0;
  }

  function calculateGross(net, vatRate) {
    const n = Number(net) || 0;
    const vat = Number(vatRate) || 0;

    return n * (1 + vat);
  }

  /* =========================================================
     COUNTRY SELECT
     ========================================================= */

  function renderCountrySelect() {
    const select = $('#price-country');

    if (!select) return;

    const saved =
      select.value ||
      localStorage.getItem('wond-country') ||
      'CZ';

    select.innerHTML = '';

    countries
      .filter(c => c.active !== false)
      .forEach(c => {
        const option = document.createElement('option');

        option.value = c.code;

        option.textContent =
          `${countryName(c.code)} — ${c.currency}`;

        select.appendChild(option);
      });

    let selected = saved;

    if (!countries.some(c => c.code === selected)) {
      selected = countries.some(c => c.code === 'CZ')
        ? 'CZ'
        : countries[0]?.code || '';
    }

    select.value = selected;

    localStorage.setItem(
      'wond-country',
      selected
    );

    const vat = $('#vat-mode');

    if (vat) {
      if (vat.options[0]) {
        vat.options[0].textContent = u('without');
      }

      if (vat.options[1]) {
        vat.options[1].textContent = u('with');
      }

      if (vat.options[2]) {
        vat.options[2].textContent = u('both');
      }

      const savedMode =
        localStorage.getItem('wond-vat-mode');

      if (
        savedMode === 'net' ||
        savedMode === 'gross' ||
        savedMode === 'both'
      ) {
        vat.value = savedMode;
      }
    }
  }

  /* =========================================================
     PRICE FORMAT
     ========================================================= */

  function fmt(number, currency) {
    const value = Number(number) || 0;

    const decimals =
      currency === 'HUF' ? 0 : 2;

    return (
      new Intl.NumberFormat(lang, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value) +
      ' ' +
      currency
    );
  }

  function serviceName(key, raw) {
    return (
      translations?.[key]?.[lang] ||
      translations?.[key]?.en ||
      raw ||
      key
    );
  }

  /* =========================================================
     RENDER PRICES
     ========================================================= */

  function renderPrices() {
    const grid = $('#price-grid');

    if (!grid) return;

    const mode =
      $('#vat-mode')?.value || 'net';

    const code =
      String(
        $('#price-country')?.value || 'CZ'
      ).toUpperCase();

    const country =
      countries.find(
        c =>
          String(c.code).toUpperCase() === code
      ) ||
      countries[0];

    if (!country) {
      grid.innerHTML = '';
      return;
    }

    const vatRate = getVatRate(country);

    const groups = {};

    services
      .filter(s => s.active !== false)
      .forEach(s => {
        if (!groups[s.category]) {
          groups[s.category] = [];
        }

        groups[s.category].push(s);
      });

    grid.innerHTML = '';

    for (const [category, rows] of Object.entries(groups)) {
      const card =
        document.createElement('div');

      card.className = 'price-card';

      const title =
        category === 'electro'
          ? t('electro', 'Electro')
          : t(category, category);

      card.innerHTML = `
        <h3>${esc(title)}</h3>

        <table>
          <thead>
            <tr>
              <th>${esc(u('service'))}</th>
              <th>${esc(u('price'))}</th>
            </tr>
          </thead>

          <tbody></tbody>
        </table>
      `;

      const tbody =
        card.querySelector('tbody');

      rows.forEach(service => {
        const tr =
          document.createElement('tr');

        const td1 =
          document.createElement('td');

        const td2 =
          document.createElement('td');

        td1.textContent =
          serviceName(
            service.item_key,
            service.default_name
          );

        const raw =
          Number(
            localPrices?.[code]?.[
              service.item_key
            ] ?? 0
          );

        if (
          service.item_key === 'report' &&
          raw === 0
        ) {
          td2.textContent =
            t(
              'by_scope',
              'dle rozsahu'
            );
        } else {
          const net = raw;

          const gross =
            calculateGross(
              net,
              vatRate
            );

          const unit =
            service.unit || '';

          if (mode === 'gross') {
            td2.textContent =
              fmt(
                gross,
                country.currency
              ) + unit;
          } else if (mode === 'both') {
            td2.textContent =
              `${fmt(
                net,
                country.currency
              )}${unit} / ${fmt(
                gross,
                country.currency
              )}${unit}`;
          } else {
            td2.textContent =
              fmt(
                net,
                country.currency
              ) + unit;
          }
        }

        tr.append(td1, td2);
        tbody.appendChild(tr);
      });

      grid.appendChild(card);
    }
  }

  /* =========================================================
     PRICE CONTROLS
     ========================================================= */

  function initPriceControls() {
    const country = $('#price-country');
    const vatMode = $('#vat-mode');

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

    if (vatMode) {
      vatMode.addEventListener(
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
     CONTENT EDITOR KEYS
     ========================================================= */

  const keys = [
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
     CLONE PRICES
     ========================================================= */

  function clonePrices(source) {
    const result = {};

    Object.entries(source || {}).forEach(
      ([country, values]) => {
        result[country] = {
          ...(values || {})
        };
      }
    );

    return result;
  }

  /* =========================================================
     INIT
     ========================================================= */

  async function init() {
    initLanguageSelect();
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
      const {
        data: {
          session: currentSession
        }
      } = await sb.auth.getSession();

      session = currentSession;

      if (session) {
        await loadProfile();
      }

      sb.auth.onAuthStateChange(
        (_event, newSession) => {
          session = newSession;

          setTimeout(
            () => loadProfile(),
            0
          );
        }
      );

      await loadPublic();

    } catch (error) {
      console.error(
        'WOND init error:',
        error
      );
    }
  }

  /* =========================================================
     LOAD PUBLIC DATA
     ========================================================= */

  async function loadPublic() {
    try {
      const {
        data: content
      } = await sb
        .from('site_content')
        .select(
          'lang,content_key,content_value'
        );

      (content || []).forEach(x => {
        if (WOND_TRANSLATIONS[x.lang]) {
          WOND_TRANSLATIONS[x.lang][
            x.content_key
          ] = x.content_value;
        }
      });
    } catch (error) {
      console.warn(
        'site_content:',
        error
      );
    }

    /* COUNTRIES */

    try {
      const {
        data: dbCountries
      } = await sb
        .from('countries')
        .select('*')
        .order('sort_order');

      countries = normalizeCountries(
        dbCountries?.length
          ? dbCountries
          : window.WOND_COUNTRIES || []
      );
    } catch (error) {
      console.warn(
        'countries:',
        error
      );

      countries = normalizeCountries(
        window.WOND_COUNTRIES || []
      );
    }

    /* COUNTRY TRANSLATIONS */

    try {
      const {
        data: countryTranslations
      } = await sb
        .from('country_translations')
        .select('*');

      (countryTranslations || []).forEach(
        x => {
          WOND_COUNTRY_NAMES[x.lang] ??= {};

          WOND_COUNTRY_NAMES[x.lang][
            x.country_code
          ] = x.name;
        }
      );
    } catch (error) {
      console.warn(
        'country_translations:',
        error
      );
    }

    /* SERVICES */

    try {
      const {
        data: serviceItems
      } = await sb
        .from('service_items')
        .select('*')
        .order('sort_order');

      if (serviceItems?.length) {
        services = serviceItems;
      }
    } catch (error) {
      console.warn(
        'service_items:',
        error
      );
    }

    /* SERVICE TRANSLATIONS */

    try {
      const {
        data: serviceTranslations
      } = await sb
        .from('service_translations')
        .select('*');

      const mergedTranslations = {
        ...translations
      };

      (serviceTranslations || []).forEach(
        x => {
          mergedTranslations[x.item_key] ??= {};

          mergedTranslations[x.item_key][
            x.lang
          ] = x.name;
        }
      );

      translations =
        mergedTranslations;

    } catch (error) {
      console.warn(
        'service_translations:',
        error
      );
    }

    /* COUNTRY PRICES */

    try {
      const {
        data: countryPrices
      } = await sb
        .from('country_prices')
        .select(
          'country_code,item_key,price,active'
        );

      const mergedPrices =
        clonePrices(
          window.WOND_LOCAL_PRICES || {}
        );

      (countryPrices || []).forEach(
        x => {
          const code =
            String(
              x.country_code || ''
            ).toUpperCase();

          if (!code) return;

          mergedPrices[code] ??= {};

          mergedPrices[code][
            x.item_key
          ] = Number(x.price);
        }
      );

      localPrices = mergedPrices;

    } catch (error) {
      console.warn(
        'country_prices:',
        error
      );
    }

    renderCountrySelect();
    renderPrices();

    /* GALLERY */

    try {
      const {
        data: gallery
      } = await sb
        .from('gallery_items')
        .select('*')
        .eq('active', true)
        .order('sort_order');

      if (gallery?.length) {
        renderGallery(gallery);
      }
    } catch (error) {
      console.warn(
        'gallery_items:',
        error
      );
    }
  }

  /* =========================================================
     GALLERY
     ========================================================= */

  function renderGallery(items) {
    const box =
      $('#gallery-grid');

    if (!box) return;

    box.innerHTML = '';

    items.forEach(item => {
      const figure =
        document.createElement('figure');

      const img =
        document.createElement('img');

      const caption =
        document.createElement('figcaption');

      img.loading = 'lazy';

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
        'WOND';

      caption.textContent =
        item.title || 'WOND';

      figure.append(
        img,
        caption
      );

      box.appendChild(figure);
    });
  }

  /* =========================================================
     PROFILE / LOGIN
     ========================================================= */

  async function loadProfile() {
    if (!session) {
      profile = null;

      if ($('#auth-card')) {
        $('#auth-card').hidden = false;
      }

      if ($('#admin-panel')) {
        $('#admin-panel').hidden = true;
      }

      return;
    }

    try {
      const {
        data
      } = await sb
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      profile = data;

      if ($('#auth-card')) {
        $('#auth-card').hidden = true;
      }

      if ($('#admin-panel')) {
        $('#admin-panel').hidden = false;
      }

      if ($('#admin-user-email')) {
        $('#admin-user-email').textContent =
          session.user.email;
      }

      if ($('#admin-role')) {
        $('#admin-role').textContent =
          data?.role || 'admin';
      }

      if ($('#users-tab')) {
        $('#users-tab').hidden =
          data?.role !== 'owner';
      }

      await loadAdmin();

    } catch (error) {
      console.error(
        'loadProfile:',
        error
      );
    }
  }

  async function loadAdmin() {
    await renderAdminGallery();

    if (profile?.role === 'owner') {
      await renderUsers();
    }

    buildContentEditor();
    await loadPriceEditor();
    await loadTranslationEditor();
  }

  function msg(text, error = false) {
    const box =
      $('#admin-message');

    if (!box) return;

    box.textContent = text;
    box.style.color =
      error ? '#b42318' : '';
  }

  /* =========================================================
     LOGIN
     ========================================================= */

  const loginBtn =
    $('#login-btn');

  if (loginBtn) {
    loginBtn.onclick = async () => {
      if (!sb) {
        msg(
          t(
            'not_configured',
            'Supabase is not configured.'
          ),
          true
        );

        return;
      }

      const email =
        $('#auth-email')?.value.trim();

      const password =
        $('#auth-password')?.value || '';

      const {
        error
      } = await sb.auth.signInWithPassword({
        email,
        password
      });

      if ($('#auth-message')) {
        $('#auth-message').textContent =
          error
            ? error.message
            : t('saved', 'Saved');
      }
    };
  }

  /* =========================================================
     SIGN UP OWNER
     ========================================================= */

  const signupBtn =
    $('#signup-btn');

  if (signupBtn) {
    signupBtn.onclick = async () => {
      if (!sb) {
        msg(
          t(
            'not_configured',
            'Supabase is not configured.'
          ),
          true
        );

        return;
      }

      const email =
        $('#auth-email')?.value.trim();

      const password =
        $('#auth-password')?.value || '';

      if (
        !email ||
        password.length < 8
      ) {
        if ($('#auth-message')) {
          $('#auth-message').textContent =
            'E-mail and password must be valid (minimum 8 characters).';
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
        if ($('#auth-message')) {
          $('#auth-message').textContent =
            error.message;
        }

        return;
      }

      const {
        data: claim
      } = await sb.rpc(
        'claim_owner'
      );

      if ($('#auth-message')) {
        $('#auth-message').textContent =
          claim
            ? 'Owner created.'
            : 'Account created. Confirm e-mail if required, then sign in.';
      }
    };
  }

  /* =========================================================
     LOGOUT
     ========================================================= */

  const logoutBtn =
    $('#logout-btn');

  if (logoutBtn) {
    logoutBtn.onclick = async () => {
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
    .forEach(button => {
      button.onclick = () => {
        $$('.admin-tabs button')
          .forEach(x =>
            x.classList.remove('active')
          );

        $$('.admin-tab')
          .forEach(x =>
            x.hidden = true
          );

        button.classList.add('active');

        const tab =
          $('#' + button.dataset.tab);

        if (tab) {
          tab.hidden = false;
        }
      };
    });

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
    } = await sb
      .from('gallery_items')
      .select('*')
      .order('sort_order');

    box.innerHTML = '';

    (data || []).forEach(item => {
      const row =
        document.createElement('div');

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
              item.title || 'WOND'
            )}
          </strong>

          <button
            class="btn ghost dark"
            data-id="${item.id}"
          >
            ${esc(
              t('delete', 'Delete')
            )}
          </button>
        </div>
      `;

      const button =
        row.querySelector('button');

      button.onclick =
        async () => {
          await sb.storage
            .from(cfg.bucket)
            .remove([
              item.storage_path
            ]);

          await sb
            .from('gallery_items')
            .delete()
            .eq(
              'id',
              item.id
            );

          await renderAdminGallery();
          await loadPublic();
        };

      box.appendChild(row);
    });
  }

  /* =========================================================
     UPLOAD PHOTOS
     ========================================================= */

  const uploadBtn =
    $('#upload-btn');

  if (uploadBtn) {
    uploadBtn.onclick =
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

        for (const file of files) {
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
              .from('gallery_items')
              .insert({
                storage_path:
                  path,

                title:
                  $('#photo-title')
                    ?.value.trim() ||
                  file.name,

                alt_text:
                  $('#photo-alt')
                    ?.value.trim() ||
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

        if ($('#photo-files')) {
          $('#photo-files').value = '';
        }

        msg(
          t('saved', 'Saved')
        );

        await renderAdminGallery();
        await loadPublic();
      };
  }

  /* =========================================================
     CONTENT EDITOR
     ========================================================= */

  function buildContentEditor() {
    const select =
      $('#content-lang');

    if (!select) return;

    if (!select.options.length) {
      langs.forEach(l => {
        const option =
          document.createElement('option');

        option.value = l;

        option.textContent =
          WOND_TRANSLATIONS?.[l]?.name ||
          l;

        select.appendChild(option);
      });
    }

    select.value = lang;

    select.onchange = () =>
      fillContent(
        select.value
      );

    fillContent(select.value);
  }

  async function fillContent(l) {
    if (!sb) return;

    const {
      data
    } = await sb
      .from('site_content')
      .select(
        'content_key,content_value'
      )
      .eq('lang', l);

    const map =
      Object.fromEntries(
        (data || []).map(
          x => [
            x.content_key,
            x.content_value
          ]
        )
      );

    const box =
      $('#content-editor');

    if (!box) return;

    box.innerHTML = '';

    keys.forEach(key => {
      const label =
        document.createElement('label');

      label.textContent = key;

      const textarea =
        document.createElement('textarea');

      textarea.dataset.key = key;

      textarea.value =
        map[key] ??
        WOND_TRANSLATIONS?.[l]?.[key] ??
        '';

      label.appendChild(
        textarea
      );

      box.appendChild(label);
    });
  }

  const saveContent =
    $('#save-content');

  if (saveContent) {
    saveContent.onclick =
      async () => {
        if (!sb) return;

        const l =
          $('#content-lang')
            ?.value;

        const rows =
          $$('#content-editor textarea')
            .map(textarea => ({
              lang: l,

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
          .from('site_content')
          .upsert(
            rows,
            {
              onConflict:
                'lang,content_key'
            }
          );

        msg(
          error
            ? error.message
            : t('saved', 'Saved'),
          !!error
        );

        if (!error) {
          rows.forEach(row => {
            if (
              WOND_TRANSLATIONS[
                row.lang
              ]
            ) {
              WOND_TRANSLATIONS[
                row.lang
              ][
                row.content_key
              ] =
                row.content_value;
            }
          });

          if (l === lang) {
            setLang(lang);
          }
        }
      };
  }

  /* =========================================================
     COUNTRY PRICE ADMIN
     ========================================================= */

  function buildCountryAdminSelect() {
    const select =
      $('#admin-price-country');

    if (!select) return;

    const current =
      select.value || 'CZ';

    select.innerHTML = '';

    countries.forEach(country => {
      const option =
        document.createElement('option');

      option.value =
        country.code;

      option.textContent =
        `${countryName(
          country.code
        )} — ${country.currency}`;

      select.appendChild(option);
    });

    select.value =
      countries.some(
        c => c.code === current
      )
        ? current
        : countries[0]?.code || '';

    select.onchange =
      () =>
        fillPriceEditor(
          select.value
        );
  }

  async function loadPriceEditor() {
    if (!sb) return;

    buildCountryAdminSelect();

    const select =
      $('#admin-price-country');

    if (select?.value) {
      await fillPriceEditor(
        select.value
      );
    }
  }

  async function fillPriceEditor(
    countryCode
  ) {
    if (!sb) return;

    const {
      data
    } = await sb
      .from('country_prices')
      .select(
        'country_code,item_key,price,active'
      )
      .eq(
        'country_code',
        countryCode
      );

    const map =
      Object.fromEntries(
        (data || []).map(
          x => [
            x.item_key,
            x
          ]
        )
      );

    const box =
      $('#price-editor');

    if (!box) return;

    box.innerHTML = '';

    const byCategory = {};

    services.forEach(service => {
      if (!byCategory[
        service.category
      ]) {
        byCategory[
          service.category
        ] = [];
      }

      byCategory[
        service.category
      ].push(service);
    });

    Object.entries(
      byCategory
    ).forEach(
      ([category, rows]) => {
        const heading =
          document.createElement('h3');

        heading.textContent =
          category === 'electro'
            ? t(
                'electro',
                category
              )
            : t(
                category,
                category
              );

        box.appendChild(
          heading
        );

        rows.forEach(service => {
          const label =
            document.createElement('label');

          label.className =
            'price-edit-row';

          label.innerHTML = `
            <span>
              ${esc(
                serviceName(
                  service.item_key,
                  service.default_name
                )
              )}

              ${
                service.unit
                  ? ` (${esc(
                      service.unit
                    )})`
                  : ''
              }
            </span>

            <input
              type="number"
              step="0.01"
              min="0"
              data-key="${esc(
                service.item_key
              )}"
              value="${
                map[
                  service.item_key
                ]?.price ??
                localPrices?.[
                  countryCode
                ]?.[
                  service.item_key
                ] ??
                0
              }"
            >
          `;

          box.appendChild(
            label
          );
        });
      }
    );
  }

  const savePrices =
    $('#save-prices');

  if (savePrices) {
    savePrices.onclick =
      async () => {
        if (!sb) return;

        const countryCode =
          $('#admin-price-country')
            ?.value;

        const rows =
          $$('#price-editor input')
            .map(input => ({
              country_code:
                countryCode,

              item_key:
                input.dataset.key,

              price:
                Number(
                  input.value
                ),

              active: true,

              updated_at:
                new Date().toISOString()
            }));

        const {
          error
        } = await sb
          .from('country_prices')
          .upsert(
            rows,
            {
              onConflict:
                'country_code,item_key'
            }
          );

        msg(
          error
            ? error.message
            : t('saved', 'Saved'),
          !!error
        );

        if (!error) {
          localPrices[
            countryCode
          ] ??= {};

          rows.forEach(row => {
            localPrices[
              countryCode
            ][
              row.item_key
            ] =
              row.price;
          });

          renderPrices();
        }
      };
  }

  /* =========================================================
     SERVICE TRANSLATIONS ADMIN
     ========================================================= */

  async function loadTranslationEditor() {
    if (!sb) return;

    const select =
      $('#translation-lang');

    if (!select) return;

    if (!select.options.length) {
      langs.forEach(l => {
        const option =
          document.createElement('option');

        option.value = l;

        option.textContent =
          WOND_TRANSLATIONS?.[l]?.name ||
          l;

        select.appendChild(option);
      });
    }

    select.value = lang;

    select.onchange =
      () =>
        fillTranslationEditor(
          select.value
        );

    await fillTranslationEditor(
      select.value
    );
  }

  async function fillTranslationEditor(
    l
  ) {
    if (!sb) return;

    const {
      data
    } = await sb
      .from('service_translations')
      .select(
        'item_key,name'
      )
      .eq(
        'lang',
        l
      );

    const map =
      Object.fromEntries(
        (data || []).map(
          x => [
            x.item_key,
            x.name
          ]
        )
      );

    const box =
      $('#translation-editor');

    if (!box) return;

    box.innerHTML = '';

    services.forEach(service => {
      const label =
        document.createElement('label');

      label.className =
        'price-edit-row';

      label.innerHTML = `
        <span>
          ${esc(
            service.item_key
          )}
          —
          ${esc(
            service.category
          )}
        </span>

        <input
          type="text"
          data-key="${esc(
            service.item_key
          )}"
          value="${esc(
            map[
              service.item_key
            ] ??
            translations?.[
              service.item_key
            ]?.[l] ??
            service.default_name ??
            ''
          )}"
        >
      `;

      box.appendChild(
        label
      );
    });
  }

  const saveTranslations =
    $('#save-translations');

  if (saveTranslations) {
    saveTranslations.onclick =
      async () => {
        if (!sb) return;

        const l =
          $('#translation-lang')
            ?.value;

        const rows =
          $$('#translation-editor input')
            .map(input => ({
              item_key:
                input.dataset.key,

              lang: l,

              name:
                input.value.trim()
            }))
            .filter(
              x => x.name
            );

        const {
          error
        } = await sb
          .from('service_translations')
          .upsert(
            rows,
            {
              onConflict:
                'item_key,lang'
            }
          );

        msg(
          error
            ? error.message
            : t('saved', 'Saved'),
          !!error
        );

        if (!error) {
          translations = {
            ...translations
          };

          rows.forEach(row => {
            translations[
              row.item_key
            ] ??= {};

            translations[
              row.item_key
            ][
              row.lang
            ] =
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
    if (!sb) return;

    const {
      data
    } = await sb
      .from('profiles')
      .select(
        'id,email,role,created_at'
      )
      .order(
        'created_at'
      );

    const box =
      $('#users-list');

    if (!box) return;

    box.innerHTML = '';

    (data || []).forEach(user => {
      const row =
        document.createElement('div');

      row.className =
        'admin-item';

      row.innerHTML = `
        <div class="admin-item-body">
          <strong>
            ${esc(
              user.email
            )}
          </strong>

          <span class="muted">
            ${esc(
              user.role
            )}
          </span>
        </div>
      `;

      if (
        user.role !== 'owner'
      ) {
        const button =
          document.createElement('button');

        button.className =
          'btn ghost dark';

        button.textContent =
          t('delete', 'Delete');

        button.onclick =
          async () => {
            const result =
              await sb.functions.invoke(
                'delete-admin',
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
                : t(
                    'saved',
                    'Saved'
                  ),
              !!result.error
            );

            await renderUsers();
          };

        row
          .querySelector(
            '.admin-item-body'
          )
          ?.appendChild(
            button
          );
      }

      box.appendChild(row);
    });
  }

  /* =========================================================
     ADD ADMIN
     ========================================================= */

  const addAdmin =
    $('#add-admin');

  if (addAdmin) {
    addAdmin.onclick =
      async () => {
        if (!sb) return;

        const email =
          $('#new-admin-email')
            ?.value.trim();

        const password =
          $('#new-admin-password')
            ?.value || '';

        if (
          !email ||
          password.length < 8
        ) {
          msg(
            'Enter e-mail and a password of at least 8 characters.',
            true
          );

          return;
        }

        const result =
          await sb.functions.invoke(
            'create-admin',
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
            : t('saved', 'Saved'),
          !!result.error
        );

        if (!result.error) {
          if ($('#new-admin-email')) {
            $('#new-admin-email').value = '';
          }

          if ($('#new-admin-password')) {
            $('#new-admin-password').value = '';
          }

          await renderUsers();
        }
      };
  }

  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  function esc(value) {
    return String(
      value ?? ''
    ).replace(
      /[&<>"']/g,
      char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char])
    );
  }

  /* =========================================================
     VAT DEBUG
     У консолі браузера можна написати:
     WOND_DEBUG_VAT()
     ========================================================= */

  window.WOND_DEBUG_VAT =
    () => {
      const code =
        String(
          $('#price-country')
            ?.value || 'CZ'
        ).toUpperCase();

      const country =
        countries.find(
          c =>
            String(c.code)
              .toUpperCase() === code
        );

      const vat =
        getVatRate(country);

      const result = {
        country: code,
        currency:
          country?.currency,
        vatRate: vat,
        vatPercent:
          `${Math.round(vat * 100)}%`,
        exampleNet: 450,
        exampleGross:
          calculateGross(
            450,
            vat
          )
      };

      console.table(result);

      return result;
    };

  /* =========================================================
     START
     ========================================================= */

  init();

})();
