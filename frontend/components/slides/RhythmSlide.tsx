"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Clock, Calendar, BarChart3, Sunrise, Sunset } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { TapHint } from "@/components/ui/NavigationUI";
import type { Slide2Data } from "@/lib/api";

interface RhythmSlideProps {
  data: Slide2Data;
}

export function RhythmSlide({ data }: RhythmSlideProps) {
  const getChronotypeInfo = () => {
    const type = data.chronotype.toLowerCase();
    if (type.includes("night")) {
      return {
        icon: <Moon className="w-16 h-16 text-indigo-300" strokeWidth={1.5} />,
        desc: "Creatures of the night"
      };
    } else if (type.includes("early") || type.includes("morning")) {
      return {
        icon: <Sunrise className="w-16 h-16 text-orange-300" strokeWidth={1.5} />,
        desc: "Rise and text!"
      };
    } else if (type.includes("afternoon")) {
      return {
        icon: <Sun className="w-16 h-16 text-yellow-300" strokeWidth={1.5} />,
        desc: "Peak productivity hours"
      };
    } else if (type.includes("evening")) {
      return {
        icon: <Sunset className="w-16 h-16 text-orange-400" strokeWidth={1.5} />,
        desc: "Wind-down texters"
      };
    }
    return {
      icon: <Clock className="w-16 h-16 text-teal-300" strokeWidth={1.5} />,
      desc: "Always online energy"
    };
  };

  const chronoInfo = getChronotypeInfo();

  // Process hourly activity
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const activity = data.activity_by_hour?.find((a) => a.hour === hour);
    return activity?.count || 0;
  });
  const maxHourly = Math.max(...hourlyData, 1);

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(6, 214, 160)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="6, 214, 160"
      secondColor="17, 138, 178"
      thirdColor="7, 59, 76"
      fourthColor="50, 180, 150"
      fifthColor="100, 200, 180"
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
          Peak Activity
        </motion.p>

        {/* Big Time */}
        <motion.h1
          className="text-7xl md:text-9xl font-black mb-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        >
          {data.most_active_hour_label}
        </motion.h1>

        {/* Chronotype */}
        <motion.div
          className="flex flex-col items-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {chronoInfo.icon}
          <p className="text-xl font-semibold mt-2">{data.chronotype}</p>
          <p className="text-sm opacity-50">{chronoInfo.desc}</p>
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center justify-center gap-1 mb-2 opacity-40">
            <BarChart3 className="w-3 h-3" />
            <span className="text-xs uppercase tracking-wider">24hr Activity</span>
          </div>
          
          <div className="flex items-end justify-between gap-[2px] h-16 px-2">
            {hourlyData.map((count, hour) => {
              const height = (count / maxHourly) * 100;
              const isActive = hour === data.most_active_hour;
              return (
                <motion.div
                  key={hour}
                  className={`flex-1 rounded-t ${isActive ? "bg-white" : "bg-white/20"}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 3)}%` }}
                  transition={{ delay: 1.4 + hour * 0.02, duration: 0.3 }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1 text-[10px] opacity-30 px-2">
            <span>12am</span>
            <span>6am</span>
            <span>12pm</span>
            <span>6pm</span>
            <span>11pm</span>
          </div>
        </motion.div>

        {/* Busiest day */}
        <motion.div
          className="flex items-center gap-2 mt-6 opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Busiest: <strong>{data.most_active_day}</strong></span>
        </motion.div>
      </div>

      <TapHint />
    </BackgroundGradientAnimation>
  );
}
