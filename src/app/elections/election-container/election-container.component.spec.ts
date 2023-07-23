import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionContainerComponent } from './election-container.component';

describe('ElectionContainerComponent', () => {
  let component: ElectionContainerComponent;
  let fixture: ComponentFixture<ElectionContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectionContainerComponent]
    });
    fixture = TestBed.createComponent(ElectionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
