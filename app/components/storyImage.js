// components/StoryImage.jsx
"use client";

export default function StoryImage({ imageUrl }) {
  return (
    <div className="w-full max-w-lg 2xl:max-w-2xl mx-auto mb-6">
      <img 
        src={imageUrl} 
        alt="Story scene" 
        className="w-md h-auto rounded-lg shadow-lg"
        loading="lazy"
      />
    </div>
  );
}