<template>
  <loadingAreaOverlay :loadingId="props.loadingId" class="h-full">
    <paginationTable
      :max-height="props.maxHeight"
      :columns="columnsForTable"
      :data="sortedData"
      :pageSize="20"
      :bordered="true"
      :row-key="props.rowKey"
      :row-props="props.rowProps"
      :pagination="props.pagination"
      @update:sorter="onUpdateSorter"
      @update:filters="onUpdateFilters"
      @clear-filters="onClearFilters"
    />
  </loadingAreaOverlay>
</template>
<script setup lang="ts" generic="Row extends Record<string, unknown>">
// ----------import----------
// 套件
import { computed, shallowRef, type Ref } from 'vue';
// 共用型別
import type { Column, FilterMap, FilterableKey, Sorter } from './type/index';
import type { DataTableSortState, DataTableFilterState, DataTableColumns } from 'naive-ui';
// 元件
import paginationTable from './comps/paginationTable.vue';
import { loadingAreaOverlay } from '@/components/index';
// 商業邏輯
import { useTableData } from './composable/useTableData';
import { toNaiveColumns } from './composable/to-naive-columns';
// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  maxHeight: number;
  rows: Row[];
  columns: Column<Row>[];
  filterableKeys?: ReadonlyArray<FilterableKey<Row>>;
  rowKey?: (row: Row) => string | number;
  rowProps?: (row: Row, index: number) => Record<string, unknown>;
  pagination?: {
    page: number;
    pageSize: number;
  };
  loadingId: string;
}>();
// ------------------------------

// ----------初始化----------
// 型別別名，簡化使用
type R = Row; // 單筆列資料
type FM = FilterMap<R>; // 篩選狀態 { key: values[] }
type S = Sorter<R>; // 排序狀態 { columnKey, order }

// 篩選器狀態（shallowRef 避免深層監聽開銷）
const filterValues = shallowRef<FM>({} as FM) as Ref<FM>;
// 排序器狀態
const sorter = shallowRef<S>({ columnKey: undefined, order: null } as S) as Ref<S>;

// ---------------------------

// ----------篩選器&排序器----------
// 可篩選欄位清單
const filterableKeys = computed<ReadonlyArray<FilterableKey<Row>>>(
  () => props.filterableKeys ?? []
);

// 排序 & 篩選邏輯（封裝在 useTableData）
const { sortedData, clearFilters, setSorter, buildFilterOptions } = useTableData<Row>(
  computed(() => props.rows),
  filterValues,
  sorter,
  filterableKeys.value,
  { nullsFirst: true }
);

// 排序事件處理（僅取單欄排序）
const onUpdateSorter = (state: DataTableSortState) => {
  const first = Array.isArray(state) ? state[0] : state;
  if (!first || !first.columnKey) {
    setSorter(undefined, null);
    return;
  }

  const order = (first.order === false ? null : first.order) as Sorter<Row>['order'];
  setSorter(first.columnKey as Sorter<Row>['columnKey'], order);
};

// 篩選選項 & 欄位加工
// const defaultFilterOptions = computed(() => buildFilterOptions(filterableKeys.value));
const allow = computed(() => new Set<string>(Array.from(filterableKeys.value) as string[]));

// 動態篩選選項，依據目前排序後的資料
const dynamicFilterOptions = computed(() =>
  buildFilterOptions(filterableKeys.value, sortedData.value)
);

// 遞迴處理 columns，為可篩選欄位附加 filter 設定
const attachFilterPropsToCols = (cols: Column<Row>[]): Column<Row>[] =>
  cols.map(col => {
    const key = col.key as string | undefined;

    // 遞迴處理群組欄位
    let children: Column<Row>[] | undefined;
    if (Array.isArray(col.children) && col.children.length > 0) {
      children = attachFilterPropsToCols(col.children as Column<Row>[]);
    }

    // 非可篩選欄位：直接返回
    if (!key || !allow.value.has(key)) {
      return children ? { ...col, children } : col;
    }

    // 可篩選欄位：附加篩選選項與勾選值
    const rawOptions =
      (
        dynamicFilterOptions.value as unknown as Record<
          string,
          { label: string; value: Row[Extract<keyof Row, string>] }[]
        >
      )[key] ?? [];
    const options = rawOptions; // 保持原型別，不要 map 成 value 陣列
    const selected = (filterValues.value as FilterMap<Row>)[key as FilterableKey<Row>] ?? [];

    return {
      ...col,
      filter: true,
      filterOptions: options, // 下拉選項，型別正確
      filterOptionValues: selected as Row[Extract<keyof Row, string>][], // 目前勾選
      ...(children ? { children } : {}),
    };
  });

// 最終給表格使用的 columns
const columnsForTable = computed<DataTableColumns<Row>>(() =>
  toNaiveColumns(attachFilterPropsToCols(props.columns))
);

// 篩選事件處理：更新 filterValues
const onUpdateFilters = (state: DataTableFilterState) => {
  const allow = new Set<string>(Array.from(filterableKeys.value) as string[]);
  const next = {} as FilterMap<Row>;

  Object.entries(state).forEach(([key, values]) => {
    if (!allow.has(key)) return;
    if (!Array.isArray(values) || values.length === 0) return;
    next[key as keyof FilterMap<Row>] = values as (string | number)[];
  });

  filterValues.value = next; // 型別完全吻合
};

// 清除篩選
const onClearFilters = () => {
  clearFilters();
};
// --------------------------------
</script>
