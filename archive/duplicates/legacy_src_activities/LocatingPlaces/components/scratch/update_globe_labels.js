import fs from 'fs';

const filePath = 'd:/Futura-Edtech/public/atlas-globe.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update project(v, camDir)
const oldProject = `function project(v, camDir){
  if(v.dot(camDir) < R*0.30) return null;
  tmp.copy(v).project(camera);
  if(tmp.z > 1) return null;
  const X = (tmp.x*0.5+0.5)*innerWidth, Y = (-tmp.y*0.5+0.5)*innerHeight;
  if(X<40 || X>innerWidth-40 || Y<12 || Y>innerHeight-12) return null;
  return [X,Y];
}`;

const newProject = `function project(v, camDir){
  if(v.dot(camDir) < R*0.48) return null;
  tmp.copy(v).project(camera);
  if(tmp.z > 1) return null;
  const X = (tmp.x*0.5+0.5)*innerWidth, Y = (-tmp.y*0.5+0.5)*innerHeight;
  const cx = innerWidth / 2, cy = innerHeight / 2;
  const fovRad = (camera.fov * Math.PI) / 360;
  const screenR = (R / cam.dist) * (innerHeight / (2 * Math.tan(fovRad)));
  if(Math.hypot(X - cx, Y - cy) > screenR * 0.86) return null;
  if(X<40 || X>innerWidth-40 || Y<12 || Y>innerHeight-12) return null;
  return [X,Y];
}`;

// 2. Update uiReservedBoxes()
const oldUIReserved = `function uiReservedBoxes(){
  const out = [];
  const pad = 10;
  for(const el of UI_PANELS){
    if(!el || el.offsetParent === null) continue; // hidden (display:none)
    const r = el.getBoundingClientRect();
    if(r.width < 1 || r.height < 1) continue;
    out.push([r.left + r.width/2, r.top + r.height/2, r.width + pad*2, r.height + pad*2]);
  }
  return out;
}`;

const newUIReserved = `function uiReservedBoxes(){
  const out = [];
  const pad = 24;
  for(const el of UI_PANELS){
    if(!el || el.offsetParent === null) continue; // hidden (display:none)
    const r = el.getBoundingClientRect();
    if(r.width < 1 || r.height < 1) continue;
    out.push([r.left + r.width/2, r.top + r.height/2, r.width + pad*2, r.height + pad*2]);
  }
  return out;
}`;

// 3. Update buildLabelSet()
const oldBuildLabelSet = `function buildLabelSet(){
  const S = [];
  const push = (o, cls, pri, minD, maxD) => S.push({n:o.n, x:o.x, y:o.y, cls, pri, minD:minD||0, maxD:maxD===undefined?9e9:maxD, ref:o});
  if(mode==="physical"){
    LABELS.phys.forEach(p=>{
      if(p.t==="continent") push(p,"continent", 0, 0, 9e9);
      else if(p.t==="range")   push(p,"range",   2 + (p.r||5)*.1, 0, p.a>18?9e9:(p.a>4?330:230));
      else if(p.t==="desert")  push(p,"desert",  2.2, 0, p.a>18?9e9:300);
      else push(p, p.t, 4 + (p.r||5)*.1, 0, p.a>10?9e9:(p.a>2?280:200));
    });
    LABELS.marine.forEach(m=>{
      if(m.t==="ocean") push(m,"ocean",.5,0,9e9);
      else push(m,"sea", m.a>25?2.4:3.6, 0, m.a>20?9e9:(m.a>4?330:240));
    });
    LABELS.rivers.forEach(r=> push(r,"river", 3 + (r.r||8)*.12, 0, r.L>28?9e9:(r.L>12?300:210)));
    LABELS.lakes.forEach(l=>  push(l,"lake",  3.4, 0, l.a>3?9e9:(l.a>.6?300:200)));
    LABELS.peaks.filter(p=>p.e && p.e>3400).forEach(p=> push(p,"peak", 5 - Math.min(2,(p.e||0)/5000), 0, p.e>7000?9e9:(p.e>5200?280:200)));
  }`;

const newBuildLabelSet = `function buildLabelSet(){
  const S = [];
  const push = (o, cls, pri, minD, maxD) => S.push({n:o.n, x:o.x, y:o.y, cls, pri, minD:minD||0, maxD:maxD===undefined?9e9:maxD, ref:o});
  if(mode==="physical"){
    LABELS.phys.forEach(p=>{
      if(p.t==="continent") push(p,"continent", 0, 0, 9e9);
      else if(p.t==="range")   push(p,"range",   2 + (p.r||5)*.1, 0, p.a>25?9e9:(p.a>8?310:210));
      else if(p.t==="desert")  push(p,"desert",  2.2, 0, p.a>25?9e9:260);
      else push(p, p.t, 4 + (p.r||5)*.1, 0, p.a>15?9e9:(p.a>4?260:190));
    });
    LABELS.marine.forEach(m=>{
      if(m.t==="ocean") push(m,"ocean",.5,0,9e9);
      else push(m,"sea", m.a>35?2.4:3.6, 0, m.a>25?9e9:(m.a>8?310:220));
    });
    LABELS.rivers.forEach(r=> push(r,"river", 3.5 + (r.r||8)*.12, 0, r.L>35?9e9:(r.L>18?280:190)));
    LABELS.lakes.forEach(l=>  push(l,"lake",  3.8, 0, l.a>5?9e9:(l.a>1.2?270:180)));
    LABELS.peaks.filter(p=>p.e && p.e>4200).forEach(p=> push(p,"peak", 5.5 - Math.min(2,(p.e||0)/5000), 0, p.e>7500?9e9:(p.e>6000?250:180)));
  }`;

let updatedCount = 0;
if (content.includes(oldProject)) {
  content = content.replace(oldProject, newProject);
  updatedCount++;
  console.log('Project updated successfully.');
} else {
  console.log('oldProject snippet NOT matched.');
}

if (content.includes(oldUIReserved)) {
  content = content.replace(oldUIReserved, newUIReserved);
  updatedCount++;
  console.log('UIReserved updated successfully.');
} else {
  console.log('oldUIReserved snippet NOT matched.');
}

if (content.includes(oldBuildLabelSet)) {
  content = content.replace(oldBuildLabelSet, newBuildLabelSet);
  updatedCount++;
  console.log('BuildLabelSet updated successfully.');
} else {
  console.log('oldBuildLabelSet snippet NOT matched.');
}

if (updatedCount > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Saved ${updatedCount} updates to ${filePath}`);
}
