import React from 'react';
import { 
  Clock, 
  Flame, 
  Layers, 
  Award, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'pomodoro' | 'spaced-rep' | 'deskpad' | 'history';
  setActiveTab: (tab: 'dashboard' | 'pomodoro' | 'spaced-rep' | 'deskpad' | 'history') => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  profile: UserProfile;
  dueCardsCount: number;
  todayMinutes: number;
}

export const NavigationSidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  profile,
  dueCardsCount,
  todayMinutes
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: '24h Focus Clock',
      icon: Clock,
      sublabel: `${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m today`
    },
    {
      id: 'pomodoro' as const,
      label: 'Pomodoro Engine',
      icon: Flame,
      sublabel: 'Custom focus & audio'
    },
    {
      id: 'spaced-rep' as const,
      label: 'Spaced Repetition',
      icon: Layers,
      sublabel: dueCardsCount > 0 ? `${dueCardsCount} cards due` : 'All caught up!'
    },
    {
      id: 'deskpad' as const,
      label: 'Desk Pad Stickers',
      icon: Award,
      sublabel: `${profile.unlockedBadges.length} badges unlocked`
    },
    {
      id: 'history' as const,
      label: 'Journal & Reflections',
      icon: BookOpen,
      sublabel: 'Daily study notes'
    }
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-[#EADBCC] dark:border-[#2C3E55] bg-white/80 dark:bg-[#1B263B]/90 backdrop-blur-md transition-all duration-300 z-20 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#EADBCC]/60 dark:border-[#2C3E55]/60">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#88C0D0] to-[#F3A683] p-[2px] shadow-sm">
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#1B263B] flex items-center justify-center overflow-hidden">
                <img
                  src="/src/assets/images/nooki_mascot_otter_1791910471677.jpg"
                  alt="Nooki Mascot"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base tracking-tight text-[#2D3748] dark:text-[#E2E8F0]">
                  Nooki
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-[#88C0D0] dark:text-[#4ECCA3] uppercase bg-[#88C0D0]/10 dark:bg-[#4ECCA3]/10 px-1.5 py-0.5 rounded">
                  Study
                </span>
              </div>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8] font-normal">
                Ghibli Companion
              </p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto w-10 h-10 rounded-xl overflow-hidden shadow-sm">
            <img
              src="/src/assets/images/nooki_mascot_otter_1791910471677.jpg"
              alt="Nooki"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg text-[#718096] hover:text-[#2D3748] dark:hover:text-[#E2E8F0] hover:bg-stone-100 dark:hover:bg-[#0D1B2A]/50 transition-colors ${
            isCollapsed ? 'hidden' : 'block'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {isCollapsed && (
        <div className="p-2 flex justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg text-[#718096] hover:text-[#2D3748] dark:hover:text-[#E2E8F0] hover:bg-stone-100 dark:hover:bg-[#0D1B2A]/50 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-left transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#88C0D0]/15 to-[#F3A683]/15 text-[#2D3748] dark:text-[#E2E8F0] border border-[#88C0D0]/30 dark:border-[#4ECCA3]/30 shadow-xs font-medium'
                  : 'text-[#718096] dark:text-[#94A3B8] hover:bg-stone-100/70 dark:hover:bg-[#0D1B2A]/40 hover:text-[#2D3748] dark:hover:text-[#E2E8F0]'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div
                className={`p-2 rounded-xl transition-colors shrink-0 ${
                  isActive
                    ? 'bg-[#88C0D0] text-white dark:bg-[#4ECCA3] dark:text-[#0D1B2A]'
                    : 'bg-stone-100 dark:bg-[#0D1B2A]/60 text-[#718096] dark:text-[#94A3B8]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate font-medium">{item.label}</span>
                    {item.id === 'spaced-rep' && dueCardsCount > 0 && (
                      <span className="text-[11px] font-semibold bg-[#F3A683] text-white dark:bg-[#E8837D] px-1.5 py-0.2 rounded-full">
                        {dueCardsCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] truncate">
                    {item.sublabel}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mascot Mini Widget in Footer */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-b from-[#FFF9F2] to-[#FFE5D9]/40 dark:from-[#0D1B2A]/80 dark:to-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55]">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F3A683] dark:text-[#4ECCA3]" />
            <span className="text-xs font-semibold text-[#2D3748] dark:text-[#E2E8F0]">
              Mascot Wisdom
            </span>
          </div>
          <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] leading-relaxed">
            "Sip warm tea, drop your shoulders, and conquer one card at a time."
          </p>
        </div>
      )}
    </aside>
  );
};
