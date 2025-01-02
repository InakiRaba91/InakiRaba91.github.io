export function fitParabola(x, y) {
    const n = x.length;
    const A = [];
    const b = [];
    for (let i = 0; i < n; i++) {
        const xi = x[i];
        A.push([1, xi, xi*xi]);
    }
    const AT = math.transpose(A);
    const ATA = math.multiply(AT, A);
    const ATb = math.multiply(AT, y);
    const c = math.lusolve(ATA, ATb);
    return c;
}


