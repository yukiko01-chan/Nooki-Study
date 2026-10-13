import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ArrowLeft, Heart, BookOpen, Calendar, Mail, Flame } from 'lucide-react';
import { UserProfile, MascotId } from '../types';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onComplete,
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<number>(1);
  const [displayName, setDisplayName] = useState<string>(initialProfile.displayName || '');
  const [mascot, setMascot] = useState<MascotId>(initialProfile.mascot || 'nooki');
  const [subjects, setSubjects] = useState<string[]>(initialProfile.subjects || ['Biology', 'Computer Science', 'Literature']);
  const [newSubjectInput, setNewSubjectInput] = useState<string>('');
  const [examName, setExamName] = useState<string>(initialProfile.examName || 'Midterm Board Exams');
  const [examDate, setExamDate] = useState<string>(
    initialProfile.examDate || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [email, setEmail] = useState<string>(initialProfile.email || '');
  const [emailReminders, setEmailReminders] = useState<boolean>(initialProfile.emailReminders ?? true);

  if (!isOpen) return null;

  const mascotsList: { id: MascotId; name: string; tag: string; description: string; img: string }[] = [
    {
      id: 'nooki',
      name: 'Nooki Otter',
      tag: 'Cozy Scholar',
      description: 'Warm scarf, warm tea, patient study companion.',
      img: '/src/assets/images/nooki_mascot_otter_1791910471677.jpg'
    },
    {
      id: 'tea-dragon',
      name: 'Tea Dragon',
      tag: 'Gentle Fire',
      description: 'Brews calming matcha and protects your focus flame.',
      img: '/src/assets/images/ghibli_tea_dragon_1791910472130.jpg'
    },
    {
      id: 'calcifer',
      name: 'Calcifer Flame',
      tag: 'Spark of Drive',
      description: 'Keeps your motivation burning bright through tough chapters.',
      img: '/src/assets/images/nooki_mascot_otter_1791910471677.jpg'
    },
    {
      id: 'totoro',
      name: 'Forest Spirit',
      tag: 'Serene Giant',
      description: 'Lends the calming silence of ancient deep mossy woods.',
      img: '/src/assets/images/ghibli_tea_dragon_1791910472130.jpg'
    }
  ];

  const handleAddSubject = () => {
    const trimmed = newSubjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setNewSubjectInput('');
    }
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter((s) => s !== sub));
  };

  const calculateDays = () => {
    if (!examDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(examDate);
    target.setHours(0, 0, 0, 0);
    return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const handleFinish = () => {
    const updated: UserProfile = {
      ...initialProfile,
      displayName: displayName.trim() || 'Cozy Scholar',
      mascot,
      subjects: subjects.length ? subjects : ['General Studies'],
      examName: examName.trim() || 'My Target Exam',
      examDate,
      email: email.trim(),
      emailReminders,
      onboardingComplete: true
    };
    onComplete(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-[#FFF9F2] dark:bg-[#1B263B] border-2 border-[#EADBCC] dark:border-[#2C3E55] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Step Indicator Header */}
        <div className="bg-gradient-to-r from-[#88C0D0]/20 via-[#FFE5D9]/40 to-[#F3A683]/20 dark:from-[#0D1B2A] dark:to-[#1B263B] px-6 py-4 border-b border-[#EADBCC] dark:border-[#2C3E55] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍵</span>
            <div>
              <h2 className="text-base font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                Welcome to Nooki Study Companion
              </h2>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                Step {step} of 4 — Craft your peaceful study sanctuary
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs px-2 py-1 rounded-lg"
            >
              Skip
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Name & Mascot */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-[#2D3748] dark:text-[#E2E8F0] mb-1">
                  What should Nooki call you?
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Chihiro, Maya, Alex"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#EADBCC] dark:border-[#2C3E55] bg-white dark:bg-[#0D1B2A] text-sm text-[#2D3748] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#88C0D0] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3748] dark:text-[#E2E8F0] mb-2">
                  Choose your Study Mascot Companion:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {mascotsList.map((m) => {
                    const isSelected = mascot === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setMascot(m.id)}
                        className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                          isSelected
                            ? 'border-[#88C0D0] dark:border-[#4ECCA3] bg-white dark:bg-[#0D1B2A] shadow-md scale-[1.02]'
                            : 'border-[#EADBCC]/70 dark:border-[#2C3E55] bg-white/60 dark:bg-[#0D1B2A]/40 hover:border-stone-300'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden mb-2 shadow-xs border border-stone-200 dark:border-stone-700">
                          <img
                            src={m.img}
                            alt={m.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-xs font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                          {m.name}
                        </span>
                        <span className="text-[10px] text-[#88C0D0] dark:text-[#4ECCA3] font-medium mb-1">
                          {m.tag}
                        </span>
                        <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] line-clamp-2">
                          {m.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Subjects */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-[#2D3748] dark:text-[#E2E8F0] mb-1">
                  Primary Study Subjects & Decks
                </h3>
                <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                  Tag the subjects you are focusing on this semester. You can filter flashcards and focus sessions by subject.
                </p>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-white dark:bg-[#0D1B2A] border border-[#EADBCC] dark:border-[#2C3E55] min-h-[70px]">
                {subjects.map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-[#88C0D0]/20 text-[#2D3748] dark:text-[#E2E8F0] border border-[#88C0D0]/40"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub)}
                      className="text-stone-400 hover:text-red-500 text-sm font-bold ml-1 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {subjects.length === 0 && (
                  <span className="text-xs text-stone-400 self-center">No subjects added yet.</span>
                )}
              </div>

              {/* Input for adding new subject */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubjectInput}
                  onChange={(e) => setNewSubjectInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubject();
                    }
                  }}
                  placeholder="e.g. Molecular Biology, Calculus, Japanese"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#EADBCC] dark:border-[#2C3E55] bg-white dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#88C0D0] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-4 py-2 rounded-xl bg-[#88C0D0] dark:bg-[#4ECCA3] text-white dark:text-[#0D1B2A] text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Add Tag
                </button>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] self-center mr-1">
                  Quick add:
                </span>
                {['Biochemistry', 'Neuroscience', 'Anatomy', 'Python', 'Cognitive Science'].map((rec) => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => {
                      if (!subjects.includes(rec)) setSubjects([...subjects, rec]);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
                  >
                    + {rec}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Target Exam Date & Live Countdown */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-[#2D3748] dark:text-[#E2E8F0] mb-1">
                  Target Exam & Countdown Ribbon
                </h3>
                <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                  Set the goal post. Nooki pins an exact day countdown banner across your study room.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Exam / Target Name
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. USMLE Step 1, Midterm Finals, Thesis Defense"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCC] dark:border-[#2C3E55] bg-white dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#88C0D0] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCC] dark:border-[#2C3E55] bg-white dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#88C0D0] focus:outline-hidden"
                />
              </div>

              {/* Live Preview Ribbon */}
              <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-[#FFE5D9] to-[#FFF0E6] dark:from-[#1F304A] dark:to-[#263852] border-2 border-dashed border-[#F3A683] dark:border-[#4ECCA3] flex items-center justify-center gap-3">
                <span className="text-2xl">⌛</span>
                <div className="text-center">
                  <div className="text-base font-extrabold text-[#2D3748] dark:text-[#E2E8F0]">
                    {calculateDays()} days remaining!
                  </div>
                  <div className="text-xs text-[#D97706] dark:text-[#4ECCA3] font-semibold">
                    until {examName || 'Exam'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Email & Preferences */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-semibold text-[#2D3748] dark:text-[#E2E8F0] mb-1">
                  Session Sync & Cozy Reminders (Optional)
                </h3>
                <p className="text-xs text-[#718096] dark:text-[#94A3B8]">
                  Keep your focus streak alive with daily tea-time reminders and spaced repetition reviews.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#718096] dark:text-[#94A3B8] mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scholar@tea-study.org"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCC] dark:border-[#2C3E55] bg-white dark:bg-[#0D1B2A] text-xs text-[#2D3748] dark:text-[#E2E8F0] focus:ring-2 focus:ring-[#88C0D0] focus:outline-hidden"
                />
              </div>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#0D1B2A] border border-[#EADBCC] dark:border-[#2C3E55] cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailReminders}
                  onChange={(e) => setEmailReminders(e.target.checked)}
                  className="mt-0.5 rounded text-[#88C0D0] focus:ring-[#88C0D0]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#2D3748] dark:text-[#E2E8F0] block">
                    Receive gentle daily morning wisdom & review reminders
                  </span>
                  <span className="text-[#718096] dark:text-[#94A3B8]">
                    Nooki sends a quiet reminder when flashcards are scheduled in your spaced repetition queue.
                  </span>
                </div>
              </label>

              <div className="p-3 rounded-2xl bg-[#88C0D0]/10 dark:bg-[#4ECCA3]/10 border border-[#88C0D0]/30 text-xs text-[#2D3748] dark:text-[#E2E8F0] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#88C0D0] dark:text-[#4ECCA3] shrink-0" />
                <span>
                  Everything is saved securely right in your browser's local storage for instantaneous offline studying!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-stone-50/80 dark:bg-[#0D1B2A]/80 px-6 py-4 border-t border-[#EADBCC] dark:border-[#2C3E55] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-semibold bg-[#88C0D0] hover:bg-[#74abbb] text-white dark:bg-[#4ECCA3] dark:text-[#0D1B2A] shadow-xs transition-colors"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold bg-[#F3A683] hover:bg-[#ea936c] text-white shadow-md hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Enter Study Sanctuary
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
