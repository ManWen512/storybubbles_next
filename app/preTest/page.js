"use client";

import { useState, useEffect } from "react";
import { PiArrowFatLinesRightFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { fetchTests, submitTestAnswers } from "@/redux/slices/testSlice";
import { useRouter } from "next/navigation";
import Notification from "../components/notification";
import LoadingScreen from "../components/loadingScreen";
import SoundButton from "../components/soundButton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function PreTest() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tests, status, loading } = useSelector((state) => state.tests);
  const [language, setLanguage] = useState("english");
  const [answers, setAnswers] = useState({});
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ✅ Notification
  const showNotification = (message, type = "success") => {
    setNotif({ show: true, message, type });
  };

  // ✅ Likert emojis
  const likertChoices = [
    {
      emoji: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif",
      title: "Strongly Disagree",
    },
    {
      emoji: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f615/512.gif",
      title: "Disagree",
    },
    {
      emoji: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.gif",
      title: "Neutral",
    },
    {
      emoji: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif",
      title: "Agree",
    },
    {
      emoji: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.gif",
      title: "Strongly Agree",
    },
  ];

  // ✅ Fetch test questions
  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

   // ✅ Handle language toggle
  const handleLanguageChange = (value) => {
    if (value) {
      setLanguage(value);
    }
  };

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

    // Show success immediately and navigate
    showNotification("Successfully Submitted", "success");
    router.push("/story1");

    // Dispatch API call
    dispatch(
      submitTestAnswers({
        username: username,
        type: "preTest",
        answers: finalAnswers,
      })
    ).catch((error) => {
      console.error("Background save failed:", error);
      // Could show a discrete notification or retry logic
      // showNotification("Sync failed - will retry", "warning");
    });
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
        <div className="flex flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-quicksand font-bold mb-6">Pre-Test</h1>
          <ToggleGroup
            variant="outline"
            type="single"
            className="mb-4  "
            defaultValue="english"
            value={language}
            onValueChange={handleLanguageChange}
          >
            <ToggleGroupItem value="english" aria-label="Toggle english">
              English
            </ToggleGroupItem>
            <ToggleGroupItem value="myanmar" aria-label="Toggle myanmar">
              မြန်မာ
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

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
              <h2 className={`${language === "myanmar" ? "text-lg font-myanmar " : "text-lg font-quicksand"} mb-3`}>
                {questionIndex + 1}. {language === "english" ? q.name : q.mmtranslate}
              </h2>
              <div className="grid grid-cols-5 gap-2 place-items-center">
                {likertChoices.map((choice, index) => (
                  <label
                    key={index}
                    className={`cursor-pointer flex flex-col items-center gap-1 rounded-xl sm:p-2 p-1 transition 
                      ${
                        answers[questionIndex] === index
                          ? "bg-purple-200 border-purple-400 border-2"
                          : "border border-gray-300"
                      }
                      hover:bg-purple-100 `}
                    onClick={() => handleChange(questionIndex, index)}
                  >
                    <img
                      src={choice.emoji}
                      alt={`choice-${index}`}
                      className="pointer-events-none mb-2 w-8 h-8 sm:w-12 sm:h-12 "
                    />
                    <span className="text-center text-sm">{choice.title}</span>
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
              {loading ? (
                "Submitting..."
              ) : (
                <PiArrowFatLinesRightFill size={25} />
              )}
            </SoundButton>
          </div>
        </form>
      </div>
    </div>
  );
}
