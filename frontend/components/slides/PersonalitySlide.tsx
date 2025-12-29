"use client";

import { motion } from "framer-motion";
import { User, Zap, MessageSquare, Volume2, PenTool } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { TapHint } from "@/components/ui/NavigationUI";
import type { Slide3Data } from "@/lib/api";

interface PersonalitySlideProps {
  data: Slide3Data;
}

export function PersonalitySlide({ data }: PersonalitySlideProps) {
  const topPersonalities = data.personalities.slice(0, 4);
  
  // Get icon for personality type
  const getPersonalityIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("spammer")) return <Zap className="w-6 h-6 text-yellow-400" />;
    if (typeLower.includes("silent")) return <Volume2 className="w-6 h-6 text-gray-400" />;
    if (typeLower.includes("emoji")) return <MessageSquare className="w-6 h-6 text-pink-400" />;
    if (typeLower.includes("essay") || typeLower.includes("writer")) return <PenTool className="w-6 h-6 text-blue-400" />;
    if (typeLower.includes("chaos")) return <Zap className="w-6 h-6 text-orange-400" />;
    return <User className="w-6 h-6 text-green-400" />;
  };

  // Get personality description
  const getPersonalityDesc = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("spammer")) return "Messages flying at the speed of light";
    if (typeLower.includes("silent")) return "Watching from the shadows";
    if (typeLower.includes("emoji")) return "Why use words when emojis exist?";
    if (typeLower.includes("essay") || typeLower.includes("writer")) return "Every message is a short story";
    if (typeLower.includes("chaos")) return "Unpredictable and proud of it";
    return "The perfect balance of everything";
  };

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(131, 56, 236)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="131, 56, 236"
      secondColor="255, 0, 110"
      thirdColor="58, 134, 255"
      fourthColor="180, 100, 255"
      fifthColor="255, 100, 200"
      containerClassName="!h-screen !w-screen"
      interactive={false}
    >
      <div className="flex flex-col items-center justify-center text-center h-full w-full px-4 py-8">
        {/* Label */}
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <User className="w-5 h-5" />
          <span className="text-label">Chat Personalities</span>
        </motion.div>

        {/* Personalities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
          {topPersonalities.map((person, index) => (
            <motion.div
              key={person.name}
              className="glass-card text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.15, type: "spring" }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-white/10">
                  {getPersonalityIcon(person.personality_type)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{person.name}</p>
                  <p className="text-sm font-semibold opacity-80">{person.personality_type}</p>
                  <p className="text-xs opacity-50 mt-1">{getPersonalityDesc(person.personality_type)}</p>
                </div>
              </div>
              
              {/* Traits */}
              <div className="flex flex-wrap gap-2 mt-3">
                {person.traits.slice(0, 3).map((trait, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/10">
                    {trait}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Score summary */}
        <motion.p
          className="text-caption mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2 }}
        >
          Everyone has a unique texting style
        </motion.p>
      </div>

      <TapHint />
    </BackgroundGradientAnimation>
  );
}
