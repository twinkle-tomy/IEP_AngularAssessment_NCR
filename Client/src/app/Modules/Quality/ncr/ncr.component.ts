import { Component } from '@angular/core';
import { ProjectJobService } from '../../../Services/project-job.service';
import { ContractTreeItem } from '../../../Services/ProjectContract';
import { CommonModule } from '@angular/common';
import { CustomPopupComponent } from '../../../Shared/custom-popup/custom-popup.component';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { FormsModule } from '@angular/forms';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';
import { CustomChartComponent } from "../../../Shared/custom-chart/custom-chart.component";
import { CustomTabularComponent } from "../../../Shared/custom-tabular/custom-tabular.component";
import { NcrRequest, NcrTabularItem } from '../../../Services/NCRData';
import { NcrService } from '../../../Services/ncr.service';
import { SeriesType } from '@progress/kendo-angular-charts';
import { ItemToggleService } from '../../../Services/item-toggle.service';
import { PopupItem } from '../../../Services/AdvanceFilter';

@Component({
  selector: 'app-ncr',
  standalone: true,
  imports: [CommonModule, CustomPopupComponent,
    DialogModule, KENDO_DROPDOWNS, CommonModule, FormsModule, CustomChartComponent, CustomTabularComponent],
  templateUrl: './ncr.component.html',
  styleUrl: './ncr.component.scss'
})
export class NcrComponent {

  selectedContractNames: string = '';
  selectedContracts:ContractTreeItem[] = [];
  hasReassignRequests = true;
  isEnlarged = false;
  isFilterDivVisible = true;
  viewTypeDropdownList = [
  { text: 'Individual', value: 'Individual' },
  { text: 'Project', value: 'Project' }
];

  viewAsDropdownList = [
  { text: 'Chart', value: 'Chart' },
  { text: 'Tabular', value: 'Tabular' }
];

selectedViewType: string = 'Individual'; // default value
selectedViewAs: string = 'Chart'; // default value

  // KENDO Grid and Tabular variables
  isLoading: boolean = true; 
  chartCategories: string[] = [];
  chartValues: number[] = [];
  chartSeriesType: SeriesType = 'column';
  chartSeriesColor = '#1373AD';
  tabularColumns: string[] = [];
  tabularData: NcrTabularItem[] = [];
  isFullChartView : boolean = false;
  isFullGridView : boolean = false;
  isNoDataFound : boolean = false;
  chartMaximumHeight : number = 230;
  isContractTreeVisible : boolean = false;
  tabularLength : number = 0;
  chartYAxisTitle : string= 'NCR Count'
  chartTitle : string= 'NCR'
  isTabCloseAvail : boolean = false;
  isChartClickTabular : boolean = false;
  tabularHeader : string = '';
  chartTabularViewType : string = '';

    // For CustomPopup
  popupItems: PopupItem[]  = [
    { icon: 'save', label: 'Save Filter' },
    { icon: 'help', label: 'Instructions to Use' }
  ];

  isThreeDotClick = false;
  savedFilters: { key: string, viewType: string, viewAs: string }[] = [];
  savedFilterCount = 0;
  popupStyle = 'popup-wrapper open-left'; // can change to open-left for other

    // For Help info dialogue
   helpInfoVisible = false;  

  constructor(private projectService : ProjectJobService,
     private ncrService : NcrService, private toggleService: ItemToggleService)
  {

  }

  ngOnInit() 
  {
    this.toggleService.projectTreeVisibility$.subscribe(value => {
      this.isContractTreeVisible = value;
      if (this.isContractTreeVisible) {
        if (this.isFullChartView) {
          this.isFullChartView = false;
        }
        else if (this.isFullGridView) {
          this.isFullGridView = false;
        }
        this.isFilterDivVisible = true;
      }
      this.setChartMaxHeight();
    });

    this.projectService.selectedContracts$.subscribe(items => {
      if (items.length === 0) 
      {
        this.selectedContracts = [];
        this.selectedContractNames = '';
            this.isNoDataFound = true;
      } 
      else 
      {
        this.selectedContracts = items;
        this.selectedContractNames = items.map(i => i.text).join(', ');
            this.ncrService.getNcrColumns().subscribe(response => this.tabularColumns = response.ncrColumns);
          this.LoadData();
      }
    });
  }

  LoadData(): void {
    this.isNoDataFound = false;
    this.isLoading = true; // Show loader
    const payload: NcrRequest = { viewType: this.selectedViewAs, scope: this.selectedViewType };

    if (this.selectedViewAs === 'Chart' && !this.isChartClickTabular) {
      this.ncrService.getChartData(payload).subscribe(
        {
          next: (data) => {

            if (!data || data.length === 0) {
              this.isNoDataFound = true;
              this.isLoading = false; // Hide Loader
            }
            else {
              this.chartCategories = data.map(d => `${d.month}\n${d.year}`);
              this.chartValues = data.map(d => d.count);
              this.isLoading = false; // Hide Loader
            }
          },
          error: (err) => {
            this.isNoDataFound = true;
            this.isLoading = false;
          }

        });
    }
    else if (this.selectedViewAs === 'Chart' && this.isChartClickTabular)
    {
      if (this.chartTabularViewType == '')
      {
        this.chartTabularViewType = this.selectedViewType;
      }
      else if (this.chartTabularViewType == 'Individual')
      {
        this.chartTabularViewType = 'Project';
      }
      else if (this.chartTabularViewType == 'Project')
      {
        this.chartTabularViewType = 'Individual';
      }

       const payload1: NcrRequest = { viewType: 'Tabular', scope: this.chartTabularViewType };
             this.ncrService.getTabularData(payload1).subscribe({
        next: (data) => {
          this.isLoading = false;
          this.tabularLength = 0;

          if (!data || data.length === 0) {
            this.isNoDataFound = true;
            this.isLoading = false; // Hide Loader
          }
          else {
            this.tabularData = data;
            this.tabularLength = data.length;
            this.isLoading = false; // Hide Loader
          }
        },
        error: (err) => {
          this.isNoDataFound = true;
          this.isLoading = false;
        }
      });
    }
    else {
      this.ncrService.getTabularData(payload).subscribe({
        next: (data) => {
          this.isLoading = false;
          this.tabularLength = 0;

          if (!data || data.length === 0) {
            this.isNoDataFound = true;
            this.isLoading = false; // Hide Loader
          }
          else {
            this.tabularData = data;
            this.tabularLength = data.length;
            this.tabularHeader = "Activities";
            this.isLoading = false; // Hide Loader
          }
        },
        error: (err) => {
          this.isNoDataFound = true;
          this.isLoading = false;
        }
      });
    }
  }

  ToggleFilterComponent()
  {
    this.isFilterDivVisible = !this.isFilterDivVisible;

    if (this.selectedViewAs === 'Chart')
    {
      this.setChartMaxHeight();
    }
    else
    {
      this.isFullGridView = !this.isFullGridView;
    }
  }

  onViewTypeSelectionChange(value: string): void {

      this.isChartClickTabular = false;
      this.isTabCloseAvail = false;

    if (this.selectedViewAs === 'Chart')
    {
      this.isFullChartView = false;
      this.setChartMaxHeight();
    }
    else
    {
      this.isFullGridView = false;
    }

    this.LoadData();

  }

  onViewAsSelectionChange(value: string): void {

    if (this.selectedViewAs === 'Chart')
    {
      this.isFullChartView = false;
      this.setChartMaxHeight();
    }
    else
    {
      this.isFullGridView = false;
      this.isChartClickTabular = false;
      this.isTabCloseAvail = false;
    }
    
    this.LoadData();
  }

  clearAllFilters()
  {
    this.selectedViewType = 'Individual'; // default value
    this.selectedViewAs = 'Chart'; // default value
    this.LoadData();   
  }

  setChartMaxHeight(): void
  {
    if ((!this.isContractTreeVisible && this.isFullChartView && !this.isFilterDivVisible))
    {
      this.chartMaximumHeight = 305;
    }
    else if (!this.isContractTreeVisible && this.isFullChartView && this.isFilterDivVisible)
    {
      this.chartMaximumHeight = 240;
    }
    else if ((this.isContractTreeVisible && !this.isFullChartView && this.isFilterDivVisible) ||
      (!this.isContractTreeVisible && !this.isFullChartView && this.isFilterDivVisible))
    {
      this.chartMaximumHeight = 230;
    }
    else
    {
      this.chartMaximumHeight =290;
    }
}

  // For Custom Popup

  toggleThreeDot(): void {
    this.isThreeDotClick = !this.isThreeDotClick;
  }

  onPopupClosed() {
    this.isThreeDotClick = false;
  }

  onPopupItemSelected(item: string) {
    this.isThreeDotClick = !this.isThreeDotClick;

    if (item === 'Save Filter') {
        this.saveCurrentViewFilter();
      }
      else if (item.startsWith('Saved Filter')) {
        this.loadViewFilter(item);
      }

      else if (item == 'Instructions to Use') {
        this.helpInfoVisible = true;
      }
  }

saveCurrentViewFilter() {
  // Check for duplicate
  const isDuplicate = this.savedFilters.some(f =>
    f.viewType === this.selectedViewType && f.viewAs === this.selectedViewAs
  );

  if (isDuplicate) {
    alert("Same filter already saved once !!!");
    return;
  }

  // Save new filter
  this.savedFilterCount++;
  const key = `Saved Filter ${this.savedFilterCount}`;

  this.savedFilters.push({
    key,
    viewType: this.selectedViewType,
    viewAs: this.selectedViewAs
  });

  console.log(`Saved new filter: ${key}`);
  this.updateLoadFilterMenu();
}

loadViewFilter(key: string) {
  const found = this.savedFilters.find(f => f.key === key);
  if (!found) return;

  this.selectedViewType = found.viewType;
  this.selectedViewAs = found.viewAs;

  console.log(`Loaded filter: ${key}`, found);

  // re-trigger data load or UI update if needed
  this.LoadData();
}

updateLoadFilterMenu() {
  const popupItemsTemp = [
    { icon: 'save', label: 'Save Filter' },
    ...(this.savedFilters.length > 0 
      ? [
          {
            icon: 'filter_list',
            label: 'Load Filter',
            children: this.savedFilters.map(f => ({ icon: '', label: f.key }))
          }
        ]
      : []
    ),
    { icon: 'help', label: 'Instructions to Use' }
  ];

  this.popupItems = popupItemsTemp;
}

  ExpandOrCollapseView(isViewExpand : boolean)
  {
    if (isViewExpand && this.isFilterDivVisible)
    {
      this.isFilterDivVisible = false;
    }
    else if (!isViewExpand && !this.isFilterDivVisible)
    {
      this.isFilterDivVisible = true;
    }
    
     if (this.selectedViewAs === 'Chart')
    {
      this.isFullChartView = !this.isFullChartView;
      this.setChartMaxHeight();
    }
    else
    {
      this.isFullGridView = !this.isFullGridView;
    }
  }

  ShowHideChartInTabular(event: { isShowTab: boolean, tabTitle?: string }) {
    if (event.isShowTab) {
      this.isTabCloseAvail = true;
      this.isChartClickTabular = true;
      this.tabularHeader = event.tabTitle + " Activities";
    }
    else {
      this.isTabCloseAvail = false;
      this.isChartClickTabular = false;
      this.tabularHeader = "Activities";
    }

    this.LoadData();
  }

    // For Help info
    onHelpInfoDialogClose() {
    this.helpInfoVisible = false;
  }

}
