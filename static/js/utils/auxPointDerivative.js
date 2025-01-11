export function auxPointDerivative(pa, pb, lengthArrow, reverse = false) {
    let dirVector = { x: pb.x - pa.x, y: pb.y - pa.y };
    const norm = Math.sqrt(dirVector.x ** 2 + dirVector.y ** 2);
    dirVector = { x: lengthArrow * dirVector.x / norm, y: lengthArrow * dirVector.y / norm };
    if (reverse) {
        dirVector = { x: -dirVector.x, y: -dirVector.y };
    }
    return { x: pa.x + dirVector.x, y: pa.y + dirVector.y };
}