# WOND build notes

The same responsive web app is used in browser, PWA, Windows desktop and Android wrappers.

- Browser: open `index.html` through a web server (Supabase/Netlify/etc.).
- PWA: `manifest.webmanifest` + `sw.js` are included.
- Windows: `desktop-exe/` is a Tauri 2 project.
- Android: `mobile-apk/` is a Capacitor project.

VAT rates in the public country configuration are standard rates for the selected countries. For actual invoicing, use the tax rate applicable to the specific service and transaction.
