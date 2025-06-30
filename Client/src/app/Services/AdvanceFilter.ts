export interface AdvanceFilterItem {
  filterName: string;
  propertyName: string;
}

export interface PopupItem {
  icon: string;
  label: string;
  children?: PopupItem[];
}