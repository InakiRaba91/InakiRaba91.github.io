import {getHomographyMatrix} from '../camera.js';

export const refCameraView = {f: 393, tx: 24, ty: -78, tz: 12, rx: -115, ry: -9, rz: 32};
export const refHomographyView = getHomographyMatrix(refCameraView);
export const refCamera = {f: 720, tx: 0, ty: -60, tz: 0, rx: -90, ry: 0, rz: 0};
export const refHomography = getHomographyMatrix(refCamera);
