import { 
  Observable 
} from 'rxjs';
import APISnifferScript from 'APISniffer';
import {
  MessageTypes,
  MaybeTumblrPost,
  PostsEvent,
  PostsMessageContainer,
  APISnifferUpdateEvent,
  APISnifferUpdateMessageContainer,
  CSAPISnifferService,
} from '~/types';
import config from '~/config/index';
import APISnifferPosts from '~/scripts/content/messages/APISnifferPosts';
import APISnifferUpdate from '~/scripts/content/messages/APISnifferUpdate';

export default class APISnifferService implements CSAPISnifferService {
  public listenForPosts = () => {
    return new Observable<PostsMessageContainer>((subscriber) => {
      document.addEventListener(MessageTypes.NEW_POSTS, ((event: PostsEvent<Array<MaybeTumblrPost>>) => {
        if (!APISnifferPosts.isTrustworthy(event)) return;

        const messageContainer = new APISnifferPosts(event);
        subscriber.next(messageContainer);

        /* ts currently can't handle CustomEvents w/o force assertion */
        /* https://github.com/Microsoft/TypeScript/issues/28357 */
      }) as EventListener); 
    });
  }

  public listenForUpdates = () => {
    return new Observable<APISnifferUpdateMessageContainer>((subscriber) => {
      document.addEventListener(MessageTypes.API_SNIFFER_UPDATE, ((event: APISnifferUpdateEvent) => {
        if (!APISnifferUpdate.isTrustworthy(event)) return;
        
        const messageContainer = new APISnifferUpdate(event);
        subscriber.next(messageContainer);
  
        /* ts currently can't handle CustomEvents w/o force assertion */
        /* https://github.com/Microsoft/TypeScript/issues/28357 */
      }) as EventListener); 
    });
  }

  public injectAPISniffer = (): void => {
    const head = document.head || document.querySelector('head');
    const script = document.createElement('script');
    const textNode = document.createTextNode(APISnifferScript);
    
    script.appendChild(textNode);
    script.setAttribute('version', config.version);
    script.setAttribute('name', config.name);

    head.prepend(script);
  }
}
