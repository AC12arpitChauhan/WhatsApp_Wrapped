"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface TapHintProps {
  text?: string;
}

export function TapHint({ text = "Swipe to continue" }: TapHintProps) {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4, x: [0, 5, 0] }}
      transition={{ 
        opacity: { delay: 2, duration: 1 },
        x: { delay: 2.5, duration: 1.5, repeat: Infinity, repeatDelay: 2 }
      }}
    >
      <span className="text-sm">{text}</span>
      <ChevronRight className="w-4 h-4" />
    </motion.div>
  );
}

interface DotIndicatorsProps {
  total: number;
  current: number;
}

export function DotIndicators({ total, current }: DotIndicatorsProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current ? "w-6 bg-white" : "w-1.5 bg-white/30"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        />
      ))}
    </div>
  );
}

export function PrivacyBadge() {
  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 opacity-40 text-xs"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 0.4, y: 0 }}
      transition={{ delay: 1 }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
      </svg>
      <span>All processing happens locally</span>
    </motion.div>
  );
}
