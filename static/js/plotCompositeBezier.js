import { drawPoints, pointRadius } from './utils/point.js';
import { drawSegmentFromPoints, drawSegmentWithArrow } from './utils/line.js';
import { BezierCurve, drawCurve } from './utils/polynomialCurve.js';
import { enableDragging } from './utils/dragPoint.js';
import { auxPointDerivative } from './utils/auxPointDerivative.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('interactive-container-composite-bezier');
  const plot = document.getElementById('interactive-plot-composite-bezier');
  const ctx = plot.getContext('2d');
  let p1 = { x: 60, y: 300 };
  let p2 = { x: 140, y: 100 };
  let p3 = { x: 220, y: 100 };
  let p4 = { x: 300, y: 300 };
  let p5 = { x: 380, y: 100 };
  let p6 = { x: 460, y: 100 };
  let p7 = { x: 540, y: 300 };
  const points = [p1, p2, p3, p4, p5, p6, p7];
  const lengthArrow = 30;

  plot.width = canvas.clientWidth;
  plot.height = canvas.clientHeight;
  const colors = ['red', 'blue', 'green', 'orange', 'cyan', 'olive', 'teal'];
  function renderCompositeBezier() {
    drawPoints(ctx, points, colors);
    [p1, p2, p3, p4, p5, p6, p7] = points;
    const points1 = [p1, p2, p3, p4];
    const points2 = [p4, p5, p6, p7];
    const p4_end1 = auxPointDerivative(p4, lengthArrow, p3, true);
    const p4_end2 = auxPointDerivative(p4, lengthArrow, p5);
    drawSegmentFromPoints(ctx, p3, p4, "brown");
    drawSegmentWithArrow(ctx, p4, p4_end1, "brown")
    drawSegmentFromPoints(ctx, p4, p5, "pink");
    drawSegmentWithArrow(ctx, p4, p4_end2, "pink")
    const curve1 = BezierCurve(points1);
    const curve2 = BezierCurve(points2);
    drawCurve(ctx, curve1);
    drawCurve(ctx, curve2);
  }

  enableDragging(plot, points, pointRadius, renderCompositeBezier);

  renderCompositeBezier();

});