// components/QuestionTask.jsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { submitStoryAnswer } from '@/redux/slices/storySlice';
import { PiArrowFatLinesRightFill } from "react-icons/pi";
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';

// Create a cache for preloaded sounds
const soundCache = new Map();

export default function QuestionTask({ 
  question, 
  choices = [],
  correctAnswerIndex = 1,
  onAnswer,
  answered = false,
  showResult = false,
  questionId
}) {
  const dispatch = useDispatch();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);

  // Initialize sounds
  useEffect(() => {
    // Initialize correct answer sound
    if (!soundCache.has('correct')) {
      const correctSound = new Howl({
        src: ['/sounds/correct.mp3'],
        volume: 0.5,
        html5: true,
        preload: true
      });
      soundCache.set('correct', correctSound);
    }
    correctSoundRef.current = soundCache.get('correct');

    // Initialize incorrect answer sound
    if (!soundCache.has('incorrect')) {
      const incorrectSound = new Howl({
        src: ['/sounds/incorrect.mp3'],
        volume: 0.5,
        html5: true,
        preload: true
      });
      soundCache.set('incorrect', incorrectSound);
    }
    incorrectSoundRef.current = soundCache.get('incorrect');

    return () => {
      // Don't unload sounds as they're cached
      correctSoundRef.current = null;
      incorrectSoundRef.current = null;
    };
  }, []);

  const handleSubmit = async () => {
    if (selectedAnswer !== null && !answered) {
      // Get userId from localStorage
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        alert('Please login to save your answer progress');
        return;
      }
      
      if (questionId) {
        try {
          // Dispatch the submitStoryAnswer action
          await dispatch(submitStoryAnswer({
            questionId,
            chosenAnswer: selectedAnswer,
            userId
          })).unwrap();
          
          // Play appropriate sound based on answer
          if (selectedAnswer === correctAnswerIndex) {
            correctSoundRef.current?.play();
          } else {
            incorrectSoundRef.current?.play();
          }
          
          // Call the original onAnswer callback
          onAnswer(selectedAnswer === correctAnswerIndex);
        } catch (error) {
          console.error('Failed to submit answer:', error);
          alert('Failed to save your answer. Please try again.');
          // Still call onAnswer even if submission fails
          onAnswer(selectedAnswer === correctAnswerIndex);
        }
      } else {
        // If no questionId, just call onAnswer
        onAnswer(selectedAnswer === correctAnswerIndex);
      }
    }
  };

  // Safely get the correct answer label
  const correctAnswerLabel = choices[correctAnswerIndex-1]?.label || '';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={questionId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mb-4"
      >
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-quicksand font-bold mb-4"
        >
          {question}
        </motion.h3>
        
        {choices.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              {choices.map((choice, index) => (
                <motion.div 
                  key={choice?.id || index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  onClick={() => !answered && setSelectedAnswer(index + 1)}
                  className={`justify-between items-center flex font-quicksand px-3 py-5 border-2 rounded-2xl cursor-pointer transition-colors hover:border-purple-400 
                    ${selectedAnswer === index + 1 ? 'border-2 border-purple-500 bg-purple-50' : 'border-gray-300'}
                    ${showResult && index + 1 === correctAnswerIndex ? 'bg-green-100 border-green-500' : ''}
                    ${showResult && selectedAnswer === index + 1 && selectedAnswer !== correctAnswerIndex ? 'bg-red-100 border-red-400' : ''}
                    ${answered ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  {choice?.label || `Option ${index + 1}`}
                  <span><img src={choice.emoji} alt='Choice Emoji' className='w-10 h-10 rounded-xl'/></span>
                </motion.div>
              ))}
            </div>

            {!answered ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className='flex items-center justify-center'
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className={`mt-4 px-4 py-4 rounded-full ${selectedAnswer === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-400 text-white hover:bg-purple-600'}`}
                >
                  <PiArrowFatLinesRightFill size={25} />
                </motion.button>
              </motion.div>
            ) : showResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-lg font-quicksand"
              >
                {selectedAnswer === correctAnswerIndex ? (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2
                    }}
                    className="text-green-600 flex items-center justify-center gap-2"
                  >
                    <motion.span
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.3
                      }}
                    >
                      ✓
                    </motion.span>
                    Correct!
                  </motion.span>
                ) : (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2
                    }}
                    className="text-red-600 flex items-center justify-center gap-2"
                  >
                    <motion.span
                      initial={{ rotate: 180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.3
                      }}
                    >
                      ✗
                    </motion.span>
                    Incorrect! {correctAnswerLabel && (
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        The correct answer is: {correctAnswerLabel}
                      </motion.span>
                    )}
                  </motion.span>
                )}
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-red-500">No answer choices available</div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}