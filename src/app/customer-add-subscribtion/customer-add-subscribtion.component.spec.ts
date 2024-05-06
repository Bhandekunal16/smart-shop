import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddSubscriptionComponent } from './customer-add-subscribtion.component';

describe('CustomerAddSubscribtionComponent', () => {
  let component: CustomerAddSubscriptionComponent;
  let fixture: ComponentFixture<CustomerAddSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAddSubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerAddSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
