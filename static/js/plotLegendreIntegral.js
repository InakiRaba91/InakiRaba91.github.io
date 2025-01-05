import { funcIntegralRectangle, EvalIntegralPiecewiseConstant, EvalIntegralPiecewiseLinear, EvalIntegralPiecewiseQuadratic, EvalIntegralLegendre } from './utils/integral.js';

export function plotFunctionIntegral() {
  const funcStr = document.getElementById('functionInput').value;
  const num_points = parseInt(document.getElementById('numPointsSlider').value);
  const method = document.getElementById('methodSelect').value;
  document.getElementById('numPointsValue').textContent = `n=${num_points}`;

  
  const a = -1;
  const b = 1;
  const { x, y, integral } = funcIntegralRectangle(funcStr, a, b, 201);
  let approx;
  switch (method) {
    case 'gaussian':
      approx = EvalIntegralLegendre(funcStr, a, b, num_points);
      break;
    case 'rectangle':
      approx = EvalIntegralPiecewiseConstant(funcStr, a, b, num_points);
      break;
    case 'trapezoid':
      approx = EvalIntegralPiecewiseLinear(funcStr, a, b, num_points);
      break;
    case 'simpson':
      approx = EvalIntegralPiecewiseQuadratic(funcStr, a, b, (1 + num_points) / 2);
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

// Add event listeners
document.getElementById('plotIntegralButton').addEventListener('click', plotFunctionIntegral);
document.getElementById('numPointsSlider').addEventListener('input', () => {
  const degree = parseInt(document.getElementById('numPointsSlider').value);
  document.getElementById('numPointsValue').textContent = `n=${degree}`;
  const trapezoidOption = document.getElementById('trapezoidOption');
  const simpsonOption = document.getElementById('simpsonOption');
  
  // Show or hide the rectangle option
  if (degree > 1) {
    trapezoidOption.style.display = 'block';
  } else {
    trapezoidOption.style.display = 'none';
    if (methodSelect.value === 'trapezoid') {
      methodSelect.value = 'gaussian';
    }
  }

  // Show or hide the simpson option
  if (degree > 1 && (degree + 1) % 2 === 0) {
    simpsonOption.style.display = 'block';
  } else {
    simpsonOption.style.display = 'none';
    if (methodSelect.value === 'simpson') {
      methodSelect.value = 'gaussian';
    }
  }

  plotFunctionIntegral();
});
document.getElementById('methodSelect').addEventListener('change', plotFunctionIntegral);


// Initial plot
plotFunctionIntegral();

