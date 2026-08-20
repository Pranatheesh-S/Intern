import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Activity2_1Game.css';
import grassImage from '../../../../assets/grass.png';
import roseImage from '../../../../assets/rose.png';
import sunflowerImage from '../../../../assets/sunflower.png';
import hibiscusImage from '../../../../assets/hibiscus.png';
import tulsiImage from '../../../../assets/tulsi.png';
import neemImage from '../../../../assets/neem.png';

const PLANT_CROPPED_IMAGES = {
  p1: hibiscusImage,
  p2: tulsiImage,
  p3: neemImage,
  p4: grassImage,
  p5: roseImage,
  p7: sunflowerImage,
  hibiscus: hibiscusImage,
  tulsi: tulsiImage,
  neem: neemImage,
  grass: grassImage,
  rose: roseImage,
  sunflower: sunflowerImage,
  Hibiscus: hibiscusImage,
  Tulsi: tulsiImage,
  Neem: neemImage,
  Grass: grassImage,
  Rose: roseImage,
  Sunflower: sunflowerImage,
};

// ─── DATA ───────────────────────────────────────────────────────────────────

const PLANTS_DATA = [
  {
    id: 'p1', name: 'Hibiscus', emoji: '🌺', color: '#ff6b8a',
    habitat: 'Garden', parts: ['Root', 'Stem', 'Leaf', 'Flower'],
    type: 'Shrub', food: 'Makes own food', movement: 'Rooted',
    fact: 'Hibiscus flowers have vibrant red petals and are common flowering shrubs! 🌺',
    desc: 'A flowering shrub with thin, hard, woody stems branching out close to the base.',
    observations: { stem: 'Thin, hard, woody stem branching near base', leaf: 'Green simple leaves with serrated margins', flower: 'Large, bright red flowers', other: 'Medium height shrub; branches close to ground' }
  },
  {
    id: 'p2', name: 'Tulsi', emoji: '🌿', color: '#7ec850',
    habitat: 'Home gardens', parts: ['Root', 'Stem', 'Leaf', 'Flower'],
    type: 'Herb', food: 'Makes own food', movement: 'Rooted',
    fact: 'Tulsi (Holy Basil) is worshipped in India and has powerful medicinal properties! 💚',
    desc: 'A sacred herb found in most Indian homes. Its leaves have a wonderful fragrance!',
    observations: { stem: 'Soft, green, non-woody herbaceous stem', leaf: 'Small, oval, highly aromatic simple leaves', flower: 'Tiny purple-white flowers on vertical spikes', other: 'Short herb; medicinal plant found in home gardens' }
  },
  {
    id: 'p3', name: 'Neem', emoji: '🌳', color: '#228B22',
    habitat: 'Tropical region', parts: ['Root', 'Stem', 'Leaf', 'Flower'],
    type: 'Tree', food: 'Makes own food', movement: 'Rooted',
    fact: 'Neem tree is an evergreen medicinal tree known as the village pharmacy! 🌳',
    desc: 'A tall tree with a thick scaly trunk and broad leafy canopy.',
    observations: { stem: 'Thick, hard, scaly brown woody trunk with bark', leaf: 'Compound pinnate serrated green leaflets', flower: 'Small, white, fragrant flowers', other: 'Tall tree; evergreen with broad canopy' }
  },
  {
    id: 'p4', name: 'Grass', emoji: '🌱', color: '#44d62c',
    habitat: 'Grassland', parts: ['Root', 'Stem', 'Leaf'],
    type: 'Herb', food: 'Makes own food', movement: 'Rooted',
    fact: 'Bamboo is actually a type of grass and it grows super fast! 🌿',
    desc: 'A soft herb that covers fields and lawns. Most grasses have parallel leaf veins!',
    observations: { stem: 'Thin, green, soft, hollow stem', leaf: 'Long, narrow leaves with parallel vein patterns', flower: 'Tiny inconspicuous spikelets', other: 'Very short herb; covers lawns, fibrous roots' }
  },
  {
    id: 'p5', name: 'Rose', emoji: '🌹', color: '#e11d48',
    habitat: 'Garden', parts: ['Root', 'Stem', 'Leaf', 'Flower'],
    type: 'Shrub', food: 'Makes own food', movement: 'Rooted',
    fact: 'Roses have been grown for over 5,000 years! 🌹',
    desc: 'A beautiful flowering shrub with thorny stems.',
    observations: { stem: 'Thin woody stem with sharp thorns', leaf: 'Compound leaves with serrated edges', flower: 'Pink or red fragrant rose blooms', other: 'Medium height shrub with thorny branches' }
  },
  {
    id: 'p6', name: 'Mango Tree', emoji: '🥭', color: '#ffa040',
    habitat: 'Tropical forest', parts: ['Root', 'Stem', 'Leaf', 'Flower', 'Fruit'],
    type: 'Tree', food: 'Makes own food', movement: 'Rooted',
    fact: 'Mango is called the "King of Fruits" in India! 🥭',
    desc: 'A tall tropical tree that gives juicy mangoes.',
    observations: { stem: 'Thick & tall trunk', leaf: 'Long, lance-shaped leaves', flower: 'Small, yellowish flowers', other: 'Deep taproot system' }
  },
  {
    id: 'p7', name: 'Sunflower', emoji: '🌻', color: '#f59e0b',
    habitat: 'Garden / Fields', parts: ['Root', 'Stem', 'Leaf', 'Flower', 'Seed'],
    type: 'Herb', food: 'Makes own food', movement: 'Rooted',
    fact: 'Sunflowers exhibit heliotropism — young sunflowers follow the sun from east to west every day! 🌻',
    desc: 'A tall flowering plant with broad green leaves and a large yellow flower head.',
    observations: { 
      stem: 'Tall, strong, green stem with a rough, slightly hairy surface', 
      leaf: 'Large, broad green leaves with a rough texture and prominent veins', 
      flower: 'Large bright yellow flower head with a dark brown central disc', 
      other: 'Tall flowering plant; flower head turns toward sunlight; produces edible seeds' 
    }
  }
];

const ANIMALS_DATA = [
  {
    id: 'a1', name: 'Dog', emoji: '🐕', color: '#c4834a',
    habitat: 'Land', food: 'Meat & grains', movement: 'Four legs',
    breathes: 'Lungs', covering: 'Fur',
    fact: 'Dogs have an amazing sense of smell 40 times stronger than humans! 🐕',
    desc: 'A friendly mammal that lives with humans. It wags its tail when happy!',
    wildOrPet: 'Pet', type: 'Mammal'
  },
  {
    id: 'a2', name: 'Fish', emoji: '🐟', color: '#4090ff',
    habitat: 'Water', food: 'Smaller fish & plants', movement: 'Fins',
    breathes: 'Gills', covering: 'Scales',
    fact: 'Fish never close their eyes because they do not have eyelids! 🐟',
    desc: 'A cold-blooded animal that lives in water. It breathes through gills!',
    wildOrPet: 'Wild', type: 'Fish'
  },
  {
    id: 'a3', name: 'Butterfly', emoji: '🦋', color: '#ff9500',
    habitat: 'Land', food: 'Nectar from flowers', movement: 'Wings',
    breathes: 'Tiny holes (spiracles)', covering: 'Scales on wings',
    fact: 'Butterflies taste with their feet! 🦋',
    desc: 'A beautiful insect that starts life as a caterpillar. It transforms through metamorphosis!',
    wildOrPet: 'Wild', type: 'Insect'
  },
  {
    id: 'a4', name: 'Frog', emoji: '🐸', color: '#4caf50',
    habitat: 'Land & Water', food: 'Insects', movement: 'Jumps & swims',
    breathes: 'Lungs & Skin', covering: 'Moist skin',
    fact: 'Frogs drink water through their skin, not their mouths! 🐸',
    desc: 'An amphibian that can live on land and in water. It starts life as a tadpole!',
    wildOrPet: 'Wild', type: 'Amphibian'
  },
  {
    id: 'a5', name: 'Sparrow', emoji: '🐦', color: '#c97b3a',
    habitat: 'Land', food: 'Seeds & insects', movement: 'Wings & two legs',
    breathes: 'Lungs', covering: 'Feathers',
    fact: 'Sparrows remember where they hide food even after weeks! 🐦',
    desc: 'A small bird that builds cozy nests near human homes. It chirps beautifully!',
    wildOrPet: 'Wild', type: 'Bird'
  },
  {
    id: 'a6', name: 'Cow', emoji: '🐄', color: '#8a6a4a',
    habitat: 'Land', food: 'Grass & hay', movement: 'Four legs',
    breathes: 'Lungs', covering: 'Skin with hair',
    fact: 'Cows have best friends and get stressed when they are separated! 🐄',
    desc: 'A domesticated mammal that gives us milk. It has four stomachs to digest grass!',
    wildOrPet: 'Pet', type: 'Mammal'
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 'q1', question: 'Which type of plant has a soft, green stem?',
    options: ['Tree', 'Shrub', 'Herb', 'Climber'],
    correct: 2, explanation: 'Herbs like grass and tulsi have soft, green stems. Trees have thick wooden trunks!',
    emoji: '🌿'
  },
  {
    id: 'q2', question: 'How do fish breathe underwater?',
    options: ['Through lungs', 'Through skin', 'Through gills', 'Through fins'],
    correct: 2, explanation: 'Fish have special organs called GILLS that filter oxygen from water. Cool, right? 🐟',
    emoji: '🐟'
  },
  {
    id: 'q3', question: 'Which animal lives BOTH on land AND in water?',
    options: ['Dog', 'Fish', 'Frog', 'Sparrow'],
    correct: 2, explanation: 'Frogs are amphibians, they can live on land AND in water! They breathe with lungs AND skin! 🐸',
    emoji: '🐸'
  },
  {
    id: 'q4', question: 'Plants make their own food using:',
    options: ['Water only', 'Soil and roots', 'Sunlight, water & air', 'Insects'],
    correct: 2, explanation: 'Plants use Sunlight + Water + Carbon dioxide from air to make food through PHOTOSYNTHESIS! 🌞',
    emoji: '🌱'
  },
  {
    id: 'q5', question: 'What do we call a plant that lives in the desert and stores water?',
    options: ['Mango', 'Cactus', 'Grass', 'Rose'],
    correct: 1, explanation: 'Cactus is a desert plant! Its thick stem stores hundreds of liters of water! 🌵',
    emoji: '🌵'
  }
];

// ─── SOUND ENGINE ─────────────────────────────────────────────────────────────

let audioCtx = null;
const getAudioCtx = () => {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
};

const playTone = (freq, type = 'sine', duration = 0.15, volume = 0.3) => {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

const playClick = () => playTone(440, 'sine', 0.08, 0.2);
const playSuccess = () => {
  [523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.18, 0.25), i * 100));
};
const playWrong = () => { playTone(200, 'sawtooth', 0.25, 0.2); };
const playStar = () => {
  [880, 1047, 1319].forEach((f, i) => setTimeout(() => playTone(f, 'triangle', 0.15, 0.3), i * 80));
};
const playComplete = () => {
  [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => playTone(f, 'sine', 0.2, 0.35), i * 120));
};

// ─── CONFETTI ────────────────────────────────────────────────────────────────

const triggerConfetti = () => {
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;left:${Math.random()*100}vw;top:-10px;
      width:${6 + Math.random()*8}px;height:${6 + Math.random()*8}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation:confettiFall ${1.5+Math.random()*2}s ease-in forwards;
      animation-delay:${Math.random()*0.5}s;
      z-index:99999;
      transform:rotate(${Math.random()*360}deg);
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

const StarRating = ({ count }) => (
  <div className="a21-star-row">
    {[1, 2, 3].map(i => (
      <span key={i} className={`a21-star ${i <= count ? 'a21-star--lit' : 'a21-star--dim'}`}>
        {i <= count ? '⭐' : '☆'}
      </span>
    ))}
  </div>
);

const XPBadge = ({ xp }) => (
  <div className="a21-xp-badge">
    <span>⚡</span>
    <span>{xp} XP</span>
  </div>
);

const ProfessorBuddy = ({ mood = 'idle', message = '' }) => (
  <div className={`a21-professor a21-professor--${mood}`}>
    <div className="a21-buddy-avatar">
      <div className="a21-buddy-body">🥼</div>
      <div className="a21-buddy-face">
        {mood === 'celebrate' ? '😄' : mood === 'thinking' ? '🤔' : mood === 'happy' ? '😊' : '🧑‍🔬'}
      </div>
      <div className="a21-buddy-wave">{mood === 'celebrate' ? '🎊' : '👋'}</div>
    </div>
    {message && (
      <div className="a21-speech-bubble">
        <p>{message}</p>
      </div>
    )}
  </div>
);

const PopupCard = ({ item, type, onClose }) => {
  const [lightboxImage, setLightboxImage] = useState(null);
  useEffect(() => { playClick(); }, []);
  if (!item) return null;
  const croppedSrc = PLANT_CROPPED_IMAGES[item.id] || PLANT_CROPPED_IMAGES[item.name];

  if (type === 'plant') {
    return (
      <div className="a21-popup-overlay a21-popup-overlay--fullscreen" onClick={onClose}>
        <div className="a21-popup-card a21-popup-card--fullscreen" onClick={e => e.stopPropagation()}>
          <button className="a21-popup-close" onClick={onClose} style={{ zIndex: 100 }}>✕</button>
          
          {/* LEFT SIDE — Plant Image */}
          <div className="a21-popup-left">
            {croppedSrc ? (
              <img 
                src={croppedSrc} 
                alt={item.name} 
                className="a21-popup-plant-img"
              />
            ) : (
              <div className="a21-popup-emoji" style={{ fontSize: '8rem' }}>{item.emoji}</div>
            )}
          </div>

          {/* RIGHT SIDE — Existing Observation Content */}
          <div className="a21-popup-right">
            <h2 className="a21-popup-title">{item.name}</h2>
            <p className="a21-popup-desc">{item.desc}</p>
            <div className="a21-popup-tags">
              <span className="a21-popup-tag">🏠 {item.habitat}</span>
              <span className="a21-popup-tag">🌿 {item.type}</span>
              <span className="a21-popup-tag">☀️ Makes own food</span>
            </div>
            <div className="a21-obs-grid">
              <h4>🔍 Observations:</h4>
              <div className="a21-obs-items">
                {Object.entries(item.observations).map(([k, v]) => (
                  <div key={k} className="a21-obs-item">
                    <span className="a21-obs-key">{k}</span>
                    <span className="a21-obs-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="a21-funfact">
              <span>💡</span>
              <p><strong>Fun Fact:</strong> {item.fact}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="a21-popup-overlay" onClick={onClose}>
        <div className="a21-popup-card" onClick={e => e.stopPropagation()}>
          <button className="a21-popup-close" onClick={onClose}>✕</button>
          <div className="a21-popup-emoji">{item.emoji}</div>
          <h2 className="a21-popup-title">{item.name}</h2>
          <p className="a21-popup-desc">{item.desc}</p>
          <div className="a21-popup-tags">
            <span className="a21-popup-tag">🏠 {item.habitat}</span>
            <span className="a21-popup-tag">🦴 {item.type}</span>
            <span className="a21-popup-tag">🍽️ {item.food}</span>
          </div>
          <div className="a21-obs-grid">
            <h4>🔍 Observations:</h4>
            <div className="a21-obs-items">
              {[
                ['Moves by', item.movement],
                ['Breathes', item.breathes],
                ['Body covering', item.covering],
                ['Wild / Pet', item.wildOrPet]
              ].map(([k, v]) => (
                <div key={k} className="a21-obs-item">
                  <span className="a21-obs-key">{k}</span>
                  <span className="a21-obs-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="a21-funfact">
            <span>💡</span>
            <p><strong>Fun Fact:</strong> {item.fact}</p>
          </div>
        </div>
      </div>

      {/* Full-Screen Image Viewer / Lightbox */}
      {lightboxImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setLightboxImage(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setLightboxImage(null)}
              title="Close full-screen view"
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                zIndex: 10,
                background: 'rgba(15, 23, 42, 0.9)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
              }}
            >
              ✕
            </button>
            <img 
              src={lightboxImage.src} 
              alt={lightboxImage.alt} 
              style={{ 
                maxWidth: '90vw', 
                maxHeight: '85vh', 
                objectFit: 'contain', 
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                border: '1.5px solid rgba(255, 255, 255, 0.2)'
              }} 
            />
          </div>
        </div>
      )}
    </>
  );
};

const ProgressBar = ({ current, total, label }) => (
  <div className="a21-progress">
    <div className="a21-progress-label">{label}: {current}/{total}</div>
    <div className="a21-progress-track">
      <div className="a21-progress-fill" style={{ width: `${(current / total) * 100}%` }} />
    </div>
  </div>
);

const DidYouKnow = ({ show, fact, emoji }) => {
  if (!show) return null;
  return (
    <div className="a21-dyk">
      <div className="a21-dyk-icon">{emoji}</div>
      <div>
        <strong>Did You Know? 💡</strong>
        <p>{fact}</p>
      </div>
    </div>
  );
};

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────

const IntroScreen = ({ onStart }) => {
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  return (
    <div className={`a21-screen a21-intro ${entered ? 'a21-screen--in' : ''}`}>
      {/* Animated particles */}
      {['🌿','🦋','🌸','🐦','🌺','🐸','🍃','⭐','🌼','🐝'].map((em, i) => (
        <div key={i} className="a21-particle" style={{
          '--pd': `${i * 0.4}s`, '--px': `${8 + i * 9}%`, '--ps': `${1.5 + (i%3)*0.7}rem`
        }}>{em}</div>
      ))}

      {/* Clouds */}
      {[1,2,3].map(n => <div key={n} className={`a21-cloud a21-cloud--${n}`}>☁️</div>)}

      {/* Sun */}
      <div className="a21-sun">☀️</div>

      <div className="a21-intro-content">
        <ProfessorBuddy mood="happy" message="Hi! I'm Professor Buddy! Let's explore the living world together! 🔬" />

        <div className="a21-intro-title-block">
          <div className="a21-chapter-badge">CBSE Class 6 · Chapter 2</div>
          <h1 className="a21-main-title">
            <span>🌍</span>
            <span>Diversity in the</span>
            <span className="a21-title-highlight">Living World</span>
          </h1>
          <div className="a21-activity-badge">🔬 Activity 2.1 — Plants & Animals Around Us</div>
          <p className="a21-intro-sub">
            Explore amazing plants 🌿 and fascinating animals 🐾 around you!
            Click, discover, and learn through adventures!
          </p>
        </div>

        <div className="a21-features">
          {[
            { icon: '🌿', label: 'Explore 6 Plants' },
            { icon: '🐾', label: 'Discover 6 Animals' },
            { icon: '📋', label: 'Fill Science Tables' },
            { icon: '🎯', label: 'Fun Quiz' },
            { icon: '⭐', label: 'Earn Stars & XP' },
            { icon: '🏆', label: 'Get Certificate' },
          ].map((f, i) => (
            <div key={i} className="a21-feature" style={{ '--fi': i }}>
              <span className="a21-feature-icon">{f.icon}</span>
              <span className="a21-feature-label">{f.label}</span>
            </div>
          ))}
        </div>

        <button className="a21-start-btn" onClick={() => { playSuccess(); onStart(); }}>
          <span>🚀</span>
          Start Learning!
          <span className="a21-btn-arrow">→</span>
        </button>
      </div>

      {/* Ground strip */}
      <div className="a21-ground">
        {['🌿','🌸','🌺','🌻','🍀','🌾','🌱'].map((p, i) => (
          <span key={i} className="a21-ground-plant" style={{ '--gi': i }}>{p}</span>
        ))}
      </div>
    </div>
  );
};

// ─── PLANTS EXPLORER ─────────────────────────────────────────────────────────

const PlantsExplorer = ({ onComplete, xp, setXp, stars, setStars }) => {
  const [discovered, setDiscovered] = useState(new Set());
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [tableEntries, setTableEntries] = useState({});
  const [dyk, setDyk] = useState({ show: false, fact: '', emoji: '' });

  const facts = [
    { fact: 'Plants make food using sunlight — called PHOTOSYNTHESIS!', emoji: '☀️' },
    { fact: 'A large tree can drink up to 100 liters of water every day!', emoji: '💧' },
    { fact: 'There are over 390,000 known species of plants on Earth!', emoji: '🌿' },
    { fact: 'The oldest tree on Earth is over 5,000 years old!', emoji: '🌳' },
  ];

  const handlePlantClick = (plant) => {
    playClick();
    setSelectedPlant(plant);
    if (!discovered.has(plant.id)) {
      const next = new Set(discovered);
      next.add(plant.id);
      setDiscovered(next);
      setXp(p => p + 15);
      playStar();
      if (next.size >= 3) setStars(p => Math.min(3, p + 1));
      if (next.size === 6) { playComplete(); triggerConfetti(); }
      if (next.size % 2 === 0) {
        const f = facts[Math.floor(Math.random() * facts.length)];
        setTimeout(() => { setDyk({ show: true, ...f }); setTimeout(() => setDyk(d => ({...d, show:false})), 4000); }, 700);
      }
    }
  };

  const addToTable = (plant) => {
    if (!tableEntries[plant.id]) {
      setTableEntries(p => ({ ...p, [plant.id]: plant }));
      setXp(p => p + 10);
      playSuccess();
    }
  };

  const allDiscovered = discovered.size === PLANTS_DATA.length;
  const tableCount = Object.keys(tableEntries).length;

  return (
    <div className="a21-screen a21-plants-screen">
      <div className="a21-screen-header">
        <div className="a21-screen-badge a21-badge--plants">🌿 Part A: Plants Explorer</div>
        <div className="a21-stats">
          <XPBadge xp={xp} />
          <StarRating count={stars} />
        </div>
      </div>

      <ProfessorBuddy
        mood={allDiscovered ? 'celebrate' : 'pointing'}
        message={allDiscovered
          ? 'Amazing! You found all plants! Now add them to Table 2.1! 📋'
          : `Tap each plant to explore! ${PLANTS_DATA.length - discovered.size} more to discover! 🌿`}
      />

      <ProgressBar current={discovered.size} total={PLANTS_DATA.length} label="Plants Discovered" />

      {/* Garden Scene */}
      <div className="a21-garden">
        <div className="a21-garden-sky" />
        <div className="a21-garden-ground-strip" />
        <div className="a21-plants-grid">
          {PLANTS_DATA.map((plant, i) => {
            const isDisc = discovered.has(plant.id);
            return (
              <div
                key={plant.id}
                className={`a21-plant-card ${isDisc ? 'a21-plant-card--disc' : ''}`}
                style={{ '--pc': plant.color, '--pi': i }}
                onClick={() => handlePlantClick(plant)}
              >
                <div className="a21-plant-glow" />
                <div className="a21-plant-emoji">{plant.emoji}</div>
                <div className="a21-plant-name">{plant.name}</div>
                <div className="a21-plant-type">{plant.type}</div>
                {isDisc
                  ? <div className="a21-disc-badge">✓ Discovered!</div>
                  : <div className="a21-tap-hint">Tap to explore!</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Table 2.1 */}
      {discovered.size >= 2 && (
        <div className="a21-table-section">
          <h3 className="a21-table-title">📋 Table 2.1 — Plants Around Us</h3>
          <div className="a21-sci-table">
            <div className="a21-table-head">
              <div>Plant</div><div>Type</div><div>Habitat</div><div>Has Flower?</div><div>Root</div>
            </div>
            {Object.values(tableEntries).map(p => (
              <div key={p.id} className="a21-table-row">
                <div>{p.emoji} {p.name}</div>
                <div>{p.type}</div>
                <div>{p.habitat}</div>
                <div>{p.parts.includes('Flower') ? '✅ Yes' : '❌ No'}</div>
                <div>{p.observations.root}</div>
              </div>
            ))}
            {tableCount === 0 && <div className="a21-table-empty">Discover plants above, then add them here! 🌱</div>}
          </div>
          <div className="a21-add-btns">
            {PLANTS_DATA.filter(p => discovered.has(p.id) && !tableEntries[p.id]).map(plant => (
              <button key={plant.id} className="a21-add-btn" style={{ '--pc': plant.color }} onClick={() => addToTable(plant)}>
                {plant.emoji} Add {plant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {allDiscovered && tableCount >= 4 && (
        <div className="a21-section-complete">
          <div>🎆</div>
          <h3>🎉 Plants Explorer Complete!</h3>
          <p>You found all 6 plants and filled your table! Next stop — Animals! 🐾</p>
          <button className="a21-next-btn" onClick={() => { playComplete(); onComplete(); }}>
            Explore Animals 🐾 →
          </button>
        </div>
      )}

      <DidYouKnow show={dyk.show} fact={dyk.fact} emoji={dyk.emoji} />

      {selectedPlant && (
        <PopupCard item={selectedPlant} type="plant" onClose={() => {
          const p = selectedPlant;
          setSelectedPlant(null);
          if (discovered.has(p.id)) addToTable(p);
        }} />
      )}
    </div>
  );
};

// ─── ANIMALS EXPLORER ────────────────────────────────────────────────────────

const AnimalsExplorer = ({ onComplete, xp, setXp, stars, setStars }) => {
  const [discovered, setDiscovered] = useState(new Set());
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [tableEntries, setTableEntries] = useState({});
  const [dyk, setDyk] = useState({ show: false, fact: '', emoji: '' });
  const [dragItem, setDragItem] = useState(null);
  const [zones, setZones] = useState({ Land: [], Water: [], 'Land & Water': [] });
  const [sortDone, setSortDone] = useState(false);

  const facts = [
    { fact: 'Bees communicate by dancing! They do a waggle dance to tell others where flowers are!', emoji: '🐝' },
    { fact: 'Sharks have been on Earth for over 450 million years, older than dinosaurs!', emoji: '🦈' },
    { fact: 'Elephants are the only animals that cannot jump!', emoji: '🐘' },
    { fact: 'Parrots can learn to speak over 100 words!', emoji: '🦜' },
  ];

  const handleAnimalClick = (animal) => {
    playClick();
    setSelectedAnimal(animal);
    if (!discovered.has(animal.id)) {
      const next = new Set(discovered);
      next.add(animal.id);
      setDiscovered(next);
      setXp(p => p + 15);
      playStar();
      if (next.size === ANIMALS_DATA.length) { setStars(p => Math.min(3, p + 1)); playComplete(); }
      if (next.size % 2 === 0) {
        const f = facts[Math.floor(Math.random() * facts.length)];
        setTimeout(() => { setDyk({ show: true, ...f }); setTimeout(() => setDyk(d => ({...d, show:false})), 4000); }, 700);
      }
    }
  };

  const addToTable = (animal) => {
    if (!tableEntries[animal.id]) {
      setTableEntries(p => ({ ...p, [animal.id]: animal }));
      setXp(p => p + 10);
      playSuccess();
    }
  };

  const handleDragStart = (e, animal) => {
    setDragItem(animal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, zone) => {
    e.preventDefault();
    if (!dragItem) return;
    const isCorrect = dragItem.habitat === zone;
    if (isCorrect) {
      setZones(prev => {
        const updated = {};
        Object.keys(prev).forEach(k => { updated[k] = prev[k].filter(a => a.id !== dragItem.id); });
        if (!updated[zone].find(a => a.id === dragItem.id)) updated[zone] = [...updated[zone], dragItem];
        return updated;
      });
      setXp(p => p + 20);
      playSuccess();
      const total = Object.values(zones).reduce((s, a) => s + a.length, 0) + 1;
      if (total >= 5) { setSortDone(true); setStars(p => Math.min(3, p + 1)); playComplete(); triggerConfetti(); }
    } else {
      playWrong();
    }
    setDragItem(null);
  };

  const allDiscovered = discovered.size === ANIMALS_DATA.length;
  const tableCount = Object.keys(tableEntries).length;

  return (
    <div className="a21-screen a21-animals-screen">
      <div className="a21-screen-header">
        <div className="a21-screen-badge a21-badge--animals">🐾 Part B: Animals Explorer</div>
        <div className="a21-stats">
          <XPBadge xp={xp} />
          <StarRating count={stars} />
        </div>
      </div>

      <ProfessorBuddy
        mood={allDiscovered ? 'celebrate' : 'happy'}
        message={allDiscovered
          ? 'Incredible! Found all animals! Now drag them to their habitats! 🗺️'
          : `Click each animal card to discover it! ${ANIMALS_DATA.length - discovered.size} left! 🐾`}
      />

      <ProgressBar current={discovered.size} total={ANIMALS_DATA.length} label="Animals Discovered" />

      {/* Animals field */}
      <div className="a21-animals-field">
        <div className="a21-field-sky" />
        <div className="a21-animals-grid">
          {ANIMALS_DATA.map((animal, i) => {
            const isDisc = discovered.has(animal.id);
            return (
              <div
                key={animal.id}
                className={`a21-animal-card ${isDisc ? 'a21-animal-card--disc' : ''}`}
                style={{ '--ac': animal.color, '--ai': i }}
                onClick={() => handleAnimalClick(animal)}
                draggable={isDisc}
                onDragStart={(e) => isDisc && handleDragStart(e, animal)}
              >
                <div className="a21-animal-emoji">{animal.emoji}</div>
                <div className="a21-animal-name">{animal.name}</div>
                <div className="a21-animal-type">{animal.type}</div>
                <div className="a21-habitat-pill">{animal.habitat}</div>
                {isDisc && <div className="a21-disc-badge">✓</div>}
                {isDisc && <div className="a21-drag-hint">Drag to sort! 🤏</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Habitat sorting zones */}
      {discovered.size >= 3 && (
        <div className="a21-sorting-section">
          <h3 className="a21-table-title">🗺️ Sort Animals by Habitat!</h3>
          <p className="a21-sort-hint">Drag and drop animals into the correct habitat zone!</p>
          <div className="a21-zones">
            {[
              { key: 'Land', emoji: '🌍', color: '#8B4513' },
              { key: 'Water', emoji: '💧', color: '#1E90FF' },
              { key: 'Land & Water', emoji: '🌊', color: '#20B2AA' },
            ].map(z => (
              <div
                key={z.key}
                className="a21-zone"
                style={{ '--zc': z.color }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDrop(e, z.key)}
              >
                <div className="a21-zone-header">{z.emoji} {z.key}</div>
                <div className="a21-zone-body">
                  {zones[z.key].map(a => (
                    <div key={a.id} className="a21-zone-animal">{a.emoji} {a.name}</div>
                  ))}
                  {zones[z.key].length === 0 && <div className="a21-zone-empty">Drop here!</div>}
                </div>
              </div>
            ))}
          </div>
          {sortDone && <div className="a21-sort-success">🎉 Great sorting! You understand habitats perfectly!</div>}
        </div>
      )}

      {/* Table 2.2 */}
      {discovered.size >= 2 && (
        <div className="a21-table-section">
          <h3 className="a21-table-title">📋 Table 2.2 — Animals Around Us</h3>
          <div className="a21-sci-table">
            <div className="a21-table-head">
              <div>Animal</div><div>Habitat</div><div>Food</div><div>Moves By</div><div>Breathes</div>
            </div>
            {Object.values(tableEntries).map(a => (
              <div key={a.id} className="a21-table-row">
                <div>{a.emoji} {a.name}</div>
                <div>{a.habitat}</div>
                <div>{a.food}</div>
                <div>{a.movement}</div>
                <div>{a.breathes}</div>
              </div>
            ))}
            {tableCount === 0 && <div className="a21-table-empty">Discover animals above, then add them here! 🐾</div>}
          </div>
          <div className="a21-add-btns">
            {ANIMALS_DATA.filter(a => discovered.has(a.id) && !tableEntries[a.id]).map(animal => (
              <button key={animal.id} className="a21-add-btn" style={{ '--pc': animal.color }} onClick={() => addToTable(animal)}>
                {animal.emoji} Add {animal.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {allDiscovered && tableCount >= 4 && (
        <div className="a21-section-complete">
          <div>🎆</div>
          <h3>🎉 Animals Explorer Complete!</h3>
          <p>You discovered all animals and filled Table 2.2! Ready for the quiz? 🎯</p>
          <button className="a21-next-btn" onClick={() => { playComplete(); onComplete(); }}>
            Take the Quiz! 🎯 →
          </button>
        </div>
      )}

      <DidYouKnow show={dyk.show} fact={dyk.fact} emoji={dyk.emoji} />

      {selectedAnimal && (
        <PopupCard item={selectedAnimal} type="animal" onClose={() => {
          const a = selectedAnimal;
          setSelectedAnimal(null);
          if (discovered.has(a.id)) addToTable(a);
        }} />
      )}
    </div>
  );
};

// ─── QUIZ SCREEN ─────────────────────────────────────────────────────────────

const QuizScreen = ({ onComplete, xp, setXp, stars, setStars }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [streak, setStreak] = useState(0);

  const q = QUIZ_QUESTIONS[current];

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isRight = idx === q.correct;
    if (isRight) {
      playSuccess();
      setCorrect(p => p + 1);
      setStreak(p => p + 1);
      setXp(p => p + 30);
    } else {
      playWrong();
      setStreak(0);
    }
  };

  const handleNext = () => {
    playClick();
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(p => p + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const finalScore = correct + (selected === q.correct ? 1 : 0);
      if (finalScore >= 4) setStars(p => Math.min(3, p + 1));
      if (finalScore === QUIZ_QUESTIONS.length) { playComplete(); triggerConfetti(); }
      setQuizDone(true);
    }
  };

  if (quizDone) {
    const score = correct;
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="a21-screen a21-quiz-done">
        <ProfessorBuddy mood="celebrate" message="You finished the quiz! Amazing work!" />
        <div className="a21-result-card">
          <div className="a21-result-emoji">{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '📚'}</div>
          <h2>Quiz Complete!</h2>
          <div className="a21-score">
            <span className="a21-score-num">{score}</span>
            <span className="a21-score-sep">/</span>
            <span className="a21-score-total">{QUIZ_QUESTIONS.length}</span>
          </div>
          <p>{pct >= 80 ? '🌟 Outstanding! You are a Science Star!' : pct >= 60 ? '👍 Great job! Keep exploring!' : '📖 Good try! Review the chapter again!'}</p>
          <XPBadge xp={xp} />
          <button className="a21-next-btn" onClick={() => { playComplete(); onComplete(score); }}>
            🏆 Get Your Certificate! →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="a21-screen a21-quiz-screen">
      <div className="a21-screen-header">
        <div className="a21-screen-badge a21-badge--quiz">🎯 Knowledge Quiz</div>
        <div className="a21-stats">
          <XPBadge xp={xp} />
          <StarRating count={stars} />
        </div>
      </div>

      <ProfessorBuddy
        mood={answered ? (selected === q.correct ? 'celebrate' : 'thinking') : 'pointing'}
        message={answered
          ? (selected === q.correct ? 'Correct! Brilliant! 🎉' : 'Not quite! Look at the explanation below! 💡')
          : 'Choose the best answer! Think carefully! 🤔'}
      />

      <div className="a21-quiz-progress">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div key={i} className={`a21-qdot ${i < current ? 'a21-qdot--done' : i === current ? 'a21-qdot--active' : ''}`} />
        ))}
      </div>

      {streak >= 2 && !answered && (
        <div className="a21-streak">🔥 {streak} correct in a row!</div>
      )}

      <div className="a21-question-card">
        <div className="a21-q-emoji">{q.emoji}</div>
        <div className="a21-q-counter">Question {current + 1} of {QUIZ_QUESTIONS.length}</div>
        <h2 className="a21-q-text">{q.question}</h2>
        <div className="a21-options">
          {q.options.map((opt, i) => {
            let cls = 'a21-option';
            if (answered) {
              if (i === q.correct) cls += ' a21-option--correct';
              else if (i === selected) cls += ' a21-option--wrong';
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={answered}>
                <span className="a21-opt-letter">{String.fromCharCode(65+i)}</span>
                <span className="a21-opt-text">{opt}</span>
                {answered && i === q.correct && <span className="a21-opt-mark">✓</span>}
                {answered && i === selected && i !== q.correct && <span className="a21-opt-mark a21-opt-mark--x">✗</span>}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`a21-explanation ${selected === q.correct ? 'a21-explanation--right' : 'a21-explanation--wrong'}`}>
            <span>{selected === q.correct ? '🌟' : '💡'}</span>
            <p>{q.explanation}</p>
          </div>
        )}

        {answered && (
          <button className="a21-next-btn" onClick={handleNext} style={{ marginTop: '1.5rem' }}>
            {current < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Results! 🏆'}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── CERTIFICATE SCREEN ──────────────────────────────────────────────────────

const CertificateScreen = ({ xp, stars, quizScore, onReplay, onBack }) => {
  useEffect(() => {
    playComplete();
    setTimeout(() => triggerConfetti(), 300);
    setTimeout(() => triggerConfetti(), 1200);
  }, []);

  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const badge = xp >= 200 ? '🥇 Gold' : xp >= 120 ? '🥈 Silver' : '🥉 Bronze';

  return (
    <div className="a21-screen a21-cert-screen">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="a21-firework" style={{
          '--fx': `${10 + i * 11}%`,
          '--fd': `${i * 0.3}s`,
          '--fc': ['#FFD700','#FF6B6B','#4ECDC4','#45B7D1'][i % 4]
        }} />
      ))}

      <ProfessorBuddy mood="celebrate" message="Congratulations, young scientist! You are amazing! 🌟🎉" />

      <div className="a21-cert-card">
        <div className="a21-cert-header">
          <div className="a21-cert-logo">🔬</div>
          <h1>Certificate of Achievement</h1>
          <p>FuturaX Interactive Science Lab</p>
        </div>

        <div className="a21-cert-body">
          <p>This certifies that you have successfully completed</p>
          <div className="a21-cert-activity">
            <div>🌍 Chapter 2: Diversity in the Living World</div>
            <div>🔬 Activity 2.1 — Plants & Animals Around Us</div>
          </div>
          <p className="a21-cert-class">CBSE Science · Grade 6</p>
        </div>

        <div className="a21-cert-scores">
          {[
            { icon: '⚡', val: xp, label: 'XP Earned' },
            { icon: '⭐', val: `${stars}/3`, label: 'Stars' },
            { icon: '🎯', val: `${quizScore}/5`, label: 'Quiz Score' },
          ].map(s => (
            <div key={s.label} className="a21-cert-score">
              <div className="a21-cert-score-icon">{s.icon}</div>
              <div className="a21-cert-score-val">{s.val}</div>
              <div className="a21-cert-score-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="a21-cert-badge">
          <div className="a21-badge-circle">{badge}</div>
          <div>Achievement Badge</div>
        </div>

        <div className="a21-cert-footer">
          <div>📅 {date}</div>
          <div>🏫 FuturaX · CBSE Grade 6</div>
        </div>
      </div>

      <div className="a21-cert-actions">
        <button className="a21-replay-btn" onClick={() => { playClick(); onReplay(); }}>🔄 Replay Activity</button>
        <button className="a21-home-btn" onClick={() => { playClick(); onBack(); }}>🏠 Back to Chapter</button>
      </div>
    </div>
  );
};

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function Activity2_1Game({ onBackToDashboard }) {
  const [screen, setScreen] = useState('intro');
  const [xp, setXp] = useState(0);
  const [stars, setStars] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const ref = useRef(null);

  const goTo = (s) => {
    playClick();
    setScreen(s);
    if (ref.current) ref.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="a21-game-wrap" ref={ref}>
      <button className="a21-back-float" onClick={() => { playClick(); onBackToDashboard?.(); }}>
        ← Back
      </button>

      {screen === 'intro' && <IntroScreen onStart={() => goTo('plants')} />}
      {screen === 'plants' && (
        <PlantsExplorer onComplete={() => goTo('animals')} xp={xp} setXp={setXp} stars={stars} setStars={setStars} />
      )}
      {screen === 'animals' && (
        <AnimalsExplorer onComplete={() => goTo('quiz')} xp={xp} setXp={setXp} stars={stars} setStars={setStars} />
      )}
      {screen === 'quiz' && (
        <QuizScreen onComplete={(s) => { setQuizScore(s); goTo('certificate'); }} xp={xp} setXp={setXp} stars={stars} setStars={setStars} />
      )}
      {screen === 'certificate' && (
        <CertificateScreen
          xp={xp} stars={stars} quizScore={quizScore}
          onReplay={() => { setXp(0); setStars(0); setQuizScore(0); goTo('intro'); }}
          onBack={() => onBackToDashboard?.()}
        />
      )}
    </div>
  );
}
