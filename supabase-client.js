import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Вставте сюди свої реальні ключі із панелі Supabase
const SUPABASE_URL = 'ВАШ_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'ВАШ_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

