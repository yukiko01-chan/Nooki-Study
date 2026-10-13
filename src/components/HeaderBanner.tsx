import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Flame, 
  Calendar, 
  Clock, 
  Sparkles, 
  Edit3, 
  Monitor, 
  Minimize2, 
  Maximize2,
  Volume2,
  VolumeX,
  X,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderBannerProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenProfileModal: () => void;
  onOpenDeskpad: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  profile,
  onUpdateProfile,
  onOpenProfileModal,
  onOpenDeskpad
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isEditingExam, setIsEditingExam] = useState<boolean>(false);
  const [editExamName, setEditExamName] = useState<string>(profile.examName);
  const [editExamDate, setEditExamDate] = useState<string>(profile.examDate);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!profile.examDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(profile.examDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysRemaining();

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      examName: editExamName,
      examDate: editExamDate
    });
    setIsEditingExam(false);
  };

  const cycleTheme = () => {
    if (profile.themeMode === 'light') onUpdateProfile({ themeMode: 'dark' });
    else if (profile.themeMode === 'dark') onUpdateProfile({ themeMode: 'system' });
    else onUpdateProfile({ themeMode: 'light' });
  };

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Mascot avatar image
  const getMascotSrc = () => {
    if (profile.mascot === 'tea-dragon') {
      return '/src/assets/images/ghibli_tea_dragon_1791910472130.jpg';
    }
    return '/src/assets/images/nooki_mascot_otter_1791910471677.jpg';
  };

  return (
    <header className="relative border-b border-[#EADBCC] dark:border-[#2C3E55] bg-white/70 dark:bg-[#1B263B]/80 backdrop-blur-md px-6 py-3 transition-colors z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Date, Live Time & Streak */}
        <div className="flex items-center gap-5 flex-wrap">
          {/* User profile button */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-stone-100/70 dark:bg-[#0D1B2A]/60 hover:bg-stone-200/60 dark:hover:bg-[#0D1B2A] border border-[#EADBCC]/50 dark:border-[#2C3E55] transition-all text-left"
            title="Customize Profile & Mascot"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-white dark:border-[#2C3E55]">
              <img
                src={getMascotSrc()}
                alt={profile.displayName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[#2D3748] dark:text-[#E2E8F0]">
                  {profile.displayName || 'Scholar'}
                </span>
                <span className="text-[10px] text-[#718096] dark:text-[#94A3B8]">
                  ✎
                </span>
              </div>
              <span className="text-[10px] text-[#88C0D0] dark:text-[#4ECCA3] font-medium">
                {profile.mascot === 'tea-dragon' ? 'Tea Dragon' : 'Nooki Otter'}
              </span>
            </div>
          </button>

          {/* Live Date & Time */}
          <div className="flex items-center gap-2 text-xs text-[#718096] dark:text-[#94A3B8]">
            <Calendar className="w-3.5 h-3.5 text-[#88C0D0] dark:text-[#4ECCA3]" />
            <span className="font-medium text-[#2D3748] dark:text-[#E2E8F0]">{formattedDate}</span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <Clock className="w-3.5 h-3.5 text-[#F3A683] dark:text-[#E8837D]" />
            <span className="font-mono tabular-nums text-[#2D3748] dark:text-[#E2E8F0]">{formattedTime}</span>
          </div>

          {/* Study Streak */}
          <div 
            onClick={onOpenDeskpad}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40 text-orange-700 dark:text-orange-300 hover:scale-[1.02] transition-transform"
            title="View streak badges & desk pad"
          >
            <Flame className="w-4 h-4 text-orange-500 animate-pulse fill-orange-500" />
            <span className="text-xs font-semibold tabular-nums">{profile.streakDays} Day Streak</span>
          </div>
        </div>

        {/* Center: Hand-drawn Ghibli Countdown Ribbon */}
        <div className="relative group">
          <div 
            onClick={() => setIsEditingExam(true)}
            className="cursor-pointer relative px-5 py-1.5 rounded-2xl bg-gradient-to-r from-[#FFE5D9] via-[#FFF0E6] to-[#FFE5D9] dark:from-[#1F304A] dark:via-[#263852] dark:to-[#1F304A] border-2 border-dashed border-[#F3A683] dark:border-[#4ECCA3]/60 shadow-xs flex items-center gap-2.5 transition-all hover:shadow-md hover:-translate-y-0.5"
            title="Click to edit target exam or deadline"
          >
            <span className="text-base">⌛</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                {daysLeft > 0 ? `${daysLeft} days` : daysLeft === 0 ? 'Today is the day!' : 'Exam completed!'}
              </span>
              <span className="text-xs text-[#718096] dark:text-[#94A3B8]">
                until
              </span>
              <span className="text-xs font-semibold text-[#D97706] dark:text-[#4ECCA3] underline decoration-dotted underline-offset-2">
                {profile.examName || 'My Exam'}
              </span>
            </div>
            <Edit3 className="w-3 h-3 text-[#718096] dark:text-[#94A3B8] opacity-60 group-hover:opacity-100 transition-opacity ml-1" />
          </div>
        </div>

        {/* Right: Theme Toggle & Density & Badges */}
        <div className="flex items-center gap-2">
          {/* Quick Deskpad button */}
          <button
            onClick={onOpenDeskpad}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100/80 dark:bg-[#0D1B2A]/60 hover:bg-stone-200/80 dark:hover:bg-[#0D1B2A] border border-[#EADBCC]/60 dark:border-[#2C3E55] text-xs font-medium text-[#2D3748] dark:text-[#E2E8F0] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F3A683] dark:text-[#4ECCA3]" />
            <span className="hidden sm:inline">Sticker Showcase</span>
          </button>

          {/* High Density toggle */}
          <button
            onClick={() => onUpdateProfile({ compactDensity: !profile.compactDensity })}
            className={`p-2 rounded-xl border transition-colors ${
              profile.compactDensity
                ? 'bg-[#88C0D0]/20 border-[#88C0D0] text-[#2D3748] dark:text-[#4ECCA3]'
                : 'bg-stone-100 dark:bg-[#0D1B2A]/60 border-[#EADBCC]/60 dark:border-[#2C3E55] text-[#718096] dark:text-[#94A3B8]'
            }`}
            title={profile.compactDensity ? 'Switch to Cozy Spacious View' : 'Switch to Compact High-Density View (Best for Laptops)'}
          >
            {profile.compactDensity ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={cycleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#0D1B2A]/60 hover:bg-stone-200 dark:hover:bg-[#0D1B2A] border border-[#EADBCC]/60 dark:border-[#2C3E55] text-xs font-medium text-[#2D3748] dark:text-[#E2E8F0] transition-colors"
            title={`Current: ${profile.themeMode}. Click to switch theme.`}
          >
            {profile.themeMode === 'light' && (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden lg:inline text-[11px]">Pastel Day</span>
              </>
            )}
            {profile.themeMode === 'dark' && (
              <>
                <Moon className="w-4 h-4 text-[#4ECCA3]" />
                <span className="hidden lg:inline text-[11px]">Ocean Night</span>
              </>
            )}
            {profile.themeMode === 'system' && (
              <>
                <Monitor className="w-4 h-4 text-sky-500" />
                <span className="hidden lg:inline text-[11px]">System</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Edit Exam Modal */}
      {isEditingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] shadow-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h3 className="text-base font-semibold text-[#2D3748] dark:text-[#E2E8F0]">
                  Target Exam & Milestone
                </h3>
              </div>
              <button
                onClick={() => setIsEditingExam(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#0D1B2A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Exam / Target Name
                </label>
                <input
                  type="text"
                  value={editExamName}
                  onChange={(e) => setEditExamName(e.target.value)}
                  placeholder="e.g. MCAT Biology, Finals, USMLE, CompSci"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#2C3E55] bg-stone-50 dark:bg-[#0D1B2A] text-sm text-[#2D3748] dark:text-[#E2E8F0] focus:outline-hidden focus:ring-2 focus:ring-[#88C0D0]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Target Exam Date
                </label>
                <input
                  type="date"
                  value={editExamDate}
                  onChange={(e) => setEditExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#2C3E55] bg-stone-50 dark:bg-[#0D1B2A] text-sm text-[#2D3748] dark:text-[#E2E8F0] focus:outline-hidden focus:ring-2 focus:ring-[#88C0D0]"
                  required
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#FFE5D9]/40 dark:bg-[#0D1B2A]/60 border border-[#F3A683]/40 text-xs text-[#718096] dark:text-[#94A3B8]">
                Nooki will calculate the exact remaining days and motivate you with daily spaced repetition check-ins!
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingExam(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#0D1B2A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#88C0D0] hover:bg-[#72b0c2] dark:bg-[#4ECCA3] dark:text-[#0D1B2A] text-white shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Ribbon Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
