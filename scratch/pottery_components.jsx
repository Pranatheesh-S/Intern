const SvgIcons = {
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px 0', boxSizing: 'border-box' }}>
      
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' }}>
          {currentData.title}
        </h3>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '1px' }}>
          DO YOU KNOW?
        </div>
      </div>

      <div style={{ 
        flex: '1 1 auto', 
        backgroundColor: '#f8fafc', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: '24px',
        minHeight: 0,
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
      }}>
        
        <div style={{ fontSize: '60px', fontWeight: '900', color: '#1e3a8a', marginBottom: '24px', lineHeight: '1.1' }}>
          {currentData.bigFact}
        </div>
        
        <div style={{ fontSize: '24px', color: '#334155', lineHeight: '1.6', maxWidth: '90%' }}>
          {isPlaying ? (
            <HighlightedText phrases={[currentData.text]} activeCharIndex={activeCharIndex} />
          ) : (
             <span style={{ backgroundColor: hasPlayed ? '#fef08a' : 'transparent' }}>{currentData.text}</span>
          )}
        </div>
      </div>

      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={isPlaying ? stopAudio : playAudio}
            style={{
              background: isPlaying ? '#ef4444' : '#3b82f6',
              color: 'white', border: 'none', borderRadius: '24px',
              padding: '12px 24px',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontWeight: 'bold', fontSize: '18px',
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
                 padding: '12px 24px', fontWeight: 'bold', fontSize: '18px',
                 cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
               }}
             >
               NEXT CLUE ΓåÆ
             </button>
          ) : (
             <div style={{
                 background: '#10b981', color: 'white', borderRadius: '24px',
                 padding: '12px 24px', fontWeight: 'bold', fontSize: '18px',
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
