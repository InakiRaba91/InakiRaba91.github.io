import Spline from './utils/cubicSpline.js';
import { drawCurve } from './utils/polynomialCurve.js';
import { homographiesBrighton, pitchDimsBrighton } from './utils/brightonGameInfo.js';
import { backProjectPt, projectPt } from './utils/homography.js';

document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('interactive-video-cubic');
  const videoCamera = document.getElementById('interactive-video-camera-cubic');
  const videos = [video, videoCamera]
  let currentVideo = video;
  const canvas = document.getElementById('interactive-plot-video-cubic');
  const pitchCanvas = document.getElementById('interactive-plot-image-cubic');
  const pointsCanvas = document.getElementById('interactive-plot-points-cubic');
  const refPtCanvas = document.getElementById('interactive-plot-ref-cubic');
  const ctx = canvas.getContext('2d');
  const pitchCtx = pitchCanvas.getContext('2d');
  const pointsCtx = pointsCanvas.getContext('2d');
  const refPtCtx = refPtCanvas.getContext('2d');
  const playPauseButton = document.getElementById('play-pause-button');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const cameraButton = document.getElementById('camera-button');
  const cameraIcon = document.getElementById('camera-icon');
  let cameraOn = false;
  const removeButton = document.getElementById('remove-traj-button');
  const videoSource = document.getElementById('video-source');
  const timeSlider = document.getElementById('time-slider');
  const timedClickedPtsPitch = new Map();
  let xSplinePitch = null;
  let ySplinePitch = null;
  const framerate = 30;
  const refreshFrequency = 6;
  let isVideoUpdatedProgrammatically = false;
  let isTimeUpdatedProgrammatically = false;
  const colorBase = 'yellow';
  const colorLabelled = 'red';
  const colorTraj = 'blue';
  const sizeBasePitch = 2;
  const sizeBaseImg = 4;
  const sizeLabelled = 3;
  const videoCanvasSize = {}
  const pitchCanvasSize = {}
  const origFrameSize = { height: 720, width: 1280 };
  let prevPitchCanvasSize = { width: 313, height: 176 };
  let currentPitchCanvasSize = { width: 313, height: 176 };
  const videoDuration = 10;
  const [sliderTimes, homographySplines] = prepareData();
  setInitGrossTrajectory();


  function prepareData() {
    timeSlider.max = videoDuration;
    timeSlider.step = refreshFrequency / framerate;
    const num_values = Math.floor(timeSlider.max / timeSlider.step + 1);
    let sliderTimes = Array.from({ length: num_values }, (_, i) => i * timeSlider.step);
    let homographySplines = Array.from({ length: 9 }, () => []);
    let h = Array.from({ length: 9 }, () => []);
    for (let i = 0; i < sliderTimes.length; i++) {
      const homography = homographiesBrighton[i * refreshFrequency];
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          h[j*3+k].push(homography[j][k]);
        }
      }
    }
    for (let i = 0; i < 9; i++) {
      homographySplines[i] = new Spline(sliderTimes, h[i]);
    }
    return [sliderTimes, homographySplines];
  }

  function setInitGrossTrajectory() {
    timedClickedPtsPitch.set(0, {x: 92.05154532953425, y: 75.9672121803067});
    timedClickedPtsPitch.set(1.6, {x: 84.47096441948956, y: 61.526724071085305});
    timedClickedPtsPitch.set(3.6, {x: 76.00299262679475, y: 54.531370061412304});
    timedClickedPtsPitch.set(5.8, {x: 70.16706658552833, y: 60.91546674462651});
    timedClickedPtsPitch.set(7.4, {x: 62.717281499218394, y: 69.75860995192416});
    timedClickedPtsPitch.set(10, {x: 56.68113201047579, y: 57.050018584387225});
  }
  

  function drawInitGrossTrajectory() {
    const pt0PitchCanvas = timedClickedPtsPitch.get(0);
    const pt0ImgCanvas = projectPt(pt0PitchCanvas, homographiesBrighton[0], pitchDimsBrighton, videoCanvasSize, pitchCanvasSize, origFrameSize); 
    drawPoint(ctx, canvas, pt0ImgCanvas.x, pt0ImgCanvas.y, colorBase, sizeBaseImg);
    drawPoint(refPtCtx, refPtCanvas, pt0PitchCanvas.x, pt0PitchCanvas.y, colorBase, sizeBasePitch);
    drawPitchInfo();
  }

  function switchVideo() {
    isVideoUpdatedProgrammatically = true;
    const currentTime = currentVideo.currentTime;
    if (currentVideo === video) {
      videoCamera.currentTime = currentTime;
      video.style.display = 'none';
      videoCamera.style.display = 'block';
      currentVideo = videoCamera;
    } else {
      video.currentTime = currentTime;
      videoCamera.style.display = 'none';
      video.style.display = 'block';
      currentVideo = video;
    }
    if (!currentVideo.paused) {
      currentVideo.play();
    }
  }

  function scalePitchInfo() {
    const sx = currentPitchCanvasSize.width / prevPitchCanvasSize.width;
    const sy = currentPitchCanvasSize.height / prevPitchCanvasSize.height;
    for (const [t, pt] of timedClickedPtsPitch) {
      timedClickedPtsPitch.set(t, { x: pt.x * sx, y: pt.y * sy });
    }
  }

  function resizeCanvas() {
    const container = document.getElementById('interactive-container-video-cubic');
    const containerWidth = container.clientWidth;
    const containerHeight = containerWidth / (16 / 9); // Maintain 16:9 aspect ratio

    canvas.width = containerWidth;
    canvas.height = containerHeight;
    currentVideo.width = containerWidth;
    currentVideo.height = containerHeight;
    videoCanvasSize.width = containerWidth;
    videoCanvasSize.height = containerHeight;

    const imageContainer = document.getElementById('interactive-container-image-cubic');
    const imageContainerWidth = imageContainer.clientWidth;
    const imageContainerHeight = imageContainerWidth / (16 / 9); // Maintain 16:9 aspect ratio

    pitchCanvas.width = imageContainerWidth;
    pitchCanvas.height = imageContainerHeight;
    pointsCanvas.width = imageContainerWidth;
    pointsCanvas.height = imageContainerHeight;
    refPtCanvas.width = imageContainerWidth;
    refPtCanvas.height = imageContainerHeight;
    pitchCanvasSize.width = containerWidth;
    pitchCanvasSize.height = containerHeight;

    prevPitchCanvasSize = currentPitchCanvasSize;
    currentPitchCanvasSize = { width: imageContainerWidth, height: imageContainerHeight };
    scalePitchInfo();
  }

  function drawBackgroundImage() {
    const backgroundImage = new Image();
    backgroundImage.src = '/curve_fitting_bsplines/SoccerPitchTemplate.png'; // Replace with the path to your image
    backgroundImage.onload = () => {
      const aspectRatio = backgroundImage.width / backgroundImage.height;
      let drawWidth = pitchCanvas.width;
      let drawHeight = pitchCanvas.height;

      if (pitchCanvas.width / pitchCanvas.height > aspectRatio) {
        drawWidth = pitchCanvas.height * aspectRatio;
      } else {
        drawHeight = pitchCanvas.width / aspectRatio;
      }

      const offsetX = (pitchCanvas.width - drawWidth) / 2;
      const offsetY = (pitchCanvas.height - drawHeight) / 2;

      pitchCtx.clearRect(0, 0, pitchCanvas.width, pitchCanvas.height);
      pitchCtx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
    };
    backgroundImage.onerror = () => {
      console.error('Failed to load the background image.');
    };
  }

  function resizeCanvasWithImage() {
    resizeCanvas();
    drawBackgroundImage();
    drawPitchInfo();
    drawCurrentPoint(parseFloat(video.currentTime));
  }

  function truncateFloat(num, places=4) {
    return Math.floor(num * Math.pow(10, places)) / Math.pow(10, places);
  }

  function drawPoint(ctx, canvas, x, y, color, size=5, clear=true) {
    if (clear) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    // Draw the point
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function unbundle_timed_points(timed_points) {
  const sorted_ts = Array.from(timed_points.keys()).sort((a, b) => a - b);
    const xs = [];
    const ys = [];
    for (const t of sorted_ts) {
      const pt = timed_points.get(t);
      xs.push(pt.x);
      ys.push(pt.y);
    }
    return [sorted_ts, xs, ys];
  }

  function evalPointSpline(t, xSpline, ySpline, check_in=false) {
    const xInterpolated = xSpline.at(t);
    const yInterpolated = ySpline.at(t);
    return { x: xInterpolated, y: yInterpolated };
  }

  function evalHomographySpline(t) {
    let h = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => 0));
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        h[i][j] = homographySplines[i*3+j].at(t);
      }
    }
    return h;
  }

  function rangeTimes(ts) {
    const minT = Math.min(...ts);
    const maxT = Math.max(...ts);
    return [minT, maxT];
  }

  function evalPointSplineRange(xSpline, ySpline, minT, maxT) {
    const curve = [];
    // Check if minT matches any of the sliderTimes
    if (!sliderTimes.includes(minT)) {
      curve.push(evalPointSpline(minT, xSpline, ySpline));
    }
    for (let i = 0; i < sliderTimes.length; i++) {
      const t = sliderTimes[i];
      if (sliderTimes[i] < minT || sliderTimes[i] > maxT) {
        continue;
      }
      const pt = evalPointSpline(t, xSpline, ySpline);
      curve.push(pt);
    }
    // Check if maxT matches any of the sliderTimes
    if (!sliderTimes.includes(maxT)){
      curve.push(evalPointSpline(maxT, xSpline, ySpline));
    }
    return curve;
  }

  function drawCurrentPoint(t) {
    let pointRefreshed = false;
    if (xSplinePitch !== null && ySplinePitch !== null) {
      const [minT, maxT] = rangeTimes(Array.from(xSplinePitch.ts));
      if (t >= minT && t <= maxT) {
        const ptPitchCanvas = evalPointSpline(t, xSplinePitch, ySplinePitch);
        const homography = evalHomographySpline(t);
        const ptImgCanvas = projectPt(ptPitchCanvas, homography, pitchDimsBrighton, videoCanvasSize, pitchCanvasSize, origFrameSize);
        drawPoint(ctx, canvas, ptImgCanvas.x, ptImgCanvas.y, colorBase, sizeBaseImg);
        drawPoint(refPtCtx, refPtCanvas, ptPitchCanvas.x, ptPitchCanvas.y, colorBase, sizeBasePitch);
        pointRefreshed = true;
      }
    }
    if (!pointRefreshed) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      refPtCtx.clearRect(0, 0, refPtCanvas.width, refPtCanvas.height);
    }
  }

  function drawPitchInfo() {
    pointsCtx.clearRect(0, 0, pointsCanvas.width, pointsCanvas.height);
    for (const [t, pt] of timedClickedPtsPitch) {
      drawPoint(pointsCtx, pointsCanvas, pt.x, pt.y, colorLabelled, sizeLabelled, false);
    }
    if (timedClickedPtsPitch.size > 1) {
      const [ts, xs, ys] = unbundle_timed_points(timedClickedPtsPitch);
      xSplinePitch = new Spline(ts, xs);
      ySplinePitch = new Spline(ts, ys);
      const [minT, maxT] = rangeTimes(ts);
      const trajPitch = evalPointSplineRange(xSplinePitch, ySplinePitch, minT, maxT);
      drawCurve(pointsCtx, trajPitch, colorTraj)
    }
  }

  canvas.addEventListener('click', (event) => {
    if (currentVideo.paused) {
      const rect = canvas.getBoundingClientRect();
      const ptImgCanvas = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const t = truncateFloat(parseFloat(currentVideo.currentTime));
      const homography = evalHomographySpline(t);
      const ptPitchCanvas = backProjectPt(ptImgCanvas, homography, pitchDimsBrighton, videoCanvasSize, pitchCanvasSize, origFrameSize);
      timedClickedPtsPitch.set(t, ptPitchCanvas);
      drawPoint(ctx, canvas, ptImgCanvas.x, ptImgCanvas.y, colorLabelled, sizeLabelled);
      drawPitchInfo();
    }
  });

  // Adjust canvas size when the window is resized
  window.addEventListener('resize', resizeCanvasWithImage);

  // Play/Pause button functionality
  playPauseButton.addEventListener('click', () => {
    if (parseFloat(currentVideo.currentTime) === parseFloat(currentVideo.duration)) {
      currentVideo.currentTime = 0; // Reset to start if at the end
    }
    if (currentVideo.paused) {
      currentVideo.play();
      playPauseIcon.src = '/curve_fitting_bsplines/pause.png'; // Pause icon
      playPauseIcon.alt = 'Pause';
    } else {
      currentVideo.pause();
      playPauseIcon.src = '/curve_fitting_bsplines/play.png'; // Play icon
      playPauseIcon.alt = 'Play';
    }
  });

  cameraButton.addEventListener('click', () => {
    if (currentVideo.paused) {
      if (cameraOn) {
        cameraIcon.src = '/curve_fitting_bsplines/camera-on.png';
        cameraOn = false;
      }
      else {
        cameraIcon.src = '/curve_fitting_bsplines/camera-off.png';
        cameraOn = true;
      }
      switchVideo();
    }
  });

  removeButton.addEventListener('click', () => {
    if (currentVideo.paused) {
      timedClickedPtsPitch.clear();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pointsCtx.clearRect(0, 0, pointsCanvas.width, pointsCanvas.height);
      refPtCtx.clearRect(0, 0, refPtCanvas.width, refPtCanvas.height);
      xSplinePitch = null;
      ySplinePitch = null;
    }
  });
  
  videos.forEach(function(elem) {
    elem.addEventListener('ended', () => {
      playPauseIcon.src = '/curve_fitting_bsplines/play.png'; // Play icon
      playPauseIcon.alt = 'Play';
    });
  });

  videos.forEach(function(elem) {
    elem.addEventListener('loadedmetadata', () => {
      // Update canvas size when video metadata is loaded
      resizeCanvasWithImage();
    });
  });

  videos.forEach(function(elem) {
    elem.addEventListener('timeupdate', () => {
      if (isVideoUpdatedProgrammatically) {
        isVideoUpdatedProgrammatically = false;
        return;
      }
  
      drawCurrentPoint(parseFloat(timeSlider.value));    
      
      // Update the slider value based on the current time of the video
      isTimeUpdatedProgrammatically = true;
      timeSlider.value = elem.currentTime;
    });
  });

  timeSlider.addEventListener('input', () => {
    if (isTimeUpdatedProgrammatically) {
      isTimeUpdatedProgrammatically = false;
      return;
    }

    if (parseFloat(timeSlider.value) + parseFloat(timeSlider.step) >= parseFloat(timeSlider.max)) {
      currentVideo.pause();
      playPauseIcon.src = '/curve_fitting_bsplines/play.png'; // Play icon
      playPauseIcon.alt = 'Play';
    }
    
    drawCurrentPoint(parseFloat(timeSlider.value));   

    // Seek the video to the desired time when the slider is moved
    isVideoUpdatedProgrammatically = true;
    currentVideo.currentTime = timeSlider.value;
  });

  // Set initial canvas size
  resizeCanvasWithImage();
  drawInitGrossTrajectory();
});