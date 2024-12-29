function legendrePolynomial(n, x) {
  switch (n) {
    case 0: return 1;
    case 1: return x;
    case 2: return 0.5 * (3 * Math.pow(x, 2) - 1);
    case 3: return 0.5 * (5 * Math.pow(x, 3) - 3 * x);
    case 4: return 0.125 * (35 * Math.pow(x, 4) - 30 * Math.pow(x, 2) + 3);
    case 5: return 0.125 * (63 * Math.pow(x, 5) - 70 * Math.pow(x, 3) + 15 * x);
    case 6: return 0.0625 * (231 * Math.pow(x, 6) - 315 * Math.pow(x, 4) + 105 * Math.pow(x, 2) - 5);
    case 7: return 0.0625 * (429 * Math.pow(x, 7) - 693 * Math.pow(x, 5) + 315 * Math.pow(x, 3) - 35 * x);
    case 8: return 0.0078125 * (6435 * Math.pow(x, 8) - 12012 * Math.pow(x, 6) + 6930 * Math.pow(x, 4) - 1260 * Math.pow(x, 2) + 35);
    case 9: return 0.0078125 * (12155 * Math.pow(x, 9) - 25740 * Math.pow(x, 7) + 18018 * Math.pow(x, 5) - 4620 * Math.pow(x, 3) + 315 * x);
    case 10: return 0.00390625 * (46189 * Math.pow(x, 10) - 109395 * Math.pow(x, 8) + 90090 * Math.pow(x, 6) - 30030 * Math.pow(x, 4) + 3465 * Math.pow(x, 2) - 63);
    default: return 0;
  }
}

function LegendreSquaredNorm(n) {
  return 2 / (2 * n + 1);
}

function computeLegendreCoefficients(funcStr, degree) {
  const coefficients = [];
  for (let n = 0; n <= degree; n++) {
    let integral = 0;
    for (let i = -100; i <= 100; i++) {
      const xi = i / 100;
      const fx = math.evaluate(funcStr, { x: xi });
      integral += fx * legendrePolynomial(n, xi);
    }
    integral /= 100; // Approximate the integral
    const c = integral / LegendreSquaredNorm(n);
    coefficients.push(c);
  }
  return coefficients;
}

function approximateFunction(x, coefficients) {
  let approximation = 0;
  for (let n = 0; n < coefficients.length; n++) {
    approximation += coefficients[n] * legendrePolynomial(n, x);
  }
  return approximation;
}

function plotFunction() {
  const funcStr = document.getElementById('functionInput').value;
  const degree = parseInt(document.getElementById('degreeSliderFunction').value);
  document.getElementById('degreeValueFunction').textContent = `n=${degree}`;

  const x = [];
  const y = [];
  const yApprox = [];
  const coefficients = computeLegendreCoefficients(funcStr, degree);

  for (let i = -100; i <= 100; i++) {
    const xi = i / 100;
    x.push(xi);
    try {
      y.push(math.evaluate(funcStr, { x: xi }));
      yApprox.push(approximateFunction(xi, coefficients));
    } catch (e) {
      alert('Invalid function');
      return;
    }
  }
  const yMin = Math.min(...y);
  const yMax = Math.max(...y);

  const traceOriginal = {
    x: x,
    y: y,
    type: 'scatter',
    name: 'Original Function'
  };

  const traceApprox = {
    x: x,
    y: yApprox,
    type: 'scatter',
    name: 'Approximation',
    line: { color: 'red' }
  };

  const layout = {
    title: {
      text: `Plot of ${funcStr} and its Approximation`,
      font: {
        family: 'Arial, sans-serif',
        size: 24, // Adjust the size as needed
        color: 'black',
        weight: 'bold'
      }
    },
    xaxis: {
      title: 'x',
      range: [-1, 1] // Set the range for the x-axis
    },
    yaxis: {
      title: 'y',
      range: [yMin-0.1, yMax+0.1] // Set the range for the y-axis based on min and max values
    }
  };

  Plotly.newPlot('functionPlot', [traceOriginal, traceApprox], layout);
}

// Initial plot
plotFunction();