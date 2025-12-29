"use client";

import { motion } from "framer-motion";
import { Crown, Award, TrendingUp, Heart } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { CountUp } from "@/components/ui/CountUp";
import { TapHint } from "@/components/ui/NavigationUI";
import type { Slide4Data, Slide3Data } from "@/lib/api";

interface CarrierSlideProps {
  data: Slide4Data;
  personalities: Slide3Data;
}

const MVP_DESCRIPTIONS = [
  "They bring the group to life.",
  "This group listens when they speak.",
  "The heartbeat of every conversation.",
  "Without them, the chat would be silent.",
  "They keep the energy going.",
];

export function CarrierSlide({ data, personalities }: CarrierSlideProps) {
  const topPerson = personalities.personalities[0];
  const runners = data.contributors.slice(1, 5);
  const mvp = data.contributors[0];
  
  // Pick a random description
  const descIndex = Math.abs(data.top_contributor.charCodeAt(0)) % MVP_DESCRIPTIONS.length;
  const mvpDesc = MVP_DESCRIPTIONS[descIndex];

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(247, 37, 133)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="247, 37, 133"
      secondColor="255, 107, 53"
      thirdColor="255, 214, 10"
      fourthColor="200, 50, 100"
      fifthColor="255, 150, 50"
      containerClassName="!h-screen !w-screen"
      interactive={false}
    >
      <div className="flex flex-col items-center justify-center text-center h-full w-full px-6 py-8">
        {/* Label */}
        <motion.p
          className="text-xs uppercase tracking-[0.2em] opacity-50 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Group MVP
        </motion.p>

        {/* Crown */}
        <motion.div
          className="mb-2"
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <Crown className="w-12 h-12 text-yellow-400" strokeWidth={1.5} />
        </motion.div>

        {/* MVP Name */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        >
          {data.top_contributor}
        </motion.h1>

        {/* Mindful description */}
        <motion.p
          className="text-lg opacity-70 italic mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.9 }}
        >
          {mvpDesc}
        </motion.p>

        {/* MVP Stats */}
        <motion.div
          className="flex items-center gap-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="text-center">
            <CountUp value={mvp?.messages || 0} className="text-2xl font-bold" delay={1.2} />
            <p className="text-xs opacity-50">messages</p>
          </div>
          <div className="text-center">
            <CountUp value={Math.round(mvp?.percentage || 0)} className="text-2xl font-bold" delay={1.3} suffix="%" />
            <p className="text-xs opacity-50">of total</p>
          </div>
        </motion.div>

        {/* Runners up */}
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="space-y-2">
            {runners.map((contributor, index) => (
              <motion.div
                key={contributor.name}
                className="flex items-center gap-3 py-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.7, x: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
              >
                <span className="text-2xl font-black opacity-30 w-8">{index + 2}</span>
                <div className="flex-1 text-left">
                  <p className="font-medium">{contributor.name}</p>
                </div>
                <span className="text-sm opacity-50">{contributor.messages.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <TapHint />
    </BackgroundGradientAnimation>
  );
}
