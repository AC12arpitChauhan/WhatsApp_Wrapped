"use client";

import { motion } from "framer-motion";
import { Hash, MessageSquare } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { TapHint } from "@/components/ui/NavigationUI";
import type { Slide9Data } from "@/lib/api";

interface TopicsSlideProps {
  data: Slide9Data;
}

export function TopicsSlide({ data }: TopicsSlideProps) {
  const topTopics = data.topics.slice(0, 4);

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(114, 9, 183)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="114, 9, 183"
      secondColor="247, 37, 133"
      thirdColor="67, 97, 238"
      fourthColor="150, 50, 200"
      fifthColor="200, 100, 255"
      containerClassName="!h-screen !w-screen"
      interactive={false}
    >
      <div className="flex flex-col items-center justify-center text-center h-full w-full px-6 py-8">
        {/* Label */}
        <motion.div
          className="flex items-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs uppercase tracking-[0.2em]">The Group Talked About</span>
        </motion.div>

        {/* Topics List - cards with minimal styling */}
        <div className="space-y-3 w-full max-w-md">
          {topTopics.map((topic, index) => (
            <motion.div
              key={topic.topic_id}
              className="glass-card-sm text-left py-4 px-5"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.15, type: "spring" }}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10">
                  <Hash className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold mb-1">{topic.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {topic.keywords.slice(0, 4).map((keyword, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full bg-white/10 opacity-70"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-3xl font-black opacity-20">
                  {index + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insight */}
        <motion.p
          className="text-xs opacity-40 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2 }}
        >
          Discovered using AI topic modeling
        </motion.p>
      </div>

      <TapHint />
    </BackgroundGradientAnimation>
  );
}
