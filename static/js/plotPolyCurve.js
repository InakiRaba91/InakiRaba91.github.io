import { pointRadius, drawPoints } from './utils/point.js';
import { polyCurve, drawCurve } from './utils/polynomialCurve.js';

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('interactive-container-poly');
  const plot = document.getElementById('interactive-plot-poly');
  const ctx = plot.getContext('2d');
  const slidersContainer = document.getElementById('sliders-container');
  const addPointButton = document.getElementById('addPointPolyButton');
  const removePointButton = document.getElementById('removePointPolyButton');
  let points = [
    { x: 100, y: 100 },
    { x: 500, y: 100 }
  ];
  const maxPoints = 5;
  const minPoints = 2;

  let ts = [
    { id: 't0Poly-slider', value: 0, disabled: true },
    { id: 't1Poly-slider', value: 1, disabled: true }
  ];

  plot.width = container.clientWidth;
  plot.height = container.clientHeight;

  // Function to get the color from CSS custom properties
  function getCSSCustomProperty(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  }

  // Get colors from the sliders
  const colors = [
    getCSSCustomProperty('--slider-color-t0'),
    getCSSCustomProperty('--slider-color-t1'),
    getCSSCustomProperty('--slider-color-t2'),
    getCSSCustomProperty('--slider-color-t3'),
    getCSSCustomProperty('--slider-color-t4')
  ];

  function updateButtons() {
    addPointButton.disabled = points.length >= maxPoints;
    removePointButton.disabled = points.length <= minPoints;
  }

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
      const index = ts.findIndex(s => s.id === id);
      const prevValue = index > 0 ? parseFloat(document.getElementById(ts[index - 1].id).value) : -Infinity;
      const nextValue = index < ts.length - 1 ? parseFloat(document.getElementById(ts[index + 1].id).value) : Infinity;
      const newValue = parseFloat(e.target.value);

      if (newValue <= prevValue) {
        e.target.value = prevValue + 0.01;
      } else if (newValue >= nextValue) {
        e.target.value = nextValue - 0.01;
      }

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
    drawPoints(ctx, points, colors.slice(0, points.length));
    const knots = ts.map(slider => parseFloat(document.getElementById(slider.id).value));
    const curve = polyCurve(points, knots);
    drawCurve(ctx, curve, 'black');
  }

  function recalculateSliderValues() {
    const n = points.length - 1;
    ts.forEach((slider, index) => {
      slider.value = (index / n).toFixed(2);
      slider.disabled = (index === 0 || index === n); // Disable first and last sliders
    });
  }

  plot.addEventListener('mousedown', (e) => {
    const rect = plot.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let draggedPointIndex = null;

    points.forEach((point, index) => {
      const dx = point.x - x;
      const dy = point.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < pointRadius) {
        draggedPointIndex = index;
      }
    });

    if (draggedPointIndex !== null) {
      const onMouseMove = (e) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        points[draggedPointIndex] = { x, y };
        renderPolyCurve();
      };

      document.addEventListener('mousemove', onMouseMove);

      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onMouseMove);
      }, { once: true });
    }
  });

  addPointButton.addEventListener('click', () => {
    if (points.length < maxPoints) {
          points.push({ x: plot.clientWidth / 2, y: plot.clientHeight / 2 });
          ts.push({ id: `t${points.length - 1}Poly-slider`, value: 0.5, disabled: false });
          recalculateSliderValues();
          updateSliders();
          updateButtons();
          renderPolyCurve();
        }
  });

  removePointButton.addEventListener('click', () => {
    if (points.length > minPoints) {
      points.pop();
      ts.pop(); // Remove the last slider
      recalculateSliderValues();
      updateSliders();
      updateButtons();
      renderPolyCurve();
    }
  });

  updateSliders();
  updateButtons();
  renderPolyCurve();
});