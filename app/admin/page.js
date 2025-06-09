"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

// Mock data for multiple users
const mockUsers = [
  {
    id: "1b6ec734-9b7e-4706-a02a-afd08ca6c258",
    username: "Second Kid",
    profileImage: "https://s3.eu-west-2.amazonaws.com/nlm.aws.storybubbles/dsa_bst.drawio.png",
    default_PROFILE_IMAGE: "1",
    userTests: [
      [
        { questionText: "How much fun did you have playing the game?", userAnswerText: "Not Answered" },
        { questionText: "How interested were you in the story of the game?", userAnswerText: "Not Answered" },
        { questionText: "How motivated were you to keep playing the game?", userAnswerText: "Not Answered" },
        { questionText: "Did you feel proud when you completed a level or challenge?", userAnswerText: "Not Answered" },
        { questionText: "Was the game too easy, too hard, or just right for you?", userAnswerText: "Not Answered" },
        { questionText: "How good did you feel after finishing a tough task or puzzle?", userAnswerText: "Not Answered" },
        { questionText: "Did you learn something new while playing the game?", userAnswerText: "Not Answered" },
        { questionText: "Would you want to play this game again?", userAnswerText: "Not Answered" },
        { questionText: "How much did you like the characters in the game?", userAnswerText: "Not Answered" },
        { questionText: "Did getting rewards make you want to keep playing?", userAnswerText: "Not Answered" }
      ],
      [
        { questionText: "How much fun did you have playing the game?", userAnswerText: "Not Answered" },
        { questionText: "How interested were you in the story of the game?", userAnswerText: "Not Answered" },
        { questionText: "How motivated were you to keep playing the game?", userAnswerText: "Not Answered" },
        { questionText: "Did you feel proud when you completed a level or challenge?", userAnswerText: "Not Answered" },
        { questionText: "Was the game too easy, too hard, or just right for you?", userAnswerText: "Not Answered" },
        { questionText: "How good did you feel after finishing a tough task or puzzle?", userAnswerText: "Not Answered" },
        { questionText: "Did you learn something new while playing the game?", userAnswerText: "Not Answered" },
        { questionText: "Would you want to play this game again?", userAnswerText: "Not Answered" },
        { questionText: "How much did you like the characters in the game?", userAnswerText: "Not Answered" },
        { questionText: "Did getting rewards make you want to keep playing?", userAnswerText: "Not Answered" }
      ]
    ],
    userStories: [
      {
        answersList: [
          { correct: "false", correctAnswerText: "East", questionText: "Milo heard a crying voice coming from the direction of the sun. Which direction does the sun rise from?", userAnswerText: "Not Answered" },
          { correct: "false", correctAnswerText: "Tree", questionText: "What's something with leaves?", userAnswerText: "Not Answered" },
          { correct: "false", correctAnswerText: "Banana", questionText: "I'm yellow and I peel, you can eat me as a snack. I grow on a tall, green plant. What am I?", userAnswerText: "Not Answered" },
          { correct: "false", correctAnswerText: "Fruit", questionText: "I grow on trees, but I'm not a leaf. What am I?", userAnswerText: "Not Answered" },
          { correct: "false", correctAnswerText: "Flow", questionText: "What does the river do with the stream? It rhymes with 'row'.", userAnswerText: "Not Answered" },
          { correct: "false", correctAnswerText: "Float", questionText: "How did the book travel through the river stream? It rhymes with 'boat'.", userAnswerText: "Not Answered" },
          { correct: "false", correctAnswerText: "Castle", questionText: "Where do kings and knights live?", userAnswerText: "Not Answered" },
          { correct: "false", correctAnswerText: "Sword", questionText: "Which weapons do kings and knights use to fight?", userAnswerText: "Not Answered" }
        ],
        correctCount: 0
      }
    ],
    totalCorrectCount: 0
  },
  {
    id: "2c7fd845-0c8f-5817-b13b-bfe19db7d369",
    username: "First Kid",
    profileImage: "https://s3.eu-west-2.amazonaws.com/nlm.aws.storybubbles/dsa_bst.drawio.png",
    default_PROFILE_IMAGE: "1",
    userTests: [
      [
        { questionText: "How much fun did you have playing the game?", userAnswerText: "Very Fun" },
        { questionText: "How interested were you in the story of the game?", userAnswerText: "Very Interested" },
        { questionText: "How motivated were you to keep playing the game?", userAnswerText: "Very Motivated" },
        { questionText: "Did you feel proud when you completed a level or challenge?", userAnswerText: "Yes" },
        { questionText: "Was the game too easy, too hard, or just right for you?", userAnswerText: "Just Right" },
        { questionText: "How good did you feel after finishing a tough task or puzzle?", userAnswerText: "Very Good" },
        { questionText: "Did you learn something new while playing the game?", userAnswerText: "Yes" },
        { questionText: "Would you want to play this game again?", userAnswerText: "Yes" },
        { questionText: "How much did you like the characters in the game?", userAnswerText: "Liked Very Much" },
        { questionText: "Did getting rewards make you want to keep playing?", userAnswerText: "Yes" }
      ],
      [
        { questionText: "How much fun did you have playing the game?", userAnswerText: "Very Fun" },
        { questionText: "How interested were you in the story of the game?", userAnswerText: "Very Interested" },
        { questionText: "How motivated were you to keep playing the game?", userAnswerText: "Very Motivated" },
        { questionText: "Did you feel proud when you completed a level or challenge?", userAnswerText: "Yes" },
        { questionText: "Was the game too easy, too hard, or just right for you?", userAnswerText: "Just Right" },
        { questionText: "How good did you feel after finishing a tough task or puzzle?", userAnswerText: "Very Good" },
        { questionText: "Did you learn something new while playing the game?", userAnswerText: "Yes" },
        { questionText: "Would you want to play this game again?", userAnswerText: "Yes" },
        { questionText: "How much did you like the characters in the game?", userAnswerText: "Liked Very Much" },
        { questionText: "Did getting rewards make you want to keep playing?", userAnswerText: "Yes" }
      ]
    ],
    userStories: [
      {
        answersList: [
          { correct: "true", correctAnswerText: "East", questionText: "Milo heard a crying voice coming from the direction of the sun. Which direction does the sun rise from?", userAnswerText: "East" },
          { correct: "true", correctAnswerText: "Tree", questionText: "What's something with leaves?", userAnswerText: "Tree" },
          { correct: "true", correctAnswerText: "Banana", questionText: "I'm yellow and I peel, you can eat me as a snack. I grow on a tall, green plant. What am I?", userAnswerText: "Banana" },
          { correct: "true", correctAnswerText: "Fruit", questionText: "I grow on trees, but I'm not a leaf. What am I?", userAnswerText: "Fruit" },
          { correct: "true", correctAnswerText: "Flow", questionText: "What does the river do with the stream? It rhymes with 'row'.", userAnswerText: "Flow" },
          { correct: "true", correctAnswerText: "Float", questionText: "How did the book travel through the river stream? It rhymes with 'boat'.", userAnswerText: "Float" },
          { correct: "true", correctAnswerText: "Castle", questionText: "Where do kings and knights live?", userAnswerText: "Castle" },
          { correct: "true", correctAnswerText: "Sword", questionText: "Which weapons do kings and knights use to fight?", userAnswerText: "Sword" }
        ],
        correctCount: 8
      }
    ],
    totalCorrectCount: 8
  }
];

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">User Results Dashboard</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pre-Test</th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post-Test</th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Survey</th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Story 1</th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Story 2</th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Story 3</th>
                  <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleRowClick(user)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 border-b">
                      <div className="flex items-center">
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <span className="text-sm font-medium text-gray-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {user.userTests[0].filter(q => q.userAnswerText !== "Not Answered").length}/10
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {user.userTests[1].filter(q => q.userAnswerText !== "Not Answered").length}/10
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {user.userTests[0].filter(q => q.userAnswerText !== "Not Answered").length}/10
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {user.userStories[0]?.correctCount || 0}/8
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {user.userStories[1]?.correctCount || 0}/8
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {user.userStories[2]?.correctCount || 0}/8
                    </td>
                    <td className="px-6 py-4 border-b text-sm font-medium text-gray-900">
                      {user.totalCorrectCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for detailed view */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Detailed Results for {selectedUser.username}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Pre-Test Results */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Pre-Test Results</h3>
                <div className="space-y-2">
                  {selectedUser.userTests[0].map((test, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <p className="font-medium">{test.questionText}</p>
                      <p className="text-gray-600">Answer: {test.userAnswerText}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post-Test Results */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Post-Test Results</h3>
                <div className="space-y-2">
                  {selectedUser.userTests[1].map((test, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <p className="font-medium">{test.questionText}</p>
                      <p className="text-gray-600">Answer: {test.userAnswerText}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Story Results */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Story Results</h3>
                {selectedUser.userStories.map((story, storyIndex) => (
                  <div key={storyIndex} className="mb-4">
                    <h4 className="font-medium mb-2">Story {storyIndex + 1}</h4>
                    <div className="space-y-2">
                      {story.answersList.map((answer, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded ${
                            answer.correct === "true"
                              ? "bg-green-50 border border-green-200"
                              : "bg-red-50 border border-red-200"
                          }`}
                        >
                          <p className="font-medium">{answer.questionText}</p>
                          <p className="text-gray-600">User's Answer: {answer.userAnswerText}</p>
                          <p className="text-gray-600">Correct Answer: {answer.correctAnswerText}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 