import React, { useState, useRef, useEffect } from 'react';
import { Search, Lightbulb, RefreshCw, Lock, CheckCircle2, ChevronRight, Check, Folder } from 'lucide-react';
import classroomBg from '../images/clean_classroom.jpg';

const CLASSROOM_OBJECTS = [
  { id: 'bottle', emoji: '🍶', name: 'Water Bottle', material: 'Metal', desc: 'Strong, durable, and keeps liquids contained without breaking easily.', xPos: 35, yPos: 46 },
  { id: 'window', emoji: '🪟', name: 'Window Pane', material: 'Glass', desc: 'Transparent material that allows light to pass through while keeping weather out.', xPos: 12, yPos: 28, hitbox: 'rect', w: 18, h: 25 },
  { id: 'backpack', emoji: '🎒', name: 'Backpack', material: 'Fabric', desc: 'Soft, flexible, and strong material that can hold heavy books without tearing.', xPos: 90, yPos: 63 },
  { id: 'notebook', emoji: '📓', name: 'Notebook', material: 'Paper', desc: 'Light and easy to carry. Smooth to write on. Can be folded. Made from plant-based material.', xPos: 43, yPos: 65 },
  { id: 'pen', emoji: '🖊️', name: 'Pen', material: 'Metal', desc: 'Combines a strong barrel for grip and a metal tip for precision ink flow.', xPos: 54, yPos: 65 },
  { id: 'blackboard', emoji: '⬛', name: 'Blackboard', material: 'Slate', desc: 'A hard, dark rock material that is flat and holds chalk marks easily.', xPos: 50, yPos: 25 },
  { id: 'duster', emoji: '🧽', name: 'Duster', material: 'Wood', desc: 'A hard wooden back provides a strong grip for the soft felt underneath.', xPos: 58, yPos: 38 }
];

const MAGNIFIER_RADIUS = 140;
const DISCOVERY_RADIUS = 70;
const HOLD_DURATION_MS = 1000;

export default function Stage1_Intro({ onComplete, addXp }) {
  // State
  const [glassPos, setGlassPos] = useState({ x: 300, y: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [discovered, setDiscovered] = useState([]);
  const [hoverTarget, setHoverTarget] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [viewState, setViewState] = useState('explore'); // explore, zoom, completed
  const [activeObject, setActiveObject] = useState(null);
  const [hintActive, setHintActive] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Refs
  const containerRef = useRef(null);
  const holdTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const glassRef = useRef({ x: 300, y: 300 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      setContainerSize({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const getPixelCoordinates = (pctX, pctY, width, height) => {
    if (!width || !height) return { x: 0, y: 0 };
    const wI = 768; // Original Image Width
    const hI = 1024; // Original Image Height
    const scale = Math.max(width / wI, height / hI);
    const wR = wI * scale;
    const hR = hI * scale;
    const xOffset = (width - wR) / 2;
    const yOffset = (height - hR) / 2;
    
    return {
      x: xOffset + (pctX / 100) * wR,
      y: yOffset + (pctY / 100) * hR
    };
  };

  const getMappedCoordinates = (pctX, pctY) => {
    if (!containerSize.width || !containerSize.height) return { x: pctX, y: pctY };
    const coords = getPixelCoordinates(pctX, pctY, containerSize.width, containerSize.height);
    return {
      x: (coords.x / containerSize.width) * 100,
      y: (coords.y / containerSize.height) * 100
    };
  };

  const getMaskImage = () => {
    if (discovered.length === 0) return 'none';
    const gradients = discovered.map(id => {
      const obj = CLASSROOM_OBJECTS.find(o => o.id === id);
      const { x, y } = getMappedCoordinates(obj.xPos, obj.yPos);
      return `radial-gradient(circle at ${x}% ${y}%, black 40px, transparent 90px)`;
    });
    return gradients.join(', ');
  };

  const playSound = (type) => {
    // Placeholder for subtle sounds if needed
  };

  const handlePointerDown = (e) => {
    if (viewState !== 'explore') return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dist = Math.hypot(x - glassRef.current.x, y - glassRef.current.y);
    if (dist <= MAGNIFIER_RADIUS + 20) {
      setIsDragging(true);
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (viewState !== 'explore') return;

    const rect = containerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (isDragging) {
      x = Math.max(0, Math.min(rect.width, x));
      y = Math.max(0, Math.min(rect.height, y));
      
      setGlassPos({ x, y });
      glassRef.current = { x, y };
      
      checkCollisions(x, y, rect.width, rect.height);
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const checkCollisions = (mouseX, mouseY, width, height) => {
    let foundTarget = null;

    for (const obj of CLASSROOM_OBJECTS) {
      if (discovered.includes(obj.id)) continue;

      const { x: objX, y: objY } = getPixelCoordinates(obj.xPos, obj.yPos, width, height);

      let isHit = false;
      if (obj.hitbox === 'rect') {
        const scale = Math.max(width / 768, height / 1024);
        const wPx = (obj.w / 100) * 768 * scale;
        const hPx = (obj.h / 100) * 1024 * scale;
        const dx = Math.abs(mouseX - objX);
        const dy = Math.abs(mouseY - objY);
        isHit = (dx <= wPx / 2 && dy <= hPx / 2);
      } else {
        const dist = Math.hypot(mouseX - objX, mouseY - objY);
        isHit = dist <= DISCOVERY_RADIUS;
      }
      
      if (isHit) {
        foundTarget = obj;
        break;
      }
    }

    if (foundTarget) {
      if (hoverTarget?.id !== foundTarget.id) {
        setHoverTarget(foundTarget);
        startHoldTimer(foundTarget);
      }
    } else {
      if (hoverTarget) {
        setHoverTarget(null);
        clearHoldTimer();
      }
    }
  };

  const startHoldTimer = (obj) => {
    clearHoldTimer();
    let progress = 0;
    
    progressIntervalRef.current = setInterval(() => {
      progress += 10;
      setHoldProgress(progress);
    }, 10);

    holdTimerRef.current = setTimeout(() => {
      triggerDiscovery(obj);
    }, HOLD_DURATION_MS);
  };

  const clearHoldTimer = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setHoldProgress(0);
  };

  const triggerDiscovery = (obj) => {
    clearHoldTimer();
    setHoverTarget(null);
    setActiveObject(obj);
    setViewState('zoom');
    setHintActive(false);
    playSound('discovery');
  };

  const returnToClassroom = () => {
    if (!discovered.includes(activeObject.id)) {
      const newDiscovered = [...discovered, activeObject.id];
      setDiscovered(newDiscovered);
      
      if (newDiscovered.length === CLASSROOM_OBJECTS.length) {
        setTimeout(() => {
          setViewState('completed');
          playSound('success');
        }, 500);
      } else {
        setViewState('explore');
      }
    } else {
      setViewState('explore');
    }
    setActiveObject(null);
  };

  const resetActivity = () => {
    setDiscovered([]);
    setViewState('explore');
    setActiveObject(null);
    setGlassPos({ x: 300, y: 300 });
    glassRef.current = { x: 300, y: 300 };
    setHintActive(false);
  };

  const triggerHint = () => {
    setHintActive(true);
    setTimeout(() => setHintActive(false), 2000);
  };

  // Zoom Transform logic
  let transformStyle = 'scale(1) translate(0px, 0px)';
  if (viewState === 'zoom' && activeObject && containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    const { x: objX, y: objY } = getPixelCoordinates(activeObject.xPos, activeObject.yPos, rect.width, rect.height);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const translateX = centerX - objX;
    const translateY = centerY - objY;
    
    transformStyle = `translate(${translateX}px, ${translateY}px) scale(2.5)`;
  }

  // Visual Theme Colors matching reference
  const theme = {
    bg: '#f8efd4',
    textMain: '#3c2415',
    textAccent: '#a64d24',
    cardBg: '#fdf9f1',
    border: '#d9c8af',
    success: '#3b82f6', // used for checks (actually green in image, let's use #10b981)
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      minHeight: 0, 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      background: '#f8efd4', 
      borderRadius: '0px',
      padding: '8px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* MAIN CONTENT AREA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1, minHeight: 0 }}>
        
        {/* LEFT PANEL: CLASSROOM */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* IMMERSIVE VIEWPORT */}
          <div 
            ref={containerRef}
            style={{
              flex: 1, position: 'relative', overflow: 'hidden',
              borderRadius: '0px', border: '4px solid #3c2415',
              background: '#000',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              cursor: viewState === 'explore' ? (isDragging ? 'grabbing' : 'grab') : 'default',
              touchAction: 'none'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* ZOOMABLE CONTAINER */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              transform: transformStyle,
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transformOrigin: 'center'
            }}>
              {/* Base Classroom Image */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `url(${classroomBg})`,
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
              }} />

              {/* Callouts */}
              {CLASSROOM_OBJECTS.map(obj => {
                 const isDiscovered = discovered.includes(obj.id);
                 const isActive = activeObject?.id === obj.id;
                 if (!isDiscovered && !isActive) return null;

                 const { x, y } = getMappedCoordinates(obj.xPos, obj.yPos);
                 
                 let transformVal = '';
                 let arrowStyle = {};
                 
                 if (obj.xPos > 70) {
                     // right side -> bubble on left
                     transformVal = `translate(calc(-100% - 40px), -50%)`;
                     arrowStyle = { right: '-12px', top: '50%', transform: 'translateY(-50%)', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '12px solid #a64d24' };
                 } else if (obj.xPos < 30) {
                     // left side -> bubble on right
                     transformVal = `translate(40px, -50%)`;
                     arrowStyle = { left: '-12px', top: '50%', transform: 'translateY(-50%)', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '12px solid #a64d24' };
                 } else {
                     // middle -> bubble above
                     transformVal = `translate(-50%, calc(-100% - 40px))`;
                     arrowStyle = { bottom: '-12px', left: '50%', transform: 'translateX(-50%)', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '12px solid #a64d24' };
                 }

                 return (
                   <div key={`bubble-${obj.id}`} style={{
                      position: 'absolute',
                      left: `${x}%`, top: `${y}%`,
                      transform: `${transformVal} scale(${viewState === 'zoom' ? 0.4 : 1})`,
                      transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s',
                      opacity: (isActive && viewState === 'zoom') || isDiscovered ? 1 : 0,
                      background: '#fdf9f1',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      border: '3px solid #a64d24',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      zIndex: 30,
                      pointerEvents: 'none',
                      display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '100px'
                   }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.5px', color: '#8b6508' }}>OBJECT</div>
                      <div style={{ fontSize: '1rem', fontWeight: '900', lineHeight: '1', color: '#3c2415' }}>{obj.name}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.5px', color: '#8b6508', marginTop: '6px' }}>MATERIAL</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#bc4a1a', lineHeight: '1' }}>{obj.material}</div>
                      
                      {/* Inner border arrow mask for clean outline */}
                      <div style={{
                          position: 'absolute',
                          ...arrowStyle,
                          width: 0, height: 0,
                          zIndex: 1
                      }} />
                      {/* White fill for arrow */}
                      <div style={{
                          position: 'absolute',
                          ...arrowStyle,
                          borderLeftColor: arrowStyle.borderLeft ? '#fdf9f1' : undefined,
                          borderRightColor: arrowStyle.borderRight ? '#fdf9f1' : undefined,
                          borderTopColor: arrowStyle.borderTop ? '#fdf9f1' : undefined,
                          borderWidth: arrowStyle.borderLeft ? '4px 0 4px 9px' : (arrowStyle.borderRight ? '4px 9px 4px 0' : '9px 4px 0 4px'),
                          [arrowStyle.borderLeft ? 'right' : (arrowStyle.borderRight ? 'left' : 'bottom')]: '-8px',
                          zIndex: 2
                      }} />
                   </div>
                 )
              })}
            </div>

            {/* Target Circles */}
            {viewState === 'explore' && CLASSROOM_OBJECTS.map((obj) => {
               if (discovered.includes(obj.id)) return null;
               const { x, y } = getMappedCoordinates(obj.xPos, obj.yPos);
               let w = '70px', h = '70px';
               if (obj.hitbox === 'rect' && containerSize.width) {
                   const scale = Math.max(containerSize.width / 768, containerSize.height / 1024);
                   w = `${(obj.w / 100) * 768 * scale}px`;
                   h = `${(obj.h / 100) * 1024 * scale}px`;
               }
               return (
                 <div key={obj.id} style={{
                   position: 'absolute',
                   top: `${y}%`, left: `${x}%`,
                   width: w, height: h,
                   transform: 'translate(-50%, -50%)',
                   border: `2px dashed rgba(251, 191, 36, 0.8)`,
                   borderRadius: obj.hitbox === 'rect' ? '16px' : '50%',
                   pointerEvents: 'none',
                   zIndex: 6
                 }} />
               )
            })}


            {/* Clear Mask Layer (Magnified) */}
            {viewState === 'explore' && (
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `url(${classroomBg})`,
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                clipPath: `circle(${MAGNIFIER_RADIUS / 1.3}px at ${glassPos.x}px ${glassPos.y}px)`,
                transformOrigin: `${glassPos.x}px ${glassPos.y}px`,
                transform: 'scale(1.3)',
                pointerEvents: 'none',
                zIndex: 5
              }} />
            )}

            {/* Hint Box (Bottom Left) */}
            
            {/* Hold Progress Ring (No dashed outlines) */}
            {viewState === 'explore' && hoverTarget && (
               <div style={{
                  position: 'absolute',
                  top: `${getMappedCoordinates(hoverTarget.xPos, hoverTarget.yPos).y}%`, 
                  left: `${getMappedCoordinates(hoverTarget.xPos, hoverTarget.yPos).x}%`,
                  width: '100px', height: '100px',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 4
                }}>
                    <svg style={{ position: 'absolute', top: '-10px', left: '-10px', width: '120px', height: '120px' }}>
                       <circle cx="60" cy="60" r="50" fill="none" stroke="#fbbf24" strokeWidth="6" 
                               strokeDasharray="314" strokeDashoffset={314 - (314 * (holdProgress / 1000))}
                               style={{ transition: 'stroke-dashoffset 0.05s linear', transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }} />
                    </svg>
                </div>
            )}

            {/* Instruction Overlay */}
            {viewState === 'explore' && (
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', textAlign: 'left', pointerEvents: 'none', zIndex: 10 }}>
                <div style={{ background: 'rgba(20,20,20,0.85)', color: 'white', padding: '10px 20px', borderRadius: '16px', fontWeight: '700', fontSize: '1rem', letterSpacing: '0.5px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                  Move the <span style={{ color: '#fbbf24' }}>magnifying glass</span><br/>around and find hidden objects!
                </div>
              </div>
            )}



            {/* Physical Magnifying Glass Overlay */}
            {viewState === 'explore' && (
              <div style={{
                position: 'absolute',
                top: glassPos.y - MAGNIFIER_RADIUS,
                left: glassPos.x - MAGNIFIER_RADIUS,
                width: MAGNIFIER_RADIUS * 2,
                height: MAGNIFIER_RADIUS * 2,
                pointerEvents: 'none',
                zIndex: 20
              }}>
                {/* Glass Rim */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  borderRadius: '50%',
                  border: '14px solid #8b6508',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6), inset 4px 4px 10px rgba(255,255,255,0.6), 0 15px 35px rgba(0,0,0,0.5)',
                  boxSizing: 'border-box'
                }}>
                   <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #2e1e0f', boxSizing: 'border-box' }} />
                </div>
                
                {/* Glare/Reflection */}
                <div style={{
                  position: 'absolute', top: '10%', left: '15%', width: '70%', height: '70%',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%)',
                  pointerEvents: 'none'
                }} />
                
                {/* Wooden Handle */}
                <div style={{
                  position: 'absolute',
                  top: '85%', left: '85%',
                  width: '40px', height: '180px',
                  background: 'linear-gradient(90deg, #3e220b 0%, #6b4226 30%, #2a1405 100%)',
                  borderRadius: '20px',
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'top left',
                  boxShadow: '8px 8px 20px rgba(0,0,0,0.6)',
                  border: '2px solid #1a0c03'
                }}>
                   {/* Handle Base Knob */}
                   <div style={{
                      position: 'absolute', bottom: '-10px', left: '-5px', width: '50px', height: '30px',
                      background: 'radial-gradient(ellipse at top, #a67c00, #4d3900)',
                      borderRadius: '20px',
                      border: '2px solid #2e1e0f'
                   }} />
                </div>
                
                {/* Connector */}
                <div style={{
                  position: 'absolute',
                  top: '85%', left: '85%',
                  width: '36px', height: '36px',
                  background: 'radial-gradient(circle at 30% 30%, #d4af37, #8b6508)',
                  borderRadius: '50%',
                  transform: 'translate(-30%, -30%)',
                  boxShadow: 'inset -2px -2px 10px rgba(0,0,0,0.7)',
                  border: '2px solid #2e1e0f'
                }} />
              </div>
            )}

            {/* Completion Overlay */}
            {viewState === 'completed' && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(248, 239, 212, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                 <div style={{ background: '#fdf9f1', padding: '3rem', borderRadius: '24px', border: '4px solid #3c2415', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', textAlign: 'center', maxWidth: '500px' }}>
                   <div style={{ width: '80px', height: '80px', background: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                     <CheckCircle2 size={56} strokeWidth={2.5} />
                   </div>
                   <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#3c2415', margin: '0 0 1rem 0' }}>CASE SOLVED!</h2>
                   <p style={{ fontSize: '1.25rem', color: '#5c4033', margin: '0 0 2rem 0', lineHeight: '1.5', fontWeight: '700' }}>
                     Excellent work, Detective! You discovered what all the everyday objects are made of. Objects are made from materials!
                   </p>
                   <button onClick={() => { addXp(30); onComplete(); }} style={{ background: '#3c2415', color: 'white', padding: '16px 40px', fontSize: '1.3rem', fontWeight: '900', borderRadius: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(60,36,21,0.4)' }}>
                     Complete Investigation
                   </button>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: CASE FILE */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fdf9f1', border: '2px solid #e2d3b9', borderRadius: '0px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.04)' }}>
            
            {/* Header */}
            <div style={{ padding: '24px 24px 16px 24px', borderBottom: '2px dashed #d9c8af' }}>
              <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: '#3c2415', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Folder size={28} fill="#3c2415" /> CASE FILE
              </h3>
            </div>
            
            <div style={{ padding: '16px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
              
              {viewState === 'explore' || viewState === 'completed' ? (
                // --- INITIAL / SEARCHING STATE ---
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8efd4', padding: '20px', borderRadius: '16px', border: '2px dashed #d9c8af', justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: 0.8 }}>
                  <Search size={32} color="#a79a83" />
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#5c4033' }}>SEARCHING...</h4>
                  <p style={{ margin: 0, fontSize: '1.1rem', color: '#5c4033', fontWeight: '600' }}>Search the classroom to discover an object.</p>
                </div>
              ) : (
                // --- MATERIAL EXPLANATION (Visible only during zoom) ---
                <div style={{ background: '#f8efd4', padding: '20px', borderRadius: '16px', border: '2px solid #e2d3b9', animation: 'fadeIn 0.3s ease-out' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                     <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#8b6508', textTransform: 'uppercase', letterSpacing: '0.5px' }}>OBJECT</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#3c2415' }}>{activeObject?.name}</div>
                     </div>
                     <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#8b6508', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MATERIAL</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#bc4a1a' }}>{activeObject?.material}</div>
                     </div>
                  </div>

                  <div style={{ display: 'inline-block', background: '#bc4a1a', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '1rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    Why {activeObject?.material}?
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '24px', color: '#3c2415', fontSize: '1.1rem', lineHeight: '1.5', fontWeight: '600', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     {activeObject?.desc.split('. ').filter(Boolean).map((pt, idx) => (
                       <li key={idx} style={{ paddingLeft: '4px' }}>{pt.trim()}{pt.endsWith('.') ? '' : '.'}</li>
                     ))}
                  </ul>
                </div>
              )}

              {/* PROGRESS LIST (Always visible) */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '900', color: '#3c2415', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Folder size={20} /> Case File Progress
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {CLASSROOM_OBJECTS.map((obj, i) => {
                    const isFound = discovered.includes(obj.id);
                    return (
                      <div key={obj.id} style={{
                        display: 'flex', alignItems: 'center', padding: '8px 12px',
                        background: isFound ? '#f8efd4' : 'transparent',
                        borderBottom: !isFound ? '2px dashed #e2d3b9' : '2px solid transparent',
                        borderRadius: isFound ? '12px' : '0', gap: '12px'
                      }}>
                        <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                          {isFound ? <span style={{ fontSize: '1.4rem' }}>{obj.emoji}</span> : <Lock size={20} color="#a79a83" />}
                        </div>
                        
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.15rem', fontWeight: '800', color: isFound ? '#3c2415' : '#a79a83' }}>
                          <span>{i + 1}.</span>
                          {isFound ? (
                            <>
                              <span>{obj.name}</span>
                              <span style={{ color: '#bc4a1a' }}>&rarr;</span>
                              <span style={{ color: '#bc4a1a' }}>{obj.material}</span>
                            </>
                          ) : (
                            <span>???</span>
                          )}
                        </div>

                        {isFound && (
                          <div style={{ background: '#10b981', color: 'white', borderRadius: '50%', padding: '4px', display: 'flex' }}>
                            <Check size={16} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            {viewState === 'zoom' && (
              <div style={{ padding: '16px 24px', background: '#f8efd4', borderTop: '2px solid #e2d3b9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <button onClick={returnToClassroom} style={{ width: '100%', padding: '16px', background: '#3c2415', color: 'white', border: 'none', fontSize: '1.2rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 6px 16px rgba(60,36,21,0.3)' }}>
                   Return to Classroom <ChevronRight size={24} />
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
