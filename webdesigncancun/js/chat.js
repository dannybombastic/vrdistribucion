class ChatUI {
    constructor() {
        this.chatContainer = document.getElementById('chat-container');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-btn');
        this.chatToggle = document.getElementById('chat-toggle');
        this.minimizeBtn = document.getElementById('minimize-btn');
        this.closeBtn = document.getElementById('close-btn');
        this.conversationHistory = [];
        this.isStreaming = false;

        this.initializeEventListeners();
        this.adjustInputHeight();
    }

    initializeEventListeners() {
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.minimizeBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.chatInput.addEventListener('input', () => this.adjustInputHeight());
    }

    toggleChat() {
        this.chatContainer.classList.toggle('collapsed');
    }

    adjustInputHeight() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    }

    appendMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;

        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        return messageContent; // Return for streaming updates
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isStreaming) return;

        // Append user message
        this.appendMessage(message, true);
        this.chatInput.value = '';
        this.adjustInputHeight();

        // Update conversation history
        this.conversationHistory.push({
            role: "user",
            content: message
        });

        // Create response container
        const responseContainer = this.appendMessage('', false);
        this.isStreaming = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: this.conversationHistory
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let responseText = '';

            while (true) {
                const {value, done} = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, {stream: true});
                responseText += chunk;
                responseContainer.textContent = responseText;
                this.scrollToBottom();
            }

            // Update conversation history with assistant's response
            this.conversationHistory.push({
                role: "assistant",
                content: responseText
            });

        } catch (error) {
            console.error('Error:', error);
            responseContainer.textContent = 'Sorry, there was an error processing your request.';
        } finally {
            this.isStreaming = false;
        }
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatUI();
});