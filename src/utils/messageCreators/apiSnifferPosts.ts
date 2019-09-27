import {
  MessageTypes,
  TumblrPost,
  PostsEvent
} from '~/types';

export default (posts: Array<TumblrPost>): PostsEvent<Array<TumblrPost>> => (
  new CustomEvent<{ posts: Array<TumblrPost> }>(MessageTypes.NEW_POSTS, {
    detail: {
      posts
    }
  })
);