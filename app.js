(() => {
  const cfg=window.WOND_SUPABASE||{};
  const configured=cfg.url && cfg.anonKey && !cfg.url.includes('PASTE_') && !cfg.anonKey.includes('PASTE_');
  const sb=window.supabase && configured ? window.supabase.createClient(cfg.url,cfg.anonKey) : null;
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const langs=window.WOND_LANGS;
  let lang=getLang(), session=null, profile=null;
  let countries=window.WOND_COUNTRIES||[];
  let services=window.WOND_PRICE_ITEMS||[];
  let translations=window.WOND_PRICE_TRANSLATIONS||{};
  let localPrices=window.WOND_LOCAL_PRICES||{};
  const ui={
    uk:{country:'Країна',price:'Ціна',service:'Робота',currency:'Валюта',without:'Без ПДВ',with:'З ПДВ',both:'Обидва',prices_admin:'Ціни по країнах',price_country:'Країна для цін',translations_admin:'Переклади робіт',translation_lang:'Мова перекладів',save_prices:'Зберегти ціни',save_translations:'Зберегти переклади',category:'Категорія',unit:'Одиниця'},
    cs:{country:'Země',price:'Cena',service:'Služba',currency:'Měna',without:'Bez DPH',with:'Včetně DPH',both:'Obojí',prices_admin:'Ceny podle zemí',price_country:'Země pro ceny',translations_admin:'Překlady služeb',translation_lang:'Jazyk překladů',save_prices:'Uložit ceny',save_translations:'Uložit překlady',category:'Kategorie',unit:'Jednotka'},
    sl:{country:'Država',price:'Cena',service:'Storitev',currency:'Valuta',without:'Brez DDV',with:'Z DDV',both:'Oboje',prices_admin:'Cene po državah',price_country:'Država za cene',translations_admin:'Prevodi storitev',translation_lang:'Jezik prevodov',save_prices:'Shrani cene',save_translations:'Shrani prevode',category:'Kategorija',unit:'Enota'},
    sk:{country:'Krajina',price:'Cena',service:'Služba',currency:'Mena',without:'Bez DPH',with:'S DPH',both:'Oboje',prices_admin:'Ceny podľa krajín',price_country:'Krajina pre ceny',translations_admin:'Preklady služieb',translation_lang:'Jazyk prekladov',save_prices:'Uložiť ceny',save_translations:'Uložiť preklady',category:'Kategória',unit:'Jednotka'},
    de:{country:'Land',price:'Preis',service:'Leistung',currency:'Währung',without:'Ohne MwSt.',with:'Inkl. MwSt.',both:'Beides',prices_admin:'Preise nach Ländern',price_country:'Land für Preise',translations_admin:'Übersetzungen der Leistungen',translation_lang:'Sprache der Übersetzungen',save_prices:'Preise speichern',save_translations:'Übersetzungen speichern',category:'Kategorie',unit:'Einheit'},
    en:{country:'Country',price:'Price',service:'Service',currency:'Currency',without:'Without VAT',with:'With VAT',both:'Both',prices_admin:'Prices by country',price_country:'Country for prices',translations_admin:'Service translations',translation_lang:'Translation language',save_prices:'Save prices',save_translations:'Save translations',category:'Category',unit:'Unit'},
    hr:{country:'Država',price:'Cijena',service:'Usluga',currency:'Valuta',without:'Bez PDV-a',with:'S PDV-om',both:'Oboje',prices_admin:'Cijene po državama',price_country:'Država za cijene',translations_admin:'Prijevodi usluga',translation_lang:'Jezik prijevoda',save_prices:'Spremi cijene',save_translations:'Spremi prijevode',category:'Kategorija',unit:'Jedinica'},
    sr:{country:'Država',price:'Cena',service:'Usluga',currency:'Valuta',without:'Bez PDV-a',with:'Sa PDV-om',both:'Oboje',prices_admin:'Cene po državama',price_country:'Država za cene',translations_admin:'Prevodi usluga',translation_lang:'Jezik prevoda',save_prices:'Sačuvaj cene',save_translations:'Sačuvaj prevode',category:'Kategorija',unit:'Jedinica'},
    it:{country:'Paese',price:'Prezzo',service:'Servizio',currency:'Valuta',without:'Senza IVA',with:'Con IVA',both:'Entrambi',prices_admin:'Prezzi per paese',price_country:'Paese per i prezzi',translations_admin:'Traduzioni dei servizi',translation_lang:'Lingua delle traduzioni',save_prices:'Salva prezzi',save_translations:'Salva traduzioni',category:'Categoria',unit:'Unità'},
    hu:{country:'Ország',price:'Ár',service:'Szolgáltatás',currency:'Pénznem',without:'ÁFA nélkül',with:'ÁFÁ-val',both:'Mindkettő',prices_admin:'Országonkénti árak',price_country:'Árlista országa',translations_admin:'Szolgáltatásfordítások',translation_lang:'Fordítás nyelve',save_prices:'Árak mentése',save_translations:'Fordítások mentése',category:'Kategória',unit:'Egység'},
    pl:{country:'Kraj',price:'Cena',service:'Usługa',currency:'Waluta',without:'Bez VAT',with:'Z VAT',both:'Obie',prices_admin:'Ceny według krajów',price_country:'Kraj dla cen',translations_admin:'Tłumaczenia usług',translation_lang:'Język tłumaczeń',save_prices:'Zapisz ceny',save_translations:'Zapisz tłumaczenia',category:'Kategoria',unit:'Jednostka'},
    ro:{country:'Țară',price:'Preț',service:'Serviciu',currency:'Monedă',without:'Fără TVA',with:'Cu TVA',both:'Ambele',prices_admin:'Prețuri pe țări',price_country:'Țara pentru prețuri',translations_admin:'Traduceri servicii',translation_lang:'Limba traducerilor',save_prices:'Salvează prețurile',save_translations:'Salvează traducerile',category:'Categorie',unit:'Unitate'}
  };
  const t=(key,fallback='') => (window.WOND_TRANSLATIONS[lang]||{})[key] || (window.WOND_TRANSLATIONS.cs||{})[key] || fallback || key;
  const u=k=>ui[lang]?.[k]||ui.en[k]||k;
  function getLang(){const q=new URLSearchParams(location.search).get('lang');if(q&&langs.includes(q))return q;const saved=localStorage.getItem('wond-lang');if(saved&&langs.includes(saved))return saved;const n=(navigator.language||'cs').slice(0,2);return langs.includes(n)?n:'cs';}
  function countryName(code){return window.WOND_COUNTRY_NAMES?.[lang]?.[code]||countries.find(c=>c.code===code)?.name||code;}
  function setLang(l){lang=langs.includes(l)?l:'cs';localStorage.setItem('wond-lang',lang);const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState({},'',url);document.documentElement.lang=lang;document.title=`WOND — ${t('nav_services')}`;$$('[data-i18n]').forEach(el=>el.innerHTML=t(el.dataset.i18n));$('#language').value=lang;renderCountrySelect();renderPrices();}
  const langSelect=$('#language'); langs.forEach(l=>{const o=document.createElement('option');o.value=l;o.textContent=window.WOND_TRANSLATIONS[l].name;langSelect.append(o);}); langSelect.addEventListener('change',e=>setLang(e.target.value));
  function renderCountrySelect(){const sel=$('#price-country');if(!sel)return;const current=sel.value||localStorage.getItem('wond-country')||'CZ';sel.innerHTML='';countries.filter(c=>c.active!==false).forEach(c=>{const o=document.createElement('option');o.value=c.code;o.textContent=`${countryName(c.code)} — ${c.currency}`;sel.append(o);});sel.value=countries.some(c=>c.code===current)?current:'CZ';localStorage.setItem('wond-country',sel.value);const vat=$('#vat-mode');if(vat){vat.options[0].textContent=u('without');vat.options[1].textContent=u('with');vat.options[2].textContent=u('both');}}
  function serviceName(key,raw){return translations[key]?.[lang]||translations[key]?.en||raw;}
  function fmt(n,c){return new Intl.NumberFormat(lang,{minimumFractionDigits:c==='HUF'?0:0,maximumFractionDigits:c==='HUF'?0:2}).format(n)+' '+c;}
  function renderPrices(){const grid=$('#price-grid');if(!grid)return;const mode=$('#vat-mode')?.value||'net';const code=$('#price-country')?.value||'CZ';const country=countries.find(c=>c.code===code)||countries[0];if(!country)return;const groups={};services.filter(s=>s.active!==false).forEach(s=>(groups[s.category]??=[]).push(s));grid.innerHTML='';for(const [cat,rows] of Object.entries(groups)){const card=document.createElement('div');card.className='price-card';card.innerHTML=`<h3>${esc(t(cat==='electro'?'electro':cat,u(cat)))}</h3><table><thead><tr><th>${esc(u('service'))}</th><th>${esc(u('price'))}</th></tr></thead><tbody></tbody></table>`;const tbody=card.querySelector('tbody');rows.forEach(s=>{const tr=document.createElement('tr'),td1=document.createElement('td'),td2=document.createElement('td');td1.textContent=serviceName(s.item_key,s.default_name);const raw=Number(localPrices[code]?.[s.item_key]??0);if(s.item_key==='report'&&raw===0){td2.textContent=t('by_scope','dle rozsahu');}else{const net=raw;const gross=country.vat_rate>0?net*(1+Number(country.vat_rate)):net;td2.textContent=mode==='gross'?fmt(gross,country.currency)+(s.unit||''):mode==='both'?`${fmt(net,country.currency)}${s.unit||''} / ${fmt(gross,country.currency)}${s.unit||''}`:fmt(net,country.currency)+(s.unit||'');}tr.append(td1,td2);tbody.append(tr);});grid.append(card);}}
  $('#price-country').addEventListener('change',e=>{localStorage.setItem('wond-country',e.target.value);renderPrices();});$('#vat-mode').addEventListener('change',renderPrices);
  const keys=['hero_title','hero_text','services_title','services_lead','electro','electro_text','water','water_text','assembly','assembly_text','building','building_text','company_title','company_lead','management','director_name','director_role','director_text','why_title','why_1','why_2','why_3','why_4','why_5','process_title','process_1','process_2','process_3','process_4','prices_title','prices_lead','notice','area','gallery_title','gallery_lead','contact_title'];
  async function init(){setLang(lang);if(!sb){$('#admin-config-warning').hidden=false;$('#admin-config-warning').textContent=t('not_configured');return;}const {data:{session:s}}=await sb.auth.getSession();session=s;if(session)await loadProfile();sb.auth.onAuthStateChange((_e,sess)=>{session=sess;setTimeout(loadProfile,0);});await loadPublic();}
  async function loadPublic(){const {data:c}=await sb.from('site_content').select('lang,content_key,content_value');(c||[]).forEach(x=>{if(WOND_TRANSLATIONS[x.lang])WOND_TRANSLATIONS[x.lang][x.content_key]=x.content_value;});const {data:co}=await sb.from('countries').select('*').order('sort_order');if(co?.length)countries=co;const {data:ct}=await sb.from('country_translations').select('*');(ct||[]).forEach(x=>{window.WOND_COUNTRY_NAMES[x.lang]??={};window.WOND_COUNTRY_NAMES[x.lang][x.country_code]=x.name;});const {data:si}=await sb.from('service_items').select('*').order('sort_order');if(si?.length)services=si;const {data:st}=await sb.from('service_translations').select('*');if(st?.length){translations={};st.forEach(x=>(translations[x.item_key]??={})[x.lang]=x.name);}const {data:cp}=await sb.from('country_prices').select('country_code,item_key,price,active');if(cp?.length){localPrices={};cp.forEach(x=>(localPrices[x.country_code]??={})[x.item_key]=Number(x.price));}setLang(lang);const {data:g}=await sb.from('gallery_items').select('*').eq('active',true).order('sort_order');if(g?.length)renderGallery(g);}
  function renderGallery(items){const box=$('#gallery-grid');box.innerHTML='';items.forEach(i=>{const f=document.createElement('figure'),img=document.createElement('img'),cap=document.createElement('figcaption');img.loading='lazy';img.src=sb.storage.from(cfg.bucket).getPublicUrl(i.storage_path).data.publicUrl;img.alt=i.alt_text||i.title||'WOND';cap.textContent=i.title||'WOND';f.append(img,cap);box.append(f);});}
  async function loadProfile(){if(!session){profile=null;$('#auth-card').hidden=false;$('#admin-panel').hidden=true;return;}const {data}=await sb.from('profiles').select('*').eq('id',session.user.id).maybeSingle();profile=data;$('#auth-card').hidden=true;$('#admin-panel').hidden=false;$('#admin-user-email').textContent=session.user.email;$('#admin-role').textContent=data?.role||'admin';$('#users-tab').hidden=data?.role!=='owner';await loadAdmin();}
  async function loadAdmin(){await renderAdminGallery();if(profile?.role==='owner')await renderUsers();buildContentEditor();await loadPriceEditor();await loadTranslationEditor();}
  function msg(text,err=false){$('#admin-message').textContent=text;$('#admin-message').style.color=err?'#b42318':'';}
  $('#login-btn').onclick=async()=>{if(!sb)return msg(t('not_configured'),true);const {error}=await sb.auth.signInWithPassword({email:$('#auth-email').value.trim(),password:$('#auth-password').value});$('#auth-message').textContent=error?error.message:t('saved');};
  $('#signup-btn').onclick=async()=>{if(!sb)return msg(t('not_configured'),true);const email=$('#auth-email').value.trim(),password=$('#auth-password').value;if(!email||password.length<8)return $('#auth-message').textContent='E-mail and password must be valid (minimum 8 characters).';const {data,error}=await sb.auth.signUp({email,password});if(error)return $('#auth-message').textContent=error.message;const {data:claim}=await sb.rpc('claim_owner');$('#auth-message').textContent=claim?'Owner created.':'Account created. Confirm e-mail if required, then sign in.';};
  $('#logout-btn').onclick=async()=>{await sb.auth.signOut();location.reload();};
  $$('.admin-tabs button').forEach(b=>b.onclick=()=>{$$('.admin-tabs button').forEach(x=>x.classList.remove('active'));$$('.admin-tab').forEach(x=>x.hidden=true);b.classList.add('active');$('#'+b.dataset.tab).hidden=false;});
  async function renderAdminGallery(){const {data}=await sb.from('gallery_items').select('*').order('sort_order');const box=$('#admin-gallery-items');box.innerHTML='';(data||[]).forEach(i=>{const row=document.createElement('div');row.className='admin-item';row.innerHTML=`<img src="${sb.storage.from(cfg.bucket).getPublicUrl(i.storage_path).data.publicUrl}" alt=""><div class="admin-item-body"><strong>${esc(i.title||'WOND')}</strong><button class="btn ghost dark" data-id="${i.id}">${esc(t('delete'))}</button></div>`;row.querySelector('button').onclick=async()=>{await sb.storage.from(cfg.bucket).remove([i.storage_path]);await sb.from('gallery_items').delete().eq('id',i.id);await renderAdminGallery();await loadPublic();};box.append(row);});}
  $('#upload-btn').onclick=async()=>{const files=[...$('#photo-files').files];if(!files.length)return msg(t('select_files'),true);for(const file of files){const safe=file.name.toLowerCase().replace(/[^a-z0-9._-]+/gi,'-');const path=`${crypto.randomUUID()}-${safe}`;const up=await sb.storage.from(cfg.bucket).upload(path,file,{upsert:false,contentType:file.type});if(up.error)return msg(up.error.message,true);const ins=await sb.from('gallery_items').insert({storage_path:path,title:$('#photo-title').value.trim()||file.name,alt_text:$('#photo-alt').value.trim()||file.name,sort_order:Date.now()});if(ins.error)return msg(ins.error.message,true);}$('#photo-files').value='';msg(t('saved'));await renderAdminGallery();await loadPublic();};
  function buildContentEditor(){const sel=$('#content-lang');if(!sel.options.length)langs.forEach(l=>{const o=document.createElement('option');o.value=l;o.textContent=WOND_TRANSLATIONS[l].name;sel.append(o);});sel.value=lang;sel.onchange=()=>fillContent(sel.value);fillContent(sel.value);}
  async function fillContent(l){const {data}=await sb.from('site_content').select('content_key,content_value').eq('lang',l);const map=Object.fromEntries((data||[]).map(x=>[x.content_key,x.content_value]));const box=$('#content-editor');box.innerHTML='';keys.forEach(k=>{const lab=document.createElement('label');lab.textContent=k;const ta=document.createElement('textarea');ta.dataset.key=k;ta.value=map[k] ?? (WOND_TRANSLATIONS[l]?.[k]||'');lab.append(ta);box.append(lab);});}
  $('#save-content').onclick=async()=>{const l=$('#content-lang').value;const rows=$$('#content-editor textarea').map(x=>({lang:l,content_key:x.dataset.key,content_value:x.value,updated_at:new Date().toISOString()}));const {error}=await sb.from('site_content').upsert(rows,{onConflict:'lang,content_key'});msg(error?error.message:t('saved'),!!error);if(!error){rows.forEach(r=>{if(WOND_TRANSLATIONS[r.lang])WOND_TRANSLATIONS[r.lang][r.content_key]=r.content_value;});if(l===lang)setLang(lang);}};
  function buildCountryAdminSelect(){const sel=$('#admin-price-country');if(!sel)return;const cur=sel.value||'CZ';sel.innerHTML='';countries.forEach(c=>{const o=document.createElement('option');o.value=c.code;o.textContent=`${countryName(c.code)} — ${c.currency}`;sel.append(o);});sel.value=countries.some(c=>c.code===cur)?cur:'CZ';sel.onchange=()=>fillPriceEditor(sel.value);}
  async function loadPriceEditor(){buildCountryAdminSelect();await fillPriceEditor($('#admin-price-country').value);}
  async function fillPriceEditor(countryCode){const {data}=await sb.from('country_prices').select('country_code,item_key,price,active').eq('country_code',countryCode);const map=Object.fromEntries((data||[]).map(x=>[x.item_key,x]));const box=$('#price-editor');box.innerHTML='';const byCat={};services.forEach(s=>(byCat[s.category]??=[]).push(s));Object.entries(byCat).forEach(([cat,rows])=>{const h=document.createElement('h3');h.textContent=t(cat==='electro'?'electro':cat,cat);box.append(h);rows.forEach(s=>{const wrap=document.createElement('label');wrap.className='price-edit-row';wrap.innerHTML=`<span>${esc(serviceName(s.item_key,s.default_name))}${s.unit?` (${esc(s.unit)})`:''}</span><input type="number" step="0.01" min="0" data-key="${esc(s.item_key)}" value="${map[s.item_key]?.price??localPrices[countryCode]?.[s.item_key]??0}">`;box.append(wrap);});});}
  $('#save-prices').onclick=async()=>{const countryCode=$('#admin-price-country').value;const rows=$$('#price-editor input').map(i=>({country_code:countryCode,item_key:i.dataset.key,price:Number(i.value),active:true,updated_at:new Date().toISOString()}));const {error}=await sb.from('country_prices').upsert(rows,{onConflict:'country_code,item_key'});msg(error?error.message:t('saved'),!!error);if(!error){localPrices[countryCode]??={};rows.forEach(r=>localPrices[countryCode][r.item_key]=r.price);renderPrices();}};
  async function loadTranslationEditor(){const langSel=$('#translation-lang');if(!langSel.options.length)langs.forEach(l=>{const o=document.createElement('option');o.value=l;o.textContent=WOND_TRANSLATIONS[l].name;langSel.append(o);});langSel.value=lang;langSel.onchange=()=>fillTranslationEditor(langSel.value);await fillTranslationEditor(langSel.value);}
  async function fillTranslationEditor(l){const {data}=await sb.from('service_translations').select('item_key,name').eq('lang',l);const map=Object.fromEntries((data||[]).map(x=>[x.item_key,x.name]));const box=$('#translation-editor');box.innerHTML='';services.forEach(s=>{const lab=document.createElement('label');lab.className='price-edit-row';lab.innerHTML=`<span>${esc(s.item_key)} — ${esc(s.category)}</span><input type="text" data-key="${esc(s.item_key)}" value="${esc(map[s.item_key]??translations[s.item_key]?.[l]??s.default_name)}">`;box.append(lab);});}
  $('#save-translations').onclick=async()=>{const l=$('#translation-lang').value;const rows=$$('#translation-editor input').map(i=>({item_key:i.dataset.key,lang:l,name:i.value.trim()})).filter(x=>x.name);const {error}=await sb.from('service_translations').upsert(rows,{onConflict:'item_key,lang'});msg(error?error.message:t('saved'),!!error);if(!error){translations={...translations};rows.forEach(r=>(translations[r.item_key]??={})[r.lang]=r.name);renderPrices();}};
  async function renderUsers(){const {data}=await sb.from('profiles').select('id,email,role,created_at').order('created_at');const box=$('#users-list');box.innerHTML='';(data||[]).forEach(u=>{const row=document.createElement('div');row.className='admin-item';row.innerHTML=`<div class="admin-item-body"><strong>${esc(u.email)}</strong><span class="muted">${esc(u.role)}</span></div>`;if(u.role!=='owner'){const b=document.createElement('button');b.className='btn ghost dark';b.textContent=t('delete');b.onclick=async()=>{const r=await sb.functions.invoke('delete-admin',{body:{user_id:u.id}});msg(r.error?r.error.message:t('saved'),!!r.error);await renderUsers();};row.querySelector('.admin-item-body').append(b);}box.append(row);});}
  $('#add-admin').onclick=async()=>{const email=$('#new-admin-email').value.trim(),password=$('#new-admin-password').value;if(!email||password.length<8)return msg('Enter e-mail and a password of at least 8 characters.',true);const r=await sb.functions.invoke('create-admin',{body:{email,password}});msg(r.error?r.error.message:t('saved'),!!r.error);if(!r.error){$('#new-admin-email').value='';$('#new-admin-password').value='';await renderUsers();}};
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  init();
})();
(() => {
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
