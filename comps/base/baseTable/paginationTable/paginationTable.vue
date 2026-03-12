<template>
  <div>
    <n-data-table
      :columns="mergedColumns"
      :data="loading ? [] : paginatedData"
      :loading="loading"
      :pagination="false"
      :striped="striped"
      :bordered="bordered"
      :row-key="getRowKey"
      v-bind="tableSelectProps"
    />

    <div v-if="pageCount > 1" class="mt-4 flex justify-center">
      <n-pagination
        v-model:page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-count="pageCount"
        :show-size-picker="showSizePicker"
        :page-sizes="pageSizes"
        :show-quick-jumper="showQuickJumper"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="Row extends { id: string | number }">
import { computed, ref, watch } from 'vue';
import type { VNodeChild } from 'vue';
import type { DataTableColumns, DataTableRowKey, DataTableColumn } from 'naive-ui';

// ----------初始化----------
interface Props {
  data: Row[];
  columns: DataTableColumns<Row>;
  rowKey?: (row: Row) => DataTableRowKey;
  selectable?: boolean;
  pageSize?: number;
  striped?: boolean;
  bordered?: boolean;
  loading?: boolean;
  showSizePicker?: boolean;
  pageSizes?: number[];
  showQuickJumper?: boolean;
  showActions?: boolean;
  actionsTitle?: string;
  actionsWidth?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  pageSize: 10,
  striped: false,
  bordered: false,
  loading: false,
  showSizePicker: false,
  pageSizes: () => [10, 20, 50],
  showQuickJumper: false,
  showActions: true,
  actionsTitle: '操作',
  actionsWidth: 180,
});

// 定義插槽類型
const slots = defineSlots<{
  actions?(props: { row: Row }): VNodeChild;
}>();

// 勾選功能
const getRowKey =
  props.rowKey ?? ((row: Row) => (row as { id?: DataTableRowKey }).id as DataTableRowKey);
const checkedRowKeys = ref<DataTableRowKey[]>([]);

const emit = defineEmits<{
  'update:checkedRowKeys': [keys: DataTableRowKey[]];
}>();

const tableSelectProps = computed(() =>
  props.selectable
    ? {
        'checked-row-keys': checkedRowKeys.value,
        'onUpdate:checkedRowKeys': (keys: DataTableRowKey[]) => {
          checkedRowKeys.value = keys;
          emit('update:checkedRowKeys', keys);
        },
      }
    : {},
);
// -------------------------

// ----------分頁設定----------
const pagination = ref({
  page: 1,
  pageSize: props.pageSize ?? 10,
});

// 每頁顯示的資料
const paginatedData = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return props.data.slice(start, end);
});

// 計算需要幾頁
const pageCount = computed(() => Math.ceil(props.data.length / pagination.value.pageSize));
// ---------------------------

// ----------按鈕欄位----------
// 操作按鈕插槽
const actionColumn = computed<DataTableColumn<Row> | null>(() => {
  if (!props.showActions || !slots.actions) return null;

  return {
    title: props.actionsTitle,
    key: '__actions__',
    align: 'center',
    width: props.actionsWidth,
    render: (row: Row): VNodeChild => slots.actions?.({ row }),
  };
});

// 合併傳入的 columns 和操作按鈕列
const mergedColumns = computed<DataTableColumns<Row>>(() => {
  const cols = [...props.columns];
  if (actionColumn.value) cols.push(actionColumn.value);
  return cols;
});
// ---------------------------

watch(
  () => props.data,
  () => {
    pagination.value.page = 1; // 資料變動時重設分頁
  },
);
</script>
