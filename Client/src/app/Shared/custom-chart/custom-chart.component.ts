import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChartComponent, KENDO_CHARTS, SeriesType } from '@progress/kendo-angular-charts';
import { PageChangeEvent, PagerType } from '@progress/kendo-angular-grid';
import { KENDO_PAGER } from '@progress/kendo-angular-pager';
import { ItemToggleService } from '../../Services/item-toggle.service';
import { ChartDataPoint } from '../../Services/NCRData';

@Component({
  selector: 'app-custom-chart',
  standalone: true,
  imports: [KENDO_CHARTS, KENDO_PAGER, CommonModule],
  templateUrl: './custom-chart.component.html',
  styleUrl: './custom-chart.component.scss'
})
export class CustomChartComponent {

  @Input() chartTitle: string = '';
  @Input() categories: string[] = [];
  @Input() seriesData: number[] = [];
  @Input() seriesType: SeriesType = 'column';
  @Input() seriesColor: string = '#007bff';
  @Input() yAxisTitleText :string = '';
  @Input() isViewExpanded: boolean = false;
  @Output() ResizeScreen = new EventEmitter<boolean>();
  @ViewChild(ChartComponent) chart!:ChartComponent;
  @Output() ShowHideTabular = new EventEmitter<{ isShowTab: boolean, tabTitle?: string }>();
  pagedCategoryArray: ChartDataPoint[] = [];
  pageSize:number = 10;
  currentPage:number  = 0;
  pageSizes:boolean = false;
  info:boolean = false;
  prevNext:boolean = true;
  type: PagerType = "numeric";
  contentId = "content-1";
  isContractTreeVisible : boolean = false;

  constructor(private toggleService: ItemToggleService) {

  }
  
  ngOnInit() 
  {
    this.toggleService.projectTreeVisibility$.subscribe(value => {
      this.isContractTreeVisible = value;
    });
  }

   ngOnChanges(): void {
    this.updatePagedData();
  }

  onPageChange(event: PageChangeEvent): void {
    this.currentPage = event.skip;
    this.pageSize = event.take;
    this.updatePagedData();
  }

  private updatePagedData(): void {
  const start = this.currentPage;
  const end = this.currentPage + this.pageSize;
  const pageCats = this.categories.slice(start, end);
  const pageVals = this.seriesData.slice(start, end);
  this.pagedCategoryArray = pageCats.map((cat, idx) => ({
    category: cat,
    value: pageVals[idx]
  }));
  }

   ExpandOrCollapse(): void {
    this.isViewExpanded = !this.isViewExpanded;
    this.ResizeScreen.emit(this.isViewExpanded);
    if ((this.isViewExpanded && this.isContractTreeVisible) ||
      (!this.isViewExpanded && !this.isContractTreeVisible)) {
      this.toggleService.toggleProjectTreeVisibility();
    }
  }

  
  onChartClick(event: any) {
  this.ShowHideTabular.emit({isShowTab: true, tabTitle: this.replaceNewLines(event.category)});
}

replaceNewLines(value: string): string {
  const replacedValue = (value || '').replace(/\n/g, ' ');
  return replacedValue;
}

}
