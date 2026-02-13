import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";
import { useAudioManager } from "./AudioManager";

/* ── Animated heart characters (replaces external GIFs) ──────── */

function AskingHeart() {
  return (
    <motion.div className="relative w-64 h-64 flex items-center justify-center">
      {/* Glow ring */}
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,107,149,0.3) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Main heart */}
      <motion.div
        className="text-[120px] leading-none"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        🥺
      </motion.div>
      {/* Floating mini hearts */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-400"
          style={{ left: `${20 + i * 15}%`, top: `${10 + (i % 3) * 20}%` }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 1.5 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        >
          <Heart size={14 + i * 2} fill="currentColor" />
        </motion.div>
      ))}
    </motion.div>
  );
}

function SadHeart() {
  return (
    <motion.div className="relative w-64 h-64 flex items-center justify-center">
      {/* Shake container */}
      <motion.div
        className="text-[120px] leading-none"
        key="sad"
        initial={{ rotate: 0 }}
        animate={{
          rotate: [-3, 3, -3, 3, 0],
          y: [0, -5, 0],
        }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
      >
        😢
      </motion.div>
      {/* Falling tear drops */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-300 text-2xl"
          style={{ left: `${30 + i * 20}%` }}
          initial={{ y: "40%", opacity: 0 }}
          animate={{ y: "90%", opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeIn",
          }}
        >
          💧
        </motion.div>
      ))}
      {/* Broken hearts floating away */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`bh-${i}`}
          className="absolute text-pink-300"
          style={{ left: `${15 + i * 22}%`, top: "20%" }}
          animate={{
            y: [-10, -40],
            opacity: [0.6, 0],
            rotate: [0, i % 2 === 0 ? 30 : -30],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeOut",
          }}
        >
          <Heart size={12} fill="currentColor" />
        </motion.div>
      ))}
    </motion.div>
  );
}

function CelebrationHeart() {
  return (
    <motion.div className="relative w-72 h-72 flex items-center justify-center">
      {/* Big pulsing glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,107,149,0.4) 0%, rgba(255,192,203,0.1) 50%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Main emoji */}
      <motion.div
        className="text-[130px] leading-none"
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        🥰
      </motion.div>
      {/* Orbiting hearts */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 110;
        return (
          <motion.div
            key={i}
            className="absolute text-pink-500"
            animate={{
              x: [Math.cos(angle) * radius, Math.cos(angle + Math.PI * 2) * radius],
              y: [Math.sin(angle) * radius, Math.sin(angle + Math.PI * 2) * radius],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          >
            <Heart size={16 + (i % 3) * 4} fill="currentColor" />
          </motion.div>
        );
      })}
      {/* Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`sp-${i}`}
          className="absolute text-yellow-300 text-lg"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          ✨
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ── Main proposal component ─────────────────────────────────── */

export default function ValentineProposal({ slide }) {
  const [yesPressed, setYesPressed] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const audio = useAudioManager();

  const phrases = [
    "No",
    "Are you sure? 🥺",
    "Really sure??",
    "Think again! 🌸",
    "Last chance! ✨",
    "Surely not?",
    "You might regret this! 🧸",
    "Give it another thought!",
    "Are you absolutely certain?",
    "This could be a mistake!",
    "Have a heart! ❤️",
    "Don't be so cold!",
    "Change of heart?",
    "Wouldn't you reconsider?",
    "Is that your final answer?",
    "You're breaking my heart ;(",
  ];

  const yesButtonSize = noCount * 20 + 16;

  const handleNoClick = () => setNoCount(noCount + 1);

  const handleYesClick = () => {
    setYesPressed(true);
    // Switch to the celebration track
    if (slide?.yesMusic) {
      audio?.playTrack(slide.yesMusic, slide.yesMusicStart || 0);
    }
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    // Notify via email
    window.open("mailto:parthpandhe8@gmail.com?subject=She%20said%20YES!%20%E2%9D%A4%EF%B8%8F&body=She%20clicked%20Yes!", "_self");

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-400"
            initial={{ y: "100vh", x: `${Math.random() * 100}%` }}
            animate={{ y: "-20vh" }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          >
            <Heart size={Math.random() * 20 + 16} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="z-10 text-center max-w-lg">
        {yesPressed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <CelebrationHeart />
            <h1 className="text-5xl font-extrabold text-pink-600 drop-shadow-sm">
              Yay! See you on the 14th! ❤️
            </h1>
            <p className="text-xl text-pink-400 font-medium italic">
              I knew you'd say yes!
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <motion.div key={noCount} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              {noCount > 0 ? <SadHeart /> : <AskingHeart />}
            </motion.div>

            <h1 className="text-4xl font-bold text-pink-700 leading-tight">
              Will you be my Valentine? 🌹
            </h1>

            <div className="flex flex-wrap justify-center gap-6 items-center w-full min-h-[150px]">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-black py-2 px-6 rounded-full shadow-[0_10px_0_0_#15803d] transition-all active:shadow-none active:translate-y-2"
                style={{ fontSize: Math.min(yesButtonSize, 120) }}
                onClick={handleYesClick}
              >
                YES!
              </button>

              {noCount < phrases.length && (
                <button
                  onClick={handleNoClick}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-[0_6px_0_0_#b91c1c] active:shadow-none active:translate-y-1 transition-all text-lg"
                >
                  {phrases[Math.min(noCount, phrases.length - 1)]}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
