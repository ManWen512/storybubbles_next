"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const decorations = [
    {
      name: "Milo",
      src: "/Milo.png",
      className: " w-[250vh] h-[150vw] sm:w-3/5 sm:h-4/5  ",
    },
    {
      name: "Monster1",
      src: "/Monster1.png",
      className: "  z-2 top-0 left-0  ",
    },
    {
      name: "Monster2",
      src: "/Monster2.png",
      className: "  z-2 top-0 left-0",
    },
    // {
    //   name: "Bg1",
    //   src: "/Bg1.png",
    //   className: "  z-0 top-10 left-0  sm:top-10 sm:left-10",
    // },
    // {
    //   name: "Bg2",
    //   src: "/Bg2.png",
    //   className: "  z-0 top-10 left-0  sm:top-10 sm:left-10",
    // },
  ];

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen">
      {/* Main background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/IMG_4775.PNG")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Decorative elements */}

      {decorations.map((item, index) => (
        <div key={index} className="absolute  w-full  h-full  flex overflow-auto ">
          <img
            key={index}
            src={item.src}
            alt={item.name}
            className={`${item.className}  `}
          />
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10  flex items-center justify-center min-h-screen">
        <button
          onClick={handleLogin}
          className="px-10 py-5 bg-white text-purple-700 text-2xl font-bold rounded-full shadow-lg hover:scale-105 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
