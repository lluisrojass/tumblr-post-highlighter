import { 
  MaybeTumblrPost,
  TumblrPost 
} from '~/types';

export default (posts: Array<MaybeTumblrPost>): Array<TumblrPost> => (
  posts
    .filter((post: MaybeTumblrPost) => (
      !!post.id && !!post.url
    ))
    .map((post) => ({
      id: post.id,
      url: post.url
    } as TumblrPost))
)