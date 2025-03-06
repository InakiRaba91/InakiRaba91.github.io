import { displayCameraView } from './utils/displayCameraView.js';
import { displayFrameView } from './utils/displayFrameView.js';

document.addEventListener('DOMContentLoaded', function() {
  const focalLengthSlider = document.getElementById('focal-length-vp-slider');
  const txSlider = document.getElementById('tx-vp-slider');
  const tySlider = document.getElementById('ty-vp-slider');
  const tzSlider = document.getElementById('tz-vp-slider');
  const thetaXSlider = document.getElementById('theta-x-vp-slider');
  const thetaYSlider = document.getElementById('theta-y-vp-slider');
  const thetaZSlider = document.getElementById('theta-z-vp-slider');
  const canvasCameraBg = document.getElementById('interactive-plot-basket-court-vp');
  const canvasCamera = document.getElementById('interactive-plot-camera-view-vp');
  const canvasFrame = document.getElementById('interactive-plot-frame-view-vp');
  const ctxCameraBg = canvasCameraBg.getContext('2d');
  const ctxCamera = canvasCamera.getContext('2d');
  const ctxFrame = canvasFrame.getContext('2d');
  const M = new cv.Mat(3, 3, cv.CV_64FC1);

  const imageView = new Image();
  const imageFrame = new Image();
  imageView.src = '/camera_calibration/BasketballCourtTemplateCameraView.png'; // Replace with the path to your image file
  imageFrame.src = '/camera_calibration/BasketballCourtTemplate.png'; // Replace with the path to your image file

  let imagesLoaded = 0;
  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
      // Both images loaded, set canvas dimensions
      canvasFrame.width = imageFrame.width;
      canvasFrame.height = imageFrame.height;
      canvasCamera.width = imageView.width;
      canvasCamera.height = imageView.height;
      canvasCameraBg.width = imageView.width;
      canvasCameraBg.height = imageView.height;
      drawBg();
      drawFrame();
      updateCanvas();
    }
  }
  imageView.onload = imageLoaded;
  imageFrame.onload = imageLoaded;

  function drawBg() {
    ctxCameraBg.clearRect(0, 0, canvasCameraBg.width, canvasCameraBg.height);
    ctxCameraBg.drawImage(imageView, 0, 0, canvasCameraBg.width, canvasCameraBg.height);
  }
  
  function drawFrame() {
    ctxFrame.clearRect(0, 0, canvasFrame.width, canvasFrame.height);
    ctxFrame.drawImage(imageFrame, 0, 0, canvasFrame.width, canvasFrame.height);
  }

  function updateCanvas() {
    const f = focalLengthSlider.value;
    const tx = txSlider.value;
    const ty = tySlider.value;
    const tz = tzSlider.value;
    const thetaX = thetaXSlider.value;
    const thetaY = thetaYSlider.value;
    const thetaZ = thetaZSlider.value;
    const camera = {"f": f, "tx": tx, "ty": ty, "tz": tz, "rx": thetaX, "ry": thetaY, "rz": thetaZ};
    const fMax = focalLengthSlider.max;
    const fMin = focalLengthSlider.min;

    // Update the displayed values
    document.getElementById('focal-length-vp-value').textContent = f;
    document.getElementById('tx-vp-value').textContent = tx;
    document.getElementById('ty-vp-value').textContent = ty;
    document.getElementById('tz-vp-value').textContent = tz;
    document.getElementById('theta-x-vp-value').textContent = thetaX;
    document.getElementById('theta-y-vp-value').textContent = thetaY;
    document.getElementById('theta-z-vp-value').textContent = thetaZ;
    
    // Draw the camera view
    displayCameraView(ctxCamera, canvasCamera, camera, fMax, fMin)
    displayFrameView(imageFrame, canvasFrame, camera, true)
  }

  // Add event listeners to the sliders
  focalLengthSlider.addEventListener('input', updateCanvas);
  txSlider.addEventListener('input', updateCanvas);
  tySlider.addEventListener('input', updateCanvas);
  tzSlider.addEventListener('input', updateCanvas);
  thetaXSlider.addEventListener('input', updateCanvas);
  thetaYSlider.addEventListener('input', updateCanvas);
  thetaZSlider.addEventListener('input', updateCanvas);
});