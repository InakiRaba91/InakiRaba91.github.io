import { normalizeVector, substractVector, scaleVector } from './utils/vector.js';
import { getHomographyMatrix } from './utils/camera.js';
import { drawBallProjection } from './utils/ball.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('ballProjectionCanvas');
  const ctx = canvas.getContext('2d');
  const dSlider = document.getElementById('ballPositionSlider');
  let d = parseFloat(dSlider.value);

  // Background image
  const backgroundImage = new Image();

  const f = 1100;
  const tx = 0;
  const ty = -20;
  const tz = 25;
  const tVector = [tx, ty, tz].map(val => parseFloat(val));
  const rx = -142;
  const ry = 0;
  const rz = 0;
  const camera = {"f": f, "tx": tx, "ty": ty, "tz": tz, "rx": rx, "ry": ry, "rz": rz};
  const homographyMatrix = getHomographyMatrix(camera);
  const ballCircumference = 29.5 / 36.0;
  const ballRadius = ballCircumference / (2 * Math.PI);
  
  // ux is a normalized vector from T to the origin
  let u = [tx, ty, tz].map(val => parseFloat(val));
  u = normalizeVector(u);

  backgroundImage.onload = function() {
    updateVisualization();
  };
  
  // Set src AFTER onload handler to ensure handler fires
  backgroundImage.src = '/retrieving_ball_location/court_warped.png';

  dSlider.addEventListener('input', function() {
    d = parseFloat(this.value);
    document.getElementById('ballPositionValue').textContent = d.toFixed(1);
    updateVisualization();
  });

  function updateVisualization() {
    // Clear canvas and draw background
    d = parseFloat(dSlider.value);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    // TODO: Call function to compute and draw ellipse based on distance
    let ballPosition = substractVector(tVector, scaleVector(u, d));
    drawBallProjection(canvas, ballPosition, ballRadius, homographyMatrix, null, 'rgb(224, 119, 20)', 'black');
  }
});
