(() => {
  "use strict";

  /*
   * WOND — PRICE DATA
   * -----------------------------------------
   * Цей файл містить:
   * - країни
   * - ставки VAT/DPH
   * - назви категорій
   * - назви послуг
   * - локальні базові ціни
   *
   * Рендеринг цін виконує app.js.
   * Тут НЕМАЄ другого renderPrices(), щоб
   * уникнути конфліктів між prices.js та app.js.
   */

  /* =========================================================
     COUNTRIES
     ========================================================= */

  window.WOND_COUNTRIES = [
    {
      code: "CZ",
      name: "Česko",
      currency: "CZK",
      vat: 0.21
    },
    {
      code: "UA",
      name: "Україна",
      currency: "UAH",
      vat: 0.20
    },
    {
      code: "SI",
      name: "Slovenija",
      currency: "EUR",
      vat: 0.22
    },
    {
      code: "SK",
      name: "Slovensko",
      currency: "EUR",
      vat: 0.23
    },
    {
      code: "DE",
      name: "Deutschland",
      currency: "EUR",
      vat: 0.19
    },
    {
      code: "PL",
      name: "Polska",
      currency: "PLN",
      vat: 0.23
    },
    {
      code: "RO",
      name: "România",
      currency: "RON",
      vat: 0.21
    },
    {
      code: "HU",
      name: "Magyarország",
      currency: "HUF",
      vat: 0.27
    },
    {
      code: "HR",
      name: "Hrvatska",
      currency: "EUR",
      vat: 0.25
    },
    {
      code: "GB",
      name: "United Kingdom",
      currency: "GBP",
      vat: 0.20
    }
  ];


  /* =========================================================
     SERVICE ITEMS
     ========================================================= */

  window.WOND_PRICE_ITEMS = [
    {
      item_key: "point",
      category: "electro",
      default_name: "Electrical point (socket / switch)",
      unit: ""
    },
    {
      item_key: "next_point",
      category: "electro",
      default_name: "Additional electrical point",
      unit: ""
    },
    {
      item_key: "light_point",
      category: "electro",
      default_name: "Light point",
      unit: ""
    },
    {
      item_key: "cable",
      category: "electro",
      default_name: "Cable installation in conduit",
      unit: "/m"
    },
    {
      item_key: "groove",
      category: "electro",
      default_name: "Chasing and making good",
      unit: "/m"
    },
    {
      item_key: "switch",
      category: "electro",
      default_name: "Single switch",
      unit: ""
    },
    {
      item_key: "double_switch",
      category: "electro",
      default_name: "Double switch",
      unit: ""
    },
    {
      item_key: "socket",
      category: "electro",
      default_name: "Single socket",
      unit: ""
    },
    {
      item_key: "double_socket",
      category: "electro",
      default_name: "Double socket",
      unit: ""
    },
    {
      item_key: "usb_socket",
      category: "electro",
      default_name: "USB socket",
      unit: ""
    },
    {
      item_key: "rj45",
      category: "electro",
      default_name: "RJ45 socket",
      unit: ""
    },
    {
      item_key: "tv",
      category: "electro",
      default_name: "TV socket",
      unit: ""
    },
    {
      item_key: "lamp",
      category: "electro",
      default_name: "Light fitting installation",
      unit: ""
    },
    {
      item_key: "led",
      category: "electro",
      default_name: "LED light fitting",
      unit: ""
    },
    {
      item_key: "dimmer",
      category: "electro",
      default_name: "Dimmer",
      unit: ""
    },

    {
      item_key: "ppr",
      category: "plumbing",
      default_name: "PPR pipe",
      unit: "/m"
    },
    {
      item_key: "alupex",
      category: "plumbing",
      default_name: "ALUPEX pipe",
      unit: "/m"
    },
    {
      item_key: "drain",
      category: "plumbing",
      default_name: "Drainage pipe",
      unit: "/m"
    },
    {
      item_key: "water_point",
      category: "plumbing",
      default_name: "Hot + cold water point",
      unit: ""
    },
    {
      item_key: "double_water",
      category: "plumbing",
      default_name: "Double water point",
      unit: ""
    },
    {
      item_key: "washer",
      category: "plumbing",
      default_name: "Washing machine connection",
      unit: ""
    },
    {
      item_key: "dishwasher",
      category: "plumbing",
      default_name: "Dishwasher connection",
      unit: ""
    },
    {
      item_key: "boiler_conn",
      category: "plumbing",
      default_name: "Boiler connection",
      unit: ""
    },
    {
      item_key: "boiler_small",
      category: "plumbing",
      default_name: "Boiler installation up to 100 l",
      unit: ""
    },
    {
      item_key: "boiler_large",
      category: "plumbing",
      default_name: "Boiler installation 100–200 l",
      unit: ""
    },
    {
      item_key: "sanitary",
      category: "plumbing",
      default_name: "Sanitary equipment installation",
      unit: ""
    },
    {
      item_key: "manifold",
      category: "plumbing",
      default_name: "Manifold",
      unit: ""
    },
    {
      item_key: "filter",
      category: "plumbing",
      default_name: "Water filter",
      unit: ""
    },
    {
      item_key: "reducer",
      category: "plumbing",
      default_name: "Pressure reducing valve",
      unit: ""
    },

    {
      item_key: "panel24",
      category: "panel",
      default_name: "24-module distribution board",
      unit: ""
    },
    {
      item_key: "panel36",
      category: "panel",
      default_name: "36-module distribution board",
      unit: ""
    },
    {
      item_key: "panel48",
      category: "panel",
      default_name: "48-module distribution board",
      unit: ""
    },
    {
      item_key: "panel72",
      category: "panel",
      default_name: "72-module distribution board",
      unit: ""
    },
    {
      item_key: "spd2",
      category: "panel",
      default_name: "Surge protection SPD type 2",
      unit: ""
    },
    {
      item_key: "voltage",
      category: "panel",
      default_name: "Voltage relay / protection",
      unit: ""
    },
    {
      item_key: "breaker",
      category: "panel",
      default_name: "Circuit breaker",
      unit: ""
    },
    {
      item_key: "rcd",
      category: "panel",
      default_name: "RCD",
      unit: ""
    },
    {
      item_key: "rcbo",
      category: "panel",
      default_name: "RCBO combination",
      unit: ""
    },

    {
      item_key: "basic",
      category: "inspection",
      default_name: "Basic electrical installation inspection",
      unit: ""
    },
    {
      item_key: "visual",
      category: "inspection",
      default_name: "Visual inspection",
      unit: ""
    },
    {
      item_key: "report",
      category: "inspection",
      default_name: "Inspection report",
      unit: ""
    },

    {
      item_key: "travel50",
      category: "travel",
      default_name: "Site visit up to 50 km",
      unit: ""
    }
  ];


  /* =========================================================
     LOCAL PRICES
     ========================================================= */

  window.WOND_LOCAL_PRICES = {

    /* =========================
       CZECHIA
       ========================= */

    CZ: {
      point: 450,
      next_point: 350,
      light_point: 350,
      cable: 90,
      groove: 220,
      switch: 300,
      double_switch: 400,
      socket: 300,
      double_socket: 400,
      usb_socket: 450,
      rj45: 400,
      tv: 400,
      lamp: 400,
      led: 450,
      dimmer: 450,

      ppr: 180,
      alupex: 220,
      drain: 250,
      water_point: 650,
      double_water: 1100,
      washer: 750,
      dishwasher: 750,
      boiler_conn: 1000,
      boiler_small: 2000,
      boiler_large: 2800,
      sanitary: 750,
      manifold: 2000,
      filter: 700,
      reducer: 1000,

      panel24: 11000,
      panel36: 14000,
      panel48: 18000,
      panel72: 25000,
      spd2: 2800,
      voltage: 2800,
      breaker: 350,
      rcd: 1400,
      rcbo: 1300,

      basic: 1200,
      visual: 900,
      report: 0,

      travel50: 500
    },


    /* =========================
       UKRAINE
       ========================= */

    UA: {
      point: 470,
      next_point: 370,
      light_point: 370,
      cable: 94,
      groove: 230,
      switch: 320,
      double_switch: 420,
      socket: 320,
      double_socket: 420,
      usb_socket: 470,
      rj45: 420,
      tv: 420,
      lamp: 420,
      led: 470,
      dimmer: 470,

      ppr: 190,
      alupex: 230,
      drain: 260,
      water_point: 680,
      double_water: 1160,
      washer: 790,
      dishwasher: 790,
      boiler_conn: 1050,
      boiler_small: 2100,
      boiler_large: 2940,
      sanitary: 790,
      manifold: 2100,
      filter: 740,
      reducer: 1050,

      panel24: 11550,
      panel36: 14700,
      panel48: 18900,
      panel72: 26250,
      spd2: 2940,
      voltage: 2940,
      breaker: 370,
      rcd: 1470,
      rcbo: 1360,

      basic: 1260,
      visual: 940,
      report: 0,

      travel50: 520
    },


    /* =========================
       SLOVENIA
       ========================= */

    SI: {
      point: 18.45,
      next_point: 14.35,
      light_point: 14.35,
      cable: 3.69,
      groove: 9.02,
      switch: 12.3,
      double_switch: 16.4,
      socket: 12.3,
      double_socket: 16.4,
      usb_socket: 18.45,
      rj45: 16.4,
      tv: 16.4,
      lamp: 16.4,
      led: 18.45,
      dimmer: 18.45,

      ppr: 7.38,
      alupex: 9.02,
      drain: 10.25,
      water_point: 26.65,
      double_water: 45.1,
      washer: 30.75,
      dishwasher: 30.75,
      boiler_conn: 41,
      boiler_small: 82,
      boiler_large: 114.8,
      sanitary: 30.75,
      manifold: 82,
      filter: 28.7,
      reducer: 41,

      panel24: 451,
      panel36: 574,
      panel48: 738,
      panel72: 1025,
      spd2: 114.8,
      voltage: 114.8,
      breaker: 14.35,
      rcd: 57.4,
      rcbo: 53.3,

      basic: 49.2,
      visual: 36.9,
      report: 0,

      travel50: 20.5
    },


    /* =========================
       SLOVAKIA
       ========================= */

    SK: {
      point: 18.45,
      next_point: 14.35,
      light_point: 14.35,
      cable: 3.69,
      groove: 9.02,
      switch: 12.3,
      double_switch: 16.4,
      socket: 12.3,
      double_socket: 16.4,
      usb_socket: 18.45,
      rj45: 16.4,
      tv: 16.4,
      lamp: 16.4,
      led: 18.45,
      dimmer: 18.45,

      ppr: 7.38,
      alupex: 9.02,
      drain: 10.25,
      water_point: 26.65,
      double_water: 45.1,
      washer: 30.75,
      dishwasher: 30.75,
      boiler_conn: 41,
      boiler_small: 82,
      boiler_large: 114.8,
      sanitary: 30.75,
      manifold: 82,
      filter: 28.7,
      reducer: 41,

      panel24: 451,
      panel36: 574,
      panel48: 738,
      panel72: 1025,
      spd2: 114.8,
      voltage: 114.8,
      breaker: 14.35,
      rcd: 57.4,
      rcbo: 53.3,

      basic: 49.2,
      visual: 36.9,
      report: 0,

      travel50: 20.5
    },


    /* =========================
       GERMANY
       ========================= */

    DE: {
      point: 18.45,
      next_point: 14.35,
      light_point: 14.35,
      cable: 3.69,
      groove: 9.02,
      switch: 12.3,
      double_switch: 16.4,
      socket: 12.3,
      double_socket: 16.4,
      usb_socket: 18.45,
      rj45: 16.4,
      tv: 16.4,
      lamp: 16.4,
      led: 18.45,
      dimmer: 18.45,

      ppr: 7.38,
      alupex: 9.02,
      drain: 10.25,
      water_point: 26.65,
      double_water: 45.1,
      washer: 30.75,
      dishwasher: 30.75,
      boiler_conn: 41,
      boiler_small: 82,
      boiler_large: 114.8,
      sanitary: 30.75,
      manifold: 82,
      filter: 28.7,
      reducer: 41,

      panel24: 451,
      panel36: 574,
      panel48: 738,
      panel72: 1025,
      spd2: 114.8,
      voltage: 114.8,
      breaker: 14.35,
      rcd: 57.4,
      rcbo: 53.3,

      basic: 49.2,
      visual: 36.9,
      report: 0,

      travel50: 20.5
    },


    /* =========================
       POLAND
       ========================= */

    PL: {
      point: 79,
      next_point: 61,
      light_point: 61,
      cable: 16,
      groove: 38,
      switch: 52,
      double_switch: 70,
      socket: 52,
      double_socket: 70,
      usb_socket: 79,
      rj45: 70,
      tv: 70,
      lamp: 70,
      led: 79,
      dimmer: 79,

      ppr: 31,
      alupex: 38,
      drain: 44,
      water_point: 114,
      double_water: 192,
      washer: 131,
      dishwasher: 131,
      boiler_conn: 175,
      boiler_small: 350,
      boiler_large: 490,
      sanitary: 131,
      manifold: 350,
      filter: 122,
      reducer: 175,

      panel24: 1925,
      panel36: 2450,
      panel48: 3150,
      panel72: 4375,
      spd2: 490,
      voltage: 490,
      breaker: 61,
      rcd: 245,
      rcbo: 227,

      basic: 210,
      visual: 158,
      report: 0,

      travel50: 88
    },


    /* =========================
       ROMANIA
       ========================= */

    RO: {
      point: 92,
      next_point: 72,
      light_point: 72,
      cable: 18,
      groove: 45,
      switch: 61,
      double_switch: 82,
      socket: 61,
      double_socket: 82,
      usb_socket: 92,
      rj45: 82,
      tv: 82,
      lamp: 82,
      led: 92,
      dimmer: 92,

      ppr: 37,
      alupex: 45,
      drain: 51,
      water_point: 133,
      double_water: 226,
      washer: 154,
      dishwasher: 154,
      boiler_conn: 205,
      boiler_small: 410,
      boiler_large: 574,
      sanitary: 154,
      manifold: 410,
      filter: 144,
      reducer: 205,

      panel24: 2255,
      panel36: 2870,
      panel48: 3690,
      panel72: 5125,
      spd2: 574,
      voltage: 574,
      breaker: 72,
      rcd: 287,
      rcbo: 266,

      basic: 246,
      visual: 184,
      report: 0,

      travel50: 102
    },


    /* =========================
       HUNGARY
       ========================= */

    HU: {
      point: 7290,
      next_point: 5670,
      light_point: 5670,
      cable: 1458,
      groove: 3564,
      switch: 4860,
      double_switch: 6480,
      socket: 4860,
      double_socket: 6480,
      usb_socket: 7290,
      rj45: 6480,
      tv: 6480,
      lamp: 6480,
      led: 7290,
      dimmer: 7290,

      ppr: 2916,
      alupex: 3564,
      drain: 4050,
      water_point: 10530,
      double_water: 17820,
      washer: 12150,
      dishwasher: 12150,
      boiler_conn: 16200,
      boiler_small: 32400,
      boiler_large: 45360,
      sanitary: 12150,
      manifold: 32400,
      filter: 11340,
      reducer: 16200,

      panel24: 178200,
      panel36: 226800,
      panel48: 291600,
      panel72: 405000,
      spd2: 45360,
      voltage: 45360,
      breaker: 5670,
      rcd: 22680,
      rcbo: 21060,

      basic: 19440,
      visual: 14580,
      report: 0,

      travel50: 8100
    },


    /* =========================
       CROATIA
       ========================= */

    HR: {
      point: 18.45,
      next_point: 14.35,
      light_point: 14.35,
      cable: 3.69,
      groove: 9.02,
      switch: 12.3,
      double_switch: 16.4,
      socket: 12.3,
      double_socket: 16.4,
      usb_socket: 18.45,
      rj45: 16.4,
      tv: 16.4,
      lamp: 16.4,
      led: 18.45,
      dimmer: 18.45,

      ppr: 7.38,
      alupex: 9.02,
      drain: 10.25,
      water_point: 26.65,
      double_water: 45.1,
      washer: 30.75,
      dishwasher: 30.75,
      boiler_conn: 41,
      boiler_small: 82,
      boiler_large: 114.8,
      sanitary: 30.75,
      manifold: 82,
      filter: 28.7,
      reducer: 41,

      panel24: 451,
      panel36: 574,
      panel48: 738,
      panel72: 1025,
      spd2: 114.8,
      voltage: 114.8,
      breaker: 14.35,
      rcd: 57.4,
      rcbo: 53.3,

      basic: 49.2,
      visual: 36.9,
      report: 0,

      travel50: 20.5
    },


    /* =========================
       UNITED KINGDOM
       ========================= */

    GB: {
      point: 15.75,
      next_point: 12.25,
      light_point: 12.25,
      cable: 3.15,
      groove: 7.7,
      switch: 10.5,
      double_switch: 14,
      socket: 10.5,
      double_socket: 14,
      usb_socket: 15.75,
      rj45: 14,
      tv: 14,
      lamp: 14,
      led: 15.75,
      dimmer: 15.75,

      ppr: 6.3,
      alupex: 7.7,
      drain: 8.75,
      water_point: 22.75,
      double_water: 38.5,
      washer: 26.25,
      dishwasher: 26.25,
      boiler_conn: 35,
      boiler_small: 70,
      boiler_large: 98,
      sanitary: 26.25,
      manifold: 70,
      filter: 24.5,
      reducer: 35,

      panel24: 385,
      panel36: 490,
      panel48: 630,
      panel72: 875,
      spd2: 98,
      voltage: 98,
      breaker: 12.25,
      rcd: 49,
      rcbo: 45.5,

      basic: 42,
      visual: 31.5,
      report: 0,

      travel50: 17.5
    }
  };


  /* =========================================================
     COUNTRY NAMES
     ========================================================= */

  window.WOND_COUNTRY_NAMES = {

    uk: {
      CZ: "Чехія",
      UA: "Україна",
      SI: "Словенія",
      SK: "Словаччина",
      DE: "Німеччина",
      PL: "Польща",
      RO: "Румунія",
      HU: "Угорщина",
      HR: "Хорватія",
      GB: "Велика Британія"
    },

    cs: {
      CZ: "Česko",
      UA: "Ukrajina",
      SI: "Slovinsko",
      SK: "Slovensko",
      DE: "Německo",
      PL: "Polsko",
      RO: "Rumunsko",
      HU: "Maďarsko",
      HR: "Chorvatsko",
      GB: "Velká Británie"
    },

    sl: {
      CZ: "Češka",
      UA: "Ukrajina",
      SI: "Slovenija",
      SK: "Slovaška",
      DE: "Nemčija",
      PL: "Poljska",
      RO: "Romunija",
      HU: "Madžarska",
      HR: "Hrvaška",
      GB: "Velika Britanija"
    },

    sk: {
      CZ: "Česko",
      UA: "Ukrajina",
      SI: "Slovinsko",
      SK: "Slovensko",
      DE: "Nemecko",
      PL: "Poľsko",
      RO: "Rumunsko",
      HU: "Maďarsko",
      HR: "Chorvátsko",
      GB: "Veľká Británia"
    },

    de: {
      CZ: "Tschechien",
      UA: "Ukraine",
      SI: "Slowenien",
      SK: "Slowakei",
      DE: "Deutschland",
      PL: "Polen",
      RO: "Rumänien",
      HU: "Ungarn",
      HR: "Kroatien",
      GB: "Vereinigtes Königreich"
    },

    en: {
      CZ: "Czechia",
      UA: "Ukraine",
      SI: "Slovenia",
      SK: "Slovakia",
      DE: "Germany",
      PL: "Poland",
      RO: "Romania",
      HU: "Hungary",
      HR: "Croatia",
      GB: "United Kingdom"
    },

    hr: {
      CZ: "Češka",
      UA: "Ukrajina",
      SI: "Slovenija",
      SK: "Slovačka",
      DE: "Njemačka",
      PL: "Poljska",
      RO: "Rumunjska",
      HU: "Mađarska",
      HR: "Hrvatska",
      GB: "Ujedinjeno Kraljevstvo"
    },

    sr: {
      CZ: "Češka",
      UA: "Ukrajina",
      SI: "Slovenija",
      SK: "Slovačka",
      DE: "Njemačka",
      PL: "Poljska",
      RO: "Rumunija",
      HU: "Mađarska",
      HR: "Hrvatska",
      GB: "Velika Britanija"
    },

    it: {
      CZ: "Cechia",
      UA: "Ucraina",
      SI: "Slovenia",
      SK: "Slovacchia",
      DE: "Germania",
      PL: "Polonia",
      RO: "Romania",
      HU: "Ungheria",
      HR: "Croazia",
      GB: "Regno Unito"
    },

    hu: {
      CZ: "Csehország",
      UA: "Ukrajna",
      SI: "Szlovénia",
      SK: "Szlovákia",
      DE: "Németország",
      PL: "Lengyelország",
      RO: "Románia",
      HU: "Magyarország",
      HR: "Horvátország",
      GB: "Egyesült Királyság"
    },

    pl: {
      CZ: "Czechy",
      UA: "Ukraina",
      SI: "Słowenia",
      SK: "Słowacja",
      DE: "Niemcy",
      PL: "Polska",
      RO: "Rumunia",
      HU: "Węgry",
      HR: "Chorwacja",
      GB: "Wielka Brytania"
    },

    ro: {
      CZ: "Cehia",
      UA: "Ucraina",
      SI: "Slovenia",
      SK: "Slovacia",
      DE: "Germania",
      PL: "Polonia",
      RO: "România",
      HU: "Ungaria",
      HR: "Croația",
      GB: "Regatul Unit"
    }
  };


  /* =========================================================
     CATEGORY NAMES
     ========================================================= */

  window.WOND_CATEGORY_NAMES = {

    uk: {
      electro: "Електрика",
      plumbing: "Сантехніка",
      panel: "Електрощити",
      inspection: "Перевірка та ревізія",
      travel: "Виїзд"
    },

    cs: {
      electro: "Elektro",
      plumbing: "Voda a topení",
      panel: "Rozvaděče",
      inspection: "Kontrola a revize",
      travel: "Výjezd"
    },

    sl: {
      electro: "Elektrika",
      plumbing: "Vodovod",
      panel: "Električne omarice",
      inspection: "Kontrola in revizija",
      travel: "Izvoz"
    },

    sk: {
      electro: "Elektro",
      plumbing: "Voda a kúrenie",
      panel: "Rozvádzače",
      inspection: "Kontrola a revízia",
      travel: "Výjazd"
    },

    de: {
      electro: "Elektro",
      plumbing: "Sanitär",
      panel: "Verteiler",
      inspection: "Prüfung und Revision",
      travel: "Anfahrt"
    },

    en: {
      electro: "Electrical",
      plumbing: "Plumbing",
      panel: "Distribution boards",
      inspection: "Inspection",
      travel: "Travel"
    },

    hr: {
      electro: "Elektrika",
      plumbing: "Vodoinstalacije",
      panel: "Razvodni ormari",
      inspection: "Kontrola i revizija",
      travel: "Izlazak"
    },

    sr: {
      electro: "Elektrika",
      plumbing: "Vodoinstalacije",
      panel: "Razvodni ormari",
      inspection: "Kontrola i revizija",
      travel: "Izlazak"
    },

    it: {
      electro: "Elettrico",
      plumbing: "Idraulica",
      panel: "Quadri elettrici",
      inspection: "Controllo e revisione",
      travel: "Uscita"
    },

    hu: {
      electro: "Villanyszerelés",
      plumbing: "Vízszerelés",
      panel: "Elosztószekrények",
      inspection: "Ellenőrzés",
      travel: "Kiszállás"
    },

    pl: {
      electro: "Elektryka",
      plumbing: "Hydraulika",
      panel: "Rozdzielnice",
      inspection: "Kontrola i przegląd",
      travel: "Dojazd"
    },

    ro: {
      electro: "Electrică",
      plumbing: "Instalații sanitare",
      panel: "Tablouri electrice",
      inspection: "Control și verificare",
      travel: "Deplasare"
    }
  };


  /* =========================================================
     FALLBACK SERVICE NAMES
     ========================================================= */

  window.WOND_PRICE_TRANSLATIONS = {

    point: {
      uk: "Електрична точка (розетка / вимикач)",
      en: "Electrical point (socket / switch)"
    },

    next_point: {
      uk: "Додаткова електрична точка",
      en: "Additional electrical point"
    },

    light_point: {
      uk: "Світлова точка",
      en: "Light point"
    },

    cable: {
      uk: "Прокладання кабелю в трубі",
      en: "Cable installation in conduit"
    },

    groove: {
      uk: "Штроблення та закладення штроб",
      en: "Chasing and making good"
    },

    switch: {
      uk: "Одноклавішний вимикач",
      en: "Single switch"
    },

    double_switch: {
      uk: "Двоклавішний вимикач",
      en: "Double switch"
    },

    socket: {
      uk: "Одинарна розетка",
      en: "Single socket"
    },

    double_socket: {
      uk: "Подвійна розетка",
      en: "Double socket"
    },

    usb_socket: {
      uk: "USB розетка",
      en: "USB socket"
    },

    rj45: {
      uk: "RJ45 розетка",
      en: "RJ45 socket"
    },

    tv: {
      uk: "TV розетка",
      en: "TV socket"
    },

    lamp: {
      uk: "Монтаж світильника",
      en: "Light fitting installation"
    },

    led: {
      uk: "LED світильник",
      en: "LED light fitting"
    },

    dimmer: {
      uk: "Димер",
      en: "Dimmer"
    },

    ppr: {
      uk: "PPR труба",
      en: "PPR pipe"
    },

    alupex: {
      uk: "ALUPEX труба",
      en: "ALUPEX pipe"
    },

    drain: {
      uk: "Каналізаційна труба",
      en: "Drainage pipe"
    },

    water_point: {
      uk: "Водяна точка гаряча + холодна",
      en: "Hot + cold water point"
    },

    double_water: {
      uk: "Подвійна водяна точка",
      en: "Double water point"
    },

    washer: {
      uk: "Підключення пральної машини",
      en: "Washing machine connection"
    },

    dishwasher: {
      uk: "Підключення посудомийної машини",
      en: "Dishwasher connection"
    },

    boiler_conn: {
      uk: "Підключення бойлера",
      en: "Boiler connection"
    },

    boiler_small: {
      uk: "Монтаж бойлера до 100 л",
      en: "Boiler installation up to 100 l"
    },

    boiler_large: {
      uk: "Монтаж бойлера 100–200 л",
      en: "Boiler installation 100–200 l"
    },

    sanitary: {
      uk: "Монтаж сантехнічного обладнання",
      en: "Sanitary equipment installation"
    },

    manifold: {
      uk: "Колектор",
      en: "Manifold"
    },

    filter: {
      uk: "Фільтр для води",
      en: "Water filter"
    },

    reducer: {
      uk: "Редуктор тиску",
      en: "Pressure reducing valve"
    },

    panel24: {
      uk: "Електрощит 24 модулі",
      en: "24-module distribution board"
    },

    panel36: {
      uk: "Електрощит 36 модулів",
      en: "36-module distribution board"
    },

    panel48: {
      uk: "Електрощит 48 модулів",
      en: "48-module distribution board"
    },

    panel72: {
      uk: "Електрощит 72 модулі",
      en: "72-module distribution board"
    },

    spd2: {
      uk: "Захист від перенапруги SPD тип 2",
      en: "Surge protection SPD type 2"
    },

    voltage: {
      uk: "Реле / захист напруги",
      en: "Voltage relay / protection"
    },

    breaker: {
      uk: "Автоматичний вимикач",
      en: "Circuit breaker"
    },

    rcd: {
      uk: "ПЗВ FI/RCD",
      en: "RCD"
    },

    rcbo: {
      uk: "RCBO комбінація",
      en: "RCBO combination"
    },

    basic: {
      uk: "Базова перевірка електроустановки",
      en: "Basic electrical installation inspection"
    },

    visual: {
      uk: "Візуальна перевірка",
      en: "Visual inspection"
    },

    report: {
      uk: "Звіт про перевірку",
      en: "Inspection report"
    },

    travel50: {
      uk: "Виїзд на об’єкт до 50 км",
      en: "Site visit up to 50 km"
    }
  };


  /* =========================================================
     HELPERS
     ========================================================= */

  window.WOND_PRICE_HELPERS = {

    getCountry(code) {
      return window.WOND_COUNTRIES.find(
        country => country.code === code
      ) || window.WOND_COUNTRIES[0];
    },

    getVat(code) {
      const country = this.getCountry(code);
      return Number(country?.vat || 0);
    },

    getGross(net, code) {
      const vat = this.getVat(code);
      return Number(net || 0) * (1 + vat);
    },

    getNetFromGross(gross, code) {
      const vat = this.getVat(code);
      return vat > 0
        ? Number(gross || 0) / (1 + vat)
        : Number(gross || 0);
    },

    getVatPercent(code) {
      return Math.round(this.getVat(code) * 100);
    },

    getPrice(countryCode, itemKey) {
      return Number(
        window.WOND_LOCAL_PRICES?.[countryCode]?.[itemKey] ?? 0
      );
    }
  };


  /* =========================================================
     IMPORTANT:
     *
     * app.js is responsible for:
     * - rendering #price-grid
     * - selecting country
     * - selecting VAT mode
     * - loading Supabase prices
     * - loading Supabase countries
     * - loading translations
     *
     * Therefore prices.js intentionally does not attach
     * duplicate event listeners.
     * ========================================================= */

})();
