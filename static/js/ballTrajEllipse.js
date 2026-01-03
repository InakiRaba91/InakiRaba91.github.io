import { drawBallProjection } from './utils/ball.js';
import { computeTrajectory } from './utils/motion.js';
import { BasketballTrajHomographyMatrix, BasketballTrajHomographyCenteredMatrix, BasketballTrajHomographyBirdEyeMatrix, BasketballTrajHomographyCenteredBirdEyeMatrix, BasketballBallRadius} from './utils/constants/basketballCameras.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('ballTrajEllipseCanvas');
  const canvasBirdEye = document.getElementById('ballTrajEllipseBirdEyeCanvas');
  const ctx = canvas.getContext('2d');
  const ctxBirdEye = canvasBirdEye.getContext('2d');
  const tSlider = document.getElementById('ballTrajEllipseTSlider');
  const unit_vel = [0.99837133, 0.0570497, 0.0].map(val => parseFloat(val));
  let t = parseFloat(tSlider.value);
  const tStart = parseFloat(tSlider.min);
  const tEnd = parseFloat(tSlider.max);
  
  // Create initial state
  const pos0 = [-15, -7.5, 0].map(val => parseFloat(val));
  const vel0 = [10, 2, 15].map(val => parseFloat(val));
  const omega0 = [0, 0, 20].map(val => parseFloat(val));
  const state0 = [...pos0, ...vel0, ...omega0];
  
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
  backgroundImage.src = '/retrieving_ball_trajectory/basketball_court_warped.png';
  backgroundImageBirdEye.src = '/retrieving_ball_trajectory/basketball_court_warped_bird.png';

  tSlider.addEventListener('input', function() {
    t = parseFloat(this.value);
    document.getElementById('ballTrajEllipseTValue').textContent = t.toFixed(1);
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
      drawBallProjection(offscreenCanvas, position, BasketballBallRadius, homographyMatrix, centeredMatrix, 'rgba(199, 221, 236, 0.78)', 'rgba(199, 221, 236, 0.78)');
    }
  }

  function drawCurrentBall(canvas, homographyMatrix, centeredMatrix, force_null_z=false) {
    if (!posT) return;
    const posCurrentT = [...posT[t]];
    if (force_null_z) {
      posCurrentT[2] = 0.0;
    }
    drawBallProjection(canvas, posCurrentT, BasketballBallRadius, homographyMatrix, centeredMatrix, 'rgba(226, 130, 40, 1)', 'rgba(228, 14, 14, 1)');
  }

  function computeAndDrawTrajectory() {
    // Create dense time array
    const numDense = 1000 + 1;
    const tsDense = Array.from({length: numDense}, (_, i) => tStart + i * (tEnd - tStart) / (numDense - 1));
    const tStep = parseFloat(tSlider.step);
    const numSparse = Math.floor((tEnd - tStart) / tStep) + 1;
    const tSparse = Array.from({length: numSparse}, (_, i) => tStart + i * (tEnd - tStart) / (numSparse - 1));
    
    // Compute trajectory and store it
    posT = computeTrajectory(state0, tsDense, true, true, true, true);
    
    // Pre-render both canvases
    preRenderTrajectory(offscreenCanvas, offscreenCtx, backgroundImage, BasketballTrajHomographyMatrix, BasketballTrajHomographyCenteredMatrix, tSparse);
    preRenderTrajectory(offscreenCanvasBirdEye, offscreenCtxBirdEye, backgroundImageBirdEye, BasketballTrajHomographyBirdEyeMatrix, BasketballTrajHomographyCenteredBirdEyeMatrix, tSparse, true);
    
    // Draw the visualization
    drawVisualization();
  }
  
  function drawVisualization() {
    if (!posT) return;
    
    // Draw perspective view
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0);
    drawCurrentBall(canvas, BasketballTrajHomographyMatrix, BasketballTrajHomographyCenteredMatrix);
    
    // Draw bird-eye view
    ctxBirdEye.clearRect(0, 0, canvasBirdEye.width, canvasBirdEye.height);
    ctxBirdEye.drawImage(offscreenCanvasBirdEye, 0, 0);
    drawCurrentBall(canvasBirdEye, BasketballTrajHomographyBirdEyeMatrix, BasketballTrajHomographyCenteredBirdEyeMatrix, true);
  }
});
