<template>
  <div>
    <div class="boxShadowStyle h-60% overflow-hidden rounded-md">
      <n-data-table
        :remote="true"
        :columns="props.columns"
        :data="loading ? [] : paginatedData"
        :loading="loading"
        :pagination="false"
        :striped="striped"
        :bordered="bordered"
        :max-height="props.maxHeight"
        class="text-4"
        :row-props="rowPropsInternal"
        :row-key="rowKeyInternal"
        @update:sorter="onUpdateSorter"
        @update:filters="onUpdateFilters"
      >
        <template #empty>
          <div class="text-6 text-white">目前查詢ID無資料，請確認日期與查詢ID是否正確。</div>
        </template>
      </n-data-table>
    </div>

    <div class="flex items-center justify-center">
      <div v-if="pageCount > 1" class="ml-auto mt-4 flex justify-center">
        <n-pagination
          v-model:page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-count="pageCount"
        />
      </div>
      <div class="ml-auto mt-3">
        <n-button type="error" ghost @click="clearFilters" :disabled="!hasActiveFilters"
          >清除篩選</n-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="Row extends Record<string, unknown>">
// ----------import----------
// 套件
import { computed, ref, watch } from 'vue';
import type { DataTableFilterState, DataTableSortState, DataTableColumns } from 'naive-ui';
// 共用型別
import type { DataTableColumnGroup, DataTableBaseColumn } from 'naive-ui';
// import type { Column } from '@/components/modules/tableMod/type/index';
// 元件
// 商業邏輯
// ---------------------------

// ----------初始化----------
// 接收父層傳進來的key
const rowKeyInternal = (row: Row) =>
  props.rowKey ? props.rowKey(row) : ((row as unknown as { id?: string | number }).id ?? '');
// 接收父層傳進來的事件&class
const rowPropsInternal = (row: Row, index: number) =>
  props.rowProps ? props.rowProps(row, index) : {};
// ------------------------

// ----------props&emit----------
const props = defineProps<{
  maxHeight: number;
  data: Row[];
  columns: DataTableColumns<Row>;
  pageSize?: number;
  striped?: boolean;
  bordered?: boolean;
  loading?: boolean;
  rowKey?: (row: Row) => string | number;
  rowProps?: (row: Row, index: number) => Record<string, unknown>;
  pagination?: {
    page: number;
    pageSize: number;
  };
}>();

const emit = defineEmits<{
  (e: 'update:sorter', v: DataTableSortState): void;
  (e: 'update:filters', v: DataTableFilterState): void;
  (e: 'clear-filters'): void;
}>();

const onUpdateSorter = (state: DataTableSortState) => emit('update:sorter', state);
const onUpdateFilters = (state: DataTableFilterState) => emit('update:filters', state);
const clearFilters = () => emit('clear-filters');
// ------------------------------

// ----------分頁設定----------
const pagination = ref({
  page: props.pagination?.page ?? 1,
  pageSize: props.pagination?.pageSize ?? 10,
});

// 每頁顯示的資料
const paginatedData = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return props.data.slice(start, end);
});

// 計算需要幾頁
const pageCount = computed(() => Math.ceil((props.data?.length ?? 0) / pagination.value.pageSize));

// 監聽父層計算的頁面並跳轉
watch(
  () => props.pagination,
  newVal => {
    if (newVal) {
      pagination.value.page = newVal.page;
      pagination.value.pageSize = newVal.pageSize;
    }
  },
  { immediate: true, deep: true }
);
// ---------------------------

// ----------表格過濾事件----------
// 當無篩選條件時,清除篩選按鈕不能點擊
// 群組欄位：有 children
function isGroupCol<T>(
  col: DataTableBaseColumn<T> | DataTableColumnGroup<T>
): col is DataTableColumnGroup<T> {
  return 'children' in col && Array.isArray((col as { children?: unknown }).children);
}

// 一般(Base)欄位：沒有 children，也沒有 type（selection/index/expand 會有 type）
function isBaseCol<T>(
  col: DataTableBaseColumn<T> | DataTableColumnGroup<T>
): col is DataTableBaseColumn<T> {
  return !('children' in col) && !('type' in col);
}

function hasActiveInCols<T>(cols: DataTableColumns<T>): boolean {
  return cols.some(col => {
    if ('type' in col && col.type) return false; // 排除 selection/index/expand 類型
    if (isGroupCol(col)) {
      // 遞迴檢查子欄位，只傳遞 group/base 欄位
      const children = (col as DataTableColumnGroup<T>).children.filter(
        child => !('type' in child && child.type)
      );
      return hasActiveInCols(children);
    }
    if (!isBaseCol(col)) return false;

    // Type guard ensures col is DataTableBaseColumn here
    const baseCol = col as DataTableBaseColumn<T>;
    const hasValues =
      Array.isArray(baseCol.filterOptionValues) && baseCol.filterOptionValues.length > 0;

    // 有設定 filter 或有 filterOptions 視為「有啟用過濾」
    const filterEnabled = !!baseCol.filter || Array.isArray(baseCol.filterOptions);

    return filterEnabled && hasValues;
  });
}

const hasActiveFilters = computed(() => hasActiveInCols(props.columns));
// -------------------------------
</script>

<style scoped>
:deep(.n-data-table .n-data-table-thead .n-data-table-th) {
  vertical-align: middle;
  text-align: center;
}

/* naive表格本身沒有active屬性，所以得用deep深層覆蓋 */
:deep(.n-data-table .n-data-table-tr.activeRow .n-data-table-td) {
  @apply bg-secondary text-primary font-bold;
}
</style>
