import {
  SinonSpy
} from 'sinon';
import {
  InstallerController,
} from '~/types';
import Controller from '~/scripts/background/Installer/InstallerController';
import config from '~/config/index';

describe('InstallerController', () => {
  let controller: InstallerController;

  /* general setup */
  beforeEach(() => {
    controller = new Controller();
  });

  describe('setupStorage()', () => {
    let setStorageSpy: SinonSpy;

    beforeEach(() => {
      setStorageSpy = chrome.storage.local.set as SinonSpy;
    });

    it('should setup storage', () => {
      controller.setupStorage();
      expect(setStorageSpy.calledOnce).toBeTruthy();
      const initialStorage = {
        [config.storageKeys.excludeBlog]: []
      };
      expect(setStorageSpy.args[0][0]).toStrictEqual(initialStorage);
    });
  });

  describe('attachPageActionRules()', () => {
    let onPageChangedSpy: SinonSpy;

    beforeEach(() => {
      onPageChangedSpy = chrome.declarativeContent.onPageChanged.addRules as SinonSpy;
    });

    it('should attach page action toggling logic', () => {
      controller.attachPageActionRules();
      expect(onPageChangedSpy.calledOnce).toBeTruthy();
    });
  });
});