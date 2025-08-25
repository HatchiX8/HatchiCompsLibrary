<template>
  <div class="h-full w-full overflow-hidden rounded-xl shadow" ref="chartDom"></div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { ref, markRaw, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
// 共用型別
import type { ChartPoint, conditionInfoType } from '@/views/Home/coil-inspect/api/index';
// 元件
// 商業邏輯

// ----------props&emit----------
const props = defineProps<{
  chartData: ChartPoint[] | undefined;
  chartRange: conditionInfoType | null;
  // chartUnit: string;
  // intervalData: number;
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

  const { clientWidth, clientHeight } = chartDom.value;
  if (clientWidth === 0 || clientHeight === 0) return;

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
  nextTick(() => {
    window.addEventListener('resize', handleResize); // 處理自適應問題
  });
});

// 卸載元件
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
// -------------------------------

// ----------watch----------
// 監聽趨勢圖資料與範圍資料更新
watch(
  [() => props.chartData, () => props.chartRange],
  ([newChartData, newChartRange]) => {
    if (Array.isArray(newChartData) && newChartData.length > 0) {
      nextTick(() => {
        // 確保圖表初始化
        if (!echart) {
          initChart();
        }

        // 確保 chartRange 資料存在才進行更新
        if (
          newChartRange &&
          (newChartRange.LowMax ||
            newChartRange.LowMin ||
            newChartRange.UpMax ||
            newChartRange.UpMin)
        ) {
          renderCharts();
        }
      });
    }
  },
  { immediate: true }
);

// -------------------------

// ----------趨勢圖----------
// 更新趨勢圖
const renderCharts = () => {
  if (!echart) return;
  if (!props.chartData) return;

  const option = getChartOption();

  echart.setOption(option, true);
};

// 可抽換趨勢圖內容
const getChartOption = (): echarts.EChartsCoreOption => ({
  backgroundColor: '#5B5B5B',
  toolbox: {
    right: '3%',
    top: '2%',
    feature: {
      // dataZoom: {
      //   yAxisIndex: 'none'
      // },
      restore: {
        title: '還原',
        iconStyle: {
          color: 'white',
        },
      },
    },
  },
  tooltip: {
    // trigger: 'axis',
    trigger: 'item',
    formatter(
      params: { data: ChartPoint; dataIndex: number } | { data: ChartPoint; dataIndex: number }[]
    ) {
      const extra = Array.isArray(params) ? params[0].data.extra : params.data.extra;
      const dataIndex = Array.isArray(params) ? params[0].dataIndex : params.dataIndex;
      // 上面這樣同步處理陣列與物件的原因，是EChart的params回傳會出現某幾個點變成物件而導致噴錯
      if (!extra) return '';

      const [bulge, thickness, turns, length, diameter] = extra;

      const direction =
        dataIndex < Math.floor((props.chartData?.length ?? 0) / 2) ? '(下捲)' : '(上捲)';

      if (bulge > -500 || thickness === 0) {
        return `${direction}<br/><h3 style='color: green; padding: 2px;'>
      凸度: ${bulge.toFixed(2)}<br/>
      厚度: ${thickness.toFixed(2)}<br/>
      圈數: ${Math.floor(turns)}<br/>
      米數: ${length}<br/>
      直徑(Dn): ${diameter}</h3>`;
      } else {
        return '';
      }
    },
  },
  grid: {
    left: '14%',
    right: '5%',
    top: '14%',
    bottom: '15%',
  },
  xAxis: {
    name: `Measure value(mm)`,
    type: 'value',
    nameLocation: 'center',
    nameTextStyle: {
      fontSize: 20,
      lineHeight: 50,
      color: 'white',
    },
    max: 150,
    min: -100,
    interval: 50,
    axisLine: {
      lineStyle: {
        color: 'white',
      },
    },
  },
  yAxis: {
    name: 'Position(mm)',
    type: 'value',
    // inverse: true, // 反轉圖表
    nameLocation: 'center',
    nameTextStyle: {
      lineHeight: 90,
      fontSize: 20,
      color: 'white',
    },
    axisLine: {
      lineStyle: {
        color: 'white',
      },
    },
    axisPointer: {
      show: true,
      type: 'line',
      triggerEmphasis: true,
      snap: true,
      label: {
        show: false,
      },
    },
  },
  dataZoom: {
    start: 0,
    end: 100,
    type: 'inside',
    orient: 'vertical',
    filterMode: 'none',
  },
  series: [
    {
      showSymbol: false,
      type: 'line',
      data: props.chartData,
      itemStyle: {
        color: 'red',
      },
      lineStyle: {
        color: 'yellow',
      },
      markLine: {
        data: [
          { xAxis: props.chartRange?.LowMax, lineStyle: { color: 'red' } },
          { xAxis: props.chartRange?.LowMin, lineStyle: { color: 'red' } },
          { xAxis: props.chartRange?.UpMax, lineStyle: { color: 'pink' } },
          { xAxis: props.chartRange?.UpMin, lineStyle: { color: 'pink' } },
        ],
      },
    },
  ],
});
// -------------------------
</script>
