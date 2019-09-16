import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FilePondComponent } from './modules/filepond/filepond.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({ 
      declarations: [
        AppComponent,
        FilePondComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
