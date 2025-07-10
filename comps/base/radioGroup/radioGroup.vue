<template>
  <n-space item-style="display: flex;" align="center">
    <n-radio-group :value="props.modelValue" @update:value="emit('update:modelValue', $event)">
      <n-space align="center">
        <n-radio :value="true">{{ props.options[0] }}</n-radio>
        <n-radio :value="false">{{ props.options[1] }}</n-radio>
      </n-space>
    </n-radio-group>
  </n-space>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// store
// 共用型別
// 元件
// 商業邏輯

// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  modelValue: boolean;
  options: [string, string];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
// ------------------------------
</script>
