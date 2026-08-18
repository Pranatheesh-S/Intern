const fs = require('fs');

const file = 'src/science/class6/chapter6/MaterialsAroundUs/components/Educational/InvestigationHandbook.jsx';
const content = fs.readFileSync(file, 'utf8');

const exportIndex = content.indexOf('export default function InvestigationHandbook');
if (exportIndex === -1) {
  console.error('Could not find export default function InvestigationHandbook');
  process.exit(1);
}

const newContent = `import React, { useState, useEffect } from 'react';

const SvgIcons = {
  MagnifyingGlass: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Play: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  ),
  Pause: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  ),
  Check: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  SoilLayer: ({ revealed }) => (
    <svg width="120" height="80" viewBox="0 0 120 80" className="excavation-layer" style={{ overflow: 'visible' }}>
      {/* Background/Base soil */}
      <path d="M 10 50 Q 60 70 110 50 L 110 80 L 10 80 Z" fill="#78350f" />
      {/* The buried pot fragment */}
      <path d="M 45 60 Q 60 75 75 60 L 65 40 Q 55 45 45 60 Z" fill="#d97706" stroke="#92400e" strokeWidth="2" style={{ transition: 'transform 1.5s', transform: revealed ? 'translateY(-20px)' : 'translateY(0)' }} />
      {/* Top covering soil */}
      <path d="M 0 40 Q 60 55 120 40 L 120 65 Q 60 75 0 65 Z" fill="#92400e" style={{ transition: 'transform 1.5s, opacity 1.5s', transform: revealed ? 'translateY(30px)' : 'translateY(0)', opacity: revealed ? 0 : 1 }} />
      {/* Grass/Surface */}
      <path d="M 0 40 Q 60 55 120 40 L 120 30 Q 60 45 0 30 Z" fill="#4ade80" style={{ transition: 'opacity 1s', opacity: revealed ? 0 : 1 }} />
    </svg>
  ),
  Clay: ({ stage }) => (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {/* stage 0: lump, stage 1: taller, stage 2: pot shape */}
      <path d={
        stage === 0 ? "M 20 80 Q 50 60 80 80 Q 70 95 30 95 Z" :
        stage === 1 ? "M 30 50 Q 50 20 70 50 Q 80 90 20 90 Z" :
        "M 30 20 C 30 10, 70 10, 70 20 L 75 40 C 95 60, 85 90, 70 90 C 50 95, 30 90, 30 90 C 15 90, 5 60, 25 40 Z"
      } fill="#d97706" stroke="#92400e" strokeWidth="2" style={{ transition: 'd 1.5s ease-in-out' }} />
      <path d={
        stage === 2 ? "M 25 40 Q 50 50 75 40" : "M 20 80 Q 50 80 80 80"
      } fill="none" stroke="#92400e" strokeWidth="2" style={{ transition: 'd 1.5s ease-in-out, opacity 1.5s', opacity: stage === 2 ? 1 : 0 }} />
    </svg>
  ),
  Pot: ({ decorated, color = "#d97706", className }) => (
    <svg width="80" height="100" viewBox="0 0 80 100" fill={color} stroke="#92400e" strokeWidth="2" className={className}>
      <path d="M 30 10 C 30 5, 50 5, 50 10 L 55 20 C 70 30, 80 50, 70 80 C 60 100, 20 100, 10 80 C 0 50, 10 30, 25 20 Z" />
      <path d="M 25 20 Q 40 25 55 20" fill="none" />
      <g style={{ transition: 'opacity 1s ease-in-out', opacity: decorated ? 1 : 0 }}>
        <path d="M 10 50 Q 40 60 70 50" fill="none" stroke="#78350f" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M 15 70 Q 40 80 65 70" fill="none" stroke="#78350f" strokeWidth="2" />
        <circle cx="30" cy="65" r="3" fill="#78350f" />
        <circle cx="50" cy="65" r="3" fill="#78350f" />
        <path d="M 20 40 L 30 30 L 40 40 L 50 30 L 60 40" fill="none" stroke="#78350f" strokeWidth="2" />
      </g>
    </svg>
  ),
  Wheel: ({ rotating }) => (
    <svg width="120" height="60" viewBox="0 0 120 60" className={rotating ? 'rotating-wheel' : ''}>
      <ellipse cx="60" cy="20" rx="55" ry="15" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
      <path d="M 45 20 L 45 50 L 75 50 L 75 20" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
      <path d="M 30 50 L 90 50 L 90 60 L 30 60 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
      <ellipse cx="60" cy="20" rx="45" ry="10" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
    </svg>
  ),
  Kiln: ({ baking }) => (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <path d="M 10 100 L 10 50 Q 50 0 90 50 L 90 100 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      <path d="M 30 100 L 30 60 Q 50 40 70 60 L 70 100 Z" fill="#451a03" />
      <g style={{ transition: 'opacity 0.5s', opacity: baking ? 1 : 0 }}>
        <path d="M 40 90 Q 50 70 60 90" fill="#ef4444" />
        <path d="M 45 95 Q 50 80 55 95" fill="#f59e0b" />
      </g>
    </svg>
  )
};

const Clue1 = ({ page1Layout, onRevealDone }) => {
  const [phase, setPhase] = useState(0); // 0=init, 1=animating, 2=discovered

  const handleInvestigate = () => {
    setPhase(1);
    setTimeout(() => {
      setPhase(2);
      onRevealDone();
    }, 1500); // 1.5s for soil layer to move
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
      <div style={{ position: 'relative', width: '120px', height: '100px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <SvgIcons.SoilLayer revealed={phase > 0} />
        {phase === 2 && (
          <div style={{ position: 'absolute', top: -10, left: 20, right: 20, bottom: 20, border: '2px dashed #3b82f6', borderRadius: '12px', animation: 'fadeIn 0.5s ease-in' }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: '200px', textAlign: 'left' }}>
        {phase === 0 ? (
          <button
            onClick={handleInvestigate}
            style={{ background: '#1b2a4a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: 'var(--text-lg)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <SvgIcons.MagnifyingGlass /> INVESTIGATE
          </button>
        ) : (
          <div style={{ animation: 'fadeIn 0.5s ease-in', opacity: phase === 2 ? 1 : 0, transition: 'opacity 0.5s' }}>
            <div style={{ fontSize: page1Layout ? 'var(--text-3xl)' : 'var(--text-2xl)', color: '#b45309', fontWeight: 'bold', background: '#fef3c7', display: 'inline-block', padding: '8px 16px', borderRadius: '12px', border: '2px solid #f59e0b', marginBottom: '12px' }}>
              7,000–8,000 YEARS
            </div>
            {phase === 2 && (
              <p style={{ margin: 0, fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', color: '#334155', animation: 'fadeIn 0.5s ease-in' }}>
                Some of the earliest pottery in the Indian subcontinent dates back this far.
                <br/><span style={{ color: '#64748b', fontSize: '0.9em' }}>(Found in places like Lahuradewa and Mehrgarh)</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Clue2 = ({ page1Layout, onRevealDone }) => {
  const [phase, setPhase] = useState(0); // 0=init, 1=spinning, 2=shaping, 3=done

  const handleStart = () => {
    setPhase(1);
    setTimeout(() => setPhase(2), 1000);
    setTimeout(() => {
      setPhase(3);
      onRevealDone();
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
      <div style={{ position: 'relative', width: '120px', height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', bottom: '0px' }}>
          <SvgIcons.Wheel rotating={phase > 0 && phase < 3} />
        </div>
        <div style={{ position: 'absolute', bottom: '15px' }}>
           <SvgIcons.Clay stage={phase === 0 ? 0 : phase === 1 ? 1 : 2} />
        </div>
      </div>

      <div style={{ flex: 1, minWidth: '200px', textAlign: 'left' }}>
        {phase === 0 ? (
          <button
            onClick={handleStart}
            style={{ background: '#1b2a4a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: 'var(--text-lg)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <SvgIcons.Play /> START
          </button>
        ) : (
          <div style={{ animation: 'fadeIn 0.5s ease-in', opacity: phase === 3 ? 1 : 0, transition: 'opacity 0.5s' }}>
            <div style={{ fontSize: page1Layout ? 'var(--text-3xl)' : 'var(--text-2xl)', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '12px' }}>
              WHEEL-TURNED POTTERY
            </div>
            {phase === 3 && (
              <p style={{ margin: 0, fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', color: '#334155', animation: 'fadeIn 0.5s ease-in' }}>
                Around 4000 BCE, people developed clever ways to quickly shape clay using a rotating wheel.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Clue3 = ({ page1Layout, onRevealDone }) => {
  const [phase, setPhase] = useState(0);

  const handleExamine = () => {
    setPhase(1);
    setTimeout(() => {
      setPhase(2);
      onRevealDone();
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
      <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <SvgIcons.Pot decorated={phase > 0} color="#fcd34d" />
      </div>

      <div style={{ flex: 1, minWidth: '200px', textAlign: 'left' }}>
        {phase === 0 ? (
          <button
            onClick={handleExamine}
            style={{ background: '#1b2a4a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: 'var(--text-lg)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <SvgIcons.MagnifyingGlass /> EXAMINE POT
          </button>
        ) : (
          <div style={{ animation: 'fadeIn 0.5s ease-in', opacity: phase === 2 ? 1 : 0, transition: 'opacity 0.5s' }}>
            <div style={{ fontSize: page1Layout ? 'var(--text-3xl)' : 'var(--text-2xl)', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '12px' }}>
              ANCIENT POTTERY WAS DECORATED
            </div>
            {phase === 2 && (
              <p style={{ margin: 0, fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', color: '#334155', animation: 'fadeIn 0.5s ease-in' }}>
                Harappan pottery was decorated with colourful designs, geometric patterns, and pictures of animals.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Clue4 = ({ page1Layout, onRevealDone }) => {
  const [step, setStep] = useState(1); // 1 to 6
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    { label: 'CLEAN CLAY', nextAction: 'CLEAN CLAY' }, // 1
    { label: 'KNEAD THE CLAY', nextAction: 'KNEAD' },  // 2
    { label: 'SHAPE THE CLAY', nextAction: 'SHAPE' },  // 3
    { label: 'TURN THE WHEEL', nextAction: 'TURN THE WHEEL' }, // 4
    { label: 'BAKE THE POT', nextAction: 'BAKE' }, // 5
    { label: 'TERRACOTTA', nextAction: null } // 6
  ];

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setStep(s => {
        const next = s + 1;
        if (next === 6) onRevealDone();
        return next;
      });
    }, 1500);
  };

  const currentStepInfo = steps[step - 1];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px solid #e2e8f0', padding: '10px' }}>
        {step === 1 && <SvgIcons.Clay stage={isAnimating ? 1 : 0} />}
        {step === 2 && <div className={isAnimating ? "kneading-anim" : ""}><SvgIcons.Clay stage={0} /></div>}
        {step === 3 && <SvgIcons.Clay stage={isAnimating ? 2 : 1} />}
        {step === 4 && <div style={{position: 'relative'}}><SvgIcons.Wheel rotating={isAnimating} /><div style={{position: 'absolute', bottom: '15px', left: '10px'}}><SvgIcons.Clay stage={2} /></div></div>}
        {step === 5 && <div style={{position: 'relative'}}><SvgIcons.Kiln baking={isAnimating} />{isAnimating && <div style={{position: 'absolute', bottom: '20px', left: '35px', transform: 'scale(0.3)'}}><SvgIcons.Clay stage={2} /></div>}</div>}
        {step === 6 && <SvgIcons.Pot />}
      </div>

      <div style={{ flex: 1, minWidth: '200px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
          {[1,2,3,4,5].map(i => (
            <React.Fragment key={i}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: step >= i ? '#3b82f6' : '#cbd5e1' }} />
              {i < 5 && <div style={{ height: '2px', flex: 1, background: step > i ? '#3b82f6' : '#cbd5e1' }} />}
            </React.Fragment>
          ))}
          <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>STEP {Math.min(step, 5)} / 5</span>
        </div>

        <div style={{ fontSize: page1Layout ? 'var(--text-2xl)' : 'var(--text-xl)', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '16px' }}>
          {currentStepInfo.label}
        </div>

        {step < 6 ? (
          <button
            onClick={handleNext}
            disabled={isAnimating}
            style={{ background: isAnimating ? '#94a3b8' : '#1b2a4a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: 'var(--text-base)', fontWeight: 'bold', cursor: isAnimating ? 'not-allowed' : 'pointer' }}
          >
            {isAnimating ? 'PROCESSING...' : \`[ \${currentStepInfo.nextAction} ]\`}
          </button>
        ) : (
          <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
            <p style={{ margin: 0, fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', color: '#334155' }}>
              Baked clay is called terracotta. The clay was carefully prepared, shaped, and baked in a kiln to make it strong!
            </p>
          </div>
        )}
      </div>
      <style>{\`
        .kneading-anim { animation: knead 1.5s ease-in-out; }
        @keyframes knead {
          0% { transform: scaleY(1); }
          25% { transform: scaleY(0.7) scaleX(1.1); }
          50% { transform: scaleY(1); }
          75% { transform: scaleY(0.7) scaleX(1.1); }
          100% { transform: scaleY(1); }
        }
      \`}</style>
    </div>
  );
};

const Clue5 = ({ page1Layout, onRevealDone }) => {
  const [revealed, setRevealed] = useState({ pot: false, jar: false, container: false });

  const allRevealed = revealed.pot && revealed.jar && revealed.container;

  useEffect(() => {
    if (allRevealed) {
      setTimeout(onRevealDone, 500);
    }
  }, [allRevealed, onRevealDone]);

  const Item = ({ id, label, UseLabel, SvgComponent }) => {
    const isRevealed = revealed[id];
    return (
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: !isRevealed ? 'pointer' : 'default', flex: 1, minWidth: '100px' }} 
        onClick={() => !isRevealed && setRevealed(r => ({ ...r, [id]: true }))}
      >
        <div style={{ 
          background: isRevealed ? '#f0fdf4' : 'white', 
          padding: '16px', borderRadius: '12px', 
          border: isRevealed ? '2px solid #22c55e' : '2px dashed #cbd5e1', 
          transition: 'all 0.3s',
          transform: isRevealed ? 'translateY(-10px)' : 'translateY(0)',
          boxShadow: isRevealed ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
        }}>
           <SvgComponent color={isRevealed ? "#f59e0b" : "#94a3b8"} />
        </div>
        {isRevealed ? (
          <div style={{ marginTop: '12px', fontWeight: 'bold', color: '#15803d', animation: 'fadeIn 0.3s', textAlign: 'center' }}>{UseLabel}</div>
        ) : (
           <div style={{ marginTop: '12px', fontWeight: 'bold', color: '#64748b', textAlign: 'center' }}>{label}</div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Item id="pot" label="POT" UseLabel="COOKING" SvgComponent={SvgIcons.Pot} />
        <Item id="jar" label="STORAGE JAR" UseLabel="STORING FOOD GRAINS" SvgComponent={(p) => <SvgIcons.Pot {...p} className="wider-pot" />} />
        <Item id="container" label="CONTAINER" UseLabel="STORING OIL / GHEE" SvgComponent={(p) => <SvgIcons.Pot {...p} decorated />} />
      </div>

      <div style={{ minHeight: '60px' }}>
        {allRevealed && (
          <div style={{ animation: 'fadeIn 0.5s ease-in', textAlign: 'center', background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
             <p style={{ margin: 0, fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', color: '#334155' }}>
              <strong>ALL USES INVESTIGATED!</strong><br/>
              People used pottery items for everyday needs. You can still see ancient jars at the National Museum in New Delhi.
            </p>
          </div>
        )}
      </div>
      <style>{\`
        .wider-pot { transform: scaleX(1.2); transform-origin: center bottom; }
      \`}</style>
    </div>
  );
};

const PotterySpotlight = ({ page1Layout }) => {
  const [clueIndex, setClueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clueRevealed, setClueRevealed] = useState(false);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsPlaying(false);
    setClueRevealed(false);
  }, [clueIndex]);

  const handleSpeak = (text) => {
    if (!window.speechSynthesis) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const cleanText = text.replace(/<[^>]+>/g, '').replace(/[\\r\\n]+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    // Attempt Indian English voice
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India'));
    if (indianVoice) utterance.voice = indianVoice;
    utterance.rate = 0.9; // Moderate speed

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const clues = [
    {
      title: "HOW OLD IS POTTERY?",
      content: "Pottery is very old. Some of the earliest pottery in the Indian subcontinent dates back to 7,000 to 8,000 years. It was found in places like Lahuradewa and Mehrgarh.",
      component: Clue1
    },
    {
      title: "HOW WAS POTTERY SHAPED?",
      content: "Around 4000 BCE, people developed clever ways to quickly shape clay using a rotating wheel. This is called wheel-turned pottery.",
      component: Clue2
    },
    {
      title: "HOW WAS POTTERY DECORATED?",
      content: "Ancient pottery from the Sindhu-Sarasvati or Harappan Civilisation was decorated with colourful designs, geometric patterns, and pictures of animals.",
      component: Clue3
    },
    {
      title: "HOW IS A POT MADE?",
      content: "The clay used for making pots was carefully prepared. It was cleaned, kneaded, shaped on a wheel, and baked in a kiln to make strong terracotta.",
      component: Clue4
    },
    {
      title: "HOW WAS POTTERY USED?",
      content: "People used pots and other pottery items for everyday needs such as cooking, or storing food grains, oil, and ghee. You can see these ancient storage jars at the National Museum in New Delhi.",
      component: Clue5
    }
  ];

  if (clueIndex === -1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, background: '#fdf6e3', border: '2px dashed #eab308', borderRadius: '10px', padding: '24px', textAlign: 'center' }}>
        <div style={{ marginBottom: '16px' }}>
          <SvgIcons.Pot />
        </div>
        <h3 style={{ color: '#1b2a4a', margin: '0 0 16px 0', fontSize: page1Layout ? 'var(--text-2xl)' : 'var(--text-xl)', fontWeight: 'bold' }}>ANCIENT POTTERY</h3>
        <p style={{ color: '#451a03', marginBottom: '32px', lineHeight: '1.6', fontSize: page1Layout ? 'var(--text-xl)' : 'var(--text-lg)', maxWidth: '80%' }}>
          Pottery can reveal clues about how people lived and the technology they used.
        </p>
        <button 
          onClick={() => setClueIndex(0)}
          style={{ background: '#1b2a4a', color: 'white', border: '2px solid #1b2a4a', padding: '16px 32px', borderRadius: '32px', fontSize: page1Layout ? 'var(--text-xl)' : 'var(--text-lg)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}
        >
          <SvgIcons.MagnifyingGlass /> INVESTIGATE THE CLUES
        </button>
      </div>
    );
  }

  if (clueIndex >= clues.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '10px', padding: '32px', textAlign: 'center' }}>
        <h3 style={{ color: '#1e293b', margin: '0 0 16px 0', fontSize: page1Layout ? 'var(--text-2xl)' : 'var(--text-xl)', fontWeight: 'bold' }}>INVESTIGATION COMPLETE</h3>
        <div style={{ marginBottom: '16px' }}>
          <SvgIcons.Pot decorated />
        </div>
        <p style={{ color: '#334155', marginBottom: '32px', lineHeight: '1.6', fontSize: page1Layout ? 'var(--text-xl)' : 'var(--text-lg)', maxWidth: '90%' }}>
          All pottery clues have been uncovered.
          <br/><br/>
          Pottery can tell us about the materials, skills and everyday life of people in the past.
        </p>
        <button 
          onClick={() => setClueIndex(-1)}
          style={{ background: 'white', color: '#1e293b', border: '2px solid #1e293b', padding: '12px 32px', borderRadius: '24px', fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}
        >
          REVISIT CLUES
        </button>
      </div>
    );
  }

  const currentClue = clues[clueIndex];
  const ClueComponent = currentClue.component;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ background: '#1b2a4a', color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', letterSpacing: '1px' }}>
          <SvgIcons.MagnifyingGlass /> CASE CLUE 0{clueIndex + 1}
        </div>
        <div style={{ fontSize: page1Layout ? 'var(--text-base)' : 'var(--text-sm)', color: '#94a3b8', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          CLUE {clueIndex + 1} / {clues.length}
          {clueRevealed && <SvgIcons.Check />}
        </div>
      </div>
      
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: isPlaying ? '#2563eb' : '#1e293b', margin: '0 0 20px 0', fontSize: page1Layout ? 'var(--text-2xl)' : 'var(--text-xl)', borderBottom: '3px solid #e2e8f0', paddingBottom: '12px', fontWeight: 'bold', transition: 'color 0.3s' }}>
          {currentClue.title}
        </h3>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <ClueComponent page1Layout={page1Layout} onRevealDone={() => setClueRevealed(true)} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '2px dashed #cbd5e1', minHeight: '50px' }}>
          {clueRevealed ? (
            <button 
              onClick={() => handleSpeak(currentClue.content)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isPlaying ? '#dbeafe' : '#eff6ff', border: '2px solid #bfdbfe', color: '#1e40af', cursor: 'pointer', fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', fontWeight: 'bold', padding: '10px 20px', borderRadius: '24px', animation: 'fadeIn 0.5s', transition: 'all 0.3s' }}
            >
              {isPlaying ? <SvgIcons.Pause /> : <SvgIcons.Play />} {isPlaying ? 'PAUSE' : 'PLAY EXPLANATION'}
            </button>
          ) : <div />}
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {clueIndex > 0 && (
              <button 
                onClick={() => setClueIndex(c => c - 1)}
                style={{ padding: '12px 24px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', fontWeight: 'bold' }}
              >
                BACK
              </button>
            )}
            {clueRevealed && (
              <button 
                onClick={() => setClueIndex(c => c + 1)}
                style={{ padding: '12px 24px', background: '#1b2a4a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', animation: 'fadeIn 0.5s' }}
              >
                {clueIndex === clues.length - 1 ? 'CASE CLOSED' : 'NEXT CLUE'}
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{\`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rotating-wheel {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      \`}</style>
    </div>
  );
};
`

fs.writeFileSync(file, newContent + content.slice(exportIndex));
