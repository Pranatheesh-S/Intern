import fs from 'fs';

const filePath = 'd:/Futura-Edtech/public/atlas-globe.html';
let html = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS for spin button and cursor grab
const cssTarget = '#top{top:14px;left:14px;padding:10px 14px;display:flex;flex-direction:column;gap:8px;max-width:min(480px,calc(100vw - 28px));z-index:20}';
const cssReplacement = `#top{top:14px;left:14px;padding:10px 14px;display:flex;flex-direction:column;gap:8px;max-width:min(540px,calc(100vw - 28px));z-index:20}
  html, body { cursor: grab; }
  html:active, body:active { cursor: grabbing; }
  .globe-actions{display:flex;align-items:center;gap:6px;margin-left:auto}
  .spin-btn{padding:5px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.09);color:#fff;font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .18s ease;display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
  .spin-btn:hover{background:rgba(111,196,255,.25);border-color:#6fc4ff;transform:translateY(-1px)}
  .spin-btn.on{background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%);border-color:#38bdf8;box-shadow:0 0 12px rgba(56,189,248,.4)}
  .spin-btn.on .spin-icon{animation:rotateSpin 4s linear infinite;display:inline-block}
  @keyframes rotateSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .spin-fun{background:linear-gradient(135deg, #d97706 0%, #b45309 100%);border-color:#f59e0b}
  .spin-fun:hover{background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%);box-shadow:0 0 12px rgba(245,158,11,.45)}`;

if (!html.includes(cssTarget)) {
  console.error('CSS target not found');
  process.exit(1);
}
html = html.replace(cssTarget, cssReplacement);

// 2. Add Spin Globe HTML
const htmlTarget = `<div id="top" class="panel">
  <div class="thm-header">
    <span class="thm-title">THEMATIC MAP</span>
  </div>
  <div class="thm-buttons" id="thm-buttons">
    <button class="thm-btn on" data-t="rain">🌧️ Rainfall</button>
    <button class="thm-btn" data-t="pop">👥 Population Density</button>
    <button class="thm-btn" data-t="forest">🌲 Forest Cover</button>
  </div>
</div>`;

const htmlReplacement = `<div id="top" class="panel">
  <div class="thm-header">
    <span class="thm-title" id="modeTitle">THEMATIC MAP</span>
    <div class="globe-actions">
      <button id="bSpinToggle" class="spin-btn on" title="Toggle Auto-Spin (R)">
        <span class="spin-icon">🔄</span> <span id="spinBtnText">Spinning</span>
      </button>
      <button id="bSpinRandom" class="spin-btn spin-fun" title="Spin and explore a random location">
        🎲 Spin & Explore
      </button>
    </div>
  </div>
  <div class="thm-buttons" id="thm-buttons">
    <button class="thm-btn on" data-t="rain">🌧️ Rainfall</button>
    <button class="thm-btn" data-t="pop">👥 Population Density</button>
    <button class="thm-btn" data-t="forest">🌲 Forest Cover</button>
  </div>
</div>`;

if (!html.includes(htmlTarget)) {
  console.error('HTML target not found');
  process.exit(1);
}
html = html.replace(htmlTarget, htmlReplacement);

// 3. Replace camera control and inertia physics
const camTarget = `/* ===================== camera controls ===================== */
const cam = {lon:60, lat:18, dist:300, tLon:60, tLat:18, tDist:300};
let dragging=false, px=0, py=0, autoRot=true, anim=null;
function applyCam(){
  cam.lon += (cam.tLon-cam.lon)*0.14;
  cam.lat += (cam.tLat-cam.lat)*0.14;
  cam.dist += (cam.tDist-cam.dist)*0.12;
  const p = toVec(cam.lon, cam.lat, cam.dist);
  camera.position.copy(p); camera.lookAt(0,0,0);
}
const el = renderer.domElement;
el.addEventListener('pointerdown', e=>{dragging=true;px=e.clientX;py=e.clientY;el.setPointerCapture(e.pointerId);anim=null;});
el.addEventListener('pointerup', ()=>dragging=false);
el.addEventListener('pointerleave', ()=>dragging=false);
el.addEventListener('pointermove', e=>{
  if(dragging){
    const k = 0.26*(cam.dist/300);
    cam.tLon -= (e.clientX-px)*k*1.1; cam.tLat += (e.clientY-py)*k*1.1;
    cam.tLat = Math.max(-88, Math.min(88, cam.tLat));
    px=e.clientX; py=e.clientY; moved=true;
  }
  mouse.x = e.clientX; mouse.y = e.clientY; hoverDirty = true;
});`;

const camReplacement = `/* ===================== camera controls with smooth momentum spin ===================== */
const cam = {lon:60, lat:18, dist:300, tLon:60, tLat:18, tDist:300};
let dragging=false, px=0, py=0, autoRot=true, anim=null;
let spinVelX = 0, spinVelY = 0, lastMoveX = 0, lastMoveY = 0, lastMoveTime = 0;

function applyCam(){
  cam.lon += (cam.tLon-cam.lon)*0.14;
  cam.lat += (cam.tLat-cam.lat)*0.14;
  cam.dist += (cam.tDist-cam.dist)*0.12;
  const p = toVec(cam.lon, cam.lat, cam.dist);
  camera.position.copy(p); camera.lookAt(0,0,0);
}
const el = renderer.domElement;
el.addEventListener('pointerdown', e=>{
  dragging=true; px=e.clientX; py=e.clientY;
  lastMoveX=e.clientX; lastMoveY=e.clientY;
  lastMoveTime=performance.now();
  spinVelX=0; spinVelY=0;
  el.setPointerCapture(e.pointerId); anim=null;
});
el.addEventListener('pointerup', ()=>{ dragging=false; });
el.addEventListener('pointerleave', ()=>{ dragging=false; });
el.addEventListener('pointermove', e=>{
  if(dragging){
    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTime);
    const k = 0.26*(cam.dist/300);
    const dx = (e.clientX-px)*k*1.1;
    const dy = (e.clientY-py)*k*1.1;
    cam.tLon -= dx; cam.tLat += dy;
    cam.tLat = Math.max(-88, Math.min(88, cam.tLat));

    // Calculate fling velocity for natural physical tabletop spin
    spinVelX = -((e.clientX - lastMoveX) * k * 1.1) / dt * 14;
    spinVelY = ((e.clientY - lastMoveY) * k * 1.1) / dt * 14;

    px=e.clientX; py=e.clientY;
    lastMoveX=e.clientX; lastMoveY=e.clientY;
    lastMoveTime=now;
    moved=true;
  }
  mouse.x = e.clientX; mouse.y = e.clientY; hoverDirty = true;
});`;

if (!html.includes(camTarget)) {
  console.error('Cam target not found');
  process.exit(1);
}
html = html.replace(camTarget, camReplacement);

// 4. Update setMode so title updates and buttons update
const setModeTarget = `function setMode(m, t){
  if(m===mode && (m!=="thematic" || t===theme)) return;
  mode = m; if(t) theme = t;
  uni.mapB.value = texFor(); uni.mixv.value = 0; fading = 1;
  const topPanel = $("#top");
  if(topPanel){
    topPanel.style.display = (mode === "thematic") ? "flex" : "none";
  }
  document.querySelectorAll('.thm-btn').forEach(b=>b.classList.toggle('on', b.dataset.t===theme));
  drawLegend(); buildLabelSet(); refreshInfo();
}`;

const setModeReplacement = `function setMode(m, t){
  if(m===mode && (m!=="thematic" || t===theme)) return;
  mode = m; if(t) theme = t;
  uni.mapB.value = texFor(); uni.mixv.value = 0; fading = 1;
  const topPanel = $("#top");
  const thmBtns = $("#thm-buttons");
  const modeTitle = $("#modeTitle");
  if(topPanel){
    topPanel.style.display = "flex";
  }
  if(modeTitle){
    modeTitle.textContent = mode === "physical" ? "PHYSICAL MAP" : (mode === "political" ? "POLITICAL MAP" : "THEMATIC MAP");
  }
  if(thmBtns){
    thmBtns.style.display = (mode === "thematic") ? "flex" : "none";
  }
  document.querySelectorAll('.thm-btn').forEach(b=>b.classList.toggle('on', b.dataset.t===theme));
  drawLegend(); buildLabelSet(); refreshInfo();
}`;

if (!html.includes(setModeTarget)) {
  console.error('setMode target not found');
  process.exit(1);
}
html = html.replace(setModeTarget, setModeReplacement);

// 5. Update tick and spin buttons logic
const tickTarget = `let last=0;
function tick(t){
  requestAnimationFrame(tick);
  if(anim) anim();
  if(autoRot && !dragging && !anim) cam.tLon += 0.09;
  applyCam();
  uni.relief.value = (mode==="physical") ? 1.0 : (mode==="political" ? 0.22 : 0.14);
  uni.camDist.value = cam.dist;
  if(fading){
    uni.mixv.value = Math.min(1, uni.mixv.value + 0.075);
    if(uni.mixv.value>=1){ uni.mapA.value = uni.mapB.value; uni.mixv.value=0; fading=0; }
  }
  if(t-last > 55){ renderLabels(); updateHover(); last=t; }
  renderer.render(scene, camera);
}`;

const tickReplacement = `// Spin Globe Button & Spin and Explore handlers
const spinToggleBtn = $("#bSpinToggle");
const spinBtnText = $("#spinBtnText");
function updateSpinUI(){
  if(spinToggleBtn) spinToggleBtn.classList.toggle('on', autoRot);
  if(spinBtnText) spinBtnText.textContent = autoRot ? "Spinning" : "Spin Globe";
}
if(spinToggleBtn){
  spinToggleBtn.onclick = ()=>{
    autoRot = !autoRot;
    spinVelX = 0; spinVelY = 0;
    updateSpinUI();
  };
}

const EXPLORE_PLACES = [
  {n:"India", lon:78.96, lat:20.59, a3:"IND"},
  {n:"Brazil", lon:-51.92, lat:-14.23, a3:"BRA"},
  {n:"Indonesia", lon:113.92, lat:-0.78, a3:"IDN"},
  {n:"Democratic Republic of the Congo", lon:21.75, lat:-4.03, a3:"COD"},
  {n:"Gabon", lon:11.60, lat:-0.80, a3:"GAB"},
  {n:"Japan", lon:138.25, lat:36.20, a3:"JPN"},
  {n:"Finland", lon:25.74, lat:61.92, a3:"FIN"},
  {n:"Canada", lon:-106.34, lat:56.13, a3:"CAN"},
  {n:"Mongolia", lon:103.84, lat:46.86, a3:"MNG"},
  {n:"Oman", lon:55.97, lat:21.51, a3:"OMN"},
  {n:"Vietnam", lon:108.27, lat:14.05, a3:"VNM"},
  {n:"Suriname", lon:-56.02, lat:3.91, a3:"SUR"}
];

const spinRandomBtn = $("#bSpinRandom");
if(spinRandomBtn){
  spinRandomBtn.onclick = ()=>{
    // Accelerated dynamic spin with smooth deceleration landing on an interesting place
    const pick = EXPLORE_PLACES[Math.floor(Math.random() * EXPLORE_PLACES.length)];
    const startLon = cam.tLon, startLat = cam.tLat, startDist = cam.tDist;
    const targetLon = pick.lon + 360 * 2; // 2 full revolutions
    const targetLat = pick.lat;
    const targetDist = 210;
    const startTime = performance.now();
    const duration = 2400; // ms

    autoRot = false;
    updateSpinUI();
    spinVelX = 0; spinVelY = 0;

    anim = ()=>{
      const now = performance.now();
      const p = Math.min(1, (now - startTime) / duration);
      // Quintic ease out for high speed spin easing into precise landing
      const ease = 1 - Math.pow(1 - p, 4);
      cam.tLon = startLon + (targetLon - startLon) * ease;
      cam.tLat = startLat + (targetLat - startLat) * ease;
      cam.tDist = startDist + (targetDist - startDist) * ease;

      if(p >= 1){
        anim = null;
        cam.tLon = pick.lon;
        focus = {n: pick.n, x: pick.lon, y: pick.lat};
        if(byA3[pick.a3]){
          pinned = {c: byA3[pick.a3], r: null};
          refreshInfo();
        }
      }
    };
  };
}

let last=0;
function tick(t){
  requestAnimationFrame(tick);
  if(anim) {
    anim();
  } else if(dragging) {
    // handled in pointermove
  } else {
    // Physical inertia momentum spin
    if(Math.abs(spinVelX) > 0.015 || Math.abs(spinVelY) > 0.015){
      cam.tLon += spinVelX;
      cam.tLat += spinVelY;
      cam.tLat = Math.max(-88, Math.min(88, cam.tLat));
      spinVelX *= 0.94; // natural friction
      spinVelY *= 0.94;
    } else if(autoRot) {
      cam.tLon += 0.11;
    }
  }
  applyCam();
  uni.relief.value = (mode==="physical") ? 1.0 : (mode==="political" ? 0.22 : 0.14);
  uni.camDist.value = cam.dist;
  if(fading){
    uni.mixv.value = Math.min(1, uni.mixv.value + 0.075);
    if(uni.mixv.value>=1){ uni.mapA.value = uni.mapB.value; uni.mixv.value=0; fading=0; }
  }
  if(t-last > 55){ renderLabels(); updateHover(); last=t; }
  renderer.render(scene, camera);
}`;

if (!html.includes(tickTarget)) {
  console.error('tick target not found');
  process.exit(1);
}
html = html.replace(tickTarget, tickReplacement);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated atlas-globe.html with Spin Globe controls and inertia physics!');
