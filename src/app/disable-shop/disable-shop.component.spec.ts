import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableShopComponent } from './disable-shop.component';

describe('DisableShopComponent', () => {
  let component: DisableShopComponent;
  let fixture: ComponentFixture<DisableShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisableShopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisableShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
