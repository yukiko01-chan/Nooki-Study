import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Coffee, 
  Flame, 
  Sliders, 
  Sparkles, 
  Music, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { TimerMode, AudioAlertId, StudyLog, UserProfile } from '../types';
import { soundSynthesizer } from '../services/audioSynthesizer';

interface PomodoroTimerProps {
  profile: UserProfile;
  onAddStudyLog: (log: Omit<StudyLog, 'id'>) => void;
  selectedAlertSound: AudioAlertId;
  onChangeAlertSound: (sound: AudioAlertId) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  profile,
  onAddStudyLog,
  selectedAlertSound,
  onChangeAlertSound
}) => {
  // Mode: Focus (25m), Short Break (5m), Long Break (15m)
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [selectedPresetMinutes, setSelectedPresetMinutes] = useState<number>(25);
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [selectedSubject, setSelectedSubject] = useState<string>(profile.subjects[0] || 'Biology');
  
  // Timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalSecondsForSession, setTotalSecondsForSession] = useState<number>(25 * 60);
  const [sessionCompletedNotice, setSessionCompletedNotice] = useState<boolean>(false);

  const presets = [15, 25, 45, 60, 90, 120];

  const alertSounds: { id: AudioAlertId; label: string; icon: string }[] = [
    { id: 'soft-bell', label: 'Soft Bell Chimes', icon: '🔔' },
    { id: 'ocean-waves', label: 'Ocean Waves', icon: '🌊' },
    { id: 'seashell-taps', label: 'Seashell Taps', icon: '🐚' },
    { id: 'whale-song', label: 'Whale Song Echo', icon: '🐋' },
    { id: 'windchimes', label: 'Windchimes', icon: '🎐' }
  ];

  // Set mode changes
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    let mins = 25;
    if (newMode === 'pomodoro') {
      mins = selectedPresetMinutes;
    } else if (newMode === 'short-break') {
      mins = 5;
    } else if (newMode === 'long-break') {
      mins = 15;
    }
    setTimeLeftSeconds(mins * 60);
    setTotalSecondsForSession(mins * 60);
  };

  const handleSelectPreset = (mins: number) => {
    setSelectedPresetMinutes(mins);
    setCustomMinutes(mins);
    if (mode === 'pomodoro') {
      setIsRunning(false);
      setTimeLeftSeconds(mins * 60);
      setTotalSecondsForSession(mins * 60);
    }
  };

  const handleCustomSliderChange = (mins: number) => {
    setCustomMinutes(mins);
    setSelectedPresetMinutes(mins);
    if (mode === 'pomodoro') {
      setIsRunning(false);
      setTimeLeftSeconds(mins * 60);
      setTotalSecondsForSession(mins * 60);
    }
  };

  // Keyboard navigation: Space for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeftSeconds > 0) {
      interval = window.setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            // Timer complete!
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSeconds]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    soundSynthesizer.playAlert(selectedAlertSound);
    setSessionCompletedNotice(true);

    if (mode === 'pomodoro') {
      const minutesSpent = Math.max(1, Math.round(totalSecondsForSession / 60));
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      onAddStudyLog({
        date: now.toISOString().split('T')[0],
        startTime: timeStr,
        durationMinutes: minutesSpent,
        subject: selectedSubject,
        mode: 'pomodoro',
        note: `Completed ${minutesSpent}m Pomodoro Session`
      });
    }

    setTimeout(() => {
      setSessionCompletedNotice(false);
    }, 6000);
  };

  const togglePlayPause = () => {
    if (!isRunning) {
      soundSynthesizer.playAlert(selectedAlertSound);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    let mins = selectedPresetMinutes;
    if (mode === 'short-break') mins = 5;
    if (mode === 'long-break') mins = 15;
    setTimeLeftSeconds(mins * 60);
    setTotalSecondsForSession(mins * 60);
  };

  // Test Chime
  const handleTestChime = (soundId: AudioAlertId) => {
    onChangeAlertSound(soundId);
    soundSynthesizer.playAlert(soundId);
  };

  // Progress math
  const progressPercent = totalSecondsForSession > 0 
    ? ((totalSecondsForSession - timeLeftSeconds) / totalSecondsForSession) * 100 
    : 0;

  const minutesDisplay = Math.floor(timeLeftSeconds / 60);
  const secondsDisplay = timeLeftSeconds % 60;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Mode Segmented Controls */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] shadow-xs gap-1">
          <button
            onClick={() => switchMode('pomodoro')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'pomodoro'
                ? 'bg-[#88C0D0] dark:bg-[#4ECCA3] text-white dark:text-[#0D1B2A] shadow-xs'
                : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#2D3748] dark:hover:text-[#E2E8F0]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Focus Session
          </button>

          <button
            onClick={() => switchMode('short-break')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'short-break'
                ? 'bg-[#F3A683] dark:bg-[#E8837D] text-white shadow-xs'
                : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#2D3748] dark:hover:text-[#E2E8F0]'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Short Break (5m)
          </button>

          <button
            onClick={() => switchMode('long-break')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'long-break'
                ? 'bg-[#7BAE7F] dark:bg-[#52B788] text-white shadow-xs'
                : 'text-[#718096] dark:text-[#94A3B8] hover:text-[#2D3748] dark:hover:text-[#E2E8F0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Long Break (15m)
          </button>
        </div>
      </div>

      {/* Main Focus Ring Card */}
      <div className="max-w-2xl mx-auto rounded-3xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] p-8 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Completion Banner */}
        {sessionCompletedNotice && (
          <div className="absolute top-4 px-4 py-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Session completed & logged to your master dashboard!
          </div>
        )}

        {/* Circular Progress & Steaming Animation */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r="86"
              stroke="currentColor"
              strokeWidth="10"
              className="text-stone-100 dark:text-[#0D1B2A] fill-none"
            />
            {/* Animated progress ring */}
            <circle
              cx="100"
              cy="100"
              r="86"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 86}
              strokeDashoffset={2 * Math.PI * 86 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              className={`transition-all duration-500 fill-none ${
                mode === 'pomodoro'
                  ? 'text-[#88C0D0] dark:text-[#4ECCA3]'
                  : mode === 'short-break'
                  ? 'text-[#F3A683] dark:text-[#E8837D]'
                  : 'text-[#7BAE7F] dark:text-[#52B788]'
              }`}
            />
          </svg>

          {/* Center Digital Display & Mascot Graphic */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {/* Steaming cup icon */}
            <div className="relative mb-1">
              <span className="text-3xl">☕</span>
              {isRunning && (
                <>
                  <span className="absolute -top-3 left-1 text-xs text-[#88C0D0] dark:text-[#4ECCA3] animate-steam-1">
                    ~
                  </span>
                  <span className="absolute -top-4 right-1 text-xs text-[#F3A683] dark:text-[#E8837D] animate-steam-2">
                    ~
                  </span>
                </>
              )}
            </div>

            <div className="text-5xl sm:text-6xl font-black font-mono tabular-nums tracking-tight text-[#2D3748] dark:text-[#E2E8F0]">
              {String(minutesDisplay).padStart(2, '0')}:{String(secondsDisplay).padStart(2, '0')}
            </div>

            <span className="text-xs font-semibold text-[#718096] dark:text-[#94A3B8] mt-1 uppercase tracking-wider">
              {mode === 'pomodoro' ? selectedSubject : mode === 'short-break' ? 'Rest Eyes & Stretch' : 'Mindful Refresh'}
            </span>

            <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
              Press [Space] to {isRunning ? 'pause' : 'resume'}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={togglePlayPause}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:scale-[1.02] transition-all text-white ${
              isRunning
                ? 'bg-[#F3A683] hover:bg-[#eb9670]'
                : 'bg-[#88C0D0] hover:bg-[#72b0c2] dark:bg-[#4ECCA3] dark:text-[#0D1B2A]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                Pause Focus
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                Start Focus
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl border border-stone-200 dark:border-[#2C3E55] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#0D1B2A] transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Chips (15m, 25m, 45m, 60m, 90m, 120m) */}
        {mode === 'pomodoro' && (
          <div className="w-full mt-8 pt-6 border-t border-[#EADBCC]/60 dark:border-[#2C3E55]/60 space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#718096] dark:text-[#94A3B8] block mb-2">
                Quick Preset Chips:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {presets.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSelectPreset(mins)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedPresetMinutes === mins
                        ? 'bg-[#88C0D0] text-white dark:bg-[#4ECCA3] dark:text-[#0D1B2A] shadow-xs scale-105'
                        : 'bg-stone-100 dark:bg-[#0D1B2A] text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Slider Input */}
            <div className="max-w-md mx-auto space-y-1">
              <div className="flex justify-between items-center text-xs text-[#718096] dark:text-[#94A3B8]">
                <span>Custom Duration:</span>
                <span className="font-mono font-bold text-[#88C0D0] dark:text-[#4ECCA3]">
                  {customMinutes} minutes
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={customMinutes}
                onChange={(e) => handleCustomSliderChange(parseInt(e.target.value, 10))}
                className="w-full accent-[#88C0D0]"
              />
            </div>

            {/* Subject Selector */}
            <div className="max-w-xs mx-auto text-left">
              <label className="text-[11px] font-semibold text-[#718096] dark:text-[#94A3B8] block mb-1">
                Study Subject for this Session:
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#2C3E55] bg-stone-50 dark:bg-[#0D1B2A] text-xs font-medium text-[#2D3748] dark:text-[#E2E8F0]"
              >
                {profile.subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Audio Alert Preset Selector */}
      <div className="max-w-2xl mx-auto rounded-3xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#88C0D0] dark:text-[#4ECCA3]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D3748] dark:text-[#E2E8F0]">
              Custom Audio Alert Synthesizer
            </h3>
          </div>
          <span className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
            Triggers at session start & finish
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {alertSounds.map((snd) => {
            const isSelected = selectedAlertSound === snd.id;
            return (
              <button
                key={snd.id}
                onClick={() => handleTestChime(snd.id)}
                className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center ${
                  isSelected
                    ? 'border-[#88C0D0] dark:border-[#4ECCA3] bg-[#88C0D0]/10 dark:bg-[#4ECCA3]/10 text-[#2D3748] dark:text-[#E2E8F0] shadow-xs'
                    : 'border-stone-200 dark:border-[#2C3E55] hover:bg-stone-50 dark:hover:bg-[#0D1B2A] text-stone-600 dark:text-stone-300'
                }`}
                title="Click to select and test chime"
              >
                <span className="text-xl mb-1">{snd.icon}</span>
                <span className="text-[11px] font-semibold leading-tight line-clamp-1">
                  {snd.label}
                </span>
                <span className="text-[9px] text-[#88C0D0] dark:text-[#4ECCA3] mt-0.5">
                  ▶ Test Chime
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
