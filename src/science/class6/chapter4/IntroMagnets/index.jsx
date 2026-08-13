import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Magnet, ArrowRight, Volume2, VolumeX, RotateCcw } from 'lucide-react';

export default function IntroMagnets({ onBackToDashboard, onComplete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

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
      img: '/IntroMagnets/scene_99.png',
      subtitle: "Some Common Items with Magnets",
      lines: [
        {
          role: 'teacher',
          text: "The magnets used by sailors in the olden days were based on naturally occurring magnets, known as lodestones which were discovered in ancient times."
        },
        {
          role: 'teacher',
          text: "Later on, people found out that magnets could also be made from pieces of iron. Nowadays, we have magnets made of different materials."
        },
        {
          role: 'teacher',
          text: "The magnets that you find in your school laboratory and those used in pencil boxes, stickers, and toys are all artificial magnets."
        },
        {
          role: 'teacher',
          text: "Fig. 4.1: Some common items that have magnets attached to them."
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
        // Use the articulate female teacher-style narrator voice for Reshma (Girl)
        return (
          femaleVoices.find(v => v.name.includes('Jenny') || v.name.includes('Neerja') || (v.name.includes('Female') && !v.name.includes('Zira'))) ||
          femaleVoices.find(v => !v.name.includes('Zira') && !v.name.includes('Samantha')) ||
          femaleVoices[0] ||
          availableVoices[0] || null
        );
      } else if (role === 'ancient_man') {
        // Bold, clear, slow Indian voice for Ancient Man (Sailor)
        // 1. Primary: Indian Male voice (e.g. en-IN, hi-IN, ta-IN, te-IN, kn-IN, ml-IN, Ravi, Prabhat, Valluvar, Ketan, Madhav)
        const indianMaleVoice = availableVoices.find(v => {
          const lang = (v.lang || '').toLowerCase();
          const name = (v.name || '').toLowerCase();
          const isIndian = lang.includes('in') || lang.includes('ta') || lang.includes('hi') || lang.includes('te') || lang.includes('kn') || lang.includes('ml') || name.includes('india') || name.includes('indian') || name.includes('ravi') || name.includes('prabhat') || name.includes('valluvar') || name.includes('ketan') || name.includes('madhav');
          const isFemale = femaleVoices.includes(v) || name.includes('zira') || name.includes('samantha') || name.includes('heera') || name.includes('neerja') || name.includes('jenny') || name.includes('kalpana') || name.includes('female');
          return isIndian && !isFemale;
        });

        if (indianMaleVoice) return indianMaleVoice;

        // 2. Secondary: Any Indian voice available on system
        const anyIndianVoice = availableVoices.find(v => {
          const lang = (v.lang || '').toLowerCase();
          const name = (v.name || '').toLowerCase();
          return lang.includes('in') || lang.includes('-in') || lang.includes('_in') || name.includes('india') || name.includes('indian') || name.includes('ravi') || name.includes('prabhat') || name.includes('heera') || name.includes('neerja');
        });

        if (anyIndianVoice) return anyIndianVoice;

        // 3. Fallback: Preferred male voice
        return (
          maleVoices.find(v => v.name.includes('Ravi') || v.name.includes('Prabhat') || v.name.includes('David') || v.name.includes('Mark') || v.name.includes('George') || v.name.includes('James')) ||
          maleVoices[0] ||
          availableVoices.find(v => !femaleVoices.includes(v)) ||
          availableVoices[0] || null
        );
      } else {
        // Teacher voice (Lady Teacher) - Distinct female narrator
        return (
          femaleVoices.find(v => v.name.includes('Jenny') || v.name.includes('Neerja') || (v.name.includes('Female') && !v.name.includes('Zira'))) ||
          femaleVoices.find(v => !v.name.includes('Zira') && !v.name.includes('Samantha')) ||
          femaleVoices[0] ||
          availableVoices[0] || null
        );
      }
    };

    let lineIndex = 0;
    setIsPlaying(true);

    const speakNextLine = () => {
      if (lineIndex >= currentScene.lines.length) {
        setIsPlaying(false);
        return;
      }

      const currentLine = currentScene.lines[lineIndex];
      const utterance = new SpeechSynthesisUtterance(currentLine.text);
      utterance.voice = findVoice(currentLine.role);
      utterance.volume = 1.0; // Maximum sound level / volume boost

      if (currentLine.role === 'girl') {
        // Reshma (Girl): Primary female voice (Pitch: 1.0, Rate: 0.92, Volume: 1.0)
        utterance.pitch = 1.0;
        utterance.rate = 0.92;
        utterance.volume = 1.0;
      } else if (currentLine.role === 'ancient_man') {
        // Ancient Man (Sailor): Bold, clear, sound Indian male voice (pitch: 0.90 for clear resonant depth, rate: 0.68 for slow & deliberate pacing, volume: 1.0)
        utterance.pitch = 0.90;
        utterance.rate = 0.68;
        utterance.volume = 1.0;
      } else {
        // Teacher: Excellent articulate narrator tone (1.0), natural pace (0.92)
        utterance.pitch = 1.0;
        utterance.rate = 0.92;
      }

      utterance.onend = () => {
        lineIndex++;
        speakNextLine();
      };

      utterance.onerror = () => {
        setIsPlaying(false);
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

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000' }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${scenes[currentPage - 1].img})`,
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
