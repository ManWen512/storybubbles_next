// components/StartScreen.jsx
"use client";

export default function StartScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-quicksand">
      <h1 className="text-4xl font-bold mb-8">Milo's Adventure</h1>
      <button
        onClick={onStart}
        className="px-8 py-5 bg-purple-400 text-white rounded-full text-xl font-semibold hover:bg-purple-500 transition-colors"
      >
        Start Story
      </button>
    </div>
  );
}