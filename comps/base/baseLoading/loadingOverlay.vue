<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="loadingStore.isLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <n-spin size="large" />
      </div>
    </transition>
  </Teleport>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// store
import { useLoadingStore } from '@/stores';
// 共用型別
// 元件
// 商業邏輯

// ---------------------------

// ----------store----------
const loadingStore = useLoadingStore();
// -------------------------
</script>
