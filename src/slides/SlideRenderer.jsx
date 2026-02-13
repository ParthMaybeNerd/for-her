import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUpNumber from "../components/CountUpNumber";
import MorphBlobs from "../components/MorphBlobs";
import ValentineProposal from "../components/ValentineProposal";

/* ── Shared enter animation ─────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.5, ease: "easeOut" },
};

/* ── Intro slide (with video background) ─────────────────────── */
function IntroSlide({ slide, index }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-white text-center px-6 gap-4 relative overflow-hidden"
      {...fadeUp}
    >
      {/* Video background */}
      {slide.video && (
        <video
          src={slide.video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      {/* Dark overlay so text is readable */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      <MorphBlobs slideIndex={index} gradient={slide.gradient} />

      <motion.p
        className="text-lg font-semibold tracking-widest uppercase opacity-80 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.2 }}
      >
        {slide.topLabel}
      </motion.p>

      <motion.h1
        className="text-7xl sm:text-8xl font-black tracking-tight relative z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
      >
        {slide.bigText}
      </motion.h1>

      <motion.p
        className="text-base opacity-60 mt-2 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.8 }}
      >
        {slide.subtitle}
      </motion.p>

      <motion.p
        className="text-xs opacity-40 mt-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2 }}
      >
        Tap to continue &rarr;
      </motion.p>
    </motion.div>
  );
}

/* ── Stat slide ─────────────────────────────────────────────── */
function StatSlide({ slide, isActive, index }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-white text-center px-6 gap-3 relative overflow-hidden"
      {...fadeUp}
    >
      <MorphBlobs slideIndex={index} gradient={slide.gradient} />

      <motion.p
        className="text-sm font-semibold tracking-widest uppercase opacity-70 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.15 }}
      >
        {slide.topLabel}
      </motion.p>

      <motion.div
        className="text-7xl sm:text-8xl font-black relative z-10"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.25 }}
      >
        {isActive ? (
          <CountUpNumber target={slide.number} suffix={slide.suffix} />
        ) : (
          <span>
            {slide.number.toLocaleString()}
            {slide.suffix}
          </span>
        )}
      </motion.div>

      <motion.p
        className="text-lg opacity-70 mt-1 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {slide.bottomLabel}
        {slide.bottomLabelAppend && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.4 }}
          >
            {slide.bottomLabelAppend}
          </motion.span>
        )}
      </motion.p>

      <motion.span
        className="text-5xl mt-4 relative z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10, delay: 0.8 }}
      >
        {slide.emoji}
      </motion.span>
    </motion.div>
  );
}

/* ── Album stack slide (photos stacked like album covers) ───── */
const stackLayouts = [
  { rotate: -8, x: -30, y: 10, scale: 0.92 },
  { rotate: 5, x: 25, y: -15, scale: 0.95 },
  { rotate: -3, x: -10, y: -5, scale: 0.97 },
  { rotate: 0, x: 0, y: 0, scale: 1 },       // top card (front)
];

function AlbumStackSlide({ slide, index, onOverlayChange }) {
  // Shuffle photos on each mount so the stack order is random every visit
  const [photos] = useState(() => {
    const arr = [...(slide.photos || [])];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  // Auto-cycle: rotate which photo sits on top every 3s
  const [topIndex, setTopIndex] = useState(photos.length - 1);
  const [gridOpen, setGridOpen] = useState(false);
  const [viewingIndex, setViewingIndex] = useState(null);

  useEffect(() => {
    if (gridOpen) return; // pause cycling when gallery is open
    const interval = setInterval(() => {
      setTopIndex((prev) => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos.length, gridOpen]);

  const openGrid = (e) => {
    e.stopPropagation();
    setGridOpen(true);
    onOverlayChange?.(true);
  };

  const closeGrid = () => {
    setGridOpen(false);
    setViewingIndex(null);
    onOverlayChange?.(false);
  };

  const viewPhoto = (i) => setViewingIndex(i);
  const closeViewer = () => setViewingIndex(null);
  const prevPhoto = (e) => {
    e.stopPropagation();
    setViewingIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };
  const nextPhoto = (e) => {
    e.stopPropagation();
    setViewingIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-white text-center px-6 relative overflow-hidden"
      {...fadeUp}
    >
      <MorphBlobs slideIndex={index} gradient={slide.gradient} />

      {/* Album cover stack — floating effect, tap to open grid */}
      <motion.div
        className="relative z-10 w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] cursor-pointer"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        onClick={openGrid}
      >
        {photos.map((photo, i) => {
          const n = photos.length;
          const stackPos = (n - 1) - ((topIndex - i + n) % n);
          const layout = stackLayouts[stackPos] || stackLayouts[stackLayouts.length - 1];

          return (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl border-2 border-white/15"
              initial={false}
              animate={{
                opacity: 1,
                scale: layout.scale,
                rotate: layout.rotate,
                x: layout.x,
                y: layout.y,
                zIndex: stackPos,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 16,
              }}
            >
              <img
                src={photo}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tap hint
      <motion.p
        className="text-[11px] opacity-40 mt-3 z-10 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2 }}
      >
        tap photos to explore
      </motion.p> */}

      {/* Caption */}
      <motion.h2
        className="text-2xl sm:text-3xl font-black mt-4 drop-shadow-lg z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {slide.caption}
      </motion.h2>

      {slide.subcaption && (
        <motion.p
          className="text-base sm:text-lg opacity-70 mt-2 italic z-10 relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {slide.subcaption}
        </motion.p>
      )}

      {/* ── Photo Grid Overlay ── */}
      <AnimatePresence>
        {gridOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeGrid}
          >
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeGrid}
                className="text-white/70 hover:text-white text-3xl font-light transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Grid */}
            <div
              className="flex-1 flex items-center justify-center px-6 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {photos.map((photo, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.3, ease: "easeOut" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => viewPhoto(i)}
                  >
                    <img
                      src={photo}
                      alt=""
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fullscreen Photo Viewer ── */}
      <AnimatePresence>
        {viewingIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeViewer}
          >
            {/* Prev arrow */}
            <button
              onClick={prevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10 p-2 transition-colors"
            >
              &#8249;
            </button>

            {/* Photo */}
            <AnimatePresence mode="wait">
              <motion.img
                key={viewingIndex}
                src={photos[viewingIndex]}
                alt=""
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                draggable={false}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Next arrow */}
            <button
              onClick={nextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10 p-2 transition-colors"
            >
              &#8250;
            </button>

            {/* Close */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl font-light transition-colors"
            >
              &times;
            </button>

            {/* Counter */}
            <p className="absolute bottom-6 text-white/50 text-sm">
              {viewingIndex + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Message slide ──────────────────────────────────────────── */
function MessageSlide({ slide, index }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-white text-center px-8 gap-6 relative overflow-hidden"
      {...fadeUp}
    >
      <MorphBlobs slideIndex={index} gradient={slide.gradient} />

      {slide.bgPhoto && (
        <div className="absolute inset-0 z-[1]">
          <img
            src={slide.bgPhoto}
            alt=""
            className="w-full h-full object-cover opacity-15 blur-sm"
            draggable={false}
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-6">
        {slide.lines.map((line, i) => (
          <motion.p
            key={i}
            className="text-2xl sm:text-3xl font-bold leading-snug drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.5, duration: 0.5 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Date reveal slide (strikethrough sequence) ─────────────── */
const DATE_APPEAR = [1.0, 2.4, 3.8];
const DATE_STRIKE = [1.7, 3.1];

function DateRevealSlide({ slide, index }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-white text-center px-8 gap-6 relative overflow-hidden"
      {...fadeUp}
    >
      <MorphBlobs slideIndex={index} gradient={slide.gradient} />

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Intro line */}
        <motion.p
          className="text-2xl sm:text-3xl font-bold leading-snug drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {slide.intro}
        </motion.p>

        {/* Date lines with optional strikethrough */}
        {slide.dates.map((date, i) => (
          <motion.div
            key={i}
            className="relative inline-block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: DATE_APPEAR[i], duration: 0.45 }}
          >
            <span className="text-2xl sm:text-3xl font-bold leading-snug drop-shadow-lg">
              {date.text}
            </span>
            {date.struck && (
              <motion.div
                className="absolute left-0 right-0 bg-white/90 rounded-full pointer-events-none"
                style={{ top: "calc(50% - 2px)", height: "4px", originX: 0, rotate: -4 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: DATE_STRIKE[i], duration: 0.35, ease: "easeOut" }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Transition slide ───────────────────────────────────────── */
function TransitionSlide({ slide, index }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-white text-center px-8 gap-8 relative overflow-hidden"
      {...fadeUp}
    >
      <MorphBlobs slideIndex={index} gradient={slide.gradient} />

      {slide.lines.map((line, i) => (
        <motion.p
          key={i}
          className="text-3xl sm:text-4xl font-extrabold leading-snug drop-shadow-lg relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.7, duration: 0.6 }}
        >
          {line}
        </motion.p>
      ))}

      <motion.span
        className="text-6xl relative z-10"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        💗
      </motion.span>
    </motion.div>
  );
}

/* ── Proposal slide (final) ─────────────────────────────────── */
function ProposalSlide({ index, slide }) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <MorphBlobs slideIndex={index} gradient={slide.gradient} />
      <div className="relative z-10 w-full h-full">
        <ValentineProposal slide={slide} />
      </div>
    </div>
  );
}

/* ── Main renderer ──────────────────────────────────────────── */
const renderers = {
  intro: IntroSlide,
  stat: StatSlide,
  albumStack: AlbumStackSlide,
  message: MessageSlide,
  dateReveal: DateRevealSlide,
  transition: TransitionSlide,
  proposal: ProposalSlide,
};

export default function SlideRenderer({ slide, index, isActive, onOverlayChange }) {
  const Component = renderers[slide.type];
  if (!Component) return null;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Component slide={slide} isActive={isActive} index={index} onOverlayChange={onOverlayChange} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
