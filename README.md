# n8n Chat Widget 💬

A flexible, fully configurable chat widget for n8n AI Agents with dynamic buttons, quick replies, and forms.

🇩🇪 [Deutsche Version](README.de.md)

![Version](https://img.shields.io/badge/version-2.5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![n8n](https://img.shields.io/badge/n8n-compatible-orange)

---

## 🚀 Widget Generator (No-Code!)

**Don't want to configure manually?** Use our free Widget Generator:

### 👉 [n8n-widget-generator.a2e-lab.com](https://n8n-widget-generator.a2e-lab.com/)

Create your complete chat system in just 2 minutes - including widget code, agent prompt, and n8n workflow!

---

## ✨ Features

- 🎨 **Fully Customizable** - Colors, texts, layout, everything configurable
- 💬 **Quick Replies** - Horizontal buttons for fast responses
- 🔘 **Action Buttons** - Vertical buttons for menus and options
- 📝 **Dynamic Forms** - The bot can generate forms on-the-fly
- 📱 **Responsive** - Works on desktop and mobile
- 🌙 **Dark Mode Ready** - Just adjust the colors
- ⚡ **Lightweight** - Only ~12KB minified

---

## 🚀 Quick Start

### 1. Include the Widget

```html
<!-- Configuration -->
<script>
    window.ChatWidgetConfig = {
        webhook: {
            url: 'https://your-n8n.com/webhook/xxx/chat'
        },
        branding: {
            botName: 'My Bot',
            welcomeTitle: 'Hello! 👋',
            welcomeSubtitle: 'How can I help you?'
        },
        colors: {
            primary: '#6366f1',
            primaryDark: '#4f46e5'
        }
    };
</script>

<!-- Load Widget -->
<script src="https://cdn.jsdelivr.net/gh/oliverhees/configurable-n8n-chat-widget@latest/chat-widget.min.js"></script>
```

### 2. Create n8n Workflow

1. Add Chat Trigger Node
2. Connect AI Agent Node
3. Configure System Prompt with button syntax

---

## 📖 Configuration

<details>
<summary><b>Webhook (Required)</b></summary>

```javascript
webhook: {
    url: 'https://...',  // Your n8n Webhook URL (required!)
    route: 'general'     // Optional: Route parameter
}
```
</details>

<details>
<summary><b>Branding</b></summary>

```javascript
branding: {
    botName: 'AI Assistant',
    botStatus: 'Online',
    botAvatar: 'https://...',
    showBotAvatar: true,
    welcomeTitle: 'Hello! 👋',
    welcomeSubtitle: 'How can I help?',
    welcomeButtonText: 'Start Chat',
    inputPlaceholder: 'Type a message...',
    launcherText: 'Chat',
    footerText: 'Powered by n8n',
    footerLink: 'https://n8n.io',
    showFooter: true
}
```
</details>

<details>
<summary><b>Colors</b></summary>

```javascript
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
    statusOnline: '#22c55e'
}
```
</details>

<details>
<summary><b>Layout</b></summary>

```javascript
layout: {
    position: 'right',        // 'left' or 'right'
    windowWidth: '420px',
    windowHeight: '600px',
    borderRadius: '16px'
}
```
</details>

<details>
<summary><b>Initial Message</b></summary>

```javascript
initialMessage: {
    enabled: true,
    delay: 500,  // ms
    message: `Welcome! What would you like to do?

[📅 Book Appointment] = [I want to book an appointment]
[💬 Ask Question] = [I have a question]`
}
```
</details>

---

## 🎯 Interactive Elements (Bot Syntax)

### Quick Replies (horizontal)
```
Would you like to continue?
{Yes|No|Maybe}
```

### Action Buttons (vertical)
```
What would you like to do?

[🛒 View Products] = [Show me the products]
[📞 Contact] = [I want to get in touch]
[❓ Help] = [I need help]
```

### Dynamic Forms
```
[FORM]
{
  "title": "📅 Book Appointment",
  "columns": 2,
  "submitText": "Submit",
  "fields": [
    {"name": "name", "label": "Name", "type": "text", "required": true},
    {"name": "email", "label": "Email", "type": "email", "required": true},
    {"name": "date", "label": "Date", "type": "date", "required": true},
    {"name": "message", "label": "Message", "type": "textarea"}
  ]
}
[/FORM]
```

---

## 📋 Form Field Types

| Type | Description |
|------|-------------|
| `text` | Single-line text input |
| `email` | Email field |
| `tel` | Phone number |
| `number` | Number field |
| `date` | Date picker |
| `time` | Time picker |
| `datetime-local` | Date + time |
| `textarea` | Multi-line text |
| `select` | Dropdown (with `options: []`) |
| `radio` | Radio buttons (with `options: []`) |
| `checkbox` | Checkboxes (with `options: []`) |
| `range` | Slider (with `min`, `max`, `default`) |

---

## 🎨 Color Themes

### Blue Professional
```javascript
colors: { primary: '#2563eb', primaryDark: '#1d4ed8' }
```

### Green Nature
```javascript
colors: { primary: '#10b981', primaryDark: '#059669' }
```

### Orange Energetic
```javascript
colors: { primary: '#f97316', primaryDark: '#ea580c' }
```

### Dark Mode
```javascript
colors: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    background: '#1f2937',
    backgroundChat: '#111827',
    backgroundBotMessage: '#374151',
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    border: '#374151'
}
```

---

## 📦 Installation

### CDN (Recommended)
```html
<script src="https://cdn.jsdelivr.net/gh/oliverhees/configurable-n8n-chat-widget@latest/chat-widget.min.js"></script>
```

### Self-hosted
1. Download `chat-widget.min.js`
2. Upload to your server
3. Update the script tag

---

## 🤝 Community & Support

This widget is developed and maintained by **AI Automation Engineers**.

### 🌐 [ai-automation-engineers.com](https://ai-automation-engineers.com)
Visit our website for more n8n tutorials, workflows, and AI automation resources.

### 🎓 [Join our Community on Skool](https://skool.com/ki-heroes)
Join 200+ members learning AI automation, n8n workflows, and more!

- 💬 Get help from the community
- 📚 Access exclusive tutorials
- 🔧 Share your workflows
- 🚀 Learn AI automation

### 🛠️ [Widget Generator](https://n8n-widget-generator.a2e-lab.com/)
Create your widget configuration without coding!

---

## 📄 License

MIT License - Free for personal and commercial use.

---

## 🐛 Issues & Feature Requests

- 🐛 [Report Bug](https://github.com/[USER]/n8n-chat-widget/issues)
- 💡 [Request Feature](https://github.com/[USER]/n8n-chat-widget/issues)
- 💬 [Discussions](https://github.com/[USER]/n8n-chat-widget/discussions)

---

<p align="center">
  Made with ❤️ by <a href="https://ai-automation-engineers.com">AI Automation Engineers</a>
  <br><br>
  <a href="https://skool.com/ki-heroes">🎓 Join our Community</a> •
  <a href="https://n8n-widget-generator.a2e-lab.com/">🚀 Widget Generator</a>
</p>
