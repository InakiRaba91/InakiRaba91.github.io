export function legendrePolynomial(n, x) {
    switch (n) {
        case 0: return 1;
        case 1: return x;
        case 2: return 0.5 * (3 * Math.pow(x, 2) - 1);
        case 3: return 0.5 * (5 * Math.pow(x, 3) - 3 * x);
        case 4: return 0.125 * (35 * Math.pow(x, 4) - 30 * Math.pow(x, 2) + 3);
        case 5: return 0.125 * (63 * Math.pow(x, 5) - 70 * Math.pow(x, 3) + 15 * x);
        case 6: return 0.0625 * (231 * Math.pow(x, 6) - 315 * Math.pow(x, 4) + 105 * Math.pow(x, 2) - 5);
        case 7: return 0.0625 * (429 * Math.pow(x, 7) - 693 * Math.pow(x, 5) + 315 * Math.pow(x, 3) - 35 * x);
        case 8: return 0.0078125 * (6435 * Math.pow(x, 8) - 12012 * Math.pow(x, 6) + 6930 * Math.pow(x, 4) - 1260 * Math.pow(x, 2) + 35);
        case 9: return 0.0078125 * (12155 * Math.pow(x, 9) - 25740 * Math.pow(x, 7) + 18018 * Math.pow(x, 5) - 4620 * Math.pow(x, 3) + 315 * x);
        case 10: return 0.00390625 * (46189 * Math.pow(x, 10) - 109395 * Math.pow(x, 8) + 90090 * Math.pow(x, 6) - 30030 * Math.pow(x, 4) + 3465 * Math.pow(x, 2) - 63);
        default: return 0;
    }
}

export function LegendreSquaredNorm(n) {
    return 2 / (2 * n + 1);
}

export function computeLegendreCoefficients(funcStr, degree) {
    const coefficients = [];
    let m = 100;
    const a = -1;
    const b = 1;
    const h = (b - a) / (2 * m);
    for (let n = 0; n <= degree; n++) {
      let integral = 0;
      let norm_legendre = 0;
      for (let i = -m; i <= m; i++) {
        const xi = i / m;
        const fx = math.evaluate(funcStr, { x: xi });
        const Ln = legendrePolynomial(n, xi);
        integral += fx * Ln; 
        norm_legendre += Math.pow(Ln, 2);
      }
      integral *= h; // Approximate the integral
      norm_legendre *= h; // Approximate the norm of the Legendre polynomial
      const c = integral / norm_legendre;
      coefficients.push(c);
    }
    return coefficients;
}

export function approximateFunctionLegendre(x, coefficients) {
    let approximation = 0;
    for (let n = 0; n < coefficients.length; n++) {
        approximation += coefficients[n] * legendrePolynomial(n, x);
    }
    return approximation;
}

export function legendreRoots(n) {
    switch (n) {
      case 0: return [];
      case 1: return [0];
      case 2: return [-1 / Math.sqrt(3), 1 / Math.sqrt(3)];
      case 3: return [-Math.sqrt(3 / 5), 0, Math.sqrt(3 / 5)];
      case 4: return [-Math.sqrt(3 / 7 + 2 / 7 * Math.sqrt(6 / 5)), -Math.sqrt(3 / 7 - 2 / 7 * Math.sqrt(6 / 5)), Math.sqrt(3 / 7 - 2 / 7 * Math.sqrt(6 / 5)), Math.sqrt(3 / 7 + 2 / 7 * Math.sqrt(6 / 5))];
      case 5: return [-Math.sqrt(5 / 9 + 2 / 9 * Math.sqrt(10 / 7)), -Math.sqrt(5 / 9 - 2 / 9 * Math.sqrt(10 / 7)), 0, Math.sqrt(5 / 9 - 2 / 9 * Math.sqrt(10 / 7)), Math.sqrt(5 / 9 + 2 / 9 * Math.sqrt(10 / 7))];
      default: return [];
    }
}
  
export function legendreWeights(n) {
    switch (n) {
      case 0: return [];
      case 1: return [2];
      case 2: return [1, 1];
      case 3: return [5 / 9, 8 / 9, 5 / 9];
      case 4: return [(18 - Math.sqrt(30)) / 36, (18 + Math.sqrt(30)) / 36, (18 + Math.sqrt(30)) / 36, (18 - Math.sqrt(30)) / 36];
      case 5: return [(322 - 13 * Math.sqrt(70)) / 900, (322 + 13 * Math.sqrt(70)) / 900, 128 / 225, (322 + 13 * Math.sqrt(70)) / 900, (322 - 13 * Math.sqrt(70)) / 900];
      default: return [];
    }
}

export function GaussianQuadrature(funcStr, n) {
    let integral = 0;
    const roots = legendreRoots(n);
    const weights = legendreWeights(n);
    for (let i = 0; i < n; i++) {
      const xi = roots[i];
      const wi = weights[i];
      const fx = math.evaluate(funcStr, { x: xi });
      integral += wi * fx;
    }
    return integral;
}