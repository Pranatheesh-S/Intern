/**
 * Hybrid Voice Service
 * Supports:
 * 1. Approach A: Pre-recorded audio files (.mp3) from public/audio/ (Fastest, zero latency, zero API cost)
 * 2. Approach B: Live ElevenLabs Text-to-Speech API streaming (Voice IDs: Teacher, Girl, Ancient Man)
 * 3. Fallback: Browser native Web Speech API (window.speechSynthesis) tuned for Indian English voices
 */

// Default ElevenLabs Voice IDs (Configured with explicit high-conversational variance Voice IDs)
export const ELEVENLABS_VOICES = {
  teacher: 'Ps8lsQuJKZHMxxDU1tff',     // Bold & Clear Indian Lady (Teacher / Narrator)
  girl: 'Dk3lflqf310KiWVmwB9F',        // Cute Indian Teenage Girl (Reshma)
  ancient_man: 'JBFqnCBsd6RMkjVDRZzb'  // Ancient Sailor (Deep Storytelling Male)
};

class VoiceService {
  constructor() {
    this.currentAudio = null;
    this.currentUtterance = null;
    this.animationFrameId = null;
    this.fallbackTimer = null;
    this.audioCache = new Map();
    this.apiKey = import.meta.env?.VITE_ELEVENLABS_API_KEY || 'sk_89333167c269941029cede7412d8b1f9a0e6be96812de5cc';
    this.defaultVoiceId = import.meta.env?.VITE_ELEVENLABS_VOICE_ID || ELEVENLABS_VOICES.teacher;
    this.sessionIdCounter = 0;
    this.currentSessionId = null;
  }

  /**
   * Stop any playing audio immediately across all engines and invalidate any pending async playback
   */
  stop() {
    this.currentSessionId = null; // Invalidate any pending async audio tasks

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.currentUtterance) {
      this.currentUtterance.onstart = null;
      this.currentUtterance.onboundary = null;
      this.currentUtterance.onend = null;
      this.currentUtterance.onerror = null;
      this.currentUtterance = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Continuous 60fps RAF loop for audio karaoke highlighting.
   * Highlights ONLY when audio is actively playing and currentTime > 0.
   */
  startAudioKaraokeLoop(audio, text, onBoundary) {
    if (!onBoundary || !text) return;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const totalWords = text.split(' ').length;
    const fallbackEstDuration = Math.max(1, totalWords / 2.0); // Calibrated for slow reading speed

    const updatePosition = () => {
      if (this.currentAudio !== audio || audio.paused || audio.currentTime <= 0) return;

      let dur = audio.duration;
      if (!dur || !isFinite(dur) || isNaN(dur) || dur <= 0) {
        dur = fallbackEstDuration;
      }

      const progress = Math.min(1, Math.max(0, audio.currentTime / dur));
      const charIndex = Math.floor(progress * text.length);
      onBoundary(charIndex);
    };

    const tick = () => {
      if (this.currentAudio === audio && !audio.ended) {
        if (!audio.paused && audio.currentTime > 0) {
          updatePosition();
        }
        this.animationFrameId = requestAnimationFrame(tick);
      }
    };

    audio.addEventListener('timeupdate', updatePosition);
    audio.addEventListener('playing', updatePosition);

    this.animationFrameId = requestAnimationFrame(tick);
  }

  /**
   * Main speech handler with Hybrid Approach
   * @param {Object} params
   * @param {string} params.text - Full text to speak
   * @param {string} [params.audioUrl] - Approach A: Path to pre-recorded MP3
   * @param {string} [params.voiceId] - Custom ElevenLabs Voice ID for Approach B
   * @param {string} [params.role] - Character role ('teacher', 'girl', 'ancient_man')
   * @param {Function} [params.onBoundary] - Word boundary callback (charIndex)
   * @param {Function} [params.onEnd] - Audio finished callback
   * @param {Function} [params.onError] - Error handler callback
   */
  async speak({ text, audioUrl, voiceId, role = 'teacher', onBoundary, onEnd, onError }) {
    this.stop();

    const sessionId = ++this.sessionIdCounter;
    this.currentSessionId = sessionId;

    const selectedVoiceId = voiceId || ELEVENLABS_VOICES[role] || this.defaultVoiceId;

    // Refresh API key dynamically if user created .env file
    if (!this.apiKey && import.meta.env?.VITE_ELEVENLABS_API_KEY) {
      this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    }

    // Keep text clean (-1) until audio actually begins playing
    if (onBoundary) onBoundary(-1);

    // ── APPROACH A: Pre-generated Audio File (MP3) ──
    if (audioUrl) {
      try {
        const audio = new Audio();
        
        const playPromise = new Promise((resolve, reject) => {
          audio.addEventListener('ended', () => {
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            this.currentAudio = null;
            if (this.currentSessionId === sessionId) {
              if (onBoundary) onBoundary(text.length);
              if (onEnd) onEnd();
            }
          });

          audio.addEventListener('error', (err) => {
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            this.currentAudio = null;
            reject(err);
          });

          audio.src = audioUrl;
          if (this.currentSessionId !== sessionId) {
            return;
          }
          this.currentAudio = audio;
          this.startAudioKaraokeLoop(audio, text, onBoundary);

          audio.play().then(resolve).catch(reject);
        });

        await playPromise;
        if (this.currentSessionId !== sessionId) {
          audio.pause();
          return;
        }
        return;
      } catch (err) {
        if (this.currentSessionId !== sessionId) return;
        this.currentAudio = null;
      }
    }

    if (this.currentSessionId !== sessionId) return;

    // ── APPROACH B / FALLBACK ──
    this.fallbackToLiveOrBrowser({ text, voiceId: selectedVoiceId, role, onBoundary, onEnd, onError, sessionId });
  }

  /**
   * Handle Approach B (ElevenLabs Dynamic API) or Web Speech Fallback
   */
  async fallbackToLiveOrBrowser({ text, voiceId, role, onBoundary, onEnd, onError, sessionId }) {
    if (this.currentSessionId !== sessionId) return;

    // Attempt Approach B: ElevenLabs Live API if API Key is configured
    if (this.apiKey) {
      try {
        const streamUrl = await this.fetchElevenLabsStream(text, voiceId, role);
        if (this.currentSessionId !== sessionId) return;

        if (streamUrl) {
          const audio = new Audio(streamUrl);
          if (this.currentSessionId !== sessionId) return;

          this.currentAudio = audio;

          audio.addEventListener('ended', () => {
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            this.currentAudio = null;
            if (this.currentSessionId === sessionId) {
              if (onBoundary) onBoundary(text.length);
              if (onEnd) onEnd();
            }
          });

          this.startAudioKaraokeLoop(audio, text, onBoundary);
          await audio.play();
          if (this.currentSessionId !== sessionId) {
            audio.pause();
            return;
          }
          return;
        }
      } catch (err) {
        if (this.currentSessionId !== sessionId) return;
      }
    }

    if (this.currentSessionId !== sessionId) return;

    // Fallback: Browser Native Web Speech API with Indian accent voices
    this.speakBrowserWebSpeech({ text, role, onBoundary, onEnd, onError, sessionId });
  }

  /**
   * ElevenLabs API Stream Fetcher (Approach B - Custom voice settings per character role)
   */
  async fetchElevenLabsStream(text, voiceId, role = 'teacher') {
    const cacheKey = `${voiceId}:${text}`;
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey);
    }

    // Determine role-specific settings for soft, warm, natural tone with clear pronunciation
    let voice_settings = {
      stability: 0.60,
      similarity_boost: 0.80,
      style: 0.00,
      use_speaker_boost: false
    };

    if (role === 'girl' || voiceId === 'Dk3lflqf310KiWVmwB9F') {
      voice_settings = {
        stability: 0.55,
        similarity_boost: 0.75,
        style: 0.05,
        use_speaker_boost: false
      };
    } else if (role === 'teacher' || voiceId === 'Ps8lsQuJKZHMxxDU1tff') {
      voice_settings = {
        stability: 0.60,
        similarity_boost: 0.80,
        style: 0.00,
        use_speaker_boost: false
      };
    } else if (role === 'ancient_man' || voiceId === 'JBFqnCBsd6RMkjVDRZzb') {
      voice_settings = {
        stability: 0.65,
        similarity_boost: 0.75,
        style: 0.00,
        use_speaker_boost: false
      };
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const streamUrl = URL.createObjectURL(blob);
    this.audioCache.set(cacheKey, streamUrl);
    return streamUrl;
  }

  /**
   * High-Fidelity Browser Web Speech Engine (Approach C / Fallback)
   * Tuned specifically with Indian English voices, slow educational cadence, and word-by-word karaoke
   */
  speakBrowserWebSpeech({ text, role = 'teacher', onBoundary, onEnd, onError, sessionId }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    if (this.currentSessionId !== sessionId) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    const voices = synth.getVoices();

    let selectedVoice = null;

    if (role === 'girl') {
      selectedVoice = voices.find(v => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return (lang.includes('en-in') || lang.includes('hi-in')) && (name.includes('heera') || name.includes('veena') || name.includes('girl') || name.includes('female'));
      }) || voices.find(v => (v.name || '').toLowerCase().includes('zira') || (v.name || '').toLowerCase().includes('female'));
      utterance.pitch = 1.25;
      utterance.rate = 0.82;
    } else if (role === 'ancient_man') {
      selectedVoice = voices.find(v => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return (lang.includes('en-in') || lang.includes('hi-in')) && (name.includes('ravi') || name.includes('prabhat') || name.includes('male'));
      }) || voices.find(v => (v.name || '').toLowerCase().includes('david') || (v.name || '').toLowerCase().includes('male'));
      utterance.pitch = 0.78;
      utterance.rate = 0.75;
    } else {
      selectedVoice = voices.find(v => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return lang.includes('en-in') || lang.includes('hi-in') || name.includes('neerja') || name.includes('heera') || name.includes('kalyani') || name.includes('india');
      }) || voices.find(v => (v.name || '').toLowerCase().includes('female'));
      utterance.pitch = 1.0;
      utterance.rate = 0.78;
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.volume = 1.0;

    const wordList = text.split(' ');
    let charAcc = 0;
    const wordPositions = wordList.map(w => {
      const pos = charAcc;
      charAcc += w.length + 1;
      return pos;
    });

    let currentWordIdx = 0;
    let lastBoundaryTime = 0;
    let isSpeakingStarted = false;

    utterance.onstart = () => {
      if (this.currentSessionId !== sessionId) {
        synth.cancel();
        return;
      }
      isSpeakingStarted = true;
      lastBoundaryTime = Date.now();
      if (onBoundary) onBoundary(0);
    };

    utterance.onboundary = (event) => {
      if (this.currentSessionId !== sessionId) {
        synth.cancel();
        return;
      }
      isSpeakingStarted = true;
      lastBoundaryTime = Date.now();
      if (onBoundary && typeof event.charIndex === 'number' && event.charIndex >= 0) {
        onBoundary(event.charIndex);
        const idx = wordPositions.findIndex(p => p >= event.charIndex);
        if (idx !== -1) currentWordIdx = idx;
      }
    };

    this.fallbackTimer = setInterval(() => {
      if (this.currentSessionId !== sessionId) {
        clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
        synth.cancel();
        return;
      }
      if (isSpeakingStarted && currentWordIdx < wordList.length) {
        const currentWord = wordList[currentWordIdx] || '';
        const hasPunctuation = /[,.!?;:]/.test(currentWord);
        const pauseThreshold = hasPunctuation ? 1100 : 450;

        if (Date.now() - lastBoundaryTime > pauseThreshold) {
          currentWordIdx++;
          if (currentWordIdx < wordPositions.length && onBoundary) {
            onBoundary(wordPositions[currentWordIdx]);
          }
          lastBoundaryTime = Date.now();
        }
      }
    }, 250);

    utterance.onend = () => {
      if (this.fallbackTimer) {
        clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
      }
      this.currentUtterance = null;
      if (this.currentSessionId === sessionId) {
        if (onBoundary) onBoundary(text.length);
        if (onEnd) onEnd();
      }
    };

    utterance.onerror = (err) => {
      if (this.fallbackTimer) {
        clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
      }
      this.currentUtterance = null;
      if (this.currentSessionId === sessionId && onError) {
        onError(err);
      }
    };

    synth.speak(utterance);
  }
}

export const voiceService = new VoiceService();
