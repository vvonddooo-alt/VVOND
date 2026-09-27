// ==========================================
// НАЛАШТУВАННЯ SUPABASE
// ==========================================
const SUPABASE_URL = 'ТУТ_ТВОЯ_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'ТУТ_ТВОЙ_ANON_KEY';

// Захист від забутих ключів
if (SUPABASE_URL.includes('ТУТ_ТВОЯ') || SUPABASE_ANON_KEY.includes('ТУТ_ТВОЙ')) {
    console.error('ПОМИЛКА: Вкажи свої реальні SUPABASE_URL та SUPABASE_ANON_KEY у файлі app.js!');
}

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Генерація випадкового імені для користувача в чаті (якщо його ще немає)
let currentUsername = localStorage.getItem('chat_username');
if (!currentUsername) {
    currentUsername = 'Користувач_' + Math.floor(Math.random() * 900 + 100);
    localStorage.setItem('chat_username', currentUsername);
}

document.addEventListener('DOMContentLoaded', () => {
    loadPrices();
    loadMessages();
    setupChatRealtime();

    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', handleSendMessage);
    }
});

// ==========================================
// 1. ЗАВАНТАЖЕННЯ ЦІН (без зависань)
// ==========================================
async function loadPrices() {
    const priceContainer = document.getElementById('price-list');
    if (!priceContainer) return;

    try {
        priceContainer.innerHTML = '<p>Завантаження цін...</p>';

        const { data: products, error } = await supabaseClient
            .from('products')
            .select('*');

        if (error) throw error;

        if (!products || products.length === 0) {
            priceContainer.innerHTML = '<p>Ціни наразі відсутні.</p>';
            return;
        }

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
// 2. РОБОТА З ЧАТОМ
// ==========================================
async function loadMessages() {
    const chatBox = document.getElementById('chat-messages');
    if (!chatBox) return;

    try {
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

async function handleSendMessage(e) {
    e.preventDefault();
    const inputField = document.getElementById('chat-input');
    const sendButton = document.getElementById('chat-send-btn');
    
    if (!inputField) return;
    const text = inputField.value.trim();
    if (!text) return;

    if (sendButton) sendButton.disabled = true;

    try {
        const { error } = await supabaseClient
            .from('messages')
            .insert([{ 
                text: text, 
                username: currentUsername, 
                created_at: new Date() 
            }]);

        if (error) throw error;

        inputField.value = '';
    } catch (err) {
        console.error('Помилка надсилання:', err.message);
        alert('Не вдалося надіслати повідомлення.');
    } finally {
        if (sendButton) sendButton.disabled = false;
        inputField.focus();
    }
}

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

function appendMessageToDOM(msg) {
    const chatBox = document.getElementById('chat-messages');
    if (!chatBox) return;

    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    
    const author = escapeHtml(msg.username || 'Гість');
    const content = escapeHtml(msg.text || '');
    messageElement.innerHTML = `<strong>${author}:</strong> ${content}`;
    
    chatBox.appendChild(messageElement);
}

function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
