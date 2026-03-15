# Arcana Pack Opener

A mystical card pack opening experience built with **Next.js 14**, **TypeScript**, **Framer Motion**, and **Tailwind CSS**. Deploy instantly to Vercel.

## ✨ Features

- **4 unique card packs** — Void Ascendant, Inferno Rites, Arcane Codex, Abyssal Tides
- **5 rarity tiers** — Common, Uncommon, Rare, Epic, Legendary (with weighted probability)
- **Animated pack selection** with glow effects and floating animations
- **Pack opening animation** — burst/scale on open
- **Card fan-out** with Framer Motion spring physics
- **Individual card flip** — tap each card or "Reveal All"
- **Particle background** canvas with ambient floating particles
- **Shimmer/glow** effects per rarity tier

## 🚀 Deploy to Vercel

### Option A — GitHub (Recommended)

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repo — Vercel auto-detects Next.js
4. Click **Deploy** — done!

### Option B — Vercel CLI

```bash
npm install -g vercel
cd card-pack-opener
npm install
vercel
```

## 🛠 Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
card-pack-opener/
├── app/
│   ├── globals.css        # Custom fonts, animations, CSS vars
│   ├── layout.tsx         # Root layout + metadata
│   └── page.tsx           # Main orchestrator (phase state machine)
├── components/
│   ├── ParticleBackground.tsx  # Canvas particle system
│   ├── PackSelection.tsx       # Pack grid with hover effects
│   ├── PackInspect.tsx         # Selected pack + open button
│   ├── Card.tsx                # Individual card with flip animation
│   └── CardReveal.tsx          # Fan layout + reveal all logic
├── data/
│   └── cards.ts           # Pack definitions, card generation, rarity config
├── types/
│   └── index.ts           # TypeScript interfaces
└── ...config files
```

## 🎨 Customization

- **Add packs**: Edit `data/cards.ts` → `PACKS` array
- **Add card names**: Edit `CARD_NAMES` and `CARD_DESC` in `data/cards.ts`
- **Adjust rarity odds**: Edit `getRarityForIndex()` in `data/cards.ts`
- **Change card count per pack**: Set `cardCount` in each pack definition
- **Swap fonts**: Edit the Google Fonts import in `globals.css`
