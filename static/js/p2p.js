import { displayCameraView } from './utils//display/displayCameraViewExtrinsicPost.js';
import { displayFrameView } from './utils/display/displayFrameViewExtrinsicPost.js';
import { baseImageSize } from './utils/imageSize.js';
import { transform2DOFObject } from './utils/transformDOF.js';

document.addEventListener('DOMContentLoaded', function() {
  const tSlider = document.getElementById('t-p2p-slider');
  const rSlider = document.getElementById('r-p2p-slider');
  const canvasCamera = document.getElementById('interactive-plot-p2p-camera-view');
  const canvasCameraBg = document.getElementById('interactive-plot-p2p-camera-view-bg');
  const canvasFrame = document.getElementById('interactive-plot-p2p-frame-view');
  const canvasFrameBg = document.getElementById('interactive-plot-p2p-frame-view-bg');
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
  const indicesPtsRef = [0, 2];

  function updateCanvas() {
    const t = tSlider.value;
    const r = rSlider.value;
    const paramsDOF = {t: t, r: r};

    // Update the displayed values
    document.getElementById('t-p2p-value').textContent = t;
    document.getElementById('r-p2p-value').textContent = r;
    
    // Draw the camera view
    const vectorRefToPinhole = displayCameraView(ctxCamera, canvasCamera, LengthsObj, paramsDOF, transform2DOFObject, indicesPtsRef)
    displayFrameView(ctxFrame, canvasFrame, vectorRefToPinhole, LengthsObj, paramsDOF, transform2DOFObject, indicesPtsRef)
  }

  // Add event listeners to the sliders
  tSlider.addEventListener('input', updateCanvas);
  rSlider.addEventListener('input', updateCanvas);

  updateCanvas();
});