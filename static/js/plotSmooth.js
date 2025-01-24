import { pointRadius, drawPoints } from './utils/point.js';
import { drawCurve, splineCurve } from './utils/polynomialCurve.js';
import { drawSegmentFromPoints } from './utils/line.js';
import { enableDragging } from './utils/dragPoint.js';
import { updateSliders, createSlider, recalculateSliderValues } from './utils/sliders.js';

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('interactive-container-smooth');
  const plot = document.getElementById('interactive-plot-smooth');
  const ctx = plot.getContext('2d');
  const slidersContainer = document.getElementById('sliders-smooth-container');
  const prefix = 'Smooth-slider';
  const points = [
    { x: 50, y: 300 },
    { x: 150, y: 100 },
    { x: 250, y: 300 },
    { x: 350, y: 100 },
    { x: 450, y: 300 },
  ];

  let ts = [
    { id: 't2Smooth-slider', value: 0, disabled: true },
    { id: 't3Smooth-slider', value: 1, disabled: false },
    { id: 't4Smooth-slider', value: 2, disabled: false },
    { id: 't5Smooth-slider', value: 3, disabled: false },
    { id: 't6Smooth-slider', value: 4, disabled: false },
    { id: 't7Smooth-slider', value: 5, disabled: true },
  ];
  const minValue = 0; 
  const maxValue = ts.length - 1; 
  const step = 0.1; 
  const allowEqual = true;

  plot.width = container.clientWidth;
  plot.height = container.clientHeight;

  function renderSplineCurve() {
    const knots = ts.map(slider => parseFloat(document.getElementById(slider.id).value));
    const num_segments = 3;
    const color_segments = ['blue', 'orange', 'green'];
    drawPoints(ctx, points);
    for (let i = 0; i < num_segments; i++) {
      const curve = splineCurve(points.slice(i, i+3), knots.slice(i, i+4));
      drawCurve(ctx, curve, color_segments[i]);
    }
    for (let j = 0; j < points.length - 1; j++) {
      drawSegmentFromPoints(ctx, points[j], points[j+1], 'black');
    }
  }

  enableDragging(plot, points, pointRadius, renderSplineCurve);
  updateSliders(slidersContainer, ts, createSlider, renderSplineCurve, prefix, minValue, maxValue, step, allowEqual);
  renderSplineCurve();
});