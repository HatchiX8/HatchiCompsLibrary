<template>
  <div class="text-white">彈跳視窗封裝</div>
  <n-button @click="open = true">編輯</n-button>
  <formComp v-model="open" />
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
import formComp from './formComp.vue';

// 商業邏輯

// ---------------------------

// ----------操作----------
const open = ref(false);

// -------------------------
</script>
