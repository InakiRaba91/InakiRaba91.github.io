// Generate 3D parabolic surface: f(z) = x^2 + y^2/4 - 1
document.addEventListener('DOMContentLoaded', function() {
    // Generate grid for the surface
    const numPoints = 50;
    const xRange = [-2, 2];
    const yRange = [-4, 4];
    
    // Create x, y meshgrid
    const x = [];
    const y = [];
    const z = [];
    
    for (let i = 0; i < numPoints; i++) {
        const xRow = [];
        const yRow = [];
        const zRow = [];
        
        for (let j = 0; j < numPoints; j++) {
            const xVal = xRange[0] + (xRange[1] - xRange[0]) * i / (numPoints - 1);
            const yVal = yRange[0] + (yRange[1] - yRange[0]) * j / (numPoints - 1);
            
            // Calculate z = x^2 + y^2/4 - 1
            const zVal = xVal * xVal + (yVal * yVal) / 4 - 1;
            
            xRow.push(xVal);
            yRow.push(yVal);
            zRow.push(zVal);
        }
        
        x.push(xRow);
        y.push(yRow);
        z.push(zRow);
    }
    
    // Create the surface trace
    const surfaceTrace = {
        type: 'surface',
        x: x,
        y: y,
        z: z,
        colorscale: 'Viridis',
        showscale: true,
        opacity: 0.9,
        contours: {
            z: {
                show: true,
                usecolormap: true,
                highlightcolor: "#42f462",
                project: {z: true}
            }
        }
    };
    
    // Create ground plane at z=0
    const groundPlane = {
        type: 'surface',
        x: [[xRange[0], xRange[1]], [xRange[0], xRange[1]]],
        y: [[yRange[0], yRange[0]], [yRange[1], yRange[1]]],
        z: [[0, 0], [0, 0]],
        colorscale: [[0, 'rgba(150, 150, 150, 0.66)'], [1, 'rgba(150, 150, 150, 0.66)']],
        showscale: false,
        opacity: 0.5,
        name: '',
        hoverinfo: 'skip'
    };
    
    // Layout configuration
    const layout = {
        title: {
            text: 'Parabolic Surface: f(z) = x² + y²/4 - 1',
            font: {
                size: 16
            }
        },
        scene: {
            xaxis: {
                title: 'x',
                gridcolor: '#bbb',
                zerolinecolor: '#000'
            },
            yaxis: {
                title: 'y',
                gridcolor: '#bbb',
                zerolinecolor: '#000'
            },
            zaxis: {
                title: 'z = f(x, y)',
                gridcolor: '#bbb',
                zerolinecolor: '#000'
            },
            camera: {
                eye: {
                    x: 1.5,
                    y: 1.5,
                    z: 1.3
                }
            },
            aspectmode: 'cube'
        },
        autosize: true,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 40
        }
    };
    
    // Configuration for the plot
    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['toImage']
    };
    
    // Create the plot
    Plotly.newPlot('paraboloidPlot', [surfaceTrace, groundPlane], layout, config);
});
