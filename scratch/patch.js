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
  Pot: ({ decorated, color = "#d97706", className }) => (
    <svg width="80" height="100" viewBox="0 0 80 100" fill={color} stroke="#92400e" strokeWidth="2" className={className}>
      <path d="M 30 10 C 30 5, 50 5, 50 10 L 55 20 C 70 30, 80 50, 70 80 C 60 100, 20 100, 10 80 C 0 50, 10 30, 25 20 Z" />
      <path d="M 25 20 Q 40 25 55 20" fill="none" />
      {decorated && (
        <g>
          <path d="M 10 50 Q 40 60 70 50" fill="none" stroke="#78350f" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 15 70 Q 40 80 65 70" fill="none" stroke="#78350f" strokeWidth="2" />
          <circle cx="30" cy="65" r="3" fill="#78350f" />
          <circle cx="50" cy="65" r="3" fill="#78350f" />
        </g>
      )}
    </svg>
  ),
  Wheel: ({ rotating }) => (
    <svg width="100" height="80" viewBox="0 0 100 80" className={rotating ? 'rotating-wheel' : ''}>
      <ellipse cx="50" cy="25" rx="45" ry="20" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
      <path d="M 35 25 L 35 65 L 65 65 L 65 25" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
      <path d="M 20 65 L 80 65 L 80 75 L 20 75 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
      <ellipse cx="50" cy="25" rx="35" ry="12" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
    </svg>
  )
};

const Clue1 = ({ page1Layout }) => {
  const [investigated, setInvestigated] = useState(false);
  return (
    <div style={{ textAlign: 'center', marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
           <SvgIcons.Pot />
           {investigated && (
             <div style={{ position: 'absolute', top: -10, left: -10, right: -10, bottom: -10, border: '2px dashed #3b82f6', borderRadius: '12px', animation: 'fadeIn 0.5s ease-in' }} />
           )}
        </div>
      </div>
      {!investigated ? (
        <button 
          onClick={() => setInvestigated(true)}
          style={{ background: '#1b2a4a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: 'var(--text-lg)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
        >
          <SvgIcons.MagnifyingGlass /> INVESTIGATE
        </button>
      ) : (
        <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
          <div style={{ fontSize: page1Layout ? 'var(--text-4xl)' : 'var(--text-3xl)', color: '#b45309', fontWeight: 'bold', background: '#fef3c7', display: 'inline-block', padding: '12px 24px', borderRadius: '12px', border: '3px solid #f59e0b', boxShadow: '0 6px 12px rgba(0,0,0,0.1)' }}>
            7,000–8,000 YEARS
          </div>
          <p style={{ margin: '16px 0 0 0', fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', color: '#334155' }}>
            Some of the earliest pottery in the Indian subcontinent dates back this far.
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: page1Layout ? 'var(--text-base)' : 'var(--text-sm)', color: '#64748b' }}>
            (Found in places like Lahuradewa and Mehrgarh)
          </p>
        </div>
      )}
    </div>
  );
};

const Clue2 = ({ page1Layout }) => {
  const [started, setStarted] = useState(false);
  return (
    <div style={{ textAlign: 'center', marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', position: 'relative', height: '120px', alignItems: 'flex-end' }}>
        <div style={{ position: 'absolute', bottom: '20px' }}>
          <SvgIcons.Wheel rotating={started} />
        </div>
        {started && (
          <div style={{ position: 'absolute', bottom: '40px', animation: 'growPot 2s forwards' }}>
             <SvgIcons.Pot color="#d97706" />
          </div>
        )}
      </div>
      {!started ? (
        <button 
          onClick={() => setStarted(true)}
          style={{ background: '#1b2a4a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: 'var(--text-lg)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
        >
          START THE WHEEL
        </button>
      ) : (
        <div style={{ animation: 'fadeIn 0.5s ease-in', animationDelay: '2s', opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ fontSize: page1Layout ? 'var(--text-3xl)' : 'var(--text-2xl)', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '8px' }}>
            WHEEL-TURNED POTTERY
          </div>
          <p style={{ margin: 0, fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', color: '#334155' }}>
            Around 4000 BCE, people developed clever ways to quickly shape clay using a rotating wheel.
          </p>
        </div>
      )}
    </div>
  );
};

const Clue3 = ({ page1Layout }) => {
  const [examined, setExamined] = useState(false);
  return (
    <div style={{ textAlign: 'center', marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <SvgIcons.Pot decorated={examined} />
      </div>
      {!examined ? (
        <button 
          onClick={() => setExamined(true)}
          style={{ background: '#1b2a4a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: 'var(--text-lg)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
        >
          <SvgIcons.MagnifyingGlass /> EXAMINE THE POT
        </button>
      ) : (
        <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
          <div style={{ fontSize: page1Layout ? 'var(--text-3xl)' : 'var(--text-2xl)', color: '#1e3a8a', fontWeight: 'bold', marginBottom: '8px' }}>
            ANCIENT POTTERY WAS DECORATED
          </div>
          <p style={{ margin: 0, fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', color: '#334155' }}>
            Harappan pottery was decorated with colourful designs, geometric patterns, and pictures of animals.
          </p>
        </div>
      )}
    </div>
  );
};

const Clue4 = ({ page1Layout }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { label: 'CLAY', button: 'CLEAN' },
    { label: 'CLEAN & SIEVE', button: 'KNEAD' },
    { label: 'KNEAD', button: 'SHAPE' },
    { label: 'SHAPE', button: 'SPIN THE WHEEL' },
    { label: 'WHEEL', button: 'KILN' },
    { label: 'KILN', button: 'BAKE' },
    { label: 'TERRACOTTA', button: null }
  ];

  return (
    <div style={{ textAlign: 'center', marginTop: '16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
        {steps.map((s, i) => (
          i <= step && (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>→</span>}
              <div style={{ 
                background: i === steps.length - 1 ? '#fdf6e3' : '#f1f5f9', 
                border: \`2px solid \${i === steps.length - 1 ? '#d97706' : '#cbd5e1'}\`,
                color: i === steps.length - 1 ? '#b45309' : '#334155',
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontWeight: 'bold',
                animation: 'fadeIn 0.3s ease-in'
              }}>
                {s.label}
              </div>
            </React.Fragment>
          )
        ))}
      </div>
      {step < steps.length - 1 && (
        <button 
          onClick={() => setStep(s => s + 1)}
          style={{ background: '#1b2a4a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: 'var(--text-lg)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
        >
          {steps[step].button}
        </button>
      )}
      {step === steps.length - 1 && (
        <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
          <p style={{ margin: 0, fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', color: '#334155' }}>
            Clay was carefully prepared and baked in a kiln to make strong terracotta!
          </p>
        </div>
      )}
    </div>
  );
};

const Clue5 = ({ page1Layout }) => {
  const [revealed, setRevealed] = useState({ pot: false, jar: false, container: false });

  return (
    <div style={{ textAlign: 'center', marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => setRevealed(r => ({ ...r, pot: true }))}>
          <div style={{ background: revealed.pot ? '#f0fdf4' : 'transparent', padding: '12px', borderRadius: '12px', border: revealed.pot ? '2px dashed #22c55e' : '2px dashed transparent', transition: 'all 0.3s' }}>
             <SvgIcons.Pot color="#f59e0b" />
          </div>
          {revealed.pot ? (
            <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#15803d', animation: 'fadeIn 0.3s' }}>COOKING</div>
          ) : (
             <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#94a3b8' }}>POT</div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => setRevealed(r => ({ ...r, jar: true }))}>
          <div style={{ background: revealed.jar ? '#f0fdf4' : 'transparent', padding: '12px', borderRadius: '12px', border: revealed.jar ? '2px dashed #22c55e' : '2px dashed transparent', transition: 'all 0.3s' }}>
             <SvgIcons.Pot color="#d97706" />
          </div>
          {revealed.jar ? (
            <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#15803d', animation: 'fadeIn 0.3s' }}>STORING FOOD GRAINS</div>
          ) : (
             <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#94a3b8' }}>STORAGE JAR</div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => setRevealed(r => ({ ...r, container: true }))}>
          <div style={{ background: revealed.container ? '#f0fdf4' : 'transparent', padding: '12px', borderRadius: '12px', border: revealed.container ? '2px dashed #22c55e' : '2px dashed transparent', transition: 'all 0.3s' }}>
             <SvgIcons.Pot color="#b45309" />
          </div>
          {revealed.container ? (
            <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#15803d', animation: 'fadeIn 0.3s' }}>STORING OIL / GHEE</div>
          ) : (
             <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#94a3b8' }}>CONTAINER</div>
          )}
        </div>

      </div>

      {(revealed.pot && revealed.jar && revealed.container) && (
        <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
          <p style={{ margin: 0, fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', color: '#334155' }}>
            People used pottery items for everyday needs. You can still see ancient jars at the National Museum in New Delhi!
          </p>
        </div>
      )}
    </div>
  );
};

const PotterySpotlight = ({ page1Layout }) => {
  const [clueIndex, setClueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsPlaying(false);
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
      title: "HOW WAS POTTERY MADE?",
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
      <div style={{ background: '#1b2a4a', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', letterSpacing: '1px' }}>
          <SvgIcons.MagnifyingGlass /> CASE CLUE 0{clueIndex + 1}
        </div>
        <div style={{ fontSize: page1Layout ? 'var(--text-base)' : 'var(--text-sm)', color: '#94a3b8', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '12px' }}>
          CLUE {clueIndex + 1} / {clues.length}
        </div>
      </div>
      
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <h3 style={{ color: '#1e293b', margin: '0 0 20px 0', fontSize: page1Layout ? 'var(--text-2xl)' : 'var(--text-xl)', borderBottom: '3px solid #e2e8f0', paddingBottom: '12px', fontWeight: 'bold' }}>
          {currentClue.title}
        </h3>
        
        <div style={{ color: '#334155', fontSize: page1Layout ? 'var(--text-xl)' : 'var(--text-lg)', lineHeight: '1.6', flex: 1 }}>
          <ClueComponent page1Layout={page1Layout} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '2px dashed #cbd5e1' }}>
          <button 
            onClick={() => handleSpeak(currentClue.content)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '2px solid #bfdbfe', color: '#1e40af', cursor: 'pointer', fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', fontWeight: 'bold', padding: '10px 20px', borderRadius: '24px' }}
          >
            {isPlaying ? <SvgIcons.Pause /> : <SvgIcons.Play />} {isPlaying ? 'PAUSE' : 'PLAY CLUE'}
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {clueIndex > 0 && (
              <button 
                onClick={() => setClueIndex(c => c - 1)}
                style={{ padding: '12px 24px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', fontWeight: 'bold' }}
              >
                BACK
              </button>
            )}
            <button 
              onClick={() => setClueIndex(c => c + 1)}
              style={{ padding: '12px 24px', background: '#1b2a4a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: page1Layout ? 'var(--text-lg)' : 'var(--text-base)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            >
              {clueIndex === clues.length - 1 ? 'CASE CLOSED' : 'NEXT'}
            </button>
          </div>
        </div>
      </div>
      <style>{\`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growPot {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
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
