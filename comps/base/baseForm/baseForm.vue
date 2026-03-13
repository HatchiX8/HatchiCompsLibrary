<template>
  <n-form-item :label="label" :path="path" :rule="rule" :show-label="!!label">
    <slot />
  </n-form-item>
</template>

<script setup lang="ts">
import type { FormItemRule } from 'naive-ui';

defineProps<{
  label?: string;
  path?: string;
  rule?: FormItemRule | FormItemRule[];
}>();
</script>
