import { computed, type Ref } from 'vue';
import type { FilterMap, FilterableKey, Sorter, UseTableOptions } from '../type/index';

/** 三班制判斷 */
const matchShift = (datetime: string, selectedShifts: string[]): boolean => {
  const hour = Number(datetime.split(' ')[1]?.split(':')[0] ?? NaN);
  const shiftMap: Record<string, (h: number) => boolean> = {
    早班: h => h >= 7 && h < 15,
    中班: h => h >= 15 && h < 23,
    夜班: h => h >= 23 || h < 7,
  };
  return Number.isFinite(hour) && selectedShifts.some(shift => shiftMap[shift]?.(hour));
};

export const useTableData = <T extends Record<string, unknown>>(
  data: Ref<T[]>,
  filterValues: Ref<FilterMap<T>>,
  sorter: Ref<Sorter<T>>,
  filterableKeys: ReadonlyArray<FilterableKey<T>>,
  options: UseTableOptions = { nullsFirst: true }
) => {
  /** 篩選器 */
  const filteredData = computed<T[]>(() => {
    const src = Array.isArray(data.value) ? data.value : ([] as T[]);
    let out = [...src];

    for (const key of filterableKeys) {
      const values = filterValues.value[key];
      if (!Array.isArray(values) || values.length === 0) continue;

      // 特別欄位：datatime -> 三班制
      if (key === ('datatime' as FilterableKey<T>)) {
        out = out.filter(row => {
          const v = row[key];
          return typeof v === 'string' && matchShift(v, values as string[]);
        });
        continue;
      }

      // 一般欄位：值必須等於其中之一（string/number/null 不等於）
      out = out.filter(row => {
        const v = row[key];
        if (v === null || v === undefined) return false;
        if (typeof v !== 'string' && typeof v !== 'number') return false;
        // 字串化後比較，可兼容 '01' vs 1 這類場景
        const set = new Set(values.map(String));
        return set.has(String(v));
      });
    }

    return out;
  });

  /** 穩定排序（保留同值原始相對順序） */
  const sortedData = computed<T[]>(() => {
    const arr = filteredData.value.map((item, idx) => ({ item, idx })); // 帶索引做穩定排序
    const current = sorter.value;
    const k = current.columnKey;

    if (!k || current.order === null) return arr.map(x => x.item);

    arr.sort((A, B) => {
      const av = A.item[k as keyof T] as unknown;
      const bv = B.item[k as keyof T] as unknown;

      // null / undefined 排序：置前或置後
      const isNullishA = av === null || av === undefined;
      const isNullishB = bv === null || bv === undefined;
      if (isNullishA || isNullishB) {
        if (isNullishA && isNullishB) return A.idx - B.idx; // 同為 nullish -> 穩定
        const nullGoesFirst = options.nullsFirst ?? true;
        const res = isNullishA ? -1 : 1;
        return current.order === 'ascend'
          ? nullGoesFirst
            ? res
            : -res
          : nullGoesFirst
            ? -res
            : res;
      }

      // 僅對原始可比較型別進行比較
      if (typeof av === 'number' && typeof bv === 'number') {
        return current.order === 'ascend' ? av - bv : bv - av;
      }
      if (typeof av === 'string' && typeof bv === 'string') {
        const cmp = av.localeCompare(bv);
        return current.order === 'ascend' ? cmp : -cmp;
      }

      // 其他不動，保持穩定
      return A.idx - B.idx;
    });

    return arr.map(x => x.item);
  });

  /** 工具：建立預設的 filterOptions（可選） */
  const buildFilterOptions = (
    keys: ReadonlyArray<FilterableKey<T>>,
    source: T[] = filteredData.value
  ) => {
    const out: Partial<Record<FilterableKey<T>, Array<{ label: string; value: string | number }>>> =
      {};
    for (const key of keys) {
      // datatime 欄位固定三班選項
      if (key === ('datatime' as FilterableKey<T>)) {
        out[key] = [
          { label: '早班', value: '早班' },
          { label: '中班', value: '中班' },
          { label: '夜班', value: '夜班' },
        ];
        continue;
      }
      // 其他欄位依據已過濾資料產生
      const values = Array.from(new Set(source.map(row => row[key]))).filter(
        v => v !== null && v !== undefined
      );
      out[key] = values
        .filter(v => typeof v === 'string' || typeof v === 'number')
        .map(v => ({ label: String(v), value: v as string | number }));
    }
    return out;
  };

  /** 工具：清除所有篩選 */
  const clearFilters = () => {
    filterValues.value = {};
  };

  /** 工具：設定排序 */
  const setSorter = (columnKey?: Sorter<T>['columnKey'], order: Sorter<T>['order'] = null) => {
    sorter.value = { columnKey, order };
  };

  return { filteredData, sortedData, buildFilterOptions, clearFilters, setSorter };
};
