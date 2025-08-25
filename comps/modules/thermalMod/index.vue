<template>
  <div
    :class="[
      'bg-background text-foreground gap-2 py-2',
      isRealTime
        ? 'flex w-full flex-col' // 垂直排版 & 滿版
        : 'grid grid-cols-[0.9fr_1.1fr]', // 預設雙欄 Grid
    ]"
  >
    <div class="bg-backgroundSecondary boxShadowStyle flex flex-col">
      <div class="flex flex-col flex-col-reverse 2xl:flex-row">
        <div v-if="!isRealTime" ref="wrapperRef" class="relative inline-block">
          <!-- src="/src/assets/images/hot_image.jpg" -->
          <!-- :src="props.hotImage" -->
          <img
            ref="imgRef"
            :src="props.hotImage"
            alt="熱影像照片"
            class="w-160 h-120"
            @load="syncCanvasSize"
          />
          <canvas
            ref="canvasRef"
            class="absolute left-0 top-0 z-10"
            @mousemove="onMouseMove"
            @click="handleTwoPoint"
          />
        </div>
        <div class="p-5">
          <ul
            :class="[
              'flex min-w-0 flex-wrap justify-center gap-3 text-nowrap', // 注意：不要 h-full
              isRealTime ? 'flex-row 2xl:flex-row' : 'flex-col 2xl:flex-col',
            ]"
          >
            <li class="text-red-6">最高</li>
            <li>{{ maxTemperature }}°C</li>
            <li class="text-green-6">平均</li>
            <li>{{ avgTemperature }}°C</li>
            <li class="text-blue-5">最低</li>
            <li>{{ minTemperature }}°C</li>
            <li class="text-purple-5">游標</li>
            <li>{{ currentPoint }}°C</li>
            <li class="text-amber-5">P.1</li>
            <li>{{ point1 }}</li>
            <li class="text-amber-5">P.2</li>
            <li>{{ point2 }}</li>
            <li class="mt-auto">
              <n-button class="w-full" @click="resetPointClick">重置</n-button>
            </li>
            <!-- <li class="mt-auto"><n-button class="w-full">下載圖片</n-button></li> -->
          </ul>
        </div>
      </div>
      <div class="flex items-center justify-center p-2">
        <div class="mr-auto">
          <img src="/src/assets/images/sa.png" alt="" />

          <div class="w-full">
            <div class="flex justify-between font-bold">
              <h2>0</h2>
              <h2 class="ml-8">500</h2>
              <h2>700</h2>
            </div>
          </div>
        </div>

        <div class="">
          <p class="text-nowrap text-2xl">{{ props.hotTime }}</p>
        </div>
      </div>
    </div>

    <div
      v-if="!isRealTime"
      class="bg-backgroundSecondary boxShadowStyle flex h-full items-center justify-center"
    >
      <thermalChart :chartData="chartTemperature" />
    </div>
  </div>

  <div v-if="isRealTime" class="bg-backgroundSecondary boxShadowStyle flex flex-col">
    <div ref="wrapperRef" class="relative inline-block">
      <!-- src="/src/assets/images/hot_image.jpg" -->
      <!-- :src="props.hotImage" -->
      <img
        ref="imgRef"
        :src="props.hotImage"
        alt="熱影像照片"
        class="w-160 h-120"
        @load="syncCanvasSize"
      />
      <canvas
        ref="canvasRef"
        class="absolute left-0 top-0 z-10"
        @mousemove="onMouseMove"
        @click="handleTwoPoint"
      />
    </div>
  </div>
  <div
    v-if="isRealTime"
    class="bg-backgroundSecondary boxShadowStyle flex h-full items-center justify-center"
  >
    <thermalChart :chartData="chartTemperature" />
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
import thermalChart from './comps/thermalChart.vue';
// 商業邏輯
import {
  userPointSelector,
  getCanvasRelativePosition,
  displayTemperature,
  calculatePointsOnLine,
} from './composable/index';

// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  dtiData: number[][] | undefined;
  hotTime: string | undefined;
  hotImage: string | undefined;
  isRealTime?: boolean;
}>();

// ------------------------------

// ----------區域----------
// -----------------------

// ----------熱影像點擊處理----------
// 此區塊是依照原網站熱影像邏輯重構，有些地方邏輯怪怪，但原本的code就是這樣(例:XY相反)
// 故依照原本邏輯撰寫而成
const canvasRef = ref<HTMLCanvasElement | null>(null);
const imgRef = ref<HTMLImageElement | null>(null);

const maxTemperature = ref<number>(0); // 最大溫度
const minTemperature = ref<number>(0); // 最小溫度
const avgTemperature = ref<number>(0); // 平均溫度
const chartTemperature = ref<number[]>([]);
const currentPoint = ref<number>(0); // 游標溫度

const pointDisabled = ref<boolean>(false); // 是否可點擊狀態

const allPoint = ref<number[][]>([]); // P!+P2座標
const point1 = ref<number[]>([]); // P1座標
const point2 = ref<number[]>([]); // P2座標

// 設定圖片與Canvas大小同步
const syncCanvasSize = () => {
  const canvas = canvasRef.value;
  const img = imgRef.value;
  if (!canvas || !img) return;

  const width = img.clientWidth;
  const height = img.clientHeight;

  // 設定 canvas 尺寸
  canvas.width = width; // 實際繪圖空間（座標系統）
  canvas.height = height;
  canvas.style.width = `${width}px`; // 視覺寬高
  canvas.style.height = `${height}px`;
};

// 依照滑鼠游標位置顯示當前值
const onMouseMove = (event: MouseEvent) => {
  const pos = getCanvasRelativePosition(event, canvasRef); // 依照當前位置轉換成座標

  if (!pos) return;
  if (props.dtiData) {
    const point = displayTemperature(props.dtiData, pos); // 依照座標轉換成溫度
    currentPoint.value = Number(point);
  }
};

// 當點擊滿2點觸發的事件
const { recordClick } = userPointSelector((p1, p2) => {
  if (p1 !== p2) {
    point2.value = p2;
    pointDisabled.value = true;
  } else {
    point1.value = p1;
  }
});

// 點擊事件
const handleTwoPoint = (event: MouseEvent) => {
  const pos = getCanvasRelativePosition(event, canvasRef); // 依照當前位置轉換成座標

  if (!pos || pointDisabled.value) return;

  recordClick(pos.x, pos.y); // 觸發callBack

  allPoint.value.push([pos.y, pos.x]);
  if (allPoint.value.length === 1) {
    drawDot(pos.y, pos.x, 'red'); // 繪點
  } else if (allPoint.value.length === 2) {
    drawDot(pos.y, pos.x, 'yellow');
    drawLine(allPoint.value[0], allPoint.value[1]); // 繪線
    calcTemperatureStats(allPoint.value[0], allPoint.value[1]); // 計算溫度
  }
};

// 重置事件
const resetPointClick = () => {
  pointDisabled.value = false;

  // 清除畫布
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas?.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // 重置數據
  point1.value = [];
  point2.value = [];
  allPoint.value = [];
  maxTemperature.value = 0;
  minTemperature.value = 0;
  avgTemperature.value = 0;
  chartTemperature.value = [];
};

// 新增點位圖示
const drawDot = (x: number, y: number, color: string) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  // ctx.fillStyle = 'white';
  ctx.lineWidth = 5;
  ctx.fill();
};

// 新增線圖示
const drawLine = ([x1, y1]: number[], [x2, y2]: number[]) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.stroke();
};

// 計算最大最小、平均溫度
const calcTemperatureStats = (pointA: number[], pointB: number[]) => {
  const pointOnLine = calculatePointsOnLine(pointA, pointB); // 計算兩點之間所有座標

  // 計算每個座標的溫度
  const temperatures = pointOnLine.map(point => {
    if (props.dtiData) {
      return displayTemperature(props.dtiData, { x: point[1], y: point[0] });
    }
    return null;
  });

  // 將每筆溫度平均，以及取最大小值
  if (temperatures) {
    const numericTemperatures = temperatures.map(temp => Number(temp));
    const validTemperatures = numericTemperatures.filter(temp => !isNaN(temp));
    chartTemperature.value = validTemperatures;
    maxTemperature.value = Math.max(...validTemperatures);
    minTemperature.value = Math.min(...validTemperatures);
    avgTemperature.value = Number(
      (validTemperatures.reduce((acc, temp) => acc + temp, 0) / validTemperatures.length).toFixed(2)
    );
  }
};
// ---------------------------------
</script>
