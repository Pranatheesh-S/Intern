import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, X, CheckCircle2, ChevronRight, Award, Compass, Volume2, Eye, Check, Star, Lock, BookOpen, Play, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext.jsx';

import tulsiImg from '../../../../assets/specimens/tulsi.png';
import roseImg from '../../../../assets/specimens/rose.png';
import grassImg from '../../../../assets/specimens/grass.png';
import neemImg from '../../../../assets/specimens/neem.png';
import peepalImg from '../../../../assets/specimens/peepal.png';
import jasmineImg from '../../../../assets/specimens/jasmine.png';

import crowImg from '../../../../assets/crow.png';
import cowImg from '../../../../assets/brown_cow.png';
import frogImg from '../../../../assets/frog.png';
import squirrelImg from '../../../../assets/squirrel.png';
import antImg from '../../../../assets/ant.png';
import sparrowImg from '../../../../assets/sparrow.png';

import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

const PLANTS = ['Tulsi', 'Rose', 'Grass', 'Neem', 'Peepal', 'Jasmine'];
const ANIMALS = ['Crow', 'Cow', 'Frog', 'Squirrel', 'Ant', 'Sparrow'];

const PLANT_EMOJIS = { Tulsi: '🌿', Rose: '🌹', Grass: '🌱', Neem: '🌳', Peepal: '🌲', Jasmine: '🤍' };
const ANIMAL_EMOJIS = { Crow: '🐦‍⬛', Cow: '🐄', Frog: '🐸', Squirrel: '🐿️', Ant: '🐜', Sparrow: '🐦' };

const PLANT_IMAGES = {
  Tulsi: tulsiImg,
  Rose: roseImg,
  Grass: grassImg,
  Neem: neemImg,
  Peepal: peepalImg,
  Jasmine: jasmineImg
};

const ANIMAL_IMAGES = {
  Crow: crowImg,
  Cow: cowImg,
  Frog: frogImg,
  Squirrel: squirrelImg,
  Ant: antImg,
  Sparrow: sparrowImg
};

const CLASSMATES = [
  { name: 'Rahul', plant: 'Neem', animal: 'Crow' },
  { name: 'Diya', plant: 'Tulsi', animal: 'Cow' },
  { name: 'Karan', plant: 'Rose', animal: 'Frog' },
  { name: 'Ananya', plant: 'Grass', animal: 'Sparrow' },
  { name: 'Vikram', plant: 'Peepal', animal: 'Squirrel' },
  { name: 'Tanya', plant: 'Jasmine', animal: 'Ant' },
  { name: 'Aarav', plant: 'Tulsi', animal: 'Crow' },
  { name: 'Priya', plant: 'Rose', animal: 'Squirrel' },
  { name: 'Rohan', plant: 'Neem', animal: 'Frog' },
  { name: 'Nikhil', plant: 'Peepal', animal: 'Cow' },
  { name: 'Meera', plant: 'Grass', animal: 'Sparrow' },
  { name: 'Isha', plant: 'Jasmine', animal: 'Ant' }
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

export default function AppreciatingBiodiversityActivity({ onBackToDashboard, subStep, onSubStepChange }) {
  const { theme } = useTheme();
  
  // Tabs and general phases
  const [activeTab, setActiveTab] = useState(subStep === 'quiz' ? 'quiz' : 'board'); // board | quiz
  const [phase, setPhase] = useState(subStep === 'board' ? 'board' : 'timer'); // timer | pick | board | completed
  
  const [timer, setTimer] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [boardCards, setBoardCards] = useState((subStep === 'board' || subStep === 'quiz') ? [{ name: 'You', plant: 'Tulsi', animal: 'Crow', isMe: true }, ...CLASSMATES] : []);
  
  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  const timerRef = useRef(null);

  useEffect(() => {
    if (subStep === 'board') {
      setActiveTab('board');
      setPhase('board');
      setBoardCards(prev => prev.length > 0 ? prev : [{ name: 'You', plant: selectedPlant || 'Tulsi', animal: selectedAnimal || 'Crow', isMe: true }, ...CLASSMATES]);
    } else if (subStep === 'quiz') {
      setActiveTab('quiz');
      setPhase('board');
      setBoardCards(prev => prev.length > 0 ? prev : [{ name: 'You', plant: selectedPlant || 'Tulsi', animal: selectedAnimal || 'Crow', isMe: true }, ...CLASSMATES]);
    } else if (subStep === 'appreciate') {
      setActiveTab('board');
      if (phase === 'board') setPhase('timer');
    }
  }, [subStep]);

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
    if (onSubStepChange) onSubStepChange('board');
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
      color: '#064e3b',
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
        background: 'rgba(234, 246, 238, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1.5px solid rgba(167, 243, 208, 0.85)',
        boxShadow: '0 4px 16px rgba(6, 78, 59, 0.08)',
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
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
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
              border: '1.5px solid rgba(167, 243, 208, 0.9)',
              background: '#ffffff',
              cursor: 'pointer',
              color: '#064e3b',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <RefreshCw size={13} color="#059669" /> Reset Activity
          </button>
        </div>
      </div>

      <div className="split-frame" style={{ flex: 1, minHeight: 0, gridTemplateColumns: phase === 'pick' ? '1fr' : undefined, padding: '1rem', gap: '1.25rem' }}>
        
        {/* ============ LEFT COLUMN: CONTEXT & STATS (Dark Green Theme #123D2A) ============ */}
        {phase !== 'pick' && (
          <div className="frame-page-left appreciate-dark-left" style={{
            background: '#123D2A',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(52, 211, 153, 0.4)',
            borderRadius: '20px',
            padding: '2.25rem 2rem',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: '1.35rem'
          }}>
            <div>
              <div className="textbook-eyebrow" style={{ color: '#FFD21F', fontWeight: '800', fontSize: '18px', letterSpacing: '0.06em', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                Activity 2.2 · Let Us Appreciate
              </div>
              <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)', color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.6)', fontWeight: '900', fontSize: '2.35rem', margin: '0.35rem 0 1.1rem 0' }}>
                Ecosystem Appreciation
              </h1>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '16px', color: '#FFD700', lineHeight: '1.6', fontWeight: '700' }}>
                <p style={{ margin: 0, color: '#FFD700', fontSize: '16px' }}>
                  Appreciating and conserving biodiversity is vital for our survival. Every living thing in a habitat is connected.
                </p>
                <p style={{ margin: 0, color: '#FFD700', fontSize: '16px' }}>
                  During our nature walk, different students notice and remember different plants and animals. When we compile our observations together, we discover a much richer variety of life than any single person could find alone.
                </p>
              </div>
            </div>

            {boardCards.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  📊 Memory Board Statistics
                </span>
                <div className="textbook-grid" style={{ marginBottom: 0 }}>
                  <div className="textbook-fact" style={{ background: '#ffffff', border: '1.5px solid rgba(167, 243, 208, 0.85)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    <div className="lab" style={{ color: '#059669', fontWeight: '800' }}>Total Logs</div>
                    <div className="v" style={{ color: '#064e3b', fontWeight: '800' }}>{totalCards} entries</div>
                    <div className="note" style={{ color: '#047857', fontWeight: '600' }}>Your card + classmates</div>
                  </div>
                  <div className="textbook-fact" style={{ background: '#ffffff', border: '1.5px solid rgba(167, 243, 208, 0.85)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    <div className="lab" style={{ color: '#047857', fontWeight: '800' }}>Unique Species</div>
                    <div className="v" style={{ color: '#064e3b', fontWeight: '800' }}>{uniquePlants + uniqueAnimals} types</div>
                    <div className="note" style={{ color: '#047857', fontWeight: '600' }}>Plants: {uniquePlants}, Animals: {uniqueAnimals}</div>
                  </div>
                </div>
                <div className="textbook-explore" style={{ marginTop: '0.25rem', background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', borderLeft: '5px solid #eab308', border: '1.5px solid #fde047', borderLeftWidth: '5px', color: '#713f12', fontSize: '17px', fontWeight: '700', borderRadius: '12px', padding: '1.15rem 1.35rem', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)' }}>
                  ✏️ <b style={{ color: '#854d0e' }}>Next step:</b> Switch to the <b style={{ color: '#854d0e' }}>Ecosystem Quiz</b> tab on the right to test your knowledge of species interdependence!
                </div>
              </div>
            ) : (
              <div className="textbook-explore" style={{ marginTop: '0.25rem', background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', borderLeft: '5px solid #eab308', border: '1.5px solid #fde047', borderLeftWidth: '5px', color: '#713f12', fontSize: '17px', fontWeight: '700', borderRadius: '12px', padding: '1.25rem 1.4rem', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)', lineHeight: '1.55' }}>
                ✏️ <b style={{ color: '#854d0e' }}>Reflection challenge:</b> Close your eyes for 10 seconds. Think of one plant and one animal from your walk, then add them to the virtual class board.
              </div>
            )}

            {phase === 'completed' && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(52, 211, 153, 0.3)' }}>
                <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1.5px solid #10b981', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🎉 Activity Completed!
                  </span>
                  <span style={{ fontSize: '12px', color: '#065f46' }}>
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
          background: 'linear-gradient(145deg, rgba(234, 246, 238, 0.97) 0%, rgba(224, 242, 233, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(110, 231, 183, 0.8)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 16px 40px rgba(6, 78, 59, 0.15)'
        }}>
          
          {/* Tabs bar - Prominent Blue Highlighted Boxes */}
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <button 
              className={activeTab === 'board' ? 'on' : ''} 
              onClick={() => {
                setActiveTab('board');
                if (onSubStepChange) onSubStepChange('board');
              }}
              style={{ 
                flex: 1,
                padding: '10px 14px', 
                fontSize: '14.5px', 
                display: 'flex', 
                flexDirection: 'row', 
                gap: '8px', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '12px',
                border: activeTab === 'board' ? '2px solid #3b82f6' : '1.5px solid rgba(96, 165, 250, 0.6)',
                background: activeTab === 'board' ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' : 'rgba(239, 246, 255, 0.9)',
                color: '#1e3a8a',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: activeTab === 'board' ? '0 4px 14px rgba(59, 130, 246, 0.3)' : '0 2px 6px rgba(59, 130, 246, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🌄 Class Board</span>
              <small style={{ color: '#2563eb', fontWeight: '700' }}>({boardCards.length > 0 ? 'Submitted' : 'Pending'})</small>
            </button>
            <button 
              className={activeTab === 'quiz' ? 'on' : ''} 
              onClick={() => {
                if (boardCards.length === 0) {
                  alert('Please submit your memory card first to unlock the quiz!');
                } else {
                  setActiveTab('quiz');
                  if (onSubStepChange) onSubStepChange('quiz');
                }
              }}
              style={{ 
                flex: 1,
                padding: '10px 14px', 
                fontSize: '14.5px', 
                display: 'flex', 
                flexDirection: 'row', 
                gap: '8px', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '12px',
                border: activeTab === 'quiz' ? '2px solid #3b82f6' : '1.5px solid rgba(96, 165, 250, 0.6)',
                background: activeTab === 'quiz' ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' : 'rgba(239, 246, 255, 0.9)',
                color: '#1e3a8a',
                fontWeight: '800',
                cursor: boardCards.length === 0 ? 'not-allowed' : 'pointer',
                opacity: boardCards.length === 0 ? 0.75 : 1,
                boxShadow: activeTab === 'quiz' ? '0 4px 14px rgba(59, 130, 246, 0.3)' : '0 2px 6px rgba(59, 130, 246, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🔬 Ecosystem Quiz</span>
              {boardCards.length === 0 && <Lock size={13} color="#2563eb" />}
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
                  justifyContent: phase === 'pick' ? 'flex-start' : 'center', 
                  gap: '1.5rem', 
                  padding: phase === 'pick' ? '0' : '1.5rem', 
                  textAlign: 'center', 
                  width: '100%' 
                }}>
                  {phase === 'timer' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', width: '100%', maxWidth: '480px', margin: 'auto' }}>
                      <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
                          <circle
                            cx="55"
                            cy="55"
                            r="44"
                            fill="transparent"
                            stroke="rgba(167, 243, 208, 0.6)"
                            strokeWidth="7"
                          />
                          <circle
                            cx="55"
                            cy="55"
                            r="44"
                            fill="transparent"
                            stroke="#0284c7"
                            strokeWidth="7"
                            strokeDasharray={2 * Math.PI * 44}
                            strokeDashoffset={(2 * Math.PI * 44) - (timer / 10) * (2 * Math.PI * 44)}
                            strokeLinecap="round"
                            style={{ transition: timerRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
                          />
                        </svg>
                        <div style={{ position: 'absolute', fontSize: '2rem', fontWeight: '900', color: '#064e3b' }}>
                          {timer}s
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontFamily: 'var(--serif-font)', color: '#064e3b', margin: '0 0 0.5rem 0', fontSize: '1.85rem', fontWeight: '900' }}>10-Second Reflection</h3>
                        <p style={{ fontSize: '16.5px', color: '#065f46', maxWidth: '440px', margin: '0 auto', lineHeight: '1.55', fontWeight: '700' }}>
                          Close your eyes and reflect on the plants and animals you saw on the nature walk.
                        </p>
                      </div>
                      {!timerRunning && (
                        <button onClick={handleStartTimer} className="primary" style={{ padding: '0.85rem 2.6rem', borderRadius: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15.5px', fontWeight: '800', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#ffffff', border: '1.5px solid #60a5fa', boxShadow: '0 6px 20px rgba(2, 132, 199, 0.35)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                          <Play size={16} fill="#fff" /> Start Reflection
                        </button>
                      )}
                    </div>
                  )}

                  {phase === 'pick' && (
                    <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.97)', padding: '1.5rem', borderRadius: '16px', border: '1.5px solid rgba(167, 243, 208, 0.85)', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', boxShadow: '0 8px 28px rgba(6, 78, 59, 0.08)' }}>
                      
                      {/* Expanded header block with nice big font */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderBottom: '1.5px solid rgba(167, 243, 208, 0.7)', paddingBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Goal</span>
                        <h2 style={{ margin: 0, fontFamily: 'var(--serif-font)', color: '#064e3b', fontSize: '24px', fontWeight: 'bold' }}>
                          Ecosystem Reflection: Pick 1 Plant &amp; 1 Animal
                        </h2>
                        <div style={{
                          background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
                          border: '1.5px solid #fde047',
                          borderLeft: '4px solid #eab308',
                          borderRadius: '10px',
                          padding: '0.75rem 1rem',
                          boxShadow: '0 2px 8px rgba(234, 179, 8, 0.15)'
                        }}>
                          <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: '#713f12', lineHeight: '1.45' }}>
                            Choose the specimens you observed during your nature walk to contribute to the shared Class Board.
                          </p>
                        </div>
                      </div>

                      {/* Side-by-side Plants and Animals */}
                      <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                        
                        {/* Plants Column */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '12px', color: '#047857', fontWeight: 'bold', display: 'block', letterSpacing: '0.05em' }}>SELECT A PLANT</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', padding: '10px', border: '2px solid #eab308', borderRadius: '10px', background: 'rgba(234, 246, 238, 0.6)', boxShadow: '0 0 12px rgba(234, 179, 8, 0.25)' }} className="hide-scrollbar">
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
                                    border: isSelected ? '2px solid #10b981' : '1.5px solid rgba(167, 243, 208, 0.85)',
                                    background: isSelected ? 'rgba(16, 185, 129, 0.16)' : '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.25)' : '0 2px 6px rgba(0,0,0,0.04)'
                                  }}
                                >
                                  <div style={{ width: '100%', aspectRatio: '1.33', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(167, 243, 208, 0.6)' }}>
                                    <img src={PLANT_IMAGES[p]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p} />
                                  </div>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isSelected ? '#065f46' : '#064e3b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>
                                    {PLANT_EMOJIS[p]} {p}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Animals Column */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '12px', color: '#b45309', fontWeight: 'bold', display: 'block', letterSpacing: '0.05em' }}>SELECT AN ANIMAL</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', padding: '10px', border: '2px solid #eab308', borderRadius: '10px', background: 'rgba(234, 246, 238, 0.6)', boxShadow: '0 0 12px rgba(234, 179, 8, 0.25)' }} className="hide-scrollbar">
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
                                    border: isSelected ? '2px solid #f59e0b' : '1.5px solid rgba(167, 243, 208, 0.85)',
                                    background: isSelected ? 'rgba(245, 158, 11, 0.16)' : '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isSelected ? '0 4px 12px rgba(245, 158, 11, 0.25)' : '0 2px 6px rgba(0,0,0,0.04)'
                                  }}
                                >
                                  <div style={{ width: '100%', aspectRatio: '1.33', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(167, 243, 208, 0.6)' }}>
                                    <img src={ANIMAL_IMAGES[a]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={a} />
                                  </div>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isSelected ? '#92400e' : '#064e3b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>
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
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: (!selectedPlant || !selectedAnimal) ? 0.5 : 1, transition: 'all 0.2s ease', cursor: (!selectedPlant || !selectedAnimal) ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#ffffff', borderColor: '#2563eb', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)' }}
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
                  <div style={{ fontSize: '12.5px', color: '#047857', paddingBottom: '0.5rem', borderBottom: '1.5px solid rgba(167, 243, 208, 0.85)', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                    🖼️ Virtual Class Memory Wall ({boardCards.length} total contributions)
                  </div>
                  <div style={{ flex: 1, maxHeight: '540px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px' }} className="hide-scrollbar">
                    {boardCards.map((card, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          background: card.isMe ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : 'rgba(255, 255, 255, 0.96)',
                          border: card.isMe ? '2px solid #3b82f6' : '1.5px solid rgba(167, 243, 208, 0.85)',
                          borderRadius: '12px',
                          padding: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          boxShadow: card.isMe ? '0 4px 14px rgba(59, 130, 246, 0.18)' : '0 2px 8px rgba(6, 78, 59, 0.05)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: card.isMe ? '#1d4ed8' : '#064e3b' }}>
                            {card.name} {card.isMe && '⭐'}
                          </span>
                          <span style={{ fontSize: '10.5px', color: card.isMe ? '#2563eb' : '#047857', fontWeight: '600' }}>Classmate memory</span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                          {/* Plant Image Card */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', background: 'rgba(234, 246, 238, 0.7)', border: '1px solid rgba(167, 243, 208, 0.8)', borderRadius: '8px', padding: '0.4rem' }}>
                            <div style={{ width: '100%', aspectRatio: '1.5', borderRadius: '6px', overflow: 'hidden' }}>
                              <img src={PLANT_IMAGES[card.plant]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={card.plant} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#064e3b' }}>
                              {PLANT_EMOJIS[card.plant]} {card.plant}
                            </span>
                          </div>
                          {/* Animal Image Card */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', background: 'rgba(234, 246, 238, 0.7)', border: '1px solid rgba(167, 243, 208, 0.8)', borderRadius: '8px', padding: '0.4rem' }}>
                            <div style={{ width: '100%', aspectRatio: '1.5', borderRadius: '6px', overflow: 'hidden' }}>
                              <img src={ANIMAL_IMAGES[card.animal]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={card.animal} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#064e3b' }}>
                              {ANIMAL_EMOJIS[card.animal]} {card.animal}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid rgba(167, 243, 208, 0.85)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                    <button onClick={handleReset} className="outline" style={{ fontSize: '12px', padding: '0.4rem 0.85rem', borderRadius: '6px', gap: '0.25rem', display: 'flex', alignItems: 'center', background: '#ffffff', color: '#064e3b', border: '1.5px solid rgba(167, 243, 208, 0.9)', fontWeight: '600' }}>
                      <RefreshCw size={12} /> Play Again
                    </button>
                    <button onClick={() => setActiveTab('quiz')} className="primary" style={{ fontSize: '12.5px', padding: '0.45rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#ffffff', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)' }}>
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
                  <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', border: '2px solid #10b981' }}>
                    <Award size={48} color="#059669" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: 'var(--serif-font)', color: '#064e3b', fontSize: '22px', fontWeight: 'bold' }}>Ecosystem Quiz Completed!</h3>
                    <p style={{ fontSize: '14px', color: '#065f46', margin: '0.35rem 0 0' }}>
                      You have validated your comprehension of biodiversity interdependence.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid rgba(167, 243, 208, 0.85)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      🔬 Interdependence Checkup
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#854d0e', background: 'rgba(254, 240, 138, 0.5)', padding: '3px 10px', borderRadius: '12px', border: '1px solid #fde047' }}>
                      Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
                    </span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }} className="hide-scrollbar">
                    <p style={{ margin: '0 0 1.25rem 0', fontSize: '16.5px', fontWeight: '800', color: '#064e3b', lineHeight: '1.6', background: '#ffffff', padding: '1rem 1.15rem', borderRadius: '12px', border: '1.5px solid rgba(167, 243, 208, 0.85)', boxShadow: '0 4px 14px rgba(6, 78, 59, 0.05)' }}>
                      Q{currentQIndex + 1}. {QUIZ_QUESTIONS[currentQIndex].q}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      {QUIZ_QUESTIONS[currentQIndex].opts.map((opt, i) => {
                        let border = '1.5px solid rgba(167, 243, 208, 0.9)';
                        let bg = '#ffffff';
                        let textColor = '#064e3b';
                        let boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                        if (quizChecked) {
                          if (i === QUIZ_QUESTIONS[currentQIndex].correct) { 
                            border = '2px solid #10b981'; 
                            bg = 'rgba(16, 185, 129, 0.16)'; 
                            textColor = '#065f46'; 
                            boxShadow = '0 4px 14px rgba(16, 185, 129, 0.2)';
                          } else if (i === selectedOpt) { 
                            border = '2px solid #ef4444'; 
                            bg = 'rgba(239, 68, 68, 0.16)'; 
                            textColor = '#991b1b'; 
                            boxShadow = '0 4px 14px rgba(239, 68, 68, 0.2)';
                          }
                        } else if (selectedOpt === i) {
                          border = '2px solid #0284c7'; 
                          bg = 'rgba(56, 189, 248, 0.16)'; 
                          textColor = '#0369a1';
                          boxShadow = '0 4px 14px rgba(2, 132, 199, 0.2)';
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
                        background: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? '#f0fdf4' : '#fef2f2',
                        borderLeft: `4px solid ${selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? '#10b981' : '#ef4444'}`,
                        border: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                        borderLeftWidth: '4px',
                        padding: '0.85rem 1.1rem',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        color: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? '#166534' : '#991b1b',
                        lineHeight: 1.6
                      }}>
                        <strong style={{ color: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? '#15803d' : '#b91c1c' }}>
                          {selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? 'Correct!' : 'Incorrect.'}
                        </strong> {QUIZ_QUESTIONS[currentQIndex].explain}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1.5px solid rgba(167, 243, 208, 0.85)', paddingTop: '0.85rem', marginTop: '0.85rem' }}>
                    {!quizChecked ? (
                      <button disabled={selectedOpt === null} onClick={handleCheckAnswer} className="primary" style={{ padding: '0.65rem 1.6rem', fontSize: '13.5px', borderRadius: '8px', opacity: selectedOpt === null ? 0.5 : 1, background: 'linear-gradient(135deg, #0284c7, #1d4ed8)', color: '#ffffff', fontWeight: '800', border: '1.5px solid #60a5fa', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)', cursor: selectedOpt === null ? 'not-allowed' : 'pointer' }}>
                        Verify Answer
                      </button>
                    ) : (
                      <button onClick={handleNextQuestion} className="primary" style={{ padding: '0.65rem 1.6rem', fontSize: '13.5px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', fontWeight: '800', border: '1.5px solid #34d399', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)', cursor: 'pointer' }}>
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
