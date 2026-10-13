import React from 'react';
import { Sparkles, X, Award, CheckCircle2, Lock } from 'lucide-react';
import { MascotBadge, UserProfile } from '../types';

interface DeskpadShowcaseModalProps {
  badges: MascotBadge[];
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const DeskpadShowcaseModal: React.FC<DeskpadShowcaseModalProps> = ({
  badges,
  profile,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => profile.unlockedBadges.includes(b.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-[#FFF9F2] dark:bg-[#1B263B] border-2 border-[#EADBCC] dark:border-[#2C3E55] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFE5D9] via-[#FFF0E6] to-[#FFE5D9] dark:from-[#0D1B2A] dark:to-[#1B263B] px-6 py-4 border-b border-[#EADBCC] dark:border-[#2C3E55] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#0D1B2A] border border-[#F3A683] flex items-center justify-center text-xl shadow-xs">
              🎨
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                Cozy Desk Pad & Sticker Showcase
              </h2>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                {unlockedCount} of {badges.length} charming badges unlocked
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-white/60 dark:hover:bg-[#0D1B2A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Desk Mat Showcase Canvas */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Visual Desk Pad Felt Mat */}
          <div className="rounded-3xl bg-gradient-to-b from-[#2A4736] to-[#1E3326] p-6 text-white shadow-inner border-4 border-[#3D664E] relative overflow-hidden">
            {/* Texture and stitches */}
            <div className="absolute inset-2 border border-dashed border-white/20 rounded-2xl pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                🌱 Active Desk Pad Showcase
              </span>
              <span className="text-[11px] text-emerald-300/80">
                Earned through study focus & spaced review
              </span>
            </div>

            {/* Sticker grid pinned on the desk pad */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
              {badges.map((b) => {
                const isUnlocked = profile.unlockedBadges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-2xl transition-all flex flex-col items-center text-center ${
                      isUnlocked
                        ? 'bg-white/90 text-stone-800 shadow-md transform hover:-translate-y-1 hover:rotate-1 rotate-0'
                        : 'bg-black/30 text-white/40 border border-white/10'
                    }`}
                  >
                    <div className="text-3xl mb-1 filter drop-shadow-xs">
                      {isUnlocked ? b.icon : '🔒'}
                    </div>
                    <span className="text-xs font-bold leading-tight">
                      {b.title}
                    </span>
                    <span className="text-[10px] mt-0.5 opacity-80">
                      {isUnlocked ? b.rarity : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badge Descriptions & Requirements */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#718096] dark:text-[#94A3B8] mb-3">
              Badge Archive & Criteria
            </h3>
            <div className="space-y-2">
              {badges.map((b) => {
                const isUnlocked = profile.unlockedBadges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      isUnlocked
                        ? 'bg-white dark:bg-[#0D1B2A] border-[#88C0D0]/40 dark:border-[#4ECCA3]/40'
                        : 'bg-stone-50 dark:bg-[#0D1B2A]/40 border-stone-200 dark:border-[#2C3E55] opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFF9F2] dark:bg-[#1B263B] border border-stone-200 dark:border-stone-700 flex items-center justify-center text-xl shrink-0">
                        {b.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                            {b.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                            {b.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-0.5">
                          {b.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isUnlocked ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 dark:bg-[#0D1B2A] px-6 py-3 border-t border-[#EADBCC] dark:border-[#2C3E55] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-[#88C0D0] dark:bg-[#4ECCA3] text-white dark:text-[#0D1B2A] text-xs font-bold hover:opacity-90"
          >
            Close Showcase
          </button>
        </div>
      </div>
    </div>
  );
};
