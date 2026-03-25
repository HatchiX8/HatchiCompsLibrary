<template>
  <div :class="['w-full bg-white', props.height ?? 'h-80']"  ref="chartDom"></div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { ref, markRaw, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
// store
// 共用型別
// 元件
// 商業邏輯

// ---------------------------

// ----------type----------
interface ChartData {
  title: string;
  xAxisData: string[]; // x 軸類別
  seriesData: number[]; // 數值資料
  seriesName?: string; // 可選，系列名稱
}
// ------------------------

// ----------props&emit----------
const props = defineProps<{
  chartData: ChartData;
  height?: string; 
}>();

// const emit = defineEmits<{
//   (e: 'chart-ready', instance: echarts.ECharts): void;
// }>();
// ------------------------------

// ----------趨勢圖初始化----------
const chartDom = ref<HTMLDivElement | null>(null); // DOM 容器
let echart: echarts.ECharts | null = null; // 圖表實例 (用 ref 會導致 tooltip 無法正常顯示)

// 初始化
const initChart = () => {
  if (!chartDom.value) return;
  if (echart) {
    echart.dispose();
  }
  echart = markRaw(echarts.init(chartDom.value));
};

const handleResize = () => {
  if (echart) echart.resize();
};

// 掛載元件
onMounted(() => {
  initChart(); // 初始化趨勢圖
  renderCharts(); // 更新趨勢圖
  window.addEventListener('resize', handleResize); // 處理自適應問題
});

// 卸載元件
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
// -------------------------------

// ----------watch----------
watch(
  () => props.chartData,
  () => {
    nextTick(() => {
      renderCharts();
    });
  },
  { deep: true },
);
// -------------------------

// ----------趨勢圖----------
// 更新趨勢圖
const renderCharts = () => {
  if (!echart) return;

  const option = getChartOption(props.chartData);
  echart.setOption(option, true);
};

// 可抽換趨勢圖內容
const getChartOption = (data: ChartData): echarts.EChartsCoreOption => ({
  title: {
    text: data.title,
  },
  xAxis: {
    type: 'category',
    data: data.xAxisData,         // 改為動態
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: data.seriesName,
      data: data.seriesData,       // 改為動態
      type: 'line',
      label: { show: true, position: 'top' },
    },
  ],
  tooltip: {
    trigger: 'axis', // 顯示軸提示
    formatter: '{b}: {c}',
  },
});
// -------------------------
</script>
