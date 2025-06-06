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

  if (!show) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-lg text-white shadow-lg ${colors[type]} transform transition-all duration-300 ease-in-out`}
      style={{
        transform: show ? 'translateX(0)' : 'translateX(100%)',
        opacity: show ? 1 : 0,
      }}
    >
      {message}
    </div>
  );
}
