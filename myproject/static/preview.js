document.addEventListener('DOMContentLoaded', () => {
    const chatBackgroundInput = document.getElementById('chat-background');
    const userMessageBgInput = document.getElementById('user-message-bg');
    const botMessageBgInput = document.getElementById('bot-message-bg');
    const generateScriptButton = document.getElementById('generate-script-button');
    const generatedScriptTextarea = document.getElementById('generated-script');
    const saveScriptButton = document.getElementById('save-script-button');
    const sendButton = document.getElementById('send_button');
    const userMessageInput = document.getElementById('user_message');
    const chatbox = document.getElementById('chatbox');
    const copyCodeButton = document.getElementById('copy-code-button');

    // Функция для применения новых стилей ко всем сообщениям
    function applyStyles() {
        chatbox.style.backgroundColor = chatBackgroundInput.value;

        document.querySelectorAll('.user-message').forEach(function (message) {
            message.style.backgroundColor = userMessageBgInput.value;
        });

        document.querySelectorAll('.bot-message').forEach(function (message) {
            message.style.backgroundColor = botMessageBgInput.value;
        });
    }

    // Генерация начальных сообщений
    function generateInitialMessages() {
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('message', 'user-message');
        userMessageElement.textContent = "Привет, как дела?";
        chatbox.appendChild(userMessageElement);

        const botMessageElement = document.createElement('div');
        botMessageElement.classList.add('message', 'bot-message');
        botMessageElement.textContent = "Привет! Всё отлично, чем могу помочь?";
        chatbox.appendChild(botMessageElement);

        applyStyles();
    }

    // Обновление превью
    function updatePreview() {
        chatbox.style.backgroundColor = chatBackgroundInput.value;
        document.querySelectorAll('.user-message').forEach(el => {
            el.style.backgroundColor = userMessageBgInput.value;
        });
        document.querySelectorAll('.bot-message').forEach(el => {
            el.style.backgroundColor = botMessageBgInput.value;
        });
    }

    // Копирование HTML кода чата в буфер обмена
    copyCodeButton.addEventListener('click', () => {
        // Получаем внешний вид чата с учётом стилей и сообщений
        const chatHtml = `
            <div id="chat-container" style="width: 300px; height: 400px; overflow-y: auto;">
                <div id="chat-header" style="background-color: #f1f1f1; padding: 10px; text-align: center; font-weight: bold;">
                    Чат с ботом
                </div>
                <div id="chatbox" style="border: 1px solid #ddd; padding: 10px; background-color: ${chatBackgroundInput.value}; height: 300px; overflow-y: auto;">
                    ${[...chatbox.children].map(message => {
                        const messageBgColor = message.classList.contains('user-message') ? userMessageBgInput.value : botMessageBgInput.value;
                        const messageAlign = message.classList.contains('user-message') ? 'right' : 'left';
                        const triangle = message.classList.contains('user-message') ? 'right' : 'left';

                        return `
                            <div class="message ${message.classList[1]}" style="background-color: ${messageBgColor}; padding: 10px; margin: 10px; border-radius: 10px; text-align: ${messageAlign}; position: relative;">
                                ${message.textContent}
                                <div class="triangle" style="position: absolute; ${triangle}: -10px; top: 50%; border-left: 10px solid transparent; border-right: 10px solid transparent; border-${triangle}: 10px solid ${messageBgColor};"></div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div id="chat-input" style="padding: 10px; background-color: #f9f9f9; border-top: 1px solid #ddd;">
                    <input type="text" id="user_message" placeholder="Введите сообщение..." style="width: calc(100% - 80px); padding: 5px;">
                    <button id="send_button" style="padding: 5px 10px;">Отправить</button>
                </div>
            </div>
        `;

        // Копируем в буфер обмена
        navigator.clipboard.writeText(chatHtml).then(() => {
            alert('Код скопирован в буфер обмена!');
        }).catch(err => {
            console.error('Ошибка при копировании:', err);
        });
    });

    // Слушатели событий для изменения стилей
    chatBackgroundInput.addEventListener('input', updatePreview);
    userMessageBgInput.addEventListener('input', updatePreview);
    botMessageBgInput.addEventListener('input', updatePreview);

    // Генерация скрипта для вставки
    generateScriptButton.addEventListener('click', () => {
        const customization = {
            background_color: chatBackgroundInput.value,
            user_message_color: userMessageBgInput.value,
            bot_message_color: botMessageBgInput.value
        };

        const script = `
            <div id="chat-preview" style="border: 1px solid #ddd; padding: 10px; width: 300px; height: 400px; overflow-y: auto; background-color: ${customization.background_color};">
                <div class="bot-message" style="background-color: ${customization.bot_message_color}; padding: 10px; margin: 10px; border-radius: 10px;">Пример сообщения от бота</div>
                <div class="user-message" style="background-color: ${customization.user_message_color}; padding: 10px; margin: 10px; border-radius: 10px; text-align: right;">Пример сообщения от пользователя</div>
            </div>
        `;

        generatedScriptTextarea.value = script;
    });

    // Сохранение сгенерированного скрипта в файл
    saveScriptButton.addEventListener('click', () => {
        const scriptContent = generatedScriptTextarea.value;
        const blob = new Blob([scriptContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'chatbot_script.html';
        link.click();
    });

    // Обработчик для отправки сообщения
    sendButton.addEventListener('click', function() {
        var userMessage = userMessageInput.value.trim();
        if (userMessage === "") return;

        var userMessageElement = document.createElement('div');
        userMessageElement.classList.add('message', 'user-message');
        userMessageElement.textContent = userMessage;

        chatbox.appendChild(userMessageElement);
        userMessageInput.value = '';

        var userMessageBgColor = userMessageBgInput.value;
        userMessageElement.style.backgroundColor = userMessageBgColor;

        fetch('/chatbot/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value
            })
        })
        .then(response => response.json())
        .then(data => {
            var botMessageElement = document.createElement('div');
            botMessageElement.classList.add('message', 'bot-message');
            botMessageElement.textContent = data.reply;

            chatbox.appendChild(botMessageElement);

            var botMessageBgColor = botMessageBgInput.value;
            botMessageElement.style.backgroundColor = botMessageBgColor;

            chatbox.scrollTop = chatbox.scrollHeight;
        })
        .catch(error => console.error('Ошибка:', error));
    });

    // Применяем стили при загрузке страницы
    applyStyles();

    // Генерируем начальные сообщения при старте страницы
    generateInitialMessages();
});
