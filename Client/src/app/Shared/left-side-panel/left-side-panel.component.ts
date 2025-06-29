import { Component } from '@angular/core';
import { ItemToggleService } from '../../Services/item-toggle.service';

@Component({
  selector: 'app-left-side-panel',
  standalone: true,
  imports: [],
  templateUrl: './left-side-panel.component.html',
  styleUrl: './left-side-panel.component.scss'
})
export class LeftSidePanelComponent {

    constructor(private toggleService : ItemToggleService)
    {
  
    }

  toggleComponent() {
    this.toggleService.toggleProjectTreeVisibility();
  }

}
