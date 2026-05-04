
class AudioManager {
  private static instance: AudioManager;
  private bgm: HTMLAudioElement | null = null;
  private sounds: Record<string, HTMLAudioElement> = {};
  private initialized = false;

  private constructor() {
    // Only initialize in browser
    if (typeof window !== 'undefined') {
      this.sounds = {
        flip: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
        match: new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'),
        win: new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'), // More of a "tada" success sound
      };
      
      this.bgm = new Audio('https://www.chosic.com/wp-content/uploads/2021/07/The-Happy-Song.mp3');
      if (this.bgm) {
        this.bgm.loop = true;
        this.bgm.volume = 0.2;
      }

      // Preload
      Object.values(this.sounds).forEach(s => {
        s.load();
        s.volume = 0.5;
      });
    }
  }

  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // CRITICAL for iPad/Chrome: Must be called from a user interaction
  init() {
    if (this.initialized) return;
    
    // Play any sound briefly to unlock the audio context on iOS/Chrome
    Object.values(this.sounds).forEach(s => {
      s.play().then(() => {
        s.pause();
        s.currentTime = 0;
      }).catch(() => {});
    });

    if (this.bgm) {
      this.bgm.play().then(() => {
        this.bgm?.pause();
      }).catch(() => {});
    }

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    }

    this.initialized = true;
    console.log('Audio initialized/unlocked');
  }

  toggleMusic(enabled: boolean) {
    this.init();
    if (!this.bgm) return;
    
    if (enabled) {
      this.bgm.play().catch(e => console.log('BGM play failed:', e));
    } else {
      this.bgm.pause();
    }
  }

  playSound(name: 'flip' | 'match' | 'win') {
    this.init();
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('SFX play failed:', e));
    }
  }
}

export const audioManager = AudioManager.getInstance();
