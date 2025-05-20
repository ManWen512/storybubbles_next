'use client';
import { useState, useEffect } from 'react';
import { PiArrowFatLinesRightFill } from "react-icons/pi";

const QuestionBox = ({ question, onAnswered }) => {
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  

  const handleSubmit = () => {
    if (selectedChoiceIndex !== null) {
      const correct = selectedChoiceIndex === question.correctAnswerIndex - 1;
      setIsCorrect(correct);
      setIsSubmitted(true);

      // Wait 3 seconds then go to next
      setTimeout(() => {
        onAnswered();
        setIsSubmitted(false);
        setSelectedChoiceIndex(null);
        setIsCorrect(null);
      }, 2000);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg space-y-4 font-quicksand">
      <h2 className="text-lg font-bold">{question.questionText}</h2>
      <div className="grid grid-cols-2 gap-2">
        {question.choices.map((choice, index) => (
          <button
            key={choice.id}
            onClick={() => !isSubmitted && setSelectedChoiceIndex(index)}
            className={`p-2 py-3 rounded border text-left shadow ${
              selectedChoiceIndex === index
                ? 'bg-purple-200 border-purple-400'
                : 'bg-gray-100 border-gray-300'
            } ${
              isSubmitted &&
              index === question.correctAnswerIndex - 1 &&
              'bg-green-200 border-green-400'
            } ${
              isSubmitted &&
              selectedChoiceIndex === index &&
              selectedChoiceIndex !== question.correctAnswerIndex - 1 &&
              'bg-red-200 border-red-500'
            }`}
          >
            {choice.label}
          </button>
        ))}
      </div>

      {!isSubmitted ? (
        <div className='flex items-center justify-center'>
        <button
          onClick={handleSubmit}
          disabled={selectedChoiceIndex === null}
          className={`w-20 h-20   rounded-full flex items-center justify-center shadow-xl ${
            selectedChoiceIndex !== null
              ? 'bg-purple-400 '
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <PiArrowFatLinesRightFill size={25} />
        </button>
        </div>
      ) : (
        <div
          className={`text-center font-semibold ${
            isCorrect ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isCorrect ? 'Correct!' : 'Oops, that’s not right.'}
        </div>
      )}
    </div>
  );
};

export default QuestionBox;
