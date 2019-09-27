import CSAPISnifferService from './services/CSAPISnifferService';
import CSStorageService from './services/CSStorageService';
import CSPageActionService from './services/CSPageActionService';
import CSStylesGenerator from './CSStylesGenerator/index';
import CSView from './CSView';
import CSModel from './CSModel';
import CSController from './CSController';
import ContentScript from './CS';

const apiSnifferService = new CSAPISnifferService();
const storageService = new CSStorageService();
const pageActionService = new CSPageActionService();

const model = new CSModel();

const stylesGenerator = new CSStylesGenerator();
const view = new CSView(stylesGenerator);

const controller = new CSController(
  model, 
  apiSnifferService, 
  storageService, 
  pageActionService, 
  view
);

const script = new ContentScript(controller);
script.run();
