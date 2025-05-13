'use client';
import { useState } from 'react';
import TypewriterDialogueBox from '../components/typeWriter';

export default function storyOne() {
  const [step, setStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [finished, setFinished] = useState(false);

  const dialogues = [
    "Once upon a time in a village near the Irrawaddy River...",
    "A curious little boy named Ko Ko found a mysterious book.",
    "As he opened it, the world around him began to shimmer and twist!",
    "(Sammy flipped open the book… but suddenly, a golden light swirled around them! The pages glowed, and before they could say another word—WHOOSH!—they were sucked into the book!)"
  ];

  const handleComplete = () => {
    // If there are more lines, go to the next one
    if (step < dialogues.length - 1) {
      setTimeout(() => setStep(prev => prev + 1), 1500);
    } else {
      // After final line finishes typing, wait a bit, then fade out
      setTimeout(() => {
        setFadeOut(true); // trigger fade out
        setTimeout(() => setFinished(true), 1000); // remove from DOM after fade
      }, 2000); // 2s pause before fade
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex items-center justify-center px-4">
      {!finished && (
        <div className={`transition-opacity duration-1000  ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <TypewriterDialogueBox
            key={step}
            text={dialogues[step]}
            speed={60}
            onComplete={handleComplete}
          />
        </div>
      )}
    </div>
  );
}
