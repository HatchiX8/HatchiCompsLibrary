# TrendChart 趨勢圖元件

基於 [Apache ECharts](https://echarts.apache.org/) 封裝的折線趨勢圖元件，支援響應式自適應與動態資料更新。

---

## 使用方式

```vue
<TrendChart
  :chartData="myData"
  chartUnit="件"
  :intervalData="5"
/>
```

---

## Props

| 名稱           | 型別        | 必填 | 說明                         |
|--------------|-----------|:--:|----------------------------|
| `chartData`  | `ChartData` | ✅  | 圖表所需的資料物件                  |
| `chartUnit`  | `string`  | ✅  | Y 軸或 Tooltip 顯示的單位（例如：`件`） |
| `intervalData` | `number` | ✅  | 資料間隔設定                     |

### ChartData 型別定義

```ts
interface ChartData {
  date: string[];      // X 軸日期標籤
  countW: number[];    // 白色類別數量
  countG: number[];    // 綠色類別數量
  countR: number[];    // 紅色類別數量
  countY: number[];    // 黃色類別數量
  all_Count: number[]; // 總數量
}
```

---

## 功能說明

- **初始化圖表**：元件掛載（`onMounted`）時自動初始化 ECharts 實例並渲染圖表。
- **動態更新**：透過 `watch` 監聽 `chartData` 變更，自動重新渲染圖表。
- **響應式自適應**：監聽 `window resize` 事件，自動調整圖表尺寸。
- **記憶體管理**：元件卸載（`onUnmounted`）時自動移除 resize 監聽器，避免記憶體洩漏。

---

## 注意事項

> ⚠️ ECharts 實例使用 `markRaw` 包裝，避免 Vue 響應式系統代理導致 Tooltip 顯示異常。

> ⚠️ 目前 `getChartOption` 內部使用模擬資料，尚未接入 `props.chartData`，需依業務需求完成實作。

---

## 依賴套件

- [Vue 3](https://vuejs.org/)
- [ECharts 5+](https://echarts.apache.org/)