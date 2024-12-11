import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrarConfirmacionComponent } from './borrar-confirmacion.component';

describe('BorrarConfirmacionComponent', () => {
  let component: BorrarConfirmacionComponent;
  let fixture: ComponentFixture<BorrarConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrarConfirmacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrarConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
