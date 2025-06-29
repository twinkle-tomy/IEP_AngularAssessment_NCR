import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContractsComponent } from './project-contracts.component';

describe('ProjectContractsComponent', () => {
  let component: ProjectContractsComponent;
  let fixture: ComponentFixture<ProjectContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectContractsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
