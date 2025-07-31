🧩 表格模組使用手冊：篩選器與排序器

1. 📁 檔案結構

composable/
└─ useSorter.ts // 排序器邏輯
└─ useFilter.ts // 篩選器邏輯
└─ useTableData.ts // 篩選與排序整合後的資料輸出

modules/
└─ tableModule // 使用範例元件

2. 📌 使用步驟說明
   1️⃣ 載入 hook

const { sorter, callSorter } = useSorter<DataType>();
const { filterValues, setFilters, syncFilterUI } = useFilter<DataType>(['key1', 'key2']);
const { sortedData } = useTableData(
ref(rawData),
filterValues,
sorter,
['key1', 'key2']
);

2️⃣ 傳入子元件 props 與接收事件
<infoTableBlock
:data="sortedData"
@update:sorter="handleSorterChange"
@update:filters="handleFiltersChange"
/>

const handleSorterChange = ({ columnKey, order }) => {
if (columnKey) callSorter(columnKey as keyof DataType);
};

const handleFiltersChange = ({ filters, columns }) => {
setFilters(filters);
syncFilterUI(columns);
};

3️⃣ 清空篩選（可選）

<infoTableBlock @clear-filters="clearAllFilters" />

const clearAllFilters = () => {
setFilters({}); // 清空邏輯
};

3. 🧪 備註與注意事項
   DataType 一律使用嚴謹型別定義，避免 any

若使用自訂欄位名稱，keyof 類型需正確映射

sortedData 即為最終展示資料，直接給 <n-data-table> 即可
