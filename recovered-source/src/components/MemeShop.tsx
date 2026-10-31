import React from 'react';
import { UserProfile } from '../types';
import { soundFx } from '../utils/audio';
import { ShoppingBag, Coins, Check, Sparkles, Award, Palette } from 'lucide-react';

interface MemeShopProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onDeductCoins: (amount: number) => boolean;
}

interface ShopItem {
  id: string;
  name: string;
  type: 'title' | 'avatar' | 'theme';
  price: number;
  value: string;
  icon: string;
  description: string;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 't1', name: 'Semicolon Ninja', type: 'title', price: 30, value: 'Semicolon Ninja', icon: '🥷', description: 'Never forgets a semicolon!' },
  { id: 't2', name: '100x Coffee Consumer', type: 'title', price: 40, value: '100x Coffee Consumer', icon: '☕', description: 'Runs 100% on espresso' },
  { id: 't3', name: 'StackOverflow VIP', type: 'title', price: 50, value: 'StackOverflow VIP', icon: '🧙‍♂️', description: 'Master of Ctrl+C and Ctrl+V' },
  { id: 't4', name: 'Bug Magnate', type: 'title', price: 60, value: 'Bug Magnate', icon: '🐛', description: 'Owns a farm of hilarious bugs' },
  { id: 't5', name: 'RegEx Wizard', type: 'title', price: 80, value: 'RegEx Wizard', icon: '👾', description: 'Writes pattern strings from space' },

  { id: 'a1', name: 'Wizard Hat', type: 'avatar', price: 20, value: '🧙‍♂️', icon: '🧙‍♂️', description: 'Magical coding wizard' },
  { id: 'a2', name: 'Ninja Cat', type: 'avatar', price: 25, value: '🥷', icon: '🥷', description: 'Silent bug slayer' },
  { id: 'a3', name: 'Rocket Coder', type: 'avatar', price: 30, value: '🚀', icon: '🚀', description: 'Launches bugs into orbit' },
  { id: 'a4', name: 'Coffee Cup', type: 'avatar', price: 20, value: '☕', icon: '☕', description: 'Powered by caffeine' },
  { id: 'a5', name: 'Alien Hacker', type: 'avatar', price: 40, value: '👽', icon: '👽', description: 'Hacks intergalactic systems' },
];

export const MemeShop: React.FC<MemeShopProps> = ({
  userProfile,
  onUpdateProfile,
  onDeductCoins
}) => {
  const handleBuyOrEquip = (item: ShopItem) => {
    soundFx.playClick();

    if (item.type === 'title') {
      const isUnlocked = userProfile.unlockedBadges.includes(item.value);
      if (isUnlocked) {
        // Equip
        onUpdateProfile({ titleBadge: item.value });
        soundFx.playSuccess();
      } else {
        // Buy
        if (onDeductCoins(item.price)) {
          soundFx.playCoin();
          onUpdateProfile({
            titleBadge: item.value,
            unlockedBadges: [...userProfile.unlockedBadges, item.value]
          });
        } else {
          alert('Not enough ByteCoins! Solve more puzzles to earn ByteCoins.');
        }
      }
    } else if (item.type === 'avatar') {
      const isUnlocked = userProfile.unlockedBadges.includes(item.value);
      if (isUnlocked) {
        onUpdateProfile({ avatar: item.value });
        soundFx.playSuccess();
      } else {
        if (onDeductCoins(item.price)) {
          soundFx.playCoin();
          onUpdateProfile({
            avatar: item.value,
            unlockedBadges: [...userProfile.unlockedBadges, item.value]
          });
        } else {
          alert('Not enough ByteCoins! Solve more puzzles to earn ByteCoins.');
        }
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100 space-y-6">
      {/* Shop Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-black text-white">Meme Title & Avatar Shop</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Spend your hard-earned ByteCoins on funny title badges and custom avatar icons!
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-yellow-400/20 border border-yellow-400/30 px-4 py-2 rounded-2xl text-yellow-300 font-bold text-sm w-fit backdrop-blur-md">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span>Balance: {userProfile.byteCoins} ByteCoins</span>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHOP_ITEMS.map((item) => {
          const isUnlocked = userProfile.unlockedBadges.includes(item.value);
          const isEquipped = item.type === 'title' ? userProfile.titleBadge === item.value : userProfile.avatar === item.value;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-3 backdrop-blur-md shadow-xl ${
                isEquipped
                  ? 'bg-yellow-400/20 border-yellow-400 shadow-yellow-400/10'
                  : 'bg-white/10 border-white/20 hover:border-white/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl">{item.icon}</div>
                {isEquipped ? (
                  <span className="px-3 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Equipped
                  </span>
                ) : isUnlocked ? (
                  <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Unlocked
                  </span>
                ) : (
                  <span className="px-3 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[11px] font-bold flex items-center">
                    <Coins className="w-3.5 h-3.5 mr-1 text-yellow-400" /> {item.price}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-white">{item.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{item.description}</p>
              </div>

              <button
                onClick={() => handleBuyOrEquip(item)}
                className={`w-full py-2.5 rounded-2xl text-xs font-black transition shadow uppercase tracking-wider ${
                  isEquipped
                    ? 'bg-white/10 text-slate-400 cursor-default border border-white/10'
                    : isUnlocked
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                {isEquipped ? 'Equipped' : isUnlocked ? 'Equip Now' : `Unlock for ${item.price} ByteCoins`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
