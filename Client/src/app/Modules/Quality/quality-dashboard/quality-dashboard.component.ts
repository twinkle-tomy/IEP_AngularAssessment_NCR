import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { NcrComponent } from "../ncr/ncr.component";

@Component({
  selector: 'app-quality-dashboard',
  standalone: true,
  imports: [CommonModule, TabStripModule, NcrComponent],
  templateUrl: './quality-dashboard.component.html',
  styleUrl: './quality-dashboard.component.scss'
})
export class QualityDashboardComponent {

    todayDate: Date = new Date();
    percentage : any = 71;

}
