<template>
  <n-button
    type="primary"
    strong
    :theme-overrides="active ? activeTheme : inactiveTheme"
    @click="emit('update:active', true)"
    class="text-4 font-bold"
    :class="active ? 'text-black' : 'text-white'"
  >
    <slot />
  </n-button>
</template>

<script setup lang="ts">
import { themeColors } from '@/utils/index';

defineProps<{
  active: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:active', value: boolean): void;
}>();

const activeTheme = {
  common: {
    primaryColor: themeColors.colors.secondary,
    primaryColorHover: themeColors.colors.secondary,
    primaryColorPressed: themeColors.colors.highlight,
  },
};

const inactiveTheme = {
  common: {
    primaryColor: themeColors.colors.muted,
    primaryColorHover: themeColors.colors.mutedHover,
    primaryColorPressed: themeColors.colors.highlight, // 按住不放的顏色
    primaryTextColor: '#FFFFFF',
  },
};
</script>
