import { drawPoints } from './point.js';

export function computeConvexHull(points) {
  if (!Array.isArray(points)) {
    throw new Error("Input must be an array of points");
  }

  points = points.slice().sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const lower = [];
  for (let p of points) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper = [];
  for (let p of points.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

export function drawConvexHull(ctx, points, color_points = [], color_hull = 'blue', color_fill = 'lightblue') {
  const hull = computeConvexHull(points);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawPoints(ctx, points, color_points); // Redraw points after clearing the canvas
  if (hull.length > 0) {
    ctx.beginPath();
    ctx.moveTo(hull[0].x, hull[0].y);
    for (let i = 1; i < hull.length; i++) {
      ctx.lineTo(hull[i].x, hull[i].y);
    }
    ctx.closePath();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color_fill;
    ctx.fill();
    ctx.globalAlpha = 1.0; // Reset globalAlpha to default
    ctx.strokeStyle = color_hull;
    ctx.stroke();
  }
}