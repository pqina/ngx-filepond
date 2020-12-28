import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FilePondModule } from './modules/filepond/public_api';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({ 
      imports: [FilePondModule],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
