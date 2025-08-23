"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from "react-icons/io5";
import { FaStar, FaTrophy } from "react-icons/fa";
import { BsEmojiSmile, BsEmojiFrown } from "react-icons/bs";
import Image from 'next/image';

export default function AnswersPopup({ isOpen, onClose, questions, storyName }) {
  if (!isOpen) return null;

  // Handle different data structures - questions might be nested or direct array
  const questionsArray = Array.isArray(questions) ? questions : 
                        (questions?.question ? questions.question : []);
                       

  // Ensure we have valid questions array
  if (!questionsArray || questionsArray.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-b from-purple-100 to-white rounded-2xl shadow-xl max-w-2xl w-full"
          >
            <div className="p-6 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose size={24} />
              </button>
              <h2 className="text-2xl font-bold text-purple-800 mb-4">No Questions Found</h2>
              <p className="text-gray-600 mb-4">There are no questions available to display.</p>
              <button
                onClick={onClose}
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const correctCount = questionsArray.filter(q => {
    // Handle the actual data structure where chosenAnswer is "true" for correct
    return q.userAnswerText === "true";
  }).length;
  
  const totalQuestions = questionsArray.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-b from-purple-100 to-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white bg-opacity-95 backdrop-blur-sm p-6 border-b flex justify-between items-center z-10 shadow-sm rounded-t-2xl">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-yellow-500 text-2xl" />
              <div>
                <h2 className="text-2xl font-bold text-purple-800 font-quicksand">Your Results!</h2>
                {storyName && <p className="text-sm text-gray-600">{storyName}</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Score Display */}
          <div className="p-6 text-center border-b">
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={`text-2xl ${i < Math.ceil((correctCount/totalQuestions) * 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <div className="text-3xl font-bold text-purple-800 mb-2">
              {correctCount}/{totalQuestions}
            </div>
            <p className="text-gray-600">
              {Math.round((correctCount/totalQuestions) * 100)}% Correct
            </p>
          </div>

          {/* Questions */}
          <div className="p-6">
            {questionsArray.map((question, index) => {
              // Handle the actual data structure where userAnswerText is "true" for correct
              const isCorrect = question.userAnswerText === "true";
              
              return (
                <motion.div
                  key={question.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`mb-6 last:mb-0 rounded-xl p-4 shadow-sm ${
                    isCorrect 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isCorrect ? 
                        <BsEmojiSmile className="text-green-600 text-xl" /> : 
                        <BsEmojiFrown className="text-red-600 text-xl" />
                      }
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-quicksand mb-3 text-black">
                        {question.question || `Question ${index + 1}`}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 relative z-0 flex-shrink-0">
                            <Image
                              src="/logo/man.png"
                              alt="User"
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </div>
                          <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'} font-medium`}>
                            Your answer: {isCorrect ? 'Correct' : 'Incorrect'}
                          </p>
                        </div>
                        {!isCorrect && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 relative z-0 flex-shrink-0">
                              <Image
                                src="/logo/check.png"
                                alt="Correct"
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                            <p className="text-green-700 font-medium">
                              The correct answer {question.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white bg-opacity-95 backdrop-blur-sm p-6 border-t z-10 shadow-sm rounded-b-2xl">
            <div className="flex justify-between items-center">
              <div className="text-gray-600 font-medium">
                {correctCount} out of {totalQuestions} correct!
              </div>
              <button
                onClick={onClose}
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}