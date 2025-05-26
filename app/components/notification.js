"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function Notification({ message, type = "success", show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const colors = {
    success: "bg-green-400",
    error: "bg-red-400",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg text-white shadow-lg ${colors[type]}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
