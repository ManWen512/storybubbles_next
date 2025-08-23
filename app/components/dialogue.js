"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import { BiSolidDownArrow } from "react-icons/bi";

export default function Dialogue({
  transcript,
  text,
  audioUrl,
  onAudioEnd,
  active,
  showContinue,
  showQuestion,
}) {
  const [currentIdx, setCurrentIdx] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);
  const rafRef = useRef(null);

  let parsedTranscript = [];
  if (transcript) {
    try {
      if (typeof transcript === "string") {
        parsedTranscript = JSON.parse(transcript);
      } else if (Array.isArray(transcript)) {
        parsedTranscript = transcript;
      }
    } catch (e) {
      console.error("Invalid transcript format:", transcript, e);
      parsedTranscript = [];
    }
  }

  const tokens =
    parsedTranscript.length > 0
      ? parsedTranscript.map((ts) => ({
          text: (ts.word || ts.text || "").trim(),
          start: Number(ts.start || 0),
          end: Number(ts.end || 0),
        }))
      : text
      ? text.split(" ").map((word, i) => ({
          text: word,
          start: i * 0.5, // fallback
          end: (i + 1) * 0.5,
        }))
      : [];

  // Initialize audio
  useEffect(() => {
    if (!audioUrl) return;

    const sound = new Howl({
      src: [audioUrl],
      html5: true,
      preload: true,
      onend: () => {
        setIsPlaying(false);
        setCurrentIdx(null);
        onAudioEnd?.();
      },
      onloaderror: () => {
        setIsPlaying(false);
        setCurrentIdx(null);
        onAudioEnd?.();
      },
    });

    soundRef.current = sound;

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, [audioUrl]);

  // Handle play when active
  useEffect(() => {
    if (!active || !soundRef.current) {
      setIsPlaying(false);
      setCurrentIdx(null);
      soundRef.current?.stop();
      return;
    }

    soundRef.current.stop();
    soundRef.current.play();
    setIsPlaying(true);

    // Track playback time
    const update = () => {
      if (!soundRef.current) return;
      const t = soundRef.current.seek(); // current playback time (s)

      let idx = null;
      for (let i = 0; i < tokens.length; i++) {
        const w = tokens[i];
        if (t >= w.start && t <= w.end) {
          idx = i;
          break;
        }
      }
      setCurrentIdx(idx);

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafRef.current);
      soundRef.current?.stop();
    };
  }, [active, transcript, text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mb-4"
    >
      <div className="relative overflow-hidden">
        <div className="flex items-start flex-wrap gap-1 leading-relaxed text-xl relative">
          {tokens.map((w, i) => (
            <span
              key={i}
              className={`
        relative px-1 py-0.5 rounded-md cursor-pointer
        transition-all duration-500 ease-out
        transform
        ${
          i === currentIdx
            ? "bg-yellow-300 text-gray-900 scale-105 shadow-lg shadow-yellow-200/50 z-10"
            : i < currentIdx
            ? "bg-green-100 text-gray-700 scale-100"
            : "text-gray-600 scale-100 hover:text-gray-800"
        }
      `}
              style={{
                transitionProperty:
                  "background-color, color, transform, box-shadow",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                transformOrigin: "center",
              }}
              onClick={() => setCurrentIdx(i)}
            >
              {/* Persistent sliding background effect */}
              <span
                className={`
          absolute inset-0 rounded-md transition-all duration-500 ease-out
          ${
            i === currentIdx
              ? "bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 opacity-100"
              : "bg-transparent opacity-0"
          }
        `}
              />

              {/* Persistent glow effect */}
              <span
                className={`
          absolute inset-0 rounded-md transition-opacity duration-300 ease-out
          ${
            i === currentIdx
              ? "bg-yellow-300 opacity-30 blur-sm scale-110"
              : "opacity-0"
          }
        `}
              />

              {/* Text content */}
              <span className="relative z-10">{w.text}</span>
            </span>
          ))}
        </div>
      </div>

      {isPlaying && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        </div>
      )}

      {showContinue && !showQuestion && (
        <>
          <div>
            <BiSolidDownArrow
              className="absolute bottom-1 right-2 text-purple-400 animate-bounce"
              size={20}
            />
          </div>
          <p className="absolute -bottom-7 inset-x-0 text-center text-purple-500 animate-pulse font-quicksand">
            Click anywhere to continue
          </p>
        </>
      )}
    </motion.div>
  );
}
