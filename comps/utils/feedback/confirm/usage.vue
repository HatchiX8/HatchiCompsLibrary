<template>
  <div class="text-white">彈跳視窗封裝</div>
  <button @click="handleClick">刪除</button>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
// 元件
// 商業邏輯
import { confirm } from './utils/confirm';
// ---------------------------

// ----------操作----------
const handleClick = async () => {
  const ok = await confirm({
    content: '確定要刪除嗎？',
  });
  if (ok) {
    // 使用者點擊確定
    console.log('刪除成功');
  } else {
    // 使用者點擊取消
    console.log('刪除取消');
  }
};
// -------------------------
</script>
