import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, X, CheckCircle2, ChevronRight, Award, Compass, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const PLANTS = ['Tulsi', 'Neem', 'Rose', 'Sunflower', 'Mango', 'Banana', 'Bamboo', 'Marigold', 'Peepal', 'Lotus', 'Hibiscus', 'Grass', 'Cactus', 'Jasmine', 'Coconut'];
const ANIMALS = ['Crow', 'Butterfly', 'Ant', 'Frog', 'Pigeon', 'Sparrow', 'Dog', 'Cow', 'Squirrel', 'Peacock', 'Dragonfly', 'Snail', 'Fish', 'Bee', 'Rabbit'];

const PLANT_EMOJIS = { Tulsi:'🌿', Neem:'🌳', Rose:'🌹', Sunflower:'🌻', Mango:'🥭', Banana:'🍌', Bamboo:'🎋', Marigold:'🌼', Peepal:'🌲', Lotus:'🪷', Hibiscus:'🌺', Grass:'🌱', Cactus:'🌵', Jasmine:'🤍', Coconut:'🥥' };
const ANIMAL_EMOJIS = { Crow:'🐦‍⬛', Butterfly:'🦋', Ant:'🐜', Frog:'🐸', Pigeon:'🕊️', Sparrow:'🐦', Dog:'🐕', Cow:'🐄', Squirrel:'🐿️', Peacock:'🦚', Dragonfly:'🦗', Snail:'🐌', Fish:'🐟', Bee:'🐝', Rabbit:'🐇' };

const CLASSMATES = [
  { name:'Aarav', plant:'Mango', animal:'Peacock' }, { name:'Priya', plant:'Lotus', animal:'Butterfly' },
  { name:'Rahul', plant:'Neem', animal:'Crow' }, { name:'Diya', plant:'Tulsi', animal:'Bee' },
  { name:'Karan', plant:'Rose', animal:'Rabbit' }, { name:'Ananya', plant:'Sunflower', animal:'Sparrow' },
  { name:'Vikram', plant:'Peepal', animal:'Squirrel' }, { name:'Meera', plant:'Hibiscus', animal:'Butterfly' },
  { name:'Arjun', plant:'Coconut', animal:'Fish' }, { name:'Sana', plant:'Bamboo', animal:'Dragonfly' },
  { name:'Rohan', plant:'Marigold', animal:'Frog' }, { name:'Tanya', plant:'Grass', animal:'Ant' },
  { name:'Nikhil', plant:'Jasmine', animal:'Pigeon' }, { name:'Isha', plant:'Banana', animal:'Dog' },
  { name:'Amit', plant:'Cactus', animal:'Snail' },
];

const QUIZ_QUESTIONS = [
  {
    q: 'A region has many different plants and animals living together. What is the BEST conclusion?',
    opts: [
      'The region has high biodiversity.',
      'Only one type of plant grows there.',
      'No animals depend on plants.',
      'All living things are exactly alike.'
    ],
    correct: 0,
    explain: 'A place with many different kinds of plants and animals has high biodiversity, making the ecosystem richer and healthier.'
  },
  {
    q: 'Imagine all flowering plants disappear from a garden. Which living thing is MOST likely to be affected first?',
    opts: ['Butterflies', 'Rocks', 'Clouds', 'Sand'],
    correct: 0,
    explain: 'Butterflies depend on flowers for nectar. Without flowering plants, they lose an important food source.'
  },
  {
    q: 'A bird eats a fruit and later drops its seeds in another place. What is the bird helping the plant to do?',
    opts: ['Change its colour', 'Grow taller instantly', 'Spread its seeds to new places', 'Produce flowers immediately'],
    correct: 2,
    explain: 'Some animals help plants by carrying and spreading their seeds, allowing new plants to grow in different places.'
  },
  {
    q: 'A student says, "Our playground has high biodiversity." Which observation BEST supports this statement?',
    opts: [
      'Only one large tree is growing there.',
      'Different trees, birds, butterflies, ants, and squirrels are seen there.',
      'The playground has many benches.',
      'Everyone plays football there.'
    ],
    correct: 1,
    explain: 'A variety of plants and animals living in the same place is direct evidence of high biodiversity.'
  },
  {
    q: 'A garden has many plants but no insects. Which effect is MOST likely?',
    opts: [
      'Some plants may have difficulty producing seeds.',
      'The plants will become rocks.',
      'Trees will stop growing overnight.',
      'The soil will disappear.'
    ],
    correct: 0,
    explain: 'Many insects help flowers by pollination, which supports fertilisation and seed formation.'
  },
  {
    q: 'Which statement BEST explains why plants and animals are called interdependent?',
    opts: [
      'They never interact with each other.',
      'They help each other in different ways, such as food, shelter, and seed dispersal.',
      'They always live in the same place.',
      'They all eat the same food.'
    ],
    correct: 1,
    explain: 'Plants and animals depend on one another for survival. Plants provide food and shelter, while animals help in processes like seed dispersal and pollination, keeping nature balanced.'
  },
  {
    q: 'Which park is healthier and likely to support more living things?',
    opts: [
      'Park A (has only grass).',
      'Park B (has grass, flowers, trees, birds, butterflies, insects, and squirrels).',
      'Both are equally healthy.',
      'Cannot say.'
    ],
    correct: 1,
    explain: 'Park B has a greater variety of living things, which provides food, shelter, and a balanced ecosystem supporting more life.'
  },
  {
    q: 'A village wants to protect biodiversity. Which action would help the MOST?',
    opts: [
      'Plant different kinds of native plants.',
      'Cut old trees.',
      'Remove birds from the area.',
      'Cover open land with concrete.'
    ],
    correct: 0,
    explain: 'Native plants provide food and shelter for local animals, birds, and insects. Growing different kinds of native plants supports biodiversity.'
  },
  {
    q: 'A farmer removes every insect from his field. Which is the BEST prediction?',
    opts: [
      'Some birds may find less food.',
      'Trees will become shorter.',
      'The Sun will become hotter.',
      'Rivers will disappear.'
    ],
    correct: 0,
    explain: 'Many birds eat insects as food. Removing all insects disrupts this interdependence and reduces food sources for birds.'
  }
];

export default function AppreciatingBiodiversityActivity({ onBackToDashboard }) {
  const [phase, setPhase] = useState('intro'); // intro | timer | pick | board | quiz | cert
  const [timer, setTimer] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [boardCards, setBoardCards] = useState([]);
  const [showStats, setShowStats] = useState(false);
  
  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRunning && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (timerRunning && timer === 0) {
      setTimerRunning(false);
      setPhase('pick');
    }
    return () => clearTimeout(timerRef.current);
  }, [timerRunning, timer]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleReadText = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
  };

  const handleStartTimer = () => {
    setTimer(10);
    setTimerRunning(true);
    setPhase('timer');
  };

  const handleAddToBoard = () => {
    if (!selectedPlant || !selectedAnimal) return;
    const myCard = { name: 'You', plant: selectedPlant, animal: selectedAnimal, isMe: true };
    const all = [myCard, ...CLASSMATES];
    setBoardCards(all);
    setPhase('board');
    setTimeout(() => setShowStats(true), 600);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    setPhase('intro');
    setTimer(10);
    setTimerRunning(false);
    setSelectedPlant(null);
    setSelectedAnimal(null);
    setBoardCards([]);
    setShowStats(false);
    setCurrentQIndex(0);
    setSelectedOpt(null);
    setQuizChecked(false);
    setQuizAnswers({});
  };

  const handleSelectAnswer = (optIndex) => {
    if (quizChecked) return;
    setSelectedOpt(optIndex);
  };

  const handleCheckAnswer = () => {
    setQuizChecked(true);
    const correct = QUIZ_QUESTIONS[currentQIndex].correct;
    setQuizAnswers(prev => ({
      ...prev,
      [currentQIndex]: selectedOpt === correct
    }));
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setQuizChecked(false);
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setPhase('cert');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const uniquePlants = [...new Set(boardCards.map(c => c.plant))].length;
  const uniqueAnimals = [...new Set(boardCards.map(c => c.animal))].length;
  const totalCards = boardCards.length;

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 3rem)',
      background: 'var(--page-bg)',
      color: 'var(--text-primary)',
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      boxSizing: 'border-box'
    }}>
      {/* 1. INTRO SCREEN (Slide 3 - Organisms and Habitats) */}
      {phase === 'intro' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '1160px', // Restructured: Widescreen view utilizing full space
          margin: '0 auto',
          padding: '2rem 1.5rem',
          boxSizing: 'border-box',
          gap: '2.5rem',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          {/* Header section with icon */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '850px'
          }}>
            <div style={{
              padding: '1.25rem',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2.5px solid var(--accent)',
              marginBottom: '1rem',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)'
            }}>
              <Compass size={54} className="text-accent" />
            </div>
            
            <span style={{ 
              fontSize: '0.95rem', 
              fontWeight: 'bold', 
              color: 'var(--accent)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.15em',
              marginBottom: '0.25rem'
            }}>
              Phase 1: Concept Introduction
            </span>
            <h1 style={{ 
              margin: '0.5rem 0 1rem 0', 
              fontSize: '2.8rem', // larger, clearer font
              color: 'var(--text-heading)', 
              fontWeight: '900',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Organisms and Habitats
            </h1>
          </div>

          {/* Restructured 2-Column Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1.3fr',
            gap: '2.5rem',
            width: '100%',
            alignItems: 'stretch'
          }}>
            {/* Left Column: What is a Habitat Explanation */}
            <div className="glass-panel" style={{
              padding: '2.5rem',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(99, 102, 241, 0.02) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'left',
              boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative faint background pattern */}
              <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-20%',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <h2 style={{
                fontSize: '1.75rem',
                color: 'var(--text-heading)',
                fontWeight: '800',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🔑 What is a Habitat?
              </h2>

              <p style={{ 
                fontSize: '1.35rem',
                color: 'var(--text-primary)', 
                lineHeight: '1.75', 
                margin: 0,
                fontWeight: '450'
              }}>
                The place where an organism lives, feeds, and reproduces is called its <strong>habitat</strong>. 
                <br /><br />
                Just like your home protects you and keeps you safe, different organisms are naturally adapted to live and thrive in their specific natural surroundings.
              </p>

              <div style={{ 
                marginTop: '1.75rem', 
                padding: '1.25rem 1.5rem', 
                borderRadius: '12px', 
                background: 'rgba(99, 102, 241, 0.06)', 
                borderLeft: '5px solid var(--accent)',
                borderTop: '1px solid var(--border)',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', color: 'var(--accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🚀 Your Mission
                </h3>
                <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Study the three main biomes, then test your memory to map organisms back to their correct habitats!
                </p>
              </div>
            </div>

            {/* Right Column: Three distinct Habitat cards */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              justifyContent: 'center'
            }}>
              {/* Card 1: Terrestrial */}
              <div className="glass-panel" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem 2rem',
                borderRadius: '16px',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                borderLeft: '6px solid #10b981',
                background: 'linear-gradient(to right, rgba(16, 185, 129, 0.03), rgba(16, 185, 129, 0.07))',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default'
              }}>
                <div style={{ fontSize: '3rem', lineHeight: '1' }}>🌳</div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.4rem', color: '#065f46', fontWeight: 'bold' }}>
                    Terrestrial Habitats
                  </h3>
                  <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Land-based environments such as lush forests, dry deserts, open grasslands, and tall mountains.
                  </p>
                </div>
              </div>

              {/* Card 2: Aquatic */}
              <div className="glass-panel" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem 2rem',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.15)',
                borderLeft: '6px solid #3b82f6',
                background: 'linear-gradient(to right, rgba(59, 130, 246, 0.03), rgba(59, 130, 246, 0.07))',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default'
              }}>
                <div style={{ fontSize: '3rem', lineHeight: '1' }}>💧</div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.4rem', color: '#1e3a8a', fontWeight: 'bold' }}>
                    Aquatic Habitats
                  </h3>
                  <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Water-based environments including quiet ponds, flowing rivers, deep lakes, and vast open oceans.
                  </p>
                </div>
              </div>

              {/* Card 3: Amphibians */}
              <div className="glass-panel" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1.5rem 2rem',
                borderRadius: '16px',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                borderLeft: '6px solid #f59e0b',
                background: 'linear-gradient(to right, rgba(245, 158, 11, 0.03), rgba(245, 158, 11, 0.07))',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default'
              }}>
                <div style={{ fontSize: '3rem', lineHeight: '1' }}>🐸</div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.4rem', color: '#78350f', fontWeight: 'bold' }}>
                    Amphibians
                  </h3>
                  <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Unique creatures (like frogs) adapted with special traits to live on both land and water shores.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons at the bottom */}
          <div style={{ 
            display: 'flex', 
            gap: '1.25rem',
            marginTop: '0.5rem',
            width: '100%',
            justifyContent: 'center'
          }}>
            <button
              onClick={onBackToDashboard} // Fixed: uses the correct function from props instead of undefined navigateTo
              className="outline"
              style={{ 
                padding: '0.8rem 1.75rem', 
                fontSize: '1.1rem', 
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Exit Activity
            </button>
            <button
              onClick={handleStartTimer}
              className="primary"
              style={{ 
                padding: '0.8rem 2.25rem', 
                fontSize: '1.1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem', 
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}
            >
              Start Memory Challenge <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* 2. TIMER SCREEN */}
      {phase === 'timer' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Close your eyes and think of a plant and an animal…</div>
          <div style={{ position: 'relative', width: 160, height: 160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border)" strokeWidth="10" />
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--accent)" strokeWidth="10"
                strokeDasharray={`${(10 - timer) / 10 * 440} 440`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{ transition: 'stroke-dasharray 1s linear' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-text)' }}>{timer}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>seconds</div>
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', animation: 'pulse 1s infinite' }}>😌</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Eyes closed… think of your favourite plant and animal</div>
        </div>
      )}

      {/* 3. PICK SCREEN */}
      {phase === 'pick' && (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem', 
          padding: '2rem 1.5rem', 
          overflowY: 'auto', 
          maxWidth: '1200px', // Widescreen layout: utilizes space properly
          margin: '0 auto', 
          width: '100%', 
          boxSizing: 'border-box',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {/* Top Control Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setPhase('intro')} 
                className="outline" 
                style={{ padding: '0.6rem 1.25rem', fontSize: '1rem', borderRadius: '10px', fontWeight: '600' }}
              >
                <ArrowLeft size={18} /> Back
              </button>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{ margin: 0, fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-heading)', letterSpacing: '-0.01em' }}>
                  Phase 2: Log your Memory
                </h2>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Choose the plant and animal you closed your eyes and thought of</span>
              </div>
            </div>
            <button 
              onClick={handleReset} 
              className="outline" 
              style={{ padding: '0.6rem 1.25rem', fontSize: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}
            >
              <RefreshCw size={16} /> Reset Choices
            </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '2rem',
            width: '100%'
          }}>
            {/* Plant picker panel */}
            <div className="glass-panel" style={{ 
              borderRadius: '20px', 
              padding: '2rem', 
              border: '1px solid rgba(34,197,94,0.15)', 
              background: 'linear-gradient(to bottom, var(--card-bg), rgba(34,197,94,0.01))',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
            }}>
              <div style={{ 
                fontSize: '1.05rem', 
                color: '#16a34a', 
                fontWeight: '800', 
                marginBottom: '1.5rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: '2px solid rgba(34,197,94,0.1)',
                paddingBottom: '0.5rem'
              }}>
                <span>🌿</span> Choose Plant Specimen
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '0.75rem',
                width: '100%'
              }}>
                {PLANTS.map(p => {
                  const isSelected = selectedPlant === p;
                  return (
                    <button 
                      key={p} 
                      onClick={() => setSelectedPlant(p)} 
                      style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '1.1rem 0.5rem',
                        background: isSelected ? 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.15) 100%)' : 'rgba(255,255,255,0.02)', 
                        border: `2px solid ${isSelected ? '#22c55e' : 'var(--border)'}`, 
                        color: isSelected ? '#15803d' : 'var(--text-primary)', 
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        fontSize: '1rem', 
                        fontWeight: '600',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isSelected ? '0 8px 20px rgba(34,197,94,0.1)' : '0 2px 4px rgba(0,0,0,0.01)',
                        transform: isSelected ? 'scale(1.03) translateY(-2px)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <span style={{ fontSize: '2rem' }}>{PLANT_EMOJIS[p]}</span>
                      <span>{p}</span>
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: '#22c55e',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animal picker panel */}
            <div className="glass-panel" style={{ 
              borderRadius: '20px', 
              padding: '2rem', 
              border: '1px solid rgba(245,158,11,0.15)', 
              background: 'linear-gradient(to bottom, var(--card-bg), rgba(245,158,11,0.01))',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
            }}>
              <div style={{ 
                fontSize: '1.05rem', 
                color: '#d97706', 
                fontWeight: '800', 
                marginBottom: '1.5rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: '2px solid rgba(245,158,11,0.1)',
                paddingBottom: '0.5rem'
              }}>
                <span>🦋</span> Choose Animal Specimen
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '0.75rem',
                width: '100%'
              }}>
                {ANIMALS.map(a => {
                  const isSelected = selectedAnimal === a;
                  return (
                    <button 
                      key={a} 
                      onClick={() => setSelectedAnimal(a)} 
                      style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '1.1rem 0.5rem',
                        background: isSelected ? 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.15) 100%)' : 'rgba(255,255,255,0.02)', 
                        border: `2px solid ${isSelected ? '#f59e0b' : 'var(--border)'}`, 
                        color: isSelected ? '#b45309' : 'var(--text-primary)', 
                        borderRadius: '12px', 
                        cursor: 'pointer', 
                        fontSize: '1rem', 
                        fontWeight: '600',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isSelected ? '0 8px 20px rgba(245,158,11,0.1)' : '0 2px 4px rgba(0,0,0,0.01)',
                        transform: isSelected ? 'scale(1.03) translateY(-2px)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <span style={{ fontSize: '2rem' }}>{ANIMAL_EMOJIS[a]}</span>
                      <span>{a}</span>
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: '#f59e0b',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submitting visual panel */}
          {selectedPlant && selectedAnimal && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1.25rem', 
              marginTop: '1.5rem',
              width: '100%',
              animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              <div style={{ 
                background: 'var(--card-bg)', 
                borderRadius: '16px', 
                padding: '1.25rem 3rem', 
                border: '1.5px solid var(--accent)', 
                textAlign: 'center', 
                fontSize: '1.3rem',
                boxShadow: '0 8px 30px rgba(99,102,241,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Selected Choices: </span>
                <span style={{ 
                  background: 'rgba(34,197,94,0.08)', 
                  padding: '0.35rem 0.8rem', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(34,197,94,0.2)',
                  fontWeight: 'bold', 
                  color: '#15803d' 
                }}>
                  {PLANT_EMOJIS[selectedPlant]} {selectedPlant}
                </span>
                <span style={{ color: 'var(--text-faint)', fontWeight: 'bold' }}>&</span>
                <span style={{ 
                  background: 'rgba(245,158,11,0.08)', 
                  padding: '0.35rem 0.8rem', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(245,158,11,0.2)',
                  fontWeight: 'bold', 
                  color: '#b45309' 
                }}>
                  {ANIMAL_EMOJIS[selectedAnimal]} {selectedAnimal}
                </span>
              </div>
              
              <button 
                onClick={handleAddToBoard} 
                className="primary" 
                style={{ 
                  padding: '1rem 3.5rem', 
                  borderRadius: '12px', 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 10px 25px rgba(99, 102, 241, 0.35)',
                  transform: 'scale(1.02)'
                }}
              >
                📌 Add to Virtual Class Board & Reveal Diversity!
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. BOARD SCREEN */}
      {phase === 'board' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.25rem', overflowY: 'auto', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {/* Board Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={() => setPhase('pick')} className="outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px' }}>
                <ArrowLeft size={16} /> Exit
              </button>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                  🌍 Class Biodiversity Memory Board
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Discovered variety of the class</span>
              </div>
            </div>
            <button onClick={handleReset} className="outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px' }}>
              <RefreshCw size={16} /> Reset
            </button>
          </div>

          {showStats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', justifyContent: 'center' }}>
              {[
                { label: 'Total Students', value: totalCards, color: 'var(--accent)', icon: '👥' },
                { label: 'Unique Plants', value: uniquePlants, color: '#4ade80', icon: '🌿' },
                { label: 'Unique Animals', value: uniqueAnimals, color: '#fbbf24', icon: '🦋' },
                { label: 'Diversity Score', value: `${Math.round((uniquePlants + uniqueAnimals) / (totalCards * 2) * 100)}%`, color: '#f472b6', icon: '⭐' },
              ].map(stat => (
                <div className="glass-panel" key={stat.label} style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: `1px solid ${stat.color}35` }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
            🎉 Look at the amazing biodiversity your class remembered together!
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {boardCards.map((card, i) => (
              <div key={i} className="glass-panel" style={{ background: card.isMe ? 'rgba(99,102,241,0.12)' : 'var(--card-bg)', borderRadius: '10px', padding: '1rem', border: `1px solid ${card.isMe ? 'var(--accent)' : 'var(--border)'}`, textAlign: 'center', animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}>
                <div style={{ fontSize: '0.75rem', color: card.isMe ? 'var(--accent-text)' : 'var(--text-muted)', fontWeight: card.isMe ? 'bold' : 'normal', marginBottom: '0.5rem' }}>{card.isMe ? '⭐ YOU' : card.name}</div>
                <div style={{ fontSize: '1.25rem' }}>{PLANT_EMOJIS[card.plant] || '🌿'}</div>
                <div style={{ fontSize: '0.8rem', color: '#4ade80', marginBottom: '0.3rem', fontWeight: 'bold' }}>{card.plant}</div>
                <div style={{ fontSize: '1.25rem' }}>{ANIMAL_EMOJIS[card.animal] || '🐾'}</div>
                <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 'bold' }}>{card.animal}</div>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ background: 'var(--accent-light, rgba(99,102,241,0.06))', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--accent)', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--accent-text)' }}>💡 What does this tell us?</strong> Every student thought of different plants and animals — yet all are found in the same region! This shows us that biodiversity is all around us. There are <em>many more</em> species than we could even remember or count.
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={() => {
                handleStopSpeech();
                setPhase('quiz');
                setCurrentQIndex(0);
                setSelectedOpt(null);
                setQuizChecked(false);
                setQuizAnswers({});
              }}
              className="primary"
              style={{ padding: '0.65rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}
            >
              Proceed to Quiz <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 5. REVIEW QUIZ SCREEN */}
      {phase === 'quiz' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '750px',
          margin: '0 auto',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Quiz Top bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase' }}>
                Phase 3: Concept Quiz
              </span>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)' }}>
                Biodiversity Review Challenge
              </h2>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
            </div>
          </div>

          {/* Quiz Card */}
          <div className="glass-panel" style={{
            width: '100%',
            padding: '2.5rem',
            border: '1px solid var(--accent)',
            borderRadius: '16px',
            background: 'var(--card-bg)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-heading)', lineHeight: '1.5' }}>
              Q{currentQIndex + 1}: {QUIZ_QUESTIONS[currentQIndex].q}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {QUIZ_QUESTIONS[currentQIndex].opts.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                return (
                  <button
                    key={idx}
                    disabled={quizChecked}
                    onClick={() => handleSelectAnswer(idx)}
                    style={{
                      textAlign: 'left',
                      padding: '1rem 1.5rem',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'var(--page-bg)',
                      color: 'var(--text-primary)',
                      fontSize: '1.05rem',
                      cursor: quizChecked ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%'
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback / Explanation block */}
            {quizChecked && (
              <div style={{
                background: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                borderLeft: `4px solid ${selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? 'var(--success)' : 'var(--danger)'}`,
                padding: '1.25rem',
                borderRadius: '8px',
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6'
              }}>
                <div style={{ fontWeight: 'bold', color: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? 'var(--success)' : 'var(--danger)', marginBottom: '0.25rem' }}>
                  {selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? '✅ Correct Answer!' : '❌ Incorrect Answer!'}
                </div>
                {QUIZ_QUESTIONS[currentQIndex].explain}
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              {!quizChecked ? (
                <button
                  disabled={selectedOpt === null}
                  onClick={handleCheckAnswer}
                  className="primary"
                  style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem', borderRadius: '8px' }}
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="primary"
                  style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem', borderRadius: '8px' }}
                >
                  {currentQIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. FINAL CERTIFICATE SCREEN */}
      {phase === 'cert' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '650px',
          margin: '0 auto',
          padding: '2rem',
          textAlign: 'center',
          gap: '2.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
            border: '2px dashed var(--accent)',
            borderRadius: '24px',
            padding: '3rem 2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            width: '100%'
          }}>
            <div style={{
              background: 'rgba(217, 119, 6, 0.2)',
              borderRadius: '50%',
              padding: '1.25rem',
              border: '2px solid rgb(217, 119, 6)'
            }}>
              <Award size={64} style={{ color: 'rgb(217, 119, 6)' }} />
            </div>

            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 'extrabold', color: 'var(--text-heading)' }}>
                Activity 2.2 Completed!
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                Excellent job! You successfully completed the Biodiversity Appreciation Board activity and successfully demonstrated your understanding of ecosystems.
              </p>
            </div>

            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
              width: '100%',
              fontSize: '0.9rem',
              color: 'var(--text-muted)'
            }}>
              ⭐ Score: {Object.values(quizAnswers).filter(Boolean).length} / {QUIZ_QUESTIONS.length} Questions Correct
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleReset}
              className="outline"
              style={{
                padding: '0.6rem 1.25rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: '8px'
              }}
            >
              <RefreshCw size={16} /> Reset Activity
            </button>
            <button
              onClick={() => navigateTo('class6', 'chapter2')}
              className="primary"
              style={{ padding: '0.65rem 1.5rem', fontSize: '1rem', borderRadius: '8px' }}
            >
              Back to Chapter 2
            </button>
          </div>
        </div>
      )}

      {/* Embedded page styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
