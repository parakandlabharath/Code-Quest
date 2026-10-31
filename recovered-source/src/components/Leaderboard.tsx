import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, UserProfile } from '../types';
import { soundFx } from '../utils/audio';
import { Trophy, Flame, Search, UserPlus, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface LeaderboardProps {
  userProfile: UserProfile;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ userProfile }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Submit rank modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [funnyBio, setFunnyBio] = useState('I turn coffee into clean code!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (data.success) {
        setEntries(data.leaderboard);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleClaimRank = async () => {
    setIsSubmitting(true);
    soundFx.playClick();
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userProfile.username,
          avatar: userProfile.avatar,
          titleBadge: userProfile.titleBadge,
          xp: userProfile.xp,
          level: userProfile.level,
          solvedPuzzles: userProfile.solvedIds.length,
          streakDays: userProfile.streakDays,
          funnyBio
        })
      });
      const data = await res.json();
      if (data.success) {
        soundFx.playSuccess();
        setEntries(data.leaderboard);
        setShowSubmitModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEntries = entries.filter(
    e => e.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
         e.titleBadge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = entries.slice(0, 3);
  const top1 = top3[0];
  const top2 = top3[1];
  const top3rd = top3[2];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100 space-y-8">
      {/* Leaderboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-7 h-7 text-yellow-400 animate-bounce" />
            <h2 className="text-2xl font-black text-white">Global Coding Wall of Fame</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Compete with funny coders around the world, earn XP, and climb the leaderboard!
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setShowSubmitModal(true);
          }}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/20 uppercase tracking-wider hover:scale-105 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Claim / Update My Rank</span>
        </button>
      </div>

      {/* Podium for Top 3 */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 2nd Place */}
          {top2 && (
            <div className="order-2 md:order-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center flex flex-col items-center justify-center space-y-2 relative shadow-xl transform md:translate-y-4">
              <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-300 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                🥈 2nd Place
              </div>
              <div className="text-4xl">{top2.avatar}</div>
              <h3 className="font-extrabold text-base text-slate-200">{top2.username}</h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold border border-white/15">
                {top2.titleBadge}
              </span>
              <div className="text-xs font-bold text-yellow-400">⚡ {top2.xp} XP</div>
              <p className="text-[11px] text-slate-300 italic font-sans px-2">"{top2.funnyBio}"</p>
            </div>
          )}

          {/* 1st Place */}
          {top1 && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-yellow-400/20 via-white/10 to-white/10 backdrop-blur-md border-2 border-yellow-400 rounded-3xl p-6 text-center flex flex-col items-center justify-center space-y-2 relative shadow-2xl transform md:-translate-y-2">
              <div className="absolute -top-3.5 px-4 py-1 rounded-full bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg animate-pulse">
                👑 1st Champion
              </div>
              <div className="text-5xl">{top1.avatar}</div>
              <h3 className="font-extrabold text-lg text-white">{top1.username}</h3>
              <span className="text-xs px-3 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold border border-yellow-400/30">
                {top1.titleBadge}
              </span>
              <div className="text-sm font-black text-yellow-300">⚡ {top1.xp} XP • Lvl {top1.level}</div>
              <p className="text-xs text-slate-200 italic font-sans px-2">"{top1.funnyBio}"</p>
            </div>
          )}

          {/* 3rd Place */}
          {top3rd && (
            <div className="order-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center flex flex-col items-center justify-center space-y-2 relative shadow-xl transform md:translate-y-6">
              <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-700 text-amber-100 font-black text-[10px] uppercase tracking-wider">
                🥉 3rd Place
              </div>
              <div className="text-4xl">{top3rd.avatar}</div>
              <h3 className="font-extrabold text-base text-slate-200">{top3rd.username}</h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold border border-white/15">
                {top3rd.titleBadge}
              </span>
              <div className="text-xs font-bold text-yellow-400">⚡ {top3rd.xp} XP</div>
              <p className="text-[11px] text-slate-300 italic font-sans px-2">"{top3rd.funnyBio}"</p>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard Table & Search */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by username or badge title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Coder</th>
                <th className="py-3 px-4">Title Badge</th>
                <th className="py-3 px-4 text-center">Puzzles Solved</th>
                <th className="py-3 px-4 text-center">Streak</th>
                <th className="py-3 px-4 text-right">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredEntries.map((entry) => {
                const isUser = entry.username.toLowerCase() === userProfile.username.toLowerCase();
                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-slate-800/40 transition ${
                      isUser ? 'bg-amber-500/10 font-bold text-amber-200' : 'text-slate-200'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold">
                      {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xl select-none">{entry.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-100 flex items-center">
                            {entry.username}
                            {isUser && <span className="ml-1.5 text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">YOU</span>}
                          </div>
                          <span className="text-[10px] text-slate-400 italic line-clamp-1">"{entry.funnyBio}"</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-[11px]">
                        {entry.titleBadge}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                      {entry.solvedPuzzles}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-orange-400">
                      <span className="flex items-center justify-center">
                        <Flame className="w-3.5 h-3.5 text-orange-500 mr-1" />
                        {entry.streakDays}d
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-amber-400">
                      {entry.xp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Rank Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-base text-amber-400 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Claim / Submit Your Score
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Username:</label>
                <input
                  type="text"
                  disabled
                  value={userProfile.username}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Your Funny Coder Bio:</label>
                <textarea
                  value={funnyBio}
                  onChange={(e) => setFunnyBio(e.target.value)}
                  placeholder="e.g. I turn caffeine into syntax errors!"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-sans focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Current XP:</span>
                  <span className="text-amber-400">{userProfile.xp} XP</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Current Level:</span>
                  <span className="text-amber-300">Level {userProfile.level}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleClaimRank}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Posting Score...' : 'Publish Score to Wall of Fame 🚀'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
