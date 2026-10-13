import { AudioAlertId } from '../types';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientNodes: {
    [key: string]: {
      source: AudioNode | null;
      gainNode: GainNode | null;
      intervalId?: number;
    };
  } = {};
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play crisp notification/alert chimes
  playAlert(type: AudioAlertId) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const now = this.ctx.currentTime;

      switch (type) {
        case 'soft-bell': {
          // Warm Japanese temple/singing bowl bell harmonic triad (Eb4, G4, Bb4)
          const freqs = [311.13, 392.0, 466.16];
          freqs.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.25 / (idx + 1), now + idx * 0.08 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.2);

            osc.connect(gain);
            gain.connect(this.masterGain!);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 2.3);
          });
          break;
        }

        case 'seashell-taps': {
          // Resonant wooden / shell tapping sequence (3 gentle taps)
          [0, 0.12, 0.26].forEach((delay, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            const filter = this.ctx!.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880 + i * 140, now + delay);
            osc.frequency.exponentialRampToValueAtTime(420, now + delay + 0.08);

            filter.type = 'bandpass';
            filter.frequency.value = 1200;
            filter.Q.value = 3;

            gain.gain.setValueAtTime(0.3, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(now + delay);
            osc.stop(now + delay + 0.12);
          });
          break;
        }

        case 'windchimes': {
          // Delicate crystal windchime breeze (pentatonic scale notes)
          const notes = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0];
          for (let i = 0; i < 6; i++) {
            const delay = i * 0.15 + (Math.random() * 0.05);
            const freq = notes[Math.floor(Math.random() * notes.length)];
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, now + delay);
            gain.gain.linearRampToValueAtTime(0.12, now + delay + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.4);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(now + delay);
            osc.stop(now + delay + 1.5);
          }
          break;
        }

        case 'whale-song': {
          // Atmospheric deep ocean whale vocalization swell
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const filter = this.ctx!.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.linearRampToValueAtTime(220, now + 1.2);
          osc.frequency.linearRampToValueAtTime(160, now + 2.5);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, now);
          filter.frequency.linearRampToValueAtTime(560, now + 1.2);
          filter.frequency.linearRampToValueAtTime(280, now + 2.5);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.2, now + 0.8);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(now);
          osc.stop(now + 2.9);
          break;
        }

        case 'ocean-waves':
        default: {
          // Soft ocean surge wave
          const bufferSize = this.ctx!.sampleRate * 2.5;
          const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.4;
          }

          const noise = this.ctx!.createBufferSource();
          noise.buffer = buffer;

          const filter = this.ctx!.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(180, now);
          filter.frequency.linearRampToValueAtTime(650, now + 1.0);
          filter.frequency.linearRampToValueAtTime(150, now + 2.4);

          const gain = this.ctx!.createGain();
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.35, now + 0.9);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain!);

          noise.start(now);
          noise.stop(now + 2.5);
          break;
        }
      }
    } catch {
      // Audio autoplay policy catch
    }
  }

  // Play celebration victory fanfare
  playVictoryFanfare() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Cheerful pentatonic ascending arpeggio with warm bell glockenspiel
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });
    } catch {
      // Ignore
    }
  }

  // Start / stop procedural ambient tracks
  setAmbientTrack(id: 'rain' | 'fireplace' | 'ocean' | 'cafe', active: boolean, volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (!active) {
      this.stopAmbientTrack(id);
      return;
    }

    if (this.ambientNodes[id]?.gainNode) {
      // Adjust volume
      this.ambientNodes[id].gainNode!.gain.setTargetAtTime(volume * 0.4, this.ctx.currentTime, 0.1);
      return;
    }

    // Initialize track sound generator
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);
    gainNode.connect(this.masterGain);

    if (id === 'rain') {
      // Pink noise + subtle raindrops
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1400;

      noise.connect(filter);
      filter.connect(gainNode);
      noise.start();

      this.ambientNodes[id] = { source: noise, gainNode };
    } else if (id === 'fireplace') {
      // Low rumble + crackle pops
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 55;

      const oscGain = this.ctx.createGain();
      oscGain.gain.value = 0.15;
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();

      // Random crackle generator
      const intervalId = window.setInterval(() => {
        if (!this.ctx || !this.ambientNodes['fireplace']?.gainNode) return;
        if (Math.random() > 0.4) {
          const pop = this.ctx.createBufferSource();
          const popBuffer = this.ctx.createBuffer(1, 200, this.ctx.sampleRate);
          const popData = popBuffer.getChannelData(0);
          for (let i = 0; i < 200; i++) {
            popData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 25);
          }
          pop.buffer = popBuffer;

          const pFilter = this.ctx.createBiquadFilter();
          pFilter.type = 'bandpass';
          pFilter.frequency.value = 1800 + Math.random() * 1200;
          pFilter.Q.value = 4;

          const pGain = this.ctx.createGain();
          pGain.gain.value = 0.3 * Math.random();

          pop.connect(pFilter);
          pFilter.connect(pGain);
          pGain.connect(gainNode);
          pop.start();
        }
      }, 120);

      this.ambientNodes[id] = { source: osc, gainNode, intervalId };
    } else if (id === 'ocean') {
      // Swelling ocean surf
      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      // LFO for tide motion
      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.12; // slow 8-second wave cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 250;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noise.connect(filter);
      filter.connect(gainNode);

      noise.start();
      lfo.start();

      this.ambientNodes[id] = { source: noise, gainNode };
    } else if (id === 'cafe') {
      // Warm lofi cafe hum & gentle chatter frequency
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 650;
      filter.Q.value = 1.2;

      noise.connect(filter);
      filter.connect(gainNode);
      noise.start();

      this.ambientNodes[id] = { source: noise, gainNode };
    }
  }

  stopAmbientTrack(id: string) {
    const node = this.ambientNodes[id];
    if (node) {
      if (node.intervalId) {
        clearInterval(node.intervalId);
      }
      if (node.source) {
        try {
          (node.source as AudioScheduledSourceNode).stop();
          node.source.disconnect();
        } catch {
          // Ignore
        }
      }
      delete this.ambientNodes[id];
    }
  }

  stopAllAmbient() {
    Object.keys(this.ambientNodes).forEach((k) => this.stopAmbientTrack(k));
  }

  setMasterVolume(val: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05);
    }
  }
}

export const soundSynthesizer = new AudioSynthesizer();
