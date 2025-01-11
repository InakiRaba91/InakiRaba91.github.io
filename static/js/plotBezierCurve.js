import { pointRadius } from './utils/point.js';
import { drawConvexHull } from './utils/convexHull.js';
import { BezierCurve, drawCurve } from './utils/polynomialCurve.js';
import { updateButtons } from './utils/updateButtons.js';
import { enableDragging } from './utils/dragPoint.js';

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('interactive-container-bezier');
  const plot = document.getElementById('interactive-plot-bezier');
  const ctx = plot.getContext('2d');
  const addPointButton = document.getElementById('addPointBezierButton');
  const removePointButton = document.getElementById('removePointBezierButton');
  let points = [
    { x: 100, y: 100 },
    { x: 500, y: 100 }
  ];
  const maxPoints = 5;
  const minPoints = 2;

  plot.width = container.clientWidth;
  plot.height = container.clientHeight;

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

  function renderBezierCurve() {
    drawConvexHull(ctx, points, colors, `purple`, 'pink');
    const curve = BezierCurve(points);
    drawCurve(ctx, curve, 'black');
  }

  enableDragging(plot, points, pointRadius, renderBezierCurve);

  addPointButton.addEventListener('click', () => {
    if (points.length < maxPoints) {
      points.push({ x: plot.clientWidth / 2, y: plot.clientHeight / 2 });
      updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
      renderBezierCurve();
    }
  });

  removePointButton.addEventListener('click', () => {
    if (points.length > minPoints) {
      points.pop();
      updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
      renderBezierCurve();
    }
  });

  updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
  renderBezierCurve();
});