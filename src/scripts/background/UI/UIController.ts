import { 
  Observer 
} from 'rxjs';
import { 
  PageStatus,
  Views,
  UIController,
  UIControllerStatics,
  UIPageActionService,
  UIContentScriptService,
  ContentScriptUpdateMessageContainer
} from '~/types';
import isOKStatus from '~/utils/isOKStatus';

const Controller: UIControllerStatics = class C implements UIController {
  constructor(
    private contentScriptService: UIContentScriptService, 
    private pageActionService: UIPageActionService
  ) {}

  private updateIconView = (tabId: number, status: PageStatus, isExcluded: boolean): void => {
    let newView = Views.UNSUPPORTED;
    if (isExcluded) {
      newView = Views.TURNED_OFF;
    } else if (isOKStatus(status)) {
      newView = Views.OK;
    }
    
    this.pageActionService.showView(tabId, newView);
  }
  
  public handleContentScriptUpdates = (): void => {
    const observer: Observer<ContentScriptUpdateMessageContainer> = {
      next: (messageContainer) => {
        const status = messageContainer.getStatus();
        const excluded = messageContainer.getExcluded();
        const tabId = messageContainer.getTabId();

        if (!tabId) return;

        this.updateIconView(tabId, status, excluded);
      },
      error: () => {},
      complete: () => {},
    };

    this.contentScriptService
      .listenForUpdates()
      .subscribe(observer);
  }

  public handleIconClicks = (): void => {
    const observer: Observer<number> = {
      next: (tabId: number) => {
        this.contentScriptService.sendIconClickedMessage(tabId, (messageContainer: ContentScriptUpdateMessageContainer) => {
          const status = messageContainer.getStatus();
          const excluded = messageContainer.getExcluded();
          const tabId = messageContainer.getTabId();
            
          if (!tabId) return;
          
          this.updateIconView(tabId, status, excluded);
        });
      },
      complete: () => {},
      error: () => {}
    }

    this.pageActionService
      .listenForIconClicks()
      .subscribe(observer);
  }
}

export default Controller;