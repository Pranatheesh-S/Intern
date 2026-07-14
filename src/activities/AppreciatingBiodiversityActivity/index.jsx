import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

const PLANTS = ['Tulsi', 'Neem', 'Rose', 'Sunflower', 'Mango', 'Banana', 'Bamboo', 'Marigold', 'Peepal', 'Lotus', 'Hibiscus', 'Grass', 'Cactus', 'Jasmine', 'Coconut'];
const ANIMALS = ['Crow', 'Butterfly', 'Ant', 'Frog', 'Pigeon', 'Sparrow', 'Dog', 'Cow', 'Squirrel', 'Peacock', 'Dragonfly', 'Snail', 'Fish', 'Bee', 'Rabbit'];

const PLANT_EMOJIS = { Tulsi:'🌿', Neem:'🌳', Rose:'🌹', Sunflower:'🌻', Mango:'🥭', Banana:'🍌', Bamboo:'🎋', Marigold:'🌼', Peepal:'🌲', Lotus:'🪷', Hibiscus:'🌺', Grass:'🌱', Cactus:'🌵', Jasmine:'🤍', Coconut:'🥥' };
const ANIMAL_EMOJIS = { Crow:'🐦‍⬛', Butterfly:'🦋', Ant:'🐜', Frog:'🐸', Pigeon:'🕊️', Sparrow:'🐦', Dog:'🐕', Cow:'🐄', Squirrel:'🐿️', Peacock:'🦚', Dragonfly:'🦗', Snail:'🐌', Fish:'🐟', Bee:'🐝', Rabbit:'🐇' };

// Simulated classmate choices
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

export default function AppreciatingBiodiversityActivity({ onBackToDashboard }) {
  const [phase, setPhase] = useState('intro'); // intro | timer | pick | board
  const [timer, setTimer] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [boardCards, setBoardCards] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning && timer > 0) {
      intervalRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (timerRunning && timer === 0) {
      setTimerRunning(false);
      setPhase('pick');
    }
    return () => clearTimeout(intervalRef.current);
  }, [timerRunning, timer]);

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
  };

  const uniquePlants = [...new Set(boardCards.map(c => c.plant))].length;
  const uniqueAnimals = [...new Set(boardCards.map(c => c.animal))].length;
  const totalCards = boardCards.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0c1a2e', color: '#f0f9ff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1a2744', borderBottom: '1px solid rgba(96,165,250,0.2)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBackToDashboard} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: 'bold' }}>Activity 2.2 — Let Us Appreciate</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>🌍 Class Biodiversity Memory Board</div>
          </div>
        </div>
        <button onClick={handleReset} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <RefreshCw size={12} /> Restart
        </button>
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem' }}>🌿🦋</div>
          <div>
            <h2 style={{ color: '#60a5fa', margin: '0 0 0.5rem 0' }}>Let Us Appreciate Biodiversity!</h2>
            <p style={{ color: '#94a3b8', maxWidth: '480px', lineHeight: '1.7', margin: 0, fontSize: '0.9rem' }}>
              In this activity, you will <strong style={{ color: '#e2e8f0' }}>close your eyes for 10 seconds</strong> and think deeply about one plant and one animal that you find most beautiful or interesting.
              <br /><br />
              Then you'll reveal your choice and add it to the <strong style={{ color: '#e2e8f0' }}>Class Biodiversity Board</strong> — together you'll discover how many unique plants and animals your class can remember!
            </p>
          </div>
          <button onClick={handleStartTimer} style={{ background: '#2563eb', border: 'none', color: '#fff', padding: '0.75rem 2.5rem', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 4px 16px rgba(37,99,235,0.4)' }}>
            😌 Close Your Eyes — Begin
          </button>
        </div>
      )}

      {/* TIMER */}
      {phase === 'timer' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Close your eyes and think of a plant and an animal…</div>
          <div style={{ position: 'relative', width: 160, height: 160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#1e3a5f" strokeWidth="10" />
              <circle cx="80" cy="80" r="70" fill="none" stroke="#3b82f6" strokeWidth="10"
                strokeDasharray={`${(10 - timer) / 10 * 440} 440`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{ transition: 'stroke-dasharray 1s linear' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#60a5fa' }}>{timer}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>seconds</div>
            </div>
          </div>
          <div style={{ fontSize: '2rem', animation: 'pulse 1s infinite' }}>😌</div>
          <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Eyes closed… think of your favourite plant and animal</div>
        </div>
      )}

      {/* PICK */}
      {phase === 'pick' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#60a5fa', margin: 0 }}>👀 Open Your Eyes! What did you think of?</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>Select the plant and animal that came to your mind.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Plant picker */}
            <div style={{ background: '#1a2744', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(74,222,128,0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase' }}>🌿 My Plant</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {PLANTS.map(p => (
                  <button key={p} onClick={() => setSelectedPlant(p)} style={{ background: selectedPlant === p ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedPlant === p ? '#4ade80' : 'rgba(255,255,255,0.08)'}`, color: selectedPlant === p ? '#4ade80' : '#94a3b8', padding: '0.35rem 0.6rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}>
                    {PLANT_EMOJIS[p]} {p}
                  </button>
                ))}
              </div>
            </div>
            {/* Animal picker */}
            <div style={{ background: '#1a2744', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(251,191,36,0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase' }}>🦋 My Animal</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {ANIMALS.map(a => (
                  <button key={a} onClick={() => setSelectedAnimal(a)} style={{ background: selectedAnimal === a ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedAnimal === a ? '#fbbf24' : 'rgba(255,255,255,0.08)'}`, color: selectedAnimal === a ? '#fbbf24' : '#94a3b8', padding: '0.35rem 0.6rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s' }}>
                    {ANIMAL_EMOJIS[a]} {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedPlant && selectedAnimal && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#1a2744', borderRadius: '12px', padding: '1rem 2rem', border: '1px solid rgba(96,165,250,0.3)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Your choice: </span>
                <strong style={{ color: '#4ade80' }}>{PLANT_EMOJIS[selectedPlant]} {selectedPlant}</strong>
                <span style={{ color: '#64748b' }}> & </span>
                <strong style={{ color: '#fbbf24' }}>{ANIMAL_EMOJIS[selectedAnimal]} {selectedAnimal}</strong>
              </div>
              <button onClick={handleAddToBoard} style={{ background: '#2563eb', border: 'none', color: '#fff', padding: '0.65rem 2rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
                📌 Add to Class Board!
              </button>
            </div>
          )}
        </div>
      )}

      {/* BOARD */}
      {phase === 'board' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem', overflowY: 'auto' }}>
          {showStats && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Students', value: totalCards, color: '#60a5fa', icon: '👥' },
                { label: 'Unique Plants', value: uniquePlants, color: '#4ade80', icon: '🌿' },
                { label: 'Unique Animals', value: uniqueAnimals, color: '#fbbf24', icon: '🦋' },
                { label: 'Diversity Score', value: `${Math.round((uniquePlants + uniqueAnimals) / (totalCards * 2) * 100)}%`, color: '#f472b6', icon: '⭐' },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#1a2744', borderRadius: '12px', padding: '0.75rem 1.25rem', textAlign: 'center', border: `1px solid ${stat.color}30`, minWidth: 100 }}>
                  <div style={{ fontSize: '1.25rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
            🎉 Look at the amazing biodiversity your class remembered together!
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {boardCards.map((card, i) => (
              <div key={i} style={{ background: card.isMe ? 'rgba(37,99,235,0.15)' : '#1a2744', borderRadius: '10px', padding: '0.75rem', border: `1px solid ${card.isMe ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.06)'}`, textAlign: 'center', animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}>
                <div style={{ fontSize: '0.65rem', color: card.isMe ? '#60a5fa' : '#64748b', fontWeight: card.isMe ? 'bold' : 'normal', marginBottom: '0.35rem' }}>{card.isMe ? '⭐ YOU' : card.name}</div>
                <div style={{ fontSize: '1.1rem' }}>{PLANT_EMOJIS[card.plant] || '🌿'}</div>
                <div style={{ fontSize: '0.7rem', color: '#4ade80', marginBottom: '0.2rem' }}>{card.plant}</div>
                <div style={{ fontSize: '1.1rem' }}>{ANIMAL_EMOJIS[card.animal] || '🐾'}</div>
                <div style={{ fontSize: '0.7rem', color: '#fbbf24' }}>{card.animal}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#1a2744', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(96,165,250,0.15)', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
            <strong style={{ color: '#60a5fa' }}>💡 What does this tell us?</strong> Every student thought of different plants and animals — yet all are found in the same region! This shows us that biodiversity is all around us. There are <em>many more</em> species than we could even remember or count.
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={handleReset} style={{ background: '#334155', border: 'none', color: '#e2e8f0', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <RefreshCw size={14} /> Play Again
            </button>
            <button onClick={onBackToDashboard} style={{ background: '#2563eb', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
              Back to Chapter
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
