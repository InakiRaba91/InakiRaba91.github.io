import { funcIntegralRectangle, EvalIntegralPiecewiseConstant, EvalIntegralPiecewiseLinear, EvalIntegralPiecewiseQuadratic, EvalIntegralLegendre } from './utils/integral.js';

export function plotFunctionIntegral() {
  const funcStr = document.getElementById('functionInput').value;
  const degree = parseInt(document.getElementById('degreeSliderIntegral').value);
  const method = document.getElementById('methodSelect').value;
  document.getElementById('degreeValueIntegral').textContent = `n=${degree}`;

  
  const a = -1;
  const b = 1;
  const { x, y, integral } = funcIntegralRectangle(funcStr, a, b, 201);
  let approx;
  switch (method) {
    case 'gaussian':
      approx = EvalIntegralLegendre(funcStr, a, b, degree);
      break;
    case 'rectangle':
      approx = EvalIntegralPiecewiseConstant(funcStr, a, b, degree);
      break;
    case 'trapezoid':
      approx = EvalIntegralPiecewiseLinear(funcStr, a, b, degree);
      break;
    case 'simpson':
      approx = EvalIntegralPiecewiseQuadratic(funcStr, a, b, degree);
      break
    default:
      alert('Invalid method');
      return;
  }
  const { x: xApprox, y: yApprox, integral: integralApprox } = approx;

  const yMin = Math.min(...y);
  const yMax = Math.max(...y);

  const traceOriginal = {
    x: x,
    y: y,
    type: 'scatter',
    name: `Original: ${integral.toFixed(3)}`
  };

  const traceApprox = {
    x: xApprox,
    y: yApprox,
    type: 'scatter',
    name: `Approximation: ${integralApprox.toFixed(3)}`,
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
document.getElementById('plotIntegralButton').addEventListener('click', plotFunctionIntegral);
document.getElementById('degreeSliderIntegral').addEventListener('input', plotFunctionIntegral);
document.getElementById('methodSelect').addEventListener('change', plotFunctionIntegral);

// Initial plot
plotFunctionIntegral();


