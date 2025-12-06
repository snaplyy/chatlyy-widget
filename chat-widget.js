/**
 * n8n Universal Chat Widget
 * Version: 2.5.0
 * 
 * Dynamisches Chat-Widget mit Buttons, Quick-Replies und Formularen
 * Für die Verwendung mit n8n AI Agents
 * 
 * GitHub: https://github.com/oliverhees/configurable-n8n-chat-widget
 * Generator: https://n8n-widget-generator.a2e-lab.com/
 * Website: https://ai-automation-engineers.com
 * Community: https://skool.com/ki-heroes
 * Author: Oliver Hees
 * 
 * (c) 2025 AI Automation Engineers (Oliver Hees) - MIT License
 */
(function() {
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // ═══════════════════════════════════════════════════════════════
    // DEFAULT CONFIGURATION
    // ═══════════════════════════════════════════════════════════════
    const defaultConfig = {
        webhook: {
            url: '',
            route: 'general'
        },
        branding: {
            botName: 'AI Assistant',
            botStatus: 'Online',
            botAvatar: '',
            showBotAvatar: true,
            welcomeTitle: 'Hallo! 👋',
            welcomeSubtitle: 'Wie kann ich dir heute helfen?',
            welcomeButtonText: 'Chat starten',
            inputPlaceholder: 'Schreibe eine Nachricht...',
            launcherText: 'Chat',
            launcherIcon: 'chat',
            footerText: 'Powered by n8n',
            footerLink: 'https://n8n.io',
            showFooter: true
        },
        initialMessage: {
            enabled: true,
            delay: 500,
            message: ''
        },
        messages: {
            errorGeneral: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
            errorNetwork: 'Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung.',
            errorTimeout: 'Die Anfrage hat zu lange gedauert. Bitte versuche es erneut.',
            formSubmitted: '✓ Gesendet'
        },
        colors: {
            primary: '#6366f1',
            primaryDark: '#4f46e5',
            background: '#ffffff',
            backgroundChat: '#f9fafb',
            backgroundBotMessage: '#ffffff',
            textPrimary: '#1f2937',
            textSecondary: '#6b7280',
            textOnPrimary: '#ffffff',
            border: '#e5e7eb',
            buttonBackground: '#ffffff',
            buttonBorder: '#6366f1',
            buttonText: '#6366f1',
            buttonHoverBackground: '#6366f1',
            buttonHoverText: '#ffffff',
            formBorder: '#6366f1',
            formTitle: '#6366f1',
            statusOnline: '#22c55e',
            statusOffline: '#9ca3af'
        },
        layout: {
            position: 'right',
            windowWidth: '420px',
            windowHeight: '600px',
            windowBottomOffset: '100px',
            windowSideOffset: '24px',
            launcherBottomOffset: '24px',
            launcherSideOffset: '24px',
            borderRadius: '16px'
        },
        typography: {
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        },
        behavior: {
            autoOpen: false,
            autoOpenDelay: 3000,
            requestTimeout: 30000
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // MERGE CONFIGURATION
    // ═══════════════════════════════════════════════════════════════
    function deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = deepMerge(target[key] || {}, source[key]);
            } else if (source[key] !== undefined && source[key] !== '') {
                result[key] = source[key];
            }
        }
        return result;
    }

    const config = deepMerge(defaultConfig, window.ChatWidgetConfig || {});

    if (!config.webhook.url) {
        console.error('Chat Widget Error: webhook.url is required!');
        return;
    }

    // ═══════════════════════════════════════════════════════════════
    // LOAD FONTS
    // ═══════════════════════════════════════════════════════════════
    if (config.typography.fontUrl) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = config.typography.fontUrl;
        document.head.appendChild(fontLink);
    }

    // ═══════════════════════════════════════════════════════════════
    // STYLES
    // ═══════════════════════════════════════════════════════════════
    const styles = document.createElement('style');
    styles.textContent = `
        .n8n-chat-widget * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        .n8n-chat-widget {
            --primary: ${config.colors.primary};
            --primary-dark: ${config.colors.primaryDark};
            --bg: ${config.colors.background};
            --bg-chat: ${config.colors.backgroundChat};
            --bg-bot: ${config.colors.backgroundBotMessage};
            --text: ${config.colors.textPrimary};
            --text-secondary: ${config.colors.textSecondary};
            --text-on-primary: ${config.colors.textOnPrimary};
            --border: ${config.colors.border};
            --btn-bg: ${config.colors.buttonBackground};
            --btn-border: ${config.colors.buttonBorder};
            --btn-text: ${config.colors.buttonText};
            --btn-hover-bg: ${config.colors.buttonHoverBackground};
            --btn-hover-text: ${config.colors.buttonHoverText};
            --form-border: ${config.colors.formBorder};
            --form-title: ${config.colors.formTitle};
            --status-online: ${config.colors.statusOnline};
            --radius: ${config.layout.borderRadius};
            --font: ${config.typography.fontFamily};
            font-family: var(--font);
        }

        /* ══════════ CHAT WINDOW ══════════ */
        .n8n-chat-widget .chat-window {
            position: fixed;
            bottom: ${config.layout.windowBottomOffset};
            ${config.layout.position}: ${config.layout.windowSideOffset};
            z-index: 10000;
            width: ${config.layout.windowWidth};
            max-width: calc(100vw - 40px);
            height: ${config.layout.windowHeight};
            max-height: calc(100vh - 140px);
            background: var(--bg);
            border-radius: var(--radius);
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
            display: none;
            flex-direction: column;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .n8n-chat-widget .chat-window.open {
            display: flex;
        }

        /* ══════════ HEADER ══════════ */
        .n8n-chat-widget .chat-header {
            padding: 16px 20px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: var(--text-on-primary);
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
        }
        .n8n-chat-widget .chat-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: rgba(255,255,255,0.2);
            object-fit: contain;
            padding: 4px;
        }
        .n8n-chat-widget .chat-header-info {
            flex: 1;
        }
        .n8n-chat-widget .chat-header-name {
            font-weight: 600;
            font-size: 15px;
        }
        .n8n-chat-widget .chat-header-status {
            font-size: 12px;
            opacity: 0.9;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .n8n-chat-widget .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--status-online);
        }
        .n8n-chat-widget .chat-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: var(--text-on-primary);
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .n8n-chat-widget .chat-close:hover {
            background: rgba(255,255,255,0.3);
        }

        /* ══════════ WELCOME SCREEN ══════════ */
        .n8n-chat-widget .welcome-screen {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 32px;
            text-align: center;
            background: var(--bg-chat);
        }
        .n8n-chat-widget .welcome-screen.hidden {
            display: none;
        }
        .n8n-chat-widget .welcome-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 8px;
        }
        .n8n-chat-widget .welcome-subtitle {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 24px;
        }
        .n8n-chat-widget .welcome-start {
            padding: 14px 28px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: var(--text-on-primary);
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            font-family: inherit;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .n8n-chat-widget .welcome-start:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }
        .n8n-chat-widget .welcome-start svg {
            width: 20px;
            height: 20px;
        }

        /* ══════════ CHAT BODY ══════════ */
        .n8n-chat-widget .chat-body {
            flex: 1;
            display: none;
            flex-direction: column;
            min-height: 0;
        }
        .n8n-chat-widget .chat-body.active {
            display: flex;
        }

        /* ══════════ MESSAGES ══════════ */
        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--bg-chat);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .n8n-chat-widget .chat-messages::-webkit-scrollbar {
            width: 6px;
        }
        .n8n-chat-widget .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.1);
            border-radius: 3px;
        }

        /* ══════════ MESSAGE BUBBLES ══════════ */
        .n8n-chat-widget .message {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }
        .n8n-chat-widget .message.user {
            align-self: flex-end;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: var(--text-on-primary);
            border-bottom-right-radius: 4px;
        }
        .n8n-chat-widget .message.bot {
            align-self: flex-start;
            background: var(--bg-bot);
            color: var(--text);
            border-bottom-left-radius: 4px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .n8n-chat-widget .message.error {
            background: #fef2f2;
            border: 1px solid #ef4444;
            color: #dc2626;
        }
        .n8n-chat-widget .message strong {
            font-weight: 600;
        }
        .n8n-chat-widget .message a {
            color: var(--primary);
            text-decoration: underline;
        }
        .n8n-chat-widget .message.user a {
            color: var(--text-on-primary);
        }

        /* ══════════ QUICK REPLIES ══════════ */
        .n8n-chat-widget .quick-replies {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-self: flex-start;
            max-width: 85%;
        }
        .n8n-chat-widget .quick-reply-btn {
            padding: 10px 18px;
            background: var(--btn-bg);
            border: 2px solid var(--btn-border);
            border-radius: 24px;
            color: var(--btn-text);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
        }
        .n8n-chat-widget .quick-reply-btn:hover {
            background: var(--btn-hover-bg);
            color: var(--btn-hover-text);
        }
        .n8n-chat-widget .quick-reply-btn.clicked {
            opacity: 0.5;
            pointer-events: none;
        }

        /* ══════════ ACTION BUTTONS ══════════ */
        .n8n-chat-widget .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-self: flex-start;
            max-width: 85%;
        }
        .n8n-chat-widget .action-btn {
            padding: 12px 16px;
            background: var(--btn-bg);
            border: 2px solid var(--btn-border);
            border-radius: 12px;
            color: var(--btn-text);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
            font-family: inherit;
        }
        .n8n-chat-widget .action-btn:hover {
            background: var(--btn-hover-bg);
            color: var(--btn-hover-text);
            transform: translateY(-1px);
        }
        .n8n-chat-widget .action-btn.clicked {
            opacity: 0.5;
            pointer-events: none;
        }

        /* ══════════ DYNAMIC FORM ══════════ */
        .n8n-chat-widget .dynamic-form {
            align-self: flex-start;
            width: 100%;
            max-width: 100%;
            background: var(--bg);
            border: 2px solid var(--form-border);
            border-radius: 12px;
            padding: 16px;
        }
        .n8n-chat-widget .form-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--form-title);
            margin-bottom: 16px;
            text-align: center;
        }
        .n8n-chat-widget .form-grid {
            display: grid;
            gap: 12px;
        }
        .n8n-chat-widget .form-grid.cols-2 {
            grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 500px) {
            .n8n-chat-widget .form-grid.cols-2 {
                grid-template-columns: 1fr;
            }
        }
        .n8n-chat-widget .form-field {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .n8n-chat-widget .form-field.full-width {
            grid-column: 1 / -1;
        }
        .n8n-chat-widget .form-label {
            font-size: 12px;
            font-weight: 500;
            color: var(--text);
        }
        .n8n-chat-widget .form-label.required::after {
            content: ' *';
            color: #ef4444;
        }
        .n8n-chat-widget .form-input,
        .n8n-chat-widget .form-select,
        .n8n-chat-widget .form-textarea {
            padding: 10px 12px;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            background: var(--bg);
            color: var(--text);
            width: 100%;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .n8n-chat-widget .form-input:focus,
        .n8n-chat-widget .form-select:focus,
        .n8n-chat-widget .form-textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .n8n-chat-widget .form-textarea {
            resize: vertical;
            min-height: 80px;
        }
        .n8n-chat-widget .option-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .n8n-chat-widget .option-item {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }
        .n8n-chat-widget .option-item input {
            width: 18px;
            height: 18px;
            accent-color: var(--primary);
        }
        .n8n-chat-widget .option-item span {
            font-size: 14px;
            color: var(--text);
        }
        .n8n-chat-widget .range-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .n8n-chat-widget .range-input {
            width: 100%;
            accent-color: var(--primary);
        }
        .n8n-chat-widget .range-value {
            font-size: 12px;
            color: var(--text-secondary);
            text-align: center;
        }
        .n8n-chat-widget .form-submit {
            margin-top: 16px;
            padding: 12px 24px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: var(--text-on-primary);
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            font-family: inherit;
            display: block;
            width: auto;
            min-width: 120px;
            margin-left: auto;
            margin-right: auto;
            transition: transform 0.2s;
        }
        .n8n-chat-widget .form-submit:hover {
            transform: translateY(-1px);
        }
        .n8n-chat-widget .form-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .n8n-chat-widget .dynamic-form.submitted {
            opacity: 0.7;
            pointer-events: none;
        }

        /* ══════════ TYPING INDICATOR ══════════ */
        .n8n-chat-widget .typing {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            background: var(--bg-bot);
            border-radius: 16px;
            border-bottom-left-radius: 4px;
            align-self: flex-start;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .n8n-chat-widget .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--primary);
            border-radius: 50%;
            animation: n8nTyping 1.4s infinite ease-in-out;
        }
        .n8n-chat-widget .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .n8n-chat-widget .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes n8nTyping {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
        }

        /* ══════════ INPUT AREA ══════════ */
        .n8n-chat-widget .chat-input-area {
            padding: 16px;
            background: var(--bg);
            border-top: 1px solid var(--border);
            display: flex;
            gap: 10px;
            flex-shrink: 0;
        }
        .n8n-chat-widget .chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid var(--border);
            border-radius: 24px;
            background: var(--bg);
            color: var(--text);
            font-size: 14px;
            font-family: inherit;
            resize: none;
            max-height: 100px;
            min-height: 44px;
            line-height: 1.4;
        }
        .n8n-chat-widget .chat-input:focus {
            outline: none;
            border-color: var(--primary);
        }
        .n8n-chat-widget .chat-input::placeholder {
            color: var(--text-secondary);
        }
        .n8n-chat-widget .chat-send {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            border: none;
            border-radius: 50%;
            color: var(--text-on-primary);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: transform 0.2s;
        }
        .n8n-chat-widget .chat-send:hover {
            transform: scale(1.05);
        }
        .n8n-chat-widget .chat-send svg {
            width: 20px;
            height: 20px;
        }

        /* ══════════ FOOTER ══════════ */
        .n8n-chat-widget .chat-footer {
            padding: 10px;
            text-align: center;
            background: var(--bg);
            border-top: 1px solid var(--border);
            flex-shrink: 0;
        }
        .n8n-chat-widget .chat-footer.hidden {
            display: none;
        }
        .n8n-chat-widget .chat-footer a {
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 11px;
        }
        .n8n-chat-widget .chat-footer a:hover {
            color: var(--primary);
        }

        /* ══════════ LAUNCHER ══════════ */
        .n8n-chat-widget .chat-launcher {
            position: fixed;
            bottom: ${config.layout.launcherBottomOffset};
            ${config.layout.position}: ${config.layout.launcherSideOffset};
            z-index: 9999;
            height: 56px;
            padding: 0 20px;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: var(--text-on-primary);
            border: none;
            border-radius: 28px;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: inherit;
            font-weight: 600;
            font-size: 15px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .n8n-chat-widget .chat-launcher:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        .n8n-chat-widget .chat-launcher svg {
            width: 24px;
            height: 24px;
        }
    `;
    document.head.appendChild(styles);

    // ═══════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════
    let sessionId = '';
    let isWaiting = false;

    // ═══════════════════════════════════════════════════════════════
    // CREATE WIDGET HTML
    // ═══════════════════════════════════════════════════════════════
    const widget = document.createElement('div');
    widget.className = 'n8n-chat-widget';

    const avatarHtml = config.branding.showBotAvatar && config.branding.botAvatar 
        ? `<img class="chat-avatar" src="${config.branding.botAvatar}" alt="${config.branding.botName}">`
        : '';

    const footerClass = config.branding.showFooter ? '' : ' hidden';

    widget.innerHTML = `
        <div class="chat-window">
            <div class="chat-header">
                ${avatarHtml}
                <div class="chat-header-info">
                    <div class="chat-header-name">${config.branding.botName}</div>
                    <div class="chat-header-status">
                        <span class="status-dot"></span>
                        ${config.branding.botStatus}
                    </div>
                </div>
                <button class="chat-close">×</button>
            </div>
            
            <div class="welcome-screen">
                <div class="welcome-title">${config.branding.welcomeTitle}</div>
                <div class="welcome-subtitle">${config.branding.welcomeSubtitle}</div>
                <button class="welcome-start">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    ${config.branding.welcomeButtonText}
                </button>
            </div>
            
            <div class="chat-body">
                <div class="chat-messages"></div>
                <div class="chat-input-area">
                    <textarea class="chat-input" placeholder="${config.branding.inputPlaceholder}" rows="1"></textarea>
                    <button class="chat-send">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 2L11 13"></path>
                            <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                        </svg>
                    </button>
                </div>
                <div class="chat-footer${footerClass}">
                    <a href="${config.branding.footerLink}" target="_blank">${config.branding.footerText}</a>
                </div>
            </div>
        </div>
        
        <button class="chat-launcher">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span>${config.branding.launcherText}</span>
        </button>
    `;

    document.body.appendChild(widget);

    // ═══════════════════════════════════════════════════════════════
    // GET DOM ELEMENTS
    // ═══════════════════════════════════════════════════════════════
    const chatWindow = widget.querySelector('.chat-window');
    const welcomeScreen = widget.querySelector('.welcome-screen');
    const chatBody = widget.querySelector('.chat-body');
    const messagesContainer = widget.querySelector('.chat-messages');
    const inputField = widget.querySelector('.chat-input');
    const sendBtn = widget.querySelector('.chat-send');
    const launcherBtn = widget.querySelector('.chat-launcher');
    const closeBtn = widget.querySelector('.chat-close');
    const startBtn = widget.querySelector('.welcome-start');

    // ═══════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    function generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function parseResponse(text) {
        let cleanText = text;
        const quickReplies = [];
        const actionButtons = [];
        let formConfig = null;

        // Quick Replies: {Option1|Option2|Option3}
        const qrRegex = /\{([^}]+)\}/g;
        let qrMatch;
        while ((qrMatch = qrRegex.exec(text)) !== null) {
            const options = qrMatch[1].split('|').map(o => o.trim()).filter(o => o);
            quickReplies.push(...options);
        }
        cleanText = cleanText.replace(qrRegex, '');

        // Action Buttons: [Button Text] = [Message to send]
        const btnRegex = /\[([^\]]+)\]\s*=\s*\[([^\]]+)\]/g;
        let btnMatch;
        while ((btnMatch = btnRegex.exec(text)) !== null) {
            actionButtons.push({ label: btnMatch[1].trim(), value: btnMatch[2].trim() });
        }
        cleanText = cleanText.replace(btnRegex, '');

        // Dynamic Form: [FORM]...[/FORM]
        const formRegex = /\[FORM\]([\s\S]*?)\[\/FORM\]/i;
        const formMatch = text.match(formRegex);
        if (formMatch) {
            try {
                formConfig = JSON.parse(formMatch[1].trim());
            } catch (e) {
                console.error('Invalid form JSON:', e);
            }
        }
        cleanText = cleanText.replace(formRegex, '');
        cleanText = cleanText.replace(/\n{3,}/g, '\n\n').trim();

        return { text: cleanText, quickReplies, actionButtons, form: formConfig };
    }

    function formatText(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>');
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'typing';
        typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typing;
    }

    function addMessage(content, isUser = false, isError = false) {
        const msg = document.createElement('div');
        msg.className = `message ${isUser ? 'user' : 'bot'}${isError ? ' error' : ''}`;
        msg.innerHTML = formatText(content);
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addQuickReplies(options) {
        if (!options.length) return;
        const container = document.createElement('div');
        container.className = 'quick-replies';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = opt;
            btn.onclick = () => {
                container.querySelectorAll('.quick-reply-btn').forEach(b => b.classList.add('clicked'));
                sendMessage(opt);
            };
            container.appendChild(btn);
        });
        messagesContainer.appendChild(container);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addActionButtons(buttons) {
        if (!buttons.length) return;
        const container = document.createElement('div');
        container.className = 'action-buttons';
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.textContent = btn.label;
            button.onclick = () => {
                container.querySelectorAll('.action-btn').forEach(b => b.classList.add('clicked'));
                sendMessage(btn.value);
            };
            container.appendChild(button);
        });
        messagesContainer.appendChild(container);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addDynamicForm(formConfig) {
        if (!formConfig) return;
        const container = document.createElement('div');
        container.className = 'dynamic-form';
        
        const cols = formConfig.columns || 1;
        const colClass = cols === 2 ? 'cols-2' : '';

        let html = formConfig.title ? `<div class="form-title">${formConfig.title}</div>` : '';
        html += `<form class="form-grid ${colClass}">`;

        formConfig.fields.forEach(field => {
            const fullWidth = field.fullWidth || ['textarea', 'radio', 'checkbox'].includes(field.type);
            const reqClass = field.required ? 'required' : '';
            
            html += `<div class="form-field ${fullWidth ? 'full-width' : ''}">`;
            html += `<label class="form-label ${reqClass}">${field.label}</label>`;

            switch (field.type) {
                case 'select':
                    html += `<select class="form-select" name="${field.name}" ${field.required ? 'required' : ''}>`;
                    html += `<option value="">${field.placeholder || 'Bitte wählen...'}</option>`;
                    (field.options || []).forEach(opt => {
                        html += `<option value="${opt}">${opt}</option>`;
                    });
                    html += `</select>`;
                    break;
                case 'textarea':
                    html += `<textarea class="form-textarea" name="${field.name}" placeholder="${field.placeholder || ''}" rows="${field.rows || 3}" ${field.required ? 'required' : ''}></textarea>`;
                    break;
                case 'radio':
                    html += `<div class="option-group">`;
                    (field.options || []).forEach((opt, i) => {
                        html += `<label class="option-item"><input type="radio" name="${field.name}" value="${opt}" ${field.required && i === 0 ? 'required' : ''}><span>${opt}</span></label>`;
                    });
                    html += `</div>`;
                    break;
                case 'checkbox':
                    html += `<div class="option-group">`;
                    (field.options || []).forEach(opt => {
                        html += `<label class="option-item"><input type="checkbox" name="${field.name}" value="${opt}"><span>${opt}</span></label>`;
                    });
                    html += `</div>`;
                    break;
                case 'range':
                    const min = field.min || 0;
                    const max = field.max || 100;
                    const val = field.default || Math.round((min + max) / 2);
                    html += `<div class="range-container">`;
                    html += `<input type="range" class="range-input" name="${field.name}" min="${min}" max="${max}" value="${val}">`;
                    html += `<div class="range-value">${val}</div>`;
                    html += `</div>`;
                    break;
                default:
                    html += `<input class="form-input" type="${field.type || 'text'}" name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>`;
            }
            html += `</div>`;
        });

        html += `<button type="submit" class="form-submit">${formConfig.submitText || 'Absenden'}</button>`;
        html += `</form>`;

        container.innerHTML = html;

        // Range slider value update
        container.querySelectorAll('.range-input').forEach(range => {
            range.addEventListener('input', (e) => {
                e.target.parentElement.querySelector('.range-value').textContent = e.target.value;
            });
        });

        // Form submission
        container.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};
            
            container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                if (!data[cb.name]) data[cb.name] = [];
            });
            
            for (const [key, value] of formData.entries()) {
                const field = formConfig.fields.find(f => f.name === key);
                if (field && field.type === 'checkbox') {
                    if (!data[key]) data[key] = [];
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            }

            Object.keys(data).forEach(key => {
                if (Array.isArray(data[key])) {
                    data[key] = data[key].join(', ');
                }
            });

            container.classList.add('submitted');
            container.querySelector('.form-submit').textContent = config.messages.formSubmitted;

            let summary = formConfig.title ? `📋 **${formConfig.title}**\n\n` : '📋 **Formulardaten:**\n\n';
            formConfig.fields.forEach(field => {
                if (data[field.name]) {
                    summary += `**${field.label}:** ${data[field.name]}\n`;
                }
            });

            sendMessage(summary.trim());
        });

        messagesContainer.appendChild(container);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ═══════════════════════════════════════════════════════════════
    // SEND MESSAGE
    // ═══════════════════════════════════════════════════════════════
    async function sendMessage(text) {
        if (isWaiting || !text.trim()) return;
        isWaiting = true;

        addMessage(text, true);
        const typing = showTyping();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.behavior.requestTimeout);

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'sendMessage',
                    sessionId: sessionId,
                    route: config.webhook.route,
                    chatInput: text
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            typing.remove();

            if (!response.ok) throw new Error('HTTP ' + response.status);

            const data = await response.json();
            const output = Array.isArray(data) ? data[0].output : data.output;
            
            const parsed = parseResponse(output);
            
            if (parsed.text) addMessage(parsed.text);
            if (parsed.quickReplies.length) addQuickReplies(parsed.quickReplies);
            if (parsed.actionButtons.length) addActionButtons(parsed.actionButtons);
            if (parsed.form) addDynamicForm(parsed.form);

        } catch (error) {
            clearTimeout(timeoutId);
            typing.remove();
            
            let errorMsg = config.messages.errorGeneral;
            if (error.name === 'AbortError') {
                errorMsg = config.messages.errorTimeout;
            } else if (error.message.includes('fetch')) {
                errorMsg = config.messages.errorNetwork;
            }
            
            addMessage(errorMsg, false, true);
            console.error('Chat error:', error);
        }

        isWaiting = false;
    }

    // ═══════════════════════════════════════════════════════════════
    // START CHAT
    // ═══════════════════════════════════════════════════════════════
    function startChat() {
        sessionId = generateSessionId();
        welcomeScreen.classList.add('hidden');
        chatBody.classList.add('active');
        
        if (config.initialMessage.enabled && config.initialMessage.message) {
            setTimeout(() => {
                const parsed = parseResponse(config.initialMessage.message);
                if (parsed.text) addMessage(parsed.text);
                if (parsed.quickReplies.length) addQuickReplies(parsed.quickReplies);
                if (parsed.actionButtons.length) addActionButtons(parsed.actionButtons);
                if (parsed.form) addDynamicForm(parsed.form);
            }, config.initialMessage.delay);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════
    launcherBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    startBtn.addEventListener('click', startChat);

    sendBtn.addEventListener('click', () => {
        sendMessage(inputField.value);
        inputField.value = '';
        inputField.style.height = 'auto';
    });

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputField.value);
            inputField.value = '';
            inputField.style.height = 'auto';
        }
    });

    inputField.addEventListener('input', () => {
        inputField.style.height = 'auto';
        inputField.style.height = Math.min(inputField.scrollHeight, 100) + 'px';
    });

    // Auto-open if configured
    if (config.behavior.autoOpen) {
        setTimeout(() => {
            chatWindow.classList.add('open');
        }, config.behavior.autoOpenDelay);
    }

})();
