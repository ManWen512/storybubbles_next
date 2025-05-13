"use client";

import { useState } from "react";
import questions from "../components/motivation.json";
import { PiArrowFatLinesRightFill } from "react-icons/pi";

export default function preTest() {
  const [answers, setAnswers] = useState({});

  const handleChange = (questionId, choiceLabel) => {
    setAnswers({
      ...answers,
      [questionId]: choiceLabel,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Answers:", answers);
    // You can send this data to your backend or store it
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bjola font-bold mb-6">Game Feedback Form</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="mb-6">
            <h2 className="text-lg font-bjola mb-2">
              {q.id}. {q.question}
            </h2>
            <div className="grid grid-cols-5 gap-1 place-items-center">
              {q.choices.map((choice, index) => (
                <label
                  key={index}
                  className={`cursor-pointer flex items-center gap-2  rounded-xl px-4 py-2 transition hover:bg-purple-300 ${
                    answers[q.id] === choice.label
                      ? "bg-purple-300 border-purple-400 border-2"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={choice.label}
                    onChange={() => handleChange(q.id, choice.label)}
                    className="hidden"
                  />
                  <div className="grid grid-cols-1 grid-rows-2 gap-2 place-items-center">
                  <span>
                    
                    <img
                      src={choice.emoji}
                      alt="😛"
                      width="48"
                      height="48"
                    ></img>
                  </span>
                  <span className="text-xs font-bjola text-center ">{choice.label}</span></div>
                  
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-center mt-5">
          <button
            type="submit"
            className="w-18 h-18 cursor-pointer  bg-purple-400 text-white px-6 py-2 rounded-full shadow-2xl hover:bg-purple-500 transition duration-200"
          >
            <PiArrowFatLinesRightFill size={25} />
          </button>
        </div>
      </form>
    </div>
  );
}
