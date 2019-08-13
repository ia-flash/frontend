import { ImageDecodePipe } from './image-decode.pipe';

describe('ImageDecodePipe', () => {
  it('create an instance', () => {
    const pipe = new ImageDecodePipe();
    expect(pipe).toBeTruthy();
  });
});
