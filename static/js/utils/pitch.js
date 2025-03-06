import { baseImageSize } from './imageSize.js';

export const basketballCourtSize = { width: 94 / 3, height: 50/ 3 };

export function getIntrinsicImageToPitchMatrix(pitchSize, imageSize = baseImageSize) {
  return [
    [pitchSize.width / imageSize.width, 0, 0, -pitchSize.width / 2.0],
    [0, pitchSize.height / imageSize.height, 0, -pitchSize.height / 2.0],
    [0, 0, 1.0, 0],
    [0, 0, 0, 1.0]
  ];
}