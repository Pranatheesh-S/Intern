import fs from 'fs';

const filePath = 'd:/Futura-Edtech/public/atlas-globe.html';
let html = fs.readFileSync(filePath, 'utf8');

// 1. Update texFor so forest and physical mode use the photorealistic Blue Marble texture from the front page
const texForTarget = `function texFor(){
  if(mode==="physical") return tex.physical;
  if(mode==="political") return tex.political;
  return tex[THEMES.find(t=>t.k===theme).src];
}`;

const texForReplacement = `function texFor(){
  if(mode==="physical") return tex.photoreal || tex.physical;
  if(mode==="political") return tex.political;
  if(theme==="forest") return tex.photoreal || tex.thm_forest;
  return tex[THEMES.find(t=>t.k===theme).src] || tex.photoreal;
}`;

if (html.includes(texForTarget)) {
  html = html.replace(texForTarget, texForReplacement);
} else {
  console.error('texForTarget not found');
}

// 2. Add photoreal and topology textures to boot
const bootTarget = `const NEED = ["physical","political","thm_pop","thm_climate","thm_forest","thm_rain","bump"];
const TOTAL = NEED.length + 2;`;

const bootReplacement = `const NEED = ["physical","political","thm_pop","thm_climate","thm_forest","thm_rain","bump"];
const TOTAL = NEED.length + 4;`;

if (html.includes(bootTarget)) {
  html = html.replace(bootTarget, bootReplacement);
}

const needForEachTarget = `NEED.forEach(k=>{ tex[k] = mkTex(ASSETS[k], step); });
uni.bumpT.value = tex.bump;
uni.mapA.value = tex.thm_rain; uni.mapB.value = tex.thm_rain;`;

const needForEachReplacement = `NEED.forEach(k=>{ tex[k] = mkTex(ASSETS[k], step); });
tex.photoreal = mkTex('/interactive-3d-globe/textures/earth-blue-marble.jpg', step);
tex.bump = mkTex('/interactive-3d-globe/textures/earth-topology.png', step);
uni.bumpT.value = tex.bump;
const initialTex = texFor();
uni.mapA.value = initialTex; uni.mapB.value = initialTex;`;

if (html.includes(needForEachTarget)) {
  html = html.replace(needForEachTarget, needForEachReplacement);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated globe to use photorealistic Blue Marble Earth from the front page!');
