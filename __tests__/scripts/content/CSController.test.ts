import sinon, { 
  SinonStub 
} from 'sinon';
import { 
  of 
} from 'rxjs';
import {
  CSController,
  CSView,
  CSModel,
  CSAPISnifferService,
  CSStorageService,
  CSPageActionService,
  TumblrPost,
  PageStatus 
} from '~/types';
import APISnifferPostsMessage from '~/scripts/content/messages/APISnifferPosts';
import APISnifferUpdateMessage from '~/scripts/content/messages/APISnifferUpdate';
import Controller from '~/scripts/content/CSController';
import createAPISnifferUpdateMsg from '~/utils/messageCreators/apiSnifferUpdate';
import createContentScriptUpdateMsg from '~/utils/messageCreators/contentScriptUpdate';
import createAPISnifferPostsMsg from '~/utils/messageCreators/apiSnifferPosts';
                    
jest.mock('APISniffer', () => '!0', { 
  virtual: true 
});

describe('CSController', () => {
  let blogname: string;
  let posts: Array<TumblrPost>;
  let model: CSModel;
  let apiSnifferService: CSAPISnifferService;
  let storageService: CSStorageService;
  let pageActionService: CSPageActionService;
  let view: CSView;
  let controller: CSController;

  /* general setup */
    beforeEach(() => {
    blogname = 'test-blogname';
    posts = [
      {
        id: 'id-1',
        url: `https://${blogname}.tumblr.com/post/123-1`
      },
      {
        id: 'id-2',
        url: `https://${blogname}.tumblr.com/post/123-2`
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
    model = {
      getStatus: sinon.stub(),
      setStatus: sinon.stub(),
      getExcluded: sinon.stub(),
      setExcluded: sinon.stub(),
      getBlogname: sinon.stub(),
      setBlogname: sinon.stub(),
      addPosts: sinon.stub(),
      getPosts: sinon.stub(),
    };
    apiSnifferService = {
      listenForPosts: sinon.stub(),
      listenForUpdates: sinon.stub(),
      injectAPISniffer: sinon.stub(),
    };
    storageService = {
      isBlogExcluded: sinon.stub(),
      excludeBlog: sinon.stub(),
      includeBlog: sinon.stub(),
    };
    pageActionService = {
      sendMessage: sinon.stub(),
      listenForPageActionIconClicks: sinon.stub(),
    };
    view = {
      highlightPosts: sinon.stub(),
      reset: sinon.stub(),
    };
    controller = new Controller(
      model,
      apiSnifferService,
      storageService,
      pageActionService,
      view
    );
  });

  /* general teardown */
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleIncomingPosts()', () => {
    let addPostsStub: SinonStub;
    let getPostsStub: SinonStub;
    let getStatusStub: SinonStub;
    let getExcludedStub: SinonStub;
    let highlightPostsStub: SinonStub;
    let listenForPostsStub: SinonStub;

    beforeEach(() => {
      getPostsStub = model.getPosts as SinonStub;
      addPostsStub = model.addPosts as SinonStub;
      getStatusStub = model.getStatus as SinonStub;
      getExcludedStub = model.getExcluded as SinonStub;
      highlightPostsStub = view.highlightPosts as SinonStub;
      listenForPostsStub = apiSnifferService.listenForPosts as SinonStub;
    });

    it('should update model with new posts', () => {
      const event = createAPISnifferPostsMsg(posts);
      const postsMessage = new APISnifferPostsMessage(event);
      postsMessage.getPosts();
      listenForPostsStub.returns(of(postsMessage));
      getPostsStub.returns([]);
      
      controller.handleIncomingPosts();

      expect(listenForPostsStub.calledOnce).toBeTruthy();
      expect(addPostsStub.calledOnce).toBeTruthy();
      expect(addPostsStub.args[0][0]).toStrictEqual(posts);
    });

    it('should highlight posts when model "ok" and not excluded', () => {
      const event = createAPISnifferPostsMsg(posts);
      const postsMessage = new APISnifferPostsMessage(event);
      listenForPostsStub.returns(of(postsMessage));
      getPostsStub.returns([]);
      getStatusStub.returns(PageStatus.OK);
      getExcludedStub.returns(false);
      
      controller.handleIncomingPosts();

      expect(listenForPostsStub.calledOnce).toBeTruthy();
      expect(highlightPostsStub.calledOnce).toBeTruthy();
      expect(highlightPostsStub.args[0][0]).toStrictEqual(posts);
    });

    it('should not highlight posts when status not "ok"', () => {
      const event = createAPISnifferPostsMsg(posts);
      const postsMessage = new APISnifferPostsMessage(event);
      listenForPostsStub.returns(of(postsMessage));
      getStatusStub.returns(PageStatus.NOT_OK_ARCHIVE);
      getExcludedStub.returns(false);
      getPostsStub.returns([]);
      
      controller.handleIncomingPosts();

      expect(listenForPostsStub.calledOnce).toBeTruthy();
      expect(highlightPostsStub.called).toBeFalsy();
    });

    it('should not highlight posts when model shows blog excluded', () => {
      const event = createAPISnifferPostsMsg(posts);
      const postsMessage = new APISnifferPostsMessage(event);
      listenForPostsStub.returns(of(postsMessage));
      getStatusStub.returns(PageStatus.OK);
      getExcludedStub.returns(true);
      getPostsStub.returns([]);

      controller.handleIncomingPosts();

      expect(listenForPostsStub.calledOnce).toBeTruthy();
      expect(highlightPostsStub.called).toBeFalsy();
    });

    it('should remove dupicate posts before updating model', () => {
      getPostsStub.returns([posts[0]]);
      const event = createAPISnifferPostsMsg(posts);
      const postsMessage = new APISnifferPostsMessage(event);
      listenForPostsStub.returns(of(postsMessage));
      
      controller.handleIncomingPosts();

      expect(listenForPostsStub.calledOnce).toBeTruthy();
      expect(addPostsStub.calledOnce).toBeTruthy();
      const addedPosts = addPostsStub.args[0][0];
      expect(addedPosts).toStrictEqual(posts.slice(1));
    })
  });

  describe('handleIncomingSnifferUpdates()', () => {
    let snifferUpdateStub: SinonStub;
    let setStatusStub: SinonStub;
    let setBlognameStub: SinonStub;
    let isBlogExcludedStub: SinonStub;
    let setExcludedStub: SinonStub;
    let highlightPostsStub: SinonStub;
    let sendPageActionMessageStub: SinonStub;
    let getPostsStub: SinonStub;
    let getStatusStub: SinonStub;

    beforeEach(() => {
      setStatusStub = model.setStatus as SinonStub;
      setBlognameStub = model.setBlogname as SinonStub;
      setExcludedStub = model.setExcluded as SinonStub;
      highlightPostsStub = view.highlightPosts as SinonStub;
      sendPageActionMessageStub = pageActionService.sendMessage as SinonStub;
      isBlogExcludedStub = storageService.isBlogExcluded as SinonStub;
      snifferUpdateStub = apiSnifferService.listenForUpdates as SinonStub;
      getPostsStub = model.getPosts as SinonStub;
      getStatusStub = model.getStatus as SinonStub;
    });

    it('should update model with incoming APISniffer update', () => {
      isBlogExcludedStub.resolves(true);
      const newStatus = PageStatus.OK;
      const update = {
        status: newStatus,
        blogname
      };
      const event = createAPISnifferUpdateMsg(update);
      const messageContainer = new APISnifferUpdateMessage(event);
      snifferUpdateStub.returns(of(messageContainer));
      
      controller.handleIncomingSnifferUpdates();

      expect(snifferUpdateStub.calledOnce).toBeTruthy();
      expect(setStatusStub.calledOnce).toBeTruthy();
      expect(setStatusStub.args[0][0]).toBe(newStatus);
      expect(setBlognameStub.calledOnce).toBeTruthy();
      expect(setBlognameStub.args[0][0]).toBe(blogname);
    });

    it('should update model after isBlogExcluded() response', async () => {
      const newStatus = PageStatus.OK;
      const update = {
        status: newStatus,
        blogname
      };
      const event = createAPISnifferUpdateMsg(update);
      const messageContainer = new APISnifferUpdateMessage(event);
      snifferUpdateStub.returns(of(messageContainer));
      isBlogExcludedStub.resolves(false);
      
      controller.handleIncomingSnifferUpdates();
      await isBlogExcludedStub();
      
      expect(snifferUpdateStub.calledOnce).toBeTruthy();
      expect(setExcludedStub.calledOnce).toBeTruthy();
      expect(setExcludedStub.args[0][0]).toBe(false);
    });

    it('should update view with posts in update when receiving "ok"', async () => {
      isBlogExcludedStub.resolves(false);
      getPostsStub.resolves(posts);
      const newStatus = PageStatus.OK;
      const update = {
        status: newStatus,
        blogname
      };
      const event = createAPISnifferUpdateMsg(update);
      const messageContainer = new APISnifferUpdateMessage(event);
      snifferUpdateStub.returns(of(messageContainer));
      
      controller.handleIncomingSnifferUpdates();
      await isBlogExcludedStub();
      
      expect(snifferUpdateStub.calledOnce).toBeTruthy();
      expect(highlightPostsStub.calledOnce).toBeTruthy();
    });

    it('should notify page action with blog excluded data', async () => {
      isBlogExcludedStub.resolves(false);
      const newStatus = PageStatus.OK;
      getStatusStub.returns(newStatus);
      const update = {
        status: newStatus,
        blogname
      };
      const event = createAPISnifferUpdateMsg(update);
      const messageContainer = new APISnifferUpdateMessage(event);
      snifferUpdateStub.returns(of(messageContainer));
      
      controller.handleIncomingSnifferUpdates();
      
      await isBlogExcludedStub();
      
      expect(snifferUpdateStub.calledOnce).toBeTruthy();
      expect(sendPageActionMessageStub.calledOnce).toBeTruthy();
      
      const message = sendPageActionMessageStub.args[0][0];
      expect(message).toStrictEqual(createContentScriptUpdateMsg({
        status: newStatus,
        excluded: false
      }));
    });

    it('should notify page action of non "ok" change', async () => {
      isBlogExcludedStub.resolves(false);
      const newStatus = PageStatus.NOT_OK_ARCHIVE;
      getStatusStub.returns(newStatus);
      const update = {
        status: newStatus,
        blogname
      };
      const event = createAPISnifferUpdateMsg(update);
      const messageContainer = new APISnifferUpdateMessage(event);

      snifferUpdateStub.returns(of(messageContainer));

      controller.handleIncomingSnifferUpdates();

      await isBlogExcludedStub();
      
      expect(snifferUpdateStub.calledOnce).toBeTruthy();      
      expect(sendPageActionMessageStub.calledOnce).toBeTruthy();
      
      const message = sendPageActionMessageStub.args[0][0];
      expect(message).toStrictEqual(createContentScriptUpdateMsg({
        status: newStatus,
        excluded: false
      }));
    });
  });

  describe('handleUIClick()', () => {
    let getStatusStub: SinonStub;
    let getPostsStub: SinonStub;
    let getExcludedStub: SinonStub;
    let getBlognameStub: SinonStub;
    let setExcludedStub: SinonStub;
    let resetViewStub: SinonStub;
    let highlightPostsStub: SinonStub;
    let includeBlogStub: SinonStub;
    let excludeBlogStub: SinonStub;
    let iconClickedStub: SinonStub;
    let pageActionGateWayStub: SinonStub;
    let emptyPromise: Promise<void>;
    
    beforeEach(() => {
      getStatusStub = model.getStatus as SinonStub;
      getPostsStub = model.getPosts as SinonStub;
      getBlognameStub = model.getBlogname as SinonStub;
      getExcludedStub = model.getExcluded as SinonStub;
      setExcludedStub = model.setExcluded as SinonStub;
      resetViewStub = view.reset as SinonStub;
      highlightPostsStub = view.highlightPosts as SinonStub;
      includeBlogStub = storageService.includeBlog as SinonStub;
      excludeBlogStub = storageService.excludeBlog as SinonStub;
      iconClickedStub = pageActionService.listenForPageActionIconClicks as SinonStub;
      pageActionGateWayStub = sinon.stub();
      emptyPromise = Promise.resolve();
    });

    it('should include an excluded blog on click', async () => {
      getExcludedStub.returns(true);
      getPostsStub.returns([]);
      getStatusStub.returns(PageStatus.OK);
      getBlognameStub.returns(blogname);
      includeBlogStub.resolves(true);
      iconClickedStub.returns(of(pageActionGateWayStub));
      
      controller.handleUIClick();

      await emptyPromise;

      expect(includeBlogStub.calledOnce).toBeTruthy();
      expect(includeBlogStub.args[0][0]).toBe(blogname);
      expect(setExcludedStub.calledOnce).toBeTruthy();
      expect(setExcludedStub.args[0][0]).toBe(false);
    });

    it('should exclude an included blog on click', async () => {
      getExcludedStub.returns(false);
      getStatusStub.returns(PageStatus.OK);
      getBlognameStub.returns(blogname);
      excludeBlogStub.resolves(true);
      iconClickedStub.returns(of(pageActionGateWayStub));
      
      controller.handleUIClick();

      await emptyPromise;

      expect(excludeBlogStub.calledOnce).toBeTruthy();
      expect(excludeBlogStub.args[0][0]).toBe(blogname);      
      expect(setExcludedStub.calledOnce).toBeTruthy();
      expect(setExcludedStub.args[0][0]).toBe(true);
    });

    it('should not update excluded model when storage change unsuccesful', async () => {
      getExcludedStub.returns(false);
      getStatusStub.returns(PageStatus.OK);
      getBlognameStub.returns(blogname);
      excludeBlogStub.resolves(false);
      iconClickedStub.returns(of(pageActionGateWayStub));

      controller.handleUIClick();

      await emptyPromise;

      expect(setExcludedStub.calledOnce).toBeFalsy();
    });

    it('should update view to show posts when including a blog', async () => {
      getExcludedStub
        .onFirstCall().returns(true)
        .onSecondCall().returns(true)
        .returns(false);
      getPostsStub.returns(posts);
      getStatusStub.returns(PageStatus.OK);
      getBlognameStub.returns(blogname);
      includeBlogStub.resolves(true);
      iconClickedStub.returns(of(pageActionGateWayStub));
      
      controller.handleUIClick();

      await emptyPromise;

      expect(highlightPostsStub.calledOnce).toBeTruthy();
      expect(highlightPostsStub.args[0][0]).toStrictEqual(posts);
    });

    it('should reset view when excluding a blog', async () => {
      getExcludedStub
        .onFirstCall().returns(false)
        .onSecondCall().returns(false)
        .returns(true);      
      getStatusStub.returns(PageStatus.OK);
      getBlognameStub.returns(blogname);
      excludeBlogStub.resolves(true);
      iconClickedStub.returns(of(pageActionGateWayStub));
      
      controller.handleUIClick();

      await emptyPromise;

      expect(resetViewStub.calledOnce).toBeTruthy();
    });

    it('should respond with content script update when not "ok" status', async () => {
      getStatusStub.returns(PageStatus.UNSUPPORTED);
      getExcludedStub.returns(true);
      getBlognameStub.returns(blogname);
      iconClickedStub.returns(of(pageActionGateWayStub));

      controller.handleUIClick();

      expect(pageActionGateWayStub.calledOnce).toBeTruthy();
      const update = pageActionGateWayStub.args[0][0];
      expect(update).toStrictEqual(createContentScriptUpdateMsg({
        status: PageStatus.UNSUPPORTED,
        excluded: true
      }));
    });

    it('should respond with content script update when "ok" status', async () => {
      getExcludedStub
        .onFirstCall().returns(false)
        .onSecondCall().returns(false)
        .returns(true);  
      getPostsStub.returns([]);
      getStatusStub.returns(PageStatus.OK);
      getBlognameStub.returns(blogname);
      excludeBlogStub.resolves(true);
      iconClickedStub.returns(of(pageActionGateWayStub));
      
      controller.handleUIClick();

      await excludeBlogStub();

      expect(iconClickedStub.calledOnce).toBeTruthy();
      expect(pageActionGateWayStub.calledOnce).toBeTruthy();
      const update = pageActionGateWayStub.args[0][0];
      expect(update).toStrictEqual(createContentScriptUpdateMsg({
        status: PageStatus.OK,
        excluded: true
      }));
    });
  });

  describe('injectAPISniffer()', () => {
    let injectAPISnifferStub: SinonStub;

    beforeEach(() => {
      injectAPISnifferStub = apiSnifferService.injectAPISniffer as SinonStub;
    });

    it('should inject api sniffer', () => {
      controller.injectAPISniffer();
      expect(injectAPISnifferStub.calledOnce).toBeTruthy();
    });
  });
});