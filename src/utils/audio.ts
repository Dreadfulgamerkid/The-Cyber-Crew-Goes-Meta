// Web Audio API procedural sound synthesis for The Cyber Crew

class SoundSystem {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  // Soft keyboard clack when typing in terminal
  public playKey(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }

  // Crystalline "Ping!" when the duplicate capsule materializes
  public playPing(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // High sparkling harmonics
      [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.08, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.35);
      });
    } catch {}
  }

  // Aerodynamic "WHOOSH!" when the backup capsule glides into the vault
  public playWhoosh(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // White noise buffer for wind/whoosh
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.35);
      filter.Q.value = 3.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.35);

      // Low melodic swoop
      const sweep = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweep.type = 'triangle';
      sweep.frequency.setValueAtTime(320, now);
      sweep.frequency.exponentialRampToValueAtTime(640, now + 0.18);
      sweepGain.gain.setValueAtTime(0.05, now);
      sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      sweep.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweep.start(now);
      sweep.stop(now + 0.25);
    } catch {}
  }

  // Ice vault lock click + green checkmark confirmation
  public playVaultLock(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Solid click
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Warm confirmation chime (E5 -> G#5 -> B5)
      setTimeout(() => {
        if (!this.ctx) return;
        [659.25, 830.61, 987.77].forEach((f, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, this.ctx!.currentTime + idx * 0.05);
          gain.gain.setValueAtTime(0.08, this.ctx!.currentTime + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + idx * 0.05 + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(this.ctx!.currentTime + idx * 0.05);
          osc.stop(this.ctx!.currentTime + idx * 0.05 + 0.3);
        });
      }, 70);
    } catch {}
  }

  // Joyful cheer fanfare: "Three, two, one... SUDO!"
  public playCheerFanfare(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // 3 -> 2 -> 1 ... SUDO!
      const notes = [
        { f: 440, t: 0, d: 0.12 },     // "Three"
        { f: 493.88, t: 0.18, d: 0.12 }, // "Two"
        { f: 554.37, t: 0.36, d: 0.12 }, // "One"
        { f: 880, t: 0.58, d: 0.4 },    // "SUDO!" (high A5)
        { f: 1108.73, t: 0.62, d: 0.45 } // harmony C#6
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.1, now + t);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch {}
  }

  // Debbie's spiral notebook snap / flip
  public playNotebookSnap(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  // Success chime when page command completes
  public playSuccess(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.07);
        gain.gain.setValueAtTime(0.07, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.28);
      });
    } catch {}
  }

  // Error feedback
  public playError(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.15);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // Futuristic Kasm Web Container Isolation Boot Chime
  public playContainerIsolate(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Laser / plasma container containment hum
      const oscSweep = ctx.createOscillator();
      const gainSweep = ctx.createGain();
      oscSweep.type = 'sawtooth';
      oscSweep.frequency.setValueAtTime(140, now);
      oscSweep.frequency.exponentialRampToValueAtTime(880, now + 0.22);
      gainSweep.gain.setValueAtTime(0.06, now);
      gainSweep.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      oscSweep.connect(gainSweep);
      gainSweep.connect(ctx.destination);
      oscSweep.start(now);
      oscSweep.stop(now + 0.25);

      // Digital WebRTC VNC stream lock confirmation pings
      [880, 1174.66, 1760].forEach((freq, idx) => {
        const ping = ctx.createOscillator();
        const pingGain = ctx.createGain();
        ping.type = 'sine';
        ping.frequency.setValueAtTime(freq, now + 0.12 + idx * 0.05);
        pingGain.gain.setValueAtTime(0.08, now + 0.12 + idx * 0.05);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12 + idx * 0.05 + 0.18);
        ping.connect(pingGain);
        pingGain.connect(ctx.destination);
        ping.start(now + 0.12 + idx * 0.05);
        ping.stop(now + 0.12 + idx * 0.05 + 0.18);
      });
    } catch {}
  }
}

export const sound = new SoundSystem();
