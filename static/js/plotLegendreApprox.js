import { computeLegendreCoefficients, approximateFunctionLegendre } from './utils/Legendre.js';

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
      yApprox.push(approximateFunctionLegendre(xi, coefficients));
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

// Event listener for the function input
document.getElementById('plotButton').addEventListener('click', plotFunction);
document.getElementById('degreeSliderFunction').addEventListener('input', plotFunction);

// Initial plot
plotFunction();