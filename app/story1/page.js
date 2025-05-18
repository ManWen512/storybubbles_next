'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStory } from '@/redux/slices/storySlice';
import TypewriterDialogueBox from '../components/typeWriter';
import QuestionBox from '../components/questionBox';
import { motion, AnimatePresence } from 'framer-motion';

const StoryPlayer = () => {
  const dispatch = useDispatch();
  const { storyOne, status } = useSelector((state) => state.story);

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showNextDialogue, setShowNextDialogue] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchStory(1)); // Fetch storyOne on mount
  }, [dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (!storyOne?.scenes || storyOne.scenes.length === 0)
    return <p>No story data available.</p>;

  const scenes = storyOne.scenes;
  const currentScene = scenes[currentSceneIndex];
  const currentDialogue = currentScene.dialogues[currentDialogueIndex];
  const currentImage = currentScene.pictures[0];
  const questions = currentScene.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleDialogueComplete = () => {
    setShowNextDialogue(false);
    setTimeout(() => {
      if (currentDialogueIndex + 1 < currentScene.dialogues.length) {
        setCurrentDialogueIndex((prev) => prev + 1);
        setShowNextDialogue(true);
      } else {
        // All dialogues finished
        if (questions.length > 0) {
          setShowQuestion(true);
        } else {
          goToNextScene();
        }
      }
    }, 1000);
  };

  const handleQuestionAnswered = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowQuestion(false);
      goToNextScene();
    }
  };

  const goToNextScene = () => {
    if (currentSceneIndex + 1 < scenes.length) {
      setCurrentSceneIndex((prev) => prev + 1);
      setCurrentDialogueIndex(0);
      setCurrentQuestionIndex(0);
      setShowNextDialogue(true);
    } else {
      // End of story
      console.log('Story completed!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-white grid grid-rows-[auto_auto_1fr] items-center justify-items-center p-4 gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSceneIndex}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl grid grid-rows-[auto_auto_1fr] items-center justify-items-center gap-4"
        >
          {/* Row 1: Title */}
          <motion.h1
            className="text-2xl font-bold font-quicksand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {currentScene.story.name}
          </motion.h1>
  
          {/* Row 2: Image */}
          <motion.img
            key={currentImage}
            src={currentImage}
            alt="Scene"
            className="w-full max-w-md rounded-lg shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
  
          {/* Row 3: Dialogue or Question */}
          <div className="w-full max-w-md flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showNextDialogue && (
                <motion.div
                  key={`dialogue-${currentDialogueIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TypewriterDialogueBox
                    text={currentDialogue}
                    speed={60}
                    onComplete={handleDialogueComplete}
                  />
                </motion.div>
              )}
  
              {showQuestion && (
                <motion.div
                  key={`question-${currentQuestionIndex}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <QuestionBox
                    question={currentQuestion}
                    onAnswered={handleQuestionAnswered}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
  
};

export default StoryPlayer;