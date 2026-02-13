# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (Vite with HMR)
- **Build**: `npm run build`
- **Lint**: `npm run lint` (ESLint 9 flat config)
- **Preview**: `npm run preview`

No test framework is configured.

## Architecture

Interactive slideshow presentation ("Our 2025 Wrapped") — a Valentine's Day experience built with React 19, Vite 7, Framer Motion, and Tailwind CSS 4.

### Data flow

```
slideData.js (slide config array)
  → StoryShell (navigation, timers, gestures, audio)
    → SlideRenderer (dispatches by slide type)
      → Slide component (IntroSlide, StatSlide, AlbumStackSlide, etc.)
        → MorphBlobs (animated SVG background blobs)
        → CountUpNumber / ValentineProposal / etc.
```

### Key files

- **`src/slides/slideData.js`** — Single source of truth for all slide content. Each slide has a `type`, gradient, music track, and type-specific fields (photos, captions, numbers, lines). Edit this file to customize the presentation.
- **`src/components/StoryShell.jsx`** — Navigation controller. Manages current slide index, 15s auto-advance timer, tap zones (left 30% = prev, right 70% = next), swipe/drag gestures, hold-to-pause, and per-slide music switching.
- **`src/slides/SlideRenderer.jsx`** — Contains all slide components and a type→component map. Seven slide types: `intro`, `stat`, `albumStack`, `message`, `dateReveal`, `transition`, `proposal`.
- **`src/components/AudioManager.jsx`** — Context-based audio system. Music only starts after first user interaction (browser autoplay policy). Provides fade-in/out track switching, synthesized whoosh/pop SFX via Web Audio API, and a mute toggle.
- **`src/components/MorphBlobs.jsx`** — Spotify Wrapped-style morphing SVG blob backgrounds, seeded per slide index.
- **`src/components/ValentineProposal.jsx`** — Final interactive slide with Yes/No buttons, growing YES button, confetti, and animated emoji states.

### Slide types

| Type | Purpose | Key fields |
|------|---------|------------|
| `intro` | Video background + title | `video`, `topLabel`, `bigText`, `subtitle` |
| `stat` | Animated counter | `topLabel`, `number`, `suffix`, `bottomLabel`, `emoji` |
| `albumStack` | 4-photo stack with tap-to-grid gallery | `photos[]`, `caption`, `subcaption` |
| `message` | Staggered text lines | `lines[]`, optional `bgPhoto` |
| `dateReveal` | Dates with strikethrough animation | `intro`, `dates[{text, struck}]` |
| `transition` | Large text + pulsing heart | `lines[]` |
| `proposal` | Interactive Valentine proposal | (no config fields) |

All slides share: `gradient` (CSS linear-gradient), `music` (audio file path), optional `musicStart` (seconds offset).

### Audio behavior

Audio requires a user interaction before it can play (browser policy). The `AudioManager` listens for the first `pointerdown`, then resumes `AudioContext` and begins playback. The `StoryShell` music effect depends on `audio?.started` to replay the current track once audio is unlocked.

### Styling

Tailwind CSS 4 via Vite plugin (no tailwind.config — uses `@import "tailwindcss"` in `index.css`). Google Fonts: Outfit. Global styles enforce `100dvh` viewport, dark background, and disabled tap highlight.
