<template>
  <div class="flex gap-2">
    <toggleButton
      v-for="btn in options"
      :key="btn.value"
      :active="modelValue === btn.value"
      @click="() => emit('update:modelValue', btn.value)"
    >
      {{ btn.label }}
    </toggleButton>
  </div>
</template>

<script setup lang="ts">
import { toggleButton } from '@/components/index';

defineProps<{
  modelValue: string;
  options: Array<{ label: string; value: string }>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
