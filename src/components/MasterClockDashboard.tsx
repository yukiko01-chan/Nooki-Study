import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Heart, 
  ChevronRight, 
  ChevronLeft,
  X,
  Smile,
  Flame,
  Award
} from 'lucide-react';
import { StudyLog, DailyReflection, UserProfile } from '../types';
import { GHIBLI_QUOTES } from '../data/dialogues';
import { soundSynthesizer } from '../services/audioSynthesizer';

interface MasterClockDashboardProps {
  studyLogs: StudyLog[];
  onAddStudyLog: (log: Omit<StudyLog, 'id'>) => void;
  reflections: DailyReflection[];
  onSaveReflection: (reflection: Omit<DailyReflection, 'timestamp'>) => void;
  profile: UserProfile;
  isCompact?: boolean;
}

export const MasterClockDashboard: React.FC<MasterClockDashboardProps> = ({
  studyLogs,
  onAddStudyLog,
  reflections,
  onSaveReflection,
  profile,
  isCompact
}) => {
  // Continuous 24-hr live timer state backed by localStorage
  const [isRunning, setIsRunning] = useState<boolean>(() => {
    return localStorage.getItem('nooki_master_is_running') === 'true';
  });
  const [startTimeMs, setStartTimeMs] = useState<number>(() => {
    const saved = localStorage.getItem('nooki_master_start_time');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [accumulatedSeconds, setAccumulatedSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('nooki_master_accumulated_seconds');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [activeSubject, setActiveSubject] = useState<string>(profile.subjects[0] || 'General Focus');

  // Manual Log Modal
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualDuration, setManualDuration] = useState<number>(30);
  const [manualSubject, setManualSubject] = useState<string>(profile.subjects[0] || 'General Focus');
  const [manualNote, setManualNote] = useState<string>('');

  // Daily Reflection State
  const todayStr = new Date().toISOString().split('T')[0];
  const todayReflection = reflections.find((r) => r.date === todayStr);

  const [wentWell, setWentWell] = useState<string>(todayReflection?.wentWell || '');
  const [gratitude, setGratitude] = useState<string>(todayReflection?.gratitude || '');
  const [energyScore, setEnergyScore] = useState<number>(todayReflection?.energyScore || 4);
  const [reflectionSavedMessage, setReflectionSavedMessage] = useState<boolean>(false);

  // Rotating Ghibli Quote
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Timer loop with background recovery
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      interval = window.setInterval(() => {
        const now = Date.now();
        const elapsedSinceStart = Math.floor((now - startTimeMs) / 1000);
        setAccumulatedSeconds(elapsedSinceStart);
        localStorage.setItem('nooki_master_accumulated_seconds', elapsedSinceStart.toString());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTimeMs]);

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem('nooki_master_is_running', isRunning.toString());
    if (startTimeMs > 0) {
      localStorage.setItem('nooki_master_start_time', startTimeMs.toString());
    }
  }, [isRunning, startTimeMs]);

  const handleStartTimer = () => {
    const now = Date.now();
    const effectiveStart = now - (accumulatedSeconds * 1000);
    setStartTimeMs(effectiveStart);
    setIsRunning(true);
    soundSynthesizer.playAlert('soft-bell');
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
    // If accumulated > 60 seconds, offer or record session log
    if (accumulatedSeconds >= 60) {
      const minutes = Math.floor(accumulatedSeconds / 60);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      onAddStudyLog({
        date: todayStr,
        startTime: timeStr,
        durationMinutes: minutes,
        subject: activeSubject,
        mode: 'free-flow',
        note: 'Continuous master clock session'
      });
      // reset session segment
      setAccumulatedSeconds(0);
      localStorage.setItem('nooki_master_accumulated_seconds', '0');
    }
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setAccumulatedSeconds(0);
    setStartTimeMs(0);
    localStorage.setItem('nooki_master_accumulated_seconds', '0');
    localStorage.setItem('nooki_master_start_time', '0');
    localStorage.setItem('nooki_master_is_running', 'false');
  };

  // Calculate total today focus minutes from study logs
  const todayLogs = studyLogs.filter((l) => l.date === todayStr);
  const totalLoggedMinutesToday = todayLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
  const currentRunningMinutes = Math.floor(accumulatedSeconds / 60);
  const totalNetMinutesToday = totalLoggedMinutesToday + currentRunningMinutes;

  const totalHours = Math.floor(totalNetMinutesToday / 60);
  const totalMins = totalNetMinutesToday % 60;

  // Format accumulated seconds into HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Submit manual log
  const handleManualLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    onAddStudyLog({
      date: todayStr,
      startTime: timeStr,
      durationMinutes: manualDuration,
      subject: manualSubject,
      mode: 'free-flow',
      note: manualNote || 'Manual study entry'
    });
    soundSynthesizer.playAlert('seashell-taps');
    setShowManualModal(false);
    setManualNote('');
  };

  // Save Reflection
  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReflection({
      date: todayStr,
      wentWell,
      gratitude,
      energyScore
    });
    setReflectionSavedMessage(true);
    soundSynthesizer.playAlert('windchimes');
    setTimeout(() => setReflectionSavedMessage(false), 3000);
  };

  // Calculate current hour indicator (0 to 24)
  const currentNow = new Date();
  const currentHourFloat = currentNow.getHours() + currentNow.getMinutes() / 60;
  const hourAngle = (currentHourFloat / 24) * 360;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Hero Banner with Ghibli Room Background */}
      <div className="relative rounded-3xl overflow-hidden border border-[#EADBCC] dark:border-[#2C3E55] shadow-xs">
        <div className="h-44 sm:h-52 w-full relative">
          <img
            src="/src/assets/images/ghibli_study_banner_1791910471669.jpg"
            alt="Ghibli Study Desk"
            className="w-full h-full object-cover dark:hidden"
            referrerPolicy="no-referrer"
          />
          <img
            src="/src/assets/images/ghibli_night_banner_1791910472265.jpg"
            alt="Ghibli Night Desk"
            className="w-full h-full object-cover hidden dark:block"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#88C0D0] dark:text-[#4ECCA3] bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-lg border border-white/20">
                24-Hour Master Focus
              </span>
              <span className="text-xs text-white/80">·</span>
              <span className="text-xs text-white/90 font-medium">Continuous Day Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance drop-shadow-xs">
              Welcome to your quiet study sanctuary, {profile.displayName || 'Scholar'}.
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl text-balance">
              Track seamless focus time from midnight to midnight. No tick goes unnoticed.
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: 24h Master Clock + Daily Reflection / Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 24-Hour Master Clock (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#88C0D0] dark:text-[#4ECCA3]" />
                <h2 className="text-lg font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                  24-Hour Master Clock
                </h2>
              </div>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                Continuous day timeline (12:00 AM – 11:59 PM)
              </p>
            </div>

            {/* Total Today Accumulation Badge */}
            <div className="px-3.5 py-1.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#0D1B2A] border border-[#EADBCC] dark:border-[#2C3E55] flex items-center gap-2">
              <span className="text-xs text-[#718096] dark:text-[#94A3B8]">Today's Total:</span>
              <span className="text-sm font-bold font-mono tabular-nums text-[#2D3748] dark:text-[#E2E8F0]">
                {totalHours}h {totalMins}m
              </span>
            </div>
          </div>

          {/* 24-Hour Circular Dial & Live Digital Readout */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4 bg-[#FFF9F2]/60 dark:bg-[#0D1B2A]/40 rounded-3xl p-6 border border-[#EADBCC]/60 dark:border-[#2C3E55]/60">
            {/* SVG 24-Hour Dial */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Outer ring track */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-stone-200 dark:text-[#2C3E55] fill-none"
                />

                {/* Studied hour segments (highlighted) */}
                {Array.from({ length: 24 }).map((_, hour) => {
                  // Check if any study occurred in this hour
                  const hourStudied = todayLogs.some((l) => {
                    const startH = parseInt(l.startTime.split(':')[0], 10);
                    return startH === hour;
                  });

                  if (!hourStudied) return null;

                  const circumference = 2 * Math.PI * 70;
                  const segmentLength = circumference / 24;
                  const strokeDasharray = `${segmentLength - 2} ${circumference - (segmentLength - 2)}`;
                  const strokeDashoffset = -hour * segmentLength;

                  return (
                    <circle
                      key={hour}
                      cx="80"
                      cy="80"
                      r="70"
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="text-[#88C0D0] dark:text-[#4ECCA3] stroke-current fill-none transition-all"
                    />
                  );
                })}

                {/* Hour tick marks */}
                {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => {
                  const angle = (h / 24) * 360 * (Math.PI / 180);
                  const x1 = 80 + 64 * Math.cos(angle);
                  const y1 = 80 + 64 * Math.sin(angle);
                  const x2 = 80 + 74 * Math.cos(angle);
                  const y2 = 80 + 74 * Math.sin(angle);
                  return (
                    <line
                      key={h}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-stone-400 dark:text-stone-500"
                    />
                  );
                })}
              </svg>

              {/* Hand Dial pointer for Current Hour */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-1000"
                style={{ transform: `rotate(${hourAngle}deg)` }}
              >
                <div className="w-1.5 h-20 bg-[#F3A683] dark:bg-[#E8837D] rounded-full -translate-y-10 shadow-xs relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F3A683] dark:bg-[#E8837D] -translate-x-1 -translate-y-1 shadow-sm" />
                </div>
              </div>

              {/* Center Steaming Mug or Badge */}
              <div className="absolute w-20 h-20 rounded-full bg-white dark:bg-[#1B263B] shadow-md border border-[#EADBCC] dark:border-[#2C3E55] flex flex-col items-center justify-center text-center p-2">
                <div className="relative mb-0.5">
                  <span className="text-xl">🍵</span>
                  {isRunning && (
                    <span className="absolute -top-3 left-1 text-[10px] animate-steam-1 text-[#88C0D0]">
                      ~
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-[#718096] dark:text-[#94A3B8] leading-tight">
                  {isRunning ? 'FOCUS' : 'REST'}
                </span>
              </div>
            </div>

            {/* Digital Timer Readout & Controls */}
            <div className="text-center sm:text-left space-y-3">
              <div>
                <span className="text-xs text-[#718096] dark:text-[#94A3B8] font-medium block">
                  Current Session Focus
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight text-[#2D3748] dark:text-[#E2E8F0]">
                  {formatTime(accumulatedSeconds)}
                </div>
              </div>

              {/* Subject Selector */}
              <div>
                <label className="text-[11px] text-[#718096] dark:text-[#94A3B8] font-medium mb-1 block">
                  Active Subject:
                </label>
                <select
                  value={activeSubject}
                  onChange={(e) => setActiveSubject(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#EADBCC] dark:border-[#2C3E55] bg-white dark:bg-[#1B263B] text-xs font-medium text-[#2D3748] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#88C0D0]"
                >
                  {profile.subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Main Controls: Start, Pause, Reset, Manual */}
              <div className="flex items-center gap-2 pt-1">
                {!isRunning ? (
                  <button
                    onClick={handleStartTimer}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#88C0D0] hover:bg-[#72b0c2] text-white dark:bg-[#4ECCA3] dark:text-[#0D1B2A] text-xs font-bold shadow-md hover:scale-[1.02] transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Start Clock
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTimer}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F3A683] hover:bg-[#eb9670] text-white text-xs font-bold shadow-md hover:scale-[1.02] transition-all"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    Log & Pause
                  </button>
                )}

                <button
                  onClick={handleResetTimer}
                  className="p-2.5 rounded-2xl border border-stone-200 dark:border-[#2C3E55] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#0D1B2A] transition-colors"
                  title="Reset clock segment"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowManualModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-dashed border-[#88C0D0] dark:border-[#4ECCA3] text-xs font-medium text-[#2D3748] dark:text-[#E2E8F0] hover:bg-[#88C0D0]/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Manual Log
                </button>
              </div>
            </div>
          </div>

          {/* Today's Study Logged Sessions List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#718096] dark:text-[#94A3B8]">
                Today's Recorded Sessions ({todayLogs.length})
              </h3>
              <span className="text-[11px] text-[#88C0D0] dark:text-[#4ECCA3] font-medium">
                {totalLoggedMinutesToday} mins stored
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {todayLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F2] dark:bg-[#0D1B2A]/50 border border-[#EADBCC]/70 dark:border-[#2C3E55]/70 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#88C0D0]/20 dark:bg-[#4ECCA3]/20 flex items-center justify-center text-[#88C0D0] dark:text-[#4ECCA3] font-bold">
                      ✓
                    </div>
                    <div>
                      <span className="font-semibold text-[#2D3748] dark:text-[#E2E8F0] block">
                        {log.subject}
                      </span>
                      <span className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                        {log.note || 'Focus block'} · started at {log.startTime}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-[#F3A683] dark:text-[#E8837D]">
                    +{log.durationMinutes} min
                  </span>
                </div>
              ))}

              {todayLogs.length === 0 && (
                <div className="p-4 rounded-2xl bg-[#FFF9F2]/50 dark:bg-[#0D1B2A]/30 border border-dashed border-stone-200 dark:border-stone-800 text-center text-xs text-[#718096] dark:text-[#94A3B8]">
                  No sessions logged yet today. Click "Start Clock" or add a manual entry to light up your 24-hr dial!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Daily Reflection & Quote Widget (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Rotating Ghibli Quote Widget */}
          <div className="rounded-3xl bg-gradient-to-br from-[#FFF9F2] via-white to-[#FFE5D9]/40 dark:from-[#1B263B] dark:via-[#1B263B] dark:to-[#0D1B2A] border border-[#EADBCC] dark:border-[#2C3E55] p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F3A683] dark:text-[#4ECCA3]" />
                <span className="text-xs font-bold text-[#2D3748] dark:text-[#E2E8F0] tracking-wide">
                  Ghibli Inspiration
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQuoteIndex((prev) => (prev > 0 ? prev - 1 : GHIBLI_QUOTES.length - 1))}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setQuoteIndex((prev) => (prev + 1) % GHIBLI_QUOTES.length)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <blockquote className="text-sm italic text-[#2D3748] dark:text-[#E2E8F0] leading-relaxed my-2">
              "{GHIBLI_QUOTES[quoteIndex].quote}"
            </blockquote>
            <p className="text-[11px] font-semibold text-[#88C0D0] dark:text-[#4ECCA3] text-right">
              — {GHIBLI_QUOTES[quoteIndex].source}
            </p>
          </div>

          {/* Daily Reflection Journal Box */}
          <div className="rounded-3xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#88C0D0] dark:text-[#4ECCA3]" />
                <h3 className="text-sm font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                  Daily Reflection Journal
                </h3>
              </div>
              <span className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                {todayStr}
              </span>
            </div>

            <form onSubmit={handleSaveReflection} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#2D3748] dark:text-[#E2E8F0] mb-1">
                  What went well today?
                </label>
                <textarea
                  value={wentWell}
                  onChange={(e) => setWentWell(e.target.value)}
                  placeholder="e.g. Mastered the Krebs cycle electron steps, stayed focused for 3 solid hours..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-2xl border border-stone-200 dark:border-[#2C3E55] bg-stone-50 dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#88C0D0] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D3748] dark:text-[#E2E8F0] mb-1">
                  What are you grateful for?
                </label>
                <input
                  type="text"
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  placeholder="e.g. Fresh matcha tea, quiet afternoon rain outside my window..."
                  className="w-full px-3 py-2 rounded-2xl border border-stone-200 dark:border-[#2C3E55] bg-stone-50 dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#88C0D0] focus:outline-hidden"
                />
              </div>

              {/* Energy rating */}
              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Study Energy Level (1 to 5):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setEnergyScore(level)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        energyScore === level
                          ? 'bg-[#88C0D0] text-white dark:bg-[#4ECCA3] dark:text-[#0D1B2A] shadow-xs'
                          : 'bg-stone-100 dark:bg-[#0D1B2A] text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {level} {level === 5 ? '⚡' : level === 1 ? '😴' : '🌱'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                {reflectionSavedMessage ? (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved to your journal!
                  </span>
                ) : (
                  <span className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                    Saves to your local journal history
                  </span>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 rounded-2xl bg-[#F3A683] hover:bg-[#eb9670] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Save Reflection
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Manual Study Log Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] shadow-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#88C0D0] dark:text-[#4ECCA3]" />
                <h3 className="text-sm font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                  Log Focus Time Manually
                </h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Subject
                </label>
                <select
                  value={manualSubject}
                  onChange={(e) => setManualSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#2C3E55] bg-stone-50 dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0]"
                >
                  {profile.subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-[#718096] dark:text-[#94A3B8]">
                    Duration
                  </label>
                  <span className="text-xs font-mono font-bold text-[#88C0D0] dark:text-[#4ECCA3]">
                    {manualDuration} minutes
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(parseInt(e.target.value, 10))}
                  className="w-full accent-[#88C0D0]"
                />
                <div className="flex gap-2 mt-2">
                  {[15, 25, 45, 60, 90].map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => setManualDuration(quick)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        manualDuration === quick
                          ? 'bg-[#88C0D0] text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {quick}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Optional Note
                </label>
                <input
                  type="text"
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  placeholder="e.g. Chapter 4 problem set"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#2C3E55] bg-stone-50 dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#88C0D0] dark:bg-[#4ECCA3] text-white dark:text-[#0D1B2A] text-xs font-bold shadow-xs hover:opacity-90"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
