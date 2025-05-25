// app/story-one/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStory } from "@/redux/slices/storySlice";
import StartScreen from "../components/startScreen";
import StoryImage from "../components/storyImage";
import Dialogue from "../components/dialogue";
import QuestionTask from "../components/questionTask";
import AudioControls from "../components/audioControls";
import { Howl } from "howler";
import { motion, AnimatePresence } from "framer-motion";

export default function StoryOne() {
  const dispatch = useDispatch();
  const { storyOne, status } = useSelector((state) => state.story);
  const [bgMusic, setBgMusic] = useState(null);
  const [narrativeSound, setNarrativeSound] = useState(null);

  // State management
  const [started, setStarted] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestionState, setCurrentQuestionState] = useState({
    index: 0,
    answered: false,
    showResult: false,
  });

  const messagesEndRef = useRef(null);

  // Initialize background music
  useEffect(() => {
    if (storyOne?.story?.bgMusic) {
      const music = new Howl({
        src: [storyOne.story.bgMusic],
        loop: true,
        volume: 0.5,
        html5: true,
        format: ["mp3"],
        xhr: {
          method: "GET",
          headers: {
            "Content-Type": "audio/mpeg",
          },
          withCredentials: false,
        },
        onloaderror: (id, error) => {
          console.error("Background music load error:", error);
        },
      });
      setBgMusic(music);
    }
  }, [storyOne]);

  // Initialize narrative sound
  useEffect(() => {
    if (!storyOne?.scenes?.[currentSceneIndex]) return;

    const scene = storyOne.scenes[currentSceneIndex];
    if (scene?.dialogueSounds?.[activeDialogueIndex]) {
      const sound = new Howl({
        src: [scene.dialogueSounds[activeDialogueIndex]],
        volume: 0.8,
        html5: true,
      });
      setNarrativeSound(sound);
    }
  }, [storyOne, currentSceneIndex, activeDialogueIndex]);

  // Handle background music when story starts/stops
  useEffect(() => {
    if (started && bgMusic) {
      bgMusic.play();
    } else if (bgMusic) {
      bgMusic.stop();
    }

    return () => {
      if (bgMusic) {
        bgMusic.stop();
      }
    };
  }, [started, bgMusic]);

  // Clean up narrative sound when dialogue changes
  useEffect(() => {
    return () => {
      if (narrativeSound) {
        narrativeSound.stop();
      }
    };
  }, [narrativeSound]);

  // Preload all audio files when story data loads
  useEffect(() => {
    if (storyOne?.scenes) {
      storyOne.scenes.forEach((scene) => {
        scene.dialogueSounds?.forEach((url) => {
          new Howl({
            src: [url],
            preload: true,
            html5: true,
          });
        });
      });
    }
  }, [storyOne]);

  // Fetch story data
  useEffect(() => {
    dispatch(fetchStory(1));
  }, [dispatch]);

  // Auto-scroll to bottom when content changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeDialogueIndex, showQuestion]);

  // Reset when scene changes
  useEffect(() => {
    setActiveDialogueIndex(0);
    setShowContinue(false);
    setShowQuestion(false);
  }, [currentSceneIndex]);

  // Reset question state when scene changes
  useEffect(() => {
    setCurrentQuestionState({
      index: 0,
      answered: false,
      showResult: false,
    });
  }, [currentSceneIndex]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading story...
      </div>
    );
  }

  if (!storyOne || !storyOne.scenes) {
    return (
      <div className="flex justify-center items-center h-screen">
        Story data not available
      </div>
    );
  }

  const currentScene = storyOne.scenes[currentSceneIndex];

  const handleStart = () => {
    setStarted(true);
    setActiveDialogueIndex(0);
  };

  const handleDialogueComplete = () => {
    // Check if there are more dialogues
    if (activeDialogueIndex < currentScene.dialogues.length - 1) {
      setShowContinue(true);
    } else if (currentScene.questions?.length > 0) {
      setShowQuestion(true);
    } else {
      setShowContinue(true); // Show continue button for scenes without questions
    }
  };

  const handleContinue = () => {
    setShowContinue(false);

    if (activeDialogueIndex < currentScene.dialogues.length - 1) {
      // Move to next dialogue in current scene
      setActiveDialogueIndex((prev) => prev + 1);
    } else if (currentSceneIndex < storyOne.scenes.length - 1) {
      // Move to next scene
      setCurrentSceneIndex((prev) => prev + 1);
    } else {
      console.log("Story completed!");
      // Stop background music when story ends
      if (bgMusic) {
        bgMusic.stop();
      }
    }
  };

  const handleQuestionAnswer = (isCorrect) => {
    // First show the result
    setCurrentQuestionState((prev) => ({
      ...prev,
      answered: true,
      showResult: true,
    }));

    // Then move to next question after delay
    setTimeout(() => {
      if (currentQuestionState.index < currentScene.questions.length - 1) {
        setCurrentQuestionState({
          index: currentQuestionState.index + 1,
          answered: false,
          showResult: false,
        });
      } else {
        // After last question, show continue button
        setShowQuestion(false);
        setShowContinue(true);
      }
    }, 1500); // 1.5 second delay before moving to next question
  };

  if (!started) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Audio Controls - Moved outside AnimatePresence */}
      {started && bgMusic && <AudioControls bgMusic={bgMusic} />}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSceneIndex}
          className="container mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          {/* Scene title */}
          <h2 className="text-2xl font-bold text-center mb-6">
            {currentScene.name}
          </h2>

          {/* Story image */}
          {currentScene.pictures?.length > 0 && (
            <motion.div
              key={currentScene.pictures[0]}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <StoryImage imageUrl={currentScene.pictures[0]} />
            </motion.div>
          )}

          {/* Current active dialogue */}
          {currentScene.dialogues?.[activeDialogueIndex] && (
            <motion.div
              key={activeDialogueIndex}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Dialogue
                text={currentScene.dialogues[activeDialogueIndex]}
                audioUrl={currentScene.dialogueSounds?.[activeDialogueIndex]}
                onAudioEnd={handleDialogueComplete}
                active={true}
              />
            </motion.div>
          )}

          {/* Question task */}
          {showQuestion &&
            currentScene.questions?.[currentQuestionState.index] &&
            (currentScene.questions[currentQuestionState.index].choices
              ?.length > 0 ? (
              <motion.div
                key={currentQuestionState.index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <QuestionTask
                  question={
                    currentScene.questions[currentQuestionState.index]
                      .questionText
                  }
                  choices={
                    currentScene.questions[currentQuestionState.index].choices
                  }
                  correctAnswerIndex={
                    currentScene.questions[currentQuestionState.index]
                      .correctAnswerIndex
                  }
                  onAnswer={handleQuestionAnswer}
                  answered={currentQuestionState.answered}
                  showResult={currentQuestionState.showResult}
                  questionId={
                    currentScene.questions[currentQuestionState.index].id
                  }
                />
              </motion.div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mb-4 text-red-500">
                Error: No answer choices available for this question
              </div>
            ))}

          {/* Click anywhere to continue overlay */}
          {showContinue && !showQuestion && (
            <div
              onClick={handleContinue}
              className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center cursor-pointer z-10"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-white text-xl font-semibold bg-black bg-opacity-50 px-6 py-3 rounded-lg">
                  Click anywhere to{" "}
                  {currentSceneIndex < storyOne.scenes.length - 1
                    ? "continue"
                    : "finish"}
                </p>
              </motion.div>
            </div>
          )}

          {/* Empty div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
