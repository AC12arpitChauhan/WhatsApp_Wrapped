"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileUpload } from "@/components/upload/FileUpload";
import { SlideContainer } from "@/components/slides/SlideContainer";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { SparkleDecoration } from "@/components/ui/SparkleDecoration";
import { uploadChat, type WrappedData } from "@/lib/api";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wrappedData, setWrappedData] = useState<WrappedData | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await uploadChat(file);

      if (response.success && response.data) {
        setWrappedData(response.data);
      } else {
        setError(response.message || "Failed to process chat");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload file. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show wrapped experience if we have data
  if (wrappedData) {
    return <SlideContainer data={wrappedData} />;
  }

  // Upload screen with Aceternity gradient - WhatsApp themed
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(40, 211, 102)"
      gradientBackgroundEnd="rgb(10, 10, 10)"
      firstColor="40, 211, 102"
      secondColor="18, 140, 126"
      thirdColor="37, 211, 102"
      fourthColor="7, 94, 84"
      fifthColor="30, 180, 150"
      containerClassName="!min-h-screen"
      interactive={true}
    >
      <GrainOverlay />
      <SparkleDecoration />

      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-12">
        <div className="w-full max-w-lg space-y-12 text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
              WhatsApp
              <br />
              <span className="opacity-80">Wrapped</span>
            </h1>

            <motion.p
              className="text-lg md:text-xl opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.4 }}
            >
              Your year in chats, told beautifully
            </motion.p>
          </motion.div>

          {/* Upload Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FileUpload
              onFileSelect={handleFileSelect}
              isLoading={isLoading}
              error={error}
            />
          </motion.div>

          {/* Privacy note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1 }}
            className="text-xs flex items-center justify-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            All processing happens locally
          </motion.p>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
