// Ellipse fitting visualization
const canvas = document.getElementById('ellipseFittingCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;

// Observed ellipse (green) - slightly tilted
const observedEllipse = {
    cx: centerX - 30,
    cy: centerY + 10,
    rx: 120,
    ry: 80,
    rotation: Math.PI / 6, // 30 degrees
    color: '#00AA00',
    pointColor: '#006600'
};

// Estimated ellipse (blue) - slightly different
const estimatedEllipse = {
    cx: centerX - 20,
    cy: centerY + 5,
    rx: 115,
    ry: 85,
    rotation: Math.PI / 7, // slightly different rotation
    color: '#0066FF',
    pointColor: '#0066FF'
};

// Function to draw an ellipse
function drawEllipse(ellipse, lineWidth = 2, drawPoints = false) {
    ctx.save();
    ctx.translate(ellipse.cx, ellipse.cy);
    ctx.rotate(ellipse.rotation);
    
    // Draw ellipse
    ctx.beginPath();
    ctx.ellipse(0, 0, ellipse.rx, ellipse.ry, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = ellipse.color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // Draw points if requested
    if (drawPoints) {
        const numPoints = 10;
        for (let i = 0; i < numPoints; i++) {
            const angle = (2 * Math.PI * i) / numPoints;
            const x = ellipse.rx * Math.cos(angle);
            const y = ellipse.ry * Math.sin(angle);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = ellipse.pointColor;
            ctx.fill();
        }
    }
    
    ctx.restore();
}

// Clear canvas
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height);

// Draw estimated ellipse first (so it's behind)
drawEllipse(estimatedEllipse, 2, false);

// Draw observed ellipse with points
drawEllipse(observedEllipse, 2, true);

// Add legend
const legendX = 20;
const legendY = 20;
const legendSpacing = 25;

// Observed ellipse legend
ctx.beginPath();
ctx.arc(legendX + 5, legendY, 4, 0, 2 * Math.PI);
ctx.fillStyle = observedEllipse.pointColor;
ctx.fill();
ctx.fillStyle = 'black';
ctx.font = '14px Arial';
ctx.fillText('Observed ellipse', legendX + 15, legendY + 5);

// Estimated ellipse legend
ctx.beginPath();
ctx.strokeStyle = estimatedEllipse.color;
ctx.lineWidth = 2;
ctx.moveTo(legendX, legendY + legendSpacing - 3);
ctx.lineTo(legendX + 10, legendY + legendSpacing - 3);
ctx.stroke();
ctx.fillStyle = 'black';
ctx.fillText('Estimated ellipse', legendX + 15, legendY + legendSpacing + 2);
