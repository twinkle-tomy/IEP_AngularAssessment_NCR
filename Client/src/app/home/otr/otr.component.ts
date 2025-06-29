import { Component } from '@angular/core';
import { HeaderComponent } from "../../Shared/header/header.component";
import { LeftSidePanelComponent } from "../../Shared/left-side-panel/left-side-panel.component";
import { ProjectContractsComponent } from "../../Shared/project-contracts/project-contracts.component";
import { CommonModule } from '@angular/common';
import { ItemToggleService } from '../../Services/item-toggle.service';
import { QualityDashboardComponent } from '../../Modules/Quality/quality-dashboard/quality-dashboard.component';

@Component({
  selector: 'app-otr',
  standalone: true,
  imports: [HeaderComponent, LeftSidePanelComponent,
     ProjectContractsComponent, CommonModule, QualityDashboardComponent],
  templateUrl: './otr.component.html',
  styleUrl: './otr.component.scss'
})
export class OTRComponent {

    title="OTR";
    isContractTreeVisible = false;

    constructor(private toggleService : ItemToggleService)
    {
        
    }

  ngOnInit()
  {
    this.toggleService.projectTreeVisibility$.subscribe(value => {
      this.isContractTreeVisible = value;
    });
  }
}
