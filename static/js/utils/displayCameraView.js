import { getRotationMatrix, refCamera, refHomography } from './camera.js';
import { baseCube, baseCubePinhole, drawCubeFilmPinhole, getFilm } from './cube.js';
import { multiplyMatrixVector } from './matrix.js';

export function displayCameraView(ctx, canvas, camera, fMax, fMin, cubeSize = 10) {
  const {f, tx, ty, tz, rx, ry, rz} = camera;
  const R = getRotationMatrix(rx, ry, rz);
  const E = [
    [R[0][0], R[0][1], R[0][2], tx],
    [R[1][0], R[1][1], R[1][2], ty],
    [R[2][0], R[2][1], R[2][2], tz]
  ];
  const baseFilm = getFilm(f, fMax, fMin);
  const cube3DPts = baseCube.map(pt => multiplyMatrixVector(E, [pt[0] * cubeSize, pt[1] * cubeSize, pt[2] * cubeSize, 1]));
  const film3DPts = baseFilm.map(pt => multiplyMatrixVector(E, [pt[0] * cubeSize, pt[1] * cubeSize, pt[2] * cubeSize, 1]));
  const pinhole3DPt = multiplyMatrixVector(E, [baseCubePinhole[0][0] * cubeSize, baseCubePinhole[0][1] * cubeSize, baseCubePinhole[0][2] * cubeSize, 1]);
  const cube2DPts = cube3DPts.map(pt => multiplyMatrixVector(refHomography, [pt[0], pt[1], pt[2], 1])).map(val => [val[0] / val[2], val[1] / val[2]]);
  const film2DPts = film3DPts.map(pt => multiplyMatrixVector(refHomography, [pt[0], pt[1], pt[2], 1])).map(val => [val[0] / val[2], val[1] / val[2]]);
  let pinhole2DPt = multiplyMatrixVector(refHomography, [pinhole3DPt[0], pinhole3DPt[1], pinhole3DPt[2], 1])
  pinhole2DPt = [pinhole2DPt[0] / pinhole2DPt[2], pinhole2DPt[1] / pinhole2DPt[2]];
  drawCubeFilmPinhole(ctx, canvas, cube3DPts, cube2DPts, film2DPts, pinhole2DPt, [tx, ty, tz], [refCamera.tx, refCamera.ty, refCamera.tz]);
}