import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Upsert } from './upsert';

describe('Upsert', () => {
  let component: Upsert;
  let fixture: ComponentFixture<Upsert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Upsert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Upsert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
