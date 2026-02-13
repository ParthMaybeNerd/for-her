import { useMemo } from "react";
import { motion } from "framer-motion";

/*
  MorphBlobs — Spotify Wrapped-style morphing blob backgrounds.

  Uses CSS border-radius blobs instead of SVG path morphing for
  better mobile GPU performance. Each blob is a div with animated
  border-radius, position, and scale — all GPU-compositable properties.
*/

// ── Gradient color palettes (matched to slide moods) ────────────
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

// Border-radius keyframes for organic blob shapes
const BLOB_RADII = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "30% 60% 70% 40% / 50% 60% 30% 60%",
  "40% 60% 50% 50% / 35% 50% 65% 50%",
  "70% 30% 50% 50% / 30% 50% 70% 60%",
];

export default function MorphBlobs({ slideIndex = 0, gradient = "" }) {
  const palette = PALETTES[paletteForSlide(gradient)] || PALETTES.default;

  const blobs = useMemo(() => {
    const rand = seededRandom(slideIndex * 137 + 42);
    return Array.from({ length: 3 }, (_, i) => {
      const colors = palette[i % palette.length];
      return {
        id: i,
        colors,
        size: 50 + rand() * 30, // 50-80% of container
        x: rand() * 60 - 30,
        y: rand() * 60 - 30,
        driftX: rand() * 30 - 15,
        driftY: rand() * 30 - 15,
        duration: rand() * 6 + 10, // 10-16s
        radiusStart: BLOB_RADII[i % BLOB_RADII.length],
        radiusMid: BLOB_RADII[(i + 1) % BLOB_RADII.length],
        radiusEnd: BLOB_RADII[(i + 2) % BLOB_RADII.length],
      };
    });
  }, [slideIndex, palette]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {blobs.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{
            width: `${b.size}%`,
            height: `${b.size}%`,
            left: `${50 - b.size / 2}%`,
            top: `${50 - b.size / 2}%`,
            background: `linear-gradient(135deg, ${b.colors[0]}, ${b.colors[1]})`,
            opacity: 0.5,
            filter: "blur(40px)",
            willChange: "transform, border-radius",
          }}
          animate={{
            x: [b.x, b.x + b.driftX, b.x - b.driftX * 0.5, b.x],
            y: [b.y, b.y - b.driftY, b.y + b.driftY * 0.6, b.y],
            scale: [1, 1.1, 0.95, 1],
            borderRadius: [b.radiusStart, b.radiusMid, b.radiusEnd, b.radiusStart],
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
