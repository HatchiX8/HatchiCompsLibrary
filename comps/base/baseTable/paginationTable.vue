<template>
  <div>
    <n-data-table
      :columns="columns"
      :data="loading ? [] : paginatedData"
      :loading="loading"
      :pagination="false"
      :striped="striped"
      :bordered="bordered"
    />

    <div v-if="pageCount > 1" class="mt-4 flex justify-center">
      <n-pagination
        v-model:page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-count="pageCount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface Props {
  columns: object[];
  data: object[];
  pageSize?: number;
  striped?: boolean;
  bordered?: boolean;
  loading?: boolean;
  showSizePicker?: boolean;
  pageSizes?: number[];
  showQuickJumper?: boolean;
}

const props = defineProps<Props>();

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

watch(
  () => props.data,
  () => {
    pagination.value.page = 1; // 資料變動時重設分頁
  }
);
</script>
