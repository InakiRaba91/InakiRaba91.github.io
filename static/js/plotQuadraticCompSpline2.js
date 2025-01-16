import { drawPoints, pointRadius } from './utils/point.js';
import { drawSegmentFromPoints } from './utils/line.js';
import { splineCurve, drawCurve } from './utils/polynomialCurve.js';
import { enableDragging } from './utils/dragPoint.js';
import { updateButtons } from './utils/updateButtons.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('interactive-container-quad-comp-spline2');
  const plot = document.getElementById('interactive-plot-quad-comp-spline2');
  const addPointButton = document.getElementById('addPointSplineCompButton');
  const removePointButton = document.getElementById('removePointSplineCompButton');
  const ctx = plot.getContext('2d');
  const maxPoints = 7;
  const minPoints = 2;
  const points = [
    { x: 60, y: 300 },
    { x: 220, y: 100 },
    { x: 380, y: 300 },
    { x: 540, y: 100 }
  ];
  const ts = [0, 1, 2, 3, 4];

  // Function to get the color from CSS custom properties
  function getCSSCustomProperty(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  }

  // Get colors from the sliders
  const colors = [
    getCSSCustomProperty('--slider-color-t0'),
    getCSSCustomProperty('--slider-color-t1'),
    getCSSCustomProperty('--slider-color-t2'),
    getCSSCustomProperty('--slider-color-t3'),
    getCSSCustomProperty('--slider-color-t4')
  ];  

  plot.width = canvas.clientWidth;
  plot.height = canvas.clientHeight;

  function renderCompSpline() {
    const num_segments = points.length - 2;
    //draw all points in black
    const color_points = points.map(p => 'pink');
    drawPoints(ctx, points, color_points);
    for (let i = 0; i < num_segments; i++) {
      const curve = splineCurve(points.slice(i, i+3), ts.slice(i, i+4));
      drawCurve(ctx, curve, colors[i]);
    }
    for (let j = 0; j < points.length - 1; j++) {
      drawSegmentFromPoints(ctx, points[j], points[j+1], 'black');
    }
  }

  addPointButton.addEventListener('click', () => {
      if (points.length < maxPoints) {
        points.push({ x: plot.clientWidth / 2, y: plot.clientHeight / 2 });
        ts.push(ts.length);
        ts.push(ts.length);
        updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
        renderCompSpline();
      }
    });
  
    removePointButton.addEventListener('click', () => {
      if (points.length > minPoints) {
        points.pop();
        ts.pop();
        ts.pop();
        updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
        renderCompSpline();
      }
    });

  enableDragging(plot, points, pointRadius, renderCompSpline);
  updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
  renderCompSpline();

});