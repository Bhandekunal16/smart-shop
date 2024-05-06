import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerViewSubscriptionComponent } from './customer-view-subscribtion.component';

describe('CustomerViewSubscribtionComponent', () => {
  let component: CustomerViewSubscriptionComponent;
  let fixture: ComponentFixture<CustomerViewSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerViewSubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerViewSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
