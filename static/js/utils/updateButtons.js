export function updateButtons(addPointButton, removePointButton, points, maxPoints, minPoints) {
  addPointButton.disabled = points.length >= maxPoints;
  removePointButton.disabled = points.length <= minPoints;
}