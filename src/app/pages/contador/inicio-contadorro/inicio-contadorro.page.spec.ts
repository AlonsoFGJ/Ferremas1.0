import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioContadorroPage } from './inicio-contadorro.page';

describe('InicioContadorroPage', () => {
  let component: InicioContadorroPage;
  let fixture: ComponentFixture<InicioContadorroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioContadorroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
