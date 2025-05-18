import TypewriterDialogueBox from './typeWriter';
import QuestionBox from './QuestionBox';

export default function SceneDisplay({
  image,
  dialogue,
  showDialogue,
  onDialogueComplete,
  showQuestion,
  question,
  onQuestionAnswered,
}) {
  return (
    <div className="w-full max-w-md text-center">
      {image && (
        <img
          src={image}
          alt="Scene"
          className="w-full mb-4 rounded-lg shadow-md"
        />
      )}

      {showDialogue && (
        <TypewriterDialogueBox
          text={dialogue}
          speed={60}
          onComplete={onDialogueComplete}
        />
      )}

      {!showDialogue && showQuestion && question && (
        <QuestionBox question={question} onAnswered={onQuestionAnswered} />
      )}
    </div>
  );
}
