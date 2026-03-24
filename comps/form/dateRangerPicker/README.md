# DateRangePicker

基於 [Naive UI](https://www.naiveui.com/) `n-date-picker` 封裝的通用日期區間選擇器。

自動將 Naive UI 的 timestamp 格式轉換為字串格式輸出，並支援選填的外部驗證邏輯。

---

## 使用方式

```vue
<DateRangePicker @update:value="handleDateChange" />
```

---

## Props

| Prop | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `defaultValue` | `[number, number] \| null` | `null` | 初始時間區間（Unix timestamp） |
| `format` | `string` | `'YYYY-MM-DD HH:mm:ss'` | 輸出的日期格式（使用 dayjs 格式） |
| `normalize` | `(range: [number, number]) => RangeCheckResult` | `undefined` | 選填，外部驗證邏輯，不傳則不做驗證 |
| `type` | `'datetimerange' \| 'daterange' \| 'monthrange' \| 'quarterrange' \| 'yearrange'` | `'datetimerange'` | 日期選擇器類型 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| `clearable` | `boolean` | `true` | 是否可清空 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `placeholder` | `string` | `undefined` | 佔位文字 |

---

## Emits

| 事件 | 回傳值 | 說明 |
|------|--------|------|
| `update:value` | `RangePayload \| null` | 驗證通過後觸發，清空時回傳 `null` |

### RangePayload

```typescript
interface RangePayload {
  start: string; // 格式化後的開始時間
  end: string;   // 格式化後的結束時間
}
```

---

## 範例

### 基本使用（無驗證）

```vue
<script setup lang="ts">
import DateRangePicker from '@/comps/form/dateRagnerPicker/dateRagnerPicker.vue';

const handleDateChange = (val: { start: string; end: string } | null) => {
  console.log(val); // { start: '2026-03-24 00:00:00', end: '2026-03-24 08:00:00' }
};
</script>

<template>
  <DateRangePicker @update:value="handleDateChange" />
</template>
```

---

### 帶初始值

```vue
<template>
  <DateRangePicker
    :default-value="[Date.now() - 8 * 60 * 60 * 1000, Date.now()]"
    @update:value="handleDateChange"
  />
</template>
```

---

### 帶外部驗證（限制查詢區間不超過 8 小時）

```vue
<script setup lang="ts">
const checkRange = (range: [number, number]) => {
  if (range[0] === range[1]) {
    return { valid: false, message: '起始與結束時間不可相同' };
  }
  if (range[1] - range[0] > 8 * 60 * 60 * 1000) {
    return { valid: false, message: '查詢區間不得超過 8 小時' };
  }
  return { valid: true };
};
</script>

<template>
  <DateRangePicker
    :normalize="checkRange"
    @update:value="handleDateChange"
  />
</template>
```

---

### 自定義輸出格式

```vue
<template>
  <!-- 輸出格式改為 YYYY/MM/DD -->
  <DateRangePicker
    format="YYYY/MM/DD"
    type="daterange"
    @update:value="handleDateChange"
  />
</template>
```

---

## 注意事項

- `normalize` 只負責**驗證**，不負責修改時間值
- 驗證失敗時，元件**不會 emit**，需由使用者在 `normalize` 內自行定義錯誤訊息
- `defaultValue` 需傳入 **Unix timestamp（毫秒）**，不是字串
- 元件使用 `@update:value` 而非 `v-model`，**不支援雙向綁定**