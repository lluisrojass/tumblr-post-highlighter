import { 
  Observable 
} from 'rxjs';
import {
  APISnifferRequestAnalyzerStatics,
  APISnifferPostsExtractorStatics,
  APISnifferHijacker,
  APISnifferHijackerStatics,
  TumblrPost
} from '~/types';

const FetchHijacker: APISnifferHijackerStatics = class Hijacker implements APISnifferHijacker {
    constructor(
      private RequestAnalyzer: APISnifferRequestAnalyzerStatics,
      private PostsExtractor: APISnifferPostsExtractorStatics
    ) {}
  
    public hijack = (blogname: string) => {
      const {
        RequestAnalyzer,
        PostsExtractor
      } = this;
  
      return new Observable<Array<TumblrPost>>((subscriber) => {
        const originalFetch = window.fetch;
  
        const fetch = async (info: RequestInfo | URL, init?: RequestInit) => {
          const requestAnalyzer = new RequestAnalyzer(blogname);
          if (!requestAnalyzer.isAPICall(info, init)) {
            console.log('outcome of isAPICall was false!', info);
            return originalFetch(info, init);
          }
    
          console.log('outcome of isAPICall was true', info);
          const response = await originalFetch(info, init); 
          if (response.ok) {
            const postsExtractor = new PostsExtractor(blogname);
            /* we don't desire to holdup the resolution of */
            /* the api response */
            postsExtractor
              .extract(response)
              .then((posts: Array<TumblrPost>) => {
                console.log('hello! submitting posts: ', JSON.stringify(posts, null, 3));
                if (!posts.length) return;
                subscriber.next(posts);
              });
          }
    
          return response;
        };
        
        window.fetch = fetch;
      });
    }
  }


export default FetchHijacker;