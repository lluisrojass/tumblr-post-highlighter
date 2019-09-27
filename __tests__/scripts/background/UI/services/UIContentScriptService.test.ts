import sinon, { 
  SinonStub, 
  SinonSpy 
} from 'sinon';
import { 
  PageStatus
} from '~/types';
import UIContentScriptService from '~/scripts/background/UI/services/UIContentScriptService';
import createContentScriptUpdateMsg from '~/utils/messageCreators/contentScriptUpdate';
import createUIActionClickedMsg from '~/utils/messageCreators/uiActionClicked';

describe('UIContentScriptService', () => {
  let contentScriptService: UIContentScriptService;
  
  /* general setup */
  beforeEach(() => {
    contentScriptService = new UIContentScriptService();
  });

  describe('listenForUpdates()', () => {
    let spy: SinonSpy;
    let messageListenerStub: SinonStub;
    
    beforeEach(() => {
      messageListenerStub = chrome.runtime.onMessage.addListener as SinonStub;
      spy = sinon.spy();
      contentScriptService
        .listenForUpdates()
        .subscribe(spy);
    });

    it('should dispatch incoming updates', () => {
      const update = {
        status: PageStatus.UNSUPPORTED,
        excluded: false
      };
      const message = createContentScriptUpdateMsg(update);
      const sender = {
        tab: {
          id: 12
        }
      };
      messageListenerStub.callArgWith(0, message, sender);

      expect(spy.calledOnce).toBeTruthy();
      
      const messageContainer = spy.args[0][0];

      expect(update.status).toBe(messageContainer.getStatus());
      expect(update.excluded).toBe(messageContainer.getExcluded());
    });

    it('should reject an incoming updates with invalid data/structure', () => {
      const sender = {
        tab: {
          id: 12
        }
      };
      const badUpdates = [
        undefined,
        {},
        {
          status: 'bad-status',
          excluded: false
        },
        {
          status: 'bad-status',
          excluded: NaN
        },
      ]

      /* no message */
      messageListenerStub.callArgWith(0, createContentScriptUpdateMsg(badUpdates[0] as any), sender);
      expect(spy.called).toBeFalsy();

      /* empty object */
      messageListenerStub.callArgWith(0, createContentScriptUpdateMsg(badUpdates[1] as any), sender);
      expect(spy.called).toBeFalsy();

      /* bad status */
      messageListenerStub.callArgWith(0, createContentScriptUpdateMsg(badUpdates[2] as any), sender);
      expect(spy.called).toBeFalsy();

      /* bad excluded value */
      messageListenerStub.callArgWith(0, createContentScriptUpdateMsg(badUpdates[3] as any), sender);
      expect(spy.called).toBeFalsy();

      /* missing message */
      messageListenerStub.callArgWith(0, undefined, sender);
      expect(spy.called).toBeFalsy();
    });

    it('should reject incoming messages with no valid tab identifier', () => {
      const message = createContentScriptUpdateMsg({} as any);
      const sender = {
        tab: {
          id: undefined
        }
      };

      messageListenerStub.callArgWith(0, message, sender);
      expect(spy.called).toBeFalsy();
    });
  });

  describe('sendIconClickedMessage()', () => {
    let tabId: number;
    let callbackSpy: SinonSpy;
    let sendMessageStub: SinonStub;

    beforeEach(() => {
      tabId = 120;
      callbackSpy = sinon.spy();
      sendMessageStub = chrome.tabs.sendMessage as SinonStub;
    });
    
    it('should dispatch an icon clicked message', () => {
      contentScriptService.sendIconClickedMessage(tabId, callbackSpy);
      
      expect(sendMessageStub.calledOnce).toBeTruthy();
      expect(sendMessageStub.args[0][0]).toBe(tabId);
      expect(sendMessageStub.args[0][1]).toStrictEqual(createUIActionClickedMsg());
    });

    it('should invoke callback with update', () => {
      contentScriptService.sendIconClickedMessage(tabId, callbackSpy);

      expect(sendMessageStub.calledOnce).toBeTruthy();
      expect(sendMessageStub.args[0][0]).toBe(tabId);
      expect(sendMessageStub.args[0][1]).toStrictEqual(createUIActionClickedMsg());
      
      const update = {
        status: PageStatus.OK,
        excluded: true
      };
      const message = createContentScriptUpdateMsg(update)
      sendMessageStub.callArgWith(2, message);
      expect(callbackSpy.calledOnce).toBeTruthy();

      const messageContainer = callbackSpy.args[0][0];
      expect(messageContainer.getStatus()).toBe(update.status);
      expect(messageContainer.getExcluded()).toBe(update.excluded);
    });

    it('should ignore an update with invalid content', () => {
      contentScriptService.sendIconClickedMessage(tabId, callbackSpy);

      expect(sendMessageStub.calledOnce).toBeTruthy();
      expect(sendMessageStub.args[0][0]).toBe(tabId);
      expect(sendMessageStub.args[0][1]).toStrictEqual(createUIActionClickedMsg());
      const badUpdates = [
        undefined,
        {
          status: 'bad-status',
          excluded: true
        },
        
        {
          status: PageStatus.NOT_OK_ARCHIVE,
          excluded: 5
        }
      ];
      
      /* empty update */
      sendMessageStub.callArgWith(2, createContentScriptUpdateMsg(badUpdates[0] as any));
      expect(callbackSpy.calledOnce).toBeFalsy();

      /* invalid status */
      sendMessageStub.callArgWith(2, createContentScriptUpdateMsg(badUpdates[1] as any));
      expect(callbackSpy.calledOnce).toBeFalsy();
      
      /* invalid excluded value */
      sendMessageStub.callArgWith(2, createContentScriptUpdateMsg(badUpdates[2] as any));
      expect(callbackSpy.calledOnce).toBeFalsy();
    });
  });
});
