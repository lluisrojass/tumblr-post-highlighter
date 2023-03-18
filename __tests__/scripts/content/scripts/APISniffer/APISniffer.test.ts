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
      obtainBlogName: sinon.stub(),
      obtainPageStatus: sinon.stub(),
      hijackAjaxRequests: sinon.stub(),
      sendUpdateToContentScript: sinon.stub()
    };
    apiSnifferScript = new Script(controllerStub);
  });

  describe('run()', () => {
    it('should obtain blog name page', () => {
      apiSnifferScript.run();
      const stub = controllerStub.obtainBlogName as SinonStub;
      expect(stub.calledOnce).toBeTruthy();
    });

    it('should obtain page status', () => {
      apiSnifferScript.run();
      const stub = controllerStub.obtainPageStatus as SinonStub;
      expect(stub.calledOnce).toBeTruthy();
    });

    it('should send initial update to content script', async () => {
      await apiSnifferScript.run();
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