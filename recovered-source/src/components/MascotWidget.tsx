import React, { useState } from 'react';
import { Cat, Sparkles, X, RefreshCw, MessageCircle } from 'lucide-react';
import { soundFx } from '../utils/audio';

const FUNNY_JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "There are 10 types of people in the world: Those who understand binary, and those who don't. 0️⃣1️⃣",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?' 🍺",
  "How many programmers does it take to change a lightbulb? None, that's a hardware problem! 💡",
  "What is a algorithm? Word used by programmers when they don't want to explain what they did! 🤖",
  "Why did the JavaScript developer wear glasses? Because they didn't C#! 🤓",
  "[] == ![] evaluates to true in JavaScript. Please don't cry! 😭",
  "Real programmers count from 0, not 1! 🔢",
  "Copying code from Stack Overflow is an art form. 🎨",
  "If at first you don't succeed, call it version 1.0! 🚀"
];

export const MascotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0);

  const toggleOpen = () => {
    soundFx.playClick();
    setIsOpen(!isOpen);
  };

  const nextJoke = () => {
    soundFx.playClick();
    setCurrentJokeIndex((prev) => (prev + 1) % FUNNY_JOKES.length);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="mb-3 w-80 bg-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-2xl text-white backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-2xl animate-bounce">🐱</span>
              <div>
                <h4 className="font-bold text-sm text-amber-400">Buggy the Code Mascot</h4>
                <p className="text-[10px] text-slate-400">Your humorous coding companion</p>
              </div>
            </div>
            <button
              onClick={toggleOpen}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 px-1 text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/60 rounded-xl my-2 border border-slate-800 p-3">
            "{FUNNY_JOKES[currentJokeIndex]}"
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-[10px] text-amber-300 font-medium flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Tip of the day
            </span>
            <button
              onClick={nextJoke}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Next Joke</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleOpen}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 p-0.5 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200"
        title="Talk to Buggy the Mascot"
      >
        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-2xl group-hover:bg-slate-800 transition">
          🐱
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 animate-ping" />
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
      </button>
    </div>
  );
};
