import { useEffect, useState } from 'react';

export default function RewardMessage({ storyName, scorePercent }) {
  const [allRewards, setAllRewards] = useState([]);

  // Badge configuration for each story
  const badgeConfig = {
    story1: {
      theme: "Birds",
      badges: {
        90: { name: "Phoenix Badge", emoji: "1f426_200d_1f525", alt: "Phoenix Badge" },
        80: { name: "Eagle Badge", emoji: "1f985", alt: "Eagle Badge" },
        0: { name: "Peacock Badge", emoji: "1f99a", alt: "Peacock Badge" }
      }
    },
    story2: {
      theme: "Prehistoric",
      badges: {
        90: { name: "T-rex Badge", emoji: "1f996", alt: "T-rex Badge" },
        80: { name: "Dinosaur Badge", emoji: "1f995", alt: "Dinosaur Badge" },
        0: { name: "Turtle Badge", emoji: "1f422", alt: "Turtle Badge" }
      }
    },
    story3: {
      theme: "Ocean",
      badges: {
        90: { name: "Shark Badge", emoji: "1f988", alt: "Shark Badge" },
        80: { name: "Dolphin Badge", emoji: "1f42c", alt: "Dolphin Badge" },
        0: { name: "Whale Badge", emoji: "1f433", alt: "Whale Badge" }
      }
    }
  };

  // Get badge based on score
  const getBadgeForScore = (story, score) => {
    const config = badgeConfig[story];
    if (!config) return null;

    if (score >= 90) return config.badges[90];
    if (score >= 80) return config.badges[80];
    return config.badges[0];
  };

  // Load rewards from localStorage
  const loadRewards = () => {
    try {
      const saved = localStorage.getItem('storyRewards');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading rewards:', error);
      return {};
    }
  };

  // Save rewards to localStorage
  const saveRewards = (rewards) => {
    try {
      localStorage.setItem('storyRewards', JSON.stringify(rewards));
    } catch (error) {
      console.error('Error saving rewards:', error);
    }
  };

  // Save current reward and load all rewards
  useEffect(() => {
    const currentBadge = getBadgeForScore(storyName, scorePercent);
    if (!currentBadge) return;

    // Load existing rewards
    const existingRewards = loadRewards();
    
    // Add current reward
    const updatedRewards = {
      ...existingRewards,
      [storyName]: {
        badge: currentBadge,
        score: scorePercent,
        earnedAt: new Date().toISOString()
      }
    };

    // Save updated rewards
    saveRewards(updatedRewards);

    // Create array of all earned rewards up to current story
    const rewardArray = [];
    const storyOrder = ['story1', 'story2', 'story3'];
    const currentStoryIndex = storyOrder.indexOf(storyName);
    
    for (let i = 0; i <= currentStoryIndex; i++) {
      const story = storyOrder[i];
      if (updatedRewards[story]) {
        rewardArray.push({
          story,
          ...updatedRewards[story]
        });
      }
    }

    setAllRewards(rewardArray);
  }, [storyName, scorePercent]);

  // Render a single badge
  const renderBadge = (reward, index, isNewBadge = false) => (
    <div 
      key={`${reward.story}-${index}`}
      className={`flex flex-col items-center justify-center gap-2 transition-all duration-500 ${
        isNewBadge ? 'animate-pulse scale-105' : ''
      }`}
    >
      <span className={`text-sm font-medium text-center ${isNewBadge ? 'text-green-600' : 'text-gray-600'}`}>
        {isNewBadge ? `🎉 ${reward.badge.name}!` : reward.badge.name}
      </span>
      <div className={`bg-slate-100 rounded-full p-4 transition-all duration-300 ${
        isNewBadge ? 'ring-4 ring-green-200 shadow-lg' : 'ring-2 ring-gray-200'
      }`}>
        <img
          src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${reward.badge.emoji}/512.gif`}
          alt={reward.badge.alt}
          width={90}
          height={90}
          className="transition-all duration-300"
        />
      </div>
      <div className={`text-xs px-2 py-1 rounded-full ${
        isNewBadge ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}>
        Score: {reward.score}%
      </div>
      {isNewBadge && (
        <div className="text-xs text-green-500 font-medium">
          ✨ NEW ✨
        </div>
      )}
    </div>
  );

  if (allRewards.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      {/* Current/New Badge (highlighted) */}
      <div className="text-center">
        <h3 className="text-lg font-bold mb-4 text-green-600">
          {allRewards.length === 1 ? 'Your First Badge!' : 'New Badge Earned!'}
        </h3>
        {renderBadge(allRewards[allRewards.length - 1], allRewards.length - 1, true)}
      </div>

      {/* Previous Badges */}
      {allRewards.length > 1 && (
        <div className="w-full">
          <h4 className="text-md font-semibold mb-3 text-center text-gray-700">
            Your Collection ({allRewards.length - 1} previous badge{allRewards.length > 2 ? 's' : ''})
          </h4>
          <div className="flex justify-center gap-4 flex-wrap">
            {allRewards.slice(0, -1).map((reward, index) => 
              renderBadge(reward, index, false)
            )}
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="flex gap-2 mt-4">
        {['story1', 'story2', 'story3'].map((story, index) => {
          const hasReward = allRewards.some(r => r.story === story);
          const isCurrent = story === storyName;
          
          return (
            <div
              key={story}
              className={`w-3 h-3 rounded-full ${
                hasReward 
                  ? isCurrent 
                    ? 'bg-green-500 ring-2 ring-green-200' 
                    : 'bg-green-400'
                  : 'bg-gray-200'
              }`}
              title={`Story ${index + 1}${hasReward ? ' - Complete' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}