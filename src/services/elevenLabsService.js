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
  }

  /**
   * Stop any playing audio immediately across all engines
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
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
            if (onBoundary) onBoundary(text.length);
            if (onEnd) onEnd();
          });

          audio.addEventListener('error', (err) => {
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            this.currentAudio = null;
            reject(err);
          });

          audio.src = audioUrl;
          this.currentAudio = audio;
          this.startAudioKaraokeLoop(audio, text, onBoundary);

          audio.play().then(resolve).catch(reject);
        });

        await playPromise;
        console.log(`[VoiceService] Playing MP3 asset: ${audioUrl}`);
        return;
      } catch (err) {
        console.warn(`[VoiceService] MP3 asset "${audioUrl}" not playable/found, attempting WebSpeech fallback...`);
        this.currentAudio = null;
      }
    }

    // ── APPROACH B / FALLBACK ──
    this.fallbackToLiveOrBrowser({ text, voiceId: selectedVoiceId, role, onBoundary, onEnd, onError });
  }

  /**
   * Handle Approach B (ElevenLabs Dynamic API) or Web Speech Fallback
   */
  async fallbackToLiveOrBrowser({ text, voiceId, role, onBoundary, onEnd, onError }) {
    // Attempt Approach B: ElevenLabs Live API if API Key is configured
    if (this.apiKey) {
      console.log(`[VoiceService] Attempting Approach B (Live ElevenLabs API with Voice: ${voiceId})...`);
      try {
        const streamUrl = await this.fetchElevenLabsStream(text, voiceId, role);
        if (streamUrl) {
          const audio = new Audio(streamUrl);
          this.currentAudio = audio;

          audio.addEventListener('ended', () => {
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            this.currentAudio = null;
            if (onBoundary) onBoundary(text.length);
            if (onEnd) onEnd();
          });

          this.startAudioKaraokeLoop(audio, text, onBoundary);
          await audio.play();
          console.log('[VoiceService] Successfully playing ElevenLabs live audio stream!');
          return;
        }
      } catch (err) {
        console.warn('[VoiceService] ElevenLabs API call failed, falling back to browser WebSpeech:', err);
      }
    } else {
      console.info('[VoiceService] No ElevenLabs API Key in .env (VITE_ELEVENLABS_API_KEY). Using WebSpeech Fallback.');
    }

    // Fallback: Browser Native Web Speech API with Indian accent voices
    this.speakBrowserWebSpeech({ text, role, onBoundary, onEnd, onError });
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
      // 👧 Reshma (Cute Indian Girl — Voice ID: Dk3lflqf310KiWVmwB9F)
      // Soft, sweet, gentle tone with smooth cadence and clear pronunciation
      voice_settings = {
        stability: 0.55,        // Balanced for smooth, soft, natural cadence
        similarity_boost: 0.75, // High clarity & accurate pronunciation
        style: 0.05,            // Gentle, sweet, natural tone without forcefulness
        use_speaker_boost: false // Clean audio without hiss
      };
    } else if (role === 'teacher' || voiceId === 'Ps8lsQuJKZHMxxDU1tff') {
      // 👩‍🏫 Teacher / Narrator (Warm Indian Lady — Voice ID: Ps8lsQuJKZHMxxDU1tff)
      // Soft, encouraging, calm educational delivery with crystal-clear pronunciation
      voice_settings = {
        stability: 0.60,        // Smooth, soft, grounded delivery
        similarity_boost: 0.80, // Crystal-clear articulation and pronunciation
        style: 0.00,            // Warm, soft, comforting tone
        use_speaker_boost: false // Clean audio without hiss
      };
    } else if (role === 'ancient_man') {
      // ⛵ Ancient Sailor (Deep Storytelling Male Voice)
      voice_settings = {
        stability: 0.55,
        similarity_boost: 0.75,
        style: 0.02,
        use_speaker_boost: false
      };
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5', // High-fidelity, natural conversational speech model
        voice_settings
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ElevenLabs API HTTP ${response.status}: ${errText}`);
    }

    const blob = await response.blob();
    const streamUrl = URL.createObjectURL(blob);
    this.audioCache.set(cacheKey, streamUrl);
    return streamUrl;
  }

  /**
   * Web Speech API Native Fallback - Tuned for Indian English accent, slow speed, and high volume
   */
  speakBrowserWebSpeech({ text, role = 'teacher', onBoundary, onEnd, onError }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError(new Error('Speech Synthesis not supported'));
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    const voices = synth.getVoices();

    let selectedVoice = null;
    if (role === 'girl') {
      // Reshma (Indian Girl)
      selectedVoice = voices.find(v => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return lang.includes('en-in') || lang.includes('hi-in') || name.includes('neerja') || name.includes('heera') || name.includes('india');
      }) || voices.find(v => (v.name || '').toLowerCase().includes('female'));
      utterance.pitch = 1.10;
      utterance.rate = 0.78; // Slow reading speed for clear pronunciation
    } else if (role === 'ancient_man') {
      // Ancient Sailor (Indian Man)
      selectedVoice = voices.find(v => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return (lang.includes('en-in') || lang.includes('hi-in') || name.includes('ravi') || name.includes('prabhat') || name.includes('india')) || name.includes('male');
      }) || voices.find(v => (v.name || '').toLowerCase().includes('male'));
      utterance.pitch = 0.90;
      utterance.rate = 0.75; // Slow, deep reading speed
    } else {
      // Teacher / Narrator (Indian Woman)
      selectedVoice = voices.find(v => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return lang.includes('en-in') || lang.includes('hi-in') || name.includes('neerja') || name.includes('heera') || name.includes('kalyani') || name.includes('india');
      }) || voices.find(v => (v.name || '').toLowerCase().includes('female'));
      utterance.pitch = 1.0;
      utterance.rate = 0.78; // Slow, clear educational reading speed
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.volume = 1.0; // Maximum loudness

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
      isSpeakingStarted = true;
      lastBoundaryTime = Date.now();
      if (onBoundary) onBoundary(0);
    };

    utterance.onboundary = (event) => {
      isSpeakingStarted = true;
      lastBoundaryTime = Date.now();
      if (onBoundary && typeof event.charIndex === 'number' && event.charIndex >= 0) {
        onBoundary(event.charIndex);
        // Sync currentWordIdx with actual event charIndex
        const idx = wordPositions.findIndex(p => p >= event.charIndex);
        if (idx !== -1) currentWordIdx = idx;
      }
    };

    // Punctuation-aware fallback timer (Calibrated for slow 0.78x rate)
    this.fallbackTimer = setInterval(() => {
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
      if (onBoundary) onBoundary(text.length);
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      if (this.fallbackTimer) {
        clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
      }
      this.currentUtterance = null;
      if (onError) onError(err);
    };

    synth.speak(utterance);
  }
}

export const voiceService = new VoiceService();
