// ----------import----------
// 套件
import { ref } from 'vue';
import { defineStore } from 'pinia';
// API
// 共用型別
// 元件
// 商業邏輯
// --------------------------

export const useAreaLoadingStore = defineStore('areaLoading', () => {
  const loadingMap = ref<Record<string, boolean>>({});

  const start = (key: string) => {
    loadingMap.value[key] = true;
  };

  const stop = (key: string) => {
    loadingMap.value[key] = false;
  };

  const isLoading = (key: string) => loadingMap.value[key] === true;

  return { loadingMap, isLoading, start, stop };
});
