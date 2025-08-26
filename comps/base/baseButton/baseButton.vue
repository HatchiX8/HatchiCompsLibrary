<template>
  <n-button :theme-overrides="buttonThemeOverrides" type="primary" v-bind="$attrs">
    <slot
  /></n-button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { themeColors } from '@/utils/index';

const props = defineProps<{
  color?: 'primary' | 'default';
}>();

const buttonThemeOverrides = computed(() => {
  if (props.color === 'primary') {
    return {
      common: {
        primaryColor: themeColors.colors.secondary,
        primaryColorHover: themeColors.colors.highlight,
        primaryColorPressed: themeColors.colors.accent,
      },
    };
  }
  return {
    common: {
      primaryColor: themeColors.colors.muted,
      primaryColorHover: themeColors.colors.mutedHover,
      primaryColorPressed: themeColors.colors.highlight, // 按住不放的顏色
      primaryTextColor: '#FFFFFF',
    },
  };
});
</script>
