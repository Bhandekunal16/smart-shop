import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformPasswordComponent } from './conform-password.component';

describe('ConformPasswordComponent', () => {
  let component: ConformPasswordComponent;
  let fixture: ComponentFixture<ConformPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConformPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConformPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
