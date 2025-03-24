import {getHomographyMatrix} from '../camera.js';

export const refCamera = {f: 480, tx: 0, ty: -30, tz: 45, rx: -130, ry: 0, rz: 0};
export const refHomography = getHomographyMatrix(refCamera);