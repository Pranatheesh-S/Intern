import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, X, CheckCircle2, ChevronRight, Award, Compass, Volume2, Eye, Check, Star, Lock, BookOpen, Play, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext.jsx';

import tulsiImg from '../../../../assets/specimens/tulsi.png';
import neemImg from '../../../../assets/specimens/neem.png';
import roseImg from '../../../../assets/specimens/rose.png';
import sunflowerImg from '../../../../assets/specimens/sunflower.png';
import mangoImg from '../../../../assets/specimens/mango.png';
import bananaImg from '../../../../assets/specimens/banana.png';
import bambooImg from '../../../../assets/specimens/bamboo.png';
import marigoldImg from '../../../../assets/specimens/marigold.png';
import peepalImg from '../../../../assets/specimens/peepal.png';
import lotusImg from '../../../../assets/specimens/lotus.png';
import hibiscusImg from '../../../../assets/specimens/hibiscus.png';
import grassImg from '../../../../assets/specimens/grass.png';
import cactusImg from '../../../../assets/specimens/cactus.png';
import jasmineImg from '../../../../assets/specimens/jasmine.png';
import coconutImg from '../../../../assets/specimens/coconut.png';

import crowImg from '../../../../assets/specimens/crow.png';
import butterflyImg from '../../../../assets/specimens/butterfly.png';
import antImg from '../../../../assets/specimens/ant.png';
import frogImg from '../../../../assets/specimens/frog.png';
import pigeonImg from '../../../../assets/specimens/pigeon.png';
import sparrowImg from '../../../../assets/specimens/sparrow.png';
import dogImg from '../../../../assets/specimens/dog.png';
import cowImg from '../../../../assets/specimens/cow.png';
import squirrelImg from '../../../../assets/specimens/squirrel.png';
import peacockImg from '../../../../assets/specimens/peacock.png';
import dragonflyImg from '../../../../assets/specimens/dragonfly.png';
import snailImg from '../../../../assets/specimens/snail.png';
import fishImg from '../../../../assets/specimens/fish.png';
import beeImg from '../../../../assets/specimens/bee.png';
import rabbitImg from '../../../../assets/specimens/rabbit.png';

import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

const PLANTS = ['Tulsi', 'Neem', 'Rose', 'Sunflower', 'Mango', 'Banana', 'Bamboo', 'Marigold', 'Peepal', 'Lotus', 'Hibiscus', 'Grass', 'Cactus', 'Jasmine', 'Coconut'];
const ANIMALS = ['Crow', 'Butterfly', 'Ant', 'Frog', 'Pigeon', 'Sparrow', 'Dog', 'Cow', 'Squirrel', 'Peacock', 'Dragonfly', 'Snail', 'Fish', 'Bee', 'Rabbit'];

const PLANT_EMOJIS = { Tulsi:'🌿', Neem:'🌳', Rose:'🌹', Sunflower:'🌻', Mango:'🥭', Banana:'🍌', Bamboo:'🎋', Marigold:'🌼', Peepal:'🌲', Lotus:'🪷', Hibiscus:'🌺', Grass:'🌱', Cactus:'🌵', Jasmine:'🤍', Coconut:'🥥' };
const ANIMAL_EMOJIS = { Crow:'🐦‍⬛', Butterfly:'🦋', Ant:'🐜', Frog:'🐸', Pigeon:'🕊️', Sparrow:'🐦', Dog:'🐕', Cow:'🐄', Squirrel:'🐿️', Peacock:'🦚', Dragonfly:'🦗', Snail:'🐌', Fish:'🐟', Bee:'🐝', Rabbit:'🐇' };

const PLANT_IMAGES = {
  Tulsi: tulsiImg,
  Neem: neemImg,
  Rose: roseImg,
  Sunflower: sunflowerImg,
  Mango: mangoImg,
  Banana: bananaImg,
  Bamboo: bambooImg,
  Marigold: marigoldImg,
  Peepal: peepalImg,
  Lotus: lotusImg,
  Hibiscus: hibiscusImg,
  Grass: grassImg,
  Cactus: cactusImg,
  Jasmine: jasmineImg,
  Coconut: coconutImg
};

const ANIMAL_IMAGES = {
  Crow: crowImg,
  Butterfly: butterflyImg,
  Ant: antImg,
  Frog: frogImg,
  Pigeon: pigeonImg,
  Sparrow: sparrowImg,
  Dog: dogImg,
  Cow: cowImg,
  Squirrel: squirrelImg,
  Peacock: peacockImg,
  Dragonfly: dragonflyImg,
  Snail: snailImg,
  Fish: fishImg,
  Bee: beeImg,
  Rabbit: rabbitImg
};

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
      'A concrete park with identical metal benches.',
      'A green garden containing 15 plant species and diverse birds/bugs.',
      'A gravel plot containing a single tree.',
      'An indoor hall containing artificial plants.'
    ],
    correct: 1,
    explain: 'An environment containing a rich variety of plants and animals is more resilient, healthy, and capable of supporting life.'
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
  const { theme } = useTheme();
  
  // Tabs and general phases
  const [activeTab, setActiveTab] = useState('board'); // board | quiz
  const [phase, setPhase] = useState('timer'); // timer | pick | board | completed
  
  const [timer, setTimer] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [boardCards, setBoardCards] = useState([]);
  
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

  const handleStartTimer = () => {
    setTimer(10);
    setTimerRunning(true);
  };

  const handleAddToBoard = () => {
    if (!selectedPlant || !selectedAnimal) return;
    const myCard = { name: 'You', plant: selectedPlant, animal: selectedAnimal, isMe: true };
    const all = [myCard, ...CLASSMATES];
    setBoardCards(all);
    setPhase('board');
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    setTimer(10);
    setTimerRunning(false);
    setSelectedPlant('');
    setSelectedAnimal('');
    setBoardCards([]);
    setCurrentQIndex(0);
    setSelectedOpt(null);
    setQuizChecked(false);
    setQuizAnswers({});
    setPhase('timer');
    setActiveTab('board');
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
      setPhase('completed');
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleSelectAnswer = (idx) => {
    if (!quizChecked) setSelectedOpt(idx);
  };

  // Stats calculation
  const uniquePlants = [...new Set(boardCards.map(c => c.plant))].length;
  const uniqueAnimals = [...new Set(boardCards.map(c => c.animal))].length;
  const totalCards = boardCards.length;

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 3rem)',
      backgroundImage: `url(${darkForestBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: 'var(--geo-font)',
      color: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      {/* Textbook Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1.5px solid rgba(255, 255, 255, 0.2)',
        width: '100%',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => onBackToDashboard(false)} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '7px', 
              fontSize: '12.5px', 
              padding: '0.45rem 1.1rem',
              borderRadius: '20px',
              border: '1.5px solid #60a5fa',
              background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
              cursor: 'pointer',
              color: '#ffffff',
              fontWeight: '700',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={14} color="#ffffff" /> Exit Activity
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={handleReset} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '12px', 
              padding: '0.45rem 0.95rem',
              borderRadius: '20px',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              background: 'rgba(30, 41, 59, 0.9)',
              cursor: 'pointer',
              color: '#f1f5f9',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <RefreshCw size={13} color="#38bdf8" /> Reset Activity
          </button>
        </div>
      </div>

      <div className="split-frame" style={{ flex: 1, minHeight: 0, gridTemplateColumns: phase === 'pick' ? '1fr' : undefined, padding: '1rem', gap: '1.25rem' }}>
        
        {/* ============ LEFT COLUMN: CONTEXT & STATS ============ */}
        {phase !== 'pick' && (
          <div className="frame-page-left" style={{
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)'
          }}>
            <div className="textbook-eyebrow" style={{ color: '#38bdf8', fontWeight: '800', letterSpacing: '0.06em' }}>
              Activity 2.2 · Let Us Appreciate
            </div>
            <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)', color: '#38bdf8', textShadow: '0 2px 10px rgba(0,0,0,0.6)', fontWeight: '800' }}>
              Ecosystem Appreciation
            </h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', fontSize: '16.5px', color: '#fde047', lineHeight: '1.65', fontWeight: '500' }}>
              <p style={{ margin: 0 }}>
                Appreciating and conserving biodiversity is vital for our survival. Every living thing in a habitat is connected.
              </p>
              <p style={{ margin: 0 }}>
                During our nature walk, different students notice and remember different plants and animals. When we compile our observations together, we discover a much richer variety of life than any single person could find alone.
              </p>
            </div>

            {boardCards.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  📊 Memory Board Statistics
                </span>
                <div className="textbook-grid" style={{ marginBottom: 0 }}>
                  <div className="textbook-fact" style={{ background: 'rgba(30, 41, 59, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.2)' }}>
                    <div className="lab" style={{ color: '#38bdf8', fontWeight: '800' }}>Total Logs</div>
                    <div className="v" style={{ color: '#ffffff', fontWeight: '800' }}>{totalCards} entries</div>
                    <div className="note" style={{ color: '#fde047', fontWeight: '600' }}>Your card + classmates</div>
                  </div>
                  <div className="textbook-fact" style={{ background: 'rgba(30, 41, 59, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.2)' }}>
                    <div className="lab" style={{ color: '#4ade80', fontWeight: '800' }}>Unique Species</div>
                    <div className="v" style={{ color: '#ffffff', fontWeight: '800' }}>{uniquePlants + uniqueAnimals} types</div>
                    <div className="note" style={{ color: '#fde047', fontWeight: '600' }}>Plants: {uniquePlants}, Animals: {uniqueAnimals}</div>
                  </div>
                </div>
                <div className="textbook-explore" style={{ marginTop: '0.5rem', background: 'rgba(30, 41, 59, 0.95)', borderLeft: '4px solid #fde047', border: '1.5px solid rgba(255, 255, 255, 0.2)', borderLeftWidth: '4px', color: '#fef08a', fontSize: '15px' }}>
                  ✏️ <b style={{ color: '#fde047' }}>Next step:</b> Switch to the <b style={{ color: '#fde047' }}>Ecosystem Quiz</b> tab on the right to test your knowledge of species interdependence!
                </div>
              </div>
            ) : (
              <div className="textbook-explore" style={{ marginTop: '1.5rem', background: 'rgba(30, 41, 59, 0.95)', borderLeft: '4px solid #fde047', border: '1.5px solid rgba(255, 255, 255, 0.2)', borderLeftWidth: '4px', color: '#fef08a', fontSize: '15px' }}>
                ✏️ <b style={{ color: '#fde047' }}>Reflection challenge:</b> Close your eyes for 10 seconds. Think of one plant and one animal from your walk, then add them to the virtual class board.
              </div>
            )}

            {phase === 'completed' && (
              <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ background: 'rgba(6, 78, 59, 0.85)', border: '1.5px solid #10b981', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🎉 Activity Completed!
                  </span>
                  <span style={{ fontSize: '12px', color: '#e2e8f0' }}>
                    You got {Object.values(quizAnswers).filter(Boolean).length} / 8 questions correct on the Interdependence checkup!
                  </span>
                  <button onClick={() => onBackToDashboard('next_activity')} className="primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderColor: '#10b981', width: '100%', fontSize: '13.5px', padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '0.5rem', color: '#ffffff', fontWeight: 'bold' }}>
                    Proceed to Activity 2.3: Let Us Group ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="frame-page-right" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: 0, 
          flex: 1, 
          width: phase === 'pick' ? '100%' : 'auto', 
          maxWidth: phase === 'pick' ? '100%' : 'none',
          background: 'rgba(15, 23, 42, 0.78)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)'
        }}>
          
          {/* Tabs bar - Styled Sideways */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem',
            padding: '6px', 
            marginBottom: '1rem', 
            background: 'rgba(15, 23, 42, 0.9)', 
            border: '1px solid rgba(255, 255, 255, 0.15)', 
            borderRadius: '12px' 
          }}>
            <button 
              className={activeTab === 'board' ? 'on' : ''} 
              onClick={() => setActiveTab('board')}
              style={{ 
                flex: 1,
                padding: '8px', 
                fontSize: '13px', 
                display: 'flex', 
                flexDirection: 'row', 
                gap: '6px', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '8px',
                border: activeTab === 'board' ? '1.5px solid #38bdf8' : '1px solid transparent',
                background: activeTab === 'board' ? '#1e293b' : 'transparent',
                color: activeTab === 'board' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'board' ? '700' : '500',
                cursor: 'pointer'
              }}
            >
              <span>🖼️ Class Board</span>
              <small style={{ color: activeTab === 'board' ? '#38bdf8' : '#94a3b8' }}>({boardCards.length > 0 ? 'Submitted' : 'Pending'})</small>
            </button>
            <button 
              className={activeTab === 'quiz' ? 'on' : ''} 
              onClick={() => {
                if (boardCards.length === 0) {
                  alert('Please submit your memory card first to unlock the quiz!');
                } else {
                  setActiveTab('quiz');
                }
              }}
              style={{ 
                flex: 1,
                padding: '8px', 
                fontSize: '13px', 
                display: 'flex', 
                flexDirection: 'row', 
                gap: '6px', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '8px',
                border: activeTab === 'quiz' ? '1.5px solid #38bdf8' : '1px solid transparent',
                background: activeTab === 'quiz' ? '#1e293b' : 'transparent',
                color: activeTab === 'quiz' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'quiz' ? '700' : '500',
                cursor: boardCards.length === 0 ? 'not-allowed' : 'pointer',
                opacity: boardCards.length === 0 ? 0.6 : 1 
              }}
            >
              <span>🔬 Ecosystem Quiz</span>
              {boardCards.length === 0 && <Lock size={12} />}
            </button>
          </div>

          {/* TAB 1: BOARD WORKSPACE */}
          {activeTab === 'board' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              
              {/* Submission panel (if not logged yet) */}
              {boardCards.length === 0 && (
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justify: phase === 'pick' ? 'flex-start' : 'center', 
                  gap: '1.5rem', 
                  padding: phase === 'pick' ? '0' : '2rem', 
                  textAlign: 'center', 
                  width: '100%' 
                }}>
                  {phase === 'timer' && (
                    <>
                      <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="6"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#38bdf8"
                            strokeWidth="6"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={(2 * Math.PI * 40) - (timer / 10) * (2 * Math.PI * 40)}
                            strokeLinecap="round"
                            style={{ transition: timerRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
                          />
                        </svg>
                        <div style={{ position: 'absolute', fontSize: '1.6rem', fontWeight: 'bold', color: '#ffffff' }}>
                          {timer}s
                        </div>
                      </div>
                      <div>
                        <h3 style={{ fontFamily: 'var(--serif-font)', color: '#fde047', margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold' }}>10-Second Reflection</h3>
                        <p style={{ fontSize: '15px', color: '#fde047', maxWidth: '380px', margin: 0, lineHeight: '1.5', fontWeight: '500' }}>
                          Close your eyes and reflect on the plants and animals you saw on the nature walk.
                        </p>
                      </div>
                      {!timerRunning && (
                        <button onClick={handleStartTimer} className="primary" style={{ padding: '0.75rem 2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#ffffff' }}>
                          <Play size={15} fill="#fff" /> Start Reflection
                        </button>
                      )}
                    </>
                  )}

                  {phase === 'pick' && (
                    <div style={{ width: '100%', background: 'rgba(15, 23, 42, 0.85)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
                      
                      {/* Expanded header block with nice big font */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Goal</span>
                        <h2 style={{ margin: 0, fontFamily: 'var(--serif-font)', color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>
                          Ecosystem Reflection: Pick 1 Plant & 1 Animal
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#e2e8f0' }}>
                          Choose the specimens you observed during your nature walk to contribute to the shared Class Board.
                        </p>
                      </div>

                      {/* Side-by-side Plants and Animals */}
                      <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                        
                        {/* Plants Column */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '11px', color: '#a7f3d0', fontWeight: 'bold', display: 'block', letterSpacing: '0.05em' }}>SELECT A PLANT</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', padding: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.9)' }} className="hide-scrollbar">
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
                                    gap: '6px',
                                    padding: '0.5rem',
                                    borderRadius: '10px',
                                    border: isSelected ? '2px solid #34d399' : '1px solid rgba(255, 255, 255, 0.15)',
                                    background: isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(51, 65, 85, 0.8)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isSelected ? '0 4px 12px rgba(52, 211, 153, 0.25)' : 'none'
                                  }}
                                >
                                  <div style={{ width: '100%', aspectRatio: '1.33', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <img src={PLANT_IMAGES[p]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p} />
                                  </div>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isSelected ? '#a7f3d0' : '#f8fafc', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>
                                    {PLANT_EMOJIS[p]} {p}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Animals Column */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '11px', color: '#fef08a', fontWeight: 'bold', display: 'block', letterSpacing: '0.05em' }}>SELECT AN ANIMAL</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', padding: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', background: 'rgba(30, 41, 59, 0.9)' }} className="hide-scrollbar">
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
                                    gap: '6px',
                                    padding: '0.5rem',
                                    borderRadius: '10px',
                                    border: isSelected ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.15)',
                                    background: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(51, 65, 85, 0.8)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isSelected ? '0 4px 12px rgba(251, 191, 36, 0.25)' : 'none'
                                  }}
                                >
                                  <div style={{ width: '100%', aspectRatio: '1.33', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <img src={ANIMAL_IMAGES[a]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={a} />
                                  </div>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isSelected ? '#fef08a' : '#f8fafc', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>
                                    {ANIMAL_EMOJIS[a]} {a}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      <button 
                        disabled={!selectedPlant || !selectedAnimal}
                        onClick={handleAddToBoard} 
                        className="primary" 
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: (!selectedPlant || !selectedAnimal) ? 0.5 : 1, transition: 'all 0.2s ease', cursor: (!selectedPlant || !selectedAnimal) ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#ffffff', borderColor: '#2563eb' }}
                      >
                        Add to Class Board <ChevronRight size={15} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Submited Card Grid Tray */}
              {boardCards.length > 0 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ fontSize: '12px', color: '#a7f3d0', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                    🖼️ virtual class memory wall (16 total contributions)
                  </div>
                  <div style={{ flex: 1, maxHeight: '540px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px' }} className="hide-scrollbar">
                    {boardCards.map((card, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          background: card.isMe ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.9), rgba(29, 78, 216, 0.85))' : 'rgba(30, 41, 59, 0.85)',
                          border: card.isMe ? '2px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '12px',
                          padding: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: card.isMe ? '#60a5fa' : '#ffffff' }}>
                            {card.name} {card.isMe && '⭐'}
                          </span>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>Classmate memory</span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                          {/* Plant Image Card */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.4rem' }}>
                            <div style={{ width: '100%', aspectRatio: '1.5', borderRadius: '6px', overflow: 'hidden' }}>
                              <img src={PLANT_IMAGES[card.plant]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={card.plant} />
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#ffffff' }}>
                              {PLANT_EMOJIS[card.plant]} {card.plant}
                            </span>
                          </div>
                          {/* Animal Image Card */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.4rem' }}>
                            <div style={{ width: '100%', aspectRatio: '1.5', borderRadius: '6px', overflow: 'hidden' }}>
                              <img src={ANIMAL_IMAGES[card.animal]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={card.animal} />
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#ffffff' }}>
                              {ANIMAL_EMOJIS[card.animal]} {card.animal}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                    <button onClick={handleReset} className="outline" style={{ fontSize: '12px', padding: '0.4rem 0.8rem', borderRadius: '6px', gap: '0.25rem', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)' }}>
                      <RefreshCw size={12} /> Play Again
                    </button>
                    <button onClick={() => setActiveTab('quiz')} className="primary" style={{ fontSize: '12.5px', padding: '0.45rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#ffffff' }}>
                      Go to Quiz <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: INTERDEPENDENCE QUIZ */}
          {activeTab === 'quiz' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {phase === 'completed' ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1.25rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', border: '2px solid #10b981' }}>
                    <Award size={48} color="#34d399" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: 'var(--serif-font)', color: '#ffffff', fontSize: '20px' }}>Ecosystem Quiz Completed!</h3>
                    <p style={{ fontSize: '13.5px', color: '#cbd5e1', margin: '0.25rem 0 0' }}>
                      You have validated your comprehension of biodiversity interdependence.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid rgba(255, 255, 255, 0.2)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      🔬 Interdependence Checkup
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#fde047', background: 'rgba(254, 240, 138, 0.15)', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(254, 240, 138, 0.3)' }}>
                      Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
                    </span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }} className="hide-scrollbar">
                    <p style={{ margin: '0 0 1.25rem 0', fontSize: '16.5px', fontWeight: '800', color: '#ffffff', lineHeight: '1.6', textShadow: '0 2px 8px rgba(0,0,0,0.5)', background: 'rgba(30, 41, 59, 0.85)', padding: '1rem 1.1rem', borderRadius: '12px', border: '1.5px solid rgba(255, 255, 255, 0.2)' }}>
                      Q{currentQIndex + 1}. {QUIZ_QUESTIONS[currentQIndex].q}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      {QUIZ_QUESTIONS[currentQIndex].opts.map((opt, i) => {
                        let border = '1.5px solid rgba(255, 255, 255, 0.25)';
                        let bg = 'rgba(30, 41, 59, 0.95)';
                        let textColor = '#ffffff';
                        let boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                        if (quizChecked) {
                          if (i === QUIZ_QUESTIONS[currentQIndex].correct) { 
                            border = '2px solid #34d399'; 
                            bg = 'rgba(16, 185, 129, 0.35)'; 
                            textColor = '#ffffff'; 
                            boxShadow = '0 4px 14px rgba(52, 211, 153, 0.3)';
                          } else if (i === selectedOpt) { 
                            border = '2px solid #ef4444'; 
                            bg = 'rgba(239, 68, 68, 0.35)'; 
                            textColor = '#ffffff'; 
                            boxShadow = '0 4px 14px rgba(239, 68, 68, 0.3)';
                          }
                        } else if (selectedOpt === i) {
                          border = '2px solid #38bdf8'; 
                          bg = 'rgba(56, 189, 248, 0.3)'; 
                          textColor = '#ffffff';
                          boxShadow = '0 4px 14px rgba(56, 189, 248, 0.3)';
                        }
                        return (
                          <button key={i} disabled={quizChecked} onClick={() => handleSelectAnswer(i)}
                            style={{ textAlign: 'left', padding: '0.85rem 1.1rem', borderRadius: '10px', border, background: bg, color: textColor, fontSize: '14.5px', lineHeight: '1.5', cursor: quizChecked ? 'default' : 'pointer', width: '100%', fontWeight: '700', boxShadow, transition: 'all 0.2s ease' }}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizChecked && (
                      <div style={{
                        background: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                        borderLeft: `4px solid ${selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? '#34d399' : '#ef4444'}`,
                        border: '1.5px solid rgba(255, 255, 255, 0.2)',
                        borderLeftWidth: '4px',
                        padding: '0.85rem 1.1rem',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        color: '#ffffff',
                        lineHeight: 1.6
                      }}>
                        <strong style={{ color: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? '#34d399' : '#ef4444' }}>
                          {selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? 'Correct!' : 'Incorrect.'}
                        </strong> {QUIZ_QUESTIONS[currentQIndex].explain}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1.5px solid rgba(255, 255, 255, 0.2)', paddingTop: '0.85rem', marginTop: '0.85rem' }}>
                    {!quizChecked ? (
                      <button disabled={selectedOpt === null} onClick={handleCheckAnswer} className="primary" style={{ padding: '0.65rem 1.6rem', fontSize: '13.5px', borderRadius: '8px', opacity: selectedOpt === null ? 0.5 : 1, background: 'linear-gradient(135deg, #0284c7, #1d4ed8)', color: '#ffffff', fontWeight: '800', border: '1.5px solid #60a5fa', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.45)', cursor: selectedOpt === null ? 'not-allowed' : 'pointer' }}>
                        Verify Answer
                      </button>
                    ) : (
                      <button onClick={handleNextQuestion} className="primary" style={{ padding: '0.65rem 1.6rem', fontSize: '13.5px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', fontWeight: '800', border: '1.5px solid #34d399', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.45)', cursor: 'pointer' }}>
                        {currentQIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'} <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
