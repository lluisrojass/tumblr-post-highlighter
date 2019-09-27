import {
  MaybeTumblrPost,
  MessageContainerStatics,
  PostsMessageContainer,
  PostsEvent
} from '~/types';
import isObj from '~/utils/isObj';
import toSafePosts from '~/utils/toSafePosts';

const MessageContainer: MessageContainerStatics<
  PostsEvent<Array<MaybeTumblrPost>>, 
  PostsMessageContainer
> = class Container implements PostsMessageContainer {
  static isTrustworthy = (event: any) => (
    isObj(event) &&
    isObj(event.detail) &&
    Array.isArray(event.detail.posts) && 
    event.detail.posts.length
  );

  constructor(private event: PostsEvent<Array<MaybeTumblrPost>>) {}
  
  public getPosts = () => toSafePosts(this.event.detail.posts)
}

export default MessageContainer;