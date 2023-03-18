import APISnifferContentScriptService from './services/APISnifferContentScriptService';
import APISnifferModel from './APISnifferModel';
import APISnifferPostsExtractor from './APISnifferPostsExtractor';
import APISnifferSupportAnalyzer from './APISnifferSupportAnalyzer'
import APISnifferRequestAnalyzer from './APISnifferRequestAnalyzer';
import APISnifferFetchHijacker from './APISnifferFetchHijacker';
import APISnifferController from './APISnifferController';
import APISnifferScript from './APISniffer';

console.log('luis sanity log');

/* instantiate services */
const contentScriptService = new APISnifferContentScriptService();

/* instantiate model */
const model = new APISnifferModel();

const supportAnalyzer = new APISnifferSupportAnalyzer();
const fetchHijacker = new APISnifferFetchHijacker(APISnifferRequestAnalyzer, APISnifferPostsExtractor);
const controller = new APISnifferController(model, contentScriptService, fetchHijacker, supportAnalyzer);

const apiSnifferScript = new APISnifferScript(controller);
apiSnifferScript.run();