"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface FloatingEmojiProps {
  emojis: string[];
  count?: number;
  className?: string;
}

export function FloatingEmoji({
  emojis,
  count = 8,
  className = "",
}: FloatingEmojiProps) {
  const floatingEmojis = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 3,
      size: 1.5 + Math.random() * 1.5,
    }));
  }, [emojis, count]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {floatingEmojis.map((item) => (
        <motion.div
          key={item.id}
          className="absolute emoji-float"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}rem`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0.15, 0.35, 0.15],
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
