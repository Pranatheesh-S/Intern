import React, { useState, useEffect } from 'react';

export default function DistanceAndScale({ onComplete }) {
  // State for Tool 1
  const [sVal, setSVal] = useState(500);
  const [sUnit, setSUnit] = useState('m');
  const [sCm, setSCm] = useState(4);

  // State for Tool 2
  const [pL, setPL] = useState(40);
  const [pW, setPW] = useState(30);
  const [pS, setPS] = useState(10);

  // State for components & navigation
  const [comps, setComps] = useState({ distance: false, direction: false, symbols: true });
  const [activeTool, setActiveTool] = useState(1);

  const realDist = sVal * sCm;

  const drawL = pL / pS;
  const drawW = pW / pS;
  const diagCm = Math.hypot(drawL, drawW);
  const diagReal = diagCm * pS;
  const pad = 40, availW = 400 - 2 * pad, availH = 260 - 2 * pad;
  const pxPerCm = Math.max(6, Math.min(availW / Math.max(drawL, 0.1), availH / Math.max(drawW, 0.1)));
  const w = drawL * pxPerCm;
  const h = drawW * pxPerCm;
  const ox = pad;
  const oy = 260 - pad;

  const ticks = [];
  for (let c = 0; c <= Math.ceil(drawL); c++) {
    ticks.push(ox + c * pxPerCm);
  }

  const toggleComp = (key) => {
    setComps({ ...comps, [key]: !comps[key] });
  };

  const preset = (v, u, cm) => {
    setSVal(v);
    setSUnit(u);
    setSCm(cm);
  };

  return (
    <div className="distance-scale-container">
      <style>{`
        .distance-scale-container {
          --navy: #0E3556; --ink: #20303f; --mut: #5c6b7a; --card: #F3F7FC; --cardline: #e4ebf3;
          --amber: #F5A623; --blue: #2f6df0; --green: #12a15f; --violet: #7c5cff;
          --paper1: #F7F1E2; --paper2: #EFE6D2;
          --serif: "Fraunces", Georgia, serif; --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace; --geo: "Space Grotesk", system-ui, sans-serif;
          
          font-family: var(--geo);
          color: var(--ink);
          height: calc(100vh - 120px);
          min-height: 650px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          border-radius: 16px;
        }
        
        .distance-scale-container * {
          box-sizing: border-box;
        }

        .ds-spread {
          flex: 1; display: grid; grid-template-columns: 0.92fr 1.08fr; border-radius: 16px; overflow: hidden; position: relative;
          border: 6px solid var(--navy); box-shadow: 0 10px 40px rgba(14,42,69,.2);
          background: #d9dfe8;
        }
        .ds-spread::after { content:""; position:absolute; left:47%; top:0; bottom:0; width:3px; background:rgba(20,40,69,.14); z-index:3; }
        .ds-ribbon { position:absolute; top:-6px; left:44%; width:20px; height:64px; background:#c0392b; z-index:4; border-radius:0 0 3px 3px; }
        
        .ds-left { background:linear-gradient(160deg,var(--paper1),var(--paper2)); padding:clamp(20px,2.8vw,46px); display:flex; flex-direction:column; min-height:0; }
        .ds-eyebrow { font-family:var(--mono); font-size:clamp(10px,1vw,12px); letter-spacing:.22em; text-transform:uppercase; color:var(--amber); font-weight:600; margin-bottom: 0; }
        .ds-h1 { font-family:var(--serif); font-weight:900; color:var(--navy); font-size:clamp(30px,3.8vw,54px); line-height:1; margin:4px 0 2px; }
        .ds-sub { font-family:var(--serif); font-style:italic; color:#8a6a3a; font-size:clamp(15px,1.7vw,21px); margin-bottom:clamp(12px,1.6vw,18px); }
        .ds-left p { font-size:clamp(13px,1.45vw,16.5px); line-height:1.55; color:var(--ink); margin-bottom:11px; margin-top:0; }
        .ds-left p b { color:var(--navy); }
        
        .ds-comp { display:flex; gap:8px; margin:4px 0 14px; flex-wrap:wrap; }
        .ds-comp span { cursor: pointer; font-family:var(--mono); font-size:11.5px; font-weight:600; padding:6px 12px; border-radius:8px; border:1px solid #d8c8a4; background:#fbf5e6; color:#8a6a3a; user-select: none; }
        .ds-comp span.ds-on { background:var(--navy); color:#fff; border-color:var(--navy); }
        
        .ds-scaleex { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:6px 0 14px; }
        .ds-scaleex .ds-e { background:#fbf5e6; border:1px solid #e0d3b0; border-radius:10px; padding:11px 13px; }
        .ds-scaleex .ds-e .ds-k { font-family:var(--mono); font-size:10px; letter-spacing:.1em; color:#8a6a3a; text-transform:uppercase; margin-bottom:0; }
        .ds-scaleex .ds-e .ds-v { font-weight:700; color:var(--navy); font-size:clamp(14px,1.6vw,18px); margin-top:3px; margin-bottom:0; }
        .ds-scaleex .ds-e small { color:var(--mut); font-size:11.5px; }
        
        .ds-dyk { margin-top:auto; background:#fcf0cf; border-left:5px solid var(--amber); border-radius:10px; padding:clamp(12px,1.6vw,18px); }
        .ds-dyk h4 { display:flex; gap:7px; align-items:center; color:#b4761c; font-weight:700; font-size:14px; margin-bottom:5px; margin-top:0; }
        .ds-dyk p { color:#8a5a12; font-size:13px; line-height:1.5; margin:0; }
        
        .ds-right { background:#fbfdff; padding:clamp(18px,2.4vw,36px); display:flex; flex-direction:column; min-height:0; }
        .ds-rlabel { display:flex; align-items:center; gap:8px; color:var(--navy); font-family:var(--serif); font-weight:600; font-size:clamp(18px,2vw,24px); margin-bottom: 0; }
        
        .ds-scroll { flex:1; min-height:0; overflow-y:auto; margin-top:14px; padding-right:6px; display:flex; flex-direction:column; gap:14px; }
        .ds-scroll::-webkit-scrollbar { width:6px; }
        .ds-scroll::-webkit-scrollbar-thumb { background:#d4deea; border-radius:3px; }
        
        .ds-tool { background:#fff; border:1px solid var(--cardline); border-radius:14px; padding:clamp(14px,1.7vw,20px); box-shadow:0 6px 16px rgba(14,42,69,.05); }
        .ds-tool h3 { font-size:clamp(15px,1.6vw,18px); font-weight:700; color:var(--navy); margin-bottom:4px; margin-top:0; display:flex; align-items:center; gap:8px; }
        .ds-tool .ds-hint { color:var(--mut); font-size:12.5px; margin-bottom:12px; }
        
        .ds-fields { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
        .ds-fields .ds-fld { display:flex; flex-direction:column; gap:4px; }
        .ds-fields label { font-size:11px; color:var(--mut); font-weight:600; margin-bottom:0; }
        .ds-fields input[type=number], .ds-fields select { width:100%; background:#f7f9fc; border:1px solid #d6e0ec; border-radius:9px; color:var(--ink); padding:9px 11px; font-size:14px; font-family:var(--geo); margin: 0; }
        .ds-fields input:focus, .ds-fields select:focus { outline:none; border-color:var(--violet); }
        
        .ds-presets { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; align-items:center; }
        .ds-presets span { font-size:11.5px; color:var(--mut); }
        
        .ds-chip { font-family:var(--geo); font-weight:600; cursor:pointer; border:1px solid #d6e0ec; background:#fff; color:var(--navy); border-radius:8px; padding:6px 11px; font-size:12px; transition:all .15s; }
        .ds-chip:hover { border-color:var(--violet); background:#f5f2ff; }
        
        .ds-out { margin-top:12px; background:#f4f8ff; border:1px solid #dbe6f7; border-radius:11px; padding:13px 15px; animation:ds-fade .3s; }
        .ds-out .ds-big { font-size:clamp(20px,2.4vw,30px); font-weight:800; color:var(--amber); }
        .ds-out .ds-work { font-family:var(--mono); font-size:12px; color:var(--mut); margin-top:6px; line-height:1.5; }
        
        @keyframes ds-fade { from {opacity:0; transform:translateY(6px);} to {opacity:1; transform:none;} }
        
        .ds-stage { background:#0d1330; border-radius:10px; margin-top:12px; padding:8px; }
        .ds-stage svg { width:100%; height:auto; max-height:34vh; display:block; }
        
        .ds-result-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:12px; }
        .ds-result-grid .ds-r { background:#f4f8ff; border:1px solid #dbe6f7; border-radius:10px; padding:10px; text-align:center; }
        .ds-result-grid .ds-r .ds-k { font-family:var(--mono); font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--mut); margin-bottom:0; }
        .ds-result-grid .ds-r .ds-v { font-weight:800; font-size:clamp(16px,1.9vw,22px); color:var(--navy); margin-top:2px; margin-bottom:0; }
        .ds-result-grid .ds-r.ds-hl .ds-v { color:var(--amber); }
        
        .ds-pfoot { display:flex; align-items:center; justify-content:space-between; padding-top:12px; margin-top:10px; border-top:1px solid var(--cardline); }
        .ds-pageind { display:flex; align-items:center; gap:8px; color:var(--mut); font-weight:600; font-size:13px; margin: 0; }
        
        .ds-nav-btn {
          font-family: var(--geo); font-weight: 700; border: none; cursor: pointer;
          background: var(--amber); color: #fff; padding: 12px 24px; border-radius: 999px; font-size: 15px; transition: all .2s;
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.4);
        }
        .ds-nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 166, 35, 0.5);
        }
        .ds-complete-btn {
          font-family: var(--geo); font-weight: 700; border: none; cursor: pointer;
          background: var(--green); color: #fff; padding: 12px 24px; border-radius: 999px; font-size: 15px; transition: all .2s;
          box-shadow: 0 4px 15px rgba(18, 161, 95, 0.4);
        }
        .ds-complete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(18, 161, 95, 0.5);
        }

        @media (max-aspect-ratio:1/1), (max-width:900px) {
          .ds-spread { grid-template-columns:1fr; }
          .ds-spread::after { display:none; }
          .ds-left { min-height:auto; }
        }
      `}</style>

      <div className="ds-spread">
        <div className="ds-ribbon"></div>

        {/* LEFT · concept */}
        <div className="ds-left">
          <div className="ds-eyebrow">Chapter 1 · Distance &amp; Scale</div>
          <h1 className="ds-h1">Shrinking the World</h1>
          <div className="ds-sub">How a huge place fits on paper</div>

          <p>Every map has three important components — tap to recall the two you already used in the town map:</p>
          <div className="ds-comp">
            <span className={comps.distance ? 'ds-on' : ''} onClick={() => toggleComp('distance')}>📏 Distance</span>
            <span className={comps.direction ? 'ds-on' : ''} onClick={() => toggleComp('direction')}>🧭 Direction</span>
            <span className={comps.symbols ? 'ds-on' : ''} onClick={() => toggleComp('symbols')}>🔣 Symbols</span>
          </div>

          <p>A map's <b>scale</b> is the secret to squeezing a huge area onto a small sheet. Each centimetre on the map stands for a fixed distance on the ground.</p>

          <div className="ds-scaleex">
            <div className="ds-e">
              <div className="ds-k">Small-city map</div>
              <div className="ds-v">1 cm = 500 m</div>
              <small>Fig. 1.1 town</small>
            </div>
            <div className="ds-e">
              <div className="ds-k">Map of India</div>
              <div className="ds-v">2.5 cm = 500 km</div>
              <small>Fig. 5.2 ruler</small>
            </div>
          </div>

          <p>So the <b>real distance</b> between two points on a map depends entirely on the <b>scale</b> the map is using — the same drawn length can mean 500 metres or 500 kilometres.</p>

          <div className="ds-dyk">
            <h4>💡 Did You Know?</h4>
            <p>A "larger" scale like 1 cm = 10 m shows a small area in great detail; a "smaller" scale like 1 cm = 500 km fits a whole country — but shows far less detail.</p>
          </div>
        </div>

        {/* RIGHT · interactive */}
        <div className="ds-right">
          <div className="ds-rlabel">🧮 Let's explore — scale in action</div>
          <div className="ds-scroll">

            {activeTool === 1 && (
              <div className="ds-tool-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Tool 1: scale calculator */}
                <div className="ds-tool">
                  <h3>1 · Scale calculator</h3>
                  <div className="ds-hint">Set a scale, enter a map measurement, and the real distance is computed live.</div>
                  <div className="ds-fields">
                    <div className="ds-fld">
                      <label>1 cm on map =</label>
                      <input type="number" value={sVal} min="0.1" step="any" onChange={(e) => setSVal(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="ds-fld">
                      <label>unit</label>
                      <select value={sUnit} onChange={(e) => setSUnit(e.target.value)}>
                        <option value="m">m</option>
                        <option value="km">km</option>
                      </select>
                    </div>
                    <div className="ds-fld">
                      <label>Map length (cm)</label>
                      <input type="number" value={sCm} min="0" step="any" onChange={(e) => setSCm(parseFloat(e.target.value) || 0)} />
                    </div>
                  </div>
                  
                  <div className="ds-presets">
                    <span>Book examples:</span>
                    <button className="ds-chip" onClick={() => preset(500, 'm', 4)}>1 cm = 500 m</button>
                    <button className="ds-chip" onClick={() => preset(200, 'km', 2.5)}>2.5 cm = 500 km</button>
                  </div>
                  
                  <div className="ds-out">
                    <div className="ds-big">{sCm} cm = {realDist.toLocaleString()} {sUnit}</div>
                    <div className="ds-work">
                      real distance = map length × scale = {sCm} × {sVal} {sUnit} = {realDist.toLocaleString()} {sUnit}. Change the scale and the same {sCm} cm means a different real distance.
                    </div>
                  </div>
                </div>

                {/* Educational Content for Tool 1 */}
                <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', border: '1px solid var(--cardline)', boxShadow: '0 4px 12px rgba(14,42,69,.04)' }}>
                  <h4 style={{ color: 'var(--navy)', marginTop: 0, marginBottom: '8px', fontSize: '15.5px' }}>✨ What is happening here?</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>
                    Imagine you have a magic shrinking machine! If our scale is <b>1 cm = 500 m</b>, it means every single centimetre you measure on this map represents exactly 500 metres out in the real world. 
                    <br/><br/>
                    So, if a road is 4 cm long on the paper, the real road is 4 times 500 metres, which is <b>2,000 metres</b> long! Try changing the scale above and see how the real distance changes even if the map measurement stays exactly the same.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button onClick={() => setActiveTool(2)} className="ds-nav-btn">
                    Next Activity →
                  </button>
                </div>
              </div>
            )}

            {activeTool === 2 && (
              <div className="ds-tool-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Tool 2: playground diagonal */}
                <div className="ds-tool">
                  <h3>2 · The playground diagonal</h3>
                  <div className="ds-hint">Draw a school playground to scale, then let the ruler measure its diagonal — computed with Pythagoras, never hard-coded.</div>
                  <div className="ds-fields">
                    <div className="ds-fld">
                      <label>Length (m)</label>
                      <input type="number" value={pL} onChange={(e) => setPL(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="ds-fld">
                      <label>Width (m)</label>
                      <input type="number" value={pW} onChange={(e) => setPW(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="ds-fld">
                      <label>Scale · 1 cm =</label>
                      <input type="number" value={pS} onChange={(e) => setPS(parseFloat(e.target.value) || 1)} />
                    </div>
                  </div>
                  
                  <div className="ds-stage">
                    <svg viewBox="0 0 400 260">
                      <rect x={ox} y={oy - h} width={w} height={h} fill="rgba(92,225,185,.14)" stroke="#5CE1B9" strokeWidth="2" />
                      <line x1={ox} y1={oy} x2={ox + w} y2={oy - h} stroke="#FFC24D" strokeWidth="2.4" strokeDasharray="6 4" />
                      <line x1={ox} y1={oy} x2={ox + Math.min(w, availW)} y2={oy} stroke="#5b6b8a" />
                      
                      {ticks.map((tx, i) => (
                        <line key={i} x1={tx} y1={oy} x2={tx} y2={oy + 5} stroke="#5b6b8a" strokeWidth="1" />
                      ))}
                      
                      <text x={ox + w / 2} y={oy + 22} fill="#9fb0d0" fontSize="12" textAnchor="middle" fontFamily="Space Grotesk">{drawL.toFixed(2)} cm ( = {pL} m )</text>
                      <text x={ox - 10} y={oy - h / 2} fill="#9fb0d0" fontSize="12" textAnchor="end" fontFamily="Space Grotesk">{drawW.toFixed(2)} cm</text>
                      <text x={ox + w / 2 + 6} y={oy - h / 2 - 6} fill="#FFC24D" fontSize="12" textAnchor="middle" fontFamily="IBM Plex Mono" transform={`rotate(${-Math.atan2(h, w) * 180 / Math.PI} ${ox + w / 2} ${oy - h / 2})`}>diagonal {diagCm.toFixed(2)} cm</text>
                    </svg>
                  </div>
                  
                  <div className="ds-result-grid">
                    <div className="ds-r">
                      <div className="ds-k">Drawing</div>
                      <div className="ds-v">{drawL.toFixed(2)} × {drawW.toFixed(2)} cm</div>
                    </div>
                    <div className="ds-r">
                      <div className="ds-k">Diagonal (cm)</div>
                      <div className="ds-v">{diagCm.toFixed(2)} cm</div>
                    </div>
                    <div className="ds-r ds-hl">
                      <div className="ds-k">Real diagonal</div>
                      <div className="ds-v">{diagReal.toFixed(1)} m</div>
                    </div>
                  </div>
                  
                  <div className="ds-out" style={{ marginTop: '10px' }}>
                    <div className="ds-work">
                      Drawing = {pL}÷{pS} by {pW}÷{pS} = <b>{drawL.toFixed(2)} × {drawW.toFixed(2)} cm</b>.<br/>
                      Diagonal = √({drawL.toFixed(2)}² + {drawW.toFixed(2)}²) = <b>{diagCm.toFixed(2)} cm</b>.<br/>
                      Real diagonal = {diagCm.toFixed(2)} × {pS} = <b>{diagReal.toFixed(1)} m</b>.
                    </div>
                  </div>
                </div>
                
                {/* Educational Content for Tool 2 */}
                <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', border: '1px solid var(--cardline)', boxShadow: '0 4px 12px rgba(14,42,69,.04)' }}>
                  <h4 style={{ color: 'var(--navy)', marginTop: 0, marginBottom: '8px', fontSize: '15.5px' }}>📏 Why draw to scale?</h4>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>
                    Have you ever wondered how far it is from one corner of a playground straight across to the opposite corner? Instead of measuring it outside with a giant tape measure, we can just draw the playground on paper using a scale!
                    <br/><br/>
                    By drawing the length and width exactly to scale, the diagonal line on our paper will also be perfectly to scale. We just measure it with a ruler and multiply by our scale to find the real-world distance!
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', alignItems: 'center' }}>
                  <button onClick={() => setActiveTool(1)} style={{ background: 'transparent', border: 'none', color: 'var(--mut)', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: 'var(--geo)' }}>
                    ← Back to Calculator
                  </button>
                  <button onClick={onComplete} className="ds-complete-btn">
                    Complete Activity
                  </button>
                </div>
              </div>
            )}

            <div className="ds-pfoot">
              <div className="ds-pageind">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#5c6b7a" strokeWidth="1.6" />
                  <path d="M12 7v5l3 2" stroke="#5c6b7a" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Distance &amp; Scale · Step 4 of 5
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--mut)' }}>real = cm × scale</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
