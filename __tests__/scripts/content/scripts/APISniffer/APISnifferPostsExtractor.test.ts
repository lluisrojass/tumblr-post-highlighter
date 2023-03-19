import {
  APISnifferPostsExtractor
} from '~/types';
import PostsExtractor from '~/scripts/content/scripts/APISniffer/APISnifferPostsExtractor';

describe('PostsExtractor', () => {
  let blogname: string;
  let postsExtractor: APISnifferPostsExtractor;

  /* general setup */
  beforeEach(() => {
    blogname = 'test-blogname';
    postsExtractor = new PostsExtractor(blogname);
  });
  
  describe('extract()', () => {
    it('should identify personal posts from missing trail', async () => {
      const apiPosts = [
        {
          id: 'id-1',
          postUrl: `https://${blogname}.tumblr.com/posts/123-1`,
          trail: []
        },
        {
          id: 'id-2',
          postUrl: `https://${blogname}.tumblr.com/posts/123-2`,
          trail: [{ blog: {} }]
        },
        {
          id: 'id-3',
          postUrl: `https://${blogname}.tumblr.com/posts/123-3`,
          trail: []
        },
        {
          id: 'id-4',
          postUrl: `https://${blogname}.tumblr.com/posts/123-4`,
          trail: []
        }
      ]

      const fetchResponseBody = {
        clone: () => ({
          json: async () => ({
            response: {
              posts: apiPosts
            }
          })
        })
      };
      const posts = await postsExtractor.extract(fetchResponseBody as any);
      const expectedPosts = [
        {
          id: 'id-1',
          url: `https://${blogname}.tumblr.com/posts/123-1`,
        },
        {
          id:'id-3',
          url: `https://${blogname}.tumblr.com/posts/123-3`,
        },
        {
          id:'id-4',
          url: `https://${blogname}.tumblr.com/posts/123-4`,
        }
      ];

      expect(posts).toStrictEqual(expectedPosts);
    });

    it('should identify reblogged personal posts', async () => {
      const apiPosts = [
        {
          id: 'id-1',
          postUrl: `https://${blogname}.tumblr.com/posts/123-1`,
          trail: [
            {
              blog: {
                name: 'bad-blogname'
              }
            }
          ]
        },
        {
          id: 'id-2',
          postUrl: `https://${blogname}.tumblr.com/posts/123-2`,
          trail: [{ blog: {} }]
        },
        {
          id: 'id-3',
          postUrl: `https://${blogname}.tumblr.com/posts/123-3`,
          trail: [
            {
              blog: {
                name: blogname
              }
            }
          ]
        },
        {
          id: 'id-4',
          postUrl: `https://${blogname}.tumblr.com/posts/123-4`,
          trail: [
            {
              blog: {
                name: blogname
              }
            }
          ]
        }
      ];

      const fetchResponseBody = {
        clone: () => ({
          json: async () => ({
            response: {
              posts: apiPosts
            }
          })
        })
      };
      const posts = await postsExtractor.extract(fetchResponseBody as any);
      const expectedPosts = [
        {
          id: 'id-3',
          url: `https://${blogname}.tumblr.com/posts/123-3`,
        },
        {
          id:'id-4',
          url: `https://${blogname}.tumblr.com/posts/123-4`,
        }
      ];
      
      expect(posts).toStrictEqual(expectedPosts);
    });

    it('should handle a Response object without Response mixins', async () => {
      const fetchResponseBody = {
        clone: () => ({})
      };
      const posts = await postsExtractor.extract(fetchResponseBody as any);
      expect(posts).toHaveLength(0);
    });

    it('should handle an unexpected api response and gracefully report no posts', async () => {
      const fetchResponseBody = {
        clone: () => ({
          json: async () => ({
            response: {
              posts: {
                bad: 'property'
              }
            }
          }) 
        })
      };

      const posts = await postsExtractor.extract(fetchResponseBody as any);
      expect(posts).toHaveLength(0);
    });
  });

});