import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelLikeFilterPopupComponent } from './excel-like-filter-popup.component';

describe('ExcelLikeFilterPopupComponent', () => {
  let component: ExcelLikeFilterPopupComponent;
  let fixture: ComponentFixture<ExcelLikeFilterPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelLikeFilterPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExcelLikeFilterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
