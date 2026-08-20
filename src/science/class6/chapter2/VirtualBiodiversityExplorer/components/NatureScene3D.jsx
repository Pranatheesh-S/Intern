import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '../utils/soundEffects';

export default function NatureScene3D({
  organisms,
  discoveredIds = [],
  onSelectOrganism,
  selectedOrganismId
}) {
  const mountRef = useRef(null);
  const [hoveredOrganism, setHoveredOrganism] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE & CAMERA SETUP
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#7dd3fc'); // Sky cyan
    scene.fog = new THREE.FogExp2('#bae6fd', 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 12, 28);
    camera.lookAt(0, 3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    container.appendChild(renderer.domElement);

    // 2. LIGHTING
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#7dd3fc', '#15803d', 0.6);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#fffbeb', 1.6);
    sunLight.position.set(20, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    scene.add(sunLight);

    // 3. TERRAIN & ENVIRONMENT
    // Ground Grass Mesh
    const groundGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#22c55e',
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Pond Water
    const pondGeo = new THREE.CircleGeometry(7, 32);
    const pondMat = new THREE.MeshStandardMaterial({
      color: '#0284c7',
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(-10, 0.05, 5);
    scene.add(pond);

    // Dynamic Floating Cloud Meshes
    const cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 });
    for (let i = 0; i < 6; i++) {
      const cloud = new THREE.Group();
      const numSpheres = 5 + Math.floor(Math.random() * 4);
      for (let j = 0; j < numSpheres; j++) {
        const sGeo = new THREE.SphereGeometry(1.5 + Math.random() * 1.5, 8, 8);
        const sMesh = new THREE.Mesh(sGeo, cloudMat);
        sMesh.position.set((j - numSpheres / 2) * 1.8, Math.random() * 0.8, Math.random() * 0.8);
        cloud.add(sMesh);
      }
      cloud.position.set((Math.random() - 0.5) * 50, 16 + Math.random() * 6, -15 - Math.random() * 20);
      cloudsGroup.add(cloud);
    }
    scene.add(cloudsGroup);

    // Floating Sparkle Particles
    const particleCount = 150;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = Math.random() * 18;
      particlePositions[i + 2] = (Math.random() - 0.5) * 30;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.25,
      color: '#fef08a',
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. INTERACTIVE 3D ORGANISMS
    const interactiveObjects = [];
    const organismMeshesMap = new Map();

    organisms.forEach((org) => {
      const group = new THREE.Group();
      group.userData = { id: org.id, name: org.name, type: org.type };

      if (org.id === 'tree' || org.id === 'banyan') {
        // TALL BANYAN / MANGO TREE
        const trunkGeo = new THREE.CylinderGeometry(0.8, 1.2, 7, 12);
        const trunkMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 3.5;
        trunk.castShadow = true;
        group.add(trunk);

        // Foliage spheres
        const folMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.6 });
        const fol1 = new THREE.Mesh(new THREE.SphereGeometry(3.5, 12, 12), folMat);
        fol1.position.y = 7.5;
        fol1.castShadow = true;
        group.add(fol1);

        const fol2 = new THREE.Mesh(new THREE.SphereGeometry(2.8, 10, 10), folMat);
        fol2.position.set(-1.8, 6.5, 1);
        fol2.castShadow = true;
        group.add(fol2);

        const fol3 = new THREE.Mesh(new THREE.SphereGeometry(2.8, 10, 10), folMat);
        fol3.position.set(1.8, 6.8, -1);
        fol3.castShadow = true;
        group.add(fol3);

        group.position.set(12, 0, -5);
      } 
      else if (org.id === 'rose_plants' || org.id === 'shrub') {
        // HIBISCUS & ROSE SHRUB (Multi-stemmed woody bush)
        const stemMat = new THREE.MeshStandardMaterial({ color: '#92400e', roughness: 0.8 });
        for (let i = 0; i < 5; i++) {
          const sGeo = new THREE.CylinderGeometry(0.12, 0.18, 2.5, 8);
          const stem = new THREE.Mesh(sGeo, stemMat);
          stem.rotation.z = (Math.random() - 0.5) * 0.5;
          stem.rotation.x = (Math.random() - 0.5) * 0.5;
          stem.position.set((Math.random() - 0.5) * 0.8, 1.2, (Math.random() - 0.5) * 0.8);
          stem.castShadow = true;
          group.add(stem);
        }
        // Bush Leaves & Flowers
        const bushMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.7 });
        const bushCenter = new THREE.Mesh(new THREE.SphereGeometry(1.8, 10, 10), bushMat);
        bushCenter.position.y = 2.2;
        bushCenter.castShadow = true;
        group.add(bushCenter);

        // Red Hibiscus Flowers
        const flowerMat = new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.4 });
        for (let f = 0; f < 6; f++) {
          const flower = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), flowerMat);
          flower.position.set(
            (Math.random() - 0.5) * 2.2,
            2.2 + (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 2.2
          );
          group.add(flower);
        }

        group.position.set(-14, 0, 4);
      }
      else if (org.id === 'tulsi' || org.id === 'herb') {
        // TULSI HERB (Soft tender stem)
        const herbMat = new THREE.MeshStandardMaterial({ color: '#4ade80', roughness: 0.5 });
        const herbBase = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.6, 8), herbMat);
        herbBase.position.y = 0.8;
        herbBase.castShadow = true;
        group.add(herbBase);

        // Purple flower spikes
        const spikeMat = new THREE.MeshStandardMaterial({ color: '#a855f7', roughness: 0.4 });
        const spike = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 6), spikeMat);
        spike.position.y = 1.8;
        group.add(spike);

        group.position.set(6, 0, 10);
      }
      else if (org.id === 'frog') {
        // INDIAN POND FROG
        const frogBodyMat = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.4 });
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 10), frogBodyMat);
        body.scale.set(1.2, 0.8, 1);
        body.position.y = 0.55;
        body.castShadow = true;
        group.add(body);

        // Big Eyes
        const eyeMat = new THREE.MeshStandardMaterial({ color: '#ffffff' });
        const pupilMat = new THREE.MeshStandardMaterial({ color: '#000000' });
        
        const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), eyeMat);
        eyeL.position.set(-0.35, 0.9, 0.35);
        const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), pupilMat);
        pupilL.position.set(-0.35, 0.9, 0.5);
        group.add(eyeL);
        group.add(pupilL);

        const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), eyeMat);
        eyeR.position.set(0.35, 0.9, 0.35);
        const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), pupilMat);
        pupilR.position.set(0.35, 0.9, 0.5);
        group.add(eyeR);
        group.add(pupilR);

        group.position.set(-8, 0, 8);
      }
      else if (org.id === 'squirrel') {
        // SQUIRREL
        const sqMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.6 });
        const sqBody = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), sqMat);
        sqBody.scale.set(0.8, 1.2, 0.8);
        sqBody.position.y = 3.2;
        sqBody.castShadow = true;
        group.add(sqBody);

        // Bushy Tail
        const tail = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), sqMat);
        tail.scale.set(0.6, 1.5, 0.8);
        tail.rotation.z = -0.6;
        tail.position.set(-0.5, 3.4, 0);
        group.add(tail);

        group.position.set(11, 0, -4);
      }
      else if (org.id === 'butterfly') {
        // MONARCH BUTTERFLY
        const bflyBody = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.8, 6),
          new THREE.MeshStandardMaterial({ color: '#1e293b' })
        );
        bflyBody.rotation.x = Math.PI / 2;
        group.add(bflyBody);

        // Wings
        const wingMat = new THREE.MeshStandardMaterial({ color: '#f97316', side: THREE.DoubleSide });
        const wingL = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), wingMat);
        wingL.position.set(-0.4, 0, 0);
        wingL.rotation.y = 0.3;
        group.add(wingL);

        const wingR = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), wingMat);
        wingR.position.set(0.4, 0, 0);
        wingR.rotation.y = -0.3;
        group.add(wingR);

        group.userData.wingL = wingL;
        group.userData.wingR = wingR;

        group.position.set(-12, 3.5, 5);
      }
      else if (org.id === 'monkey') {
        // MONKEY PERCHED ON TREE
        const mkyMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.7 });
        const mkyBody = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), mkyMat);
        mkyBody.position.y = 6.2;
        mkyBody.castShadow = true;
        group.add(mkyBody);

        const mkyHead = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), mkyMat);
        mkyHead.position.set(0, 6.9, 0.2);
        group.add(mkyHead);

        group.position.set(11.5, 0, -4.5);
      }
      else if (org.id === 'sparrow' || org.id === 'crow') {
        // BIRD
        const birdColor = org.id === 'crow' ? '#334155' : '#b45309';
        const birdMat = new THREE.MeshStandardMaterial({ color: birdColor, roughness: 0.5 });
        
        const birdBody = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 6), birdMat);
        birdBody.rotation.x = Math.PI / 3;
        birdBody.position.y = org.id === 'crow' ? 12 : 5;
        group.add(birdBody);

        group.position.set(org.id === 'crow' ? -5 : -4, 0, org.id === 'crow' ? -8 : -1);
      }

      // Selection Ring Marker underneath
      const ringGeo = new THREE.RingGeometry(1.2, 1.6, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: discoveredIds.includes(org.id) ? '#10b981' : '#f59e0b',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.06;
      group.add(ring);
      group.userData.ring = ring;

      scene.add(group);
      interactiveObjects.push(group);
      organismMeshesMap.set(org.id, group);
    });

    // 5. RAYCASTING & INTERACTION
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Parallax effect on camera
      camera.position.x = mouse.x * 2.5;
      camera.position.y = 12 + mouse.y * 1.5;
      camera.lookAt(0, 3, 0);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let topGroup = intersects[0].object;
        while (topGroup.parent && topGroup.parent !== scene) {
          topGroup = topGroup.parent;
        }
        if (topGroup.userData && topGroup.userData.id) {
          container.style.cursor = 'pointer';
          setHoveredOrganism(topGroup.userData.id);
          return;
        }
      }
      container.style.cursor = 'default';
      setHoveredOrganism(null);
    };

    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        let topGroup = intersects[0].object;
        while (topGroup.parent && topGroup.parent !== scene) {
          topGroup = topGroup.parent;
        }
        if (topGroup.userData && topGroup.userData.id) {
          sounds.playPop();
          onSelectOrganism(topGroup.userData.id);
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousemove', handleMouseMove);
    domElem.addEventListener('click', handleClick);

    // 6. ANIMATION LOOP
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Cloud drift
      cloudsGroup.children.forEach((cloud, idx) => {
        cloud.position.x += 0.012 * (idx % 2 === 0 ? 1 : -1);
        if (cloud.position.x > 30) cloud.position.x = -30;
        if (cloud.position.x < -30) cloud.position.x = 30;
      });

      // Butterfly flap
      interactiveObjects.forEach((grp) => {
        if (grp.userData.wingL && grp.userData.wingR) {
          const flap = Math.sin(elapsedTime * 14) * 0.8;
          grp.userData.wingL.rotation.y = flap;
          grp.userData.wingR.rotation.y = -flap;
          grp.position.y = 3.5 + Math.sin(elapsedTime * 3) * 0.3;
        }
        // Selection Ring pulse
        if (grp.userData.ring) {
          const isSelected = selectedOrganismId === grp.userData.id;
          const isHovered = hoveredOrganism === grp.userData.id;
          const scale = 1 + Math.sin(elapsedTime * 4) * 0.08 + (isHovered || isSelected ? 0.3 : 0);
          grp.userData.ring.scale.set(scale, scale, scale);
        }
      });

      // Floating particles motion
      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] -= 0.02;
        if (positions[i] < 0) positions[i] = 18;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('mousemove', handleMouseMove);
      domElem.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [organisms, discoveredIds, selectedOrganismId, hoveredOrganism]);

  return (
    <div className="relative w-full h-full">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating 3D Target Indicators (Overlaid Labels for accessibility) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md px-5 py-2 rounded-full border border-emerald-400/40 text-emerald-300 text-sm font-semibold shadow-xl flex items-center gap-2 animate-bounce">
          <span>🔍</span>
          <span>Click 3D Plants & Animals to Explore Nature!</span>
        </div>
      </div>
    </div>
  );
}
