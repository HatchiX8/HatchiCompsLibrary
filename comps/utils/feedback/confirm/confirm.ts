import { createDiscreteApi } from 'naive-ui';

// 建立 Naive UI 提供的「離散式 API」，這裡只需要 dialog 功能
const { dialog } = createDiscreteApi(['dialog']);

export const confirm = (opts: {
  title?: string;
  content: string;
  positiveText?: string;
  negativeText?: string;
}): Promise<boolean> =>
  new Promise((resolve) => {
    dialog.create({
      title: opts.title ?? '確認', // 標題（如果沒有傳入就顯示「確認」）
      content: opts.content, // 主要文字內容，必填
      positiveText: opts.positiveText ?? '確定', // 確認按鈕文字（可自訂，例如「刪除」、「送出」）
      negativeText: opts.negativeText ?? '取消', // 取消按鈕文字（可自訂，例如「返回」、「關閉」）

      // ----------樣式調整----------
      // 修改正向按鈕樣式
      positiveButtonProps: {
        type: 'primary', // Naive UI 預設的按鈕色系：default / primary / info / success / warning / error
        size: 'medium',
      },

      // 修改取消按鈕樣式
      negativeButtonProps: {
        type: 'primary',
      },

      // 彈窗樣式（例如置中寬度）
      style: 'width: 400px;',
      // ---------------------------

      onPositiveClick: () => resolve(true), // 使用者點擊「確定」時，回傳 true
      onNegativeClick: () => resolve(false), // 使用者點擊「取消」時，回傳 false
      onClose: () => resolve(false), // 使用者直接關閉彈窗（點右上角 X 或 ESC）時，也回傳 false
    });
  });
