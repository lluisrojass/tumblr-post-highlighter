import sinon, { 
  SinonSpy, 
  SinonStub 
} from 'sinon';
import {
  APISnifferHijacker, 
  APISnifferRequestAnalyzerStatics,
  APISnifferRequestAnalyzer,
  APISnifferPostsExtractorStatics,
  APISnifferPostsExtractor
} from '~/types';
import config from '~/config/index';
import FetchHijacker from '~/scripts/content/scripts/APISniffer/APISnifferFetchHijacker';

describe('FetchHijacker', () => {
  const host = config.tumblr.api.host;
  const path = config.tumblr.api.path;
  const queryKey = config.tumblr.api.query.postsKey;
  const queryValue = config.tumblr.api.query.postsValue;
  
  let blogname: string;
  let hijacker: APISnifferHijacker;
  
  let RequestAnalyzerStaticsStub: APISnifferRequestAnalyzerStatics;
  let requestAnalyzerStub: APISnifferRequestAnalyzer;

  let PostsExtractorStaticsStub: APISnifferPostsExtractorStatics;
  let postsExtractorStub: APISnifferPostsExtractor;
  
  /* general setup */
  beforeEach(() => {
    blogname = 'test-blogname';
    requestAnalyzerStub = {
      isAPICall: sinon.stub()
    };
    RequestAnalyzerStaticsStub = class S {
      constructor() {
        return requestAnalyzerStub;
      }
    } as any;
    postsExtractorStub = {
      extract: sinon.stub()
    };
    PostsExtractorStaticsStub = class S {
      constructor() {
        return postsExtractorStub;
      }
    } as any;

    hijacker = new FetchHijacker(RequestAnalyzerStaticsStub, PostsExtractorStaticsStub);
  });

  describe('hijack()', () => {
    let spy: SinonSpy;
    let emptyPromise: Promise<void>;

    beforeEach(() => {
      spy = sinon.spy();
      emptyPromise = Promise.resolve();
    });

    it('should overwrite and dispatch incoming personal posts', async () => {
      const expectedPosts = [
        {
          id: 'id-1',
          url: `https://${blogname}.tumblr.com/post/123-1`
        },
        {
          id: 'id-3',
          url: `https://${blogname}.tumblr.com/post/123-3`
        },
        {
          id: 'id-4',
          url: `https://${blogname}.tumblr.com/post/123-4`
        }
      ];

      const extractorStub = postsExtractorStub.extract as SinonStub;
      extractorStub.resolves(expectedPosts);
      const isAPICallStub = requestAnalyzerStub.isAPICall as SinonStub;
      isAPICallStub.returns(true);
      const fetchStub = window.fetch as SinonStub;
      const apiResponse = { ok: true };
      fetchStub.resolves(apiResponse);
      hijacker.hijack(blogname).subscribe(spy);
      
      const info: RequestInfo = `https://${host}${path.replace('{{blog}}', blogname)}?${queryKey}=${queryValue},noise`;
      const receivedResponse = await window.fetch(info);
      
      /* posts are dispatched asynchronously */
      await emptyPromise;

      expect(receivedResponse).toBe(apiResponse);
      expect(fetchStub.calledOnce).toBeTruthy();
      expect(fetchStub.args[0][0]).toBe(info);
      expect(spy.calledOnce).toBeTruthy();
      expect(spy.args[0][0]).toStrictEqual(expectedPosts);
    });

    it('should ignore and pass through unrelated calls', async () => {
      const isAPICallStub = requestAnalyzerStub.isAPICall as SinonStub;
      isAPICallStub.returns(false);
      const unrelatedResponse = {};
      const fetchStub = window.fetch as SinonStub;
      fetchStub.resolves(unrelatedResponse);

      hijacker.hijack(blogname);

      const info = 'https://test-url.com/favorite-color?user=luis';

      const response = await window.fetch(info);
      await emptyPromise;

      expect(fetchStub.calledOnce).toBeTruthy();
      expect(response).toBe(unrelatedResponse);
    });

    it('should not suppress errors', async () => {
      const fetchStub = window.fetch as SinonStub;
      fetchStub.throws(new Error('unrelated error'));
      
      let caught: Error | undefined = undefined;
      try {
        hijacker.hijack(blogname);
        await fetch('https://test-url.com/favorite-food?user=luis');
      } catch (err) {
        caught = err as Error;
      }

      expect(fetchStub.calledOnce).toBeTruthy();
      expect(caught).toBeInstanceOf(Error);
    });
  });
});