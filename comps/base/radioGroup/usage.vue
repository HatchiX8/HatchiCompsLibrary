<template>
  <div>
    <radioGroup v-model:modelValue="isInner" :options="['內圈', '外圈']" />
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { ref } from 'vue';

// store
// 共用型別
// 元件
import { radioGroup } from '@/comps/base/radioGroup';
// 商業邏輯

// ---------------------------

const isInner = ref<boolean>(true); // 控制趨勢圖內外圈
</script>
