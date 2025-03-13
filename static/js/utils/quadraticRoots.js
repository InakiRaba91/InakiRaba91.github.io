export function quadraticRoots(coeffs) {
  const [a, b, c] = coeffs;
  const delta = b ** 2 - 4 * a * c;
  if (delta < 0) {
    return [];
  }
  if (delta === 0) {
    return [-b / (2 * a)];
  }
  const sqrtDelta = Math.sqrt(delta);
  return [(-b - sqrtDelta) / (2 * a), (-b + sqrtDelta) / (2 * a)];
}