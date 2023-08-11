import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectedCandidatesComponent } from './elected-candidates.component';

describe('ElectedCandidatesComponent', () => {
  let component: ElectedCandidatesComponent;
  let fixture: ComponentFixture<ElectedCandidatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectedCandidatesComponent]
    });
    fixture = TestBed.createComponent(ElectedCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
