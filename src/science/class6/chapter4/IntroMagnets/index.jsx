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
  const [hasFinishedAudio, setHasFinishedAudio] = useState(false);

  const currentSpeechRef = useRef(null);
  const delayTimerRef = useRef(null);

  const scenes = [
    {
      img: '/IntroMagnets/scene_1.png',
      subtitle: "Reshma's Birthday Gift",
      lines: [
        {
          role: 'teacher',
          text: "Reshma lived in a coastal town of Kerala and loved writing short stories. Since her grandmother enjoyed listening to her stories, Reshma decided to write a special story as a birthday gift for her grandmother's 60th birthday.",
          pos: { top: '3%', left: '2%', width: '30%' }
        },
        {
          role: 'girl',
          text: "Paati will be so happy to hear this story...",
          pos: { top: '28%', left: '55%', width: '18%', tail: 'left' }
        }
      ]
    },
    {
      img: '/IntroMagnets/scene_2.png',
      subtitle: "The Spice Ship",
      lines: [
        {
          role: 'teacher',
          text: "The Spice Ship. Her story was about a ship carrying spices like pepper, cardamom, and cinnamon from Kerala for trade in the olden days. The sailors used the stars at night to find the right direction across the sea.",
          pos: { top: '3%', left: '2%', width: '30%' }
        },
        {
          role: 'ancient_man',
          text: "Look, the North Star... that's our guide tonight.",
          pos: { top: '24%', left: '48%', width: '210px', tail: 'left' }
        }
      ]
    },
    {
      img: '/IntroMagnets/scene_3.png',
      subtitle: "The Storm",
      lines: [
        {
          role: 'teacher',
          text: "The Storm. Suddenly, in her story, the ship was caught in a fierce storm. Thick clouds covered the sky, and the stars disappeared. Reshma wondered how the sailors could continue their journey without seeing the stars.",
          pos: { top: '3%', left: '2%', width: '30%' }
        },
        {
          role: 'ancient_man',
          text: "The stars are hidden... how will we find our way?",
          pos: { top: '18%', left: '48%', width: '210px', tail: 'left' }
        }
      ]
    },
    {
      img: '/IntroMagnets/scene_4.png',
      subtitle: "Searching for an Answer",
      lines: [
        {
          role: 'teacher',
          text: "Searching for an Answer. Unable to continue her story, Reshma searched the internet and visited her school library. She discovered that sailors used a magnetic compass to find directions even when the stars were hidden.",
          pos: { top: '3%', left: '2%', width: '30%' }
        },
        {
          role: 'girl',
          text: "I can't leave my story here... the sailors must have found a way!",
          pos: { top: '38%', left: '20%', width: '17%', tail: 'right' }
        },
        {
          role: 'girl',
          text: "Let me see what the internet says.",
          pos: { top: '9%', left: '60%', width: '15%', tail: 'bottom' }
        },
        {
          role: 'girl',
          text: "A magnetic compass! That's how they found directions even when the stars were not visible.",
          pos: { top: '36%', left: '69%', width: '18%', tail: 'left' }
        },
        {
          role: 'girl',
          text: "So, the needle always points to the north... That's amazing!",
          pos: { top: '55%', left: '66%', width: '17%', tail: 'left' }
        },
        {
          role: 'girl',
          text: "This book, sea navigation techniques.",
          pos: { top: '77%', left: '36%', width: '190px', tail: 'right' }
        },
        {
          role: 'girl',
          text: "I've seen magnets in my pencil box and the duster on the board... I never looked at them closely.",
          pos: { top: '70%', left: '5%', width: '19%', tail: 'right' }
        }
      ]
    },
    {
      img: '/IntroMagnets/scene_5.png',
      subtitle: "Discovering Magnets",
      lines: [
        {
          role: 'girl',
          text: "Magnets... I've seen them so many times, but never really thought about how they work.",
          pos: { top: '3%', left: '42.5%', width: '200px', tail: 'left' }
        },
        {
          role: 'girl',
          text: "Let me read more about them.",
          pos: { top: '18%', left: '79%', width: '180px', tail: 'left' }
        },
        {
          role: 'girl',
          text: "My pencil box stays closed because of a magnet!",
          pos: { top: '48%', left: '2%', width: '190px', tail: 'right' }
        },
        {
          role: 'girl',
          text: "And the magnet keeps my purse clasp tight.",
          pos: { top: '46%', left: '37%', width: '190px', tail: 'left' }
        },
        {
          role: 'girl',
          text: "Even the duster on our whiteboard sticks because of a magnet!",
          pos: { top: '48%', left: '74%', width: '190px', tail: 'left' }
        },
        {
          role: 'girl',
          text: "Wow! Magnets have two poles - North and South!",
          pos: { top: '74%', left: '10%', width: '200px', tail: 'right' }
        },
        {
          role: 'girl',
          text: "No wonder sailors used a magnetic compass to find directions, even when the stars were hidden!",
          pos: { top: '74%', left: '67%', width: '230px', tail: 'left' }
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
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setHasFinishedAudio(false);
    setSpokenCharIndex(-1);
  };

  // Render text directly over image with real-time word-by-word karaoke highlighting
  const renderWordByWordText = (text, lineIdx, activeLineIdx, charIndex, isEduCard = false) => {
    if (!text) return null;
    const isThisLineActive = lineIdx === activeLineIdx && isPlaying;

    const words = text.split(' ');
    let currentPos = 0;

    return words.map((word, i) => {
      const startPos = currentPos;
      const endPos = currentPos + word.length;
      const nextPos = endPos + 1; // start pos of next word
      currentPos = nextPos;

      // Strict single-word active check (prevents two words highlighting at once)
      const isCurrentWord = isThisLineActive && charIndex >= startPos && charIndex < nextPos;
      const isPastWord = isThisLineActive && charIndex >= nextPos;

      let color = isEduCard ? '#F5EEDB' : '#2C221E'; // Soft Ivory (#F5EEDB) vs Dark Charcoal Brown (#2C221E)
      let fontWeight = 600;
      let fontSize = isEduCard ? '1.08rem' : '1.12rem';
      let textShadow = 'none';
      let backgroundColor = 'transparent';
      let padding = '0';
      let borderRadius = '0';
      let transform = 'scale(1)';

      if (isCurrentWord) {
        color = isEduCard ? '#F3C969' : '#0284C7'; // Highlight text color alone
        fontWeight = 600;
        backgroundColor = 'transparent';
      } else if (isPastWord) {
        color = isEduCard ? '#F3C969' : '#0369A1';
        fontWeight = 600;
      }

      return (
        <span
          key={i}
          style={{
            color,
            fontWeight,
            fontSize,
            transform,
            textShadow,
            backgroundColor,
            padding,
            borderRadius,
            transition: 'color 0.15s ease',
            display: 'inline-block',
            marginRight: '0.22rem',
            lineHeight: 1.48
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
    if (isCompleted || isMuted || !('speechSynthesis' in window)) return;

    const currentScene = scenes[sceneIndex - 1];
    if (!currentScene || !currentScene.lines || currentScene.lines.length === 0) return;

    const synth = window.speechSynthesis;
    const availableVoices = synth.getVoices();

    // Helper to find best voice match based on character role
    const findVoice = (role) => {
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
        utterance.pitch = 1.20;
        utterance.rate = 0.95;
        utterance.volume = 1.0;
      } else if (currentLine.role === 'ancient_man') {
        utterance.pitch = 0.88;
        utterance.rate = 0.70;
        utterance.volume = 1.0;
      } else {
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
        if (lineIndex < currentScene.lines.length) {
          setActiveLineIndex(-1);
          setSpokenCharIndex(-1);
          delayTimerRef.current = setTimeout(() => {
            speakNextLine();
          }, 1500);
        } else {
          setIsPlaying(false);
          setHasFinishedAudio(true);
          setSpokenCharIndex(-1);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setSpokenCharIndex(-1);
      };

      synth.speak(utterance);
    };

    speakNextLine();
  };

  useEffect(() => {
    if (isCompleted) {
      stopSpeech();
      return;
    }

    const timer = setTimeout(() => {
      if (!isCompleted) {
        playSceneAudio(currentPage);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [currentPage, isMuted, voicesLoaded, isCompleted]);

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
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#090D16', fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
      
      {/* Background Image Container (Centered 16:9 aspect layout - 100% full image visible without top/bottom cropping) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxHeight: '100vh',
          aspectRatio: '16/9',
          margin: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={currentScene.img}
            alt={currentScene.subtitle}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />

        {/* Dynamic Text Overlay Layer */}
        {currentPage === 6 ? (
          /* Scene 6: Educational / Summary Cards (Deep Night Navy #0F1926, Muted Gold #D4AF37, Golden Amber #F3C969, Soft Ivory #F5EEDB) */
          <div style={{
            position: 'absolute',
            top: '3.5%',
            left: '4%',
            right: '4%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 20
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.25rem'
            }}>
              {currentScene.lines.map((line, idx) => {
                const isActive = idx === activeLineIndex && isPlaying;
                const titles = ['Lodestones:', 'Used by Sailors:', 'Shift to Artificial Magnets:'];
                return (
                  <div
                    key={idx}
                    style={{
                      background: isActive ? '#0F1926' : 'rgba(15, 25, 38, 0.92)',
                      backdropFilter: 'blur(14px)',
                      border: isActive ? '2px solid #F3C969' : '1.5px solid #D4AF37',
                      borderRadius: '16px',
                      padding: '1rem 1.2rem',
                      boxShadow: isActive ? '0 12px 35px rgba(212, 175, 55, 0.35)' : '0 8px 24px rgba(0,0,0,0.6)',
                      transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <h3 style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#F3C969',
                      letterSpacing: '0.02em',
                      borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                      paddingBottom: '0.35rem'
                    }}>
                      {titles[idx]}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.96rem', lineHeight: 1.55, color: '#F5EEDB' }}>
                      {renderWordByWordText(line.text, idx, activeLineIndex, spokenCharIndex, true)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Voiceover Controls positioned under the storycards in Scene 6 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', zIndex: 99999 }}>
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
          </div>
        ) : (
          /* Story Scenes 1-5 Narrative Boxes & Comic Thought Bubbles (Creamy Parchment #F5E8C7, Charcoal Brown #2C221E, Deep Antique Brown #5A3E28) */
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 20
          }}>
            {currentScene.lines.map((line, idx) => {
              const isActive = idx === activeLineIndex && isPlaying;
              const pos = line.pos || { top: '4%', left: '2%', width: '24%' };
              const isTeacher = line.role === 'teacher';

              if (isTeacher) {
                /* Shape 1: Vertical rounded rectangle parchment card (#F5E8C7) */
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      top: pos.top,
                      left: pos.left,
                      width: pos.width,
                      maxWidth: '380px',
                      background: '#F5E8C7',
                      border: '1.5px solid #5A3E28',
                      borderRadius: '14px',
                      padding: '0.75rem 1rem',
                      boxShadow: '0 6px 18px rgba(44, 34, 30, 0.35)',
                      pointerEvents: 'auto',
                      zIndex: isActive ? 25 : 20,
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <div style={{
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      color: '#5A3E28',
                      textTransform: 'uppercase',
                      marginBottom: '0.35rem',
                      borderBottom: '1px solid rgba(90, 62, 40, 0.25)',
                      paddingBottom: '0.2rem'
                    }}>
                      {currentScene.subtitle}
                    </div>
                    <p style={{ margin: 0, fontSize: '1.12rem', lineHeight: 1.5, color: '#2C221E' }}>
                      {renderWordByWordText(line.text, idx, activeLineIndex, spokenCharIndex, false)}
                    </p>
                  </div>
                );
              }

              /* Shape 2: Oval/cloud comic thought bubble (#F5E8C7) */
              const isBubbleVisible = hasFinishedAudio || (isPlaying && idx === activeLineIndex);
              if (!isBubbleVisible) return null;

              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    width: pos.width || '210px',
                    background: '#F5E8C7',
                    border: '1.5px solid #5A3E28',
                    borderRadius: '35px',
                    padding: '0.45rem 0.75rem',
                    boxShadow: '0 6px 16px rgba(44, 34, 30, 0.3)',
                    transition: 'all 0.25s ease',
                    pointerEvents: 'auto',
                    zIndex: isActive ? 25 : 20
                  }}
                >
                  {/* Circular Thought Bubble Tail Dots */}
                  {pos.tail === 'left' && (
                    <div style={{ position: 'absolute', left: '-15px', bottom: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', transform: 'rotate(-40deg)' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F5E8C7', border: '1.5px solid #5A3E28' }} />
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F5E8C7', border: '1.5px solid #5A3E28' }} />
                    </div>
                  )}
                  {pos.tail === 'right' && (
                    <div style={{ position: 'absolute', right: '-15px', bottom: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', transform: 'rotate(40deg)' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F5E8C7', border: '1.5px solid #5A3E28' }} />
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F5E8C7', border: '1.5px solid #5A3E28' }} />
                    </div>
                  )}
                  {pos.tail === 'bottom' && (
                    <div style={{ position: 'absolute', bottom: '-15px', left: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F5E8C7', border: '1.5px solid #5A3E28' }} />
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F5E8C7', border: '1.5px solid #5A3E28' }} />
                    </div>
                  )}
                  {pos.tail === 'top' && (
                    <div style={{ position: 'absolute', top: '-15px', left: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F5E8C7', border: '1.5px solid #5A3E28' }} />
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F5E8C7', border: '1.5px solid #5A3E28' }} />
                    </div>
                  )}

                  <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.5, color: '#2C221E', textAlign: 'center' }}>
                    {renderWordByWordText(line.text, idx, activeLineIndex, spokenCharIndex, false)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>

      {/* Voiceover Controls (Top Right for Scenes 1-5) */}
      {currentPage !== 6 && (
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
      )}

      {/* Bottom Left Controls */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', gap: '1rem', zIndex: 99999 }}>
        <button
          onClick={handleBack}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', color: 'white', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Bottom Right Controls */}
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', zIndex: 99999 }}>
        {currentPage < scenes.length ? (
          <button 
            onClick={handleNext}
            style={{ padding: '0.75rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleFinish}
            style={{ padding: '0.75rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Finish Story
          </button>
        )}
      </div>

      {/* COMPLETION MODAL */}
      {isCompleted && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100000, animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '24px',
            padding: '2rem 2.5rem',
            maxWidth: '460px',
            textAlign: 'center',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#1e40af' }}>
              Story Completed!
            </h2>
            <p style={{ fontSize: '1.08rem', color: '#2563eb', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              Reshma learned that magnets were essential for navigation. Are you ready to explore magnets yourself?
            </p>
            <button
              onClick={onComplete}
              style={{
                width: '100%',
                padding: '1.1rem 2.5rem',
                fontSize: '1.25rem',
                fontWeight: 800,
                borderRadius: '40px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              Continue to Activity 4.1 <ArrowRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
