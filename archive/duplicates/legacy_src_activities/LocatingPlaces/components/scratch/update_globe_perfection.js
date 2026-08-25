import fs from 'fs';

const filePath = 'd:/Futura-Edtech/public/atlas-globe.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace GAP = 5 with GAP = 24
const oldGap = `const GAP = 5;`;
const newGap = `const GAP = 24;`;

// 2. Replace project(v, camDir)
const oldProject = `function project(v, camDir){
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

const newProject = `function project(v, camDir){
  // Strict 3D front-hemisphere dot product (54 deg angle from camera view)
  if(v.dot(camDir) < R*0.58) return null;
  tmp.copy(v).project(camera);
  if(tmp.z > 1) return null;
  const X = (tmp.x*0.5+0.5)*innerWidth, Y = (-tmp.y*0.5+0.5)*innerHeight;
  const cx = innerWidth / 2, cy = innerHeight / 2;
  const fovRad = (camera.fov * Math.PI) / 360;
  const screenR = (R / cam.dist) * (innerHeight / (2 * Math.tan(fovRad)));
  // Ensure the full label stays safely within 76% of the globe screen radius
  if(Math.hypot(X - cx, Y - cy) > screenR * 0.76) return null;
  if(X<50 || X>innerWidth-50 || Y<20 || Y>innerHeight-20) return null;
  return [X,Y];
}`;

// 3. Replace budget in renderLabels
const oldBudget = `const budget = d>420 ? 46 : d>320 ? 70 : d>230 ? 105 : d>170 ? 150 : 210;`;
const newBudget = `const budget = d>400 ? 26 : d>300 ? 42 : d>220 ? 70 : d>160 ? 110 : 160;`;

let count = 0;
if (content.includes(oldGap)) {
  content = content.replace(oldGap, newGap);
  count++;
  console.log('GAP updated to 24px.');
} else {
  console.log('oldGap not found');
}

if (content.includes(oldProject)) {
  content = content.replace(oldProject, newProject);
  count++;
  console.log('project function updated with 0.58 dot product & 0.76 screenR bounds.');
} else {
  console.log('oldProject not found');
}

if (content.includes(oldBudget)) {
  content = content.replace(oldBudget, newBudget);
  count++;
  console.log('budget updated for clean decluttered view.');
} else {
  console.log('oldBudget not found');
}

if (count > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Saved ${count} changes to ${filePath}`);
}
