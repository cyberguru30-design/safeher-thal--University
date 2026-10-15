/**
 * SirenSound utility using Web Audio API
 * Generates an authentic alternating emergency frequency siren without external audio files
 */

class EmergencySiren {
  private audioCtx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private timer: number | null = null;

  start() {
    if (this.isPlaying) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      this.osc = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.osc.type = 'sawtooth';
      this.gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);

      this.osc.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      let high = false;
      const modulate = () => {
        if (!this.audioCtx || !this.osc) return;
        const now = this.audioCtx.currentTime;
        const targetFreq = high ? 960 : 770;
        this.osc.frequency.setTargetAtTime(targetFreq, now, 0.1);
        high = !high;
      };

      modulate();
      this.osc.start();
      this.isPlaying = true;

      this.timer = window.setInterval(modulate, 450);
    } catch (err) {
      console.warn('Web Audio API not supported or autoplay blocked:', err);
    }
  }

  stop() {
    if (!this.isPlaying) return;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    try {
      if (this.gainNode && this.audioCtx) {
        this.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.05);
      }
      setTimeout(() => {
        if (this.osc) {
          try {
            this.osc.stop();
            this.osc.disconnect();
          } catch {
            // ignore
          }
          this.osc = null;
        }
        if (this.audioCtx) {
          try {
            this.audioCtx.close();
          } catch {
            // ignore
          }
          this.audioCtx = null;
        }
      }, 100);
    } catch {
      // ignore
    }

    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const emergencySiren = new EmergencySiren();
