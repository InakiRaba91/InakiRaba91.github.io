import { drawPoints } from './utils/point.js';
import { drawLineFromPoints } from './utils/line.js';
import { affineCombination } from './utils/affine.js';

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('interactive-container-affine');
  const plot = document.getElementById('interactive-plot-affine');
  const ctx = plot.getContext('2d');
  const tAffineSlider = document.getElementById('tAffine-slider');
  const tAffineValue = document.getElementById('tAffine-value');
  let t = parseFloat(tAffineSlider.value);
  const p1 = { x: 100, y: 100 };
  const p2 = { x: 500, y: 300 };

  plot.width = canvas.clientWidth;
  plot.height = canvas.clientHeight;

  let p3 = affineCombination([p1, p2], [(1-t), t]);
  let points = [p1, p2, p3];    
  const colors = ['red', 'red', 'blue'];

  function renderAffine() {
    drawPoints(ctx, points, colors);
    drawLineFromPoints(ctx, p1, p2, canvas.clientWidth);
  }

  tAffineSlider.addEventListener('input', (e) => {
    t = parseFloat(e.target.value);
    tAffineValue.textContent = t.toFixed(2);
    p3 = affineCombination([p1, p2], [(1-t), t]);
    points = [p1, p2, p3];  
    renderAffine();
  });


  renderAffine();

});