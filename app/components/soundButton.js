"use client";
import { useRef, useEffect, useState } from 'react';
import { Howl } from 'howler';

// Create a cache for preloaded sounds
const soundCache = new Map();

export default function SoundButton({ 
  children, 
  onClick, 
  className = "",
  soundUrl = "/sounds/button-click.mp3",
  disabled = false
}) {
  const soundRef = useRef(null);
  const [isSoundLoaded, setIsSoundLoaded] = useState(false);

  useEffect(() => {
    // Check if sound is already in cache
    if (soundCache.has(soundUrl)) {
      soundRef.current = soundCache.get(soundUrl);
      setIsSoundLoaded(true);
      return;
    }

    // Initialize and preload sound
    const sound = new Howl({
      src: [soundUrl],
      volume: 0.5,
      html5: true,
      preload: true,
      onload: () => {
        setIsSoundLoaded(true);
      },
      onloaderror: (id, error) => {
        console.error('Failed to load sound:', error);
      }
    });

    // Store in cache
    soundCache.set(soundUrl, sound);
    soundRef.current = sound;

    return () => {
      // Don't unload the sound as it's cached
      soundRef.current = null;
    };
  }, [soundUrl]);

  const handleClick = (e) => {
    if (disabled || !isSoundLoaded) return;
    
    // Play sound
    if (soundRef.current) {
      soundRef.current.play();
    }
    
    // Call original onClick
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      disabled={disabled || !isSoundLoaded}
    >
      {children}
    </button>
  );
} 