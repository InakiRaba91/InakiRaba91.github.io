import { drawPoints, pointRadius } from './utils/point.js';
import { drawSegmentFromPoints } from './utils/line.js';
import { splineCurve, drawCurve } from './utils/polynomialCurve.js';
import { enableDragging } from './utils/dragPoint.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('interactive-container-quad-comp-spline');
  const plot = document.getElementById('interactive-plot-quad-comp-spline');
  const ctx = plot.getContext('2d');
  let p1 = { x: 60, y: 300 };
  let p2 = { x: 220, y: 100 };
  let p3 = { x: 380, y: 300 };
  let p4 = { x: 540, y: 100 };
  const points = [p1, p2, p3, p4];
  const t2 = 0
  const t3 = 1
  const t4 = 2
  const t5 = 3
  const t6 = 4

  plot.width = canvas.clientWidth;
  plot.height = canvas.clientHeight;

  function renderSpline() {
    [p1, p2, p3, p4] = points;
    const curve = splineCurve(points.slice(0, 3), [t2, t3, t4, t5]);
    const curve2 = splineCurve(points.slice(1, 4), [t3, t4, t5, t6]);
    drawPoints(ctx, points);
    drawSegmentFromPoints(ctx, p1, p2, "black")
    drawSegmentFromPoints(ctx, p2, p3, "black")
    drawSegmentFromPoints(ctx, p3, p4, "black")
    drawCurve(ctx, curve, 'blue');
    drawCurve(ctx, curve2, 'green');
  }

  enableDragging(plot, points, pointRadius, renderSpline);

  renderSpline();

});