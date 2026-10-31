import React from 'react';
import { DifficultyLevel, UserProfile } from '../types';
import { 
  Puzzle, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  ShoppingBag, 
  Flame, 
  Coins, 
  Volume2, 
  VolumeX, 
  Code2,
  Cat
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  activeTab: 'puzzles' | 'tutorials' | 'leaderboard' | 'ai_creator' | 'shop';
  setActiveTab: (tab: 'puzzles' | 'tutorials' | 'leaderboard' | 'ai_creator' | 'shop') => void;
  selectedDifficulty: DifficultyLevel;
  setSelectedDifficulty: (diff: DifficultyLevel) => void;
  userProfile: UserProfile;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedDifficulty,
  setSelectedDifficulty,
  userProfile,
  soundEnabled,
  setSoundEnabled,
  onOpenProfile
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    soundFx.soundEnabled = next;
    setSoundEnabled(next);
    if (next) soundFx.playClick();
  };

  const handleTabChange = (tab: 'puzzles' | 'tutorials' | 'leaderboard' | 'ai_creator' | 'shop') => {
    soundFx.playClick();
    setActiveTab(tab);
  };

  const handleDifficultyChange = (diff: DifficultyLevel) => {
    soundFx.playClick();
    setSelectedDifficulty(diff);
  };

  const xpForNextLevel = userProfile.level * 300;
  const xpProgressPercent = Math.min(100, Math.round((userProfile.xp / xpForNextLevel) * 100));

  return (
    <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-xl border-b border-white/10 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mascot */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleTabChange('puzzles')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-orange-500 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center text-xl">
                🃏
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-white via-cyan-100 to-slate-400 bg-clip-text text-transparent">
                  CodeJester
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                  FUN 🚀
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                Humorous, Gamified Coding for All Skill Levels
              </p>
            </div>
          </div>

          {/* Difficulty Switcher (Beginner / Intermediate / Advanced) */}
          <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/15 shadow-inner">
            <button
              onClick={() => handleDifficultyChange('beginner')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                selectedDifficulty === 'beginner'
                  ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/20 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🐣</span>
              <span>Beginner</span>
            </button>
            <button
              onClick={() => handleDifficultyChange('intermediate')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                selectedDifficulty === 'intermediate'
                  ? 'bg-yellow-400 text-slate-950 font-extrabold shadow-lg shadow-yellow-500/20 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>☕</span>
              <span>Intermediate</span>
            </button>
            <button
              onClick={() => handleDifficultyChange('advanced')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                selectedDifficulty === 'advanced'
                  ? 'bg-pink-500 text-white font-extrabold shadow-lg shadow-pink-500/20 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🚀</span>
              <span>Advanced</span>
            </button>
          </div>

          {/* User Gamification Stats Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 transition backdrop-blur-md"
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Streak Counter */}
            <div className="flex items-center space-x-1 px-3 py-1 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold shadow-sm backdrop-blur-md">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-bounce" />
              <span>{userProfile.streakDays}d</span>
            </div>

            {/* ByteCoins Balance */}
            <div className="flex items-center space-x-1 px-3 py-1 rounded-2xl bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-bold shadow-sm backdrop-blur-md">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>{userProfile.byteCoins}</span>
            </div>

            {/* User Level & Profile Avatar */}
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-2xl border border-white/20 transition shadow-sm backdrop-blur-md"
            >
              <span className="text-lg">{userProfile.avatar || '🚀'}</span>
              <div className="text-left hidden lg:block">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold text-slate-200">{userProfile.username}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 font-mono font-bold">
                    Lvl {userProfile.level}
                  </span>
                </div>
                {/* XP Progress Bar */}
                <div className="w-20 bg-slate-900/80 h-1.5 rounded-full overflow-hidden mt-0.5 border border-white/10">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${xpProgressPercent}%` }}
                  />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Difficulty Switcher */}
        <div className="flex md:hidden items-center justify-center space-x-1 py-2 border-t border-white/10">
          {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                selectedDifficulty === diff
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 bg-white/10'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 sm:space-x-2 py-2.5 overflow-x-auto border-t border-white/10 scrollbar-none">
          <button
            onClick={() => handleTabChange('puzzles')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'puzzles'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>Puzzle Sandbox</span>
          </button>

          <button
            onClick={() => handleTabChange('tutorials')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'tutorials'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Funny Tutorials</span>
          </button>

          <button
            onClick={() => handleTabChange('leaderboard')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => handleTabChange('ai_creator')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'ai_creator'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>AI Challenge Lab</span>
          </button>

          <button
            onClick={() => handleTabChange('shop')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'shop'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Meme Shop</span>
          </button>
        </div>
      </div>
    </header>
  );
};
