import { fitParabola } from "./parabola.js";
import { GaussianQuadrature, approximateFunctionLegendre, computeLegendreCoefficients } from "./Legendre.js";

export function funcEval(funcStr, a, b, n) {
    const x = [];
    const y = [];
    const h = (b - a) / (n - 1);
    for (let i = 0; i < n; i++) {
        const xi = a + i * h;
        x.push(xi);
        try {
            const fxi = math.evaluate(funcStr, { x: xi });
            y.push(fxi);
        }
        catch (e) {
            alert('Invalid function');
            return;
        }
    }
    return { x, y };
}

export function funcIntegralRectangle(funcStr, a, b, n) {
    const { x, y } = funcEval(funcStr, a, b, n);
    const h = (b - a) / (n - 1);
    const integral = y.slice(0, -1).reduce((a, b) => a + b, 0) * h;
    return { x, y, integral };
}

export function EvalIntegralPiecewiseConstant(funcStr, a, b, n) {
    const { x: x_base, y: y_base } = funcEval(funcStr, a, b, n);
    const h = (b - a) / (n - 1);
    const integral = y_base.slice(0, -1).reduce((a, b) => a + b, 0) * h; 
    let x = [];
    let y = [];
    const m = y_base.length - 1;
    for (let i = 0; i <= m; i++) {
        x.push(x_base[i]);
        y.push(y_base[i]);
        if (i !== m) {
            x.push(x_base[i] + h);
            y.push(y_base[i]);
        }
    }
    return {x, y, integral};
}

export function EvalIntegralPiecewiseLinear(funcStr, a, b, n) {
    const { x, y } = funcEval(funcStr, a, b, n);
    const h = (b - a) / (n - 1);
    const integral = (y.slice(1, -1).reduce((a, b) => a + b, 0) + (y[0] + y[y.length - 1]) / 2) * h; 
    return {x, y, integral};
}

export function EvalIntegralPiecewiseQuadratic(funcStr, a, b, n) {
    const { x: x_pts, y: y_pts } = funcEval(funcStr, a, b, 2*n-1);
    let x = [];
    let y = [];
    let integral = 0;
    const h = (b - a) / (n - 1);
    const delta_x = 0.02;
    const m = Math.floor(h / delta_x);
    5
    for (let i = 0; i < (n - 1); i ++) {
        const j = 2*i;
        const c = fitParabola(x_pts.slice(j, j+3), y_pts.slice(j, j+3));
        const funcStrParabola = `${c[0]} + ${c[1]}*x + ${c[2]}*x^2`;
        const { x: x_par, y: y_par } = funcEval(funcStrParabola, x_pts[j], x_pts[j+2], m);
        x = x.concat(x_par);
        y = y.concat(y_par);
        integral += (y_pts[j] + 4*y_pts[j+1] + y_pts[j+2]);
    }
    integral *= h / 6;
    return {x, y, integral};
}

export function EvalIntegralLegendre(funcStr, a, b, n) {
    if (a !== -1 || b !== 1) {
        throw new Error("Legendre integration only supports the interval [-1, 1]");
    }
    const integral = GaussianQuadrature(funcStr, n)
    const x = [];
    const y = [];
    const m = 201;
    const h = (b - a) / (m - 1);
    const coefficients = computeLegendreCoefficients(funcStr, 2 * n - 1);
    for (let i = 0; i < m; i++) {
        const xi = a + i * h;
        x.push(xi);
        try {
            
            y.push(approximateFunctionLegendre(xi, coefficients));
        }
        catch (e) {
            alert('Invalid function ja');
            return;
        }
    }
    return {x, y, integral};
}