export function createSlider(id, value, disabled, ts, renderCallback) {
  const sliderDiv = document.createElement('div');
  sliderDiv.style.marginBottom = '10px';

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.style.display = 'inline-block';
  label.style.width = '60px';
  // Extract the relevant part of the id for display
  const labelText = id.replace('Poly-slider', '').replace('Bezier-slider', '');
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
    renderCallback();
  });

  sliderDiv.appendChild(label);
  sliderDiv.appendChild(slider);
  return sliderDiv;
}

export function updateSliders(slidersContainer, ts, createSlider, renderCallback) {
  slidersContainer.innerHTML = '';
  ts.forEach(slider => {
    slidersContainer.appendChild(createSlider(slider.id, slider.value, slider.disabled, ts, renderCallback));
  });
}

export function recalculateSliderValues(points, ts) {
  const n = points.length - 1;
  ts.forEach((slider, index) => {
    slider.value = (index / n).toFixed(2);
    slider.disabled = (index === 0 || index === n); // Disable first and last sliders
  });
}