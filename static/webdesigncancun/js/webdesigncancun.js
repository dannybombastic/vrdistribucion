function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
// function that get the local time of the user also add the day of the week and format it
function getLocalTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return now.toLocaleString('es-MX', options);
}

document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const chatToggle = document.getElementById('chat-toggle');
    const minimizeBtn = document.getElementById('minimize-btn');
    const closeBtn = document.getElementById('close-btn');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const prod = "https://vrdistribucion.com/api/marketing/chat"
    const prodwww = "https://www.vrdistribucion.com/api/marketing/chat"
    const dev = "http://localhost:8000/api/marketing/chat/openai"
    let apiUrl;
    if (window.location.hostname === "vrdistribucion.com" ) {
        apiUrl = prod;
    } 
    else if (window.location.hostname === "www.vrdistribucion.com" ) {
        apiUrl = prodwww;
    }
    else {
        console.log("production");
        apiUrl = dev;
    }


    // Initialize conversation history
    let conversationHistory = [];

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        toggleChat();
    });

    // Minimize chat window
    minimizeBtn.addEventListener('click', () => {
        toggleChat();
    });

    // Close chat window
    closeBtn.addEventListener('click', () => {
        toggleChat();
    });



    function toggleChat() {
        if (chatContainer.classList.contains('collapsed')) {
            chatContainer.classList.remove('collapsed');
            chatToggle.style.display = 'none';
            return
        }
        chatContainer.classList.add('collapsed');
        chatToggle.style.display = 'block';
    }

    // Handle message sending
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message to chat and history
            addMessage(message, 'user');
            conversationHistory.push({
                role: "user",
                content: message
            });
            chatInput.value = '';

            try {
                // Show loading indicator
                const loadingMessage = addMessage('Typing...', 'assistant');

                // Make API request with timeout
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout')), 30000);
                });


                const fetchPromise = fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        conversation_history: conversationHistory,
                        sessionId: generateUUID(),
                        timestamp: getLocalTime()
                    })
                });


                // Race between fetch and timeout
                const response = await Promise.race([fetchPromise, timeoutPromise]);

                // Remove loading message
                loadingMessage.remove();

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
                }

                // Try to get the response as text first
                const responseText = await response.text();
                let responseData;

                try {
                    // Try to parse as JSON
                    responseData = JSON.parse(responseText);
                    if (responseData && responseData.response) {
                        // Add assistant's message to chat and history
                        addMessage(responseData.response, 'assistant');
                        conversationHistory.push({
                            role: "assistant",
                            content: responseData.response
                        });
                    } else {
                        throw new Error('Invalid response format from server');
                    }
                } catch (jsonError) {
                    console.error('Error parsing response:', jsonError);
                    throw new Error('Error processing server response');
                }

            } catch (error) {
                console.error('Error:', error);
                // Remove loading message if it exists
                const loadingMsg = chatMessages.querySelector('.message.assistant:last-child');
                if (loadingMsg && loadingMsg.textContent.includes('Typing...')) {
                    loadingMsg.remove();
                }

                // Add appropriate error message
                const errorMessage = error.message === 'Timeout'
                    ? 'La solicitud tardó demasiado tiempo. Por favor, intenta de nuevo.'
                    : error.message.includes('Failed to fetch')
                    ? 'No se pudo conectar al servidor. Por favor, verifica tu conexión e intenta de nuevo.'
                    : 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.';

                addMessage(errorMessage, 'assistant');
                // Don't add error messages to conversation history
            }
        }
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${text}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key (Shift+Enter for new line)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});