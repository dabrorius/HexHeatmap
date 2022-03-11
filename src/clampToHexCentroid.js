export function clampToHexCentroid(x, y, hexDiagonalLength) {
  // X distance is equal to the distance between opposing sides of a hex
  // diagonal / (2 * tan(30))
  const hexDiagonalToXDistanceRatio = 0.827;
  // Y distance is equal to diagonal + length of one side of a hex
  // diagonal * (1 / (2 * tan(30) + 0.5))
  const hexDiagonalToYDistanceRatio = 1.36602540378;

  const [mainGridX, offsetGridX] = nearestCenteroids(
    x,
    hexDiagonalLength * hexDiagonalToXDistanceRatio
  );
  const [mainGridY, offsetGridY] = nearestCenteroids(
    y,
    hexDiagonalLength * hexDiagonalToYDistanceRatio
  );

  const mainGridDistance = squareDistance(mainGridX, mainGridY, x, y);
  const offsetGridDistance = squareDistance(offsetGridX, offsetGridY, x, y);

  return mainGridDistance < offsetGridDistance
    ? { x: mainGridX, y: mainGridY }
    : { x: offsetGridX, y: offsetGridY };
}

function nearestCenteroids(position, size) {
  const halfSize = size / 2;
  const halfBin = Math.floor(position / halfSize);
  const isOddHalfBin = halfBin % 2 === 0;

  const mainGridBin = halfSize * (halfBin + (isOddHalfBin ? 1 : 0));
  const offsetGridBin = halfSize * (halfBin + (isOddHalfBin ? 0 : 1));

  return [mainGridBin, offsetGridBin];
}

function squareDistance(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.pow(dx, 2) + Math.pow(dy, 2);
}
