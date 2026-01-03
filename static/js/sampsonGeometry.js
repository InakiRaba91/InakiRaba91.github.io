// sampsonGeometry.js - Visualization of Sampson distance geometry

const canvas = document.getElementById('sampsonGeometryCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

// Transform from mathematical coordinates to canvas coordinates
function toCanvas(x, y) {
    const scale = 80; // pixels per unit
    const cx = width / 2;
    const cy = height / 2;
    return {
        x: cx + x * scale,
        y: cy - y * scale
    };
}

// Draw the ellipse x^2 + y^2/4 - 1 = 0
function drawEllipse() {
    ctx.strokeStyle = '#0066FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const a = 1; // semi-major axis in y direction
    const b = 1; // semi-major axis in x direction (but equation is x^2 + y^2/4 = 1)
    // Actually: x^2/1 + y^2/4 = 1, so a_x = 1, a_y = 2
    
    const numPoints = 200;
    for (let i = 0; i <= numPoints; i++) {
        const theta = (i / numPoints) * 2 * Math.PI;
        const x = Math.cos(theta);
        const y = 2 * Math.sin(theta);
        
        const pos = toCanvas(x, y);
        if (i === 0) {
            ctx.moveTo(pos.x, pos.y);
        } else {
            ctx.lineTo(pos.x, pos.y);
        }
    }
    ctx.stroke();
}

// Draw a point with label
function drawPoint(x, y, label, color = '#FF0000', labelBelow = false, xOffset = 0) {
    const pos = toCanvas(x, y);
    
    // Draw point
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw label
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    const offset = labelBelow ? 20 : -12;
    ctx.fillText(label, pos.x + xOffset, pos.y + offset);
}

// Draw a line segment
function drawSegment(x1, y1, x2, y2, color = '#000000', lineWidth = 2) {
    const pos1 = toCanvas(x1, y1);
    const pos2 = toCanvas(x2, y2);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.stroke();
}

// Draw right angle symbol at a point
function drawRightAngle(cx, cy, dir1x, dir1y, dir2x, dir2y, size = 0.15) {
    // Normalize directions
    const len1 = Math.sqrt(dir1x * dir1x + dir1y * dir1y);
    const len2 = Math.sqrt(dir2x * dir2x + dir2y * dir2y);
    const u1x = dir1x / len1;
    const u1y = dir1y / len1;
    const u2x = dir2x / len2;
    const u2y = dir2y / len2;
    
    // Create the three points of the right angle symbol
    const p1x = cx + u1x * size;
    const p1y = cy + u1y * size;
    const cornerx = cx + u1x * size + u2x * size;
    const cornery = cy + u1y * size + u2y * size;
    const p2x = cx + u2x * size;
    const p2y = cy + u2y * size;
    
    const pos1 = toCanvas(p1x, p1y);
    const posCorner = toCanvas(cornerx, cornery);
    const pos2 = toCanvas(p2x, p2y);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(posCorner.x, posCorner.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.stroke();
    
    // Draw a small filled square at the center of the right angle for clarity
    const centerx = cx + u1x * size/2 + u2x * size/2;
    const centery = cy + u1y * size/2 + u2y * size/2;
    const posCenter = toCanvas(centerx, centery);
    const squareSize = 3;
    ctx.fillStyle = '#000000';
    ctx.fillRect(posCenter.x - squareSize/2, posCenter.y - squareSize/2, squareSize, squareSize);
}

// Draw axes
function drawAxes() {
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.beginPath();
    const xMin = toCanvas(-3, 0);
    const xMax = toCanvas(3, 0);
    ctx.moveTo(xMin.x, xMin.y);
    ctx.lineTo(xMax.x, xMax.y);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    const yMin = toCanvas(0, -3);
    const yMax = toCanvas(0, 3);
    ctx.moveTo(yMin.x, yMin.y);
    ctx.lineTo(yMax.x, yMax.y);
    ctx.stroke();
}

// Main drawing function
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    drawAxes();
    
    // Draw ellipse
    drawEllipse();
    
    // Define points
    const P = { x: 1.46105, y: 0.88695 };
    const Q = { x: 0.9221, y: 0.7739 };
    
    // Draw segment P to Q
    drawSegment(P.x, P.y, Q.x, Q.y, '#666666', 2);
    
    // Calculate perpendicular
    const v = { x: P.x - Q.x, y: P.y - Q.y };
    const vLengthSq = v.x * v.x + v.y * v.y;
    const n = { x: -v.y / vLengthSq, y: v.x / vLengthSq };
    const L = 0.25;
    
    const R1 = { x: Q.x + n.x * L, y: Q.y + n.y * L };
    const R2 = { x: Q.x - n.x * L, y: Q.y - n.y * L };
    
    // Draw perpendicular segment
    drawSegment(R1.x, R1.y, R2.x, R2.y, '#FF6600', 1.5);
    
    // Draw right angle symbol at Q
    // Direction from Q to P
    const dir1 = { x: P.x - Q.x, y: P.y - Q.y };
    // Perpendicular direction (same as used for R1-R2)
    const dir2 = { x: n.x, y: n.y };
    drawRightAngle(Q.x, Q.y, dir1.x, dir1.y, dir2.x, dir2.y);
    
    // Draw points
    drawPoint(P.x, P.y, 'p', '#FF0000');
    drawPoint(Q.x, Q.y, 'q', '#00AA00', true, -15); // labelBelow = true, xOffset = -15
}

// Execute drawing
draw();
