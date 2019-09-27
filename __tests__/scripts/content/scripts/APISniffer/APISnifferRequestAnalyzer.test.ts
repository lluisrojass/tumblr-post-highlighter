import {
  APISnifferRequestAnalyzer
} from '~/types';
import RequestAnalyzer from '~/scripts/content/scripts/APISniffer/APISnifferRequestAnalyzer';
import config from '~/config/index';

describe('RequestAnalyzer', () => {
  const host = config.tumblr.api.host;
  const path = config.tumblr.api.path;
  const queryKey = config.tumblr.api.query.postsKey;
  const queryValue = config.tumblr.api.query.postsValue;
  
  let blogname: string;
  let requestAnalyzer: APISnifferRequestAnalyzer;

  /* general setup */
  beforeEach(() => {
    blogname = 'test-blogname';
    requestAnalyzer = new RequestAnalyzer(blogname);
  });

  describe('isAPICall()', () => {
    it('should identify a posts returning API call', () => {
      const info: RequestInfo = `https://${host}${path.replace('{{blog}}', blogname)}?${queryKey}=${queryValue},noise`;
      const isAPICall = requestAnalyzer.isAPICall(info);
      expect(isAPICall).toBeTruthy();
    });

    it('should ignore an unrelated API call', () => {
      const info: RequestInfo = `https://${host}${path.replace('{{blog}}', blogname)}?$badKey=${queryValue},noise,moreNoise`;
      const isAPICall = requestAnalyzer.isAPICall(info);
      expect(isAPICall).toBeFalsy();
    });

    it('should ignore an unrelated call', () => {
      const info = 'https://test-url.com/search?q=test';
      const isAPICall = requestAnalyzer.isAPICall(info);
      expect(isAPICall).toBeFalsy();
    });

    it('should gracefully handle an invalid url', () => {
      const info = 'h1234500233223';
      const isAPICall = requestAnalyzer.isAPICall(info);
      expect(isAPICall).toBeFalsy();
    });

    it('should ignore unrelated HTTP verbs', () => {
      const info: RequestInfo = `https://${host}${path.replace('{{blog}}', blogname)}?${queryKey}=${queryValue},noise`;
      const init = {
        method: 'POST'
      };
      const isAPICall = requestAnalyzer.isAPICall(info, init);
      expect(isAPICall).toBeFalsy();
    })
  });
})