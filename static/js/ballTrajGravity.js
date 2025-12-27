import { getHomographyMatrix } from './utils/camera.js';
import { drawBallProjection } from './utils/ball.js';
import { computeTrajectory } from './utils/motion.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('ballTrajGravityCanvas');
  const ctx = canvas.getContext('2d');
  const ySlider = document.getElementById('ballTrajGravityPosSlider');
  const vSlider = document.getElementById('ballTrajGravityVelSlider');
  const tSlider = document.getElementById('ballTrajGravityTSlider');
  let x = -54.0;
  let y = parseFloat(ySlider.value);
  let z = 0.0;
  let vMag = parseFloat(vSlider.value);
  const unit_vel = [0.8671765 , 0.04955294, 0.49552943].map(val => parseFloat(val));
  let t = parseFloat(tSlider.value);
  const tStart = parseFloat(tSlider.min);
  const tEnd = parseFloat(tSlider.max);
  
  // Background image
  const backgroundImage = new Image();

  const f = 265;
  const tx = 0;
  const ty = -28;
  const tz = 33;
  const rx = -157;
  const ry = 0;
  const rz = 0;
  const camera = {"f": f, "tx": tx, "ty": ty, "tz": tz, "rx": rx, "ry": ry, "rz": rz};
  const homographyMatrix = getHomographyMatrix(camera);
  const cameraCentered = {"f": f, "tx": 0, "ty": 0, "tz": 0, "rx": rx, "ry": ry, "rz": rz};
  const homographyCenteredMatrix = getHomographyMatrix(cameraCentered);
  const ballCircumference = 29.5 / 36.0;
  const ballRadius = ballCircumference / (2 * Math.PI);

  // Store computed trajectory
  let posT = null;
  
  // Offscreen canvas for pre-rendered background + trajectory
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  const offscreenCtx = offscreenCanvas.getContext('2d');

  backgroundImage.onload = function() {
    computeAndDrawTrajectory();
  };
  
  // Set src AFTER onload handler to ensure handler fires
  backgroundImage.src = '/retrieving_ball_trajectory/soccer_pitch_warped.png';

  ySlider.addEventListener('input', function() {
    y = parseFloat(this.value);
    document.getElementById('ballTrajGravityPosValue').textContent = y.toFixed(1);
    computeAndDrawTrajectory();
  });

  vSlider.addEventListener('input', function() {
    vMag = parseFloat(this.value);
    document.getElementById('ballTrajGravityVelValue').textContent = vMag.toFixed(1);
    computeAndDrawTrajectory();
  });

  tSlider.addEventListener('input', function() {
    t = parseFloat(this.value);
    document.getElementById('ballTrajGravityTValue').textContent = t.toFixed(1);
    drawVisualization();
  });
  
  function computeAndDrawTrajectory() {
    // Create dense time array
    const numDense = 1000 + 1;
    const tsDense = Array.from({length: numDense}, (_, i) => i * (tEnd - tStart) / (numDense - 1));
    
    // Create initial state
    let bx = x;
    let by = parseFloat(ySlider.value);
    let bz = z;
    let pos0 = [bx, by, bz].map(val => parseFloat(val));
    
    vMag = parseFloat(vSlider.value);
    let vx = vMag * unit_vel[0];
    let vy = vMag * unit_vel[1];
    let vz = vMag * unit_vel[2];
    let vel0 = [vx, vy, vz].map(val => parseFloat(val));
    
    const omega0 = [0, 0, 0];
    const state0 = [...pos0, ...vel0, ...omega0];
    
    // Compute trajectory and store it
    posT = computeTrajectory(state0, tsDense, false, false, false, false);
    console.log(posT);
    
    // Pre-render background + trajectory to offscreen canvas
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.drawImage(backgroundImage, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // Draw ball at each position in trajectory on offscreen canvas
    for (const timeStep in posT) {
      const position = posT[timeStep];
      drawBallProjection(offscreenCanvas, position, ballRadius, homographyMatrix, homographyCenteredMatrix, 'rgba(90, 183, 245, 0.78)', 'rgba(90, 183, 245, 0.78)');
    }
    
    // Draw the visualization
    drawVisualization();
  }
  
  function drawVisualization() {
    if (!posT) return;
    
    // Copy pre-rendered background + trajectory from offscreen canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0);
    
    // Draw only the current ball position with full opacity
    const posCurrentT = posT[t];
    console.log("Current t:", t, "Position:", posCurrentT);
    drawBallProjection(canvas, posCurrentT, ballRadius, homographyMatrix, homographyCenteredMatrix, 'rgba(20, 34, 224, 1)', 'rgb(20, 34, 224, 1)');
  }
});
