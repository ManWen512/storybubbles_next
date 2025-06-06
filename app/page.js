"use client";

import { useRouter } from "next/navigation";
import SplashCursor from "./components/splashCursor";
import BouncingLogo from "./components/bouncingLogo";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen">
      <SplashCursor/>
      {/* Main background */}
      <div
        className="absolute inset-0 bg-cover bg-center flex  justify-center"
        style={{
          backgroundImage: 'url("/Introduction.png")',
        }}
      >
        <BouncingLogo className="w-56 h-56 m-10"/>
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center sm:hidden"
        style={{
          backgroundImage: 'url("/Homepage_sm.png")',
        }}
      >
        <BouncingLogo className="w-48 h-48 m-5"/>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <button
          onClick={handleLogin}
          className="absolute font-quicksand bottom-20 sm:bottom-5 px-10 py-4 bg-white text-purple-500 text-2xl font-bold rounded-xl shadow-2xl hover:scale-110 transition ease-in-out delay-150"
        >
          PLAY
        </button>
      </div>
    </div>
  );
}
