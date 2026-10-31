import React, { useState, useEffect } from 'react';
import { Challenge, DifficultyLevel, UserProfile, AIPersona, AIHintResponse, AIRoastResponse } from '../types';
import { executeUserCode, RunResult } from '../utils/codeRunner';
import { soundFx } from '../utils/audio';
import { 
  Play, 
  Send, 
  Flame, 
  Lightbulb, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Coins, 
  Bot, 
  Cat, 
  Laugh, 
  ChevronRight, 
  Terminal,
  Code,
  ShieldAlert,
  Award
} from 'lucide-react';

interface PuzzleSolverProps {
  challenges: Challenge[];
  selectedDifficulty: DifficultyLevel;
  userProfile: UserProfile;
  onSolveChallenge: (challengeId: string, xpReward: number, coinReward: number) => void;
  onDeductCoins: (amount: number) => boolean;
}

export const PuzzleSolver: React.FC<PuzzleSolverProps> = ({
  challenges,
  selectedDifficulty,
  userProfile,
  onSolveChallenge,
  onDeductCoins
}) => {
  // Filter challenges by difficulty or show all if empty
  const filteredChallenges = challenges.filter(c => c.difficulty === selectedDifficulty);
  const activeChallenges = filteredChallenges.length > 0 ? filteredChallenges : challenges;

  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const currentChallenge = activeChallenges[activeChallengeIndex] || challenges[0];

  const [userCode, setUserCode] = useState(currentChallenge.initialCode);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'tests' | 'logs'>('tests');

  // Hint State
  const [unlockedHintIndex, setUnlockedHintIndex] = useState<number>(0);
  const [isAiHintOpen, setIsAiHintOpen] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>('meme_cat');
  const [aiHintData, setAiHintData] = useState<AIHintResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Roast State
  const [isRoastOpen, setIsRoastOpen] = useState<boolean>(false);
  const [aiRoastData, setAiRoastData] = useState<AIRoastResponse | null>(null);
  const [isRoastLoading, setIsRoastLoading] = useState<boolean>(false);

  // Victory Modal State
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  // Update initial code when challenge changes
  useEffect(() => {
    setUserCode(currentChallenge.initialCode);
    setRunResult(null);
    setUnlockedHintIndex(0);
    setAiHintData(null);
  }, [currentChallenge.id]);

  const handleRunTests = () => {
    soundFx.playClick();
    const result = executeUserCode(userCode, currentChallenge.testCases);
    setRunResult(result);
    if (result.success) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }
  };

  const handleSubmitSolution = () => {
    const result = executeUserCode(userCode, currentChallenge.testCases);
    setRunResult(result);

    if (result.success) {
      soundFx.playSuccess();
      soundFx.playCoin();
      setShowVictoryModal(true);
      onSolveChallenge(currentChallenge.id, currentChallenge.xpReward, currentChallenge.coinReward);
    } else {
      soundFx.playError();
    }
  };

  const handleResetCode = () => {
    soundFx.playClick();
    setUserCode(currentChallenge.initialCode);
    setRunResult(null);
  };

  const unlockNextHint = () => {
    if (unlockedHintIndex < currentChallenge.hints.length - 1) {
      const cost = 10;
      const success = onDeductCoins(cost);
      if (success) {
        soundFx.playCoin();
        setUnlockedHintIndex(prev => prev + 1);
      } else {
        alert('Not enough ByteCoins! Solve more puzzles or tutorials to earn ByteCoins.');
      }
    }
  };

  const handleFetchAiHint = async () => {
    setIsAiLoading(true);
    soundFx.playClick();
    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: currentChallenge.title,
          challengeDescription: currentChallenge.description,
          currentCode: userCode,
          persona: selectedPersona,
          difficulty: currentChallenge.difficulty
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiHintData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFetchAiRoast = async () => {
    setIsRoastLoading(true);
    setIsRoastOpen(true);
    soundFx.playClick();
    try {
      const res = await fetch('/api/ai/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: currentChallenge.title,
          userCode
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiRoastData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRoastLoading(false);
    }
  };

  const isSolved = userProfile.solvedIds.includes(currentChallenge.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100">
      {/* Challenge Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none border-b border-slate-800">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-2 flex items-center">
          <Code className="w-3.5 h-3.5 mr-1 text-amber-400" />
          Puzzles ({activeChallenges.length}):
        </span>
        {activeChallenges.map((ch, idx) => {
          const solved = userProfile.solvedIds.includes(ch.id);
          const isActive = idx === activeChallengeIndex;
          return (
            <button
              key={ch.id}
              onClick={() => {
                soundFx.playClick();
                setActiveChallengeIndex(idx);
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                  : solved
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/80'
              }`}
            >
              <span>{ch.title.split(' ')[0]}</span>
              <span>{ch.title.split(' ').slice(1).join(' ')}</span>
              {solved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Challenge Info + Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Narrative & Requirements & Hints (5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Challenge Header Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wide uppercase ${
                currentChallenge.difficulty === 'beginner' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : currentChallenge.difficulty === 'intermediate'
                  ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                  : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
              }`}>
                {currentChallenge.difficulty}
              </span>
              <div className="flex items-center space-x-2 text-xs font-bold">
                <span className="flex items-center text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-xl border border-yellow-400/20">
                  ⚡ +{currentChallenge.xpReward} XP
                </span>
                <span className="flex items-center text-yellow-300 bg-yellow-400/10 px-2.5 py-1 rounded-xl border border-yellow-400/20">
                  <Coins className="w-3.5 h-3.5 mr-1 text-yellow-400" /> +{currentChallenge.coinReward}
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-white flex items-center justify-between">
              <span>{currentChallenge.title}</span>
              {isSolved && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Solved
                </span>
              )}
            </h2>

            {/* Funny Intro Backstory */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-yellow-200/90 text-xs italic leading-relaxed flex space-x-3">
              <span className="text-2xl select-none">🎭</span>
              <div>
                <span className="font-bold text-yellow-400 not-italic block mb-0.5">The Backstory:</span>
                "{currentChallenge.funnyIntro}"
              </div>
            </div>

            {/* Description / Instructions */}
            <div className="text-xs text-slate-200 leading-relaxed font-sans space-y-2">
              <h4 className="font-bold text-white flex items-center">
                <Terminal className="w-4 h-4 mr-1.5 text-cyan-400" />
                Your Mission:
              </h4>
              <p className="whitespace-pre-line bg-slate-900/80 p-4 rounded-2xl border border-slate-700/60 font-mono text-[12.5px] text-slate-200">
                {currentChallenge.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentChallenge.tags.map((tag, i) => (
                <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10 font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Progressive Hints & AI Coach Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                Progressive Clues & Hints
              </h3>
              <button
                onClick={() => setIsAiHintOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Coach</span>
              </button>
            </div>

            {/* Clue Item */}
            <div className="space-y-2 pt-1">
              {currentChallenge.hints.slice(0, unlockedHintIndex + 1).map((hint, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-200 text-xs leading-relaxed animate-in fade-in duration-200">
                  <span className="font-bold text-yellow-400 mr-1.5">Clue #{idx + 1}:</span>
                  {hint}
                </div>
              ))}

              {unlockedHintIndex < currentChallenge.hints.length - 1 && (
                <button
                  onClick={unlockNextHint}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-yellow-300 border border-white/15 text-xs font-bold transition"
                >
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span>Unlock Clue #{unlockedHintIndex + 2} (10 ByteCoins)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Code Sandbox Editor & Execution Console (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Editor Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col flex-1">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">solution.js</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetCode}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                  title="Reset to initial template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleFetchAiRoast}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs font-bold transition"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>AI Code Roast</span>
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="relative flex-1 min-h-[280px] bg-slate-950 font-mono text-xs text-amber-100 p-4 leading-relaxed">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[260px] bg-transparent resize-none outline-none font-mono text-xs sm:text-sm text-slate-200 leading-relaxed tracking-wide focus:ring-0"
              />
            </div>

            {/* Sandbox Controls */}
            <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                JavaScript Sandbox
              </span>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRunTests}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/15 shadow-md"
                >
                  <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                  <span>Run Tests</span>
                </button>

                <button
                  onClick={handleSubmitSolution}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-cyan-500/20 uppercase tracking-wider hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4 fill-slate-950" />
                  <span>Submit Solution</span>
                </button>
              </div>
            </div>
          </div>

          {/* Test Case Output & Console Logs Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center space-x-4 border-b border-slate-800 pb-2.5 mb-3">
              <button
                onClick={() => setActiveConsoleTab('tests')}
                className={`text-xs font-bold pb-1 flex items-center space-x-1.5 border-b-2 transition ${
                  activeConsoleTab === 'tests'
                    ? 'text-amber-400 border-amber-400'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Test Cases ({currentChallenge.testCases.length})</span>
              </button>

              <button
                onClick={() => setActiveConsoleTab('logs')}
                className={`text-xs font-bold pb-1 flex items-center space-x-1.5 border-b-2 transition ${
                  activeConsoleTab === 'logs'
                    ? 'text-amber-400 border-amber-400'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Console Logs ({runResult?.logs.length || 0})</span>
              </button>
            </div>

            {/* Test Results View */}
            {activeConsoleTab === 'tests' && (
              <div className="space-y-2">
                {!runResult ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    Click "Run Tests" to test your code against sample test cases.
                  </p>
                ) : runResult.runtimeError ? (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                    ❌ Runtime Syntax Error: {runResult.runtimeError}
                  </div>
                ) : (
                  runResult.testResults.map((tr, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs font-mono transition ${
                        tr.passed
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center">
                          {tr.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 mr-2" />
                          )}
                          Test #{idx + 1}: {tr.inputDescription}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {tr.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>

                      {!tr.passed && (
                        <div className="mt-2 text-[11px] space-y-1 bg-slate-950/80 p-2 rounded border border-rose-500/20">
                          <div><span className="text-slate-400">Expected:</span> <span className="text-emerald-400">{tr.expectedOutput}</span></div>
                          <div><span className="text-slate-400">Received:</span> <span className="text-rose-400">{tr.actualOutput}</span></div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Console Logs View */}
            {activeConsoleTab === 'logs' && (
              <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs text-slate-300 min-h-[100px] max-h-[180px] overflow-y-auto space-y-1 border border-slate-800">
                {!runResult || runResult.logs.length === 0 ? (
                  <span className="text-slate-500 italic">No console logs output yet. Use console.log() in your code to debug.</span>
                ) : (
                  runResult.logs.map((log, i) => (
                    <div key={i} className="text-amber-300">
                      &gt; {log}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Coach Hint Modal */}
      {isAiHintOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-extrabold text-base text-purple-300">Ask AI Coach for a Funny Hint</h3>
              </div>
              <button
                onClick={() => setIsAiHintOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            {/* Persona Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Select Your Coach Persona:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedPersona('meme_cat')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition ${
                    selectedPersona === 'meme_cat'
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">🐱</span>
                  <span>Barnaby Meme Cat</span>
                </button>

                <button
                  onClick={() => setSelectedPersona('grumpy_compiler')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition ${
                    selectedPersona === 'grumpy_compiler'
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">🤖</span>
                  <span>Grumpy Compiler</span>
                </button>

                <button
                  onClick={() => setSelectedPersona('cozy_grandma')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition ${
                    selectedPersona === 'cozy_grandma'
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">👵</span>
                  <span>Grandma Grace</span>
                </button>

                <button
                  onClick={() => setSelectedPersona('sarcastic_bot')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition ${
                    selectedPersona === 'sarcastic_bot'
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">🛸</span>
                  <span>Bot 9000</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleFetchAiHint}
              disabled={isAiLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-xs text-white shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isAiLoading ? (
                <span>Generating Hint... 🧠</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Custom Hint</span>
                </>
              )}
            </button>

            {/* AI Hint Output */}
            {aiHintData && (
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2 animate-in fade-in duration-200 text-xs">
                <h4 className="font-extrabold text-purple-300 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-1.5 text-amber-400" />
                  {aiHintData.hintTitle}
                </h4>
                <p className="text-slate-200 leading-relaxed font-sans">{aiHintData.hintText}</p>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-purple-500/20 italic text-purple-200">
                  "{aiHintData.funnyQuote}"
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Code Roast Modal */}
      {isRoastOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-orange-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-white space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-500 animate-bounce" />
                <h3 className="font-extrabold text-base text-orange-400">AI Code Roast & Praise</h3>
              </div>
              <button
                onClick={() => setIsRoastOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            {isRoastLoading ? (
              <div className="text-center py-8 space-y-3">
                <div className="text-3xl animate-spin">🔥</div>
                <p className="text-xs text-orange-300 font-bold">Analyzing your code for hilarious spaghetti patterns...</p>
              </div>
            ) : aiRoastData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30">
                  <div>
                    <span className="text-[10px] text-orange-300 uppercase tracking-wider font-bold">Code Grade</span>
                    <h4 className="text-base font-extrabold text-white">{aiRoastData.titleGrade}</h4>
                  </div>
                  <div className="text-2xl font-black text-amber-400 bg-slate-950 px-3 py-1 rounded-xl border border-amber-500/30">
                    {aiRoastData.score}/100
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed italic">
                  "{aiRoastData.funnyRoast}"
                </div>

                <div>
                  <h5 className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Praise Points:
                  </h5>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
                    {aiRoastData.praisePoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                  <span className="font-bold text-amber-400 block mb-0.5">💡 Funny Optimization Tip:</span>
                  {aiRoastData.funnyTip}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Victory Celebration Modal */}
      {showVictoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-5 animate-in zoom-in duration-300">
            <div className="text-5xl animate-bounce select-none">🎉</div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30 uppercase tracking-wider">
                Puzzle Solved!
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                {currentChallenge.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                You defeated the bug and earned glorious rewards!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[10px] text-amber-300 uppercase font-bold block">XP Gained</span>
                <span className="text-xl font-extrabold text-amber-400">+ {currentChallenge.xpReward} XP</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[10px] text-amber-300 uppercase font-bold block">ByteCoins Earned</span>
                <span className="text-xl font-extrabold text-amber-300 flex items-center justify-center">
                  <Coins className="w-5 h-5 mr-1" /> + {currentChallenge.coinReward}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                setShowVictoryModal(false);
                if (activeChallengeIndex < activeChallenges.length - 1) {
                  setActiveChallengeIndex(prev => prev + 1);
                }
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl transition transform hover:scale-105 active:scale-95"
            >
              Next Puzzle Challenge →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
