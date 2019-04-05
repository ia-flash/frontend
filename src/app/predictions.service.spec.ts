import { TestBed } from '@angular/core/testing';

import { PredictionsService } from './predictions.service';

describe('PredictionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PredictionsService = TestBed.get(PredictionsService);
    expect(service).toBeTruthy();
  });
});
