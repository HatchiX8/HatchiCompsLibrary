<template>
  <baseButton color="primary">按鈕</baseButton>
  <buttonGroup v-model="selected" :options="categoryOptions" />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { ref } from 'vue';
// store
// 共用型別
// 元件
import { baseButton, buttonGroup } from '@/comps/base/baseButton';
// 商業邏輯

// ---------------------------

// ----------按鈕表單-----------
const categoryOptions = [
  { label: '全部', value: 'all' },
  { label: '選項1', value: '1' },
  { label: '選項2', value: '2' },
  { label: '選項3', value: '3' },
];

const selected = ref('all');
// ----------------------------
</script>
