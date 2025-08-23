// components/StoryImage.jsx
"use client";

import Image from "next/image";

export default function StoryImage({ imageUrl }) {
  return (
    <div className="w-full max-w-lg 2xl:max-w-2xl mx-auto mb-6">
      <Image
        src={imageUrl}
        alt="Story scene"
        width={800} // Adjust based on your layout
        height={600} // Adjust to maintain aspect ratio
        className="rounded-lg shadow-lg"
        unoptimized // <-- disables Next.js optimization, serves original S3 URL
        priority
      />
    </div>
  );
}
