import { 
  InstallerController
} from '~/types';
import config from '~/config/index';
import logger from '~/logger/index';

class Controller implements InstallerController {
  public attachPageActionRules = () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          urlMatches: '(?:[a-z0-9]+(?:\\-+[a-z0-9]+)*)+\\.tumblr\\.com/.*',
          pathPrefix: '/archive'
        }
      })],
      actions: [
        new chrome.declarativeContent.ShowPageAction()
      ]
    }]);
  }
  
  public setupStorage = () => {
    chrome.storage.local.set({ [config.storageKeys.excludeBlog]: [] }, () => {
      if (chrome.runtime.lastError) {
        logger.error('fatal error, could not initialize state: ', chrome.runtime.lastError);
        return;
      }
      
      logger.log('local ext storage initialized');
    });
  }
} 

export default Controller;