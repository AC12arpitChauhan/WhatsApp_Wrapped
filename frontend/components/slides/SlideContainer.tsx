"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { WrappedData } from "@/lib/api";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { DotIndicators } from "@/components/ui/NavigationUI";

// Import all slides
import { IntroSlide } from "./IntroSlide";
import { BigPictureSlide } from "./BigPictureSlide";
import { RhythmSlide } from "./RhythmSlide";
import { PersonalitySlide } from "./PersonalitySlide";
import { CarrierSlide } from "./CarrierSlide";
import { EmojiSlide } from "./EmojiSlide";
import { MediaSlide } from "./MediaSlide";
import { CodeSlide } from "./CodeSlide";
import { VibeSlide } from "./VibeSlide";
import { TopicsSlide } from "./TopicsSlide";
import { FinalSlide } from "./FinalSlide";

interface SlideContainerProps {
  data: WrappedData;
}

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 300 : -300,
    scale: 0.95,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? 300 : -300,
    scale: 0.95,
  }),
};

const TOTAL_SLIDES = 11;

export function SlideContainer({ data }: SlideContainerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  // Horizontal swipe gesture
  const bind = useDrag(
    ({ direction: [dx], velocity: [vx], movement: [mx], cancel }) => {
      if (Math.abs(mx) > 60 || vx > 0.5) {
        if (dx < 0 && currentSlide < TOTAL_SLIDES - 1) {
          nextSlide();
          cancel();
        } else if (dx > 0 && currentSlide > 0) {
          prevSlide();
          cancel();
        }
      }
    },
    { axis: "x", threshold: 15, filterTaps: true }
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prevSlide();
      }
    },
    [nextSlide, prevSlide]
  );

  // Tap to advance
  const handleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    nextSlide();
  }, [nextSlide]);

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return <IntroSlide key="intro" onStart={nextSlide} />;
      case 1:
        return <BigPictureSlide key="stats" data={data.slide1} />;
      case 2:
        return <RhythmSlide key="rhythm" data={data.slide2} />;
      case 3:
        return <CarrierSlide key="carrier" data={data.slide4} personalities={data.slide3} />;
      case 4:
        return <TopicsSlide key="topics" data={data.slide9} />;
      case 5:
        return <MediaSlide key="media" data={data.slide6} />;
      case 6:
        return <CodeSlide key="code" data={data.slide7} />;
      case 7:
        return <VibeSlide key="vibe" data={data.slide8} />;
      case 8:
        return <PersonalitySlide key="personality" data={data.slide3} />;
      case 9:
        return <EmojiSlide key="emoji" data={data.slide5} />;
      case 10:
        return <FinalSlide key="final" data={data.slide10} allData={data} />;
      default:
        return <FinalSlide key="final-fallback" data={data.slide10} allData={data} />;
    }
  };

  return (
    <div
      {...bind()}
      className="fixed inset-0 bg-[#0a0a0a] overflow-hidden select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={currentSlide === 0 || currentSlide === TOTAL_SLIDES - 1 ? undefined : handleClick}
      style={{ touchAction: "none", userSelect: "none" }}
    >
      <GrainOverlay />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 35,
          }}
          className="absolute inset-0"
        >
          {renderSlide()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Desktop only */}
      {currentSlide > 0 && (
        <motion.button
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.7, x: 0 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      )}

      {currentSlide < TOTAL_SLIDES - 1 && currentSlide > 0 && (
        <motion.button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.7, x: 0 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}

      {/* Dot indicators */}
      {currentSlide > 0 && currentSlide < TOTAL_SLIDES - 1 && (
        <DotIndicators total={TOTAL_SLIDES - 2} current={currentSlide - 1} />
      )}
    </div>
  );
}
