import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw, Zap, ZapOff, Battery, Layers, Scissors,
  CheckCircle, XCircle, ToggleLeft, ToggleRight, AlertTriangle, Flame, Lightbulb
} from 'lucide-react';
import {
  CardboardSVG, DrawingPinSVG, SafetyPinSVG,
  BulbSVG, BatterySVG, WiresSVG,
} from './CircuitElements';

// ── Physics helpers ────────────────────────────────────────────────
const MAX_V    = 20;   // input cap for sanity

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function getBulbProfile(v, w) {
  if (v <= 0) return { zone: 'none', label: 'No voltage — bulb off', color: '#475569', brightness: 0 };
  
  if (v > 8) return { zone: 'burned', label: '🔥 BURNED OUT — overpowered!', color: '#ef4444', brightness: 0 };
  
  let score = (v / 1.5) * (0.3 / w);
  
  if (score < 0.2) return { zone: 'active', label: 'Barely visible', color: '#64748b', brightness: 5 };
  if (score < 0.4) return { zone: 'active', label: 'Very dim', color: '#7c6f3e', brightness: 15 };
  if (score < 0.7) return { zone: 'active', label: 'Slightly dim', color: '#a37d2c', brightness: 30 };
  if (score < 1.5) return { zone: 'active', label: 'Normal glow', color: '#d4a017', brightness: 55 };
  if (score < 2.5) return { zone: 'active', label: 'Very bright', color: '#fbbf24', brightness: 85 };
  return           { zone: 'active', label: '⚡ Extremely bright!', color: '#f97316', brightness: 100 };
}

// ── Component ──────────────────────────────────────────────────────
export default function Stage3_Explore() {
  // Existing sandbox states
  const [isPinConnected, setIsPinConnected] = useState(false);
  const [batteryPresent, setBatteryPresent] = useState(true);
  const [wireConnected,  setWireConnected]  = useState(true);
  const [pinMaterial,    setPinMaterial]    = useState('metal');
  const [bulbW,          setBulbW]          = useState(0.3); // 0.3, 0.6, 1.0

  // Voltage experiment states
  const [voltageInput, setVoltageInput] = useState('1.5');
  const [voltage,      setVoltage]      = useState(1.5);
  const [inputError,   setInputError]   = useState('');
  const [burnAnim,     setBurnAnim]      = useState(false);
  const prevZoneRef = useRef('low');

  const profile   = getBulbProfile(voltage, bulbW);
  const isConductor = pinMaterial === 'metal';
  const circuitClosed = isPinConnected && batteryPresent && wireConnected && isConductor;
  // Bulb only burns when circuit is actually closed AND voltage exceeds limit
  const isBurned  = circuitClosed && profile.zone === 'burned';
  const isCurrentFlowing = circuitClosed && !isBurned;
  const isBulbOn  = isCurrentFlowing;
  
  // R = V^2 / P (assuming 1.5V rating)
  const R = 2.25 / bulbW;
  const current   = isCurrentFlowing ? +(voltage / R).toFixed(2) : 0;
  const brightness = isBulbOn ? profile.brightness : 0;

  // Only animate burn when circuit is closed AND voltage crosses the burn threshold
  useEffect(() => {
    if (circuitClosed && profile.zone === 'burned' && prevZoneRef.current !== 'burned') {
      setBurnAnim(true);
      setTimeout(() => setBurnAnim(false), 2000);
    }
    prevZoneRef.current = profile.zone;
  }, [profile.zone, circuitClosed]);

  const handleVoltageApply = () => {
    const v = parseFloat(voltageInput);
    if (isNaN(v) || v < 0) { setInputError('Enter a valid positive number'); return; }
    if (v > MAX_V)          { setInputError(`Max input is ${MAX_V} V`); return; }
    setInputError('');
    setVoltage(clamp(v, 0, MAX_V));
  };

  const handleReset = () => {
    setIsPinConnected(false); setBatteryPresent(true);
    setWireConnected(true);   setPinMaterial('metal');
    setVoltageInput('1.5');   setVoltage(1.5);
    setBulbW(0.3);
    setInputError('');        setBurnAnim(false);
  };

  // Science explanation for existing sandbox controls
  const getExplanation = () => {
    if (isBurned)        return { title:'Bulb Burned Out!', desc:`${voltage}V overpowers the ${bulbW}W bulb. Too much current flowed through the filament, destroying it.`, status:'danger' };
    if (!isPinConnected) return { title:'Switch is OFF (Open Circuit)', desc:'The safety pin is rotated away, leaving an air gap. Air is a poor conductor so current cannot flow.', status:'neutral' };
    if (!batteryPresent) return { title:'Battery Missing', desc:'No voltage source means no energy to push electrons. The circuit is incomplete without a battery.', status:'warning' };
    if (!wireConnected)  return { title:'Wire Broken (Open Circuit)', desc:'A broken wire interrupts the path. Current needs a continuous loop to flow.', status:'warning' };
    if (!isConductor)    return { title:`${pinMaterial === 'plastic' ? 'Plastic' : 'Wood'} is an Insulator`, desc:'Insulators block current flow regardless of physical contact.', status:'danger' };
    return { title:'Closed Circuit — Current Flowing', desc:`At ${voltage}V with a ${bulbW}W bulb, current is ${current}A. Brightness is ${profile.label.toLowerCase()}.`, status:'success' };
  };
  const exp = getExplanation();
  const expColors = { success:'#34d399', danger:'#f87171', warning:'#fbbf24', neutral:'#e2e8f0' };

  return (
    <div className="main-grid">
      {/* ── LEFT PANEL ── */}
      <div className="glass-panel" style={{ display:'flex', flexDirection:'column', gap:'1rem', overflowY:'auto' }}>
        <div>
          <span className="status-badge neutral" style={{ background:'rgba(16,185,129,0.15)', color:'#34d399' }}>
            Stage 3: Sandbox Lab
          </span>
          <h2 style={{ marginTop:'0.5rem', marginBottom:'0.25rem' }}>Circuit Explorer</h2>
          <p style={{ fontSize:'0.85rem', margin:0, color:'#94a3b8' }}>
            Change voltage, toggle components, and discover how electricity behaves.
          </p>
        </div>

        {/* ── VOLTAGE EXPERIMENT CARD ── */}
        <div style={{ background:'rgba(30,41,59,0.6)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:'14px', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
            <Zap size={15} style={{ color:'#fbbf24' }} />
            <span style={{ fontSize:'0.85rem', fontWeight:'700', color:'#cbd5e1' }}>Voltage Experiment</span>
          </div>

          {/* Free text input */}
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <div style={{ flex:1, position:'relative' }}>
              <input
                type="number"
                min="0"
                max={MAX_V}
                step="0.1"
                value={voltageInput}
                onChange={e => setVoltageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleVoltageApply()}
                placeholder="e.g. 2.8"
                style={{
                  width:'100%', boxSizing:'border-box',
                  padding:'0.5rem 0.75rem',
                  background:'rgba(15,23,42,0.8)',
                  border:`1px solid ${inputError ? '#ef4444' : 'rgba(99,102,241,0.3)'}`,
                  borderRadius:'8px', color:'#e2e8f0', fontSize:'0.9rem',
                  outline:'none',
                }}
              />
              <span style={{ position:'absolute', right:'0.6rem', top:'50%', transform:'translateY(-50%)', color:'#64748b', fontSize:'0.8rem', pointerEvents:'none' }}>V</span>
            </div>
            <button
              onClick={handleVoltageApply}
              style={{
                padding:'0.5rem 0.9rem', borderRadius:'8px', fontSize:'0.8rem', fontWeight:'700',
                background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.4)',
                color:'#a5b4fc', cursor:'pointer', transition:'all 0.2s',
              }}
            >
              Apply
            </button>
          </div>
          {inputError && <p style={{ margin:0, fontSize:'0.72rem', color:'#f87171' }}>{inputError}</p>}

          {/* Quick preset buttons */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.3rem' }}>
            {[1.5, 3, 6, 9].map(v => {
              const p = getBulbProfile(v, bulbW);
              return (
                <button key={v} onClick={() => { setVoltageInput(String(v)); setVoltage(v); setInputError(''); }}
                  style={{
                    padding:'0.3rem 0', borderRadius:'7px', fontSize:'0.72rem', fontWeight:'700',
                    border:`1px solid ${voltage === v ? p.color : 'rgba(255,255,255,0.07)'}`,
                    background: voltage === v ? `${p.color}22` : 'rgba(15,23,42,0.4)',
                    color: voltage === v ? p.color : '#64748b', cursor:'pointer', transition:'all 0.2s',
                  }}>
                  {v}V
                </button>
              );
            })}
          </div>

          {/* Zone badge — contextual based on circuit state */}
          <div style={{ background:`${profile.color}18`, border:`1px solid ${profile.color}44`, borderRadius:'8px', padding:'0.5rem 0.7rem' }}>
            <p style={{ margin:0, fontSize:'0.75rem', fontWeight:'600', color: profile.color }}>
              {profile.zone === 'burned' && !circuitClosed
                ? `⚡ ${voltage}V set — close the switch to see the effect (will burn at this voltage!)`
                : profile.label}
            </p>
          </div>

          {/* Observation guide reference table */}
          <div style={{ fontSize:'0.68rem', color:'#94a3b8', lineHeight:1.6 }}>
            <p style={{ margin:'0 0 0.3rem 0', fontWeight:'700', color:'#64748b', letterSpacing:'0.04em' }}>OBSERVATION GUIDE</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0.2rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '0.2rem', fontWeight: '600' }}>Battery</th>
                  <th style={{ textAlign: 'left', paddingBottom: '0.2rem', fontWeight: '600' }}>Bulb</th>
                  <th style={{ textAlign: 'left', paddingBottom: '0.2rem', fontWeight: '600' }}>Brightness</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { v: 1.5, w: 0.3, label: 'Normal glow', color: '#d4a017' },
                  { v: 1.5, w: 0.6, label: 'Slightly dim', color: '#a37d2c' },
                  { v: 1.5, w: 1.0, label: 'Very dim', color: '#7c6f3e' },
                  { v: 3.0, w: 0.3, label: 'Very bright', color: '#fbbf24' },
                  { v: 9.0, w: 0.3, label: '🔥 Burnt out', color: '#ef4444' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', background: (voltage === row.v && bulbW === row.w) ? 'rgba(99,102,241,0.15)' : 'transparent' }}>
                    <td style={{ padding: '0.2rem 0' }}>{row.v}V</td>
                    <td style={{ padding: '0.2rem 0' }}>{row.w}W</td>
                    <td style={{ padding: '0.2rem 0', color: row.color, fontWeight: '600' }}>{row.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Live readings */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.4rem', background:'rgba(15,23,42,0.5)', borderRadius:'8px', padding:'0.5rem' }}>
            {[
              { label:'VOLTAGE', value:`${voltage}V`, color:'#60a5fa' },
              { label:'CURRENT', value: isCurrentFlowing ? `${current}A` : '0A', color: isCurrentFlowing ? '#34d399' : '#475569' },
              { label:'BRIGHTNESS', value: isBurned ? 'BURNED' : `${brightness}%`, color: isBurned ? '#ef4444' : brightness > 0 ? '#fbbf24' : '#475569' },
            ].map(m => (
              <div key={m.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.1rem' }}>
                <span style={{ fontSize:'0.58rem', color:'#475569', fontWeight:'700', letterSpacing:'0.05em' }}>{m.label}</span>
                <span style={{ fontSize:'0.82rem', fontWeight:'800', color:m.color }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Key concept */}
          <p style={{ margin:0, fontSize:'0.7rem', color:'#64748b', lineHeight:1.5, borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'0.5rem' }}>
            <strong style={{ color:'#818cf8' }}>Key Concept:</strong> The switch controls <em>whether</em> current flows.
            The voltage determines <em>how much</em> energy pushes that current — and how bright the bulb glows.
          </p>
        </div>

        {/* ── EXISTING SANDBOX CONTROLS ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
          {/* Science report */}
          <div style={{
            background: exp.status === 'success' ? 'rgba(16,185,129,0.08)' : exp.status === 'danger' ? 'rgba(239,68,68,0.08)' : exp.status === 'warning' ? 'rgba(245,158,11,0.08)' : 'rgba(30,41,59,0.6)',
            border:`1px solid ${exp.status === 'success' ? 'rgba(16,185,129,0.2)' : exp.status === 'danger' ? 'rgba(239,68,68,0.2)' : exp.status === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius:'10px', padding:'0.8rem',
          }}>
            <h4 style={{ margin:'0 0 0.3rem 0', fontSize:'0.85rem', color:expColors[exp.status], display:'flex', alignItems:'center', gap:'0.35rem' }}>
              {exp.status === 'success' ? <CheckCircle size={14}/> : <ZapOff size={14}/>} {exp.title}
            </h4>
            <p style={{ margin:0, fontSize:'0.75rem', color:'#cbd5e1', lineHeight:1.5 }}>{exp.desc}</p>
          </div>

          {[
            { label:'Safety Pin Switch', action: () => setIsPinConnected(p => !p), btnLabel: isPinConnected ? 'Closed (ON)' : 'Open (OFF)', icon: isPinConnected ? <ToggleRight size={14} style={{color:'#34d399'}}/> : <ToggleLeft size={14}/> },
            { label:'Power Source (Battery)', action: () => setBatteryPresent(p => !p), btnLabel: batteryPresent ? 'Remove Battery' : 'Replace Battery', icon: <Battery size={14}/> },
            { label:'Wires Pathway', action: () => setWireConnected(p => !p), btnLabel: wireConnected ? 'Cut Wire' : 'Repair Wire', icon: <Scissors size={14}/> },
          ].map(ctrl => (
            <div key={ctrl.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'0.82rem', color:'#cbd5e1' }}>{ctrl.label}</span>
              <button onClick={ctrl.action} className="outline" style={{ padding:'0.35rem 0.7rem', fontSize:'0.78rem', gap:'0.3rem' }}>
                {ctrl.icon} {ctrl.btnLabel}
              </button>
            </div>
          ))}

          {/* Material selector */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
            <span style={{ fontSize:'0.82rem', color:'#cbd5e1', display:'flex', alignItems:'center', gap:'0.35rem' }}><Layers size={13}/> Safety Pin Material</span>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.35rem' }}>
              {[['metal','Metal','#6366f1'],['plastic','Plastic','#06b6d4'],['wood','Wood','#b45309']].map(([id,label,clr]) => (
                <button key={id} onClick={() => setPinMaterial(id)} style={{
                  fontSize:'0.72rem', padding:'0.45rem 0.2rem', borderRadius:'7px',
                  border:`1px solid ${pinMaterial === id ? clr : 'rgba(255,255,255,0.04)'}`,
                  background: pinMaterial === id ? `${clr}22` : '#0f172a',
                  color: pinMaterial === id ? clr : '#64748b', cursor:'pointer',
                }}>{label}</button>
              ))}
            </div>
          </div>

          {/* Bulb Wattage selector */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
            <span style={{ fontSize:'0.82rem', color:'#cbd5e1', display:'flex', alignItems:'center', gap:'0.35rem' }}>
              <Lightbulb size={13} /> Select Bulb (Wattage)
            </span>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.35rem' }}>
              {[
                { w: 0.3, label: '0.3W Mini' },
                { w: 0.6, label: '0.6W Std' },
                { w: 1.0, label: '1.0W Pro' }
              ].map((b) => (
                <button 
                  key={b.w}
                  onClick={() => setBulbW(b.w)} 
                  className={bulbW === b.w ? 'outline' : ''}
                  style={{ 
                    fontSize: '0.72rem', 
                    padding: '0.45rem 0.2rem',
                    borderRadius:'7px',
                    borderColor: bulbW === b.w ? '#fbbf24' : 'rgba(255,255,255,0.04)',
                    background: bulbW === b.w ? 'rgba(251, 191, 36, 0.15)' : '#0f172a',
                    color: bulbW === b.w ? '#fbbf24' : '#64748b',
                    cursor:'pointer'
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleReset} className="outline" style={{ gap:'0.35rem', marginTop:'auto' }}>
          <RotateCcw size={14}/> Reset Sandbox
        </button>
      </div>

      {/* ── RIGHT PANEL — Circuit Canvas ── */}
      <div className="canvas-container" style={{ padding:'2rem' }}>
        <div className="canvas-bg-grid"/>

        {/* Status badges */}
        <div style={{ position:'absolute', top:'1rem', right:'1rem', display:'flex', gap:'0.35rem', zIndex:10, flexWrap:'wrap', justifyContent:'flex-end' }}>
          <span className={`status-badge ${batteryPresent ? 'neutral' : 'warning'}`} style={{ textTransform:'none' }}>
            {batteryPresent ? 'Battery OK' : 'Battery Removed'}
          </span>
          <span className={`status-badge ${wireConnected ? 'neutral' : 'warning'}`} style={{ textTransform:'none' }}>
            {wireConnected ? 'Wires OK' : 'Wire Cut'}
          </span>
          <span style={{ fontSize:'0.72rem', fontWeight:'700', padding:'0.2rem 0.6rem', borderRadius:'20px', background:`${profile.color}22`, border:`1px solid ${profile.color}55`, color:profile.color }}>
            {voltage}V
          </span>
        </div>

        {/* SVG Circuit */}
        <svg width="100%" height="100%" viewBox="0 0 600 480" style={{ maxWidth:'600px', maxHeight:'480px' }}>
          <CardboardSVG/>

          {/* Bulb with brightness filter */}
          <g style={{ filter: isBurned ? 'grayscale(1) brightness(0.3)' : `brightness(${0.35 + brightness / 130})`, transition:'filter 0.4s' }}>
            <BulbSVG isPlaced={true} isOn={isBulbOn}/>
          </g>

          {/* No cross symbol — burn effect shown via greyscale filter only */}

          {/* Flame animation on burn */}
          <AnimatePresence>
            {burnAnim && (
              <motion.text x={270} y={20} fontSize={28}
                initial={{ opacity:1, y:20 }} animate={{ opacity:0, y:-10 }} transition={{ duration:1.8 }}>
                🔥
              </motion.text>
            )}
          </AnimatePresence>

          {/* Glow ring around bulb */}
          {isBulbOn && (
            <circle cx={300} cy={55} r={28 + brightness * 0.12}
              fill="none" stroke={profile.color} strokeWidth={3}
              opacity={0.15 + brightness * 0.005}
              style={{ filter:'blur(5px)', transition:'all 0.4s' }}
            />
          )}

          <BatterySVG isPlaced={batteryPresent} isTarget={!batteryPresent} onClick={() => setBatteryPresent(p=>!p)}/>

          <WiresSVG
            isWireConnected={true}
            isBatteryPresent={batteryPresent}
            isBulbPresent={true}
            arePinsPlaced={true}
            isCurrentFlowing={isCurrentFlowing}
            isBroken={!wireConnected}
            onClick={() => setWireConnected(p=>!p)}
          />

          <DrawingPinSVG x={450} y={250} label="Drawing Pin 1" isPlaced={true}/>

          <motion.g
            animate={{ rotate: isPinConnected ? 0 : -35 }}
            transition={{ type:'spring', stiffness:90, damping:10 }}
            style={{ originX:'450px', originY:'250px', cursor:'pointer' }}
            onClick={() => setIsPinConnected(p=>!p)}
          >
            <SafetyPinSVG x={450} y={250} rotation={0} isPlaced={true} material={pinMaterial}/>
          </motion.g>

          <DrawingPinSVG x={450} y={370} label="Drawing Pin 2" isPlaced={true}/>
        </svg>

        {/* Live overlay */}
        {(isBulbOn || isBurned) && (
          <div style={{ position:'absolute', bottom:'1rem', left:'1rem', background:'rgba(15,23,42,0.85)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'0.45rem 0.75rem', display:'flex', gap:'1rem', backdropFilter:'blur(4px)' }}>
            {[
              { l:'V', v:`${voltage}V`, c:'#60a5fa' },
              { l:'I', v:`${current}A`, c:'#34d399' },
              { l:'Brightness', v: isBurned ? '🔥 BURNED' : `${brightness}%`, c: isBurned ? '#ef4444' : '#fbbf24' },
            ].map(m => (
              <div key={m.l} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <span style={{ fontSize:'0.58rem', color:'#64748b', fontWeight:'700' }}>{m.l}</span>
                <span style={{ fontSize:'0.8rem', fontWeight:'800', color:m.c }}>{m.v}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ position:'absolute', bottom:'1rem', right:'1rem', display:'flex', flexDirection:'column', gap:'0.2rem', pointerEvents:'none' }}>
          <span style={{ fontSize:'0.7rem', color:'#475569', fontWeight:'bold' }}>SANDBOX MODE</span>
          <span style={{ fontSize:'0.68rem', color:'#334155' }}>Tap battery, wires or switch directly</span>
        </div>
      </div>
    </div>
  );
}
