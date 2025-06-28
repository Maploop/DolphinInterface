const chatArea = document.getElementById('chat-area');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');
const currentTimeElement = document.getElementById('current-time');
const settingsBtn = document.getElementById('settings-btn');
const copyBtn = document.getElementById('copy-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeModal = document.getElementById('close-modal');
const colorPresets = document.querySelectorAll('.color-preset');
const customColorInput = document.getElementById('custom-color');
const applySettingsBtn = document.getElementById('apply-settings');
const sessionIdElement = document.getElementById('session-id');

let messageCounter = 3;
let currentColor = '#00ff41';
let sessionId = generateSessionID();

sessionIdElement.innerHTML = sessionId;
window.log.debug(sessionId);

const messagesMap = {};

function updateTime() {
    const now = new Date();
    const timeString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    currentTimeElement.textContent = timeString;
}

setInterval(updateTime, 1000);
updateTime();

// Generate random hash
function generateHash() {
    const chars = '0123456789abcdefghijklmnopqrstvABCDEFGHI';
    let hash = '';
    for (let i = 0; i < 16; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

function generateSessionID() {
    const chars = 'ABCDEFGHIJKLKMNOPQRSTUVWXYZ0123456789';
    let hash = '';
    for (let i = 0; i < 16; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash.replace(/(.{4})(?!$)/g, '$&-');
}

function getTimestamp() {
    const now = new Date();
    return now.toTimeString().substring(0, 8);
}

async function addMessage(content, sender = 'USER', isSystem = false) {
    const messageDiv = document.createElement('div');
    const formatted = await window.util.format_markdown(content);

    const messageHash = generateHash();
    messagesMap[messageHash] = {
        author: (sender === null ? "SYSTEM" : sender),
        content_raw: content,
        content_formatted: formatted
    }

    if (isSystem) {
        messageDiv.className = 'system-message';
        messageDiv.textContent = content;
    } else {
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <div class="message-header">
                <span>[${sender}] ${sender === 'USER' ? 'OPERATOR-X' : "DOLPHIN-LLAMA3"}</span>
                <span>${getTimestamp()}</span>
            </div>
            <div class="message-content">${formatted}</div>
            
        ` + ((sender === 'USER' || sender === null) ? "" : `<btn onclick="copyText('${messageHash}')" id="copy-btn-${messageHash}" class="copy-btn">📋</btn>`) 
        + ((sender === 'USER' || sender === null) ? "" : `<div class="encryption-status">Hash: ${messageHash}</div>`) ;
    }
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    messageCounter++;
}

function showTyping() {
    typingIndicator.style.display = 'block';
    chatArea.scrollTop = chatArea.scrollHeight;
}

function stopTyping() {
    typingIndicator.style.display = 'none';
}

function generateDolphinResponse(prompt) {
    const ip = "http://localhost:11434/api/generate";
    
    fetch(ip, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                "model": "dolphin-llama3",
                "prompt": prompt,
                "options": {
                    "num_ctx": 256000
                },
                stream: false
            }
        )
        
    }).then(data => data.json()).then(async (d) => {
        const response = d['response'];
        stopTyping();
        addMessage(response, 'DOLPHIN');
    });
}

async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content) return;
    
    addMessage(content, 'USER');
    messageInput.value = '';
    
    messageInput.style.height = 'auto';
    
    showTyping();
    generateDolphinResponse(content);
}

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

document.getElementById('errored').display = 'none';
document.getElementById('connection').innerHTML = 'CONNECTING...';

function settings_clicked() {
    window.log.debug("Clicked");
    document.getElementById('settings-modal').display = 'block';
}

async function copyTextToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) { }
}

function copyText(hash) {
    const message = messagesMap[hash];
    if (!message) {
        addMessage("Failed to copy; Empty message?", null, true);
    }
    
    copyTextToClipboard(message['content_raw']);
    const btn = document.getElementById('copy-btn-' + hash);
    btn.innerText = "✅";
    setTimeout(() => {
        btn.innerText = "📋";
    }, 3000);
}

async function save_chat_file() {
    const content = JSON.stringify(messagesMap, 4, ' ');
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dl3_${sessionId}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); 
}

messageInput.focus();

