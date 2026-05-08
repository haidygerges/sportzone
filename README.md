# ⚽ SportZone

A modern, responsive sports news and analytics web application built with vanilla HTML, CSS, and JavaScript.

![SportZone Preview](https://img.shields.io/badge/Status-Live-2ECC52?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Pages](#pages)
- [APIs Used](#apis-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)

---

## 🏟️ About

**SportZone** is a front-end web application that provides real-time football scores, league standings, player stats, and the latest sports/world news — all in a sleek dark-themed UI.

---

## ✨ Features

- 🔴 **Live Scores** — Real-time match updates with live status indicators
- 🏆 **League Standings** — Up-to-date tables for top football leagues
- 📊 **Player Stats** — Detailed statistics for players across major leagues
- 📰 **News Feed** — Sports, politics, economy & entertainment news
- 💱 **Currency Converter** — Live exchange rates (USD, EUR, GBP, SAR → EGP)
- 🌤️ **Weather Widget** — Current weather displayed in the navbar
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| Home | `home.html` | Dashboard with live scores, news, and currency converter |
| Live | `html/Live.html` | Real-time match scores filtered by league |
| Standings | `html/standing.html` | League tables (Premier League, La Liga, etc.) |
| Stats | `html/stands.html` | Player performance statistics |

---

## 🔌 APIs Used

| API | Purpose |
|-----|---------|
| [AllSports API](https://allsportsapi.com/) | Live scores, standings & player stats |
| [NewsData.io](https://newsdata.io/) | Sports, politics & economy news |
| [GNews](https://gnews.io/) | Entertainment & sports news |
| [FastForex](https://fastforex.io/) | Currency exchange rates |
| [Frankfurter](https://frankfurter.app/) | Currency conversion |
| [OpenWeatherMap](https://openweathermap.org/) | Weather widget |

---

## 📁 Project Structure

```
sport/
├── home.html               # Main landing page
├── css/
│   └── style.css           # Global styles & animations
├── html/
│   ├── Live.html           # Live match scores
│   ├── standing.html       # League standings
│   └── stands.html         # Player stats
└── scripts/
    ├── home.js             # Home page logic (news, currency, live scores)
    ├── live.js             # Live scores logic
    ├── standing.js         # Standings data fetching
    ├── stands.js           # Player stats logic
    ├── menue.js            # Mobile navigation menu
    └── whether.js          # Weather widget
```

---

## 🚀 Getting Started

No build tools or dependencies required — just open in a browser.

### Option 1: Open locally
```bash
git clone https://github.com/YOUR_USERNAME/sportzone.git
cd sportzone
# Open home.html in your browser
open home.html
```

### Option 2: Live Server (recommended for development)
If you use VS Code, install the [Live Server](https://haidygerges.github.io/sportzone/) extension and click **Go Live**.

---

## ⚙️ Configuration

The app uses several third-party API keys located in the `scripts/` files. To use your own keys:

1. **AllSports API** — Replace `apikey` in `home.js`, `live.js`, `standing.js`, `stands.js`
2. **FastForex** — Replace `exchangeApiKey` in `home.js`
3. **NewsData.io** — Replace `NEWSDATA_KEY` in `home.js`
4. **GNews** — Replace `GNEWS_KEY` in `home.js`
5. **OpenWeather** — Replace the key in `whether.js`

> ⚠️ **Security Note:** For production, never expose API keys in client-side JavaScript. Consider using a backend proxy or environment variables with a build tool.

---

## 🎨 Design

- **Color Palette:** Dark background `#0A0A0A` with green accent `#2ECC52` and red `#E63946`
- **Fonts:** Oswald, Bebas Neue, Barlow (via Google Fonts)
- **Framework:** Tailwind CSS v4 (via CDN)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
