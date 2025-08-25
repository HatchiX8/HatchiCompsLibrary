import type { DataTableColumns, DataTableBaseColumn, DataTableColumnGroup } from 'naive-ui';
import type { Column } from '../type/index'; // ← 就是你現在的 Column<T>
type RowObj = Record<string, unknown>;

// 解析你允許的 width（number / '120px' / '30%'），只回傳 Naive 接受的 number(px)
const toPx = (w?: number | `${number}%` | `${number}px`): number | undefined => {
  if (typeof w === 'number') return w;
  if (!w) return undefined;
  if (w.endsWith('px')) {
    const n = Number(w.slice(0, -2));
    return Number.isFinite(n) ? n : undefined;
  }
  // 百分比交給表格自動分配，這裡不強轉
  return undefined;
};

const normalizeAlign = (a?: string): 'left' | 'center' | 'right' | undefined =>
  a === 'left' || a === 'center' || a === 'right' ? a : undefined;

function mapOne<T extends RowObj>(c: Column<T>): DataTableBaseColumn<T> | DataTableColumnGroup<T> {
  // 群組欄位
  if (Array.isArray(c.children) && c.children.length > 0) {
    const group: DataTableColumnGroup<T> = {
      key: c.key as string | number,
      title: c.title,
      children: c.children
        .map(child => mapOne(child))
        .filter((col): col is DataTableBaseColumn<T> => !('children' in col)), // 遞迴且只保留 base columns
    };
    return group;
  }

  // 一般欄位
  const base: DataTableBaseColumn<T> = {
    key: c.key as string | number,
    title: c.title,
    align: normalizeAlign(c.align),
    width: toPx(c.width),
    minWidth: (c as { minWidth?: number }).minWidth, // 若你之後補了 minWidth 會自動帶入
    // 篩選（Naive 只要有 options/values 就會啟用）
    filter: c.filter ?? (Array.isArray(c.filterOptions) || Array.isArray(c.filterOptionValues)),
    // Naive 的型別是 {label:string,value:any}；用 unknown 轉一下避免 any
    filterOptions: c.filterOptions as unknown as DataTableBaseColumn<T>['filterOptions'],
    filterOptionValues:
      c.filterOptionValues as unknown as DataTableBaseColumn<T>['filterOptionValues'],
    // 排序：Naive 是 boolean | 'default' | CompareFn<T>，你的 boolean/CompareFn 直接相容
    sorter: c.sorter as DataTableBaseColumn<T>['sorter'],
    // render 簽名補上 index（若你原本沒用到 index 也沒差）
    render: c.render ? row => c.render!(row as T) : undefined,
  };
  return base;
}

export function toNaiveColumns<T extends RowObj>(
  cols: ReadonlyArray<Column<T>>
): DataTableColumns<T> {
  return cols.map(mapOne);
}
