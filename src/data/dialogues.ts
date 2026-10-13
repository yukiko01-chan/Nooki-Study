import { MascotBadge } from '../types';

export interface MascotDialogue {
  id: number;
  type: 'tip' | 'encouragement';
  icon: string;
  category: string;
  quote: string;
}

export const NOOKI_DIALOGUES: MascotDialogue[] = [
  {
    id: 1,
    type: 'tip',
    icon: '💡',
    category: 'Active Recall',
    quote: 'Embrace active recall – Quiz yourself with flashcards instead of passively highlighting text.'
  },
  {
    id: 2,
    type: 'tip',
    icon: '⏱️',
    category: 'Bite-Sized Sessions',
    quote: 'Keep sessions bite-sized – Aim for short 10-to-15 minute daily reviews to avoid burnout.'
  },
  {
    id: 3,
    type: 'tip',
    icon: '🧠',
    category: 'Algorithm Trust',
    quote: 'Trust the spaced repetition algorithm – Let the app schedule your cards right before you forget them.'
  },
  {
    id: 4,
    type: 'tip',
    icon: '🧸',
    category: 'Feynman Method',
    quote: 'Teach a mascot or plushie – Explain tough concepts out loud using simple words!'
  },
  {
    id: 5,
    type: 'tip',
    icon: '🕯️',
    category: 'Cozy Ambiance',
    quote: 'Set the mood – Dim overhead lights, switch on a warm desk lamp, and play gentle Lofi or rain sounds.'
  },
  {
    id: 6,
    type: 'tip',
    icon: '🍵',
    category: 'Tea Ritual',
    quote: 'Pair study with a cozy ritual – Enjoy a warm cup of tea, matcha, or cocoa while reviewing your deck.'
  },
  {
    id: 7,
    type: 'tip',
    icon: '🧘',
    category: 'Micro-Breaks',
    quote: 'Take micro-breaks – Unclench your jaw, drop your shoulders, and rest your eyes after every deck.'
  },
  {
    id: 8,
    type: 'tip',
    icon: '🌱',
    category: 'Progress Mindset',
    quote: 'Focus on progress, not perfection – Missing a day is okay; just pick right back up when you can.'
  },
  {
    id: 9,
    type: 'encouragement',
    icon: '🌸',
    category: 'Welcome Back',
    quote: 'Welcome back! Ready for a quick, cozy study session?'
  },
  {
    id: 10,
    type: 'encouragement',
    icon: '⭐',
    category: 'Steady Growth',
    quote: 'One small card at a time—you are making real progress!'
  },
  {
    id: 11,
    type: 'encouragement',
    icon: '☕',
    category: 'Settle In',
    quote: 'Take a deep breath, sip your drink, and settle in.'
  },
  {
    id: 12,
    type: 'encouragement',
    icon: '🚀',
    category: 'Mind Power',
    quote: 'Your mind is growing stronger with every review.'
  },
  {
    id: 13,
    type: 'encouragement',
    icon: '🌿',
    category: 'Rest & Breathe',
    quote: 'Halfway done! Remember to relax your shoulders.'
  },
  {
    id: 14,
    type: 'encouragement',
    icon: '🎉',
    category: 'Retention Win',
    quote: "You're doing amazing—look at how much you've already retained!"
  },
  {
    id: 15,
    type: 'encouragement',
    icon: '🔔',
    category: 'Session Complete',
    quote: 'Session complete! Time to rest and enjoy a well-deserved break.'
  },
  {
    id: 16,
    type: 'encouragement',
    icon: '🏆',
    category: 'Daily Triumph',
    quote: 'All caught up! Your future self is going to thank you for today\'s effort.'
  }
];

export const INITIAL_BADGES: MascotBadge[] = [
  {
    id: 'first-session',
    title: 'First Steaming Cup',
    description: 'Completed your first 25-minute focus session.',
    icon: '☕',
    unlocked: true,
    rarity: 'Common',
    category: 'Focus'
  },
  {
    id: 'active-recall-star',
    title: 'Active Recall Scholar',
    description: 'Reviewed all due spaced repetition flashcards for the day.',
    icon: '⭐',
    unlocked: false,
    rarity: 'Cozy',
    category: 'Spaced Repetition'
  },
  {
    id: 'tea-dragon-blessing',
    title: 'Tea Dragon’s Warmth',
    description: 'Studied for 2 or more cumulative hours in a single day.',
    icon: '🐉',
    unlocked: false,
    rarity: 'Legendary',
    category: 'Focus'
  },
  {
    id: 'dawn-lantern',
    title: 'Dawn Lantern',
    description: 'Logged a study session before 9:00 AM.',
    icon: '🏮',
    unlocked: false,
    rarity: 'Cozy',
    category: 'Ritual'
  },
  {
    id: 'streak-keeper',
    title: 'Forest Path Walker',
    description: 'Maintained a consecutive study streak of 3+ days.',
    icon: '🌱',
    unlocked: false,
    rarity: 'Legendary',
    category: 'Streak'
  },
  {
    id: 'night-whisperer',
    title: 'Starlight Scholar',
    description: 'Finished an evening focus session with ambient rain or fireplace sounds.',
    icon: '🌙',
    unlocked: false,
    rarity: 'Cozy',
    category: 'Ritual'
  },
  {
    id: 'memory-master',
    title: 'Box 5 Leitner Master',
    description: 'Successfully promoted 5 flashcards to the 30-day retention box.',
    icon: '🗝️',
    unlocked: false,
    rarity: 'Legendary',
    category: 'Spaced Repetition'
  },
  {
    id: 'reflection-sage',
    title: 'Journaling Sage',
    description: 'Wrote down your daily reflection and gratitude note.',
    icon: '📖',
    unlocked: false,
    rarity: 'Common',
    category: 'Ritual'
  }
];

export const GHIBLI_QUOTES = [
  {
    quote: "Always believe in yourself. Do this and no matter where you are, you will have nothing to fear.",
    source: "The Cat Returns"
  },
  {
    quote: "We each need to find our own inspiration. Sometimes it's not easy.",
    source: "Kiki's Delivery Service"
  },
  {
    quote: "No matter how many weapons you have, no matter how great your technology might be, the world cannot live without love.",
    source: "Castle in the Sky"
  },
  {
    quote: "A heart's a heavy burden, but steady steps carry it through the mountains.",
    source: "Howl's Moving Castle"
  },
  {
    quote: "Just keep your head high and take the next step. Even the tallest trees begin as quiet acorns.",
    source: "My Neighbor Totoro"
  },
  {
    quote: "The wind is rising! We must try to live.",
    source: "The Wind Rises"
  }
];
