# PaginationTable

封裝 Naive UI `n-data-table` 的分頁表格元件，支援自訂欄位、分頁控制與操作按鈕插槽。

---

## 引入元件

```ts
import PaginationTable from '@/base/baseTable/paginationTable/paginationTable.vue';
```

---

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import PaginationTable from '@/base/baseTable/paginationTable/paginationTable.vue';

interface User {
  id: number;
  name: string;
  email: string;
}

const tableData = ref<User[]>([
  { id: 1, name: '王小明', email: 'ming@example.com' },
  { id: 2, name: '李小華', email: 'hua@example.com' },
]);

const columns: DataTableColumns<User> = [
  { title: '姓名', key: 'name' },
  { title: 'Email', key: 'email' },
];

function handleEdit(row: User) {
  console.log('編輯', row);
}

function handleDelete(row: User) {
  console.log('刪除', row);
}
</script>

<template>
  <PaginationTable
    :data="tableData"
    :columns="columns"
    :page-size="10"
    striped
  >
    <template #actions="{ row }">
      <n-button size="small" @click="handleEdit(row)">編輯</n-button>
      <n-button size="small" type="error" @click="handleDelete(row)">刪除</n-button>
    </template>
  </PaginationTable>
</template>
```

---

## 啟用勾選功能

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { DataTableRowKey } from 'naive-ui';

const checkedKeys = ref<DataTableRowKey[]>([]);

function handleCheckedChange(keys: DataTableRowKey[]) {
  checkedKeys.value = keys;
  console.log('目前勾選的 id：', keys);
}
</script>

<template>
  <!-- 不需要取得勾選結果時 -->
  <PaginationTable
    :data="tableData"
    :columns="columns"
    selectable
  />

  <!-- 需要取得勾選結果時 -->
  <PaginationTable
    :data="tableData"
    :columns="columns"
    selectable
    @update:checked-row-keys="handleCheckedChange"
  />
</template>
```

---

## Props

| 參數 | 型別 | 預設值 | 說明 |
|------|------|--------|------|
| `data` | `Row[]` | **必填** | 表格資料，每筆須有 `id` 欄位（`string \| number`） |
| `columns` | `DataTableColumns<Row>` | **必填** | Naive UI 欄位定義 |
| `rowKey` | `(row: Row) => DataTableRowKey` | `row => row.id` | 自訂列唯一識別函式 |
| `selectable` | `boolean` | `false` | 是否啟用勾選功能 |
| `pageSize` | `number` | `10` | 每頁顯示筆數 |
| `striped` | `boolean` | `false` | 斑馬紋樣式 |
| `bordered` | `boolean` | `false` | 表格邊框 |
| `loading` | `boolean` | `false` | 載入中狀態 |
| `showSizePicker` | `boolean` | `false` | 顯示每頁筆數選擇器 |
| `pageSizes` | `number[]` | `[10, 20, 50]` | 每頁筆數選項（需搭配 `showSizePicker`） |
| `showQuickJumper` | `boolean` | `false` | 顯示頁碼快速跳轉 |
| `showActions` | `boolean` | `true` | 是否顯示操作欄位 |
| `actionsTitle` | `string` | `'操作'` | 操作欄位標題文字 |
| `actionsWidth` | `string \| number` | `180` | 操作欄位寬度 |

---

## Emits

| 事件名稱 | 參數型別 | 觸發時機 |
|----------|----------|----------|
| `update:checkedRowKeys` | `DataTableRowKey[]` | 勾選狀態變動時（需搭配 `selectable`） |

---

## Slots

### `#actions`

操作按鈕插槽，會在表格最右側新增一欄。

| 插槽參數 | 型別 | 說明 |
|----------|------|------|
| `row` | `Row` | 當前列的資料物件 |

```vue
<template #actions="{ row }">
  <n-button @click="handleEdit(row)">編輯</n-button>
</template>
```

> 若未傳入 `#actions` 插槽，則不會顯示操作欄位（即使 `showActions` 為 `true`）。

---

## 注意事項

- `data` 的每筆資料**必須包含 `id` 欄位**（型別為 `string | number`），作為列的唯一識別碼。
- 若有特殊需求可透過 `rowKey` prop 自訂識別函式。
- 當 `data` 資料變動時，分頁會**自動重設回第一頁**。
- 分頁列只在**總頁數大於 1** 時才會顯示。
- 勾選狀態由元件內部管理，父層可透過監聽 `@update:checked-row-keys` 取得目前勾選的 key 列表。