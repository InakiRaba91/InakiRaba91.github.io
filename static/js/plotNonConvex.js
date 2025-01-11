import { drawPoints } from './utils/point.js';
import { drawSegmentFromPoints } from './utils/line.js';
import { affineCombination } from './utils/affine.js';
import { polyCurve, drawCurve } from './utils/polynomialCurve.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('interactive-container-nonconvex');
  const plot = document.getElementById('interactive-plot-nonconvex');
  const ctx = plot.getContext('2d');
  const tNonConvexSlider = document.getElementById('tNonConvex-slider');
  const tNonConvexValue = document.getElementById('tNonConvex-value');
  let t = parseFloat(tNonConvexSlider.value);
  const p1 = { x: 150, y: 300 };
  const p2 = { x: 300, y: 200 };
  const p3 = { x: 450, y: 300 };
  const points = [p1, p2, p3];
  const t1 = 0
  const t2 = 0.5
  const t3 = 1
  const p1_end = affineCombination([p1, p2], [(t2-t3)/(t2-t1), (t3-t1)/(t2-t1)]);
  const p3_start = affineCombination([p2, p3], [(t3-t1)/(t3-t2), (t1-t2)/(t3-t2)]);
  const extra_points = [p1_end, p3_start];
  const curve = polyCurve(points, [t1, t2, t3]);

  plot.width = canvas.clientWidth;
  plot.height = canvas.clientHeight;
  const colors = ['red', 'blue', 'green'];
  const extra_colors = ['orange', 'yellow'];

  function affinePoints(t) {
    const p12 = affineCombination([p1, p2], [(t2-t)/(t2-t1), (t-t1)/(t2-t1)]);
    const p23 = affineCombination([p2, p3], [(t3-t)/(t3-t2), (t-t2)/(t3-t2)]);
    const q = affineCombination([p12, p23], [(t3-t)/(t3-t1), (t-t1)/(t3-t1)]);
    return [p12, p23, q];
  }

  function renderNonConvex() {
    drawPoints(ctx, points, colors);
    drawPoints(ctx, extra_points, extra_colors, false);
    drawSegmentFromPoints(ctx, p1, p2, "black")
    drawSegmentFromPoints(ctx, p2, p3, "black")
    drawSegmentFromPoints(ctx, p2, p1_end)
    drawSegmentFromPoints(ctx, p3_start, p2)
    const [p12, p23, q] = affinePoints(t);
    drawSegmentFromPoints(ctx, p12, p23, "pink")
    drawPoints(ctx, [p12, p23, q], ["pink", "pink", "purple"], false);
    drawCurve(ctx, curve);
  }

  tNonConvexSlider.addEventListener('input', (e) => {
    t = parseFloat(e.target.value);
    tNonConvexValue.textContent = t.toFixed(2);
    renderNonConvex();
  });

  renderNonConvex();

});