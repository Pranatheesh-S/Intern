let currentAudio = null;
let currentSrc = null;
let currentOnStateChange = null;

export const toggleAudio = (src, onStateChange) => {
  if (currentSrc === src && currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    if (onStateChange) onStateChange(false);
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    if (currentOnStateChange) currentOnStateChange(false);
  }

  currentAudio = new Audio(src);
  currentSrc = src;
  currentOnStateChange = onStateChange;

  currentAudio.addEventListener('ended', () => {
    if (currentOnStateChange) currentOnStateChange(false);
    currentAudio = null;
    currentSrc = null;
    currentOnStateChange = null;
  });

  currentAudio.play().catch(e => {
    console.error("Error playing audio:", e);
    if (currentOnStateChange) currentOnStateChange(false);
  });
  if (onStateChange) onStateChange(true);
};

export const playOneShot = (src) => {
  if (currentAudio) {
    currentAudio.pause();
    if (currentOnStateChange) currentOnStateChange(false);
  }
  currentAudio = new Audio(src);
  currentSrc = src;
  currentOnStateChange = null;
  currentAudio.play().catch(e => console.error("Error playing audio:", e));
};
