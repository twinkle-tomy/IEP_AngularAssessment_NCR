import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemToggleService {

  private contractVisibility = new BehaviorSubject<boolean>(true);
  projectTreeVisibility$ = this.contractVisibility.asObservable();

  constructor() 
  { }

    toggleProjectTreeVisibility() {
    const current = this.contractVisibility.value;
    this.contractVisibility.next(!current);
  }

  setVisibility(value: boolean) {
    this.contractVisibility.next(value);
  }
}
