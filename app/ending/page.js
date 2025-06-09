"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import SoundButton from "../components/soundButton";
import AnswersPopup from "../components/answersPopup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStoryAnswer,
  setCurrentStoryId,
} from "@/redux/slices/storyAnswerSlice";
import LoadingScreen from "../components/loadingScreen";

export default function EndingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const { storyAnswers, currentStoryId, status, error } = useSelector(
    (state) => state.storyAnswer
  );
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    const storedUsername = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    const storyId = parseInt(localStorage.getItem("currentStoryId") || "1");

    setProfileImage(storedImage);
    setUsername(storedUsername);
    dispatch(setCurrentStoryId(storyId));

    // Fetch story answers
    if (userId && storyId) {
      dispatch(fetchStoryAnswer({ userId, storyId }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (currentStoryId && storyAnswers[currentStoryId]?.answersList) {
      const formattedQuestions = storyAnswers[currentStoryId].answersList.map(
        (answer) => ({
          id: answer.id || Math.random().toString(), // Add fallback ID if not present
          questionText: answer.questionText,
          correctAnswerText: answer.correctAnswerText,
          userAnswerText: answer.userAnswerText,
          correct: answer.correct,
        })
      );
      setQuestions(formattedQuestions);
    } else {
      setQuestions([]); // Set empty array if no data
    }
  }, [currentStoryId, storyAnswers]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const correctAnswers = questions.filter((q) => q.correct === "true").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 py-12 px-4 font-quicksand">
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Section */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="relative w-32 h-32 mx-auto mb-4">
            {profileImage && !imageError ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                priority
                sizes="w-full h-auto"
                className="rounded-full object-cover border-4 border-purple-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-purple-200 border-4 border-purple-500 flex items-center justify-center">
                <span className="text-4xl text-purple-600">👤</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Great Job, {username || "User"}!
          </h1>
          <p className="text-gray-600 mt-2">
            You've completed Story {currentStoryId}
          </p>
        </motion.div>

        {/* Progress Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Progress
          </h2>
          <div className="bg-gray-100 rounded-full h-4 mb-2">
            <div
              className="bg-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(currentStoryId / 3) * 100}%` }}
            ></div>
          </div>
          <p className="text-gray-600">{currentStoryId}/3 Stories Completed</p>
        </motion.div>
        {status === "failed" ? (
          <p className="text-center text-red-500">Failed to load questions.</p>
        ) : (
          ""
        )}
        {status === "loading" ? (
          <div className="flex items-center justify-center">
            <LoadingScreen />
          </div>
        ) : (
          <motion.div className="mb-8" variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Score
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">Story Score</p>
              <p className="text-3xl font-bold text-purple-600">
                {storyAnswers[currentStoryId]?.correctCount !== undefined
                  ? Math.round(
                      (storyAnswers[currentStoryId].correctCount / 8) * 100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">Questions</p>
              <p className="text-3xl font-bold text-pink-600">
                {storyAnswers[currentStoryId]?.correctCount !== undefined
                  ? storyAnswers[currentStoryId].correctCount
                  : 0}
                /8
              </p>
            </div>
          </div>
        </motion.div>
        )}

        {/* Score Section */}
        

        {/* Achievements Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Achievements
          </h2>
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative mb-2">
                <Image
                  src="/logo/trophy.gif"
                  alt="Trophy"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <span className="text-sm text-gray-600">Perfect Score</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative mb-2">
                <Image
                  src="/logo/star.gif"
                  alt="Star"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <span className="text-sm text-gray-600">Great Job</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative mb-2">
                <Image
                  src="/logo/bulleye.gif"
                  alt="Bullseye"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <span className="text-sm text-gray-600">On Target</span>
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="mt-8 text-center space-y-4"
          variants={itemVariants}
        >
          <SoundButton
            onClick={() => setShowAnswers(true)}
            className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors mr-4"
          >
            View Your Answers
          </SoundButton>
          {currentStoryId < 3 ? (
            <SoundButton
              onClick={() => router.push(`/story${currentStoryId + 1}`)}
              className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              Continue to Story {currentStoryId + 1}
            </SoundButton>
          ) : (
            <SoundButton
              onClick={() => router.push("/dashboard")}
              className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              Return to Dashboard
            </SoundButton>
          )}
        </motion.div>
      </motion.div>

      {/* Answers Popup */}
      <AnswersPopup
        isOpen={showAnswers}
        onClose={() => setShowAnswers(false)}
        questions={questions}
      />
    </div>
  );
}
