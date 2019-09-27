import sinon, { 
  SinonStub, 
  SinonSpy 
} from 'sinon';
import {
  InstallerController,
  ExtScript
} from '~/types';
import Installer from '~/scripts/background/Installer/Installer';

describe('Installer', () => {
  let controller: InstallerController;
  let installer: ExtScript;

  /* general setup */
  beforeEach(() => {
    controller = {
      setupStorage: sinon.stub(),
      attachPageActionRules: sinon.stub()
    }
    installer = new Installer(controller);
  });

  describe('handleInstall()', () => {
    let onInstalledSpy: SinonStub;
    
    beforeEach(() => {
      onInstalledSpy = chrome.runtime.onInstalled.addListener as SinonStub;
    });

    describe('run()', () => {
      it('should attach a listener for installation event', () => {
        installer.run();
        expect(onInstalledSpy.calledOnce).toBeTruthy();
      });
  
      it('should invoke page rules attacher in controller', () => {
        onInstalledSpy.callsArgWith(0, { reason: 'install' });
        installer.run();
        const spy = controller.attachPageActionRules as SinonSpy;
        expect(spy.calledOnce).toBeTruthy();
      });
  
      it('should invoke setup storage handler in controller', () => {
        onInstalledSpy.callsArgWith(0, { reason: 'install' });
        installer.run();
        
        const spy = controller.setupStorage as SinonSpy;
        expect(spy.calledOnce).toBeTruthy();
      });

      it('should not invoke any controller fns if not called with reason as "install"', () => {
        onInstalledSpy.callsArgWith(0, { reason: 'install' });
        installer.run();

        const attachPageActionSpy = controller.attachPageActionRules as SinonSpy;
        const setupStorageSpy = controller.setupStorage as SinonSpy;
        expect(attachPageActionSpy.called).toBeTruthy();
        expect(setupStorageSpy.called).toBeTruthy();
      });
    });
  });
});