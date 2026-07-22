/**
 * Force Explorer Physics Engine
 * Simple 1D/2D physics simulation for React
 */

// Calculate 1D physics state for a given frame delta (in seconds)
export const update1DPhysics = ({ position, velocity, mass, appliedForce, frictionCoef, dt = 0.016 }) => {
  // Gravity constant
  const g = 9.81;
  
  // Normal force (assuming flat surface)
  const normalForce = mass * g;
  
  // Friction force opposes velocity (kinetic) or applied force (static)
  let frictionForce = 0;
  
  if (Math.abs(velocity) > 0.1) {
    // Kinetic friction
    frictionForce = frictionCoef * normalForce * Math.sign(velocity);
  } else if (Math.abs(appliedForce) > 0) {
    // Static friction check (simplified)
    const maxStaticFriction = frictionCoef * normalForce * 1.5; // Static is higher than kinetic
    if (Math.abs(appliedForce) <= maxStaticFriction) {
      frictionForce = appliedForce; // Cancels out exactly
    } else {
      frictionForce = maxStaticFriction * Math.sign(appliedForce);
    }
  }

  // Net force
  const netForce = appliedForce - frictionForce;

  // Acceleration (F = ma => a = F/m)
  const acceleration = netForce / mass;

  // Update velocity (v = v0 + at)
  let newVelocity = velocity + acceleration * dt;

  // If velocity is very small and no force is applied, bring it to a complete stop
  if (Math.abs(newVelocity) < 0.5 && Math.abs(appliedForce) === 0) {
    newVelocity = 0;
  }

  // Update position (p = p0 + vt)
  // We scale it so it looks good on screen (1 meter = 100 pixels, roughly)
  const pxPerMeter = 10; 
  const newPosition = position + newVelocity * dt * pxPerMeter;

  return {
    position: newPosition,
    velocity: newVelocity,
    acceleration,
    netForce,
    frictionForce
  };
};
