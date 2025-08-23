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
  setCurrentStoryName,
  setCurrentUsername,
} from "@/redux/slices/storyAnswerSlice";
import LoadingScreen from "../components/loadingScreen";
import confetti from "canvas-confetti";

export default function EndingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const {
    currentStoryAnswers,
    currentStoryName,
    currentUsername,
    status,
    error,
  } = useSelector((state) => state.storyAnswer);

  const storyName = "The Forest";



  useEffect(() => {
    // Get stored data from localStorage
    const storedImage = localStorage.getItem("profileImage");
    const storedUsername = localStorage.getItem("username");

    setProfileImage(storedImage);
    setUsername(storedUsername);

    const storyToUse = currentStoryName;
    dispatch(setCurrentUsername(storedUsername));

    // Fetch answers filtered by story name and username
    if (storedUsername) {
      dispatch(fetchStoryAnswer({ storyToUse, username: storedUsername }));
    } else {
      console.warn(
        "No username found in localStorage. Cannot fetch user-specific answers."
      );
    }
  }, [dispatch, storyName]);

  useEffect(() => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  // Get current story data
  const hasStoryData =
    currentStoryAnswers &&
    currentStoryAnswers.answersList &&
    currentStoryAnswers.answersList.length > 0;

  // Calculate score safely
  const getScorePercentage = () => {
    if (!hasStoryData || currentStoryAnswers.answersList.length === 0) return 0;
    const correctCount = getCorrectCount();
    return Math.round(
      (correctCount / currentStoryAnswers.answersList.length) * 100
    );
  };

  const getCorrectCount = () => {
    if (!hasStoryData) return 0;
    return currentStoryAnswers.answersList.filter(
      (q) => q.userAnswerText === "true"
    ).length;
  };

  const getTotalQuestions = () => {
    return hasStoryData ? currentStoryAnswers.answersList.length : 0;
  };

  // Calculate progress based on stories completed
  const calculateProgress = () => {
    // You can modify this based on your actual story completion logic
    const totalStories = 3; // Assuming 3 total stories
    const completedStories = hasStoryData ? 1 : 0;
    return Math.round((completedStories / totalStories) * 100);
  };

  // Get performance message based on score
  const getPerformanceMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90)
      return { message: "Outstanding! 🌟", color: "text-green-600" };
    if (percentage >= 80)
      return { message: "Excellent work! 🎉", color: "text-blue-600" };
    if (percentage >= 70)
      return { message: "Good job! 👍", color: "text-purple-600" };
    return { message: "Keep practicing! 📚", color: "text-yellow-600" };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const scoreVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      },
    },
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

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
                sizes="128px"
                className="rounded-full object-cover border-4 border-purple-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-purple-200 border-4 border-purple-500 flex items-center justify-center">
                <span className="text-4xl text-purple-600">👤</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Great Job, {username || "User"}!
          </h1>
          <p className="text-gray-600">
            You've completed Story:{" "}
            <span className="font-semibold text-purple-600">{storyName}</span>
          </p>
          {hasStoryData && (
            <motion.p
              className={`text-lg font-medium mt-2 ${
                getPerformanceMessage().color
              }`}
              variants={itemVariants}
            >
              {getPerformanceMessage().message}
            </motion.p>
          )}
        </motion.div>

        {/* Progress Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Progress
          </h2>
          <div className="bg-gray-100 rounded-full h-6 mb-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-6 rounded-full transition-all duration-1000 ease-out"
              initial={{ width: "0%" }}
              animate={{ width: `${calculateProgress()}%` }}
            ></motion.div>
          </div>
          <p className="text-gray-600">
            {hasStoryData ? 1 : 0}/3 Stories Completed ({calculateProgress()}
            %)
          </p>
        </motion.div>

        {/* Error State */}
        {status === "failed" && (
          <motion.div
            className="mb-8 text-center bg-red-50 p-6 rounded-lg border border-red-200"
            variants={itemVariants}
          >
            <div className="text-red-600 mb-4">
              <span className="text-3xl">⚠️</span>
              <p className="text-lg font-medium mt-2">
                Oops! Something went wrong
              </p>
              <p className="text-sm text-red-500">{error}</p>
            </div>
            <SoundButton
              onClick={() =>
                dispatch(fetchStoryAnswer({ storyName, username }))
              }
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Try Again
            </SoundButton>
          </motion.div>
        )}

        {/* Score Section */}
        {hasStoryData && (
          <motion.div className="mb-8" variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Your Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Percentage */}
              <motion.div
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center border border-purple-200"
                variants={scoreVariants}
              >
                <div className="text-purple-600 mb-2">
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-gray-600 font-medium mb-1">Story Score</p>
                <p className="text-4xl font-bold text-purple-600 mb-2">
                  {getScorePercentage()}%
                </p>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <motion.div
                    className="bg-purple-500 h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${getScorePercentage()}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                  ></motion.div>
                </div>
              </motion.div>

              {/* Questions Answered */}
              <motion.div
                className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl text-center border border-pink-200"
                variants={scoreVariants}
              >
                <div className="text-pink-600 mb-2">
                  <span className="text-3xl">❓</span>
                </div>
                <p className="text-gray-600 font-medium mb-1">Questions</p>
                <p className="text-4xl font-bold text-pink-600">
                  {getCorrectCount()}
                  <span className="text-2xl">/{getTotalQuestions()}</span>
                </p>
                <p className="text-sm text-pink-500 mt-1">
                  Answered by {username || "User"}
                </p>
              </motion.div>

              {/* Completion Status */}
              <motion.div
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center border border-green-200"
                variants={scoreVariants}
              >
                <div className="text-green-600 mb-2">
                  <span className="text-3xl">✅</span>
                </div>
                <p className="text-gray-600 font-medium mb-1">Status</p>
                <p className="text-xl font-bold text-green-600">Completed</p>
                <p className="text-sm text-green-500 mt-1">Well Done!</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* No Data State */}
        {!hasStoryData && status === "succeeded" && (
          <motion.div
            className="mb-8 text-center bg-yellow-50 p-8 rounded-lg border border-yellow-200"
            variants={itemVariants}
          >
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Story Data Found
            </h3>
            <p className="text-gray-600 mb-4">
              It looks like{" "}
              <span className="font-semibold">{username || "you"}</span> haven't
              answered any questions for "{storyName}" yet.
            </p>
            <div className="bg-white p-4 rounded-lg border border-yellow-300 mb-4">
              <p className="text-sm text-gray-600 mb-2">Debug Info:</p>
              <div className="text-xs text-left text-gray-500 space-y-1">
                <p>• Username: {username || "Not set"}</p>
                <p>• Story: {storyName}</p>
                <p>• Status: {status}</p>
                <p>• Data Available: {currentStoryAnswers ? "Yes" : "No"}</p>
              </div>
            </div>
            <SoundButton
              onClick={() => router.push("/")}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              Start a Story
            </SoundButton>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="mt-8 text-center space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center"
          variants={itemVariants}
        >
          {hasStoryData && (
            <SoundButton
              onClick={() => setShowAnswers(true)}
              className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📋 View Your Answers
            </SoundButton>
          )}

          <SoundButton
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🏠 Return to Dashboard
          </SoundButton>

          {hasStoryData && getScorePercentage() < 80 && (
            <SoundButton
              onClick={() => {
                // You can implement retry logic here
                router.push("/story2");
              }}
              className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Next Story
            </SoundButton>
          )}
        </motion.div>

        {/* Achievement Badge */}
        {hasStoryData && getScorePercentage() >= 90 && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              <span className="text-2xl mr-2">🏆</span>
              Story Master Achievement Unlocked!
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Answers Popup - Fixed the questions prop */}
      {hasStoryData && (
        <AnswersPopup
          isOpen={showAnswers}
          onClose={() => setShowAnswers(false)}
          questions={currentStoryAnswers.answersList}
          storyName={storyName}
        />
      )}
    </div>
  );
}
