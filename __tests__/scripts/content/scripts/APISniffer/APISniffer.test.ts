import sinon, { 
  SinonStub 
} from 'sinon';
import {
  ExtScript,
  APISnifferController
} from '~/types';
import Script from '~/scripts/content/scripts/APISniffer/APISniffer';

describe('APISniffer', () => {
  let apiSnifferScript: ExtScript;
  let controllerStub: APISnifferController;

  /* general setup */
  beforeEach(() => {
    controllerStub = {
      analyzePage: sinon.stub(),
      hijackAjaxRequests: sinon.stub(),
      sendUpdateToContentScript: sinon.stub()
    };
    apiSnifferScript = new Script(controllerStub);
  });

  describe('run()', () => {
    it('should analyze page', () => {
      apiSnifferScript.run();
      const stub = controllerStub.analyzePage as SinonStub;
      expect(stub.calledOnce).toBeTruthy();
    });

    it('should send initial update to content script', () => {
      apiSnifferScript.run();
      const stub = controllerStub.sendUpdateToContentScript as SinonStub;
      expect(stub.calledOnce).toBeTruthy();
    });

    it('should hijack ajax calls', () => {
      apiSnifferScript.run();
      const stub = controllerStub.hijackAjaxRequests as SinonStub;
      expect(stub.calledOnce).toBeTruthy();
    });
  });
});