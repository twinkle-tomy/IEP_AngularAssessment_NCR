export interface NcrRequest {
  viewType: string; 
  scope: string;
}

export interface NcrChartItem {
  year: number;
  month: string;
  count: number;
}

export interface NcrTabularItem {
  [key: string]: any;
}

export interface NcrColumnsResponse {
  ncrColumns: string[];
}

export interface ChartDataPoint {
  category: string;
  value: number;
}