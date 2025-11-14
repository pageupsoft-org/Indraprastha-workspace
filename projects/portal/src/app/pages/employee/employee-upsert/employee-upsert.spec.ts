import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeUpsert } from './employee-upsert';

describe('EmployeeUpsert', () => {
  let component: EmployeeUpsert;
  let fixture: ComponentFixture<EmployeeUpsert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeUpsert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeUpsert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
