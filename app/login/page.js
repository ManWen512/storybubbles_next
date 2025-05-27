"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileImages, createUser } from "@/redux/slices/profileSlice";
import { useRouter } from "next/navigation";
import { PiArrowFatLinesRightFill } from "react-icons/pi";
import Notification from "@/app/components/notification";
import LoadingScreen from "../components/loadingScreen";
import SoundButton from "../components/soundButton";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { images, loading, error } = useSelector((state) => state.profile);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    dispatch(fetchProfileImages());
  }, [dispatch]);

  //Notification
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotif({ show: true, message, type });
  };

  //handleSubmit
  const handleSubmit = () => {
    if (!username || selectedIndex === null) {
      showNotification("Please enter a username and select an image.", "error");
      return;
    } else if (username.trim().length < 4) {
      showNotification("Username must be more than 3 letters", "error");
      return;
    }

    const selectedImageUrl = images[selectedIndex];

    dispatch(createUser({ username, profileImage: selectedImageUrl }))
      .unwrap()
      .then((data) => {
        // Store user ID in local storage
        if (data && data.id) {
          localStorage.setItem("userId", data.id);
        }
        showNotification("User successfully created!", "success");
        
        // Check if there's a redirect URL stored
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin'); // Clean up
          router.push(redirectUrl);
        } else {
          router.push("/preTest");
        }
      })
      .catch((err) => {
        showNotification("Failed to create user: " + err, "error");
      });
  };

  return (
    <div className="p-4">
      <Notification
        show={notif.show}
        message={notif.message}
        type={notif.type}
        onClose={() => setNotif({ ...notif, show: false })}
      />
      <h1 className="text-xl font-bold mb-4">Profile Images</h1>

      {loading && (
        <div className="flex items-center justify-center">
          <LoadingScreen />
        </div>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 place-items-center">
          {images.map((img, index) => (
            <img
              key={index}
              src={img} // Adjust according to your API response
              alt={`Profile ${index}`}
              onClick={() => setSelectedIndex(index)}
              className={`w-36 h-36 rounded-2xl shadow cursor-pointer transition duration-200 ${
                selectedIndex === index
                  ? "ring-4 ring-purple-400"
                  : "hover:ring-2 hover:ring-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 w-64 h-12 text-center focus:outline-none focus:ring-4 focus:ring-purple-400 dark:text-black font-quicksand"
        />
      </div>
      <div className="flex justify-center mt-5">
        <SoundButton
          onClick={handleSubmit}
          className="w-18 h-18 cursor-pointer bg-purple-400 text-white px-6 py-2 rounded-full shadow-2xl hover:bg-purple-500 transition duration-200"
        >
          <PiArrowFatLinesRightFill size={25} />
        </SoundButton>
      </div>
    </div>
  );
}
