import { TestBed } from '@angular/core/testing';

import { ProjectJobService } from './project-job.service';

describe('ProjectJobService', () => {
  let service: ProjectJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
