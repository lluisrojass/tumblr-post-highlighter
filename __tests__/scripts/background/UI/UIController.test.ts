import sinon, { 
  SinonStub 
} from 'sinon';
import { 
  of 
} from 'rxjs';
import {
  UIController,
  UIContentScriptService,
  UIPageActionService,
  PageStatus,
  Views,
  MessageTypes
} from '~/types'
import ContentScriptUpdate from '~/scripts/background/UI/messages/ContentScriptUpdate'
import Controller from '~/scripts/background/UI/UIController';

describe('UIController', () => {
  let tabId: number;
  let controller: UIController;
  let pageActionService: UIPageActionService;
  let contentScriptService: UIContentScriptService;

  /* general setup */
  beforeEach(() => {
    pageActionService = {
      listenForIconClicks: sinon.stub(),
      showView: sinon.stub()
    };
    contentScriptService = {
      sendIconClickedMessage: sinon.stub(),
      listenForUpdates: sinon.stub()
    };
    controller = new Controller(
      contentScriptService,
      pageActionService
    );
    tabId = 12;
  });

  describe('handleContentScriptUpdates()', () => {
    let listenForUpdatesStub: SinonStub;
    let showViewStub: SinonStub;

    beforeEach(() => {
      listenForUpdatesStub = contentScriptService.listenForUpdates as SinonStub;
      showViewStub = pageActionService.showView as SinonStub;
    });

    it('should translate "ok" content script status to "ok" view', () => {
      const messageContainer = new ContentScriptUpdate({
        type: MessageTypes.CS_UPDATE,
        update: {
          status: PageStatus.OK,
          excluded: false
        }
      });
      messageContainer.registerTabId(tabId);

      const observable = of(messageContainer);
      listenForUpdatesStub.returns(observable);

      controller.handleContentScriptUpdates();

      expect(showViewStub.calledOnce).toBeTruthy();
      expect(showViewStub.args[0][1]).toBe(Views.OK);
    });

    it('should translate "unsupported" content script status to "unsupported" view', () => {
      const messageContainer = new ContentScriptUpdate({
        type: MessageTypes.CS_UPDATE,
        update: {
          status: PageStatus.UNSUPPORTED,
          excluded: false
        }
      });
      messageContainer.registerTabId(tabId);

      const observable = of(messageContainer);
      listenForUpdatesStub.returns(observable);
      
      controller.handleContentScriptUpdates();
      
      expect(showViewStub.calledOnce).toBeTruthy();
      expect(showViewStub.args[0][1]).toBe(Views.UNSUPPORTED);
    });

    it('should translate "non-healthy" content script status to "unsupported" view', () => {
      const messageContainer = new ContentScriptUpdate({
        type: MessageTypes.CS_UPDATE,
        update: {
          status: PageStatus.NOT_OK_ARCHIVE,
          excluded: false
        }
      });
      messageContainer.registerTabId(tabId);

      const observable = of(messageContainer);
      listenForUpdatesStub.returns(observable);

      controller.handleContentScriptUpdates();

      expect(showViewStub.calledOnce).toBeTruthy();
      expect(showViewStub.args[0][1]).toBe(Views.UNSUPPORTED);
    });

    it('should translate "excluded" content script status to "turned off" view', () => {
      const messageContainer = new ContentScriptUpdate({
        type: MessageTypes.CS_UPDATE,
        update: {
          status: PageStatus.OK,
          excluded: true
        }
      });
      messageContainer.registerTabId(tabId);

      const observable = of(messageContainer);
      listenForUpdatesStub.returns(observable);

      controller.handleContentScriptUpdates();

      expect(showViewStub.calledOnce).toBeTruthy();
      expect(showViewStub.args[0][1]).toBe(Views.TURNED_OFF);
    });
  });

  describe('handleIconClick()', () => {
    let iconClickedStub: SinonStub;
    let sendIconClickedStub: SinonStub;
    let showViewStub: SinonStub;

    beforeEach(() => {
      sendIconClickedStub = contentScriptService.sendIconClickedMessage as SinonStub;
      iconClickedStub = pageActionService.listenForIconClicks as SinonStub;
      showViewStub = pageActionService.showView as SinonStub;
    });

    it('should translate icon click to content script', () => {
      iconClickedStub.returns(of(tabId));
      controller.handleIconClicks();
      expect(sendIconClickedStub.calledOnce).toBeTruthy();
    });

    it('should update view based on content script\'s responding update', () => {
      iconClickedStub.returns(of(tabId));
      const update = new ContentScriptUpdate({ 
        type: MessageTypes.CS_UPDATE,
        update: {
          status: PageStatus.OK, 
          excluded: false 
        }
      });
      update.registerTabId(tabId);

      sendIconClickedStub.callsArgWith(1, update);
      controller.handleIconClicks();
      
      expect(sendIconClickedStub.calledOnce).toBeTruthy();
      expect(showViewStub.calledOnce).toBeTruthy();
      expect(showViewStub.args[0][1]).toBe(Views.OK);
    });
  });
});