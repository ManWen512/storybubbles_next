"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import Notification from "./notification";

export default function AudioControls({ bgMusic }) {
  // Initialize state from localStorage if available
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('audioMuted');
      return savedMute ? JSON.parse(savedMute) : false;
    }
    return false;
  });

  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('audioVolume');
      return savedVolume ? parseFloat(savedVolume) : 0.5;
    }
    return 0.5;
  });

  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('audioMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume]);

  const showNotification = (message, type = "success") => {
    setNotif({ show: true, message, type });
  };

  useEffect(() => {
    if (bgMusic) {
      try {
        bgMusic.volume(volume);
        bgMusic.mute(isMuted);
      } catch (error) {
        showNotification("Error controlling background music", "error");
      }
    }
  }, [volume, isMuted, bgMusic]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 flex items-center gap-3 z-50"
    >
      <Notification
        show={notif.show}
        message={notif.message}
        type={notif.type}
        onClose={() => setNotif({ ...notif, show: false })}
      />
      <button
        onClick={toggleMute}
        className="text-purple-400 hover:text-purple-600 transition-colors"
      >
        {isMuted ? <IoVolumeMute size={24} /> : <IoVolumeHigh size={24} />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        className=" accent-purple-500  w-full"
      />
    </motion.div>
  );
} 