import type { VNodeChild } from 'vue';

// 表格欄位定義
export interface Column<T> {
  title: string;
  key?: Extract<keyof T, string>;
  align: string;
  width: number | `${number}%` | `${number}px`; // 實務常用 px/%/數字
  titleAlign?: string;
  filter?: boolean;
  filterOptionValues?: Array<T[Extract<keyof T, string>]>;
  filterOptions?: Array<{ label: string; value: T[Extract<keyof T, string>] }>;
  sorter?: boolean | ((a: T, b: T) => number); // 新增排序欄位標誌
  sortOrder?: 'ascend' | 'descend' | null; // 新增排序狀態
  children?: Array<Column<T>>;
  render?: (row: T) => VNodeChild;
}

// 排序器&篩選器型別
export type SortOrder = 'ascend' | 'descend' | null;

export interface Sorter<T> {
  columnKey?: Extract<keyof T, string>;
  order: SortOrder;
}

export type FilterableKey<T> = Extract<keyof T, string>;

export type FilterMap<T> = Partial<Record<FilterableKey<T>, (string | number)[]>>;

export interface UseTableOptions {
  /** null 值在排序時是否置前（預設 true） */
  nullsFirst?: boolean;
}
