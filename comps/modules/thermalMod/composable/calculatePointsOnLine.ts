// 計算兩點中間所有座標，該函式無進行重構
export const calculatePointsOnLine = (a: number[], b: number[]): number[][] => {
  let x1 = a[0];
  let y1 = a[1];
  const x2 = b[0];
  const y2 = b[1];

  const points = [];
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    points.push([x1, y1]);

    if (x1 === x2 && y1 === y2) {
      break;
    }

    const err2 = 2 * err;

    if (err2 > -dy) {
      err -= dy;
      x1 += sx;
    }

    if (err2 < dx) {
      err += dx;
      y1 += sy;
    }
  }

  return points;
};
