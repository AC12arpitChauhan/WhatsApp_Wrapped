"use client";

import { motion } from "framer-motion";
import { Code, Terminal, FileCode, Cpu, Braces } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { CountUp } from "@/components/ui/CountUp";
import { TapHint } from "@/components/ui/NavigationUI";
import type { Slide7Data } from "@/lib/api";

interface CodeSlideProps {
  data: Slide7Data;
}

export function CodeSlide({ data }: CodeSlideProps) {
  // Only render if there's code-related content
  if (data.total_code_snippets === 0) {
    return (
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(17, 24, 39)"
        gradientBackgroundEnd="rgb(10, 10, 10)"
        firstColor="59, 130, 246"
        secondColor="16, 185, 129"
        thirdColor="139, 92, 246"
        fourthColor="50, 100, 200"
        fifthColor="100, 200, 150"
        containerClassName="!h-screen !w-screen"
        interactive={false}
      >
        <div className="flex flex-col items-center justify-center text-center h-full w-full px-4">
          <Terminal className="w-16 h-16 opacity-30 mb-4" />
          <h1 className="text-3xl font-bold opacity-50">No Code Detected</h1>
          <p className="text-caption mt-2">This group keeps things casual</p>
        </div>
        <TapHint />
      </BackgroundGradientAnimation>
    );
  }

  const getGeekLevel = () => {
    if (data.geek_energy_score >= 0.7) return { text: "Maximum Geek", desc: "Your group runs on code and coffee" };
    if (data.geek_energy_score >= 0.4) return { text: "Tech Enthusiasts", desc: "Code is part of the conversation" };
    return { text: "Casual Coders", desc: "Some technical discussions spotted" };
  };

  const geekLevel = getGeekLevel();

  // Get top coders
  const topCoders = data.coders?.slice(0, 3) || [];

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(17, 24, 39)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="59, 130, 246"
      secondColor="16, 185, 129"
      thirdColor="139, 92, 246"
      fourthColor="50, 100, 200"
      fifthColor="100, 200, 150"
      containerClassName="!h-screen !w-screen"
      interactive={false}
    >
      <div className="flex flex-col items-center justify-center text-center h-full w-full px-4 py-8">
        {/* Label */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Code className="w-5 h-5" />
          <span className="text-label">Geek Energy Detected</span>
        </motion.div>

        {/* Terminal icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <Terminal className="w-20 h-20 text-green-400 mb-4" strokeWidth={1.5} />
        </motion.div>

        {/* Geek Level */}
        <motion.h1
          className="text-3xl md:text-5xl font-black mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {geekLevel.text}
        </motion.h1>

        <motion.p
          className="text-caption mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.9 }}
        >
          {geekLevel.desc}
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="glass-card-sm flex flex-col items-center gap-2 px-6 py-4">
            <FileCode className="w-6 h-6 text-blue-400" />
            <CountUp value={data.total_code_snippets} className="text-2xl font-bold" delay={1.2} />
            <span className="text-xs opacity-50">code snippets</span>
          </div>
          {data.dominant_language && (
            <div className="glass-card-sm flex flex-col items-center gap-2 px-6 py-4">
              <Braces className="w-6 h-6 text-green-400" />
              <span className="text-xl font-bold">{data.dominant_language}</span>
              <span className="text-xs opacity-50">top language</span>
            </div>
          )}
        </motion.div>

        {/* Top coders */}
        {topCoders.length > 0 && (
          <motion.div
            className="space-y-2 w-full max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <p className="text-xs opacity-50 uppercase tracking-wider mb-2">Top Coders</p>
            {topCoders.map((coder, i) => (
              <motion.div
                key={coder.name}
                className="glass-card-sm flex items-center gap-3 py-2 px-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }}
              >
                <Cpu className="w-5 h-5 text-purple-400" />
                <span className="flex-1 text-left font-medium">{coder.name}</span>
                <span className="text-sm opacity-60">{coder.code_snippets} snippets</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <TapHint />
    </BackgroundGradientAnimation>
  );
}
