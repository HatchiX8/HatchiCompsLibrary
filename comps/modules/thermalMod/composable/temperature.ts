interface Coordinate {
  x: number;
  y: number;
}

// 根據座標尋找溫度
export const getTemperatureAtCoordinate = (
  temperatureData: number[][],
  coordinate: Coordinate
): number | null => {
  const x = coordinate.x;
  const y = coordinate.y;

  if (x < 0 || x >= temperatureData.length || y < 0 || y >= temperatureData[x].length) {
    return null; // 返回 null 或處理錯誤情況
  }

  return temperatureData[x][y];
};

// 顯示溫度
export const displayTemperature = (temperatureData: number[][], coordinate: Coordinate): string => {
  const temperature = getTemperatureAtCoordinate(temperatureData, coordinate);

  if (temperature === null) {
    return 'N/A'; // 或者返回其他錯誤提示
  }

  const point = Number(temperature).toFixed(1);

  return point;
};
