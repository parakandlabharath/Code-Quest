import React, { useState } from 'react';
import { InteractiveLesson, UserProfile } from '../types';
import { soundFx } from '../utils/audio';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Coins,
  Play,
  RotateCcw
} from 'lucide-react';

interface InteractiveTutorialProps {
  lessons: InteractiveLesson[];
  userProfile: UserProfile;
  onCompleteLesson: (lessonId: string, badgeName: string, xpReward: number) => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  lessons,
  userProfile,
  onCompleteLesson
}) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const currentLesson = lessons[activeLessonIndex] || lessons[0];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = currentLesson.steps[currentStepIndex];

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Lesson Completion Modal
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);

  const handleOptionSelect = (index: number) => {
    soundFx.playClick();
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
    const correct = selectedOption === currentStep.correctOptionIndex;
    setIsCorrect(correct);

    if (correct) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }
  };

  const handleNextStep = () => {
    soundFx.playClick();
    if (currentStepIndex < currentLesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      // Completed entire lesson!
      soundFx.playCoin();
      setShowCompletionModal(true);
      onCompleteLesson(currentLesson.id, currentLesson.badgeReward.name, currentLesson.xpReward);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      soundFx.playClick();
      setCurrentStepIndex(prev => prev - 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    }
  };

  const isLessonCompleted = userProfile.unlockedBadges.includes(currentLesson.badgeReward.name);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100">
      {/* Lesson Selector Header Bar */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-4 border-b border-slate-800 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center mr-2">
          <BookOpen className="w-4 h-4 mr-1 text-amber-400" />
          Interactive Lessons ({lessons.length}):
        </span>
        {lessons.map((lsn, idx) => {
          const completed = userProfile.unlockedBadges.includes(lsn.badgeReward.name);
          const isActive = idx === activeLessonIndex;
          return (
            <button
              key={lsn.id}
              onClick={() => {
                soundFx.playClick();
                setActiveLessonIndex(idx);
                setCurrentStepIndex(0);
                setSelectedOption(null);
                setQuizSubmitted(false);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                  : completed
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80'
              }`}
            >
              <span>{lsn.badgeReward.icon}</span>
              <span>{lsn.title}</span>
              {completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Lesson Card */}
      <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Lesson Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{currentLesson.badgeReward.icon}</span>
              <h2 className="text-2xl font-black text-white">{currentLesson.title}</h2>
            </div>
            <p className="text-xs text-yellow-300 font-medium mt-1">
              "{currentLesson.funnyConcept}"
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 font-bold">
              ⚡ +{currentLesson.xpReward} XP Reward
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              🏆 Badge: {currentLesson.badgeReward.name}
            </span>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Step {currentStepIndex + 1} of {currentLesson.steps.length}: {currentStep.stepTitle}</span>
            <span>{Math.round(((currentStepIndex + 1) / currentLesson.steps.length) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-white/10">
            <div 
              className="bg-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / currentLesson.steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Narrative & Explanation */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Story Concept:</span>
          </div>
          <p>{currentStep.storyExplanation}</p>
        </div>

        {/* Code Snippet Example */}
        {currentStep.codeSnippet && (
          <div className="rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/90 font-mono text-xs shadow-inner">
            <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 text-slate-400 font-bold text-[11px] flex items-center justify-between">
              <span>Example Code Snippet</span>
              <span className="text-cyan-400">JavaScript</span>
            </div>
            <pre className="p-4 text-yellow-200/90 overflow-x-auto leading-relaxed">
              <code>{currentStep.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Interactive Mini Quiz */}
        {currentStep.quizQuestion && (
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-yellow-400/30 space-y-4">
            <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center">
              <span className="text-lg mr-2 select-none">🤔</span>
              Mini Challenge Quiz: {currentStep.quizQuestion}
            </h4>

            <div className="space-y-2">
              {currentStep.options?.map((opt, optionIdx) => (
                <button
                  key={optionIdx}
                  onClick={() => handleOptionSelect(optionIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition flex items-center justify-between ${
                    selectedOption === optionIdx
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedOption === optionIdx && <div className="w-3 h-3 rounded-full bg-cyan-400" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 uppercase tracking-wider"
              >
                Check Answer
              </button>

              {quizSubmitted && (
                <div className={`text-xs font-bold flex items-center space-x-1.5 ${isCorrect ? 'text-emerald-400' : 'text-pink-400'}`}>
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bingo! That is correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Oops! Try another option or read clue: {currentStep.hint}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition border border-white/15 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={currentStep.quizQuestion ? (!quizSubmitted || !isCorrect) : false}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/20 uppercase tracking-wider disabled:opacity-40 transform hover:scale-105 active:scale-95"
          >
            <span>{currentStepIndex === currentLesson.steps.length - 1 ? 'Finish Tutorial 🎉' : 'Next Step →'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Complete Award Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-500 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-5 animate-in zoom-in duration-300">
            <div className="text-6xl animate-bounce select-none">{currentLesson.badgeReward.icon}</div>

            <div>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-extrabold border border-purple-500/30 uppercase tracking-wider">
                Tutorial Complete!
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                Unlocked: {currentLesson.badgeReward.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {currentLesson.badgeReward.description}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[10px] text-amber-300 uppercase font-bold block">XP Earned</span>
              <span className="text-xl font-extrabold text-amber-400">+ {currentLesson.xpReward} XP</span>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                setShowCompletionModal(false);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl transition transform hover:scale-105 active:scale-95"
            >
              Continue Learning →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
