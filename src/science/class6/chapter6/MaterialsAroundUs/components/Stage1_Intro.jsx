import React, { useState, useRef, useEffect } from 'react';
import { Search, Lightbulb, RefreshCw, Lock, CheckCircle2, ChevronRight, Check, Folder } from 'lucide-react';
import classroomBg from '../images/clean_classroom.jpg';

const CLASSROOM_OBJECTS = [
  { id: 'bottle', emoji: '🍶', name: 'Water Bottle', material: 'Metal', desc: 'Strong, durable, and keeps liquids contained without breaking easily.', xPos: 36, yPos: 46, hitbox: 'rect', w: 5, h: 14 },
  { id: 'window', emoji: '🪟', name: 'Window Pane', material: 'Glass', desc: 'Transparent material that allows light to pass through while keeping weather out.', xPos: 4, yPos: 30, hitbox: 'rect', w: 8, h: 30 },
  { id: 'backpack', emoji: '🎒', name: 'Backpack', material: 'Fabric', desc: 'Soft, flexible, and strong material that can hold heavy books without tearing.', xPos: 88, yPos: 63, hitbox: 'rect', w: 14, h: 18 },
  { id: 'notebook', emoji: '📓', name: 'Notebook', material: 'Paper', desc: 'Light and easy to carry. Smooth to write on. Can be folded. Made from plant-based material.', xPos: 42.5, yPos: 65, hitbox: 'rect', w: 14, h: 8 },
  { id: 'pen', emoji: '🖊️', name: 'Pen', material: 'Metal', desc: 'Combines a strong barrel for grip and a metal tip for precision ink flow.', xPos: 54.5, yPos: 65, hitbox: 'rect', w: 5, h: 3 },
  { id: 'blackboard', emoji: '⬛', name: 'Blackboard', material: 'Slate', desc: 'A hard, dark rock material that is flat and holds chalk marks easily.', xPos: 50, yPos: 25 },
  { id: 'duster', emoji: '🧽', name: 'Duster', material: 'Wood', desc: 'A hard wooden back provides a strong grip for the soft felt underneath.', xPos: 58.5, yPos: 37.5, hitbox: 'rect', w: 5, h: 3 }
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
      // Allow colliding with already discovered objects so they can be inspected again

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
      if (discovered.includes(foundTarget.id)) {
        // If already discovered, just update the active object to show its bubble immediately
        if (activeObject?.id !== foundTarget.id) {
          setActiveObject(foundTarget);
        }
        if (hoverTarget) {
          setHoverTarget(null);
          clearHoldTimer();
        }
      } else {
        // Not discovered yet, start the scan timer
        if (hoverTarget?.id !== foundTarget.id) {
          setHoverTarget(foundTarget);
          startHoldTimer(foundTarget);
        }
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
    
    // Progressively add to discovered objects using functional update to guarantee no stale state overwrites
    setDiscovered(prev => {
      if (prev.includes(obj.id)) return prev;
      return [...prev, obj.id];
    });

    setViewState('zoom');
    setHintActive(false);
    playSound('discovery');
  };

  const returnToClassroom = () => {
    // Check if ALL objects have now been discovered
    // We check against the current length. If this was the last object,
    // the triggerDiscovery already added it to the `discovered` array.
    if (discovered.length === CLASSROOM_OBJECTS.length || (discovered.length === CLASSROOM_OBJECTS.length - 1 && !discovered.includes(activeObject.id))) {
      // In case state hasn't flushed yet, also handle length-1 if activeObject is missing
      setTimeout(() => {
        setViewState('completed');
        playSound('success');
      }, 500);
    } else {
      setViewState('explore');
    }
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
  let transformOriginStyle = 'center';

  if (viewState === 'zoom' && activeObject && containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    const { x: objX, y: objY } = getPixelCoordinates(activeObject.xPos, activeObject.yPos, rect.width, rect.height);
    
    const scale = 2.5;
    
    // Target translation to put the object at the center of the container
    let finalX = (rect.width / 2) - (objX * scale);
    let finalY = (rect.height / 2) - (objY * scale);
    
    // Clamp the translation so we don't show the black background
    const minX = rect.width * (1 - scale);
    const minY = rect.height * (1 - scale);
    
    finalX = Math.max(minX, Math.min(0, finalX));
    finalY = Math.max(minY, Math.min(0, finalY));
    
    transformOriginStyle = '0 0';
    transformStyle = `translate(${finalX}px, ${finalY}px) scale(${scale})`;
  }

  // Visual Theme Colors matching reference
  const theme = {
    bg: 'var(--lesson-surface)',
    textMain: 'var(--lesson-primary)',
    textAccent: 'var(--lesson-success)',
    cardBg: 'var(--lesson-card)',
    border: 'var(--lesson-border)',
    success: 'var(--lesson-success)', // used for checks (actually green in image, let's use var(--lesson-success))
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      minHeight: 0, 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      background: 'var(--lesson-surface)', 
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
              borderRadius: '0px', border: '4px solid var(--lesson-primary)',
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
              transformOrigin: transformOriginStyle
            }}>
              {/* Base Classroom Image */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `url(${classroomBg})`,
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
              }} />

            </div>

            {/* CALLOUTS (Rendered outside the transform to prevent clipping/scaling bugs) */}
            {CLASSROOM_OBJECTS.map(obj => {
               const isActive = activeObject?.id === obj.id;
               if (!isActive || viewState === 'completed') return null;

               const { x, y } = getMappedCoordinates(obj.xPos, obj.yPos);
               
               let basePxX = 0;
               let basePxY = 0;
               if (containerSize.width) {
                 basePxX = (x / 100) * containerSize.width;
                 basePxY = (y / 100) * containerSize.height;
               }

               let currentScale = 1;
               let translateX = 0;
               let translateY = 0;
               
               if (viewState === 'zoom' && activeObject && containerSize.width) {
                 currentScale = 2.5;
                 const { x: objX, y: objY } = getPixelCoordinates(activeObject.xPos, activeObject.yPos, containerSize.width, containerSize.height);
                 
                 let fX = (containerSize.width / 2) - (objX * currentScale);
                 let fY = (containerSize.height / 2) - (objY * currentScale);
                 
                 const minX = containerSize.width * (1 - currentScale);
                 const minY = containerSize.height * (1 - currentScale);
                 
                 translateX = Math.max(minX, Math.min(0, fX));
                 translateY = Math.max(minY, Math.min(0, fY));
               }

               const objectScreenCenterX = basePxX * currentScale + translateX;
               const objectScreenCenterY = basePxY * currentScale + translateY;

               let halfW = 40;
               let halfH = 40;
               if (containerSize.width) {
                   const scaleFactor = Math.max(containerSize.width / 768, containerSize.height / 1024);
                   if (obj.hitbox === 'rect') {
                       halfW = ((obj.w / 100) * 768 * scaleFactor) / 2;
                       halfH = ((obj.h / 100) * 1024 * scaleFactor) / 2;
                   } else {
                       halfW = 60 * scaleFactor;
                       halfH = 60 * scaleFactor;
                   }
               }
               const zoomedHalfW = halfW * currentScale;
               const zoomedHalfH = halfH * currentScale;

               const margin = 16;
               const bubbleEstW = 160;
               const bubbleEstH = 110;
               
               let placement = 'top';
               const spaceTop = objectScreenCenterY - zoomedHalfH;
               const spaceBottom = containerSize.height - (objectScreenCenterY + zoomedHalfH);
               const spaceLeft = objectScreenCenterX - zoomedHalfW;
               const spaceRight = containerSize.width - (objectScreenCenterX + zoomedHalfW);

               if (spaceTop < bubbleEstH + margin) {
                   if (spaceBottom >= bubbleEstH + margin) {
                       placement = 'bottom';
                   } else if (spaceRight >= bubbleEstW + margin) {
                       placement = 'right';
                   } else if (spaceLeft >= bubbleEstW + margin) {
                       placement = 'left';
                   } else {
                       placement = 'bottom';
                   }
               } else if (spaceLeft < bubbleEstW / 2 + margin && spaceRight >= bubbleEstW + margin) {
                   placement = 'right';
               } else if (spaceRight < bubbleEstW / 2 + margin && spaceLeft >= bubbleEstW + margin) {
                   placement = 'left';
               }

               let transformVal = '';
               let arrowStyle = {};
               let innerArrowStyle = {};
               let originStyle = 'center';
               
               if (placement === 'right') {
                   transformVal = `translate(${zoomedHalfW + margin}px, -50%)`;
                   originStyle = 'left center';
                   arrowStyle = { left: '-12px', top: '50%', transform: 'translateY(-50%)', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '12px solid var(--lesson-success)' };
                   innerArrowStyle = { left: '-8px', top: '50%', transform: 'translateY(-50%)', borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderRight: '9px solid var(--lesson-card)' };
               } else if (placement === 'left') {
                   transformVal = `translate(calc(-100% - ${zoomedHalfW + margin}px), -50%)`;
                   originStyle = 'right center';
                   arrowStyle = { right: '-12px', top: '50%', transform: 'translateY(-50%)', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '12px solid var(--lesson-success)' };
                   innerArrowStyle = { right: '-8px', top: '50%', transform: 'translateY(-50%)', borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '9px solid var(--lesson-card)' };
               } else if (placement === 'bottom') {
                   transformVal = `translate(-50%, ${zoomedHalfH + margin}px)`;
                   originStyle = 'top center';
                   arrowStyle = { top: '-12px', left: '50%', transform: 'translateX(-50%)', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '12px solid var(--lesson-success)' };
                   innerArrowStyle = { top: '-8px', left: '50%', transform: 'translateX(-50%)', borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: '9px solid var(--lesson-card)' };
               } else {
                   transformVal = `translate(-50%, calc(-100% - ${zoomedHalfH + margin}px))`;
                   originStyle = 'bottom center';
                   arrowStyle = { bottom: '-12px', left: '50%', transform: 'translateX(-50%)', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '12px solid var(--lesson-success)' };
                   innerArrowStyle = { bottom: '-8px', left: '50%', transform: 'translateX(-50%)', borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '9px solid var(--lesson-card)' };
               }

               return (
                 <div key={`bubble-${obj.id}`} style={{
                    position: 'absolute',
                    left: `${objectScreenCenterX}px`, top: `${objectScreenCenterY}px`,
                    transform: transformVal,
                    transformOrigin: originStyle,
                    transition: 'left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    opacity: 1,
                    background: 'var(--lesson-card)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '3px solid var(--lesson-success)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    zIndex: 99999,
                    pointerEvents: 'none',
                    display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '100px'
                 }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.5px', color: 'var(--lesson-muted)' }}>OBJECT</div>
                    <div style={{ fontSize: '1rem', fontWeight: '900', lineHeight: '1', color: 'var(--lesson-primary)' }}>{obj.name}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.5px', color: 'var(--lesson-muted)', marginTop: '6px' }}>MATERIAL</div>
                    <div style={{ fontSize: '1rem', fontWeight: '900', lineHeight: '1', color: 'var(--lesson-success)' }}>{obj.material}</div>
                    
                    {/* Outer border arrow */}
                    <div style={{
                        position: 'absolute',
                        ...arrowStyle,
                        width: 0, height: 0,
                        zIndex: 1
                    }} />
                    {/* Inner white fill for arrow */}
                    <div style={{
                        position: 'absolute',
                        ...innerArrowStyle,
                        width: 0, height: 0,
                        zIndex: 2
                    }} />
                 </div>
               )
            })}

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
                       <circle cx="60" cy="60" r="50" fill="none" stroke="var(--lesson-warning)" strokeWidth="6" 
                               strokeDasharray="314" strokeDashoffset={314 - (314 * (holdProgress / 1000))}
                               style={{ transition: 'stroke-dashoffset 0.05s linear', transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }} />
                    </svg>
                </div>
            )}

            {/* Instruction Overlay */}
            {viewState === 'explore' && (
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', textAlign: 'left', pointerEvents: 'none', zIndex: 10 }}>
                <div style={{ background: 'rgba(20,20,20,0.85)', color: 'white', padding: '10px 20px', borderRadius: '16px', fontWeight: '700', fontSize: '1rem', letterSpacing: '0.5px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                  Move the <span style={{ color: 'var(--lesson-warning)' }}>magnifying glass</span><br/>around and find hidden objects!
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
                  border: '14px solid var(--lesson-muted)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6), inset 4px 4px 10px rgba(255,255,255,0.6), 0 15px 35px rgba(0,0,0,0.5)',
                  boxSizing: 'border-box'
                }}>
                   <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid var(--lesson-primary)', boxSizing: 'border-box' }} />
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
                      border: '2px solid var(--lesson-primary)'
                   }} />
                </div>
                
                {/* Connector */}
                <div style={{
                  position: 'absolute',
                  top: '85%', left: '85%',
                  width: '36px', height: '36px',
                  background: 'radial-gradient(circle at 30% 30%, #d4af37, var(--lesson-muted))',
                  borderRadius: '50%',
                  transform: 'translate(-30%, -30%)',
                  boxShadow: 'inset -2px -2px 10px rgba(0,0,0,0.7)',
                  border: '2px solid var(--lesson-primary)'
                }} />
              </div>
            )}

            {/* Completion Overlay */}
            {viewState === 'completed' && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(245, 239, 230, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                 <div style={{ background: 'var(--lesson-card)', padding: '3rem', borderRadius: '24px', border: '4px solid var(--lesson-primary)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', textAlign: 'center', maxWidth: '500px' }}>
                   <div style={{ width: '80px', height: '80px', background: 'var(--lesson-success)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                     <CheckCircle2 size={56} strokeWidth={2.5} />
                   </div>
                   <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--lesson-primary)', margin: '0 0 1rem 0' }}>CASE SOLVED!</h2>
                   <p style={{ fontSize: '1.25rem', color: 'var(--lesson-secondary)', margin: '0 0 2rem 0', lineHeight: '1.5', fontWeight: '700' }}>
                     Excellent work, Detective! You discovered what all the everyday objects are made of. Objects are made from materials!
                   </p>
                 <button onClick={() => { addXp(30); onComplete(); }} style={{ background: 'var(--lesson-accent)', color: 'white', padding: '16px 40px', fontSize: '1.3rem', fontWeight: '900', borderRadius: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(60,36,21,0.4)' }}>
                   PROCEED TO LAB &rarr;
                 </button>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: CASE FILE */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--lesson-card)', border: '2px solid var(--lesson-border)', borderRadius: '0px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.04)' }}>
            
            {/* Header */}
            <div style={{ padding: '24px 24px 16px 24px', borderBottom: '2px dashed var(--lesson-border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: 'var(--heading-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Folder size={28} fill="var(--lesson-primary)" /> CASE FILE
              </h3>
            </div>
            
            <div style={{ padding: '16px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
              
              {viewState === 'explore' || viewState === 'completed' ? (
                // --- INITIAL / SEARCHING STATE ---
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--lesson-surface)', padding: '20px', borderRadius: '16px', border: '2px dashed var(--lesson-border)', justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: 0.8 }}>
                  <Search size={32} color="var(--lesson-muted)" />
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: 'var(--lesson-secondary)' }}>SEARCHING...</h4>
                  <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--lesson-secondary)', fontWeight: '600' }}>Search the classroom to discover an object.</p>
                </div>
              ) : (
                // --- MATERIAL EXPLANATION (Visible only during zoom) ---
                <div style={{ background: 'var(--lesson-surface)', padding: '20px', borderRadius: '16px', border: '2px solid var(--lesson-border)', animation: 'fadeIn 0.3s ease-out' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                     <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--lesson-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>OBJECT</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--lesson-primary)' }}>{activeObject?.name}</div>
                     </div>
                     <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--lesson-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MATERIAL</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--lesson-success)' }}>{activeObject?.material}</div>
                    </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'inline-block', background: 'var(--lesson-success)', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '1rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    IDENTIFIED
                  </div>                </div>
                  <ul style={{ margin: 0, paddingLeft: '24px', color: 'var(--lesson-primary)', fontSize: '1.1rem', lineHeight: '1.5', fontWeight: '600', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     {activeObject?.desc.split('. ').filter(Boolean).map((pt, idx) => (
                       <li key={idx} style={{ paddingLeft: '4px' }}>{pt.trim()}{pt.endsWith('.') ? '' : '.'}</li>
                     ))}
                  </ul>
                </div>
              )}

              {/* PROGRESS LIST (Always visible) */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '900', color: 'var(--heading-section)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Folder size={20} /> Case File Progress
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {CLASSROOM_OBJECTS.map((obj, i) => {
                    const isFound = discovered.includes(obj.id);
                    const isCurrentActive = isFound && activeObject?.id === obj.id && viewState === 'zoom';
                    const isCompleted = isFound && !isCurrentActive;
                    
                    return (
                      <div 
                        key={obj.id} 
                        onClick={() => {
                          if (isFound) {
                            setActiveObject(obj);
                          }
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', padding: '6px 12px',
                          background: isCompleted ? 'var(--lesson-surface)' : 'transparent',
                          borderBottom: !isFound ? '2px dashed var(--lesson-border)' : '2px solid transparent',
                          borderRadius: isCompleted || isCurrentActive ? '12px' : '0', gap: '12px',
                          cursor: isFound ? 'pointer' : 'default',
                          transition: 'transform 0.2s',
                          opacity: !isFound ? 0.6 : 1
                        }}
                      >
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: '800', color: isFound ? 'var(--lesson-primary)' : 'var(--lesson-muted)' }}>
                          <span>{i + 1}.</span>
                          {isCompleted ? (
                            <>
                              <span>{obj.name}</span>
                              <span style={{ color: 'var(--lesson-success)' }}>&rarr;</span>
                              <span style={{ color: 'var(--lesson-success)' }}>{obj.material}</span>
                            </>
                          ) : isCurrentActive ? (
                            <>
                              <span>{obj.name}</span>
                              <span style={{ color: 'var(--lesson-border)' }}>&rarr;</span>
                              <span style={{ color: 'var(--lesson-muted)' }}>?</span>
                            </>
                          ) : (
                            <span>???</span>
                          )}
                        </div>

                        {isCompleted && (
                          <div style={{ background: 'var(--lesson-success)', color: 'white', borderRadius: '50%', padding: '4px', display: 'flex' }}>
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
              <div style={{ padding: '16px 24px', background: 'var(--lesson-surface)', borderTop: '2px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <button onClick={returnToClassroom} style={{ width: '100%', padding: '16px', background: 'white', color: 'var(--lesson-primary)', border: '2px solid var(--lesson-primary)', fontSize: '1.2rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 6px 16px rgba(0,0,0,0.05)' }}>
                   RETURN TO CLASSROOM
                 <ChevronRight size={24} />
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
