"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function FileUpload({ onFileSelect, isLoading = false, error }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".txt")) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Drop Zone - Glass Card Style */}
      <label
        className={`
          relative flex flex-col items-center justify-center
          w-full h-48 rounded-2xl cursor-pointer
          transition-all duration-300
          ${isDragOver
            ? "glass-card border-white/40 scale-[1.02]"
            : "glass-card-sm hover:scale-[1.01]"
          }
          ${isLoading ? "pointer-events-none opacity-70" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-3"
            >
              <Loader2 className="w-10 h-10 animate-spin opacity-80" />
              <p className="opacity-60 text-sm">Analyzing your chat...</p>
            </motion.div>
          ) : selectedFile ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-3"
            >
              <FileText className="w-10 h-10 opacity-80" />
              <div className="text-center">
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="opacity-50 text-xs mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-3"
            >
              <Upload className="w-10 h-10 opacity-60" />
              <div className="text-center">
                <p className="font-medium text-sm">
                  Drop your chat export
                </p>
                <p className="opacity-50 text-xs mt-1">
                  or tap to browse
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </label>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-xs">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How to export hint */}
      <motion.details
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5 }}
        className="text-xs cursor-pointer"
      >
        <summary className="hover:opacity-80">How to export from WhatsApp</summary>
        <ol className="mt-2 space-y-1 pl-4 opacity-70">
          <li>1. Open chat → Three dots → More → Export</li>
          <li>2. Choose &quot;Without media&quot;</li>
          <li>3. Save and upload the .txt file</li>
        </ol>
      </motion.details>
    </div>
  );
}
