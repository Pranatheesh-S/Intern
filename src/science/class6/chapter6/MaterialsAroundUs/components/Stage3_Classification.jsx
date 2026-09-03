import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Check, Award, ArrowRight, BookOpen, Home, Utensils, AlertCircle } from 'lucide-react';

import itemRegister from '../images/b2_item_register.png';
import itemDuster from '../images/b2_item_duster.png';
import itemRemote from '../images/b2_item_remote.png';
import itemTshirt from '../images/b2_item_tshirt.png';
import itemSpoon from '../images/b2_item_spoon.png';
import itemGlass from '../images/b2_item_glass.png';

// 4 New Evidence Images from src/assets/
import foilImg from '../../../../../assets/foil1.png';
import handkerchiefImg from '../../../../../assets/handkerchief1.png';
import notebookImg from '../../../../../assets/notebook1.png';
import cardboardImg from '../../../../../assets/cardboard1.png';

import bgShelfSchool from '../images/b2_shelf_school.png';
import bgShelfHome from '../images/b2_shelf_home.png';
import bgShelfKitchen from '../images/b2_shelf_kitchen.png';

// 6 NEW Basket Images from src/assets/
import imgBasketMetal from '../../../../../assets/metal basket.png';
import imgBasketGlass from '../../../../../assets/glass basket.png';
import imgBasketWood from '../../../../../assets/wood basket.png';
import imgBasketPlastic from '../../../../../assets/plastic baskettttt.png';
import imgBasketCloth from '../../../../../assets/cloth basket.png';
import imgBasketPaper from '../../../../../assets/paper basket.png';

export default function Stage3_Classification({ defaultPhase = 'use', onComplete, addXp }) {
  const phase = defaultPhase; // controlled externally via props
  const [usePlacements, setUsePlacements] = useState({});
  const [materialPlacements, setMaterialPlacements] = useState({});
  const [inspectedItems, setInspectedItems] = useState({});
  const [activeDemoId, setActiveDemoId] = useState('remote');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [draggingOverShelf, setDraggingOverShelf] = useState(null);
  const [draggingOverBasket, setDraggingOverBasket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const allItems = [
    { id: 'register', name: 'Attendance Register', icon: itemRegister, correctUse: 'School Shelf', correctMaterial: 'Paper', useHint: 'Think about where teachers take attendance.', materialHint: 'Think about what the pages of a register are made of.' },
    { id: 'duster', name: 'Blackboard Duster', icon: itemDuster, correctUse: 'School Shelf', correctMaterial: 'Wood', useHint: 'Think about where this is used to erase a chalkboard.', materialHint: 'Think about what the hard wooden handle/back is made of.' },
    { id: 'remote', name: 'TV Remote', icon: itemRemote, correctUse: 'Home Shelf', correctMaterial: 'Plastic', useHint: 'Think about where you watch TV.', materialHint: 'Think about what hard, light plastic material electronic casings are made of.' },
    { id: 'tshirt', name: 'T-Shirt', icon: itemTshirt, correctUse: 'Home Shelf', correctMaterial: 'Cloth', useHint: 'Think about where you keep your clothes.', materialHint: 'Think about what soft woven fabric clothes are made from.' },
    { id: 'spoon', name: 'Spoon', icon: itemSpoon, correctUse: 'Kitchen Shelf', correctMaterial: 'Metal', useHint: 'Think about where you eat your meals.', materialHint: 'Think about what shiny, hard metallic material is used for cutlery.' },
    { id: 'glass', name: 'Tumbler', icon: itemGlass, correctUse: 'Kitchen Shelf', correctMaterial: 'Glass', useHint: 'Think about where you usually drink water.', materialHint: 'Think about what transparent, breakable material is used for drinking.' },
    { id: 'foil', name: 'Aluminium Foil', icon: foilImg, correctUse: 'Kitchen Shelf', correctMaterial: 'Metal', useHint: 'Think about what is used to wrap warm food.', materialHint: 'Think about what shiny, thin metallic sheet this is made of.' },
    { id: 'handkerchief', name: 'Handkerchief', icon: handkerchiefImg, correctUse: 'Home Shelf', correctMaterial: 'Cloth', useHint: 'Think about what personal cloth item you carry.', materialHint: 'Think about what soft, woven fabric this is made of.' },
    { id: 'notebook', name: 'Notebook', icon: notebookImg, correctUse: 'School Shelf', correctMaterial: 'Paper', useHint: 'Think about what you write your notes in.', materialHint: 'Think about what the pages of a notebook are made of.' },
    { id: 'cardboard', name: 'Cardboard Piece', icon: cardboardImg, correctUse: 'School Shelf', correctMaterial: 'Paper', useHint: 'Think about sturdy packaging sheets used in projects.', materialHint: 'Think about what heavy paper pulp/fiber material boxes are made from.' }
  ];

  const items = phase === 'material' ? allItems : allItems.slice(0, 6);

  const materialBaskets = [
    { name: 'Metal', label: 'METAL BASKET', color: 'var(--lesson-secondary)', borderColor: 'var(--lesson-muted)', bgLight: 'var(--lesson-background)', image: imgBasketMetal },
    { name: 'Glass', label: 'GLASS BASKET', color: '#0891b2', borderColor: 'var(--lesson-accent)', bgLight: 'var(--lesson-accent-bg)', image: imgBasketGlass },
    { name: 'Wood', label: 'WOOD BASKET', color: 'var(--lesson-accent)', borderColor: 'var(--lesson-warning)', bgLight: 'var(--lesson-warning-bg)', image: imgBasketWood },
    { name: 'Plastic', label: 'PLASTIC BASKET', color: 'var(--lesson-success)', borderColor: 'var(--lesson-success)', bgLight: 'var(--lesson-success-bg)', image: imgBasketPlastic },
    { name: 'Cloth', label: 'CLOTH BASKET', color: 'var(--lesson-danger)', borderColor: 'var(--lesson-danger)', bgLight: 'var(--lesson-danger-bg)', image: imgBasketCloth },
    { name: 'Paper', label: 'PAPER BASKET', color: '#6366f1', borderColor: '#818cf8', bgLight: '#eef2ff', image: imgBasketPaper }
  ];

  const shelves = [
    { name: 'School Shelf', icon: <BookOpen size={18} />, bgImage: bgShelfKitchen },
    { name: 'Home Shelf', icon: <Home size={18} />, bgImage: bgShelfKitchen },
    { name: 'Kitchen Shelf', icon: <Utensils size={18} />, bgImage: bgShelfKitchen }
  ];

  const handleUseSort = (itemId, targetShelf) => {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;
    if (item.correctUse === targetShelf) {
      setUsePlacements(prev => ({ ...prev, [itemId]: targetShelf }));
      setErrorMessage('');
      addXp?.(5);
    } else {
      setErrorMessage(`"${item.name}" doesn't belong here. ${item.useHint}`);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const handleMaterialSort = (itemId, targetMaterial) => {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;
    if (item.correctMaterial === targetMaterial) {
      setMaterialPlacements(prev => ({ ...prev, [itemId]: targetMaterial }));
      setErrorMessage('');
      addXp?.(5);
    } else {
      setErrorMessage(`Incorrect material. ${item.materialHint}`);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const allUseSorted = Object.keys(usePlacements).length === 6;
  const allMaterialSorted = Object.keys(materialPlacements).length === 10;
  const inspectedCount = Object.keys(inspectedItems).length;
  const canFinishDemo = inspectedCount >= 3;

  const handleInspect = (id) => {
    setActiveDemoId(id);
    setInspectedItems(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (phase === 'use' && allUseSorted) {
      onComplete();
    } else if (phase === 'material' && allMaterialSorted) {
      onComplete();
    } else if (phase === 'demo' && canFinishDemo) {
      onComplete();
    }
  }, [phase, allUseSorted, allMaterialSorted, canFinishDemo, onComplete]);

  const getDemoProperties = (id) => {
    switch (id) {
      case 'register':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Paper 📄' },
          { label: 'Surface Texture', value: 'Smooth & Flexible ☁️' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'duster':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Wood 🪵' },
          { label: 'Surface Texture', value: 'Hard back, soft front ☁️' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'remote':
        return [
          { label: 'Primary Use', value: 'Home Item 🏠' },
          { label: 'Base Material', value: 'Plastic 🧪' },
          { label: 'Surface Texture', value: 'Hard & Smooth 💎' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'tshirt':
        return [
          { label: 'Primary Use', value: 'Home Item 🏠' },
          { label: 'Base Material', value: 'Cloth 🧶' },
          { label: 'Surface Texture', value: 'Soft & Flexible 👕' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'spoon':
        return [
          { label: 'Primary Use', value: 'Kitchen Item 🍳' },
          { label: 'Base Material', value: 'Metal 🦾' },
          { label: 'Surface Texture', value: 'Hard & Lustrous ✨' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'glass':
        return [
          { label: 'Primary Use', value: 'Kitchen Item 🍳' },
          { label: 'Base Material', value: 'Glass 💎' },
          { label: 'Surface Texture', value: 'Hard & Smooth ✨' },
          { label: 'Transparency', value: 'Transparent 🔍' }
        ];
      case 'foil':
        return [
          { label: 'Primary Use', value: 'Kitchen Item 🍳' },
          { label: 'Base Material', value: 'Metal 🦾' },
          { label: 'Surface Texture', value: 'Smooth & Reflective ✨' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'handkerchief':
        return [
          { label: 'Primary Use', value: 'Home Item 🏠' },
          { label: 'Base Material', value: 'Cloth 🧶' },
          { label: 'Surface Texture', value: 'Soft & Flexible 👕' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'notebook':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Paper 📄' },
          { label: 'Surface Texture', value: 'Smooth & Bound 📖' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'cardboard':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Paper 📦' },
          { label: 'Surface Texture', value: 'Rough & Stiff 📦' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      default:
        return [];
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', flex: 1, minHeight: 0 }}>
      {/* Dynamic phase header */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--lesson-accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: '900', color: 'var(--heading-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutGrid size={24} style={{ color: 'var(--lesson-accent)' }} /> 
          {phase === 'briefing' && 'Case Briefing: Stage 1 Report'}
          {phase === 'use' && 'Case File 02 – Organizing by Purpose'}
          {phase === 'material' && 'Case File 02 – Scientific Classification'}
          {phase === 'demo' && 'Case File 02 – Multi-Property Insights'}
        </h3>
        <p style={{ margin: 0, fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: '600', color: 'var(--heading-sub)', lineHeight: '1.5' }}>
          {phase === 'briefing' && 'Review your findings from the classroom scan before analyzing them.'}
          {phase === 'use' && 'Drag collected items to shelves, or select them based on how they are used.'}
          {phase === 'material' && 'Drag items from the evidence tray to the correct material basket.'}
          {phase === 'demo' && 'Inspect how the same objects fit into different groups depending on the property we look at.'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Phase 0: Briefing */}
        {phase === 'briefing' && (
          <motion.div
            key="briefing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-panel"
            style={{
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1.5rem',
              maxWidth: '650px',
              margin: '2rem auto'
            }}
          >
            <div style={{ fontSize: 'clamp(40px, 5vw, 48px)' }}>🕵️‍♂️</div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--heading-main)', fontSize: 'clamp(30px, 3.5vw, 36px)', fontWeight: '900' }}>Investigation Report: Stage 1</h3>
              <p style={{ color: 'var(--heading-sub)', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: '600', marginTop: '0.5rem' }}>
                You have successfully identified the base materials of all classroom evidence.
              </p>
            </div>

            <div style={{ 
              width: '100%', 
              background: 'var(--lesson-surface)', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              border: '1px solid var(--lesson-border)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              textAlign: 'left'
            }}>
              {allItems.slice(0, 6).map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '700', color: 'var(--lesson-text)' }}>
                  <span style={{ color: 'var(--lesson-success)' }}>✓</span>
                  <strong>{item.name}:</strong> 
                  <span style={{ color: 'var(--lesson-accent)' }}>{item.correctMaterial}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', color: 'var(--lesson-secondary)', fontStyle: 'italic', maxWidth: '520px', lineHeight: '1.5' }}>
              "Excellent work, Detective! Now that we know what these objects are made of, we must analyze and organize them to reveal scientific property patterns."
            </div>

            <button
              className="primary"
              onClick={() => {}}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontSize: 'clamp(17px, 2.5vw, 20px)', fontWeight: '800' }}
            >
              Start Evidence Analysis <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Phase 1: Organize by USE */}
        {phase === 'use' && (
          <motion.div
            key="use"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1.25rem', 
              flex: 1, 
              minHeight: 0 
            }}
          >
            {/* Left Section: Evidence Tray */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 0, padding: '1.1rem 1.25rem' }}>
              <h4 style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 30px)', fontWeight: '900', color: 'var(--heading-section)', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.5rem', flexShrink: 0 }}>
                Evidence Tray
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '0.75rem', flex: 1, minHeight: 0, boxSizing: 'border-box' }}>
                {items.map((item) => {
                  const isSorted = usePlacements[item.id] !== undefined;
                  return (
                    <div
                      key={item.id}
                      draggable={!isSorted}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      className="interactive-tray-item"
                      title={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '12px',
                        border: isSorted ? '2px solid rgba(16, 185, 129, 0.45)' : '1px solid var(--lesson-border)',
                        background: isSorted ? 'rgba(16, 185, 129, 0.05)' : 'var(--card-bg, var(--lesson-surface))',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        cursor: isSorted ? 'default' : 'grab',
                        opacity: isSorted ? 0.35 : 1,
                        position: 'relative',
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '70%',
                          objectFit: 'contain',
                          pointerEvents: 'none'
                        }}
                      />
                      <span
                        style={{
                          fontSize: 'clamp(14px, 2vw, 17px)',
                          fontWeight: '800',
                          color: 'var(--lesson-primary)',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          marginTop: '0.25rem',
                          pointerEvents: 'none'
                        }}
                      >
                        {item.name}
                      </span>
                      {isSorted && (
                        <div style={{ position: 'absolute', top: 6, right: 6, background: 'var(--lesson-success)', borderRadius: '50%', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Section: Shelves */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 0, padding: '1.1rem 1.25rem' }}>
              <h4 style={{ margin: 0, fontSize: 'calc(var(--text-xl) * 1.1)', fontWeight: '800', color: 'var(--heading-section)', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.5rem', flexShrink: 0 }}>
                Shelves (Organize by Use)
              </h4>
              <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '0.65rem', flex: 1, minHeight: 0 }}>
                {shelves.map((shelf) => {
                  const sortedHere = items.filter(i => usePlacements[i.id] === shelf.name);
                  const isDraggingOverMe = draggingOverShelf === shelf.name;

                  return (
                    <div
                      key={shelf.name}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (draggingOverShelf !== shelf.name) {
                          setDraggingOverShelf(shelf.name);
                        }
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setDraggingOverShelf(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingOverShelf(null);
                        const droppedId = e.dataTransfer.getData('text/plain');
                        handleUseSort(droppedId, shelf.name);
                      }}
                      style={{
                        position: 'relative',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.9rem',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                        border: isDraggingOverMe ? '2px solid var(--lesson-accent)' : '1px solid var(--lesson-border)',
                        background: 'var(--lesson-primary)'
                      }}
                    >
                      {/* Shelf Background Image */}
                      <img 
                        src={shelf.bgImage} 
                        alt={shelf.name}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 62%',
                          pointerEvents: 'none'
                        }}
                      />
                      {isDraggingOverMe && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(59, 130, 246, 0.25)', zIndex: 1, pointerEvents: 'none' }} />
                      )}

                      {/* Header Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'white', fontWeight: 'bold', fontSize: '0.95rem', background: 'rgba(0,0,0,0.7)', padding: '0.3rem 0.75rem', borderRadius: '8px', alignSelf: 'flex-start', backdropFilter: 'blur(6px)', zIndex: 2, position: 'relative' }}>
                        {shelf.icon}
                        <span>{shelf.name}</span>
                      </div>
                      
                      {/* Placed Items on Shelf Surface */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: '18px',
                          display: 'flex',
                          gap: '2.5rem',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          zIndex: 2,
                          pointerEvents: 'none'
                        }}
                      >
                        {sortedHere.map((item) => (
                          <motion.div
                            initial={{ opacity: 0, y: -15, scale: 0.85 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                            key={item.id}
                            title={item.name}
                            style={{
                              width: '135px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              flexShrink: 0,
                              pointerEvents: 'auto',
                              cursor: 'default',
                              position: 'relative'
                            }}
                          >
                            {/* Polished Physical Evidence Card Frame */}
                            <div
                              style={{
                                width: '104px',
                                height: '104px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '2px solid rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.25)',
                                background: 'var(--lesson-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}
                            >
                              <img 
                                src={item.icon} 
                                alt={item.name} 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover',
                                  display: 'block',
                                  pointerEvents: 'none'
                                }} 
                              />
                            </div>

                            {/* Realistic Soft Contact Shadow on Shelf Wood */}
                            <div 
                              style={{
                                width: '92px',
                                height: '6px',
                                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 80%)',
                                borderRadius: '50%',
                                marginTop: '-2px',
                                marginBottom: '3px',
                                filter: 'blur(1.2px)'
                              }}
                            />

                            {/* Label */}
                              <span
                                style={{
                                  fontSize: 'clamp(14px, 2vw, 17px)',
                                  fontWeight: '800',
                                  color: '#FFFFFF',
                                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                                background: 'rgba(15, 23, 42, 0.92)',
                                backdropFilter: 'blur(4px)',
                                padding: '2px 10px',
                                borderRadius: '6px',
                                maxWidth: '130px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255,255,255,0.25)'
                              }}
                            >
                              {item.name}
                            </span>
                          </motion.div>
                        ))}
                        {sortedHere.length === 0 && (
                          <div
                            style={{
                              border: '2px dashed rgba(255,255,255,0.65)',
                              borderRadius: '10px',
                              padding: '0.5rem 1.8rem',
                              background: isDraggingOverMe ? 'rgba(59, 130, 246, 0.35)' : 'rgba(0,0,0,0.28)',
                              color: 'rgba(255,255,255,0.95)',
                              fontSize: 'clamp(15px, 2.2vw, 19px)',
                              fontWeight: '600',
                              backdropFilter: 'blur(2px)',
                              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              marginBottom: '10px'
                            }}
                          >
                            {isDraggingOverMe ? 'Drop item here!' : 'Drop items here'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Error messages overlay / Tips */}
              {errorMessage ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.3rem 0.6rem', borderRadius: '6px', color: 'var(--lesson-danger)', fontSize: 'clamp(13px, 1.8vw, 16px)', fontWeight: '600' }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              ) : allUseSorted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', padding: '0.3rem 0.6rem', borderRadius: '6px', color: 'var(--lesson-success)', fontWeight: 'bold', fontSize: 'clamp(13px, 1.8vw, 16px)' }}>
                  <Check size={16} />
                  <span>All objects grouped successfully! Click "Proceed to next" in the bottom right corner!</span>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}

        {/* Phase 2: Organize by MATERIAL (Scientific Classification) */}
        {phase === 'material' && (
          <motion.div
            key="material"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1,
              minHeight: 0,
              width: '100%',
              position: 'relative'
            }}
          >
            {/* FULL-WIDTH HORIZONTAL EVIDENCE TRAY */}
            <div style={{
              background: 'whitefff',
              borderRadius: '16px',
              padding: '12px 16px 14px 16px',
              border: '1px solid var(--lesson-border)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              flexShrink: 0
            }}>
              <div style={{
                fontSize: 'clamp(20px, 2.5vw, 24px)',
                fontWeight: '900',
                color: '#0f172a',
                letterSpacing: '-0.01em'
              }}>
                Evidence Tray
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                gap: '10px',
                width: '100%'
              }}>
                {items.map((item) => {
                  const isSorted = materialPlacements[item.id] !== undefined;
                  const isSelected = selectedItemId === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      draggable={!isSorted}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragEnd={() => {
                        setDraggingOverBasket(null);
                      }}
                      onClick={() => {
                        if (!isSorted) {
                          setSelectedItemId(isSelected ? null : item.id);
                        }
                      }}
                      className="evidence-item-card"
                      title={item.name}
                      style={{
                        borderRadius: '10px',
                        border: isSelected 
                          ? '2px solid #6366f1' 
                          : isSorted 
                            ? '1px solid rgba(16, 185, 129, 0.4)' 
                            : '1px solid var(--lesson-border)',
                        background: isSorted ? 'var(--lesson-background)' : 'whitefff',
                        opacity: isSorted ? 0.45 : 1,
                        cursor: isSorted ? 'default' : 'grab',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        userSelect: 'none',
                        position: 'relative',
                        boxShadow: isSelected ? '0 0 0 2px rgba(99, 102, 241, 0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'box-shadow 0.15s ease, border-color 0.15s ease, opacity 0.15s ease',
                        height: '118px'
                      }}
                    >
                      {/* Thumbnail Container */}
                      <div style={{
                        width: '100%',
                        height: '76px',
                        overflow: 'hidden',
                        background: 'var(--lesson-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        pointerEvents: 'none'
                      }}>
                        <img 
                          src={item.icon} 
                          alt={item.name} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            display: 'block',
                            pointerEvents: 'none'
                          }}
                        />
                      </div>

                      {/* Name Label */}
                      <div style={{
                        flex: 1,
                        padding: '4px 4px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'whitefff',
                        pointerEvents: 'none'
                      }}>
                        <span style={{
                          fontSize: 'clamp(14.7px, 1.07vw, 18.3px)',
                          fontWeight: '700',
                          color: 'var(--lesson-primary)',
                          lineHeight: '1.2',
                          textAlign: 'center',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          pointerEvents: 'none'
                        }}>
                          {item.name}
                        </span>
                      </div>

                      {/* Sorted Check Overlay */}
                      {isSorted && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(16, 185, 129, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(1px)',
                          pointerEvents: 'none'
                        }}>
                          <Check size={28} color="whitefff" strokeWidth={3.5} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SIX LARGE HORIZONTAL BASKET CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
              gap: '14px',
              width: '100%',
              flex: 1,
              minHeight: 0
            }}>
              {materialBaskets.map((basket) => {
                const sortedHere = items.filter(i => materialPlacements[i.id] === basket.name);
                const isDraggingOverMe = draggingOverBasket === basket.name;
                
                return (
                  <div
                    key={basket.name}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (draggingOverBasket !== basket.name) {
                        setDraggingOverBasket(basket.name);
                      }
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setDraggingOverBasket(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDraggingOverBasket(null);
                      const droppedId = e.dataTransfer.getData('text/plain');
                      handleMaterialSort(droppedId, basket.name);
                    }}
                    onClick={() => {
                      if (selectedItemId) {
                        handleMaterialSort(selectedItemId, basket.name);
                        setSelectedItemId(null);
                      }
                    }}
                    style={{
                      background: 'whitefff',
                      borderRadius: '16px',
                      border: '2px solid',
                      borderColor: isDraggingOverMe ? basket.color : basket.borderColor,
                      boxShadow: isDraggingOverMe 
                        ? `0 0 0 4px ${basket.bgLight}, 0 8px 24px rgba(0,0,0,0.12)` 
                        : '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      height: '100%',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                      cursor: selectedItemId ? 'pointer' : 'default',
                      position: 'relative',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Basket Image Area */}
                    <div style={{
                      flex: 1,
                      minHeight: 0,
                      width: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      background: 'var(--lesson-background)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none'
                    }}>
                      <img 
                        src={basket.image} 
                        alt={basket.label}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 40%',
                          display: 'block',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>

                    {/* White Drop Area Below Basket Image */}
                    <div style={{
                      height: '76px',
                      minHeight: '76px',
                      maxHeight: '76px',
                      background: isDraggingOverMe ? basket.bgLight : 'whitefff',
                      borderTop: '1px solid var(--lesson-surface)',
                      borderBottom: '1px solid var(--lesson-surface)',
                      padding: '6px 8px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      transition: 'background 0.15s ease',
                      pointerEvents: 'none'
                    }}>
                      {sortedHere.length === 0 ? (
                        <span style={{ fontSize: 'clamp(12px, 1.5vw, 15px)', fontWeight: '600', color: 'var(--lesson-muted)', fontStyle: 'italic', textAlign: 'center', pointerEvents: 'none' }}>
                          {isDraggingOverMe ? 'Drop item here!' : 'Drop items here'}
                        </span>
                      ) : (
                        sortedHere.map((item) => (
                          <div
                            key={item.id}
                            title={item.name}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '8px',
                              border: `1.5px solid ${basket.borderColor}`,
                              background: 'whitefff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              position: 'relative',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                              padding: '2px',
                              boxSizing: 'border-box',
                              flexShrink: 0,
                              pointerEvents: 'none'
                            }}
                          >
                            <img 
                              src={item.icon} 
                              alt={item.name} 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                objectPosition: 'center',
                                display: 'block',
                                borderRadius: '5px',
                                pointerEvents: 'none'
                              }} 
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: '1px',
                              right: '1px',
                              background: 'var(--lesson-success)',
                              borderRadius: '50%',
                              width: '13px',
                              height: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              pointerEvents: 'none'
                            }}>
                              <Check size={8} color="whitefff" strokeWidth={3.5} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Bottom Label Card Footer */}
                    <div style={{
                      height: '42px',
                      minHeight: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      background: 'whitefff',
                      flexShrink: 0,
                      pointerEvents: 'none'
                    }}>
                      <span style={{
                        fontWeight: '800',
                        fontSize: 'clamp(13px, 1.5vw, 16px)',
                        color: basket.color,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        pointerEvents: 'none'
                      }}>
                        {basket.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message Floating Toast */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(220, 38, 38, 0.95)',
                    color: 'whitefff',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: 'clamp(15px, 2.2vw, 19px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 50,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Phase 3: Multi-Property Inspection Demo */}
        {phase === 'demo' && (
          <motion.div
            key="demo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 220px) 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}
          >
            {/* Left list of items */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 'clamp(250px, 40vh, 500px)', minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '800', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Select Object to Inspect</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, overflowY: 'auto' }}>
                {items.map((item) => {
                  const isInspected = inspectedItems[item.id];
                  const isActive = activeDemoId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleInspect(item.id)}
                      className={isActive ? 'primary' : 'outline'}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.2rem',
                        borderRadius: '8px',
                        fontSize: 'clamp(15px, 2.2vw, 19px)',
                        fontWeight: '700',
                        textAlign: 'left',
                        overflow: 'hidden'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', overflow: 'hidden' }}>
                        <div style={{ width: '20px', height: '20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--lesson-surface)', borderRadius: '4px' }}>
                          <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                        </div>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{item.name}</span>
                      </span>
                      {isInspected && (
                        <span style={{ fontSize: 'clamp(13px, 1.8vw, 16px)', fontWeight: '600', color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--lesson-success)', paddingLeft: '24px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          ✓ Seen
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'var(--lesson-muted)', borderTop: '1px solid var(--lesson-border)', paddingTop: '0.5rem', flexShrink: 0 }}>
                Objects Inspected: <strong>{inspectedCount} / 3</strong>
              </div>
            </div>

            {/* Right Card / Demo Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Profile Card */}
              <div className="glass-panel" style={{ background: 'var(--lesson-card)', border: '1px solid var(--lesson-accent)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.75rem' }}>
                  <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--lesson-surface)', borderRadius: '12px', border: '1px solid var(--lesson-border)' }}>
                    <img src={items.find(i => i.id === activeDemoId)?.icon} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--heading-main)', fontSize: 'clamp(22px, 3vw, 26px)', fontWeight: '900' }}>
                      {items.find(i => i.id === activeDemoId)?.name}
                    </h3>
                    <span style={{ fontSize: 'clamp(15px, 2.2vw, 19px)', fontWeight: '600', color: 'var(--lesson-muted)' }}>Multi-Property Classification Profile</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {getDemoProperties(activeDemoId).map((prop, idx) => (
                    <div key={idx} style={{ background: 'var(--lesson-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--lesson-border)' }}>
                      <span style={{ display: 'block', fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'var(--lesson-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                        {prop.label}
                      </span>
                      <span style={{ fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '800', color: 'var(--lesson-text)', marginTop: '0.3rem', display: 'block' }}>
                        {prop.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conclusion Box */}
              {canFinishDemo ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel"
                  style={{
                    background: 'var(--lesson-card)',
                    border: '2px solid var(--lesson-success-border)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <h4 style={{ margin: 0, color: 'var(--lesson-success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(19px, 2.5vw, 23px)', fontWeight: '900' }}>
                    <Award size={22} /> Lesson Outcomes Confirmed!
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: '600', color: 'var(--lesson-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--lesson-success)' }}>✔</span>
                      <span>Classification depends entirely on the property selected.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--lesson-success)' }}>✔</span>
                      <span>The same object belongs to different categories simultaneously.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--lesson-success)' }}>✔</span>
                      <span>There is no single correct way to classify objects.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--lesson-success)' }}>✔</span>
                      <span>Scientists choose properties based on their study goals.</span>
                    </div>
                  </div>
                  <p style={{ marginTop: '0.75rem', fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: '800', color: 'var(--lesson-text)', textAlign: 'right' }}>
                    Click "Proceed to next" in the bottom right corner!
                  </p>
                </motion.div>
              ) : (
                <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--lesson-surface)', border: '1px solid var(--lesson-border)' }}>
                  <span style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: '500', color: 'var(--lesson-muted)' }}>
                    🕵️‍♂️ <strong>Detective Mission:</strong> Click on at least <strong>{3 - inspectedCount} more</strong> objects in the left panel to examine how different criteria classify them.
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
