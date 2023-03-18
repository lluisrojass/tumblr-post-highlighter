import sinon, { 
  SinonStub 
} from 'sinon';
import { 
  of 
} from 'rxjs';
import {
  APISnifferController,
  APISnifferModel,
  APISnifferContentScriptService,
  APISnifferHijacker,
  APISnifferSupportAnalyzer,
  PageStatus
} from '~/types';
import Controller from '~/scripts/content/scripts/APISniffer/APISnifferController';
import extractBlogname from '~/utils/extractBlogname';


jest.mock('~/utils/extractBlogname', () => sinon.stub());

describe('APISnifferController', () => {
  let blogname: string;
  let controller: APISnifferController;
  let model: APISnifferModel;
  let contentScriptService: APISnifferContentScriptService;
  let hijacker: APISnifferHijacker;
  let supportAnalyzer: APISnifferSupportAnalyzer;

  beforeEach(() => {
    blogname = 'test-blogname';
    model = {
      setStatus: sinon.stub(),
      setBlogname: sinon.stub(),
      getBlogname: sinon.stub(),
      getStatus: sinon.stub()
    };
    contentScriptService = {
      sendPosts: sinon.stub(),
      sendUpdate: sinon.stub()
    };
    hijacker = {
      hijack: sinon.stub()
    };
    supportAnalyzer = {
      isHealthyArchive: sinon.stub(),
      isWindowSupported: sinon.stub()
    };
    controller = new Controller(
      model,
      contentScriptService,
      hijacker,
      supportAnalyzer
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('obtainBlogName()', () => {
    it('should obtain blog name from document and update model', () => {
      (extractBlogname as SinonStub).returns('support');

      controller.obtainBlogName();
      
      expect((extractBlogname as SinonStub).calledOnce).toBeTruthy();
      expect((model.setBlogname as SinonStub).calledOnce).toBeTruthy();
    });

    it('should obtain blog name from window and update model', () => {
      (extractBlogname as SinonStub).returns('');

      controller.obtainBlogName();
      
      expect((extractBlogname as SinonStub).calledOnce).toBeTruthy();
      expect((model.setBlogname as SinonStub).calledOnce).toBeFalsy();
    });
  })
  
  describe('obtainPageStatus()', () => {
    let setStatusStub: SinonStub;
    let isWindowSupportedStub: SinonStub;
    let isHealthyArchiveStub: SinonStub;

    beforeEach(() => {
      setStatusStub = model.setStatus as SinonStub;
      isWindowSupportedStub = supportAnalyzer.isWindowSupported as SinonStub;
      isHealthyArchiveStub = supportAnalyzer.isHealthyArchive as SinonStub;
    });

    it('should update model status to "unsupported" when window not supported', async () => {
      isWindowSupportedStub.returns(false);
      isHealthyArchiveStub.returns(true);

      await controller.obtainPageStatus();

      expect(setStatusStub.calledOnce).toBeTruthy();
      expect(setStatusStub.args[0][0]).toBe(PageStatus.UNSUPPORTED);
    });

    it('should update model status to "not healthy" when window not healthy', async () => {
      isWindowSupportedStub.returns(true);
      isHealthyArchiveStub.returns(false);

      await controller.obtainPageStatus();
      
      expect(setStatusStub.calledOnce).toBeTruthy();
      expect(setStatusStub.args[0][0]).toBe(PageStatus.NOT_OK_ARCHIVE);
    });

    it('should update model to "ok" when both window is supported and healthy, and blogname is parsed', async () => {
      isWindowSupportedStub.returns(true);
      isHealthyArchiveStub.returns(true);

      (extractBlogname as SinonStub).returns(blogname);
      
      await controller.obtainPageStatus();
      
      expect(setStatusStub.calledOnce).toBeTruthy();
      expect(setStatusStub.args[0][0]).toBe(PageStatus.OK);
    });
  });

  describe('sendUpdateToContentScript()', () => {
    let getStatusStub: SinonStub;
    let getBlognameStub: SinonStub;
    let sendModelUpdateStub: SinonStub;
    
    beforeEach(() => {
      getStatusStub = model.getStatus as SinonStub;
      getBlognameStub = model.getBlogname as SinonStub;
      sendModelUpdateStub = contentScriptService.sendUpdate as SinonStub;
    });
    
    it('should send update', () => {
      getStatusStub.returns(PageStatus.UNSUPPORTED);
      getBlognameStub.returns(blogname);
      
      controller.sendUpdateToContentScript();
      
      expect(sendModelUpdateStub.calledOnce).toBeTruthy();
    });
  });
  
  describe('hijackAjaxRequests()', () => {
    let hijackStub: SinonStub;
    let getStatusStub: SinonStub;
    let getBlognameStub: SinonStub;
    let sendPostsStub: SinonStub;
    
    beforeEach(() => {
      hijackStub = hijacker.hijack as SinonStub;
      getStatusStub = model.getStatus as SinonStub;
      getBlognameStub = model.getBlogname as SinonStub;
      sendPostsStub = contentScriptService.sendPosts as SinonStub;
    });
    
    it('should not hijack when status "unsupported"', () => {
      getStatusStub.returns(PageStatus.UNSUPPORTED);
      controller.hijackAjaxRequests();
      hijackStub.returns(of());
      expect(hijackStub.called).toBeFalsy();
    });

    it('should not hijack when status "not healthy"', () => {
      getStatusStub.returns(PageStatus.NOT_OK_ARCHIVE);
      controller.hijackAjaxRequests();
      expect(hijackStub.called).toBeFalsy();
    });

    it('should hijack when status "ok"', () => {
      getStatusStub.returns(PageStatus.OK);
      getBlognameStub.returns(blogname);

      hijackStub.returns(of());
      controller.hijackAjaxRequests();
    });

    it('should send posts to content script', () => {
      getStatusStub.returns(PageStatus.OK);
      getBlognameStub.returns(blogname);

      const posts = [
        {
          id: 'id-1',
          url: `https://${blogname}.tumblr.com/post/123-1`
        },
        {
          id: 'id-2',
          url: `https://${blogname}.tumblr.com/post/123-2`
        }
      ];

      hijackStub.returns(of(posts));
      controller.hijackAjaxRequests();

      expect(hijackStub.calledOnce).toBeTruthy();
      expect(sendPostsStub.calledOnce).toBeTruthy();
      expect(sendPostsStub.args[0][0]).toBe(posts);
    })
  });
});