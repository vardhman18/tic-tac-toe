// Enhanced sound management with Web Audio API fallbacks

class SoundManager {
  constructor() {
    this.sounds = {};
    this.audioContext = null;
    this.masterVolume = 0.7;
    this.soundsEnabled = true;
    
    // Initialize audio context
    this.initAudioContext();
    
    // Create sound effects using Web Audio API
    this.createSoundEffects();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported, falling back to HTML5 audio');
    }
  }

  createSoundEffects() {
    // Create synthesized sound effects
    this.sounds = {
      click: this.createClickSound.bind(this),
      win: this.createWinSound.bind(this),
      tie: this.createTieSound.bind(this),
      hover: this.createHoverSound.bind(this),
      modeSwitch: this.createModeSwitchSound.bind(this),
      reset: this.createResetSound.bind(this)
    };
  }

  // Create a satisfying click sound
  createClickSound() {
    if (!this.audioContext || !this.soundsEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Quick click sound
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Create celebratory win sound
  createWinSound() {
    if (!this.audioContext || !this.soundsEnabled) return;

    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
    
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
      }, index * 100);
    });
  }

  // Create neutral tie sound
  createTieSound() {
    if (!this.audioContext || !this.soundsEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  // Create subtle hover sound
  createHoverSound() {
    if (!this.audioContext || !this.soundsEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  // Create mode switch sound
  createModeSwitchSound() {
    if (!this.audioContext || !this.soundsEnabled) return;

    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator1.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator2.frequency.setValueAtTime(800, this.audioContext.currentTime);
    
    oscillator1.type = 'square';
    oscillator2.type = 'square';
    
    gainNode.gain.setValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator1.start(this.audioContext.currentTime);
    oscillator2.start(this.audioContext.currentTime);
    oscillator1.stop(this.audioContext.currentTime + 0.2);
    oscillator2.stop(this.audioContext.currentTime + 0.2);
  }

  // Create reset sound
  createResetSound() {
    if (!this.audioContext || !this.soundsEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.3);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // Play sound by name
  playSound(soundName) {
    if (this.sounds[soundName]) {
      try {
        // Resume audio context if suspended (required by browsers)
        if (this.audioContext?.state === 'suspended') {
          this.audioContext.resume();
        }
        this.sounds[soundName]();
      } catch (error) {
        console.warn(`Failed to play sound: ${soundName}`, error);
      }
    }
  }

  // Volume control
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  // Toggle sounds on/off
  toggleSounds() {
    this.soundsEnabled = !this.soundsEnabled;
    return this.soundsEnabled;
  }

  // Check if sounds are enabled
  isSoundsEnabled() {
    return this.soundsEnabled;
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Export individual functions for easier use
export const playSound = (soundName) => soundManager.playSound(soundName);
export const setVolume = (volume) => soundManager.setVolume(volume);
export const toggleSounds = () => soundManager.toggleSounds();
export const isSoundsEnabled = () => soundManager.isSoundsEnabled();