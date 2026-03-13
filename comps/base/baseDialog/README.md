# BaseDialog 彈跳視窗封裝

## 簡介

`baseDialog` 是對 Naive UI `n-modal` 的二次封裝，提供統一的標題、寬度、取消／確定按鈕與 loading 狀態，讓業務元件只需關注內容，而不需重複撰寫按鈕列與 modal 控制邏輯。

---

## 檔案結構

```
baseDialog/
├── baseDialog.vue   # 基礎彈窗元件（UI 殼層）
├── usage.vue        # 頁面使用範例
└── README.md
```

---

## baseDialog.vue

### Props

| Prop         | 型別      | 預設值      | 說明                   |
| ------------ | ------- | -------- | -------------------- |
| `modelValue` | boolean | —（必填）    | 控制 modal 開關（v-model） |
| `title`      | string  | `'視窗'`   | 標題文字                 |
| `width`      | string  | `'600px'` | 卡片寬度，接受任意 CSS 寬度值   |
| `okLoading`  | boolean | `false`  | 確定按鈕 loading 狀態      |

### Emits

| 事件                  | 說明                                    |
| ------------------- | ------------------------------------- |
| `update:modelValue` | modal 開關狀態變更（配合 `v-model`）            |
| `ok`                | 點擊「確定」按鈕時觸發                           |
| `cancel`            | 點擊「取消」按鈕時觸發，**不會自動關閉 modal**，需由父元件處理 |

### Slots

| Slot      | 說明           |
| --------- | ------------ |
| `default` | 放置任意內容       |
| `footer`  | 已內建（按鈕列），可覆寫 |

### 行為說明

- `mask-closable` 固定為 `false`，點擊遮罩不會關閉，防止誤操作。
- 點擊「取消」與點擊「確定」**皆不會自動關閉視窗**，一律由父元件在對應 handler 中決定是否將 `v-model` 設為 `false`。
- `okLoading` 為 `true` 時，「取消」按鈕會被禁用，防止請求進行中誤操作。

---

## 基本使用範例

```vue
<template>
  <n-button @click="open = true">開啟</n-button>

  <BaseDialog
    v-model="open"
    title="視窗標題"
    :ok-loading="loading"
    @ok="handleOk"
    @cancel="open = false"
  >
    <!-- 放置任意內容 -->
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from './baseDialog.vue';

const open = ref(false);
const loading = ref(false);

async function handleOk() {
  loading.value = true;
  try {
    // 處理業務邏輯
    open.value = false;
  } finally {
    loading.value = false;
  }
}
</script>
```

---

## 注意事項

- `@ok` 與 `@cancel` 都**不會自動關閉視窗**，請務必在對應的 handler 中手動將 `v-model` 設為 `false`。
- 若需要調整寬度，請透過 `width` prop 傳入，例如 `:width="'800px'"`。