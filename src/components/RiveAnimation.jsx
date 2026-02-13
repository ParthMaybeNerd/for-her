import { useState, useMemo } from "react";
import { useRive } from "@rive-app/react-canvas";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

/**
 * RiveAnimation — loads a .riv file if provided, otherwise renders a
 * framer-motion fallback (floating hearts / sparkles).
 *
 * To add your own Rive animations:
 *   1. Design them at https://rive.app (free account)
 *   2. Export the .riv file
 *   3. Drop it in public/rive/
 *   4. Pass the path: <RiveAnimation src="/rive/your-file.riv" />
 */
export default function RiveAnimation({
  src,
  stateMachine = "State Machine 1",
  fallback = "hearts", // "hearts" | "sparkles" | "none"
  className = "",
}) {
  // If src is provided, render the Rive-specific sub-component
  if (src) {
    return (
      <RivePlayer
        src={src}
        stateMachine={stateMachine}
        fallback={fallback}
        className={className}
      />
    );
  }

  // No src — go straight to fallback
  return <Fallback type={fallback} className={className} />;
}

/* ── Rive player (only mounted when src is provided) ─────────── */
function RivePlayer({ src, stateMachine, fallback, className }) {
  const [failed, setFailed] = useState(false);

  const { RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
    onLoadError: () => setFailed(true),
  });

  if (failed) {
    return <Fallback type={fallback} className={className} />;
  }

  return (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`}>
      {RiveComponent && <RiveComponent />}
    </div>
  );
}

/* ── Fallback selector ───────────────────────────────────────── */
function Fallback({ type, className = "" }) {
  if (type === "none") return null;
  if (type === "sparkles") return <SparklesFallback className={className} />;
  return <HeartsFallback className={className} />;
}

/* ── Floating hearts fallback ────────────────────────────────── */
function HeartsFallback({ className = "" }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 16 + 12,
        duration: Math.random() * 8 + 8,
        delay: Math.random() * 6,
        opacity: Math.random() * 0.3 + 0.1,
      })),
    []
  );

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
    >
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-white"
          style={{ left: `${h.x}%`, opacity: h.opacity }}
          initial={{ y: "110vh" }}
          animate={{ y: "-10vh" }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            ease: "linear",
            delay: h.delay,
          }}
        >
          <Heart size={h.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}

/* ── Sparkles fallback ───────────────────────────────────────── */
function SparklesFallback({ className = "" }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 3,
        duration: Math.random() * 2 + 1.5,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
    >
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
