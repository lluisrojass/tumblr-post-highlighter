import sinon, { 
  SinonSpy 
} from 'sinon';
import { 
  TumblrPost,
  APISnifferUpdate,
  PageStatus 
} from '~/types';
import APISnifferContentScriptService from '~/scripts/content/scripts/APISniffer/services/APISnifferContentScriptService';

describe('APISnifferContentScriptService', () => {
  let contentScriptService: APISnifferContentScriptService;
  let dispatchEventSpy: SinonSpy;

  /* general setup */
  beforeEach(() => {
    contentScriptService = new APISnifferContentScriptService();
    dispatchEventSpy = sinon.stub(document, 'dispatchEvent');
  });

  /* general teardown */
  afterEach(() => {
    dispatchEventSpy.restore();
  });
  
  describe('sendPosts()', () => {
    it('should send posts', () => {
      const fakePosts: Array<TumblrPost> = [
        {
          id: 'id-1',
          url: 'https://test-blogname.tumblr.com/post/123-1'
        },
        {
          id: 'id-2',
          url: 'https://test-blogname.tumblr.com/post/123-2'
        }
      ];
      
      contentScriptService.sendPosts(fakePosts);

      expect(dispatchEventSpy.calledOnce).toBeTruthy();
    });
  });

  describe('sendUpdate()', () => {
    it('should send an updates', () => {
      const update: APISnifferUpdate = {
        status: PageStatus.OK,
        blogname: 'test-123'
      };
      
      contentScriptService.sendUpdate(update);

      expect(dispatchEventSpy.calledOnce).toBeTruthy();
    });
  })
});