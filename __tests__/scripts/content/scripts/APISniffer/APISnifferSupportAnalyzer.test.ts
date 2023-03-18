import {
  APISnifferSupportAnalyzer
} from '~/types';
import SupportAnalyzer from '~/scripts/content/scripts/APISniffer/APISnifferSupportAnalyzer';
import config from '~/config/index';

describe('SupportAnalyzer', () => {
  let supportAnalyzer: APISnifferSupportAnalyzer;

  /* general setup */
  beforeEach(() => {
    supportAnalyzer = new SupportAnalyzer();
  });

  describe('isWindowSupported()', () => {
    it('should indicate support when window contains all available APIs', () => {
      const isWindowSupported = supportAnalyzer.isWindowSupported();
      expect(isWindowSupported).toBeTruthy();
    });

    it('should indicate lack of support when fetch API unavailable', () => {
      // @ts-ignore-next-line
      window.fetch = undefined;
      const isWindowSupported = supportAnalyzer.isWindowSupported();
      expect(isWindowSupported).toBeFalsy();
    });
  });

  describe('isHealthyArchive()', () => {
    it('should indicate support when tumblr v2 state key present and non error-ed out', () => {
      // @ts-ignore
      window.tumblr = { isTumblr: true };
      const isHealthy = supportAnalyzer.isHealthyArchive();
      expect(isHealthy).toBeTruthy();
    });

    it('should indicate lack of support when tumblr v2 state key missing', () => {
      delete (window as { 
        [key: string]: any 
      }).tumblr;
      const isHealthy = supportAnalyzer.isHealthyArchive();
      expect(isHealthy).toBeFalsy();
    });
  });
});