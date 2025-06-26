<template>
  <paginationTable :columns="columns" :data="fakeData" :pageSize="10" />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
import { ref } from 'vue';
// store
// 共用型別
// 元件
import { paginationTable } from '@/comps/base/baseTable';
// 商業邏輯

// ---------------------------

// ----------欄位設定----------
const columns = [
  { title: 'Coil_ID', key: 'coil_id', align: 'center', width: '10%' },
  { title: 'Time', key: 'time', align: 'center', width: '15%' },
];
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

// ----------區域-----------
// -------------------------
</script>
