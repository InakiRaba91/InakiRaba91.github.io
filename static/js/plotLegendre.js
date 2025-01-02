import { legendrePolynomial } from './utils/Legendre.js';


function updatePlot() {
    const n = parseInt(document.getElementById('degreeSlider').value);
    document.getElementById('degreeValue').textContent = `n=${n}`;

    const x = [];
    const y = [];
    for (let i = -100; i <= 100; i++) {
        const xi = i / 100;
        x.push(xi);
        y.push(legendrePolynomial(n, xi));
    }

    const trace = {
        x: x,
        y: y,
        type: 'scatter'
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
            range: [-1.1, 1.1] 
        },
        yaxis: {
          title: `L<sub>${n}</sub>(x)`,
          range: [-1.1, 1.1] 
        }
    };

    Plotly.newPlot('plot', [trace], layout);
}

// Event listener for the function input
document.getElementById('degreeSlider').addEventListener('input', updatePlot);

// Initial plot
updatePlot();