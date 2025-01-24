import { pointRadius, drawPoints } from './utils/point.js';
import { drawCurve, splineCurve } from './utils/polynomialCurve.js';
import { drawConvexHull } from './utils/convexHull.js';
import { updateButtons } from './utils/updateButtons.js';
import { enableDragging } from './utils/dragPoint.js';
import { updateSliders, createSlider, recalculateSliderValues } from './utils/sliders.js';

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('interactive-container-spline');
  const plot = document.getElementById('interactive-plot-spline');
  const ctx = plot.getContext('2d');
  const slidersContainer = document.getElementById('sliders-spline-container');
  const addPointButton = document.getElementById('addPointSplineButton');
  const removePointButton = document.getElementById('removePointSplineButton');
  const prefix = 'Spline-slider';
  let points = [
    { x: 100, y: 100 }, 
    { x: 300, y: 300 },
    { x: 500, y: 100 },
  ];
  const maxPoints = 5;
  const minPoints = 2;

  let ts = [
    { id: 't2Spline-slider', value: 0, disabled: true },
    { id: 't3Spline-slider', value: 1, disabled: false },
    { id: 't4Spline-slider', value: 2, disabled: false },
    { id: 't5Spline-slider', value: 3, disabled: true }
  ];
  const minValue = 0;
  const maxValue = ts.length - 1;
  const step = 0.1;
  const normalized = false;

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

  function renderSplineCurve() {
    drawConvexHull(ctx, points, colors.slice(0, points.length), `purple`, 'pink');
    const knots = ts.map(slider => parseFloat(document.getElementById(slider.id).value));
    const curve = splineCurve(points, knots);
    drawCurve(ctx, curve, 'black');
  }

  enableDragging(plot, points, pointRadius, renderSplineCurve);

  addPointButton.addEventListener('click', () => {
    if (points.length < maxPoints) {
      points.push({ x: plot.clientWidth / 2, y: plot.clientHeight / 2 });
      ts.push({ id: `t${ts.length+2}Spline-slider`, value: 0.5, disabled: false });
      ts.push({ id: `t${ts.length+2}Spline-slider`, value: 0.5, disabled: false });
      const maxValue = ts.length - 1;
      recalculateSliderValues(ts, normalized);
      updateSliders(slidersContainer, ts, createSlider, renderSplineCurve, prefix, minValue, maxValue, step);
      updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
      renderSplineCurve();
    }
  });

  removePointButton.addEventListener('click', () => {
    if (points.length > minPoints) {
      points.pop();
      ts.pop();
      ts.pop();
      const maxValue = ts.length - 1;
      recalculateSliderValues(ts, normalized);
      updateSliders(slidersContainer, ts, createSlider, renderSplineCurve, prefix, minValue, maxValue, step);
      updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
      renderSplineCurve();
    }
  });

  updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
  updateSliders(slidersContainer, ts, createSlider, renderSplineCurve, prefix, minValue, maxValue, step);
  renderSplineCurve();
});