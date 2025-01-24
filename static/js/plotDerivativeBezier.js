import { drawPoints, pointRadius } from './utils/point.js';
import { drawSegmentFromPoints, drawSegmentWithArrow } from './utils/line.js';
import { BezierCurve, drawCurve } from './utils/polynomialCurve.js';
import { enableDragging } from './utils/dragPoint.js';
import { auxPointDerivative } from './utils/auxPointDerivative.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('interactive-container-derivative-bezier');
  const plot = document.getElementById('interactive-plot-derivative-bezier');
  const ctx = plot.getContext('2d');
  let p1 = { x: 50, y: 300 };
  let p2 = { x: 200, y: 200 };
  let p3 = { x: 350, y: 200 };
  let p4 = { x: 500, y: 100 };
  const points = [p1, p2, p3,p4];
  const lengthArrow = 30;

  plot.width = canvas.clientWidth;
  plot.height = canvas.clientHeight;
  const colors = ['red', 'blue', 'green', 'orange'];

  function renderDerivativeBezier() {
    drawPoints(ctx, points, colors);
    [p1, p2, p3, p4] = points;
    const p1_end = auxPointDerivative(p1, p2, lengthArrow);
    const p4_end = auxPointDerivative(p4, p3, lengthArrow, true);
    drawSegmentFromPoints(ctx, p1, p2, "grey");
    drawSegmentWithArrow(ctx, p1, p1_end, "black")
    drawSegmentFromPoints(ctx, p3, p4, "grey");
    drawSegmentWithArrow(ctx, p4, p4_end, "black")
    const curve = BezierCurve(points);
    drawCurve(ctx, curve);
  }

  enableDragging(plot, points, pointRadius, renderDerivativeBezier);

  renderDerivativeBezier();

});