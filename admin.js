/* Supabase client with session persistence */
const sb = window.supabase.createClient(WOND_SUPABASE.url, WOND_SUPABASE.anonKey, {
  auth: {
    persistSession: true,
    storage: localStorage
  }
});

const $ = s => document.querySelector(s);
const bucket = WOND_SUPABASE.bucket;

/* Constants */
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

/* Helper functions */
function status(id, msg) {
  $(id).textContent = msg;
}

function pathSafe(n) {
  return n.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function sanitizeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* Validation functions */
function validatePhoto(file) {
  if (!file) return 'Vyber fotografii.';
  if (!file.type.startsWith('image/')) return 'Povolené jsou jen obrázky (JPG, PNG, WebP).';
  if (file.size > MAX_PHOTO_SIZE) return `Soubor je příliš velký (max ${Math.round(MAX_PHOTO_SIZE / 1024 / 1024)} MB).`;
  return null;
}

function validatePdf(file) {
  if (!file) return 'Vyber PDF soubor.';
  if (file.type !== 'application/pdf') return 'Povolený je jen PDF formát.';
  if (file.size > MAX_PDF_SIZE) return `PDF je příliš velké (max ${Math.round(MAX_PDF_SIZE / 1024 / 1024)} MB).`;
  return null;
}

function validateText(value, label, minLen = 1) {
  if (!value || value.length < minLen) return `Vyplň ${label}.`;
  if (value.length > 500) return `${label} je příliš dlouhé (max 500 znaků).`;
  return null;
}

/* Database operations */
async function refreshDocs() {
  try {
    status('#docStatus', 'Načítám...');
    const { data, error } = await sb.from('country_documents').select('*').order('country_code');
    if (error) {
      status('#docStatus', 'Chyba: ' + error.message);
      return;
    }
    const html = (data || []).map(d => `
      <div style="padding:0.5rem 0;border-bottom:1px solid var(--line)">
        <strong>${sanitizeHtml(d.country_code)}</strong> — ${sanitizeHtml(d.title)}
        <a href="${d.public_url}" target="_blank" style="color:var(--accent);text-decoration:none">Stáhnout</a>
        <button onclick="deleteDoc('${d.id}')" style="background:none;border:none;color:red;cursor:pointer">Smazat</button>
      </div>
    `).join('');
    $('#docList').innerHTML = html || '<p style="color:var(--muted)">Žádné dokumenty.</p>';
    status('#docStatus', '');
  } catch (e) {
    status('#docStatus', 'Chyba: ' + e.message);
  }
}

async function refreshIds() {
  try {
    status('#idStatus', 'Načítám...');
    const { data, error } = await sb.from('company_identifiers').select('*').order('country_code');
    if (error) {
      status('#idStatus', 'Chyba: ' + error.message);
      return;
    }
    const html = (data || []).map(id => `
      <div style="padding:0.5rem 0;border-bottom:1px solid var(--line)">
        <strong>${sanitizeHtml(id.country_code)}</strong> — ${sanitizeHtml(id.label)}: <code>${sanitizeHtml(id.value)}</code>
        <button onclick="deleteId('${id.id}')" style="background:none;border:none;color:red;cursor:pointer">Smazat</button>
      </div>
    `).join('');
    $('#idList').innerHTML = html || '<p style="color:var(--muted)">Žádné údaje.</p>';
    status('#idStatus', '');
  } catch (e) {
    status('#idStatus', 'Chyba: ' + e.message);
  }
}

async function deleteDoc(docId) {
  if (!confirm('Opravdu smazat tento dokument?')) return;
  try {
    status('#docStatus', 'Mažu...');
    const { error } = await sb.from('country_documents').delete().eq('id', docId);
    if (error) throw error;
    await refreshDocs();
  } catch (e) {
    status('#docStatus', 'Chyba při mazání: ' + e.message);
  }
}

async function deleteId(idId) {
  if (!confirm('Opravdu smazat tento údaj?')) return;
  try {
    status('#idStatus', 'Mažu...');
    const { error } = await sb.from('company_identifiers').delete().eq('id', idId);
    if (error) throw error;
    await refreshIds();
  } catch (e) {
    status('#idStatus', 'Chyba při mazání: ' + e.message);
  }
}

/* Auth and UI */
async function load() {
  try {
    const { data: { session }, error } = await sb.auth.getSession();
    if (error) {
      console.error('Auth error:', error);
      status('#loginStatus', 'Chyba ověření: ' + error.message);
    }
    if (!session) {
      $('#login').hidden = false;
      $('#app').hidden = true;
      return;
    }
    $('#login').hidden = true;
    $('#app').hidden = false;
    $('#userEmail').textContent = session.user.email;
    await Promise.all([refreshDocs(), refreshIds()]);
  } catch (e) {
    status('#loginStatus', 'Chyba: ' + e.message);
  }
}

/* Event handlers */
$('#loginBtn').onclick = async () => {
  const email = $('#email').value.trim();
  const password = $('#password').value;
  if (!email || !password) {
    status('#loginStatus', 'Vyplň email a heslo.');
    return;
  }
  status('#loginStatus', 'Přihlašuji...');
  try {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    status('#loginStatus', '');
    $('#password').value = '';
    await load();
  } catch (e) {
    status('#loginStatus', 'Přihlášení selhalo: ' + e.message);
  }
};

$('#logoutBtn').onclick = async () => {
  try {
    status('#logoutStatus', 'Odhlašuji...');
    const { error } = await sb.auth.signOut();
    if (error) throw error;
    $('#login').hidden = false;
    $('#app').hidden = true;
    $('#email').value = '';
    $('#password').value = '';
    status('#logoutStatus', '');
  } catch (e) {
    status('#logoutStatus', 'Odhlášení selhalo: ' + e.message);
  }
};

$('#uploadPhoto').onclick = async () => {
  const f = $('#photo').files[0];
  const validation = validatePhoto(f);
  if (validation) return status('#photoStatus', validation);
  
  status('#photoStatus', 'Nahrávám...');
  try {
    const path = 'main-photo/' + Date.now() + '_' + pathSafe(f.name);
    const { error: uploadError } = await sb.storage.from(bucket).upload(path, f, { upsert: true });
    if (uploadError) throw uploadError;
    
    const { data } = sb.storage.from(bucket).getPublicUrl(path);
    const { error: dbError } = await sb.from('site_media').upsert({
      slot: 'main_photo',
      public_url: data.publicUrl,
      storage_path: path
    });
    if (dbError) throw dbError;
    
    status('#photoStatus', 'Fotografii nahrána ✓');
    $('#photo').value = '';
  } catch (e) {
    status('#photoStatus', 'Chyba: ' + e.message);
  }
};

$('#uploadDoc').onclick = async () => {
  const f = $('#docFile').files[0];
  const code = $('#docCountry').value.trim();
  const title = $('#docTitle').value.trim() || 'Ceník služeb';
  
  const fileValidation = validatePdf(f);
  if (fileValidation) return status('#docStatus', fileValidation);
  if (!code) return status('#docStatus', 'Vyber zemi.');
  
  const titleValidation = validateText(title, 'Název dokumentu');
  if (titleValidation) return status('#docStatus', titleValidation);
  
  status('#docStatus', 'Nahrávám...');
  try {
    const path = code + '/' + Date.now() + '_' + pathSafe(f.name);
    const { error: uploadError } = await sb.storage.from(bucket).upload(path, f);
    if (uploadError) throw uploadError;
    
    const { data } = sb.storage.from(bucket).getPublicUrl(path);
    const { error: dbError } = await sb.from('country_documents').insert({
      country_code: code,
      title: title,
      public_url: data.publicUrl,
      storage_path: path,
      published: true
    });
    if (dbError) throw dbError;
    
    status('#docStatus', 'Dokument nahrán ✓');
    $('#docFile').value = '';
    $('#docTitle').value = '';
    await refreshDocs();
  } catch (e) {
    status('#docStatus', 'Chyba: ' + e.message);
  }
};

$('#saveId').onclick = async () => {
  const country = $('#idCountry').value.trim();
  const label = $('#idLabel').value.trim();
  const value = $('#idValue').value.trim();
  
  if (!country) {
    status('#idStatus', 'Vyber zemi.');
    return;
  }
  
  const labelValidation = validateText(label, 'Název');
  if (labelValidation) return status('#idStatus', labelValidation);
  
  const valueValidation = validateText(value, 'Hodnota');
  if (valueValidation) return status('#idStatus', valueValidation);
  
  status('#idStatus', 'Ukládám...');
  try {
    const { error } = await sb.from('company_identifiers').insert({
      country_code: country,
      label: label,
      value: value
    });
    if (error) throw error;
    
    status('#idStatus', 'Údaj uložen ✓');
    $('#idLabel').value = '';
    $('#idValue').value = '';
    await refreshIds();
  } catch (e) {
    status('#idStatus', 'Chyba: ' + e.message);
  }
};

/* Initialize on page load */
window.addEventListener('DOMContentLoaded', load);
