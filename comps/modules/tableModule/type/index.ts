export interface Sorter<T> {
  columnKey?: keyof T;
  order: Order;
}

export type Order = 'ascend' | 'descend' | null;
