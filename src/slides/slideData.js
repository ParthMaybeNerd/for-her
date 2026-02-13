/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  slideData.js — Edit this file to personalise your Wrapped  ║
  ║                                                              ║
  ║  Change numbers, messages, photos, and gradients here.      ║
  ║  Everything else updates automatically.                      ║
  ╚══════════════════════════════════════════════════════════════╝
*/

const slides = [
  // ───────────── 1. INTRO (video background) ─────────────
  {
    type: "intro",
    gradient: "linear-gradient(135deg, #1DB954 0%, #121212 50%, #1DB954 100%)",
    video: "/videos/intro.mp4",
    topLabel: "Our 2025",
    bigText: "Wrapped",
    subtitle: "Every little moment with you deserves a rewind.",
    music: "/music/ishqa-ve.mp3",
    musicStart: 7,
  },

  // ───────────── 2. ALBUM STACK: Us together ─────────────
  {
    type: "albumStack",
    gradient: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)",
    photos: [
      "/photos/IMG_2462.jpeg",
      "/photos/IMG_2302.jpeg",
      "/photos/IMG_0299.jpeg",
      "/photos/IMG_2461.jpeg",
    ],
    caption: "To the person who became my whole world",
    subcaption: "this year, next year, and every year after.",
    music: "/music/for-a-reason.mp3",
    musicStart: 132,
  },

  // ───────────── 3. DATE REVEAL: It all started ─────────────
  {
    type: "dateReveal",
    gradient: "linear-gradient(135deg, #FF416C 0%, #FF9A44 50%, #FFD700 100%)",
    intro: "It all started...",
    dates: [
      { text: "12th August 2024", struck: true },
      { text: "17th December", struck: true },
      { text: "18th December 😂", struck: false },
    ],
    music: "/music/pehli-nazar-mein.mp3",
    musicStart: 112,
  },

  // ───────────── 4. STAT: Days together (Aug 12 → Feb 12) ─────────────
  {
    type: "stat",
    gradient: "linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)",
    topLabel: "We've been 'us' for",
    number: 549,
    suffix: " days",
    bottomLabel: "and counting...",
    bottomLabelAppend: " par officially 57 days hehe",
    emoji: "💕",
    music: "/music/rang-sharbaton-ka.mp3",
  },

  // ───────────── 5. ALBUM STACK: Her moments ─────────────
  {
    type: "albumStack",
    gradient: "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)",
    photos: [
      "/photos/IMG_1092.jpeg",
      "/photos/IMG_0894.jpeg",
      "/photos/IMG_0382.jpeg",
      "/photos/IMG_0723.jpeg",
    ],
    caption: "but you became #1 on my priority list",
    subcaption: "since the day we made best-friends 🤍",
    music: "/music/masakali.mp3",
    musicStart: 176,
  },

  // ───────────── 6. STAT: Reels sent ─────────────
  {
    type: "stat",
    gradient: "linear-gradient(135deg, #7F00FF 0%, #E100FF 50%, #00D2FF 100%)",
    topLabel: "We've sent each other",
    number: 47832,
    suffix: "+",
    bottomLabel: "reels... basically our love language 😂",
    emoji: "📱",
    music: "/music/softly.mp3",
    musicStart: 130,
  },

  // ───────────── 7. MESSAGE: sweet Hinglish ─────────────
  {
    type: "message",
    gradient: "linear-gradient(135deg, #FF6B95 0%, #C471ED 50%, #8E44AD 100%)",
    lines: [
      "Meri choti si duniya,",
      "tere bina adhoori hai",
      "aur tere saath poori se bhi zyada ❤️",
    ],
    bgPhoto: "/photos/IMG_0291.jpeg",
    music: "/music/tujh-mein-rab.mp3",
    musicStart: 30,
  },

  // ───────────── 8. STAT: FaceTime ─────────────
  {
    type: "stat",
    gradient: "linear-gradient(135deg, #11998E 0%, #38EF7D 100%)",
    topLabel: "Hours on FaceTime",
    number: 312,
    suffix: " hrs",
    bottomLabel: "teri awaaz sun ke hi toh din poora hota hai 🤍",
    emoji: "📞",
    music: "/music/boyfriend.mp3",
    musicStart: 109,
  },

  // ───────────── 9. ALBUM STACK: Late night rides ─────────────
  {
    type: "albumStack",
    gradient: "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)",
    photos: [
      "/photos/IMG_2346.jpeg",
      "/photos/IMG_2482.jpeg",
      "/photos/IMG_0212.jpeg",
      "/photos/IMG_0691.jpeg",
    ],
    caption: "Tere saath late night rides",
    subcaption: "where the world sleeps but we don't 🌙",
    music: "/music/tum-ho-toh.mp3",
    musicStart: 57,
  },

  // ───────────── 10. MESSAGE: Jannat ─────────────
  {
    type: "message",
    gradient: "linear-gradient(135deg, #F7971E 0%, #FF5858 50%, #D63031 100%)",
    lines: [
      "Tu hi toh Jannat meri,",
      "tu hi mera sukoon hai,",
      "aur tujhme hi mera ghar hai 🤍",
    ],
    music: "/music/mere-bina.mp3",
    musicStart: 39,
  },

  // ───────────── 11. STAT: Smiles ─────────────
  {
    type: "stat",
    gradient: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 50%, #1A1A2E 100%)",
    topLabel: "Times you made me smile",
    number: 9999,
    suffix: "+",
    bottomLabel: "...and I stopped counting after that",
    emoji: "😄",
    music: "/music/dil-ka-jo-haal.mp3",
    musicStart: 250,
  },

  // ───────────── 12. ALBUM STACK: Night out ─────────────
  {
    type: "albumStack",
    gradient: "linear-gradient(135deg, #200122 0%, #6F0000 100%)",
    photos: [
      "/photos/IMG_2380.jpeg",
      "/photos/IMG_0725.jpeg",
      "/photos/IMG_0726.jpeg",
      "/photos/IMG_1093.jpeg",
    ],
    caption: "Our late night archives",
    subcaption: "waffles, endless laughs, and just... us.",
    music: "/music/with-you.mp3",
    musicStart: 86,
  },

  // ───────────── 13. TRANSITION ─────────────
  {
    type: "transition",
    gradient: "linear-gradient(135deg, #FF758C 0%, #FF7EB3 50%, #FF758C 100%)",
    lines: [
      "After everything we've been through...",
      "I just have one little question.",
    ],
    music: "/music/gehra-hua.mp3",
    musicStart: 178,
  },

  // ───────────── 14. PROPOSAL (final) ─────────────
  {
    type: "proposal",
    gradient: "linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 50%, #FFF0F5 100%)",
    music: "/music/chammak-challo.mp3",
    musicStart: 38,
    yesMusic: "/music/banni-sa.mp3",
    yesMusicStart: 266,
  },
];

export default slides;
