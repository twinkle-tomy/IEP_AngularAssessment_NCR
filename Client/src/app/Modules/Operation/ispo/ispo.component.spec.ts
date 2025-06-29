import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IspoComponent } from './ispo.component';

describe('IspoComponent', () => {
  let component: IspoComponent;
  let fixture: ComponentFixture<IspoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IspoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IspoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
