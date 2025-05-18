"use client";

import { useState, useEffect } from "react";
import { PiArrowFatLinesRightFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { fetchTest, submitTestAnswers } from "@/redux/slices/testSlice";
import { useRouter } from "next/navigation";

export default function PreTest() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { preTest, status } = useSelector((state) => state.test);

  const [answers, setAnswers] = useState({});
  const [unanswered, setUnanswered] = useState([]);

  useEffect(() => {
    dispatch(fetchTest(1)); // 1 = preTest
  }, [dispatch]);

  const handleChange = (questionId, choiceId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));

    // Remove from unanswered if previously marked
    setUnanswered((prev) => prev.filter((id) => id !== questionId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not found!");
      return;
    }

    // Find unanswered question IDs
    const missing = preTest.filter((q) => !answers[q.id]).map((q) => q.id);

    if (missing.length > 0) {
      setUnanswered(missing);
      return;
    }

    dispatch(submitTestAnswers({ userId, answers }))
      .then(() => {
        alert("Successfully submitted!");
        router.push("/story1");
      })
      .catch((err) => {
        console.error("Submission failed", err);
      });
  };

  if (status === "loading")
    return (
      <div className="flex items-center justify-center">
        <img src="/animation.gif" />
      </div>
    );
  if (status === "failed")
    return (
      <p className="text-center text-red-500">Failed to load questions.</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-quicksand font-bold mb-6">
        Game Feedback Form
      </h1>

      <form onSubmit={handleSubmit}>
        {preTest.map((q) => (
          <div key={q.id} className="mb-6">
            <h2
              className={`text-lg font-quicksand mb-2 ${
                unanswered.includes(q.id) ? "text-red-500" : ""
              }`}
            >
              {q.id}. {q.questionText}
            </h2>
            <div
              className={`grid grid-cols-5 gap-1 place-items-center ${
                unanswered.includes(q.id)
                  ? "border-2 border-red-400 p-2 rounded-lg"
                  : ""
              }`}
            >
              {q.choices.map((choice, index) => (
                <label
                  key={index}
                  className={`cursor-pointer flex items-center gap-2 rounded-xl px-4 py-2 transition hover:bg-purple-300 ${
                    answers[q.id] === choice.id
                      ? "bg-purple-300 border-purple-400 border-2"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={choice.id}
                    onChange={() => handleChange(q.id, choice.id)}
                    className="hidden"
                  />
                  <div className="grid grid-cols-1 grid-rows-2 gap-2 place-items-center">
                    <span>
                      <img
                        src={choice.emoji}
                        alt={choice.label}
                        width="48"
                        height="48"
                      />
                    </span>
                    <span className="text-xs font-quicksand text-center">
                      {choice.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-center mt-5 ">
          <button
            type="submit"
            className="w-18 h-18 cursor-pointer bg-purple-400 text-white px-6 py-2 rounded-full shadow-2xl hover:bg-purple-500 transition duration-200"
          >
            <PiArrowFatLinesRightFill size={25} />
          </button>
        </div>
      </form>
    </div>
  );
}
