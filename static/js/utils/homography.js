import { multiplyMatrixVector, inverseMatrix } from './matrix.js';

export function backProjectPt(ptImgCanvas, homography, PitchDims, imgCanvasSize, pitchCanvasSize, origFrameSize) {
  const [pH, pW] = [PitchDims.height, PitchDims.width];
  const [pcH, pcW] = [pitchCanvasSize.height, pitchCanvasSize.width];
  const [icH, icW] = [imgCanvasSize.height, imgCanvasSize.width];
  const [fH, fW] = [origFrameSize.height, origFrameSize.width];
  const ptImg = { x: ptImgCanvas.x * fW / icW, y: ptImgCanvas.y * fH / icH };
  const homography_inv = inverseMatrix(homography);
  let [x, y, z] = multiplyMatrixVector(homography_inv, [ptImg.x, ptImg.y, 1]);
  const xNorm = x / z;
  const yNorm = y / z;
  const xImgPitchCanvas = (xNorm + pW / 2) * pcW / pW;
  const yImgPitchCanvas = (yNorm + pH / 2) * pcH / pH;
  return { x: xImgPitchCanvas, y: yImgPitchCanvas };
}

export function projectPt(ptImgPitchCanvas, homography, PitchDims, imgCanvasSize, pitchCanvasSize, origFrameSize) {
  const [pH, pW] = [PitchDims.height, PitchDims.width];
  const [pcH, pcW] = [pitchCanvasSize.height, pitchCanvasSize.width];
  const [icH, icW] = [imgCanvasSize.height, imgCanvasSize.width];
  const [fH, fW] = [origFrameSize.height, origFrameSize.width];
  const xPitch = (ptImgPitchCanvas.x * pW / pcW) - pW / 2;
  const yPitch = (ptImgPitchCanvas.y * pH / pcH) - pH / 2;
  let [x, y, z] = multiplyMatrixVector(homography, [xPitch, yPitch, 1]);
  const xFrame = x / z;
  const yFrame = y / z;
  return { x: xFrame * icW / fW, y: yFrame * icH / fH };
}