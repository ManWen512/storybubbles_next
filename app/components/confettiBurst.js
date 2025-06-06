// components/ConfettiBurst.jsx
"use client";

import { confetti } from "@tsparticles/confetti";
import { useEffect } from "react";

export default function ConfettiBurst() {
  useEffect(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      disableForReducedMotion: true,
      zIndex: 9999,
    };

    // Add pointer-events: none to the canvas
    const style = document.createElement('style');
    style.textContent = `
      canvas.ts-particles {
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    function fire(particleRatio, opts) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        })
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    // Cleanup function
    return () => {
      document.head.removeChild(style);
      // Remove any remaining confetti canvases
      const canvases = document.querySelectorAll('canvas.ts-particles');
      canvases.forEach(canvas => canvas.remove());
    };
  }, []);

  return null; // this component just triggers the confetti
}
