"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { SparkleDecoration } from "@/components/ui/SparkleDecoration";

interface IntroSlideProps {
  onStart: () => void;
}

export function IntroSlide({ onStart }: IntroSlideProps) {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(255, 107, 53)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="255, 107, 53"
      secondColor="247, 37, 133"
      thirdColor="114, 9, 183"
      fourthColor="255, 150, 100"
      fifthColor="200, 50, 150"
      containerClassName="!h-screen !w-screen"
      interactive={true}
    >
      <SparkleDecoration />

      <div className="flex flex-col items-center justify-center text-center h-full w-full px-4">
        {/* Main Title */}
        <motion.h1
          className="text-hero mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Your Year
          <br />
          <span className="opacity-90">in WhatsApp</span>
        </motion.h1>

        {/* CTA Button */}
        <motion.button
          onClick={onStart}
          className="glass-card px-8 py-4 text-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-5 h-5" />
          Let&apos;s begin
        </motion.button>

        {/* Privacy note */}
        <motion.p
          className="text-xs opacity-40 max-w-xs mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2 }}
        >
          All analysis runs locally. Your chats are never stored.
        </motion.p>
      </div>
    </BackgroundGradientAnimation>
  );
}
