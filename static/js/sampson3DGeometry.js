// sampson3DGeometry.js - 3D visualization extending the 2D Sampson geometry

// Define the paraboloid function
function f(x, y) {
    return x * x / 1 + y * y / 4 - 1;
}

// Create the paraboloid surface
const xRange = [];
const yRange = [];
const zSurface = [];

const steps = 50;
for (let i = 0; i < steps; i++) {
    xRange.push(-2 + (4 * i) / (steps - 1));
    yRange.push(-3 + (6 * i) / (steps - 1));
}

for (let i = 0; i < yRange.length; i++) {
    const zRow = [];
    for (let j = 0; j < xRange.length; j++) {
        zRow.push(f(xRange[j], yRange[i]));
    }
    zSurface.push(zRow);
}

// Create surface trace
const surfaceTrace = {
    x: xRange,
    y: yRange,
    z: zSurface,
    type: 'surface',
    colorscale: [
        [0, 'rgba(0, 102, 255, 0.3)'],
        [1, 'rgba(0, 102, 255, 0.7)']
    ],
    showscale: false,
    name: 'Paraboloid',
    hoverinfo: 'skip'
};

// Define points
const P = { x: 1.46105, y: 0.88695, z: 0 };
const P_prime = { x: 1.46105, y: 0.88695, z: f(1.46105, 0.88695) };
const Q = { x: 0.9221, y: 0.7739, z: 0 };

// Create point traces
const pointP = {
    x: [P.x],
    y: [P.y],
    z: [P.z],
    mode: 'markers+text',
    type: 'scatter3d',
    marker: {
        size: 8,
        color: '#FF0000'
    },
    text: ['p'],
    textposition: 'top center',
    textfont: {
        size: 16,
        color: '#000000'
    },
    name: 'p',
    showlegend: false
};

const pointP_prime = {
    x: [P_prime.x],
    y: [P_prime.y],
    z: [P_prime.z],
    mode: 'markers+text',
    type: 'scatter3d',
    marker: {
        size: 8,
        color: '#FF0000'
    },
    text: ["p'"],
    textposition: 'top center',
    textfont: {
        size: 16,
        color: '#000000'
    },
    name: "p'",
    showlegend: false
};

const pointQ = {
    x: [Q.x],
    y: [Q.y],
    z: [Q.z],
    mode: 'markers+text',
    type: 'scatter3d',
    marker: {
        size: 8,
        color: '#00AA00'
    },
    text: ['(q, 0)'],
    textposition: 'bottom center',
    textfont: {
        size: 16,
        color: '#000000'
    },
    name: '(q, 0)',
    showlegend: false
};

// Create line from P to P'
const linePP_prime = {
    x: [P.x, P_prime.x],
    y: [P.y, P_prime.y],
    z: [P.z, P_prime.z],
    mode: 'lines',
    type: 'scatter3d',
    line: {
        color: '#666666',
        width: 4
    },
    name: 'Vertical projection',
    showlegend: false
};

// Create line from P' to (Q, f(P'))
const Q_lifted = { x: Q.x, y: Q.y, z: P_prime.z };
const lineP_primeQ = {
    x: [P_prime.x, Q_lifted.x],
    y: [P_prime.y, Q_lifted.y],
    z: [P_prime.z, Q_lifted.z],
    mode: 'lines',
    type: 'scatter3d',
    line: {
        color: '#FF6600',
        width: 4,
        dash: 'dash'
    },
    name: 'Horizontal to q',
    showlegend: false
};

// Create line from (Q, f(P')) to Q
const lineQVertical = {
    x: [Q_lifted.x, Q.x],
    y: [Q_lifted.y, Q.y],
    z: [Q_lifted.z, Q.z],
    mode: 'lines',
    type: 'scatter3d',
    line: {
        color: '#666666',
        width: 4,
        dash: 'dash'
    },
    name: 'Vertical to ground',
    showlegend: false
};

// Create the ground plane (z=0)
const groundPlane = {
    x: [-2, -2, 2, 2],
    y: [-3, 3, 3, -3],
    z: [0, 0, 0, 0],
    type: 'mesh3d',
    color: 'rgba(200, 200, 200, 0.3)',
    name: 'Ground plane',
    showlegend: false,
    hoverinfo: 'skip'
};

// Create ellipse on ground plane (z=0)
const ellipsePoints = [];
const numPoints = 100;
for (let i = 0; i <= numPoints; i++) {
    const theta = (i / numPoints) * 2 * Math.PI;
    ellipsePoints.push({
        x: Math.cos(theta),
        y: 2 * Math.sin(theta),
        z: 0
    });
}

const ellipseTrace = {
    x: ellipsePoints.map(p => p.x),
    y: ellipsePoints.map(p => p.y),
    z: ellipsePoints.map(p => p.z),
    mode: 'lines',
    type: 'scatter3d',
    line: {
        color: '#00AA00',
        width: 4
    },
    name: 'Ellipse',
    showlegend: false
};

// Layout
const layout = {
    scene: {
        xaxis: { title: 'x', range: [-2, 2] },
        yaxis: { title: 'y', range: [-3, 3] },
        zaxis: { title: 'f(x,y)', range: [-2, 4] },
        camera: {
            eye: { x: 1.5, y: 1.5, z: 1.2 }
        },
        aspectmode: 'manual',
        aspectratio: { x: 1, y: 1.5, z: 1 }
    },
    margin: { l: 0, r: 0, t: 30, b: 0 },
    title: ''
};

// Plot
const data = [
    surfaceTrace,
    groundPlane,
    ellipseTrace,
    pointP,
    pointP_prime,
    pointQ,
    linePP_prime,
    lineP_primeQ,
    lineQVertical
];

Plotly.newPlot('sampson3DGeometryPlot', data, layout, { responsive: true });
