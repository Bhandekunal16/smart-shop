import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptComponent } from './recipt.component';

describe('ReciptComponent', () => {
  let component: ReceptComponent;
  let fixture: ComponentFixture<ReceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
