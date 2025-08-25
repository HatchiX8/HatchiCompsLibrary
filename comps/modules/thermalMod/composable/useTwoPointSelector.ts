type Point = [number, number];

// 熱影像座標點位選擇
export const userPointSelector = (callback: (p1: Point, p2: Point) => void) => {
  let firstPoint: Point | null = null;

  const recordClick = (x: number, y: number) => {
    if (!firstPoint) {
      // 第一次點擊，記錄第一個點
      firstPoint = [y, x];

      // 在第一次點擊時回傳 firstPoint
      callback(firstPoint, firstPoint); // 可以將第一次點擊座標當作第二點也傳遞過去
    } else {
      // 第二次點擊，形成一組
      const secondPoint: Point = [y, x];
      callback(firstPoint, secondPoint); // 呼叫前面定義函式
      firstPoint = null; // 重置點位等待下一組
    }
  };

  return {
    recordClick,
  };
};
