import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  StudyLog, 
  DailyReflection, 
  Flashcard, 
  Deck, 
  MascotBadge, 
  AmbientTrack,
  AudioAlertId 
} from './types';
import { 
  getProfile, 
  saveProfile, 
  getStudyLogs, 
  saveStudyLogs, 
  getReflections, 
  saveReflections, 
  getFlashcards, 
  saveFlashcards, 
  getDecks, 
  saveDecks, 
  getBadges, 
  saveBadges, 
  getAmbientTracks, 
  saveAmbientTracks 
} from './services/storage';
import { soundSynthesizer } from './services/audioSynthesizer';
import { NavigationSidebar } from './components/NavigationSidebar';
import { HeaderBanner } from './components/HeaderBanner';
import { OnboardingModal } from './components/OnboardingModal';
import { MasterClockDashboard } from './components/MasterClockDashboard';
import { PomodoroTimer } from './components/PomodoroTimer';
import { SpacedRepetitionDeck } from './components/SpacedRepetitionDeck';
import { AmbientMixerDock } from './components/AmbientMixerDock';
import { MascotToast } from './components/MascotToast';
import { DeskpadShowcaseModal } from './components/DeskpadShowcaseModal';
import { ReflectionHistory } from './components/ReflectionHistory';

export default function App() {
  // Primary State
  const [profile, setProfile] = useState<UserProfile>(getProfile);
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(getStudyLogs);
  const [reflections, setReflections] = useState<DailyReflection[]>(getReflections);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(getFlashcards);
  const [decks, setDecks] = useState<Deck[]>(getDecks);
  const [badges, setBadges] = useState<MascotBadge[]>(getBadges);
  const [ambientTracks, setAmbientTracks] = useState<AmbientTrack[]>(getAmbientTracks);

  // Active navigation & layout state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pomodoro' | 'spaced-rep' | 'deskpad' | 'history'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  
  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(!profile.onboardingComplete);
  const [isDeskpadOpen, setIsDeskpadOpen] = useState<boolean>(false);
  const [selectedAlertSound, setSelectedAlertSound] = useState<AudioAlertId>('soft-bell');

  // Sync Dark/Light theme class with DOM
  useEffect(() => {
    const applyTheme = () => {
      const isDark = 
        profile.themeMode === 'dark' || 
        (profile.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    if (profile.themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [profile.themeMode]);

  // Save profile changes
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  // Onboarding Complete
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
    setIsOnboardingOpen(false);
  };

  // Add study log and update streaks
  const handleAddStudyLog = (newLog: Omit<StudyLog, 'id'>) => {
    const log: StudyLog = {
      ...newLog,
      id: `log-${Date.now()}`
    };
    const updated = [log, ...studyLogs];
    setStudyLogs(updated);
    saveStudyLogs(updated);

    // Calculate total hours today to check 2-hour badge
    const today = new Date().toISOString().split('T')[0];
    const todayMins = updated
      .filter((l) => l.date === today)
      .reduce((sum, item) => sum + item.durationMinutes, 0);

    if (todayMins >= 120 && !profile.unlockedBadges.includes('tea-dragon-blessing')) {
      handleUnlockBadge('tea-dragon-blessing');
    }

    // Check early morning study (before 9 AM)
    const hour = parseInt(log.startTime.split(':')[0], 10);
    if (hour < 9 && !profile.unlockedBadges.includes('dawn-lantern')) {
      handleUnlockBadge('dawn-lantern');
    }
  };

  // Save reflection
  const handleSaveReflection = (newRef: Omit<DailyReflection, 'timestamp'>) => {
    const ref: DailyReflection = {
      ...newRef,
      timestamp: Date.now()
    };
    const existingIndex = reflections.findIndex((r) => r.date === ref.date);
    let updated: DailyReflection[];
    if (existingIndex >= 0) {
      updated = [...reflections];
      updated[existingIndex] = ref;
    } else {
      updated = [ref, ...reflections];
    }
    setReflections(updated);
    saveReflections(updated);

    if (!profile.unlockedBadges.includes('reflection-sage')) {
      handleUnlockBadge('reflection-sage');
    }
  };

  // Update flashcards
  const handleUpdateCards = (updatedCards: Flashcard[]) => {
    setFlashcards(updatedCards);
    saveFlashcards(updatedCards);
  };

  // Unlock badge
  const handleUnlockBadge = (badgeId: string) => {
    if (!profile.unlockedBadges.includes(badgeId)) {
      const updatedBadgeIds = [...profile.unlockedBadges, badgeId];
      handleUpdateProfile({ unlockedBadges: updatedBadgeIds });
      
      const updatedBadges = badges.map((b) => (b.id === badgeId ? { ...b, unlocked: true } : b));
      setBadges(updatedBadges);
      saveBadges(updatedBadges);
    }
  };

  // Update ambient tracks
  const handleUpdateAmbientTracks = (updated: AmbientTrack[]) => {
    setAmbientTracks(updated);
    saveAmbientTracks(updated);
  };

  // Global ESC key to dismiss modals
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDeskpadOpen) setIsDeskpadOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isDeskpadOpen]);

  // Derived counts
  const todayStr = new Date().toISOString().split('T')[0];
  const dueCardsCount = flashcards.filter((c) => c.nextReviewDate <= todayStr).length;
  const todayMinutes = studyLogs
    .filter((l) => l.date === todayStr)
    .reduce((acc, log) => acc + log.durationMinutes, 0);

  return (
    <div className={`min-h-screen flex flex-col paper-texture ${profile.compactDensity ? 'text-xs' : 'text-sm'}`}>
      
      {/* Top Header Banner */}
      <HeaderBanner
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenProfileModal={() => setIsOnboardingOpen(true)}
        onOpenDeskpad={() => setIsDeskpadOpen(true)}
      />

      {/* Main Desktop Container with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <NavigationSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'deskpad') {
              setIsDeskpadOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          profile={profile}
          dueCardsCount={dueCardsCount}
          todayMinutes={todayMinutes}
        />

        {/* Content Viewport Frame */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full pb-24">
          {activeTab === 'dashboard' && (
            <MasterClockDashboard
              studyLogs={studyLogs}
              onAddStudyLog={handleAddStudyLog}
              reflections={reflections}
              onSaveReflection={handleSaveReflection}
              profile={profile}
              isCompact={profile.compactDensity}
            />
          )}

          {activeTab === 'pomodoro' && (
            <PomodoroTimer
              profile={profile}
              onAddStudyLog={handleAddStudyLog}
              selectedAlertSound={selectedAlertSound}
              onChangeAlertSound={setSelectedAlertSound}
            />
          )}

          {activeTab === 'spaced-rep' && (
            <SpacedRepetitionDeck
              cards={flashcards}
              onUpdateCards={handleUpdateCards}
              decks={decks}
              profile={profile}
              onUnlockBadge={handleUnlockBadge}
              onOpenDeskpad={() => setIsDeskpadOpen(true)}
              isCompact={profile.compactDensity}
            />
          )}

          {activeTab === 'history' && (
            <ReflectionHistory
              reflections={reflections}
              studyLogs={studyLogs}
              profile={profile}
            />
          )}
        </main>
      </div>

      {/* Persistent Bottom Mini-Player Dock (Lo-Fi Ambiance Mixer) */}
      <AmbientMixerDock
        tracks={ambientTracks}
        onUpdateTracks={handleUpdateAmbientTracks}
      />

      {/* Integrated Cute Notification & Nooki Mascot System */}
      <MascotToast profile={profile} />

      {/* Onboarding / Profile Customization Modal */}
      <OnboardingModal
        initialProfile={profile}
        onComplete={handleOnboardingComplete}
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Desk Pad Showcase Modal */}
      <DeskpadShowcaseModal
        badges={badges}
        profile={profile}
        isOpen={isDeskpadOpen}
        onClose={() => setIsDeskpadOpen(false)}
      />
    </div>
  );
}
