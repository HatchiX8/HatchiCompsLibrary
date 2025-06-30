// ----------import----------
// 套件
import { ref } from 'vue';
import { defineStore } from 'pinia';
// API
// 共用型別
// 元件
// 商業邏輯
// --------------------------

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref<boolean>(false);

  const start = () => {
    isLoading.value = true;
  };

  const stop = () => {
    isLoading.value = false;
  };

  return { isLoading, start, stop };
});
