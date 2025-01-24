import { BSpline } from './utils/BSpline.js';

const colors = ["red", "green", "blue", "orange", "purple", "pink"];

function updatePlot() {
    const n = parseInt(document.getElementById('degreeSlider').value);
    const nMax = parseInt(document.getElementById('degreeSlider').max);
    document.getElementById('degreeValue').textContent = `n=${n}`;

    const delta = 0.02;
    const s = delta + 0.5 * (n + 1); // Support
    const r = nMax*0.5-0.1
    const num_pts = 2 * s / delta + 1;
    const x = [-r];
    const y = [0];
    for (let i = 0; i < num_pts; i++) {
        const xi = -s + i * delta;
        x.push(xi);
        y.push(BSpline(n, xi));
    }
    x.push(r);
    y.push(0);

    const trace = {
        x: x,
        y: y,
        type: 'scatter',
        line: { color: colors[n % colors.length] }
    };

    const layout = {
        title: {
          text: `Legendre Polynomial of Degree ${n}`,
          font: {
            family: 'Arial, sans-serif',
            size: 24, 
            color: 'black',
            weight: 'bold'
          }
        },
        xaxis: {
          title: 'x',
            range: [-r, r] 
        },
        yaxis: {
          title: `L<sub>${n}</sub>(x)`,
          range: [-0.1, 1.1] 
        }
    };

    Plotly.newPlot('plot', [trace], layout);
}

// Event listener for the function input
document.getElementById('degreeSlider').addEventListener('input', updatePlot);

// Initial plot
updatePlot();