import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarCuentaPage } from './modificar-cuenta.page';

describe('ModificarCuentaPage', () => {
  let component: ModificarCuentaPage;
  let fixture: ComponentFixture<ModificarCuentaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
