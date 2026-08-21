import React, { useEffect, useRef } from "react";

export default function CinematicSkyFlightCanvas({ 
  interactionMode = "same", 
  isAutoFastRace = false,
  polesMatch = true 
}) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  // Synchronize video playback rate with nitro mode
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = isAutoFastRace ? 2.2 : 1.0;
    }
  }, [isAutoFastRace]);

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

    // Load High-Resolution Photorealistic Airliner Aircraft Sprites
    const imgPlaneNS = new Image();
    imgPlaneNS.src = "/MagnetInteraction/real_airliner_north_south.png";

    const imgPlaneSN = new Image();
    imgPlaneSN.src = "/MagnetInteraction/real_airliner_south_north.png";

    // Realistic Turbofan Jet Contrail Particles
    const contrailParticles = [];
    for (let i = 0; i < 140; i++) {
      contrailParticles.push({
        planeIndex: i % 2,
        engineOffset: (i % 4 < 2) ? -68 : 68,
        age: Math.random() * 80,
        maxAge: 80,
        size: 5 + Math.random() * 10,
        alpha: 0.55
      });
    }

    // Realistic Multi-Layer Crash Physics Particle Systems
    const fireParticles = [];
    const smokeParticles = [];
    const shrapnelParticles = [];
    const shockwaveRings = [];

    // Aircraft physical flight coordinates
    let planeAX = cssWidth * 0.5 - 230;
    let planeAY = cssHeight * 0.54;
    let planeARoll = -0.14;
    let planeAScale = 1.0;
    let planeAOpacity = 1.0;

    let planeBX = cssWidth * 0.5 + 230;
    let planeBY = cssHeight * 0.54;
    let planeBRoll = 0.14;
    let planeBScale = 1.0;
    let planeBOpacity = 1.0;

    // Crash timeline sequencer
    let crashTimer = 0;
    let cameraShake = 0;
    let time = 0;

    // Trigger Initial Catastrophic Impact
    function triggerCatastrophicImpact(impactX, impactY) {
      cameraShake = 16;

      // 1. Shockwave blast ring
      shockwaveRings.push({
        x: impactX,
        y: impactY,
        radius: 10,
        maxRadius: 180,
        alpha: 0.95
      });

      // 2. High-velocity titanium/aluminum shrapnel
      for (let i = 0; i < 35; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 12;
        shrapnelParticles.push({
          x: impactX,
          y: impactY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 3,
          size: 2 + Math.random() * 6,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.4,
          life: 0,
          maxLife: 40 + Math.random() * 35,
          color: Math.random() > 0.5 ? "#E2E8F0" : "#CBD5E1"
        });
      }

      // 3. Initial intense ignition fireball burst
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 8;
        fireParticles.push({
          x: impactX + (Math.random() - 0.5) * 20,
          y: impactY + (Math.random() - 0.5) * 15,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 2,
          size: 15 + Math.random() * 25,
          life: 0,
          maxLife: 25 + Math.random() * 20,
          alpha: 0.95
        });
      }
    }

    // Continuous Trailing Crash Fire & Heavy Smoke Emitters
    function emitTrailingCrashSmoke(x, y, intensity = 1) {
      for (let i = 0; i < 2 * intensity; i++) {
        fireParticles.push({
          x: x + (Math.random() - 0.5) * 18,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 3,
          vy: 2 + Math.random() * 5,
          size: 10 + Math.random() * 18,
          life: 0,
          maxLife: 20 + Math.random() * 15,
          alpha: 0.9
        });
      }

      for (let i = 0; i < 4 * intensity; i++) {
        smokeParticles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2.5,
          vy: 3 + Math.random() * 6,
          size: 14 + Math.random() * 22,
          growth: 0.8 + Math.random() * 0.9,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.05,
          life: 0,
          maxLife: 55 + Math.random() * 40,
          alpha: 0.75,
          shade: Math.random() > 0.4 ? "20, 25, 35" : "40, 48, 60"
        });
      }
    }

    function drawTurbofanContrails() {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const speedMult = isAutoFastRace ? 2.5 : 1.0;

      for (let p of contrailParticles) {
        p.age += 1 * speedMult;
        if (p.age > p.maxAge) {
          p.age = 0;
        }

        const currentPlaneX = p.planeIndex === 0 ? planeAX : planeBX;
        const currentPlaneY = p.planeIndex === 0 ? planeAY : planeBY;
        const currentOpacity = p.planeIndex === 0 ? planeAOpacity : planeBOpacity;

        if (currentOpacity < 0.2) continue;

        const progress = p.age / p.maxAge;
        const currentY = currentPlaneY + 40 + progress * 260;
        const currentX = currentPlaneX + p.engineOffset + Math.sin(progress * 3 + time * 2) * 1.5;
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

    // Render Realistic Volumetric Explosion & Smoke Simulation
    function drawRealisticCrashEffects() {
      // 1. Blast Shockwave Rings
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = shockwaveRings.length - 1; i >= 0; i--) {
        const ring = shockwaveRings[i];
        ring.radius += 5.5;
        const progress = ring.radius / ring.maxRadius;
        const alpha = (1 - progress) * ring.alpha;

        ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
        ctx.lineWidth = 4 * (1 - progress);
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (progress >= 1) {
          shockwaveRings.splice(i, 1);
        }
      }
      ctx.restore();

      // 2. Heavy Billowing Smoke Plumes
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.size += p.growth;
        p.rotation += p.vRot;

        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * p.alpha;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const sGrad = ctx.createRadialGradient(0, 0, p.size * 0.15, 0, 0, p.size);
        sGrad.addColorStop(0, `rgba(${p.shade}, ${alpha})`);
        sGrad.addColorStop(0.6, `rgba(${p.shade}, ${alpha * 0.7})`);
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

      // 3. Volumetric Fireball / Combustion Wisps
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = fireParticles.length - 1; i >= 0; i--) {
        const p = fireParticles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.96;

        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * p.alpha;

        const fGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        fGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        fGrad.addColorStop(0.3, `rgba(254, 240, 138, ${alpha * 0.9})`);
        fGrad.addColorStop(0.6, `rgba(249, 115, 22, ${alpha * 0.75})`);
        fGrad.addColorStop(1, "rgba(220, 38, 38, 0)");
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife || p.size < 2) {
          fireParticles.splice(i, 1);
        }
      }
      ctx.restore();

      // 4. High-Velocity Metallic Shrapnel & Debris
      for (let i = shrapnelParticles.length - 1; i >= 0; i--) {
        const p = shrapnelParticles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.rotation += p.vRot;

        const progress = p.life / p.maxLife;
        const alpha = (1 - progress);

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
    }

    function drawPhotorealisticPlane(img, x, y, rollAngle, scaleFactor = 1.0, opacity = 1.0) {
      if (opacity <= 0.01) return;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rollAngle);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.globalAlpha = opacity;

      const targetWidth = Math.min(cssWidth * 0.45, 360);
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
      time += 0.02;
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Camera vibration / shake upon crash impact
      if (cameraShake > 0) {
        const shakeX = (Math.random() - 0.5) * cameraShake;
        const shakeY = (Math.random() - 0.5) * cameraShake;
        ctx.save();
        ctx.translate(shakeX, shakeY);
        cameraShake *= 0.91;
        if (cameraShake < 0.2) cameraShake = 0;
      }

      // 1. Turbofan Contrails
      drawTurbofanContrails();

      // 2. Flight Kinematics & Physics State Machine
      const floatYA = Math.sin(time * 1.2) * 5;
      const floatYB = Math.cos(time * 1.1) * 5;

      if (polesMatch) {
        // --- SAME POLES (REPEL): Natural Formation Separation ---
        crashTimer = 0;
        planeAScale = 1.0;
        planeBScale = 1.0;
        planeAOpacity = 1.0;
        planeBOpacity = 1.0;

        const targetAX = cssWidth * 0.5 - 235;
        const targetBX = cssWidth * 0.5 + 235;
        const targetRollA = -0.16; // Smooth outward banking roll left
        const targetRollB = 0.16;  // Smooth outward banking roll right

        const smoothFactor = 0.075;
        planeAX += (targetAX - planeAX) * smoothFactor;
        planeBX += (targetBX - planeBX) * smoothFactor;
        planeARoll += (targetRollA - planeARoll) * smoothFactor;
        planeBRoll += (targetRollB - planeBRoll) * smoothFactor;

        planeAY = cssHeight * 0.54 + floatYA;
        planeBY = cssHeight * 0.54 + floatYB;

      } else {
        // --- DIFFERENT POLES (ATTRACT & REALISTIC CRASH SEQUENCE) ---
        crashTimer += 0.02;

        if (crashTimer < 1.0) {
          // Phase 1: Rapid Inward Magnetic Convergence (0s - 1.0s)
          const targetAX = cssWidth * 0.5 - 75;
          const targetBX = cssWidth * 0.5 + 75;
          const targetRollA = 0.16;  // Steep inward bank
          const targetRollB = -0.16; // Steep inward bank

          planeAX += (targetAX - planeAX) * 0.12;
          planeBX += (targetBX - planeBX) * 0.12;
          planeARoll += (targetRollA - planeARoll) * 0.12;
          planeBRoll += (targetRollB - planeBRoll) * 0.12;
          planeAY = cssHeight * 0.54 + floatYA;
          planeBY = cssHeight * 0.54 + floatYB;

        } else if (crashTimer >= 1.0 && crashTimer < 1.06) {
          // Phase 2: Instant of Catastrophic High-Speed Wing Collision (~1.0s)
          const impactPointX = cssWidth * 0.5;
          const impactPointY = (planeAY + planeBY) * 0.5;
          triggerCatastrophicImpact(impactPointX, impactPointY);

        } else if (crashTimer >= 1.06 && crashTimer < 4.2) {
          // Phase 3: Structural Disintegration & Uncontrolled Aerodynamic Spiral (1.06s - 4.2s)
          const elapsedCrash = crashTimer - 1.06;

          // Aircraft A: Wing snapped, flat spins out to the left and dives into clouds
          planeAX -= 2.2;
          planeAY += 3.2 + elapsedCrash * 2.8;
          planeARoll += 0.08;
          planeAScale = Math.max(0.4, 1.0 - elapsedCrash * 0.18);
          if (elapsedCrash > 2.2) planeAOpacity = Math.max(0, 1.0 - (elapsedCrash - 2.2) * 1.2);

          // Aircraft B: Fuel tank breach, rolls inverted to the right and dives
          planeBX += 2.2;
          planeBY += 3.5 + elapsedCrash * 3.0;
          planeBRoll -= 0.09;
          planeBScale = Math.max(0.4, 1.0 - elapsedCrash * 0.18);
          if (elapsedCrash > 2.2) planeBOpacity = Math.max(0, 1.0 - (elapsedCrash - 2.2) * 1.2);

          // Emit intense continuous trailing smoke plumes and engine fire from fractured wings
          emitTrailingCrashSmoke(planeAX + 20, planeAY, 1.2);
          emitTrailingCrashSmoke(planeBX - 20, planeBY, 1.2);

        } else if (crashTimer >= 4.2) {
          // Phase 4: Smooth reset / re-spawn for seamless interactive observation
          crashTimer = 0;
          planeAX = cssWidth * 0.5 - 260;
          planeBX = cssWidth * 0.5 + 260;
          planeAY = cssHeight * 0.54;
          planeBY = cssHeight * 0.54;
          planeARoll = -0.14;
          planeBRoll = 0.14;
          planeAScale = 1.0;
          planeBScale = 1.0;
          planeAOpacity = 1.0;
          planeBOpacity = 1.0;
        }
      }

      // Draw Aircraft
      drawPhotorealisticPlane(imgPlaneNS, planeAX, planeAY, planeARoll, planeAScale, planeAOpacity);

      const planeBImg = interactionMode === "same" ? imgPlaneSN : imgPlaneNS;
      drawPhotorealisticPlane(planeBImg, planeBX, planeBY, planeBRoll, planeBScale, planeBOpacity);

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
  }, [interactionMode, isAutoFastRace, polesMatch]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: "24px" }}>
      {/* Photorealistic Loop Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        src="/PixVerse_V6_Image_Text_540P_Create_a_smooth_re.mp4"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1
        }}
      />

      {/* Flight & Particle Simulation Layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          zIndex: 2
        }}
      />

      {/* Cinematic Vignette Overlay */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 35%, transparent 50%, rgba(15, 23, 42, 0.35) 85%, rgba(2, 6, 23, 0.6) 100%)",
          zIndex: 3
        }}
      />
    </div>
  );
}
