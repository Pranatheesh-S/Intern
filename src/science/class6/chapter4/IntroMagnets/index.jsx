import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Magnet, ArrowRight, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { voiceService, ELEVENLABS_VOICES } from '../../../../services/elevenLabsService';

export default function IntroMagnets({ onBackToDashboard, onComplete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [visibleLineCount, setVisibleLineCount] = useState(1);
  const [spokenCharIndex, setSpokenCharIndex] = useState(-1);
  const [hasFinishedAudio, setHasFinishedAudio] = useState(false);

  const delayTimerRef = useRef(null);

  const scenes = [
    {
      img: '/IntroMagnets/scene_1.png',
      subtitle: "Reshma's Birthday Gift",
      lines: [
        {
          role: 'teacher',
          text: "Reshma lived in a coastal town of Kerala and loved writing short stories. Since her grandmother enjoyed listening to her stories, Reshma decided to write a special story as a birthday gift for her grandmother's 60th birthday.",
          pos: { top: '3%', left: '2%', width: '30%' },
          audioUrl: '/IntroMagnets/audio/scene1_line1.mp3'
        },
        {
          role: 'girl',
          text: "Paati will be so happy to hear this story...",
          pos: { top: '28%', left: '55%', width: '18%', tail: 'left' },
          audioUrl: '/IntroMagnets/audio/scene1_line2.mp3'
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
          pos: { top: '3%', left: '2%', width: '30%' },
          audioUrl: '/IntroMagnets/audio/scene2_line1.mp3'
        },
        {
          role: 'ancient_man',
          text: "Look, the North Star... that's our guide tonight.",
          pos: { top: '24%', left: '48%', width: '210px', tail: 'left' },
          audioUrl: '/IntroMagnets/audio/scene2_line2.mp3'
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
          pos: { top: '3%', left: '2%', width: '30%' },
          audioUrl: '/IntroMagnets/audio/scene3_line1.mp3'
        },
        {
          role: 'ancient_man',
          text: "The stars are hidden... how will we find our way?",
          pos: { top: '18%', left: '48%', width: '210px', tail: 'left' },
          audioUrl: '/IntroMagnets/audio/scene3_line2.mp3'
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
          pos: { top: '3%', left: '2%', width: '30%' },
          audioUrl: '/IntroMagnets/audio/scene4_line1.mp3'
        },
        {
          role: 'girl',
          text: "I can't leave my story here... the sailors must have found a way!",
          pos: { top: '38%', left: '20%', width: '17%', tail: 'right' },
          audioUrl: '/IntroMagnets/audio/scene4_line2.mp3'
        },
        {
          role: 'girl',
          text: "Let me see what the internet says.",
          pos: { top: '9%', left: '60%', width: '15%', tail: 'bottom' },
          audioUrl: '/IntroMagnets/audio/scene4_line3.mp3'
        },
        {
          role: 'girl',
          text: "A magnetic compass! That's how they found directions even when the stars were not visible.",
          pos: { top: '36%', left: '69%', width: '18%', tail: 'left' },
          audioUrl: '/IntroMagnets/audio/scene4_line4.mp3'
        },
        {
          role: 'girl',
          text: "So, the needle always points to the north... That's amazing!",
          pos: { top: '55%', left: '66%', width: '17%', tail: 'left' },
          audioUrl: '/IntroMagnets/audio/scene4_line5.mp3'
        },
        {
          role: 'girl',
          text: "This book, sea navigation techniques.",
          pos: { top: '77%', left: '36%', width: '190px', tail: 'right' },
          audioUrl: '/IntroMagnets/audio/scene4_line6.mp3'
        },
        {
          role: 'girl',
          text: "I've seen magnets in my pencil box and the duster on the board... I never looked at them closely.",
          pos: { top: '70%', left: '5%', width: '19%', tail: 'right' },
          audioUrl: '/IntroMagnets/audio/scene4_line7.mp3'
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
          pos: { top: '3%', left: '42.5%', width: '200px', tail: 'left' },
          audioUrl: '/IntroMagnets/audio/scene5_line1.mp3'
        },
        {
          role: 'girl',
          text: "Let me read more about them.",
          pos: { top: '18%', left: '79%', width: '180px', tail: 'left' },
          audioUrl: '/IntroMagnets/audio/scene5_line2.mp3'
        },
        {
          role: 'girl',
          text: "My pencil box stays closed because of a magnet!",
          pos: { top: '48%', left: '2%', width: '190px', tail: 'right' },
          audioUrl: '/IntroMagnets/audio/scene5_line3.mp3'
        },
        {
          role: 'girl',
          text: "And the magnet keeps my purse clasp tight.",
          pos: { top: '46%', left: '37%', width: '190px', tail: 'left' },
          audioUrl: '/IntroMagnets/audio/scene5_line4.mp3'
        },
        {
          role: 'girl',
          text: "Even the duster on our whiteboard sticks because of a magnet!",
          pos: { top: '48%', left: '74%', width: '190px', tail: 'left' },
          audioUrl: '/IntroMagnets/audio/scene5_line5.mp3'
        },
        {
          role: 'girl',
          text: "Wow! Magnets have two poles - North and South!",
          pos: { top: '74%', left: '10%', width: '200px', tail: 'right' },
          audioUrl: '/IntroMagnets/audio/scene5_line6.mp3'
        },
        {
          role: 'girl',
          text: "No wonder sailors used a magnetic compass to find directions, even when the stars were hidden!",
          pos: { top: '74%', left: '67%', width: '230px', tail: 'left' },
          audioUrl: '/IntroMagnets/audio/scene5_line7.mp3'
        }
      ]
    },
    {
      img: '/lodestone_history.jpg',
      subtitle: "Lodestones to Artificial Magnets",
      lines: [
        {
          role: 'teacher',
          text: "Lodestones. Naturally occurring magnets discovered in ancient times are called lodestones.",
          audioUrl: '/IntroMagnets/audio/scene6_line1.mp3'
        },
        {
          role: 'teacher',
          text: "Used by Sailors. In the olden days, sailors used lodestone-based magnets to navigate and find directions at sea when stars were not visible.",
          audioUrl: '/IntroMagnets/audio/scene6_line2.mp3'
        },
        {
          role: 'teacher',
          text: "Shift to Artificial Magnets. Later on, people learned how to create magnets out of pieces of iron, which eventually led to the modern artificial magnets we use today.",
          audioUrl: '/IntroMagnets/audio/scene6_line3.mp3'
        }
      ]
    }
  ];

  // Stop any active speech
  const stopSpeech = () => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    voiceService.stop();
    setIsPlaying(false);
    setHasFinishedAudio(false);
    setSpokenCharIndex(-1);
  };

  // Render text directly over image with real-time word-by-word karaoke highlighting (Text Color ONLY - No Background/Popups)
  const renderWordByWordText = (text, lineIdx, activeLineIdx, charIndex, isEduCard = false) => {
    if (!text) return null;
    const isThisLineActive = lineIdx === activeLineIdx && isPlaying;

    const words = text.split(' ');
    let currentPos = 0;

    return words.map((word, i) => {
      const startPos = currentPos;
      const endPos = currentPos + word.length;
      const nextPos = endPos + 1;
      currentPos = nextPos;

      // Single-word active check matching 60fps character index progression
      const isCurrentWord = isThisLineActive && charIndex >= startPos && charIndex < nextPos;
      const isPastWord = isThisLineActive && charIndex >= nextPos;

      let color = isEduCard ? '#F5EEDB' : '#2C221E';
      let fontWeight = 500;
      let fontSize = isEduCard ? '1.08rem' : '1.12rem';

      if (isCurrentWord) {
        // TEXT COLOR ONLY HIGHLIGHT (No Background, No Popups)
        color = isEduCard ? '#F3C969' : '#2563EB';
        fontWeight = 800;
      } else if (isPastWord) {
        color = isEduCard ? '#D4AF37' : '#1E40AF';
        fontWeight = 700;
      }

      return (
        <span
          key={i}
          style={{
            color,
            fontWeight,
            fontSize,
            backgroundColor: 'transparent',
            padding: 0,
            borderRadius: 0,
            boxShadow: 'none',
            transform: 'none',
            transition: 'color 0.15s ease',
            display: 'inline-block',
            marginRight: '0.25rem',
            lineHeight: 1.55
          }}
        >
          {word}
        </span>
      );
    });
  };

  // Play audio lines sequentially: Next bubble pops up FIRST, then speech & highlighting start!
  const playSceneAudio = (sceneIndex) => {
    stopSpeech();
    if (isCompleted || isMuted) return;

    const currentScene = scenes[sceneIndex - 1];
    if (!currentScene || !currentScene.lines || currentScene.lines.length === 0) return;

    let lineIndex = 0;
    setIsPlaying(true);
    setActiveLineIndex(0);
    setVisibleLineCount(1); // Start with Line 0 visible
    setSpokenCharIndex(-1);

    const speakNextLine = () => {
      if (lineIndex >= currentScene.lines.length) {
        setIsPlaying(false);
        setSpokenCharIndex(-1);
        return;
      }

      setActiveLineIndex(lineIndex);
      setSpokenCharIndex(-1);

      const currentLine = currentScene.lines[lineIndex];

      // Voice IDs for different roles (Approach B)
      const roleVoiceId = currentLine.role === 'girl' 
        ? ELEVENLABS_VOICES.girl 
        : currentLine.role === 'ancient_man' 
          ? ELEVENLABS_VOICES.ancient_man 
          : ELEVENLABS_VOICES.teacher;

      voiceService.speak({
        text: currentLine.text,
        audioUrl: currentLine.audioUrl,
        voiceId: roleVoiceId,
        role: currentLine.role,
        onBoundary: (charIndex) => {
          setSpokenCharIndex(charIndex);
        },
        onEnd: () => {
          lineIndex++;
          if (lineIndex < currentScene.lines.length) {
            // STEP 1: Immediately hide completed bubble for clean 1.5s gap
            setActiveLineIndex(-1);
            setSpokenCharIndex(-1);

            // STEP 2: Pause 1.5s before next bubble appears and starts reading
            delayTimerRef.current = setTimeout(() => {
              speakNextLine();
            }, 1500);
          } else {
            setIsPlaying(false);
            setHasFinishedAudio(true);
            setSpokenCharIndex(-1);
          }
        },
        onError: () => {
          setIsPlaying(false);
          setSpokenCharIndex(-1);
        }
      });
    };

    speakNextLine();
  };

  useEffect(() => {
    if (isCompleted) {
      stopSpeech();
      return;
    }

    // Reset line visibility on scene change
    setVisibleLineCount(1);

    const timer = setTimeout(() => {
      if (!isCompleted) {
        playSceneAudio(currentPage);
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [currentPage, isMuted, isCompleted]);

  const handleNext = () => {
    stopSpeech();
    setCurrentPage(p => Math.min(scenes.length, p + 1));
  };

  const handleBack = () => {
    stopSpeech();
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  };

  const handleFinish = () => {
    stopSpeech();
    setTimeout(() => {
      setIsCompleted(true);
    }, 1500);
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'linear-gradient(135deg, #EBF5F6 0%, #EDF8F7 100%)', fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
      {/* Light Pastel Magnetic Field Vector Lines Background SVG */}
      <svg 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }} 
        viewBox="0 0 1440 900" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-100 450 C 200 100, 500 100, 720 450 C 940 800, 1240 800, 1540 450" stroke="rgba(13, 148, 136, 0.15)" strokeWidth="3" fill="none" />
        <path d="M-100 450 C 200 180, 500 180, 720 450 C 940 720, 1240 720, 1540 450" stroke="rgba(244, 63, 94, 0.15)" strokeWidth="3" fill="none" />
      </svg>


      
      {/* Background Image Container */}
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
          /* Scene 6: Educational Summary Cards */
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
                      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      animation: 'fadeInScale 0.4s ease-out'
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

            {/* Voiceover Controls in Scene 6 */}
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
          /* Story Scenes 1-5 Narrative Boxes & Comic Thought Bubbles */
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
                /* Parchment card: Always visible once scene starts */
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

              /* Comic Thought Bubble: Active bubble shows while reading; previous disappears; all show at end of scene */
              const isBubbleVisible = hasFinishedAudio ? true : (isPlaying && idx === activeLineIndex);
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
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    pointerEvents: 'auto',
                    zIndex: isActive ? 25 : 20
                  }}
                >
                  {/* Thought Bubble Tail Dots */}
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

      {/* Voiceover Controls */}
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

      {/* Bottom Left Controls - Always present, matching Next button styling & navigating to Chapter 4 flow on page 1 */}
      <div style={{ 
        position: 'absolute', 
        bottom: '1.25rem', 
        left: '1.25rem', 
        display: 'flex', 
        zIndex: 99999 
      }}>
        <button
          onClick={() => {
            stopSpeech();
            if (currentPage > 1) {
              handleBack();
            } else if (onBackToDashboard) {
              onBackToDashboard();
            }
          }}
          style={{ 
            padding: '0.75rem 2rem', 
            borderRadius: '30px', 
            border: '1px solid rgba(255,255,255,0.3)', 
            background: 'rgba(0,0,0,0.65)', 
            backdropFilter: 'blur(6px)', 
            color: 'white', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.background = 'rgba(0,0,0,0.85)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(0,0,0,0.65)';
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Controls */}
      {currentPage < scenes.length ? (
        <div style={{ 
          position: 'absolute', 
          bottom: '1.25rem', 
          right: '1.25rem', 
          display: 'flex', 
          zIndex: 99999 
        }}>
          <button 
            onClick={handleNext}
            style={{ padding: '0.75rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Next
          </button>
        </div>
      ) : (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          right: '2.5rem', 
          transform: 'translateY(-50%)', 
          display: 'flex', 
          zIndex: 99999 
        }}>
          <button 
            onClick={handleFinish}
            style={{ 
              padding: '1.1rem 2.75rem', 
              borderRadius: '40px', 
              border: 'none', 
              background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)', 
              color: '#ffffff', 
              cursor: 'pointer', 
              fontWeight: 800,
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 8px 25px rgba(244, 63, 94, 0.45)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(244, 63, 94, 0.65)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(244, 63, 94, 0.45)';
            }}
          >
            Finish Story <ArrowRight size={24} color="#ffffff" />
          </button>
        </div>
      )}

      {/* COMPLETION MODAL */}
      {isCompleted && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '30px',
            padding: '2.5rem 3rem',
            maxWidth: '520px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>
              Story Completed!
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
              Reshma learned that magnets were essential for navigation. Are you ready to explore magnets yourself?
            </p>
            <button
              onClick={onComplete}
              style={{
                width: '100%',
                padding: '1.1rem 3rem',
                fontSize: '1.15rem',
                fontWeight: 800,
                borderRadius: '40px',
                background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: '0 6px 20px rgba(244, 63, 94, 0.45)',
                transition: 'all 0.25s ease',
                marginTop: '0.5rem'
              }}
            >
              Continue to Activity 4.1 <ArrowRight size={22} color="#ffffff" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
