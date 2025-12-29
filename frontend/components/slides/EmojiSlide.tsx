"use client";

import { motion } from "framer-motion";
import { Smile } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { CountUp } from "@/components/ui/CountUp";
import { TapHint } from "@/components/ui/NavigationUI";
import type { Slide5Data } from "@/lib/api";

interface EmojiSlideProps {
  data: Slide5Data;
}

export function EmojiSlide({ data }: EmojiSlideProps) {
  const topEmoji = data.top_emojis[0]?.emoji || "😊";

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(255, 0, 110)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="255, 0, 110"
      secondColor="131, 56, 236"
      thirdColor="58, 134, 255"
      fourthColor="255, 100, 150"
      fifthColor="200, 50, 255"
      containerClassName="!h-screen !w-screen"
      interactive={false}
    >
      <div className="flex flex-col items-center justify-center text-center h-full w-full px-6 py-8">
        {/* Label */}
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Smile className="w-4 h-4" />
          <span className="text-xs uppercase tracking-[0.2em]">Signature Emoji</span>
        </motion.div>

        {/* Big Emoji - no floating background */}
        <motion.div
          className="text-[8rem] md:text-[12rem] leading-none"
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
        >
          {topEmoji}
        </motion.div>

        {/* Usage count - big text, no card */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <CountUp
            value={data.top_emojis[0]?.count || 0}
            className="text-5xl md:text-6xl font-black"
            delay={1}
          />
          <span className="text-xl opacity-60 ml-2">times</span>
        </motion.div>

        {/* Total emojis */}
        <motion.p
          className="text-lg opacity-50 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.3 }}
        >
          {data.total_emojis.toLocaleString()} emojis sent in total
        </motion.p>

        {/* Top emoji row - no cards */}
        <motion.div
          className="flex gap-8 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          {data.top_emojis.slice(1, 6).map((emoji, i) => (
            <motion.div
              key={emoji.emoji}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 1.7 + i * 0.1 }}
            >
              <span className="text-4xl">{emoji.emoji}</span>
              <span className="text-xs opacity-40">{emoji.count}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <TapHint />
    </BackgroundGradientAnimation>
  );
}
