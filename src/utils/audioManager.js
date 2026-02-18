class AudioManager {
  constructor() {
    this.bgmAudio = new Audio();
    this.bgmAudio.loop = true;
    this.currentBgmKey = null;
    this.fadeInterval = null;
    this.targetVolume = 0.5;
  }

  playBgm(bgmKey) {
    if (this.currentBgmKey === bgmKey) return;

    // Stop logic
    if (bgmKey === 'stop' || !bgmKey) {
        this.fadeOutBgm(() => {
            this.currentBgmKey = null;
            this.bgmAudio.pause();
            this.bgmAudio.src = '';
        });
        return;
    }

    // Crossfade logic
    if (this.currentBgmKey) {
      this.fadeOutBgm(() => {
        this.startBgm(bgmKey);
      });
    } else {
      this.startBgm(bgmKey);
    }
  }

  startBgm(bgmKey) {
    this.currentBgmKey = bgmKey;
    // Assuming .mp3 for now. In a real app we might need to support checking for .ogg
    this.bgmAudio.src = `/assets/audio/bgm/${bgmKey}.mp3`;
    this.bgmAudio.volume = 0;

    const playPromise = this.bgmAudio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn("Audio playback prevented by browser policy or missing file:", error);
        });
    }

    this.fadeInBgm();
  }

  fadeInBgm() {
    clearInterval(this.fadeInterval);
    const step = 0.05;
    this.fadeInterval = setInterval(() => {
      if (this.bgmAudio.volume < this.targetVolume) {
        this.bgmAudio.volume = Math.min(this.targetVolume, this.bgmAudio.volume + step);
      } else {
        clearInterval(this.fadeInterval);
      }
    }, 50); // 50ms * 20 steps = 1s fade
  }

  fadeOutBgm(callback) {
    clearInterval(this.fadeInterval);
    const step = 0.05;
    this.fadeInterval = setInterval(() => {
      if (this.bgmAudio.volume > 0.05) { // Threshold to stop
        this.bgmAudio.volume = Math.max(0, this.bgmAudio.volume - step);
      } else {
        this.bgmAudio.volume = 0;
        clearInterval(this.fadeInterval);
        if (callback) callback();
      }
    }, 50);
  }

  playSfx(sfxKey) {
    if (!sfxKey) return;
    const sfx = new Audio(`/assets/audio/sfx/${sfxKey}.mp3`);
    sfx.volume = 0.7;
    const playPromise = sfx.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
             console.warn("SFX playback failed:", error);
        });
    }
  }
}

const audioManager = new AudioManager();
export default audioManager;
