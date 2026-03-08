# 💐 NirussVn0 Dev — Women's Day Card

<div align="center">

![NirussVn0 Dev](https://img.shields.io/badge/NirussVn0_Dev-8/3_Card-FF6B81?style=for-the-badge&logo=heart&logoColor=white)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Anime.js](https://img.shields.io/badge/Anime.js-4-FF6B6B?style=for-the-badge)](https://animejs.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](./LICENSE)

**Create stunning Women's Day (March 8) greeting cards** 🌹

Falling petals · Flying envelopes · Background music · Heart QR codes · Typewriter text
Developed by **[NirussVn0](https://github.com/NirussVn0)**.

[Features](#-features) • [Setup](#-setup) • [Structure](#-project-structure) • [Contributing](#-contributing) • [Tiếng Việt](./README.md)

</div>

---

## ✨ Features

### 🌸 Two Card Themes
* **Catch Me**: Dodging "No" button → rose bloom → message + confetti
* **Love Letter**: SVG rose drawing → envelope with hearts → typewriter letter

### 🎨 Effects
* Falling petal rain (Anime.js)
* Floating envelope with CSS `::before/::after` hearts
* Progressive SVG heart text path + rotation
* SVG rose stroke-draw animation
* Confetti celebration

### 📱 Other Features
* **Background music**: Auto-play + always-visible toggle
* **Image upload**: Recipient photo in the letter (max 5MB)
* **Heart-shaped QR**: Canvas heart with embedded QR code, downloadable
* **Sender name**: URL format `/card/sender-name-randomId`
* **Link expiry**: Auto-delete after 10 days
* **Watermark**: "Surprise by NirussVn0" → github.com/NirussVn0
* **Mobile responsive**: Beautiful on all devices

---

## 🚀 Setup

1. **Clone**:
   ```bash
   git clone https://github.com/NirussVn0/women-day-bloom-card.git
   cd women-day-bloom-card
   ```

2. **Install**:
   ```bash
   npm install
   ```

3. **Run**:
   ```bash
   npm run dev
   ```

4. **Open**: [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Add Background Music

Copy an `.mp3` file to `public/music.mp3`.

---

## 📁 Project Structure

```
women-day-bloom-card/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout + fonts
│   ├── page.tsx                # Card creator page
│   ├── globals.css             # Design tokens + CSS
│   └── card/[id]/page.tsx      # Card viewer page
│
├── components/                 # React Components
│   ├── BrandWatermark.tsx      # Brand badge link
│   ├── card/
│   │   ├── CardView.tsx        # Theme state machine
│   │   ├── CreatorForm.tsx     # Creator form + QR
│   │   ├── MemeOpening.tsx     # Meme intro (shared)
│   │   ├── EnvelopeLetter.tsx  # Theme A: envelope open
│   │   ├── DodgeButton.tsx     # Theme A: dodge button
│   │   ├── MessageReveal.tsx   # Theme A: message reveal
│   │   ├── RoseDrawing.tsx     # Theme B: SVG rose
│   │   ├── EnvelopeScene.tsx   # Theme B: envelope + hearts
│   │   ├── LetterModal.tsx     # Theme B: letter modal
│   │   ├── HeartQR.tsx         # Canvas heart QR
│   │   └── MusicToggle.tsx     # Music toggle
│   └── effects/
│       ├── PetalRain.tsx       # Petal rain effect
│       └── RoseGift.tsx        # Rose bloom effect
│
├── lib/                        # Business Logic
│   ├── store.ts                # In-memory store + expiry
│   └── actions.ts              # Server actions
│
├── public/                     # Static assets
│   ├── ref/                    # Images: giftbox, mewmew, hearts
│   ├── cute.jpeg               # Meme opening image
│   └── music.mp3               # Background music (add your own)
```

---

## 🧱 Design Principles

| Principle | Description |
|-----------|-------------|
| **SRP** | Each component has a single responsibility |
| **OCP** | Easy to add new themes via CardView state machine |
| **DRY** | Shared components: PetalRain, BrandWatermark |
| **Type Safety** | Strict TypeScript with interfaces for all props |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animations | Anime.js 4 |
| Icons | react-icons (Phosphor) |
| QR | qrcode |
| Fonts | Dancing Script, Inter, Playfair Display |

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/feature-name`
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/feature-name`
5. Open a Pull Request

---

## 📄 License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.

Copyright © 2026 **[NirussVn0](https://github.com/NirussVn0)**.
