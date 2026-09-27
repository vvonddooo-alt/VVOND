# Supabase connection checklist

1. Create/open your Supabase project.
2. SQL Editor → paste and run `supabase-schema.sql`.
3. Project Settings → API → copy the **Project URL** and **anon/public key**.
4. Put them in `supabase-config.js`.
5. In Authentication → Providers, enable Email.
6. Deploy Edge Functions `create-admin` and `delete-admin` if you want Owner → Administrators management.

Never put the `service_role` key into `supabase-config.js` or GitHub.
