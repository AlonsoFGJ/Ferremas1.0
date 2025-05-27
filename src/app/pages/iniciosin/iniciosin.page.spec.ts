import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IniciosinPage } from './iniciosin.page';

describe('IniciosinPage', () => {
  let component: IniciosinPage;
  let fixture: ComponentFixture<IniciosinPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IniciosinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
