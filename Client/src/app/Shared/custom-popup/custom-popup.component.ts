import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Align, PopupModule } from '@progress/kendo-angular-popup';
import { PopupItem } from '../../Services/AdvanceFilter';

@Component({
  selector: 'app-custom-popup',
  standalone: true,
  imports: [PopupModule, CommonModule],
  templateUrl: './custom-popup.component.html',
  styleUrl: './custom-popup.component.scss'
})

export class CustomPopupComponent {
  
  @Input() items: PopupItem[] = [];
  @Output() itemSelected = new EventEmitter<string>();
  @Input() popupAnchor!: HTMLElement;
  @Output() closed = new EventEmitter<void>();
  @Input() popupAlign:Align = { horizontal: 'left', vertical: 'top' }; 
  @Input() popupClass = 'popup-wrapper';
  @Input() uploadedInfo: { name: string, date: string }[] = [];

  public show = false;

   constructor(private elementRef: ElementRef) {}

  togglePopup() {
    this.show = !this.show;
  }

  onItemClick(item: { icon: string; label: string }) {
    this.itemSelected.emit(item.label);
        this.show = false;
  }

  closePopup(): void {
    this.show = false;
    this.closed.emit();
  }

@HostListener('document:click', ['$event'])
handleOutsideClick(event: MouseEvent) {
  const clickedInside = this.elementRef.nativeElement.contains(event.target);
  const clickedAnchor = this.popupAnchor?.contains(event.target as Node);
  
  if (this.show && !clickedInside && !clickedAnchor) {
    this.closePopup();
  }
}

}
