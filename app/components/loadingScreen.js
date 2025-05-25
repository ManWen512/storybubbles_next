"use client";

import dynamic from 'next/dynamic';
import loadingAnimation from "@/public/loadingAnimation.json";

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <div className="w-32 h-32 bg-purple-200 rounded-full animate-pulse" />
});

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
};

export default LoadingScreen;
