import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useAudioManager } from "./AudioManager";
import slides from "../slides/slideData";
import SlideRenderer from "../slides/SlideRenderer";

const AUTO_ADVANCE_MS = 20000;

export default function StoryShell() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const audio = useAudioManager();

  const total = slides.length;
  const isProposal = slides[current].type === "proposal";

  /* ── Navigation ──────────────────────────────────────────── */
  const goNext = useCallback(() => {
    setCurrent((c) => {
      const next = Math.min(c + 1, total - 1);
      if (next !== c) audio?.playTransition();
      return next;
    });
  }, [total, audio]);

  const goPrev = useCallback(() => {
    setCurrent((c) => {
      const prev = Math.max(c - 1, 0);
      if (prev !== c) audio?.playTransition();
      return prev;
    });
  }, [audio]);

  /* ── Per-slide music ────────────────────────────────────── */
  useEffect(() => {
    const { music, musicStart } = slides[current];
    if (music) audio?.playTrack(music, musicStart || 0);
  }, [current, audio, audio?.started]);

  /* ── Auto-advance timer ──────────────────────────────────── */
  useEffect(() => {
    if (isProposal || isPaused) return;

    timerRef.current = setTimeout(() => {
      goNext();
    }, AUTO_ADVANCE_MS);

    return () => clearTimeout(timerRef.current);
  }, [current, isPaused, isProposal, goNext]);

  /* ── Tap zones ───────────────────────────────────────────── */
  const handleTap = (e) => {
    if (isProposal) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;

    if (pct < 0.3) {
      goPrev();
    } else {
      goNext();
    }
  };

  /* ── Hold to pause ───────────────────────────────────────── */
  const handlePointerDown = () => {
    if (!isProposal) setIsPaused(true);
  };
  const handlePointerUp = () => {
    if (!isProposal) setIsPaused(false);
  };

  /* ── Swipe via drag ──────────────────────────────────────── */
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-120, 0, 120], [0.5, 1, 0.5]);

  const handleDragEnd = (_e, info) => {
    if (isProposal) return;
    if (info.offset.x < -50) goNext();
    else if (info.offset.x > 50) goPrev();
  };

  return (
    <div className="relative w-screen h-dvh overflow-hidden select-none">
      {/* ── Background gradient ─────────────────────────────── */}
      <motion.div
        key={current}
        className="absolute inset-0 transition-none"
        style={{ background: slides[current].gradient }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* ── Progress bars ───────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 px-3 pt-3">
        {slides.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
          >
            {i < current ? (
              <div className="h-full w-full rounded-full bg-white" />
            ) : i === current && !isProposal ? (
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: isPaused ? undefined : "100%" }}
                transition={{
                  duration: AUTO_ADVANCE_MS / 1000,
                  ease: "linear",
                }}
              />
            ) : i === current && isProposal ? (
              <div className="h-full w-full rounded-full bg-white" />
            ) : null}
          </div>
        ))}
      </div>

      {/* ── Slide content (draggable) ───────────────────────── */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ opacity: dragOpacity }}
        drag={isProposal ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        onClick={handleTap}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {slides.map((slide, i) => (
          <SlideRenderer
            key={i}
            slide={slide}
            index={i}
            isActive={i === current}
            onOverlayChange={setIsPaused}
          />
        ))}
      </motion.div>
    </div>
  );
}
