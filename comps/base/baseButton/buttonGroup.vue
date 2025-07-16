<template>
  <div class="flex gap-2">
    <n-button
      v-for="btn in options"
      :key="btn.value"
      :type="modelValue === btn.value ? 'primary' : 'default'"
      @click="() => emit('update:modelValue', btn.value)"
    >
      {{ btn.label }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  options: Array<{ label: string; value: string }>;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
