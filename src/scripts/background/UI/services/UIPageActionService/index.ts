import { 
  Observable 
} from 'rxjs';
import { 
  Views,
  UIPageActionService 
} from '~/types';
import Content, {
  Path
} from './content.json';

export default class PageActionService implements UIPageActionService {
  public listenForIconClicks = () => {
    return new Observable<number>((subscriber) => {
      chrome.pageAction.onClicked.addListener((tab: chrome.tabs.Tab) => {
        if (typeof tab.id !== 'number') return;  
        
        subscriber.next(tab.id);
      });
    });
  }

  public showView = (tabId: number, view?: Views): void => {
    let title: string;
    let path: Path;

    switch(view) {
      case Views.OK: {
        title = Content.views.ok.title;
        path = Content.views.ok.path;
        break;
      }

      case Views.TURNED_OFF: {
        title = Content.views.off.title;
        path = Content.views.off.path;
        break;
      }

      case Views.UNSUPPORTED:
      default: {
        title = Content.views.broken.title;
        path = Content.views.broken.path;
        break;
      }
    }

    chrome.pageAction.setIcon({
      tabId,
      path
    });
    chrome.pageAction.setTitle({
      tabId,
      title
    });
  }
}
