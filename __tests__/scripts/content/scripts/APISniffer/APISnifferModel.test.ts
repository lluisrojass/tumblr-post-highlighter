import {
  APISnifferModel,
  PageStatus 
} from '~/types';
import Model from '~/scripts/content/scripts/APISniffer/APISnifferModel';

describe('APISnifferModel', () => {
  let model: APISnifferModel;
  
  /* general setup */
  beforeEach(() => {
    model = new Model();
  });

  describe('setBlogname() and getBlogname()', () => {
    it('should update state', () => {
      const blogname = model.getBlogname();
      expect(blogname).toBe('');
  
      const newBlogname = 'test-blogname';
      model.setBlogname(newBlogname);
      const newFoundBlogname = model.getBlogname();
  
      expect(newFoundBlogname).toBe(newBlogname);
    });
  });

  describe('setStatus() and getStatus()', () => {
    it('should update state', () => {
      const status = model.getStatus();
      expect(status).toBe(PageStatus.LOADING);

      model.setStatus(PageStatus.OK);
      const newFoundStatus = model.getStatus();

      expect(newFoundStatus).toBe(PageStatus.OK);
    })
  });
})