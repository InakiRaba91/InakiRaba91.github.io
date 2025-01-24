class Spline {
  constructor(ts, cs) {
    this.ts = ts;
    this.cs = cs;
    this.ks = this.getNaturalKs(new Float64Array(this.ts.length));
  }

  getNaturalKs(ks) {
    const n = this.ts.length - 1;
    const A = zerosMat(n + 1, n + 2);

    for (let i = 1; i < n; i++) { // rows
      A[i][i - 1] = 1 / (this.ts[i] - this.ts[i - 1]);
      A[i][i] = 2 * (1 / (this.ts[i] - this.ts[i - 1]) + 1 / (this.ts[i + 1] - this.ts[i]));
      A[i][i + 1] = 1 / (this.ts[i + 1] - this.ts[i]);
      A[i][n + 1] = 3 * ((this.cs[i] - this.cs[i - 1]) / ((this.ts[i] - this.ts[i - 1]) * (this.ts[i] - this.ts[i - 1])) +
                         (this.cs[i + 1] - this.cs[i]) / ((this.ts[i + 1] - this.ts[i]) * (this.ts[i + 1] - this.ts[i])));
    }

    A[0][0] = 2 / (this.ts[1] - this.ts[0]);
    A[0][1] = 1 / (this.ts[1] - this.ts[0]);
    A[0][n + 1] = (3 * (this.cs[1] - this.cs[0])) / ((this.ts[1] - this.ts[0]) * (this.ts[1] - this.ts[0]));

    A[n][n - 1] = 1 / (this.ts[n] - this.ts[n - 1]);
    A[n][n] = 2 / (this.ts[n] - this.ts[n - 1]);
    A[n][n + 1] = (3 * (this.cs[n] - this.cs[n - 1])) / ((this.ts[n] - this.ts[n - 1]) * (this.ts[n] - this.ts[n - 1]));

    return solve(A, ks);
  }

  getIndexBefore(target) {
    let low = 0;
    let high = this.ts.length;
    let mid = 0;
    while (low < high) {
      mid = Math.floor((low + high) / 2);
      if (this.ts[mid] < target && mid !== low) {
        low = mid;
      } else if (this.ts[mid] >= target && mid !== high) {
        high = mid;
      } else {
        high = low;
      }
    }

    if (low === this.ts.length - 1) {
      return this.ts.length - 1;
    }

    return low + 1;
  }

  at(t) {
    let i = this.getIndexBefore(t);
    const s = (t - this.ts[i - 1]) / (this.ts[i] - this.ts[i - 1]);
    const a = this.ks[i - 1] * (this.ts[i] - this.ts[i - 1]) - (this.cs[i] - this.cs[i - 1]);
    const b = -this.ks[i] * (this.ts[i] - this.ts[i - 1]) + (this.cs[i] - this.cs[i - 1]);
    const q = (1 - s) * this.cs[i - 1] + s * this.cs[i] + s * (1 - s) * (a * (1 - s) + b * s);
    return q;
  }
}

function solve(A, ks) {
  const m = A.length;
  let h = 0;
  let k = 0;
  while (h < m && k <= m) {
    let i_max = 0;
    let max = -Infinity;
    for (let i = h; i < m; i++) {
      const v = Math.abs(A[i][k]);
      if (v > max) {
        i_max = i;
        max = v;
      }
    }

    if (A[i_max][k] === 0) {
      k++;
    } else {
      swapRows(A, h, i_max);
      for (let i = h + 1; i < m; i++) {
        const f = A[i][k] / A[h][k];
        A[i][k] = 0;
        for (let j = k + 1; j <= m; j++) A[i][j] -= A[h][j] * f;
      }
      h++;
      k++;
    }
  }

  for (let i = m - 1; i >= 0; i--) { // rows = columns
    var v = 0;
    if (A[i][i]) {
      v = A[i][m] / A[i][i];
    }
    ks[i] = v;
    for (let j = i - 1; j >= 0; j--) { // rows
      A[j][m] -= A[j][i] * v;
      A[j][i] = 0;
    }
  }
  return ks;
}

function zerosMat(r, c) {
  const A = [];
  for (let i = 0; i < r; i++) A.push(new Float64Array(c));
  return A;
}

function swapRows(m, k, l) {
  let p = m[k];
  m[k] = m[l];
  m[l] = p;
}

export default Spline;