import { getHomographyMatrix } from './utils/camera.js';
import { estimateBallLocation } from './utils/conic.js';
import { drawBallProjection } from './utils/ball.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('ballProjectionCanvas3D');
  const ctx = canvas.getContext('2d');
  const xSlider = document.getElementById('ballPositionXSlider');
  const ySlider = document.getElementById('ballPositionYSlider');
  const zSlider = document.getElementById('ballPositionZSlider');
  let x = parseFloat(xSlider.value);
  let y = parseFloat(ySlider.value);
  let z = parseFloat(zSlider.value);

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
  const cameraCentered = {"f": f, "tx": 0, "ty": 0, "tz": 0, "rx": rx, "ry": ry, "rz": rz};
  const homographyCenteredMatrix = getHomographyMatrix(cameraCentered);
  const ballCircumference = 29.5 / 36.0;
  const ballRadius = ballCircumference / (2 * Math.PI);

  backgroundImage.onload = function() {
    updateVisualization();
  };
  
  // Set src AFTER onload handler to ensure handler fires
  backgroundImage.src = '/retrieving_ball_location/court_warped.png';

  xSlider.addEventListener('input', function() {
    x = parseFloat(this.value);
    document.getElementById('ballPositionXValue').textContent = x.toFixed(1);
    updateVisualization();
  });

  ySlider.addEventListener('input', function() {
    y = parseFloat(this.value);
    document.getElementById('ballPositionYValue').textContent = y.toFixed(1);
    updateVisualization();
  });

  zSlider.addEventListener('input', function() {
    z = parseFloat(this.value);
    document.getElementById('ballPositionZValue').textContent = z.toFixed(1);
    updateVisualization();
  });
  
  function updateVisualization() {
    // Clear canvas and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    // TODO: Call function to compute and draw ellipse based on distance
    let bx = parseFloat(xSlider.value);
    let by = parseFloat(ySlider.value);
    let bz = parseFloat(zSlider.value);
    let ballPosition = [bx, by, bz].map(val => parseFloat(val));
    const Q = drawBallProjection(canvas, ballPosition, ballRadius, homographyMatrix, homographyCenteredMatrix, 'rgb(224, 119, 20)', 'black');
    
    // Update estimated ball location display
    const estimatedLocation = estimateBallLocation(Q, ballRadius, tVector);
    const locationDisplay = document.getElementById('estimatedBallLocation');
    if (locationDisplay) {
      locationDisplay.textContent = `(${estimatedLocation[0].toFixed(1)}, ${estimatedLocation[1].toFixed(1)}, ${estimatedLocation[2].toFixed(1)})`;
    }
  }
});
