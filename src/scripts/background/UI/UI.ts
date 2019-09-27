import { 
  UIController,
  ExtScriptStatics,
  ExtScript
} from '~/types';

const UIScript: ExtScriptStatics<UIController> = class UI implements ExtScript {
  constructor(
    private controller: UIController
  ) {}
  
  public run = () => {
    this.controller.handleContentScriptUpdates();
    this.controller.handleIconClicks();
  }
}

export default UIScript;