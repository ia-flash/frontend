import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SivnormComponent } from './sivnorm.component';

describe('SivnormComponent', () => {
  let component: SivnormComponent;
  let fixture: ComponentFixture<SivnormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SivnormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SivnormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
