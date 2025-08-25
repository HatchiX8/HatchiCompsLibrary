<template>
  <loadingAreaOverlay
    v-if="inspectStore.curlIsLoading"
    :loadingId="inspectStore.curlLoading"
    class="h-full"
  >
  </loadingAreaOverlay>
  <div v-else class="h-full w-full">
    <div
      v-if="props.lineStatus === 5 && noData === false"
      class="bg-backgroundSecondary pos-relative flex h-full w-full items-center justify-center"
    >
      <radioGroup
        v-model:modelValue="isInner"
        class="chartCheckBoxMd"
        :options="['內圈', '外圈']"
      />
      <trendXAxisRange
        v-if="!isRealTime"
        class="axisInputMd w-43%"
        @submit="handleSubmit"
        @close="handleClose"
      />

      <trendChart
        :chartData="currentDisplayData"
        :upper="upperLimit"
        :lower="lowerLimit"
        :coilImg="currentImg"
      />

      <radioGroup
        v-model:modelValue="isFirstImg"
        class="imgCheckBoxMd"
        :options="['原圖', '鬆散']"
      />
    </div>
    <!-- 3/4號線趨勢圖區塊 -->
    <div
      v-else-if="props.lineStatus === 3 || props.lineStatus === 4"
      class="bg-backgroundSecondary pos-relative flex h-full w-full items-center justify-center"
    >
      <radioGroup
        v-model:modelValue="isInner"
        class="chartCheckBoxMd"
        :options="['內圈', '外圈']"
      />

      <trendTFChart :chartData="currentDisplayTFData" :chartRange="props.conditionInfoData" />
    </div>
    <div v-else class="flex items-center justify-center">
      <p class="text-12 mt-30">此ID資料為空</p>
    </div>
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { ref, watch, computed } from 'vue';
// store
import { useInspectStore } from '@/stores/index';
// 共用型別
import type { curlData, curlTFData, ChartPoint } from './composable/type';
// 元件
import { trendChart, trendTFChart, radioGroup, trendXAxisRange } from './comps/index';
import { loadingAreaOverlay } from '@/components/index';
// 商業邏輯
// ---------------------------

// ----------store----------
const inspectStore = useInspectStore();
// -------------------------

// ----------props&emit----------
const props = defineProps<{
  conditionInfoData: {
    backCode?: string;
    LowMax?: number;
    LowMin?: number;
    UpMax?: number;
    UpMin?: number;
  } | null;
  lineStatus: number;
  curlChartData: curlData | undefined;
  curlChartTFData: curlTFData | undefined;
  isRealTime: boolean;
}>();

// ------------------------------

// ----------趨勢圖資料處理----------
// 內外圈趨勢圖資料
const currentDisplayData = computed(() => (isInner.value ? innerData.value : outerData.value));
const innerData = ref<ChartPoint[]>();
const outerData = ref<ChartPoint[]>();
const isInner = ref<boolean>(true); // 控制趨勢圖內外圈
const isFirstImg = ref<boolean>(true); // 控制切換圖片
const firstImg = ref<string>('');
const looseImg = ref<string>('');
const currentImg = computed(() => (isFirstImg.value ? firstImg.value : looseImg.value));
const noData = ref<boolean>(true);

// 轉換內外圈趨勢圖XY點位，以及寫入其他資料
const processCurlData = (data: curlData) => {
  innerData.value = data.Inner.map(item => ({
    value: [item[0], item[1]],
    extra: [item[0], item[1], item[2], item[3], item[4]],
  }));

  outerData.value = data.Outer.map(item => ({
    value: [item[0], item[1]],
    extra: [item[0], item[1], item[2], item[3], item[4]],
  }));

  firstImg.value = data.Jpg;
  looseImg.value = data.Jpg2;

  if (innerData.value.length > 0 && outerData.value.length > 0) {
    noData.value = false;
  }
};

// 上下限操控
const upperLimit = ref<number>(200);
const lowerLimit = ref<number>(-100);

// 更新上下限數值
const handleSubmit = (payload: { upper: number; lower: number }) => {
  upperLimit.value = payload.upper;
  lowerLimit.value = payload.lower;
};

// 清空上下限數值並回到預設值
const handleClose = () => {
  upperLimit.value = 200;
  lowerLimit.value = -100;
};

// 監聽父層傳入資料並進行轉換
watch(
  () => props.curlChartData,
  newVal => {
    if (newVal && newVal.Inner.length && newVal.Outer.length) {
      processCurlData(newVal);
    }
  },
  { immediate: true }
);

// 3&4號線資料處理
const currentDisplayTFData = computed(() =>
  isInner.value ? innerTFData.value : outerTFData.value
);
const innerTFData = ref<ChartPoint[]>();
const outerTFData = ref<ChartPoint[]>();

const processCurlTFData = (data: curlTFData) => {
  innerTFData.value = data.Inner.map(item => ({
    value: [item[0], item[1]],
    extra: [item[0], item[1], item[2], item[3], item[4]],
  }));

  outerTFData.value = data.Outer.map(item => ({
    value: [item[0], item[1]],
    extra: [item[0], item[1], item[2], item[3], item[4]],
  }));
};

watch(
  () => props.curlChartTFData,
  newVal => {
    if (newVal && newVal.Inner.length && newVal.Outer.length) {
      processCurlTFData(newVal);
    }
  },
  { immediate: true }
);
// ---------------------------------
</script>

<style>
/* 因為套用tailwind的class排序器，會無法使用md:(top-3 z-10)這樣的寫法，所以響應式額外寫在這 */
@media (min-width: 768px) {
  .chartCheckBoxMd {
    @apply left-50 absolute top-3 z-10;
  }
}

@media (min-width: 768px) {
  .imgCheckBoxMd {
    @apply absolute bottom-1 left-10 z-10;
  }
}

@media (min-width: 768px) {
  .axisInputMd {
    @apply absolute z-10 hidden 2xl:block 2xl:flex;
  }
}
</style>
