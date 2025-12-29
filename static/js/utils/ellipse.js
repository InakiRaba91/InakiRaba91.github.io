/**
 * Extract ellipse parameters from a conic matrix representation
 * Following the naming from https://en.wikipedia.org/wiki/Ellipse#General_ellipse
 * 
 * @param {Array<Array<number>>} M - 3x3 conic matrix
 * @param {number} tol - tolerance for numerical comparisons (default: 1e-6)
 * @returns {Object} Ellipse parameters: {x0, y0, a, b, angle}
 */
export function getEllipseParams(M, tol = 1e-6) {
  const A = M[0][0];
  const B = 2 * M[0][1];
  const D = 2 * M[0][2];
  const C = M[1][1];
  const E = 2 * M[1][2];
  const F = M[2][2];

  const den = B * B - 4 * A * C;
  const num0 = 2 * (A * (E * E) + C * (D * D) - B * D * E + den * F);
  const sqrtTerm = Math.sqrt((A - C) ** 2 + (B * B));
  const num_a = A + C - sqrtTerm;
  const num_b = A + C + sqrtTerm;
  
  const a = -Math.sqrt(num0 * num_a) / den;
  const b = -Math.sqrt(num0 * num_b) / den;
  const x0 = (2 * C * D - B * E) / den;
  const y0 = (2 * A * E - B * D) / den;

  let angle;
  if (Math.abs(B) > tol) {
    const rads = Math.atan((C - A - sqrtTerm) / B);
    angle = 90 + (rads * 180 / Math.PI);
  } else if (A < C) {
    angle = 90;
  } else {
    angle = 180;
  }

  return { x0, y0, a, b, angle };
}

/**
 * Convert ellipse parameters to a conic matrix representation
 * This is the inverse of getEllipseParams
 * 
 * @param {number} a - Semi-major axis
 * @param {number} b - Semi-minor axis
 * @param {number} x0 - Center x coordinate
 * @param {number} y0 - Center y coordinate
 * @param {number} angle - Rotation angle in degrees
 * @returns {Array<Array<number>>} 3x3 conic matrix
 */
export function getEllipseMatrix(a, b, x0, y0, angle) {
  const theta = (angle * Math.PI) / 180;
  const A = (a * Math.sin(theta)) ** 2 + (b * Math.cos(theta)) ** 2;
  const B = 2 * ((b ** 2) - (a ** 2)) * Math.sin(theta) * Math.cos(theta);
  const C = (a * Math.cos(theta)) ** 2 + (b * Math.sin(theta)) ** 2;
  const D = -2 * A * x0 - B * y0;
  const E = -B * x0 - 2 * C * y0;
  const F = A * (x0 ** 2) + B * x0 * y0 + C * (y0 ** 2) - (a * b) ** 2;
  
  return [
    [A, B / 2, D / 2],
    [B / 2, C, E / 2],
    [D / 2, E / 2, F]
  ];
}

/**
 * Draw an ellipse on a canvas from a conic matrix representation
 * 
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Array<Array<number>>} M - 3x3 conic matrix
 * @param {Object} options - Drawing options
 * @param {string} options.fillColor - Fill color (default: 'rgb(165, 42, 42)')
 * @param {string} options.strokeColor - Stroke color (optional)
 * @param {number} options.lineWidth - Line width for stroke (default: 0)
 * @param {number} tol - tolerance for numerical comparisons (default: 1e-6)
 */
export function drawEllipseFromConic(ctx, M, options = {}, tol = 1e-6) {
  const {
    fillColor = 'rgb(165, 42, 42)',
    strokeColor = null,
    lineWidth = 0,
    scale = 2
  } = options;

  let { x0, y0, a, b, angle } = getEllipseParams(M, tol);
  x0 = x0 / scale;
  y0 = y0 / scale;
  a = a / scale;
  b = b / scale;

  ctx.save();
  ctx.translate(x0, y0);
  ctx.rotate((angle * Math.PI) / 180);
  
  ctx.beginPath();
  ctx.ellipse(0, 0, a, b, 0, 0, 2 * Math.PI);
  
  ctx.fillStyle = fillColor;
  ctx.fill();
  
  if (strokeColor && lineWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  
  ctx.restore();
}
