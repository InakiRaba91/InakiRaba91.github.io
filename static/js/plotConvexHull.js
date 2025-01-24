import { pointRadius } from './utils/point.js';
import { drawConvexHull } from './utils/convexHull.js';
import { updateButtons } from './utils/updateButtons.js';
import { enableDragging } from './utils/dragPoint.js';

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('interactive-container');
  const plot = document.getElementById('interactive-plot');
  const addPointButton = document.getElementById('addPointButton');
  const removePointButton = document.getElementById('removePointButton');
  const maxPoints = 6;
  const minPoints = 2;
  let points = [
    { x: 100, y: 100 },
    { x: 300, y: 300 }
  ];

  plot.width = container.clientWidth;
  plot.height = container.clientHeight;

  function renderPolygon(ctx, points, updateButtons, drawConvexHull) {
    updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints);
    drawConvexHull(ctx, points);
  }

  enableDragging(plot, points, pointRadius, renderPolygon, plot.getContext('2d'), points, updateButtons, drawConvexHull);

  addPointButton.addEventListener('click', () => {
    if (points.length < maxPoints) {
      points.push({ x: plot.clientWidth / 2, y: plot.clientHeight / 2 });
      renderPolygon(plot.getContext('2d'), points, updateButtons, drawConvexHull);
    }
  });

  removePointButton.addEventListener('click', () => {
    if (points.length > minPoints) {
      points.pop();
      renderPolygon(plot.getContext('2d'), points, updateButtons, drawConvexHull);
    }
  });

  renderPolygon(plot.getContext('2d'), points, updateButtons, drawConvexHull);
});