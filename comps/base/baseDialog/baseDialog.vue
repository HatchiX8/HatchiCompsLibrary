<template>
  <n-modal v-model:show="show" :mask-closable="false">
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
import { ref, watch, toRefs } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    width?: string;
    okLoading?: boolean;
  }>(),
  { title: '視窗', width: '600px', okLoading: false }
);

const emit = defineEmits<{
  'update:modelValue': [boolean];
  ok: [];
  cancel: [];
}>();

const { modelValue } = toRefs(props);
const show = ref(modelValue.value);
watch(modelValue, (v) => (show.value = v));
watch(show, (v) => emit('update:modelValue', v));

const onOk = () => {
  emit('ok');
};
const onCancel = () => {
  show.value = false;
  emit('cancel');
};
</script>
