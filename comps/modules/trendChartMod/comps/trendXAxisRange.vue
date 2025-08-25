<template>
  <div class="flex items-center">
    <div class="flex">
      <n-input
        v-model:value="lower"
        class="text-4 rounded-r-none"
        placeholder="請輸入下限"
        :status="isValid === false ? 'error' : undefined"
      />
      <n-input
        v-model:value="upper"
        class="text-4 rounded-none"
        placeholder="請輸入上限"
        :status="isValid === false ? 'error' : undefined"
      />
    </div>
    <n-button type="primary" class="rounded-none" @click="submit">
      <div class="i-clarity:success-line w-16px h-16px"></div>
    </n-button>
    <n-button type="error" class="rounded-l-none" @click="close">
      <div class="i-clarity:times-line w-16px h-16px"></div>
    </n-button>
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
// store
// 共用型別
// 元件
// 商業邏輯

// ---------------------------

// ----------props&emit----------
// const props = defineProps<{
//   value: string;
// }>();

const emit = defineEmits<{
  (e: 'submit', payload: { upper: number; lower: number }): void;
  (e: 'close'): void;
}>();
// ------------------------------

// ----------初始化----------
// 初始化訊息提示
const message = useMessage();
// ---------------------------

// ----------input----------
const upper = ref<string>();
const lower = ref<string>();
const isValid = ref<boolean | null>(null);

const submit = () => {
  const upperVal = Number(upper.value);
  const lowerVal = Number(lower.value);

  if (isNaN(upperVal) || isNaN(lowerVal)) {
    message.error('請輸入數字');
    isValid.value = false;
    return;
  }

  if (upperVal <= lowerVal) {
    message.error('上限必須大於下限');
    isValid.value = false;
    return;
  }

  emit('submit', { upper: upperVal, lower: lowerVal });
  isValid.value = true;
};

const close = () => {
  upper.value = '';
  lower.value = '';
  isValid.value = null;
  emit('close');
};
// -------------------------
</script>
