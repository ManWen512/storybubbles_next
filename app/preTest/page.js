"use client";

import { useState, useEffect } from "react";
import { PiArrowFatLinesRightFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests, submitTestAnswers } from "@/redux/slices/testSlice";
import { useRouter } from "next/navigation";
import Notification from "../components/notification";
import LoadingScreen from "../components/loadingScreen";
import SoundButton from "../components/soundButton";

export default function PreTest() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tests, status, loading } = useSelector((state) => state.tests);


  const [answers, setAnswers] = useState({});
  const [notif, setNotif] = useState({ show: false, message: "", type: "success" });

  // ✅ Notification
  const showNotification = (message, type = "success") => {
    setNotif({ show: true, message, type });
  };

  // ✅ Likert emojis
  const likertChoices = [
    { emoji: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif" },
    { emoji: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f615/512.gif" },
    { emoji: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.gif" },
    { emoji: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif" },
    { emoji: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.gif" },
  ];

  // ✅ Fetch test questions
  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  // ✅ Handle choice selection
  const handleChange = (questionIndex, index) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: index,
    }));
  };

  // ✅ Submit answers
  const handleSubmit = (e) => {
    e.preventDefault();

    const username = localStorage.getItem("username");
    if (!username) {
      showNotification("User Not Found", "error");
      return;
    }

    // Fill unanswered with default value 0
    const finalAnswers = {};
    tests.forEach((_, idx) => {
      finalAnswers[`question${idx + 1}`] =
        answers[idx] !== undefined ? answers[idx] : 0;
    });

    // Dispatch API call
    dispatch(
      submitTestAnswers({
        username: username,
        type: "preTest",
        answers: finalAnswers,
      })
    )
      .unwrap()
      .then(() => {
        showNotification("Successfully Submitted", "success");
         router.push("/story1")
      })
      .catch(() => showNotification("Submission Failed", "error"));
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-emerald-50 via-emerald-200 to-emerald-50">
      <div className="max-w-3xl mx-auto p-4">
        <Notification
          show={notif.show}
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif({ ...notif, show: false })}
        />
        <h1 className="text-2xl font-quicksand font-bold mb-6">
          Game Feedback Form
        </h1>

        {status === "loading" && (
          <div className="flex items-center justify-center">
            <LoadingScreen />
          </div>
        )}
        {status === "failed" && (
          <p className="text-center text-red-500">Failed to load questions.</p>
        )}

        <form onSubmit={handleSubmit}>
          {tests.map((q, questionIndex) => (
            <div key={questionIndex} className="mb-6">
              <h2 className="text-lg font-quicksand mb-2">
                {questionIndex + 1}. {q.name}
              </h2>
              <div className="grid grid-cols-5 gap-1 place-items-center">
                {likertChoices.map((choice, index) => (
                  <label
                    key={index}
                    className={`cursor-pointer flex flex-col items-center gap-1 rounded-xl p-2 transition
                      ${
                        answers[questionIndex] === index
                          ? "bg-purple-200 border-purple-400 border-2"
                          : "border border-gray-300"
                      }
                      hover:bg-purple-100`}
                    onClick={() => handleChange(questionIndex, index)}
                  >
                    <img
                      src={choice.emoji}
                      alt={`choice-${index}`}
                      width="48"
                      height="48"
                      className="pointer-events-none"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-5">
            <SoundButton
              type="submit"
              disabled={loading}
              className="w-18 h-18 cursor-pointer bg-purple-400 text-white px-6 py-2 rounded-full shadow-2xl hover:bg-purple-500 transition duration-200"
            >
              {loading ? "Submitting..." : <PiArrowFatLinesRightFill size={25} />}
            </SoundButton>
          </div>
        </form>
      </div>
    </div>
  );
}
