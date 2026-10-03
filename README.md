# WOND — multilingual site with country-specific pricing

Static frontend + Supabase backend. No build step is required.

## What was changed

- 12 languages: `uk cs sl sk de en hr sr it hu pl ro`.
- Country selector controls the price list.
- **Prices are stored separately per country**; the browser no longer converts a Czech price into another currency at runtime.
- 10 country price books are seeded: CZ/CZK, UA/UAH, SI/EUR, SK/EUR, DE/EUR, PL/PLN, RO/RON, HU/HUF, HR/EUR, GB/GBP.
- Every service has a translation for all 12 languages.
- Admin has a country-specific price editor and a service-translation editor.
- VAT rates are stored per country only for the optional “with VAT” display.
- Gallery, texts, administrators and authentication remain backed by Supabase.

## Supabase

1. Create a Supabase project.
2. Run **all of `supabase-schema.sql`** in SQL Editor. It creates/updates the tables, RLS policies and initial country/service/price data.
3. Put the Supabase Project URL and anon/public key into `supabase-config.js`. Do not put the service-role key in the frontend.
4. Deploy the two Edge Functions:

```bash
supabase functions deploy create-admin
supabase functions deploy delete-admin
```

The functions need the Supabase service-role secret configured in the Supabase project; it is never committed to this repository.

## First Owner

Open `#admin`, enter an e-mail and password, then use **Create Owner**. If e-mail confirmation is enabled, confirm the account and sign in. The database function allows only the first account to claim the Owner role.

## Country-specific prices

The initial values are seeded from the project's previous price ratios so the site has a complete starting price list. They are now independent records. Change them in **Admin → Prices → country**. Changing Czechia does not change Ukraine, Germany, Poland, etc.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`. Push to `main`, then in GitHub open **Settings → Pages** and select **GitHub Actions** as the source. The workflow publishes the repository root with `index.html` as the site entry point.

## Desktop (Tauri)

The Tauri project lives in `desktop-exe/src-tauri/`. From `desktop-exe/`, run `cargo tauri build` on a Windows machine with the Tauri prerequisites installed. The generated installers are placed under `desktop-exe/src-tauri/target/release/bundle/`.

## Domain

The `vwond.eu` domain can point to the published GitHub Pages/Netlify site through DNS at your domain registrar. The domain itself does not replace Supabase; it is the public address of the frontend.


## WOND Czech public presentation
- Public Czech ceník is displayed in CZK including DPH.
- Standard labor rate: 500 Kč/hour incl. DPH.
- Public service prices are competitive orientation prices and include standard installation/consumable material where stated.
- Warranty wording: standard 24 months for performed work, subject to the contract and exclusions.
- Czech electro qualification references: Act No. 250/2021 Coll. and Government Regulation No. 194/2022 Coll.; exact qualifications/revision scope should be filled from the company's actual documents before publication.
- Reference site used only for information architecture and presentation ideas: vulpex.cz. WOND branding, contact details and identity remain WOND.

## Nezávazná poptávka
Web obsahuje veřejný formulář pro poptávky s možností přiložit až 5 fotografií (max. 8 MB/foto). Poptávky se ukládají do Supabase do tabulky `customer_requests` a po přihlášení administrátora jsou dostupné v záložce **Poptávky**. Fotografie jsou v privátním bucketu `wond-requests` a administrátorovi se zobrazují přes dočasné odkazy.

## Kontakty a otevírací doba
- +420 776 108 617
- +386 40 746 946
- Vond.sro@icloud.com
- Po–Pá 07:00–18:00
- So 08:00–17:00
- oběd 11:00–12:00
