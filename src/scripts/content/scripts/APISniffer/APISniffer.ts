import { 
  APISnifferController,
  ExtScript,
  ExtScriptStatics
} from '~/types';

const SnifferScript: ExtScriptStatics<APISnifferController> = class S implements ExtScript {
  constructor(private controller: APISnifferController) {}
  
  public run = () => {
    this.controller.analyzePage();
    this.controller.sendUpdateToContentScript();
    this.controller.hijackAjaxRequests();   
  }
};

export default SnifferScript;