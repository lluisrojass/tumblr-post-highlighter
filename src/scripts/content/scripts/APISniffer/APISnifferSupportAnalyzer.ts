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
    const tumblrGlobal = (window as any).tumblr;
    return isObj(tumblrGlobal);
  }
}
