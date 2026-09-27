// ==========================================
// 1. НАЛАШТУВАННЯ SUPABASE
// ==========================================
const SUPABASE_URL = 'ТУТ_ТВОЯ_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'ТУТ_ТВОЙ_ANON_KEY';

// Ініціалізація клієнта Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // Запускаємо завантаження даних при відкритті сайту/додатка
    loadPrices();
    loadMessages();
    setupChatRealtime();

    // Налаштування відправки повідомлень у чаті
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', handleSendMessage);
    }
});

// ==========================================
// 2. ЗАВАНТАЖЕННЯ ЦІН (без зависань)
// ==========================================
async function loadPrices() {
    const priceContainer = document.getElementById('price-list');
    if (!priceContainer) return;

    try {
        priceContainer.innerHTML = '<p>Завантаження цін...</p>';

        // Запит до таблиці з цінами (зміни 'products' на назву своєї таблиці, якщо вона інша)
        const { data: products, error } = await supabaseClient
            .from('products')
            .select('*');

        if (error) throw error;

        if (!products || products.length === 0) {
            priceContainer.innerHTML = '<p>Ціни наразі відсутні.</p>';
            return;
        }

        // Рендеримо ціни на сторінці
        priceContainer.innerHTML = products.map(item => `
            <div class="price-item">
                <h3>${escapeHtml(item.name || 'Товар')}</h3>
                <p class="price">${item.price} грн</p>
            </div>
        `).join('');

    } catch (err) {
        console.error('Помилка завантаження цін:', err.message);
        priceContainer.innerHTML = '<p style="color: red;">Не вдалося завантажити ціни.</p>';
    }
}

// ==========================================
// 3. РОБОТА З ЧАТОМ
// ==========================================

// Завантаження історії повідомлень
async function loadMessages() {
    const chatBox = document.getElementById('chat-messages');
    if (!chatBox) return;

    try {
        // Запит до таблиці повідомлень (зміни 'messages' на свою таблицю чату)
        const { data: messages, error } = await supabaseClient
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(50);

        if (error) throw error;

        chatBox.innerHTML = '';
        if (messages && messages.length > 0) {
            messages.forEach(msg => appendMessageToDOM(msg));
            scrollToBottom(chatBox);
        }
    } catch (err) {
        console.error('Помилка завантаження чату:', err.message);
    }
}

// Відправка нового повідомлення
async function handleSendMessage(e) {
    e.preventDefault();
    const inputField = document.getElementById('chat-input');
    const sendButton = document.getElementById('chat-send-btn');
    
    if (!inputField) return;
    const text = inputField.value.trim();
    if (!text) return;

    // Тимчасово блокуємо кнопку, щоб уникнути подвійного надсилання
    if (sendButton) sendButton.disabled = true;

    try {
        const { error } = await supabaseClient
            .from('messages')
            .insert([{ text: text, created_at: new Date() }]);

        if (error) throw error;

        inputField.value = ''; // Очищаємо поле введення
    } catch (err) {
        console.error('Помилка надсилання:', err.message);
        alert('Не вдалося надіслати повідомлення.');
    } finally {
        if (sendButton) sendButton.disabled = false;
        inputField.focus();
    }
}

// Миттєве оновлення чату в реальному часі (Realtime)
function setupChatRealtime() {
    supabaseClient
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
            appendMessageToDOM(payload.new);
            const chatBox = document.getElementById('chat-messages');
            if (chatBox) scrollToBottom(chatBox);
        })
        .subscribe();
}

// Додавання повідомлення у вікно чату
function appendMessageToDOM(msg) {
    const chatBox = document.getElementById('chat-messages');
    if (!chatBox) return;

    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.textContent = msg.text;
    chatBox.appendChild(messageElement);
}

// Автопрокрутка чату вниз
function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

// Захист від XSS-ін'єкцій
function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

