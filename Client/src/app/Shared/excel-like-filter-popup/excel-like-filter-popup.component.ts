import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PopupModule } from '@progress/kendo-angular-popup';


@Component({
  selector: 'app-excel-like-filter-popup',
  standalone: true,
  imports: [FormsModule, CommonModule, PopupModule],
  templateUrl: './excel-like-filter-popup.component.html',
  styleUrl: './excel-like-filter-popup.component.scss'
})
export class ExcelLikeFilterPopupComponent {

  @Input() rows: any[] = [];
  @Input() activeFilters: Record<string, string[]> = {};
  @Input() popupAnchor!: HTMLElement;
  @Output() filterApplied = new EventEmitter<void>();
  visible = false;
  columnName: string = '';
  distinctValuesForPopup: { value: string, selected: boolean }[] = [];
  searchText: string = '';

  // position
  popupTop = 0;
  popupLeft = 0;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  open(column: string, remainingRows: any[]) {
    console.log("ENTERED Excel Like Filter popup");
    this.columnName = column;
    this.searchText = '';
    this.visible = true;

    // find distinct values from remaining rows
    const uniqueSet = new Set<string>();
    remainingRows.forEach(row => uniqueSet.add(row[column]));
    this.distinctValuesForPopup = Array.from(uniqueSet).map(value => ({
      value,
      selected: this.activeFilters[column]?.includes(value) || false
    }));
    console.log(this.distinctValuesForPopup);
  }

  get filteredDistinctValues() {
    return this.searchText
      ? this.distinctValuesForPopup.filter(d =>
          d.value?.toLowerCase().includes(this.searchText.toLowerCase()))
      : this.distinctValuesForPopup;
  }

  anySelected() {
    return this.distinctValuesForPopup.some(d => d.selected);
  }

  onCheckboxChange() {
    // This ensures Apply immediately enables/disables
  }

  applyFilter() {
    const selected = this.distinctValuesForPopup.filter(d => d.selected).map(d => d.value);
    this.activeFilters[this.columnName] = selected;
    this.filterApplied.emit(); // <==== inform parent
    this.close();
  }

  clearFilter() {
    this.activeFilters[this.columnName] = [];
    this.filterApplied.emit(); // <==== inform parent
    this.close();
  }

  close() {
    this.visible = false;
  }

  // click outside
@HostListener('document:click', ['$event'])
handleOutsideClick(event: MouseEvent) {
  const clickedInside = this.elementRef.nativeElement.contains(event.target);
  const clickedAnchor = this.popupAnchor?.contains(event.target as Node);
  
  if (this.visible && !clickedInside && !clickedAnchor) {
    this.close();
  }
}

}
