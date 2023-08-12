import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectedCandidatesComponent } from './elected-candidates.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('ElectedCandidatesComponent', () => {
  let component: ElectedCandidatesComponent;
  let fixture: ComponentFixture<ElectedCandidatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectedCandidatesComponent],
      imports: [
        MatTableModule, MatSortModule, NoopAnimationsModule
      ]
    });
    fixture = TestBed.createComponent(ElectedCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
