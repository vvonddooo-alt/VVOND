const C = {
  CZ: { name: 'Česko', currency: 'Kč', vat: 0.21, cities: ['Brno', 'Praha', 'Ostrava', 'Plzeň', 'Olomouc', 'Kuřim', 'Rosice', 'Ivančice', 'Židlochovice', 'Blansko', 'Vyškov'] },
  SI: { name: 'Slovenija', currency: '€', vat: 0.22, cities: ['Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Koper', 'Novo mesto', 'Ptuj', 'Murska Sobota', 'Nova Gorica'] },
  SK: { name: 'Slovensko', currency: '€', vat: 0.23, cities: ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Nitra', 'Trnava', 'Trenčín'] },
  DE: { name: 'Deutschland', currency: '€', vat: 0.19, cities: ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Dresden'] },
  PL: { name: 'Polska', currency: 'zł', vat: 0.23, cities: ['Warszawa', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk', 'Katowice'] },
  HU: { name: 'Magyarország', currency: 'Ft', vat: 0.27, cities: ['Budapest', 'Debrecen', 'Szeged', 'Pécs', 'Győr'] },
  HR: { name: 'Hrvatska', currency: '€', vat: 0.25, cities: ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar'] },
  RO: { name: 'România', currency: 'lei', vat: 0.21, cities: ['București', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Brașov'] },
  UA: { name: 'Україна', currency: '₴', vat: 0.2, cities: ['Київ', 'Львів', 'Ужгород', 'Одеса', 'Івано-Франківськ', 'Чернівці'] },
  GB: { name: 'United Kingdom', currency: '£', vat: 0.2, cities: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Bristol'] }
};

const BASE = [
  ['Elektroinstalace', [['Elektro bod (zásuvka / vypínač)', 450, 'Št'], ['Další elektro bod', 350, 'Št'], ['Světelný bod', 350, 'Št'], ['Uložení kabelu v trubce', 90, 'M'], ['Sekání a zapravení do omítky', 140, 'M'], ['Příslušenství a kryty', 120, 'Kus']]],
  ['Voda a kanalizace', [['PPR potrubí', 180, 'M'], ['ALUPEX potrubí', 220, 'M'], ['Kanalizační potrubí', 250, 'M'], ['Vodní bod teplá + studená', 650, 'Št'], ['Dvojitý vodní bod', 1100, 'Št'], ['Přípojka vody', 750, 'Kus']]],
  ['Rozvaděče a ochrany', [['Rozvaděč 24 modulů', 11000, 'Št'], ['Rozvaděč 36 modulů', 14000, 'Št'], ['Rozvaděč 48 modulů', 18000, 'Št'], ['Rozvaděč 72 modulů', 25000, 'Št'], ['Přepěťová ochrana', 1800, 'Kus']]],
  ['Kontroly a revize', [['Základní kontrola elektroinstalace', 1200, 'Št'], ['Vizuální kontrola', 900, 'Št'], ['Revizní zpráva', 0, '']]],
  ['Výjezd', [['Výjezd na místo do 50 km', 500, 'Št']]]
];

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
let data = {};

function fmt(n, code) {
  const locale = {
    CZ: 'cs-CZ',
    SI: 'sl-SI',
    SK: 'sk-SK',
    UA: 'uk-UA',
    PL: 'pl-PL',
    HU: 'hu-HU',
    RO: 'ro-RO',
    HR: 'hr-HR',
    DE: 'de-DE',
    GB: 'en-GB'
  }[code] || 'de-DE';

  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
}

function renderPrices() {
  const countrySelect = $('#priceCountry');
  const citySelect = $('#priceCity');
  const vatMode = $('#vatMode');
  const priceMeta = $('#priceMeta');
  const priceTable = $('#priceTable');

  if (!countrySelect || !citySelect || !vatMode || !priceMeta || !priceTable) return;

  const code = countrySelect.value || 'CZ';
  const city = citySelect.value || (C[code]?.cities?.[0] || 'Brno');
  const mode = vatMode.value || 'net';
  const countryInfo = C[code] || C.CZ;

  priceMeta.textContent = `${city} · ${countryInfo.name} · DPH ${Math.round(countryInfo.vat * 100)}%`;

  priceTable.innerHTML = BASE.map(([group, items]) => {
    const itemHtml = items.map(([label, value, unit]) => {
      const net = Number(value || 0);
      const gross = net * (1 + (countryInfo.vat || 0.21));
      const displayValue = mode === 'gross' ? gross : net;

      const priceText = mode === 'both'
        ? `${fmt(net, code)} ${countryInfo.currency} / ${fmt(gross, code)} ${countryInfo.currency}`
        : `${fmt(displayValue, code)} ${countryInfo.currency}`;

      return `
        <div class="price-row">
          <span>${label}</span>
          <strong>${priceText}</strong>
        </div>
      `;
    }).join('');

    return `
      <div class="price-group">
        <h4>${group}</h4>
        ${itemHtml}
      </div>
    `;
  }).join('');
}

function fillCountrySelect() {
  const select = $('#priceCountry');
  if (!select) return;

  select.innerHTML = Object.entries(C).map(([code, info]) => {
    return `<option value="${code}">${info.name}</option>`;
  }).join('');

  select.value = 'CZ';
}

function fillCitySelect() {
  const countrySelect = $('#priceCountry');
  const citySelect = $('#priceCity');
  if (!countrySelect || !citySelect) return;

  const code = countrySelect.value || 'CZ';
  const cities = C[code]?.cities || C.CZ.cities;

  citySelect.innerHTML = cities.map((city) => `<option value="${city}">${city}</option>`).join('');
  citySelect.value = cities[0];
}

function init() {
  fillCountrySelect();
  fillCitySelect();

  const countrySelect = $('#priceCountry');
  const citySelect = $('#priceCity');
  const vatMode = $('#vatMode');

  if (countrySelect) {
    countrySelect.addEventListener('change', () => {
      fillCitySelect();
      renderPrices();
    });
  }

  if (citySelect) {
    citySelect.addEventListener('change', renderPrices);
  }

  if (vatMode) {
    vatMode.addEventListener('change', renderPrices);
  }

  renderPrices();
}

async function loadSupabase() {
  if (!window.supabase || !window.WOND_SUPABASE) return;

  try {
    const sb = window.supabase.createClient(
      window.WOND_SUPABASE.url,
      window.WOND_SUPABASE.anonKey
    );

    const mainPhoto = document.getElementById('mainPhoto');
    if (mainPhoto) {
      const { data, error } = await sb
        .from('site_media')
        .select('*')
        .eq('slot', 'main_photo')
        .limit(1)
        .maybeSingle();

      if (!error && data && data.public_url) {
        mainPhoto.src = data.public_url;
      }
    }

    const gallery = document.getElementById('galleryList');
    if (gallery) {
      const { data: docs, error: docsError } = await sb.from('country_documents').select('*').order('country_code');
      if (!docsError && Array.isArray(docs) && docs.length) {
        gallery.innerHTML = docs.map((doc) => `
          <a class="doc-card" href="${doc.public_url}" target="_blank" rel="noreferrer">
            <span>${doc.country_code}</span>
            <strong>${doc.title || 'Ceník služeb'}</strong>
          </a>
        `).join('');
      }
    }
  } catch (error) {
    console.warn('Supabase load failed:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof init === 'function') init();
  if (typeof loadSupabase === 'function') loadSupabase();

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
