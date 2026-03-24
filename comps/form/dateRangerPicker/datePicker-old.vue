<template>
  <div>
    <div class="flex flex-col">
      <div class="flex items-center">
        <n-date-picker
          type="datetimerange"
          :status="pickerStatus"
          v-model:value="innerValue"
          clearable
          @update:value="handleChange"
          size="large"
        />
      </div>
      <div>
        <p
          v-if="pickerStatus === 'error'"
          class="text-red text-shadow-sm mt-2 text-center font-bold"
        >
          {{ errorMsg }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';

// ----------多頁面共用----------
// 如需要多頁面共用，請掛上props，如下
// const props = defineProps<{
//   normalize?: (range: [number, number]) => RangeCheckResult;
// }>();

// 並且將normalizeDateRange 函式改為 props.normalize
// 由父層定義函式條件並傳入子層
// const result = props.normalizeDateRange(val);
// -----------------------------

// ----------props&emit----------
const emit = defineEmits<{
  (e: 'update:value', payload: RangePayload | null): void;
}>();
// ------------------------------

// ----------type----------
type PickerStatus = 'error' | 'success' | undefined;
type RangeCheckStatus = 'ok' | 'warring' | 'default';

interface RangeCheckResult {
  status: RangeCheckStatus;
  data: [number, number] | null;
  message: string;
}

interface RangePayload {
  start: string;
  end: string;
}

// ------------------------

// ----------初始化----------
// 初始化時間
const getInitialRange = (): [number, number] => {
  const now = dayjs();
  const eightHoursAgo = now.subtract(8, 'hour');
  return [eightHoursAgo.valueOf(), now.valueOf()];
};

const innerValue = ref<[number, number]>(getInitialRange());

// 內部狀態
const pickerStatus = ref<PickerStatus>();
const errorMsg = ref('');
// -------------------------

// ----------日期切換----------

const handleChange = (val: [number, number]) => {
  innerValue.value = val;

  const result = normalizeDateRange(val); // 當使用者選擇同天日期，檢查日期是否正確

  // 依照回傳值狀態進行對應
  if (result.status === 'warring') {
    pickerStatus.value = 'error';
    errorMsg.value = result.message;
  } else if (result.status === 'ok') {
    // 狀態為正常，即傳出至父層
    pickerStatus.value = 'success';
    if (result.data) {
      innerValue.value = result.data;
      emit('update:value', formatRangeDate(result.data));
    }
  } else if (result.status === 'default') {
    // 狀態為預設，則回傳預設值
    pickerStatus.value = 'success';
    innerValue.value = getInitialRange();
    emit('update:value', formatRangeDate(innerValue.value));
  }
};

// 日期格式化
const formatRangeDate = (
  range: [number, number] | null | undefined,
  format = 'YYYY-MM-DD HH:mm:ss'
): { start: string; end: string } | null => {
  if (!range || !range[0] || !range[1]) return null;

  return {
    start: dayjs(range[0]).format(format),
    end: dayjs(range[1]).format(format),
  };
};

// 日期範圍正規化，可依照各頁面條件進行調整
const normalizeDateRange = (val: [number, number]): RangeCheckResult => {
  if (!val || val.length !== 2)
    return {
      status: 'default',
      data: val,
      message: '',
    }; // 避免使用者清空後報錯

  const [start, end] = val;

  const startDayjs = dayjs(start);
  const endDayjs = dayjs(end);

  // 禁止相同時間（避免查詢 0 秒範圍）
  if (startDayjs.isSame(endDayjs)) {
    console.warn('開始與結束時間相同，請選擇有效區間');
    return {
      status: 'warring',
      data: null,
      message: '開始與結束時間相同，請選擇有效區間',
    };
  }

  // 限制最多只能查詢 8 小時（= 8 * 60 * 60 * 1000 毫秒）
  const duration = endDayjs.diff(startDayjs, 'millisecond');
  const eightHours = 8 * 60 * 60 * 1000;
  if (duration > eightHours) {
    console.warn('查詢區間不得超過 8 小時');
    return {
      status: 'warring',
      data: null,
      message: '查詢區間不得超過 8 小時',
    };
  }

  return {
    status: 'ok',
    data: val,
    message: '',
  };
};
// ---------------------------
</script>
