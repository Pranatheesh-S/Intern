import fs from 'fs';

const filePath = 'd:/Futura-Edtech/public/atlas-globe.html';
let html = fs.readFileSync(filePath, 'utf8');

// Replace starfield and atmosphere section with the enhanced photorealistic components from interactive-3d-globe
const starfieldTarget = `/* starfield */
(function(){
  const N=2600, pos=new Float32Array(N*3), col=new Float32Array(N*3);
  for(let i=0;i<N;i++){
    const t=Math.acos(2*Math.random()-1), f=Math.random()*2*Math.PI, r=900+Math.random()*1600;
    pos[i*3]=r*Math.sin(t)*Math.cos(f); pos[i*3+1]=r*Math.cos(t); pos[i*3+2]=r*Math.sin(t)*Math.sin(f);
    const g=.55+Math.random()*.45, b=.9+Math.random()*.1;
    col[i*3]=g*.92; col[i*3+1]=g*.96; col[i*3+2]=g*b;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  scene.add(new THREE.Points(geo,new THREE.PointsMaterial({size:2.1,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:.85})));
})();`;

const starfieldReplacement = `/* deep space starfield (5000 stars with natural warm/cool stellar spectrum) */
(function(){
  const count = 5000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    const u = Math.random(), v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = 1400 + Math.random() * 600;
    pos[i]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i+2] = r * Math.cos(phi);

    const warm = Math.random() > 0.82;
    col[i]   = warm ? 1.0 : 0.75 + Math.random() * 0.25;
    col[i+1] = warm ? 0.88 : 0.88 + Math.random() * 0.12;
    col[i+2] = warm ? 0.60 : 1.0;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 1.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.90,
  });
  scene.add(new THREE.Points(geo, mat));
})();`;

if (html.includes(starfieldTarget)) {
  html = html.replace(starfieldTarget, starfieldReplacement);
}

// Replace atmosphere with photorealistic clouds + dual-tier atmosphere limb glow
const atmoTarget = `/* atmosphere */
const atmo = new THREE.Mesh(new THREE.SphereGeometry(R*1.035,64,48), new THREE.ShaderMaterial({
  transparent:true, side:THREE.BackSide, depthWrite:false, blending:THREE.AdditiveBlending,
  vertexShader:\`varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}\`,
  fragmentShader:\`varying vec3 vN; void main(){
    float i=pow(0.72 - dot(vN, vec3(0.,0.,1.)), 2.6);
    gl_FragColor=vec4(0.30,0.62,1.0,1.0)*clamp(i,0.,1.)*0.85; }\`
}));
scene.add(atmo);`;

const atmoReplacement = `/* volumetric cloud layer from photorealistic globe */
let cloudsMesh = null;
loader.load('/interactive-3d-globe/textures/earth-clouds.png', (cTex) => {
  cTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  cTex.minFilter = THREE.LinearMipMapLinearFilter;
  const cMat = new THREE.MeshBasicMaterial({
    map: cTex,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  cloudsMesh = new THREE.Mesh(new THREE.SphereGeometry(R * 1.006, 192, 192), cMat);
  scene.add(cloudsMesh);
});

/* realistic thin-shell atmosphere limb */
const atmoMat = new THREE.ShaderMaterial({
  vertexShader: \`
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`,
  fragmentShader: \`
    varying vec3 vNormal;
    void main() {
      float fresnel = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
      float power = pow(fresnel, 4.2);
      vec3 colSky = vec3(0.25, 0.58, 0.98);
      gl_FragColor = vec4(colSky, power * 0.48);
    }
  \`,
  blending: THREE.NormalBlending,
  side: THREE.BackSide,
  transparent: true,
  depthWrite: false,
});
const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.035, 96, 96), atmoMat);
scene.add(atmo);

/* outer cosmic rim glow */
const glowMat = new THREE.ShaderMaterial({
  vertexShader: \`
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`,
  fragmentShader: \`
    varying vec3 vNormal;
    void main() {
      float i = pow(0.70 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
      gl_FragColor = vec4(0.15, 0.50, 1.0, 1.0) * clamp(i, 0.0, 1.0) * 0.40;
    }
  \`,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
  depthWrite: false,
});
const glow = new THREE.Mesh(new THREE.SphereGeometry(R * 1.075, 64, 64), glowMat);
scene.add(glow);`;

if (html.includes(atmoTarget)) {
  html = html.replace(atmoTarget, atmoReplacement);
}

// Add clouds rotation to tick function
const tickCallTarget = `if(t-last > 55){ renderLabels(); updateHover(); last=t; }
  renderer.render(scene, camera);`;

const tickCallReplacement = `if(cloudsMesh) {
    cloudsMesh.rotation.y += 0.0003;
  }
  if(t-last > 55){ renderLabels(); updateHover(); last=t; }
  renderer.render(scene, camera);`;

if (html.includes(tickCallTarget)) {
  html = html.replace(tickCallTarget, tickCallReplacement);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully upgraded globe visuals with clouds, atmospheric shaders, and starfield!');
