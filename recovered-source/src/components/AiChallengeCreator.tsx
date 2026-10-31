import React, { useState } from 'react';
import { Challenge, DifficultyLevel } from '../types';
import { soundFx } from '../utils/audio';
import { Sparkles, Bot, Code, Plus, CheckCircle2, Play } from 'lucide-react';

interface AiChallengeCreatorProps {
  onAddChallenge: (challenge: Challenge) => void;
  onPlayChallenge: () => void;
}

export const AiChallengeCreator: React.FC<AiChallengeCreatorProps> = ({
  onAddChallenge,
  onPlayChallenge
}) => {
  const [topic, setTopic] = useState('Fun Array & String Manipulation');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChallenge, setGeneratedChallenge] = useState<Challenge | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    soundFx.playClick();
    try {
      const res = await fetch('/api/ai/generate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });
      const data = await res.json();
      if (data.success && data.challenge) {
        soundFx.playSuccess();
        setGeneratedChallenge(data.challenge);
        onAddChallenge(data.challenge);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100 space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          <h2 className="text-2xl font-black text-white">AI Custom Challenge Generator</h2>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          Want a specific topic like "Pizza Math", "Space Alien Regex", or "Async Promise Race"? Ask Gemini AI to craft a brand-new funny coding puzzle instantly!
        </p>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Topic or Concept:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Array filter for cat food, string reverse"
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl px-4 py-2.5 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl px-4 py-2.5 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-400 capitalize"
            >
              <option value="beginner">🐣 Beginner</option>
              <option value="intermediate">☕ Intermediate</option>
              <option value="advanced">🚀 Advanced</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full mt-3 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 uppercase tracking-wider transition transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <span>Crafting Custom Funny Challenge... 🪄</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate AI Challenge</span>
            </>
          )}
        </button>
      </div>

      {/* Preview Generated Challenge */}
      {generatedChallenge && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Challenge Created & Added to Puzzle Sandbox!
            </span>
            <span className="text-xs font-mono text-slate-400 capitalize">{generatedChallenge.difficulty}</span>
          </div>

          <h3 className="text-lg font-black text-white">{generatedChallenge.title}</h3>
          <p className="text-xs text-amber-300 italic font-sans">"{generatedChallenge.funnyIntro}"</p>
          <p className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
            {generatedChallenge.description}
          </p>

          <button
            onClick={() => {
              soundFx.playClick();
              onPlayChallenge();
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Play This Challenge in Sandbox Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
