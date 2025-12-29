"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, RefreshCw, Share2, MessageCircle, Users, Heart, Sparkles } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { SparkleDecoration } from "@/components/ui/SparkleDecoration";
import type { Slide10Data, WrappedData } from "@/lib/api";

interface FinalSlideProps {
  data: Slide10Data;
  allData: WrappedData;
}

const CLOSING_QUOTES = [
  "A year of conversations, summarized.",
  "Same group. New memories.",
  "Thanks for the chaos.",
  "More than messages. Memories.",
  "Every chat tells a story.",
];

export function FinalSlide({ data, allData }: FinalSlideProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "#0a0a0a",
      });

      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "whatsapp-wrapped.png", { type: "image/png" });

        const canShare = navigator.canShare?.({ files: [file] });
        if (canShare) {
          try {
            await navigator.share({ files: [file], title: "WhatsApp Wrapped" });
          } catch {
            downloadImage(dataUrl);
          }
        } else {
          downloadImage(dataUrl);
        }
      } else {
        downloadImage(dataUrl);
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const downloadImage = (dataUrl: string) => {
    const link = document.createElement("a");
    link.download = "whatsapp-wrapped.png";
    link.href = dataUrl;
    link.click();
  };

  const handleRestart = () => {
    window.location.reload();
  };

  // Pick closing quote
  const quoteIndex = (data.chat_name?.length || 0) % CLOSING_QUOTES.length;

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

      <div className="flex flex-col items-center justify-center text-center h-full w-full px-4 py-8">
        {/* Shareable Card - Larger */}
        <motion.div
          ref={cardRef}
          className="w-full max-w-sm bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className="p-8 text-center">
            {/* Group Name as Heading */}
            <h1 className="text-3xl font-black mb-1">{data.chat_name || "WhatsApp Group"}</h1>
            <p className="text-xs uppercase tracking-widest opacity-70 mb-6">Wrapped {data.year}</p>

            {/* Key Stats Row */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex flex-col items-center">
                <MessageCircle className="w-5 h-5 mb-1 opacity-80" />
                <span className="text-xl font-bold">{(allData.slide1.total_messages / 1000).toFixed(1)}K</span>
                <span className="text-xs opacity-60">messages</span>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-5 h-5 mb-1 opacity-80" />
                <span className="text-xl font-bold">{allData.slide1.participants_count}</span>
                <span className="text-xs opacity-60">people</span>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="w-5 h-5 mb-1 opacity-80" />
                <span className="text-xl font-bold">{allData.slide1.active_days}</span>
                <span className="text-xs opacity-60">days</span>
              </div>
            </div>

            {/* Top emoji */}
            <div className="text-6xl mb-4">{data.top_emoji}</div>

            {/* Key insights */}
            <div className="space-y-1 mb-5">
              {data.shareable_stats.slice(0, 2).map((stat, i) => (
                <p key={i} className="text-sm opacity-80">{stat}</p>
              ))}
            </div>

            {/* Role Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">{data.group_role}</span>
            </div>

            {/* Closing Quote */}
            <motion.p
              className="text-sm opacity-60 italic mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
            >
              "{CLOSING_QUOTES[quoteIndex]}"
            </motion.p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={handleShare}
            disabled={isExporting}
            className="glass-card px-6 py-3 font-semibold hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
          >
            {isExporting ? (
              <><RefreshCw className="w-4 h-4 animate-spin" />Exporting...</>
            ) : exportSuccess ? (
              <><Download className="w-4 h-4" />Saved!</>
            ) : (
              <><Share2 className="w-4 h-4" />Share</>
            )}
          </button>

          <button
            onClick={handleRestart}
            className="glass-card-sm px-6 py-3 opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New
          </button>
        </motion.div>

        {/* Privacy footer */}
        <motion.p
          className="text-xs opacity-30 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2 }}
        >
          Made with 💚 · No chats were stored
        </motion.p>
      </div>
    </BackgroundGradientAnimation>
  );
}
