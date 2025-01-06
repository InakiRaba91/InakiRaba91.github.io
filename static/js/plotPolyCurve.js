import { pointRadius, drawPoints } from './utils/point.js';
import { polyCurve, drawCurve } from './utils/polynomialCurve.js';

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('interactive-container-quad');
  const plot = document.getElementById('interactive-plot-quad');
  const ctx = plot.getContext('2d');
  const slidersContainer = document.getElementById('sliders-container');
  const addPointButton = document.getElementById('addPointPolyButton');
  const removePointButton = document.getElementById('removePointPolyButton');
  let points = [
    { x: 100, y: 100 },
    { x: 500, y: 500 }
  ];

  let ts = [
    { id: 't0Poly-slider', value: 0, disabled: true },
    { id: 't1Poly-slider', value: 1, disabled: true }
  ];

  plot.width = container.clientWidth;
  plot.height = container.clientHeight;

  function createSlider(id, value, disabled) {
    const sliderDiv = document.createElement('div');
    sliderDiv.style.marginBottom = '10px';

    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.style.display = 'inline-block';
    label.style.width = '60px';
    // Extract the relevant part of the id for display
    const labelText = id.replace('Poly-slider', '');
    label.innerHTML = `${labelText}: <span id="${id}-value">${value}</span>`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.01';
    slider.value = value;
    slider.style.width = '280px';
    slider.disabled = disabled;

    slider.addEventListener('input', (e) => {
      document.getElementById(`${id}-value`).textContent = e.target.value;
      renderPolyCurve();
    });

    sliderDiv.appendChild(label);
    sliderDiv.appendChild(slider);
    return sliderDiv;
  }

  function updateSliders() {
    slidersContainer.innerHTML = '';
    ts.forEach(slider => {
      slidersContainer.appendChild(createSlider(slider.id, slider.value, slider.disabled));
    });
  }

  function renderPolyCurve() {
    const colors = ['red', 'blue', 'green', 'orange', 'purple'];
    drawPoints(ctx, points, colors.slice(0, points.length));
    const knots = ts.map(slider => parseFloat(document.getElementById(slider.id).value));
    const curve = polyCurve(points, knots);
    drawCurve(ctx, curve, 'blue');
  }

  function recalculateSliderValues() {
    const n = points.length - 1;
    ts.forEach((slider, index) => {
      slider.value = (index / n).toFixed(2);
    });
  }

  addPointButton.addEventListener('click', () => {
    if (points.length < 5) {
      points.push({ x: 300, y: 300 });
      ts.push({ id: `t${points.length - 1}Poly-slider`, value: 0.5, disabled: false });
      recalculateSliderValues();
      updateSliders();
      renderPolyCurve();
    }
  });

  removePointButton.addEventListener('click', () => {
    if (points.length > 2) {
      points.pop();
      ts.pop(); // Remove the last slider
      recalculateSliderValues();
      updateSliders();
      renderPolyCurve();
    }
  });

  updateSliders();
  renderPolyCurve();
});