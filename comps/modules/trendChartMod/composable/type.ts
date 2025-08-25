export interface conditionInfoType {
  backCode?: string;
  LowMax?: number;
  LowMin?: number;
  UpMax?: number;
  UpMin?: number;
}

export interface ChartPoint {
  value: [number, number]; // 對應 x: arr[0], y: arr[1]
  extra: [number, number, number, number, number];
}

export interface tableRow {
  iCoil_id: string;
  coil_inDiam: number;
  coil_outDiam: number;
  coiler_num: string;
  datatime: string;
  coil_width: number;
}

export interface realTimeTableRow {
  coilID: string;
  coiler: number;
  coil_inDiam: string;
  coil_outDiam: string;
}

type DataPoint = [number, number, number, number, number];

export interface curlData {
  Inner: DataPoint[];
  Outer: DataPoint[];
  Jpg: string;
  Jpg2: string;
  ave: number;
}

// **後續沒有3/4號線
export interface curlTFData {
  Inner: DataPoint[];
  Outer: DataPoint[];
  BackCode: string;
  LOWTELESCOPEMAX: string;
  LOWTELESCOPEMIN: string;
  UPTELESCOPEMAX: string;
  UPTELESCOPEMIN: string;
  ave: number;
  custom_no: string;
  x長度: number;
  message: string;
}

export interface ChartPoint {
  value: [number, number]; // 對應 x: arr[0], y: arr[1]
  extra: [number, number, number, number, number];
}

export type Primitive = string | number | null | undefined;
