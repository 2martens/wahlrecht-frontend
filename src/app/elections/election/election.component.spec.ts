import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionComponent } from './election.component';
import {ElectionResultComponent} from "../election-result/election-result.component";
import {MatTabsModule} from "@angular/material/tabs";
import {SeatAllocationComponent} from "../seat-allocation/seat-allocation.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";

describe('ElectionComponent', () => {
  let component: ElectionComponent;
  let fixture: ComponentFixture<ElectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectionComponent, ElectionResultComponent, SeatAllocationComponent],
      imports: [MatTabsModule, ReactiveFormsModule, NoopAnimationsModule, MatTableModule, MatSortModule]
    });
    fixture = TestBed.createComponent(ElectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
