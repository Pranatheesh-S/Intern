import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw,
  Zap,
  ZapOff,
  Battery,
  Layers,
  Scissors,
  CheckCircle,
  XCircle,
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  CardboardSVG, 
  DrawingPinSVG, 
  SafetyPinSVG, 
  BulbSVG, 
  BatterySVG, 
  WiresSVG 
} from './CircuitElements';

export default function Stage3_Explore() {
  // Sandbox states
  const [isPinConnected, setIsPinConnected] = useState(false);
  const [batteryPresent, setBatteryPresent] = useState(true);
  const [wireConnected, setWireConnected] = useState(true);
  const [pinMaterial, setPinMaterial] = useState('metal'); // 'metal' | 'plastic' | 'wood'

  const handleToggleSwitch = () => {
    setIsPinConnected(!isPinConnected);
  };

  const handleToggleBattery = () => {
    setBatteryPresent(!batteryPresent);
  };

  const handleToggleWire = () => {
    setWireConnected(!wireConnected);
  };

  const handleReset = () => {
    setIsPinConnected(false);
    setBatteryPresent(true);
    setWireConnected(true);
    setPinMaterial('metal');
  };

  // Logic checks
  const isConductor = pinMaterial === 'metal';
  const isBulbOn = isPinConnected && batteryPresent && wireConnected && isConductor;
  const isCurrentFlowing = isPinConnected && batteryPresent && wireConnected && isConductor;

  // Science explanation builder based on configuration
  const getExplanation = () => {
    if (!isPinConnected) {
      return {
        title: "Switch is OFF (Circuit Open)",
        desc: "The safety pin is rotated away, leaving an air gap between Drawing Pin 2 and the pin tip. Since air is a very poor conductor, current cannot flow.",
        status: "neutral"
      };
    }
    if (!batteryPresent) {
      return {
        title: "Battery Missing (No Voltage Source)",
        desc: "Even though the switch is closed and the pathway is metallic, there is no electric cell (battery) to push the electrons. A battery provides the electrical energy (voltage) required for current to flow.",
        status: "warning"
      };
    }
    if (!wireConnected) {
      return {
        title: "Wire Broken (Open Circuit)",
        desc: "A broken wire interrupts the pathway. Electric current requires a continuous, unbroken loop from the positive terminal of the cell, through the bulb and switch, back to the negative terminal.",
        status: "warning"
      };
    }
    if (!isConductor) {
      const materialName = pinMaterial === 'plastic' ? 'Plastic' : 'Wood';
      return {
        title: `${materialName} is an Insulator`,
        desc: `Although the switch is physically touching, ${materialName} does not allow electricity to pass through it because it is an insulator. Current cannot flow, so the bulb stays OFF.`,
        status: "danger"
      };
    }
    return {
      title: "Success! Closed Circuit (Current Flows)",
      desc: "All conditions are met: (1) Switch is closed, (2) Battery is present to supply energy, (3) Wires are unbroken, and (4) The safety pin is a metallic conductor (copper/iron). Current flows, lighting up the bulb!",
      status: "success"
    };
  };

  const exp = getExplanation();

  return (
    <div className="main-grid">
      {/* Left Panel: Sandbox Controls */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            Stage 3: Sandbox Lab
          </span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Circuit Explorer</h2>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>
            Interact with the sandbox parameters. Break and modify the circuit to discover how electricity behaves!
          </p>
        </div>

        {/* Dynamic Science Report */}
        <div style={{
          background: exp.status === 'success' ? 'rgba(16, 185, 129, 0.08)' : 
                      exp.status === 'danger' ? 'rgba(239, 68, 68, 0.08)' :
                      exp.status === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(30, 41, 59, 0.6)',
          border: `1px solid ${
            exp.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 
            exp.status === 'danger' ? 'rgba(239, 68, 68, 0.2)' :
            exp.status === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.06)'
          }`,
          borderRadius: '12px',
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem'
        }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: '0.95rem', 
            color: exp.status === 'success' ? '#34d399' : 
                   exp.status === 'danger' ? '#f87171' : 
                   exp.status === 'warning' ? '#fbbf24' : '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            {exp.status === 'success' ? <CheckCircle size={16} /> : <ZapOff size={16} />}
            {exp.title}
          </h4>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            {exp.desc}
          </p>
        </div>

        {/* Sandbox Controls Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* Switch Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#cbd5e1' }}>Safety Pin Switch</span>
            <button 
              onClick={handleToggleSwitch} 
              className="outline" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
            >
              {isPinConnected ? (
                <>
                  <ToggleRight size={16} style={{ color: '#34d399' }} /> Closed (ON)
                </>
              ) : (
                <>
                  <ToggleLeft size={16} /> Open (OFF)
                </>
              )}
            </button>
          </div>

          {/* Battery Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#cbd5e1' }}>Power Source (Battery)</span>
            <button 
              onClick={handleToggleBattery} 
              className={batteryPresent ? 'outline' : 'warning'} 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <Battery size={14} />
              {batteryPresent ? 'Remove Battery' : 'Replace Battery'}
            </button>
          </div>

          {/* Wire Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#cbd5e1' }}>Wires Pathway</span>
            <button 
              onClick={handleToggleWire} 
              className={wireConnected ? 'outline' : 'success'} 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <Scissors size={14} />
              {wireConnected ? 'Cut Wire' : 'Repair Wire'}
            </button>
          </div>

          {/* Pin Material Selector */}
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers size={14} /> Safety Pin Material
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
              <button 
                onClick={() => setPinMaterial('metal')} 
                className={pinMaterial === 'metal' ? 'outline' : ''}
                style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.5rem 0.25rem',
                  borderColor: pinMaterial === 'metal' ? '#6366f1' : 'rgba(255,255,255,0.02)',
                  background: pinMaterial === 'metal' ? 'rgba(99, 102, 241, 0.15)' : '#0f172a'
                }}
              >
                Metal (Conductor)
              </button>
              <button 
                onClick={() => setPinMaterial('plastic')} 
                className={pinMaterial === 'plastic' ? 'outline' : ''}
                style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.5rem 0.25rem',
                  borderColor: pinMaterial === 'plastic' ? '#06b6d4' : 'rgba(255,255,255,0.02)',
                  background: pinMaterial === 'plastic' ? 'rgba(6, 182, 212, 0.15)' : '#0f172a'
                }}
              >
                Plastic (Insulator)
              </button>
              <button 
                onClick={() => setPinMaterial('wood')} 
                className={pinMaterial === 'wood' ? 'outline' : ''}
                style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.5rem 0.25rem',
                  borderColor: pinMaterial === 'wood' ? '#b45309' : 'rgba(255,255,255,0.02)',
                  background: pinMaterial === 'wood' ? 'rgba(180, 83, 9, 0.15)' : '#0f172a'
                }}
              >
                Wood (Insulator)
              </button>
            </div>
          </div>
        </div>

        {/* Sandbox stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '0.5rem',
          background: 'rgba(30, 41, 59, 0.2)',
          borderRadius: '10px',
          padding: '0.75rem',
          marginTop: 'auto',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>BULB EMISSION</span>
            <span style={{ fontWeight: '600', color: isBulbOn ? '#fbbf24' : '#94a3b8' }}>
              {isBulbOn ? '💡 GLOWING' : '🌑 DARK'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>CHARGE FLOW (CURRENT)</span>
            <span style={{ fontWeight: '600', color: isCurrentFlowing ? '#67e8f9' : '#f87171', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              {isCurrentFlowing ? <Zap size={10} /> : <ZapOff size={10} />}
              {isCurrentFlowing ? 'FLOWING' : 'BLOCKED'}
            </span>
          </div>
        </div>

        <button onClick={handleReset} className="outline" style={{ gap: '0.35rem' }}>
          <RotateCcw size={16} /> Reset Sandbox
        </button>
      </div>

      {/* Right Panel: SVG Canvas Workspace */}
      <div className="canvas-container" style={{ padding: '2rem' }}>
        <div className="canvas-bg-grid" />
        
        {/* State Indicators overlay */}
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', gap: '0.4rem', zIndex: 10 }}>
          <span className={`status-badge ${batteryPresent ? 'neutral' : 'warning'}`} style={{ textTransform: 'none' }}>
            {batteryPresent ? 'Battery OK' : 'Battery Removed'}
          </span>
          <span className={`status-badge ${wireConnected ? 'neutral' : 'warning'}`} style={{ textTransform: 'none' }}>
            {wireConnected ? 'Wires Connected' : 'Wire Cut'}
          </span>
        </div>

        {/* SVG Canvas Board */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 600 480" 
          style={{ maxWidth: '600px', maxHeight: '480px' }}
        >
          {/* Cardboard Base */}
          <CardboardSVG />

          {/* Bulb Component */}
          <BulbSVG isPlaced={true} isOn={isBulbOn} />

          {/* Battery Component (Battery is removable!) */}
          <BatterySVG isPlaced={batteryPresent} isTarget={!batteryPresent} onClick={handleToggleBattery} />

          {/* Connecting Wires (Wires can be broken!) */}
          <WiresSVG 
            isWireConnected={true} 
            isBatteryPresent={batteryPresent}
            isBulbPresent={true}
            arePinsPlaced={true}
            isCurrentFlowing={isCurrentFlowing}
            isBroken={!wireConnected}
            onClick={handleToggleWire}
          />

          {/* Drawing Pin 1 (Pivot) */}
          <DrawingPinSVG x={450} y={250} label="Drawing Pin 1" isPlaced={true} />

          {/* Safety Pin (material & rotation are dynamic!) */}
          <motion.g
            animate={{ rotate: isPinConnected ? 0 : -35 }}
            transition={{ type: 'spring', stiffness: 90, damping: 10 }}
            style={{ originX: '450px', originY: '250px', cursor: 'pointer' }}
            onClick={handleToggleSwitch}
          >
            <SafetyPinSVG 
              x={450} 
              y={250} 
              rotation={0}
              isPlaced={true}
              material={pinMaterial}
            />
          </motion.g>

          {/* Drawing Pin 2 (Contact Point) */}
          <DrawingPinSVG x={450} y={370} label="Drawing Pin 2" isPlaced={true} />
        </svg>

        {/* Interactive Instruction Overlay */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', pointerEvents: 'none' }}>
          <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 'bold' }}>SANDBOX MODE ACTIVE</span>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>💡 Pro-Tip: Tap components directly in the diagram (Battery, Wires, Switch) to interact!</span>
        </div>
      </div>
    </div>
  );
}
