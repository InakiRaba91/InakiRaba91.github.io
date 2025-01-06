export const pointRadius = 5;

export function drawPoints(ctx, points, colors = []) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  points.forEach((point, index) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
    ctx.fillStyle = colors[index] || 'red'; // Use the color from the list or default to red
    ctx.fill();
    ctx.stroke();
  });
}