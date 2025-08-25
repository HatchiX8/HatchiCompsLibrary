<template>
  <div class="flex h-full items-center justify-center">
    <div class="grid gap-2" :class="isRealTime ? 'grid-cols-1' : 'ml-auto grid-cols-2'">
      <div class="overflow-hidden rounded-xl">
        <div class="bg-backgroundSecondary flex items-center justify-center">
          <p class="text-4 p-2 text-white">
            #{{ props.imageData.north.key }} {{ props.imageData.north.time }} 南側影像
          </p>
          <baseButton
            colo="primary"
            class="m-1"
            :loading="downloading.north"
            :disabled="downloading.north"
            @click="onDownload('north')"
            >下載圖片</baseButton
          >
        </div>

        <img
          :src="props.imageData.north.url"
          alt=""
          class="boxShadowStyle w-450px h-310px rounded-b-xl"
        />
      </div>
      <div v-if="!isRealTime" class="overflow-hidden rounded-xl">
        <div class="bg-backgroundSecondary flex items-center justify-center">
          <p class="text-4 p-2 text-white">
            #{{ props.imageData.south.key }} {{ props.imageData.south.time }} 北側影像
          </p>
          <baseButton
            colo="primary"
            class="m-1"
            :loading="downloading.south"
            :disabled="downloading.south"
            @click="onDownload('south')"
            >下載圖片</baseButton
          >
        </div>
        <img
          :src="props.imageData.south.url"
          alt=""
          class="boxShadowStyle w-450px h-310px rounded-b-xl"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// ----------import----------
// 套件
// 共用型別
import type { imageMap, imageMeta, Side } from './types/index';
// 元件
// 商業邏輯

// ---------------------------

// ----------props&emit----------
const props = defineProps<{
  imageData: imageMap;
  isRealTime: boolean;
}>();

// ------------------------------

// ----------圖片下載----------
const downloading = reactive({ north: false, south: false });

const makeFilename = (side: Side, data: imageMeta) => {
  const key = data.key?.replace(/^#/, '') ?? '';
  const time = (data.time ?? '').replace(/[:]/g, '-').replace(/[^\d\-T_ ]/g, '');
  const sideLabel = side === 'north' ? 'south' : 'north';
  return `${key}_${time}_${sideLabel}.jpg`;
};

const downloadImage = async (url: string, filename: string) => {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();

  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
};

const onDownload = async (side: Side) => {
  const data = props.imageData[side];
  const filename = makeFilename(side, data);
  downloading[side] = true;
  try {
    await downloadImage(data.url, filename);
  } catch (err) {
    console.error('下載失敗', err);
  } finally {
    downloading[side] = false;
  }
};
// ---------------------------
</script>
