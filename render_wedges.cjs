const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
    canvas { display: block; }
  </style>
</head>
<body>
<canvas id="c" width="1024" height="1024"></canvas>
<script>
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 4.5);
  
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0); 
  renderer.setPixelRatio(2);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight1.position.set(5, 8, 5);
  scene.add(directionalLight1);
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight2.position.set(-5, -5, -5);
  scene.add(directionalLight2);
  
  // Use a realistic orange color for the peel
  const material = new THREE.MeshStandardMaterial({ 
      color: 0xf97316, 
      roughness: 0.6,
      metalness: 0.1,
      side: THREE.FrontSide 
  });
  
  const innerMat = new THREE.MeshStandardMaterial({ 
      color: 0xffedd5, 
      roughness: 0.9, 
      side: THREE.BackSide 
  });
  
  const radius = 1.3;
  const numSlices = 12;
  
  const group = new THREE.Group();
  group.rotation.set(0, -Math.PI / 2, 0); // match RealisticPeeledOrange orientation
  scene.add(group);
  
  window.renderSlice = function(index) {
      while(group.children.length > 0){ 
          group.remove(group.children[0]); 
      }
      
      const thetaStart = index * (Math.PI * 2) / numSlices;
      const thetaLength = (Math.PI * 2) / numSlices;
      
      const geo = new THREE.SphereGeometry(radius, 64, 64, thetaStart, thetaLength);
      const innerGeo = new THREE.SphereGeometry(radius * 0.95, 64, 64, thetaStart, thetaLength);
      
      const mesh = new THREE.Mesh(geo, material);
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      
      group.add(mesh);
      group.add(innerMesh);
      
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL("image/png");
  }
</script>
</body>
</html>
`;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(HTML_CONTENT);
    
    // wait for three.js to load
    await page.waitForFunction('window.THREE !== undefined');
    // wait a moment for shaders to compile
    await new Promise(r => setTimeout(r, 500));

    const filenames = [
        'wedge_0.png', 'wedge_30E.png', 'wedge_60E.png', 'wedge_90E.png', 
        'wedge_120E.png', 'wedge_150E.png', 'wedge_180.png', 'wedge_150W.png', 
        'wedge_120W.png', 'wedge_90W.png', 'wedge_60W.png', 'wedge_30W.png'
    ];

    const outputDir = path.join(__dirname, 'public', 'wedges');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 0; i < 12; i++) {
        const dataUrl = await page.evaluate((idx) => {
            return window.renderSlice(idx);
        }, i);
        
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        const outPath = path.join(outputDir, filenames[i]);
        fs.writeFileSync(outPath, base64Data, 'base64');
        console.log("Saved", outPath);
    }

    await browser.close();
})();
