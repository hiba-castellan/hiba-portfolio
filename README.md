# Hiba V S — Portfolio

A stunning personal portfolio built with Next.js 14, Tailwind CSS, and Framer Motion.

## ✨ Features

- 🌸 Animated falling flower petals (canvas)
- 🖱️ Custom magnetic cursor with ring effect
- ⌨️ Typing animation cycling through titles
- 📊 Animated stat counters on scroll
- 🎨 Dark / Light theme toggle
- 📈 Scroll progress indicator
- 🃏 Expandable project cards with Framer Motion
- 💎 Glassmorphism surface design
- 🌀 Smooth section reveal animations
- 📱 Fully responsive (mobile + desktop)
- 🚀 Vercel-ready

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn

### 2. Clone / Extract
```bash
# Extract the zip or navigate to the folder
cd hiba-portfolio
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
vercel
```
Follow the prompts — it auto-detects Next.js.

### Option B — GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Vercel auto-detects Next.js — click **Deploy**
5. Your site is live in ~60 seconds 🎉

---

## 📁 Folder Structure

```
hiba-portfolio/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Main page (assembles all sections)
│   └── globals.css         # CSS variables, animations, global styles
├── components/
│   ├── Navigation.tsx      # Fixed nav with theme toggle
│   ├── Hero.tsx            # Hero with typing animation + magnetic buttons
│   ├── Stats.tsx           # Animated stat counters
│   ├── About.tsx           # About section with spinning portrait ring
│   ├── Skills.tsx          # Skill chips with hover effects
│   ├── Projects.tsx        # Featured card + expandable project grid
│   ├── Resume.tsx          # Resume download section
│   ├── Contact.tsx         # Contact card with social links
│   ├── PetalCanvas.tsx     # Canvas flower petal animation
│   ├── ScrollProgress.tsx  # Top scroll progress bar
│   └── CustomCursor.tsx    # Magnetic cursor dot + ring
├── public/                 # Static assets (add your resume PDF here)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## ✏️ How to Customize

### Update Your Info
All personal content is in the component files — no config files needed.

| What to change | Where |
|---|---|
| Name, bio | `components/Hero.tsx` |
| About text | `components/About.tsx` |
| Skills list | `components/Skills.tsx` → `SKILL_CATEGORIES` array |
| Projects | `components/Projects.tsx` → `PROJECTS` array + `FEATURED` object |
| Contact links | `components/Contact.tsx` → `LINKS` array |
| Resume file | Drop `resume.pdf` in `/public/`, update href in `Resume.tsx` |

### Add a New Project
In `components/Projects.tsx`, add an object to the `PROJECTS` array:
```ts
{
  num: '05',
  title: 'My New Project',
  summary: 'One-line summary shown on the card.',
  description: 'Full description shown when expanded.',
  tags: ['ML', 'Python'],
  tech: ['PyTorch', 'FastAPI'],
  github: 'https://github.com/hiba-castellan/your-repo',
  demo: 'https://your-demo.vercel.app',
}
```

### Change the Color Theme
Edit CSS variables in `app/globals.css`:
```css
:root {
  --rose: #f0a0c0;       /* primary accent */
  --lavender: #c4a8e8;   /* secondary accent */
  --gold: #e0c878;       /* tertiary / progress bar */
  --mint: #98dcc8;       /* subtle accent */
}
```

### Add Your Resume
1. Export your resume as `resume.pdf`
2. Place it in the `/public/` folder
3. In `components/Resume.tsx`, change `href="#"` to `href="/resume.pdf"`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS Variables |
| Animations | Framer Motion |
| Scroll Detection | react-intersection-observer |
| Canvas | HTML5 Canvas API |
| Fonts | Cormorant Garamond, DM Sans, Fira Code |
| Deployment | Vercel |

---

Built with 🌸 by Hiba V S
