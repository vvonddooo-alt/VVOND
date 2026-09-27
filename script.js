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