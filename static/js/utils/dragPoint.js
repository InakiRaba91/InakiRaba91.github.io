export function enableDragging(plot, points, pointRadius, callback, ...callbackArgs) {
  plot.addEventListener('mousedown', (e) => {
    const rect = plot.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let draggedPointIndex = null;

    points.forEach((point, index) => {
      const dx = point.x - x;
      const dy = point.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < pointRadius) {
        draggedPointIndex = index;
      }
    });

    if (draggedPointIndex !== null) {
      const onMouseMove = (e) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        points[draggedPointIndex] = { x, y };
        callback(...callbackArgs); // Call the injected callback function with additional arguments
      };

      document.addEventListener('mousemove', onMouseMove);

      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onMouseMove);
      }, { once: true });
    }
  });
}