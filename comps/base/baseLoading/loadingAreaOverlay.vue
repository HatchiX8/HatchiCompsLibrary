<template>
  <n-spin :show="isLoading(props.loadingId)" size="large" class="p-4">
    <slot />
  </n-spin>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// store
import { useAreaLoadingStore } from '@/stores';
// 共用型別
// 元件
// 商業邏輯

// ---------------------------

// ----------store----------
const areaLoading = useAreaLoadingStore();
const { isLoading } = areaLoading;
// -------------------------

// ----------props&emit----------
const props = defineProps<{
  loadingId: string;
}>();

// ------------------------------
</script>
