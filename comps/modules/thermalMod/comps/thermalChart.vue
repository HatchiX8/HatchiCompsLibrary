<template>
  <div class="h-full w-full bg-white" ref="chartDom"></div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import * as echarts from 'echarts';
// store
// 共用型別
// 元件
// 商業邏輯

// ---------------------------

// ----------type----------
// interface ChartData {
//   title: string;
// }
// ------------------------

// ----------props&emit----------
const props = defineProps<{
  chartData: number[];
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
  { deep: true, immediate: true }
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
const getChartOption = (data: number[]): echarts.EChartsCoreOption => ({
  animation: false,
  backgroundColor: '#5B5B5B',
  title: [
    {
      text: '溫度',
      textStyle: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
      },
      top: 10,
      left: 150,
    },
  ],
  tooltip: {
    trigger: 'axis',
    // formatter: function (params) {
    //   return params.map(function (e) {
    //     var value = parseFloat(e.data[2]);
    //     return isNaN(value) ? `${e.seriesName}: ${e.data[1]}` : e.data
    //   }).join('<br/>');
    // }
  },
  legend: {
    textStyle: {
      fontSize: 22, // 修改图例字体大小为20px
    },
  },
  toolbox: {
    top: 5,
    right: 20,
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
      },
      restore: { title: '還原' },
      saveAsImage: { title: '下載' },
    },
    iconStyle: {
      borderColor: 'white',
    },
  },
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 0,
      end: 100,
    },
    {
      type: 'inside',
      realtime: true,
      start: 0,
      end: 100,
    },
  ],
  xAxis: {
    type: 'category',
    boundaryGap: false,
    nameLocation: 'center',
    nameTextStyle: {
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold',
      padding: [1, 0, 30, 1620], // 上、右、下、左
    },
    axisLine: {
      lineStyle: {
        color: 'white',
      },
    },
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    nameLocation: 'center',
    nameTextStyle: {
      color: 'white',
      lineHeight: 100,
      fontSize: 20,
    },
    axisLine: {
      lineStyle: {
        color: 'white',
      },
    },
  },
  series: [
    {
      symbolSize: 10,
      name: '溫度',
      type: 'line',
      data,
    },
  ],
});
// -------------------------
</script>
