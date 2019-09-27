import {
  CSController,
  ExtScript,
  ExtScriptStatics
} from '~/types';

const CSScript: ExtScriptStatics<CSController> = class S implements ExtScript {
  constructor(private controller: CSController) {}
  
  public run = () => {
    this.controller.handleUIClick();
    this.controller.handleIncomingSnifferUpdates();
    this.controller.handleIncomingPosts();
    this.controller.injectAPISniffer();
  }
}

export default CSScript;