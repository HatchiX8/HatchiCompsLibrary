<template>
  <!-- id表格資訊 -->
  <loadingAreaOverlay :loadingId="inspectStore.infoLoading">
    <div class="">
      <infoTableBlock
        :data="tableData"
        :baseData="inspectStore.l2_infoList"
        :pageSize="10"
        :bordered="true"
        :activeId="activeCurrentId"
        @row-click="handleRowClick"
        @update:sorter="handleSorterChange"
        @update:filters="handleFiltersChange"
        @clear-filters="handleClearFilters"
      />
    </div>
  </loadingAreaOverlay>
</template>

<script setup lang="ts">
// ----------import----------
// 套件
import { nextTick, ref, computed } from 'vue';
// store
import { useInspectStore } from '@/stores/index';
// 共用型別
import type { tableRow, l2_info, Column } from './type/index';
import type { Order } from '@/components/modules/tableMod/type';
// 元件
import { loadingAreaOverlay } from '@/components/index';
import { infoTableBlock } from './block/index';
// 商業邏輯
import { useSorter, useFilter, useTableData } from './composable/index';

// ----------store----------
const inspectStore = useInspectStore();

// ----------Info API請求----------
const activeCurrentId = ref<string>(''); // 當前選中的ID-用於高亮顯示table

// API-呼叫info資料
const fetchInfo = async (payload: RangePayload | null) => {
  if (payload === null) {
    return;
  }

  const postData = {
    start: payload.start,
    end: payload.end,
  };

  await inspectStore.fetchL2Info(postData);
};

// 依照輸入鋼捲ID搜尋Info資料
const fetchSearchInfo = async (id: string) => {
  const postData = {
    Coil_ID: id,
  };

  await inspectStore.fetchSearchInfo(postData);

  nextTick(() => {
    // 依照查詢ID觸發點擊事件與傳遞當前ID
    if (inspectStore.coilData) {
      handleRowClick(inspectStore.coilData);
      activeCurrentId.value = inspectStore.coilData.iCoil_id; // 設定當前選中的行ID
    }
  });
};
// --------------------------------

// ----------表格事件----------
const { sorter, callSorter } = useSorter<l2_info>(); // 載入已封裝排序器

const filterableKeys: (keyof l2_info)[] = ['coiler_num', 'coil_thick', 'coil_width']; // 可篩選的欄位
const { filterValues, setFilters, syncFilterUI } = useFilter<l2_info>(filterableKeys); // 載入已封裝篩選器

// 點擊事件
const handleRowClick = async (row: tableRow) => {
  isThermal.value = false; // 重置熱影像狀態

  // 寫入鋼捲資訊
  coilInfo.value = {
    iCoil_id: row.iCoil_id,
    coil_inDiam: row.coil_inDiam,
    coil_outDiam: row.coil_outDiam,
    coiler_num: row.coiler_num,
  };

  isClick.value = true; // 觸發修改點擊狀態

  // 請求鋼捲趨勢資料、鋼捲影像資料
  fetchCurl(row);
  await fetchImagePair(row.iCoil_id, row.coiler_num);

  // 如果是5號線會額外去拿熱影像
  if (row.coiler_num === '5') {
    isThermal.value = true;
    await fetchDTI_Data(row.iCoil_id);
  }
};

// 觸發篩選器事件
const handleFiltersChange = ({
  filters,
  columns,
}: {
  filters: Record<string, number[]>;
  columns: Column[];
}) => {
  setFilters(filters); // 呼叫封裝好的篩選器函式
  syncFilterUI(columns); // 呼叫封裝好的篩選器UI函式
};

// 父層接收到排序事件
const handleSorterChange = (incoming: { columnKey?: string; order: Order }) => {
  if (!incoming.columnKey) return;

  // 呼叫封裝好的排序函式
  callSorter(incoming.columnKey as keyof l2_info);
};

// 清除所有篩選條件
const handleClearFilters = (columns: Column[]) => {
  setFilters({});
  syncFilterUI(columns);
};

// ---------------------------

// ----------篩選器&排序器----------
// 呼叫封裝好的篩選器與排序器
const { sortedData } = useTableData(
  computed(() => inspectStore.l2_infoList),
  filterValues,
  sorter,
  filterableKeys
);

const tableData = computed(() => sortedData.value);

// --------------------------------
</script>
