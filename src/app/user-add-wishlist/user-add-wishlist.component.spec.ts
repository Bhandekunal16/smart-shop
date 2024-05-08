import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddWishlistComponent } from './user-add-wishlist.component';

describe('UserAddWishlistComponent', () => {
  let component: UserAddWishlistComponent;
  let fixture: ComponentFixture<UserAddWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddWishlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAddWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
