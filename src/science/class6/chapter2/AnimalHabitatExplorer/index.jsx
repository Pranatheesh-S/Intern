import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Award, Compass, HelpCircle, Check, CheckCircle2, GripVertical, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

import spiderMonkeyImg from '../../../../assets/wildlife/spider_monkey.jpg';
import goldenMahseerImg from '../../../../assets/golden_masheer.png';
import girCowImg from '../../../../assets/gir_cow.png';
import leopardFrogImg from '../../../../assets/frog.png';
import jungleCrowImg from '../../../../assets/wildlife/jungle_crow.jpg';

import treeCanopyImg from '../../../../assets/wildlife/tree_canopy.jpg';
import freshwaterPondImg from '../../../../assets/wildlife/freshwater_pond.jpg';
import openGrasslandImg from '../../../../assets/wildlife/open_grassland.jpg';
import pondShorelineImg from '../../../../assets/wildlife/pond_shoreline.jpg';
import nestingBranchesImg from '../../../../assets/wildlife/nesting_branches.jpg';

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
    svgIndex: 0,
    image: spiderMonkeyImg,
    tag: 'Arboreal Climber'
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
    svgIndex: 1,
    image: goldenMahseerImg,
    tag: 'Freshwater Swimmer'
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
    svgIndex: 2,
    image: girCowImg,
    tag: 'Grassland Grazer'
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
    svgIndex: 3,
    image: leopardFrogImg,
    tag: 'Amphibious Leaper'
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
    svgIndex: 4,
    image: jungleCrowImg,
    tag: 'Aerial Forager'
  }
];

const HABITATS = [
  { id: 'tree_canopy', name: 'Tree Canopy', image: treeCanopyImg, desc: 'Dense upper tree foliage & fruit branches' },
  { id: 'pond', name: 'Freshwater Pond', image: freshwaterPondImg, desc: 'Aquatic freshwater ecosystem' },
  { id: 'grassland', name: 'Open Grassland', image: openGrasslandImg, desc: 'Expansive sunlit plains & grazing pastures' },
  { id: 'pond_shore', name: 'Pond Shoreline', image: pondShorelineImg, desc: 'Moist shoreline wetland & damp bank' },
  { id: 'branches', name: 'Nesting Branches', image: nestingBranchesImg, desc: 'High forest canopy branches & perches' }
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
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
        backdropFilter: 'blur(16px)',
        borderRight: '1.5px solid rgba(167, 243, 208, 0.95)',
        padding: '1.35rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        color: '#0f172a'
      }}>
        <div>
          {/* Header Back Button */}
          <button
            onClick={onBackToDashboard}
            style={{
              background: '#ffffff',
              border: '1.5px solid rgba(167, 243, 208, 0.95)',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '1.05rem',
              fontWeight: 800,
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <ArrowLeft size={20} color="#0f172a" /> Back to Chapters
          </button>

          {/* Mission Deck */}
          <div style={{
            background: 'rgba(14, 165, 233, 0.18)',
            borderLeft: '4px solid #0284c7',
            padding: '1rem 1.15rem',
            borderRadius: '0 12px 12px 0',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 10px rgba(14, 165, 233, 0.15)',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            borderLeftWidth: '4px'
          }}>
            <strong style={{ color: '#0284c7', fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.06em' }}>
              Phase {phase} of 3:
            </strong>
            <span style={{ fontSize: '1.08rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.55', display: 'block' }}>
              {phase === 1 && 'Drag animals to their native environment match boxes.'}
              {phase === 2 && 'Deliver the correct nutritional diet to each animal.'}
              {phase === 3 && 'Identify adaptations by selecting the correct mode of movement.'}
            </span>
          </div>

          {/* Vertical Progress Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', marginBottom: '1.75rem' }}>
            {/* Step 1: Habitat Match */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: phase === 1 ? '1.16rem' : '1.05rem',
              color: phase >= 1 ? '#0f172a' : '#64748b',
              fontWeight: phase === 1 ? 900 : 700,
              background: phase === 1 ? 'rgba(14, 165, 233, 0.18)' : 'transparent',
              border: phase === 1 ? '1.5px solid rgba(56, 189, 248, 0.5)' : '1.5px solid transparent',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              boxShadow: phase === 1 ? '0 2px 10px rgba(14, 165, 233, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: phase > 1 ? '#16a34a' : (phase === 1 ? '#0284c7' : '#cbd5e1'),
                border: phase >= 1 ? '2px solid #38bdf8' : '1.5px solid #94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.92rem',
                fontWeight: 900,
                color: '#ffffff',
                boxShadow: phase === 1 ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none'
              }}>
                {phase > 1 ? <Check size={16} color="#ffffff" /> : '1'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>1 Habitat Match</span>
                {phase === 1 && (
                  <span style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 800, marginTop: '0.15rem' }}>Active Step: Classify 5 Animals</span>
                )}
              </div>
            </div>

            {/* Connecting line */}
            <div style={{ width: '2px', height: '14px', background: phase > 1 ? '#16a34a' : 'rgba(167, 243, 208, 0.95)', marginLeft: '19px' }} />

            {/* Step 2: Dietary Feeding */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: phase === 2 ? '1.16rem' : '1.05rem',
              color: phase >= 2 ? '#0f172a' : '#64748b',
              fontWeight: phase === 2 ? 900 : 700,
              background: phase === 2 ? 'rgba(14, 165, 233, 0.18)' : 'transparent',
              border: phase === 2 ? '1.5px solid rgba(56, 189, 248, 0.5)' : '1.5px solid transparent',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              boxShadow: phase === 2 ? '0 2px 10px rgba(14, 165, 233, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: phase > 2 ? '#16a34a' : (phase === 2 ? '#0284c7' : '#cbd5e1'),
                border: phase >= 2 ? '2px solid #38bdf8' : '1.5px solid #94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.92rem',
                fontWeight: 900,
                color: '#ffffff',
                boxShadow: phase === 2 ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none'
              }}>
                {phase > 2 ? <Check size={16} color="#ffffff" /> : '2'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>2 Dietary Feeding</span>
                {phase === 2 && (
                  <span style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 800, marginTop: '0.15rem' }}>Active Step: Deliver Diets</span>
                )}
              </div>
            </div>

            {/* Connecting line */}
            <div style={{ width: '2px', height: '14px', background: phase > 2 ? '#16a34a' : 'rgba(167, 243, 208, 0.95)', marginLeft: '19px' }} />

            {/* Step 3: Locomotion Adaptation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: phase === 3 ? '1.16rem' : '1.05rem',
              color: phase >= 3 ? '#0f172a' : '#64748b',
              fontWeight: phase === 3 ? 900 : 700,
              background: phase === 3 ? 'rgba(14, 165, 233, 0.18)' : 'transparent',
              border: phase === 3 ? '1.5px solid rgba(56, 189, 248, 0.5)' : '1.5px solid transparent',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              boxShadow: phase === 3 ? '0 2px 10px rgba(14, 165, 233, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: phase >= 3 ? '#0284c7' : '#cbd5e1',
                border: phase >= 3 ? '2px solid #38bdf8' : '1.5px solid #94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.92rem',
                fontWeight: 900,
                color: '#ffffff',
                boxShadow: phase >= 3 ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none'
              }}>3</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>3 Locomotion Adaptation</span>
                {phase === 3 && (
                  <span style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 800, marginTop: '0.15rem' }}>Active Step: Movement Modes</span>
                )}
              </div>
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
              background: '#f59e0b',
              border: 'none',
              color: '#1a0f05',
              padding: '0.9rem 1.1rem',
              borderRadius: '12px',
              fontSize: '1.12rem',
              fontWeight: 900,
              cursor: (
                (phase === 1 && !isHabitatPhaseDone) ||
                (phase === 2 && !isFeedingPhaseDone) ||
                (phase === 3 && !isMovementPhaseDone)
              ) ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: (
                (phase === 1 && !isHabitatPhaseDone) ||
                (phase === 2 && !isFeedingPhaseDone) ||
                (phase === 3 && !isMovementPhaseDone)
              ) ? 0.45 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {phase === 3 ? 'Get Certificate' : 'Proceed to Next Phase →'}
          </button>

          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              fontSize: '0.98rem',
              fontWeight: 800,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center',
              marginTop: '0.75rem',
              transition: 'color 0.2s'
            }}
          >
            Reset Adventure
          </button>
        </div>
      </aside>

      {/* Main Sandbox Interactive Field */}
      <main style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden'
      }}>
        {/* Phase 1 Canvas */}
        {phase === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'calc(40% - 0.75rem) calc(60% - 0.75rem)', gap: '1.5rem', height: '100%' }}>
            {/* Left: Animal Source cards list (40% width) */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(16px)'
            }}>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  color: '#0284c7',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>🐾</span> Drag Animals
                </h3>
                <span style={{ fontSize: '1.02rem', color: '#334155', fontWeight: '700', display: 'block', marginTop: '0.25rem' }}>
                  Drag each species to its matching native habitat
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                {ANIMALS.map(animal => {
                  const isMatched = matches[animal.id] !== null;
                  if (isMatched) return null;

                  return (
                    <div
                      key={animal.id}
                      draggable
                      onDragStart={(e) => handleDragStartAnimal(e, animal.id)}
                      style={{
                        background: '#ffffff',
                        border: '2px solid rgba(167, 243, 208, 0.95)',
                        borderRadius: '12px',
                        padding: '0.75rem 0.95rem',
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                          width: '64px',
                          height: '50px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1.5px solid rgba(167, 243, 208, 0.95)',
                          flexShrink: 0,
                          background: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '2px'
                        }}>
                          <img 
                            src={animal.image} 
                            alt={animal.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} 
                          />
                        </div>
                        <div>
                          <strong style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', display: 'block', lineHeight: '1.25' }}>
                            {animal.name}
                          </strong>
                          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0284c7', marginTop: '0.2rem', display: 'block' }}>
                            {animal.tag}
                          </span>
                        </div>
                      </div>
                      <GripVertical size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
                    </div>
                  );
                })}

                {isHabitatPhaseDone && (
                  <div style={{
                    padding: '1.1rem',
                    borderRadius: '12px',
                    background: 'rgba(220, 252, 231, 0.7)',
                    border: '2px solid #22c55e',
                    textAlign: 'center',
                    color: '#15803d',
                    fontWeight: 900,
                    fontSize: '1.1rem'
                  }}>
                    ✓ All 5 species matched to native habitats!
                  </div>
                )}
              </div>
            </div>

            {/* Right: Drop targets list (60% width - Realistic habitat cards) */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              borderRadius: '16px',
              padding: '1.25rem 1.35rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(16px)'
            }}>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: '#0284c7',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem'
                }}>
                  <span>🗺️</span> Environments
                </h3>
                <span style={{ fontSize: '1.02rem', color: '#334155', fontWeight: '700', display: 'block', marginTop: '0.25rem' }}>
                  Target ecological zones & living surroundings (Table 2.6)
                </span>
              </div>

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
                      background: animal 
                        ? 'rgba(240, 253, 244, 0.9)' 
                        : '#ffffff',
                      border: animal 
                        ? '2px solid #22c55e' 
                        : '2px dashed rgba(167, 243, 208, 0.95)',
                      borderRadius: '14px',
                      padding: '0.75rem 1rem',
                      minHeight: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: animal ? '0 4px 14px rgba(34, 197, 94, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    {/* Left: Real Habitat photograph & details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '74px',
                        height: '52px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1.5px solid rgba(167, 243, 208, 0.95)',
                        flexShrink: 0,
                        background: '#f0fdf4'
                      }}>
                        <img 
                          src={hab.image} 
                          alt={hab.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                        />
                      </div>
                      <div>
                        <strong style={{ fontSize: '1.22rem', fontWeight: 900, color: '#0f172a', display: 'block' }}>
                          {hab.name}
                        </strong>
                        <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: '700', display: 'block', marginTop: '0.2rem' }}>
                          {hab.desc}
                        </span>
                      </div>
                    </div>

                    {/* Right: Drop Target / Matched Animal Photo & Status */}
                    <div>
                      {animal ? (
                        <div style={{
                          background: 'rgba(220, 252, 231, 0.9)',
                          border: '1.5px solid #22c55e',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          color: '#15803d',
                          fontSize: '1.05rem',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)'
                        }}>
                          <CheckCircle2 size={18} color="#16a34a" />
                          <div style={{
                            width: '36px',
                            height: '28px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: '1px solid #16a34a',
                            background: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <img src={animal.image} alt={animal.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </div>
                          <span>{animal.name}</span>
                        </div>
                      ) : (
                        <div style={{
                          background: 'rgba(14, 165, 233, 0.1)',
                          border: '1.5px dashed rgba(56, 189, 248, 0.5)',
                          borderRadius: '8px',
                          padding: '0.5rem 0.95rem',
                          color: '#0284c7',
                          fontSize: '0.98rem',
                          fontWeight: 800,
                          whiteSpace: 'nowrap'
                        }}>
                          Drop animal here
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Phase 2 Canvas */}
        {phase === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', height: '100%' }}>
            {/* Left: Food sources */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0284c7' }}>Drag Nutrition items</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.85rem' }}>
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
                        background: '#ffffff',
                        border: '2px solid rgba(167, 243, 208, 0.95)',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        cursor: 'grab',
                        textAlign: 'center',
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                      }}
                    >
                      {food.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Animals to feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)', border: '2px solid rgba(167, 243, 208, 0.95)', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)' }}>
              <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>Feed Animals</h3>
              {ANIMALS.map(animal => {
                const isFed = feeding[animal.id];
                return (
                  <div
                    key={animal.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropAnimalFood(e, animal.id)}
                    style={{
                      background: isFed ? 'rgba(220, 252, 231, 0.7)' : '#ffffff',
                      border: isFed ? '2px solid #22c55e' : '2px dashed rgba(167, 243, 208, 0.95)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '1.05rem',
                      color: '#0f172a',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '38px',
                        height: '32px',
                        borderRadius: '5px',
                        overflow: 'hidden',
                        border: '1px solid rgba(167, 243, 208, 0.95)',
                        flexShrink: 0,
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img src={animal.image} alt={animal.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <strong style={{ fontSize: '1.12rem', fontWeight: 800 }}>{animal.name}</strong>
                    </div>
                    {isFed ? (
                      <span style={{ color: '#15803d', fontSize: '1.02rem', fontWeight: 900 }}>✓ Fed {animal.foodLabel}</span>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '0.92rem', fontWeight: 700 }}>Drag food here</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Phase 3 Canvas */}
        {phase === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.45rem',
              fontWeight: 900,
              color: '#0284c7',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
              padding: '0.85rem 1.35rem',
              borderRadius: '14px',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
            }}>
              Select Locomotion Adaptation (Activity 2.9)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {ANIMALS.map(animal => {
                const isCorrect = locomotion[animal.id] === animal.movement;

                return (
                  <div
                    key={animal.id}
                    style={{
                      background: '#ffffff',
                      border: '2px solid rgba(167, 243, 208, 0.95)',
                      borderRadius: '14px',
                      padding: '1.15rem 1.35rem',
                      display: 'grid',
                      gridTemplateColumns: '240px 1fr 150px',
                      alignItems: 'center',
                      gap: '1.25rem',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '50px',
                        height: '42px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1.5px solid rgba(167, 243, 208, 0.95)',
                        flexShrink: 0,
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2px'
                      }}>
                        <img src={animal.image} alt={animal.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', display: 'block', letterSpacing: '0.01em' }}>
                          {animal.name}
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#0284c7', marginTop: '0.2rem' }}>
                          In: {animal.habitatLabel}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                      {MOVEMENTS.map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => handleSelectMovement(animal.id, mode.id)}
                          style={{
                            background: locomotion[animal.id] === mode.id 
                              ? (mode.id === animal.movement ? '#16a34a' : '#dc2626')
                              : '#ffffff',
                            border: locomotion[animal.id] === mode.id
                              ? (mode.id === animal.movement ? '2px solid #16a34a' : '2px solid #dc2626')
                              : '2px solid rgba(167, 243, 208, 0.95)',
                            color: locomotion[animal.id] === mode.id ? '#ffffff' : '#0f172a',
                            padding: '0.65rem 1.05rem',
                            borderRadius: '10px',
                            fontSize: '1.02rem',
                            fontWeight: locomotion[animal.id] === mode.id ? 900 : 800,
                            cursor: 'pointer',
                            boxShadow: locomotion[animal.id] === mode.id
                              ? (mode.id === animal.movement ? '0 4px 14px rgba(22, 163, 74, 0.35)' : '0 4px 14px rgba(220, 38, 38, 0.35)')
                              : '0 2px 6px rgba(0, 0, 0, 0.04)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {mode.name}
                        </button>
                      ))}
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '1.05rem' }}>
                      {isCorrect ? (
                        <span style={{ color: '#16a34a', fontWeight: 900, fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          ✓ Adapt Ready
                        </span>
                      ) : locomotion[animal.id] !== null ? (
                        <span style={{ color: '#dc2626', fontWeight: 900, fontSize: '1.05rem' }}>
                          ✗ Incorrect
                        </span>
                      ) : (
                        <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '1.02rem', background: 'rgba(14, 165, 233, 0.18)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1.5px solid rgba(56, 189, 248, 0.4)', display: 'inline-block' }}>
                          Select mode
                        </span>
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
            background: 'rgba(248, 250, 252, 0.98)',
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
              background: 'rgba(14, 165, 233, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7',
              marginBottom: '1rem',
              boxShadow: '0 0 25px rgba(14, 165, 233, 0.3)',
              border: '2px solid rgba(56, 189, 248, 0.4)'
            }}>
              <Award size={48} />
            </div>

            <h2 style={{ color: '#0f172a', fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 900 }}>Adventure Complete!</h2>
            <h3 style={{ fontSize: '1.35rem', color: '#0284c7', margin: '0 0 1rem 0', fontWeight: 900 }}>Ecosystem Habitat Master</h3>

            <p style={{ fontSize: '1.15rem', color: '#334155', maxWidth: '520px', lineHeight: '1.6', margin: '0 0 2rem 0', fontWeight: 700 }}>
              Awesome job explorer! You successfully matched all animal species to their native habitats, met their feeding nutrition needs, and classified their physiological modes of locomotion.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleReset}
                className="outline"
                style={{
                  padding: '0.75rem 1.6rem',
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  border: '2px solid rgba(167, 243, 208, 0.95)',
                  color: '#0f172a',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                Reset Adventure
              </button>
              <button
                onClick={onBackToDashboard}
                style={{
                  padding: '0.75rem 1.85rem',
                  fontSize: '1.08rem',
                  background: '#f59e0b',
                  border: 'none',
                  color: '#1a0f05',
                  fontWeight: 900,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(245,158,11,0.4)'
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
