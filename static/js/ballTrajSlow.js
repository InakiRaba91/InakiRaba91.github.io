import { drawBallProjection } from './utils/ball.js';
import { computeTrajectory } from './utils/motion.js';
import { SoccerTrajHomographyMatrix, SoccerTrajHomographyCenteredMatrix, SoccerTrajHomographyBirdEyeMatrix, SoccerTrajHomographyCenteredBirdEyeMatrix, SoccerBallRadius} from './utils/constants/soccerCameras.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('ballTrajSlowCanvas');
  const canvasBirdEye = document.getElementById('ballTrajSlowBirdEyeCanvas');
  const ctx = canvas.getContext('2d');
  const ctxBirdEye = canvasBirdEye.getContext('2d');
  const thetaSlider = document.getElementById('ballTrajSlowAngleSlider');
  const tSlider = document.getElementById('ballTrajSlowTSlider');
  let x = -54.0;
  let y = -8.0;
  let z = 0.0;
  let vMag = 60.0;
  let vTheta = parseFloat(thetaSlider.value);
  const unit_vel = [0.99837133, 0.0570497, 0.0].map(val => parseFloat(val));
  let t = parseFloat(tSlider.value);
  const tStart = parseFloat(tSlider.min);
  const tEnd = parseFloat(tSlider.max);
  
  // Background images
  const backgroundImage = new Image();
  const backgroundImageBirdEye = new Image();
  let imagesLoaded = 0;

  // Store computed trajectory
  let posT = null;
  
  // Offscreen canvases for pre-rendered background + trajectory
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  const offscreenCtx = offscreenCanvas.getContext('2d');

  const offscreenCanvasBirdEye = document.createElement('canvas');
  offscreenCanvasBirdEye.width = canvasBirdEye.width;
  offscreenCanvasBirdEye.height = canvasBirdEye.height;
  const offscreenCtxBirdEye = offscreenCanvasBirdEye.getContext('2d');

  function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
      computeAndDrawTrajectory();
    }
  }

  backgroundImage.onload = onImageLoad;
  backgroundImageBirdEye.onload = onImageLoad;
  
  // Set src AFTER onload handler to ensure handler fires
  backgroundImage.src = '/retrieving_ball_trajectory/soccer_pitch_warped.png';
  backgroundImageBirdEye.src = '/retrieving_ball_trajectory/soccer_pitch_warped_bird.png';

  thetaSlider.addEventListener('input', function() {
    vTheta = parseFloat(this.value);
    document.getElementById('ballTrajSlowAngleValue').textContent = vTheta.toFixed(1);
    computeAndDrawTrajectory();
  });

  tSlider.addEventListener('input', function() {
    t = parseFloat(this.value);
    document.getElementById('ballTrajSlowTValue').textContent = t.toFixed(1);
    drawVisualization();
  });
  
  function preRenderTrajectory(offscreenCanvas, offscreenCtx, backgroundImage, homographyMatrix, centeredMatrix, tSparse, force_null_z=false) {
    // Pre-render background + trajectory to offscreen canvas
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.drawImage(backgroundImage, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // Draw ball at each position in trajectory on offscreen canvas
    for (const timeStep of tSparse) {
      const position = [...posT[timeStep]];
      if (force_null_z) {
        position[2] = 0.0;
      }
      drawBallProjection(offscreenCanvas, position, SoccerBallRadius, homographyMatrix, centeredMatrix, 'rgba(199, 221, 236, 0.78)', 'rgba(199, 221, 236, 0.78)');
    }
  }

  function drawCurrentBall(canvas, homographyMatrix, centeredMatrix, force_null_z=false) {
    if (!posT) return;
    const posCurrentT = [...posT[t]];
    if (force_null_z) {
      posCurrentT[2] = 0.0;
    }
    drawBallProjection(canvas, posCurrentT, SoccerBallRadius, homographyMatrix, centeredMatrix, 'rgba(20, 34, 224, 1)', 'rgb(20, 34, 224, 1)');
  }

  function computeAndDrawTrajectory() {
    // Create dense time array
    const numDense = 1000 + 1;
    const tsDense = Array.from({length: numDense}, (_, i) => tStart + i * (tEnd - tStart) / (numDense - 1));
    const tStep = parseFloat(tSlider.step);
    const numSparse = Math.floor((tEnd - tStart) / tStep) + 1;
    const tSparse = Array.from({length: numSparse}, (_, i) => tStart + i * (tEnd - tStart) / (numSparse - 1));
    
    // Create initial state
    let bx = x;
    let by = y;
    let bz = z;
    let pos0 = [bx, by, bz].map(val => parseFloat(val));
    
    let thetaRad = vTheta * Math.PI / 180.0;
    let vx = vMag * unit_vel[0] * Math.cos(thetaRad);
    let vy = vMag * unit_vel[1] * Math.cos(thetaRad);
    let vz = vMag * Math.sin(thetaRad);
    let vel0 = [vx, vy, vz].map(val => parseFloat(val));
    
    const omega0 = [0, 0, 0];
    const state0 = [...pos0, ...vel0, ...omega0];
    
    // Compute trajectory and store it
    posT = computeTrajectory(state0, tsDense, true, true, false, true);
    
    // Pre-render both canvases
    preRenderTrajectory(offscreenCanvas, offscreenCtx, backgroundImage, SoccerTrajHomographyMatrix, SoccerTrajHomographyCenteredMatrix, tSparse);
    preRenderTrajectory(offscreenCanvasBirdEye, offscreenCtxBirdEye, backgroundImageBirdEye, SoccerTrajHomographyBirdEyeMatrix, SoccerTrajHomographyCenteredBirdEyeMatrix, tSparse, true);
    
    // Draw the visualization
    drawVisualization();
  }
  
  function drawVisualization() {
    if (!posT) return;
    
    // Draw perspective view
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0);
    drawCurrentBall(canvas, SoccerTrajHomographyMatrix, SoccerTrajHomographyCenteredMatrix);
    
    // Draw bird-eye view
    ctxBirdEye.clearRect(0, 0, canvasBirdEye.width, canvasBirdEye.height);
    ctxBirdEye.drawImage(offscreenCanvasBirdEye, 0, 0);
    drawCurrentBall(canvasBirdEye, SoccerTrajHomographyBirdEyeMatrix, SoccerTrajHomographyCenteredBirdEyeMatrix, true);
  }
});
