# n8n Chat Widget 💬

Ein flexibles, voll konfigurierbares Chat-Widget für n8n AI Agents mit dynamischen Buttons, Quick-Replies und Formularen.

🇬🇧 [English Version](README.md)

![Version](https://img.shields.io/badge/version-2.5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![n8n](https://img.shields.io/badge/n8n-compatible-orange)

---

## 🚀 Widget Generator (No-Code!)

**Du willst nicht manuell konfigurieren?** Nutze unseren kostenlosen Widget Generator:

### 👉 [n8n-widget-generator.a2e-lab.com](https://n8n-widget-generator.a2e-lab.com/)

Erstelle dein komplettes Chat-System in nur 2 Minuten - inklusive Widget-Code, Agent-Prompt und n8n Workflow!

---

## ✨ Features

- 🎨 **Vollständig anpassbar** - Farben, Texte, Layout, alles konfigurierbar
- 💬 **Quick Replies** - Horizontale Buttons für schnelle Antworten
- 🔘 **Action Buttons** - Vertikale Buttons für Menüs und Optionen
- 📝 **Dynamische Formulare** - Der Bot kann Formulare on-the-fly generieren
- 📱 **Responsive** - Funktioniert auf Desktop und Mobile
- 🌙 **Dark Mode Ready** - Einfach Farben anpassen
- ⚡ **Leichtgewicht** - Nur ~12KB minifiziert

---

## 🚀 Schnellstart

### 1. Widget einbinden

```html
<!-- Konfiguration -->
<script>
    window.ChatWidgetConfig = {
        webhook: {
            url: 'https://dein-n8n.de/webhook/xxx/chat'
        },
        branding: {
            botName: 'Mein Bot',
            welcomeTitle: 'Hallo! 👋',
            welcomeSubtitle: 'Wie kann ich dir helfen?'
        },
        colors: {
            primary: '#6366f1',
            primaryDark: '#4f46e5'
        }
    };
</script>

<!-- Widget laden -->
<script src="https://cdn.jsdelivr.net/gh/oliverhees/configurable-n8n-chat-widget@latest/chat-widget.min.js"></script>
```

### 2. n8n Workflow erstellen

1. Chat Trigger Node hinzufügen
2. AI Agent Node verbinden
3. System Prompt mit Button-Syntax konfigurieren

---

## 📖 Konfiguration

<details>
<summary><b>Webhook (Pflichtfeld)</b></summary>

```javascript
webhook: {
    url: 'https://...',  // Deine n8n Webhook URL (Pflicht!)
    route: 'general'     // Optional: Route Parameter
}
```
</details>

<details>
<summary><b>Branding</b></summary>

```javascript
branding: {
    botName: 'AI Assistant',           // Bot Name
    botStatus: 'Online',               // Status Text
    botAvatar: 'https://...',          // Avatar URL
    showBotAvatar: true,               // Avatar anzeigen?
    welcomeTitle: 'Hallo! 👋',         // Begrüßung
    welcomeSubtitle: 'Wie kann ich helfen?',
    welcomeButtonText: 'Chat starten',
    inputPlaceholder: 'Nachricht...',
    launcherText: 'Chat',              // Button Text
    footerText: 'Powered by n8n',
    footerLink: 'https://n8n.io',
    showFooter: true
}
```
</details>

<details>
<summary><b>Farben</b></summary>

```javascript
colors: {
    primary: '#6366f1',           // Hauptfarbe
    primaryDark: '#4f46e5',       // Akzentfarbe
    background: '#ffffff',         // Hintergrund
    backgroundChat: '#f9fafb',     // Chat-Bereich
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
    position: 'right',        // 'left' oder 'right'
    windowWidth: '420px',
    windowHeight: '600px',
    borderRadius: '16px'
}
```
</details>

<details>
<summary><b>Initiale Nachricht</b></summary>

```javascript
initialMessage: {
    enabled: true,
    delay: 500,  // ms
    message: `Willkommen! Was möchtest du tun?

[📅 Termin buchen] = [Ich möchte einen Termin buchen]
[💬 Frage stellen] = [Ich habe eine Frage]`
}
```
</details>

---

## 🎯 Interaktive Elemente (Bot-Syntax)

### Quick Replies (horizontal)
```
Möchtest du fortfahren?
{Ja|Nein|Vielleicht}
```

### Action Buttons (vertikal)
```
Was möchtest du tun?

[🛒 Produkte ansehen] = [Zeig mir die Produkte]
[📞 Kontakt] = [Ich möchte Kontakt aufnehmen]
[❓ Hilfe] = [Ich brauche Hilfe]
```

### Dynamische Formulare
```
[FORM]
{
  "title": "📅 Termin buchen",
  "columns": 2,
  "submitText": "Absenden",
  "fields": [
    {"name": "name", "label": "Name", "type": "text", "required": true},
    {"name": "email", "label": "E-Mail", "type": "email", "required": true},
    {"name": "datum", "label": "Datum", "type": "date", "required": true},
    {"name": "nachricht", "label": "Nachricht", "type": "textarea"}
  ]
}
[/FORM]
```

---

## 📋 Formular-Feldtypen

| Typ | Beschreibung |
|-----|-------------|
| `text` | Einzeiliges Textfeld |
| `email` | E-Mail Feld |
| `tel` | Telefonnummer |
| `number` | Zahlenfeld |
| `date` | Datumsauswahl |
| `time` | Zeitauswahl |
| `datetime-local` | Datum + Zeit |
| `textarea` | Mehrzeiliger Text |
| `select` | Dropdown (mit `options: []`) |
| `radio` | Radio Buttons (mit `options: []`) |
| `checkbox` | Checkboxen (mit `options: []`) |
| `range` | Slider (mit `min`, `max`, `default`) |

---

## 🎨 Farbthemes

### Blau Professional
```javascript
colors: { primary: '#2563eb', primaryDark: '#1d4ed8' }
```

### Grün Nature
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

### CDN (Empfohlen)
```html
<script src="https://cdn.jsdelivr.net/gh/oliverhees/configurable-n8n-chat-widget@latest/chat-widget.min.js"></script>
```

### Selbst hosten
1. `chat-widget.min.js` herunterladen
2. Auf deinem Server ablegen
3. Script-Tag anpassen

---

## 🤝 Community & Support

Dieses Widget wird entwickelt und gepflegt von **AI Automation Engineers**.

### 🌐 [ai-automation-engineers.com](https://ai-automation-engineers.com)
Besuche unsere Website für mehr n8n Tutorials, Workflows und KI-Automatisierungs-Ressourcen.

### 🎓 [Tritt unserer Community auf Skool bei](https://skool.com/ki-heroes)
Werde Teil von 200+ Mitgliedern, die KI-Automatisierung, n8n Workflows und mehr lernen!

- 💬 Hol dir Hilfe von der Community
- 📚 Zugang zu exklusiven Tutorials
- 🔧 Teile deine Workflows
- 🚀 Lerne KI-Automatisierung

### 🛠️ [Widget Generator](https://n8n-widget-generator.a2e-lab.com/)
Erstelle deine Widget-Konfiguration ohne Coding!

---

## 📄 Lizenz

MIT License - Frei verwendbar für private und kommerzielle Projekte.

---

## 🐛 Bugs & Feature-Wünsche

- 🐛 [Bug melden](https://github.com/[USER]/n8n-chat-widget/issues)
- 💡 [Feature anfragen](https://github.com/[USER]/n8n-chat-widget/issues)
- 💬 [Diskussionen](https://github.com/[USER]/n8n-chat-widget/discussions)

---

<p align="center">
  Made with ❤️ von <a href="https://ai-automation-engineers.com">AI Automation Engineers</a>
  <br><br>
  <a href="https://skool.com/ki-heroes">🎓 Community beitreten</a> •
  <a href="https://n8n-widget-generator.a2e-lab.com/">🚀 Widget Generator</a>
</p>
