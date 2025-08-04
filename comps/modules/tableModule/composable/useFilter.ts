import { ref } from 'vue';

// 此為過濾器的封裝函式
export const useFilter = <T extends object>(filterKeys: (keyof T)[]) => {
  type FilterValues = {
    [K in keyof T]?: (string | number)[];
  };

  const filterValues = ref<FilterValues>({});

  // 篩選器設定
  const setFilters = (filters: FilterValues) => {
    filterKeys.forEach((key) => {
      filterValues.value[key] = filters[key] ?? [];
    });
  };

  // 同步 Naive UI columns 中的打勾狀態
  const syncFilterUI = (
    columns: { key: string; filter?: boolean; filterOptionValues?: number[] }[]
  ) => {
    Object.entries(filterValues.value).forEach(([key, values]) => {
      const column = columns.find((col) => col.key === key);
      if (column && column.filter) {
        column.filterOptionValues = Array.isArray(values) ? values : [];
      }
    });
  };

  return {
    filterValues,
    setFilters,
    syncFilterUI,
  };
};
