import sinon, { 
  SinonSpy, 
  SinonStub 
} from 'sinon';
import APISnifferScript from 'APISniffer';
import {
  CSAPISnifferService,
  TumblrPost,
  PageStatus,
  MessageTypes
} from '~/types';
import APISnifferService from '~/scripts/content/services/CSAPISnifferService';
import createAPISnifferPostsMsg from '~/utils/messageCreators/apiSnifferPosts';
import createAPISnifferUpdateMsg from '~/utils/messageCreators/apiSnifferUpdate';

/* mock virtual module */
jest.mock('APISniffer', () => '!0', { virtual: true });

describe('CSAPISnifferService', () => {
  let apiSnifferService: CSAPISnifferService;
  let blogname: string;
  let spy: SinonSpy;

  /* general setup */
  beforeEach(() => {
    apiSnifferService = new APISnifferService();
    spy = sinon.spy();
    blogname = 'test-blogname';
  });

  describe('listenForPosts()', () => {
    let posts: Array<TumblrPost>;

    beforeEach(() => {
      apiSnifferService
        .listenForPosts()
        .subscribe(spy);

      posts = [
        {
          id: 'id-1',
          url: `https://${blogname}.tumblr.com/post/123-1`,
        },
        {
          id: 'id-2',
          url: `https://${blogname}.tumblr.com/post/123-2`,
        },
        {
          id: 'id-3',
          url: `https://${blogname}.tumblr.com/post/123-3`,
        },
        {
          id: 'id-4',
          url: `https://${blogname}.tumblr.com/post/123-4`,
        }
      ];
    });

    it('should dispatch incoming posts', () => {
      const event = createAPISnifferPostsMsg(posts);
      document.dispatchEvent(event);

      expect(spy.calledOnce).toBeTruthy();
      const container = spy.args[0][0];
      expect(container.getPosts()).toStrictEqual(posts);
    });

    it('should not dispatch invalid incoming posts event', () => {
      const events = [
        createAPISnifferPostsMsg(undefined as any),
        new CustomEvent(MessageTypes.NEW_POSTS, { detail: { posts: undefined } }),
        new CustomEvent(MessageTypes.NEW_POSTS, { detail: undefined }),
        new CustomEvent(MessageTypes.NEW_POSTS, undefined)
      ]

      /* empty posts */
      document.dispatchEvent(events[0]);
      expect(spy.called).toBeFalsy();
      
      /* missing posts property */
      document.dispatchEvent(events[1]);
      expect(spy.called).toBeFalsy();

      /* missing event detail */
      document.dispatchEvent(events[2]);
      expect(spy.called).toBeFalsy();
      
      /* missing event param */
      document.dispatchEvent(events[3]);
      expect(spy.called).toBeFalsy();
    });
  });

  describe('listenForUpdates()', () => {
    beforeEach(() => {
      apiSnifferService
        .listenForUpdates()
        .subscribe(spy);
    });

    it('should dispatch incoming updates', () => {
      const update = {
        status: PageStatus.OK,
        blogname
      };
      const event = createAPISnifferUpdateMsg(update);
      document.dispatchEvent(event);

      expect(spy.calledOnce).toBeTruthy();
      const messageContainer = spy.args[0][0];
      expect(messageContainer.getStatus()).toBe(update.status);
      expect(messageContainer.getBlogname()).toBe(update.blogname);
    });

    it('should ignore invalid updates', () => {
      const events = [
        new CustomEvent(MessageTypes.API_SNIFFER_UPDATE, { 
          detail: { 
            update: {}
          }
        }),
        new CustomEvent(MessageTypes.API_SNIFFER_UPDATE, { 
          detail: {
            update: undefined
          }
        }),
        new CustomEvent(MessageTypes.API_SNIFFER_UPDATE, { 
          detail: undefined
        }),
        new CustomEvent(MessageTypes.API_SNIFFER_UPDATE, { 
          detail: { 
            update: {
              status: 'bad-status',
              blogname: 'test-blogname'
            }
          }
        }),
        new CustomEvent(MessageTypes.API_SNIFFER_UPDATE, { 
          detail: { 
            update: {
              status: PageStatus.OK,
              blogname: ''
            }
          }
        })
      ];

      /* missing update content */
      document.dispatchEvent(events[0]);
      expect(spy.called).toBeFalsy();
      
      /* missing update object */
      document.dispatchEvent(events[1]);
      expect(spy.called).toBeFalsy();

      /* missing event detail */
      document.dispatchEvent(events[2]);
      expect(spy.called).toBeFalsy();

      /* invalid status */
      document.dispatchEvent(events[3]);
      expect(spy.called).toBeFalsy();

      /* invalid blogname & ok statys */
      document.dispatchEvent(events[4]);
      expect(spy.called).toBeFalsy();
    });
  });

  describe('injectAPISniffer()', () => {
    let prependStub: SinonStub;
    
    beforeEach(() => {
      prependStub = sinon.stub(document.head, 'prepend');
    });

    afterEach(() => {
      prependStub.restore();
    });

    it('should inject script', () => {
      apiSnifferService.injectAPISniffer();
      expect(prependStub.calledOnce).toBeTruthy();

      const scriptText = prependStub.args[0][0].textContent;
      expect(scriptText).toBe(APISnifferScript);
    });
  });
});