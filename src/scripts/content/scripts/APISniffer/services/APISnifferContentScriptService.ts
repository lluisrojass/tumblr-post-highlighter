import createAPISnifferPostsMsg from '~/utils/messageCreators/apiSnifferPosts';
import createAPISnifferUpdateMsg from '~/utils/messageCreators/apiSnifferUpdate';
import {
  TumblrPost,
  APISnifferContentScriptService,
  APISnifferUpdate
} from '~/types';

export default class ContentScriptService implements APISnifferContentScriptService {
  public sendPosts = (posts: Array<TumblrPost>): void => {
    const event = createAPISnifferPostsMsg(posts);
    document.dispatchEvent(event);
  }
  
  public sendUpdate = (update: APISnifferUpdate): void => {
    const event = createAPISnifferUpdateMsg(update);
    document.dispatchEvent(event);
  }
}
