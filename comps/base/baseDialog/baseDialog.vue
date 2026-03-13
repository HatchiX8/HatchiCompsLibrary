<template>
  <n-modal v-model:show="modelValue" :mask-closable="false">
    <n-card :style="{ width }" :title="title" :bordered="false">
      <slot />
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="onCancel" :disabled="okLoading">取消</n-button>
          <n-button type="primary" :loading="okLoading" @click="onOk">確定</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  modelValue: boolean;
  title?: string;
  width?: string;
  okLoading?: boolean;
}>(), { 
  title: '視窗', 
  width: '600px', 
  okLoading: false 
});

const emit = defineEmits<{
  'update:modelValue': [boolean];
  ok: [];
  cancel: [];
}>();

const onOk = () => emit('ok');
const onCancel = () => {
  emit('update:modelValue', false);
  emit('cancel');
};
</script>
