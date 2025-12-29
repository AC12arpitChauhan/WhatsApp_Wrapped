"use client";

import { motion } from "framer-motion";
import { Image, Video, FileAudio, Sticker, File, Zap, Camera } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { CountUp } from "@/components/ui/CountUp";
import { TapHint } from "@/components/ui/NavigationUI";
import type { Slide6Data } from "@/lib/api";

interface MediaSlideProps {
  data: Slide6Data;
}

const MEDIA_SHARER_QUOTES = [
  "If it happened, they have a photo.",
  "Every memory in this group? Mostly theirs.",
  "The group's official photographer.",
  "They document everything.",
  "Capture first, ask questions later.",
];

export function MediaSlide({ data }: MediaSlideProps) {
  const mediaStats = [
    { icon: Image, label: "Images", value: data.image_count, color: "text-blue-400" },
    { icon: Video, label: "Videos", value: data.video_count, color: "text-purple-400" },
    { icon: FileAudio, label: "GIFs", value: data.gif_count, color: "text-green-400" },
    { icon: Sticker, label: "Stickers", value: data.sticker_count, color: "text-yellow-400" },
    { icon: File, label: "Docs", value: data.document_count, color: "text-orange-400" },
  ].filter(s => s.value > 0);

  const getChaosLevel = () => {
    if (data.chaos_index >= 0.7) return { text: "Maximum Chaos", desc: "This group is a meme factory" };
    if (data.chaos_index >= 0.5) return { text: "Perfectly Chaotic", desc: "A healthy mix of media and madness" };
    if (data.chaos_index >= 0.3) return { text: "Controlled Energy", desc: "Media shared with purpose" };
    return { text: "Zen Mode", desc: "More words than media" };
  };

  const chaosLevel = getChaosLevel();
  
  // Pick quote for top media sharer
  const quoteIndex = data.top_media_sharer 
    ? Math.abs(data.top_media_sharer.charCodeAt(0)) % MEDIA_SHARER_QUOTES.length 
    : 0;

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(255, 107, 53)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="255, 107, 53"
      secondColor="247, 37, 133"
      thirdColor="255, 200, 50"
      fourthColor="255, 150, 100"
      fifthColor="255, 100, 150"
      containerClassName="!h-screen !w-screen"
      interactive={false}
    >
      <div className="flex flex-col items-center justify-center text-center h-full w-full px-6 py-8">
        {/* Label */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Zap className="w-4 h-4" />
          <span className="text-xs uppercase tracking-[0.2em]">Media Chaos</span>
        </motion.div>

        {/* Big Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <CountUp
            value={data.total_media}
            className="text-7xl md:text-9xl font-black"
            delay={0.5}
          />
        </motion.div>

        <motion.p
          className="text-xl opacity-60 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
        >
          total media shared
        </motion.p>

        {/* Chaos Level */}
        <motion.h1
          className="text-3xl md:text-4xl font-black mt-4 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {chaosLevel.text}
        </motion.h1>

        <motion.p
          className="text-sm opacity-50 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2 }}
        >
          {chaosLevel.desc}
        </motion.p>

        {/* Top Media Sharer */}
        {data.top_media_sharer && (
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <Camera className="w-5 h-5 text-pink-400" />
            <div className="text-left">
              <p className="font-semibold">{data.top_media_sharer}</p>
              <p className="text-xs opacity-60 italic">{MEDIA_SHARER_QUOTES[quoteIndex]}</p>
            </div>
          </motion.div>
        )}

        {/* Media Breakdown */}
        <motion.div
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          {mediaStats.slice(0, 5).map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 1.7 + index * 0.1 }}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className="text-lg font-bold">{stat.value}</span>
              <span className="text-xs opacity-40">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <TapHint />
    </BackgroundGradientAnimation>
  );
}
