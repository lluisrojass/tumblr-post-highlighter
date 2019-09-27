import sinon, { 
  SinonStub 
} from 'sinon';
import {
  ExtScript,
  UIController
} from '~/types';
import UIBackgroundScript from '~/scripts/background/UI/UI';

describe('UI', () => {
  let fakeController: UIController;
  let backgroundScript: ExtScript;

  /* general setup */
  beforeEach(() => {
    fakeController = {
      handleIconClicks: sinon.spy(),
      handleContentScriptUpdates: sinon.spy()
    };    
    backgroundScript = new UIBackgroundScript(fakeController);
  });
  
  describe('run()', () => {
    it('should setup handler for incoming content script updates', () => {
      backgroundScript.run();
      const stub = fakeController.handleContentScriptUpdates as SinonStub;
      expect(stub.calledOnce).toBeTruthy();
    });

    it('should setup handler for incoming page action icon clicks', () => {
      backgroundScript.run();
      const stub = fakeController.handleIconClicks as SinonStub;
      expect(stub.calledOnce).toBeTruthy();
    });
  });
});