import {
  APISnifferRequestAnalyzer,
  APISnifferRequestAnalyzerStatics
} from '~/types';
import config from '~/config/index';
import logger from '~/logger/index';
import isObj from '~/utils/isObj';

const RequestAnalyzer: APISnifferRequestAnalyzerStatics = class Analyzer implements APISnifferRequestAnalyzer {
    constructor(private blogname: string) {}

    public isAPICall = (info: RequestInfo | URL, init?: RequestInit) => {
      if (!(typeof info === 'string' && info)) return false;
      if (init && isObj(init) && (init.method || 'GET') !== 'GET') return false;
      
      let hostname;
      let pathname;
      let hasPostArg;
      try {
        let searchParams;
        ({ 
          hostname, 
          pathname, 
          searchParams 
        } = new URL(info));
        hasPostArg = (searchParams.get(config.tumblr.api.query.postsKey) || '').indexOf(
          config.tumblr.api.query.postsValue
        ) !== -1;
      } catch (err) { 
        /* invalid url */
        logger.warn(`could not analyze request: ${err}`);
        return false;
      }
    
      const apiHost = config.tumblr.api.host;
      const apiPath = config.tumblr.api.path.replace('{{blog}}', this.blogname);
    
      return (
        hostname === apiHost && 
        pathname === apiPath && 
        hasPostArg
      );
    }
  }

export default RequestAnalyzer;