(function(){
const supported=['uk','cs','sl','sk','de','en','hr','sr','it','hu','pl','ro'];
const labels={};
function detectLanguage(){const saved=localStorage.getItem('wond-language');if(saved&&supported.includes(saved))return saved;const langs=(navigator.languages||[navigator.language||'cs']).map(x=>x.toLowerCase().split('-')[0]);return langs.find(x=>supported.includes(x))||'cs';}
function applyLanguage(lang){if(!supported.includes(lang))lang='cs';document.documentElement.lang=lang;document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.getAttribute('data-i18n');if(window.TRANSLATIONS[lang]&&window.TRANSLATIONS[lang][key])el.innerHTML=window.TRANSLATIONS[lang][key]; else if(window.TRANSLATIONS.cs&&window.TRANSLATIONS.cs[key])el.innerHTML=window.TRANSLATIONS.cs[key];});document.getElementById('language').value=lang;localStorage.setItem('wond-language',lang);}
const select=document.getElementById('language');
supported.forEach(code=>{const option=document.createElement('option');option.value=code;option.textContent=window.TRANSLATIONS[code].name;select.appendChild(option);});
select.addEventListener('change',()=>applyLanguage(select.value));
applyLanguage(detectLanguage());
})();

/* WOND local administrator. Static-site limitation: accounts and photos are stored only in this browser. */
(function(){
  const OWNER={username:'vaclav.sytar@icloud.com',password:'Vasil.sytar5',role:'Hlavný administrátor'};
  const USERS_KEY='wond-admin-users-v2';
  const STORAGE_KEY='wond-admin-gallery-v1';
  const loginBtn=document.getElementById('admin-login-btn');
  const logoutBtn=document.getElementById('admin-logout-btn');
  const usernameInput=document.getElementById('admin-username');
  const passwordInput=document.getElementById('admin-password');
  const loginBox=document.getElementById('admin-login-box');
  const panel=document.getElementById('admin-panel');
  const message=document.getElementById('admin-message');
  const filesInput=document.getElementById('photo-files');
  const titleInput=document.getElementById('photo-title');
  const addBtn=document.getElementById('photo-add-btn');
  const itemsBox=document.getElementById('admin-items');
  const gallery=document.querySelector('#gallery .gallery');
  const userManagement=document.getElementById('user-management');
  const newUserName=document.getElementById('new-user-name');
  const newUserPassword=document.getElementById('new-user-password');
  const newUserRole=document.getElementById('new-user-role');
  const addUserBtn=document.getElementById('add-user-btn');
  const usersList=document.getElementById('users-list');
  if(!loginBtn||!gallery)return;
  let items=[]; let users=[]; let currentUser=null;
  try{items=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch(e){items=[]}
  try{users=JSON.parse(localStorage.getItem(USERS_KEY)||'[]')}catch(e){users=[]}
  function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(items))}
  function saveUsers(){localStorage.setItem(USERS_KEY,JSON.stringify(users))}
  function renderGallery(){
    document.querySelectorAll('[data-admin-photo="true"]').forEach(el=>el.remove());
    items.forEach(item=>{const figure=document.createElement('figure');figure.dataset.adminPhoto='true';const img=document.createElement('img');img.src=item.data;img.alt=item.title||'WOND — naše práce';const cap=document.createElement('figcaption');cap.textContent=item.title||'Naše práce';figure.append(img,cap);gallery.appendChild(figure);});
  }
  function renderAdminItems(){
    itemsBox.innerHTML='';
    if(!items.length){itemsBox.innerHTML='<p class="muted">Zatím nebyly přidány žádné vlastní fotografie.</p>';return;}
    items.forEach(item=>{const card=document.createElement('div');card.className='admin-item';const img=document.createElement('img');img.src=item.data;img.alt=item.title||'Fotografie';const body=document.createElement('div');body.className='admin-item-body';const name=document.createElement('strong');name.textContent=item.title||'Naše práce';const btn=document.createElement('button');btn.type='button';btn.textContent='Smazat';btn.className='btn ghost dark';btn.addEventListener('click',()=>{items=items.filter(x=>x.id!==item.id);save();renderAdminItems();renderGallery();});body.append(name,btn);card.append(img,body);itemsBox.appendChild(card);});
  }
  function renderUsers(){
    usersList.innerHTML='';
    if(!users.length){usersList.innerHTML='<p class="muted">Zatiaľ neboli pridaní ďalší používatelia.</p>';return;}
    users.forEach(user=>{const card=document.createElement('div');card.className='admin-item';const body=document.createElement('div');body.className='admin-item-body';const name=document.createElement('strong');name.textContent=user.username+' — '+user.role;const btn=document.createElement('button');btn.type='button';btn.textContent='Odstrániť';btn.className='btn ghost dark';btn.addEventListener('click',()=>{users=users.filter(u=>u.id!==user.id);saveUsers();renderUsers();});body.append(name,btn);card.appendChild(body);usersList.appendChild(card);});
  }
  function findUser(name,pw){if(name===OWNER.username&&pw===OWNER.password)return OWNER;return users.find(u=>u.username===name&&u.password===pw)||null;}
  function login(){
    const user=findUser(usernameInput.value.trim(),passwordInput.value);
    if(!user){message.textContent='Nesprávne prihlasovacie údaje.';return;}
    currentUser=user;loginBox.hidden=true;panel.hidden=false;message.textContent='Prihlásený: '+user.username+' ('+user.role+')';renderAdminItems();
    const isOwner=user.username===OWNER.username;
    userManagement.hidden=!isOwner;
    if(isOwner)renderUsers();
  }
  loginBtn.addEventListener('click',login);
  passwordInput.addEventListener('keydown',e=>{if(e.key==='Enter')login()});
  logoutBtn.addEventListener('click',()=>{currentUser=null;panel.hidden=true;loginBox.hidden=false;usernameInput.value='';passwordInput.value='';userManagement.hidden=true;});
  addBtn.addEventListener('click',()=>{
    const files=Array.from(filesInput.files||[]);if(!files.length){message.textContent='Vyber alespoň jednu fotografii.';return;}
    let remaining=files.length;
    files.forEach(file=>{if(!file.type.startsWith('image/')){remaining--;return;}const reader=new FileReader();reader.onload=()=>{items.push({id:Date.now()+Math.random(),title:titleInput.value.trim()||file.name,data:reader.result});remaining--;if(remaining===0){save();renderAdminItems();renderGallery();filesInput.value='';titleInput.value='';message.textContent='Fotografie byly přidány.';}};reader.readAsDataURL(file);});
  });
  addUserBtn.addEventListener('click',()=>{
    const username=newUserName.value.trim(),password=newUserPassword.value;
    if(!username||!password){message.textContent='Vyplň prihlasovacie meno aj heslo.';return;}
    if(username===OWNER.username||users.some(u=>u.username===username)){message.textContent='Tento používateľ už existuje.';return;}
    users.push({id:Date.now()+Math.random(),username,password,role:newUserRole.value});saveUsers();renderUsers();newUserName.value='';newUserPassword.value='';message.textContent='Používateľ bol pridaný.';
  });
  renderGallery();
})();
