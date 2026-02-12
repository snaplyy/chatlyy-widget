/**
 * Ben – KI-Steuerbot Chat Widget
 * Version: 3.0.0
 *
 * Chat-Widget für den KI-Steuerbot "Ben" von onlinesteuern.de
 * Basiert auf n8n AI Agents
 *
 * Author: Oliver Hees / onlinesteuern.de
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
            botName: 'Ben',
            botStatus: 'Online',
            botAvatar: '',
            showBotAvatar: true,
            welcomeTitle: 'Hallo, ich bin Ben 👋',
            welcomeSubtitle: 'Ihr persönlicher KI-Steuerbot von Onlinesteuern.de',
            welcomeQuestion: 'Wie kann ich Ihnen helfen?',
            welcomeButtonText: 'Chat starten',
            inputPlaceholder: 'Nachricht senden',
            launcherIcon: 'chat',
            footerText: '',
            footerLink: '',
            showFooter: false
        },
        portalButton: {
            enabled: true,
            text: 'Zum Mandantenportal',
            actionText: 'Öffnen',
            url: 'https://ben.onlinesteuern.de',
            openInNewTab: true
        },
        initialMessage: {
            enabled: true,
            delay: 500,
            message: ''
        },
        messages: {
            errorTitle: 'Konnte nicht antworten',
            errorGeneral: 'Server error',
            errorNetwork: 'Keine Verbindung zum Server',
            errorTimeout: 'Zeitüberschreitung',
            errorRetry: 'Erneut versuchen',
            formSubmitted: '✓ Gesendet'
        },
        colors: {
            primary: '#1a8a7d',
            primaryDark: '#15756a',
            background: '#ffffff',
            backgroundChat: '#f0f2f5',
            backgroundBotMessage: '#ffffff',
            textPrimary: '#1f2937',
            textSecondary: '#6b7280',
            textOnPrimary: '#ffffff',
            border: '#e5e7eb',
            buttonBackground: '#ffffff',
            buttonBorder: '#1a8a7d',
            buttonText: '#1a8a7d',
            buttonHoverBackground: '#1a8a7d',
            buttonHoverText: '#ffffff',
            formBorder: '#1a8a7d',
            formTitle: '#1a8a7d',
            statusOnline: '#22c55e',
            statusOffline: '#9ca3af',
            errorBackground: '#fff3cd',
            errorText: '#d63031',
            errorSubtext: '#856404'
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
            --error-bg: ${config.colors.errorBackground};
            --error-text: ${config.colors.errorText};
            --error-subtext: ${config.colors.errorSubtext};
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
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            object-fit: cover;
            border: 2px solid rgba(255,255,255,0.3);
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
        .n8n-chat-widget .welcome-avatar {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
            border: 3px solid var(--bg);
        }
        .n8n-chat-widget .welcome-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 4px;
        }
        .n8n-chat-widget .welcome-subtitle {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 6px;
        }
        .n8n-chat-widget .welcome-subtitle-small {
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
            box-shadow: 0 4px 12px rgba(26, 138, 125, 0.4);
        }
        .n8n-chat-widget .welcome-portal {
            margin-top: 12px;
            padding: 12px 28px;
            background: var(--bg);
            color: var(--primary);
            border: 1.5px solid var(--primary);
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            font-family: inherit;
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            transition: all 0.2s;
        }
        .n8n-chat-widget .welcome-portal:hover {
            background: var(--primary);
            color: var(--text-on-primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(26, 138, 125, 0.3);
        }
        .n8n-chat-widget .welcome-portal svg {
            width: 16px;
            height: 16px;
        }
        .n8n-chat-widget .welcome-portal.hidden {
            display: none;
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
            background: var(--error-bg);
            border: none;
            color: var(--text);
            border-radius: 16px;
            border-bottom-left-radius: 4px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .n8n-chat-widget .message.error .error-title {
            font-weight: 600;
            color: var(--error-text);
            margin-bottom: 2px;
        }
        .n8n-chat-widget .message.error .error-detail {
            color: var(--error-subtext);
            font-size: 13px;
        }
        .n8n-chat-widget .message.error .error-retry {
            color: var(--primary);
            text-decoration: underline;
            cursor: pointer;
            font-size: 13px;
            margin-top: 4px;
            display: inline-block;
        }
        .n8n-chat-widget .message.error .error-retry:hover {
            color: var(--primary-dark);
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

        /* ══════════ SHARED BUTTON STYLE ══════════ */
        .n8n-chat-widget .quick-reply-btn,
        .n8n-chat-widget .action-btn {
            padding: 10px 18px;
            background: var(--bg);
            border: 1.5px solid var(--border);
            border-radius: 10px;
            color: var(--text);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .n8n-chat-widget .quick-reply-btn:hover,
        .n8n-chat-widget .action-btn:hover {
            background: var(--primary);
            color: var(--text-on-primary);
            border-color: var(--primary);
            box-shadow: 0 2px 8px rgba(26, 138, 125, 0.25);
            transform: translateY(-1px);
        }
        .n8n-chat-widget .quick-reply-btn:active,
        .n8n-chat-widget .action-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
        }
        .n8n-chat-widget .quick-reply-btn.clicked,
        .n8n-chat-widget .action-btn.clicked {
            opacity: 0.5;
            pointer-events: none;
        }

        /* ══════════ QUICK REPLIES ══════════ */
        .n8n-chat-widget .quick-replies {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-self: flex-start;
            max-width: 85%;
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
            text-align: left;
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
            overflow: hidden;
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

        /* ══════════ PORTAL BUTTON ══════════ */
        .n8n-chat-widget .portal-button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 20px;
            background: var(--primary);
            color: var(--text-on-primary);
            border: none;
            cursor: pointer;
            font-family: inherit;
            font-size: 14px;
            font-weight: 600;
            flex-shrink: 0;
            transition: background 0.2s;
            text-decoration: none;
            border-radius: 0 0 var(--radius) var(--radius);
        }
        .n8n-chat-widget .portal-button:hover {
            background: var(--primary-dark);
        }
        .n8n-chat-widget .portal-button .portal-label {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .n8n-chat-widget .portal-button .portal-action {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 500;
            font-size: 13px;
            opacity: 0.9;
        }
        .n8n-chat-widget .portal-button .portal-action svg {
            width: 16px;
            height: 16px;
        }
        .n8n-chat-widget .portal-button.hidden {
            display: none;
        }

        /* ══════════ TIMESTAMP ══════════ */
        .n8n-chat-widget .message-time {
            font-size: 11px;
            color: var(--text-secondary);
            margin-top: 4px;
            align-self: flex-start;
        }
        .n8n-chat-widget .message-time.user-time {
            align-self: flex-end;
        }

        /* ══════════ BOT AVATAR IN MESSAGES ══════════ */
        .n8n-chat-widget .message-row {
            display: flex;
            align-items: flex-end;
            gap: 8px;
            max-width: 85%;
        }
        .n8n-chat-widget .message-row.bot-row {
            align-self: flex-start;
        }
        .n8n-chat-widget .message-row.user-row {
            align-self: flex-end;
            flex-direction: row-reverse;
        }
        .n8n-chat-widget .message-row .msg-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--primary);
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .n8n-chat-widget .message-row .msg-avatar img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            object-fit: cover;
        }
        .n8n-chat-widget .message-row .msg-avatar-placeholder {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: transparent;
            flex-shrink: 0;
        }

        /* ══════════ LAUNCHER ══════════ */
        .n8n-chat-widget .chat-launcher {
            position: fixed;
            bottom: ${config.layout.launcherBottomOffset};
            ${config.layout.position}: ${config.layout.launcherSideOffset};
            z-index: 9999;
            width: 56px;
            height: 56px;
            padding: 0;
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: var(--text-on-primary);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: inherit;
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
        .n8n-chat-widget .chat-launcher .launcher-icon-close {
            display: none;
        }
        .n8n-chat-widget .chat-launcher.is-open .launcher-icon-chat {
            display: none;
        }
        .n8n-chat-widget .chat-launcher.is-open .launcher-icon-close {
            display: block;
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

    // Note: All config values are developer-controlled (set via ChatWidgetConfig),
    // not user-supplied, so innerHTML usage here is safe from XSS.
    const avatarHtml = config.branding.showBotAvatar && config.branding.botAvatar
        ? `<img class="chat-avatar" src="${config.branding.botAvatar}" alt="${config.branding.botName}">`
        : `<div class="chat-avatar" style="display:flex;align-items:center;justify-content:center;font-size:18px;background:rgba(255,255,255,0.2);">🤖</div>`;

    const footerClass = config.branding.showFooter ? '' : ' hidden';
    const portalClass = config.portalButton.enabled ? '' : ' hidden';
    const portalTarget = config.portalButton.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';

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
                <button class="chat-close">&times;</button>
            </div>

            <div class="welcome-screen">
                ${config.branding.botAvatar ? `<img class="welcome-avatar" src="${config.branding.botAvatar}" alt="${config.branding.botName}">` : ''}
                <div class="welcome-title">${config.branding.welcomeTitle}</div>
                <div class="welcome-subtitle">${config.branding.welcomeSubtitle}</div>
                <div class="welcome-subtitle-small">${config.branding.welcomeQuestion || ''}</div>
                <button class="welcome-start">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    ${config.branding.welcomeButtonText}
                </button>
                <a class="welcome-portal${portalClass}" href="${config.portalButton.url}"${portalTarget}>
                    ${config.portalButton.text}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
            </div>

            <div class="chat-body">
                <div class="chat-messages"></div>
                <div class="chat-input-area">
                    <textarea class="chat-input" placeholder="${config.branding.inputPlaceholder}" rows="1"></textarea>
                    <button class="chat-send">
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                    </button>
                </div>
                <a class="portal-button${portalClass}" href="${config.portalButton.url}"${portalTarget}>
                    <span class="portal-label">${config.portalButton.text}</span>
                    <span class="portal-action">
                        ${config.portalButton.actionText}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </span>
                </a>
                <div class="chat-footer${footerClass}">
                    <a href="${config.branding.footerLink}" target="_blank">${config.branding.footerText}</a>
                </div>
            </div>
        </div>

        <button class="chat-launcher">
            <svg class="launcher-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <svg class="launcher-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
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

    function getTimestamp() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
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
        // Bot messages get an avatar row
        if (!isUser && !isError) {
            const row = document.createElement('div');
            row.className = 'message-row bot-row';

            const avatarEl = document.createElement('div');
            if (config.branding.showBotAvatar && config.branding.botAvatar) {
                avatarEl.className = 'msg-avatar';
                const img = document.createElement('img');
                img.src = config.branding.botAvatar;
                img.alt = config.branding.botName;
                avatarEl.appendChild(img);
            } else {
                avatarEl.className = 'msg-avatar';
                avatarEl.textContent = '🤖';
                avatarEl.style.fontSize = '14px';
            }

            const msg = document.createElement('div');
            msg.className = 'message bot';
            msg.innerHTML = formatText(content);

            row.appendChild(avatarEl);
            row.appendChild(msg);
            messagesContainer.appendChild(row);
        } else if (isUser) {
            const msg = document.createElement('div');
            msg.className = 'message user';
            msg.innerHTML = formatText(content);
            messagesContainer.appendChild(msg);
        }

        // Timestamp
        const time = document.createElement('div');
        time.className = `message-time${isUser ? ' user-time' : ''}`;
        time.textContent = getTimestamp();
        messagesContainer.appendChild(time);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addErrorMessage(errorMsg, lastMessageText) {
        const row = document.createElement('div');
        row.className = 'message-row bot-row';

        const avatarEl = document.createElement('div');
        avatarEl.className = 'msg-avatar';
        avatarEl.textContent = '🤖';
        avatarEl.style.fontSize = '14px';

        const msg = document.createElement('div');
        msg.className = 'message error';

        const title = document.createElement('div');
        title.className = 'error-title';
        title.textContent = config.messages.errorTitle;

        const detail = document.createElement('div');
        detail.className = 'error-detail';
        detail.textContent = errorMsg;

        const retry = document.createElement('div');
        retry.className = 'error-retry';
        retry.textContent = config.messages.errorRetry;
        retry.addEventListener('click', () => {
            // Remove time element (next sibling) before removing the row
            const timeEl = row.nextElementSibling;
            if (timeEl && timeEl.classList.contains('message-time')) timeEl.remove();
            row.remove();
            if (lastMessageText) {
                sendMessage(lastMessageText);
            }
        });

        msg.appendChild(title);
        msg.appendChild(detail);
        msg.appendChild(retry);
        row.appendChild(avatarEl);
        row.appendChild(msg);
        messagesContainer.appendChild(row);

        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = getTimestamp();
        messagesContainer.appendChild(time);

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

            let errorDetail = config.messages.errorGeneral;
            if (error.name === 'AbortError') {
                errorDetail = config.messages.errorTimeout;
            } else if (error.message.includes('fetch')) {
                errorDetail = config.messages.errorNetwork;
            }

            addErrorMessage(errorDetail, text);
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
    function toggleChat() {
        const isOpen = chatWindow.classList.toggle('open');
        launcherBtn.classList.toggle('is-open', isOpen);
    }

    launcherBtn.addEventListener('click', toggleChat);

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
        launcherBtn.classList.remove('is-open');
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
            launcherBtn.classList.add('is-open');
        }, config.behavior.autoOpenDelay);
    }

})();
