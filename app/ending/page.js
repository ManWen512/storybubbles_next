"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SoundButton from '../components/soundButton';

export default function EndingPage() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    const storedUsername = localStorage.getItem('username');
    setProfileImage(storedImage);
    setUsername(storedUsername);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 py-12 px-4">
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Section */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="relative w-32 h-32 mx-auto mb-4">
            {profileImage && !imageError ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                priority
                sizes='w-full h-auto'
                className=" rounded-full object-cover border-4 border-purple-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-purple-200 border-4 border-purple-500 flex items-center justify-center">
                <span className="text-4xl text-purple-600">👤</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Great Job, {username || 'User'}!</h1>
          <p className="text-gray-600 mt-2">You've completed Story 1</p>
        </motion.div>

        {/* Progress Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Progress</h2>
          <div className="bg-gray-100 rounded-full h-4 mb-2">
            <div className="bg-purple-500 h-4 rounded-full w-1/3"></div>
          </div>
          <p className="text-gray-600">1/3 Stories Completed</p>
        </motion.div>

        {/* Score Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Score</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">Story Score</p>
              <p className="text-3xl font-bold text-purple-600">85%</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">Questions</p>
              <p className="text-3xl font-bold text-pink-600">4/5</p>
            </div>
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Achievements</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-sm text-gray-600">Story Master</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <p className="text-sm text-gray-600">Quick Learner</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-sm text-gray-600">Perfect Score</p>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <SoundButton
            onClick={() => router.push('/story2')}
            className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
          >
            Continue to Story 2
          </SoundButton>
        </motion.div>
      </motion.div>
    </div>
  );
} 