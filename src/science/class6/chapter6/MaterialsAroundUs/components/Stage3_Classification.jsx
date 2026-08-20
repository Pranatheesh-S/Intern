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
    { name: 'Metal', label: 'METAL BASKET', color: '#475569', borderColor: '#94a3b8', bgLight: '#f8fafc', image: imgBasketMetal },
    { name: 'Glass', label: 'GLASS BASKET', color: '#0891b2', borderColor: '#06b6d4', bgLight: '#ecfeff', image: imgBasketGlass },
    { name: 'Wood', label: 'WOOD BASKET', color: '#d97706', borderColor: '#f59e0b', bgLight: '#fffbeb', image: imgBasketWood },
    { name: 'Plastic', label: 'PLASTIC BASKET', color: '#16a34a', borderColor: '#22c55e', bgLight: '#f0fdf4', image: imgBasketPlastic },
    { name: 'Cloth', label: 'CLOTH BASKET', color: '#dc2626', borderColor: '#ef4444', bgLight: '#fef2f2', image: imgBasketCloth },
    { name: 'Paper', label: 'PAPER BASKET', color: '#6366f1', borderColor: '#818cf8', bgLight: '#eef2ff', image: imgBasketPaper }
  ];

  const handleUseSort = (itemId, targetShelf) => {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;
    if (item.correctUse === targetShelf) {
      setUsePlacements(prev => ({ ...prev, [itemId]: targetShelf }));
      setErrorMessage('');
      addXp(5);
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
      addXp(5);
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
      case 'chalk':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Chalk 🏔️' },
          { label: 'Surface Texture', value: 'Dusty & Brittle 🌫️' },
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
      case 'cricket_ball':
        return [
          { label: 'Primary Use', value: 'Home Item 🏠' },
          { label: 'Base Material', value: 'Leather 🏏' },
          { label: 'Surface Texture', value: 'Hard & Stitched 🧵' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'plate':
        return [
          { label: 'Primary Use', value: 'Kitchen Item 🍳' },
          { label: 'Base Material', value: 'Ceramic 🏺' },
          { label: 'Surface Texture', value: 'Hard & Smooth 🍽️' },
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
      default:
        return [];
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', flex: 1, minHeight: 0 }}>
      {/* Dynamic phase header */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutGrid size={22} style={{ color: 'var(--accent)' }} /> 
          {phase === 'briefing' && 'Case Briefing: Stage 1 Report'}
          {phase === 'use' && 'Case File 02 – Organizing by Purpose'}
          {phase === 'material' && 'Case File 02 – Scientific Classification'}
          {phase === 'demo' && 'Case File 02 – Multi-Property Insights'}
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
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
            <div style={{ fontSize: '3rem' }}>🕵️‍♂️</div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.75rem' }}>Investigation Report: Stage 1</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
                You have successfully identified the base materials of all classroom evidence.
              </p>
            </div>

            <div style={{ 
              width: '100%', 
              background: 'var(--surface)', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              border: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              textAlign: 'left'
            }}>
              {allItems.slice(0, 6).map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  <strong>{item.name}:</strong> 
                  <span style={{ color: 'var(--accent)' }}>{item.correctMaterial}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '520px', lineHeight: '1.5' }}>
              "Excellent work, Detective! Now that we know what these objects are made of, we must analyze and organize them to reveal scientific property patterns."
            </div>

            <button
              className="primary"
              onClick={() => {}}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontWeight: 'bold' }}
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
              <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-heading)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', flexShrink: 0 }}>
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
                        border: isSorted ? '2px solid rgba(16, 185, 129, 0.45)' : '1px solid var(--border)',
                        background: isSorted ? 'rgba(16, 185, 129, 0.05)' : 'var(--card-bg, #ffffff)',
                        opacity: isSorted ? 0.45 : 1,
                        cursor: isSorted ? 'default' : 'grab',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '6px 6px 8px 6px',
                        boxSizing: 'border-box',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                      }}
                    >
                      <div style={{ flex: 1, minHeight: 0, width: '100%', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                          src={item.icon} 
                          alt={item.name} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            pointerEvents: 'none' 
                          }} 
                        />
                      </div>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: '600', 
                        color: 'var(--text-heading, #1e293b)', 
                        textAlign: 'center', 
                        paddingTop: '8px', 
                        paddingBottom: '2px', 
                        maxWidth: '100%', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {item.name}
                      </span>
                      {isSorted && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)', borderRadius: '12px' }}>
                          <Check size={42} color="white" strokeWidth={3.5} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Section: Shelves visual + Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 0, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, justifyContent: 'space-between' }}>
                {[
                  { name: 'School Shelf', icon: <BookOpen size={16} />, bgImage: bgShelfKitchen },
                  { name: 'Home Shelf', icon: <Home size={16} />, bgImage: bgShelfKitchen },
                  { name: 'Kitchen Shelf', icon: <Utensils size={16} />, bgImage: bgShelfKitchen }
                ].map((shelf) => {
                  const sortedHere = items.filter(i => usePlacements[i.id] === shelf.name);
                  const isDraggingOverMe = draggingOverShelf === shelf.name;
                  return (
                    <div
                      key={shelf.name}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggingOverShelf !== shelf.name) {
                          setDraggingOverShelf(shelf.name);
                        }
                      }}
                      onDragLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setDraggingOverShelf(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingOverShelf(null);
                        const itemId = e.dataTransfer.getData('text/plain');
                        handleUseSort(itemId, shelf.name);
                      }}
                      style={{
                        position: 'relative',
                        borderRadius: '14px',
                        border: isDraggingOverMe ? '3px dashed var(--accent, #3b82f6)' : '1px solid var(--border)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.85rem',
                        minHeight: '140px',
                        flex: 1,
                        boxShadow: isDraggingOverMe 
                          ? '0 0 0 3px rgba(59, 130, 246, 0.35), 0 6px 14px rgba(0,0,0,0.15)' 
                          : '0 3px 8px rgba(0,0,0,0.08)',
                        transition: 'all 0.2s',
                        background: '#1e293b'
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
                          objectPosition: 'center 65%',
                          pointerEvents: 'none'
                        }}
                      />
                      {isDraggingOverMe && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(59, 130, 246, 0.25)', zIndex: 1, pointerEvents: 'none' }} />
                      )}

                      {/* Header Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fff', fontWeight: 'bold', fontSize: '0.95rem', background: 'rgba(0,0,0,0.7)', padding: '0.3rem 0.75rem', borderRadius: '8px', alignSelf: 'flex-start', backdropFilter: 'blur(6px)', zIndex: 2, position: 'relative' }}>
                        {shelf.icon}
                        <span>{shelf.name}</span>
                      </div>
                      
                      {/* Placed Items on Shelf Surface */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: '34px',
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
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              pointerEvents: 'auto',
                              cursor: 'default',
                              position: 'relative'
                            }}
                          >
                            {/* Object Image */}
                            <img 
                              src={item.icon} 
                              alt={item.name} 
                              style={{ 
                                width: '124px', 
                                height: '124px', 
                                objectFit: 'cover', 
                                borderRadius: '12px',
                                pointerEvents: 'none',
                                filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))',
                                border: '1.5px solid rgba(255,255,255,0.3)',
                                background: '#1e293b'
                              }} 
                            />

                            {/* Realistic Soft Contact Shadow on Shelf Wood */}
                            <div 
                              style={{
                                width: '112px',
                                height: '8px',
                                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 80%)',
                                borderRadius: '50%',
                                marginTop: '-4px',
                                marginBottom: '3px',
                                filter: 'blur(1.5px)'
                              }}
                            />

                            {/* Label */}
                            <span
                              style={{
                                fontSize: '0.84rem',
                                fontWeight: '700',
                                color: '#ffffff',
                                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                                background: 'rgba(15, 23, 42, 0.92)',
                                backdropFilter: 'blur(4px)',
                                padding: '2px 10px',
                                borderRadius: '6px',
                                maxWidth: '135px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255,255,255,0.2)'
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
                              fontSize: '0.88rem',
                              fontWeight: '500',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.85rem' }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              ) : allUseSorted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.92rem' }}>
                  <Check size={18} />
                  <span>All objects grouped successfully! Click "Proceed to next" in the bottom right corner!</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.35rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                  💡 <strong>Tip:</strong> Drag items from the Evidence Tray directly into the shelves based on where they are used.
                </div>
              )}
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
              background: '#ffffff',
              borderRadius: '16px',
              padding: '12px 16px 14px 16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              flexShrink: 0
            }}>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: '700',
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
                            : '1px solid #e2e8f0',
                        background: isSorted ? '#f8fafc' : '#ffffff',
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
                        background: '#f1f5f9',
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
                        background: '#ffffff',
                        pointerEvents: 'none'
                      }}>
                        <span style={{
                          fontSize: 'clamp(10px, 0.72vw, 12px)',
                          fontWeight: '700',
                          color: '#1e293b',
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
                          <Check size={28} color="#ffffff" strokeWidth={3.5} />
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
                      background: '#ffffff',
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
                      background: '#f8fafc',
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
                      background: isDraggingOverMe ? basket.bgLight : '#ffffff',
                      borderTop: '1px solid #f1f5f9',
                      borderBottom: '1px solid #f1f5f9',
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
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', pointerEvents: 'none' }}>
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
                              background: '#ffffff',
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
                              background: '#10b981',
                              borderRadius: '50%',
                              width: '13px',
                              height: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              pointerEvents: 'none'
                            }}>
                              <Check size={8} color="#ffffff" strokeWidth={3.5} />
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
                      background: '#ffffff',
                      flexShrink: 0,
                      pointerEvents: 'none'
                    }}>
                      <span style={{
                        fontWeight: '800',
                        fontSize: 'clamp(11.5px, 0.85vw, 14.5px)',
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
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
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
              <h4 style={{ margin: 0, fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Select Object to Inspect</h4>
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
                        fontSize: '0.9rem',
                        textAlign: 'left',
                        overflow: 'hidden'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', overflow: 'hidden' }}>
                        <div style={{ width: '20px', height: '20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--surface)', borderRadius: '4px' }}>
                          <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                        </div>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{item.name}</span>
                      </span>
                      {isInspected && (
                        <span style={{ fontSize: '0.78rem', color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--success)', paddingLeft: '24px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          ✓ Seen
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', flexShrink: 0 }}>
                Objects Inspected: <strong>{inspectedCount} / 3</strong>
              </div>
            </div>

            {/* Right Card / Demo Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Profile Card */}
              <div className="glass-panel" style={{ background: 'var(--card-bg)', border: '1px solid var(--accent)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <img src={items.find(i => i.id === activeDemoId)?.icon} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.5rem' }}>
                      {items.find(i => i.id === activeDemoId)?.name}
                    </h3>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Multi-Property Classification Profile</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {getDemoProperties(activeDemoId).map((prop, idx) => (
                    <div key={idx} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                        {prop.label}
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '0.3rem', display: 'block' }}>
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
                    background: 'var(--card-bg)',
                    border: '2px solid var(--success-border)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <h4 style={{ margin: 0, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
                    <Award size={22} /> Lesson Outcomes Confirmed!
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--success)' }}>✔</span>
                      <span>Classification depends entirely on the property selected.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--success)' }}>✔</span>
                      <span>The same object belongs to different categories simultaneously.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--success)' }}>✔</span>
                      <span>There is no single correct way to classify objects.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--success)' }}>✔</span>
                      <span>Scientists choose properties based on their study goals.</span>
                    </div>
                  </div>
                  <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'right' }}>
                    Click "Proceed to next" in the bottom right corner!
                  </p>
                </motion.div>
              ) : (
                <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
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
