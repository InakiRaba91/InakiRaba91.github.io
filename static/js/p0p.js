import { displayCameraView } from './utils//display/displayCameraViewExtrinsicPost.js';
import { displayFrameView } from './utils/display/displayFrameViewExtrinsicPost.js';
import { baseImageSize } from './utils/imageSize.js';
import { transform6DOFObject } from './utils/transformDOF.js';

document.addEventListener('DOMContentLoaded', function() {
  const txSlider = document.getElementById('tx-p0p-slider');
  const tySlider = document.getElementById('ty-p0p-slider');
  const tzSlider = document.getElementById('tz-p0p-slider');
  const rxSlider = document.getElementById('rx-p0p-slider');
  const rySlider = document.getElementById('ry-p0p-slider');
  const rzSlider = document.getElementById('rz-p0p-slider');
  const canvasCamera = document.getElementById('interactive-plot-p0p-camera-view');
  const canvasCameraBg = document.getElementById('interactive-plot-p0p-camera-view-bg');
  const canvasFrame = document.getElementById('interactive-plot-p0p-frame-view');
  const canvasFrameBg = document.getElementById('interactive-plot-p0p-frame-view-bg');
  const ctxCamera = canvasCamera.getContext('2d');
  const ctxCameraBg = canvasCameraBg.getContext('2d');
  const ctxFrame = canvasFrame.getContext('2d');
  const ctxFrameBg = canvasFrameBg.getContext('2d');

  // turn canvas into black background
  canvasCamera.width = baseImageSize.width;
  canvasCamera.height = baseImageSize.height;
  canvasCameraBg.width = baseImageSize.width;
  canvasCameraBg.height = baseImageSize.height;
  canvasFrame.width = baseImageSize.width;
  canvasFrame.height = baseImageSize.height;
  canvasFrameBg.width = baseImageSize.width;  
  canvasFrameBg.height = baseImageSize.height;
  ctxCameraBg.fillStyle = 'black';
  ctxCameraBg.fillRect(0, 0, canvasCameraBg.width, canvasCameraBg.height);
  ctxFrameBg.fillStyle = 'black';
  ctxFrameBg.fillRect(0, 0, canvasFrameBg.width, canvasFrame.height);
  const LengthsObj = {x: 10, y: 10, z: 10};
  const indicesPtsRef = [];

  function updateCanvas() {
    const tx = txSlider.value;
    const ty = tySlider.value;
    const tz = tzSlider.value;
    const rx = rxSlider.value;
    const ry = rySlider.value;
    const rz = rzSlider.value;
    const paramsDOF = {tx: tx, ty: ty, tz: tz, rx: rx, ry: ry, rz: rz};

    // Update the displayed values
    document.getElementById('tx-p0p-value').textContent = tx;
    document.getElementById('ty-p0p-value').textContent = ty;
    document.getElementById('tz-p0p-value').textContent = tz;
    document.getElementById('rx-p0p-value').textContent = rx;
    document.getElementById('ry-p0p-value').textContent = ry;
    document.getElementById('rz-p0p-value').textContent = rz;
    
    // Draw the camera view
    const vectorRefToPinhole = displayCameraView(ctxCamera, canvasCamera, LengthsObj, paramsDOF, transform6DOFObject, indicesPtsRef)
    displayFrameView(ctxFrame, canvasFrame, vectorRefToPinhole, LengthsObj, paramsDOF, transform6DOFObject, indicesPtsRef)
  }

  // Add event listeners to the sliders
  txSlider.addEventListener('input', updateCanvas);
  tySlider.addEventListener('input', updateCanvas);
  tzSlider.addEventListener('input', updateCanvas);
  rxSlider.addEventListener('input', updateCanvas);
  rySlider.addEventListener('input', updateCanvas);
  rzSlider.addEventListener('input', updateCanvas);
  updateCanvas();
});