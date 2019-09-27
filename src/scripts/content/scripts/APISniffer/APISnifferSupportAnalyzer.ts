import {
  APISnifferSupportAnalyzer
} from '~/types';
import config from '~/config/index';
import isObj from '~/utils/isObj';

export default class SupportAnalyzer implements APISnifferSupportAnalyzer {
  public isWindowSupported = () => {
    return typeof window.fetch === 'function';
  }

  public isHealthyArchive = () => {
    const v2State = window && (window as { 
      [index: string]: any 
    })[config.tumblr.v2StateKey];

    if (!isObj(v2State)) return false;
    if (v2State[config.tumblr.v2ServerErrorKey] || !Object.keys(v2State).length) return false;
    
    return true;
  }
}
