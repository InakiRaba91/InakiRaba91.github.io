import { getHomographyMatrix } from './camera.js';
import { matrixProduct } from './matrix.js';
import { baseImageSize } from './imageSize.js';
import { basketballCourtSize, getIntrinsicImageToPitchMatrix } from './pitch.js';
import { getVanishingPoints, drawVanishingPoints } from './vanishingPoints.js';

export function displayFrameView(img, canvas, camera, displayVanishingPoints = false) {
  const homographyMatrix = getHomographyMatrix(camera);
  const K = getIntrinsicImageToPitchMatrix(basketballCourtSize);
  let H_chained = matrixProduct(homographyMatrix, K);
  H_chained = H_chained.map(row => row.filter((_, i) => i !== 2));
  const M = new cv.Mat(3, 3, cv.CV_64FC1);
  M.data64F.set(H_chained.flat());
  const im = cv.imread(img);
  let transformedIm = new cv.Mat();
  cv.warpPerspective(im, transformedIm, M, new cv.Size(baseImageSize.width, baseImageSize.height));
  cv.imshow(canvas, transformedIm);
  im.delete();
  transformedIm.delete();
  M.delete();
  if (displayVanishingPoints) {
    const ctx = canvas.getContext('2d');
    const vps = getVanishingPoints(homographyMatrix);
    if (vps) {
      drawVanishingPoints(homographyMatrix, vps[0], vps[1], ctx);
    }
  }
}