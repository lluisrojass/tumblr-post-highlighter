import { 
  PageStatus, 
  TumblrPost
} from '~/types';
import CSModel from '~/scripts/content/CSModel';

describe('CSModel', () => {
  let blogname: string;
  let model: CSModel;

  /* general setup */
  beforeEach(() => {
    blogname = 'test-blogname';
    model = new CSModel();
  });

  describe('setStatus() and getStatus()', () => {
    it('should update model', () => {
      const status = model.getStatus();
      expect(status).toBe(PageStatus.LOADING);
      
      model.setStatus(PageStatus.OK);
    
      const newStatus = model.getStatus(); 
      expect(newStatus).toBe(PageStatus.OK);
    });
  });

  describe('setBlogname() and getBlogname()', () => {
    it('should update model', () => {
      const blogname = model.getBlogname();
      
      expect(blogname).toBe('');
    
      const fakeBlogname = 'test-blogname';
      model.setBlogname(fakeBlogname);
      
      const newBlogname = model.getBlogname();
      expect(newBlogname).toBe(fakeBlogname);
    });
  });

  describe('addPosts() and getPosts()', () => {
    it('should update model', () => {
      const posts = model.getPosts();
      expect(posts).toHaveLength(0);
      const incomingPosts: Array<TumblrPost> = [
        {
          id: 'id-1',
          url: `https://${blogname}.tumblr.com/post/123-1`
        },
        {
          id: 'id-2',
          url: `https://${blogname}.tumblr.com/post/123-2`
        },
        {
          id: 'id-3',
          url: `https://${blogname}.tumblr.com/post/123-3`
        },
      ];
      
      model.addPosts(incomingPosts);
    
      const newPosts = model.getPosts();
      expect(model.getPosts()).toHaveLength(incomingPosts.length);
      const evenMoreIncomingPosts = [
        {
          id: 'id-4',
          slug: 'slug-4',
          url: `https://${blogname}.tumblr.com/post/123-4`
        },
        {
          id: 'id-5',
          slug: 'slug-5',
          url: `https://${blogname}.tumblr.com/post/123-5`
        },
      ];

      model.addPosts(evenMoreIncomingPosts);
      expect(model.getPosts()).toHaveLength(newPosts.length + evenMoreIncomingPosts.length);
    });
  });

  describe('setExcluded() and getExcluded()', () => {
    it('should update model', () => {
      const excluded = model.getExcluded();

      expect(excluded).toBe(false);
      
      model.setExcluded(true);
      const newExcluded = model.getExcluded();
      
      expect(newExcluded).toBe(true);
    });
  });
});