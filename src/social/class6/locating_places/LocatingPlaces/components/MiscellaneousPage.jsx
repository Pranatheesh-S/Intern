import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Line, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Play, ArrowLeft } from 'lucide-react';
import './CoordinatesPageBook.css';
import './CoordinatesPageDark.css';

import mercuryUrl from './mercury.jpg';
import venusUrl from './venus.jpg';
import earthUrl from './world-map.jpg';
import marsUrl from './mars.jpg';
import jupiterUrl from './jupiter.jpg';
import saturnUrl from './saturn.jpg';
import saturnRingUrl from './saturn_ring.png';
import uranusUrl from './uranus.jpg';
import neptuneUrl from './neptune.jpg';
import sunMapUrl from './sun-map.jpg';

const planetsData = [
  {
    name: 'Mercury',
    textureUrl: mercuryUrl,
    color: '#c4b09f', // Warm brownish-grey tint to distinguish from Moon
    radius: 0.8,
    distance: 4.5,
    speed: 0.83,
    description: [
      "Mercury is the closest planet to the Sun and the smallest planet in our Solar System.",
      "Because it is so close to the Sun, it experiences extreme temperature changes—very hot during the day and freezing cold at night.",
      "It has no atmosphere to trap heat, and its surface is covered in craters, much like our Moon."
    ],
    keyIdea: "Smallest and closest planet to the Sun; extreme temperatures."
  },
  {
    name: 'Venus',
    textureUrl: venusUrl,
    color: '#ffffff',
    radius: 1.1,
    distance: 6.75,
    speed: 0.32,
    tilt: 3.09, // 177 degrees (almost upside down, causes retrograde rotation)
    description: [
      "Venus is the second planet from the Sun and is similar in size to Earth.",
      "It is the hottest planet in our Solar System because of a thick, toxic atmosphere full of carbon dioxide that traps heat like a greenhouse.",
      "Venus spins in the opposite direction to most other planets, meaning the Sun rises in the west and sets in the east."
    ],
    keyIdea: "Hottest planet due to a runaway greenhouse effect; spins backwards."
  },
  {
    name: 'Earth',
    textureUrl: earthUrl,
    color: '#ffffff',
    radius: 1.2,
    distance: 9,
    speed: 0.20,
    tilt: 0.41, // 23.5 degrees (causes seasons)
    description: [
      "Earth is the third planet from the Sun and the only known planet to support life.",
      "About 71% of Earth's surface is covered by water, which is why it is often called the Blue Planet.",
      "Our atmosphere protects us from harmful radiation and helps regulate the temperature so we can survive."
    ],
    keyIdea: "The only planet known to have life and liquid water on its surface."
  },
  {
    name: 'Mars',
    textureUrl: marsUrl,
    color: '#ffffff',
    radius: 0.9,
    distance: 11.25,
    speed: 0.11,
    tilt: 0.44, // 25.2 degrees
    description: [
      "Mars is the fourth planet from the Sun, often called the Red Planet because iron oxide (rust) on its surface gives it a reddish appearance.",
      "It has the largest volcano in the Solar System, Olympus Mons, and a massive canyon called Valles Marineris.",
      "Scientists have found evidence that liquid water once flowed on Mars, making it a key focus for the search for past life."
    ],
    keyIdea: "The Red Planet; home to the largest volcano in the Solar System."
  },
  {
    name: 'Jupiter',
    textureUrl: jupiterUrl,
    color: '#ffffff',
    radius: 2.2,
    distance: 15,
    speed: 0.02,
    tilt: 0.05, // 3.1 degrees
    description: [
      "Jupiter is the fifth planet from the Sun and the largest planet in our Solar System—more than twice as massive as all the other planets combined.",
      "It is a gas giant with no solid surface, famous for its Great Red Spot, a giant storm that has been raging for hundreds of years.",
      "Jupiter has at least 95 moons, including Ganymede, which is larger than the planet Mercury."
    ],
    keyIdea: "Largest planet; a gas giant with a massive storm called the Great Red Spot."
  },
  {
    name: 'Saturn',
    textureUrl: saturnUrl,
    color: '#ffffff',
    radius: 1.9,
    distance: 24,
    speed: 0.007,
    tilt: 0.46, // 26.7 degrees
    description: [
      "Saturn is the sixth planet from the Sun and the second-largest planet. It is most famous for its spectacular ring system.",
      "The rings are made mostly of chunks of ice and rock, ranging in size from tiny dust grains to giant boulders.",
      "Like Jupiter, Saturn is a gas giant. It is also the least dense planet—if you had a bathtub big enough, Saturn would float!"
    ],
    keyIdea: "Famous for its beautiful, complex ring system made of ice and rock."
  },
  {
    name: 'Uranus',
    textureUrl: uranusUrl,
    color: '#d4f2f7', // Pale cyan tint to give it the authentic featureless ice giant look
    radius: 1.5,
    distance: 32,
    speed: 0.002,
    tilt: 1.71, // 97.77 degrees in radians (rotates on its side!)
    hasRings: true, // Uranus has faint, dark rings
    ringInner: 2.0,
    ringOuter: 2.2,
    ringColor: '#8a949e',
    ringOpacity: 0.4,
    description: [
      "Uranus is the seventh planet from the Sun. It is an ice giant, meaning it contains a lot of water, ammonia, and methane.",
      "The methane in its atmosphere gives Uranus its distinctive pale blue color.",
      "Uranus is unique because it rotates on its side, likely due to a massive collision with an Earth-sized object long ago."
    ],
    keyIdea: "An ice giant that rotates completely on its side."
  },
  {
    name: 'Neptune',
    textureUrl: neptuneUrl,
    color: '#ffffff',
    radius: 1.4,
    distance: 38,
    speed: 0.001,
    tilt: 0.49, // 28.3 degrees
    description: [
      "Neptune is the eighth and farthest known planet from the Sun. It is also an ice giant, similar to Uranus.",
      "It has the strongest winds in the Solar System, which can reach speeds of over 2,000 km/h (1,200 mph).",
      "Because it is so far away, it takes Neptune 165 Earth years to complete one single orbit around the Sun."
    ],
    keyIdea: "Farthest planet from the Sun; has incredibly strong, freezing winds."
  }
];

const SaturnRingsSmall = ({ radius }) => {
  const ringTexture = useTexture(saturnRingUrl);
  const geomRef = useRef();

  React.useLayoutEffect(() => {
    if (geomRef.current) {
      const pos = geomRef.current.attributes.position;
      const uv = geomRef.current.attributes.uv;
      const inner = radius * 0.45;
      const outer = radius * 0.9;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const r = Math.sqrt(x * x + y * y);
        const u = (r - inner) / (outer - inner);
        // Sometimes the texture is mapped vertically. If it looks wrong, we use v=u and u=0.5
        // Or if it's horizontal, u=u and v=0.5. Usually they are horizontal strips.
        // Actually, many solar system scope ring textures are vertical strips. Let's just set both u and v to the normalized radius so it works either way!
        uv.setXY(i, u, u);
      }
      uv.needsUpdate = true;
    }
  }, [radius]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry ref={geomRef} args={[radius * 0.45, radius * 0.9, 64]} />
      <meshStandardMaterial map={ringTexture} side={THREE.DoubleSide} transparent opacity={0.9} />
    </mesh>
  );
};

const OrbitingPlanet = ({ planet }) => {
  const groupRef = useRef();
  const planetSpinRef = useRef();
  const [angle] = useState(() => Math.random() * Math.PI * 2);
  const texture = useTexture(planet.textureUrl);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * planet.speed;
    }
    if (planetSpinRef.current) {
      planetSpinRef.current.rotation.y += delta * 0.5; // Spin on its own axis
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.distance, planet.distance + 0.04, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      
      <group rotation={[0, angle, 0]}>
        <group position={[planet.distance, 0, 0]}>
          <group scale={[2.5, 2.5, 2.5]}>
            <group rotation={[0, 0, planet.tilt || 0]}>
              <Sphere ref={planetSpinRef} args={[planet.radius * 0.3, 32, 32]}>
                <meshStandardMaterial map={texture} color={planet.color} roughness={0.7} />
              </Sphere>
              {planet.name === 'Saturn' && <SaturnRingsSmall radius={planet.radius} />}
              {planet.hasRings && planet.name !== 'Saturn' && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[planet.radius * 0.3 * (planet.ringInner / 1.5), planet.radius * 0.3 * (planet.ringOuter / 1.5), 64]} />
                  <meshStandardMaterial color={planet.ringColor} side={THREE.DoubleSide} transparent opacity={planet.ringOpacity} />
                </mesh>
              )}
            </group>
            <Html position={[0, -planet.radius * 0.45, 0]} center>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 'bold', textShadow: '0 1px 2px #000' }}>{planet.name}</div>
            </Html>
          </group>
        </group>
      </group>
    </group>
  );
};

const TheSun = () => {
  const sunMap = useTexture(sunMapUrl);
  return (
    <group>
      <Sphere args={[3, 32, 32]} rotation={[0, -Math.PI / 2, 0]}>
        <meshBasicMaterial map={sunMap} color="#fef08a" />
      </Sphere>
      {/* Simple Sun Glow */}
      <pointLight position={[0, 0, 0]} intensity={500} color="#fef08a" distance={100} decay={2} />
      <mesh>
        <sphereGeometry args={[3.3, 32, 32]} />
        <meshBasicMaterial color="#fef08a" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
      <Html position={[0, -3.5, 0]} center>
        <div style={{ color: '#fef08a', fontSize: '12px', fontWeight: 'bold' }}>SUN</div>
      </Html>
    </group>
  );
};

const AsteroidBelt = () => {
  const meshRef = useRef();
  const count = 3000;
  
  React.useLayoutEffect(() => {
    if (meshRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        const radius = 12.1 + Math.random() * 1.1;
        const angle = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * (Math.random() * 2.0);

        dummy.position.set(
          radius * Math.cos(angle),
          y,
          radius * Math.sin(angle)
        );

        dummy.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        dummy.scale.set(
          0.02 + Math.random() * 0.06,
          0.02 + Math.random() * 0.04,
          0.02 + Math.random() * 0.08
        );

        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05; 
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#737373" roughness={1.0} metalness={0.1} />
      </instancedMesh>
      <Html position={[12.65, 1.5, 0]} center>
        <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 'bold', textShadow: '0 1px 2px #000', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '1px' }}>Asteroid Belt</div>
      </Html>
    </group>
  );
};

const SolarSystem3D = () => {
  return (
    <Canvas camera={{ position: [0, 12, 55], fov: 45 }}>
      <React.Suspense fallback={<Html center><div style={{color:'white'}}>Loading Universe...</div></Html>}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.4} />
        
        {/* The Sun */}
        <TheSun />

        {/* Asteroid Belt */}
        <AsteroidBelt />

        {planetsData.map((planet) => (
          <OrbitingPlanet key={planet.name} planet={planet} />
        ))}

        <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2} />
      </React.Suspense>
    </Canvas>
  );
};

const SaturnRingsLarge = () => {
  const ringTexture = useTexture(saturnRingUrl);
  const geomRef = useRef();

  React.useLayoutEffect(() => {
    if (geomRef.current) {
      const pos = geomRef.current.attributes.position;
      const uv = geomRef.current.attributes.uv;
      const inner = 1.8;
      const outer = 3.2;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const r = Math.sqrt(x * x + y * y);
        const u = (r - inner) / (outer - inner);
        // Setting both U and V to the normalized radius handles both horizontal and vertical 1D strips!
        uv.setXY(i, u, u);
      }
      uv.needsUpdate = true;
    }
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
      <ringGeometry ref={geomRef} args={[1.8, 3.2, 64]} />
      <meshStandardMaterial map={ringTexture} side={THREE.DoubleSide} transparent opacity={0.9} />
    </mesh>
  );
};

const PlanetContent = ({ planet }) => {
  const planetSpinRef = useRef();
  const texture = useTexture(planet.textureUrl);

  useFrame((state, delta) => {
    if (planetSpinRef.current) {
      planetSpinRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group rotation={[0, 0, planet.tilt || 0]}>
      <Sphere ref={planetSpinRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial map={texture} color={planet.color} roughness={0.7} />
      </Sphere>
      
      {planet.name === 'Saturn' && <SaturnRingsLarge />}
      {planet.hasRings && planet.name !== 'Saturn' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.ringInner, planet.ringOuter, 64]} />
          <meshStandardMaterial color={planet.ringColor} side={THREE.DoubleSide} transparent opacity={planet.ringOpacity} />
        </mesh>
      )}
    </group>
  );
};

const PlanetGlobe3D = ({ planet }) => {
  const controlsRef = useRef();

  React.useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [planet.name]);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <React.Suspense fallback={<Html center><div style={{color:'white'}}>Loading {planet.name}...</div></Html>}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#ffffff" />

        <PlanetContent planet={planet} />

        <OrbitControls ref={controlsRef} enableZoom={true} enablePan={false} />
      </React.Suspense>
    </Canvas>
  );
};

export default function MiscellaneousPage({ onBackToDashboard, onBack }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const handleNext = () => {
    if (currentStepIdx < planetsData.length) {
      setCurrentStepIdx(c => c + 1);
    } else {
      if (onBackToDashboard) onBackToDashboard();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(c => c - 1);
    } else {
      if (onBack) onBack();
    }
  };

  if (currentStepIdx === 0) {
    return (
      <div className="dark-coords-page" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 20, left: 30, zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>The Solar System</h2>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>Our neighborhood in space. The Sun and 8 planets.</div>
        </div>
        
        <div style={{ position: 'absolute', bottom: 30, right: 30, zIndex: 10 }}>
           <button className="dark-nav-btn next" onClick={handleNext} style={{ padding: '12px 24px' }}>
              Explore Planets <Play size={16} fill="currentColor" style={{ marginLeft: '4px' }} />
           </button>
        </div>

        <button 
           className="dark-nav-btn" 
           onClick={handlePrev}
           style={{ position: 'absolute', bottom: 30, left: 30, background: 'rgba(255,255,255,0.1)', zIndex: 10 }}
        >
           <ArrowLeft size={16} /> Back
        </button>

        <div style={{ position: 'absolute', inset: 0 }}>
           <SolarSystem3D />
        </div>
      </div>
    );
  }

  const activePlanet = planetsData[currentStepIdx - 1];

  return (
    <div className="dark-coords-page">
      <div className="dark-coords-main-content">
        <div className="dark-coords-left">
          <div className="dark-top-title">Planet Explorer — {activePlanet.name}</div>
          
          <div className="dark-globe-container" style={{ background: '#000000', borderRadius: '16px', overflow: 'hidden' }}>
             <PlanetGlobe3D planet={activePlanet} />
          </div>

          <div className="dark-bottom-nav">
            <button className="dark-nav-btn" onClick={handlePrev}>
              <ArrowLeft size={16} /> Back
            </button>
            <div className="dark-nav-dots">
              {planetsData.map((_, i) => (
                <div key={i} className={`dark-nav-dot ${i === currentStepIdx - 1 ? 'active' : ''}`} />
              ))}
            </div>
            <button className="dark-nav-btn next" onClick={handleNext}>
              {currentStepIdx === planetsData.length ? 'Finish' : 'Next'} <Play size={16} fill="currentColor" style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>

        <div className="dark-coords-right">
          <div className="dark-step-eyebrow">PLANET {currentStepIdx} OF 8</div>
          <h2 className="dark-step-title">{activePlanet.name}</h2>
          
          {activePlanet.description.map((p, idx) => (
            <div key={idx} className="dark-step-text" style={{ fontSize: '18px', lineHeight: '1.7', marginBottom: '20px' }}>{p}</div>
          ))}

          {activePlanet.keyIdea && (
            <div className="dark-key-idea-box" style={{ marginTop: '30px' }}>
              <div className="dark-key-idea-title">KEY IDEA</div>
              <div className="dark-key-idea-text">{activePlanet.keyIdea}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
