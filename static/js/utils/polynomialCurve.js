export function affineCombination(points, weights) {
  return points.reduce((acc, p, i) => {
    return { x: acc.x + weights[i] * p.x, y: acc.y + weights[i] * p.y };
  }, { x: 0, y: 0 });
}

export function polyCurve(points, knots, m = 100) {
  if (points.length !== knots.length) {
    throw new Error("The number of points must be equal to the number of knots");
  }
  const n = points.length - 1;
  const coefficients = [];
  const delta_t = (knots[n] - knots[0]) / m;
  let curve = []
  // Iterate over time
  for (let i=0; i <= m; i++) {
    let t = knots[0] + i * delta_t;
    let q = points;
    // Iterate over the degrees
    for (let j=0; j < n; j++) {
      let q_j = [];
      // Iterate over the interpolants
      for (let k=0; k < n - j; k++) {
        let p = [q[k], q[k + 1]];
        let t_a = knots[k];
        let t_b = knots[k + j + 1];
        let w = [(t_b - t) / (t_b - t_a), (t - t_a) / (t_b - t_a)];
        q_j.push(affineCombination(p, w));
      }
      q = q_j;
    }
    curve.push(q[0]);
  }
  return curve;
}
    

export function drawCurve(ctx, points, color = "purple") {
  if (points.length < 2) return; // Need at least two points to draw a line

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.strokeStyle = color;
  ctx.stroke();
}