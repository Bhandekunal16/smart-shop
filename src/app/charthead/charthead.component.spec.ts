import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartheadComponent } from './charthead.component';

describe('ChartheadComponent', () => {
  let component: ChartheadComponent;
  let fixture: ComponentFixture<ChartheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartheadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
