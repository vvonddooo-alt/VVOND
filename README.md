# WOND Professional

## Co je hotové
- profesionální responzivní web;
- samostatná zabezpečená administrace přes Supabase Auth;
- heslo není uložené v JavaScriptu;
- jedna hlavní fotografie firmy;
- PDF ceníky rozdělené podle zemí;
- IČO / DIČ / DPH / matična številka / davčna številka / ЄДРПОУ podle země;
- ceník s přepínačem **bez DPH / včetně DPH / obojí**;
- město + země;
- Supabase Storage pro online soubory;
- Netlify-ready statický web.

## Jednorázové nastavení Supabase
1. V Supabase otevři SQL Editor.
2. Vlož celý `supabase/schema.sql` a spusť ho.
3. V Authentication → Users vytvoř administrátorský účet s e-mailem a heslem, které chceš používat.
4. Deployni obsah této složky na Netlify.

## Důležité
- V `supabase-config.js` je pouze veřejný publishable/anon klíč. Nikdy sem nedávej `service_role`/secret key.
- DPH je nastavitelné v `app.js` pro jednotlivé země. Před ostrým zveřejněním ověř sazby a firemní registrační údaje.
