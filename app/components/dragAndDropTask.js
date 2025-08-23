"use client";

import { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Howl } from "howler";
import { PiArrowFatLinesRightFill } from "react-icons/pi";


const ItemTypes = {
  CHOICE: "choice",
};

function DraggableChoice({ choice, index, disabled }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CHOICE,
    item: { index },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <motion.div
      ref={drag}
      className={`p-3 rounded-lg shadow bg-teal-100 hover:bg-teal-200 cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      style={{ opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : 1 }}
      animate={{ scale: isDragging ? 1.08 : 1, boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {choice.label}
    </motion.div>
  );
}

function DropZone({ onDrop, hasDropped, droppedChoice, isCorrect }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CHOICE,
    drop: (item) => onDrop(item.index),
    canDrop: () => !hasDropped,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  let bgColor = "#fff";
  if (hasDropped) {
    bgColor = isCorrect ? "#bbf7d0" : "#fecaca"; // green-100 or red-100
  } else if (isOver && canDrop) {
    bgColor = "#dbeafe"; // blue-100
  }

  return (
    <motion.div
      ref={drop}
      className="border-dashed border-2 h-24 rounded-lg flex justify-center items-center text-center"
      animate={{
        backgroundColor: bgColor,
        scale: isOver && canDrop ? 1.04 : 1,
        borderColor: hasDropped ? (isCorrect ? "#22c55e" : "#ef4444") : isOver && canDrop ? "#3b82f6" : "#a3a3a3"
      }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{ minHeight: 96 }}
    >
      {hasDropped ? (
        <span className="text-lg font-bold">
           {droppedChoice.label}
        </span>
      ) : (
        <span className="text-gray-500">Drop your answer here</span>
      )}
    </motion.div>
  );
}



export default function DragAndDropTask({
  question,
  choices,
  correctAnswerIndex,
  onAnswer,
  answered,
  showResult,
  questionId,
}) {
  const [droppedIndex, setDroppedIndex] = useState(null);
  const isCorrect = droppedIndex === correctAnswerIndex;
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  // Sound cache (module-level)
  const soundCache = DragAndDropTask._soundCache || (DragAndDropTask._soundCache = new Map());

  useEffect(() => {
    // Initialize correct answer sound
    if (!soundCache.has('correct')) {
      const correctSound = new Howl({
        src: ['/sounds/correct.mp3'],
        volume: 0.5,
        html5: true,
        preload: true
      });
      soundCache.set('correct', correctSound);
    }
    correctSoundRef.current = soundCache.get('correct');

    // Initialize incorrect answer sound
    if (!soundCache.has('incorrect')) {
      const incorrectSound = new Howl({
        src: ['/sounds/incorrect.mp3'],
        volume: 0.5,
        html5: true,
        preload: true
      });
      soundCache.set('incorrect', incorrectSound);
    }
    incorrectSoundRef.current = soundCache.get('incorrect');

    return () => {
      correctSoundRef.current = null;
      incorrectSoundRef.current = null;
    };
  }, []);

  const handleDrop = (index) => {
    setDroppedIndex(index);
  };

  const handleSubmit = () => {
    if (droppedIndex !== null && !answered) {
      // Play appropriate sound
      if (droppedIndex === correctAnswerIndex) {
        correctSoundRef.current?.play();
      } else {
        incorrectSoundRef.current?.play();
      }
      // Call onAnswer
      onAnswer({ correct: droppedIndex === correctAnswerIndex, questionId });
    }
  };

  return (
    <motion.div
      key={questionId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mb-4"
    >
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-quicksand font-bold mb-4"
      >
        {question}
      </motion.h3>

      {/* Drop Zone */}
      <div className="mb-6">
        <DropZone
          onDrop={handleDrop}
          hasDropped={droppedIndex !== null}
          droppedChoice={choices[droppedIndex]}
          isCorrect={isCorrect}
        />
      </div>

      {/* Draggable Choices in 2-column grid */}
      <div className="grid grid-cols-2 gap-2">
        {choices.map((choice, index) => (
          <DraggableChoice
            key={choice.id}
            choice={choice}
            index={index}
            disabled={answered}
          />
        ))}
      </div>

      {/* Submit Button */}
      {!answered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={droppedIndex === null}
            className={`mt-4 px-4 py-4 rounded-full ${droppedIndex === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-400 text-white hover:bg-purple-600'}`}
          >
            <PiArrowFatLinesRightFill size={25} />
          </motion.button>
        </motion.div>
      )}

      {/* Result Feedback */}
      {showResult && droppedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-4 text-lg font-quicksand ${isCorrect ? "text-green-600" : "text-red-600"}`}
        >
          {isCorrect ? (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="flex items-center justify-center gap-2"
            >
              <motion.span
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3
                }}
              >
                ✓
              </motion.span>
              Correct!
            </motion.span>
          ) : (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="flex items-center justify-center gap-2"
            >
              <motion.span
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3
                }}
              >
                ✗
              </motion.span>
              Wrong! The correct answer was: {choices[correctAnswerIndex].label}
            </motion.span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

const DynamicDragAndDropTask = dynamic(() => Promise.resolve(DragAndDropTask), { ssr: false });
