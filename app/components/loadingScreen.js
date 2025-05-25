import Lottie from "lottie-react";
import loadingAnimation from "@/public/loadingAnimation.json"; // Your animation file

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
};

export default LoadingScreen;
