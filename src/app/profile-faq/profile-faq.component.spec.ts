import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFaqComponent } from './profile-faq.component';

describe('ProfileFaqComponent', () => {
  let component: ProfileFaqComponent;
  let fixture: ComponentFixture<ProfileFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFaqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
