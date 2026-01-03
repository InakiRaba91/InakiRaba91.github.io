import { addVector, normVector, crossProduct } from './vector.js';

export function packState(pos, vel, angVel) {
  return [...pos, ...vel, ...angVel];
}

export function unpackState(s) {
  return [s.slice(0, 3), s.slice(3, 6), s.slice(6, 9)];
}

// region
const BALL_CIRCUMFERENCE = 29.5 / 36.0;
const BALL_RADIUS = BALL_CIRCUMFERENCE / (2 * Math.PI);
const MIN_VEL = 1.5;
const COEF_RESTITUTION = 0.7;
const MU_FRICTION = 0.1;
const EPS = 1e-3;
const BALL_MASS_KGS = 0.62;
const BALL_AREA = Math.PI * BALL_RADIUS ** 2;
const AIR_TEMPERATURE_C = 20.0;
const AIR_PRESSURE_MB = 1013.25;
const R_DRY = 287.05;
const P_PA = AIR_PRESSURE_MB * 100;
const T_K = AIR_TEMPERATURE_C + 273.15;
const RHO_AIR_KG_M3 = P_PA / (R_DRY * T_K);
const RHO_AIR_KG_YARD3 = RHO_AIR_KG_M3 / (0.9144 ** 3);
const QUADRATIC_DRAG_COEFF = 0.47;
const AIR_BALL_CONST = 0.5 * RHO_AIR_KG_YARD3 * BALL_AREA;
const MAGNUS_LIFT_COEFF = 0.1;
// endregion

const GRAVITY_MAG_YARDS_SEC = 10.72;

export function getGravityAcc() {
  return [0, 0, -GRAVITY_MAG_YARDS_SEC];
}

export function getFrictionAcc(vel) {
  const vXy = [vel[0], vel[1]];
  const vNorm = normVector(vXy);
  if (vNorm === 0) {
    return [0, 0, 0];
  }
  const aFricMag = MU_FRICTION * GRAVITY_MAG_YARDS_SEC;
  const aFricXy = [-aFricMag * (vXy[0] / vNorm), -aFricMag * (vXy[1] / vNorm)];
  return [aFricXy[0], aFricXy[1], 0];
}

export function getDragAcc(vel) {
  // F = 0.5 * rho * v^2 * Cd * A
  // a = F/m
  const vNorm = normVector(vel);
  if (vNorm < EPS) {
    return [0, 0, 0];
  }
  const dragForceMag = AIR_BALL_CONST * QUADRATIC_DRAG_COEFF * (vNorm ** 2);
  const dragAccMag = dragForceMag / BALL_MASS_KGS;
  const dragAcc = vel.map(v => -dragAccMag * (v / vNorm));
  return dragAcc;
}

export function getMagnusAcc(vel, omega) {
  const crossProd = crossProduct(omega, vel);
  return crossProd.map(v => MAGNUS_LIFT_COEFF * AIR_BALL_CONST * v / BALL_MASS_KGS);
}

export function motionEq(t, s, useFriction=true, useDrag=true, useMagnus=true) {
  const [pos, vel, omega] = unpackState(s);
  
  let gravityAcc, frictionAcc;
  if (pos[2] <= BALL_RADIUS && vel[2] < EPS) {
    gravityAcc = [0, 0, 0];
    frictionAcc = [0, 0, 0];
    if (Math.abs(vel[2]) < EPS) {
      frictionAcc = getFrictionAcc(vel);
    }
  } else {
    gravityAcc = getGravityAcc();
    frictionAcc = [0, 0, 0];
  }
  
  const dragAcc = getDragAcc(vel);
  const magnusAcc = getMagnusAcc(vel, omega);
  let acc = gravityAcc;
  if (useFriction) {
    acc = addVector(acc, frictionAcc);
  }
  if (useDrag) {
    acc = addVector(acc, dragAcc);
  }
  if (useMagnus) {
    acc = addVector(acc, magnusAcc);
  }
  const angAcc = [0, 0, 0];
  return packState(vel, acc, angAcc);
}

export function computeTrajectory(s, ts, useFriction=true, useDrag=true, useMagnus=true, bounce=true) {
  const posT = {};
  let currentS = [...s];
  const deltaT = ts[1] - ts[0];
  let atRest = false;
  
  for (let i = 0; i < ts.length; i++) {
    const currentT = ts[i];
    
    // Store current position
    const [pos, vel, _] = unpackState(currentS);
    posT[currentT] = [...pos];
    
    // Check if ball is at rest
    const velMagnitude = normVector(vel);
    
    if (velMagnitude < MIN_VEL) {
      atRest = true;
    }
    
    if (atRest) {
      // Ball is at rest, keep position static
      continue;
    }
    
    // Compute derivatives using motion equation
    const ds = motionEq(currentT, currentS, useFriction, useDrag, useMagnus);
    
    // Euler integration: s_new = s + ds * dt
    const newS = currentS.map((val, idx) => val + ds[idx] * deltaT);
    
    // Check for ground collision
    let [newPos, newVel, newOmega] = unpackState(newS);
    
    if (newPos[2] <= BALL_RADIUS && newVel[2] < 0) {
      // Ball hit the ground while moving down
      if (bounce) {
        // Apply bounce: reverse z-velocity with restitution
        newVel[2] = -COEF_RESTITUTION * newVel[2];
      
        // Adjust z position to be at ground level with restitution
        newPos[2] = BALL_RADIUS + COEF_RESTITUTION * (BALL_RADIUS - newPos[2]);
      
        // Check if velocity is now below threshold
        if (Math.abs(newVel[2]) < MIN_VEL) {
          newVel[2] = 0.0;
          newPos[2] = BALL_RADIUS - EPS;
        }
      } else {
        // No bounce: stop the ball completely where it lands
        newVel = [0.0, 0.0, 0.0];
        newPos[2] = BALL_RADIUS - EPS;
        atRest = true;
      }
      
      // Update state
      currentS = packState(newPos, newVel, newOmega);
    } else {
      // Update current state
      currentS = newS;
    }
  }
  
  return posT;
}
