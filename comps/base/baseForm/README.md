# BaseForm 表單欄位封裝

## 簡介

`baseForm` 是對 Naive UI `n-form-item` 的二次封裝，將 `label`、`path`、`rule` 統一由 props 傳入，並透過 `slot` 放置任意輸入元件，讓業務元件不需重複撰寫 `n-form-item` 的樣板結構。

---

## 檔案結構

```
baseForm/
├── baseForm.vue   # 基礎表單欄位元件
└── README.md
```

---

## Props

| Prop    | 型別                                   | 預設值  | 說明                              |
| ------- | ------------------------------------ | ---- | ------------------------------- |
| `label` | `string`                             | —（必填）| 欄位標籤文字                          |
| `path`  | `string`                             | —    | 對應 `n-form` model 的欄位路徑，用於驗證 |
| `rule`  | `FormItemRule \| FormItemRule[]`     | —    | 欄位驗證規則，型別來自 Naive UI            |

### Slots

| Slot      | 說明                        |
| --------- | ------------------------- |
| `default` | 放置輸入元件，例如 `n-input`、`n-select` 等 |

---

## 基本使用範例

```vue
<template>
  <n-form ref="formRef" :model="form">
    <BaseForm
      label="名稱"
      path="name"
      :rule="[
        { required: true, message: '請輸入名稱', trigger: 'blur' }
      ]"
    >
      <n-input v-model:value="form.name" />
    </BaseForm>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseForm from './baseForm.vue';

const formRef = ref(null);
const form = ref({
  name: ''
});
</script>
```

---

## 注意事項

- `path` 需與外層 `n-form` 的 `:model` 物件 key 一致，否則驗證無法正確對應。
- `rule` 不傳時該欄位不會進行驗證。
- 此元件本身不負責觸發驗證，驗證邏輯由外層 `n-form` 的 `formRef.validate()` 統一控制。