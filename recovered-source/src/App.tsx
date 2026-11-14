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
import { awardChallengeReward, awardLessonReward, spendCoins } from './utils/progress';
import { createCodeQuestBackup, parseCodeQuestBackup, parseStoredProfile, parseStoredChallenges } from './utils/backup';
import { Award, Flame, Coins, Sparkles, CheckCircle2, User, X, Download, Upload } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'puzzles' | 'tutorials' | 'leaderboard' | 'ai_creator' | 'shop'>('puzzles');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('beginner');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [backupMessage, setBackupMessage] = useState<string>('');

  // Challenges State
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('codejester_custom_challenges');
    if (saved) {
      try {
        const parsed = parseStoredChallenges(JSON.parse(saved));
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
        const parsed = parseStoredProfile(JSON.parse(saved));
        if (parsed) return parsed;
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
      completedLessonIds: [],
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
    setUserProfile((prev) => awardChallengeReward(prev, challengeId, xpReward, coinReward));
  };

  const handleCompleteLesson = (lessonId: string, badgeName: string, xpReward: number) => {
    setUserProfile((prev) => awardLessonReward(prev, lessonId, badgeName, xpReward));
  };

  const handleDeductCoins = (amount: number): boolean => {
    const updated = spendCoins(userProfile, amount);
    if (!updated) return false;
    setUserProfile(updated);
    return true;
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

  const handleExportBackup = () => {
    const customChallenges = challenges.filter((challenge) =>
      challenge.id.startsWith('gen_') || challenge.id.startsWith('ai_')
    );
    const blob = new Blob([createCodeQuestBackup(userProfile, customChallenges)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `code-quest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setBackupMessage('Backup downloaded. Keep a copy outside this device.');
  };

  const handleImportBackup = async (file: File) => {
    try {
      const parsed = parseCodeQuestBackup(JSON.parse(await file.text()));
      setUserProfile(parsed.profile);
      setChallenges([...INITIAL_CHALLENGES, ...parsed.customChallenges]);
      setBackupMessage('Backup restored successfully.');
    } catch (error) {
      setBackupMessage(error instanceof Error ? error.message : 'Could not restore this backup.');
    }
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

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={handleExportBackup}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-2.5 text-emerald-300 font-bold hover:bg-emerald-500/25"
                >
                  <Download className="w-4 h-4" /> Export Backup
                </button>
                <label className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 px-3 py-2.5 text-cyan-300 font-bold hover:bg-cyan-500/25 cursor-pointer">
                  <Upload className="w-4 h-4" /> Restore Backup
                  <input
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleImportBackup(file);
                      event.currentTarget.value = '';
                    }}
                  />
                </label>
              </div>
              {backupMessage && <p className="text-[11px] text-cyan-300" role="status">{backupMessage}</p>}

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
