import React, { useState } from 'react';
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
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  HelpCircle,
  Play,
  RotateCcw,
  ArrowRight,
  MousePointerClick,
  Zap,
  GripVertical
} from 'lucide-react';
import { 
  CardboardSVG, 
  DrawingPinSVG, 
  SafetyPinSVG, 
  BulbSVG, 
  BatterySVG, 
  WiresSVG 
} from './CircuitElements';

const CONDUCTOR_ITEMS = [
  { id: 'metal', name: 'Safety Pin', type: 'Conductor (Metal)' },
  { id: 'plastic', name: 'Plastic Clip', type: 'Insulator (Plastic)' },
  { id: 'wood', name: 'Wooden Stick', type: 'Insulator (Wood)' }
];

function TrayDraggablePin({ id, disabled, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    disabled: disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        touchAction: 'none',
        opacity: isDragging ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
        width: '100%'
      }}
    >
      {children}
    </div>
  );
}

function CanvasDroppableArea({ children }) {
  const { setNodeRef } = useDroppable({
    id: 'stage2-canvas',
  });
  return (
    <div
      ref={setNodeRef}
      className="canvas-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '2rem',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <div className="canvas-bg-grid" />
      {children}
    </div>
  );
}

export default function Stage2_Test({ onComplete }) {
  const [prediction, setPrediction] = useState(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('metal');
  const [isPinPlacedOnBoard, setIsPinPlacedOnBoard] = useState(false);
  const [isPinConnected, setIsPinConnected] = useState(false);
  const [testTriggered, setTestTriggered] = useState(false);
  const [activeDragId, setActiveDragId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handlePredictSubmit = () => {
    if (prediction !== null) {
      setPredictionSubmitted(true);
    }
  };

  const handleDragStart = (event) => {
    if (!predictionSubmitted) return;
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    if (!predictionSubmitted) return;
    const { over } = event;
    if (over && over.id === 'stage2-canvas') {
      setIsPinPlacedOnBoard(true);
    }
  };

  const handleDirectPlacePin = () => {
    if (!predictionSubmitted) return;
    setIsPinPlacedOnBoard(true);
  };

  const handleToggleSwitchAlignment = () => {
    if (!predictionSubmitted) return;
    if (!isPinPlacedOnBoard) {
      setIsPinPlacedOnBoard(true);
      return;
    }
    const nextState = !isPinConnected;
    setIsPinConnected(nextState);
    setTestTriggered(true);

    if (nextState && selectedMaterial === 'metal') {
      confetti({
        particleCount: 50,
        spread: 70,
        colors: ['#60a5fa', '#fde047', '#38bdf8', '#ffffff'],
        origin: { x: 0.65, y: 0.6 },
      });
    }
  };

  const handleSelectMaterial = (matId) => {
    setSelectedMaterial(matId);
    setIsPinConnected(false);
  };

  const handleReset = () => {
    setPrediction(null);
    setPredictionSubmitted(false);
    setSelectedMaterial('metal');
    setIsPinPlacedOnBoard(false);
    setIsPinConnected(false);
    setTestTriggered(false);
  };

  const isConductor = selectedMaterial === 'metal';
  const isCurrentFlowing = isPinPlacedOnBoard && isPinConnected && isConductor;
  const isBulbOn = isCurrentFlowing;
  const isPredictionCorrect = (prediction === 'on' && isConductor) || (prediction === 'off' && !isConductor);
  const currentItemName = CONDUCTOR_ITEMS.find(i => i.id === selectedMaterial)?.name || 'Safety Pin';

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
        {/* Left Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <span className="status-badge neutral" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', borderColor: '#fde68a' }}>
              Stage 2: Test the Switch
            </span>
            <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', color: 'var(--text-heading)' }}>Active Learning</h2>
            <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-muted)' }}>
              Drag the switch arm from the tray onto Drawing Pin 1, then click to align the clasp!
            </p>
          </div>

          {/* Prediction step */}
          {!predictionSubmitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                background: 'var(--accent-bg)',
                border: '1px solid var(--accent-border)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <HelpCircle style={{ color: 'var(--accent-text)' }} size={20} />
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Predict the Outcome</h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  What will happen to the electric bulb when you drag the metallic safety pin onto the board and align it so that it touches Drawing Pin 2?
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    onClick={() => setPrediction('on')}
                    style={{
                      justifyContent: 'flex-start',
                      background: prediction === 'on' ? 'var(--accent-bg)' : 'var(--card-bg)',
                      borderColor: prediction === 'on' ? 'var(--accent-text)' : 'var(--border)',
                      color: prediction === 'on' ? 'var(--accent-text)' : 'var(--text-muted)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    <span style={{ 
                      display: 'inline-block', width: '8px', height: '8px', 
                      borderRadius: '50%', background: 'var(--warning)', marginRight: '0.5rem'
                    }} />
                    The Bulb will turn ON (Glow)
                  </button>

                  <button
                    onClick={() => setPrediction('off')}
                    style={{
                      justifyContent: 'flex-start',
                      background: prediction === 'off' ? 'var(--danger-bg)' : 'var(--card-bg)',
                      borderColor: prediction === 'off' ? 'var(--danger)' : 'var(--border)',
                      color: prediction === 'off' ? 'var(--danger)' : 'var(--text-muted)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    <span style={{ 
                      display: 'inline-block', width: '8px', height: '8px', 
                      borderRadius: '50%', background: 'var(--text-faint)', marginRight: '0.5rem'
                    }} />
                    The Bulb will stay OFF (No Light)
                  </button>
                </div>
              </div>

              <button
                onClick={handlePredictSubmit}
                disabled={prediction === null}
                className="primary"
                style={{ width: '100%', gap: '0.5rem' }}
              >
                <Play size={16} fill="currentColor" /> Submit Prediction &amp; Start Test
              </button>
            </div>
          ) : (
            /* Test & Observe */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ 
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '0.75rem 0.9rem',
                fontSize: '0.82rem'
              }}>
                <span style={{ color: 'var(--text-faint)', fontWeight: 'bold', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                  PREDICTION SUBMITTED
                </span>
                <p style={{ margin: '0.15rem 0 0 0', color: 'var(--text-secondary)' }}>
                  Your prediction: <strong style={{ color: prediction === 'on' ? 'var(--warning)' : 'var(--text-muted)' }}>
                    Bulb will stay {prediction.toUpperCase()}
                  </strong>
                </p>
              </div>

              {/* Material Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  1. SELECT SWITCH ARM MATERIAL:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                  {CONDUCTOR_ITEMS.map((item) => {
                    const isSel = selectedMaterial === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectMaterial(item.id)}
                        style={{
                          padding: '0.45rem 0.2rem',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: '600',
                          background: isSel ? 'var(--accent-bg)' : 'var(--surface)',
                          border: `1px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                          color: isSel ? 'var(--accent-text)' : 'var(--text-secondary)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: DRAGGABLE COMPONENT TRAY ITEM */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  2. COMPONENT TRAY (DRAG TO CANVAS):
                </span>
                
                <TrayDraggablePin id="stage2-pin" disabled={isPinPlacedOnBoard}>
                  <div
                    onClick={handleDirectPlacePin}
                    className={`tray-btn ${!isPinPlacedOnBoard ? 'active-target-glow' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      background: isPinPlacedOnBoard ? 'var(--success-bg)' : 'var(--accent-bg)',
                      border: `1px solid ${isPinPlacedOnBoard ? 'var(--success)' : 'var(--accent)'}`,
                      color: isPinPlacedOnBoard ? 'var(--success)' : 'var(--accent-text)',
                      fontWeight: '600',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <GripVertical size={16} style={{ opacity: isPinPlacedOnBoard ? 0.3 : 0.8 }} />
                      <span style={{ fontSize: '1.1rem' }}>🧷</span>
                      <span>{isPinPlacedOnBoard ? `${currentItemName} Placed on Board` : `Drag ${currentItemName}`}</span>
                    </div>
                    {!isPinPlacedOnBoard && (
                      <span style={{ fontSize: '0.7rem', background: 'var(--accent)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                        ✋ DRAG ME
                      </span>
                    )}
                  </div>
                </TrayDraggablePin>
              </div>

              {!testTriggered ? (
                <div className="pulse-target" style={{ 
                  background: 'var(--accent-bg)', 
                  border: '1px solid var(--accent-border)',
                  borderRadius: '10px',
                  padding: '0.75rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <MousePointerClick size={22} style={{ color: 'var(--accent-text)', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      {!isPinPlacedOnBoard ? 'Step A: Drag Pin to Board' : 'Step B: Align Clasp to Pin 2'}
                    </h4>
                    <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {!isPinPlacedOnBoard 
                        ? 'Drag the switch arm from the tray and drop it onto Drawing Pin 1.' 
                        : 'Click or swing the safety pin clasp to touch Drawing Pin 2.'}
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ 
                    background: isBulbOn ? 'var(--success-bg)' : 'var(--danger-bg)', 
                    border: isBulbOn ? '1px solid #a7f3d0' : '1px solid #fecaca',
                    borderRadius: '10px',
                    padding: '0.75rem 0.9rem'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                    {isBulbOn ? (
                      <CheckCircle2 style={{ color: 'var(--success)' }} size={18} />
                    ) : (
                      <HelpCircle style={{ color: 'var(--danger)' }} size={18} />
                    )}
                    <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {isBulbOn ? 'Circuit CLOSED (Current Flowing)' : 'Circuit OPEN / Broken Path'}
                    </h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {isBulbOn ? (
                      <>
                        {isPredictionCorrect ? (
                          <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ Great Job! </span>
                        ) : null}
                        The metallic safety pin acts as a <strong>conductor</strong>. Touching Drawing Pin 2 completes the unbroken circuit loop, turning the bulb <strong>ON</strong>!
                      </>
                    ) : (
                      <>
                        {!isConductor ? (
                          <span>The <strong>{currentItemName}</strong> is an insulator. Even when aligned, current cannot pass through it!</span>
                        ) : (
                          <span>When the safety pin is swung away, an air gap is left. Since air is an insulator, the path is broken and the bulb remains <strong>OFF</strong>.</span>
                        )}
                      </>
                    )}
                  </p>
                </motion.div>
              )}

              {/* Live Stats Card */}
              <div style={{ 
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
                background: 'var(--surface)', borderRadius: '10px', padding: '0.65rem 0.75rem',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)' }}>SWITCH ARM</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: isPinConnected ? 'var(--success)' : 'var(--text-secondary)' }}>
                    {!isPinPlacedOnBoard ? 'IN TRAY' : isPinConnected ? 'ALIGNED (CLOSED)' : 'OPEN (GAP)'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)' }}>BULB LIGHT</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: isBulbOn ? 'var(--warning)' : 'var(--text-faint)' }}>
                    {isBulbOn ? '💡 GLOWING' : 'DARK'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
            <button onClick={handleReset} className="outline" style={{ flex: 1, gap: '0.35rem' }}>
              <RotateCcw size={16} /> Reset
            </button>
            <button 
              onClick={onComplete} 
              className="success"
              disabled={!testTriggered}
              style={{ flex: 2, gap: '0.35rem' }}
            >
              Explore Sandbox <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Panel: Interactive SVG Canvas Workspace with Droppable Area */}
        <CanvasDroppableArea>
          <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}>
            <span className={`status-badge ${isBulbOn ? 'closed' : 'open'}`}>
              {isBulbOn ? 'Closed Circuit' : 'Open Circuit'}
            </span>
          </div>

          <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ width: '100%', height: '100%', userSelect: 'none', WebkitUserSelect: 'none' }}>
            {/* Cardboard Base */}
            <CardboardSVG x={480} y={240} />

            {/* Bulb and Battery components with exact coordinates */}
            <g transform="translate(100, 18)">
              <BulbSVG isPlaced={true} isOn={isBulbOn} />
            </g>
            <g transform="translate(70, 40)">
              <BatterySVG isPlaced={true} />
            </g>

            {/* Wires */}
            <WiresSVG 
              isWireConnected={true} 
              isBatteryPresent={true}
              isBulbPresent={true}
              arePinsPlaced={true}
              isCurrentFlowing={isCurrentFlowing}
            />

            {/* Drawing Pin 1 (Pivot Pin Target / Anchor) */}
            <g onClick={handleDirectPlacePin} style={{ cursor: predictionSubmitted && !isPinPlacedOnBoard ? 'pointer' : 'default' }}>
              <DrawingPinSVG x={560} y={290} label="Drawing Pin 1" isPlaced={true} isTarget={predictionSubmitted && !isPinPlacedOnBoard} />
            </g>

            {/* MILD BLINKING DROP TARGET HINT (Step A: When pin is in tray) */}
            {predictionSubmitted && !isPinPlacedOnBoard && (
              <g transform="translate(560, 290)" onClick={handleDirectPlacePin} style={{ cursor: 'pointer' }}>
                <circle r={26} fill="rgba(234, 179, 8, 0.15)" stroke="var(--warning)" strokeWidth={2} strokeDasharray="4,4" className="bulb-glowing" />
                <text x={0} y={-34} fill="var(--warning)" fontSize="11" fontWeight="bold" textAnchor="middle" className="bulb-glowing">
                  🎯 Drag &amp; Drop Pin Here!
                </text>
              </g>
            )}

            {/* Interactive Swinging Switch Arm (Rendered ONLY when placed on board) */}
            {isPinPlacedOnBoard && (
              <g onClick={handleToggleSwitchAlignment} style={{ cursor: 'pointer' }}>
                <SafetyPinSVG x={560} y={290} rotation={isPinConnected ? 0 : -35} isPlaced={true} material={selectedMaterial} />
              </g>
            )}

            {/* Drawing Pin 2 (Contact Pin) */}
            <g onClick={handleToggleSwitchAlignment} style={{ cursor: predictionSubmitted ? 'pointer' : 'default' }}>
              <DrawingPinSVG x={560} y={410} label="Drawing Pin 2" isPlaced={true} isTarget={isPinPlacedOnBoard && !isPinConnected} />
            </g>

            {/* MILD BLINKING ALIGNMENT HINT (Step B: When pin is on board but disconnected) */}
            {predictionSubmitted && isPinPlacedOnBoard && !isPinConnected && (
              <g transform="translate(560, 410)" style={{ cursor: 'pointer' }} onClick={handleToggleSwitchAlignment}>
                <circle r={22} fill="rgba(99, 102, 241, 0.15)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" className="bulb-glowing" />
                <text x={0} y={35} fill="var(--accent-text)" fontSize="11" fontWeight="bold" textAnchor="middle" className="bulb-glowing">
                  🔄 Click Pin 2 to Align Clasp!
                </text>
              </g>
            )}
          </svg>

          {/* Mild Blinking On-Screen Hints */}
          {predictionSubmitted && !isPinPlacedOnBoard && (
            <div style={{ 
              position: 'absolute', top: '48%', right: '26%', 
              background: 'var(--accent)', color: 'white',
              padding: '0.45rem 0.9rem', borderRadius: '8px',
              fontSize: '0.8rem', fontWeight: 'bold',
              boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
              pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem'
            }} className="bulb-glowing">
              <Zap size={14} style={{ color: '#fbbf24' }} /> Drag pin from tray onto Pin 1!
            </div>
          )}

          {predictionSubmitted && isPinPlacedOnBoard && !testTriggered && (
            <div style={{ 
              position: 'absolute', top: '56%', right: '26%', 
              background: 'var(--accent)', color: 'white',
              padding: '0.45rem 0.9rem', borderRadius: '8px',
              fontSize: '0.8rem', fontWeight: 'bold',
              boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
              pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem'
            }} className="bulb-glowing">
              <Zap size={14} style={{ color: '#fbbf24' }} /> Click safety pin or Pin 2 to align clasp!
            </div>
          )}
        </CanvasDroppableArea>
      </div>

      <DragOverlay>
        {activeDragId ? (
          <div style={{
            padding: '0.6rem 1rem',
            background: 'var(--accent-bg)',
            border: '2px solid var(--accent)',
            borderRadius: '10px',
            color: 'var(--accent-text)',
            fontWeight: 'bold',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🧷</span>
            <span>{currentItemName}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
