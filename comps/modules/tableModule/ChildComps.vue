<template>
  <div>
    <div class="boxShadowStyle">
      <n-data-table
        :columns="columns"
        :data="loading ? [] : paginatedData"
        :loading="loading"
        :pagination="false"
        :striped="striped"
        :bordered="bordered"
        :max-height="150"
        class="text-4"
        :row-props="getRowProps"
        :current-row-key="activeRowId"
        @update:sorter="handleSorterChange"
        @update:filters="handleFiltersChange"
      >
        <template #empty>
          <div class="no-data-message text-6 text-white">
            目前查詢ID無資料，請確認日期與查詢ID是否正確。
          </div>
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
        <n-button type="error" ghost @click="clearFilters">清除篩選</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ----------import----------
// 套件
import { computed, ref, watch } from 'vue';
// 共用型別
import type { tableRow, l2_info, Column } from '../type';
import type { Order } from '@/components/modules/tableMod/type';
// 元件
// 商業邏輯
// ---------------------------

// ----------型別&props----------
interface Props {
  data: l2_info[];
  baseData: l2_info[];
  pageSize?: number;
  striped?: boolean;
  bordered?: boolean;
  loading?: boolean;
  showSizePicker?: boolean;
  pageSizes?: number[];
  showQuickJumper?: boolean;
  activeId: string;
}

const props = defineProps<Props>();
// -------------------------

// ----------欄位設定----------

const columns = ref<Column[]>([
  {
    title: 'Coil_ID',
    key: 'iCoil_id',
    align: 'center',
    width: '10%',
    sorter: true,
    sortOrder: null,
  },
  { title: 'Time', key: 'datatime', align: 'center', width: '15%', sorter: true, sortOrder: null },
  {
    title: 'Coil_Thick',
    key: 'coil_thick',
    align: 'center',
    width: '10%',
    sorter: true,
    sortOrder: null,
    filter: true,
    filterOptionValues: [],
    filterOptions: [],
  },
  {
    title: 'Coil_Width',
    key: 'coil_width',
    align: 'center',
    width: '10%',
    sorter: true,
    sortOrder: null,
    filter: true,
    filterOptionValues: [],
    filterOptions: [],
  },
  {
    title: 'Coil_inDiam',
    key: 'coil_inDiam',
    align: 'center',
    width: '10%',
    sorter: true,
    sortOrder: null,
  },
  {
    title: 'Coil_outDiam',
    key: 'coil_outDiam',
    align: 'center',
    width: '10%',
    sorter: true,
    sortOrder: null,
  },
  {
    title: 'INSP_Code',
    key: 'skip_Thickness',
    align: 'center',
    width: '10%',
    sorter: true,
    sortOrder: null,
  },
  {
    title: 'Coil_Weight',
    key: 'coil_weight',
    align: 'center',
    width: '10%',
    sorter: true,
    sortOrder: null,
  },
  {
    title: 'Coiler_Num',
    key: 'coiler_num',
    align: 'center',
    width: '10%',
    filter: true,
    filterOptionValues: [],
    filterOptions: [],
    sorter: true,
    sortOrder: null,
  },
]);
// ---------------------------

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

watch(
  () => props.data,
  (newData) => {
    pagination.value.page = 1; // 資料變動時重設分頁

    const optionMap = {
      coil_thick: new Set<number>(),
      coil_width: new Set<number>(),
      coiler_num: new Set<number>(),
    };

    newData.forEach((row: l2_info) => {
      if (row.coil_thick) optionMap.coil_thick.add(row.coil_thick);
      if (row.coil_width) optionMap.coil_width.add(row.coil_width);
      if (row.coiler_num !== undefined && row.coiler_num !== null)
        optionMap.coiler_num.add(Number(row.coiler_num));
    });

    const keys = Object.keys(optionMap) as (keyof typeof optionMap)[];

    columns.value = columns.value.map((col) => {
      if (keys.includes(col.key as keyof typeof optionMap)) {
        const options = Array.from(optionMap[col.key as keyof typeof optionMap]).map((val) => ({
          label: String(val),
          value: val,
        }));

        return {
          ...col,
          filterOptions: options,
          filterOptionValues: col.filterOptionValues ?? [],
        };
      }
      return col;
    });
  },
  { immediate: true }
);

// ---------------------------

// ----------表格點擊事件----------
const activeRowId = ref<string | null>(null);
// 點擊後抓去當前id與activeRowId比對，比對一致的row則會顯示active
const getRowProps = (row: tableRow) => {
  const rowId = String(row.iCoil_id);
  const isActive = activeRowId.value === rowId;

  return {
    onClick: () => handleRowClick(row),
    style: {
      cursor: 'pointer',
    },
    class: isActive ? 'activeRow' : '',
  };
};
// 表格點擊事件
const handleRowClick = (row: tableRow) => {
  const rowId = String(row.iCoil_id);
  activeRowId.value = rowId;

  emit('row-click', row);
};

const emit = defineEmits<{
  (e: 'row-click', row: tableRow): void;
  (e: 'update:sorter', sorter: { columnKey?: string; order: 'ascend' | 'descend' | null }): void;
  (
    e: 'update:filters',
    payload: { filters: Record<string, (string | number)[]>; columns: Column[] }
  ): void;
  (e: 'clear-filters', columns: Column[]): void;
}>();

// ---------------------------

// ----------表格過濾事件----------
// 排序器emit事件
const handleSorterChange = (sorter: { columnKey: string; order: Order }) => {
  const column = columns.value.find((col) => col.key === sorter.columnKey);

  emit('update:sorter', {
    columnKey: column?.key,
    order: sorter.order,
  });
};
// 篩選器emit事件
const handleFiltersChange = (filters: Record<string, (string | number)[]>) => {
  emit('update:filters', { filters, columns: columns.value }); // 通知父元件有篩選條件更新
};

// 清除篩選器emit事件
const clearFilters = () => {
  const clearedFilters: Record<string, (string | number)[]> = {};

  // 清除所有勾選項目
  columns.value.forEach((col) => {
    if (col.filter) {
      clearedFilters[col.key as string] = [];
      col.filterOptionValues = []; // 清除勾選 UI
    }
  });

  emit('clear-filters', columns.value); // 通知父元件清除篩選
};
// -------------------------------

// ----------高亮監聽----------
watch(
  () => props.activeId,
  (newId) => {
    activeRowId.value = newId; // 當父層activeId變更時，同步到子層
  }
);
// ---------------------------
</script>

<style scoped>
/* naive表格本身沒有active屬性，所以得用deep深層覆蓋 */
:deep(.n-data-table .n-data-table-tr.activeRow .n-data-table-td) {
  @apply bg-secondary text-primary font-bold;
}
</style>
