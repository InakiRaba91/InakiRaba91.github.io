import { affineCombination } from "./affine.js";

export function polyCurve(points, knots, m = 100) {
  if (points.length !== knots.length) {
    throw new Error("The number of points must be equal to the number of knots");
  }
  const n = points.length - 1;
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

export function BezierCurve(points, m = 100) {
  const n = points.length - 1;
  let curve = []
  // Iterate over time
  for (let i=0; i <= m; i++) {
    let t = i / m;
    let w = [1 - t, t];
    let q = points;
    // Iterate over the degrees
    for (let j=0; j < n; j++) {
      let q_j = [];
      // Iterate over the interpolants
      for (let k=0; k < n - j; k++) {
        let p = [q[k], q[k + 1]];
        q_j.push(affineCombination(p, w));
      }
      q = q_j;
    }
    curve.push(q[0]);
  }
  return curve;
}

export function splineCurve(points, knots, m = 100) {
  if (2 * (points.length - 1) !== knots.length) {
    throw new Error("The number of knots must be equal to 2 * (the number of points - 1)");
  }
  const d = points.length - 1;
  const delta_t = (knots[d] - knots[d-1]) / m;
  let curve = []
  // Iterate over time
  for (let i=0; i <= m; i++) {
    let t = knots[d-1] + i * delta_t;
    let q = points;
    // Iterate over the degrees
    for (let r=1; r <= d; r++) {
      let q_j = [];
      // Iterate over the interpolants
      for (let j=r+1; j <= d+1; j++) {
        let p = [q[j - r - 1], q[j - r]]; // We substract 1 w.r.t. the equation because JS indexing starts at 0 (1 in the control points)
        let t_b = knots[j+d-r-1]; // We substract 2 s.r.t. the equation because JS indexing starts at 0 (2 in the knots)
        let t_a = knots[j-2]; // We substract 2 from the equation because JS indexing starts at 0 (2 in the knots)
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