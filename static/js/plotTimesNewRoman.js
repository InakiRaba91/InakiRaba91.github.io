import { drawPoints, pointRadius } from './utils/point.js';
import { drawSegmentFromPoints, drawSegmentWithArrow } from './utils/line.js';
import { BezierCurve, drawCurve } from './utils/polynomialCurve.js';
import { enableDragging } from './utils/dragPoint.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('interactive-container-times');
  const plot = document.getElementById('interactive-plot-times');
  const ctx = plot.getContext('2d');
  const points = [
    { x: 337, y: 15 },
    { x: 335, y: 24 },
    { x: 330, y: 44 },
    { x: 306, y: 44 },
    { x: 284, y: 44 },
    { x: 237, y: 15 },
    { x: 184, y: 15 },
    { x: 105, y: 15 },
    { x: 26, y: 60 },
    { x: 25, y: 156 },
    { x: 26, y: 237 },
    { x: 82, y: 273 },
    { x: 162, y: 314 },
    { x: 291, y: 385 },
    { x: 305, y: 413 },
    { x: 306, y: 458 },
    { x: 306, y: 503 },
    { x: 270, y: 551 },
    { x: 201, y: 551 },
    { x: 81, y: 552 },
    { x: 36, y: 444 },
    { x: 20, y: 406 },
    { x: 20, y: 406 },
    { x: 45, y: 580 },
    { x: 45, y: 580 },
    { x: 45, y: 567 },
    { x: 55, y: 552 },
    { x: 72, y: 552 },
    { x: 99, y: 553 },
    { x: 142, y: 581 },
    { x: 209, y: 580 },
    { x: 333, y: 581 },
    { x: 394, y: 501 },
    { x: 394, y: 433 },
    { x: 393, y: 259 },
    { x: 100, y: 242 },
    { x: 100, y: 125 },
    { x: 100, y: 74 },
    { x: 146, y: 49 },
    { x: 190, y: 50 },
    { x: 280, y: 50 },
    { x: 337, y: 121 },
    { x: 352, y: 190 },
    { x: 352, y: 190 },
    { x: 337, y: 16 },
    { x: 337, y: 16 }
  ];

  plot.width = canvas.clientWidth;
  plot.height = canvas.clientHeight;
  function renderTimesS() {
    drawPoints(ctx, points);
    for (let i = 0; i < points.length - 1; i += 3) {
      for (let j = i; j < i + 3; j++) {
        drawSegmentFromPoints(ctx, points[j], points[j+1], 'olive');
      }
      let curve = BezierCurve(points.slice(i, i + 4));
      drawCurve(ctx, curve);
    }
  }

  enableDragging(plot, points, pointRadius, renderTimesS);

  renderTimesS();

});