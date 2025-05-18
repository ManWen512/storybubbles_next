// components/QuestionBox.js
'use client';

const QuestionBox = ({ question, onAnswered }) => {
  const handleAnswer = (choiceIndex) => {
    // Here you could compare choiceIndex with question.correctAnswerIndex
    onAnswered();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mt-4">
      <h2 className="text-lg font-quicksand mb-2">{question.questionText}</h2>
      <div className="grid grid-cols-2 gap-2">
        {question.choices.map((choice, index) => (
          <button
            key={choice.id}
            className="bg-purple-400 font-bjola py-2 px-4 rounded hover:bg-purple-500 transition"
            onClick={() => handleAnswer(index + 1)}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionBox;
