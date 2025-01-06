import { pointRadius } from './utils/point.js';
import { drawConvexHull } from './utils/convexHull.js';

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

  function updateButtons() {
    addPointButton.disabled = points.length >= maxPoints;
    removePointButton.disabled = points.length <= minPoints;
  }

  function renderPolygon(ctx, points, updateButtons, drawConvexHull) {
    updateButtons();
    drawConvexHull(ctx, points);
  }

  plot.addEventListener('mousedown', (e) => {
    const rect = plot.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let draggedPointIndex = null;

    points.forEach((point, index) => {
      const dx = point.x - x;
      const dy = point.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < pointRadius) {
        draggedPointIndex = index;
      }
    });

    if (draggedPointIndex !== null) {
      const onMouseMove = (e) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        points[draggedPointIndex] = { x, y };
        renderPolygon(plot.getContext('2d'), points, updateButtons, drawConvexHull);
      };

      document.addEventListener('mousemove', onMouseMove);

      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onMouseMove);
      }, { once: true });
    }
  });

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