import sinon, { 
  SinonStub, 
  SinonSpy 
} from 'sinon';
import {
  Views
} from '~/types';
import content from '~/scripts/background/UI/services/UIPageActionService/content.json';
import UIPageActionService from '~/scripts/background/UI/services/UIPageActionService';

describe('UIPageActionService', () => {
  let pageActionService: UIPageActionService;
  let spy: SinonSpy;

  /* general setup */
  beforeEach(() => {
    pageActionService = new UIPageActionService();
    spy = sinon.spy();
  });

  describe('listenForIconClicks()', () => {
    let onClickedListenerStub: SinonStub;

    beforeEach(() => {
      onClickedListenerStub = chrome.pageAction.onClicked.addListener as SinonStub;
      pageActionService
        .listenForIconClicks()
        .subscribe(spy);
    });

    it('should dispatch click to Observer', () => {
      const fakeTab = { 
        id: 12, 
        pinned: false,
        highlighted: false,
        windowId: 0,
        active: false,
        incognito: false,
        index: 0,
        selected: false,
        discarded: false, 
        autoDiscardable: false
      };
      onClickedListenerStub.callArgWith(0, fakeTab);
      expect(spy.called).toBeTruthy();
    });

    it('should ignore incoming click messages w/ missing tab identifiers', () => {
      const fakeTab = { 
        pinned: false,
        highlighted: false,
        windowId: 0,
        active: false,
        incognito: false,
        index: 0,
        selected: false,
        discarded: false, 
        autoDiscardable: false
      };
      onClickedListenerStub.callArgWith(0, fakeTab);
      expect(spy.called).toBeFalsy();
    });
  });

  describe('showView()', () => {
    let tabId: number;
    let setIconSpy: SinonStub;
    let setTitleSpy: SinonStub;

    beforeEach(() => {
      tabId = 12;
      setIconSpy = chrome.pageAction.setIcon as SinonStub;
      setTitleSpy = chrome.pageAction.setTitle as SinonStub;
    });

    it('should turn "ok" view on', () => {
      pageActionService.showView(tabId, Views.OK);

      expect(setIconSpy.calledOnce).toBeTruthy();
      expect(setTitleSpy.calledOnce).toBeTruthy();

      const paths = setIconSpy.args[0][0].path;
      const title = setTitleSpy.args[0][0].title;

      expect(title).toBe(content.views.ok.title);
      expect(paths).toStrictEqual(content.views.ok.path);
    });

    it('should turn "unsupported" view on', () => {
      pageActionService.showView(tabId, Views.UNSUPPORTED);

      expect(setIconSpy.calledOnce).toBeTruthy();
      expect(setTitleSpy.calledOnce).toBeTruthy();

      const paths = setIconSpy.args[0][0].path;
      const title = setTitleSpy.args[0][0].title;

      expect(title).toBe(content.views.broken.title);
      expect(paths).toStrictEqual(content.views.broken.path);
    });

    it('should turn "hidden" view on', () => {
      pageActionService.showView(tabId, Views.TURNED_OFF);

      expect(setIconSpy.calledOnce).toBeTruthy();
      expect(setTitleSpy.calledOnce).toBeTruthy();

      const paths = setIconSpy.args[0][0].path;
      const title = setTitleSpy.args[0][0].title;

      expect(title).toBe(content.views.off.title);
      expect(paths).toStrictEqual(content.views.off.path);
    });

    it('should show "unsupported" view on when invoked w/ invalid constant', () => {
      pageActionService.showView(tabId, undefined);

      expect(setIconSpy.calledOnce).toBeTruthy();
      expect(setTitleSpy.calledOnce).toBeTruthy();

      const paths = setIconSpy.args[0][0].path;
      const title = setTitleSpy.args[0][0].title;

      expect(title).toBe(content.views.broken.title);
      expect(paths).toStrictEqual(content.views.broken.path);
    });
  });
});