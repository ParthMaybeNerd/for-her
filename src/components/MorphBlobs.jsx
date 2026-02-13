import { useMemo } from "react";
import { motion } from "framer-motion";

/*
  MorphBlobs — Spotify Wrapped-style blob backgrounds.

  Uses radial-gradient divs (no filter:blur!) that only animate
  transform properties (x, y, scale, rotate) — fully GPU-composited
  on mobile Safari & Chrome.
*/

const PALETTES = {
  green:   [["#1DB954", "#1ed760"], ["#14833c", "#1DB954"], ["#0a5a28", "#14833c"]],
  warm:    [["#FF416C", "#FF9A44"], ["#FFD700", "#FF6B6B"], ["#FF416C", "#FFD700"]],
  purple:  [["#7F00FF", "#E100FF"], ["#00D2FF", "#6C5CE7"], ["#A29BFE", "#7F00FF"]],
  pink:    [["#FF6B95", "#C471ED"], ["#FD79A8", "#E84393"], ["#F8A5C2", "#FF6B95"]],
  teal:    [["#11998E", "#38EF7D"], ["#00CEC9", "#0984E3"], ["#11998E", "#00CEC9"]],
  gold:    [["#F7971E", "#FFD200"], ["#FF5858", "#D63031"], ["#F7971E", "#FF5858"]],
  dark:    [["#302B63", "#24243E"], ["#0F0C29", "#302B63"], ["#6C5CE7", "#0F0C29"]],
  red:     [["#200122", "#6F0000"], ["#FF416C", "#200122"], ["#6F0000", "#FF416C"]],
  mauve:   [["#355C7D", "#C06C84"], ["#6C5B7B", "#F67280"], ["#C06C84", "#355C7D"]],
  rose:    [["#FF758C", "#FF7EB3"], ["#FFC3A0", "#FF758C"], ["#FF7EB3", "#FFC3A0"]],
  blush:   [["#FFF0F5", "#FFB6C1"], ["#FFE4EC", "#FFC0CB"], ["#FFB6C1", "#FFE4EC"]],
  default: [["#FF6B95", "#C471ED"], ["#00D2FF", "#6C5CE7"], ["#FFD700", "#FF416C"]],
};

function paletteForSlide(gradient) {
  if (!gradient) return "default";
  const g = gradient.toLowerCase();
  if (g.includes("1db954")) return "green";
  if (g.includes("ff416c") && g.includes("ffd700")) return "warm";
  if (g.includes("7f00ff") || g.includes("e100ff")) return "purple";
  if (g.includes("ff6b95") || g.includes("c471ed")) return "pink";
  if (g.includes("11998e") || g.includes("38ef7d")) return "teal";
  if (g.includes("f7971e") || g.includes("ffd200")) return "gold";
  if (g.includes("0f0c29") || g.includes("302b63")) return "dark";
  if (g.includes("200122") || g.includes("6f0000")) return "red";
  if (g.includes("355c7d") || g.includes("c06c84")) return "mauve";
  if (g.includes("ff758c") || g.includes("ff7eb3")) return "rose";
  if (g.includes("fff0f5") || g.includes("ffe4ec")) return "blush";
  return "default";
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function MorphBlobs({ slideIndex = 0, gradient = "" }) {
  const palette = PALETTES[paletteForSlide(gradient)] || PALETTES.default;

  const blobs = useMemo(() => {
    const rand = seededRandom(slideIndex * 137 + 42);
    return Array.from({ length: 3 }, (_, i) => {
      const colors = palette[i % palette.length];
      const size = 60 + rand() * 40; // 60-100% — larger since no blur to spread them
      return {
        id: i,
        colors,
        size,
        left: (rand() * 80 - 40),  // offset from center
        top: (rand() * 80 - 40),
        driftX: rand() * 25 - 12,
        driftY: rand() * 25 - 12,
        rotation: rand() * 60 - 30,
        duration: rand() * 6 + 12, // 12-18s (slower = cheaper)
      };
    });
  }, [slideIndex, palette]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {blobs.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            width: `${b.size}%`,
            height: `${b.size}%`,
            left: `${50 - b.size / 2}%`,
            top: `${50 - b.size / 2}%`,
            // Radial gradient with soft transparent edge = "pre-blurred" look
            // No filter:blur needed — zero paint cost
            background: `radial-gradient(circle at 40% 40%, ${b.colors[0]}88, ${b.colors[1]}44 60%, transparent 75%)`,
            willChange: "transform",
          }}
          // ONLY transform properties — fully GPU composited, no repaints
          animate={{
            x: [b.left, b.left + b.driftX, b.left - b.driftX * 0.5, b.left],
            y: [b.top, b.top - b.driftY, b.top + b.driftY * 0.6, b.top],
            scale: [1, 1.15, 0.9, 1],
            rotate: [b.rotation, b.rotation + 20, b.rotation - 15, b.rotation],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
