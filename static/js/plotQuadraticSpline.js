import { drawPoints } from './utils/point.js';
import { drawSegmentFromPoints } from './utils/line.js';
import { affineCombination } from './utils/affine.js';
import { splineCurve, drawCurve } from './utils/polynomialCurve.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('interactive-container-quad-spline');
  const plot = document.getElementById('interactive-plot-quad-spline');
  const ctx = plot.getContext('2d');
  const tQuadSpline = document.getElementById('tQuadSpline-slider');
  const tQuadSplineValue = document.getElementById('tQuadSpline-value');
  let t = parseFloat(tQuadSpline.value);
  const p1 = { x: 150, y: 200 };
  const p2 = { x: 300, y: 100 };
  const p3 = { x: 450, y: 200 };
  const points = [p1, p2, p3];
  const t2 = 0
  const t3 = 1
  const t4 = 2
  const t5 = 3
  const curve = splineCurve(points, [t2, t3, t4, t5]);

  plot.width = canvas.clientWidth;
  plot.height = canvas.clientHeight;
  const extra_colors = ['orange', 'orange', 'blue', 'blue'];

  function affinePoints(t) {
    const p12 = affineCombination([p1, p2], [(t4-t)/(t4-t2), (t-t2)/(t4-t2)]);
    const p23 = affineCombination([p2, p3], [(t5-t)/(t5-t3), (t-t3)/(t5-t3)]);
    const q = affineCombination([p12, p23], [(t4-t)/(t4-t3), (t-t3)/(t4-t3)]);
    return [p12, p23, q];
  }
  const p_start = affinePoints(t3)[2];
  const p_end = affinePoints(t4)[2];
  const p1_end = affineCombination([p2, p3], [(t5-t2)/(t5-t3), (t2-t3)/(t5-t3)]);
  const p3_start = affineCombination([p1, p2], [(t4-t5)/(t4-t2), (t5-t2)/(t4-t2)]);
  const extra_points = [p1_end, p3_start, p_start, p_end];

  // Generate curve_init as a list of points for t in [0, 1] with intervals of 0.01
  const curve_init = Array.from({ length: 101 }, (_, i) => affinePoints(i * 0.01)[2]);
  const curve_end = Array.from({ length: 101 }, (_, i) => affinePoints(2 + i * 0.01)[2]);

  function renderSpline() {
    drawPoints(ctx, points);
    drawPoints(ctx, extra_points, extra_colors, false);
    drawSegmentFromPoints(ctx, p1, p2, "black")
    drawSegmentFromPoints(ctx, p2, p3, "black")
    drawSegmentFromPoints(ctx, p2, p1_end)
    drawSegmentFromPoints(ctx, p3_start, p2)
    const [p12, p23, q] = affinePoints(t);
    drawSegmentFromPoints(ctx, p12, p23, "pink")
    drawPoints(ctx, [p12, p23, q], ["pink", "pink", "purple"], false);
    drawCurve(ctx, curve, 'blue');
    drawCurve(ctx, curve_init, "purple");
    drawCurve(ctx, curve_end, "green");
  }

  tQuadSpline.addEventListener('input', (e) => {
    t = parseFloat(e.target.value);
    tQuadSplineValue.textContent = t.toFixed(2);
    renderSpline();
  });

  renderSpline();

});