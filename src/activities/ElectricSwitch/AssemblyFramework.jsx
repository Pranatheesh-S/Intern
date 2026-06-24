import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  TouchSensor,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  ArrowRight, 
  Info, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import ThreeDViewer from './ThreeDViewer';

// --- Draggable Token wrapper for the Parts Bench ---
function DraggableToken({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    touchAction: 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : 10,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={`draggable-token-container ${isDragging ? 'dragging' : ''}`}
    >
      {children}
    </div>
  );
}

// --- Droppable Zone wrapper for the Workspace ---
function DroppableZone({ id, bounds, isDraggingActive, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  // Calculate percentage positions based on 600x480 coordinates
  const style = {
    position: 'absolute',
    left: `${(bounds.x / 600) * 100}%`,
    top: `${(bounds.y / 480) * 100}%`,
    width: `${(bounds.width / 600) * 100}%`,
    height: `${(bounds.height / 480) * 100}%`,
    pointerEvents: isDraggingActive ? 'auto' : 'none',
    zIndex: 30,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children(isOver)}
    </div>
  );
}

export default function AssemblyFramework({
  steps,
  onComplete,
  title = "Assembly Workspace",
  subjectBadge = "Science Lab",
  workspaceBackground = null,
}) {
  const [placed, setPlaced] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Configure touch and pointer sensors for immediate responsive drag action
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  // Initialize placed state when steps load
  useEffect(() => {
    const initialPlaced = {};
    steps.forEach(step => {
      initialPlaced[step.id] = false;
    });
    setPlaced(initialPlaced);
  }, [steps]);

  // Determine current active (unplaced) step
  const activeStep = steps.find(s => s.id === selectedItemId);

  // Check if a step's prerequisites are met
  const isStepUnlocked = (step) => {
    return step.prereq.every(pId => placed[pId] === true);
  };

  // Click handler for warehouse item
  const handleSelectTrayItem = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    if (!step || placed[stepId]) return;

    if (!isStepUnlocked(step)) {
      const missingPrereqs = step.prereq.filter(pId => !placed[pId]);
      const missingNames = missingPrereqs.map(pId => steps.find(s => s.id === pId)?.name).join(', ');
      setError(`❌ Cannot select "${step.name}". You must place the following first: ${missingNames}`);
      return;
    }

    setError('');
    setSelectedItemId(stepId);
  };

  // Drag start
  const handleDragStart = (event) => {
    setIsDragging(true);
    setError('');
  };

  // Drag end callback
  const handleDragEnd = (event) => {
    setIsDragging(false);
    const { over } = event;

    if (!activeStep) return;

    // Check if item was dropped over its specific target zone
    const targetId = `${activeStep.id}-target`;
    if (over && over.id === targetId) {
      // Correct Placement
      const newPlaced = { ...placed, [activeStep.id]: true };
      setPlaced(newPlaced);
      setSelectedItemId(null); // Empty the parts bench
      
      // Trigger success sparks
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });

      // Check if all steps completed
      const allPlaced = steps.every(s => newPlaced[s.id] === true);
      if (allPlaced) {
        setSuccess(true);
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.5 }
        });
      }
    } else {
      // Incorrect Placement
      setError(activeStep.errorMsg || `Place the ${activeStep.name} inside the highlighted assembly area.`);
    }
  };

  const handleReset = () => {
    const resetPlaced = {};
    steps.forEach(step => {
      resetPlaced[step.id] = false;
    });
    setPlaced(resetPlaced);
    setSelectedItemId(null);
    setError('');
    setSuccess(false);
  };

  // Helpers for custom progress indicator
  const completedCount = steps.filter(s => placed[s.id]).length;
  const progressPercent = (completedCount / steps.length) * 100;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ gridTemplateColumns: '1fr', gap: '1rem', padding: '1rem', maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Workspace Title & Instructions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span className="status-badge neutral" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 'bold' }}>
              {subjectBadge}
            </span>
            <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.4rem' }}>{title}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Progress: <strong>{completedCount} / {steps.length}</strong>
            </span>
            <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', alignSelf: 'center' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: '#10b981', transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>

        {/* ============================================== */}
        {/* ASSEMBLY WORKSPACE (TOP PANEL)                 */}
        {/* ============================================== */}
        <div 
          className="canvas-container" 
          style={{ 
            position: 'relative', 
            width: '100%', 
            aspectRatio: '600 / 480',
            maxWidth: '600px',
            margin: '0 auto',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#090d16',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          <div className="canvas-bg-grid" />

          {/* SVG Canvas Board */}
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 600 480" 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            {/* Custom workspace background base (e.g. Cardboard Base outline) */}
            {workspaceBackground}

            {/* Placed Elements SVG rendering */}
            {steps.map(step => (
              <React.Fragment key={step.id}>
                {step.renderWorkspace(placed)}
              </React.Fragment>
            ))}

            {/* Visual highlight target outline */}
            {activeStep && !placed[activeStep.id] && (
              <g className="pulse-target" style={{ opacity: isDragging ? 1 : 0.65 }}>
                <rect 
                  x={activeStep.targetPos.x} 
                  y={activeStep.targetPos.y} 
                  width={activeStep.targetPos.width} 
                  height={activeStep.targetPos.height} 
                  rx={8} 
                  fill="rgba(99, 102, 241, 0.04)" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  strokeDasharray="5,5" 
                />
                <text 
                  x={activeStep.targetPos.x + activeStep.targetPos.width / 2} 
                  y={activeStep.targetPos.y + activeStep.targetPos.height / 2 + 4} 
                  fill="#818cf8" 
                  fontSize="11" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  PLACE HERE
                </text>
              </g>
            )}
          </svg>

          {/* Absolute HTML collision volume for dnd-kit */}
          {activeStep && (
            <DroppableZone 
              id={`${activeStep.id}-target`} 
              bounds={activeStep.targetPos} 
              isDraggingActive={isDragging}
            >
              {(isOver) => (
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s',
                    backgroundColor: isOver ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: isOver ? '2px solid #818cf8' : 'none',
                    boxSizing: 'border-box'
                  }}
                />
              )}
            </DroppableZone>
          )}

          {/* Interactive Guides & Feedback */}
          <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', pointerEvents: 'none' }}>
            <span style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              WORKSPACE ASSEMBLY
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {activeStep ? `Target highlighted: ${activeStep.name}` : "Workspace awaits components..."}
            </span>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ 
                  position: 'absolute', 
                  top: '0.75rem', 
                  left: '0.75rem', 
                  right: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 40
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================== */}
        {/* PARTS BENCH (MIDDLE PANEL)                     */}
        {/* ============================================== */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem', 
            padding: '1rem',
            background: 'rgba(15, 23, 42, 0.4)',
            borderColor: 'rgba(255,255,255,0.04)',
            borderRadius: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Info size={14} /> Parts Bench
            </h3>
            {activeStep && (
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                💡 Click & Drag model below to inspect
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: activeStep ? '1.2fr 1fr' : '1fr', gap: '1rem', minHeight: '180px' }}>
            
            {activeStep ? (
              <>
                {/* 3D Viewer Panel */}
                <div style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: '#090d16',
                  height: '180px',
                  position: 'relative'
                }}>
                  <ThreeDViewer componentId={activeStep.id} />
                </div>

                {/* Info and Draggable Area */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>{activeStep.name}</h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
                      {activeStep.desc}
                    </p>
                  </div>
                  
                  {/* Draggable Token handle */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>DRAG TO ASSEMBLE:</span>
                    <DraggableToken id={activeStep.id}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px dashed rgba(99, 102, 241, 0.4)',
                        borderRadius: '10px',
                        color: '#a5b4fc',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 10px rgba(99,102,241,0.1)'
                      }}>
                        <div style={{ width: '28px', height: '28px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {activeStep.renderPartsBenchIcon()}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span>{activeStep.name}</span>
                          <span style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 'normal' }}>Drag me up to workspace</span>
                        </div>
                      </div>
                    </DraggableToken>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', color: '#475569', textAlign: 'center', padding: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '280px' }}>
                  Select an unlocked component from the <strong>Component Tray</strong> below to inspect and drag it onto the workspace.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ============================================== */}
        {/* INVENTORY TRAY (BOTTOM PANEL)                  */}
        {/* ============================================== */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1' }}>Component Tray</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
            {steps.map((step) => {
              const isPlaced = placed[step.id];
              const isUnlocked = isStepUnlocked(step);
              const isSelected = selectedItemId === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => handleSelectTrayItem(step.id)}
                  disabled={isPlaced || !isUnlocked}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.6rem 0.4rem',
                    borderRadius: '12px',
                    background: isPlaced 
                      ? 'rgba(16, 185, 129, 0.05)' 
                      : isSelected
                        ? 'rgba(99, 102, 241, 0.15)'
                        : isUnlocked 
                          ? 'rgba(30, 41, 59, 0.6)' 
                          : 'rgba(15, 23, 42, 0.3)',
                    border: `1px solid ${
                      isPlaced 
                        ? 'rgba(16, 185, 129, 0.25)' 
                        : isSelected
                          ? '#6366f1'
                          : isUnlocked 
                            ? 'rgba(99, 102, 241, 0.2)' 
                            : 'rgba(255, 255, 255, 0.02)'
                    }`,
                    color: isPlaced 
                      ? '#a7f3d0' 
                      : isUnlocked 
                        ? '#ffffff' 
                        : '#475569',
                    cursor: isPlaced || !isUnlocked ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    background: 'rgba(15,23,42,0.5)', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: '0.4rem',
                    opacity: isUnlocked ? 1 : 0.25
                  }}>
                    {step.renderInventoryIcon()}
                  </div>

                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                    {step.name}
                  </span>

                  {/* Badge Indicators */}
                  <div style={{ position: 'absolute', top: '4px', right: '4px' }}>
                    {isPlaced ? (
                      <CheckCircle2 size={12} style={{ color: '#10b981' }} />
                    ) : !isUnlocked ? (
                      <Lock size={10} style={{ color: '#475569' }} />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer controls & progression */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button onClick={handleReset} className="outline" style={{ flex: 1, gap: '0.35rem' }}>
            <RotateCcw size={16} /> Reset Lab
          </button>
          
          <button 
            onClick={onComplete}
            className="success" 
            disabled={!success}
            style={{ flex: 2, gap: '0.35rem' }}
          >
            Go to Stage 2 <ArrowRight size={16} />
          </button>
        </div>

        {/* Drag Overlay layer */}
        <DragOverlay>
          {isDragging && activeStep ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(99, 102, 241, 0.25)',
              border: '2px solid #818cf8',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: '600',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              cursor: 'grabbing',
              opacity: 0.9,
              transform: 'scale(1.05)',
            }}>
              <div style={{ width: '28px', height: '28px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeStep.renderPartsBenchIcon()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span>{activeStep.name}</span>
                <span style={{ fontSize: '0.65rem', color: '#a5b4fc' }}>Placing in workspace...</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>

      </div>
    </DndContext>
  );
}
