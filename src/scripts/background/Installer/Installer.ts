import { 
  ExtScript,
  ExtScriptStatics,
  InstallerController
} from '~/types';

const Installer: ExtScriptStatics<InstallerController> = class InstallerScript implements ExtScript {
  constructor(private controller: InstallerController) {}
  
  public run = () => {
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason !== 'install') return;

      this.controller.setupStorage();
      this.controller.attachPageActionRules();
    });
  }
} 

export default Installer;