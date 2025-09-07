"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { color, motion } from "framer-motion";
import confetti from "canvas-confetti";
import Image from "next/image";
import { fetchAnswers } from "@/redux/slices/storyAnswerSlice"; // our slice
import SoundButton from "../components/soundButton";
import AnswersPopup from "../components/answersPopup";
import LoadingScreen from "../components/loadingScreen";
import RewardMessage from "../components/rewardMessage";

export default function EndingPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // --- Client-only state ---
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("User");
  const [isMounted, setIsMounted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const { answers, loading, error } = useSelector((state) => state.answers);

  let storyName = "";
  let story = "The Forest"; // Default value

  if (typeof window !== "undefined") {
    story = localStorage.getItem("currentStory") || "The Forest";
  }

  // Map story to API identifier
  if (story === "The Forest") {
    storyName = "story1";
  } else if (story === "The Kingdom of Lost Words") {
    storyName = "story2";
  } else {
    storyName = "story3";
  }

  useEffect(() => {
    // Mark that component is mounted (client)
    setIsMounted(true);

    // Load browser-only data
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);

    const storedProfile = localStorage.getItem("profileImage");
    if (storedProfile) setProfileImage(storedProfile);

    // Fetch answers
    dispatch(fetchAnswers(storyName));

    // Confetti effect
    const end = Date.now() + 2 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  }, [dispatch]);

  // Prevent server/client mismatch
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingScreen />
      </div>
    );
  }

  // Transform answers for scoring
  const storyData = answers.length > 0 ? answers[0][storyName] || {} : {};
  const totalQuestions = Object.keys(storyData).length;
  const allQuestions = Object.values(storyData);
  const correctCount = allQuestions.filter((q) => q.isCorrect).length;
  const scorePercent = totalQuestions
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  const getPerformanceMessage = () => {
    if (scorePercent >= 90)
      return { message: "Outstanding! 🌟", color: "text-green-600" };
    if (scorePercent >= 80)
      return { message: "Excellent work! 🎉", color: "text-blue-600" };
    if (scorePercent >= 70)
      return { message: "Good job! 👍", color: "text-purple-600" };
    return { message: "Keep practicing! 📚", color: "text-yellow-600" };
  };



  // Map q1 → story1_q1, q2 → story1_q2, etc.
  const questionsForPopup = Object.keys(storyData).map((key, index) => {
    const newKey = `${storyName}_q${index + 1}`;
    const data = storyData[key];
    return {
      question: newKey, // story1_q1, story1_q2, ...
      answer: data.answer || "No answer",
      isCorrect: data.isCorrect || false,
    };
  });

  const handleNextStory = () => {
    // Get current story from localStorage
    const currentStory = localStorage.getItem("currentStory");

    // Determine next route based on current story
    switch (currentStory) {
      case "The Forest":
        router.push("/story2");
        break;
      case "The Kingdom of Lost Words":
        router.push("/story3");
        break;
      case "The Ocean of Stolen Stories": // assuming this is story3's name
        router.push("/");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 py-12 px-4 font-quicksand">
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Profile */}
        <div className="text-center mb-8">
          <div className="relative w-32 h-32 mx-auto mb-4">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="rounded-full object-cover border-4 border-purple-500"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-purple-200 border-4 border-purple-500 flex items-center justify-center">
                <span className="text-4xl text-purple-600">👤</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Great Job, {username}!
          </h1>
          <p className="text-gray-600">
            You've completed Story:{" "}
            <span className="font-semibold text-purple-600">{storyName}</span>
          </p>
          {totalQuestions > 0 && (
            <>
            <div
              className={`mt-2 text-lg font-medium ${
                getPerformanceMessage().color
              }`}
            >
              {getPerformanceMessage().message}

            </div>
            <RewardMessage storyName={storyName} scorePercent={scorePercent} />
            </>
            
          )}
        </div>

        {/* Score Cards */}
        {totalQuestions > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 p-6 rounded-xl text-center border border-purple-200">
              <p className="text-4xl font-bold text-purple-600 mb-2">
                {scorePercent}%
              </p>
              <p className="text-gray-600">Story Score</p>
            </div>
            <div className="bg-pink-50 p-6 rounded-xl text-center border border-pink-200">
              <p className="text-4xl font-bold text-pink-600">
                {correctCount}/{totalQuestions}
              </p>
              <p className="text-gray-600">Questions Answered</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center border border-green-200">
              <p className="text-xl font-bold text-green-600">
                {scorePercent >= 80 ? "Completed" : "Retry Needed"}
              </p>
              <p className="text-gray-600">Status</p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-6 rounded-xl text-center border border-yellow-200 mb-8">
            <p className="text-gray-700">
              No answers found for this story yet.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="text-center space-x-4">
          {totalQuestions > 0 && (
            <SoundButton
              onClick={() => setShowAnswers(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg"
            >
              📋 View Answers
            </SoundButton>
          )}
          <SoundButton
            onClick={handleNextStory}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg"
          >
            Next Story
          </SoundButton>
        </div>

        {/* Answers Popup */}
        {showAnswers && (
          <AnswersPopup
            isOpen={showAnswers}
            onClose={() => setShowAnswers(false)}
            questionsPopup={questionsForPopup}
            storyName={storyName}
          />
        )}
      </motion.div>
    </div>
  );
}
