import { refCamera, refHomography } from '../constants/cameraExtrinsicPost.js';
import { getCuboid } from '../cuboid.js';
import { multiplyMatrixVector } from '../matrix.js';
import { drawObjDOF, drawPt } from './drawObjDOF.js';

export function displayFrameView(ctx, canvas, vectorRefToPinhole, LengthsObj, paramsDOF, tranformDof, indicesPtsRef) {
  let obj3DPts = getCuboid(LengthsObj);
  obj3DPts = tranformDof(obj3DPts, paramsDOF, vectorRefToPinhole, indicesPtsRef);
  const obj2DPts = obj3DPts.map(pt => multiplyMatrixVector(refHomography, [pt[0], pt[1], pt[2], 1])).map(val => [val[0] / val[2], val[1] / val[2]]);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawObjDOF(ctx, canvas, obj3DPts, obj2DPts, [refCamera.tx, refCamera.ty, refCamera.tz], 5);
  for (let idxPt of indicesPtsRef) {
    drawPt(ctx, obj2DPts[idxPt], 'green');
  }
}