import { 
  NativeTumblrPost, 
  TumblrPost,
  TumblrAPIResponse,
  APISnifferPostsExtractor,
  APISnifferPostsExtractorStatics
} from '~/types';
import logger from '~/logger/index';
import isObj from '~/utils/isObj';

const PostsExtractor: APISnifferPostsExtractorStatics = class Extractor implements APISnifferPostsExtractor {
    constructor(private blogname: string) {} 

    private filterPosts = (posts: Array<NativeTumblrPost>): Array<TumblrPost>  => {
      const filterPredicate = (post: NativeTumblrPost) => {
        if (!(isObj(post) && Array.isArray(post.trail) && !!post.postUrl)) { /* sanity */
          return false;
        }
        if (!post.trail.length) return true;
        
        const trail = post.trail;
        const trailBlogname =
          isObj(trail[0]) && 
          trail[0].blog && 
          isObj(trail[0].blog) && 
          trail[0].blog.name;

        return trailBlogname === this.blogname;
      }

      const mapper = (post: NativeTumblrPost): TumblrPost => ({
        id: post.id,
        url: post.postUrl
      });

      return posts
        .filter(filterPredicate)
        .map(mapper);
    }

    public extract = async (fetchResponse: Response) => {
      let responseObject: TumblrAPIResponse;
      try {
        const responseClone = fetchResponse.clone();
        responseObject = await responseClone.json();
      } catch (err) {
        logger.warn(`Error converting api response ${(err as Error).message}`);
        return [];
      }

      if (!(
        isObj(responseObject) && 
        isObj(responseObject.response) && 
        responseObject.response && 
        Array.isArray(responseObject.response.posts)
      )) {
        return [];
      }

      const filteredPosts = this.filterPosts(responseObject.response.posts);

      return filteredPosts;
    }
  }

export default PostsExtractor;