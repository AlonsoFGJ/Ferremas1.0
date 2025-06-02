import { TestBed } from '@angular/core/testing';

import { ApipedidoService } from './apipedido.service';

describe('ApipedidoService', () => {
  let service: ApipedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApipedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
