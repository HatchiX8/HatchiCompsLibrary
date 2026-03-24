<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <n-date-picker
        v-model:value="innerValue"
        :type="type"
        :size="size"
        :clearable="clearable"
        :disabled="disabled"
        :placeholder="placeholder"
        :status="pickerStatus"
        @update:value="handleChange"
      />
    </div>
    <div>
      <p v-if="pickerStatus === 'error'" class="text-red text-shadow-sm mt-2 text-center font-bold">
        {{ errorMsg }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';

// ---------- type ----------
type PickerStatus = 'error' | 'success' | undefined;

// 驗證結果：只負責驗證，不負責修改資料
interface RangeCheckResult {
  valid: boolean;
  message?: string;
}

// emit 出去的格式
interface RangePayload {
  start: string;
  end: string;
}
// --------------------------

// ---------- props & emit ----------
const props = withDefaults(
  defineProps<{
    // 初始值，由父層決定，不在元件內硬編碼
    defaultValue?: [number, number] | null;
    // 日期格式，選填，預設 YYYY-MM-DD HH:mm:ss
    format?: string;
    // 驗證邏輯，選填，不需要驗證的頁面可以不傳
    normalize?: (range: [number, number]) => RangeCheckResult;

    // 常用 API
    type?: 'datetimerange' | 'daterange' | 'monthrange' | 'quarterrange' | 'yearrange';
    size?: 'small' | 'medium' | 'large';
    clearable?: boolean;
    disabled?: boolean;
    placeholder?: string;
  }>(),
  {
    defaultValue: null,
    format: 'YYYY-MM-DD HH:mm:ss',
    normalize: undefined,
    type: 'datetimerange',
    size: 'medium',
    clearable: true,
    disabled: false,
    placeholder: undefined,
  }
);

const emit = defineEmits<{
  (e: 'update:value', payload: RangePayload | null): void;
}>();
// ----------------------------------

// ---------- 內部狀態 ----------
const innerValue = ref<[number, number] | null>(props.defaultValue ?? null);
const pickerStatus = ref<PickerStatus>();
const errorMsg = ref('');
// ------------------------------

// ---------- 日期切換 ----------
const handleChange = (val: [number, number] | null) => {
  // 使用者清空
  if (!val) {
    innerValue.value = null;
    pickerStatus.value = undefined;
    errorMsg.value = '';
    emit('update:value', null);
    return;
  }

  // 有傳入 normalize 才做驗證，否則直接通過
  if (props.normalize) {
    const result = props.normalize(val);
    if (!result.valid) {
      pickerStatus.value = 'error';
      errorMsg.value = result.message ?? '日期範圍不正確';
      return;
    }
  }

  // 驗證通過 or 無驗證，直接 emit 格式化後的結果
  innerValue.value = val;
  pickerStatus.value = 'success';
  errorMsg.value = '';
  emit('update:value', formatRangeDate(val));
};

// 格式化：元件負責轉換 Naive UI timestamp → 字串
const formatRangeDate = (range: [number, number]): RangePayload => ({
  start: dayjs(range[0]).format(props.format),
  end: dayjs(range[1]).format(props.format),
});
// ------------------------------
</script>
