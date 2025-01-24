import { pointRadius, drawPoints } from './utils/point.js';
import { polyCurve, drawCurve } from './utils/polynomialCurve.js';
import { enableDragging } from './utils/dragPoint.js';

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('interactive-container-quad');
  const plot = document.getElementById('interactive-plot-quad');
  const ctx = plot.getContext('2d');
  const t1Slider = document.getElementById('t1-slider');
  const t1Value = document.getElementById('t1-value');
  let t1 = parseFloat(t1Slider.value);
  let points = [
    { x: 100, y: 100 },
    { x: 300, y: 300 },
    { x: 500, y: 100 }
  ];

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
    getCSSCustomProperty('--slider-color-t2')
  ];

  function renderPolyCurve() {
    drawPoints(ctx, points, colors);
    const curve = polyCurve(points, [0, t1, 1]);
    drawCurve(ctx, curve);
  }

  t1Slider.addEventListener('input', (e) => {
    t1 = parseFloat(e.target.value);
    t1Value.textContent = t1.toFixed(2);
    renderPolyCurve();
  });

  enableDragging(plot, points, pointRadius, renderPolyCurve);
  renderPolyCurve();
});