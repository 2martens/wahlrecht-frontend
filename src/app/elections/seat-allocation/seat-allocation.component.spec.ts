import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatAllocationComponent } from './seat-allocation.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('SeatAllocationComponent', () => {
  let component: SeatAllocationComponent;
  let fixture: ComponentFixture<SeatAllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatAllocationComponent],
      imports: [MatTableModule, MatSortModule, NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(SeatAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
