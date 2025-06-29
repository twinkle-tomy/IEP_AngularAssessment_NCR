import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabularComponent } from './custom-tabular.component';

describe('CustomTabularComponent', () => {
  let component: CustomTabularComponent;
  let fixture: ComponentFixture<CustomTabularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTabularComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomTabularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
