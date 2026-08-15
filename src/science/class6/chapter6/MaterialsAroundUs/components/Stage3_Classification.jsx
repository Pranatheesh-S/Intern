import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Check, Award, ArrowRight, BookOpen, Home, Utensils, AlertCircle } from 'lucide-react';

import itemRegister from '../images/b2_item_register.png';
import itemDuster from '../images/b2_item_duster.png';
import itemRemote from '../images/b2_item_remote.png';
import itemTshirt from '../images/b2_item_tshirt.png';
import itemSpoon from '../images/b2_item_spoon.png';
import itemGlass from '../images/b2_item_glass.png';
import bgShelfSchool from '../images/b2_shelf_school.png';
import bgShelfHome from '../images/b2_shelf_home.png';
import bgShelfKitchen from '../images/b2_shelf_kitchen.png';
import imgBasketPaper from '../images/b2_basket_paper.png';
import imgBasketWood from '../images/b2_basket_wood.png';
import imgBasketPlastic from '../images/b2_basket_plastic.png';
import imgBasketMetal from '../images/b2_basket_metal.png';
import imgBasketGlass from '../images/b2_basket_glass.png';
import imgBasketCloth from '../images/b2_basket_cloth.png';

export default function Stage3_Classification({ defaultPhase = 'use', onComplete, addXp }) {
  const phase = defaultPhase; // controlled externally via props
  const [usePlacements, setUsePlacements] = useState({});
  const [materialPlacements, setMaterialPlacements] = useState({});
  const [inspectedItems, setInspectedItems] = useState({});
  const [activeDemoId, setActiveDemoId] = useState('remote');
  const [draggingOverShelf, setDraggingOverShelf] = useState(null);
  const [draggingOverBasket, setDraggingOverBasket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const allItems = [
    { id: 'register', name: 'Attendance Register', icon: itemRegister, correctUse: 'School Shelf', correctMaterial: 'Paper', useHint: 'Think about where teachers take attendance.', materialHint: 'Think about what the pages are made of.' },
    { id: 'duster', name: 'Blackboard Duster', icon: itemDuster, correctUse: 'School Shelf', correctMaterial: 'Wood', useHint: 'Think about where this is used to erase a chalkboard.', materialHint: 'Think about what the hard back part is usually made of.' },
    { id: 'remote', name: 'TV Remote', icon: itemRemote, correctUse: 'Home Shelf', correctMaterial: 'Plastic', useHint: 'Think about where you watch TV.', materialHint: 'Think about what hard, light material electronic casings are made of.' },
    { id: 'tshirt', name: 'T-Shirt', icon: itemTshirt, correctUse: 'Home Shelf', correctMaterial: 'Cloth', useHint: 'Think about where you keep your clothes.', materialHint: 'Think about what soft, woven material clothes are made from.' },
    { id: 'spoon', name: 'Spoon', icon: itemSpoon, correctUse: 'Kitchen Shelf', correctMaterial: 'Metal', useHint: 'Think about where you eat your meals.', materialHint: 'Think about what shiny, hard material is used for cutlery.' },
    { id: 'glass', name: 'Tumbler', icon: itemGlass, correctUse: 'Kitchen Shelf', correctMaterial: 'Glass', useHint: 'Think about where you usually drink water.', materialHint: 'Think about what transparent, breakable material is used for drinking.' }
  ];

  const items = allItems;

  const handleUseSort = (itemId, targetShelf) => {
    const item = items.find(i => i.id === itemId);
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
    const item = items.find(i => i.id === itemId);
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

  const allUseSorted = Object.keys(usePlacements).length === allItems.length;
  const allMaterialSorted = Object.keys(materialPlacements).length === items.length;
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
          {phase === 'material' && 'Drag items to their material baskets, or select the correct material.'}
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
              {items.slice(0, 6).map((item) => (
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
              onClick={() => setPhase('use')}
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
            style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 38%) 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}
          >
            {/* Left Drawer */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 0 }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', flexShrink: 0 }}>Evidence Tray</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.75rem', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
                {items.map((item) => {
                  const isSorted = usePlacements[item.id] !== undefined;
                  return (
                    <div
                      key={item.id}
                      draggable={!isSorted}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                      }}
                      className="interactive-tray-item"
                      title={item.name}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '12px',
                        border: '2px solid var(--border)',
                        background: 'var(--card-bg)',
                        opacity: isSorted ? 0.5 : 1,
                        cursor: isSorted ? 'default' : 'grab',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {isSorted && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={32} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Shelves visual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { name: 'School Shelf', icon: <BookOpen size={16} />, bgImage: bgShelfSchool },
                  { name: 'Home Shelf', icon: <Home size={16} />, bgImage: bgShelfHome },
                  { name: 'Kitchen Shelf', icon: <Utensils size={16} />, bgImage: bgShelfKitchen }
                ].map((shelf) => {
                  const sortedHere = items.filter(i => usePlacements[i.id] === shelf.name);
                  const isDraggingOverMe = draggingOverShelf === shelf.name;
                  return (
                    <div
                      key={shelf.name}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDraggingOverShelf(shelf.name);
                      }}
                      onDragLeave={() => setDraggingOverShelf(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingOverShelf(null);
                        const itemId = e.dataTransfer.getData('text/plain');
                        handleUseSort(itemId, shelf.name);
                      }}
                      style={{
                        background: `url(${shelf.bgImage}) center/cover`,
                        border: isDraggingOverMe ? '3px dashed var(--accent)' : '2px solid transparent',
                        borderRadius: '12px',
                        padding: '1rem',
                        minHeight: '160px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'all 0.2s',
                        boxShadow: isDraggingOverMe ? 'inset 0 0 0 1000px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)' : '0 4px 8px rgba(0,0,0,0.3)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', background: 'rgba(0,0,0,0.65)', padding: '0.4rem 0.8rem', borderRadius: '8px', alignSelf: 'flex-start', backdropFilter: 'blur(4px)' }}>
                        {shelf.icon}
                        <span>{shelf.name}</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-end', minHeight: '65px', paddingBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                        {sortedHere.map((item) => (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={item.id}
                            title={item.name}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-end',
                              filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.15))',
                              cursor: 'default'
                            }}
                          >
                            <div style={{ transform: 'translateY(1px)' }}>
                              <img src={item.icon} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.8)' }} />
                            </div>
                          </motion.div>
                        ))}
                        {sortedHere.length === 0 && (
                          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>Empty Shelf</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Error messages overlay */}
              {errorMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.8rem' }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Complete state message */}
              {allUseSorted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  <Check size={18} />
                  <span>All objects grouped successfully! Click "Proceed to next"</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                  💡 Tip: Drag items directly into the shelves, or use the drop-downs on the left.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Phase 2: Organize by MATERIAL */}
        {phase === 'material' && (
          <motion.div
            key="material"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 38%) 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}
          >
            {/* Left Drawer */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 0 }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', flexShrink: 0 }}>Evidence Tray</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.75rem', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
                {items.map((item) => {
                  const isSorted = materialPlacements[item.id] !== undefined;
                  return (
                    <div
                      key={item.id}
                      draggable={!isSorted}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                      }}
                      className="interactive-tray-item"
                      title={item.name}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '12px',
                        border: '2px solid var(--border)',
                        background: 'var(--card-bg)',
                        opacity: isSorted ? 0.5 : 1,
                        cursor: isSorted ? 'default' : 'grab',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {isSorted && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={32} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Illustrated Material Baskets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto' }}>
              {[
                { name: 'Paper', color: '#2563eb', icon: '📄', emoji: '♻️', bgLight: '#eff6ff', borderColor: '#93c5fd' },
                { name: 'Wood', color: '#92400e', icon: '🪵', emoji: '🪵', bgLight: '#fef3c7', borderColor: '#d97706' },
                { name: 'Plastic', color: '#16a34a', icon: '🧴', emoji: '♻️', bgLight: '#f0fdf4', borderColor: '#4ade80' },
                { name: 'Metal', color: '#64748b', icon: '🔩', emoji: '🔧', bgLight: '#f1f5f9', borderColor: '#94a3b8' },
                { name: 'Glass', color: '#0891b2', icon: '🥛', emoji: '♻️', bgLight: '#ecfeff', borderColor: '#67e8f9' },
                { name: 'Cloth', color: '#dc2626', icon: '👕', emoji: '👕', bgLight: '#fff1f2', borderColor: '#fca5a5' }
              ].map((basket) => {
                const sortedHere = items.filter(i => materialPlacements[i.id] === basket.name);
                const isDraggingOverMe = draggingOverBasket === basket.name;
                const basketImages = {
                  Paper: imgBasketPaper,
                  Wood: imgBasketWood,
                  Plastic: imgBasketPlastic,
                  Metal: imgBasketMetal,
                  Glass: imgBasketGlass,
                  Cloth: imgBasketCloth
                };

                return (
                  <div
                    key={basket.name}
                    onDragOver={(e) => { e.preventDefault(); setDraggingOverBasket(basket.name); }}
                    onDragLeave={() => setDraggingOverBasket(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDraggingOverBasket(null);
                      handleMaterialSort(e.dataTransfer.getData('text/plain'), basket.name);
                    }}
                    style={{
                      background: isDraggingOverMe ? basket.bgLight : 'white',
                      border: isDraggingOverMe ? `2px dashed ${basket.color}` : `1.5px solid ${basket.borderColor}`,
                      borderRadius: '12px',
                      padding: '0.6rem 0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s',
                      boxShadow: isDraggingOverMe ? `0 0 0 3px ${basket.bgLight}` : '0 1px 4px rgba(0,0,0,0.08)',
                      minHeight: '68px'
                    }}
                  >
                    {/* Basket Image */}
                    <div style={{ flexShrink: 0, width: '70px', height: '70px' }}>
                      <img src={basketImages[basket.name]} alt={`${basket.name} Basket`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.85rem', color: basket.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          {basket.name} Basket
                        </span>
                        <span style={{ fontSize: '1rem' }}>{basket.emoji}</span>
                      </div>

                      {/* Drop Zone */}
                      <div style={{
                        border: `2px dashed ${isDraggingOverMe ? basket.color : basket.borderColor}`,
                        borderRadius: '8px',
                        padding: '0.3rem 0.5rem',
                        minHeight: '28px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.3rem',
                        alignItems: 'center',
                        background: isDraggingOverMe ? basket.bgLight : 'transparent',
                        transition: 'all 0.15s'
                      }}>
                        {sortedHere.length === 0 ? (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            {isDraggingOverMe ? 'Drop here!' : 'Drop items here...'}
                          </span>
                        ) : (
                          sortedHere.map(item => (
                            <motion.span
                              key={item.id}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              style={{
                                background: basket.bgLight,
                                border: `1px solid ${basket.borderColor}`,
                                borderRadius: '6px',
                                padding: '0.15rem 0.5rem',
                                fontSize: '0.78rem',
                                fontWeight: '600',
                                color: basket.color,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <Check size={10} />
                              {item.name}
                            </motion.span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Error / tip */}
              {errorMessage ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.6rem 1rem', borderRadius: '8px', color: '#dc2626', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                  <AlertCircle size={15} />
                  <span>{errorMessage}</span>
                </div>
              ) : allMaterialSorted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <Check size={16} /> All objects sorted! Click "Proceed to next"
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.25rem' }}>
                  💡 Tip: Drag items to baskets, or use the dropdowns on the left.
                </div>
              )}
            </div>
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
                          <img src={item.icon} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
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
                    {React.createElement(items.find(i => i.id === activeDemoId)?.icon || RemoteIcon, { size: 40 })}
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
                    Click "Proceed to next" in the top right!
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
