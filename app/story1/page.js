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
import LoadingScreen from "../components/loadingScreen";
import Notification from "../components/notification";
import ProgressBar from "../components/progressBar";
import { useRouter } from "next/navigation";

export default function StoryOne() {
  const dispatch = useDispatch();
  const { storyOne, status } = useSelector((state) => state.story);
  const [bgMusic, setBgMusic] = useState(null);
  const [narrativeSound, setNarrativeSound] = useState(null);
  const router = useRouter();

  // Update page title
  useEffect(() => {
    document.title = "Story 1 - Story Bubbles";
  }, []);

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

  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotif({ show: true, message, type });
  };

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
          showNotification("Failed to load background music", "error");
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle scrolling for questions
  useEffect(() => {
    if (showQuestion) {
      setTimeout(scrollToBottom, 100);
    } else {
      setTimeout(scrollToTop, 100);
    }
  }, [showQuestion]);

  // Handle scrolling for dialogues
  useEffect(() => {
    if (activeDialogueIndex > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [activeDialogueIndex]);

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
      <div className="flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  if (!storyOne || !storyOne.scenes) {
    return (
      <div className="flex items-center justify-center">
        <LoadingScreen />
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
      setTimeout(()=>{},500);
    } else if (currentSceneIndex < storyOne.scenes.length - 1) {
      // Move to next scene
      setCurrentSceneIndex((prev) => prev + 1);
      setTimeout(()=>{},500);
    } else {
      showNotification("Story completed! Redirecting to results...", "success");
      // Stop background music when story ends
      if (bgMusic) {
        bgMusic.stop();
      }
      // Redirect to ending page after a short delay
      setTimeout(() => {
        router.push('/ending');
      }, 500);
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
    }, 2500); // 1.5 second delay before moving to next question
  };

  if (!started) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-200 to-emerald-50 py-8">
      {/* Audio Controls - Moved outside AnimatePresence */}
      {started && bgMusic && <AudioControls bgMusic={bgMusic} />}
      
      <Notification
        show={notif.show}
        message={notif.message}
        type={notif.type}
        onClose={() => setNotif({ ...notif, show: false })}
      />

      {/* Progress Bar */}
      {started && (
        <div className="container mx-auto px-3 mb-4">
          <ProgressBar 
            currentScene={currentSceneIndex } 
            totalScenes={storyOne.scenes.length} 
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSceneIndex}
          className="container mx-auto px-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          {/* Scene title */}
          <h2 className="text-2xl font-quicksand font-bold text-center mb-4">
            {currentScene.name }
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
              key={`dialogue-${currentSceneIndex}-${activeDialogueIndex}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Dialogue
                text={currentScene.dialogues[activeDialogueIndex]}
                audioUrl={currentScene.dialogueSounds?.[activeDialogueIndex]}
                onAudioEnd={handleDialogueComplete}
                active={true}
                showContinue={showContinue}
                showQuestion={showQuestion}
                handleContinue={handleContinue}
              />
            </motion.div>
          )}

          {/* Question task */}
          {showQuestion &&
            currentScene.questions?.[currentQuestionState.index] &&
            (currentScene.questions[currentQuestionState.index].choices
              ?.length > 0 ? (
              <motion.div
                key={`question-${currentSceneIndex}-${currentQuestionState.index}`}
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
              className="fixed inset-0 bg-black bg-opacity-5 flex items-center justify-center cursor-pointer z-10"
            ></div>
          )}

          {/* Empty div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
