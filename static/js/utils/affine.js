export function affineCombination(points, weights) {
  return points.reduce((acc, p, i) => {
    return { x: acc.x + weights[i] * p.x, y: acc.y + weights[i] * p.y };
  }, { x: 0, y: 0 });
}