import { 
  SinonStub 
} from 'sinon';
import { 
  CSStorageService
} from '~/types';
import StorageService from '~/scripts/content/services/CSStorageService';
import config from '~/config/index';

describe('CSStorageService', () => {
  let blogname: string;
  let getStorageStub: SinonStub;
  let setStorageStub: SinonStub;
  let storageService: CSStorageService;
  
  /* general setup */
  beforeEach(() => {
    blogname = 'test-blogname';
    getStorageStub = chrome.storage.local.get as SinonStub;
    setStorageStub = chrome.storage.local.set as SinonStub;
    storageService = new StorageService();
  });

  describe('isBlogExcluded()', () => {
    it('should indicate when blog is excluded', async () => {
      getStorageStub.callsArgWith(1, { 
        [config.storageKeys.excludeBlog]: [blogname] 
      });
      const isBlogExcluded = await storageService.isBlogExcluded(blogname);

      expect(isBlogExcluded).toBeTruthy();
    });

    it('should indicate when blog is not excluded', async () => {
      getStorageStub.callsArgWith(1, { 
        [config.storageKeys.excludeBlog]: [] 
      });
      const isBlogExcluded = await storageService.isBlogExcluded(blogname);

      expect(isBlogExcluded).toBeFalsy();
    });

    it('should throw error when storage is in an unreadable state', async () => {
      getStorageStub.callsArgWith(1, { [config.storageKeys.excludeBlog]: '' });
    
      let caught;
      await storageService
        .isBlogExcluded(blogname)
        .catch((error) => {
          caught = error;
        });
      
      expect(caught).toBeInstanceOf(Error);
    });
  });

  describe('excludeBlog()', () => {
    it('should exclude a blog', async () => {
      getStorageStub.callsArgWith(1, { 
        [config.storageKeys.excludeBlog]: ['test-blogname-2', 'test-blogname-3'] 
      });
      setStorageStub.callsArg(1);

      const didExclude = await storageService.excludeBlog(blogname);
      expect(didExclude).toBeTruthy();
    });

    it('should indicate failure when excluding a blog which is already excluded', async () => {
      getStorageStub.callsArgWith(1, { 
        [config.storageKeys.excludeBlog]: [blogname] 
      });
      setStorageStub.callsArg(1);

      const didExclude = await storageService.excludeBlog(blogname);
      expect(didExclude).toBeFalsy();
    });
  });

  describe('includeBlog()', () => {
    it('should include an excluded blog', async () => {
      getStorageStub.callsArgWith(1, { 
        [config.storageKeys.excludeBlog]: [blogname, 'test-blogname-3'] 
      });
      setStorageStub.callsArg(1);

      const didInclude = await storageService.includeBlog(blogname);
      expect(didInclude).toBeTruthy();
    });

    it('should indicate failure when including blog which is already included', async () => {
      getStorageStub.callsArgWith(1, { 
        [config.storageKeys.excludeBlog]: ['test-blogname-2'] 
      });

      const didInclude = await storageService.includeBlog(blogname);
      expect(didInclude).toBeFalsy();
    });
  });
});