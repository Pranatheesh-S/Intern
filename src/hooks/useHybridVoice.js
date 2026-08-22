import { useState, useCallback, useEffect } from 'react';
import { voiceService } from '../services/elevenLabsService';

export function useHybridVoice() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [spokenCharIndex, setSpokenCharIndex] = useState(-1);
  const [currentText, setCurrentText] = useState('');

  const speak = useCallback(({ text, audioUrl, voiceId, onEnd }) => {
    setCurrentText(text);
    setIsPlaying(true);
    setSpokenCharIndex(0);

    voiceService.speak({
      text,
      audioUrl,
      voiceId,
      onBoundary: (charIndex) => {
        setSpokenCharIndex(charIndex);
      },
      onEnd: () => {
        setIsPlaying(false);
        setSpokenCharIndex(text ? text.length : -1);
        if (onEnd) onEnd();
      },
      onError: (err) => {
        console.error('[useHybridVoice] Speech playback error:', err);
        setIsPlaying(false);
        setSpokenCharIndex(-1);
      }
    });
  }, []);

  const stop = useCallback(() => {
    voiceService.stop();
    setIsPlaying(false);
    setSpokenCharIndex(-1);
    setCurrentText('');
  }, []);

  useEffect(() => {
    return () => {
      voiceService.stop();
    };
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    spokenCharIndex,
    currentText
  };
}
