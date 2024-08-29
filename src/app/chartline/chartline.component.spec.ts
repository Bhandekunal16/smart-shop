import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartlineComponent } from './chartline.component';

describe('ChartlineComponent', () => {
  let component: ChartlineComponent;
  let fixture: ComponentFixture<ChartlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartlineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
