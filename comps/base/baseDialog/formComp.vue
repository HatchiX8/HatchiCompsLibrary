<template>
  <BaseModal
    v-model="visible"
    title="編輯用戶"
    :ok-loading="submitting"
    @ok="handleSubmit"
    @cancel="reset"
  >
    <n-form ref="formRef" :model="form" :rules="rules" label-width="80">
      <n-form-item label="姓名" path="name">
        <n-input v-model:value="form.name" />
      </n-form-item>
      <n-form-item label="Email" path="email">
        <n-input v-model:value="form.email" />
      </n-form-item>
    </n-form>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './baseDialog.vue';
import type { FormInst, FormRules } from 'naive-ui';

const visible = defineModel<boolean>({ required: true });
const submitting = ref(false);
const formRef = ref<FormInst | null>(null);
const form = reactive({ id: '', name: '', email: '' });

const rules: FormRules = {
  name: { required: true, message: '必填' },
  email: { required: true, message: '必填' },
};

async function handleSubmit() {
  console.log('往外emit去觸發請求API');
}

function reset() {
  // 可清空或還原
}
</script>
