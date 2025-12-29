"use client";

import { motion } from "framer-motion";
import { MessageCircle, FileText, Calendar, Image, Sparkles } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { CountUp } from "@/components/ui/CountUp";
import { TapHint } from "@/components/ui/NavigationUI";
import type { Slide1Data } from "@/lib/api";

interface BigPictureSlideProps {
  data: Slide1Data;
}

export function BigPictureSlide({ data }: BigPictureSlideProps) {
  const messagesPerDay = Math.round(data.total_messages / Math.max(data.active_days, 1));
  
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(67, 97, 238)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="67, 97, 238"
      secondColor="114, 9, 183"
      thirdColor="58, 12, 163"
      fourthColor="100, 100, 255"
      fifthColor="150, 50, 200"
      containerClassName="!h-screen !w-screen"
      interactive={false}
    >
      <div className="flex flex-col items-center justify-center text-center h-full w-full px-6">
        {/* Label */}
        <motion.p
          className="text-xs uppercase tracking-[0.2em] opacity-50 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Messages Sent
        </motion.p>

        {/* Big Number */}
        <CountUp
          value={data.total_messages}
          className="text-7xl md:text-9xl font-black"
          delay={0.4}
          duration={2}
        />

        {/* Mindful description */}
        <motion.p
          className="text-lg opacity-70 mt-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.2 }}
        >
          That's <span className="font-bold">{messagesPerDay}</span> messages a day!
        </motion.p>

        {/* Date range */}
        <motion.p
          className="text-sm opacity-40 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.4 }}
        >
          {data.date_range.start} — {data.date_range.end}
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <div className="flex flex-col items-center gap-1">
            <FileText className="w-5 h-5 opacity-50" />
            <CountUp
              value={data.total_words}
              className="text-2xl font-bold"
              delay={1.7}
              duration={1.5}
            />
            <p className="text-xs opacity-40">words</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Calendar className="w-5 h-5 opacity-50" />
            <CountUp
              value={data.active_days}
              className="text-2xl font-bold"
              delay={1.8}
              duration={1.5}
            />
            <p className="text-xs opacity-40">days</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Image className="w-5 h-5 opacity-50" />
            <CountUp
              value={data.media_shared}
              className="text-2xl font-bold"
              delay={1.9}
              duration={1.5}
            />
            <p className="text-xs opacity-40">media</p>
          </div>
        </motion.div>

        {/* Participants */}
        <motion.div
          className="flex items-center gap-2 mt-8 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2.2 }}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{data.participants_count} people made this happen</span>
        </motion.div>
      </div>

      <TapHint />
    </BackgroundGradientAnimation>
  );
}
