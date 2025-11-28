import { determinant3x3, dotProduct, inverseMatrix, matrixProduct, transposeMatrix } from './matrix.js';
import { substractVector, scaleVector } from './vector.js';
import { eigenDecomposition, SVD } from './svd.js';

/**
 * Get the conic matrix representation of a sphere in 3D space
 * 
 * @param {Array<number>} ballPosition - 3D position [x, y, z]
 * @param {number} ballRadius - Radius of the sphere
 * @returns {Array<Array<number>>} 4x4 conic matrix
 */
export function getSphereConicMatrix(ballPosition, ballRadius) {
  return [
    [1, 0, 0, -ballPosition[0]],
    [0, 1, 0, -ballPosition[1]],
    [0, 0, 1, -ballPosition[2]],
    [-ballPosition[0], -ballPosition[1], -ballPosition[2], ballPosition[0]**2 + ballPosition[1]**2 + ballPosition[2]**2 - ballRadius**2]
  ];
}

/**
 * Obtain the 2D conic projection of a ball from its 3D position
 * 
 * @param {Array<number>} ballPosition - 3D position [x, y, z]
 * @param {number} ballRadius - Radius of the ball
 * @param {Array<Array<number>>} homographyMatrix - 3x4 homography matrix
 * @returns {Array<Array<number>>} 3x3 conic matrix
 */
export function obtainBallConic(ballPosition, ballRadius, homographyMatrix) {
  const Q = getSphereConicMatrix(ballPosition, ballRadius);
  const Q_inv = inverseMatrix(Q);
  const C_inv = matrixProduct(matrixProduct(homographyMatrix, Q_inv), transposeMatrix(homographyMatrix));
  const C = inverseMatrix(C_inv);
  return C;
}

/**
 * Get the projection cone from a 2D ellipse (conic)
 * Back-projects a 2D conic to a 3D cone
 * 
 * @param {Array<Array<number>>} C - 3x3 conic matrix
 * @param {Array<Array<number>>} H - 3x4 homography matrix
 * @returns {Array<Array<number>>} 4x4 cone matrix
 */
export function getProjectionConeFromEllipse(C, H) {
  const H_T = transposeMatrix(H);
  const Q = matrixProduct(matrixProduct(H_T, C), H);
  // return 3x3 upper-left submatrix as 4x4 matrix
  return [
    [Q[0][0], Q[0][1], Q[0][2]],
    [Q[1][0], Q[1][1], Q[1][2]],
    [Q[2][0], Q[2][1], Q[2][2]],
  ];
}

/**
 * Estimate the 3D ball location from its projection
 * This is a placeholder that returns the actual position for demonstration
 * In practice, you would implement the SVD-based estimation described in the post
 * ]
 * @param {Array<number>} ballPosition - Actual 3D position [x, y, z] (for demo purposes)
 * @param {number} ballRadius - Radius of the ball
 * @param {Array<Array<number>>} homographyMatrix - 3x4 homography matrix
 * @returns {Array<number>} Estimated 3D position [x, y, z]
 */
export function estimateBallLocation(Q, ballRadius, cameraCenter) {
  const { P, D } = eigenDecomposition(Q);
  
  let eigvec_cone_axis;
  let eigval_cone_axis;
  let eigval_perp;
  
  for (let i = 0; i < 3; i++) {
    const others = D.filter((_, j) => j !== i);
    if (Math.sign(D[i]) !== Math.sign(others[0]) && Math.sign(others[0]) === Math.sign(others[1])) {
      eigvec_cone_axis = [P[0][i], P[1][i], P[2][i]];
      eigval_cone_axis = D[i];
      eigval_perp = others[0];
      break;
    }
  }
  const s = dotProduct(cameraCenter, eigvec_cone_axis);
  if (s < 0) {
    eigvec_cone_axis = scaleVector(eigvec_cone_axis, -1);
  }
  
  const sin_theta = Math.sqrt(eigval_cone_axis / (eigval_cone_axis - eigval_perp));
  const d = ballRadius / sin_theta;
  const ballPositionEst = substractVector(cameraCenter, scaleVector(eigvec_cone_axis, d));

  // return estimated position with a single decimal point
  return ballPositionEst.map(coord => Math.round(coord * 10) / 10);
}
