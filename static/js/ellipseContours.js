// Generate 2D ellipse contours for f(x,y) = x^2 + y^2/4 - 1 = k
document.addEventListener('DOMContentLoaded', function() {
    // Define the k values for different contours
    const kValues = [-1, -0.5, 0, 1, 2, 3];
    const colors = ['#e74c3c', '#db34a3ff', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
    
    const traces = [];
    
    // Generate each ellipse contour
    kValues.forEach((k, index) => {
        // For x^2 + y^2/4 = 1 + k
        // This gives an ellipse with semi-axes a and b where:
        // x^2/a^2 + y^2/b^2 = 1
        // Comparing: x^2 + y^2/4 = 1 + k
        // We get: x^2/(1+k) + y^2/(4(1+k)) = 1
        // So: a^2 = 1+k, b^2 = 4(1+k)
        
        const constant = 1 + k;
        
        if (constant > 0) {
            const a = Math.sqrt(constant);
            const b = Math.sqrt(4 * constant);
            
            // Parametric equation for ellipse: x = a*cos(t), y = b*sin(t)
            const numPoints = 200;
            const x = [];
            const y = [];
            
            for (let i = 0; i <= numPoints; i++) {
                const t = (2 * Math.PI * i) / numPoints;
                x.push(a * Math.cos(t));
                y.push(b * Math.sin(t));
            }
            
            traces.push({
                type: 'scatter',
                mode: 'lines',
                x: x,
                y: y,
                name: `k = ${k}`,
                line: {
                    color: colors[index],
                    width: k === 0 ? 4 : 2
                },
                hovertemplate: `k = ${k}<br>x: %{x:.2f}<br>y: %{y:.2f}<extra></extra>`
            });
        } else if (constant === 0) {
            // Single point at origin
            traces.push({
                type: 'scatter',
                mode: 'markers',
                x: [0],
                y: [0],
                name: `k = ${k}`,
                marker: {
                    color: colors[index],
                    size: 8,
                    symbol: 'circle'
                },
                hovertemplate: `k = ${k}<br>x: 0<br>y: 0<extra></extra>`
            });
        }
        // If constant < 0, no real solution (empty set)
    });
    
    // Layout configuration
    const layout = {
        title: {
            text: 'Isocontours: x² + y²/4 - 1 = k',
            font: {
                size: 16
            }
        },
        xaxis: {
            title: 'x',
            gridcolor: '#e0e0e0',
            zerolinecolor: '#000',
            zerolinewidth: 2,
            range: [-3, 3]
        },
        yaxis: {
            title: 'y',
            gridcolor: '#e0e0e0',
            zerolinecolor: '#000',
            zerolinewidth: 2,
            scaleanchor: 'x',
            scaleratio: 1,
            range: [-6, 6]
        },
        showlegend: true,
        legend: {
            x: 1.05,
            y: 1,
            xanchor: 'left',
            yanchor: 'top'
        },
        autosize: true,
        margin: {
            l: 60,
            r: 100,
            b: 60,
            t: 60
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white'
    };
    
    // Configuration for the plot
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage', 'lasso2d', 'select2d']
    };
    
    // Create the plot
    Plotly.newPlot('ellipseContoursPlot', traces, layout, config);
});
