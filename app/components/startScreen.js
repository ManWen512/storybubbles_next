// components/StartScreen.jsx
"use client";
import SoundButton from "./soundButton";

export default function StartScreen({ onStart, storyName }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-quicksand bg-gradient-to-br from-emerald-50 via-emerald-200 to-emerald-50">
      <h1 className="text-4xl font-bold mb-8 p-6 text-center">{storyName}</h1>
      <SoundButton
        onClick={onStart}
        className="px-8 py-5 bg-purple-400 text-white rounded-full text-xl font-semibold hover:bg-purple-500 transition-colors"
      >
        Start Story
      </SoundButton>
    </div>
  );
}