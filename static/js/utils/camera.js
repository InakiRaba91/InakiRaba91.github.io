import { matrixProduct, multiplyMatrixVector, transposeMatrix } from './matrix.js';
import { baseImageSize } from './imageSize.js';

export function getIntrinsicMatrix(fx, fy=fx, s=0, cx = baseImageSize.width / 2, cy = baseImageSize.height / 2) {
  return [
    [fx, 0, cx],
    [0, fy, cy],
    [0, 0, 1]
  ];
}

export function getRotationMatrix(rx, ry, rz) {
  const cosX = Math.cos(rx * Math.PI / 180);
  const sinX = Math.sin(rx * Math.PI / 180);
  const cosY = Math.cos(ry * Math.PI / 180);
  const sinY = Math.sin(ry * Math.PI / 180);
  const cosZ = Math.cos(rz * Math.PI / 180);
  const sinZ = Math.sin(rz * Math.PI / 180);

  const Rx = [
    [1, 0, 0],
    [0, cosX, -sinX],
    [0, sinX, cosX]
  ];
  const Ry = [
    [cosY, 0, sinY],
    [0, 1, 0],
    [-sinY, 0, cosY]
  ];
  const Rz = [
    [cosZ, -sinZ, 0],
    [sinZ, cosZ, 0],
    [0, 0, 1]
  ];
  return matrixProduct(matrixProduct(Rz, Ry), Rx);
}

export function getRotationMatrixAxisAngle(axis, angle) {
  const [ux, uy, uz] = axis;
  const c = Math.cos(angle * Math.PI / 180);
  const s = Math.sin(angle * Math.PI / 180);
  return [
    [ux * ux * (1 - c) + c, ux * uy * (1 - c) - uz * s, ux * uz * (1 - c) + uy * s],
    [ux * uy * (1 - c) + uz * s, uy * uy * (1 - c) + c, uy * uz * (1 - c) - ux * s],
    [ux * uz * (1 - c) - uy * s, uy * uz * (1 - c) + ux * s, uz * uz * (1 - c) + c],
  ];
}

export function rotatePoints(pts, angle, pt, axis) {
  const R = getRotationMatrixAxisAngle(axis, angle);
  return pts.map(p => multiplyMatrixVector(R, p.map((val, i) => val - pt[i])).map((val, i) => val + pt[i]));
}

export function getExtrinsicMatrix(tx, ty, tz, rx, ry, rz) {
  const R = getRotationMatrix(rx, ry, rz);
  const Rt = transposeMatrix(R);
  const negRt = Rt.map(row => row.map(val => -val));
  const T = multiplyMatrixVector(negRt, [tx, ty, tz]);
  return [
    [Rt[0][0], Rt[0][1], Rt[0][2], T[0]],
    [Rt[1][0], Rt[1][1], Rt[1][2], T[1]],
    [Rt[2][0], Rt[2][1], Rt[2][2], T[2]]
  ];
}

export function getHomographyMatrix(camera) {
  const {f, tx, ty, tz, rx, ry, rz} = camera;
  const K = getIntrinsicMatrix(f);
  const E = getExtrinsicMatrix(tx, ty, tz, rx, ry, rz);
  return matrixProduct(K, E);
}

export function projectPt(pts3d, camera) {
  const homography = getHomographyMatrix(camera);
  const pts2d = matrixProduct(homography, pts3d);
  return pts2d.map(pt => pt / pt[2]);
}