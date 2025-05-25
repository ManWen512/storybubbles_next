"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoVolumeHigh, IoVolumeMute } from "react-icons/io5";

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

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('audioMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume]);

  useEffect(() => {
    if (bgMusic) {
      try {
        bgMusic.volume(volume);
        bgMusic.mute(isMuted);
      } catch (error) {
        console.error('Error controlling background music:', error);
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
      className="fixed bottom-4   right-4 bg-white p-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
    >
      <button
        onClick={toggleMute}
        className="text-gray-700 hover:text-purple-600 transition-colors"
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
        className="w-24 accent-purple-500"
      />
    </motion.div>
  );
} 