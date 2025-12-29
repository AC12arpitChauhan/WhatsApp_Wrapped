"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, MotionValue } from "framer-motion";

interface CountUpProps {
  value: number;
  className?: string;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toLocaleString();
}

export function CountUp({
  value,
  className = "",
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
}: CountUpProps) {
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) =>
    formatNumber(Math.round(current))
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      spring.set(value);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [spring, value, delay]);

  return (
    <motion.span
      className={`font-black ${className}`}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      }}
    >
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  );
}
