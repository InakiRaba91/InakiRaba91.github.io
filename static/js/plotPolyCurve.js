import { pointRadius, drawPoints } from './utils/point.js';
import { polyCurve, drawCurve } from './utils/polynomialCurve.js';
import { updateButtons } from './utils/updateButtons.js';
import { enableDragging } from './utils/dragPoint.js';
import { updateSliders, createSlider, recalculateSliderValues } from './utils/sliders.js';

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('interactive-container-poly');
  const plot = document.getElementById('interactive-plot-poly');
  const ctx = plot.getContext('2d');
  const slidersContainer = document.getElementById('sliders-container');
  const addPointButton = document.getElementById('addPointPolyButton');
  const removePointButton = document.getElementById('removePointPolyButton');
  let points = [
    { x: 100, y: 100 },
    { x: 500, y: 100 }
  ];
  const maxPoints = 5;
  const minPoints = 2;
  const prefix = 'Poly-slider';

  let ts = [
    { id: 't0Poly-slider', value: 0, disabled: true },
    { id: 't1Poly-slider', value: 1, disabled: true }
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
    getCSSCustomProperty('--slider-color-t2'),
    getCSSCustomProperty('--slider-color-t3'),
    getCSSCustomProperty('--slider-color-t4')
  ];  

  function renderPolyCurve() {
    drawPoints(ctx, points, colors.slice(0, points.length));
    const knots = ts.map(slider => parseFloat(document.getElementById(slider.id).value));
    const curve = polyCurve(points, knots);
    drawCurve(ctx, curve, 'black');
  }

  enableDragging(plot, points, pointRadius, renderPolyCurve);

  addPointButton.addEventListener('click', () => {
    if (points.length < maxPoints) {
      points.push({ x: plot.clientWidth / 2, y: plot.clientHeight / 2 });
      ts.push({ id: `t${points.length - 1}Poly-slider`, value: 0.5, disabled: false });
      recalculateSliderValues(ts);
      updateSliders(slidersContainer, ts, createSlider, renderPolyCurve, prefix);
      updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
      renderPolyCurve();
    }
  });

  removePointButton.addEventListener('click', () => {
    if (points.length > minPoints) {
      points.pop();
      ts.pop(); // Remove the last slider
      recalculateSliderValues(ts);
      updateSliders(slidersContainer, ts, createSlider, renderPolyCurve, prefix);
      updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
      renderPolyCurve();
    }
  });

  updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
  updateSliders(slidersContainer, ts, createSlider, renderPolyCurve, prefix);
  renderPolyCurve();
});