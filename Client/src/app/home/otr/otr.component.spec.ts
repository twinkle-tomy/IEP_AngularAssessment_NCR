import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTRComponent } from './otr.component';

describe('OTRComponent', () => {
  let component: OTRComponent;
  let fixture: ComponentFixture<OTRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OTRComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OTRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
