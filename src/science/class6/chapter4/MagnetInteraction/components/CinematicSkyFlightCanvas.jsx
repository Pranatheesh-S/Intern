import React, { useEffect, useRef } from "react";
import MagnetActivityBackground from "./MagnetActivityBackground";

export default function CinematicSkyFlightCanvas({ 
  interactionMode = "same", 
  isRunning = true,
  polesMatch = true 
}) {
  const canvasRef = useRef(null);
  const isRunningRef = useRef(isRunning);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let dpr = window.devicePixelRatio || 1;
    let cssWidth = 800;
    let cssHeight = 450;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      cssWidth = canvas.parentElement.clientWidth || 800;
      cssHeight = canvas.parentElement.clientHeight || 450;
      dpr = window.devicePixelRatio || 1;
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Load High-Resolution Photorealistic Assets
    const imgPlaneNS = new Image();
    imgPlaneNS.src = "/MagnetInteraction/real_airliner_north_south.png";

    // Realistic Turbofan Jet Contrail Particles
    const contrailParticles = [];
    for (let i = 0; i < 140; i++) {
      contrailParticles.push({
        planeIndex: i % 2,
        engineOffset: (i % 4 < 2) ? -85 : 85,
        age: Math.random() * 80,
        maxAge: 80,
        size: 7 + Math.random() * 12,
        alpha: 0.55
      });
    }

    // Realistic High-Fidelity Crash Particle Systems
    const fireParticles = [];
    const smokeParticles = [];
    const shrapnelParticles = [];
    const shockwaveRings = [];
    const staticSparks = [];

    // Atmospheric Cloud Mist Particles matching reference image
    const cloudMistParticles = [];
    for (let i = 0; i < 22; i++) {
      cloudMistParticles.push({
        x: Math.random() * cssWidth,
        y: cssHeight * 0.20 + Math.random() * cssHeight * 0.70,
        radius: 70 + Math.random() * 110,
        vx: 0.12 + Math.random() * 0.22,
        alpha: 0.035 + Math.random() * 0.05
      });
    }

    // Aircraft physical flight coordinates
    let planeAX = cssWidth * 0.5 - 190;
    let planeAY = polesMatch ? -140 : cssHeight + 140;
    let planeARoll = polesMatch ? Math.PI : 0;
    let planeAScale = 1.0;
    let planeAOpacity = 1.0;

    let planeBX = cssWidth * 0.5 + 190;
    let planeBY = cssHeight + 140;
    let planeBRoll = 0;
    let planeBScale = 1.0;
    let planeBOpacity = 1.0;

    let samePolesTimer = 0;
    let crashTimer = 0;
    let cameraShake = 0;
    let flashAlpha = 0;
    let time = 0;
    let hasTriggeredImpact = false;

    // Pre-impact magnetic static arc discharge
    function emitPreImpactStaticArcs(x1, y1, x2, y2) {
      if (Math.random() > 0.4) {
        staticSparks.push({
          x: (x1 + x2) * 0.5 + (Math.random() - 0.5) * 20,
          y: (y1 + y2) * 0.5 + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          size: 2 + Math.random() * 4,
          life: 0,
          maxLife: 6 + Math.random() * 8,
          color: Math.random() > 0.5 ? "#60A5FA" : "#FBBF24"
        });
      }
    }

    // Trigger Initial Catastrophic Impact
    function triggerCatastrophicImpact(impactX, impactY) {
      cameraShake = 24; // Intense initial shock
      flashAlpha = 0.85; // Radial blinding thermal flash

      // 1. Double Shockwave blast rings
      shockwaveRings.push({
        x: impactX,
        y: impactY,
        radius: 15,
        maxRadius: 220,
        alpha: 0.95,
        lineWidth: 6
      });
      shockwaveRings.push({
        x: impactX,
        y: impactY,
        radius: 5,
        maxRadius: 150,
        alpha: 0.8,
        lineWidth: 3
      });

      // 2. High-velocity supersonic titanium wing shrapnel with fiery tracers
      for (let i = 0; i < 55; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 16;
        shrapnelParticles.push({
          x: impactX,
          y: impactY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 2.5,
          size: 3 + Math.random() * 8,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.6,
          life: 0,
          maxLife: 45 + Math.random() * 40,
          color: Math.random() > 0.4 ? "#F1F5F9" : "#CBD5E1",
          isBurning: Math.random() > 0.3
        });
      }

      // 3. Initial intense fuel ignition explosion fireball
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 11;
        fireParticles.push({
          x: impactX + (Math.random() - 0.5) * 25,
          y: impactY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 1.5,
          size: 20 + Math.random() * 35,
          life: 0,
          maxLife: 30 + Math.random() * 25,
          alpha: 0.95
        });
      }

      // 4. Instant initial dark blast smoke vortex
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7;
        smokeParticles.push({
          x: impactX + (Math.random() - 0.5) * 20,
          y: impactY + (Math.random() - 0.5) * 15,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 3,
          size: 25 + Math.random() * 35,
          growth: 1.2 + Math.random() * 1.4,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.08,
          life: 0,
          maxLife: 60 + Math.random() * 45,
          alpha: 0.85,
          shade: Math.random() > 0.5 ? "15, 20, 28" : "30, 36, 45"
        });
      }
    }

    // Continuous Trailing Crash Fire & Billowing Heavy Smoke
    function emitTrailingCrashSmoke(x, y, intensity = 1) {
      // Fire tongues from fractured wing roots
      for (let i = 0; i < 3 * intensity; i++) {
        fireParticles.push({
          x: x + (Math.random() - 0.5) * 22,
          y: y + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 4,
          vy: 3 + Math.random() * 6,
          size: 14 + Math.random() * 24,
          life: 0,
          maxLife: 24 + Math.random() * 18,
          alpha: 0.9
        });
      }

      // Volumetric billowing dark smoke clouds
      for (let i = 0; i < 6 * intensity; i++) {
        smokeParticles.push({
          x: x + (Math.random() - 0.5) * 26,
          y: y + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 3,
          vy: 4 + Math.random() * 7,
          size: 18 + Math.random() * 28,
          growth: 1.0 + Math.random() * 1.3,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.06,
          life: 0,
          maxLife: 65 + Math.random() * 45,
          alpha: 0.8,
          shade: Math.random() > 0.4 ? "15, 20, 30" : "35, 42, 52"
        });
      }
    }

    // 0. Atmospheric Volumetric God Rays & Golden Sun Shimmer (matching reference image)
    function drawVolumetricAtmosphereAndGodRays() {
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      const sunX = cssWidth * 0.50;
      const sunY = cssHeight * 0.11; // Horizon sun location matching reference photo

      // 1. Radiant Horizon Solar Core & Corona
      const sunPulse = 1 + Math.sin(time * 1.5) * 0.08;
      const coronaGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 260 * sunPulse);
      coronaGrad.addColorStop(0, "rgba(255, 255, 255, 0.75)");
      coronaGrad.addColorStop(0.18, "rgba(254, 240, 138, 0.55)");
      coronaGrad.addColorStop(0.45, "rgba(251, 146, 60, 0.25)");
      coronaGrad.addColorStop(0.8, "rgba(244, 114, 182, 0.08)");
      coronaGrad.addColorStop(1, "rgba(2, 6, 23, 0)");

      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 260 * sunPulse, 0, Math.PI * 2);
      ctx.fill();

      // 2. Cascading Crepuscular God Rays (Volumetric Sun Shafts)
      const numRays = 9;
      for (let i = 0; i < numRays; i++) {
        const baseAngle = Math.PI * 0.35 + (i / (numRays - 1)) * (Math.PI * 0.30); // Fan out downwards
        const rayWobble = Math.sin(time * 0.8 + i * 1.1) * 0.04;
        const currentAngle = baseAngle + rayWobble;

        const rayLength = cssHeight * 0.95;
        const rayWidth = 24 + Math.sin(time * 1.2 + i * 0.7) * 8 + i * 6;
        const rayAlpha = (0.12 + Math.sin(time * 1.4 + i * 1.3) * 0.06);

        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(currentAngle - Math.PI / 2);

        const rayGrad = ctx.createLinearGradient(0, 0, 0, rayLength);
        rayGrad.addColorStop(0, `rgba(255, 255, 255, ${rayAlpha * 1.8})`);
        rayGrad.addColorStop(0.2, `rgba(254, 240, 138, ${rayAlpha * 1.2})`);
        rayGrad.addColorStop(0.65, `rgba(253, 186, 116, ${rayAlpha * 0.6})`);
        rayGrad.addColorStop(1, "rgba(251, 146, 60, 0)");

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(-rayWidth * 0.15, 0);
        ctx.lineTo(rayWidth * 0.15, 0);
        ctx.lineTo(rayWidth * 1.8, rayLength);
        ctx.lineTo(-rayWidth * 1.8, rayLength);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 3. Shimmering Water Reflection in the Center Cloud Canyon Gap
      const glintPulse = 0.35 + Math.sin(time * 2.2) * 0.15;
      const glintX = cssWidth * 0.50;
      const glintY = cssHeight * 0.52;
      const glintGrad = ctx.createRadialGradient(glintX, glintY, 0, glintX, glintY, 140);
      glintGrad.addColorStop(0, `rgba(255, 255, 255, ${glintPulse * 0.5})`);
      glintGrad.addColorStop(0.3, `rgba(254, 240, 138, ${glintPulse * 0.3})`);
      glintGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
      ctx.fillStyle = glintGrad;
      ctx.fillRect(glintX - 50, cssHeight * 0.35, 100, cssHeight * 0.4);

      // 4. Soft Parallax Cloud Mist Drifting along the Horizon
      for (let m of cloudMistParticles) {
        if (isRunningRef.current) {
          m.x += m.vx;
          if (m.x > cssWidth + 150) m.x = -150;
          if (m.x < -150) m.x = cssWidth + 150;
        }
        const mGrad = ctx.createRadialGradient(m.x, m.y + Math.sin(time + m.x * 0.01) * 6, 0, m.x, m.y, m.radius);
        mGrad.addColorStop(0, `rgba(255, 247, 237, ${m.alpha})`);
        mGrad.addColorStop(0.5, `rgba(254, 215, 170, ${m.alpha * 0.5})`);
        mGrad.addColorStop(1, "rgba(251, 146, 60, 0)");
        ctx.fillStyle = mGrad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function drawTurbofanContrails() {
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let p of contrailParticles) {
        if (isRunningRef.current) {
          p.age += 1;
          if (p.age > p.maxAge) {
            p.age = 0;
          }
        }

        const isPlaneA = p.planeIndex === 0;
        const currentPlaneX = isPlaneA ? planeAX : planeBX;
        const currentPlaneY = isPlaneA ? planeAY : planeBY;
        const currentOpacity = isPlaneA ? planeAOpacity : planeBOpacity;
        const roll = isPlaneA ? planeARoll : planeBRoll;

        if (currentOpacity < 0.2) continue;
        if (currentPlaneX < -260 || currentPlaneX > cssWidth + 260) continue;
        if (currentPlaneY < -200 || currentPlaneY > cssHeight + 200) continue;

        const progress = p.age / p.maxAge;
        
        // Exact 2D angle vector for exhaust opposite to nose heading
        const exhaustDirX = -Math.sin(roll);
        const exhaustDirY = Math.cos(roll);
        const perpDirX = Math.cos(roll);
        const perpDirY = Math.sin(roll);

        const distance = 40 + progress * 240;
        const currentX = currentPlaneX + exhaustDirX * distance + perpDirX * (p.engineOffset * 0.5) + Math.sin(progress * 3 + time * 2) * 1.5;
        const currentY = currentPlaneY + exhaustDirY * distance + perpDirY * (p.engineOffset * 0.5);

        const currentSize = p.size * (1 + progress * 3.2);
        const currentAlpha = (1 - progress) * p.alpha * 0.55 * currentOpacity;

        const cGrad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, currentSize);
        cGrad.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha})`);
        cGrad.addColorStop(0.4, `rgba(254, 240, 138, ${currentAlpha * 0.4})`);
        cGrad.addColorStop(1, "rgba(251, 146, 60, 0)");

        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // High-Fidelity Crash Rendering Engine
    function drawRealisticCrashEffects() {
      // 0. Pre-impact Static Sparks
      for (let i = staticSparks.length - 1; i >= 0; i--) {
        const s = staticSparks[i];
        if (isRunningRef.current) {
          s.life++;
          s.x += s.vx;
          s.y += s.vy;
        }
        const alpha = (1 - s.life / s.maxLife);
        ctx.save();
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (s.life >= s.maxLife) staticSparks.splice(i, 1);
      }

      // 1. Shockwave Blast Rings
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = shockwaveRings.length - 1; i >= 0; i--) {
        const ring = shockwaveRings[i];
        if (isRunningRef.current) {
          ring.radius += 6.0;
        }
        const progress = ring.radius / ring.maxRadius;
        const alpha = (1 - progress) * ring.alpha;

        ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
        ctx.lineWidth = ring.lineWidth * (1 - progress);
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (progress >= 1) {
          shockwaveRings.splice(i, 1);
        }
      }
      ctx.restore();

      // 2. Heavy Volumetric Rolling Smoke Plumes
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        if (isRunningRef.current) {
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.size += p.growth;
          p.rotation += p.vRot;
        }

        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * p.alpha;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const sGrad = ctx.createRadialGradient(0, 0, p.size * 0.12, 0, 0, p.size);
        sGrad.addColorStop(0, `rgba(${p.shade}, ${alpha})`);
        sGrad.addColorStop(0.5, `rgba(${p.shade}, ${alpha * 0.75})`);
        sGrad.addColorStop(0.85, `rgba(${p.shade}, ${alpha * 0.3})`);
        sGrad.addColorStop(1, `rgba(${p.shade}, 0)`);
        ctx.fillStyle = sGrad;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          smokeParticles.splice(i, 1);
        }
      }

      // 3. Multi-Layer Fireball & Burning Combustion
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = fireParticles.length - 1; i >= 0; i--) {
        const p = fireParticles[i];
        if (isRunningRef.current) {
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.size *= 0.95; // Natural fireball burn dissipation
        }

        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * p.alpha;

        const fGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        fGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        fGrad.addColorStop(0.25, `rgba(254, 240, 138, ${alpha * 0.95})`);
        fGrad.addColorStop(0.55, `rgba(249, 115, 22, ${alpha * 0.8})`);
        fGrad.addColorStop(0.85, `rgba(220, 38, 38, ${alpha * 0.4})`);
        fGrad.addColorStop(1, "rgba(185, 28, 28, 0)");
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife || p.size < 2) {
          fireParticles.splice(i, 1);
        }
      }
      ctx.restore();

      // 4. Supersonic Titanium Wing Shrapnel with Burning Tracers
      for (let i = shrapnelParticles.length - 1; i >= 0; i--) {
        const p = shrapnelParticles[i];
        if (isRunningRef.current) {
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.22; // Aerodynamic drag & gravity
          p.rotation += p.vRot;
        }

        const progress = p.life / p.maxLife;
        const alpha = (1 - progress);

        // Burning hot tracer spark behind shrapnel
        if (p.isBurning && Math.random() > 0.4) {
          ctx.save();
          ctx.fillStyle = `rgba(251, 146, 60, ${alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(p.x - p.vx * 1.5, p.y - p.vy * 1.5, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();

        if (p.life >= p.maxLife) {
          shrapnelParticles.splice(i, 1);
        }
      }

      // 5. Thermal Impact Flash Bloom
      if (flashAlpha > 0.01) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, cssWidth, cssHeight);
        if (isRunningRef.current) {
          flashAlpha *= 0.84; // Rapid flash decay
        }
        ctx.restore();
      }
    }

    function drawPhotorealisticPlane(img, x, y, rollAngle, scaleFactor = 1.0, opacity = 1.0) {
      if (opacity <= 0.01) return;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rollAngle);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.globalAlpha = opacity;

      const targetWidth = Math.min(cssWidth * 0.64, 480);
      const aspect = img.naturalWidth ? img.naturalWidth / img.naturalHeight : 16 / 9;
      const targetHeight = targetWidth / aspect;

      // Realistic Soft Atmospheric Shadow on Clouds
      ctx.save();
      ctx.filter = "blur(18px)";
      ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
      ctx.beginPath();
      ctx.ellipse(0, targetHeight * 0.28, targetWidth * 0.42, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
      }

      ctx.restore();
    }

    function animate() {
      if (isRunningRef.current) {
        time += 0.02;
      }
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Camera vibration / shake upon crash impact
      if (cameraShake > 0) {
        const shakeX = (Math.random() - 0.5) * cameraShake;
        const shakeY = (Math.random() - 0.5) * cameraShake;
        ctx.save();
        ctx.translate(shakeX, shakeY);
        if (isRunningRef.current) {
          cameraShake *= 0.88;
          if (cameraShake < 0.2) cameraShake = 0;
        }
      }

      // 0. Atmospheric Volumetric God Rays & Golden Sun Shimmer (matching reference image)
      drawVolumetricAtmosphereAndGodRays();

      // 1. Turbofan Contrails
      drawTurbofanContrails();

      // 2. Flight Kinematics & Physics State Machine
      const floatYA = Math.sin(time * 1.2) * 5;
      const floatYB = Math.cos(time * 1.1) * 5;

      if (polesMatch) {
        // --- SAME POLES (REPEL): Flight 1 (Left) and Flight 2 (Right) Approach Head-On & Repel into Cross Turns ---
        if (isRunningRef.current) {
          samePolesTimer += 0.012;
        }
        crashTimer = 0;

        const centerY = cssHeight * 0.50;
        planeAScale = 1.0;
        planeBScale = 1.0;
        planeAOpacity = 1.0;
        planeBOpacity = 1.0;

        if (samePolesTimer < 1.5) {
          // Step 1: Head-on Approach along Centerline (Nose N facing Nose N)
          const progress = Math.min(1.0, samePolesTimer / 1.4);
          const ease = 1 - Math.pow(1 - progress, 2);

          const startAX = -220;
          const meetAX = cssWidth * 0.5 - 130;
          planeAX = startAX + (meetAX - startAX) * ease;
          planeAY = centerY + floatYA;
          planeARoll = Math.PI / 2; // Flight 1 Nose (N) points right

          const startBX = cssWidth + 220;
          const meetBX = cssWidth * 0.5 + 130;
          planeBX = startBX + (meetBX - startBX) * ease;
          planeBY = centerY + floatYB;
          planeBRoll = -Math.PI / 2; // Flight 2 Nose (N) points left

          if (samePolesTimer > 0.9) {
            emitPreImpactStaticArcs(planeAX + 100, centerY, planeBX - 100, centerY);
          }

        } else if (samePolesTimer >= 1.5 && samePolesTimer < 2.5) {
          // Step 2: Repel & Move Back — Strong magnetic push-back recoil
          const tBack = samePolesTimer - 1.5;
          const pBack = Math.min(1.0, tBack / 0.9);
          const easeBack = 1 - Math.pow(1 - pBack, 2); // Quick recoil, smooth stop

          const meetAX = cssWidth * 0.5 - 130;
          const pushedAX = cssWidth * 0.5 - 320; // Increased pushback from 240 to 320
          planeAX = meetAX + (pushedAX - meetAX) * easeBack;
          planeAY = centerY + floatYA;
          planeARoll = Math.PI / 2;

          const meetBX = cssWidth * 0.5 + 130;
          const pushedBX = cssWidth * 0.5 + 320; // Increased pushback from 240 to 320
          planeBX = meetBX + (pushedBX - meetBX) * easeBack;
          planeBY = centerY + floatYB;
          planeBRoll = -Math.PI / 2;

          // Repulsive sparks discharging during the backward move
          emitPreImpactStaticArcs(planeAX + 100, centerY, planeBX - 100, centerY);

        } else if (samePolesTimer >= 2.5 && samePolesTimer < 3.5) {
          // Step 3: Turn Action — Flight 1 banks left into top lane; Flight 2 banks left into bottom lane
          const tTurn = samePolesTimer - 2.5;
          const pTurn = Math.min(1.0, tTurn / 0.95);
          const easeTurn = 1 - Math.pow(1 - pTurn, 2);

          const pushedAX = cssWidth * 0.5 - 320;
          planeAX = pushedAX + easeTurn * 30;
          planeAY = centerY - easeTurn * 130;
          planeARoll = Math.PI / 2 - Math.sin(pTurn * Math.PI) * 0.5; // Smooth banking turn

          const pushedBX = cssWidth * 0.5 + 320;
          planeBX = pushedBX - easeTurn * 30;
          planeBY = centerY + easeTurn * 130;
          planeBRoll = -Math.PI / 2 - Math.sin(pTurn * Math.PI) * 0.5; // Smooth banking turn

        } else if (samePolesTimer >= 3.5 && samePolesTimer < 5.8) {
          // Step 4: Move Forward — Both aircraft accelerate forward across clear separated lanes
          const tFwd = samePolesTimer - 3.5;
          const pFwd = Math.min(1.0, tFwd / 2.2);
          const easeFwd = Math.pow(pFwd, 1.25);

          const laneAX = cssWidth * 0.5 - 290; // (pushedAX + 30) = -320 + 30 = -290
          const endAX = cssWidth + 260;
          planeAX = laneAX + (endAX - laneAX) * easeFwd;
          planeAY = centerY - 130 + floatYA;
          planeARoll = Math.PI / 2; // Leveled forward heading to the right

          const laneBX = cssWidth * 0.5 + 290; // (pushedBX - 30) = 320 - 30 = 290
          const endBX = -260;
          planeBX = laneBX + (endBX - laneBX) * easeFwd;
          planeBY = centerY + 130 + floatYB;
          planeBRoll = -Math.PI / 2; // Leveled forward heading to the left

        } else if (samePolesTimer >= 5.8) {
          if (isRunningRef.current) {
            samePolesTimer = 0;
          }
          planeAX = -220;
          planeBX = cssWidth + 220;
          planeAY = centerY;
          planeBY = centerY;
          planeARoll = Math.PI / 2;
          planeBRoll = -Math.PI / 2;
        }

      } else {
        // --- DIFFERENT POLES (ATTRACT & CRASH): Moving in a Straight Line from Left to Right ---
        samePolesTimer = 0;
        if (isRunningRef.current) {
          crashTimer += 0.011;
        }

        const centerY = cssHeight * 0.50;
        const currentTargetWidth = Math.min(cssWidth * 0.64, 480);
        const planeHalfLength = (currentTargetWidth / (16 / 9)) * 0.5; // ~135px along the fuselage
        const targetImpactAX = cssWidth * 0.74;
        const targetImpactBX = targetImpactAX - planeHalfLength * 2 + 10;
        const impactPointX = targetImpactAX - planeHalfLength;

        if (crashTimer < 1.7) {
          hasTriggeredImpact = false;

          // Horizontal in-line flight from left to right (rollAngle = Math.PI / 2 -> nose pointing right)
          planeARoll = Math.PI / 2;
          planeBRoll = Math.PI / 2;
          planeAScale = 1.0;
          planeBScale = 1.0;
          planeAOpacity = 1.0;
          planeBOpacity = 1.0;

          planeAY = centerY + floatYA;
          planeBY = centerY + floatYB;

          // Lead Plane (Airplane A): Cruising across left-to-right to the right side
          // Its Tail [S] (Blue) faces backward to the left
          const startAX = cssWidth * 0.30;
          const progressA = Math.min(1.0, crashTimer / 1.6);
          const easeA = 1 - Math.pow(1 - progressA, 2);
          planeAX = startAX + (targetImpactAX - startAX) * easeA;

          // Chaser Plane (Airplane B): Starts behind on the left (t=0.25s delay)
          // Its Nose [N] (Red) faces forward to the right towards Airplane A's Tail [S]
          // Unlike magnetic attraction accelerates Airplane B forward in line!
          const delayB = 0.25;
          const progressB = crashTimer < delayB ? 0 : Math.min(1.0, (crashTimer - delayB) / (1.6 - delayB));
          const easeB = Math.pow(progressB, 1.8);
          
          const startBX = -180;
          planeBX = startBX + (targetImpactBX - startBX) * easeB;

          // Pre-impact magnetic static sparks between Plane B's Nose (N) and Plane A's Tail (S)
          if (crashTimer > 1.3 && crashTimer >= delayB) {
            emitPreImpactStaticArcs(planeBX + planeHalfLength - 10, centerY, planeAX - planeHalfLength + 10, centerY);
          }

        } else if (crashTimer >= 1.7 && crashTimer < 5.2) {
          // Trigger Catastrophic Impact Shockwave & Explosion ONCE at t=1.7s
          if (!hasTriggeredImpact && isRunningRef.current) {
            hasTriggeredImpact = true;
            triggerCatastrophicImpact(impactPointX, centerY);
          }

          // Structural Disintegration & Asymmetric Uncontrolled Flat-Spin Dive
          const elapsedCrash = crashTimer - 1.7;

          if (isRunningRef.current) {
            // Plane A: Tail blasted, forward flat spin dive
            planeAX += 3.8 + elapsedCrash * 2.5;
            planeAY += 3.6 + elapsedCrash * 3.6;
            planeARoll += 0.13;
            planeAScale = Math.max(0.25, 1.0 - elapsedCrash * 0.18);
            if (elapsedCrash > 1.8) planeAOpacity = Math.max(0, 1.0 - (elapsedCrash - 1.8) * 1.5);

            // Plane B: Nose smashed, backward-down flat spin dive
            planeBX -= 2.6 + elapsedCrash * 1.5;
            planeBY += 4.4 + elapsedCrash * 4.0;
            planeBRoll -= 0.15;
            planeBScale = Math.max(0.25, 1.0 - elapsedCrash * 0.18);
            if (elapsedCrash > 1.8) planeBOpacity = Math.max(0, 1.0 - (elapsedCrash - 1.8) * 1.5);

            // Billowing fire & dense rolling smoke plumes pouring from fractured aircraft
            emitTrailingCrashSmoke(planeAX - 15, planeAY, 1.8);
            emitTrailingCrashSmoke(planeBX + 15, planeBY, 1.8);
          }

        } else if (crashTimer >= 5.2) {
          if (isRunningRef.current) {
            crashTimer = 0;
            hasTriggeredImpact = false;
          }
          planeAX = cssWidth * 0.30;
          planeBX = -200;
          planeAY = centerY;
          planeBY = centerY;
          planeARoll = Math.PI / 2;
          planeBRoll = Math.PI / 2;
          planeAScale = 1.0;
          planeBScale = 1.0;
          planeAOpacity = 1.0;
          planeBOpacity = 1.0;
        }
      }

      // Draw Aircraft (Both left and right aircraft use imgPlaneNS)
      drawPhotorealisticPlane(imgPlaneNS, planeAX, planeAY, planeARoll, planeAScale, planeAOpacity);
      drawPhotorealisticPlane(imgPlaneNS, planeBX, planeBY, planeBRoll, planeBScale, planeBOpacity);

      // Draw Volumetric Explosion, Smoke, Fire & Shrapnel
      drawRealisticCrashEffects();

      if (cameraShake > 0) {
        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [interactionMode, polesMatch]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: "24px" }}>
      {/* Three.js / R3F Photorealistic Animated Cloud Sea & Volumetric God Rays */}
      <MagnetActivityBackground />

      {/* Flight & Particle Simulation Layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 2,
          pointerEvents: "auto"
        }}
      />
    </div>
  );
}
