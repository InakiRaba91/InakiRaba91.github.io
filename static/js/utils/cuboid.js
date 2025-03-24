import { dotProduct } from './matrix.js';
import { scaleToCanvasSize } from './scale.js';
import { baseImageSize } from './imageSize.js';

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

export const baseCuboidPinhole = [[0, 0, 0]]
export const idxVerticesEdgesCuboid = [[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7]]
export const idxEdgesFacesCuboid = [
  [0, 1, 2, 3], // z=-1
  [4, 5, 6, 7], // z=1
  [3, 7, 8, 10], // y=-1
  [1, 5, 9, 11], // y=1
  [0, 4, 8, 9], // x=-1
  [2, 6, 10, 11], // x=1
]

export function getCuboid(lengths = {x: 2, y: 2, z: 2}) {
  const x = lengths.x / 2
  const y = lengths.y / 2
  const z = lengths.z / 2
  // We want the pinhole at the origin
  return [
    [-x, -y, -z],
    [-x, y, -z],
    [x, -y, -z],
    [x, y, -z],
    [-x, -y, z],
    [-x, y, z],
    [x, -y, z],
    [x, y, z],
  ]
}

export function getVisibleEdges(cuboid3DPts, idxEdgesFacesCuboid, idxVerticesEdgesCuboid, cameraLocation, refLocation) {
  const visibleEdges = []
  for (let faceIdx = 0; faceIdx < idxEdgesFacesCuboid.length; faceIdx++) {
    const edgesFace = idxEdgesFacesCuboid[faceIdx]
    const indicesPointsFace = []
    for (let edgeIdx of edgesFace) {
      const [i, j] = idxVerticesEdgesCuboid[edgeIdx]
      if (!indicesPointsFace.includes(i)) {
        indicesPointsFace.push(i)
      }
      if (!indicesPointsFace.includes(j)) {
        indicesPointsFace.push(j)
      }
    }
    const faceCenter = indicesPointsFace.map(idx => cuboid3DPts[idx]).reduce((acc, pt) => acc.map((val, idx) => val + pt[idx]), [0, 0, 0]).map(val => val / indicesPointsFace.length)
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

function getFilmFromZ(zFilmBase, lengths = {x: 2, y: 2, z: 2}) {
  const x = lengths.x / 2
  const y = lengths.y / 2
  const z = zFilmBase * lengths.z / 2
  return [
    [-x, -y, z],
    [-x, y, z],
    [x, -y, z],
    [x, y, z],
  ]
}

export function getFilmExaggerated(f, fMax, fMin, lengths = {x: 2, y: 2, z: 2}) {
  // z_film = 0.5 * (f - self.sliders["f"].maximum()) / (self.sliders["f"].minimum() - self.sliders["f"].maximum())
  const zFilmBase = 0.5 * (f - fMax) / (fMin - fMax) - 1
  return getFilmFromZ(zFilmBase, lengths)
}

export function getFilm(f, lengths = {x: 2, y: 2, z: 2}, imageSize = baseImageSize) {
  const zFilmBase = 1 - 2 * f / imageSize.height
  return getFilmFromZ(zFilmBase, lengths)
}

export function drawCubeFilmPinhole(ctx, canvas, cuboid3DPts, cuboid2DPts, film2DPts, pinhole2DPt, cameraLocation, refLocation) {
  // scale all points according to canvas size
  cuboid2DPts = scaleToCanvasSize(canvas, cuboid2DPts)
  film2DPts = scaleToCanvasSize(canvas, film2DPts)
  pinhole2DPt = scaleToCanvasSize(canvas, [pinhole2DPt])[0]
  const visibleEdges = getVisibleEdges(cuboid3DPts, idxEdgesFacesCuboid, idxVerticesEdgesCuboid, cameraLocation, refLocation);
  const idxVisibleEdgesCube = visibleEdges.map(idx => idxVerticesEdgesCuboid[idx])
  const idxCoveredEdgesCube = idxVerticesEdgesCuboid.filter((_, idx) => !visibleEdges.includes(idx))
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw cube
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  for (let [i, j] of idxVisibleEdgesCube) {
    ctx.beginPath();
    ctx.moveTo(cuboid2DPts[i][0], cuboid2DPts[i][1]);
    ctx.lineTo(cuboid2DPts[j][0], cuboid2DPts[j][1]);
    ctx.stroke();
  }
  ctx.strokeStyle = 'magenta';
  ctx.lineWidth = 1;
  for (let [i, j] of idxCoveredEdgesCube) {
    ctx.beginPath();
    ctx.moveTo(cuboid2DPts[i][0], cuboid2DPts[i][1]);
    ctx.lineTo(cuboid2DPts[j][0], cuboid2DPts[j][1]);
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