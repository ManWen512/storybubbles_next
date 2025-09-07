export default function RewardMessage({storyName, scorePercent}) {
  
  const getRewardMessage = () => {
    if (storyName === "story1") {
      if (scorePercent >= 90) {
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <span>You earned the Pheonix Badge!</span>
            <div className="bg-slate-100 rounded-full p-5 mt-5">
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f426_200d_1f525/512.gif"
                alt="Pheonix Badge"
                width={120}
                height={120}
              />
            </div>
          </div>
        );
      } else if (scorePercent >= 80) {
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <span>You earned the Eagle Badge!</span>
            <div className="bg-slate-100 rounded-full p-5 mt-5">
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f985/512.gif"
                alt="Eagle Badge"
                width={120}
                height={120}
              />
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <span>You earned the Peacock Badge!</span>
            <div className="bg-slate-100 rounded-full p-5 mt-5">
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f99a/512.gif"
                alt="Peacock Badge"
                width={120}
                height={120}
              />
            </div>
          </div>
        );
      }
    }

    if (storyName === "story2") {
      if (scorePercent >= 90) {
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <span>You earned the T-rex Badge!</span>
            <div className="bg-slate-100 rounded-full p-5 mt-5">
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f996/512.gif"
                alt="T-rex Badge"
                width={120}
                height={120}
              />
            </div>
          </div>
        );
      } else if (scorePercent >= 80) {
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <span>You earned the Dinosaur Badge!</span>
            <div className="bg-slate-100 rounded-full p-5 mt-5">
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f995/512.gif"
                alt="Dinosaur Badge"
                width={120}
                height={120}
              />
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <span>You earned the Turtle Badge!</span>
            <div className="bg-slate-100 rounded-full p-5 mt-5">
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f422/512.gif"
                alt="Turtle Badge"
                width={120}
                height={120}
              />
            </div>
          </div>
        );
      }
    }

    if (storyName === "story3") {
      if (scorePercent >= 90) {
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <span>You earned the Shark Badge!</span>
            <div className="bg-slate-100 rounded-full p-5 mt-5">
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f988/512.gif"
                alt="Shark Badge"
                width={120}
                height={120}
              />
            </div>
          </div>
        );
      } else if (scorePercent >= 80) {
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <span>You earned the Dolphin Badge!</span>
            <div className="bg-slate-100 rounded-full p-5 mt-5">
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f42c/512.gif"
                alt="Dolphin Badge"
                width={120}
                height={120}
              />
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <span>You earned the Whale Badge!</span>
            <div className="bg-slate-100 rounded-full p-5 mt-5">
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f433/512.gif"
                alt="Whale Badge"
                width={120}
                height={120}
              />
            </div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="flex items-center justify-center">{getRewardMessage()}</div>
  );
}
