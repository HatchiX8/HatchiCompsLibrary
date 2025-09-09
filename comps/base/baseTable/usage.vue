<template>
  <paginationTable :data="fakeData" :columns="columns" :pageSize="10" />
</template>
<script setup lang="ts" generic="Row extends Record<string, unknown>">
// ----------import----------
// 套件
import { ref } from 'vue';
// store
// 共用型別
import type { DataTableColumns } from 'naive-ui';
// 元件
import { paginationTable } from '@/comps/base/baseTable';
// 商業邏輯

// ---------------------------

// ----------假資料----------
const fakeData = [
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },

  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
  {
    coil_id: '1354372',
    time: '2025/05/15 14:44',
  },
];

// ----------欄位設定----------
const columns: DataTableColumns<Row> = [
  { title: 'Coil_ID', key: 'coil_id', align: 'center', width: '10%' },
  { title: 'Time', key: 'time', align: 'center', width: '15%' },
];

// -------------------------
</script>
