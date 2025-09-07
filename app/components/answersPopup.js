"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { BsEmojiSmile, BsEmojiFrown } from "react-icons/bs";
import { fetchQuestions } from "@/redux/slices/questionSlice";

export default function AnswersPopup({ isOpen, onClose, questionsPopup, storyName }) {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.questions);

  useEffect(() => {
    if (isOpen) dispatch(fetchQuestions());
  }, [isOpen, dispatch]);

  // Map questionsPopup with question text
  const questionsForDisplay = questionsPopup?.map((ans) => {
    const questionData = questions.find((q) => q.qid === ans.question);
    return {
      ...ans,
      questionText: questionData?.questionText || ans.question,
      Answer: ans.answer || "No answer",
      isCorrect: ans.isCorrect || false,
      correctAnswer: questionData?.correctAnswer || "No correct answer",
    };
  }) || [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10 shadow-sm rounded-t-2xl">
            <h2 className="text-2xl font-bold text-purple-800">Your Answers - {storyName}</h2>
            <button onClick={onClose}><IoClose size={24} /></button>
          </div>

          {/* Questions */}
          <div className="p-6 space-y-4">
            {loading && <p>Loading questions...</p>}
            {!loading && questionsForDisplay.map((q, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border flex items-start gap-3 ${q.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}
              >
                {/* Emoji */}
                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${q.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  {q.isCorrect ? <BsEmojiSmile className="text-green-600 text-2xl" /> : <BsEmojiFrown className="text-red-600 text-2xl" />}
                </div>

                <div className="flex-grow">
                  <h3 className="font-bold mb-2">{q.questionText}</h3>
                  <p>Your answer: <span className={`${q.isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}`}>{q.Answer}</span></p>
                  {!q.isCorrect && <p>Correct answer: <span className="text-green-700 font-medium">{q.correctAnswer}</span></p>}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white p-6 border-t flex justify-end">
            <button
              onClick={onClose}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
