import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectJobService } from '../../Services/project-job.service';
import { AdvanceFilterItem, PopupItem } from '../../Services/AdvanceFilter';
import { KENDO_DROPDOWNS, MultiSelectComponent } from "@progress/kendo-angular-dropdowns";
import { ItemToggleService } from '../../Services/item-toggle.service';
import { KENDO_TREEVIEW } from '@progress/kendo-angular-treeview';
import { LoginService } from '../../Services/login.service';
import { ContractExportDetail, ContractTreeItem, ProjectNode } from '../../Services/ProjectContract';
import { Observable, of } from 'rxjs';
import { CustomPopupComponent } from '../custom-popup/custom-popup.component';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ExcelExportComponent, ExcelExportModule } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-project-contracts',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    KENDO_DROPDOWNS, KENDO_TREEVIEW,
     CustomPopupComponent, DialogModule, ExcelExportModule],
  templateUrl: './project-contracts.component.html',
  styleUrl: './project-contracts.component.scss'
})

export class ProjectContractsComponent {

  currentUserEmail:any;
  selectedTab: string = 'my'; // default selection
  searchText: string = '';
  @ViewChild('projectTreeWrapper') projectTreeWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('excelExport', { static: false }) excelExport!: ExcelExportComponent;

  // variables for Advance Search
  advanceSearchToggle : boolean = true;
  advanceFilterItems:AdvanceFilterItem[] = []; // from API
  advanceFilterOptions: Record<string, string[]> = {}; // propertyName => array
  advanceSelectedValues: Record<string, string[]> = {}; // propertyName => selected items
  fullJobList : any;
  tagMapper = () => [];
  @ViewChildren(MultiSelectComponent) multiSelect!: QueryList<MultiSelectComponent>;
  multiselectStates: { [propertyName: string]: boolean } = {};

  // variables for Project Contracts
  excelExportDiv:boolean = false;
  selectAllChecked : boolean = false;
  allProjects: ProjectNode[] = [];
  treeData: ContractTreeItem[] = [];
  filteredProjects: ProjectNode[] = [];
  checkedKeys: string[] = [];
  hasChildren = (item: object): boolean =>!!(item as ContractTreeItem).items?.length;

  fetchChildren = (item: object): Observable<ContractTreeItem[]> => {
  return of((item as ContractTreeItem).items ?? []);
  }
  expandedKeys: string[] = [];
  selectedContracts: any[] = [];

  // For CustomPopup
  popupItems: PopupItem[] = [
    { icon: 'grid_on', label: 'Export Contracts' },
    { icon: 'save', label: 'Save Filter' },
    { icon: 'help', label: 'Instructions to Use' }
  ];

  isThreeDotClick = false;
  savedFilters: { key: string, values: Record<string, string[]> }[] = [];
  savedFilterCount = 0;
  popupStyle = 'popup-wrapper open-right'; 
  exportColumns: string[] = [];
  exportData: ContractExportDetail[] = [];
  uploadedFiles = [
  { name: 'ITO - Train configuration & Opportunity Driver-Driven', date: '01-Jan-2025' },
  { name: 'ITO Information', date: '01-Jan-2025' },
  { name: 'Serial Number', date: '01-Jan-2025' },
  { name: 'Industrial segment file', date: '01-Jan-2025' },
  { name: 'P6-project creation file', date: '01-Jan-2025' },
  { name: 'Unifier project creation file', date: '01-Jan-2025' }
];

  // For Help info dialogue
   helpInfoVisible = false;  

  constructor(private projectService : ProjectJobService, 
    private toggleService : ItemToggleService, private loginService : LoginService)
  {

  }

  ngOnInit() 
  {
    this.currentUserEmail = this.loginService.userEmail;
    this.LoadAdvanceFilter();
    this.LoadContracts();
    this.LoadExportColumns();
  }

  LoadAdvanceFilter()
  {
    this.projectService.GetAdvanceFilter().subscribe(data => {
      this.advanceFilterItems = data.filterItems;
      this.fullJobList = data.jobFullList;
      this.CheckDefaultAdvanceFilters(data);
    });
  }

  LoadContracts()
  {
    this.projectService.GetProjectContracts().subscribe(res => {

      if (res?.projects) 
        {
        const projects = res.projects;
        this.allProjects = res.projects;
        this.applyFilter();
        this.updateTreeHeight();
      } 
      else 
      {
        console.error("No projects found in response", res);
      }
    });
  }

  onTreeViewCheckboxChange(checked: string[]): void {
    this.checkedKeys = checked;

    const superParents: any[] = [];

    for (let key of checked) {
      let node = this.treeData.find(t => t.id == key);
      while (node && !node.isParent && node.id) {
        node = this.treeData.find(t => t.id == node?.id);
      }
      if (node?.isParent && !superParents.some(p => p.id === node.id)) {
        superParents.push(node);
      }
    }

    this.selectedContracts = superParents;

    this.PassSelectedContracts();
  }

  CheckDefaultAdvanceFilters(responseData : any)
  {
      // Iterate filter values
      for (let item of this.advanceFilterItems) {
        const key = item.propertyName;
        this.advanceFilterOptions[key] = responseData[key] || [];
      // 👇 Default selection for Project_Type
      if (key === 'businessTier1') {
        this.advanceSelectedValues[key] = ["New Units", "PVS - Upgrades"];
      }
      else if (key === 'Delivery_Date') {
        this.advanceSelectedValues[key] = ["12/21/2017"];
      }
       else if (key === 'Project_Type') {
        this.advanceSelectedValues[key] = ["Active","Planned"];
      }  
      else {
        this.advanceSelectedValues[key] = [];
      }
      }
  }

  SwitchContracts(tabName:string)
  {
    this.selectedTab = tabName
    this.applyFilter();
  }

  OnAdvanceSearchButtonClick()
  {
    this.advanceSearchToggle = !this.advanceSearchToggle;
    setTimeout(() => this.updateTreeHeight(), 0);
  }

  updateTreeHeight(): void {
    if (!this.projectTreeWrapper) return;
    const newHeight = this.projectTreeWrapper ? 150 : 1000;
    //this.projectTreeWrapper.nativeElement.style.maxHeight = `${newHeight}px`;
  }

  toggleComponent() {
    this.toggleService.toggleProjectTreeVisibility();
  }

  applyFilter(): void 
  {
    // 1. Filter by tab
      let filtered = [];
      if (this.selectedTab === 'my') {
        filtered = this.allProjects.filter(p => p.user === this.currentUserEmail());
      } else if (this.selectedTab === 'fav') {
        filtered = this.allProjects.filter(p => p.favourite);
      } else {
        filtered = [...this.allProjects];
      }

      // 2. Apply search filter
      if (this.searchText?.trim()) {
        const term = this.searchText.trim().toLowerCase();
        filtered = filtered
          .map(p => ({
            ...p,
            trains: p.trains
              .map(t => ({
                ...t,
                childJobs: t.childJobs.filter(job => job.toLowerCase().includes(term))
              }))
              .filter(t => t.trainName.toLowerCase().includes(term) || t.childJobs.length > 0)
          }))
          .filter(p =>
            p.contractName.toLowerCase().includes(term) ||
            p.trains.length > 0
          );
      }

    // if (this.fullJobList != null && this.advanceSelectedValues != null) {
    //   const hasAnySelection = Object.values(this.advanceSelectedValues)
    //     .some(arr => arr.length > 0);

    //   if (hasAnySelection) {
    //     const advanceSelected = this.advanceSelectedValues;

    //     // Step 1: Filter jobFullList based on selected filters
    //     const matchingJobs = this.fullJobList.filter((job: { [x: string]: string; }) => {
    //       return Object.keys(advanceSelected).every(key => {
    //         const selectedValues = advanceSelected[key];
    //         return selectedValues.length === 0 || selectedValues.includes(job[key]);
    //       });
    //     });

    //     const matchingJobIds = matchingJobs.map((j: { jobId: any; }) => j.jobId);

    //     // Step 2: Filter current tree data based on jobIds
    //     filtered = filtered.filter(project =>
    //       matchingJobIds.includes(project.projectId)
    //     );
    //   }
    // }

      this.filteredProjects = filtered;
      this.treeData = this.projectService.ConvertToTreeItems(filtered);

      // ✅ Expand first root node (if exists)
     this.expandedKeys = this.treeData.length > 0 ? [this.treeData[0].id] : [];

      // ✅ Set checked state to first item
      this.checkedKeys = this.treeData.length > 0 ? [this.treeData[0].id] : [];
      const parentIds = this.treeData.map(parent => parent.id);
      this.selectAllChecked = parentIds.every(id => this.checkedKeys.includes(id));
      this.onTreeViewCheckboxChange(this.checkedKeys);
  }

  toggleFavourite(item: ContractTreeItem) {
    const project = this.allProjects.find(p => p.projectId === item.id);
    if (project) {
      project.favourite = !project.favourite;
    }
    
    this.applyFilter();
  }

  isFavourited(item: ContractTreeItem): boolean {
    const project = this.allProjects.find(p => p.projectId === item.id);
    return project?.favourite ?? false;
  }

  SelectAll(event: any) {
    if (event.target.checked) {
      this.checkedKeys = this.getAllNodeKeys(this.treeData);
    } else {
      this.checkedKeys = [];
    }

    this.onTreeViewCheckboxChange(this.checkedKeys);
  }

  // Removes last selected value for a given key
  removeLastAddedFilter(property: string) {
    const values = this.advanceSelectedValues[property];
    if (values?.length) 
    {
      values.pop();
      this.advanceSelectedValues[property] = [...values];
      this.applyFilter();
    }
  }

  clearAllFilters() {
    for (let key in this.advanceSelectedValues) {
      // Do not clear Active and Planned Project Types as its a must checked item always
      if (key === 'Project_Type') {
        this.advanceSelectedValues[key] = ["Active", "Planned"];
      }
      else {
        this.advanceSelectedValues[key] = [];
      }
    }

    this.applyFilter();
  }

  toggleMultiSelectDropdown(propertyName: string, index: number) {
    console.log("CLICKED");
  const multiSelectArray = this.multiSelect.toArray();
  const multiSelect = multiSelectArray[index];

  if (!multiSelect) {
    console.warn(`No MultiSelect found at index ${index}`);
    return;
  }
  
  // Toggle open / close
  const isOpen = this.multiselectStates[propertyName];
  if (isOpen) {
    multiSelect.toggle(false);
  } else {
    multiSelect.toggle(true);
  }
  this.multiselectStates[propertyName] = !isOpen;
}

  getAllNodeKeys(nodes: ContractTreeItem[]): string[] {
    const keys: string[] = [];

    const traverse = (items: ContractTreeItem[]) => {
      for (const item of items) {
        keys.push(item.id); // assuming `id` is the unique identifier
        if (item.items?.length) {
          traverse(item.items);
        }
      }
    };

    traverse(nodes);
    return keys;
  }

  PassSelectedContracts()
  {
    console.log(this.selectedContracts);
      this.projectService.updateSelectedContracts([...this.selectedContracts]);
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
        this.saveCurrentAdvanceFilter();
      }
      else if(item === 'Export Contracts')
      {
        this.handleExportContracts();
      }
      else if (item.startsWith('Saved Filter')) {
        this.loadAdvanceFilter(item);
      }

      else if (item == 'Instructions to Use') {
        this.helpInfoVisible = true;
      }
    }

  saveCurrentAdvanceFilter() {
    const currentValues = JSON.stringify(this.advanceSelectedValues);

    // Check if already saved
    const isDuplicate = this.savedFilters.some(f =>
      JSON.stringify(f.values) === currentValues
    );

    if (isDuplicate) {
       alert("Same filter already saved once. Modify the filter and try again !!!");
      return;
    }

    // Save new filter
    this.savedFilterCount++;
    const key = `Saved Filter ${this.savedFilterCount}`;
    this.savedFilters.push({
      key,
      values: JSON.parse(currentValues)
    });

    console.log(`Saved new filter: ${key}`);
    this.updateLoadFilterMenu();
  }

  loadAdvanceFilter(key: string) {
  const found = this.savedFilters.find(f => f.key === key);
  if (!found) return;

  this.advanceSelectedValues = JSON.parse(JSON.stringify(found.values));
  console.log(`Loaded filter: ${key}`, this.advanceSelectedValues);

  this.applyFilter();  // reapply
}

updateLoadFilterMenu() {
  const popupItemsTemp = [
    { icon: 'grid_on', label: 'Export Contracts' },
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

LoadExportColumns() : void
{
  this.projectService.getContractExportColumns().subscribe(response => this.exportColumns = response.columnNames);
  this.projectService.getContractExportDetail().subscribe(response => this.exportData = response);
}

handleExportContracts() {
  if (!this.checkedKeys.length) {
    alert("No valid data available to export. Please select at least one contract.");
    return;
  }
  
  this.excelExport.save();
}
  // For Help info
    onHelpInfoDialogClose() {
    this.helpInfoVisible = false;
  }
}
