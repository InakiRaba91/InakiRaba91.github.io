export function drawLineFromPoints(ctx, p1, p2, width) {
    const slope = (p2.y - p1.y) / (p2.x - p1.x);
    const intercept = p1.y - slope * p1.x;

    // Calculate the y-values at the edges of the canvas
    const y1 = slope * 0 + intercept;
    const y2 = slope * width + intercept;

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(0, y1);
    ctx.lineTo(width, y2);
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 2;
    ctx.stroke();
}

export function drawSegmentFromPoints(ctx, p1, p2, color = 'grey') {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

export function drawSegmentWithArrow(ctx, p1, p2, color = 'grey') {
    const headLength = 10; // Length of the arrowhead
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

    // Draw the line segment
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p2.x - headLength * Math.cos(angle - Math.PI / 6), p2.y - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p2.x - headLength * Math.cos(angle + Math.PI / 6), p2.y - headLength * Math.sin(angle + Math.PI / 6));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}