import sinon, { 
  SinonStub, 
  SinonSpy 
} from 'sinon';
import { 
  CSPageActionService,
  PageStatus,
  MessageTypes 
} from '~/types';
import PageActionService from '~/scripts/content/services/CSPageActionService';
import createContentScriptUpdateMsg from '~/utils/messageCreators/contentScriptUpdate'; 
import createUIActionClickedMsg from '~/utils/messageCreators/uiActionClicked';
 
describe('CSPageActionService', () => {
  let sendMessageStub: SinonStub;
  let messageListenerStub: SinonStub;
  let pageActionService: CSPageActionService;
  
  /* general setup */
  beforeEach(() => {
    sendMessageStub = chrome.runtime.sendMessage as SinonStub;
    messageListenerStub = chrome.runtime.onMessage.addListener as SinonStub;
    pageActionService = new PageActionService();
  });

  describe('sendMessage()', () => {
    it('should dispatch content script update to page action', () => {
      const message = createContentScriptUpdateMsg({ 
        status: PageStatus.OK, 
        excluded: false 
      });
      pageActionService.sendMessage(message);
      expect(sendMessageStub.calledOnce).toBeTruthy();
      const disapatchedMessage = sendMessageStub.args[0][0];
      expect(disapatchedMessage).toStrictEqual(message);
    });
  });

  describe('listenForPageActionIconClicks()', () => {
    let spy: SinonSpy;
    
    beforeEach(() => {
      spy = sinon.spy();
      pageActionService
        .listenForPageActionIconClicks()
        .subscribe(spy);
    });

    it('should report incoming click message and provide callback', () => {
      const actionClickedMessage = createUIActionClickedMsg();
      const noop = () => {};
      messageListenerStub.callArgWith(0, actionClickedMessage, undefined, noop);
      expect(spy.calledOnce).toBeTruthy();
      expect(spy.args[0][0]).toBe(noop);
    });

    it('should ignore invalid incoming messages', () => {
      const messages = [
        { type: MessageTypes.NEW_POSTS },
        {},
        undefined
      ];

      /* invalid type */
      messageListenerStub.callArgWith(0, messages[0]);
      expect(spy.called).toBeFalsy();

      /* missing type */
      messageListenerStub.callArgWith(0, messages[2]);
      expect(spy.called).toBeFalsy();

      /* missing message */
      messageListenerStub.callArgWith(0, messages[3]);
      expect(spy.called).toBeFalsy();
    });
  });
});