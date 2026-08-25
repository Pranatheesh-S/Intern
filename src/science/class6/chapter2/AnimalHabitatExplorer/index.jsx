import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Award, Compass, HelpCircle, Check, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

const ANIMALS = [
  {
    id: 'monkey',
    name: 'Spider Monkey',
    correctHabitat: 'tree_canopy',
    habitatLabel: 'Forest Tree Canopy',
    food: 'fruits',
    foodLabel: 'Wild Fruits & Seeds',
    movement: 'climb',
    movementLabel: 'Climbing/Swinging',
    hint: 'Lives high up in branches and loves sweet forest berries.',
    svgIndex: 0
  },
  {
    id: 'fish',
    name: 'Golden Mahseer (Fish)',
    correctHabitat: 'pond',
    habitatLabel: 'Freshwater Pond',
    food: 'algae',
    foodLabel: 'Water Plants & Algae',
    movement: 'swim',
    movementLabel: 'Swimming using fins',
    hint: 'Breathes through gills, lives entirely underwater.',
    svgIndex: 1
  },
  {
    id: 'cow',
    name: 'Gir Cow',
    correctHabitat: 'grassland',
    habitatLabel: 'Open Grassland',
    food: 'grass',
    foodLabel: 'Fresh Green Grass',
    movement: 'walk',
    movementLabel: 'Walking on four hooves',
    hint: 'Grazes on large plains and walks on sturdy hooves.',
    svgIndex: 2
  },
  {
    id: 'frog',
    name: 'Leopard Frog',
    correctHabitat: 'pond_shore',
    habitatLabel: 'Wet Pond Shore',
    food: 'insects',
    foodLabel: 'Flying Insects & Worms',
    movement: 'hop',
    movementLabel: 'Leaping/Hopping',
    hint: 'Likes moist banks, hops to catch bugs with a sticky tongue.',
    svgIndex: 3
  },
  {
    id: 'crow',
    name: 'Jungle Crow',
    correctHabitat: 'branches',
    habitatLabel: 'High Nesting Branches',
    food: 'seeds',
    foodLabel: 'Grains, Seeds & Scraps',
    movement: 'fly',
    movementLabel: 'Flying with wings',
    hint: 'Nests on topmost branches, flies long distances searching for grains.',
    svgIndex: 4
  }
];

const HABITATS = [
  { id: 'tree_canopy', name: 'Tree Canopy' },
  { id: 'pond', name: 'Freshwater Pond' },
  { id: 'grassland', name: 'Open Grassland' },
  { id: 'pond_shore', name: 'Pond Shoreline' },
  { id: 'branches', name: 'Nesting Branches' }
];

const FOODS = [
  { id: 'fruits', name: 'Fruits & Berries' },
  { id: 'algae', name: 'Algae & Water Plants' },
  { id: 'grass', name: 'Green Grass' },
  { id: 'insects', name: 'Insects & Bugs' },
  { id: 'seeds', name: 'Seeds & Grains' }
];

const MOVEMENTS = [
  { id: 'climb', name: 'Climb & Swing' },
  { id: 'swim', name: 'Swim with Fins' },
  { id: 'walk', name: 'Walk & Run' },
  { id: 'hop', name: 'Hop & Leap' },
  { id: 'fly', name: 'Fly with Wings' }
];

export default function AnimalHabitatExplorer({ onBackToDashboard, initialPhase = 1 }) {
  const [phase, setPhase] = useState(initialPhase); // 1: Habitat, 2: Feeding, 3: Movement
  const [draggedAnimalId, setDraggedAnimalId] = useState(null);
  const [draggedFoodId, setDraggedFoodId] = useState(null);
  
  // State for matching
  const [matches, setMatches] = useState({
    monkey: null, // target habitat
    fish: null,
    cow: null,
    frog: null,
    crow: null
  });

  const [feeding, setFeeding] = useState({
    monkey: false, // true when correctly fed
    fish: false,
    cow: false,
    frog: false,
    crow: false
  });

  const [locomotion, setLocomotion] = useState({
    monkey: null, // selected movement mode
    fish: null,
    cow: null,
    frog: null,
    crow: null
  });

  const [showCertificate, setShowCertificate] = useState(false);

  // Helper check methods
  const isHabitatPhaseDone = Object.keys(matches).every(k => matches[k] !== null && matches[k] === ANIMALS.find(a => a.id === k).correctHabitat);
  const isFeedingPhaseDone = Object.keys(feeding).every(k => feeding[k] === true);
  const isMovementPhaseDone = Object.keys(locomotion).every(k => locomotion[k] !== null && locomotion[k] === ANIMALS.find(a => a.id === k).movement);

  // Handlers for Phase 1 Drag & Drop
  const handleDragStartAnimal = (e, animalId) => {
    setDraggedAnimalId(animalId);
  };

  const handleDropHabitat = (e, habitatId) => {
    e.preventDefault();
    if (!draggedAnimalId) return;

    const animal = ANIMALS.find(a => a.id === draggedAnimalId);
    if (animal.correctHabitat === habitatId) {
      setMatches(prev => ({
        ...prev,
        [draggedAnimalId]: habitatId
      }));
    } else {
      // Shake or warning could go here
    }
    setDraggedAnimalId(null);
  };

  // Handlers for Phase 2 Drag & Drop
  const handleDragStartFood = (e, foodId) => {
    setDraggedFoodId(foodId);
  };

  const handleDropAnimalFood = (e, animalId) => {
    e.preventDefault();
    if (!draggedFoodId) return;

    const animal = ANIMALS.find(a => a.id === animalId);
    if (animal.food === draggedFoodId) {
      setFeeding(prev => ({
        ...prev,
        [animalId]: true
      }));
    }
    setDraggedFoodId(null);
  };

  // Handlers for Phase 3 Selection
  const handleSelectMovement = (animalId, movementId) => {
    setLocomotion(prev => ({
      ...prev,
      [animalId]: movementId
    }));
  };

  const handleNextPhase = () => {
    if (phase === 1 && isHabitatPhaseDone) {
      setPhase(2);
    } else if (phase === 2 && isFeedingPhaseDone) {
      setPhase(3);
    } else if (phase === 3 && isMovementPhaseDone) {
      setShowCertificate(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setMatches({ monkey: null, fish: null, cow: null, frog: null, crow: null });
    setFeeding({ monkey: false, fish: false, cow: false, frog: false, crow: false });
    setLocomotion({ monkey: null, fish: null, cow: null, frog: null, crow: null });
    setPhase(1);
    setShowCertificate(false);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      height: '100%',
      minHeight: '540px',
      backgroundImage: `url(${darkForestBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      color: '#f8fafc',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Sidebar Progress Controller */}
      <aside style={{
        background: 'rgba(30, 41, 59, 0.88)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto'
      }}>
        <div>
          {/* Header Back Button */}
          <button
            onClick={onBackToDashboard}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: 0,
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft size={16} /> Back to Chapters
          </button>

          {/* Mission Deck */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            borderLeft: '3px solid #38bdf8',
            padding: '0.75rem',
            borderRadius: '0 8px 8px 0',
            marginBottom: '1.25rem'
          }}>
            <strong style={{ color: '#bae6fd', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              Phase {phase} of 3:
            </strong>
            <span style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
              {phase === 1 && 'Drag animals to their native environment match boxes.'}
              {phase === 2 && 'Deliver the correct nutritional diet to each animal.'}
              {phase === 3 && 'Identify adaptations by selecting the correct mode of movement.'}
            </span>
          </div>

          {/* Phase Indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: phase >= 1 ? '#38bdf8' : '#64748b',
              fontWeight: phase === 1 ? 'bold' : 'normal'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: phase > 1 ? '#0ea5e9' : 'rgba(255,255,255,0.05)',
                border: '1px solid #0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem'
              }}>1</div>
              <span>Habitat Match</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: phase >= 2 ? '#38bdf8' : '#64748b',
              fontWeight: phase === 2 ? 'bold' : 'normal'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: phase > 2 ? '#0ea5e9' : 'rgba(255,255,255,0.05)',
                border: '1px solid #0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem'
              }}>2</div>
              <span>Dietary Feeding</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: phase >= 3 ? '#38bdf8' : '#64748b',
              fontWeight: phase === 3 ? 'bold' : 'normal'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid #0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem'
              }}>3</div>
              <span>Locomotion Adaptation</span>
            </div>
          </div>
        </div>

        {/* Phase Action Controller */}
        <div>
          <button
            onClick={handleNextPhase}
            disabled={
              (phase === 1 && !isHabitatPhaseDone) ||
              (phase === 2 && !isFeedingPhaseDone) ||
              (phase === 3 && !isMovementPhaseDone)
            }
            style={{
              width: '100%',
              background: '#0ea5e9',
              border: 'none',
              color: '#ffffff',
              padding: '0.6rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              opacity: (
                (phase === 1 && !isHabitatPhaseDone) ||
                (phase === 2 && !isFeedingPhaseDone) ||
                (phase === 3 && !isMovementPhaseDone)
              ) ? 0.4 : 1
            }}
          >
            {phase === 3 ? 'Get Certificate' : 'Proceed to Next Phase'}
          </button>

          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.75rem',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center',
              marginTop: '0.5rem'
            }}
          >
            Reset Adventure
          </button>
        </div>
      </aside>

      {/* Main Sandbox Interactive Field */}
      <main style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden'
      }}>
        {/* Phase 1 Canvas */}
        {phase === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', height: '100%' }}>
            {/* Left: Animal Source cards list */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#38bdf8' }}>Drag Animals</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {ANIMALS.map(animal => {
                  const isMatched = matches[animal.id] !== null;
                  if (isMatched) return null;

                  return (
                    <div
                      key={animal.id}
                      draggable
                      onDragStart={(e) => handleDragStartAnimal(e, animal.id)}
                      style={{
                        background: '#334155',
                        border: '1.5px solid #475569',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        cursor: 'grab',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      {animal.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Drop targets list */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              overflowY: 'auto'
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fbbf24' }}>Environments</h3>
              {HABITATS.map(hab => {
                // Find if an animal is matching this habitat
                const matchedAnimalId = Object.keys(matches).find(k => matches[k] === hab.id);
                const animal = matchedAnimalId ? ANIMALS.find(a => a.id === matchedAnimalId) : null;

                return (
                  <div
                    key={hab.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropHabitat(e, hab.id)}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1.5px dashed rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      padding: '1rem',
                      textAlign: 'center',
                      minHeight: '70px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {animal ? (
                      <div style={{
                        background: 'rgba(14, 165, 233, 0.15)',
                        border: '1px solid #0ea5e9',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        color: '#38bdf8',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Check size={14} /> {animal.name} → {hab.name}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Drop animal here for {hab.name}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Phase 2 Canvas */}
        {phase === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', height: '100%' }}>
            {/* Left: Food sources */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#38bdf8' }}>Drag Nutrition items</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {FOODS.map(food => {
                  const eatingAnimal = ANIMALS.find(a => a.food === food.id);
                  const isFoodUsed = eatingAnimal ? feeding[eatingAnimal.id] : false;
                  if (isFoodUsed) return null;

                  return (
                    <div
                      key={food.id}
                      draggable
                      onDragStart={(e) => handleDragStartFood(e, food.id)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #38bdf8',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        cursor: 'grab',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      {food.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Animals to feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#fbbf24' }}>Feed Animals</h3>
              {ANIMALS.map(animal => {
                const isFed = feeding[animal.id];
                return (
                  <div
                    key={animal.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropAnimalFood(e, animal.id)}
                    style={{
                      background: isFed ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255,255,255,0.03)',
                      border: isFed ? '1px solid #10b981' : '1px dashed rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem'
                    }}
                  >
                    <strong>{animal.name}</strong>
                    {isFed ? (
                      <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓ Fed {animal.foodLabel}</span>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Drag food here</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Phase 3 Canvas */}
        {phase === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#38bdf8' }}>Select Locomotion Adaptation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ANIMALS.map(animal => {
                const isCorrect = locomotion[animal.id] === animal.movement;

                return (
                  <div
                    key={animal.id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'grid',
                      gridTemplateColumns: '150px 1fr 120px',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <strong>{animal.name}</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>In: {animal.habitatLabel}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {MOVEMENTS.map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => handleSelectMovement(animal.id, mode.id)}
                          style={{
                            background: locomotion[animal.id] === mode.id 
                              ? (mode.id === animal.movement ? '#10b981' : '#ef4444')
                              : 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#ffffff',
                            padding: '0.35rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            cursor: 'pointer'
                          }}
                        >
                          {mode.name}
                        </button>
                      ))}
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                      {isCorrect ? (
                        <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓ Adapt Ready</span>
                      ) : locomotion[animal.id] !== null ? (
                        <span style={{ color: '#f87171' }}>✗ Incorrect</span>
                      ) : (
                        <span style={{ color: '#64748b' }}>Select mode</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Certificate Display */}
        {showCertificate && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            zIndex: 20
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              marginBottom: '1rem',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)'
            }}>
              <Award size={48} />
            </div>

            <h2 style={{ color: '#fbbf24', fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>Adventure Complete!</h2>
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', margin: '0 0 1rem 0' }}>Ecosystem Habitat Master</h3>

            <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '440px', lineHeight: '1.5', margin: '0 0 2rem 0' }}>
              Awesome job explorer! You successfully matched all animal species to their native habitats, met their feeding nutrition needs, and classified their physiological modes of locomotion.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleReset}
                className="outline"
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: 'none'
                }}
              >
                Reset Adventure
              </button>
              <button
                onClick={onBackToDashboard}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  background: '#fbbf24',
                  border: 'none',
                  color: '#022c22',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Back to Activities
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
