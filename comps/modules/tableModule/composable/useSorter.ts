import { ref } from 'vue';
import type { Order } from '../type/index';

// 此為排序器的封裝函式
export const useSorter = <T extends object>() => {
  const sorter = ref<{ columnKey?: keyof T; order: Order }>({
    columnKey: undefined,
    order: null,
  });

  const callSorter = (key: keyof T) => {
    const current = sorter.value;
    if (current.columnKey !== key) {
      sorter.value = { columnKey: key, order: 'ascend' };
    } else {
      const nextOrder: Order =
        current.order === 'ascend' ? 'descend' : current.order === 'descend' ? null : 'ascend';
      sorter.value = { columnKey: nextOrder ? key : undefined, order: nextOrder };
    }
  };

  return {
    sorter,
    callSorter,
  };
};
