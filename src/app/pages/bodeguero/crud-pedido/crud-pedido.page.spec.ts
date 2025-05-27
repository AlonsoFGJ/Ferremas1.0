import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudPedidoPage } from './crud-pedido.page';

describe('CrudPedidoPage', () => {
  let component: CrudPedidoPage;
  let fixture: ComponentFixture<CrudPedidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
