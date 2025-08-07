import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiPageComponent } from './api-page.component';

describe('ApiPageComponent', () => {
  let component: ApiPageComponent;
  let fixture: ComponentFixture<ApiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
