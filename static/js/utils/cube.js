import { dotProduct } from './matrix.js';
import { scaleToCanvasSize } from './scale.js';

export const baseCube = [
  [-1, -1, -1],
  [-1, 1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, -1, 1],
  [-1, 1, 1],
  [1, -1, 1],
  [1, 1, 1],
]
export const baseCubePinhole = [[0, 0, 1]]
export const idxVerticesEdgesCube = [[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7]]
export const idxEdgesFacesCube = [
  [0, 1, 2, 3], // z=-1
  [4, 5, 6, 7], // z=1
  [3, 7, 8, 10], // y=-1
  [1, 5, 9, 11], // y=1
  [0, 4, 8, 9], // x=-1
  [2, 6, 10, 11], // x=1
]

export function getVisibleEdges(cube3DPts, idxEdgesFacesCube, idxVerticesEdgesCube, cameraLocation, refLocation) {
  const visibleEdges = []
  for (let faceIdx = 0; faceIdx < idxEdgesFacesCube.length; faceIdx++) {
    const edgesFace = idxEdgesFacesCube[faceIdx]
    const indicesPointsFace = []
    for (let edgeIdx of edgesFace) {
      const [i, j] = idxVerticesEdgesCube[edgeIdx]
      if (!indicesPointsFace.includes(i)) {
        indicesPointsFace.push(i)
      }
      if (!indicesPointsFace.includes(j)) {
        indicesPointsFace.push(j)
      }
    }
    const faceCenter = indicesPointsFace.map(idx => cube3DPts[idx]).reduce((acc, pt) => acc.map((val, idx) => val + pt[idx]), [0, 0, 0]).map(val => val / indicesPointsFace.length)
    const faceNormal = faceCenter.map((val, idx) => val - cameraLocation[idx])
    const faceRef = faceCenter.map((val, idx) => val - refLocation[idx])
    if (dotProduct(faceNormal, faceRef) < 0) {
      for (let edgeIdx of edgesFace) {
        if (!visibleEdges.includes(edgeIdx)) {
          visibleEdges.push(edgeIdx)
        }
      }
    }
  }
  return visibleEdges
}

export function getFilm(f, fMax, fMin) {
  // z_film = 0.5 * (f - self.sliders["f"].maximum()) / (self.sliders["f"].minimum() - self.sliders["f"].maximum())
  const zFilm = 0.5 * (f - fMax) / (fMin - fMax)
  return [
    [-1, -1, zFilm],
    [-1, 1, zFilm],
    [1, -1, zFilm],
    [1, 1, zFilm],
  ]
}

export function drawCubeFilmPinhole(ctx, canvas, cube3DPts, cube2DPts, film2DPts, pinhole2DPt, cameraLocation, refLocation) {
  // scale all points according to canvas size
  cube2DPts = scaleToCanvasSize(canvas, cube2DPts)
  film2DPts = scaleToCanvasSize(canvas, film2DPts)
  pinhole2DPt = scaleToCanvasSize(canvas, [pinhole2DPt])[0]
  const visibleEdges = getVisibleEdges(cube3DPts, idxEdgesFacesCube, idxVerticesEdgesCube, cameraLocation, refLocation);
  const idxVisibleEdgesCube = visibleEdges.map(idx => idxVerticesEdgesCube[idx])
  const idxCoveredEdgesCube = idxVerticesEdgesCube.filter((_, idx) => !visibleEdges.includes(idx))
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw cube
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  for (let [i, j] of idxVisibleEdgesCube) {
    ctx.beginPath();
    ctx.moveTo(cube2DPts[i][0], cube2DPts[i][1]);
    ctx.lineTo(cube2DPts[j][0], cube2DPts[j][1]);
    ctx.stroke();
  }
  ctx.strokeStyle = 'magenta';
  ctx.lineWidth = 1;
  for (let [i, j] of idxCoveredEdgesCube) {
    ctx.beginPath();
    ctx.moveTo(cube2DPts[i][0], cube2DPts[i][1]);
    ctx.lineTo(cube2DPts[j][0], cube2DPts[j][1]);
    ctx.stroke();
  }
  // Draw film, which is a trapezoid with four vertex. I wanna fill it with a transparent color and draw the edges
  ctx.strokeStyle = '#00D1CE';
  ctx.fillStyle = '#00D1CE';
  ctx.lineWidth = 2;
  for (let [i, j] of [[0, 1], [1, 3], [3, 2], [2, 0]]) {
    ctx.beginPath();
    ctx.moveTo(film2DPts[i][0], film2DPts[i][1]);
    ctx.lineTo(film2DPts[j][0], film2DPts[j][1]);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(film2DPts[0][0], film2DPts[0][1]);
  ctx.lineTo(film2DPts[1][0], film2DPts[1][1]);
  ctx.lineTo(film2DPts[3][0], film2DPts[3][1]);
  ctx.lineTo(film2DPts[2][0], film2DPts[2][1]);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  // Draw pinhole
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.arc(pinhole2DPt[0], pinhole2DPt[1], 2, 0, 2 * Math.PI);
  ctx.stroke();
}