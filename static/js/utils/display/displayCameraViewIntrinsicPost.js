import { getRotationMatrix } from '../camera.js';
import { refHomography, refCamera } from '../constants/cameraIntrinsicPost.js';
import { getCuboid, baseCuboidPinhole, drawCubeFilmPinhole, getFilmExaggerated } from '../cuboid.js';
import { multiplyMatrixVector } from '../matrix.js';

export function displayCameraView(ctx, canvas, camera, fMax, fMin, cubeSize = 10) {
  const {f, tx, ty, tz, rx, ry, rz} = camera;
  const R = getRotationMatrix(rx, ry, rz);
  const E = [
    [R[0][0], R[0][1], R[0][2], tx],
    [R[1][0], R[1][1], R[1][2], ty],
    [R[2][0], R[2][1], R[2][2], tz]
  ];
  const Lengths = {x: 2 * cubeSize, y: 2 * cubeSize, z: 2 * cubeSize};
  let baseFilm = getFilmExaggerated(f, fMax, fMin, Lengths);
  baseFilm = baseFilm.map(pt => [pt[0], pt[1], pt[2] - cubeSize]); // Shift pinhole to origin
  let baseCuboid = getCuboid(Lengths);
  baseCuboid = baseCuboid.map(pt => [pt[0], pt[1], pt[2] - cubeSize]); // Shift pinhole to origin
  const cuboid3DPts = baseCuboid.map(pt => multiplyMatrixVector(E, [pt[0], pt[1], pt[2], 1]));
  const film3DPts = baseFilm.map(pt => multiplyMatrixVector(E, [pt[0] * Lengths.x / 2, pt[1] * Lengths.y / 2, pt[2] * Lengths.z / 2, 1]));
  const pinhole3DPt = multiplyMatrixVector(E, [baseCuboidPinhole[0][0] * Lengths.x / 2, baseCuboidPinhole[0][1] * Lengths.y / 2, baseCuboidPinhole[0][2] * Lengths.z / 2, 1]);
  const cuboid2DPts = cuboid3DPts.map(pt => multiplyMatrixVector(refHomography, [pt[0], pt[1], pt[2], 1])).map(val => [val[0] / val[2], val[1] / val[2]]);
  const film2DPts = film3DPts.map(pt => multiplyMatrixVector(refHomography, [pt[0], pt[1], pt[2], 1])).map(val => [val[0] / val[2], val[1] / val[2]]);
  let pinhole2DPt = multiplyMatrixVector(refHomography, [pinhole3DPt[0], pinhole3DPt[1], pinhole3DPt[2], 1])
  pinhole2DPt = [pinhole2DPt[0] / pinhole2DPt[2], pinhole2DPt[1] / pinhole2DPt[2]];
  drawCubeFilmPinhole(ctx, canvas, cuboid3DPts, cuboid2DPts, film2DPts, pinhole2DPt, [tx, ty, tz], [refCamera.tx, refCamera.ty, refCamera.tz]);
}