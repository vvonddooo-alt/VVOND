WOND — підготовка до справжнього онлайн-збереження фото

ВАЖЛИВО:
Ця версія підготовлена для підключення Supabase, але без твоїх ключів вона ще не може зберігати фото онлайн.

1. Відкрий https://supabase.com і створи проєкт.
2. У Storage створи bucket з назвою: wond-gallery
3. Зроби bucket Public, якщо хочеш, щоб фото бачили всі відвідувачі сайту.
4. У Project Settings → API знайди:
   - Project URL
   - anon/public key
5. Відкрий файл supabase-config.js і встав ці два значення замість:
   PASTE_YOUR_SUPABASE_PROJECT_URL_HERE
   PASTE_YOUR_SUPABASE_ANON_KEY_HERE
6. Після цього завантаж папку/ZIP на Netlify.

НЕ ВСТАВЛЯЙ service_role key у сайт.

Примітка: для повністю захищеної адмінпанелі потрібні також Supabase Auth та правила Storage (RLS). Не використовуй цей варіант як захищену систему, доки не налаштуєш авторизацію та політики доступу.
