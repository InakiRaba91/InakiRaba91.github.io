import { getVisibleEdges, idxEdgesFacesCuboid, idxVerticesEdgesCuboid } from '../cuboid.js';
import { scaleToCanvasSize } from '../scale.js';

export function drawPt(ctx, pt, color) {
  ctx.beginPath();
  ctx.arc(pt[0], pt[1], 8, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawRayRefsToPinhole(ctx, canvas, pts, pinhole2D) {
  pts = scaleToCanvasSize(canvas, pts)
  for (let pt of pts) {
    // draw line to pinhole
    ctx.strokeStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(pt[0], pt[1]);
    ctx.lineTo(pinhole2D[0], pinhole2D[1]);
    ctx.stroke();
    // draw pt
    drawPt(ctx, pt, 'green');
  }
}

export function drawObjDOF(ctx, canvas, cuboid3DPts, cuboid2DPts, refLocation, thickness = 3) {
  // scale all points according to canvas size
  cuboid2DPts = scaleToCanvasSize(canvas, cuboid2DPts)
  const objCenter = cuboid3DPts.reduce((acc, val) => acc.map((v, idx) => v + val[idx] / cuboid3DPts.length), [0, 0, 0])
  const visibleEdges = getVisibleEdges(cuboid3DPts, idxEdgesFacesCuboid, idxVerticesEdgesCuboid, objCenter, refLocation);
  const idxVisibleEdgesCube = visibleEdges.map(idx => idxVerticesEdgesCuboid[idx])
  const idxCoveredEdgesCube = idxVerticesEdgesCuboid.filter((_, idx) => !visibleEdges.includes(idx))
  // Draw cube
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = thickness;
  for (let [i, j] of idxVisibleEdgesCube) {
    ctx.beginPath();
    ctx.moveTo(cuboid2DPts[i][0], cuboid2DPts[i][1]);
    ctx.lineTo(cuboid2DPts[j][0], cuboid2DPts[j][1]);
    ctx.stroke();
  }
  ctx.strokeStyle = 'cyan';
  ctx.lineWidth = 1;
  for (let [i, j] of idxCoveredEdgesCube) {
    ctx.beginPath();
    ctx.moveTo(cuboid2DPts[i][0], cuboid2DPts[i][1]);
    ctx.lineTo(cuboid2DPts[j][0], cuboid2DPts[j][1]);
    ctx.stroke();
  }
}