import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Magnet, ArrowRight, Volume2, VolumeX, RotateCcw } from 'lucide-react';

export default function IntroMagnets({ onBackToDashboard, onComplete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [spokenCharIndex, setSpokenCharIndex] = useState(-1);

  const currentSpeechRef = useRef(null);

  const scenes = [
    {
      img: '/IntroMagnets/scene_1.png',
      subtitle: "Reshma's Birthday Gift",
      lines: [
        {
          role: 'teacher',
          text: "Reshma lived in a coastal town of Kerala and loved writing short stories. Since her grandmother enjoyed listening to her stories, Reshma decided to write a special story as a birthday gift for her grandmother's 60th birthday."
        },
        {
          role: 'girl',
          text: "Paati will be so happy to hear this story..."
        }
      ]
    },
    {
      img: '/IntroMagnets/scene_2.png',
      subtitle: "The Spice Ship",
      lines: [
        {
          role: 'teacher',
          text: "The Spice Ship. Her story was about a ship carrying spices like pepper, cardamom, and cinnamon from Kerala for trade in the olden days. The sailors used the stars at night to find the right direction across the sea."
        },
        {
          role: 'ancient_man',
          text: "Look, the North Star... that's our guide tonight."
        }
      ]
    },
    {
      img: '/IntroMagnets/scene_3.png',
      subtitle: "The Storm",
      lines: [
        {
          role: 'teacher',
          text: "The Storm. Suddenly, in her story, the ship was caught in a fierce storm. Thick clouds covered the sky, and the stars disappeared. Reshma wondered how the sailors could continue their journey without seeing the stars."
        },
        {
          role: 'ancient_man',
          text: "The stars are hidden... how will we find our way?"
        }
      ]
    },
    {
      img: '/IntroMagnets/scene_4.png',
      subtitle: "Searching for an Answer",
      lines: [
        {
          role: 'teacher',
          text: "Searching for an Answer. Unable to continue her story, Reshma searched the internet and visited her school library. She discovered that sailors used a magnetic compass to find directions even when the stars were hidden."
        },
        {
          role: 'girl',
          text: "I can't leave my story here... the sailors must have found a way!"
        },
        {
          role: 'girl',
          text: "Let me see what the internet says."
        },
        {
          role: 'girl',
          text: "A magnetic compass! That's how they found directions even when the stars were not visible."
        },
        {
          role: 'girl',
          text: "So, the needle always points to the north... That's amazing!"
        },
        {
          role: 'girl',
          text: "This book, sea navigation techniques."
        },
        {
          role: 'girl',
          text: "I've seen magnets in my pencil box and the duster on the board... I never looked at them closely."
        }
      ]
    },
    {
      img: '/IntroMagnets/scene_5.png',
      subtitle: "Discovering Magnets",
      lines: [
        {
          role: 'girl',
          text: "Magnets... I've seen them so many times, but never really thought about how they work."
        },
        {
          role: 'girl',
          text: "Let me read more about them."
        },
        {
          role: 'girl',
          text: "My pencil box stays closed because of a magnet!"
        },
        {
          role: 'girl',
          text: "And the magnet keeps my purse clasp tight."
        },
        {
          role: 'girl',
          text: "Even the duster on our whiteboard sticks because of a magnet!"
        },
        {
          role: 'girl',
          text: "Wow! Magnets have two poles - North and South!"
        },
        {
          role: 'girl',
          text: "No wonder sailors used a magnetic compass to find directions, even when the stars were hidden!"
        }
      ]
    },
    {
      img: '/lodestone_history.jpg',
      subtitle: "Lodestones to Artificial Magnets",
      lines: [
        {
          role: 'teacher',
          text: "Lodestones. Naturally occurring magnets discovered in ancient times are called lodestones."
        },
        {
          role: 'teacher',
          text: "Used by Sailors. In the olden days, sailors used lodestone-based magnets to navigate and find directions at sea when stars were not visible."
        },
        {
          role: 'teacher',
          text: "Shift to Artificial Magnets. Later on, people learned how to create magnets out of pieces of iron, which eventually led to the modern artificial magnets we use today."
        }
      ]
    }
  ];

  // Voice initialization effect
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const handleVoicesChanged = () => {
        setVoicesLoaded(true);
      };
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      handleVoicesChanged();
    }
  }, []);

  // Stop any active speech
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setSpokenCharIndex(-1);
  };

  // Render text directly over image text locations with real-time word-by-word karaoke highlighting
  const renderWordByWordText = (text, lineIdx, activeLineIdx, charIndex) => {
    if (!text) return null;
    const isThisLineActive = lineIdx === activeLineIdx && isPlaying;

    const words = text.split(' ');
    let currentPos = 0;

    return words.map((word, i) => {
      const startPos = currentPos;
      const endPos = currentPos + word.length;
      currentPos = endPos + 1; // +1 space

      const isCurrentWord = isThisLineActive && charIndex >= startPos && charIndex <= endPos + 2;
      const isPastWord = isThisLineActive && charIndex > endPos + 2;

      let color = '#1e293b'; // Default text color matching image print
      let fontWeight = 600;
      let textShadow = 'none';
      let backgroundColor = 'transparent';
      let padding = '0.1rem 0.2rem';
      let borderRadius = '4px';

      if (isCurrentWord) {
        color = '#0284c7'; // Vibrant glowing cyan for active spoken word
        fontWeight = 800;
        textShadow = '0 0 14px rgba(56, 189, 248, 1), 0 0 25px rgba(2, 132, 199, 0.8)';
        backgroundColor = 'rgba(56, 189, 248, 0.35)';
      } else if (isPastWord) {
        color = '#0369a1';
        fontWeight = 700;
      }

      return (
        <span
          key={i}
          style={{
            color,
            fontWeight,
            textShadow,
            backgroundColor,
            padding,
            borderRadius,
            transition: 'all 0.15s ease',
            display: 'inline-block',
            marginRight: '0.3rem'
          }}
        >
          {word}
        </span>
      );
    });
  };

  // Play audio lines for the current scene
  const playSceneAudio = (sceneIndex) => {
    stopSpeech();
    if (isMuted || !('speechSynthesis' in window)) return;

    const currentScene = scenes[sceneIndex - 1];
    if (!currentScene || !currentScene.lines || currentScene.lines.length === 0) return;

    const synth = window.speechSynthesis;
    const availableVoices = synth.getVoices();

    // Helper to find best voice match based on character role
    const findVoice = (role) => {
      // Explicit list of known system male voices
      const maleVoices = availableVoices.filter(v => 
        v.name.includes('David') ||
        v.name.includes('Mark') ||
        v.name.includes('Ravi') ||
        v.name.includes('Prabhat') ||
        v.name.includes('Valluvar') ||
        v.name.includes('George') ||
        v.name.includes('James') ||
        v.name.toLowerCase().includes('male') ||
        (!v.name.includes('Zira') && !v.name.includes('Samantha') && !v.name.includes('Heera') && !v.name.includes('Neerja') && !v.name.includes('Jenny') && !v.name.includes('Kalpana') && !v.name.toLowerCase().includes('female'))
      );

      // Explicit list of female voices
      const femaleVoices = availableVoices.filter(v => 
        v.name.includes('Zira') ||
        v.name.includes('Samantha') ||
        v.name.includes('Heera') ||
        v.name.includes('Neerja') ||
        v.name.includes('Jenny') ||
        v.name.includes('Kalpana') ||
        v.name.toLowerCase().includes('female')
      );

      if (role === 'girl') {
        // Girl voice (Reshma): Microsoft Jenny, Microsoft Neerja, Google Natural Female, or Google UK English Female
        const girlVoice = availableVoices.find(v => {
          const name = (v.name || '').toLowerCase();
          return name.includes('jenny') || name.includes('neerja') || name.includes('google uk english female') || name.includes('natural female');
        }) || availableVoices.find(v => {
          const name = (v.name || '').toLowerCase();
          return name.includes('google us english') || name.includes('samantha') || name.includes('zira') || name.includes('female');
        });

        if (girlVoice) return girlVoice;

        return femaleVoices[0] || availableVoices[0] || null;
      } else if (role === 'ancient_man') {
        // Bold, clear, slow Indian voice for Ancient Man (Sailor)
        const indianMaleVoice = availableVoices.find(v => {
          const lang = (v.lang || '').toLowerCase();
          const name = (v.name || '').toLowerCase();
          const isIndian = lang.includes('in') || lang.includes('ta') || lang.includes('hi') || lang.includes('te') || lang.includes('kn') || lang.includes('ml') || name.includes('india') || name.includes('indian') || name.includes('ravi') || name.includes('prabhat') || name.includes('valluvar') || name.includes('ketan') || name.includes('madhav');
          const isFemale = femaleVoices.includes(v) || name.includes('zira') || name.includes('samantha') || name.includes('heera') || name.includes('neerja') || name.includes('jenny') || name.includes('kalpana') || name.includes('female');
          return isIndian && !isFemale;
        });

        if (indianMaleVoice) return indianMaleVoice;

        const anyIndianVoice = availableVoices.find(v => {
          const lang = (v.lang || '').toLowerCase();
          const name = (v.name || '').toLowerCase();
          return lang.includes('in') || lang.includes('-in') || lang.includes('_in') || name.includes('india') || name.includes('indian') || name.includes('ravi') || name.includes('prabhat') || name.includes('heera') || name.includes('neerja');
        });

        if (anyIndianVoice) return anyIndianVoice;

        return (
          maleVoices.find(v => v.name.includes('Ravi') || v.name.includes('Prabhat') || v.name.includes('David') || v.name.includes('Mark') || v.name.includes('George') || v.name.includes('James')) ||
          maleVoices[0] ||
          availableVoices.find(v => !femaleVoices.includes(v)) ||
          availableVoices[0] || null
        );
      } else {
        // Teacher voice (Lady Teacher) - Distinct mature narrator
        const teacherVoice = availableVoices.find(v => {
          const name = (v.name || '').toLowerCase();
          return name.includes('neerja') || name.includes('natural female') || (name.includes('female') && !name.includes('zira'));
        }) || availableVoices.find(v => v.name.includes('Jenny') || v.name.includes('Zira'));

        return teacherVoice || femaleVoices[0] || availableVoices[0] || null;
      }
    };

    let lineIndex = 0;
    setIsPlaying(true);
    setActiveLineIndex(0);
    setSpokenCharIndex(0);

    const speakNextLine = () => {
      if (lineIndex >= currentScene.lines.length) {
        setIsPlaying(false);
        setSpokenCharIndex(-1);
        return;
      }

      setActiveLineIndex(lineIndex);
      setSpokenCharIndex(0);

      const currentLine = currentScene.lines[lineIndex];
      const utterance = new SpeechSynthesisUtterance(currentLine.text);
      utterance.voice = findVoice(currentLine.role);
      utterance.volume = 1.0;

      if (currentLine.role === 'girl') {
        // Reshma (Girl Voice): Lively, sweet, youthful tone
        utterance.pitch = 1.20;
        utterance.rate = 0.95;
        utterance.volume = 1.0;
      } else if (currentLine.role === 'ancient_man') {
        // Ancient Man (Sailor): Lower pitch, slower pace
        utterance.pitch = 0.88;
        utterance.rate = 0.70;
        utterance.volume = 1.0;
      } else {
        // Teacher: Calm, mature, clear teacher narrator voice
        utterance.pitch = 0.88;
        utterance.rate = 0.88;
        utterance.volume = 1.0;
      }

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          setSpokenCharIndex(event.charIndex);
        }
      };

      utterance.onend = () => {
        lineIndex++;
        speakNextLine();
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setSpokenCharIndex(-1);
      };

      synth.speak(utterance);
    };

    speakNextLine();
  };

  // Play voiceover 2 seconds after page/scene loads or when unmuted
  useEffect(() => {
    const timer = setTimeout(() => {
      playSceneAudio(currentPage);
    }, 2000);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [currentPage, isMuted, voicesLoaded]);

  const handleNext = () => {
    stopSpeech();
    setCurrentPage(p => Math.min(scenes.length, p + 1));
  };

  const handleBack = () => {
    stopSpeech();
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    } else {
      onBackToDashboard();
    }
  };

  const handleFinish = () => {
    stopSpeech();
    setIsCompleted(true);
  };

  const toggleMute = () => {
    if (isPlaying || !isMuted) {
      stopSpeech();
      setIsMuted(true);
    } else {
      setIsMuted(false);
      playSceneAudio(currentPage);
    }
  };

  const currentScene = scenes[currentPage - 1];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000' }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${currentScene.img})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />

      {/* Voiceover Controls (Top Right - High z-index to guarantee visibility) */}
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '0.75rem', zIndex: 99999 }}>
        <button
          onClick={() => playSceneAudio(currentPage)}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.4)',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
          }}
          title="Replay Voiceover"
        >
          <RotateCcw size={16} /> Replay Audio
        </button>

        <button
          onClick={toggleMute}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.4)',
            background: isMuted ? 'rgba(239, 68, 68, 0.85)' : 'rgba(16, 185, 129, 0.85)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
          }}
          title={isMuted ? 'Unmute Voiceover' : 'Mute Voiceover'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {isMuted ? 'Voice Muted' : 'Voice ON'}
        </button>
      </div>

      {/* Bottom Left Controls */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', gap: '1rem', zIndex: 10 }}>
        <button
          onClick={handleBack}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Bottom Right Controls */}
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', zIndex: 10 }}>
        {currentPage < scenes.length ? (
          <button 
            onClick={handleNext}
            style={{ padding: '0.75rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleFinish}
            style={{ padding: '0.75rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Finish Story
          </button>
        )}
      </div>

      {/* COMPLETION MODAL */}
      {isCompleted && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'var(--card-bg)', padding: '3rem', borderRadius: '24px',
            maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'inline-flex', padding: '1.5rem', background: '#ecfdf5', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)' }}>
              <Magnet size={48} color="#10b981" />
            </div>
            <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>Story Completed!</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Reshma learned that magnets were essential for navigation. Are you ready to explore magnets yourself?
            </p>
            <button
              className="primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'var(--accent)', color: '#fff', border: 'none' }}
              onClick={onComplete}
            >
              Continue to Activity 4.1 <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
