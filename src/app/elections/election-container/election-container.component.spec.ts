import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionContainerComponent } from './election-container.component';
import {RouterTestingModule} from "@angular/router/testing";
import {provideMockStore} from "@ngrx/store/testing";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

describe('ElectionContainerComponent', () => {
  let component: ElectionContainerComponent;
  let fixture: ComponentFixture<ElectionContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectionContainerComponent],
      imports: [RouterTestingModule, MatProgressSpinnerModule],
      providers: [
        provideMockStore()
      ]
    });
    fixture = TestBed.createComponent(ElectionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
