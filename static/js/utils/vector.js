export function addVector(v1, v2) {
    return v1.map((val, idx) => val + v2[idx]);
}

export function substractVector(v1, v2) {
    return v1.map((val, idx) => val - v2[idx]);
}

export function scaleVector(v, s) {
    return v.map(val => val * s);
}

export function normVector(v) {
    return Math.sqrt(v.reduce((acc, val) => acc + val * val, 0));
}

export function normalizeVector(v) {
    const norm = normVector(v);
    return scaleVector(v, 1 / norm);
}

export function crossProduct(v1, v2) {
    return [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0],
    ]
}