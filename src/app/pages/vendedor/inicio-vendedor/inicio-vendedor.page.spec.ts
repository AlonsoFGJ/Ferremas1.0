import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioVendedorPage } from './inicio-vendedor.page';

describe('InicioVendedorPage', () => {
  let component: InicioVendedorPage;
  let fixture: ComponentFixture<InicioVendedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioVendedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
