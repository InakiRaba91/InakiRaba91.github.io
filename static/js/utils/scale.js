
import { baseImageSize } from './imageSize.js';

export function scaleToCanvasSize(canvas, pts, imageSize = baseImageSize) {
    return pts.map(pt => [pt[0] * canvas.width / imageSize.width, pt[1] * canvas.height / imageSize.height])
  }