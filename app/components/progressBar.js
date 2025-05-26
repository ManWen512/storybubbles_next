"use client";
import { motion } from "framer-motion";

export default function ProgressBar({ currentScene, totalScenes }) {
  const progress = ((currentScene + 1) / totalScenes) * 100;

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full  px-0  z-50">
      <div className="relative h-2   overflow-hidden bg-gradient-to-r from-gray-200  to-gray-300">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute top-0 left-0 h-full rounded-s-none rounded-full bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400"
        />
      </div>
      
    </div>
  );
} 