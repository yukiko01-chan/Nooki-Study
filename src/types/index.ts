export type MascotId = 'nooki' | 'tea-dragon' | 'calcifer' | 'totoro';

export interface UserProfile {
  displayName: string;
  mascot: MascotId;
  subjects: string[];
  examName: string;
  examDate: string; // YYYY-MM-DD
  email?: string;
  emailReminders: boolean;
  onboardingComplete: boolean;
  themeMode: 'light' | 'dark' | 'system';
  compactDensity: boolean;
  streakDays: number;
  lastActiveDate: string;
  unlockedBadges: string[];
}

export type TimerMode = 'pomodoro' | 'short-break' | 'long-break' | 'free-flow';

export interface StudyLog {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string;
  durationMinutes: number;
  subject: string;
  mode: TimerMode;
  note?: string;
}

export interface DailyReflection {
  date: string; // YYYY-MM-DD
  wentWell: string;
  gratitude: string;
  energyScore: number; // 1-5
  timestamp: number;
}

export interface Flashcard {
  id: string;
  deckId: string;
  subject: string;
  front: string;
  back: string;
  box: 1 | 2 | 3 | 4 | 5; // Leitner box: 1d, 3d, 7d, 14d, 30d
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewed?: string;
  consecutiveSuccesses: number;
}

export interface Deck {
  id: string;
  title: string;
  subject: string;
  description: string;
  color: string;
}

export interface MascotBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: 'Common' | 'Cozy' | 'Legendary';
  category: 'Focus' | 'Spaced Repetition' | 'Streak' | 'Ritual';
}

export type AudioAlertId = 'soft-bell' | 'ocean-waves' | 'seashell-taps' | 'whale-song' | 'windchimes';

export interface AmbientTrack {
  id: 'rain' | 'fireplace' | 'ocean' | 'cafe';
  name: string;
  icon: string;
  active: boolean;
  volume: number; // 0 to 1
}
