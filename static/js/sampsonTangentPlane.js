// Sampson distance tangent plane visualization
(function() {
    // Function f(x,y) = x²/1 + y²/4 - 1
    function f(x, y) {
        return x * x + y * y / 4 - 1;
    }

    // Gradient g(x,y) = (2x, y/2)
    function gradient(x, y) {
        return [2 * x, y / 2];
    }

    // Tangent plane at point P: q(x,y) = f(P.x, P.y) + g(P.x, P.y)·(x-P.x, y-P.y)
    function tangentPlane(x, y, px, py) {
        const fP = f(px, py);
        const [gx, gy] = gradient(px, py);
        return fP + gx * (x - px) + gy * (y - py);
    }

    // Generate mesh data for surface
    function generateSurfaceMesh(xRange, yRange, resolution) {
        const x = [];
        const y = [];
        const z = [];

        for (let i = 0; i < resolution; i++) {
            const xRow = [];
            const yRow = [];
            const zRow = [];
            
            for (let j = 0; j < resolution; j++) {
                const xVal = xRange[0] + (xRange[1] - xRange[0]) * i / (resolution - 1);
                const yVal = yRange[0] + (yRange[1] - yRange[0]) * j / (resolution - 1);
                
                xRow.push(xVal);
                yRow.push(yVal);
                zRow.push(f(xVal, yVal));
            }
            
            x.push(xRow);
            y.push(yRow);
            z.push(zRow);
        }

        return { x, y, z };
    }

    // Generate mesh data for tangent plane
    function generateTangentPlaneMesh(px, py, xRange, yRange, resolution) {
        const x = [];
        const y = [];
        const z = [];

        for (let i = 0; i < resolution; i++) {
            const xRow = [];
            const yRow = [];
            const zRow = [];
            
            for (let j = 0; j < resolution; j++) {
                const xVal = xRange[0] + (xRange[1] - xRange[0]) * i / (resolution - 1);
                const yVal = yRange[0] + (yRange[1] - yRange[0]) * j / (resolution - 1);
                
                xRow.push(xVal);
                yRow.push(yVal);
                zRow.push(tangentPlane(xVal, yVal, px, py));
            }
            
            x.push(xRow);
            y.push(yRow);
            z.push(zRow);
        }

        return { x, y, z };
    }

    // Create the visualization
    const xRange = [-2, 2];
    const yRange = [-4, 4];
    const resolution = 50;

    // Point P
    const px = 1;
    const py = 1;
    const pz = f(px, py);

    // Generate surface mesh
    const surfaceMesh = generateSurfaceMesh(xRange, yRange, resolution);

    // Generate tangent plane mesh (smaller region around the point)
    const planeXRange = [-0.5, 2.5];
    const planeYRange = [-1.5, 3.5];
    const tangentMesh = generateTangentPlaneMesh(px, py, planeXRange, planeYRange, 20);

    // Generate ellipse at ground level (z=0)
    // Ellipse equation: x²/1 + y²/4 = 1
    const numEllipsePoints = 100;
    const ellipseX = [];
    const ellipseY = [];
    const ellipseZ = [];
    for (let i = 0; i <= numEllipsePoints; i++) {
        const theta = (2 * Math.PI * i) / numEllipsePoints;
        ellipseX.push(Math.cos(theta));
        ellipseY.push(2 * Math.sin(theta));
        ellipseZ.push(0);
    }

    // Create traces
    const traces = [
        // Parabolic surface
        {
            type: 'surface',
            x: surfaceMesh.x,
            y: surfaceMesh.y,
            z: surfaceMesh.z,
            colorscale: 'Blues',
            opacity: 0.7,
            name: 'Parabolic Surface',
            showscale: false,
            contours: {
                z: {
                    show: true,
                    usecolormap: true,
                    highlightcolor: "#42f462",
                    project: { z: true }
                }
            }
        },
        // Ground plane at z=0
        {
            type: 'surface',
            x: [[xRange[0], xRange[1]], [xRange[0], xRange[1]]],
            y: [[yRange[0], yRange[0]], [yRange[1], yRange[1]]],
            z: [[0, 0], [0, 0]],
            colorscale: [[0, 'rgba(150, 150, 150, 0.66)'], [1, 'rgba(150, 150, 150, 0.66)']],
            showscale: false,
            opacity: 0.5,
            name: '',
            hoverinfo: 'skip'
        },
        // Ellipse at ground level
        {
            type: 'scatter3d',
            x: ellipseX,
            y: ellipseY,
            z: ellipseZ,
            mode: 'lines',
            line: {
                color: 'rgb(0, 200, 0)',
                width: 20
            },
            name: 'Ellipse',
            hoverinfo: 'skip'
        },
        // Tangent plane
        {
            type: 'surface',
            x: tangentMesh.x,
            y: tangentMesh.y,
            z: tangentMesh.z,
            colorscale: [[0, 'rgba(255, 165, 0, 0.5)'], [1, 'rgba(255, 165, 0, 0.5)']],
            opacity: 0.6,
            name: 'Tangent Plane',
            showscale: false
        },
        // Point P
        {
            type: 'scatter3d',
            x: [px],
            y: [py],
            z: [pz],
            mode: 'markers',
            marker: {
                size: 8,
                color: 'red',
                symbol: 'circle'
            },
            name: 'Point P'
        }
    ];

    const layout = {
        scene: {
            xaxis: { title: 'x', range: xRange },
            yaxis: { title: 'y', range: yRange },
            zaxis: { title: 'f(x,y)', range: [-2, 5] },
            camera: {
                eye: { x: 1.5, y: -1.5, z: 1.2 }
            }
        },
        margin: { l: 0, r: 0, b: 0, t: 30 },
        showlegend: false
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false
    };

    Plotly.newPlot('sampsonTangentPlot', traces, layout, config);
})();
