import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarContrasennaPage } from './cambiar-contrasenna.page';

describe('CambiarContrasennaPage', () => {
  let component: CambiarContrasennaPage;
  let fixture: ComponentFixture<CambiarContrasennaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarContrasennaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
