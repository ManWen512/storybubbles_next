"use client";

import { useState, useEffect } from "react";
import { PiArrowFatLinesRightFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { fetchTest, submitTestAnswers } from "@/redux/slices/testSlice";
import { useRouter } from "next/navigation";
import Notification from "../components/notification";
import LoadingScreen from "../components/loadingScreen";
import SoundButton from "../components/soundButton";

export default function PreTest() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { preTest, status } = useSelector((state) => state.test);

  const [answers, setAnswers] = useState({});

  //Notification
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotif({ show: true, message, type });
  };

  useEffect(() => {
    dispatch(fetchTest(1)); // 1 = preTest
  }, [dispatch]);

  const handleChange = (questionIndex, choiceIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: choiceIndex,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      showNotification("User Not Found", "error");
      return;
    }

    // Create a copy of answers
    const finalAnswers = { ...answers };

    // Set default answers for unanswered questions
    preTest.forEach((question, questionIndex) => {
      if (finalAnswers[questionIndex] === undefined) {
        // Set the first choice (index 0) as default answer
        finalAnswers[questionIndex] = 0;
      }
    });

    dispatch(submitTestAnswers({ userId, answers: finalAnswers }))
      .then(() => {
        showNotification("Successfully Submitted", "success");
        router.push("/story1");
      })
      .catch((err) => {
        showNotification("Submission Failed", "error");
      });
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-emerald-50 via-emerald-200 to-emerald-50">
      <div className="max-w-3xl mx-auto p-4 ">
        <Notification
          show={notif.show}
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif({ ...notif, show: false })}
        />
        <h1 className="text-2xl font-quicksand font-bold mb-6">
          Game Feedback Form
        </h1>

        {status === "loading" ? (
          <div className="flex items-center justify-center">
            <LoadingScreen />
          </div>
        ) : (
          ""
        )}

        {status === "failed" ? (
          <p className="text-center text-red-500">Failed to load questions.</p>
        ) : (
          ""
        )}
        <form onSubmit={handleSubmit}>
          {preTest.map((q, questionIndex) => (
            <div key={questionIndex} className="mb-6">
              <h2 className="text-lg font-quicksand mb-2">
                {questionIndex + 1}. {q.questionText}
              </h2>
              <div className="grid grid-cols-5 gap-1 place-items-center">
                {q.choices.map((choice, choiceIndex) => (
                  <label
                    key={choiceIndex}
                    className={`cursor-pointer flex items-center gap-2 rounded-xl px-4 py-2 transition hover:bg-purple-300 ${
                      answers[questionIndex] === choiceIndex
                        ? "bg-purple-300 border-purple-400 border-2"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={choiceIndex}
                      onChange={() => handleChange(questionIndex, choiceIndex)}
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
            <SoundButton
              type="submit"
              className="w-18 h-18 cursor-pointer bg-purple-400 text-white px-6 py-2 rounded-full shadow-2xl hover:bg-purple-500 transition duration-200"
            >
              <PiArrowFatLinesRightFill size={25} />
            </SoundButton>
          </div>
        </form>
      </div>
    </div>
  );
}
