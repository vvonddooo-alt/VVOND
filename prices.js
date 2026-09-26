/* =========================================================
   WOND — prices.js
   Автоматичний ceník + DPH/VAT
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     COUNTRIES
     ========================================================= */

  window.WOND_COUNTRIES = [
    { code: "CZ", name: "Česko", currency: "CZK", vat: 0.21 },
    { code: "UA", name: "Україна", currency: "UAH", vat: 0.20 },
    { code: "SI", name: "Slovenija", currency: "EUR", vat: 0.22 },
    { code: "SK", name: "Slovensko", currency: "EUR", vat: 0.23 },
    { code: "DE", name: "Deutschland", currency: "EUR", vat: 0.19 },
    { code: "PL", name: "Polska", currency: "PLN", vat: 0.23 },
    { code: "RO", name: "România", currency: "RON", vat: 0.21 },
    { code: "HU", name: "Magyarország", currency: "HUF", vat: 0.27 },
    { code: "HR", name: "Hrvatska", currency: "EUR", vat: 0.25 },
    { code: "GB", name: "United Kingdom", currency: "GBP", vat: 0.20 }
  ];


  /* =========================================================
     PRICE ITEMS
     ========================================================= */

  window.WOND_PRICE_ITEMS = [
    {
      category: "electro",
      item_key: "point",
      name: "Elektro bod (zásuvka / vypínač)",
      unit: "",
      sort_order: 0
    },
    {
      category: "electro",
      item_key: "next_point",
      name: "Další elektro bod",
      unit: "",
      sort_order: 1
    },
    {
      category: "electro",
      item_key: "light_point",
      name: "Světelný bod",
      unit: "",
      sort_order: 2
    },
    {
      category: "electro",
      item_key: "cable",
      name: "Uložení kabelu v trubce",
      unit: "/m",
      sort_order: 3
    },
    {
      category: "electro",
      item_key: "groove",
      name: "Sekání a zapravení drážek",
      unit: "/m",
      sort_order: 4
    },
    {
      category: "electro",
      item_key: "switch",
      name: "Jednoduchý vypínač",
      unit: "",
      sort_order: 5
    },
    {
      category: "electro",
      item_key: "double_switch",
      name: "Dvojitý vypínač",
      unit: "",
      sort_order: 6
    },
    {
      category: "electro",
      item_key: "socket",
      name: "Jednoduchá zásuvka",
      unit: "",
      sort_order: 7
    },
    {
      category: "electro",
      item_key: "double_socket",
      name: "Dvojitá zásuvka",
      unit: "",
      sort_order: 8
    },
    {
      category: "electro",
      item_key: "usb_socket",
      name: "USB zásuvka",
      unit: "",
      sort_order: 9
    },
    {
      category: "electro",
      item_key: "rj45",
      name: "RJ45 zásuvka",
      unit: "",
      sort_order: 10
    },
    {
      category: "electro",
      item_key: "tv",
      name: "TV zásuvka",
      unit: "",
      sort_order: 11
    },
    {
      category: "electro",
      item_key: "lamp",
      name: "Montáž svítidla",
      unit: "",
      sort_order: 12
    },
    {
      category: "electro",
      item_key: "led",
      name: "LED svítidlo",
      unit: "",
      sort_order: 13
    },
    {
      category: "electro",
      item_key: "dimmer",
      name: "Stmívač",
      unit: "",
      sort_order: 14
    },

    {
      category: "plumbing",
      item_key: "ppr",
      name: "PPR potrubí",
      unit: "/m",
      sort_order: 15
    },
    {
      category: "plumbing",
      item_key: "alupex",
      name: "ALUPEX potrubí",
      unit: "/m",
      sort_order: 16
    },
    {
      category: "plumbing",
      item_key: "drain",
      name: "Kanalizační potrubí",
      unit: "/m",
      sort_order: 17
    },
    {
      category: "plumbing",
      item_key: "water_point",
      name: "Vodní bod teplá + studená",
      unit: "",
      sort_order: 18
    },
    {
      category: "plumbing",
      item_key: "double_water",
      name: "Dvojitý vodní bod",
      unit: "",
      sort_order: 19
    },
    {
      category: "plumbing",
      item_key: "washer",
      name: "Přípojka pro pračku",
      unit: "",
      sort_order: 20
    },
    {
      category: "plumbing",
      item_key: "dishwasher",
      name: "Přípojka pro myčku",
      unit: "",
      sort_order: 21
    },
    {
      category: "plumbing",
      item_key: "boiler_conn",
      name: "Přípojka pro bojler",
      unit: "",
      sort_order: 22
    },
    {
      category: "plumbing",
      item_key: "boiler_small",
      name: "Montáž bojleru do 100 l",
      unit: "",
      sort_order: 23
    },
    {
      category: "plumbing",
      item_key: "boiler_large",
      name: "Montáž bojleru 100–200 l",
      unit: "",
      sort_order: 24
    },
    {
      category: "plumbing",
      item_key: "sanitary",
      name: "Montáž sanitárního vybavení",
      unit: "",
      sort_order: 25
    },
    {
      category: "plumbing",
      item_key: "manifold",
      name: "Rozdělovač",
      unit: "",
      sort_order: 26
    },
    {
      category: "plumbing",
      item_key: "filter",
      name: "Vodní filtr",
      unit: "",
      sort_order: 27
    },
    {
      category: "plumbing",
      item_key: "reducer",
      name: "Redukční ventil",
      unit: "",
      sort_order: 28
    },

    {
      category: "panel",
      item_key: "panel24",
      name: "Rozvaděč 24 modulů",
      unit: "",
      sort_order: 29
    },
    {
      category: "panel",
      item_key: "panel36",
      name: "Rozvaděč 36 modulů",
      unit: "",
      sort_order: 30
    },
    {
      category: "panel",
      item_key: "panel48",
      name: "Rozvaděč 48 modulů",
      unit: "",
      sort_order: 31
    },
    {
      category: "panel",
      item_key: "panel72",
      name: "Rozvaděč 72 modulů",
      unit: "",
      sort_order: 32
    },
    {
      category: "panel",
      item_key: "spd2",
      name: "Přepěťová ochrana SPD typ 2",
      unit: "",
      sort_order: 33
    },
    {
      category: "panel",
      item_key: "voltage",
      name: "Relé / ochrana napětí",
      unit: "",
      sort_order: 34
    },
    {
      category: "panel",
      item_key: "breaker",
      name: "Jistič",
      unit: "",
      sort_order: 35
    },
    {
      category: "panel",
      item_key: "rcd",
      name: "Proudový chránič FI/RCD",
      unit: "",
      sort_order: 36
    },
    {
      category: "panel",
      item_key: "rcbo",
      name: "RCBO kombinace",
      unit: "",
      sort_order: 37
    },

    {
      category: "inspection",
      item_key: "basic",
      name: "Základní kontrola elektroinstalace",
      unit: "",
      sort_order: 38
    },
    {
      category: "inspection",
      item_key: "visual",
      name: "Vizuální kontrola",
      unit: "",
      sort_order: 39
    },
    {
      category: "inspection",
      item_key: "report",
      name: "Revizní zpráva",
      unit: "dle rozsahu",
      sort_order: 40
    },

    {
      category: "travel",
      item_key: "travel50",
      name: "Výjezd na místo do 50 km",
      unit: "",
      sort_order: 41
    }
  ];


  /* =========================================================
     LOCAL PRICES
     ========================================================= */

  window.WOND_LOCAL_PRICES = {

    CZ: {
      point:450,
      next_point:350,
      light_point:350,
      cable:90,
      groove:220,
      switch:300,
      double_switch:400,
      socket:300,
      double_socket:400,
      usb_socket:450,
      rj45:400,
      tv:400,
      lamp:400,
      led:450,
      dimmer:450,
      ppr:180,
      alupex:220,
      drain:250,
      water_point:650,
      double_water:1100,
      washer:750,
      dishwasher:750,
      boiler_conn:1000,
      boiler_small:2000,
      boiler_large:2800,
      sanitary:750,
      manifold:2000,
      filter:700,
      reducer:1000,
      panel24:11000,
      panel36:14000,
      panel48:18000,
      panel72:25000,
      spd2:2800,
      voltage:2800,
      breaker:350,
      rcd:1400,
      rcbo:1300,
      basic:1200,
      visual:900,
      report:0,
      travel50:500
    },

    UA: {
      point:470,
      next_point:370,
      light_point:370,
      cable:94,
      groove:230,
      switch:320,
      double_switch:420,
      socket:320,
      double_socket:420,
      usb_socket:470,
      rj45:420,
      tv:420,
      lamp:420,
      led:470,
      dimmer:470,
      ppr:190,
      alupex:230,
      drain:260,
      water_point:680,
      double_water:1160,
      washer:790,
      dishwasher:790,
      boiler_conn:1050,
      boiler_small:2100,
      boiler_large:2940,
      sanitary:790,
      manifold:2100,
      filter:740,
      reducer:1050,
      panel24:11550,
      panel36:14700,
      panel48:18900,
      panel72:26250,
      spd2:2940,
      voltage:2940,
      breaker:370,
      rcd:1470,
      rcbo:1360,
      basic:1260,
      visual:940,
      report:0,
      travel50:520
    },

    SI: {
      point:18.45,
      next_point:14.35,
      light_point:14.35,
      cable:3.69,
      groove:9.02,
      switch:12.3,
      double_switch:16.4,
      socket:12.3,
      double_socket:16.4,
      usb_socket:18.45,
      rj45:16.4,
      tv:16.4,
      lamp:16.4,
      led:18.45,
      dimmer:18.45,
      ppr:7.38,
      alupex:9.02,
      drain:10.25,
      water_point:26.65,
      double_water:45.1,
      washer:30.75,
      dishwasher:30.75,
      boiler_conn:41,
      boiler_small:82,
      boiler_large:114.8,
      sanitary:30.75,
      manifold:82,
      filter:28.7,
      reducer:41,
      panel24:451,
      panel36:574,
      panel48:738,
      panel72:1025,
      spd2:114.8,
      voltage:114.8,
      breaker:14.35,
      rcd:57.4,
      rcbo:53.3,
      basic:49.2,
      visual:36.9,
      report:0,
      travel50:20.5
    },

    SK: {
      point:18.45,
      next_point:14.35,
      light_point:14.35,
      cable:3.69,
      groove:9.02,
      switch:12.3,
      double_switch:16.4,
      socket:12.3,
      double_socket:16.4,
      usb_socket:18.45,
      rj45:16.4,
      tv:16.4,
      lamp:16.4,
      led:18.45,
      dimmer:18.45,
      ppr:7.38,
      alupex:9.02,
      drain:10.25,
      water_point:26.65,
      double_water:45.1,
      washer:30.75,
      dishwasher:30.75,
      boiler_conn:41,
      boiler_small:82,
      boiler_large:114.8,
      sanitary:30.75,
      manifold:82,
      filter:28.7,
      reducer:41,
      panel24:451,
      panel36:574,
      panel48:738,
      panel72:1025,
      spd2:114.8,
      voltage:114.8,
      breaker:14.35,
      rcd:57.4,
      rcbo:53.3,
      basic:49.2,
      visual:36.9,
      report:0,
      travel50:20.5
    },

    DE: {
      point:18.45,
      next_point:14.35,
      light_point:14.35,
      cable:3.69,
      groove:9.02,
      switch:12.3,
      double_switch:16.4,
      socket:12.3,
      double_socket:16.4,
      usb_socket:18.45,
      rj45:16.4,
      tv:16.4,
      lamp:16.4,
      led:18.45,
      dimmer:18.45,
      ppr:7.38,
      alupex:9.02,
      drain:10.25,
      water_point:26.65,
      double_water:45.1,
      washer:30.75,
      dishwasher:30.75,
      boiler_conn:41,
      boiler_small:82,
      boiler_large:114.8,
      sanitary:30.75,
      manifold:82,
      filter:28.7,
      reducer:41,
      panel24:451,
      panel36:574,
      panel48:738,
      panel72:1025,
      spd2:114.8,
      voltage:114.8,
      breaker:14.35,
      rcd:57.4,
      rcbo:53.3,
      basic:49.2,
      visual:36.9,
      report:0,
      travel50:20.5
    },

    PL: {
      point:79,
      next_point:61,
      light_point:61,
      cable:16,
      groove:38,
      switch:52,
      double_switch:70,
      socket:52,
      double_socket:70,
      usb_socket:79,
      rj45:70,
      tv:70,
      lamp:70,
      led:79,
      dimmer:79,
      ppr:31,
      alupex:38,
      drain:44,
      water_point:114,
      double_water:192,
      washer:131,
      dishwasher:131,
      boiler_conn:175,
      boiler_small:350,
      boiler_large:490,
      sanitary:131,
      manifold:350,
      filter:122,
      reducer:175,
      panel24:1925,
      panel36:2450,
      panel48:3150,
      panel72:4375,
      spd2:490,
      voltage:490,
      breaker:61,
      rcd:245,
      rcbo:227,
      basic:210,
      visual:158,
      report:0,
      travel50:88
    },

    RO: {
      point:92,
      next_point:72,
      light_point:72,
      cable:18,
      groove:45,
      switch:61,
      double_switch:82,
      socket:61,
      double_socket:82,
      usb_socket:92,
      rj45:82,
      tv:82,
      lamp:82,
      led:92,
      dimmer:92,
      ppr:37,
      alupex:45,
      drain:51,
      water_point:133,
      double_water:226,
      washer:154,
      dishwasher:154,
      boiler_conn:205,
      boiler_small:410,
      boiler_large:574,
      sanitary:154,
      manifold:410,
      filter:144,
      reducer:205,
      panel24:2255,
      panel36:2870,
      panel48:3690,
      panel72:5125,
      spd2:574,
      voltage:574,
      breaker:72,
      rcd:287,
      rcbo:266,
      basic:246,
      visual:184,
      report:0,
      travel50:102
    },

    HU: {
      point:7290,
      next_point:5670,
      light_point:5670,
      cable:1458,
      groove:3564,
      switch:4860,
      double_switch:6480,
      socket:4860,
      double_socket:6480,
      usb_socket:7290,
      rj45:6480,
      tv:6480,
      lamp:6480,
      led:7290,
      dimmer:7290,
      ppr:2916,
      alupex:3564,
      drain:4050,
      water_point:10530,
      double_water:17820,
      washer:12150,
      dishwasher:12150,
      boiler_conn:16200,
      boiler_small:32400,
      boiler_large:45360,
      sanitary:12150,
      manifold:32400,
      filter:11340,
      reducer:16200,
      panel24:178200,
      panel36:226800,
      panel48:291600,
      panel72:405000,
      spd2:45360,
      voltage:45360,
      breaker:5670,
      rcd:22680,
      rcbo:21060,
      basic:19440,
      visual:14580,
      report:0,
      travel50:8100
    },

    HR: {
      point:18.45,
      next_point:14.35,
      light_point:14.35,
      cable:3.69,
      groove:9.02,
      switch:12.3,
      double_switch:16.4,
      socket:12.3,
      double_socket:16.4,
      usb_socket:18.45,
      rj45:16.4,
      tv:16.4,
      lamp:16.4,
      led:18.45,
      dimmer:18.45,
      ppr:7.38,
      alupex:9.02,
      drain:10.25,
      water_point:26.65,
      double_water:45.1,
      washer:30.75,
      dishwasher:30.75,
      boiler_conn:41,
      boiler_small:82,
      boiler_large:114.8,
      sanitary:30.75,
      manifold:82,
      filter:28.7,
      reducer:41,
      panel24:451,
      panel36:574,
      panel48:738,
      panel72:1025,
      spd2:114.8,
      voltage:114.8,
      breaker:14.35,
      rcd:57.4,
      rcbo:53.3,
      basic:49.2,
      visual:36.9,
      report:0,
      travel50:20.5
    },

    GB: {
      point:15.75,
      next_point:12.25,
      light_point:12.25,
      cable:3.15,
      groove:7.7,
      switch:10.5,
      double_switch:14,
      socket:10.5,
      double_socket:14,
      usb_socket:15.75,
      rj45:14,
      tv:14,
      lamp:14,
      led:15.75,
      dimmer:15.75,
      ppr:6.3,
      alupex:7.7,
      drain:8.75,
      water_point:22.75,
      double_water:38.5,
      washer:26.25,
      dishwasher:26.25,
      boiler_conn:35,
      boiler_small:70,
      boiler_large:98,
      sanitary:26.25,
      manifold:70,
      filter:24.5,
      reducer:35,
      panel24:385,
      panel36:490,
      panel48:630,
      panel72:875,
      spd2:98,
      voltage:98,
      breaker:12.25,
      rcd:49,
      rcbo:45.5,
      basic:42,
      visual:31.5,
      report:0,
      travel50:17.5
    }
  };


  /* =========================================================
     COUNTRY NAMES
     ========================================================= */

  window.WOND_COUNTRY_NAMES = {
    uk: {
      CZ:"Чехія",
      UA:"Україна",
      SI:"Словенія",
      SK:"Словаччина",
      DE:"Німеччина",
      PL:"Польща",
      RO:"Румунія",
      HU:"Угорщина",
      HR:"Хорватія",
      GB:"Велика Британія"
    },

    cs: {
      CZ:"Česko",
      UA:"Ukrajina",
      SI:"Slovinsko",
      SK:"Slovensko",
      DE:"Německo",
      PL:"Polsko",
      RO:"Rumunsko",
      HU:"Maďarsko",
      HR:"Chorvatsko",
      GB:"Velká Británie"
    },

    sl: {
      CZ:"Češka",
      UA:"Ukrajina",
      SI:"Slovenija",
      SK:"Slovaška",
      DE:"Nemčija",
      PL:"Poljska",
      RO:"Romunija",
      HU:"Madžarska",
      HR:"Hrvaška",
      GB:"Velika Britanija"
    },

    sk: {
      CZ:"Česko",
      UA:"Ukrajina",
      SI:"Slovinsko",
      SK:"Slovensko",
      DE:"Nemecko",
      PL:"Poľsko",
      RO:"Rumunsko",
      HU:"Maďarsko",
      HR:"Chorvátsko",
      GB:"Veľká Británia"
    },

    de: {
      CZ:"Tschechien",
      UA:"Ukraine",
      SI:"Slowenien",
      SK:"Slowakei",
      DE:"Deutschland",
      PL:"Polen",
      RO:"Rumänien",
      HU:"Ungarn",
      HR:"Kroatien",
      GB:"Vereinigtes Königreich"
    },

    en: {
      CZ:"Czechia",
      UA:"Ukraine",
      SI:"Slovenia",
      SK:"Slovakia",
      DE:"Germany",
      PL:"Poland",
      RO:"Romania",
      HU:"Hungary",
      HR:"Croatia",
      GB:"United Kingdom"
    },

    hr: {
      CZ:"Češka",
      UA:"Ukrajina",
      SI:"Slovenija",
      SK:"Slovačka",
      DE:"Njemačka",
      PL:"Poljska",
      RO:"Rumunjska",
      HU:"Mađarska",
      HR:"Hrvatska",
      GB:"Ujedinjeno Kraljevstvo"
    },

    sr: {
      CZ:"Češka",
      UA:"Ukrajina",
      SI:"Slovenija",
      SK:"Slovačka",
      DE:"Njemačka",
      PL:"Poljska",
      RO:"Rumunija",
      HU:"Mađarska",
      HR:"Hrvatska",
      GB:"Velika Britanija"
    },

    it: {
      CZ:"Cechia",
      UA:"Ucraina",
      SI:"Slovenia",
      SK:"Slovacchia",
      DE:"Germania",
      PL:"Polonia",
      RO:"Romania",
      HU:"Ungheria",
      HR:"Croazia",
      GB:"Regno Unito"
    },

    hu: {
      CZ:"Csehország",
      UA:"Ukrajna",
      SI:"Szlovénia",
      SK:"Szlovákia",
      DE:"Németország",
      PL:"Lengyelország",
      RO:"Románia",
      HU:"Magyarország",
      HR:"Horvátország",
      GB:"Egyesült Királyság"
    },

    pl: {
      CZ:"Czechy",
      UA:"Ukraina",
      SI:"Słowenia",
      SK:"Słowacja",
      DE:"Niemcy",
      PL:"Polska",
      RO:"Rumunia",
      HU:"Węgry",
      HR:"Chorwacja",
      GB:"Wielka Brytania"
    },

    ro: {
      CZ:"Cehia",
      UA:"Ucraina",
      SI:"Slovenia",
      SK:"Slovacia",
      DE:"Germania",
      PL:"Polonia",
      RO:"România",
      HU:"Ungaria",
      HR:"Croația",
      GB:"Regatul Unit"
    }
  };


  /* =========================================================
     CATEGORY NAMES
     ========================================================= */

  const CATEGORY_NAMES = {
    uk: {
      electro:"Електрика",
      plumbing:"Сантехніка",
      panel:"Електрощити",
      inspection:"Перевірка та ревізія",
      travel:"Виїзд"
    },

    cs: {
      electro:"Elektro",
      plumbing:"Voda a topení",
      panel:"Rozvaděče",
      inspection:"Kontrola a revize",
      travel:"Výjezd"
    },

    sl: {
      electro:"Elektrika",
      plumbing:"Vodovod",
      panel:"Električne omarice",
      inspection:"Kontrola in revizija",
      travel:"Izvoz"
    },

    sk: {
      electro:"Elektro",
      plumbing:"Voda a kúrenie",
      panel:"Rozvádzače",
      inspection:"Kontrola a revízia",
      travel:"Výjazd"
    },

    de: {
      electro:"Elektro",
      plumbing:"Sanitär",
      panel:"Verteiler",
      inspection:"Prüfung und Revision",
      travel:"Anfahrt"
    },

    en: {
      electro:"Electrical",
      plumbing:"Plumbing",
      panel:"Distribution boards",
      inspection:"Inspection",
      travel:"Travel"
    },

    hr: {
      electro:"Elektrika",
      plumbing:"Vodoinstalacije",
      panel:"Razvodni ormari",
      inspection:"Kontrola i revizija",
      travel:"Izlazak"
    },

    sr: {
      electro:"Elektrika",
      plumbing:"Vodoinstalacije",
      panel:"Razvodni ormari",
      inspection:"Kontrola i revizija",
      travel:"Izlazak"
    },

    it: {
      electro:"Elettrico",
      plumbing:"Idraulica",
      panel:"Quadri elettrici",
      inspection:"Controllo e revisione",
      travel:"Uscita"
    },

    hu: {
      electro:"Villanyszerelés",
      plumbing:"Vízszerelés",
      panel:"Elosztószekrények",
      inspection:"Ellenőrzés",
      travel:"Kiszállás"
    },

    pl: {
      electro:"Elektryka",
      plumbing:"Hydraulika",
      panel:"Rozdzielnice",
      inspection:"Kontrola i przegląd",
      travel:"Dojazd"
    },

    ro: {
      electro:"Electrică",
      plumbing:"Instalații sanitare",
      panel:"Tablouri electrice",
      inspection:"Control și verificare",
      travel:"Deplasare"
    }
  };


  /* =========================================================
     FALLBACK TRANSLATIONS
     ========================================================= */

  const FALLBACK_NAMES = {
    uk: {
      point:"Електрична точка (розетка / вимикач)",
      next_point:"Додаткова електрична точка",
      light_point:"Світлова точка",
      cable:"Прокладання кабелю в трубі",
      groove:"Штроблення та закладення штроб",
      switch:"Одноклавішний вимикач",
      double_switch:"Двоклавішний вимикач",
      socket:"Одинарна розетка",
      double_socket:"Подвійна розетка",
      usb_socket:"USB розетка",
      rj45:"RJ45 розетка",
      tv:"TV розетка",
      lamp:"Монтаж світильника",
      led:"LED світильник",
      dimmer:"Димер",
      ppr:"PPR труба",
      alupex:"ALUPEX труба",
      drain:"Каналізаційна труба",
      water_point:"Водяна точка гаряча + холодна",
      double_water:"Подвійна водяна точка",
      washer:"Підключення пральної машини",
      dishwasher:"Підключення посудомийної машини",
      boiler_conn:"Підключення бойлера",
      boiler_small:"Монтаж бойлера до 100 л",
      boiler_large:"Монтаж бойлера 100–200 л",
      sanitary:"Монтаж сантехнічного обладнання",
      manifold:"Колектор",
      filter:"Фільтр для води",
      reducer:"Редуктор тиску",
      panel24:"Електрощит 24 модулі",
      panel36:"Електрощит 36 модулів",
      panel48:"Електрощит 48 модулів",
      panel72:"Електрощит 72 модулі",
      spd2:"Захист від перенапруги SPD тип 2",
      voltage:"Реле / захист напруги",
      breaker:"Автоматичний вимикач",
      rcd:"ПЗВ FI/RCD",
      rcbo:"RCBO комбінація",
      basic:"Базова перевірка електроустановки",
      visual:"Візуальна перевірка",
      report:"Звіт про перевірку",
      travel50:"Виїзд на об’єкт до 50 км"
    },

    en: {
      point:"Electrical point (socket / switch)",
      next_point:"Additional electrical point",
      light_point:"Light point",
      cable:"Cable installation in conduit",
      groove:"Chasing and making good",
      switch:"Single switch",
      double_switch:"Double switch",
      socket:"Single socket",
      double_socket:"Double socket",
      usb_socket:"USB socket",
      rj45:"RJ45 socket",
      tv:"TV socket",
      lamp:"Light fitting installation",
      led:"LED light fitting",
      dimmer:"Dimmer",
      ppr:"PPR pipe",
      alupex:"ALUPEX pipe",
      drain:"Drainage pipe",
      water_point:"Hot + cold water point",
      double_water:"Double water point",
      washer:"Washing machine connection",
      dishwasher:"Dishwasher connection",
      boiler_conn:"Boiler connection",
      boiler_small:"Boiler installation up to 100 l",
      boiler_large:"Boiler installation 100–200 l",
      sanitary:"Sanitary equipment installation",
      manifold:"Manifold",
      filter:"Water filter",
      reducer:"Pressure reducing valve",
      panel24:"24-module distribution board",
      panel36:"36-module distribution board",
      panel48:"48-module distribution board",
      panel72:"72-module distribution board",
      spd2:"Surge protection SPD type 2",
      voltage:"Voltage relay / protection",
      breaker:"Circuit breaker",
      rcd:"RCD",
      rcbo:"RCBO combination",
      basic:"Basic electrical installation inspection",
      visual:"Visual inspection",
      report:"Inspection report",
      travel50:"Site visit up to 50 km"
    }
  };


  /* =========================================================
     SETTINGS
     ========================================================= */

  const STORAGE_COUNTRY = "wond_price_country";
  const STORAGE_MODE = "wond_vat_mode";


  /* =========================================================
     HELPERS
     ========================================================= */

  function getLanguage() {
    const htmlLang =
      document.documentElement.getAttribute("lang") ||
      document.documentElement.lang ||
      "cs";

    return String(htmlLang)
      .toLowerCase()
      .split("-")[0];
  }


  function getCountry(code) {
    return (
      window.WOND_COUNTRIES.find(country => country.code === code) ||
      window.WOND_COUNTRIES[0]
    );
  }


  function getSelectedCountry() {
    const select = document.getElementById("price-country");

    const value =
      select?.value ||
      localStorage.getItem(STORAGE_COUNTRY) ||
      "CZ";

    return getCountry(value);
  }


  function getVatMode() {
    const select = document.getElementById("vat-mode");

    const value =
      select?.value ||
      localStorage.getItem(STORAGE_MODE) ||
      "net";

    return ["net", "gross", "both"].includes(value)
      ? value
      : "net";
  }


  function getCountryName(code) {
    const language = getLanguage();

    return (
      window.WOND_COUNTRY_NAMES?.[language]?.[code] ||
      window.WOND_COUNTRY_NAMES?.en?.[code] ||
      getCountry(code).name
    );
  }


  function getItemName(item) {
    const language = getLanguage();

    /*
     * Якщо у твоєму старому prices.js вже були
     * WOND_PRICE_TRANSLATIONS — вони використовуються.
     */
    if (
      window.WOND_PRICE_TRANSLATIONS &&
      window.WOND_PRICE_TRANSLATIONS[item.item_key] &&
      window.WOND_PRICE_TRANSLATIONS[item.item_key][language]
    ) {
      return window.WOND_PRICE_TRANSLATIONS[item.item_key][language];
    }

    if (
      FALLBACK_NAMES[language] &&
      FALLBACK_NAMES[language][item.item_key]
    ) {
      return FALLBACK_NAMES[language][item.item_key];
    }

    if (
      FALLBACK_NAMES.en &&
      FALLBACK_NAMES.en[item.item_key]
    ) {
      return FALLBACK_NAMES.en[item.item_key];
    }

    return item.name;
  }


  function getCategoryName(category) {
    const language = getLanguage();

    return (
      CATEGORY_NAMES[language]?.[category] ||
      CATEGORY_NAMES.en[category] ||
      category
    );
  }


  function formatMoney(value, currency) {
    try {
      const locale =
        document.documentElement.lang ||
        "cs-CZ";

      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits:
          currency === "HUF" ? 0 : 2
      }).format(value);

    } catch (error) {
      return `${Number(value).toFixed(2)} ${currency}`;
    }
  }


  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }


  /* =========================================================
     PRICE CALCULATION
     ========================================================= */

  function calculateGross(net, vat) {
    return net * (1 + vat);
  }


  function renderPrice(basePrice, country, mode, item) {

    /*
     * Revizní zpráva:
     * cena 0 znamená "dle rozsahu", takže
     * nemá smysl zobrazovat 0 Kč.
     */
    if (
      item.item_key === "report" &&
      Number(basePrice) === 0
    ) {
      return `
        <span class="price-value">
          ${escapeHtml(item.unit || "dle rozsahu")}
        </span>
      `;
    }


    const net = Number(basePrice) || 0;

    const gross = calculateGross(
      net,
      Number(country.vat) || 0
    );

    const netText = formatMoney(
      net,
      country.currency
    );

    const grossText = formatMoney(
      gross,
      country.currency
    );

    const vatPercent =
      Math.round(Number(country.vat) * 100);


    /* WITHOUT VAT */

    if (mode === "net") {
      return `
        <span class="price-value">
          ${netText}
        </span>
        <small class="price-vat">
          bez DPH
        </small>
      `;
    }


    /* WITH VAT */

    if (mode === "gross") {
      return `
        <span class="price-value">
          ${grossText}
        </span>
        <small class="price-vat">
          včetně DPH ${vatPercent}%
        </small>
      `;
    }


    /* BOTH */

    return `
      <div class="price-both">
        <div class="price-line">
          <span class="price-value">
            ${netText}
          </span>
          <small class="price-vat">
            bez DPH
          </small>
        </div>

        <div class="price-line">
          <span class="price-value price-gross">
            ${grossText}
          </span>
          <small class="price-vat">
            včetně DPH ${vatPercent}%
          </small>
        </div>
      </div>
    `;
  }


  /* =========================================================
     COUNTRY SELECT
     ========================================================= */

  function fillCountrySelect() {

    const select =
      document.getElementById("price-country");

    if (!select) return;


    const saved =
      localStorage.getItem(STORAGE_COUNTRY) ||
      "CZ";


    select.innerHTML = "";


    window.WOND_COUNTRIES.forEach(country => {

      const option =
        document.createElement("option");

      option.value =
        country.code;

      option.textContent =
        `${getCountryName(country.code)} (${country.currency})`;

      select.appendChild(option);
    });


    if (
      window.WOND_COUNTRIES.some(
        country => country.code === saved
      )
    ) {
      select.value = saved;
    } else {
      select.value = "CZ";
    }
  }


  function refreshCountryNames() {

    const select =
      document.getElementById("price-country");

    if (!select) return;


    Array.from(select.options).forEach(option => {

      const country =
        getCountry(option.value);

      option.textContent =
        `${getCountryName(country.code)} (${country.currency})`;
    });
  }


  /* =========================================================
     VAT MODE
     ========================================================= */

  function restoreVatMode() {

    const select =
      document.getElementById("vat-mode");

    if (!select) return;


    const saved =
      localStorage.getItem(STORAGE_MODE) ||
      "net";


    if (
      ["net", "gross", "both"].includes(saved)
    ) {
      select.value = saved;
    } else {
      select.value = "net";
    }
  }


  /* =========================================================
     SAVE SETTINGS
     ========================================================= */

  function savePriceSettings() {

    const country =
      document.getElementById("price-country");

    const mode =
      document.getElementById("vat-mode");


    if (country) {
      localStorage.setItem(
        STORAGE_COUNTRY,
        country.value
      );
    }


    if (mode) {
      localStorage.setItem(
        STORAGE_MODE,
        mode.value
      );
    }
  }


  /* =========================================================
     RENDER PRICE GRID
     ========================================================= */

  function renderPrices() {

    const grid =
      document.getElementById("price-grid");

    if (!grid) return;


    const country =
      getSelectedCountry();

    const mode =
      getVatMode();

    const prices =
      window.WOND_LOCAL_PRICES?.[country.code] || {};


    grid.innerHTML = "";


    let currentCategory = null;


    window.WOND_PRICE_ITEMS.forEach(item => {

      /*
       * Category heading
       */
      if (item.category !== currentCategory) {

        currentCategory =
          item.category;


        const heading =
          document.createElement("h3");

        heading.className =
          "price-category-title";

        heading.textContent =
          getCategoryName(item.category);

        grid.appendChild(heading);
      }


      const basePrice =
        Number(
          prices[item.item_key] ?? 0
        );


      const card =
        document.createElement("div");

      card.className =
        "price-card";

      card.dataset.itemKey =
        item.item_key;

      card.dataset.category =
        item.category;


      card.innerHTML = `
        <div class="price-card-info">

          <div class="price-name">
            ${escapeHtml(
              getItemName(item)
            )}
          </div>

          ${
            item.unit
              ? `
                <div class="price-unit">
                  ${escapeHtml(item.unit)}
                </div>
              `
              : ""
          }

        </div>

        <div class="price-card-value">
          ${renderPrice(
            basePrice,
            country,
            mode,
            item
          )}
        </div>
      `;


      grid.appendChild(card);
    });


    /*
     * Useful dataset values for CSS / other JS
     */
    grid.dataset.country =
      country.code;

    grid.dataset.currency =
      country.currency;

    grid.dataset.vat =
      String(country.vat);

    grid.dataset.vatMode =
      mode;
  }


  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.WOND_RENDER_PRICES =
    renderPrices;

  window.WOND_PRICE_REFRESH =
    renderPrices;

  window.WOND_GET_SELECTED_COUNTRY =
    getSelectedCountry;

  window.WOND_GET_VAT_MODE =
    getVatMode;


  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function initPriceSystem() {

    const grid =
      document.getElementById("price-grid");

    /*
     * Якщо секції цін немає на сторінці —
     * нічого не робимо.
     */
    if (!grid) return;


    fillCountrySelect();

    restoreVatMode();

    refreshCountryNames();

    renderPrices();


    /* Country */

    const countrySelect =
      document.getElementById("price-country");

    if (countrySelect) {

      countrySelect.addEventListener(
        "change",
        () => {

          savePriceSettings();

          renderPrices();
        }
      );
    }


    /* VAT mode */

    const vatMode =
      document.getElementById("vat-mode");

    if (vatMode) {

      vatMode.addEventListener(
        "change",
        () => {

          savePriceSettings();

          renderPrices();
        }
      );
    }


    /*
     * Якщо app.js змінює мову,
     * оновлюємо назви країн та ціни.
     */
    window.addEventListener(
      "languageChanged",
      () => {

        refreshCountryNames();

        renderPrices();
      }
    );


    /*
     * На випадок, якщо інша частина сайту
     * змінює html[lang].
     */
    const languageObserver =
      new MutationObserver(() => {

        refreshCountryNames();

        renderPrices();
      });


    languageObserver.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ["lang"]
      }
    );
  }


  /* =========================================================
     START
     ========================================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initPriceSystem,
      { once: true }
    );

  } else {

    initPriceSystem();
  }

})();
