"use client";

import { motion } from "framer-motion";

export default function BouncingLogo({className=''}) {
  return (
    <motion.img
      src="/logo/StoryBubbles_Logo.png"
      className={className}
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
} 