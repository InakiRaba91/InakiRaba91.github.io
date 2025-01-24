import { drawPoints } from './utils/point.js';
import { drawSegmentFromPoints } from './utils/line.js';
import { affineCombination } from './utils/affine.js';
import { BezierCurve, drawCurve } from './utils/polynomialCurve.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('interactive-container-convex-bezier');
  const plot = document.getElementById('interactive-plot-convex-bezier');
  const ctx = plot.getContext('2d');
  const tNonConvexSlider = document.getElementById('tConvexBezier-slider');
  const tNonConvexValue = document.getElementById('tConvexBezier-value');
  let t = parseFloat(tNonConvexSlider.value);
  const p1 = { x: 150, y: 300 };
  const p2 = { x: 300, y: 200 };
  const p3 = { x: 450, y: 300 };
  const points = [p1, p2, p3];
  const curve = BezierCurve(points);

  plot.width = canvas.clientWidth;
  plot.height = canvas.clientHeight;
  const colors = ['red', 'blue', 'green'];

  function affinePoints(t) {
    const p12 = affineCombination([p1, p2], [1-t, t]);
    const p23 = affineCombination([p2, p3], [1-t, t]);
    const q = affineCombination([p12, p23], [1-t, t]);
    return [p12, p23, q];
  }

  function renderConvexBezier() {
    drawPoints(ctx, points, colors);
    drawSegmentFromPoints(ctx, p1, p2, "black")
    drawSegmentFromPoints(ctx, p2, p3, "black")
    const [p12, p23, q] = affinePoints(t);
    drawSegmentFromPoints(ctx, p12, p23, "pink")
    drawPoints(ctx, [p12, p23, q], ["pink", "pink", "purple"], false);
    drawCurve(ctx, curve);
  }

  tNonConvexSlider.addEventListener('input', (e) => {
    t = parseFloat(e.target.value);
    tNonConvexValue.textContent = t.toFixed(2);
    renderConvexBezier();
  });

  renderConvexBezier();

});