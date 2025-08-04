import { computed } from 'vue';
import type { Ref } from 'vue';
import type { Sorter } from '../type/index';

export const useTableData = <T extends Record<string, string | number | null>>(
  data: Ref<T[]>,
  filterValues: Ref<Partial<Record<keyof T, (string | number)[]>>>,
  sorter: Ref<Sorter<T>>,
  filterableKeys: (keyof T)[]
) => {
  // 計算過濾後的數據
  const filteredData = computed(() => {
    let filtered = [...data.value];

    for (const key of filterableKeys) {
      const values = filterValues.value[key];
      if (Array.isArray(values) && values.length > 0) {
        filtered = filtered.filter((row) => values.includes(Number(row[key])));
      }
    }

    return filtered;
  });

  // 計算排序後的數據
  const sortedData = computed(() => {
    const filtered = [...filteredData.value];
    const currentSorter = sorter.value;

    if (!currentSorter.columnKey || currentSorter.order === null) return filtered;

    const key = currentSorter.columnKey;

    filtered.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === null) return currentSorter.order === 'ascend' ? -1 : 1;
      if (valB === null) return currentSorter.order === 'ascend' ? 1 : -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return currentSorter.order === 'ascend'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return currentSorter.order === 'ascend' ? valA - valB : valB - valA;
      }

      return 0;
    });

    return filtered;
  });

  return {
    filteredData,
    sortedData,
  };
};
