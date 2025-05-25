"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';

export default function Dialogue({ 
  text, 
  audioUrl,
  onAudioEnd,
  active 
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Initialize Howler sound
  useEffect(() => {
    if (!audioUrl) return;

    // Create new Howl instance
    const sound = new Howl({
      src: [audioUrl],
      html5: true,
      preload: true,
      onend: () => {
        setIsPlaying(false);
        onAudioEnd?.();
      },
      onloaderror: () => {
        setIsPlaying(false);
        onAudioEnd?.();
      }
    });

    soundRef.current = sound;

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, [audioUrl]);

  // Handle text typing and audio playback
  useEffect(() => {
    if (!active) {
      setDisplayedText('');
      setIsTyping(false);
      setIsPlaying(false);
      if (soundRef.current) {
        soundRef.current.stop();
      }
      return;
    }

    // Start both text and audio simultaneously
    setIsTyping(true);
    
    let currentIndex = 0;
    const textLength = text.length;
    const typingSpeed = 30; // milliseconds per character

    // Start audio playback
    const startAudio = () => {
      if (!soundRef.current) return;

      try {
        soundRef.current.stop();
        soundRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        setIsPlaying(false);
      }
    };

    // Start text animation
    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < textLength) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingIntervalRef.current);
      }
    }, typingSpeed);

    // Start audio after a small delay to ensure DOM is ready
    setTimeout(startAudio, 100);

    // Cleanup
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.stop();
      }
    };
  }, [active, text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mb-4"
    >
      <div className="flex items-start">
        <p className="text-lg flex-1 font-quicksand">
          {displayedText}
          {isTyping && <span className="animate-blink">|</span>}
        </p>
        {isPlaying && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            
          </div>
        )}
      </div>
    </motion.div>
  );
}