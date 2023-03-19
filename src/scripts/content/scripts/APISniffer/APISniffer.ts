import { 
  APISnifferController,
  ExtScript,
  ExtScriptStatics
} from '~/types';

const SnifferScript: ExtScriptStatics<APISnifferController> = class S implements ExtScript {
  constructor(private controller: APISnifferController) {}
  
  public run = async () => {
    this.controller.obtainBlogName();
    this.controller.hijackAjaxRequests();  
    await this.controller.obtainPageStatus();
    this.controller.sendUpdateToContentScript();
  }
};

export default SnifferScript;