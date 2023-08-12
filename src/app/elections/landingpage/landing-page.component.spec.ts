import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LandingPageComponent} from './landing-page.component';
import {provideMockStore} from "@ngrx/store/testing";
import {ElectionsState} from "../store";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

describe('LandingPage', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
      imports: [MatProgressSpinnerModule],
      providers: [
        provideMockStore<ElectionsState>()
      ]
    });
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
