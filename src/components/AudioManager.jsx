import { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================================================================
   AudioManager — background music + transition sound effects
   ================================================================
   Drop your background music file at:  public/audio/bg-music.mp3
   (any format the browser supports: mp3, ogg, wav, m4a)

   The manager auto-starts music on the user's first tap/click
   (browsers block autoplay without interaction).
================================================================ */

const AudioContext_ = createContext(null);

export function useAudioManager() {
  return useContext(AudioContext_);
}

export function AudioProvider({ children }) {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const bgRef = useRef(null);
  const currentSrcRef = useRef(null);
  const webAudioCtx = useRef(null);

  // Lazy-init Web Audio for synth sounds
  const getAudioCtx = useCallback(() => {
    if (!webAudioCtx.current) {
      webAudioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return webAudioCtx.current;
  }, []);

  // Start audio system on first user interaction
  const startAudio = useCallback(() => {
    if (started) return;
    setStarted(true);
    getAudioCtx().resume?.();
  }, [started, getAudioCtx]);

  // Listen for first interaction
  useEffect(() => {
    const handler = () => startAudio();
    document.addEventListener("pointerdown", handler, { once: true });
    return () => document.removeEventListener("pointerdown", handler);
  }, [startAudio]);

  // Switch to a new track (called by StoryShell on slide change)
  // startTime = seconds into the song to begin playback
  const playTrack = useCallback((src, startTime = 0) => {
    if (!src || !started) return;
    // Skip if already playing this track
    if (currentSrcRef.current === src && bgRef.current && !bgRef.current.paused) return;

    // Stop current track immediately (mobile throttles setInterval fades)
    if (bgRef.current) {
      bgRef.current.pause();
      bgRef.current.src = "";
    }

    // Start new track
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.3;
    audio.muted = muted;
    if (startTime > 0) audio.currentTime = startTime;
    audio.play().catch(() => { /* file not found — silent fail */ });

    bgRef.current = audio;
    currentSrcRef.current = src;
  }, [started, muted]);

  // Mute / unmute
  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.muted = muted;
    }
  }, [muted]);

  // ── Transition whoosh sound (synthesized) ───────────────────
  const playTransition = useCallback(() => {
    if (muted) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      // White noise burst shaped into a whoosh
      const duration = 0.18;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter for a "whoosh" character
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + duration);
      filter.Q.value = 1.5;

      // Envelope
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start(now);
      noise.stop(now + duration);
    } catch {
      /* Web Audio not supported — silent fail */
    }
  }, [muted, getAudioCtx]);

  // ── Soft pop sound (for stat reveals) ───────────────────────
  const playPop = useCallback(() => {
    if (muted) return;
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      /* silent fail */
    }
  }, [muted, getAudioCtx]);

  const value = { muted, setMuted, playTransition, playPop, playTrack, started };

  return (
    <AudioContext_.Provider value={value}>
      {children}
      <MuteButton muted={muted} setMuted={setMuted} started={started} />
    </AudioContext_.Provider>
  );
}

/* ── Mute/unmute floating button ─────────────────────────────── */
function MuteButton({ muted, setMuted, started }) {
  if (!started) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      onClick={(e) => {
        e.stopPropagation();
        setMuted((m) => !m);
      }}
      className="fixed bottom-6 right-6 z-[100] w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
    >
      {muted ? (
        /* Muted icon */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        /* Playing icon */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </motion.button>
  );
}
