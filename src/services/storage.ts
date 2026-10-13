import { UserProfile, StudyLog, DailyReflection, Flashcard, Deck, MascotBadge, AmbientTrack } from '../types';
import { INITIAL_BADGES } from '../data/dialogues';

const STORAGE_KEYS = {
  PROFILE: 'nooki_user_profile',
  STUDY_LOGS: 'nooki_study_logs',
  REFLECTIONS: 'nooki_daily_reflections',
  FLASHCARDS: 'nooki_flashcards',
  DECKS: 'nooki_decks',
  BADGES: 'nooki_badges',
  AMBIENT: 'nooki_ambient_tracks',
  ACTIVE_TIMER: 'nooki_active_timer_state'
};

export const DEFAULT_PROFILE: UserProfile = {
  displayName: 'Chihiro',
  mascot: 'nooki',
  subjects: ['Biology', 'Computer Science', 'Literature', 'Pharmacology'],
  examName: 'Midterm Board Exams',
  examDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  email: 'chihiro@ghibli.studio',
  emailReminders: true,
  onboardingComplete: false,
  themeMode: 'light',
  compactDensity: false,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  unlockedBadges: ['first-session', 'active-recall-star']
};

export const DEFAULT_DECKS: Deck[] = [
  {
    id: 'deck-bio',
    title: 'Cellular Respiration & Krebs',
    subject: 'Biology',
    description: 'ATP synthases, mitochondrial electron transport chain, glycolysis stages.',
    color: '#88C0D0'
  },
  {
    id: 'deck-cs',
    title: 'Algorithms & Data Structures',
    subject: 'Computer Science',
    description: 'Dynamic programming, graph traversals, amortized complexity & heaps.',
    color: '#4ECCA3'
  },
  {
    id: 'deck-pharm',
    title: 'Clinical Pharmacology Essentials',
    subject: 'Pharmacology',
    description: 'Receptor agonists, half-life kinetics, antimicrobial classifications.',
    color: '#F3A683'
  },
  {
    id: 'deck-lit',
    title: 'Literary Theory & Rhetoric',
    subject: 'Literature',
    description: 'Narrative framing, hermeneutics, allegorical symbolism & meter.',
    color: '#E8837D'
  }
];

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: 'card-1',
    deckId: 'deck-bio',
    subject: 'Biology',
    front: 'Where does the Krebs (Citric Acid) Cycle specifically take place within eukaryotic cells?',
    back: 'In the mitochondrial matrix (producing NADH, FADH2, and GTP/ATP).',
    box: 1, // Due today (1 day interval)
    nextReviewDate: todayStr,
    lastReviewed: yesterdayStr,
    consecutiveSuccesses: 1
  },
  {
    id: 'card-2',
    deckId: 'deck-bio',
    subject: 'Biology',
    front: 'What is the theoretical maximum net ATP yield per glucose molecule during aerobic cellular respiration?',
    back: 'Approximately 30 to 32 ATP molecules (accounting for proton leak and transport costs).',
    box: 2, // 3-day interval
    nextReviewDate: todayStr,
    lastReviewed: yesterdayStr,
    consecutiveSuccesses: 2
  },
  {
    id: 'card-3',
    deckId: 'deck-cs',
    subject: 'Computer Science',
    front: 'What is the average and worst-case time complexity of QuickSort?',
    back: 'Average: O(n log n). Worst case: O(n²) when the pivot chosen is consistently the smallest or largest element.',
    box: 1,
    nextReviewDate: todayStr,
    consecutiveSuccesses: 0
  },
  {
    id: 'card-4',
    deckId: 'deck-cs',
    subject: 'Computer Science',
    front: 'What key property distinguishes Dijkstra’s algorithm from the Bellman-Ford algorithm?',
    back: 'Dijkstra assumes all edge weights are non-negative, whereas Bellman-Ford can handle negative edge weights and detect negative cycles.',
    box: 3,
    nextReviewDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    lastReviewed: yesterdayStr,
    consecutiveSuccesses: 3
  },
  {
    id: 'card-5',
    deckId: 'deck-pharm',
    subject: 'Pharmacology',
    front: 'What is the mechanism of action for Beta-lactam antibiotics (e.g., Penicillin)?',
    back: 'They inhibit penicillin-binding proteins (PBPs), disrupting peptidoglycan cell wall cross-linking and causing bacterial cell lysis.',
    box: 1,
    nextReviewDate: todayStr,
    consecutiveSuccesses: 0
  },
  {
    id: 'card-6',
    deckId: 'deck-pharm',
    subject: 'Pharmacology',
    front: 'Define "Therapeutic Index" (TI) and state how it is calculated.',
    back: 'Ratio that compares the blood concentration at which a drug becomes toxic (TD50) to the concentration at which it is effective (ED50). TI = TD50 / ED50.',
    box: 4,
    nextReviewDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    consecutiveSuccesses: 4
  },
  {
    id: 'card-7',
    deckId: 'deck-lit',
    subject: 'Literature',
    front: 'What is "Synecdoche" and how does it differ from "Metonymy"?',
    back: 'Synecdoche uses a physical part of something to represent the whole (e.g., "all hands on deck"), whereas metonymy replaces the word with a closely linked concept (e.g., "the crown" for monarchy).',
    box: 2,
    nextReviewDate: todayStr,
    consecutiveSuccesses: 2
  }
];

export const DEFAULT_AMBIENT_TRACKS: AmbientTrack[] = [
  { id: 'rain', name: 'Cozy Rain', icon: '🌧️', active: false, volume: 0.6 },
  { id: 'fireplace', name: 'Fireplace Crackle', icon: '🔥', active: false, volume: 0.5 },
  { id: 'ocean', name: 'Ocean Waves', icon: '🌊', active: false, volume: 0.5 },
  { id: 'cafe', name: 'Cafe Ambiance', icon: '☕', active: false, volume: 0.4 }
];

export const getProfile = (): UserProfile => {
  const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!saved) return DEFAULT_PROFILE;
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const getStudyLogs = (): StudyLog[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.STUDY_LOGS);
  if (!saved) {
    // Generate some starter logs for today so the 24-hr clock has interesting visuals!
    const today = new Date().toISOString().split('T')[0];
    const initialLogs: StudyLog[] = [
      {
        id: 'seed-1',
        date: today,
        startTime: '08:30',
        endTime: '09:15',
        durationMinutes: 45,
        subject: 'Biology',
        mode: 'pomodoro',
        note: 'Krebs cycle electron transport flow'
      },
      {
        id: 'seed-2',
        date: today,
        startTime: '10:00',
        endTime: '10:50',
        durationMinutes: 50,
        subject: 'Computer Science',
        mode: 'pomodoro',
        note: 'Dynamic programming memoization tables'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.STUDY_LOGS, JSON.stringify(initialLogs));
    return initialLogs;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

export const saveStudyLogs = (logs: StudyLog[]): void => {
  localStorage.setItem(STORAGE_KEYS.STUDY_LOGS, JSON.stringify(logs));
};

export const getReflections = (): DailyReflection[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
  if (!saved) {
    const today = new Date().toISOString().split('T')[0];
    const sample: DailyReflection[] = [
      {
        date: today,
        wentWell: 'Finished 2 focused review blocks before lunchtime and understood the respiratory quotient!',
        gratitude: 'Warm jasmine tea on my desk and peaceful birds chirping outside.',
        energyScore: 4,
        timestamp: Date.now() - 3600000
      }
    ];
    return sample;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

export const saveReflections = (refs: DailyReflection[]): void => {
  localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(refs));
};

export const getFlashcards = (): Flashcard[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(DEFAULT_FLASHCARDS));
    return DEFAULT_FLASHCARDS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_FLASHCARDS;
  }
};

export const saveFlashcards = (cards: Flashcard[]): void => {
  localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
};

export const getDecks = (): Deck[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.DECKS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(DEFAULT_DECKS));
    return DEFAULT_DECKS;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_DECKS;
  }
};

export const saveDecks = (decks: Deck[]): void => {
  localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
};

export const getBadges = (): MascotBadge[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(INITIAL_BADGES));
    return INITIAL_BADGES;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return INITIAL_BADGES;
  }
};

export const saveBadges = (badges: MascotBadge[]): void => {
  localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
};

export const getAmbientTracks = (): AmbientTrack[] => {
  const saved = localStorage.getItem(STORAGE_KEYS.AMBIENT);
  if (!saved) return DEFAULT_AMBIENT_TRACKS;
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_AMBIENT_TRACKS;
  }
};

export const saveAmbientTracks = (tracks: AmbientTrack[]): void => {
  localStorage.setItem(STORAGE_KEYS.AMBIENT, JSON.stringify(tracks));
};
