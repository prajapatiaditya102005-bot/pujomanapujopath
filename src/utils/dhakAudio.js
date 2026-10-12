// Real Durga Puja Dhak & Kanshor 20-Second Audio Engine
// Source: Authentic "Non - Stop Banglar Dhak (ঢাকের বোলে নাচো তালে)"
// Dual-engine playback: Real Master Audio Asset (MP3/WAV) with Web Audio API Fallback

class DhakAudioPlayer {
  constructor() {
    this.audioElement = null;
    this.audioCtx = null;
    this.isPlaying = false;
    this.timer = null;
    this.listeners = new Set();
  }

  // Subscribe to playback state changes (isPlaying: boolean)
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.isPlaying);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isPlaying);
      } catch (e) {}
    });
  }

  // Play the authentic real Durga Puja Dhak music (defaults to 20 seconds)
  async play(durationMs = 20000, onEnd = null) {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.notify();

    // Auto-stop after specified duration (20 seconds)
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.stop();
      if (onEnd) onEnd();
    }, durationMs);

    // Try HTML5 Audio with real Durga Puja Banglar Dhak recording
    try {
      if (!this.audioElement) {
        this.audioElement = new Audio('/audio/durga_puja_dhak_real.mp3');
        this.audioElement.preload = 'auto';
        this.audioElement.volume = 0.95;

        // Fallback to WAV if MP3 encounters an issue
        this.audioElement.onerror = () => {
          console.warn('MP3 load failed, attempting WAV fallback...');
          this.audioElement.src = '/audio/durga_puja_dhak_15s.wav';
          this.audioElement.play().catch((e) => {
            console.warn('WAV fallback failed, using Web Audio API synthesis:', e);
            this.playSynthesizedDhak();
          });
        };
      }
      this.audioElement.currentTime = 0;
      await this.audioElement.play();
    } catch (err) {
      console.warn('Audio element play failed, falling back to Web Audio API synthesis:', err);
      this.playSynthesizedDhak();
    }
  }

  stop() {
    this.isPlaying = false;
    this.notify();

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch (e) {}
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
        this.audioCtx = null;
      } catch (e) {}
    }
  }

  toggle(durationMs = 20000) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play(durationMs);
    }
  }

  // Web Audio API procedural synthesis fallback (zero network dependencies)
  playSynthesizedDhak() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.audioCtx = new AudioContext();
      const ctx = this.audioCtx;

      const playDha = (time, vel = 1.0) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, time);
        osc.frequency.exponentialRampToValueAtTime(75, time + 0.18);
        gain.gain.setValueAtTime(0.7 * vel, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.38);
      };

      const playTa = (time, vel = 0.8) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(640, time);
        osc.frequency.exponentialRampToValueAtTime(260, time + 0.08);
        gain.gain.setValueAtTime(0.5 * vel, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.12);
      };

      const playKanshor = (time, vel = 0.5) => {
        [1540, 2420, 3600].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, time);
          gain.gain.setValueAtTime(0.2 * vel, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + 0.85);
        });
      };

      const now = ctx.currentTime + 0.05;
      const beat1 = 0.48;

      // 20-second synthesized bol progression
      for (let b = 0; b < 10; b++) {
        playKanshor(now + b * beat1, 0.4);
      }
      playTa(now, 0.7);
      playTa(now + 0.24, 0.7);
      playDha(now + beat1, 0.9);
      playTa(now + 2 * beat1, 0.8);
      playDha(now + 3 * beat1, 1.0);
      playTa(now + 4 * beat1, 0.8);
      playDha(now + 5 * beat1, 0.95);
      playTa(now + 6 * beat1, 0.75);
      playDha(now + 7 * beat1, 1.0);

      const t2 = now + 4.2;
      const beat2 = 0.42;
      for (let b = 0; b < 20; b++) {
        playKanshor(t2 + b * beat2, 0.5);
      }
      for (let bar = 0; bar < 5; bar++) {
        const bs = t2 + bar * (4 * beat2);
        playDha(bs, 1.0);
        playTa(bs + 0.21, 0.8);
        playDha(bs + beat2, 0.95);
        playTa(bs + 2 * beat2, 0.85);
        playDha(bs + 3 * beat2 + 0.1, 0.9);
      }

      const t3 = t2 + 5 * (4 * beat2);
      const beat3 = 0.39;
      for (let b = 0; b < 8; b++) {
        playKanshor(t3 + b * beat3, 0.6);
      }
      playDha(t3, 1.0);
      playTa(t3 + 0.2, 0.85);
      playDha(t3 + beat3, 1.1);
      playDha(t3 + beat3 * 2, 1.1);
      playTa(t3 + beat3 * 2 + 0.2, 0.9);
      playDha(t3 + beat3 * 3, 1.15);
      playDha(t3 + beat3 * 4, 1.2);
      playTa(t3 + beat3 * 4 + 0.18, 0.95);
      playDha(t3 + beat3 * 5, 1.25);

      const tEnd = t3 + beat3 * 6.5;
      playDha(tEnd, 1.3);
      playKanshor(tEnd, 0.8);
      playDha(tEnd + 0.35, 1.35);
      playKanshor(tEnd + 0.35, 0.85);
      playDha(tEnd + 0.7, 1.5);
      playKanshor(tEnd + 0.7, 1.0);
    } catch (e) {
      console.error('Web Audio API synthesis error:', e);
    }
  }
}

export const dhakPlayer = new DhakAudioPlayer();
