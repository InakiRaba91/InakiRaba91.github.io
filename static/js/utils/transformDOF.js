import { rotatePoints } from './camera.js';
import { substractVector, crossProduct, scaleVector, normalizeVector, addVector, normVector } from './vector.js';
import { dotProduct } from './matrix.js';
import { quadraticRoots } from './quadraticRoots.js';

export function transform6DOFObject(pts, paramsDOF, v, idx) {
  const {tx, ty, tz, rx, ry, rz} = paramsDOF;
  const T = [tx, ty, tz].map(val => parseFloat(val));
  pts = pts.map(pt => addVector(pt, T));
  const ptCenter = pts.reduce((acc, val) => acc.map((v, idx) => v + val[idx] / pts.length), [0, 0, 0])
  console.log("pts1", pts);
  pts = rotatePoints(pts, rx, ptCenter, [1, 0, 0]);
  console.log("pt2s", pts);
  pts = rotatePoints(pts, ry, ptCenter, [0, 1, 0]);
  pts = rotatePoints(pts, rz, ptCenter, [0, 0, 1]);
  return pts;
}

export function transform4DOFObject(pts, paramsDOF, v, idx) {
  v = v[0];
  idx = idx[0];
  const {t, rx, ry, rz} = paramsDOF;
  pts = pts.map(pt => addVector(pt, scaleVector(v, t)));
  pts = rotatePoints(pts, rx, pts[idx], [1, 0, 0]);
  pts = rotatePoints(pts, ry, pts[idx], [0, 1, 0]);
  pts = rotatePoints(pts, rz, pts[idx], [0, 0, 1]);
  return pts;
}

export function transform2DOFObject(pts, paramsDOF, v, indices) {
  const [v1, v2] = v;
  const [idx1, idx2] = indices;
  const {t, r} = paramsDOF;
  const v3 = substractVector(pts[idx2], pts[idx1]);
  let axis = crossProduct(v1, v3);
  axis = normalizeVector(axis);
  // p1 = pts[[idx1]]
  // p2 = pts[[idx2]]
  // P1 = p1 + t * v1
  // P2 = p2 + s * v2
  // (P2 - P1)^2 = (p2 - p1)^2 = L
  // (p2 + s * v2 - P1)^2 = L
  // s^2 * v2^2 + 2 * s * v2 * (p2 - P1) + (p2 - P1)^2 = L  (w = p2 - P1)
  // s^2 * v2^2 + s * (2 * v2 * w) + (w^2 - L) = 0
  const P1 = addVector(pts[idx1], scaleVector(v1, t));
  const L = normVector(v3) ** 2;
  const w = substractVector(pts[idx2], P1);
  const a = normVector(v2) ** 2;
  const b = 2 * dotProduct(v2, w);
  const c = normVector(w) ** 2 - L;
  let s = quadraticRoots([a, b, c]);
  s = Math.min(...s);
  const P2 = addVector(pts[idx2], scaleVector(v2, s));
  const w1 = substractVector(P2, P1);
  const w2 = substractVector(addVector(pts[idx2], scaleVector(v2, t)), P1);
  let theta = 180 * Math.acos(dotProduct(w1, w2) / (normVector(w1) * normVector(w2))) / Math.PI;
  pts = pts.map(pt => addVector(pt, scaleVector(v1, t)));
  pts = rotatePoints(pts, theta, P1, axis);
  axis = normalizeVector(substractVector(P2, P1));
  pts = rotatePoints(pts, r, P1, axis);
  return pts;
}