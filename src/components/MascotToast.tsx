import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronRight, MessageCircle } from 'lucide-react';
import { NOOKI_DIALOGUES, MascotDialogue } from '../data/dialogues';
import { UserProfile } from '../types';

interface MascotToastProps {
  profile: UserProfile;
}

export const MascotToast: React.FC<MascotToastProps> = ({ profile }) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Rotate advice every 35 seconds automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDialogueIndex((prev) => (prev + 1) % NOOKI_DIALOGUES.length);
      setIsVisible(true);
    }, 35000);
    return () => clearInterval(timer);
  }, []);

  const dialogue: MascotDialogue = NOOKI_DIALOGUES[currentDialogueIndex];

  const handleNextDialogue = () => {
    setCurrentDialogueIndex((prev) => (prev + 1) % NOOKI_DIALOGUES.length);
  };

  const getMascotSrc = () => {
    if (profile.mascot === 'tea-dragon') {
      return '/src/assets/images/ghibli_tea_dragon_1791910472130.jpg';
    }
    return '/src/assets/images/nooki_mascot_otter_1791910471677.jpg';
  };

  if (!isVisible && isMinimized) {
    return (
      <button
        onClick={() => {
          setIsVisible(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-18 right-6 z-30 p-2.5 rounded-full bg-white dark:bg-[#1B263B] border-2 border-[#88C0D0] dark:border-[#4ECCA3] shadow-lg hover:scale-110 transition-transform flex items-center gap-2"
        title="Chat with Nooki"
      >
        <span className="text-xl">🍵</span>
        <span className="text-xs font-bold text-[#2D3748] dark:text-[#E2E8F0] pr-1">
          Nooki Wisdom
        </span>
      </button>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-30 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-3xl bg-white/95 dark:bg-[#1B263B]/95 backdrop-blur-md border-2 border-[#EADBCC] dark:border-[#2C3E55] shadow-2xl p-4 relative overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-xs border border-white dark:border-stone-700">
              <img
                src={getMascotSrc()}
                alt="Mascot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-[#2D3748] dark:text-[#E2E8F0] flex items-center gap-1">
                <span>{profile.mascot === 'tea-dragon' ? 'Tea Dragon' : 'Nooki'}</span>
                <span className="text-base">{dialogue.icon}</span>
              </span>
              <span className="text-[10px] text-[#88C0D0] dark:text-[#4ECCA3] font-semibold">
                {dialogue.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleNextDialogue}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#0D1B2A]"
              title="Next tip"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setIsVisible(false);
                setIsMinimized(true);
              }}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#0D1B2A]"
              title="Minimize"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Speech Bubble Body */}
        <div className="p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#0D1B2A] border border-[#EADBCC]/80 dark:border-[#2C3E55]/80">
          <p className="text-xs text-[#2D3748] dark:text-[#E2E8F0] leading-relaxed font-medium">
            "{dialogue.quote}"
          </p>
        </div>

        {/* Micro footer hint */}
        <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-[#718096] dark:text-[#94A3B8]">
          <span>Tip {currentDialogueIndex + 1} of {NOOKI_DIALOGUES.length}</span>
          <button
            onClick={handleNextDialogue}
            className="text-[#88C0D0] dark:text-[#4ECCA3] font-semibold hover:underline"
          >
            Tell me more →
          </button>
        </div>
      </div>
    </div>
  );
};
