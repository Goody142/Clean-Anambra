// Emergency notification sounds and vibration

// Create emergency alert sound using Web Audio API
export const playEmergencySound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a more urgent multi-tone alert
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    
    // Emergency siren pattern: alternating high-low tones
    playTone(880, now, 0.15);
    playTone(660, now + 0.15, 0.15);
    playTone(880, now + 0.3, 0.15);
    playTone(660, now + 0.45, 0.15);
    playTone(880, now + 0.6, 0.15);
    playTone(660, now + 0.75, 0.15);
    
  } catch (error) {
    console.log('Audio not supported:', error);
  }
};

// Play success/completion sound
export const playSuccessSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;
    
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    // Pleasant ascending chime
    playTone(523, now, 0.1);
    playTone(659, now + 0.1, 0.1);
    playTone(784, now + 0.2, 0.2);
    
  } catch (error) {
    console.log('Audio not supported:', error);
  }
};

// Play notification sound
export const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
    
  } catch (error) {
    console.log('Audio not supported:', error);
  }
};

// Vibration patterns
export const vibrateEmergency = () => {
  if ('vibrate' in navigator) {
    // Urgent pattern: long-short-long-short-long
    navigator.vibrate([300, 100, 300, 100, 300, 100, 300]);
  }
};

export const vibrateNotification = () => {
  if ('vibrate' in navigator) {
    // Simple double pulse
    navigator.vibrate([100, 50, 100]);
  }
};

export const vibrateSuccess = () => {
  if ('vibrate' in navigator) {
    // Single short pulse
    navigator.vibrate([150]);
  }
};

// Combined alert functions
export const triggerEmergencyAlert = () => {
  playEmergencySound();
  vibrateEmergency();
};

export const triggerNotificationAlert = () => {
  playNotificationSound();
  vibrateNotification();
};

export const triggerSuccessAlert = () => {
  playSuccessSound();
  vibrateSuccess();
};
