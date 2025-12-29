"use client";

import { motion } from "framer-motion";
import { Sun, CloudSun, Cloud, CloudRain, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { TapHint } from "@/components/ui/NavigationUI";
import type { Slide8Data } from "@/lib/api";

interface VibeSlideProps {
  data: Slide8Data;
}

export function VibeSlide({ data }: VibeSlideProps) {
  const getVibeInfo = () => {
    const sentiment = data.average_sentiment;
    if (sentiment >= 0.2) {
      return {
        icon: <Sun className="w-20 h-20 text-yellow-300" strokeWidth={1.5} />,
        title: "Radiating Positivity",
        description: "Conversations filled with good vibes and positive energy",
        color: "text-yellow-300",
      };
    } else if (sentiment >= 0.05) {
      return {
        icon: <CloudSun className="w-20 h-20 text-orange-300" strokeWidth={1.5} />,
        title: "Balanced Energy",
        description: "A healthy mix of emotions, keeping things real",
        color: "text-orange-300",
      };
    } else if (sentiment >= -0.05) {
      return {
        icon: <Cloud className="w-20 h-20 text-gray-300" strokeWidth={1.5} />,
        title: "Keeping It Neutral",
        description: "The calm in the storm, steady and thoughtful",
        color: "text-gray-300",
      };
    } else if (sentiment >= -0.2) {
      return {
        icon: <Cloud className="w-20 h-20 text-blue-300" strokeWidth={1.5} />,
        title: "A Few Cloudy Days",
        description: "Some ups and downs, that's what makes it real",
        color: "text-blue-300",
      };
    } else {
      return {
        icon: <CloudRain className="w-20 h-20 text-indigo-300" strokeWidth={1.5} />,
        title: "Going Through It",
        description: "Deep feelings, the group was there for tough times",
        color: "text-indigo-300",
      };
    }
  };

  const vibeInfo = getVibeInfo();

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(6, 214, 160)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="6, 214, 160"
      secondColor="27, 154, 170"
      thirdColor="6, 102, 140"
      fourthColor="50, 200, 150"
      fifthColor="100, 180, 160"
      containerClassName="!h-screen !w-screen"
      interactive={false}
    >
      <div className="flex flex-col items-center justify-center text-center h-full w-full px-6 py-8">
        {/* Label */}
        <motion.p
          className="text-xs uppercase tracking-[0.2em] opacity-50 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Chat Vibe
        </motion.p>

        {/* Vibe Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
        >
          {vibeInfo.icon}
        </motion.div>

        {/* Vibe Title - Big */}
        <motion.h1
          className={`text-4xl md:text-6xl font-black mt-4 mb-3 ${vibeInfo.color}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {vibeInfo.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-lg opacity-60 max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {vibeInfo.description}
        </motion.p>

        {/* Stats Row - no heavy cards */}
        <motion.div
          className="flex gap-8 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <div className="text-left">
              <p className="text-xs opacity-50">Happiest</p>
              <p className="font-bold">{data.happiest_month}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <div className="text-left">
              <p className="text-xs opacity-50">Most intense</p>
              <p className="font-bold">{data.most_intense_month}</p>
            </div>
          </div>
        </motion.div>

        {/* Sentiment Score */}
        <motion.div
          className="mt-8 flex items-center gap-2 opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5 }}
        >
          {data.average_sentiment >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm">
            Sentiment: {(data.average_sentiment * 100).toFixed(0)}%
          </span>
        </motion.div>
      </div>

      <TapHint />
    </BackgroundGradientAnimation>
  );
}
