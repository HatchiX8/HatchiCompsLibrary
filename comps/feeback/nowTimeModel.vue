<template>
  <div>
    <p class="text-size-24px">{{ currentDateTime }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentDateTime = ref('');
// 設置定時器，每秒更新一次時間
const updateTime = () => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const date = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  currentDateTime.value = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
};

// 在組件掛載時開始更新時間
onMounted(() => {
  updateTime(); // 確保組件第一次渲染時即顯示當前時間
  setInterval(updateTime, 1000); // 每秒更新一次時間
});

// 在組件卸載時清除定時器，避免內存洩漏
onUnmounted(() => {
  clearInterval(updateTime);
});
</script>
