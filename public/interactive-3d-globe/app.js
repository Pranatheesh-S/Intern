// Photorealistic Earth Globe — Natural, Even Photographic Color with No Light Reflection Glare

(function () {
  'use strict';

  // ─── TEXTURE SOURCES ─────────────────────────────────────────────────────────
  const TEXTURES = {
    day:    'textures/earth-blue-marble.jpg',
    bump:   'textures/earth-topology.png',
    clouds: 'textures/earth-clouds.png',
    night:  'textures/earth-night.jpg',
  };

  const FALLBACK_TEXTURES = {
    day:    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    clouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    bump:   'https://unpkg.com/three-globe/example/img/earth-topology.png',
  };

  // ─── THREE.JS CORE ───────────────────────────────────────────────────────────
  let scene, camera, renderer, controls;
  let globeMesh, cloudsMesh, atmosphereMesh, glowMesh, starsMesh;
  const loadedTextures = {};

  const container = document.getElementById('globe-container') || document.body;

  window.addEventListener('DOMContentLoaded', init);

  function init() {
    buildScene();
    loadAllTextures(() => {
      buildGlobe();
      buildClouds();
      buildAtmosphere();
      buildGlow();
      buildStarfield();
      animate();
    });
  }

  // ─── SCENE / RENDERER / CAMERA ───────────────────────────────────────────────
  function buildScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 15, 280);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Natural sRGB color encoding without harsh contrast clipping
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;

    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed   = 0.65;
    controls.zoomSpeed     = 1.1;
    controls.minDistance   = 115;
    controls.maxDistance   = 800;
    controls.autoRotate    = true;
    controls.autoRotateSpeed = 0.45;

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ─── TEXTURE LOADING ─────────────────────────────────────────────────────────
  function loadAllTextures(onComplete) {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const keys = Object.keys(TEXTURES);
    let done = 0;

    const maxAniso = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;

    keys.forEach(key => {
      loader.load(
        TEXTURES[key],
        tex => {
          tex.anisotropy = maxAniso;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.needsUpdate = true;
          loadedTextures[key] = tex;
          if (++done === keys.length) onComplete();
        },
        undefined,
        () => {
          // Fallback to CDN
          if (FALLBACK_TEXTURES[key]) {
            loader.load(
              FALLBACK_TEXTURES[key],
              tex => {
                tex.anisotropy = maxAniso;
                loadedTextures[key] = tex;
                if (++done === keys.length) onComplete();
              },
              undefined,
              () => {
                loadedTextures[key] = makeFallbackTexture(key);
                if (++done === keys.length) onComplete();
              }
            );
          } else {
            loadedTextures[key] = makeFallbackTexture(key);
            if (++done === keys.length) onComplete();
          }
        }
      );
    });
  }

  function makeFallbackTexture(key) {
    const cvs = document.createElement('canvas');
    cvs.width = 256; cvs.height = 128;
    const ctx = cvs.getContext('2d');
    if (key === 'day') {
      ctx.fillStyle = '#0f3866';
      ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(70, 30, 60, 40);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 256, 128);
    }
    const tex = new THREE.CanvasTexture(cvs);
    tex.needsUpdate = true;
    return tex;
  }

  // ─── GLOBE — Natural Even Lighting (MeshBasicMaterial prevents glare/blowouts) ──
  function buildGlobe() {
    const geo = new THREE.SphereGeometry(100, 256, 256);

    const mat = new THREE.MeshBasicMaterial({
      map: loadedTextures.day,
      color: 0xffffff,
    });

    globeMesh = new THREE.Mesh(geo, mat);
    globeMesh.rotation.y = -Math.PI / 2;
    scene.add(globeMesh);
  }

  // ─── CLOUDS — Soft, subtle cloud layer with no overexposed white glare ───────
  function buildClouds() {
    const geo = new THREE.SphereGeometry(101.2, 192, 192);
    const mat = new THREE.MeshBasicMaterial({
      map:         loadedTextures.clouds,
      transparent: true,
      opacity:     0.28, // Soft, realistic cloud density
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });
    cloudsMesh = new THREE.Mesh(geo, mat);
    scene.add(cloudsMesh);
  }

  // ─── THIN-SHELL ATMOSPHERE (Subtle, realistic limb glow) ────────────────────
  function buildAtmosphere() {
    const geo = new THREE.SphereGeometry(104.2, 128, 128);
    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal   = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
          float power   = pow(fresnel, 4.5);
          vec3 colSky   = vec3(0.25, 0.55, 0.95);
          gl_FragColor  = vec4(colSky, power * 0.45);
        }
      `,
      blending:    THREE.NormalBlending,
      side:        THREE.BackSide,
      transparent: true,
      depthWrite:  false,
    });
    atmosphereMesh = new THREE.Mesh(geo, mat);
    scene.add(atmosphereMesh);
  }

  // ─── OUTER GLOW (Delicate cosmic rim) ────────────────────────────────────────
  function buildGlow() {
    const geo = new THREE.SphereGeometry(108, 64, 64);
    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal     = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float i = pow(0.70 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
          gl_FragColor = vec4(0.12, 0.45, 0.95, 1.0) * i * 0.35;
        }
      `,
      blending:    THREE.AdditiveBlending,
      side:        THREE.BackSide,
      transparent: true,
      depthWrite:  false,
    });
    glowMesh = new THREE.Mesh(geo, mat);
    scene.add(glowMesh);
  }

  // ─── STARFIELD ───────────────────────────────────────────────────────────────
  function buildStarfield() {
    const count = 5000;
    const pos   = new Float32Array(count * 3);
    const col   = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const u = Math.random(), v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi   = Math.acos(2 * v - 1);
      const r = 1500 + Math.random() * 400;
      pos[i]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i+2] = r * Math.cos(phi);

      const warm = Math.random() > 0.82;
      col[i]   = warm ? 1.0 : 0.75 + Math.random() * 0.25;
      col[i+1] = warm ? 0.85 : 0.85 + Math.random() * 0.15;
      col[i+2] = warm ? 0.55 : 1.0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    starsMesh = new THREE.Points(geo, mat);
    scene.add(starsMesh);
  }

  // ─── ANIMATION LOOP ──────────────────────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (cloudsMesh) cloudsMesh.rotation.y += 0.00035;
    if (starsMesh)  starsMesh.rotation.y  += 0.00003;

    renderer.render(scene, camera);
  }
})();
