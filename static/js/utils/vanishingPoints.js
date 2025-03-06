import { multiplyMatrixVector } from './matrix.js';
import { basketballCourtSize } from './pitch.js';
import { scaleToCanvasSize } from './scale.js';

export function getVanishingPoints(H) {
  const tol = 1e-4;
  if (Math.abs(H[2][0]) > tol && Math.abs(H[2][1]) > tol) {
    const vp1 = [H[0][0] / H[2][0], H[1][0] / H[2][0]];
    const vp2 = [H[0][1] / H[2][1], H[1][1] / H[2][1]];
    return [vp1, vp2];
  } else {
    return null;
  }
}

export function drawVanishingPoints(H, vp1, vp2, ctx, pitchSize = basketballCourtSize) {
  let bottomLeft = multiplyMatrixVector(H, [-pitchSize.width / 2, pitchSize.height / 2, 0, 1]);
  bottomLeft = [bottomLeft[0] / bottomLeft[2], bottomLeft[1] / bottomLeft[2]];
  let topRight = multiplyMatrixVector(H, [pitchSize.width / 2, -pitchSize.height / 2, 0, 1]);
  topRight = [topRight[0] / topRight[2], topRight[1] / topRight[2]];
  let bottomRight = multiplyMatrixVector(H, [pitchSize.width / 2, pitchSize.height / 2, 0, 1]);
  bottomRight = [bottomRight[0] / bottomRight[2], bottomRight[1] / bottomRight[2]];
  [vp1, vp2, bottomLeft, topRight, bottomRight] = scaleToCanvasSize(ctx.canvas, [vp1, vp2, bottomLeft, topRight, bottomRight]);
  ctx.beginPath();
  ctx.moveTo(vp1[0], vp1[1]);
  ctx.lineTo(topRight[0], topRight[1]);
  ctx.strokeStyle = 'orange';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(vp1[0], vp1[1]);
  ctx.lineTo(bottomRight[0], bottomRight[1]);
  ctx.strokeStyle = 'orange';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(vp2[0], vp2[1]);
  ctx.lineTo(bottomLeft[0], bottomLeft[1]);
  ctx.strokeStyle = 'cyan';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(vp2[0], vp2[1]);
  ctx.lineTo(bottomRight[0], bottomRight[1]);
  ctx.strokeStyle = 'cyan';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.arc(vp1[0], vp1[1], 6, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = 'blue';
  ctx.arc(vp2[0], vp2[1], 6, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
}