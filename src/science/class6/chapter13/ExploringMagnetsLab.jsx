import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  ArrowLeft, ArrowRight, RotateCcw, Sparkles, CheckCircle2, XCircle,
  Info, Compass, Magnet, Wind, HelpCircle, Trophy, Lightbulb
} from 'lucide-react';
import ObjectIcon from './ObjectIcons';

/*
  Exploring Magnets — Class 6 Science (Curiosity) interactive lab.
  A guided, multi-section experience covering the whole chapter:
    0. Story & Magnet Shapes
    1. Magnetic vs Non-magnetic Materials     (Activity 4.1)
    2. Poles of a Magnet                       (Activity 4.2)
    3. Finding Directions                      (Activity 4.3)
    4. The Magnetic Compass                    (Activity 4.4)
    5. Attraction & Repulsion                  (Activity 4.5 / 4.6)
    6. Magnetism Through Materials             (Activity 4.7)
    7. Fun with Magnets                        (Section 4.5)
    8. Test Yourself                           (Let us enhance our learning)
*/

/* ----------------------------------------------------------------- */
/* Shared visual primitives                                          */
/* ----------------------------------------------------------------- */

const poleFill = (letter) =>
  letter === 'N'
    ? 'linear-gradient(135deg,#f87171,#dc2626)'
    : 'linear-gradient(135deg,#60a5fa,#2563eb)';

// A bar magnet drawn with two coloured halves. `vertical` stacks poles top→bottom.
function BarMagnet({ length = 120, thickness = 40, poles = ['N', 'S'], vertical = false, fontSize = 16, radius = 8 }) {
  const w = vertical ? thickness : length;
  const h = vertical ? length : thickness;
  return (
    <div style={{
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      width: w, height: h,
      borderRadius: radius,
      overflow: 'hidden',
      boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
      fontWeight: 800, color: '#fff', fontFamily: 'sans-serif', flexShrink: 0,
      userSelect: 'none'
    }}>
      {poles.map((p, i) => (
        <div key={i} style={{
          flex: 1, background: poleFill(p),
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize
        }}>{p}</div>
      ))}
    </div>
  );
}

// 8-point compass rose used as a backdrop.
function CompassRose({ size = 260 }) {
  const c = size / 2;
  const marks = [
    { a: 0, l: 'N', big: true }, { a: 45, l: 'NE' }, { a: 90, l: 'E', big: true },
    { a: 135, l: 'SE' }, { a: 180, l: 'S', big: true }, { a: 225, l: 'SW' },
    { a: 270, l: 'W', big: true }, { a: 315, l: 'NW' }
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0 }}>
      <circle cx={c} cy={c} r={c - 4} fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
      <circle cx={c} cy={c} r={c - 26} fill="none" stroke="var(--border)" strokeWidth="1" opacity="0.6" />
      {marks.map(m => {
        const rad = (m.a - 90) * Math.PI / 180;
        const r = c - 16;
        const x = c + r * Math.cos(rad);
        const y = c + r * Math.sin(rad);
        return (
          <text key={m.l} x={x} y={y} textAnchor="middle" dominantBaseline="central"
            fontSize={m.big ? 15 : 10} fontWeight={m.big ? 800 : 600}
            fill={m.l === 'N' ? '#dc2626' : 'var(--text-muted)'}>{m.l}</text>
        );
      })}
      {/* cross hairs */}
      <line x1={c} y1={18} x2={c} y2={size - 18} stroke="var(--border)" strokeWidth="1" opacity="0.5" />
      <line x1={18} y1={c} x2={size - 18} y2={c} stroke="var(--border)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// A compass needle (red N half / grey S half) that rotates to `angle` degrees.
function Needle({ angle, length = 150, settling }) {
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      width: 0, height: 0,
      transform: `translate(-50%,-50%) rotate(${angle}deg)`,
      transition: settling ? 'transform 1s cubic-bezier(.22,1.4,.5,1)' : 'none'
    }}>
      <div style={{
        position: 'absolute', left: -6, top: -length / 2, width: 12, height: length,
        clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
        background: 'linear-gradient(180deg,#dc2626 0 50%, #cbd5e1 50% 100%)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      }} />
      <div style={{
        position: 'absolute', left: -5, top: -5, width: 10, height: 10, borderRadius: '50%',
        background: 'var(--text-heading)', border: '2px solid var(--surface)'
      }} />
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Small layout helpers                                              */
/* ----------------------------------------------------------------- */

function Panel({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
      padding: '1.25rem', ...style
    }}>{children}</div>
  );
}

function SectionHeading({ tag, title, blurb }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {tag && <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-text)' }}>{tag}</div>}
      <h2 style={{ margin: '0.15rem 0 0.4rem', fontSize: '1.5rem', color: 'var(--text-heading)' }}>{title}</h2>
      {blurb && <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 720 }}>{blurb}</p>}
    </div>
  );
}

function Note({ icon: I = Lightbulb, tone = 'accent', children }) {
  const color = tone === 'success' ? '#10b981' : tone === 'warn' ? '#f59e0b' : 'var(--accent)';
  return (
    <div style={{
      display: 'flex', gap: '0.65rem', alignItems: 'flex-start',
      background: 'var(--surface-hover)', border: `1px solid ${color}55`,
      borderLeft: `3px solid ${color}`, borderRadius: 12, padding: '0.85rem 1rem'
    }}>
      <I size={18} style={{ color, flexShrink: 0, marginTop: 2 }} />
      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

/* ================================================================= */
/* SECTION 0 — Story & Magnet Shapes                                 */
/* ================================================================= */

const SHAPES = [
  { id: 'bar', name: 'Bar Magnet', poles: 'A rectangular block — the classic magnet you meet in the lab.' },
  { id: 'u', name: 'U-shaped Magnet', poles: 'Also called a horseshoe magnet; both poles point the same way for a stronger pull.' },
  { id: 'ring', name: 'Ring Magnet', poles: 'A flat disc with a hole — poles are on the two circular faces.' },
  { id: 'disc', name: 'Disc Magnet', poles: 'A small thin cylinder used in stickers, fridge magnets and toys.' },
  { id: 'cyl', name: 'Cylindrical Magnet', poles: 'A rod-shaped magnet with poles at its two circular ends.' },
  { id: 'sph', name: 'Spherical Magnet', poles: 'A ball magnet — even a sphere still has a North and a South pole.' }
];

function ShapeGlyph({ id, active }) {
  const N = '#dc2626', S = '#2563eb', stroke = active ? 'var(--accent)' : 'var(--border)';
  const common = { stroke, strokeWidth: 1.5 };
  switch (id) {
    case 'bar':
      return <svg width="70" height="44" viewBox="0 0 70 44"><rect x="2" y="12" width="33" height="20" fill={N} {...common} /><rect x="35" y="12" width="33" height="20" fill={S} {...common} /><text x="18" y="26" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">N</text><text x="51" y="26" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">S</text></svg>;
    case 'u':
      return <svg width="60" height="60" viewBox="0 0 60 60"><path d="M12 8 L12 40 A18 18 0 0 0 48 40 L48 8" fill="none" stroke="#9ca3af" strokeWidth="12" /><rect x="6" y="6" width="12" height="12" fill={N} {...common} /><rect x="42" y="6" width="12" height="12" fill={S} {...common} /></svg>;
    case 'ring':
      return <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill={N} {...common} /><circle cx="30" cy="30" r="22" fill={S} stroke="none" /><circle cx="30" cy="30" r="9" fill="var(--surface)" {...common} /></svg>;
    case 'disc':
      return <svg width="64" height="44" viewBox="0 0 64 44"><ellipse cx="32" cy="14" rx="28" ry="9" fill={N} {...common} /><path d="M4 14 v10 a28 9 0 0 0 56 0 v-10" fill={S} {...common} /><ellipse cx="32" cy="14" rx="28" ry="9" fill={N} {...common} /></svg>;
    case 'cyl':
      return <svg width="70" height="34" viewBox="0 0 70 34"><rect x="8" y="6" width="54" height="22" rx="4" fill="none" {...common} /><rect x="8" y="6" width="27" height="22" fill={N} {...common} rx="4" /><rect x="35" y="6" width="27" height="22" fill={S} {...common} /><ellipse cx="8" cy="17" rx="6" ry="11" fill={N} {...common} /></svg>;
    case 'sph':
      return <svg width="56" height="56" viewBox="0 0 56 56"><defs><clipPath id="sc"><circle cx="28" cy="28" r="24" /></clipPath></defs><g clipPath="url(#sc)"><rect x="4" y="4" width="48" height="24" fill={N} /><rect x="4" y="28" width="48" height="24" fill={S} /></g><circle cx="28" cy="28" r="24" fill="none" {...common} /></svg>;
    default: return null;
  }
}

function StorySection() {
  const [sel, setSel] = useState('bar');
  const shape = SHAPES.find(s => s.id === sel);
  return (
    <div>
      <SectionHeading tag="Introduction" title="How do we find our way without stars?"
        blurb="Reshma is writing a story about sailors caught in a storm — with clouds hiding the stars, how could they find their direction? The answer led her to the magnetic compass, and to a curiosity about magnets all around us." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <Panel>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-heading)', fontSize: '1.05rem' }}>Magnets are everywhere</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Pencil boxes and purses that click shut, the duster on a writing board, stickers, toys and fridge magnets — all hide small <strong>magnets</strong>. The very first magnets were natural stones called <strong>lodestones</strong>. Today we make magnets from iron and other materials in many shapes.
          </p>
        </Panel>
        <Panel>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-heading)', fontSize: '1.05rem' }}>What you'll explore</h3>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <li>Which materials a magnet attracts</li>
            <li>The two poles every magnet has</li>
            <li>How a magnet points North–South</li>
            <li>How magnets attract and repel</li>
            <li>Building your own compass</li>
          </ul>
        </Panel>
      </div>

      <Panel>
        <h3 style={{ margin: '0 0 0.9rem', color: 'var(--text-heading)', fontSize: '1.05rem' }}>Magnets come in many shapes — tap one</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          {SHAPES.map(s => (
            <button key={s.id} onClick={() => setSel(s.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
              padding: '0.75rem 0.6rem', width: 108, borderRadius: 12, cursor: 'pointer',
              background: sel === s.id ? 'var(--accent-bg)' : 'var(--surface-hover)',
              border: sel === s.id ? '2px solid var(--accent)' : '1px solid var(--border)',
              transition: 'all .2s'
            }}>
              <div style={{ height: 60, display: 'flex', alignItems: 'center' }}><ShapeGlyph id={s.id} active={sel === s.id} /></div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>{s.name}</span>
            </button>
          ))}
        </div>
        <Note icon={Info}>
          <strong>{shape.name}:</strong> {shape.poles} No matter the shape, every magnet always has <strong>two poles</strong> — a North and a South — that occur in a pair.
        </Note>
      </Panel>
    </div>
  );
}

/* ================================================================= */
/* SECTION 1 — Magnetic vs Non-magnetic materials (Activity 4.1)     */
/* ================================================================= */

const MATERIAL_ITEMS = [
  { id: 'screw', name: 'Iron Screw', material: 'Iron', magnetic: true },
  { id: 'clip', name: 'Steel Paper Clip', material: 'Steel', magnetic: true },
  { id: 'key', name: 'Iron Key', material: 'Iron', magnetic: true },
  { id: 'nails', name: 'Nails', material: 'Iron', magnetic: true },
  { id: 'copper', name: 'Copper Wire', material: 'Copper', magnetic: false },
  { id: 'wood', name: 'Wooden Block', material: 'Wood', magnetic: false },
  { id: 'eraser', name: 'Eraser', material: 'Rubber', magnetic: false },
  { id: 'glass', name: 'Glass Tumbler', material: 'Glass', magnetic: false },
  { id: 'ruler', name: 'Plastic Ruler', material: 'Plastic', magnetic: false }
];

function MaterialCard({ item, prediction, phase, onPredict, onTest }) {
  const testing = phase === 'testing';
  const done = phase === 'done';
  const pulled = (testing || done) && item.magnetic;
  const matched = done && ((prediction === 'yes') === item.magnetic);
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 14, padding: '0.9rem',
      display: 'flex', flexDirection: 'column', gap: '0.65rem', overflow: 'hidden',
      border: done ? `1px solid ${item.magnetic ? '#10b981' : '#ef4444'}` : prediction ? '1px solid var(--accent-border)' : '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.name}</span>
        <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>{item.material}</span>
      </div>
      <div style={{ position: 'relative', height: 62, borderRadius: 10, background: 'var(--surface-hover)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: 14,
          transform: `translate(${pulled ? '44px' : '0'}, -50%) rotate(${pulled ? '-12deg' : '0'})`,
          transition: 'transform .45s cubic-bezier(.34,1.56,.64,1)', lineHeight: 0,
          filter: done && !item.magnetic ? 'grayscale(.2) opacity(.85)' : 'none'
        }}>
          <ObjectIcon id={item.id} size={40} />
        </div>
        <div style={{
          position: 'absolute', top: '50%', right: 12,
          transform: `translateY(-50%) translateX(${(testing || done) ? '0' : '84px'})`,
          transition: 'transform .4s ease-out',
          animation: testing && !item.magnetic ? 'em-shake .35s ease-in-out 2' : 'none'
        }}>
          <BarMagnet length={60} thickness={26} fontSize={11} radius={6} />
        </div>
        {done && item.magnetic && <Sparkles size={15} style={{ position: 'absolute', top: 8, left: 54, color: '#f59e0b' }} />}
      </div>
      {!done ? (
        <>
          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <button onClick={() => onPredict(item.id, 'yes')} disabled={testing} style={predBtn(prediction === 'yes', '#10b981')}>👍 Sticks</button>
            <button onClick={() => onPredict(item.id, 'no')} disabled={testing} style={predBtn(prediction === 'no', '#3b82f6')}>👎 Won't</button>
          </div>
          <button onClick={() => onTest(item.id)} disabled={!prediction || testing} style={{
            padding: '0.45rem', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', border: 'none',
            cursor: prediction && !testing ? 'pointer' : 'not-allowed',
            background: prediction && !testing ? 'var(--accent)' : 'var(--border)',
            color: prediction && !testing ? '#fff' : 'var(--text-muted)'
          }}>{testing ? 'Testing…' : 'Bring magnet close'}</button>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.85rem', color: item.magnetic ? '#10b981' : '#ef4444' }}>
            {item.magnetic ? <CheckCircle2 size={15} /> : <XCircle size={15} />}{item.magnetic ? 'Attracted' : 'No pull'}
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: matched ? '#10b981' : '#f59e0b' }}>
            {matched ? '✓ Prediction matched' : '✗ Surprise!'}
          </div>
        </div>
      )}
    </div>
  );
}

function predBtn(active, color) {
  return {
    flex: 1, padding: '0.4rem', borderRadius: 8, fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
    transition: 'all .2s', border: active ? `1.5px solid ${color}` : '1px solid var(--border)',
    background: active ? `${color}22` : 'transparent', color: active ? color : 'var(--text-secondary)'
  };
}

function MaterialsSection() {
  const [predictions, setPredictions] = useState({});
  const [phases, setPhases] = useState({});
  const predict = (id, c) => { if (phases[id]) return; setPredictions(p => ({ ...p, [id]: c })); };
  const test = (id) => {
    if (!predictions[id] || phases[id]) return;
    setPhases(p => ({ ...p, [id]: 'testing' }));
    setTimeout(() => setPhases(p => ({ ...p, [id]: 'done' })), 850);
  };
  const reset = () => { setPredictions({}); setPhases({}); };
  const tested = Object.values(phases).filter(p => p === 'done').length;
  const allDone = tested === MATERIAL_ITEMS.length;

  return (
    <div>
      <SectionHeading tag="Activity 4.1" title="Which materials does a magnet attract?"
        blurb="Predict first, then bring the magnet close and observe. Materials pulled towards a magnet are magnetic; the rest are non-magnetic." />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Note icon={Info}>Iron, <strong>nickel</strong> and <strong>cobalt</strong> (and some of their mixtures) are magnetic. Watch which objects get pulled.</Note>
        <button onClick={reset} className="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}><RotateCcw size={14} /> Reset</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.85rem' }}>
        {MATERIAL_ITEMS.map(it => (
          <MaterialCard key={it.id} item={it} prediction={predictions[it.id]} phase={phases[it.id] || 'idle'} onPredict={predict} onTest={test} />
        ))}
      </div>

      {allDone && (
        <div style={{ marginTop: '1.25rem' }}>
          <Note icon={Sparkles} tone="success">
            <strong>Conclusion:</strong> only the objects made of <strong>iron and steel</strong> were attracted. Wood, rubber, glass, plastic — and even <strong>copper</strong> — are <strong>non-magnetic</strong>. Magnetic materials are special metals; most everyday materials are not magnetic.
          </Note>
        </div>
      )}
    </div>
  );
}

/* ================================================================= */
/* SECTION 2 — Poles of a Magnet (Activity 4.2)                      */
/* ================================================================= */

function IronFilings({ show, magW, magH, left, top }) {
  // Generate filings once; each aligns along the field radiating from the nearest pole,
  // denser and longer near the two ends.
  const filings = useMemo(() => {
    const arr = [];
    const cy = top + magH / 2;
    const leftPole = { x: left + 4, y: cy };
    const rightPole = { x: left + magW - 4, y: cy };
    for (let i = 0; i < 260; i++) {
      const x = left - 34 + Math.random() * (magW + 68);
      const y = top - 30 + Math.random() * (magH + 60);
      const dL = Math.hypot(x - leftPole.x, y - leftPole.y);
      const dR = Math.hypot(x - rightPole.x, y - rightPole.y);
      const pole = dL < dR ? leftPole : rightPole;
      const d = Math.min(dL, dR);
      if (d < 6) continue;
      const strength = Math.max(0, 1 - d / 90);
      if (strength <= 0.04) continue;
      if (Math.random() > strength * 0.9 + 0.08) continue;
      const ang = Math.atan2(y - pole.y, x - pole.x) * 180 / Math.PI;
      arr.push({ x, y, len: 5 + strength * 12, op: 0.25 + strength * 0.65, ang });
    }
    return arr;
  }, [magW, magH, left, top]);

  return (
    <>
      {filings.map((f, i) => (
        <div key={i} style={{
          position: 'absolute', left: f.x, top: f.y, width: f.len, height: 2, borderRadius: 2,
          background: '#334155', transformOrigin: 'center',
          transform: `translate(-50%,-50%) rotate(${f.ang}deg)`,
          opacity: show ? f.op : 0,
          transition: `opacity .5s ease ${(i % 20) * 12}ms`
        }} />
      ))}
    </>
  );
}

function PolesSection() {
  const [sprinkled, setSprinkled] = useState(false);
  const [broken, setBroken] = useState(false);
  const magW = 220, magH = 54, left = 60, top = 70;

  return (
    <div>
      <SectionHeading tag="Activity 4.2" title="Where is a magnet strongest? Its poles."
        blurb="Sprinkle iron filings over a bar magnet and tap the paper. The filings reveal where the magnet's pull is strongest — the two ends, called its poles." />

      <Panel style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 200, background: 'repeating-linear-gradient(0deg,var(--surface) 0 23px,var(--surface-hover) 23px 24px)' }}>
          {/* iron filings */}
          {!broken && <IronFilings show={sprinkled} magW={magW} magH={magH} left={left} top={top} />}

          {/* magnet */}
          {!broken ? (
            <div style={{ position: 'absolute', left, top }}>
              <BarMagnet length={magW} thickness={magH} fontSize={20} />
            </div>
          ) : (
            <>
              <div style={{ position: 'absolute', left: left - 6, top, transition: 'left .5s' }}>
                <BarMagnet length={magW / 2 - 6} thickness={magH} poles={['N', 'S']} fontSize={18} />
              </div>
              <div style={{ position: 'absolute', left: left + magW / 2 + 12, top, transition: 'left .5s' }}>
                <BarMagnet length={magW / 2 - 6} thickness={magH} poles={['N', 'S']} fontSize={18} />
              </div>
            </>
          )}
        </div>
      </Panel>

      <div style={{ display: 'flex', gap: '0.75rem', margin: '1rem 0', flexWrap: 'wrap' }}>
        {!broken && (
          <button onClick={() => setSprinkled(s => !s)} className={sprinkled ? 'outline' : 'primary'} style={{ gap: '0.4rem', fontSize: '0.85rem', padding: '0.55rem 1rem' }}>
            <Sparkles size={15} /> {sprinkled ? 'Clear filings' : 'Sprinkle iron filings & tap'}
          </button>
        )}
        <button onClick={() => { setBroken(b => !b); setSprinkled(false); }} className="outline" style={{ gap: '0.4rem', fontSize: '0.85rem', padding: '0.55rem 1rem' }}>
          <Magnet size={15} /> {broken ? 'Rejoin magnet' : 'Break the magnet in half'}
        </button>
      </div>

      {sprinkled && !broken && (
        <Note icon={Info} tone="accent">
          Most filings cluster at the <strong>two ends</strong> — these are the <strong>North pole</strong> and <strong>South pole</strong>. Very few stick in the middle, which is the weakest region.
        </Note>
      )}
      {broken && (
        <Note icon={Info} tone="warn">
          Breaking a magnet does <strong>not</strong> give a single pole! Each smaller piece instantly has its <strong>own North and South pole</strong>. A single, lone pole can never exist — poles always come in pairs.
        </Note>
      )}
    </div>
  );
}

/* ================================================================= */
/* Reusable draggable rotator                                        */
/* ================================================================= */

function useRotator(onRelease) {
  const ref = useRef(null);
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);

  const pointFromEvent = useCallback((e) => {
    const el = ref.current; if (!el) return angle;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const px = (e.touches ? e.touches[0].clientX : e.clientX);
    const py = (e.touches ? e.touches[0].clientY : e.clientY);
    return Math.atan2(py - cy, px - cx) * 180 / Math.PI + 90;
  }, [angle]);

  const start = (e) => { setSettling(false); setDragging(true); setAngle(pointFromEvent(e)); };
  useEffect(() => {
    if (!dragging) return;
    const move = (e) => setAngle(pointFromEvent(e));
    const up = () => {
      setDragging(false);
      const final = onRelease();
      if (final !== null && final !== undefined) { setSettling(true); setAngle(final); }
    };
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move); window.removeEventListener('touchend', up);
    };
  }, [dragging, pointFromEvent, onRelease]);

  return { ref, angle, dragging, settling, start, setAngle, setSettling };
}

/* ================================================================= */
/* SECTION 3 — Finding Directions (Activity 4.3)                     */
/* ================================================================= */

function DirectionsSection() {
  const [isIron, setIsIron] = useState(false);
  const [restedAngle, setRestedAngle] = useState(null);
  const onRelease = useCallback(() => {
    if (isIron) {
      // an iron bar rests at any random angle — it does NOT align N–S
      const a = -80 + Math.random() * 160;
      setRestedAngle(a);
      return a;
    }
    setRestedAngle(0);
    return 0; // a magnet always settles N (top) – S (bottom)
  }, [isIron]);
  const rot = useRotator(onRelease);

  const spin = () => {
    rot.setSettling(false);
    rot.setAngle(-120 + Math.random() * 240);
    setRestedAngle(null);
    // let it swing, then settle
    setTimeout(() => {
      rot.setSettling(true);
      if (isIron) { const a = -80 + Math.random() * 160; setRestedAngle(a); rot.setAngle(a); }
      else { setRestedAngle(0); rot.setAngle(0); }
    }, 120);
  };

  return (
    <div>
      <SectionHeading tag="Activity 4.3" title="A freely hanging magnet points North–South"
        blurb="Suspend a bar magnet from a thread and let it swing freely. Grab it, twist it, and let go — where does it come to rest? Try an ordinary iron bar too and compare." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem', alignItems: 'start' }}>
        <Panel style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: 260, height: 260 }}>
            <CompassRose size={260} />
            <div ref={rot.ref} onMouseDown={rot.start} onTouchStart={rot.start} style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: rot.dragging ? 'grabbing' : 'grab', touchAction: 'none'
            }}>
              <div style={{
                transform: `rotate(${rot.angle}deg)`,
                transition: rot.settling ? 'transform 1.1s cubic-bezier(.22,1.5,.4,1)' : 'none'
              }}>
                {isIron
                  ? <div style={{ width: 30, height: 150, borderRadius: 6, background: 'linear-gradient(90deg,#94a3b8,#cbd5e1,#94a3b8)', boxShadow: '0 4px 12px rgba(0,0,0,.35)' }} />
                  : <BarMagnet vertical length={150} thickness={34} poles={['N', 'S']} fontSize={16} />}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={spin} className="primary" style={{ gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}><RotateCcw size={14} /> Spin & release</button>
            <button onClick={() => { setIsIron(v => !v); setRestedAngle(null); rot.setSettling(false); rot.setAngle(0); }} className="outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              {isIron ? 'Use bar magnet' : 'Use plain iron bar'}
            </button>
          </div>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <Note icon={Compass}>
            Drag the {isIron ? 'iron bar' : 'magnet'} to twist it, then let go — or press <strong>Spin &amp; release</strong>.
          </Note>
          {restedAngle !== null && !isIron && (
            <Note icon={CheckCircle2} tone="success">
              The magnet always settles along the <strong>North–South</strong> line! The end pointing north is its <strong>North (north-seeking) pole</strong>. This happens because the <strong>Earth itself behaves like a giant magnet</strong>.
            </Note>
          )}
          {restedAngle !== null && isIron && (
            <Note icon={XCircle} tone="warn">
              The plain iron bar comes to rest at <strong>any random direction</strong> — it does not point North–South. So this trick is also a <strong>test</strong>: only a real magnet aligns North–South.
            </Note>
          )}
          <Panel>
            <h4 style={{ margin: '0 0 0.4rem', color: 'var(--text-heading)', fontSize: '0.95rem' }}>Why North–South?</h4>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Our planet has its own magnetic field. A freely suspended magnet lines up with it, giving us a reliable way to find directions — exactly the idea behind the <strong>magnetic compass</strong> the sailors in Reshma's story needed.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ================================================================= */
/* SECTION 4 — The Magnetic Compass (Activity 4.4)                   */
/* ================================================================= */

function CompassSection() {
  const [rested, setRested] = useState(false);
  const onRelease = useCallback(() => { setRested(true); return 0; }, []);
  const rot = useRotator(onRelease);

  // "Make your own" stroking demo
  const [strokes, setStrokes] = useState(0);
  const magnetised = strokes >= 30;
  const [floating, setFloating] = useState(false);

  return (
    <div>
      <SectionHeading tag="Activity 4.4" title="The magnetic compass — and how to build one"
        blurb="A compass is just a tiny magnet, shaped like a needle, free to spin. Its needle always settles North–South. You can even magnetise an ordinary sewing needle to make your own." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: '1.25rem', alignItems: 'start' }}>
        {/* Interactive compass */}
        <Panel style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-heading)' }}>Use the compass</h3>
          <div style={{ position: 'relative', width: 240, height: 240 }}>
            <CompassRose size={240} />
            <div ref={rot.ref} onMouseDown={(e) => { setRested(false); rot.start(e); }} onTouchStart={(e) => { setRested(false); rot.start(e); }}
              style={{ position: 'absolute', inset: 0, cursor: rot.dragging ? 'grabbing' : 'grab', touchAction: 'none' }}>
              <Needle angle={rot.angle} length={150} settling={rot.settling} />
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {rested ? 'The red end points North. ✓' : 'Drag the needle and release — watch it swing back to North.'}
          </p>
        </Panel>

        {/* Make your own */}
        <Panel style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-heading)' }}>Make your own compass</h3>
          <ol style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <li>Stroke a steel needle with one pole of a magnet — the same way, 30–40 times.</li>
            <li>The needle becomes a magnet.</li>
            <li>Push it through a cork and float it in water.</li>
          </ol>

          {/* stroking animation */}
          <div style={{ position: 'relative', height: 70, borderRadius: 10, background: 'var(--surface-hover)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', width: 150, height: 6, borderRadius: 3, background: magnetised ? 'linear-gradient(90deg,#dc2626 0 50%,#cbd5e1 50%)' : '#cbd5e1', transition: 'background .3s' }} />
            <div style={{
              position: 'absolute', top: 8, left: 20 + (strokes % 6) / 5 * 130,
              transition: 'left .12s linear'
            }}><BarMagnet length={40} thickness={16} fontSize={8} radius={4} /></div>
            {magnetised && <Sparkles size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#f59e0b' }} />}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button onClick={() => setStrokes(s => Math.min(40, s + 5))} disabled={magnetised} className={magnetised ? 'outline' : 'primary'} style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
              Stroke needle ×5
            </button>
            <div style={{ flex: 1, height: 8, background: 'var(--surface-hover)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, strokes / 30 * 100)}%`, height: '100%', background: magnetised ? '#10b981' : 'var(--accent)', transition: 'width .3s' }} />
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: 46, textAlign: 'right' }}>{Math.min(strokes, 30)}/30</span>
          </div>

          {magnetised && (
            <>
              <button onClick={() => setFloating(f => !f)} className="outline" style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem', alignSelf: 'flex-start' }}>
                {floating ? 'Lift it out' : 'Float on cork in water'}
              </button>
              {floating && (
                <Note icon={CheckCircle2} tone="success">
                  Floating freely, the magnetised needle turns until it lies <strong>North–South</strong>. Your homemade compass works! Long ago, Indian sailors used a similar floating magnetised fish called the <em>matsya-yantra</em>.
                </Note>
              )}
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ================================================================= */
/* SECTION 5 — Attraction & Repulsion (Activity 4.5 / 4.6)          */
/* ================================================================= */

function AttractionSection() {
  const [bFlipped, setBFlipped] = useState(false); // false: B = [N,S]; true: B = [S,N]
  const [close, setClose] = useState(false);

  // Magnet A fixed poles [N,S] -> A's right (facing) pole = S
  // B's left (facing) pole = bFlipped ? 'N' : 'N'? B default [N,S] -> left = N; flipped [S,N] -> left = S
  const aFacing = 'S';
  const bFacing = bFlipped ? 'S' : 'N';
  const like = aFacing === bFacing;      // like poles -> repel
  const bPoles = bFlipped ? ['S', 'N'] : ['N', 'S'];

  // A rolls: attract -> moves right (toward B, +); repel -> moves left (away, -)
  const aShift = close ? (like ? -46 : 40) : 0;

  return (
    <div>
      <SectionHeading tag="Activity 4.5 & 4.6" title="Attraction and repulsion between magnets"
        blurb="Rest magnet A on rollers so it can move easily, then bring magnet B close. Flip B to change which pole faces A. Do they rush together, or push apart?" />

      <Panel style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 210, background: 'var(--surface-hover)' }}>
          {/* ground line */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 54, height: 2, background: 'var(--border)' }} />

          {/* Magnet A on rollers */}
          <div style={{ position: 'absolute', left: 90, bottom: 60, transform: `translateX(${aShift}px)`, transition: 'transform .7s cubic-bezier(.3,1.2,.5,1)' }}>
            <BarMagnet length={150} thickness={44} poles={['N', 'S']} fontSize={18} />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 4 }}>
              {[0, 1, 2, 3].map(i => <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--text-muted)', border: '2px solid var(--surface)' }} />)}
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>Magnet A (free to roll)</div>
          </div>

          {/* Magnet B - controlled */}
          <div style={{ position: 'absolute', right: close ? 96 : 40, bottom: 66, transition: 'right .5s' }}>
            <BarMagnet length={150} thickness={44} poles={bPoles} fontSize={18} />
            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>Magnet B (you hold)</div>
          </div>

          {/* interaction label */}
          {close && (
            <div style={{
              position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
              padding: '0.35rem 0.9rem', borderRadius: 20, fontWeight: 800, fontSize: '0.9rem',
              background: like ? '#ef444422' : '#10b98122', color: like ? '#ef4444' : '#10b981',
              border: `1.5px solid ${like ? '#ef4444' : '#10b981'}`
            }}>
              {like ? '⟷ Like poles REPEL' : '⟶⟵ Unlike poles ATTRACT'}
            </div>
          )}
        </div>
      </Panel>

      <div style={{ display: 'flex', gap: '0.75rem', margin: '1rem 0', flexWrap: 'wrap' }}>
        <button onClick={() => setClose(c => !c)} className={close ? 'outline' : 'primary'} style={{ fontSize: '0.85rem', padding: '0.55rem 1rem' }}>
          {close ? 'Move B away' : 'Bring magnet B closer'}
        </button>
        <button onClick={() => setBFlipped(f => !f)} className="outline" style={{ gap: '0.4rem', fontSize: '0.85rem', padding: '0.55rem 1rem' }}>
          <RotateCcw size={14} /> Flip magnet B
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '0.85rem' }}>
        <Note icon={like ? XCircle : CheckCircle2} tone={like ? 'warn' : 'success'}>
          Right now the facing poles are <strong>{aFacing}</strong> (A) and <strong>{bFacing}</strong> (B) — {like ? 'the same, so they repel.' : 'opposite, so they attract.'}
        </Note>
        <Note icon={Info}>
          <strong>The rule:</strong> unlike poles (N–S) <strong>attract</strong>; like poles (N–N or S–S) <strong>repel</strong>. Repulsion is the sure test of a magnet — an iron bar is only ever attracted, never repelled.
        </Note>
      </div>
    </div>
  );
}

/* ================================================================= */
/* SECTION 6 — Magnetism Through Materials (Activity 4.7)            */
/* ================================================================= */

const BARRIERS = [
  { id: 'none', name: 'Nothing', shields: false, color: 'transparent' },
  { id: 'wood', name: 'Wood', shields: false, color: '#b98a4b' },
  { id: 'card', name: 'Cardboard', shields: false, color: '#c8a06a' },
  { id: 'plastic', name: 'Plastic', shields: false, color: '#38bdf8' },
  { id: 'glass', name: 'Glass', shields: false, color: '#a5f3fc' }
];

function ThroughMaterialsSection() {
  const [mat, setMat] = useState('none');
  const barrier = BARRIERS.find(b => b.id === mat);
  const deflect = 52; // needle deflection when the magnet acts on it

  return (
    <div>
      <SectionHeading tag="Activity 4.7" title="Can magnetism pass through other materials?"
        blurb="Place a bar magnet near a compass so the needle deflects. Now slide different non-magnetic sheets between them. Does the needle still move?" />

      <Panel style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 220, background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
          {/* magnet */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <BarMagnet length={130} thickness={44} poles={['S', 'N']} fontSize={18} />
            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>Bar magnet</div>
          </div>

          {/* barrier sheet */}
          <div style={{
            width: 22, height: 150, borderRadius: 6,
            background: barrier.color === 'transparent' ? 'transparent' : barrier.color,
            border: mat === 'none' ? '2px dashed var(--border)' : '1px solid rgba(0,0,0,.2)',
            opacity: mat === 'glass' ? 0.55 : 0.95,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .3s'
          }}>
            <span style={{ writingMode: 'vertical-rl', fontSize: '0.7rem', fontWeight: 700, color: mat === 'none' ? 'var(--text-muted)' : '#1e293b' }}>
              {mat === 'none' ? '' : barrier.name}
            </span>
          </div>

          {/* compass */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', width: 130, height: 130 }}>
              <CompassRose size={130} />
              <Needle angle={deflect} length={80} settling />
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 600 }}>Compass</div>
          </div>
        </div>
      </Panel>

      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0', flexWrap: 'wrap' }}>
        {BARRIERS.map(b => (
          <button key={b.id} onClick={() => setMat(b.id)} className={mat === b.id ? 'primary' : 'outline'} style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
            {b.name}
          </button>
        ))}
      </div>

      <Note icon={CheckCircle2} tone="success">
        The needle stays <strong>deflected the same amount</strong> whatever non-magnetic sheet you insert — wood, cardboard, plastic or glass. <strong>Magnetic force passes right through non-magnetic materials.</strong>
      </Note>
    </div>
  );
}

/* ================================================================= */
/* SECTION 7 — Fun with Magnets (drag-follow paperclip)             */
/* ================================================================= */

function FunSection() {
  const areaRef = useRef(null);
  const [magX, setMagX] = useState(200);
  const [dragging, setDragging] = useState(false);
  const clipX = magX; // steel clip follows the magnet horizontally

  const onMove = useCallback((clientX) => {
    const el = areaRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    let x = clientX - r.left;
    x = Math.max(40, Math.min(r.width - 40, x));
    setMagX(x);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const mm = (e) => onMove(e.touches ? e.touches[0].clientX : e.clientX);
    const mu = () => setDragging(false);
    window.addEventListener('mousemove', mm); window.addEventListener('mouseup', mu);
    window.addEventListener('touchmove', mm, { passive: false }); window.addEventListener('touchend', mu);
    return () => {
      window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu);
      window.removeEventListener('touchmove', mm); window.removeEventListener('touchend', mu);
    };
  }, [dragging, onMove]);

  return (
    <div>
      <SectionHeading tag="Fun with Magnets" title="Magnets can move things without touching!"
        blurb="A magnet's pull reaches through air, cardboard and even water. Drag the magnet along the top of the glass — watch the steel paper clip follow it, without you touching the clip." />

      <Panel style={{ padding: 0, overflow: 'hidden' }}>
        <div ref={areaRef} style={{ position: 'relative', height: 260, background: 'linear-gradient(180deg,var(--surface) 0 40%, #bae6fd55 40% 100%)', touchAction: 'none' }}>
          {/* water label */}
          <span style={{ position: 'absolute', left: 12, top: '46%', fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>water</span>
          {/* glass rim */}
          <div style={{ position: 'absolute', left: 24, right: 24, top: '40%', height: 2, background: '#7dd3fc' }} />

          {/* draggable magnet (above the rim) */}
          <div onMouseDown={() => setDragging(true)} onTouchStart={() => setDragging(true)}
            style={{ position: 'absolute', top: 18, left: magX, transform: 'translateX(-50%)', cursor: dragging ? 'grabbing' : 'grab' }}>
            <BarMagnet length={90} thickness={30} poles={['N', 'S']} fontSize={13} />
            <div style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>drag me →</div>
          </div>

          {/* paper clip in water, follows magnet x, lifts toward surface */}
          <div style={{
            position: 'absolute', bottom: 30, left: clipX, transform: 'translateX(-50%)',
            transition: dragging ? 'left .15s linear' : 'left .4s'
          }}>
            <ObjectIcon id="clip" size={38} />
          </div>
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '0.85rem', marginTop: '1rem' }}>
        <Panel><h4 style={{ margin: '0 0 0.35rem', fontSize: '0.92rem', color: 'var(--text-heading)' }}>🪣 Paper clip in water</h4><p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>Pull a clip out of a glass without wetting your fingers — the magnet does it through the glass and water.</p></Panel>
        <Panel><h4 style={{ margin: '0 0 0.35rem', fontSize: '0.92rem', color: 'var(--text-heading)' }}>🎯 Steel-ball maze</h4><p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>Move a magnet <em>under</em> a cardboard tray to steer steel balls through a maze on top.</p></Panel>
        <Panel><h4 style={{ margin: '0 0 0.35rem', fontSize: '0.92rem', color: 'var(--text-heading)' }}>🚗 Magnet cars</h4><p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>Fix magnets on toy cars with like poles facing — they speed away from each other!</p></Panel>
      </div>
    </div>
  );
}

/* ================================================================= */
/* SECTION 8 — Test Yourself (quiz)                                  */
/* ================================================================= */

const QUIZ = [
  { q: 'Unlike poles of two magnets ______ each other.', opts: ['attract', 'repel', 'ignore'], a: 0 },
  { q: 'The materials that are attracted towards a magnet are called ______.', opts: ['non-magnetic materials', 'magnetic materials', 'insulators'], a: 1 },
  { q: 'The needle of a magnetic compass rests along the ______ direction.', opts: ['east–west', 'up–down', 'north–south'], a: 2 },
  { q: 'A magnet always has ______ poles.', opts: ['one', 'two', 'three'], a: 1 },
  { q: 'If a bar magnet is broken into two pieces, each piece has…', opts: ['only a North pole', 'only a South pole', 'both a North and a South pole'], a: 2 },
  { q: 'A magnet can be identified for certain by its property of ______.', opts: ['attraction', 'repulsion', 'shininess'], a: 1 },
  { q: 'True or False: Iron filings stick mostly in the middle of a bar magnet.', opts: ['True', 'False'], a: 1 },
  { q: 'A freely suspended magnet aligns North–South because…', opts: ['of the wind', 'the Earth behaves like a giant magnet', 'of gravity only'], a: 1 }
];

function QuizSection() {
  const [answers, setAnswers] = useState({});
  const answered = Object.keys(answers).length;
  const score = QUIZ.reduce((s, q, i) => s + (answers[i] === q.a ? 1 : 0), 0);
  const done = answered === QUIZ.length;

  return (
    <div>
      <SectionHeading tag="Let us enhance our learning" title="Test yourself"
        blurb="Answer each question — you'll get instant feedback. Based on the chapter's exercises." />

      {done && (
        <div style={{ marginBottom: '1.25rem' }}>
          <Note icon={Trophy} tone={score >= 6 ? 'success' : 'warn'}>
            You scored <strong>{score} / {QUIZ.length}</strong>. {score === QUIZ.length ? 'Perfect — you have mastered magnets!' : score >= 6 ? 'Great work! Review the ones you missed.' : 'Revisit the sections above and try again.'}
          </Note>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {QUIZ.map((item, i) => {
          const chosen = answers[i];
          const has = chosen !== undefined;
          return (
            <Panel key={i}>
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.7rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--accent-text)', fontSize: '0.9rem' }}>{i + 1}.</span>
                <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.q}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {item.opts.map((o, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = oi === item.a;
                  let bg = 'transparent', bd = 'var(--border)', col = 'var(--text-secondary)';
                  if (has) {
                    if (isCorrect) { bg = '#10b98122'; bd = '#10b981'; col = '#10b981'; }
                    else if (isChosen) { bg = '#ef444422'; bd = '#ef4444'; col = '#ef4444'; }
                  }
                  return (
                    <button key={oi} disabled={has} onClick={() => setAnswers(a => ({ ...a, [i]: oi }))} style={{
                      padding: '0.45rem 0.9rem', borderRadius: 8, fontSize: '0.84rem', fontWeight: 600,
                      cursor: has ? 'default' : 'pointer', background: bg, border: `1.5px solid ${bd}`, color: col,
                      display: 'flex', alignItems: 'center', gap: '0.35rem'
                    }}>
                      {has && isCorrect && <CheckCircle2 size={14} />}
                      {has && isChosen && !isCorrect && <XCircle size={14} />}
                      {o}
                    </button>
                  );
                })}
              </div>
            </Panel>
          );
        })}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Answered {answered}/{QUIZ.length}</span>
        <button onClick={() => setAnswers({})} className="outline" style={{ gap: '0.35rem', fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}><RotateCcw size={14} /> Reset quiz</button>
      </div>
    </div>
  );
}

/* ================================================================= */
/* MAIN — section navigation shell                                   */
/* ================================================================= */

const SECTIONS = [
  { id: 'story', label: 'Story & Shapes', icon: '📖', Comp: StorySection },
  { id: 'materials', label: 'Magnetic Materials', icon: '🧲', Comp: MaterialsSection },
  { id: 'poles', label: 'Poles', icon: '⭐', Comp: PolesSection },
  { id: 'directions', label: 'Finding Directions', icon: '🧭', Comp: DirectionsSection },
  { id: 'compass', label: 'The Compass', icon: '🎯', Comp: CompassSection },
  { id: 'attraction', label: 'Attract & Repel', icon: '⟷', Comp: AttractionSection },
  { id: 'through', label: 'Through Materials', icon: '🪵', Comp: ThroughMaterialsSection },
  { id: 'fun', label: 'Fun with Magnets', icon: '🎉', Comp: FunSection },
  { id: 'quiz', label: 'Test Yourself', icon: '🏆', Comp: QuizSection }
];

export default function ExploringMagnetsLab({ onBackToDashboard = () => {} }) {
  const [idx, setIdx] = useState(0);
  const Current = SECTIONS[idx].Comp;

  const go = (i) => {
    setIdx(i);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '2rem' }}>
      <style>{`
        @keyframes em-shake{0%,100%{transform:translateY(-50%) translateX(0)}25%{transform:translateY(-50%) translateX(-6px)}75%{transform:translateY(-50%) translateX(6px)}}
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBackToDashboard} className="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}>
            <ArrowLeft size={14} /> Back to Class 6 Wing
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
              <BarMagnet length={44} thickness={20} fontSize={10} radius={5} /> Exploring Magnets
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 Science · Chapter 13 · Interactive Lab</span>
          </div>
        </div>
      </div>

      {/* Section stepper */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => go(i)} style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.45rem 0.85rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
            background: i === idx ? 'var(--accent)' : 'var(--surface)',
            color: i === idx ? '#fff' : 'var(--text-secondary)',
            border: i === idx ? '1px solid var(--accent)' : '1px solid var(--border)',
            transition: 'all .2s'
          }}>
            <span>{s.icon}</span>{s.label}
          </button>
        ))}
      </div>

      {/* Active section */}
      <div style={{ minHeight: 360 }}>
        <Current />
      </div>

      {/* Prev / Next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
        <button onClick={() => go(Math.max(0, idx - 1))} disabled={idx === 0} className="outline" style={{ gap: '0.35rem', fontSize: '0.85rem', padding: '0.5rem 1rem', opacity: idx === 0 ? 0.4 : 1 }}>
          <ArrowLeft size={15} /> Previous
        </button>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{idx + 1} / {SECTIONS.length}</span>
        {idx < SECTIONS.length - 1 ? (
          <button onClick={() => go(idx + 1)} className="primary" style={{ gap: '0.35rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            Next <ArrowRight size={15} />
          </button>
        ) : (
          <button onClick={onBackToDashboard} className="primary" style={{ gap: '0.35rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
            Finish <CheckCircle2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
