import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionResultComponent } from './election-result.component';
import {MatTabsModule} from "@angular/material/tabs";
import {SeatAllocationComponent} from "../seat-allocation/seat-allocation.component";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";

describe('ElectionResultComponent', () => {
  let component: ElectionResultComponent;
  let fixture: ComponentFixture<ElectionResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectionResultComponent, SeatAllocationComponent],
      imports: [MatTabsModule, NoopAnimationsModule, MatTableModule, MatSortModule]
    });
    fixture = TestBed.createComponent(ElectionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
