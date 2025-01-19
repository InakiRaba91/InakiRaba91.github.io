export function BSpline(n, x) {
  if (n === 0) {
      return (x >= -0.5 && x < 0.5) ? 1 : 0;
  } else {
      const left = (x + (n + 1) / 2) / n;
      const right = ((n + 1) / 2 - x) / n;
      return left * BSpline(n - 1, x + 0.5) + right * BSpline(n - 1, x - 0.5);
  }
}