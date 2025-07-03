import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NcrTabularItem } from '../../Services/NCRData';
import { GridComponent, GridDataResult, GridModule, PageChangeEvent, PagerType } from '@progress/kendo-angular-grid';
import { ItemToggleService } from '../../Services/item-toggle.service';
import { PagerModule } from '@progress/kendo-angular-pager';
import { FormsModule } from '@angular/forms';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ExcelLikeFilterPopupComponent } from '../excel-like-filter-popup/excel-like-filter-popup.component';
import { KENDO_EXCELEXPORT } from '@progress/kendo-angular-excel-export';
import { fileExcelIcon, SVGIcon } from "@progress/kendo-svg-icons";

@Component({
  selector: 'app-custom-tabular',
  standalone: true,
  imports: [CommonModule,GridModule,
    PagerModule, FormsModule, PopupModule, 
     ExcelLikeFilterPopupComponent,
      KENDO_EXCELEXPORT],
  templateUrl: './custom-tabular.component.html',
  styleUrl: './custom-tabular.component.scss'
})
export class CustomTabularComponent {

  @Input() isViewExpanded: boolean = false;
  @Input() tabularTitle: string = '';
  @Input() isCloseAvail: boolean = false;
  @Input() columns: string[] = [];
  @Input() rows: NcrTabularItem[] = [];
  @Input() tabCount : number = 0;
  @Output() ResizeScreen = new EventEmitter<boolean>();
  @Output() ShowHideTabular = new EventEmitter<{ isShowTab: boolean, tabTitle?: string }>();
  @ViewChild('grid') grid!: GridComponent;

  pageSize:number = 10;
  skip :number  = 0;
  pageSizes:boolean = false;
  info:boolean = false;
  prevNext:boolean = true;
  type: PagerType = "numeric";
  pagedRows: GridDataResult = { data: [], total: 0 };
  tabMaximumWidth = '68vw';
  searchText: string = '';
  popupColumn: string = '';
  isContractTreeVisible : boolean = false;

  // For excel like filter popup
  activeFilters: Record<string, string[]> = {};
  @ViewChild(ExcelLikeFilterPopupComponent) filterPopup!: ExcelLikeFilterPopupComponent;
  popupAnchor: any;


  constructor(private toggleService: ItemToggleService) {
  }

  ngOnInit() 
  {
      this.toggleService.projectTreeVisibility$.subscribe(value => {
      this.isContractTreeVisible = value;
      if (this.isContractTreeVisible) 
        {
          this.tabMaximumWidth = '68vw';
      }
      else
      {
          this.tabMaximumWidth = '92vw';
      }
    });
  }

  ngOnChanges() {
    this.loadGridItems();
  }

  ExpandOrCollapse(): void {
    this.isViewExpanded = !this.isViewExpanded;
    this.ResizeScreen.emit(this.isViewExpanded);

    if ((this.isViewExpanded && this.isContractTreeVisible) ||
      (!this.isViewExpanded && !this.isContractTreeVisible)) {
      this.toggleService.toggleProjectTreeVisibility();
    }
    this.SetMaximumHeightAndWidth();
  }

  onPageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    this.loadGridItems();
  }

  loadGridItems(): void {
  const data = this.filteredRows;
  this.pagedRows = {
    data: data.slice(this.skip, this.skip + this.pageSize),
    total: data.length
  };
}

  private SetMaximumHeightAndWidth(): void {
    if (this.isViewExpanded) {
      this.tabMaximumWidth = '92vw';
    }
    else {
      this.tabMaximumWidth = '68vw';
    }
  }

  ApplySearch(): void {
    this.skip = 0;
    this.loadGridItems();
  }

    // For excel like filter popup
  get filteredRows() {
  let data = this.rows;
  // filters from excel-like
  for (const col in this.activeFilters) {
    const selected = this.activeFilters[col];
    if (selected?.length) {
      data = data.filter(row => selected.includes(row[col]));
    }
  }
  // global search
  if (this.searchText) {
    const text = this.searchText.toLowerCase();
    data = data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(text)
      )
    );
  }
  return data;
}

  openFilter(column: string, anchor: any) {
  if (this.popupColumn === column && this.popupAnchor === anchor && this.filterPopup.visible) {
    // If clicking same open filter, close it
    this.filterPopup.close();
    return;
  }

    this.popupColumn = column;
    this.popupAnchor = anchor;
    this.filterPopup.open(column,this.filteredRows);
  }

  onExcelLikeFilterChange() {
    this.skip = 0; // reset to first page
    this.loadGridItems();
  }

  CloseTabular():void
  {
    this.ShowHideTabular.emit({ isShowTab: false});
    this.isCloseAvail = !this.isCloseAvail;
  }

}
