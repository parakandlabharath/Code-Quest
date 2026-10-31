import React, { useState, useEffect } from 'react';
import { DifficultyLevel, UserProfile, Challenge } from './types';
import { INITIAL_CHALLENGES } from './data/challenges';
import { INTERACTIVE_LESSONS } from './data/lessons';
import { Header } from './components/Header';
import { MascotWidget } from './components/MascotWidget';
import { PuzzleSolver } from './components/PuzzleSolver';
import { InteractiveTutorial } from './components/InteractiveTutorial';
import { Leaderboard } from './components/Leaderboard';
import { AiChallengeCreator } from './components/AiChallengeCreator';
import { MemeShop } from './components/MemeShop';
import { soundFx } from './utils/audio';
import { Award, Flame, Coins, Sparkles, CheckCircle2, User, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'puzzles' | 'tutorials' | 'leaderboard' | 'ai_creator' | 'shop'>('puzzles');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('beginner');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Challenges State
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('codejester_custom_challenges');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...INITIAL_CHALLENGES, ...parsed];
      } catch {
        return INITIAL_CHALLENGES;
      }
    }
    return INITIAL_CHALLENGES;
  });

  // User Profile State with LocalStorage Persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('codejester_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback default
      }
    }
    return {
      username: 'CodeNinja_' + Math.floor(100 + Math.random() * 900),
      avatar: '🚀',
      titleBadge: 'Semicolon Ninja',
      xp: 250,
      level: 1,
      byteCoins: 120,
      streakDays: 3,
      solvedIds: [],
      unlockedBadges: ['Semicolon Ninja'],
      purchasedThemes: ['dark'],
      activeTheme: 'dark'
    };
  });

  // Save profile to local storage whenever updated
  useEffect(() => {
    localStorage.setItem('codejester_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleSolveChallenge = (challengeId: string, xpReward: number, coinReward: number) => {
    setUserProfile((prev) => {
      const alreadySolved = prev.solvedIds.includes(challengeId);
      const newSolvedIds = alreadySolved ? prev.solvedIds : [...prev.solvedIds, challengeId];
      const newXp = alreadySolved ? prev.xp : prev.xp + xpReward;
      const newCoins = alreadySolved ? prev.byteCoins : prev.byteCoins + coinReward;
      const newLevel = Math.floor(newXp / 300) + 1;

      return {
        ...prev,
        solvedIds: newSolvedIds,
        xp: newXp,
        byteCoins: newCoins,
        level: newLevel
      };
    });
  };

  const handleCompleteLesson = (lessonId: string, badgeName: string, xpReward: number) => {
    setUserProfile((prev) => {
      const alreadyUnlocked = prev.unlockedBadges.includes(badgeName);
      const newBadges = alreadyUnlocked ? prev.unlockedBadges : [...prev.unlockedBadges, badgeName];
      const newXp = alreadyUnlocked ? prev.xp : prev.xp + xpReward;
      const newCoins = alreadyUnlocked ? prev.byteCoins : prev.byteCoins + 50;
      const newLevel = Math.floor(newXp / 300) + 1;

      return {
        ...prev,
        unlockedBadges: newBadges,
        xp: newXp,
        byteCoins: newCoins,
        level: newLevel
      };
    });
  };

  const handleDeductCoins = (amount: number): boolean => {
    if (userProfile.byteCoins >= amount) {
      setUserProfile((prev) => ({
        ...prev,
        byteCoins: prev.byteCoins - amount
      }));
      return true;
    }
    return false;
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updated
    }));
  };

  const handleAddCustomChallenge = (newChallenge: Challenge) => {
    setChallenges((prev) => {
      const exists = prev.some((c) => c.id === newChallenge.id);
      if (exists) return prev;
      const updated = [newChallenge, ...prev];
      // Save custom generated challenges
      const customOnly = updated.filter(c => c.id.startsWith('gen_') || c.id.startsWith('ai_'));
      localStorage.setItem('codejester_custom_challenges', JSON.stringify(customOnly));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        userProfile={userProfile}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenProfile={() => {
          soundFx.playClick();
          setIsProfileModalOpen(true);
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'puzzles' && (
          <PuzzleSolver
            challenges={challenges}
            selectedDifficulty={selectedDifficulty}
            userProfile={userProfile}
            onSolveChallenge={handleSolveChallenge}
            onDeductCoins={handleDeductCoins}
          />
        )}

        {activeTab === 'tutorials' && (
          <InteractiveTutorial
            lessons={INTERACTIVE_LESSONS}
            userProfile={userProfile}
            onCompleteLesson={handleCompleteLesson}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard userProfile={userProfile} />
        )}

        {activeTab === 'ai_creator' && (
          <AiChallengeCreator
            onAddChallenge={handleAddCustomChallenge}
            onPlayChallenge={() => setActiveTab('puzzles')}
          />
        )}

        {activeTab === 'shop' && (
          <MemeShop
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onDeductCoins={handleDeductCoins}
          />
        )}
      </main>

      {/* Floating Mascot Companion */}
      <MascotWidget />

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🃏 CodeJester — Gamified & Friendly Code Playground</span>
          <span>Powered by Gemini AI Coach & React 19</span>
        </div>
      </footer>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">Your Coder Profile</h3>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Username:</label>
                <input
                  type="text"
                  value={userProfile.username}
                  onChange={(e) => handleUpdateProfile({ username: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Avatar Icon:</label>
                <div className="flex space-x-2">
                  {['🚀', '🥷', '🧙‍♂️', '🐱', '☕', '👽'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleUpdateProfile({ avatar: emoji })}
                      className={`p-2 text-xl rounded-xl border transition ${
                        userProfile.avatar === emoji
                          ? 'bg-amber-500/20 border-amber-400'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Title Badge:</span>
                  <span className="text-amber-300">{userProfile.titleBadge}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Total XP:</span>
                  <span className="text-amber-400">{userProfile.xp} XP (Level {userProfile.level})</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">ByteCoins:</span>
                  <span className="text-amber-300">{userProfile.byteCoins}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Solved Puzzles:</span>
                  <span className="text-emerald-400">{userProfile.solvedIds.length} Puzzles</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Unlocked Badges ({userProfile.unlockedBadges.length}):</label>
                <div className="flex flex-wrap gap-1.5">
                  {userProfile.unlockedBadges.map((b, idx) => (
                    <span key={idx} className="text-[10px] px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                      🏆 {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
