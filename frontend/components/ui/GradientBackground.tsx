"use client";

import { motion } from "framer-motion";

export type GradientTheme =
  | "intro"
  | "stats"
  | "time"
  | "carrier"
  | "emoji"
  | "sentiment"
  | "topics"
  | "final";

interface GradientBackgroundProps {
  theme: GradientTheme;
  children: React.ReactNode;
  className?: string;
}

export function GradientBackground({
  theme,
  children,
  className = "",
}: GradientBackgroundProps) {
  return (
    <motion.div
      className={`slide-container gradient-bg-${theme} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[150%] h-[150%] -top-1/4 -left-1/4"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.05, 0.98, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: "inherit",
            filter: "blur(0px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
