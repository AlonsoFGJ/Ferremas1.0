import { TestBed } from '@angular/core/testing';

import { ApiusuarioService } from './apiusuario.service';

describe('ApiusuarioService', () => {
  let service: ApiusuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiusuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
