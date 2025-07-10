# 🔄 Loading 讀取效果元件使用說明

本文件介紹共用的兩種 Loading 效果元件，以及如何透過 Pinia store 控制顯示邏輯。

---

## 📍 元件清單

| 元件名稱                 | 功能說明           | 使用情境           |
| ------------------------ | ------------------ | ------------------ |
| `loadingOverlay.vue`     | 全頁面遮罩讀取效果 | 跨頁請求、全局讀取 |
| `loadingAreaOverlay.vue` | 區塊內讀取遮罩效果 | 區域資料請求時使用 |
| `loadingStore.ts`        | 全畫面遮罩 store   | 狀態操控           |
| `areaLoadingStore.ts`    | 區塊內遮罩 store   | 狀態操控           |

---

## 📦 使用方式

### 1️ 全畫面遮罩 `loadingOverlay`

### 2 局部遮罩 `loadingAreaOverlay`

```vue
<loadingOverlay />

<loadingAreaOverlay />
```

🎯 使用方式範例(store)

// stores/inspectStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAreaLoadingStore } from '@/stores';
import { apiPostL2Info } from '@/api';
import { getErrorMessage } from '@/utils';

export const useInspectStore = defineStore('inspectStore', () => {
const loading = useAreaLoadingStore();

const infoLoading = 'useInfo'; // <<<---- 識別用 key，會綁在 loadingAreaOverlay 上
const l2_infoList = ref([]);
const error = ref<string | null>(null);

const fetchL2Info = async (postData) => {
loading.start(infoLoading); // <<<---- 呼叫時帶上該區域的 id
error.value = null;

    try {
      const res = await apiPostL2Info(postData);
      l2_infoList.value = res;
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      loading.stop(infoLoading);
    }

};

return {
l2_infoList,
fetchL2Info,
loading,
error,
infoLoading,
};
});

🎯 使用方式範例(vue 元件)

<!-- components/InspectView.vue -->
  <template>
    <loadingAreaOverlay :id="inspectStore.infoLoading">
      <div>
        <infoComponent :data="inspectStore.l2_infoList" />
      </div>
    </loadingAreaOverlay>
  </template>

  <script setup lang="ts">
  import { useInspectStore } from '@/stores';
  const inspectStore = useInspectStore();
  </script>
