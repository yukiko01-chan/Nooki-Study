import React from 'react';
import { BookOpen, Calendar, Clock, Smile, Flame, Sparkles } from 'lucide-react';
import { DailyReflection, StudyLog, UserProfile } from '../types';

interface ReflectionHistoryProps {
  reflections: DailyReflection[];
  studyLogs: StudyLog[];
  profile: UserProfile;
}

export const ReflectionHistory: React.FC<ReflectionHistoryProps> = ({
  reflections,
  studyLogs,
  profile
}) => {
  // Aggregate subject minutes
  const subjectTotals: { [key: string]: number } = {};
  studyLogs.forEach((l) => {
    subjectTotals[l.subject] = (subjectTotals[l.subject] || 0) + l.durationMinutes;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#88C0D0] dark:text-[#4ECCA3]" />
          <h2 className="text-xl font-bold text-[#2D3748] dark:text-[#E2E8F0]">
            Study Journal & Reflection Archive
          </h2>
        </div>
        <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
          Review past milestones, daily gratitude entries, and total hours invested
        </p>
      </div>

      {/* Focus by Subject summary cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#718096] dark:text-[#94A3B8] mb-3">
          Cumulative Subject Time
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(subjectTotals).map(([sub, mins]) => (
            <div
              key={sub}
              className="p-4 rounded-2xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] shadow-xs"
            >
              <span className="text-xs font-semibold text-[#88C0D0] dark:text-[#4ECCA3] truncate block">
                {sub}
              </span>
              <div className="text-xl font-black font-mono tabular-nums text-[#2D3748] dark:text-[#E2E8F0] mt-1">
                {Math.floor(mins / 60)}h {mins % 60}m
              </div>
              <span className="text-[10px] text-[#718096] dark:text-[#94A3B8]">
                {mins} total logged minutes
              </span>
            </div>
          ))}

          {Object.keys(subjectTotals).length === 0 && (
            <div className="col-span-full p-4 rounded-2xl bg-white dark:bg-[#1B263B] text-center text-xs text-[#718096]">
              No focus sessions recorded yet. Start your 24h clock to begin tracking.
            </div>
          )}
        </div>
      </div>

      {/* Daily Reflections Timeline */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#718096] dark:text-[#94A3B8] mb-3">
          Daily Journal Entries ({reflections.length})
        </h3>
        <div className="space-y-3">
          {reflections.map((ref, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#88C0D0] dark:text-[#4ECCA3]" />
                  <span className="text-xs font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                    {ref.date}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFF9F2] dark:bg-[#0D1B2A] border border-[#EADBCC] dark:border-[#2C3E55] text-xs">
                  <span className="text-amber-500">⚡</span>
                  <span className="font-semibold text-[#2D3748] dark:text-[#E2E8F0]">
                    Energy {ref.energyScore}/5
                  </span>
                </div>
              </div>

              {ref.wentWell && (
                <div>
                  <span className="text-[11px] font-bold text-[#718096] dark:text-[#94A3B8] block">
                    What went well:
                  </span>
                  <p className="text-xs text-[#2D3748] dark:text-[#E2E8F0] mt-0.5 leading-relaxed bg-[#FFF9F2]/70 dark:bg-[#0D1B2A]/40 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                    {ref.wentWell}
                  </p>
                </div>
              )}

              {ref.gratitude && (
                <div>
                  <span className="text-[11px] font-bold text-[#718096] dark:text-[#94A3B8] block">
                    Grateful for:
                  </span>
                  <p className="text-xs text-[#2D3748] dark:text-[#E2E8F0] mt-0.5 leading-relaxed bg-[#FFE5D9]/30 dark:bg-[#0D1B2A]/40 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                    {ref.gratitude}
                  </p>
                </div>
              )}
            </div>
          ))}

          {reflections.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#1B263B] border border-dashed border-stone-200 dark:border-stone-700 text-xs text-[#718096]">
              No reflections written yet. Fill in today's reflection card in the 24h dashboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
