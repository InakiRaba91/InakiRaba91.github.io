export function createSlider(id, value, disabled, ts, renderCallback, prefix, minValue=0, maxValue=1, step=0.01, allow_equal=false) {
  const sliderDiv = document.createElement('div');
  sliderDiv.style.marginBottom = '10px';

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.style.display = 'inline-block';
  label.style.width = '60px';
  // Extract the relevant part of the id for display
  const labelText = id.replace(prefix, '');
  label.innerHTML = `${labelText}: <span id="${id}-value">${value}</span>`;

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = id;
  slider.min = minValue;
  slider.max = maxValue;
  slider.step = step;
  slider.value = value;
  slider.style.width = '280px';
  slider.disabled = disabled;

  slider.addEventListener('input', (e) => {
    const index = ts.findIndex(s => s.id === id);
    const prevValue = index > 0 ? parseFloat(document.getElementById(ts[index - 1].id).value) : -Infinity;
    const nextValue = index < ts.length - 1 ? parseFloat(document.getElementById(ts[index + 1].id).value) : Infinity;
    const newValue = parseFloat(e.target.value);

    if (allow_equal) {
      if (newValue < prevValue) {
        e.target.value = prevValue;
      } else if (newValue > nextValue) {
        e.target.value = nextValue;
      }
    } else {
      if (newValue <= prevValue) {
        e.target.value = prevValue + step;
      } else if (newValue >= nextValue) {
        e.target.value = nextValue - step;
      }
    }

    document.getElementById(`${id}-value`).textContent = e.target.value;
    renderCallback();
  });

  sliderDiv.appendChild(label);
  sliderDiv.appendChild(slider);
  return sliderDiv;
}

export function updateSliders(slidersContainer, ts, createSlider, renderCallback, prefix, minValue=0, maxValue=1, step=0.01, allowEqual=false) {
  slidersContainer.innerHTML = '';
  ts.forEach(slider => {
    slidersContainer.appendChild(createSlider(slider.id, slider.value, slider.disabled, ts, renderCallback, prefix, minValue, maxValue, step, allowEqual));
  });
}

export function recalculateSliderValues(ts, normalized = true) {
  const n = ts.length - 1;
  ts.forEach((slider, index) => {
    if (normalized) {
      slider.value = (index / n).toFixed(2);
    } else {
      slider.value = index;
    }
    slider.disabled = (index === 0 || index === n); // Disable first and last sliders
  });
}