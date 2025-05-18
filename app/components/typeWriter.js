'use client';
import { useEffect, useState } from 'react';

const TypewriterDialogueBox = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      setTimeout(onComplete, 1500); // Wait 1.5 seconds before calling onComplete
    }
  }, [index, text, speed, onComplete]);

  return (
    <div className="bg-white text-black p-4 rounded  sm:w-screen  max-w-xl mx-auto shadow-md font-quicksand">
      <p>{displayedText}<span className="animate-pulse">|</span></p>
    </div>
  );
};

export default TypewriterDialogueBox;
