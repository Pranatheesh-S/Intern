import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

﻿const SvgIcons = {
  MagnifyingGlass: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  ),
  Play: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>),
  Pause: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>),
  Check: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>),
  IconCurrent: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>),
  IconLocked: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"></path></svg>)
};


const clues = [
  {
    id: 1,
    title: "HOW OLD IS POTTERY?",
    bigFact: "7,000ΓÇô8,000 YEARS",
    text: "The earliest pottery found in the Indian subcontinent dates back to 7,000 to 8,000 years in the Ganga plains (Lahuradewa) and in Baluchistan (Mehrgarh).",
    timelineText: "AGE"
  },
  {
    id: 2,
    title: "POTTERY TECHNOLOGY",
    bigFact: "AROUND 4000 BCE",
    text: "About 4000 BCE onwards, Sindhu-Sarasvat─½ developed techniques of wheel-turned pottery production, pigmentation, application of protective or decorative coats (called ΓÇÿslipsΓÇÖ) of multiple colours, decorative painting, etc.",
    timelineText: "SHAPING"
  },
  {
    id: 3,
    title: "HARAPPAN POTTERY",
    bigFact: "2600ΓÇô1900 BCE",
    text: "These techniques became further sophisticated during the Sindhu-Sarasvat─½ (also known as ΓÇÿHarappanΓÇÖ) Civilisation (2600ΓÇô1900 BCE), with a bright red surface painted with black-coloured designs displaying geometric patterns, and aquatic and terrestrial animals.",
    timelineText: "DESIGN"
  },
  {
    id: 4,
    title: "HOW WAS IT MADE?",
    bigFact: "TERRACOTTA",
    text: "The clay used for making pots, dishes, bowls and other items was carefully selected and cleaned, sieved, kneaded, turned over a wheel and finally baked in kilns (baked clay is called ΓÇÿterracottaΓÇÖ).",
    timelineText: "MAKING"
  },
  {
    id: 5,
    title: "HOW WAS IT USED?",
    bigFact: "STORAGE & COOKING",
    text: "Pots were used for various purposes, from cooking to storage of food grains, oil, ghee, and so on. Some very large storage jars and other pottery items are exhibited at the National Museum, New Delhi.",
    timelineText: "USES"
  }
];

const HighlightedText = ({ phrases, activeCharIndex }) => {
  const fullText = phrases.join('');
  return (
    <span>
      {fullText.split('').map((char, index) => (
        <span key={index} style={{
          backgroundColor: index < activeCharIndex ? '#fef08a' : 'transparent',
          color: index < activeCharIndex ? '#000' : 'inherit',
          transition: 'background-color 0.1s',
          borderRadius: '2px'
        }}>
          {char}
        </span>
      ))}
    </span>
  );
};

const PotterySpotlight = ({ page1Layout }) => {
  const [currentClue, setCurrentClue] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const [hasPlayed, setHasPlayed] = useState(false);

  const currentData = clues[currentClue - 1];

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveCharIndex(-1);
  };

  useEffect(() => {
    stopAudio();
    setHasPlayed(false);
  }, [currentClue]);

  useEffect(() => {
    return stopAudio;
  }, []);

  const playAudio = () => {
    if (!('speechSynthesis' in window)) return;
    stopAudio();
    setIsPlaying(true);
    setHasPlayed(true);

    const fullText = currentData.text;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'en-IN';
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.lang === 'en-IN' && (v.name.includes('Female') || v.name.includes('Ravi') === false));
    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.rate = 0.9;
    
    utterance.onboundary = (e) => {
      setActiveCharIndex(e.charIndex);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setActiveCharIndex(fullText.length);
    };

    window.speechSynthesis.speak(utterance);
  };

  const timelineNode = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', paddingTop: '16px', flexWrap: 'nowrap', overflow: 'hidden' }}>
      {clues.map((c, idx) => (
        <React.Fragment key={c.id}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div 
              onClick={() => setCurrentClue(c.id)}
              style={{
                width: '32px', height: '32px', 
                borderRadius: '50%',
                background: currentClue === c.id ? '#3b82f6' : (currentClue > c.id ? '#10b981' : '#e2e8f0'),
                color: currentClue === c.id || currentClue > c.id ? 'white' : '#64748b',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
                boxShadow: currentClue === c.id ? '0 0 0 4px rgba(59,130,246,0.3)' : 'none',
                flexShrink: 0
              }}
            >
              {currentClue > c.id ? <SvgIcons.Check /> : `0${c.id}`}
            </div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 'bold', 
              color: currentClue === c.id ? '#3b82f6' : '#64748b',
              marginTop: '4px'
            }}>
              {c.timelineText}
            </div>
          </div>
          {idx < clues.length - 1 && (
            <div style={{ 
              height: '4px', 
              width: '40px',
              background: currentClue > c.id ? '#10b981' : '#e2e8f0',
              margin: '0 4px',
              flexShrink: 1,
              transform: 'translateY(-8px)'
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', boxSizing: 'border-box', overflow: 'hidden' }}>
      
      <div style={{ marginBottom: 'clamp(8px, 1.5vh, 16px)' }}>
        <h3 style={{ fontSize: 'clamp(20px, 3vw, 36px)', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0', wordBreak: 'break-word', lineHeight: '1.2' }}>
          {currentData.title}
        </h3>
        <div style={{ fontSize: 'clamp(14px, 2vw, 22px)', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '1px' }}>
          DO YOU KNOW?
        </div>
      </div>

      <div style={{ 
        flex: '1 1 auto', 
        backgroundColor: '#f8fafc', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        padding: 'clamp(12px, 2.5vmin, 24px)',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 'clamp(8px, 1.5vh, 16px)',
        minHeight: 0,
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        
        <div style={{ fontSize: 'clamp(24px, 4.5vmin, 60px)', fontWeight: '900', color: '#1e3a8a', marginBottom: 'clamp(8px, 1.5vh, 24px)', lineHeight: '1.1', wordBreak: 'break-word' }}>
          {currentData.bigFact}
        </div>
        
        <div style={{ fontSize: 'clamp(14px, 2.5vmin, 24px)', color: '#334155', lineHeight: '1.5', maxWidth: '100%', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
          {isPlaying ? (
            <HighlightedText phrases={[currentData.text]} activeCharIndex={activeCharIndex} />
          ) : (
             <span style={{ backgroundColor: hasPlayed ? '#fef08a' : 'transparent' }}>{currentData.text}</span>
          )}
        </div>
      </div>

      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={isPlaying ? stopAudio : playAudio}
            style={{
              background: isPlaying ? '#ef4444' : '#3b82f6',
              color: 'white', border: 'none', borderRadius: '24px',
              padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontWeight: 'bold', fontSize: 'clamp(14px, 2vw, 18px)',
              cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {isPlaying ? <SvgIcons.Pause /> : <SvgIcons.Play />}
            {isPlaying ? 'PLAYING...' : (hasPlayed ? 'PLAY AGAIN' : 'PLAY EXPLANATION')}
          </button>
          
          {currentClue < clues.length ? (
             <button 
               onClick={() => setCurrentClue(currentClue + 1)}
               style={{
                 background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '24px',
                 padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)', fontWeight: 'bold', fontSize: 'clamp(14px, 2vw, 18px)',
                 cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
               }}
             >
               NEXT CLUE →
             </button>
          ) : (
             <div style={{
                 background: '#10b981', color: 'white', borderRadius: '24px',
                 padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)', fontWeight: 'bold', fontSize: 'clamp(14px, 2vw, 18px)',

                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
               }}>
               INVESTIGATION COMPLETE! <SvgIcons.Check />
             </div>
          )}
        </div>
        {timelineNode}
      </div>
    </div>
  );
};

export default function InvestigationHandbook({ highestUnlockedIndex = 0, currentFlowIndex = 0, stageCompleted = false, onNext, onComplete }) {
  const handleProceed = onNext || onComplete;

  // Determine which barrier we are in
  // currentFlowIndex 13 is Mission 3. index >= 13 is Barrier 3.
  const isBarrier3 = currentFlowIndex >= 13;
  const isBarrier2 = currentFlowIndex >= 5 && currentFlowIndex < 13;

  // Barrier 1 logic
  const isPhase1Done = highestUnlockedIndex > 1 || (currentFlowIndex === 1 && stageCompleted);
  const isPhase2Done = highestUnlockedIndex > 2 || (currentFlowIndex === 2 && stageCompleted);

  // Barrier 2 logic
  const isB2Phase1Done = highestUnlockedIndex > 6 || (currentFlowIndex === 6 && stageCompleted);
  const isB2Phase2Done = highestUnlockedIndex > 7 || (currentFlowIndex === 7 && stageCompleted);
  const isB2Phase3Done = highestUnlockedIndex > 8 || (currentFlowIndex === 8 && stageCompleted);
  const isB2Phase4Done = highestUnlockedIndex > 9 || (currentFlowIndex === 9 && stageCompleted);
  const isB2Phase5Done = highestUnlockedIndex > 10 || (currentFlowIndex === 10 && stageCompleted);

  // Barrier 3 logic
  const isB3Phase1Done = highestUnlockedIndex > 14 || (currentFlowIndex === 14 && stageCompleted);
  const isB3Phase2Done = highestUnlockedIndex > 15 || (currentFlowIndex === 15 && stageCompleted);
  const isB3Phase3Done = highestUnlockedIndex > 17 || (currentFlowIndex === 17 && stageCompleted);
  const isB3Phase4Done = highestUnlockedIndex > 19 || (currentFlowIndex === 19 && stageCompleted);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: 0,
      boxSizing: 'border-box',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 12px 36px rgba(0,0,0,0.14)',
      display: 'flex',
      flexDirection: 'column',
      border: '8px solid #1b2a4a',
      position: 'relative',
      fontFamily: 'Arial, Helvetica, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Central Book Spine Divider */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: '56px',
        left: '50%',
        width: '1px',
        background: '#e2e8f0',
        zIndex: 5,
        pointerEvents: 'none'
      }} />

      {/* TWO PAGES SPREAD CONTAINER */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden'
      }}>
        {!isBarrier2 && !isBarrier3 ? (
          // ================= BARRIER 1 TWO-PAGE SPREAD =================
          <>
            {/* ================= LEFT PAGE (PAGE 1) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderRight: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1b2a4a', fontWeight: 'bold', borderBottom: '4px solid #3b4ea0', paddingBottom: '8px', display: 'inline-block' }}>
                What are Objects Made Of?
              </h2>

              <div style={{ fontSize: '28px', color: '#334155', lineHeight: '1.6', marginBottom: '12px', fontWeight: '500' }}>
                <p style={{ margin: '0 0 8px 0' }}>Look around you! You can see many things - a chair, a book, a water bottle, a pencil and so on.</p>
                <p style={{ margin: '0' }}>These are all <strong style={{ color: '#1b2a4a', fontWeight: '800' }}>objects</strong>. Even though they look different, each object is made of some <strong style={{ color: '#1b2a4a', fontWeight: '800' }}>material</strong>.</p>
              </div>

              <div style={{ border: '1px dashed #94a3b8', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: 'var(--text-xl)', color: '#1e293b', marginBottom: '8px' }}><strong style={{ color: '#1b2a4a' }}>Material:</strong> The substance used to make an object.</div>
                <div style={{ fontSize: 'var(--text-xl)', color: '#1e293b' }}><strong style={{ color: '#1b2a4a' }}>Object:</strong> Anything we can see or use around us.</div>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#d97706', fontSize: 'var(--text-xl)' }}>Examples:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xl)', color: '#451a03' }}>
                  <div>Chair can be made of wood, plastic or steel.</div>
                  <div>A plate can be made of steel, glass or plastic.</div>
                  <div>A bottle can be made of plastic, glass or steel.</div>
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 'var(--text-xl)', color: '#1e3a8a', lineHeight: '1.4' }}>
                  <strong>Think!</strong> One object can be made from different materials. One material can be used to make many different objects.
                </div>
              </div>
            </div>

            {/* ================= RIGHT PAGE (PAGE 2) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1b2a4a', fontWeight: 'bold', borderBottom: '4px solid #3b4ea0', paddingBottom: '8px', display: 'inline-block' }}>
                Historical Spotlight: Pottery
              </h2>

              <PotterySpotlight />
            </div>
          </>
        ) : isBarrier2 ? (
          // ================= BARRIER 2 TWO-PAGE SPREAD =================
          <>
            {/* ================= LEFT PAGE B2 (PAGE 1) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'hidden', borderRight: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 'calc(var(--text-2xl) * 1.25)', color: '#1e3a8a', fontWeight: 'bold', borderBottom: '4px solid #3b82f6', paddingBottom: '6px', display: 'inline-block' }}>
                How Can We Group Objects?
              </h2>

              <div style={{ fontSize: '28px', color: '#334155', lineHeight: '1.6', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 16px 0', fontSize: '28px', lineHeight: '1.6' }}>We see many objects around us, such as books, bottles, spoons and toys.</p>
                <p style={{ margin: '0 0 16px 0', fontSize: '28px', lineHeight: '1.6' }}>Objects can be grouped based on a common property, such as material, colour, shape or hardness.</p>
                <p style={{ margin: '0 0 16px 0', fontSize: '28px', lineHeight: '1.6' }}>This process is called classification.</p>
                <p style={{ margin: '0', fontSize: '28px', lineHeight: '1.6' }}>The same object can belong to different groups depending on the property we choose.</p>
              </div>

              <div style={{ marginTop: '6px', background: '#eff6ff', border: '2px dashed #bfdbfe', borderRadius: '12px', padding: '12px 18px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 'calc(var(--text-xl) * 1.3)' }}>💡</div>
                <div style={{ fontSize: 'calc(var(--text-lg) * 1.3)', color: '#1e3a8a', lineHeight: '1.35' }}>
                  <strong>Remember</strong><br/>
                  Classification means grouping objects based on a common property.
                </div>
              </div>
            </div>

            {/* ================= RIGHT PAGE B2 (PAGE 2) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '20px 28px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: 'calc(var(--text-2xl) * 1.15)', color: '#1e3a8a', fontWeight: 'bold' }}>
                Case File 02: Scientific Classification
              </h2>

              <div style={{ fontSize: '26px', color: '#334155', lineHeight: '1.55', marginBottom: '22px' }}>
                <p style={{ margin: '0 0 14px 0', fontSize: '26px', lineHeight: '1.55' }}>Your next case is ready!</p>
                <p style={{ margin: '0 0 14px 0', fontSize: '26px', lineHeight: '1.55' }}>Observe each object and identify the material it is made of.</p>
                <p style={{ margin: '0', fontSize: '26px', lineHeight: '1.55' }}>Then place each object into the correct material group.</p>
              </div>

              <div style={{ border: '2px solid #10b981', borderRadius: '12px', padding: '12px 18px', background: '#f0fdf4', display: 'flex', position: 'relative' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#047857', fontSize: 'calc(var(--text-lg) * 1.22)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    🎯 MISSION
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', fontWeight: '600' }}>
                      <input type="checkbox" checked={true} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '3px' }} />
                      <span>Read the Handbook</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', fontWeight: '600' }}>
                      <input type="checkbox" checked={isB2Phase1Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '3px' }} />
                      <span>Organize objects by purpose</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', fontWeight: '600' }}>
                      <input type="checkbox" checked={isB2Phase2Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '3px' }} />
                      <span>Group objects by material</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', lineHeight: '1.4' }}>
                      <input type="checkbox" checked={isB2Phase3Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '3px' }} />
                      <span>
                        <strong style={{ display: 'block', fontWeight: '600', color: '#064e3b' }}>Multi-Property Insights</strong>
                        <span style={{ fontSize: 'calc(var(--text-base) * 1.18)', color: '#047857', display: 'block', marginTop: '2px', lineHeight: '1.35' }}>
                          Inspect how the same objects fit into different groups depending on the property we look at.
                        </span>
                      </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', lineHeight: '1.4' }}>
                      <input type="checkbox" checked={isB2Phase4Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '3px' }} />
                      <span>
                        <strong style={{ display: 'block', fontWeight: '600', color: '#064e3b' }}>Activity 6.3: Material Suitability</strong>
                        <span style={{ fontSize: 'calc(var(--text-base) * 1.18)', color: '#047857', display: 'block', marginTop: '2px', lineHeight: '1.35' }}>
                          We choose materials based on their properties and the purpose of the object.
                        </span>
                      </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', lineHeight: '1.4' }}>
                      <input type="checkbox" checked={isB2Phase5Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '3px' }} />
                      <span>
                        <strong style={{ display: 'block', fontWeight: '600', color: '#064e3b' }}>Investigation: Sports Equipment Properties</strong>
                        <span style={{ fontSize: 'calc(var(--text-base) * 1.18)', color: '#047857', display: 'block', marginTop: '2px', lineHeight: '1.35' }}>
                          Click each ball to analyze its properties and discover how its material matches its purpose.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // ================= BARRIER 3 TWO-PAGE SPREAD =================
          <>
            {/* ================= LEFT PAGE B3 (PAGE 1) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderRight: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1e3a8a', fontWeight: 'bold', borderBottom: '4px solid #3b82f6', paddingBottom: '8px', display: 'inline-block' }}>
                Choosing the Right Material
              </h2>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '24px', borderRadius: '12px', marginBottom: '24px', position: 'relative' }}>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ width: 'clamp(84px, 12vw, 180px)', height: 'clamp(84px, 12vw, 180px)', zIndex: 2 }} />
                <div style={{ position: 'absolute', display: 'flex', gap: '40px', bottom: '20px' }}>
                   <div style={{ fontSize: 'var(--text-2xl)', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>🖋️</div>
                   <div style={{ fontSize: 'var(--text-2xl)', marginLeft: '90px', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>✒️</div>
                </div>
              </div>

              <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
                <p style={{ margin: '0 0 16px 0' }}>Different objects are made for different purposes.</p>
                <p style={{ margin: '0 0 16px 0' }}>The material used to make an object depends on its <strong style={{ color: '#1e3a8a' }}>properties</strong> and how the object will be used.</p>
                <p style={{ margin: '0 0 16px 0' }}>For example, a pen is made of different materials such as plastic, metal and ink. Each material is chosen because it performs a specific job.</p>
                <p style={{ margin: '0' }}>Choosing the right material helps us make objects that are <strong style={{ color: '#1e3a8a' }}>safe</strong>, <strong style={{ color: '#1e3a8a' }}>useful</strong> and <strong style={{ color: '#1e3a8a' }}>long-lasting</strong>.</p>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 'var(--text-xl)' }}>💡</div>
                <div style={{ fontSize: 'var(--text-xl)', color: '#b45309', lineHeight: '1.4' }}>
                  <strong>Remember</strong><br/>
                  The properties of a material help us decide where and how it should be used.
                </div>
              </div>
            </div>

            {/* ================= RIGHT PAGE B3 (PAGE 2) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1e3a8a', fontWeight: 'bold' }}>
                Case File 03: Choosing the Right Material
              </h2>

              <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
                <p style={{ margin: '0 0 16px 0' }}>As a Science Detective, your next challenge is to decide which material is the <strong style={{ color: '#16a34a' }}>best choice</strong> for making an object.</p>
                <p style={{ margin: '0' }}>Sometimes an object can be made from different materials, but only some materials are <strong style={{ color: '#3b82f6' }}>suitable</strong> for its purpose.</p>
              </div>

              <div style={{ border: '2px dashed #c4b5fd', borderRadius: '12px', padding: '16px', marginBottom: '16px', background: '#f5f3ff', position: 'relative' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#6d28d9', fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🧠 Think Like a Scientist
                </h4>
                <p style={{ margin: '0 0 12px 0', fontSize: 'var(--text-xl)', color: '#334155' }}>Before making a choice, ask yourself:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xl)', color: '#334155' }}>
                  <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#6d28d9', fontWeight: 'bold' }}>✔</span> Is this material strong enough?</div>
                  <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#6d28d9', fontWeight: 'bold' }}>✔</span> Is it safe to use?</div>
                  <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#6d28d9', fontWeight: 'bold' }}>✔</span> Will it work well for this purpose?</div>
                </div>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ position: 'absolute', bottom: '10px', right: '10px', width: 'clamp(56px, 8vw, 120px)', height: 'clamp(56px, 8vw, 120px)' }} />
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#d97706', fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⭐ Example
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-xl)', color: '#451a03' }}>
                    A shopping bag can be made from cloth or paper, but each material is suitable for different situations.
                  </p>
                </div>
                <div style={{ fontSize: 'var(--text-3xl)', display: 'flex', gap: '8px' }}>🛍️ 🛍️</div>
              </div>

              <div style={{ border: '2px solid #10b981', borderRadius: '12px', padding: '16px', background: '#f0fdf4', display: 'flex', position: 'relative' }}>
                <div style={{ flex: 1, paddingRight: '80px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#047857', fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🎯 MISSION
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                      <input type="checkbox" checked={true} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                      Read the Handbook
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                      <input type="checkbox" checked={isB3Phase1Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                      Observe carefully.
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                      <input type="checkbox" checked={isB3Phase2Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                      Compare different materials.
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                      <input type="checkbox" checked={isB3Phase3Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                      Think about their properties.
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                      <input type="checkbox" checked={isB3Phase4Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                      Find the most suitable material for each object.
                    </label>
                  </div>
                </div>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ position: 'absolute', bottom: '10px', right: '10px', width: 'clamp(56px, 8vw, 120px)', height: 'clamp(56px, 8vw, 120px)' }} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* FOOTER BAR WITH BOTTOM-RIGHT NEXT BUTTON */}
      <div style={{
        height: '56px',
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 10
      }}>
        <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📖</span> Investigation Handbook
        </div>
      </div>
    </div>
  );
}
