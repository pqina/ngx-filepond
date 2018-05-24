import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePondComponent } from './filepond.component';

describe('FilepondComponent', () => {
  let component: FilePondComponent;
  let fixture: ComponentFixture<FilePondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilePondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
