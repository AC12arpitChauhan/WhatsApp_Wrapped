"use client";

import { motion } from "framer-motion";

interface SparkleProps {
  className?: string;
}

function Star({ size = 20, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.3, 1, 0.3],
        scale: [0.8, 1.2, 0.8],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill="white"
      />
    </motion.svg>
  );
}

function SmallStar({ size = 12, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.2, 0.6, 0.2],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <circle cx="12" cy="12" r="3" fill="white" />
    </motion.svg>
  );
}

export function SparkleDecoration({ className = "" }: SparkleProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Top left cluster */}
      <div className="absolute top-[15%] left-[10%]">
        <Star size={24} delay={0} />
      </div>
      <div className="absolute top-[12%] left-[15%]">
        <SmallStar size={8} delay={0.5} />
      </div>
      <div className="absolute top-[18%] left-[8%]">
        <SmallStar size={6} delay={0.8} />
      </div>

      {/* Top right cluster */}
      <div className="absolute top-[10%] right-[12%]">
        <Star size={20} delay={0.3} />
      </div>
      <div className="absolute top-[8%] right-[18%]">
        <SmallStar size={8} delay={0.7} />
      </div>

      {/* Bottom left */}
      <div className="absolute bottom-[20%] left-[8%]">
        <Star size={18} delay={0.5} />
      </div>
      <div className="absolute bottom-[25%] left-[12%]">
        <SmallStar size={6} delay={1} />
      </div>

      {/* Bottom right */}
      <div className="absolute bottom-[15%] right-[10%]">
        <Star size={22} delay={0.2} />
      </div>
      <div className="absolute bottom-[20%] right-[15%]">
        <SmallStar size={8} delay={0.6} />
      </div>
    </div>
  );
}
