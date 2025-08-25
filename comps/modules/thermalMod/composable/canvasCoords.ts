// 取得canvas對應的座標位置
export const getCanvasRelativePosition = (
  event: MouseEvent,
  canvasRef: Ref<HTMLCanvasElement | null>
): { x: number; y: number } | null => {
  const canvas = canvasRef.value;
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(event.clientY - rect.top);
  const y = Math.floor(event.clientX - rect.left);

  return { x, y };
};
