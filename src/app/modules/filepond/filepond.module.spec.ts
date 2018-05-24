import { FilePondModule } from './filepond.module';

describe('FilePondModule', () => {
  let pondModule: FilePondModule;

  beforeEach(() => {
    pondModule = new FilePondModule();
  });

  it('should create an instance', () => {
    expect(pondModule).toBeTruthy();
  });
});
