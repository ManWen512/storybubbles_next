"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from "react-icons/io5";
import { FaStar, FaTrophy } from "react-icons/fa";
import { BsEmojiSmile, BsEmojiFrown } from "react-icons/bs";
import Image from 'next/image';

export default function AnswersPopup({ isOpen, onClose, questions }) {
  if (!isOpen) return null;

  const correctCount = questions.filter(q => q.correct === "true").length;
  const totalQuestions = questions.length;

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
          className="bg-gradient-to-b from-purple-100 to-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white bg-opacity-90 p-6 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-yellow-500 text-2xl" />
              <h2 className="text-2xl font-bold text-purple-800">Your Results!</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Score Display */}
          <div className="p-6 text-center">
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={`text-2xl ${i < Math.ceil((correctCount/totalQuestions) * 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="p-6">
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-6 last:mb-0 bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    question.correct === "true" ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {question.correct === "true" ? 
                      <BsEmojiSmile className="text-green-600 text-xl" /> : 
                      <BsEmojiFrown className="text-red-600 text-xl" />
                    }
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {question.questionText}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 relative">
                          <Image
                            src="/logo/man.png"
                            alt="User"
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                        <p className="text-gray-600">
                          {question.userAnswerText}
                        </p>
                      </div>
                      {question.correct === "false" && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 relative">
                            <Image
                              src="/logo/check.png"
                              alt="Correct"
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </div>
                          <p className="text-green-600">
                            {question.correctAnswerText}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white bg-opacity-90 p-6 border-t">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                {correctCount} out of {totalQuestions} correct!
              </div>
              <button
                onClick={onClose}
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
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