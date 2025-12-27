import { matrixProduct } from './matrix.js';
import { getEllipseParams } from './ellipse.js';
import { baseImageSize } from './imageSize.js';
import { obtainBallConic, getProjectionConeFromEllipse } from './conic.js';

export function drawBallProjection(canvas, ballPosition, ballRadius, homographyMatrix, homographyCenteredMatrix, fillColor, lineColor) {
  const ctx = canvas.getContext('2d');
  const KCanvas = [
    [canvas.width / baseImageSize.width, 0, 0],
    [0, canvas.height / baseImageSize.height, 0],
    [0, 0, 1]
  ];
  const homographyMatrixCanvas = matrixProduct(KCanvas, homographyMatrix);
  const C = obtainBallConic(ballPosition, ballRadius, homographyMatrixCanvas);
  
  let Q = null;
  if (homographyCenteredMatrix) {
    const homographyCenteredMatrixCanvas = matrixProduct(KCanvas, homographyCenteredMatrix);
    Q = getProjectionConeFromEllipse(C, homographyCenteredMatrixCanvas);
  }

  let { x0, y0, a, b, angle } = getEllipseParams(C);
  const angle_rads = angle * Math.PI / 180;
  ctx.beginPath();
  ctx.ellipse(x0, y0, a, b, angle_rads, 0, 2 * Math.PI);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  return Q;
}
