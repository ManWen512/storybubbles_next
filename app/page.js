"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen">
      {/* Main background */}
      <div
        className="absolute inset-0 bg-cover bg-center "
        style={{
          backgroundImage: 'url("/Introduction.png")',
        }}
      />

      <div
        className="absolute inset-0 bg-cover bg-center sm:hidden"
        style={{
          backgroundImage: 'url("/Homepage_sm.png")',
        }}
      />

      {/* Main content */}
      <div className="relative z-10  flex items-center justify-center  min-h-screen">
        <button
          onClick={handleLogin}
          className="absolute font-bjola bottom-20 sm:bottom-5 px-10 py-4 bg-white text-purple-500 text-2xl font-bold rounded-xl shadow-2xl hover:scale-110 transition ease-in-out delay-150"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
}
