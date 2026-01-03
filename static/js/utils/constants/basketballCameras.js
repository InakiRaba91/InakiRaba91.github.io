import {getHomographyMatrix} from '../camera.js';

const f = 1100;
const tx = 0;
const ty = -20;
const tz = 25;
const rx = -142;
const ry = 0;
const rz = 0;
const camera = {"f": f, "tx": tx, "ty": ty, "tz": tz, "rx": rx, "ry": ry, "rz": rz};
export const BasketballTrajHomographyMatrix = getHomographyMatrix(camera);
const cameraCentered = {"f": f, "tx": 0, "ty": 0, "tz": 0, "rx": rx, "ry": ry, "rz": rz};
export const BasketballTrajHomographyCenteredMatrix = getHomographyMatrix(cameraCentered);

const f2 = 1000;
const tx2 = 0;
const ty2 = 0;
const tz2 = 30;
const rx2 = -180;
const ry2 = 0;
const rz2 = 0;
const cameraBirdEye = {"f": f2, "tx": tx2, "ty": ty2, "tz": tz2, "rx": rx2, "ry": ry2, "rz": rz2};
export const BasketballTrajHomographyBirdEyeMatrix = getHomographyMatrix(cameraBirdEye);
const cameraCenteredBirdEye = {"f": f2, "tx": 0, "ty": 0, "tz": 0, "rx": rx2, "ry": ry2, "rz": rz2};
export const BasketballTrajHomographyCenteredBirdEyeMatrix = getHomographyMatrix(cameraCenteredBirdEye);

const BasketballBallCircumference = 29.5 / 36.0;
export const BasketballBallRadius = BasketballBallCircumference / (2 * Math.PI);