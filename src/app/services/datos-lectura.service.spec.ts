import { TestBed } from '@angular/core/testing';
import { DataoLecturaService } from './datos-lectura.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

describe('DataoLecturaService', () => {
  let service: DataoLecturaService;
  const firestoreMock = {
    collection: jasmine.createSpy('collection').and.returnValue({
      doc: jasmine.createSpy('doc').and.returnValue({
        valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of({}))
      })
    })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: firestoreMock }
      ]
    });
    service = TestBed.inject(DataoLecturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getProducto', () => {
    const testId = '1B4XOnZYDKmFOGJrVRtA';
    service.getProducto(testId);
    expect(firestoreMock.collection).toHaveBeenCalledWith('productos');
  });
});