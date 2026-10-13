import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Layers, 
  RotateCw, 
  Plus, 
  Check, 
  Sparkles, 
  Filter, 
  Calendar, 
  Award, 
  ChevronRight, 
  X, 
  Search,
  BookOpen,
  ArrowRight,
  Eye,
  Trash2
} from 'lucide-react';
import { Flashcard, Deck, UserProfile } from '../types';
import { soundSynthesizer } from '../services/audioSynthesizer';

interface SpacedRepetitionDeckProps {
  cards: Flashcard[];
  onUpdateCards: (cards: Flashcard[]) => void;
  decks: Deck[];
  profile: UserProfile;
  onUnlockBadge: (badgeId: string) => void;
  onOpenDeskpad: () => void;
  isCompact?: boolean;
}

export const SpacedRepetitionDeck: React.FC<SpacedRepetitionDeckProps> = ({
  cards,
  onUpdateCards,
  decks,
  profile,
  onUnlockBadge,
  onOpenDeskpad,
  isCompact
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [filterDueOnly, setFilterDueOnly] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Review Mode State
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Victory State
  const [showVictoryOverlay, setShowVictoryOverlay] = useState<boolean>(false);

  // Add Card Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newFront, setNewFront] = useState<string>('');
  const [newBack, setNewBack] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>(profile.subjects[0] || 'Biology');
  const [newDeckId, setNewDeckId] = useState<string>(decks[0]?.id || 'deck-bio');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter cards
  const filteredCards = cards.filter((card) => {
    if (selectedSubject !== 'all' && card.subject !== selectedSubject) return false;
    if (filterDueOnly && card.nextReviewDate > todayStr) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return card.front.toLowerCase().includes(q) || card.back.toLowerCase().includes(q);
    }
    return true;
  });

  const dueTodayCards = cards.filter((c) => c.nextReviewDate <= todayStr);

  // Box intervals in days
  const boxIntervals: { [key in 1 | 2 | 3 | 4 | 5]: number } = {
    1: 1,
    2: 3,
    3: 7,
    4: 14,
    5: 30
  };

  // Keyboard navigation during review
  useEffect(() => {
    if (!isReviewing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1' && isFlipped) {
        handleReviewScore('again');
      } else if (e.key === '2' && isFlipped) {
        handleReviewScore('hard');
      } else if (e.key === '3' && isFlipped) {
        handleReviewScore('good');
      } else if (e.key === '4' && isFlipped) {
        handleReviewScore('easy');
      } else if (e.code === 'Escape') {
        setIsReviewing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReviewing, isFlipped, activeReviewIndex, filteredCards]);

  const startReviewSession = () => {
    if (filteredCards.length === 0) return;
    setActiveReviewIndex(0);
    setIsFlipped(false);
    setIsReviewing(true);
    soundSynthesizer.playAlert('seashell-taps');
  };

  const handleReviewScore = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const currentCard = filteredCards[activeReviewIndex];
    if (!currentCard) return;

    let nextBox: 1 | 2 | 3 | 4 | 5 = 1;
    let daysToAdd = 1;

    if (rating === 'again') {
      nextBox = 1;
      daysToAdd = 1;
    } else if (rating === 'hard') {
      nextBox = 2;
      daysToAdd = 3;
    } else if (rating === 'good') {
      nextBox = Math.min(5, currentCard.box + 1) as 1 | 2 | 3 | 4 | 5;
      daysToAdd = boxIntervals[nextBox];
    } else if (rating === 'easy') {
      nextBox = Math.min(5, currentCard.box + 2) as 1 | 2 | 3 | 4 | 5;
      daysToAdd = boxIntervals[nextBox];
    }

    const nextDate = new Date(Date.now() + daysToAdd * 86400000).toISOString().split('T')[0];

    // Update the card in main list
    const updatedCards = cards.map((c) => {
      if (c.id === currentCard.id) {
        return {
          ...c,
          box: nextBox,
          nextReviewDate: nextDate,
          lastReviewed: todayStr,
          consecutiveSuccesses: rating === 'again' ? 0 : c.consecutiveSuccesses + 1
        };
      }
      return c;
    });

    onUpdateCards(updatedCards);

    // Check if reached Box 5 (unlock memory master badge)
    if (nextBox === 5) {
      onUnlockBadge('memory-master');
    }

    // Move to next card in review queue
    if (activeReviewIndex + 1 < filteredCards.length) {
      setActiveReviewIndex((prev) => prev + 1);
      setIsFlipped(false);
      soundSynthesizer.playAlert('seashell-taps');
    } else {
      // Completed all cards in the session!
      handleSessionFinished();
    }
  };

  const handleSessionFinished = () => {
    setIsReviewing(false);
    setShowVictoryOverlay(true);
    soundSynthesizer.playVictoryFanfare();
    onUnlockBadge('active-recall-star');

    // Confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#88C0D0', '#F3A683', '#4ECCA3', '#FFE5D9', '#E8837D']
    });
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      deckId: newDeckId,
      subject: newSubject,
      front: newFront.trim(),
      back: newBack.trim(),
      box: 1,
      nextReviewDate: todayStr,
      consecutiveSuccesses: 0
    };

    onUpdateCards([newCard, ...cards]);
    soundSynthesizer.playAlert('soft-bell');
    setShowAddModal(false);
    setNewFront('');
    setNewBack('');
  };

  const handleDeleteCard = (cardId: string) => {
    onUpdateCards(cards.filter((c) => c.id !== cardId));
  };

  const currentReviewCard = filteredCards[activeReviewIndex];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Metric Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#88C0D0] dark:text-[#4ECCA3]" />
            <h2 className="text-xl font-bold text-[#2D3748] dark:text-[#E2E8F0]">
              Spaced Repetition Planner
            </h2>
          </div>
          <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
            SM-2 & Leitner Box Algorithm (1d · 3d · 7d · 14d · 30d retention intervals)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 dark:bg-[#0D1B2A] hover:bg-stone-200 dark:hover:bg-stone-800 border border-[#EADBCC] dark:border-[#2C3E55] text-xs font-semibold text-[#2D3748] dark:text-[#E2E8F0] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Flashcard
          </button>

          <button
            onClick={startReviewSession}
            disabled={filteredCards.length === 0}
            className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-[#88C0D0] hover:bg-[#72b0c2] text-white dark:bg-[#4ECCA3] dark:text-[#0D1B2A] text-xs font-bold shadow-md hover:scale-[1.02] transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Sparkles className="w-4 h-4" />
            Review Queue ({filteredCards.length})
          </button>
        </div>
      </div>

      {/* Leitner Box Breakdown Strip */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((boxNum) => {
          const count = cards.filter((c) => c.box === boxNum).length;
          const intervalDays = boxIntervals[boxNum as 1 | 2 | 3 | 4 | 5];
          return (
            <div
              key={boxNum}
              className="p-3 rounded-2xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] shadow-xs text-center"
            >
              <span className="text-[10px] uppercase font-bold text-[#718096] dark:text-[#94A3B8] block">
                Box {boxNum}
              </span>
              <div className="text-lg font-black font-mono tabular-nums text-[#2D3748] dark:text-[#E2E8F0]">
                {count}
              </div>
              <span className="text-[10px] text-[#88C0D0] dark:text-[#4ECCA3] font-medium">
                {intervalDays}d interval
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 dark:bg-[#1B263B]/70 border border-[#EADBCC] dark:border-[#2C3E55]">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#718096] dark:text-[#94A3B8]">
            <Filter className="w-3.5 h-3.5" />
            <span>Subject:</span>
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#2C3E55] bg-white dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0]"
          >
            <option value="all">All Subjects</option>
            {profile.subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Due Today Filter Toggle */}
          <button
            onClick={() => setFilterDueOnly(!filterDueOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterDueOnly
                ? 'bg-[#F3A683] text-white shadow-xs'
                : 'bg-stone-100 dark:bg-[#0D1B2A] text-stone-600 dark:text-stone-300'
            }`}
          >
            {filterDueOnly ? '✓ Due Today Only' : 'All Cards (Including Future)'}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or terms..."
            className="w-full sm:w-56 pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#2C3E55] bg-white dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0] focus:outline-hidden focus:ring-1 focus:ring-[#88C0D0]"
          />
        </div>
      </div>

      {/* Cards Compact List / Grid for Laptop Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCards.map((card) => {
          const isDue = card.nextReviewDate <= todayStr;
          return (
            <div
              key={card.id}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                isDue
                  ? 'bg-white dark:bg-[#1B263B] border-[#88C0D0]/50 dark:border-[#4ECCA3]/40 shadow-xs'
                  : 'bg-stone-50/70 dark:bg-[#1B263B]/40 border-stone-200 dark:border-[#2C3E55]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span className="font-semibold text-[#88C0D0] dark:text-[#4ECCA3] truncate">
                    {card.subject}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-[#0D1B2A] text-stone-600 dark:text-stone-300">
                      Box {card.box}
                    </span>
                    {isDue && (
                      <span className="text-[10px] font-bold text-[#F3A683] dark:text-[#E8837D] bg-[#FFE5D9] dark:bg-[#E8837D]/20 px-1.5 py-0.5 rounded-md">
                        Due
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs font-medium text-[#2D3748] dark:text-[#E2E8F0] leading-snug line-clamp-3 mb-2">
                  {card.front}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-[#718096] dark:text-[#94A3B8]">
                <span>Next: {card.nextReviewDate}</span>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="p-1 rounded-lg text-stone-400 hover:text-red-500 transition-colors"
                  title="Remove card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredCards.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-3xl bg-white dark:bg-[#1B263B] border border-dashed border-[#EADBCC] dark:border-[#2C3E55]">
            <span className="text-3xl mb-2 block">🎉</span>
            <h4 className="text-sm font-bold text-[#2D3748] dark:text-[#E2E8F0]">
              All caught up for today!
            </h4>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8] mt-1 max-w-sm mx-auto">
              {filterDueOnly
                ? 'No cards are due for review right now. Turn off "Due Today Only" to browse your full deck library.'
                : 'No cards found matching your filter.'}
            </p>
          </div>
        )}
      </div>

      {/* Review Modal / Screen */}
      {isReviewing && currentReviewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#1B263B] border-2 border-[#88C0D0] dark:border-[#4ECCA3] shadow-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[420px] relative">
            
            {/* Review Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#88C0D0]/20 text-[#88C0D0] dark:text-[#4ECCA3]">
                  {currentReviewCard.subject}
                </span>
                <span className="text-xs text-[#718096] dark:text-[#94A3B8]">
                  Card {activeReviewIndex + 1} of {filteredCards.length}
                </span>
              </div>
              <button
                onClick={() => setIsReviewing(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#0D1B2A]"
                title="Exit review (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Flashcard Body (Flip on click or space) */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex-1 cursor-pointer my-4 p-6 sm:p-8 rounded-3xl bg-[#FFF9F2] dark:bg-[#0D1B2A] border-2 border-dashed border-[#EADBCC] dark:border-[#2C3E55] flex flex-col items-center justify-center text-center transition-all hover:border-[#88C0D0]"
            >
              {!isFlipped ? (
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#88C0D0] dark:text-[#4ECCA3] bg-white dark:bg-[#1B263B] px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                    Question (Front)
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#2D3748] dark:text-[#E2E8F0] leading-relaxed">
                    {currentReviewCard.front}
                  </h3>
                  <p className="text-xs text-stone-400 dark:text-stone-500">
                    Click card or press [Space] to reveal answer
                  </p>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#F3A683] dark:text-[#E8837D] bg-white dark:bg-[#1B263B] px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                    Answer (Back)
                  </span>
                  <p className="text-sm sm:text-base text-[#2D3748] dark:text-[#E2E8F0] leading-relaxed font-medium">
                    {currentReviewCard.back}
                  </p>
                </div>
              )}
            </div>

            {/* Scoring Buttons (When flipped) */}
            {isFlipped ? (
              <div className="space-y-2 pt-2 animate-in fade-in">
                <span className="text-center block text-[11px] text-[#718096] dark:text-[#94A3B8]">
                  How well did you recall this concept?
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleReviewScore('again')}
                    className="p-2.5 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs font-bold flex flex-col items-center"
                  >
                    <span>Again [1]</span>
                    <span className="text-[10px] opacity-75 font-normal">1 day</span>
                  </button>

                  <button
                    onClick={() => handleReviewScore('hard')}
                    className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 border border-amber-200 text-amber-700 dark:text-amber-300 text-xs font-bold flex flex-col items-center"
                  >
                    <span>Hard [2]</span>
                    <span className="text-[10px] opacity-75 font-normal">3 days</span>
                  </button>

                  <button
                    onClick={() => handleReviewScore('good')}
                    className="p-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 border border-blue-200 text-blue-700 dark:text-blue-300 text-xs font-bold flex flex-col items-center"
                  >
                    <span>Good [3]</span>
                    <span className="text-[10px] opacity-75 font-normal">7 days</span>
                  </button>

                  <button
                    onClick={() => handleReviewScore('easy')}
                    className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex flex-col items-center"
                  >
                    <span>Easy [4]</span>
                    <span className="text-[10px] opacity-75 font-normal">14-30d</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center pt-2">
                <button
                  onClick={() => setIsFlipped(true)}
                  className="px-6 py-2.5 rounded-2xl bg-[#88C0D0] hover:bg-[#72b0c2] text-white dark:bg-[#4ECCA3] dark:text-[#0D1B2A] text-xs font-bold shadow-md transition-all"
                >
                  Reveal Answer [Space]
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Victory & Gamification Overlay */}
      {showVictoryOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1B263B] border-2 border-[#F3A683] dark:border-[#4ECCA3] shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
            
            {/* Cute Ghibli Mascot Winner Graphic */}
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden mb-4 shadow-lg border-2 border-[#F3A683] animate-bounce">
              <img
                src="/src/assets/images/nooki_mascot_otter_1791910471677.jpg"
                alt="Nooki Winner"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Victory Celebration!
            </div>

            <h3 className="text-xl font-extrabold text-[#2D3748] dark:text-[#E2E8F0] mb-2">
              Deck Cleared! You Did It!
            </h3>

            <p className="text-xs text-[#718096] dark:text-[#94A3B8] leading-relaxed mb-6">
              "Your future self is going to thank you for today's effort. Every memory pathway is reinforced!"
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#0D1B2A] border border-[#EADBCC] dark:border-[#2C3E55] mb-6 flex items-center justify-center gap-3">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <span className="text-xs font-bold text-[#2D3748] dark:text-[#E2E8F0] block">
                  New Badge Unlocked: Active Recall Scholar
                </span>
                <span className="text-[11px] text-[#88C0D0] dark:text-[#4ECCA3]">
                  Added to your desk pad sticker showcase
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowVictoryOverlay(false)}
                className="flex-1 py-2.5 rounded-2xl bg-stone-100 dark:bg-[#0D1B2A] text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-200"
              >
                Back to Decks
              </button>

              <button
                onClick={() => {
                  setShowVictoryOverlay(false);
                  onOpenDeskpad();
                }}
                className="flex-1 py-2.5 rounded-2xl bg-[#F3A683] hover:bg-[#ea936c] text-white text-xs font-bold shadow-md hover:scale-[1.02] transition-all"
              >
                View Desk Pad 🎨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1B263B] border border-[#EADBCC] dark:border-[#2C3E55] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                Add New Spaced Flashcard
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Subject
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#2C3E55] bg-stone-50 dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0]"
                >
                  {profile.subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Front (Prompt / Question)
                </label>
                <textarea
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. What is the rate-limiting enzyme in glycolysis?"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#2C3E55] bg-stone-50 dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Back (Explanation / Answer)
                </label>
                <textarea
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="e.g. Phosphofructokinase-1 (PFK-1), allosterically regulated by ATP and AMP."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#2C3E55] bg-stone-50 dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#88C0D0] dark:bg-[#4ECCA3] text-white dark:text-[#0D1B2A] text-xs font-bold shadow-xs hover:opacity-90"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
