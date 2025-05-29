import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioBodegueroPage } from './inicio-bodeguero.page';

describe('InicioBodegueroPage', () => {
  let component: InicioBodegueroPage;
  let fixture: ComponentFixture<InicioBodegueroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioBodegueroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
