import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sliders, 
  ChevronUp, 
  ChevronDown, 
  Music, 
  Sparkles,
  Headphones
} from 'lucide-react';
import { AmbientTrack } from '../types';
import { soundSynthesizer } from '../services/audioSynthesizer';

interface AmbientMixerDockProps {
  tracks: AmbientTrack[];
  onUpdateTracks: (tracks: AmbientTrack[]) => void;
}

export const AmbientMixerDock: React.FC<AmbientMixerDockProps> = ({
  tracks,
  onUpdateTracks
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(0.8);

  const activeCount = tracks.filter((t) => t.active).length;

  const toggleTrack = (id: 'rain' | 'fireplace' | 'ocean' | 'cafe') => {
    const updated = tracks.map((t) => {
      if (t.id === id) {
        const nextActive = !t.active;
        soundSynthesizer.setAmbientTrack(id, nextActive, t.volume);
        return { ...t, active: nextActive };
      }
      return t;
    });
    onUpdateTracks(updated);
  };

  const handleVolumeChange = (id: 'rain' | 'fireplace' | 'ocean' | 'cafe', volume: number) => {
    const updated = tracks.map((t) => {
      if (t.id === id) {
        if (t.active) {
          soundSynthesizer.setAmbientTrack(id, true, volume);
        }
        return { ...t, volume };
      }
      return t;
    });
    onUpdateTracks(updated);
  };

  const handleMasterVolume = (val: number) => {
    setMasterVolume(val);
    if (!isMuted) {
      soundSynthesizer.setMasterVolume(val);
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundSynthesizer.setMasterVolume(nextMute ? 0 : masterVolume);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:right-6 z-40">
      <div className="rounded-3xl bg-white/95 dark:bg-[#1B263B]/95 backdrop-blur-md border border-[#EADBCC] dark:border-[#2C3E55] shadow-xl transition-all duration-300 overflow-hidden">
        
        {/* Dock Bar Header (Always Visible) */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-left"
            title="Expand Ambient Sound Mixer"
          >
            <div className={`p-1.5 rounded-xl transition-colors ${
              activeCount > 0 
                ? 'bg-[#88C0D0] text-white dark:bg-[#4ECCA3] dark:text-[#0D1B2A] animate-pulse' 
                : 'bg-stone-100 dark:bg-[#0D1B2A] text-stone-500'
            }`}>
              <Headphones className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#2D3748] dark:text-[#E2E8F0]">
                  Lo-Fi Ambiance
                </span>
                {activeCount > 0 && (
                  <span className="text-[10px] bg-[#88C0D0]/20 text-[#88C0D0] dark:text-[#4ECCA3] font-bold px-1.5 py-0.2 rounded-full">
                    {activeCount} active
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#718096] dark:text-[#94A3B8]">
                {activeCount > 0 ? 'Synthesizing cozy room sounds' : 'Rain, Fire, Ocean, Cafe'}
              </p>
            </div>
          </button>

          {/* Quick Track Toggles in Mini Bar */}
          <div className="hidden sm:flex items-center gap-1 border-l border-r border-[#EADBCC]/60 dark:border-[#2C3E55]/60 px-2 mx-1">
            {tracks.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleTrack(t.id)}
                className={`p-1.5 rounded-xl text-xs transition-transform ${
                  t.active
                    ? 'bg-[#88C0D0]/20 dark:bg-[#4ECCA3]/20 scale-105 border border-[#88C0D0]/40'
                    : 'opacity-40 hover:opacity-100'
                }`}
                title={`Toggle ${t.name}`}
              >
                {t.icon}
              </button>
            ))}
          </div>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-xl text-[#718096] hover:text-[#2D3748] dark:hover:text-[#E2E8F0] hover:bg-stone-100 dark:hover:bg-[#0D1B2A] transition-colors"
            title={isMuted ? 'Unmute audio' : 'Mute all sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#0D1B2A]"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Mixer Panel */}
        {isExpanded && (
          <div className="p-4 pt-2 border-t border-[#EADBCC]/60 dark:border-[#2C3E55]/60 space-y-3 w-80 animate-in fade-in">
            {/* Master Volume */}
            <div className="flex items-center justify-between text-xs text-[#718096] dark:text-[#94A3B8]">
              <span>Master Gain:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : masterVolume}
                onChange={(e) => handleMasterVolume(parseFloat(e.target.value))}
                className="w-36 accent-[#88C0D0] dark:accent-[#4ECCA3]"
              />
            </div>

            {/* Individual Channels */}
            <div className="space-y-2.5 pt-1">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    track.active
                      ? 'bg-[#FFF9F2] dark:bg-[#0D1B2A] border-[#88C0D0]/40 dark:border-[#4ECCA3]/40'
                      : 'bg-stone-50 dark:bg-[#0D1B2A]/40 border-stone-200 dark:border-[#2C3E55]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      onClick={() => toggleTrack(track.id)}
                      className="flex items-center gap-2 text-left"
                    >
                      <span className="text-base">{track.icon}</span>
                      <span className={`text-xs font-semibold ${
                        track.active ? 'text-[#2D3748] dark:text-[#E2E8F0]' : 'text-stone-500'
                      }`}>
                        {track.name}
                      </span>
                    </button>

                    <button
                      onClick={() => toggleTrack(track.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        track.active
                          ? 'bg-[#88C0D0] text-white dark:bg-[#4ECCA3] dark:text-[#0D1B2A]'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {track.active ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {track.active && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#718096] dark:text-[#94A3B8] w-7">
                        {Math.round(track.volume * 100)}%
                      </span>
                      <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={track.volume}
                        onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                        className="flex-1 accent-[#88C0D0] dark:accent-[#4ECCA3]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[10px] text-stone-400 dark:text-stone-500 text-center pt-1">
              Pure procedural synthesis: zero buffering or lag.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
