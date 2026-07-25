import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, CheckCircle2, XCircle, Info } from 'lucide-react';
import ObjectIcon from './ObjectIcons';

/*
  Activity 13 (Demo): Which materials does a magnet attract?
  A predict-then-observe lab based on Table 4.1.
  Flow per object:  Predict (Will stick / Won't stick)  ->  Test with magnet (animated)  ->  Result recorded + match check.
*/

const ITEMS = [
  { id: 'wood',     name: 'Wooden Block',  material: 'Wood',    icon: '🧱', magnetic: false },
  { id: 'screw',    name: 'Screw',         material: 'Iron',    icon: '🔩', magnetic: true  },
  { id: 'eraser',   name: 'Eraser',        material: 'Rubber',  icon: '🧽', magnetic: false },
  { id: 'clip',     name: 'Paper Clip',    material: 'Steel',   icon: '📎', magnetic: true  },
  { id: 'copper',   name: 'Copper Wire',   material: 'Copper',  icon: '🧵', magnetic: false },
  { id: 'key',      name: 'Key',           material: 'Iron',    icon: '🔑', magnetic: true  },
  { id: 'sharpener',name: 'Sharpener',     material: 'Steel blade', icon: '📐', magnetic: true },
  { id: 'nails',    name: 'Nails',         material: 'Iron',    icon: '📌', magnetic: true  },
  { id: 'mirror',   name: 'Mirror',        material: 'Glass',   icon: '🪞', magnetic: false },
  { id: 'marker',   name: 'Marker',        material: 'Plastic', icon: '🖊️', magnetic: false },
  { id: 'glass',    name: 'Glass Tumbler', material: 'Glass',   icon: '🥛', magnetic: false },
  { id: 'scissors', name: 'Scissors',      material: 'Steel',   icon: '✂️', magnetic: true  },
  { id: 'candle',   name: 'Candle',        material: 'Wax',     icon: '🕯️', magnetic: false },
  { id: 'ruler',    name: 'Plastic Ruler', material: 'Plastic', icon: '📏', magnetic: false },
  { id: 'stapler',  name: 'Stapler',       material: 'Steel',   icon: '📎', magnetic: true  },
  { id: 'pencil',   name: 'Pencil',        material: 'Wood',    icon: '✏️', magnetic: false },
  { id: 'cloth',    name: 'Cloth',         material: 'Fabric',  icon: '🧣', magnetic: false }
];

function BarMagnet({ size = 1 }) {
  return (
    <div style={{
      display: 'flex',
      borderRadius: `${8 * size}px`,
      overflow: 'hidden',
      boxShadow: '0 6px 14px rgba(0,0,0,0.35)',
      width: `${72 * size}px`,
      height: `${32 * size}px`,
      fontWeight: 'bold',
      color: 'white',
      fontFamily: 'sans-serif',
      flexShrink: 0
    }}>
      <div style={{ flex: 1, background: 'linear-gradient(135deg,#f87171,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${13 * size}px` }}>N</div>
      <div style={{ flex: 1, background: 'linear-gradient(135deg,#60a5fa,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${13 * size}px` }}>S</div>
    </div>
  );
}

function ObjectCard({ item, prediction, phase, onPredict, onTest }) {
  // phase: 'idle' | 'testing' | 'done'
  const testing = phase === 'testing';
  const done = phase === 'done';
  const pulled = (testing || done) && item.magnetic;
  const matched = done && ((prediction === 'yes') === item.magnetic);

  return (
    <div style={{
      background: 'var(--surface)',
      border: done
        ? `1px solid ${item.magnetic ? '#10b981' : '#ef4444'}`
        : prediction ? '1px solid var(--accent-border)' : '1px solid var(--border)',
      borderRadius: '14px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      transition: 'border-color .25s',
      overflow: 'hidden'
    }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.name}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.material}</span>
      </div>

      {/* Test stage: object on left, magnet slides in from right */}
      <div style={{
        position: 'relative',
        height: '68px',
        borderRadius: '10px',
        background: 'var(--surface-hover)',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        {/* Object icon */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '16px',
          transform: `translate(${pulled ? '46px' : '0'}, -50%) rotate(${pulled ? '-12deg' : '0deg'})`,
          transition: 'transform .45s cubic-bezier(.34,1.56,.64,1)',
          filter: done && !item.magnetic ? 'grayscale(0.2) opacity(0.9)' : 'none',
          lineHeight: 0
        }}>
          <ObjectIcon id={item.id} size={44} />
        </div>

        {/* Magnet */}
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '14px',
          transform: `translateY(-50%) translateX(${(testing || done) ? '0' : '90px'})`,
          transition: 'transform .4s ease-out',
          animation: testing && !item.magnetic ? 'mg-shake .35s ease-in-out 2' : 'none'
        }}>
          <BarMagnet size={0.9} />
        </div>

        {/* attraction spark */}
        {done && item.magnetic && (
          <Sparkles size={16} style={{ position: 'absolute', top: '10px', left: '58px', color: '#f59e0b' }} />
        )}
      </div>

      {/* Prediction row */}
      {!done ? (
        <>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>
            {prediction ? 'Your prediction is locked in' : 'Will it stick to the magnet?'}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onPredict(item.id, 'yes')}
              disabled={testing}
              style={predBtn(prediction === 'yes', '#10b981')}
            >
              👍 Will stick
            </button>
            <button
              onClick={() => onPredict(item.id, 'no')}
              disabled={testing}
              style={predBtn(prediction === 'no', '#3b82f6')}
            >
              👎 Won't
            </button>
          </div>
          <button
            onClick={() => onTest(item.id)}
            disabled={!prediction || testing}
            className={prediction && !testing ? 'primary' : ''}
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              border: 'none',
              cursor: prediction && !testing ? 'pointer' : 'not-allowed',
              background: prediction && !testing ? 'var(--accent)' : 'var(--border)',
              color: prediction && !testing ? '#fff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
            }}
          >
            {testing ? 'Testing…' : 'Bring magnet close'}
          </button>
        </>
      ) : (
        /* Result row */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            fontWeight: 700, fontSize: '0.9rem',
            color: item.magnetic ? '#10b981' : '#ef4444'
          }}>
            {item.magnetic ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {item.magnetic ? 'Attracted' : 'No pull'}
          </div>
          <div style={{
            textAlign: 'center', fontSize: '0.75rem', fontWeight: 600,
            color: matched ? '#10b981' : '#f59e0b'
          }}>
            {matched ? '✓ Your prediction matched' : '✗ Surprise! Prediction differed'}
          </div>
        </div>
      )}
    </div>
  );
}

function predBtn(active, color) {
  return {
    flex: 1,
    padding: '0.45rem',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all .2s',
    border: active ? `1.5px solid ${color}` : '1px solid var(--border)',
    background: active ? `${color}22` : 'transparent',
    color: active ? color : 'var(--text-secondary)'
  };
}

export default function MagneticDemo({ onBackToDashboard = () => {} }) {
  const [predictions, setPredictions] = useState({});
  const [phases, setPhases] = useState({}); // id -> 'testing' | 'done'

  const handlePredict = (id, choice) => {
    if (phases[id]) return;
    setPredictions(prev => ({ ...prev, [id]: choice }));
  };

  const handleTest = (id) => {
    if (!predictions[id] || phases[id]) return;
    setPhases(prev => ({ ...prev, [id]: 'testing' }));
    setTimeout(() => {
      setPhases(prev => ({ ...prev, [id]: 'done' }));
    }, 900);
  };

  const reset = () => { setPredictions({}); setPhases({}); };

  const testedCount = Object.values(phases).filter(p => p === 'done').length;
  const predictedCount = Object.keys(predictions).length;
  const correct = useMemo(
    () => ITEMS.filter(i => phases[i.id] === 'done' && ((predictions[i.id] === 'yes') === i.magnetic)).length,
    [phases, predictions]
  );
  const allDone = testedCount === ITEMS.length;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes mg-shake{0%,100%{transform:translateY(-50%) translateX(0)}25%{transform:translateY(-50%) translateX(-6px)}75%{transform:translateY(-50%) translateX(6px)}}`}</style>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem',
        flexWrap: 'wrap', gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBackToDashboard} className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}>
            <ArrowLeft size={14} /> Back to Class 6 Wing
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarMagnet size={0.7} /> Activity 13: Magnetic Materials Demo
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Class 6 Science · Chapter 13 (Demo) — Predict, then observe with a magnet
            </span>
          </div>
        </div>
        <button onClick={reset} className="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', border: '1px solid var(--accent-border)', marginBottom: '1.25rem' }}>
        <Info size={22} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          For each object, first <strong>predict</strong> whether the magnet will attract it (👍 / 👎). Then click
          <strong> “Bring magnet close”</strong> to observe what really happens, and see if your guess matched. Test all {ITEMS.length} objects.
        </p>
      </div>

      {/* Progress */}
      <div style={{
        display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap',
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px',
        padding: '0.85rem 1.25rem', marginBottom: '1.25rem'
      }}>
        <Stat label="Predicted" value={`${predictedCount}/${ITEMS.length}`} color="#3b82f6" />
        <Stat label="Tested" value={`${testedCount}/${ITEMS.length}`} color="var(--accent)" />
        <Stat label="Predictions correct" value={`${correct}/${testedCount || 0}`} color="#f59e0b" />
        <div style={{ flex: 1, minWidth: '120px', height: '8px', background: 'var(--surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${(testedCount / ITEMS.length) * 100}%`, height: '100%', background: 'var(--accent)', transition: 'width .4s' }} />
        </div>
      </div>

      {/* Completion banner */}
      {allDone && (
        <div className="glass-panel" style={{ border: '1px solid #10b981', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} style={{ color: '#f59e0b' }} /> Lab complete!
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            You predicted <strong>{correct} of {ITEMS.length}</strong> correctly. Notice the pattern: the magnet only pulled the
            objects made of <strong>iron and steel</strong> (screw, paper clip, key, sharpener, nails, scissors, stapler).
            Wood, rubber, glass, plastic, wax, cloth — and even <strong>copper</strong> — were not attracted. Magnetic materials
            are special metals; most everyday materials are non-magnetic.
          </p>
          <div>
            <button onClick={onBackToDashboard} className="primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', gap: '0.4rem' }}>
              Finish <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Grid of objects */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        gap: '1rem'
      }}>
        {ITEMS.map(item => (
          <ObjectCard
            key={item.id}
            item={item}
            prediction={predictions[item.id]}
            phase={phases[item.id] || 'idle'}
            onPredict={handlePredict}
            onTest={handleTest}
          />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ fontSize: '1.05rem', fontWeight: 700, color }}>{value}</span>
    </div>
  );
}
