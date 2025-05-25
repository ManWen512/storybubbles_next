// components/StoryImage.jsx
"use client";

export default function StoryImage({ imageUrl }) {
  return (
    <div className="w-full max-w-xl xl:max-w-lg mx-auto mb-6">
      <img 
        src={imageUrl} 
        alt="Story scene" 
        className="w-md h-auto rounded-lg shadow-lg"
        loading="lazy"
      />
    </div>
  );
}