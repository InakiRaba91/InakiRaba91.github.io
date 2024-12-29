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

// Initial plot
updatePlot();