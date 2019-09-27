import UIContentScriptService from './services/UIContentScriptService';
import UIPageActionService from './services/UIPageActionService';
import UIController from './UIController';
import UIScript from './UI';

const contentScriptService = new UIContentScriptService();
const pageActionService = new UIPageActionService();

const controller = new UIController(contentScriptService, pageActionService);  

const script = new UIScript(controller);

script.run();