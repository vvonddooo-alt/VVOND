# WOND — multilingual production site + real admin

Цей репозиторій зроблений як **звичайний статичний сайт без build step**. Його можна завантажити прямо в GitHub repository і опублікувати через GitHub Pages або Netlify.

## 1. Публічна частина

- 12 мов: `uk cs sl sk de en hr sr it hu pl ro`
- перемикач мови;
- мова зберігається в URL як `?lang=xx` і в браузері;
- адаптивний дизайн;
- галерея;
- ціни;
- контактні дані;
- без паролів або адмінських даних у frontend-коді.

## 2. Справжня адмінка

Для постійного збереження використовується Supabase:

- Supabase Auth — логін/пароль;
- PostgreSQL — тексти, ціни, ролі, галерея;
- Storage — фотографії;
- RLS — доступ до даних;
- Edge Functions — створення/видалення адміністраторів без service-role key у браузері.

### Налаштування Supabase

1. Створи проєкт у Supabase.
2. Відкрий SQL Editor.
3. Запусти весь файл `supabase-schema.sql`.
4. У `supabase-config.js` встав:
   - Project URL;
   - anon/public key.
5. У Supabase Authentication налаштуй Email/Password.
6. Задеплой Edge Functions:

```bash
supabase functions deploy create-admin
supabase functions deploy delete-admin
```

Service role key **не вставляється** у `supabase-config.js`.

## 3. Перший Owner

На сайті відкрий `Admin`, введи свій e-mail і пароль та натисни **Create Owner**.

Якщо в Supabase увімкнене підтвердження e-mail, спочатку підтвердь e-mail, потім увійди. Під час входу сайт намагається безпечно виконати `claim_owner()`; Owner може бути лише один.

Після цього Owner може:

- завантажувати/видаляти фотографії;
- редагувати тексти кожної мови;
- редагувати ціни;
- створювати адміністраторів;
- видаляти адміністраторів.

## 4. GitHub Pages

У repository поклади **вміст цієї папки в root**, щоб `index.html` лежав у корені.

Потім GitHub → Settings → Pages → Deploy from branch → `main` / root.

`index.html` не потребує npm, Node або build-команди.

## 5. Важливо

Без Supabase сайт все одно відкривається як звичайний публічний сайт. Адмінка покаже повідомлення, що backend не налаштований. Після вставлення URL + anon key вона підключається до реального backend.
